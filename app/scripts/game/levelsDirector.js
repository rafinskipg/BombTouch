define( [ 'hu','game/entities'], function(hu, EL){
  var MAX_LEVEL;
  var CURRENT_LEVEL;
  var TIME;
  var BONUS_TIME;
  var BOSS_OUT;
  var INFORMATION;
  var SUSCRIPTIONS;


  function init(max, current){
    MAX_LEVEL = max; 
    CURRENT_LEVEL = current;
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


  function update(dt){
    TIME +=dt;
    BONUS_TIME += dt;

    if(TIME > 30 && CURRENT_LEVEL === 1
      || TIME > 60 && CURRENT_LEVEL === 2
      || TIME > 90 && CURRENT_LEVEL === 3
      || TIME > 120 && CURRENT_LEVEL === 4
      || TIME > 160 && CURRENT_LEVEL === 5){
      changeLevel();
    }
  }

  function shouldAddEnemy(){
    if(CURRENT_LEVEL <= MAX_LEVEL && !BOSS_OUT){
      var value = Math.random() < 1 - Math.pow(.999, TIME);
      if(value) {
        return true;
      }else{
        return false;
      }
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
    return EL.getEnemy(pos,CURRENT_LEVEL);
  }

  function enemyAdded(){
    INFORMATION.levels[CURRENT_LEVEL - 1].total += 1;
  }

  function killedEnemy(){
    if(CURRENT_LEVEL <=MAX_LEVEL){
      INFORMATION.levels[CURRENT_LEVEL - 1].killed += 1;
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

  function changeLevel(){
    INFORMATION.levels[ CURRENT_LEVEL -1 ].completed = true;
    CURRENT_LEVEL++;
    notifyLevelUp();
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