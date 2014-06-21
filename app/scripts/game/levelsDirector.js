define( [ 'hu','game/entities', 'petra'], function(hu, EL, petra){
  var opts;
  var MAX_STAGE;
  var CURRENT_STAGE;
  var CURRENT_GROUP;
  var CURRENT_ENEMY;
  var TIME;
  var BONUS_TIME;
  var BOSS_OUT;
  var levelStructure;
  var INFORMATION;
  var suscriptorsStageUp;
  var suscriptorsAddEnemy;
  var suscriptorsAddBoss;
  var suscriptorsAddBonus;
  var suscritorsMessages;
  var STARTING_DELAY;
  var TIME_SINCE_LAST_ENEMY_OUT;
  var TIME_SINCE_LAST_STAGE_OUT;
  var TIME_SINCE_LAST_GROUP_OUT;
  var ALLOW_ENEMY_OUT = false;
  var MAX_HEIGHT;
  var MAX_WIDTH;


  function init(opts, current, skipMessages,canvas, lvlStruct, levelName, delayBetweenEnemies){
    MAX_STAGE = lvlStruct.stages.length; 
    opts = opts;
    CURRENT_STAGE = current;
    levelStructure = lvlStruct;
    STARTING_DELAY = skipMessages ? 0 : 20;
    if( delayBetweenEnemies){
      levelStructure.time_between_enemies = delayBetweenEnemies;  
    }
    MAX_HEIGHT = canvas.height;
    MAX_WIDTH = canvas.width;

    CURRENT_GROUP = 0;
    CURRENT_ENEMY = 0;
    BOSS_OUT = false;
    suscriptorsStageUp = {};
    suscriptorsAddEnemy = {};
    suscriptorsAddBoss = {};
    suscriptorsAddBonus = {};
    suscritorsMessages = {};
    INFORMATION = {
      bonuses:{
        picked:0,
        total:0
      },
      boss_out: false,
      stages : [],
      level: levelName
    };
    TIME = 0;
    BONUS_TIME = 0;
    ALLOW_ENEMY_OUT = false;
    TIME_SINCE_LAST_ENEMY_OUT = 0;
    TIME_SINCE_LAST_GROUP_OUT = 0;
    TIME_SINCE_LAST_STAGE_OUT = 0;

    for(var i = 0; i< MAX_STAGE; i++){
      INFORMATION.stages.push({
        total: 0,
        killed: 0,
        completed: false
      });
    }
    if(!skipMessages){
      showInitialDialogs();
    }
  }

  function shouldAddBonus(){
    return BONUS_TIME > 15;
  }


  function getMaxStage(){
    return MAX_STAGE;
  }

  function getCurrentStage(){
    return CURRENT_STAGE;
  }


  function update(dt, realtimeDt){
    TIME +=realtimeDt;
    
    ALLOW_ENEMY_OUT = false;
    if(TIME >= STARTING_DELAY){
      BONUS_TIME += dt;
      TIME_SINCE_LAST_ENEMY_OUT+=dt;
      if(CURRENT_STAGE <= MAX_STAGE){
        if(allEnemiesFromStageAreOut(CURRENT_STAGE -1 )){
          TIME_SINCE_LAST_STAGE_OUT+=dt;
          if(TIME_SINCE_LAST_STAGE_OUT >= levelStructure.time_between_stages){
            changeStage();
          }
        }else if(allEnemiesFromGroupAreOut(CURRENT_STAGE-1, CURRENT_GROUP)){
          TIME_SINCE_LAST_GROUP_OUT+=dt;
          if(TIME_SINCE_LAST_GROUP_OUT >= levelStructure.time_between_groups){
            changeGroup();
          }
        }else{
          TIME_SINCE_LAST_ENEMY_OUT+=dt;
          if(TIME_SINCE_LAST_ENEMY_OUT >= levelStructure.time_between_enemies){
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
      var name;
      if(petra.flipCoin()){
        name = 'dogeBonus';
      }else{
        name = 'doubleShootBonus';
      }
      notify(suscriptorsAddBonus ,createBonus(null, name));
    }
  }

  function changeStage(){
    INFORMATION.stages[ CURRENT_STAGE -1 ].completed = true;
    CURRENT_STAGE++;
    CURRENT_GROUP = 0;
    CURRENT_ENEMY = 0;
    TIME_SINCE_LAST_STAGE_OUT = 0;
    notify(suscriptorsStageUp, CURRENT_STAGE);
  }


  function changeGroup(){
    CURRENT_GROUP++;
    CURRENT_ENEMY = 0;
    TIME_SINCE_LAST_GROUP_OUT = 0;
  }

  function getTotalsOfCurrentStage(stage){
    var totalsOfStage = 0;
    levelStructure.stages[stage].map(function(group){
      totalsOfStage +=group.length || 0;
    });
    return totalsOfStage;
  }
  function allEnemiesFromStageAreOut(stage){
    return(INFORMATION.stages[stage].total >= getTotalsOfCurrentStage(stage));
  }
  function allEnemiesFromGroupAreOut(stage, group){
    var currGroup = levelStructure.stages[stage][group];
    return(CURRENT_ENEMY >= currGroup.length);
  }
  function shouldAddEnemy(){
    if(CURRENT_STAGE <= MAX_STAGE && !BOSS_OUT){
      return ALLOW_ENEMY_OUT;
    }else{
      return false;
    }
  }

  function shouldAddBoss(){
    if(!shouldAddEnemy() && !BOSS_OUT && CURRENT_STAGE > MAX_STAGE){
      return true;
    }else{
      return false;
    }
  }
  //ENEMY
  function createEnemy(pos){
    enemyAdded();
    TIME_SINCE_LAST_ENEMY_OUT = 0;
    var enemyID = levelStructure.stages[CURRENT_STAGE-1][CURRENT_GROUP][CURRENT_ENEMY];
    CURRENT_ENEMY++;
    var enemy =  EL.getEnemy(pos,enemyID, levelStructure.setOfEntities);
    enemy.stage = CURRENT_STAGE;
    return enemy;
  }

  function enemyAdded(){
    INFORMATION.stages[CURRENT_STAGE - 1].total += 1;
  }

  function killedEnemy(enemy){
    if(enemy.stage <= MAX_STAGE){
      INFORMATION.stages[enemy.stage - 1].killed += 1;  
    }
    if((enemy.dropProbabilities * 100) >= petra.random(0,100)){
      notify(suscriptorsAddBonus ,createBonus(enemy.pos, enemy.dropItem, true));
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
  function createBonus(pos, name, dropped){
    var bonus;
    pos = pos || [MAX_WIDTH,  Math.random() * (MAX_HEIGHT - 39)];;
    bonus = EL.getBonus(name, {pos:pos});
    if(!dropped){
      bonusAdded(bonus);  
    }
    return bonus;
  }
  function bonusAdded(bonus){
    if(bonus.name  == 'dogeBonus'){
      dogeBonusAdded();
    }
    BONUS_TIME = 0;
  }
  function dogeBonusAdded(){
    INFORMATION.bonuses.total += 1;
  }
  function pickedDogeBonus(){
    INFORMATION.bonuses.picked += 1;
  }
  function suscribeStageUp(fn, name){
    suscribe(fn, name,suscriptorsStageUp);
  }
  function suscribeAddEnemy(fn, name){
    suscribe(fn, name,suscriptorsAddEnemy);
  }
  function suscribeAddBonus(fn, name){
    suscribe(fn, name,suscriptorsAddBonus);
  }
  function suscribeAddBoss(fn, name){
    suscribe(fn, name,suscriptorsAddBoss);
  }
  function suscribeMessages(fn, name){
    suscribe(fn, name,suscritorsMessages);
  }

  function suscribe(fn, name, map){
    map[name] = fn;
  }
  function notify(map, params){
    for(var obj in map){
      map[obj](params);
    }
  }

  function isFinalStage(){
    return BOSS_OUT;
  }

  function getLevelsInfo(){
    return INFORMATION;
  }

  function showInitialDialogs(){
    //TODO: Move this inside every level Declaration, and calculate the initial delay of the level by the amount of messages,
    var messages = [];
    messages.push( new models.Message('ENEMY! The end of this quest is near', opts.main_character_name,3000))
    messages.push( new models.Message('ha ha ha, of course, you have travelled so far ... to die', opts.main_enemy_name,3000))
    messages.push( new models.Message('...', opts.main_character_name,700))
    messages.push( new models.Message('I\'m not afraid of what you have got for me', opts.main_character_name,2000))
    messages.push( new models.Message( 'Oh yeah? Just meet me if you are ready, after ending you I will destroy your universe', opts.main_enemy_name,3000))
    messages.push( new models.Message( 'I\'m doing this for me, and I\'m made from the universe. I\'m two times strong' , opts.main_character_name,3000))
    messages.push( new models.Message('You are a piece of nothing', opts.main_enemy_name,2000))
    messages.push( new models.Message( 'Lets demonstrate him that we are something... and remember to write a good end to this story.', opts.main_character_name,3000))
    notify(suscritorsMessages, {
       messages: messages,
       timeout: 0,
       type: 'full'
    });
  }

  var LEVELS_DIRECTOR = {
      init: init,
      getMaxStage: getMaxStage,
      getCurrentStage: getCurrentStage,
      update: update,
      suscribeAddEnemy: suscribeAddEnemy,
      suscribeAddBoss: suscribeAddBoss,
      suscribeAddBonus: suscribeAddBonus,
      suscribeMessages: suscribeMessages,
      createEnemy:createEnemy,
      killedEnemy: killedEnemy,
      createBoss: createBoss,
      createBonus: createBonus,
      pickedDogeBonus: pickedDogeBonus,
      suscribeStageUp: suscribeStageUp,
      isFinalStage: isFinalStage,
      getLevelsInfo: getLevelsInfo
  }

  return  LEVELS_DIRECTOR;

});