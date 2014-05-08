define( [ 'hu','game/entities','resources','sprite','input'], function(hu, EL){
  /****************************
  ****************************
    Cross browser animation frame
  ****************************
  ****************************/
  var requestAnimFrame = (function(){
    return window.requestAnimationFrame  ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(callback){
        window.setTimeout(callback, 1000 / 60);
      };
  })();

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
      boss_out : false,
      level: 1,
      max_level: 5,
      iteration: 1,
      win: false,
      died: false,
      points : 0,
      enemiesInformation : {
        total: 0,
        picked: 0,
        levels: []
      },
      bonusesInformation : {
        total: 0,
        picked: 0
      },
      default_power: 0,
      max_power :1000,
      game_over: false,
      paused: false,
      post_game_completed : false,
      resources_loaded: false,
      background_speed: 0.3,
      game_speed: 1.0
    };

    for(var i = 0; i <= options.max_level;i++){
      options.enemiesInformation.levels.push({
        total:0,
        killed: 0
      });
    }
    return options;
  }
  var STATE = getDefaultState();

  function getDefaultTimers(){
    return {
      lastFire :0,
      lastTime: Date.now(),
      gameTime: 0
    };
  }
  var TIMERS = getDefaultTimers();

  var bullets = [],
    bombs = [],
    bombareas = [],
    enemies = [],
    explosions = [],
    specials = [],
    bonuses = [],
    bonusWeapons = [],
    bosses = [],
    enemyBullets = [],
    graves = [],
    player = {};

  var canvas, ctx, power = 0;
  var terrainPattern;

  //Suscribe to events of the game
  var notifyGameEnd = [];
  var notifyPoints = [];
  var notifyMessages = [];
  var notifyLevelUp = [];
  var notifyPower = [];
  var notifyMaxPower = [];

  //Touch inputs
  var touchInputs;

  var SOUNDS = {
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
      urls: ['sounds/songs/intro.mp3'],
      volume: 0.5,
      loop: true
    }),
    yeah: new Howl({
      urls: ['sounds/oh_yeah_wav_cut.wav']
    }),
    nyan: new Howl({
      urls: ['sounds/upmid.wav']
    }),
    rick: new Howl({
      urls: ['sounds/rickcut2.wav'],
      volume: 0.3
    }),
    killer: new Howl({
      urls: ['sounds/killer.mp3'],
      volume: 0.5
    }),
    grunt: new Howl({
      urls: ['sounds/grunt.mp3'],
      volume: 0.5
    }),
    power: new Howl({
      urls: ['sounds/power.mp3'],
      volume: 0.5
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

  MESSAGES = {
    killer: 'I am your killer...!',
    power: 'BEHOLD MY POWER!',
    grunt: 'graARRRLL!!!',
    wow: 'WOW! Such bonus...  Very power, much shoot',
    saiyan : 'Yaaaaaaay! Super saiyan!',
    nosaiyan: 'Tss... my power',
    init: "It's time, for other adventure, for other trip to the unknown...",
    not: 'Your trip will know a deadly end... B**CH',
    tst: 'Tstsk... You will have to pass over my rainbow',
    ouch: 'Ouch @#¡%%!! :('
  };

  /****************************
  ****************************
    GAME Initialization
  ****************************
  ****************************/

  //Resources loaded asynchronously
  resources.load([
      'images/newsprites.png',
      'images/background.png',
      'images/orbes/coin.png',
      'images/enemies/tacnyan.png',
      'images/bonusWeapon.png',
      'images/creeper.png',
      'images/weapons/twitter.png',
      'images/rick/rickrollsprite.png'
  ]);

  //Flag for initialization
  resources.onReady(function() {
    STATE.resources_loaded = true;
  });

  // The main game loop
  var main = function() {
    var now = Date.now();
    var dt = (now - TIMERS.lastTime) / 1000.0;
    dt = STATE.game_speed * dt;
    if(!isGameOver() && !isPaused()){
      update(dt);
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
    //wait till resources loaded
    if(!STATE.resources_loaded){
      requestAnimFrame(start);
      return;
    }
    initCanvas();
    toMouseListeners();
    reset();
    suscribeToEvents();
    showMessages([MESSAGES.init, MESSAGES.not, MESSAGES.tst],['cat', 'creeper', 'cat'], 4000,500);
    playSound(SOUNDS.ambient);
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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 43;
  };

  
  function toMouseListeners(){
    canvas = document.getElementById("canvas");
    canvas.addEventListener('touchmove', function(ev){
      var x = ev.targetTouches[0].pageX - canvas.offsetLeft;
      var y = ev.targetTouches[0].pageY - canvas.offsetTop;
      
      touchInputs = {
        pos: {
          x : x ,
          y : y
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
          y : y
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
    STATE = newState;

    bullets = [];
    bombs = [];
    bombareas = [];
    enemies = [];
    explosions = [];
    specials = [];
    bonuses = [];
    bonusWeapons = [];
    bosses = [];
    enemyBullets = [];
    graves = [];
    player = EL.getEntity('player', [50, canvas.height / 2]);

    TIMERS = getDefaultTimers();
  };

  function suscribeToEvents(){

    suscribeMaxPower(function(bool){
      if(bool){
        var superPlayerOptions =  EL.getEntity('superPlayer', player.pos, {life:player.life, totalLife: player.totalLife});
        player.sprite = superPlayerOptions.sprite;
        player.speed = superPlayerOptions.speed;
        player.damage = superPlayerOptions.damage;
        player.isSuperSaiyan = true;
        showMessages([MESSAGES.saiyan], ['saiyancat']);
      }else{
        var normalPlayerOptions =  EL.getEntity('player', player.pos, {life:player.life, totalLife: player.totalLife});
        player.sprite = normalPlayerOptions.sprite;
        player.speed = normalPlayerOptions.speed;
        player.isSuperSaiyan = false;
        player.damage = normalPlayerOptions.damage;
        //showMessages([MESSAGES.nosaiyan], ['cat']);
      }
    });

    /*suscribeMessages(function(messages,senders,timeoutMessage,timeoutBetweenMessages){
      STATE.game_speed = 0.4;
      
      window.setTimeout(function(){
        STATE.game_speed = 1.0;
      }, messages.length * (timeoutMessage+timeoutBetweenMessages));
    });*/
    
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

  function changeLevel(){
    STATE.enemiesInformation.levels[STATE.level-1].completed = true;
    STATE.level++;
    
    for(var i = 0; i<notifyLevelUp.length; i++){
      notifyLevelUp[i](STATE.level);
    }
  }

  function showMessages(messages, senders, timeoutMessage,timeoutBetweenMessages){
    timeoutMessage = timeoutMessage ? timeoutMessage : 2000;
    timeoutBetweenMessages = timeoutBetweenMessages ? timeoutBetweenMessages : 500;

    for(var i = 0; i < notifyMessages.length; i++){
      var messagesClone = messages.map(function(item){ return item });
      var sendersClone = senders.map(function(item){ return item });
      notifyMessages[i](messagesClone,sendersClone, timeoutMessage,timeoutBetweenMessages);
    }
  }

  function shoot(){
    if(!isGameOver() &&
      TIMERS.gameTime - TIMERS.lastFire > 0.100) {

      var x = player.pos[0] + player.sprite.getSize()[0] / 2;
      var y = player.pos[1] + player.sprite.getSize()[1] / 2;

      bullets.push(EL.getEntity(player.bullet, [x,y], { damage: player.damage }));
      bullets.push(EL.getEntity(player.topBullet, [x,y], { damage: player.damage/2 }));
      bullets.push(EL.getEntity(player.bottomBullet, [x,y], { damage: player.damage/2 }));
    
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
  var createBonus = throttle(function(){
    bonuses.push(EL.getEntity('bonus',[canvas.width, Math.random() * (canvas.height - 39)]));
    STATE.bonusesInformation.total+=1;
  }, 15000);

  function update(dt) {
    TIMERS.gameTime += dt;
    handleInput(dt);
    updateEntities(dt);

    // It gets harder over time by adding enemies using this
    // equation: 1-.993^gameTime
    if(STATE.level <= STATE.max_level && !STATE.boss_out){
      var value = Math.random() < 1 - Math.pow(.999, TIMERS.gameTime);

      if(value) {
        enemies.push(EL.getEnemy([canvas.width, Math.random() * (canvas.height - 39)], STATE.level));
        STATE.enemiesInformation.levels[STATE.level - 1].total+=1;
      }

      createBonus();
    }else if( !STATE.boss_out){
      bosses.push(EL.getBoss(canvas.width, canvas.height));
      createBonus();
      STATE.background_speed = 1.6;
      STATE.boss_out = true;
    }
   
    checkCollisions();
    checkLevelUpConditions();
    checkGameEndConditions();
  };

  function updateEntities(dt) {
    updatePlayer(dt);
    updateBosses(dt);
    updateBullets(dt);
    updateEnemies(dt);
    updateBombs(dt);
    updateBombAreas(dt);
    updateSpecials(dt);
    updateExplosions(dt);
    updateBonuses(dt);
    updateBonusWeapons(dt);   
    updateEnemyBullets(dt);
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

  function moveLeft(pos, speed, dt){
    return [pos[0] - speed * dt, pos[1]];
  }
  function moveRight(pos, speed, dt){
    return [pos[0] + speed * dt, pos[1]];
  }
  function moveDown(pos, speed, dt){
    return [pos[0], pos[1] + speed * dt];
  }
  function moveUp(pos, speed, dt){
    return [pos[0], pos[1] - speed * dt];
  }
  function calculateNextDirection(entity, dt){
    var pos = [entity.pos[0], entity.pos[1]];
    switch(entity.dir) {
      case 'up': 
        pos = moveUp(entity.pos, entity.speed, dt);
      break;
      case 'down': 
        pos = moveDown(entity.pos, entity.speed, dt);
      break;
      case 'left': 
        pos = moveLeft(entity.pos, entity.speed, dt);
      break;
      case 'right': 
        pos = moveRight(entity.pos, entity.speed, dt);
      break;
      case 'upleft': 
        pos[1] = entity.pos[1] - entity.speed * dt;
        pos[0] = entity.pos[0] - entity.speed * dt;
      break;
      case 'upright':
        pos[1] = entity.pos[1] - entity.speed * dt;
        pos[0] = entity.pos[0] + entity.speed * dt;
      break;
      case 'downleft':
        pos[1] = entity.pos[1] + entity.speed * dt;
        pos[0] = entity.pos[0] - entity.speed * dt;
      break;
      case 'downright':
        pos[1] = entity.pos[1] + entity.speed * dt;
        pos[0] = entity.pos[0] + entity.speed * dt;
      break;
      default:
        pos[0] = entity.pos[0] - entity.speed * dt;
    }
    return pos;
  }
  function moveToDirection(dt){
    return function(entity){
      var newPos = calculateNextDirection(entity, dt);
      entity.pos = newPos;
      return entity;
    }  
  }

  function isOutsideScreen(pos, sprite){
    return(pos[1] + sprite.getSize()[1] < 0 || pos[1] - sprite.getSize()[1] > canvas.height ||
       pos[0] + sprite.getSize()[0] >= canvas.width || pos[0] + sprite.getSize()[0] < 0);
  }

  function isOnTheScreenEdges(pos,sprite){
    return(pos[1] <= 0 || pos[1] + sprite.getSize()[1] >= canvas.height ||
       pos[0] + sprite.getSize()[0] >= canvas.width);
  }

  function removeIfOutsideScreen(entity){
    if(!isOutsideScreen(entity.pos ,entity.sprite)){
      return entity;
    }
  }
  function removeIfOutsideScreenleft(entity){
    if(! (entity.pos[0] + entity.sprite.getSize()[0] < 0) ) {
      return entity;
    }
  }
  function removeIfOutsideScreenAndNoDirectionsAvailable(entity){
    if(entity.dirs.length > 0 ){
      return entity;
    }
    if(!isOutsideScreen(entity.pos, entity.sprite)){
      return entity;
    }
  }

  function pushBombIfDone(entity){
    if(entity.sprite.done){
      bombareas.push(EL.getEntity('bombarea',entity.pos));
      playSound(SOUNDS.explosion);
    }
    return entity;
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
      var nextDirection = calculateNextDirection(entity,dt);
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
    var radius = around.sprite.getSize()[1] > around.sprite.getSize()[0] ? around.sprite.getSize()[1] : around.sprite.getSize()[0];
    return function(entity){ 
      var velocityPerSeconds = ((3600/60)*2* Math.PI) / 360; 
      var phi = velocityPerSeconds * TIMERS.gameTime;
      //We add 1000 to ensure the calculus is allways done for positive values
      ////It gets a weird behaviour with negative values on the x axis
      var angleInRadians = Math.atan(entity.pos[0]+1000, entity.pos[1]) + phi;
      var xC = radius * Math.cos(angleInRadians)+phi;
      var yC = radius * Math.sin(angleInRadians)+phi;

      xC = xC + around.pos[0];
      yC = yC + around.pos[1];
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
        entity.pos = moveLeft(entity.pos, entity.speed, dt);
      }
      if(entity.pos[1] > canvas.height){
        entity.pos = moveUp(entity.pos, entity.speed, dt);
      }
      if(entity.pos[0] + entity.sprite.getSize()[0] < 0){
        entity.pos = moveRight(entity.pos, entity.speed, dt);
      }
      if(entity.pos[1]  + entity.sprite.getSize()[1] < 0){
        entity.pos = moveDown(entity.pos, entity.speed, dt);
      }
      return entity;
    }
  }

  function readyForActionIfInsideScreen(margin){
    if(!margin){
      margin = 0;
    }
    return function(entity){
      if(!isOutsideScreen([entity.pos[0] + margin, entity.pos[1]], entity.sprite)){
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
    switch(action){
      case 'enemyShoot':
        enemyShoot(entity.pos, entity.damage);;
      break;
      case 'talk':
        var phrases = ['killer', 'power','grunt'];
        var chosenPhrase = phrases[parseInt(Math.random() * phrases.length, 10)];
        playSound(SOUNDS[chosenPhrase]);
        showMessages([MESSAGES[chosenPhrase]], ['creeper']);
      break;
      case 'launchEnemy':
        enemies.push(EL.getEnemy(entity.pos, Math.ceil(Math.random() *5 )));
      break;
    }
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
        entity.pos = moveUp(entity.pos, entity.speed, dt);
      }

      if(player.pos[1] > entity.pos[1]){
        entity.pos = moveDown(entity.pos, entity.speed, dt);
      }

      return entity;
    }
  }
  /* Updates */
  function updatePlayer(dt){
    if(touchInputs){
      var signX = touchInputs.pos.x  > player.pos[0] ? 1 :  -1;
      var signY = touchInputs.pos.y > player.pos[1]  ? 1 :  -1;
      var diffX = touchInputs.pos.x - signX * player.pos[0];
      var diffY = touchInputs.pos.y - signY * player.pos[1];

      if(diffX > 5){
        player.pos[0] += signX * player.speed * dt;
      }
      if(diffY > 5){
        player.pos[1] += signY * player.speed * dt;
      }
      
    }
    player.sprite.update(dt);
  }
  function movePlayer(dir,dt){
    player.dir = dir;
    player = moveToDirection(dt)(player);
  }
  function updateEntititesAndMoveAndRemoveIfOutsideScreen(entities, dt){
    return hu.compact(
      entities.map(updateSprite(dt))
      .map(moveToDirection(dt))
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
      .map(moveToDirection(dt))
      .map(removeIfOutsideScreenleft));
  }

  function updateBombs(dt){
    bombs = hu.compact(
      bombs.map(updateSprite(dt))
      .map(pushBombIfDone)
      .map(removeIfDone));
  }
  function updateBombAreas(dt){
    bombareas = updateEntitiesAndRemoveIfDone(bombareas,dt);
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
      .map(wrapperReadyForActionOnly(moveToDirection(dt)))
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
      .map(wrapperReadyForActionOnly(playActionThrottled(0.5,dt)))
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
        STATE.bonusesInformation.picked+=1;
        entity.hasBonus = true;
        entity.bullet = 'nyanbullet';
        addPoints(200);
        entity.life = entity.life >= entity.totalLife ? entity.totalLife : entity.life + 200;
        entity.damage = entity.baseDamage + 50;
        bonusWeapons = [EL.getEntity('bonusWeapon', [entity.pos[0] , entity.pos[1]])];
        playSound(SOUNDS.yeah);
        showMessages([MESSAGES.wow], ['dog']);
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
        playerDamaged();
      }else{
        return item;
      }
    }
  }
  function playerDamaged(){
    playSound(SOUNDS.ouch);
    showMessages([MESSAGES.ouch], [(player.isSuperSaiyan ? 'saiyancatdamaged': 'catdamaged')]);
  }
  function checkCollisions() {
    checkPlayerBounds();
    
    enemies = hu.compact(enemies.map(function(enemy){

      bullets = hu.compact(bullets.map(ifCollidesApplyDamageTo(enemy))
        .map(removeIfCollideWith(enemy)));

      bombareas
        .map(ifCollidesApplyDamageTo(enemy));
        
      specials
        .map(ifCollidesApplyDamageTo(enemy));

      if(entitiesCollide(enemy, player)){
        playerDamaged();
        player.life -= enemy.damage;
        enemy.life -= player.damage;
      }

      if(enemy.life > 0){
        return enemy;
      }else{
        STATE.enemiesInformation.levels[STATE.level - 1].killed+=1;
        addPoints(enemy.points);
        addPower(enemy.points);
        playSound(SOUNDS.death);
        addExplosion(enemy.pos);    
      }
    }));

    enemyBullets = hu.compact(enemyBullets.map(ifCollidesApplyDamageTo(player))
        .map(removeIfCollideWithAndPlaySound(player)));

    bosses = hu.compact(bosses.map(function(enemy){
      bullets = hu.compact(bullets.map(ifCollidesApplyDamageTo(enemy))
        .map(removeIfCollideWith(enemy)));

      bombareas
        .map(ifCollidesApplyDamageTo(enemy));
        
      specials
        .map(ifCollidesApplyDamageTo(enemy));

      if(entitiesCollide(enemy, player)){
        playerDamaged();
        player.life -= enemy.damage;
        enemy.life -= player.damage;
      }

      if(enemy.life > 0){
        return enemy;
      }else{
        addPoints(enemy.points);
        addPower(enemy.points);
        playSound(SOUNDS.death);
        addExplosion(enemy.pos);    
      }
    }));
   
  }

  function checkLevelUpConditions(){
    if(TIMERS.gameTime > 30 && STATE.level === 1
      || TIMERS.gameTime > 60 && STATE.level === 2
      || TIMERS.gameTime > 90 && STATE.level === 3
      || TIMERS.gameTime > 120 && STATE.level === 4
      || TIMERS.gameTime > 160 && STATE.level === 5){
      changeLevel();
    }
  }

  function checkGameEndConditions(){
    if(player.life <= 0){
      STATE.died = true;
      endGame();
    }else if(STATE.boss_out && bosses.length == 0 && enemies.length == 0){
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
  
    if(!isGameOver()) {
      renderEntity(player);
      if(player.hasBonus){
        renderEntities(bonusWeapons);
      }
    }else{
      renderEntities(graves);
    }
    renderEntities(bombs);
    renderEntities(bombareas);
    renderEntities(bullets);
    renderEntities(enemyBullets);
    renderEntities(enemies);
    renderEntities(explosions);
    renderEntities(specials);
    renderEntities(bonuses);
    renderEntities(bosses);
  };

  function renderEntities(list) {
    for(var i=0; i<list.length; i++) {
      renderEntity(list[i]);
    }    
  }

  function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
    if(entity.life){
      drawLife(entity);
    }
  }

  function drawLife(entity){
    var lifeTotal = entity.sprite.getSize()[0] * (entity.life/ entity.totalLife);

    ctx.beginPath();
    ctx.rect(entity.pos[0], entity.pos[1] + entity.sprite.getSize()[1], entity.sprite.getSize()[0], 7);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black'; 
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(entity.pos[0], entity.pos[1] + entity.sprite.getSize()[1], lifeTotal, 7);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.stroke();
  }

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