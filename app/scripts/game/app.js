define( [ 'jquery','hu','game/entities','resources','sprite','input', 'jqmobile'], function($,hu, EL){
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

  /****************************
  ****************************
    GAME Variables
  ****************************
  ****************************/
  var STATE = {
    sound_enabled: true,
    final_stage : false,
    level: 1,
    points : 0,
    default_power: 0,
    max_power :1000,
    game_over: false,
    paused: false,
    resources_loaded: false
  };

  var TIMERS = {
    lastFire : Date.now(),
    lastTime: Date.now(),
    gameTime: 0
  };

  var bullets = [],
    bombs = [],
    bombareas = [],
    enemies = [],
    explosions = [],
    specials = [],
    bonuses = [],
    player = {};

  var canvas, ctx, power = 0;
  var terrainPattern;

  //Suscribe to events of the game
  var notifyGameEnd = [];
  var notifyPoints = [];
  var notifyLevelUp = [];
  var notifyPower = [];
  var notifyMaxPower = [];

  var SOUNDS = {
    death: new Howl({
      urls: ['sounds/cut_grunt2.wav']
    }),
    shoot: new Howl({
      urls: ['sounds/laser5.wav'],
      volumme: 0.1
    }),
    explosion: new Howl({
      urls: ['sounds/atari_boom2.wav']
    }),
    ambient: new Howl({
      urls: ['sounds/April_Kisses.mp3'],
      loop: true
    }),
    nyan: new Howl({
      urls: ['sounds/upmid.wav']
    })
  };

  /****************************
  ****************************
    GAME Initialization
  ****************************
  ****************************/

  //Resources loaded asynchronously
  resources.load([
      'images/newsprites.png',
      'images/boom.png',
      'images/background.png',
      'images/orbes/bonus.png'
  ]);

  //Flag for initialization
  resources.onReady(function() {
    STATE.resources_loaded = true;
  });

  // The main game loop
  var main = function() {
    var now = Date.now();
    var dt = (now - TIMERS.lastTime) / 1000.0;
    if(!isGameOver() && !isPaused()){
      update(dt);
      render();
    }
    TIMERS.lastTime = now;
    requestAnimFrame(main);
  };

  function start() {
    //wait till resources loaded
    if(!STATE.resources_loaded){
      requestAnimFrame(start);
      return;
    }
    initCanvas();
    reset();
    suscribeToEvents();
    playSound(SOUNDS.ambient);
    main();
  };

  function initCanvas(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    $(canvas).on('vclick',function(e){
      var x = e.pageX - $(canvas).offset().left;
      var y = e.pageY - $(canvas).offset().top;
      bombs.push(EL.getEntity('bomb', [x, y]));                             
    });
  };

  function reset() {
    STATE = {
      sound_enabled: true,
      final_stage : false,
      level: 1,
      points : 0,
      power: 0,
      max_power :1000,
      game_over: false,
      paused: false,
      resources_loaded: true
    };

    bullets = [];
    bombs = [];
    bombareas = [];
    enemies = [];
    explosions = [];
    specials = [];
    bonuses = [];
    player = EL.getEntity('player', [50, canvas.height / 2]);

    TIMERS = {
      lastFire : Date.now(),
      lastTime: Date.now(),
      gameTime: 0
    };
  };

  function suscribeToEvents(){
    suscribeMaxPower(function(bool){
      if(bool){

        player = EL.getEntity('superPlayer', player.pos, {life:player.life, totalLife: player.totalLife});
      }else{
        player = EL.getEntity('player', player.pos ,{life:player.life, totalLife: player.totalLife});
      }
    });
  }

  /****************************
  ****************************
    GAME State modifiers
  ****************************
  ****************************/
  
  function endGame() {
    STATE.game_over = true;
    stopAmbientSound();
    for(var i = 0; i<notifyGameEnd.length; i++){
      notifyGameEnd[i]();
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
  }

  function playSound(sound){
    if(!isPaused() && !isGameOver() && STATE.sound_enabled){
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
    STATE.level++;
    TIMERS.gameTime = 10 * STATE.level;
    
    for(var i = 0; i<notifyLevelUp.length; i++){
      notifyLevelUp[i](STATE.level);
    }
  }

  function shoot(){
    if(!isGameOver() &&
      Date.now() - TIMERS.lastFire > 100) {

      var x = player.pos[0] + player.sprite.size[0] / 2;
      var y = player.pos[1] + player.sprite.size[1] / 2;

      bullets.push(EL.getEntity('bullet', [x,y], { damage: player.damage }));
      bullets.push(EL.getEntity('topBullet', [x,y], { damage: player.damage/2 }));
      bullets.push(EL.getEntity('bottomBullet', [x,y], { damage: player.damage/2 }));
    
      playSound(SOUNDS.shoot);
      TIMERS.lastFire = Date.now();
    }
  }

  function megaShoot(){
    setPower(0);
    playSound(SOUNDS.nyan);
    specials.push(EL.getEntity('special', [player.pos[0] + player.width, player.pos[1] - player.height/2]));
  }
 
  function addExplosion(pos){
    explosions.push(EL.getEntity('explosion',pos));
    playSound(SOUNDS.explosion);
  }

  function addPoints(pts){
    if((STATE.points < 3000 && STATE.points + pts >= 3000)
     ||(STATE.points < 10000 && STATE.points + pts >= 10000)
     ||(STATE.points < 50000 && STATE.points + pts >= 50000)
     ||(STATE.points < 100000 && STATE.points + pts >= 100000)
     ||(STATE.points < 200000 && STATE.points + pts >= 200000)
    ){
      changeLevel();
    }

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

    if(input.isDown('SPACE') ){
      shoot();
    }
  }

  /****************************
  ****************************
    Entity update
  ****************************
  ****************************/
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
  var createBonus = throttle(function(){
     console.log(bonuses);
    console.log('creating boinus', bonuses.length);
    bonuses.push(EL.getEntity('bonus',[canvas.width, Math.random() * (canvas.height - 39)]));
  }, 5000);
  function update(dt) {
    TIMERS.gameTime += dt;
    handleInput(dt);
    updateEntities(dt);

    // It gets harder over time by adding enemies using this
    // equation: 1-.993^gameTime
    if(STATE.level < 6 && !STATE.final_stage){
      var value = Math.random() < 1 - Math.pow(.999, TIMERS.gameTime);
      //console.log(parseInt(TIMERS.gameTime,10))
      if(value) {
        enemies.push(EL.getEnemy(STATE.level, canvas.width, canvas.height));
      }
      //TODO: add it only every 5 seconds
      if(parseInt(TIMERS.gameTime,10)%5 === 0 && parseInt(TIMERS.gameTime,10) > 5){
       // createBonus();
      }

      createBonus();
    }else if(!STATE.final_stage){
      enemies.push(EL.getEnemy(STATE.level, canvas.width, canvas.height));
      STATE.final_stage = true;
    }
   
    checkCollisions();
  };

  function updateEntities(dt) {
    player.sprite.update(dt);
    updateBullets(dt);
    updateEnemies(dt);
    updateBombs(dt);
    updateBombAreas(dt);
    updateSpecials(dt);
    updateExplosions(dt);
    updateBonuses(dt);
  }
  /* Helpers */
  function entityInFrontOfPlayer(entity){
    entity.pos = [player.pos[0]+ player.width,player.pos[1]- player.height/2];
    return entity;
  }

  function updateSprite(dt){
    return function(entity){
      entity.sprite.update(dt);
      return entity;
    };
  }
  function calculateNextDirection(entity, dt){
    var pos = [entity.pos[0], entity.pos[1]];
    switch(entity.dir) {
      case 'up': 
        pos[1] = entity.pos[1] - entity.speed * dt; break;
      case 'down': pos[1] = entity.pos[1] + entity.speed * dt; break;
      case 'left': pos[0] = entity.pos[0] - entity.speed * dt; break;
      case 'right': pos[0] = entity.pos[0] + entity.speed * dt; break;
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
    return(pos[1] + sprite.size[1] < 0 || pos[1] - sprite.size[1] > canvas.height ||
       pos[0] - sprite.size[0] > canvas.width || pos[0] + sprite.size[0] < 0);
  }

  function isOnTheScreenEdges(pos,sprite){

    return(pos[1] <= 0 || pos[1] >= canvas.height ||
       pos[0] >= canvas.width);
  }

  function removeIfOutsideScreen(entity){
    if(!isOutsideScreen(entity.pos ,entity.sprite)){
      return entity;
    }
  }
  function removeIfOutsideScreenleft(entity){
    if(! (entity.pos[0] + entity.sprite.size[0] < 0) ) {
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

  function updateNormalEntities(entities, dt){
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

  /* Updates */
  function movePlayer(dir,dt){
    player.dir =dir;
    player = moveToDirection(dt)(player);
  }

  function updateBullets(dt){
    bullets = hu.compact(
      bullets.map(updateSprite(dt))
      .map(moveToDirection(dt))
      .map(removeIfOutsideScreen));
  }
  function updateEnemies(dt){
    enemies = hu.compact(
      enemies.map(moveToDirection(dt))
      .map(updateSprite(dt))
      .map(removeIfOutsideScreenleft));
  }
  function updateBombs(dt){
    bombs = hu.compact(
      bombs.map(updateSprite(dt))
      .map(pushBombIfDone)
      .map(removeIfDone));
  }
  function updateBombAreas(dt){
    bombareas = updateNormalEntities(bombareas,dt);
  }
  
  function updateSpecials(dt){
    specials = updateNormalEntities(specials.map(entityInFrontOfPlayer), dt);
  }
  
  function updateExplosions(dt){
    explosions = updateNormalEntities(explosions, dt);        
  }
  function updateBonuses(dt){
    bonuses = hu.compact(bonuses.map(changeDirectionIfAvailable(dt))
      .map(moveToDirection(dt))
      .map(removeIfOutsideScreen));
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
    return boxCollides(a.pos, a.sprite.size, b.pos, b.sprite.size);
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

  function checkCollisions() {
    checkPlayerBounds();
    
    enemies = hu.compact(enemies.map(function(enemy){
      bullets = hu.compact(bullets.map(ifCollidesApplyDamageTo(enemy)).map(removeIfCollideWith(enemy)));
      bombareas.map(ifCollidesApplyDamageTo(enemy));
      specials.map(ifCollidesApplyDamageTo(enemy));

      if(entitiesCollide(enemy, player)){
        player.life -= enemy.damage;
        enemy.life -= player.damage;
        if(player.life <= 0){
          console.log(player);
          endGame();
        } 
      }

      if(enemy.life > 0){
        return enemy;
      }else{
        console.log('removing enemy', enemies.length);
        addPoints(enemy.points);
        addPower(enemy.points);
        playSound(SOUNDS.death);
        addExplosion(enemy.pos);    
      }
    }));
  }

  function checkPlayerBounds() {
    if(player.pos[0] < 0) {
      player.pos[0] = 0;
    }
    else if(player.pos[0] > canvas.width - player.sprite.size[0]) {
      player.pos[0] = canvas.width - player.sprite.size[0];
    }

    if(player.pos[1] < 0) {
      player.pos[1] = 0;
    }
    else if(player.pos[1] > canvas.height - player.sprite.size[1]) {
      player.pos[1] = canvas.height - player.sprite.size[1];
    }
  }

  /****************************
  ****************************
    Drawables
  ****************************
  ****************************/   
  var BGx = 0;

  function render() {
    BGx -= 0.3;
    ctx.fillRect(BGx + canvas.width, 0, canvas.width, canvas.height);
    ctx.drawImage(resources.get('images/background.png'), BGx, 0,canvas.width, canvas.height);
    ctx.drawImage(resources.get('images/background.png'), BGx + canvas.width, 0,canvas.width, canvas.height);
 
    // If the image scrolled off the screen, reset
    if (BGx < -canvas.width){
      BGx =0;
    }
  
    if(!isGameOver()) {
      renderEntity(player);
    }else{
      console.log(STATE);
    }
    renderEntities(bombs);
    renderEntities(bombareas);
    renderEntities(bullets);
    renderEntities(enemies);
    renderEntities(explosions);
    renderEntities(specials);
    renderEntities(bonuses);
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
    var lifeTotal = entity.width * (entity.life/ entity.totalLife);

    ctx.beginPath();
    ctx.rect(entity.pos[0], entity.pos[1] + entity.height, entity.width, 7);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black'; 
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(entity.pos[0], entity.pos[1] + entity.height, lifeTotal, 7);
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
  var GAME = {
    suscribeGameOver : suscribeGameOver,
    suscribeLevelUp : suscribeLevelUp,
    suscribePoints : suscribePoints,
    suscribePower : suscribePower,
    megaShoot : megaShoot,
    setSound : setSound,
    setSoundInGame: setSoundInGame,
    endGame : endGame,
    start : start,
    pause: pause,
    resume : resume,
    shoot: shoot
   };

  return  GAME;

});