define( [ 'hu','game/entities', 'petra'], function(hu, EL, petra){
  var MAX_LEVEL;
  var CURRENT_LEVEL;
  var CURRENT_GROUP;
  var CURRENT_ENEMY;
  var TIME;
  var BONUS_TIME;
  var BOSS_OUT;
  var INFORMATION;
  var suscriptorsLevelUp;
  var STARTING_DELAY;
  var TIME_SINCE_LAST_ENEMY_OUT;
  var TIME_SINCE_LAST_LEVEL_OUT;
  var TIME_SINCE_LAST_GROUP_OUT;
  var ALLOW_ENEMY_OUT = false;
  var levelsStructure = {
    time_between_groups: 5,
    time_between_enemies:1,
    time_between_levels: 5,
    levels : [
      [
      [1],[1,1],[1,1,1],[1,1,1,1,1,1],[2]
      ],
      [
      [2],[2,1,2],[2,1,2,2],[2,2,2,2,3,3],[3,3,3]
      ],
      [
      [3,2],[3,3,2],[3,2,3,3],[4,4,5,4]
      ],
      [
      [4],[4,4],[4,3,4],[4,3,4,3,4,4,5,5], [4,5,5,5]
      ],
      [
      [5],[5,5],[5,5,4],[5,4,3,5,4,5,4,5]
      ]
    ]
  }

  function init(max, current, delay, delayBetweenEnemies){
    MAX_LEVEL = max; 
    CURRENT_LEVEL = current;
    STARTING_DELAY = delay;
    if( delayBetweenEnemies){
      console.log(delayBetweenEnemies)
      levelsStructure.time_between_enemies = delayBetweenEnemies;  
    }
    
    CURRENT_GROUP = 0;
    CURRENT_ENEMY = 0;
    BOSS_OUT = false;
    suscriptorsLevelUp = [];
    suscriptorsAddEnemy = [];
    suscriptorsAddBoss = [];
    suscriptorsAddBonus = [];
    INFORMATION = {
      bonuses:{
        picked:0,
        total:0
      },
      boss_out: false,
      levels : []
    };
    TIME = 0;
    BONUS_TIME = 0;
    ALLOW_ENEMY_OUT = false;
    TIME_SINCE_LAST_ENEMY_OUT = 0;
    TIME_SINCE_LAST_GROUP_OUT = 0;
    TIME_SINCE_LAST_LEVEL_OUT = 0;

    for(var i = 0; i< max; i++){
      INFORMATION.levels.push({
        total: 0,
        killed: 0,
        completed: false
      });
    }
  }

  function shouldAddBonus(){
    return BONUS_TIME > 15;
  }


  function getMaxLevel(){
    return MAX_LEVEL;
  }

  function getCurrentLevel(){
    return CURRENT_LEVEL;
  }


  function update(dt, realtimeDt){
    TIME +=realtimeDt;
    
    ALLOW_ENEMY_OUT = false;
    if(TIME >= STARTING_DELAY){
      BONUS_TIME += dt;
      TIME_SINCE_LAST_ENEMY_OUT+=dt;
      if(CURRENT_LEVEL <= MAX_LEVEL){
        if(allEnemiesFromLevelAreOut(CURRENT_LEVEL -1 )){
          TIME_SINCE_LAST_LEVEL_OUT+=dt;
          if(TIME_SINCE_LAST_LEVEL_OUT >= levelsStructure.time_between_levels){
            changeLevel();
          }
        }else if(allEnemiesFromGroupAreOut(CURRENT_LEVEL-1, CURRENT_GROUP)){
          TIME_SINCE_LAST_GROUP_OUT+=dt;
          if(TIME_SINCE_LAST_GROUP_OUT >= levelsStructure.time_between_groups){
            changeGroup();
          }
        }else{
          TIME_SINCE_LAST_ENEMY_OUT+=dt;
          if(TIME_SINCE_LAST_ENEMY_OUT >= levelsStructure.time_between_enemies){
            ALLOW_ENEMY_OUT = true;
          }
        }
      }
    }

    if(shouldAddEnemy()){
      notify(suscriptorsAddEnemy,createEnemy.bind(this));
    }
    if(shouldAddBoss()){
      notify(suscriptorsAddBoss ,createBoss.bind(this));
    }

    if(shouldAddBonus()){
      notify(suscriptorsAddBonus ,createBonus.bind(this));
    }
  }

  function changeLevel(){
    INFORMATION.levels[ CURRENT_LEVEL -1 ].completed = true;
    CURRENT_LEVEL++;
    CURRENT_GROUP = 0;
    CURRENT_ENEMY = 0;
    TIME_SINCE_LAST_LEVEL_OUT = 0;
    notify(suscriptorsLevelUp, CURRENT_LEVEL);
  }


  function changeGroup(){
    CURRENT_GROUP++;
    CURRENT_ENEMY = 0;
    TIME_SINCE_LAST_GROUP_OUT = 0;
  }

  function getTotalsOfCurrentLevel(lvl){
    var totalsOfLevel = 0;
    levelsStructure.levels[lvl].map(function(group){
      totalsOfLevel +=group.length || 0;
    });
    return totalsOfLevel;
  }
  function allEnemiesFromLevelAreOut(lvl){
    return(INFORMATION.levels[lvl].total >= getTotalsOfCurrentLevel(lvl));
  }
  function allEnemiesFromGroupAreOut(lvl, group){
    var currGroup = levelsStructure.levels[lvl][group];
    return(CURRENT_ENEMY >= currGroup.length);
  }
  function shouldAddEnemy(){
    if(CURRENT_LEVEL <= MAX_LEVEL && !BOSS_OUT){
      return ALLOW_ENEMY_OUT;
    }else{
      return false;
    }
  }

  function shouldAddBoss(){
    if(!shouldAddEnemy() && !BOSS_OUT && CURRENT_LEVEL > MAX_LEVEL){
      return true;
    }else{
      return false;
    }
  }
  //ENEMY
  function createEnemy(pos){
    enemyAdded();
    TIME_SINCE_LAST_ENEMY_OUT = 0;
    var enemyID = levelsStructure.levels[CURRENT_LEVEL-1][CURRENT_GROUP][CURRENT_ENEMY];
    CURRENT_ENEMY++;
    var enemy =  EL.getEnemy(pos,enemyID);
    //var enemy =  EL.getSpaceInvader(pos,enemyID);
    enemy.level = CURRENT_LEVEL;
    return enemy;
  }

  function enemyAdded(){
    INFORMATION.levels[CURRENT_LEVEL - 1].total += 1;
  }

  function killedEnemy(enemy){
    if(enemy.level <= MAX_LEVEL){
      INFORMATION.levels[enemy.level - 1].killed += 1;  
    }
  }
  //BOSS
  function createBoss(pos){
    bossAdded();
    return EL.getBoss(pos);
  }
  function bossAdded(){
    BOSS_OUT = true;
  }
  //BONUS
  function createBonus(pos){
    var bonus;
    if(petra.flipCoin()){
      bonus = EL.getEntity('dogeBonus',{pos:pos})
      dogeBonusAdded();
    }else{
      bonus = EL.getEntity('doubleShootBonus', {pos:pos});
    }

    bonusAdded();

    return bonus;
  }
  function bonusAdded(){
    BONUS_TIME = 0;
  }
  function dogeBonusAdded(){
    INFORMATION.bonuses.total += 1;
  }
  function pickedDogeBonus(){
    INFORMATION.bonuses.picked += 1;
  }
  function suscribeLevelUp(fn){
    suscriptorsLevelUp.push(fn);
  }
  function suscribeAddEnemy(fn){
    suscriptorsAddEnemy.push(fn);
  }
  function suscribeAddBonus(fn){
    suscriptorsAddBonus.push(fn);
  }
  function suscribeAddBoss(fn){
    suscriptorsAddBoss.push(fn);
  }

  function notify(arr,data){
    if(arr && arr.length > 0){
      for(var i = 0; i<arr.length; i++){
       arr[i](data);
      }  
    }
  }

  function isFinalStage(){
    return BOSS_OUT;
  }

  function getLevelsInfo(){
    return INFORMATION;
  }
  var LEVELS_DIRECTOR = {
      init: init,
      getMaxLevel: getMaxLevel,
      getCurrentLevel: getCurrentLevel,
      update: update,
      suscribeAddEnemy: suscribeAddEnemy,
      suscribeAddBoss: suscribeAddBoss,
      suscribeAddBonus: suscribeAddBonus,
      createEnemy:createEnemy,
      killedEnemy: killedEnemy,
      createBoss: createBoss,
      createBonus: createBonus,
      pickedDogeBonus: pickedDogeBonus,
      suscribeLevelUp: suscribeLevelUp,
      isFinalStage: isFinalStage,
      getLevelsInfo: getLevelsInfo
  }

  return  LEVELS_DIRECTOR;

});