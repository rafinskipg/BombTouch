define( [ 'angular', 'app','game/models/models', 'hu','game/entities','game/scenario','petra', 'levelsDirector', 'game/models/weapons','resources','sprite','input','raf', 'quad_tree'], function(angular, BombTouchApp, models, hu, EL, Scenario, petra, LEVELS_DIRECTOR, Weapons){

return BombTouchApp.
    factory('brainSrv', ['audioSrv','settingsSrv', function(audioSrv, settingsSrv) {
  
  var CURRENT_STAGE, QUAD;

  /****************************
  ****************************
    GAME Variables
  ****************************
  ****************************/
  function getDefaultState(){
    var options =  {
      iteration: 1,
      win: false,
      died: false,
      points : 0,
      power: 0,
      max_power :1000,
      game_over: false,
      paused: false,
      post_game_completed : false,
      background_speed: 50,
      gemsPicked: 0
    };
    return options;
  }

  var STATE = getDefaultState();

  function getDefaultTimers(){
    return {
      lastFire :0,
      gameTime: 0,
      shootSpriteTime: 0
    };
  }

  var TIMERS = getDefaultTimers();

  var bullets,
    enemies,
    explosions,
    miscelanea_front,
    miscelanea_back,
    specials,
    bonuses,
    bonusWeapons,
    bosses,
    enemyBullets,
    neutralBullets,
    graves,
    pointsToRender,
    inGameDialogs,
    player;

  function setDefaultStateForEntities(){
    bullets = [];
    enemies = [];
    explosions = [];
    miscelanea_front = [];
    miscelanea_back =  [];
    specials = [];
    bonuses = [];
    bonusWeapons = [];
    bosses = [];
    pointsToRender = [];
    inGameDialogs = [];
    enemyBullets = [];
    neutralBullets =[];
    graves = [];
    player = {};
  }

  var canvas, power = 0;
  var SCENARIO;
  var terrainPattern;

  //Suscribe to events of the game
  var notifyGameEnd = [];
  var notifyPoints = [];
  var notifyMessages = [];
  var notifyPower = [];
  var notifyMaxPower = [];

  //Touch inputs
  var touchInputs;

  var SOUNDS;

  function preloadSounds(){
    SOUNDS = {
      shoot: new Howl({
        urls: ['sounds/laser5.wav'],
        volume: 0.05
      }),
      yeah: new Howl({
        urls: ['sounds/oh_yeah_wav_cut.wav']
      }),
      levelup: new Howl({
        urls: ['sounds/upmid.wav']
      }),
      killer: new Howl({
        urls: ['sounds/killer.mp3'],
        volume: 0.2
      }),
      grunt: new Howl({
        urls: ['sounds/grunt.mp3'],
        volume: 0.2
      }),
      power: new Howl({
        urls: ['sounds/power.mp3'],
        volume: 0.2
      }),
      explosions: [
        new Howl({
            urls: ['sounds/explosions/atari_boom2.wav'],
            volume: 0.6
        }),
        new Howl({
            urls: ['sounds/explosions/explodemini.wav'],
            volume: 0.3
        }),
        new Howl({
            urls: ['sounds/explosions/explode.wav'],
            volume: 0.3
        })

      ]
    };
  }

  var MESSAGES = {
    killer: 'I am your killer...!',
    power: 'BEHOLD MY POWER!',
    grunt: 'graARRRLL!!!',
    wow: 'WOW! Such bonus...  Very power, much shoot',
    saiyan : 'Yaaaaaaay! Super saiyan!',
    nosaiyan: 'Tss... my power',
    init: "It's time, for other adventure, for other trip to the unknown...",
    not: 'Your trip will know a deadly end... B**CH',
    tst: 'Tstsk... You will have to pass over my rainbow',
    ouch: 'Ouch @#¡%%!! :(',
    levelUp: 'Leeevel up! :D',
    space: {
      moving: 'We are moving through space at the rate of 530km a second',
      moon: 'Moons are like little planets, without the enough mass to hold an atmosphere',
      sunlight: 'The sunlight we see today was created 30,000 years ago, in the core of the sun.',
      sunmass: 'The Sun loses up to a billion kilograms a second due to solar winds'
    },
    personal: {
      stories: ['Somebody told me once that we are made of stories...',
        'All my life I believed somehow that i was going to find peace',
        'and peace found me suddenly, when I was just living my life.',
        'Now a dark entity has come to break the walls of peace and serenity',
        'to you, who shall not pass, i say "If you want war, you will find defeat"',
        'Aeons have passed since I left my world in order to finish this war',
        'And today, i\'m close to my victory',
        'let your story end']
    }
  };
  
  var names = {
    main_character_name :'cooldog',
    main_enemy_name :'boss_1',
    main_character_super_damaged :'cooldogdamaged',
    main_character_damaged :'cooldogdamaged',
    main_character_super_name :'cooldog',
    bonus_image_name :'dog'
  }

  /****************************
  ****************************
    GAME Initialization
  ****************************
  ****************************/
  var rafID ;
  
  var main = function() {
    SCENARIO.update = function(dt,realtimeDt){
      if(!isGameOver() && !isPaused()){
        update(dt,realtimeDt);
      }
    }
  };

  var postGame = function(){
    SCENARIO.update = function(dt){
      if(!STATE.post_game_completed){
        updateGraves(dt);
        updateExplosions(dt);
      }
    }
  };

  function start(LEVEL_STRUCTURE) {
    preloadSounds();
    //TODO , here send levels director the stage 0, at "continue game" send the current Stag, increment the current stag

    //LEVELS_DIRECTOR.init(5,1,20);
    canvas = document.getElementById("canvas");
    reset();
    toMouseListeners();
    LEVELS_DIRECTOR.init(names,5,true,canvas,LEVEL_STRUCTURE);
    suscribeToEvents();
    main();
  };

  function restart(){
    reset();
    main();
  }

  function toMouseListeners(){
    console.log(canvas.width, window.innerWidth);
    var variation = canvas.width / window.innerWidth;
    canvas.addEventListener('touchmove', function(ev){
      var x = ev.targetTouches[0].pageX - canvas.offsetLeft;
      var y = ev.targetTouches[0].pageY - canvas.offsetTop;
      x*=variation;
      y*=variation;

      touchInputs = {
        pos: {
          x : x ,
          y : y - player.getHeight()/2
        }
      }

      shoot();
      ev.preventDefault();
    });
    canvas.addEventListener('touchstart', function(ev){
      var x = ev.targetTouches[0].pageX - canvas.offsetLeft;
      var y = ev.targetTouches[0].pageY - canvas.offsetTop;
      x*=variation;
      y*=variation;

      touchInputs = {
        pos: {
          x : x ,
          y : y - player.getHeight()/2
        }
      }
       
    });

    canvas.addEventListener('touchend', function(){
      touchInputs = null;
    })
    
    var options = {
      dragLockToAxis: true,
      dragBlockHorizontal: true
    };

    var hammertime = new Hammer(canvas, options);

    hammertime.on("swipe", function(ev){ 
      ev.gesture.preventDefault();
      console.log(ev);
      //megaShoot(ev.gesture.deltaX, ev.gesture.deltaY);
      
      var signX = ev.gesture.deltaX > 0 ? 1 :  -1;
      var signY = ev.gesture.deltaY > 0 ? 1 :  -1;
    });

  }

  function dragListeners(){
    canvas = document.getElementById("canvas");
    var options = {
      dragLockToAxis: true,
      dragBlockHorizontal: true
    };
    var hammertime = new Hammer(canvas, options);
    hammertime.on("drag swipe", function(ev){ 
      ev.gesture.preventDefault();

      var signX = ev.gesture.deltaX > 0 ? 1 :  -1;
      var signY = ev.gesture.deltaY > 0 ? 1 :  -1;
        touchInputs = {
          vel: {
            x : signX * ev.gesture.velocityX * 2,
            y : signY * ev.gesture.velocityY * 2
          }
        }
      shoot();
      
    });
    hammertime.on('tap hold', function(ev){
      ev.gesture.preventDefault();
      shoot();
    });
    hammertime.on('dragend swipeend', function(ev){
      ev.gesture.preventDefault();
      touchInputs = null;
    });
  }

  function orientationListeners(){
    //TODO: this is being added many times
    window.addEventListener('deviceorientation',function(e){
      if(e.gamma &&  e.gamma > 10){
        input.addKey('d');
        input.removeKey('a');
      }else if(e.gamma &&  e.gamma < -10){
        input.addKey('a');
        input.removeKey('d');
      }else{
        input.removeKey('a');
        input.removeKey('d');
      }    
      if(e.beta &&  e.beta > 10){
        input.addKey('s');
        input.removeKey('w');
      }else if(e.beta &&  e.beta < -10){
        input.addKey('w');
        input.removeKey('s');
      }else{
        input.removeKey('s');
        input.removeKey('w');
      }
      
    });
  }

  function reset() {
    STATE = getDefaultState();
    STATE.game_speed = settingsSrv.getDifficulty();
    SCENARIO = new Scenario("canvas", endGame, STATE.game_speed, STATE.background_speed);
    SCENARIO.setRenderEntities(getEntitiesToRender, getTextEntitiesToRender);
    SCENARIO.init();
    setDefaultStateForEntities();
    player = EL.getEntity(names.main_character_name,{pos: [50, canvas.height / 2]});
    player.weapon = new Weapons.ShotGun();

    player.bonuses = {};
    TIMERS = getDefaultTimers();

    var bounds = {
      x:0,
      y:0,
      width:canvas.width,
      height:canvas.height
    }
    QUAD = new QuadTree(bounds);
  };

  function suscribeToEvents(){     
    LEVELS_DIRECTOR.suscribeAddEnemy(function(createFunction){
      enemies.push(createFunction(canvas.width, canvas.height));
    }, 'brainSrv');

    LEVELS_DIRECTOR.suscribeAddBoss(function(createFunction){
      bosses.push(createFunction([canvas.width, canvas.height/2]));
      STATE.background_speed = 1.6;
    }, 'brainSrv');

    LEVELS_DIRECTOR.suscribeAddBonus(function(bonus){
      if(bonus.name == 'dogeBonus'){
        bonus.obtain = dogeBonusObtain;  
      }else if(bonus.name == 'doubleShootBonus'){
        bonus.obtain = doubleWeaponBonusObtain;
      }else if(bonus.name == 'shotGunBonus'){
        bonus.obtain = shotGunBonusObtain;
      }else if(bonus.name == 'rapidShotBonus'){
        bonus.obtain = rapidShotBonusObtain;
      } else if(bonus.name == 'greenGem'){
        bonus.obtain = greenGemBonusObtain;
      }
      bonuses.push(bonus);
    }, 'brainSrv');

    /*LEVELS_DIRECTOR.suscribeAmbientEntities(function(entity){
      if(entity){
        miscelanea_back.push(entity);  
      }
    }, 'brainSrv');*/

    LEVELS_DIRECTOR.suscribeMessages(function(opts){
      showMessages(opts.messages, opts.timeout, opts.type);
    }, 'brainSrv');

    LEVELS_DIRECTOR.suscribeStageUp(function(stage){
      CURRENT_STAGE = stage;
      SOUNDS['levelup'].play();
    }, 'brainSrv')

    SCENARIO.setParallaxLayers(LEVELS_DIRECTOR.getParallaxLayers());
  }

  /****************************
  ****************************
    GAME State modifiers
  ****************************
  ****************************/
  
  function endGame() {
    STATE.game_over = true;
    graves.push(EL.getEntity('grave', {pos: player.pos}));
    addExplosion(player.pos);
    if(!STATE.win){
      postGame();  
    }else{
      endPostGame();
    }
  }

  function endPostGame(){
    STATE.post_game_completed = true;
    STATE.levelsInfo = LEVELS_DIRECTOR.getLevelsInfo();
    for(var i = 0; i<notifyGameEnd.length; i++){
      notifyGameEnd[i](STATE, TIMERS);
    }
  }

  function isGameOver(){
      return STATE.game_over;
  }

  function pause(){
    STATE.paused = true;
    SCENARIO.pause();
    audioSrv.pauseSong();
  }

  function isPaused(){
    return STATE.paused;
  }
  
  function resume(){
    STATE.paused = false;
    SCENARIO.pause();
    main();
  }

  function playSound(sound){
    if(!isPaused() && settingsSrv.getSound() == true){
      audioSrv.playSound(sound);
    }
  }

  function pauseAmbientSound(){
    SOUNDS.ambient.pause();
  }

  function stopAmbientSound(){
    SOUNDS.ambient.stop();
  }

  function createDialog(message, entity){
    inGameDialogs.push(new models.Dialog(message, entity));
  }

  function shoot(){
    if(!isGameOver() &&
      TIMERS.gameTime - TIMERS.lastFire > player.weapon.options.shootDelay) {
      
      if(TIMERS.shootSpriteTime === 0){
        player.shooting = true;
      }
      TIMERS.shootSpriteTime = 0.5;

      var isCriticalStrike = petra.passProbabilities(player.critChance);
      if(isCriticalStrike){
        pointsToRender.push(new models.RenderableText({
          text: 'critical strike!!',
          color: 'rgba(69, 187, 111, 0.49)',
          timeAlive: 0, 
          speed: [50 * window.RESIZEFACTOR,50 * window.RESIZEFACTOR],
          pos: player.pos
        }));
      }

      var bulletpos = player.getShootOrigin();
      player.weapon.shoot(bullets, bulletpos, isCriticalStrike);

      addShootFire(bulletpos);
      playSound(SOUNDS.shoot);
      TIMERS.lastFire = TIMERS.gameTime ;
    }
  }

  function allyShoot(entity){
    bullets.push(EL.getEntity(entity.bulletName, {pos: [entity.getX() + entity.getWidth(), entity.getY() + entity.getHeight()/2],damage: entity.damage}));
    playSound(SOUNDS.shoot);
  }

  function randomFromArray(array){
    var randomPos = parseInt(Math.random() * array.length)
    return array[randomPos];
  }

  function addExplosion(pos, size){
    explosions.push(EL.getEntity('explosion',{pos: pos, resize: size*2}));
    var number = parseInt(Math.random()*SOUNDS.explosions.length);
    playSound(SOUNDS.explosions[number]);
  }

  function addBulletCasing(pos,speed, angle){
    miscelanea_front.push(EL.getEntity('bulletcasing', {pos: pos, speed: speed, angle: angle, rotateSprite: angle}));
  }
  function addSpark(pos,speed, angle){
    miscelanea_front.push(EL.getEntity('spark', {pos: pos, speed: speed, angle: angle}));
  }
  function addShootFire(pos,speed, angle){
    miscelanea_front.push(EL.getEntity('shootfire', {pos: pos, speed: speed, angle: angle}));
  }

  function addPoints(pts, pos){
    STATE.points += pts;
    for(var i = 0; i<notifyPoints.length; i++){
      notifyPoints[i](STATE.points);
    }
    pointsToRender.push(new models.RenderableText({
      text: pts,
      color: 'rgba(39, 214, 46, 0.61)',
      timeAlive: 0, 
      speed: [50,50],
      pos: petra.sumIntegerToArray(pos, 30)
    }));
  }
    
  function addPower(pow){
    pow = pow/2;
    var newPower = ((STATE.power + pow) < STATE.max_power) ? STATE.power+pow : STATE.max_power;
    setPower(newPower);
  }

  function setPower(pow){
    checkIfHasArrivedToMaxPower(pow);
    STATE.power = pow;
    var percentage = parseFloat((STATE.power / STATE.max_power) *100).toFixed(2);    
    for(var i = 0; i<notifyPower.length; i++){
      notifyPower[i](percentage);
    }
  }

  function checkIfHasArrivedToMaxPower(pow){
    if(pow >= STATE.max_power && STATE.power < STATE.max_power ){
      for(var i = 0; i<notifyMaxPower.length; i++){
        notifyMaxPower[i](true);
      }
    }else if(STATE.power != 0 && pow <= 0){
      for(var i = 0; i<notifyMaxPower.length; i++){
        notifyMaxPower[i](false);
      }
    }
  }

  function handleInput(dt) {
    player.dir = null;
    if(input.isDown('DOWN') || input.isDown('s')) {
      player.dir = 'down';
    }

    if(input.isDown('UP') || input.isDown('w')) {
      player.dir = 'up';
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
      player.dir = 'left';
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
      player.dir = 'right';
    } 

    if(input.isDown('f')) {
      //megaShoot();
    }

    if(input.isDown('SPACE') ){
      shoot();
    }
  }

  /****************************
  ****************************
    Entity update
  ****************************
  ****************************/

  function update(dt,realtimeDt) {
    TIMERS.gameTime += dt;
    LEVELS_DIRECTOR.update(dt,realtimeDt);
    handleInput(dt);
    //updateTree();
    
    updateEntities(dt);
    checkCollisions();
    checkGameEndConditions();
  };

  function updateTree(){
    QUAD.clear();
    insertTree(enemies,'enemy')
    insertTree(bosses,'boss')
    insertTree(bullets,'bullets')
    insertTree(enemyBullets,'enemyBullets')
    insertTree(neutralBullets,'neutralBullets')
    insertTree(bonuses, 'bonuses');
    insertTree([player], 'player')
  }

  function insertTree(arr, name){
    for(var i = 0; i < arr.length; i++){
      var size = arr[i].getSize();
      QUAD.insert({
        x: arr[i].getX(),
        y: arr[i].getY(),
        width: size[0],
        height: size[1],
        type: name,
        indexOriginalObject: i
      })
    }
  }

  function dogeBonusObtain(entity){
    LEVELS_DIRECTOR.pickedDogeBonus();
    entity.hasBonus = true;
    addPoints(200, entity.pos);
    entity.life += 200;
    entity.totalLife += 200;
  
    bonusWeapons = [EL.getEntity('bonusWeapon', {pos:entity.pos})];
    playSound(SOUNDS.yeah);
    var message = new models.Message(MESSAGES.wow, names.bonus_image_name, 1500);
    createDialog(message, bonusWeapons[0]);
  }
  function doubleWeaponBonusObtain(entity){
    player.weapon = new Weapons.DoubleShoot();
    entity.bonuses.weapon = 10;
  }
  function shotGunBonusObtain(entity){
    player.weapon = new Weapons.ShotGun();
    entity.bonuses.weapon = 10;
  }
  function rapidShotBonusObtain(entity){
    player.weapon = new Weapons.RapidFire();
    entity.bonuses.weapon = 10;
  }
  function greenGemBonusObtain(entity, bonus){
    addPoints(bonus.points, bonus.pos);
    STATE.gemsPicked++;
  }

  function updateEntities(dt) {
    updatePlayer(dt);
    updateBosses(dt);
    updateBullets(dt);
    updateEnemies(dt);
    updateSpecials(dt);
    updateExplosions(dt);
    updatePointsToRender(dt);
    updateDialogs(dt);
    updateMiscelanea_front(dt);
    updateMiscelanea_back(dt);
    updateBonuses(dt);
    updateBonusWeapons(dt);   
    updateEnemyBullets(dt);
    updateNeutralBullets(dt);
  }
  /* Helpers */
  function entityInFrontOfPlayer(entity){
    entity.pos = [player.pos[0]+ player.getWidth(),player.pos[1]- player.getHeight()/2];
    return entity;
  }

  function isOutsideScreen(pos, size){
    return(pos[1] + size[1] < 0 || pos[1] - size[1] > canvas.height ||
       pos[0] + size[0] >= canvas.width || pos[0] + size[0] < 0);
  }

  function checkCanvasLimits(pos,size){
    if(pos[1] <= 0){
      return 0;
    } else if(pos[1] + size[1] >= canvas.height ){
      return 1;
    } else if(pos[0] + size[0] >= canvas.width) {
      return 1/2;
    } else if(pos[0] <= 0){
      return 3/2;
    }else{
      return null;
    }
  }

  function removeIfOutsideScreen(entity){
    if(!isOutsideScreen(entity.pos ,entity.getSize())){
      return entity;
    }
  }
 
  function removeIfOutsideScreenAndNoBouncesLeft(entity){
    if(entity.bounces > 0 ){
      return entity;
    }
    if(!isOutsideScreen(entity.pos, entity.getSize())){
      return entity;
    }
  }

  function removeIfDone(entity){
    if(!entity.sprite.done){
      return entity;
    }
  }

  function endPostGameIfDone(entity){
    if(entity.sprite.done){
      endPostGame();
    }
    return entity;
  }

  function updateEntitiesAndRemoveIfDone(entities, dt){
    return hu.compact(
      entities.map(updateEntity(dt))
        .map(petra.moveByAngle(dt))
        .map(removeIfDone)
    ); 
  }

  function changeDirectionIfAvailable(dt){
    return function(entity){
      var nextPosition = petra.calculateNextPositionByAngle(entity,dt);
      var reflectionAngle = checkCanvasLimits(nextPosition, entity.getSize());
      if(reflectionAngle != null){
        entity.bounces -= 1;
        entity.angle = petra.calculateBounceAngle(entity.angle, reflectionAngle * Math.PI);
      }
      return entity;
    }
  }

  function moveInCircleAround(around, dt){
    var dt = dt;
    //TODO We are changing around / by player cause the reference is getting lost
    
    return function(entity){ 
      var radius = player.getHeight() > player.getWidth() ? player.getHeight() : player.getWidth();
     
      //TODO: This may cause the dogge to move from the center of the circle, the Phi calculus agains a game time
      //it should be against something between 0 and 10 ? 
      var phi =  TIMERS.gameTime;
      //We add 1000 to ensure the calculus is allways done for positive values
      ////It gets a weird behaviour with negative values on the x axis
      var angleInRadians = Math.atan(entity.getX()+1000, entity.getY()) + phi;
      var xC = radius * Math.cos(angleInRadians);
      var yC = radius * Math.sin(angleInRadians);

      xC = xC + player.getX();
      yC = yC + player.getY();
      entity.pos =[xC,yC]
      return entity;
    }
  }

  function updateTimeCounter(dt){
    return function(entity){
      var previousTime = entity.timeAlive || 0;
      previousTime+=dt;
      entity.timeAlive = previousTime;
      return entity;
    }
  }

  function removeIfTimeCounterGreaterThan(time){
    return function(entity){
      if(!entity.timeAlive){
        return entity;
      }

      if(entity.timeAlive && parseInt(entity.timeAlive,10) <= time){
        return entity;
      }
    }
  }

  function removeBonusIfTImeGreaterThan(time){
    return function(entity){
      var returned = removeIfTimeCounterGreaterThan(time)(entity);
      if(!returned){
        player.damage = player.baseDamage;
      }else{
        return returned;
      }
    }
  }
  function wrapperReadyForActionOnly(fn){
    return function(entity){
      if(entity.readyForAction){
        return fn(entity);
      }else{
        return entity;
      }
    }
  }  

  function wrapperNotReadyForActionOnly(fn){
    return function(entity){
      if(!entity.readyForAction){
        return fn(entity);
      }else{
        return entity;
      }
    }
  }

  function moveInsideScreen(dt, margin){
    if(!margin){
      margin = 0;
    }
    return function(entity){
      if(entity.getX() + entity.getWidth() + margin >= canvas.width) {
        entity.pos = petra.moveLeft(entity.pos, entity.speed, dt);
      }
      if(entity.getY() > canvas.height){
        entity.pos = petra.moveUp(entity.pos, entity.speed, dt);
      }
      if(entity.getX() + entity.getWidth() < 0){
        entity.pos = petra.moveRight(entity.pos, entity.speed, dt);
      }
      if(entity.getY()  + entity.getHeight() < 0){
        entity.pos = petra.moveDown(entity.pos, entity.speed, dt);
      }
      return entity;
    }
  }

  function readyForActionIfInsideScreen(margin){
    if(!margin){
      margin = 0;
    }
    return function(entity){
      if(!isOutsideScreen([entity.getX() + margin, entity.getY()], entity.getSize())){
        entity.readyForAction = true;
      }
      return entity;
    }
  }

  function entityStepsInTime(actionName,time, dt){
    actionName +='stepsInTime';
    return function(fn){
      return function(entity){
        if(!entity[actionName] || (entity[actionName] + dt) >time){
          entity[actionName]= dt;
          return fn(entity);
        }else{
          entity[actionName] +=dt;
          return entity;
        }
      }
    }
  }

  function shootThrottled(time, dt, shootType){
    return entityStepsInTime('shoot',time,dt)(function(entity){
      if(shootType == 'ally'){
        allyShoot(entity, entity.angle);
      }else{
        enemyShoot(entity, entity.angle);
      }
      
      return entity;
    });
  }

  function showMessageThrottled(time, dt){
    return entityStepsInTime('showMessageCounter',time,dt)(function(entity){
      
      if(entity.messages){
        var max = entity.messages.length;
        var text = entity.messages[petra.random(0, max)];
        var message = new models.Message(text, entity.name, 800);
        createDialog(message, entity);
      }
      
      return entity;
    });
  }

  function playActionThrottled( dt, keep){
    return function(entity){
      if(!entity.actions || !entity.actions.length > 0){
        return entity;
      }
      return entityStepsInTime('actionsCounter', entity.actions[entity.actions.length - 1 ].delay,dt)(function(entity){
        var action = entity.actions.pop()
        if(keep){
          entity.actions.unshift(action);
        }
        playAction(action.name, entity);
        return entity;
      }.bind(this))(entity);
    }
  }
  function playAction(action, entity){
    var lifePercent = entity.life / entity.totalLife;
    var life = 'normal';
    
    if(lifePercent < 0.7 && lifePercent > 0.4 ){
      life = 'damaged';
    }else if(lifePercent < 0.4){
      life = 'verydamaged';
    }
    
    if(action =='enemyShoot'){
      entity.setAnimation('shoot'+life);
      enemyShoot(entity,  entity.getBulletAngle() );
    }else if(action =='neutralShoot'){
      entity.setAnimation('shoot'+life);
      neutralShoot(entity,  entity.getBulletAngle() );
    }else if(action == 'aim'){
      //TODO, get near entity
      entity.setAnimation('aiming');
      entity.aimingAt = player;
    }else if(action =='doubleShoot'){
      entity.setAnimation('shoot'+life);
      enemyShoot(entity,0.6 *Math.PI );
      enemyShoot(entity,0.8 *Math.PI);
      enemyShoot(entity,1.0 *Math.PI);
      enemyShoot(entity,1.2 *Math.PI);
      enemyShoot(entity,1.4 *Math.PI);
    }else if(action =='teleport'){
      entity.setAnimation('teleport'+life, function(frame,index){
        var times = 0;
        if(frame == 6 && times < 1){
          entity.pos = [player.pos[0] + 300 * window.RESIZEFACTOR, player.pos[1] + petra.random(-30 * window.RESIZEFACTOR, 30 * window.RESIZEFACTOR)];
          times = 1;
        }else if(index == 13){
          entity.setDefaultAnimation();
        }
      }, true);

    }else if(action == 'talk'){
      var phrases = ['killer', 'power','grunt'];
      var chosenPhrase = phrases[parseInt(Math.random() * phrases.length, 10)];
      entity.setAnimation('talk'+life);
      playSound(SOUNDS[chosenPhrase]);
      
      var message = new models.Message(MESSAGES[chosenPhrase], names.main_enemy_name, 1500);
      createDialog(message, entity);
    }else if(action == 'launchEnemy'){
      var enemy = EL.getRandomEnemy([entity.getX() - 80 * window.RESIZEFACTOR, entity.getY() * window.RESIZEFACTOR]);
      enemies.push(enemy);
      miscelanea_front.push(EL.getEntity('portal_front', {pos: enemy.pos, speed: entity.speed, angle: entity.angle, resize: petra.multIntegerToArray(enemy.getSize(), 2)}));
      miscelanea_back.push(EL.getEntity('portal_back', {pos: enemy.pos, speed: entity.speed, angle: entity.angle, resize: petra.multIntegerToArray(enemy.getSize(), 2)}));
      entity.setAnimation('standby'+life);
    };
  }

  function createRedBullet(pos, damage, angle,rotate){
    var opts = {
      speed: [500,500],
      damage : damage || 20,
      color: {
        r: 255,
        g: 0,
        b: 0
      },
      size: 20,
      pos: pos,
      angle: angle,
      rotate: rotate
    }
    return new models.Bullet(opts);
  }

  function createYellowBullet(pos, damage, angle,rotate){
    var opts = {
      speed: [500,500],
      damage : damage || 20,
      color: {
        r: 255,
        g: 214,
        b: 0
      },
      size: 20,
      pos: pos,
      angle: angle,
      rotate: rotate
    }
    return new models.Bullet(opts);
  }


  function enemyShoot(entity, angle){
    var shootOrigin = entity.getShootOrigin();
    var bullet = createRedBullet(shootOrigin, entity.damage, angle);
    bullet.speed = [300 * window.RESIZEFACTOR,300 * window.RESIZEFACTOR];
    enemyBullets.push(bullet);      
    miscelanea_front.push(EL.getEntity(entity.bulletShotFireName, {pos: shootOrigin, speed: entity.speed, angle: angle, rotateSprite: angle}));
    playSound(SOUNDS.shoot);
  } 

  function neutralShoot(entity, angle){
    var shootOrigin = entity.getShootOrigin();
    var bullet = createYellowBullet(shootOrigin, entity.damage, angle);
    bullet.speed = [300 * window.RESIZEFACTOR,300 * window.RESIZEFACTOR];
    neutralBullets.push(bullet);      
    miscelanea_front.push(EL.getEntity(entity.bulletShotFireName, {pos: shootOrigin, speed: entity.speed, angle: angle, rotateSprite: angle}));
    playSound(SOUNDS.shoot);
  }

  function getBossActions(){
    var bossTemp = EL.getBoss([canvas.width, canvas.height]);
    return bossTemp.actions;
  }

  function resetBossActionsIfEmpty(entity){
    if(entity.actions.length == 0){
      entity.actions = getBossActions();
    }
    return entity;
  }

  function moveToPlayerVertically(dt){
    return function(entity){
      if(player.getY() < entity.getY() - 40 * window.RESIZEFACTOR){
        entity.pos = petra.moveUp(entity.pos, entity.speed, dt);
      }

      if(player.getY() > entity.getY() - 40 * window.RESIZEFACTOR){
        entity.pos = petra.moveDown(entity.pos, entity.speed, dt);
      }

      return entity;
    }
  }

  /* Updates */
  
  function updatePlayer(dt){
    
    if(TIMERS.shootSpriteTime > 0){
      TIMERS.shootSpriteTime -= dt;
      if(TIMERS.shootSpriteTime <= 0){
        TIMERS.shootSpriteTime = 0;
        player.shooting = false;
      }
    }

    var previouslyMovingDown =  player.moving == 'down';
    player.moving = null;

    if(touchInputs){
      var newPosX = petra.lerp3(player.pos[0], touchInputs.pos.x,player.speed, dt) ;
      var newPosY = petra.lerp3(player.pos[1], touchInputs.pos.y,player.speed, dt) ;
      if(newPosY > player.pos[1]){
        player.moving = 'down';
      }else if(newPosY < player.pos[1]){
        player.moving = 'up';
      }else{
        player.moving == null;
      }
      player.pos[0] = newPosX;
      player.pos[1] =newPosY;
    }else if(player.dir){
      player = petra.moveToDirection(dt, player.dir)(player);
      player.moving =player.dir;
    }

    if(player.shooting){
      if(player.moving == 'down'){
        SCENARIO.moveDown();
        player.setAnimation('shootMoveDown');
      }else if(player.moving == 'up'){
        player.setAnimation('shootMoveUp');
        SCENARIO.moveUp();
      }else{
        player.setAnimation('shoot');
        SCENARIO.stopMove();
      }
    }else{
      if(player.moving == 'down'){
        player.setAnimation('moveDown');
        SCENARIO.moveDown();
      }else if(player.moving == 'up'){
        player.setAnimation('moveUp');
        SCENARIO.moveUp();
      }else {
        player.setDefaultAnimation();
        SCENARIO.stopMove();
      }
    }

    if(player.bonuses.weapon){
      player.bonuses.weapon -= dt;
      if(player.bonuses.weapon <= 0){
        player.weapon = new Weapons.Pistol();
      }
    }

    player.update(dt);
  }

  function updateEntititesAndMoveAndRemoveIfOutsideScreen(entities, dt){
    return hu.compact(
      entities.map(updateEntity(dt))
      .map(petra.moveByAngle(dt))
      .map(removeIfOutsideScreen));
  }
  function updateBullets(dt){
    bullets = updateEntititesAndMoveAndRemoveIfOutsideScreen(bullets, dt);
    /*bullets = hu.compact(bullets.map(ifCollidedAddSpark)
          .map(removeIfCollided));*/
  }

  function updateEnemyBullets(dt){
    enemyBullets = updateEntititesAndMoveAndRemoveIfOutsideScreen(enemyBullets, dt);
    /*enemyBullets = hu.compact(enemyBullets.map(ifCollidedAddSpark)
          .map(removeIfCollided));*/
  } 
  function updateNeutralBullets(dt){
    neutralBullets = updateEntititesAndMoveAndRemoveIfOutsideScreen(neutralBullets, dt);
    /*neutralBullets = hu.compact(neutralBullets.map(ifCollidedAddSpark)
          .map(removeIfCollided));*/
  }

  function updateEnemies(dt){
    enemies = hu.compact(
      enemies.map(updateEntity(dt))
      .map(updateEntity(dt))
      .map(showMessageThrottled(3, dt))
      .map(playActionThrottled(dt, true))
      .map(removeEnemyIfOutsideScreen(dt)));
  }

  function removeEnemyIfOutsideScreen(dt){
    return function(entity){
      if(petra.isOutsideScreenLeft(entity)){
        LEVELS_DIRECTOR.enemyLeft(entity);
      }else{
        return entity;
      }
    }
  }
  
  function updateEntity(dt){
    return function(entity){
      entity.update(dt);
      return entity;
    }
  }
  function updateSpecials(dt){
    specials = updateEntititesAndMoveAndRemoveIfOutsideScreen(specials, dt);
  }
  
  function updateExplosions(dt){
    explosions = updateEntitiesAndRemoveIfDone(explosions, dt);        
  } 
  function updateMiscelanea_front(dt){
    miscelanea_front = updateEntitiesAndRemoveIfDone(miscelanea_front, dt);        
  }
  function updateMiscelanea_back(dt){
    miscelanea_back = updateEntitiesAndRemoveIfDone(miscelanea_back, dt);        
  }

  function updatePointsToRender(dt){
    pointsToRender = hu.compact(
      pointsToRender
      .map(updateTimeCounter(dt))
      .map(moveUp(dt))
      .map(removeIfTimeCounterGreaterThan(0.5))
      );
  }

  function moveUp(dt){
    return function(entity){
      entity.pos = petra.moveUp(entity.pos, entity.speed, dt);
      return entity;
    }
  }

  function updateDialogs(dt){
    inGameDialogs = hu.compact(
      inGameDialogs
      .map(updateTimeCounter(dt))
      .map(function(item){
        return updatePositionFromRelativeEntity(item.entity)(item);
      })
      .map(function(item){
        return removeIfTimeCounterGreaterThan(item.duration/1000)(item);
      })
      );
  }

  function updatePositionFromRelativeEntity(entity){
    return function(item){
      item.pos = entity.pos;
      return item;
    }
  }

  function updateBonuses(dt){
    bonuses = hu.compact(bonuses
      .map(wrapperNotReadyForActionOnly(moveInsideScreen(dt, 30)))
      .map(wrapperNotReadyForActionOnly(readyForActionIfInsideScreen(10))));

    bonuses = hu.compact(hu.compact(bonuses
      .map(wrapperReadyForActionOnly(changeDirectionIfAvailable(dt)))
      .map(wrapperReadyForActionOnly(petra.moveByAngle(dt)))
      .map(updateEntity(dt))
      .map(ifCollidesApplyBonusTo(player))
      .map(removeIfOutsideScreenAndNoBouncesLeft))
      .map(removeIfCollideWith(player)));
  }

  function updateBonusWeapons(dt){
    bonusWeapons = hu.compact(bonusWeapons.map(moveInCircleAround(player, dt))
      .map(updateTimeCounter(dt))
      .map(shootThrottled(0.5, dt, 'ally'))
      .map(removeBonusIfTImeGreaterThan(15)));
  }

  function updateBosses(dt){
    bosses = hu.compact(bosses
      .map(updateEntity(dt))
      .map(wrapperNotReadyForActionOnly(moveInsideScreen(dt,50)))
      .map(readyForActionIfInsideScreen(50))
      .map(wrapperReadyForActionOnly(playActionThrottled(dt, false)))
      .map(resetBossActionsIfEmpty)
      .map(moveToPlayerVertically(dt)));
  }

  function updateGraves(dt){
    graves = hu.compact(
      graves.map(updateEntity(dt))
      .map(endPostGameIfDone));
  }

  /****************************
  ****************************
    Collision Handling
  ****************************
  ****************************/   
      /**
     * Helper function to determine whether there is an intersection between the two polygons described
     * by the lists of vertices. Uses the Separating Axis Theorem
     *
     * @param a an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
     * @param b an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
     * @return true if there is any intersection between the 2 polygons, false otherwise
     */
    function doPolygonsIntersect (a, b) {
        var polygons = [a, b];
        var minA, maxA, projected, i, i1, j, minB, maxB;
        var aPoints = a.getPoints();
        var bPoints = b.getPoints();

        for (i = 0; i < polygons.length; i++) {

            // for each polygon, look at each edge of the polygon, and determine if it separates
            // the two shapes
            var polygon = polygons[i].getPoints();
            for (i1 = 0; i1 < polygon.length; i1++) {

                // grab 2 vertices to create an edge
                var i2 = (i1 + 1) % polygon.length;
                var p1 = polygon[i1];
                var p2 = polygon[i2];

                // find the line perpendicular to this edge
                var normal = [p2[1] - p1[1],  p1[0] - p2[0]];

                minA = maxA = undefined;
                // for each vertex in the first shape, project it onto the line perpendicular to the edge
                // and keep track of the min and max of these values
                for (j = 0; j < aPoints.length; j++) {
                    projected = normal[0] * aPoints[j][0] + normal[1] * aPoints[j][1];
                    if (isUndefined(minA) || projected < minA) {
                        minA = projected;
                    }
                    if (isUndefined(maxA) || projected > maxA) {
                        maxA = projected;
                    }
                }

                // for each vertex in the second shape, project it onto the line perpendicular to the edge
                // and keep track of the min and max of these values
                minB = maxB = undefined;
                for (j = 0; j < bPoints.length; j++) {
                    projected = normal[0] * bPoints[j][0] + normal[1] * bPoints[j][1];
                    if (isUndefined(minB) || projected < minB) {
                        minB = projected;
                    }
                    if (isUndefined(maxB) || projected > maxB) {
                        maxB = projected;
                    }
                }

                // if there is no overlap between the projects, the edge we are looking at separates the two
                // polygons, and we know there is no overlap
                if (maxA < minB || maxB < minA) {
                    return false;
                }
            }
        }
        return true;
    };

  function isUndefined(val){
    return typeof(val) === 'undefined';
  }

  function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 || b <= y2 || y > b2);
  }

  function boxCollides(hitboxA, hitboxB) {
    return collides(hitboxA.topLeft[0], hitboxA.bottomLeft,
                    hitboxA.topRight, hitboxA.bottomRight,
                    hitboxB.topLeft, hitboxB.bottomLeft,
                    hitboxB.topRight, hitboxB.bottomRight);
  }

  function entitiesCollide(a,b){
    return doPolygonsIntersect(a.getHitBox(), b.getHitBox());
    
  }

  
  function ifCollidesApplyBonusTo(entity){
    return function(bonus){
      if(entitiesCollide(entity,bonus)){
        bonus.obtain(entity, bonus);
      }
      return bonus;
    }
  }
  function ifCollidesApplyDamageTo(entity){
    return function(item){
      if(entitiesCollide(entity,item)){
        pointsToRender.push(new models.RenderableText({
          text: item.damage,
          color: 'rgba(169, 81, 185, 0.61)',
          timeAlive: 0, 
          speed: [50,50],
          pos: entity.pos
        }));
        entity.life -= item.damage;
      }
      return item;
    }
  }

  /*function ifCollidedAddSpark(entity){
    if(entity.collision){
      var portionofspeed = [entity.speed[0] * 0.8, entity.speed[1] * 0.8];
      addSpark(entity.pos, entity.collision.speed,  entity.collision.angle);
      addBulletCasing(entity.pos, [entity.speed[0] - portionofspeed[0], entity.speed[1] - portionofspeed[1]], entity.angle);
    }
    return entity;
  }*/
  function ifCollidesAddSpark(entity){
    return function(item){
      if(entitiesCollide(entity,item)){
        var portionofspeed = [item.speed[0] * 0.8, item.speed[1] * 0.8];
        addSpark(item.pos, entity.speed, entity.angle);
        addBulletCasing(item.pos, [item.speed[0] - portionofspeed[0], item.speed[1] - portionofspeed[1]], item.angle);
      }
      return item;
    }
  }

  function removeIfCollideWith(entity){
    return function(item){
      if(!entitiesCollide(entity, item)){
        return item;
      }
    }
  }

  /*function removeIfCollided(entity){
    if(!entity.collision){
      return entity;
    }
  }*/

  function removeIfCollideWithAndPlaySound(entity){
    return function(item){
      var shouldReturnItem = removeIfCollideWith(entity)(item);
      if(!shouldReturnItem){
        playerDamaged(item.damage);
      }else{
        return item;
      }
    }
  }
  function playerDamaged(damage){
    player.life -= damage;
    
    SCENARIO.screenShake();

    pointsToRender.push(new models.RenderableText({
      text: damage,
      color: 'rgba(255, 0, 0, 0.61)',
      timeAlive: 0, 
      speed: [50 * window.RESIZEFACTOR, 50 * window.RESIZEFACTOR],
      pos: [player.getX(), player.getY()]
    }));

    var messageOuch = new models.Message(MESSAGES.ouch, (player.isSuperSaiyan ? names.main_character_super_damaged : names.main_character_damaged))
    createDialog(messageOuch, player);
  }

  function killEnemy(enemy){
    LEVELS_DIRECTOR.killedEnemy(enemy);
    addPoints(enemy.points, enemy.pos);

    addPower(enemy.points);
    addExplosion(enemy.pos, enemy.getSize());    
  }

  function  nearEntities(point, size){
    var items = QUAD.retrieve({x:point[0], y:point[0], height:size[0], width:size[1]});
    return items;
  }

  function getNearNearEntitiesForEnemy(enemy){
    var items = nearEntities(enemy.pos, enemy.getSize());
    items = hu.compact(items.map(function(item){
      if(item.type == 'neutralBullets' || 
        item.type == 'bullets'){
        return item;
      }
    }))
    return items;
  }
  function collisionToEnemyGroup(enemyGroup){
      enemyGroup = hu.compact(enemyGroup.map(function(enemy){
        /*
        var nearEntities = getNearNearEntitiesForEnemy(enemy);
       

        nearEntities.map(function(entity){
          var object;
          console.log(entity.indexOriginalObject);
          if(entity.type == 'bullets' ){
            object = bullets[entity.indexOriginalObject]
          }else if(entity.type == 'neutralBullets'){
            object = neutralBullets[entity.indexOriginalObject]
          }

          if(entitiesCollide(object, enemy)){
              console.log('ciolide')
              object.collision = {
                pos: object.pos,
                speed: enemy.speed,
                angle: enemy.angle
              }
              enemy.life -= object.damage;
            }
          

        })*/

        if(entitiesCollide(enemy, player)){
          playerDamaged(enemy.damage);
          enemy.life -= player.damage;
        }

        bullets = hu.compact(bullets.map(ifCollidesApplyDamageTo(enemy))
          .map(ifCollidesAddSpark(enemy))
          .map(removeIfCollideWith(enemy)));

        neutralBullets = hu.compact(neutralBullets.map(ifCollidesApplyDamageTo(enemy))
          .map(ifCollidesAddSpark(enemy))
          .map(removeIfCollideWith(enemy)));
          
        specials
          .map(ifCollidesApplyDamageTo(enemy));

        

        if(enemy.life > 0){
          return enemy;
        }else{
          killEnemy(enemy);
        }
      }));
    return enemyGroup;
  }

  function checkCollisions() {
    checkPlayerBounds();

    enemies = collisionToEnemyGroup(enemies);
    bosses = collisionToEnemyGroup(bosses);

    enemyBullets = hu.compact(enemyBullets
        .map(removeIfCollideWithAndPlaySound(player)));

    neutralBullets = hu.compact(neutralBullets
        .map(removeIfCollideWithAndPlaySound(player)));
  }

  function checkGameEndConditions(){
    if(player.life <= 0){
      STATE.died = true;
      endGame();
    }else if(LEVELS_DIRECTOR.isFinalStage() && bosses.length == 0 && enemies.length == 0){
      STATE.win = true;
      endGame();
    } 
  }

  function checkPlayerBounds() {
    if(player.pos[0] < 0) {
      player.pos[0] = 0;
    }
    else if(player.pos[0] > canvas.width - player.getWidth()) {
      player.pos[0] = canvas.width - player.getWidth();
    }

    if(player.pos[1] < 0) {
      player.pos[1] = 0;
    }
    else if(player.pos[1] > canvas.height - player.getHeight()) {
      player.pos[1] = canvas.height - player.getHeight();
    }
  }

  /****************************
  ****************************
    Drawables
  ****************************
  ****************************/   

  function getEntitiesToRender() {
    var entitiesToRender = [
      {
        entities: bullets
      },
      {
        entities: enemyBullets
      },
      {
        entities: neutralBullets
      },
      {
        entities: bosses
      },
      {
        entities: miscelanea_back,
        background: true
      },
      {
        entities: enemies
      },
      {
        entities: explosions
      },
      {
        entities: specials
      },
      {
        entities: bonuses
      },
      {
        entities: miscelanea_front
      }
      ];

   if(!isGameOver()) {
      entitiesToRender.push({
        entities:[player]
      });
      if(player.hasBonus){
        entitiesToRender.push({
          entities: bonusWeapons
        });
      }
    }else{
      entitiesToRender.push({
        entities: graves
      });
    }

    return entitiesToRender;
  };

  function getTextEntitiesToRender(){
    return [{
      entities: pointsToRender,
      type: 'basic'
    },{
      entities: inGameDialogs,
      type: 'dialog'
    }];
  }

  

  /****************************
  ****************************
     Game Suscriptions
  ****************************
  ****************************/  
  function suscribeGameOver( fn){
    notifyGameEnd.push(fn);
  }
  function suscribePoints(fn){
    notifyPoints.push(fn);
  }
  function suscribeMaxPower(fn){
    notifyMaxPower.push(fn);
  }


  /****************************
  ****************************
    GAME API
  ****************************
  ****************************/
  var GAME = function() {
    return {
      suscribeGameOver : suscribeGameOver,
      suscribePoints : suscribePoints,
      endGame : endGame,
      start : start,
      restart : restart,
      pause: pause,
      resume : resume,
      shoot: shoot
    };
  }

  return  GAME;
  }]);
});