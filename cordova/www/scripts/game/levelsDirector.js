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
  var suscriptorsAmbient;
  var suscritorsMessages;
  var STARTING_DELAY;
  var TIME_SINCE_LAST_ENEMY_OUT;
  var TIME_SINCE_LAST_STAGE_OUT;
  var TIME_SINCE_LAST_GROUP_OUT;
  var TIME_SINCE_LAST_AMBIENCE_OUT;
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
    suscriptorsAmbient = {};
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
    TIME_SINCE_LAST_AMBIENCE_OUT = 0;

    for(var i = 0; i< MAX_STAGE; i++){
      INFORMATION.stages.push({
        total: 0,
        killed: 0,
        left: 0,
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
      TIME_SINCE_LAST_AMBIENCE_OUT +=dt;

      if(CURRENT_STAGE <= MAX_STAGE){
        if(allEnemiesFromStageAreOut(CURRENT_STAGE -1 ) ){
          TIME_SINCE_LAST_STAGE_OUT+=dt;
          if(TIME_SINCE_LAST_STAGE_OUT >= levelStructure.time_between_stages && allEnemiesFromStageAreLeftScreen(CURRENT_STAGE-1)){
            console.log('change stage')
            changeStage();
          }
        }else if(allEnemiesFromGroupAreOut(CURRENT_STAGE-1, CURRENT_GROUP) ){
          TIME_SINCE_LAST_GROUP_OUT+=dt;
          if(TIME_SINCE_LAST_GROUP_OUT >= getTimeoutBetweenGroups(CURRENT_STAGE-1) && allEnemiesFromStageAreLeftScreen(CURRENT_STAGE-1)){
            changeGroup();
          }
        }else {
          TIME_SINCE_LAST_ENEMY_OUT+=dt;
          if(TIME_SINCE_LAST_ENEMY_OUT >= getTimeoutBetweenEntities(CURRENT_STAGE - 1)){
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

    if(shouldAddAmbientEntity()){
      notify(suscriptorsAmbient, createAmbientEntity());
    }

    if(shouldAddBonus()){
      var names = ['dogeBonus', 'doubleShootBonus', 'shotGunBonus', 'rapidShotBonus'];
      notify(suscriptorsAddBonus ,createBonus(null, petra.getRandomElementFromArray(names)));
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
    levelStructure.stages[stage].groups.map(function(group){
      totalsOfStage +=group.length || 0;
    });
    return totalsOfStage;
  }

  function getTimeoutBetweenEntities(stage){
    var timeout = levelStructure.stages[stage].time_between_enemies ? levelStructure.stages[stage].time_between_enemies :   levelStructure.time_between_enemies;
    var positioningMethod  = getCurrentPositioningMethod(stage);
    if(positioningMethod == 'vshape'){
      if(CURRENT_ENEMY % 2 == 0){
        timeout = 0;
      }
    }
    return timeout;
  }

  function getTimeoutBetweenGroups(stage){
    var timeout = levelStructure.stages[stage].time_between_groups ? levelStructure.stages[stage].time_between_groups :   levelStructure.time_between_groups;
    return timeout;
  }

  function allEnemiesFromStageAreOut(stage){
    return(INFORMATION.stages[stage].total >= getTotalsOfCurrentStage(stage));
  }

  function allEnemiesFromStageAreLeftScreen(stage){
    return (INFORMATION.stages[stage].left + INFORMATION.stages[stage].killed) == INFORMATION.stages[stage].total;
  }

  function allEnemiesFromGroupAreOut(stage, group){
    console.log(stage, group)
    var currGroup = levelStructure.stages[stage].groups[group];
    var enemiesInCurrentGroup =  currGroup.length;

    return(CURRENT_ENEMY >= enemiesInCurrentGroup);
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

  function shouldAddAmbientEntity(){
    if(TIME_SINCE_LAST_AMBIENCE_OUT >= 1){
      TIME_SINCE_LAST_AMBIENCE_OUT = 0;
      var number = petra.random(1,3);
      return (number == 3);
    }
  }

  function getCurrentPositioningMethod(stage){
    return levelStructure.stages[stage].positioningMethod ? levelStructure.stages[stage].positioningMethod : 'random';
  }

  function calculatePositionByMethod(method, width, height){
    var pos;
    if(method == 'random'){
      pos = [width, Math.random() * (height - 39)]
    }else if(method == 'vshape'){
      if(CURRENT_ENEMY %2 == 0){
        pos = [width, height /2 + 40 * CURRENT_ENEMY]
      }else{
        pos = [width, height /2 - 80 * CURRENT_ENEMY]
      }
    }
    return pos;
  }
  //ENEMY
  function createEnemy(screenWidth, screenHeight){

    var positioningMethod = getCurrentPositioningMethod(CURRENT_STAGE -1 );
    var pos = calculatePositionByMethod(positioningMethod, screenWidth, screenHeight);

    enemyAdded();
    TIME_SINCE_LAST_ENEMY_OUT = 0;
    var enemyID = levelStructure.stages[CURRENT_STAGE-1].groups[CURRENT_GROUP][CURRENT_ENEMY];
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
    if(petra.passProbabilities(enemy.dropProbabilities)){
      notify(suscriptorsAddBonus ,createBonus(enemy.pos, enemy.dropItem, true));
    }
  }
  //TODO, create a event suscription model.
  function enemyLeft(enemy){
    if(enemy.stage <= MAX_STAGE){
      INFORMATION.stages[enemy.stage - 1].left += 1;  
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
    pos = pos || [MAX_WIDTH,  Math.random() * (MAX_HEIGHT - 39)];
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

  //Ambient
  function createAmbientEntity(){
    var entity_name = petra.getRandomElementFromArray(levelStructure.ambient_entities);
    if(entity_name){
      var entity = EL.getBackgroundEntity(entity_name, {pos: [MAX_WIDTH,  Math.random() * (MAX_HEIGHT - 39)]});  
    }
    return entity;
  }

  //Suscriptions

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
  function suscribeAmbientEntities(fn,name){
    suscribe(fn, name , suscriptorsAmbient);
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

  function getParallaxLayers(){
    return levelStructure.parallax ? levelStructure.parallax : [];
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
      suscribeAmbientEntities : suscribeAmbientEntities,
      createEnemy:createEnemy,
      killedEnemy: killedEnemy,
      createBoss: createBoss,
      createBonus: createBonus,
      pickedDogeBonus: pickedDogeBonus,
      suscribeStageUp: suscribeStageUp,
      isFinalStage: isFinalStage,
      getLevelsInfo: getLevelsInfo,
      getParallaxLayers: getParallaxLayers,
      enemyLeft: enemyLeft
  }

  return  LEVELS_DIRECTOR;

});