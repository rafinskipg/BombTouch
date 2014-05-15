define( [ 'hu','game/entities'], function(hu, EL){
  var MAX_LEVEL;
  var CURRENT_LEVEL;
  var CURRENT_GROUP;
  var CURRENT_ENEMY;
  var TIME;
  var BONUS_TIME;
  var BOSS_OUT;
  var INFORMATION;
  var SUSCRIPTIONS;
  var STARTING_DELAY;
  var TIME_SINCE_LAST_ENEMY_OUT;
  var TIME_SINCE_LAST_LEVEL_OUT;
  var TIME_SINCE_LAST_GROUP_OUT;
  var ALLOW_ENEMY_OUT = false;
  var levelsStructure = {
    time_between_groups: 6,
    time_between_enemies:3,
    time_between_levels: 10,
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

  function init(max, current, delay){
    MAX_LEVEL = max; 
    CURRENT_LEVEL = current;
    STARTING_DELAY = delay;
    CURRENT_GROUP = 0;
    CURRENT_ENEMY = 0;
    BOSS_OUT = false;
    SUSCRIPTIONS = [];
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
  }

  function changeLevel(){
    console.log('Changing level');
    INFORMATION.levels[ CURRENT_LEVEL -1 ].completed = true;
    CURRENT_LEVEL++;
    CURRENT_GROUP = 0;
    CURRENT_ENEMY = 0;
    TIME_SINCE_LAST_LEVEL_OUT = 0;
    notifyLevelUp();
  }


  function changeGroup(){
    console.log('Changing group');
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
      /*var value = Math.random() < 1 - Math.pow(.999, TIME);
      if(value) {
        return true;
      }else{
        return false;
      }*/
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
    bonusAdded();
    return EL.getEntity('bonus',pos);
  }
  function bonusAdded(){
    BONUS_TIME = 0;
    INFORMATION.bonuses.total += 1;
  }
  function pickedBonus(){
    INFORMATION.bonuses.picked += 1;
  }
  function suscribeLevelUp(fn){
    SUSCRIPTIONS.push(fn);
  }

  function notifyLevelUp(){
    for(var i = 0; i<SUSCRIPTIONS.length; i++){
      SUSCRIPTIONS[i](CURRENT_LEVEL);
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
      shouldAddEnemy: shouldAddEnemy,
      shouldAddBoss: shouldAddBoss,
      shouldAddBonus: shouldAddBonus,
      createEnemy:createEnemy,
      killedEnemy: killedEnemy,
      createBoss: createBoss,
      createBonus: createBonus,
      pickedBonus: pickedBonus,
      suscribeLevelUp: suscribeLevelUp,
      isFinalStage: isFinalStage,
      getLevelsInfo: getLevelsInfo
  }

  return  LEVELS_DIRECTOR;

});