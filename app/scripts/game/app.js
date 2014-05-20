define( [ 'game/models/models', 'hu','game/entities','game/scenario', 'levelsDirector','game/petra','resources','sprite','input','game/raf'], function(models, hu, EL, Scenario, LEVELS_DIRECTOR, petra){

  var throttle = function(lambda, ms){
    var allow = true;
    return function(){
      if(allow){
        allow = false,
        lambda();

        setTimeout(function(){
          allow = true;
        },ms);
      }
    }
  }
  /****************************
  ****************************
    GAME Variables
  ****************************
  ****************************/
  function getDefaultState(){
    var options =  {
      sound_enabled: true,
      iteration: 1,
      win: false,
      died: false,
      points : 0,
      power: 0,
      max_power :1000,
      game_over: false,
      paused: false,
      post_game_completed : false,
      background_speed: 0.3,
      game_speed: 1.0
    };
    return options;
  }

  var STATE = getDefaultState();

  function getDefaultTimers(){
    return {
      lastFire :0,
      lastTime: Date.now(),
      gameTime: 0,
      realSeconds:0,
      shootSpriteTime: 0
    };
  }

  var TIMERS = getDefaultTimers();

  var frames = 0;

  var bullets,
    enemies,
    explosions,
    specials,
    bonuses,
    bonusWeapons,
    bosses,
    enemyBullets,
    graves,
    player;

  function setDefaultStateForEntities(){
    bullets = [];
    enemies = [];
    explosions = [];
    specials = [];
    bonuses = [];
    bonusWeapons = [];
    bosses = [];
    enemyBullets = [];
    graves = [];
    player = {};
  }

  var canvas, ctx, power = 0;
  var SCENARIO;
  var terrainPattern;

  //Suscribe to events of the game
  var notifyGameEnd = [];
  var notifyLevelUp = [];
  var notifyPoints = [];
  var notifyMessages = [];
  var notifyPower = [];
  var notifyMaxPower = [];

  //Touch inputs
  var touchInputs;

  var SOUNDS;

  function preloadSounds(){
    SOUNDS = {
      death: new Howl({
        urls: ['sounds/cut_grunt2.wav'],
        volume: 0.1
      }),
      shoot: new Howl({
        urls: ['sounds/laser5.wav'],
        volume: 0.1
      }),
      ambient: new Howl({
       //urls: ['sounds/April_Kisses.mp3'],
        urls: ['sounds/songs/thiaz_itch_bubblin_pipe.mp3'],
        volume: 0.5,
        loop: true
      }),
      yeah: new Howl({
        urls: ['sounds/oh_yeah_wav_cut.wav']
      }),
      levelup: new Howl({
        urls: ['sounds/upmid.wav']
      }),
      rick: new Howl({
        urls: ['sounds/rickcut2.wav'],
        volume: 0.5
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
      ouch:  new Howl({
        urls: ['sounds/ohmy.wav']
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

    }
  };

  var main_character_name = 'cooldog';
  var main_enemy_name = 'creeper';
  var main_character_super_damaged = 'cooldogdamaged';
  var main_character_damaged = 'cooldogdamaged';
  var main_character_super_name = 'cooldog';
  var bonus_image_name = 'dog';
  //var main_character_super_name = 'supercooldog';

  var time_between_bullets = 0.300;
  /****************************
  ****************************
    GAME Initialization
  ****************************
  ****************************/

  // The main game loop
  var main = function() {
    var now = Date.now();
    var dt = (now - TIMERS.lastTime);

    frames = (1000/ (dt * 60)) * 60;
    
    TIMERS.realSeconds += dt;
    var realtimeDt = (now - TIMERS.lastTime) / 1000.0;
    dt = STATE.game_speed * realtimeDt;

    if(!isGameOver() && !isPaused()){
      update(dt,realtimeDt);
      render();
      TIMERS.lastTime = now;
      requestAnimFrame(main);
    }
  };

  var postGame = function(){
    var now = Date.now();
    var dt = (now - TIMERS.lastTime) / 1000.0;
    if(!STATE.post_game_completed){
      updateGraves(dt);
      updateExplosions(dt);
      render();
      TIMERS.lastTime = now;
      requestAnimFrame(postGame);
    }
  };

  function start() {
    preloadSounds();
    LEVELS_DIRECTOR.init(5,1,20);

    initCanvas();
    toMouseListeners();
    reset();
    suscribeToEvents();
    playSound(SOUNDS.ambient);

    showInitialDialogs();
    main();
  };

  function restart(){
    reset();
    playSound(SOUNDS.ambient);
    main();
  }

  function initCanvas(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    //Seems to work
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50;
  };

  function toMouseListeners(){
    canvas.addEventListener('touchmove', function(ev){
      var x = ev.targetTouches[0].pageX - canvas.offsetLeft;
      var y = ev.targetTouches[0].pageY - canvas.offsetTop;
      
      touchInputs = {
        pos: {
          x : x ,
          y : y - player.sprite.getSize()[1]/2
        }
      }

      shoot();
      ev.preventDefault();
    });
    canvas.addEventListener('touchstart', function(ev){
      var x = ev.targetTouches[0].pageX - canvas.offsetLeft;
      var y = ev.targetTouches[0].pageY - canvas.offsetTop;
      
      touchInputs = {
        pos: {
          x : x ,
          y : y - player.sprite.getSize()[1]/2
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
      megaShoot(ev.gesture.deltaX, ev.gesture.deltaY);
      
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
    var newState = getDefaultState();
    newState.sound_enabled = STATE.sound_enabled === false ? false: true;
    newState.game_speed = STATE.game_speed ? STATE.game_speed: newState.game_speed;
    
    STATE = newState;

    setDefaultStateForEntities();

    player = EL.getEntity(main_character_name, [50, canvas.height / 2]);
    SCENARIO = new Scenario(canvas,ctx);
    TIMERS = getDefaultTimers();
  };

  function suscribeToEvents(){

    /*suscribeMaxPower(function(bool){
      if(bool){
        var superPlayerOptions =  EL.getEntity(main_character_super_name, player.pos, player);
        player.sprite = superPlayerOptions.sprite;
        player.speed = superPlayerOptions.speed;
        player.damage = superPlayerOptions.damage;
        player.isSuperSaiyan = true;
        showMessages([MESSAGES.saiyan], [main_character_super_name]);
      }else{
        console.log('ey')
        var normalPlayerOptions =  EL.getEntity(main_character_name, player.pos, player);
        player.sprite = normalPlayerOptions.sprite;
        player.speed = normalPlayerOptions.speed;
        player.isSuperSaiyan = false;
        player.damage = normalPlayerOptions.damage;
      }
    });*/

    LEVELS_DIRECTOR.suscribeLevelUp(function(){
      SOUNDS['levelup'].play();
      var message = new models.Message(MESSAGES.levelup, bonus_image_name);
      showMessages([message]);
    })
    notifyLevelUp.map(function(fn){
      LEVELS_DIRECTOR.suscribeLevelUp(fn);
    });
  }

  function showInitialDialogs(){

    var messageHero1 = new models.Message('ENEMY! I See your power, I saw your minions...', main_character_name,3000);
    var messageHero2 = new models.Message('covering the universe, devouring it... i felt them', main_character_name,3000);
    var messageHero3 = new models.Message('...', main_character_name);
    var messageHero4 = new models.Message('I\'ll use my true power to defeat you!!', main_character_name);
    var messageHero5 = new models.Message('Surrender now... if you want to survive', main_character_name);
    var messageEnemy1 = new models.Message('I won\'t allow you, my vision is clear, all must die' , main_enemy_name);
    var messageHero6 = new models.Message('...no way', main_character_name);

    showMessages([ 
      messageHero1,
      messageHero2,
      messageHero3,
      messageHero4,
      messageHero5,
      messageEnemy1,
      messageHero6
       ],0);
    
  }

  /****************************
  ****************************
    GAME State modifiers
  ****************************
  ****************************/
  
  function endGame() {
    STATE.game_over = true;
    stopAmbientSound();
    graves.push(EL.getEntity('grave', player.pos));
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
    pauseAmbientSound();
  }

  function isPaused(){
    return STATE.paused;
  }
  
  function resume(){
    STATE.paused = false;
    playSound(SOUNDS.ambient);
    TIMERS.lastTime = Date.now();
    main();
  }

  function playSound(sound){
    if(!isPaused() && STATE.sound_enabled){
      sound.play();
    }
  }

  function pauseAmbientSound(){
    SOUNDS.ambient.pause();
  }

  function stopAmbientSound(){
    SOUNDS.ambient.stop();
  }

  function showMessages(messages,timeoutBetweenMessages){
    timeoutBetweenMessages = timeoutBetweenMessages ? timeoutBetweenMessages : 0;
    for(var i = 0; i < notifyMessages.length; i++){
      //Clone the item, cause we dont want to send a referenced object ;)
      var messagesClone = messages.map(function(item){ return item });
      notifyMessages[i](messagesClone,timeoutBetweenMessages);
    }
  }

  function shoot(){
    if(!isGameOver() &&
      TIMERS.gameTime - TIMERS.lastFire > time_between_bullets) {
      
      if(TIMERS.shootSpriteTime === 0){
        changePlayerSpriteToShooting(true);
      }
      TIMERS.shootSpriteTime = 0.5;
      

      var x = player.pos[0] + player.sprite.getSize()[0] / 2;
      var y = player.pos[1] + player.sprite.getSize()[1] / 2;

      bullets.push(EL.getEntity('bulletBlue', [player.pos[0] + player.sprite.getSize()[0] - 10,y -5], { damage: player.damage }));
      //bullets.push(EL.getEntity(player.topBullet, [x,player.pos[1]], { damage: player.damage/2 }));
      //bullets.push(EL.getEntity(player.bottomBullet, [x,player.pos[1] + player.sprite.getSize()[1]], { damage: player.damage/2 }));
    
      playSound(SOUNDS.shoot);
      TIMERS.lastFire = TIMERS.gameTime ;
    }
  }

  function blueShoot(pos){
    bullets.push(EL.getEntity('bulletBlue', pos, {damage: 200}));
    playSound(SOUNDS.shoot);
  }

  function enemyShoot(pos, damage){
    var bullet = EL.getEntity('bullet', pos, { damage: damage });
    bullet.dir = 'left';
    bullet.speed = 300;
    enemyBullets.push(bullet);
    playSound(SOUNDS.shoot);
  }

  function randomFromArray(array){
    var randomPos = parseInt(Math.random() * array.length)
    return array[randomPos];
  }
  var createRick = throttle(function(){
    var possibleRickSizes = [
      [70,110],
      [140,220],
      [35,65]
    ];
    var opts  = {
      size : randomFromArray(possibleRickSizes)
    }
     specials.push(EL.getEntity('rick', [0, Math.random()* (canvas.height -39)], opts));
  }, 300);
  
  var createRicks = function(ammount){
    return function(){
      createRick();

      if(specials.length < ammount){
        requestAnimFrame(createRicks(ammount))
      }  
    }
  }

  function megaShootUntrottled(){
    console.log(STATE.power)
    if(STATE.power == STATE.max_power){
      setPower(0);
      playSound(SOUNDS.rick);
      createRicks(9)();
    }
  }

  var megaShoot = throttle(megaShootUntrottled, 1000);

  function addExplosion(pos){
    explosions.push(EL.getEntity('explosion',pos));
    var number = parseInt(Math.random()*SOUNDS.explosions.length);
    playSound(SOUNDS.explosions[number]);
  }

  function addPoints(pts){
    STATE.points += pts;
    for(var i = 0; i<notifyPoints.length; i++){
      notifyPoints[i](STATE.points);
    }
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
    if(input.isDown('DOWN') || input.isDown('s')) {
      movePlayer('down', dt);
    }

    if(input.isDown('UP') || input.isDown('w')) {
      movePlayer('up', dt);
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
      movePlayer('left', dt);
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
      movePlayer('right', dt);
    } 

    if(input.isDown('f')) {
      megaShoot();
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
    updateLevelsDirector(dt,realtimeDt);
    handleInput(dt);
    updateEntities(dt);
    checkCollisions();
    checkGameEndConditions();
  };

  function updateLevelsDirector(dt,realtimeDt){
    LEVELS_DIRECTOR.update(dt,realtimeDt);

    if(LEVELS_DIRECTOR.shouldAddEnemy() == true ){
      enemies.push(LEVELS_DIRECTOR.createEnemy([canvas.width, Math.random() * (canvas.height - 39)]));
    }
    
    if(LEVELS_DIRECTOR.shouldAddBoss() == true ){
      bosses.push(LEVELS_DIRECTOR.createBoss([canvas.width, canvas.height/2]));
      STATE.background_speed = 1.6;
    }

    if(LEVELS_DIRECTOR.shouldAddBonus()){
      bonuses.push(LEVELS_DIRECTOR.createBonus([canvas.width, Math.random() * (canvas.height - 39)]));
    }
  }

  function updateEntities(dt,realtimeDt) {
    updatePlayer(dt);
    updateBosses(dt);
    updateBullets(dt);
    updateEnemies(dt);
    updateSpecials(dt);
    updateExplosions(dt);
    updateBonuses(dt);
    updateBonusWeapons(dt);   
    updateEnemyBullets(dt);
    SCENARIO.update(dt);
  }
  /* Helpers */
  function entityInFrontOfPlayer(entity){
    entity.pos = [player.pos[0]+ player.sprite.getSize()[0],player.pos[1]- player.sprite.getSize()[1]/2];
    return entity;
  }

  function updateSprite(dt){
    return function(entity){
      entity.sprite.update(dt);
      return entity;
    };
  }



  function isOutsideScreen(pos, size){
    return(pos[1] + size[1] < 0 || pos[1] - size[1] > canvas.height ||
       pos[0] + size[0] >= canvas.width || pos[0] + size[0] < 0);
  }

  function isOnTheScreenEdges(pos,sprite){
    return(pos[1] <= 0 || pos[1] + sprite.getSize()[1] >= canvas.height ||
       pos[0] + sprite.getSize()[0] >= canvas.width);
  }

  function removeIfOutsideScreen(entity){
    if(!isOutsideScreen(entity.pos ,entity.sprite.getSize())){
      return entity;
    }
  }
 
  function removeIfOutsideScreenAndNoDirectionsAvailable(entity){
    if(entity.dirs.length > 0 ){
      return entity;
    }
    if(!isOutsideScreen(entity.pos, entity.sprite.getSize())){
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
      entities.map(updateSprite(dt))
        .map(removeIfDone)
    ); 
  }

  function changeDirectionIfAvailable(dt){
    return function(entity){
      var nextDirection = petra.calculateNextDirection(entity,dt);
      if(isOnTheScreenEdges(nextDirection, entity.sprite)){
        if(entity.dirs && entity.dirs.length > 0){
          entity.dir = entity.dirs.pop();  
        }
      }
      return entity;
    }
  }

  function moveInCircleAround(around, dt){
    var dt = dt;
    //TODO We are changing around / by player cause the reference is getting lost
    
    return function(entity){ 
      var radius = player.sprite.getSize()[1] > player.sprite.getSize()[0] ? player.sprite.getSize()[1] : player.sprite.getSize()[0];
      var velocityPerSeconds = ((3600/60)*2* Math.PI) / 360; 
      //TODO: This may cause the dogge to move from the center of the circle, the Phi calculus agains a game time
      //it should be against something between 0 and 10 ? 
      var phi = velocityPerSeconds * TIMERS.gameTime;
      //We add 1000 to ensure the calculus is allways done for positive values
      ////It gets a weird behaviour with negative values on the x axis
      var angleInRadians = Math.atan(entity.pos[0]+1000, entity.pos[1]) + phi;
      var xC = radius * Math.cos(angleInRadians)+phi;
      var yC = radius * Math.sin(angleInRadians)+phi;

      xC = xC + player.pos[0];
      yC = yC + player.pos[1];
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
        player.bullet = 'bullet';
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
      if(entity.pos[0] + entity.sprite.getSize()[0] + margin >= canvas.width) {
        entity.pos = petra.moveLeft(entity.pos, entity.speed, dt);
      }
      if(entity.pos[1] > canvas.height){
        entity.pos = petra.moveUp(entity.pos, entity.speed, dt);
      }
      if(entity.pos[0] + entity.sprite.getSize()[0] < 0){
        entity.pos = petra.moveRight(entity.pos, entity.speed, dt);
      }
      if(entity.pos[1]  + entity.sprite.getSize()[1] < 0){
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
      if(!isOutsideScreen([entity.pos[0] + margin, entity.pos[1]], entity.sprite.getSize())){
        entity.readyForAction = true;
      }
      return entity;
    }
  }

  function entityStepsInTime(time, dt){
    return function(fn){
      return function(entity){
        if(!entity.lastStep || (entity.lastStep + dt) >time){
          entity.lastStep= dt;
          return fn(entity);
        }else{
          entity.lastStep +=dt;
          return entity;
        }
      }
    }
  }

  function shootThrottled(time, dt){
    return entityStepsInTime(time,dt)(function(entity){
      blueShoot([entity.pos[0] + entity.sprite.getSize()[0], entity.pos[1] + entity.sprite.getSize()[1]/2]);
      return entity;
    });
  }
  function playActionThrottled(time, dt){
    return entityStepsInTime(time,dt)(function(entity){
      playAction(entity.actions.pop(), entity);
      return entity;
    });
  }
  function playAction(action, entity){
    if(action =='enemyShoot'){
      console.log(entity.damage);
      enemyShoot(entity.pos, entity.damage);
    }else if(action == 'talk'){
      var phrases = ['killer', 'power','grunt'];
      var chosenPhrase = phrases[parseInt(Math.random() * phrases.length, 10)];
      
      playSound(SOUNDS[chosenPhrase]);
      
      var message = new models.Message(MESSAGES[chosenPhrase], main_enemy_name, 1500);
      showMessages([message]);
    }else if(action == 'launchEnemy'){
      enemies.push(EL.getEnemy(entity.pos, Math.ceil(Math.random() *5 )));
    };
  }

  function getBossActions(){
    var bossTemp = EL.getBoss(canvas.width, canvas.height);
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
      if(player.pos[1] < entity.pos[1]){
        entity.pos = petra.moveUp(entity.pos, entity.speed, dt);
      }

      if(player.pos[1] > entity.pos[1]){
        entity.pos = petra.moveDown(entity.pos, entity.speed, dt);
      }

      return entity;
    }
  }

  function changePlayerSpriteToShooting(shooting){
    if(shooting){
      player.sprite = EL.getEntity(main_character_name+'shooting', player.pos, player).sprite;
    }else{
      player.sprite = EL.getEntity(main_character_name, player.pos, player).sprite;
    }
  }
  /* Updates */
  
  function updatePlayer(dt){
    if(TIMERS.shootSpriteTime > 0){
      TIMERS.shootSpriteTime -= dt;
      if(TIMERS.shootSpriteTime <= 0){
        TIMERS.shootSpriteTime = 0;
        changePlayerSpriteToShooting(false);
      }
    }

    if(touchInputs){
      player.pos[0] = petra.lerp3(player.pos[0], touchInputs.pos.x,player.speed, dt) ;
      player.pos[1] = petra.lerp3(player.pos[1], touchInputs.pos.y,player.speed, dt) ;
    }

    player.sprite.update(dt);
  }
  function movePlayer(dir,dt){
    player.dir = dir;
    player = petra.moveToDirection(dt)(player);
  }
  function updateEntititesAndMoveAndRemoveIfOutsideScreen(entities, dt){
    return hu.compact(
      entities.map(updateSprite(dt))
      .map(petra.moveToDirection(dt))
      .map(removeIfOutsideScreen));
  }
  function updateBullets(dt){
    bullets = updateEntititesAndMoveAndRemoveIfOutsideScreen(bullets, dt);
  }

  function updateEnemyBullets(dt){
    enemyBullets = updateEntititesAndMoveAndRemoveIfOutsideScreen(enemyBullets, dt);
  }

  function updateEnemies(dt){
    enemies = hu.compact(
      enemies.map(updateSprite(dt))
      .map(petra.moveToDirection(dt))
      .map(petra.removeIfOutsideScreenleft));
  }

  
  function updateSpecials(dt){
    specials = updateEntititesAndMoveAndRemoveIfOutsideScreen(specials, dt);
  }
  
  function updateExplosions(dt){
    explosions = updateEntitiesAndRemoveIfDone(explosions, dt);        
  }
  function updateBonuses(dt){
    bonuses = hu.compact(bonuses
      .map(wrapperNotReadyForActionOnly(moveInsideScreen(dt, 10)))
      .map(wrapperNotReadyForActionOnly(readyForActionIfInsideScreen(10))));

    bonuses = hu.compact(hu.compact(bonuses
      .map(wrapperReadyForActionOnly(changeDirectionIfAvailable(dt)))
      .map(wrapperReadyForActionOnly(petra.moveToDirection(dt)))
      .map(ifCollidesApplyBonusTo(player))
      .map(removeIfOutsideScreenAndNoDirectionsAvailable))
      .map(removeIfCollideWith(player)));
  }

  function updateBonusWeapons(dt){
    bonusWeapons = hu.compact(bonusWeapons.map(moveInCircleAround(player, dt))
      .map(updateTimeCounter(dt))
      .map(shootThrottled(0.5, dt))
      .map(removeBonusIfTImeGreaterThan(15)));
  }

  function updateBosses(dt){
    bosses = hu.compact(bosses
      .map(updateSprite(dt))
      .map(wrapperNotReadyForActionOnly(moveInsideScreen(dt,50)))
      .map(readyForActionIfInsideScreen(50))
      .map(wrapperReadyForActionOnly(playActionThrottled(0.7,dt)))
      .map(resetBossActionsIfEmpty)
      .map(moveToPlayerVertically(dt)));
  }

  function updateGraves(dt){
    graves = hu.compact(
      graves.map(updateSprite(dt))
      .map(endPostGameIfDone));
  }

  /****************************
  ****************************
    Collision Handling
  ****************************
  ****************************/   
  function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 || b <= y2 || y > b2);
  }

  function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
  }

  function entitiesCollide(a,b){
    return boxCollides(a.pos, a.sprite.getSize(), b.pos, b.sprite.getSize());
  }

  
  function ifCollidesApplyBonusTo(entity){
    return function(bonus){
      if(entitiesCollide(entity,bonus)){
        LEVELS_DIRECTOR.pickedBonus();
        entity.hasBonus = true;
        entity.bullet = 'nyanbullet';
        addPoints(200);
        entity.life = entity.life >= entity.totalLife ? entity.totalLife : entity.life + 200;
        entity.damage = entity.baseDamage + 50;
        bonusWeapons = [EL.getEntity('bonusWeapon', [entity.pos[0] , entity.pos[1]])];
        playSound(SOUNDS.yeah);

        var message = new models.Message(MESSAGES.wow, bonus_image_name, 1500);
        showMessages([message]);

      }
      return bonus;
    }
  }
  function ifCollidesApplyDamageTo(entity){
    return function(item){
      if(entitiesCollide(entity,item)){
        entity.life -= item.damage;
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
    playSound(SOUNDS.ouch);
    player.life -= damage;

    var messageOuch = new models.Message(MESSAGES.ouch, (player.isSuperSaiyan ? main_character_super_damaged : main_character_damaged))
    showMessages([messageOuch]);
  }

  function killEnemy(enemy){
    LEVELS_DIRECTOR.killedEnemy(enemy);
    addPoints(enemy.points);
    addPower(enemy.points);
    playSound(SOUNDS.death);
    addExplosion(enemy.pos);    
  }

  function collisionToEnemyGroup(enemyGroup){
      enemyGroup = hu.compact(enemyGroup.map(function(enemy){

        bullets = hu.compact(bullets.map(ifCollidesApplyDamageTo(enemy))
          .map(removeIfCollideWith(enemy)));
          
        specials
          .map(ifCollidesApplyDamageTo(enemy));

        if(entitiesCollide(enemy, player)){
          playerDamaged(enemy.damage);
          enemy.life -= player.damage;
        }

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
    else if(player.pos[0] > canvas.width - player.sprite.getSize()[0]) {
      player.pos[0] = canvas.width - player.sprite.getSize()[0];
    }

    if(player.pos[1] < 0) {
      player.pos[1] = 0;
    }
    else if(player.pos[1] > canvas.height - player.sprite.getSize()[1]) {
      player.pos[1] = canvas.height - player.sprite.getSize()[1];
    }
  }

  /****************************
  ****************************
    Drawables
  ****************************
  ****************************/   
  var BGx = 0;

  function render() {
    BGx -= STATE.background_speed * STATE.game_speed;
    ctx.fillRect(BGx + canvas.width, 0, canvas.width, canvas.height);
    ctx.drawImage(resources.get('images/background.png'), BGx, 0,canvas.width, canvas.height);
    ctx.drawImage(resources.get('images/background.png'), BGx + canvas.width, 0,canvas.width, canvas.height);
 
    // If the image scrolled off the screen, reset
    if (BGx < -canvas.width){
      BGx =0;
    }
  
   
    var entitiesToRender = [
      bullets,
      enemyBullets,
      enemies,
      explosions,
      specials,
      bonuses,
      bosses
      ];

   if(!isGameOver()) {
      entitiesToRender.push([player]);
      if(player.hasBonus){
        entitiesToRender.push(bonusWeapons);
      }
    }else{
      entitiesToRender.push(graves);
    }

    SCENARIO.render(entitiesToRender)
  };

  

  /****************************
  ****************************
     Game Suscriptions
  ****************************
  ****************************/  
  function suscribeGameOver( fn){
    notifyGameEnd.push(fn);
  }
  function suscribeLevelUp( fn){
    notifyLevelUp.push(fn);
  }
  function suscribePoints(fn){
    notifyPoints.push(fn);
  }
  function suscribeMessages(fn){
    notifyMessages.push(fn);
  }
  function suscribePower(fn){
    notifyPower.push(fn);
  }
  function suscribeMaxPower(fn){
    notifyMaxPower.push(fn);
  }
  function setSound(bool){
    STATE.sound_enabled = bool;
  }
  function setSoundInGame(bool){
    if(!STATE.sound_enabled){
      STATE.sound_enabled = bool;
      playSound(SOUNDS.ambient);
    }else{
      pauseAmbientSound();
      STATE.sound_enabled = bool;
    }
  }
  function setDifficulty(speed){
    STATE.game_speed = speed;
  }

  /****************************
  ****************************
    GAME API
  ****************************
  ****************************/
  var GAME = function() {
    return {
      suscribeGameOver : suscribeGameOver,
      suscribeLevelUp : suscribeLevelUp,
      suscribePoints : suscribePoints,
      suscribePower : suscribePower,
      suscribeMessages: suscribeMessages,
      megaShoot : megaShoot,
      setSound : setSound,
      setSoundInGame: setSoundInGame,
      setDifficulty: setDifficulty,
      endGame : endGame,
      start : start,
      restart : restart,
      pause: pause,
      resume : resume,
      shoot: shoot
    };
  }

  return  GAME;

});