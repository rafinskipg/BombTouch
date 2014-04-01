define( [ 'jquery','hu','game/entities','resources','sprite','input', 'jqmobile'], function($,hu, EL){
  // A cross-browser requestAnimationFrame
  // See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
  var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(callback){
          window.setTimeout(callback, 1000 / 60);
      };
  })();

  /**
   Game variables
  **/
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
  /**
   End game variables
  **/

  //Resources
  resources.load([
      'images/newsprites.png',
      'images/boom.png',
      'images/background.png'
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

  // Reset game to original state
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
      resources_loaded: true,
      game_time: 0
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
        player = EL.getEntity('superPlayer', [player.pos.x, player.pos.y]);
      }else{
        player = EL.getEntity('player', [player.pos.x, player.pos.y]);
      }
    });
  }
    
  // Game over
  function endGame() {
    STATE.game_over = true;
    stopAmbientSound();
    for(var i = 0; i<notifyGameEnd.length; i++){
      notifyGameEnd[i]();
    }
  }
   //Check if is game over
  function isGameOver(){
      return STATE.game_over;
  }

  //Pause game
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

  //Stages
  function changeLevel(){
    STATE.level++;
    STATE.gameTime = 10 * STATE.level;
    
    for(var i = 0; i<notifyLevelUp.length; i++){
      notifyLevelUp[i](STATE.level);
    }
  }

  //Shoot
  function shoot(){
    if(!isGameOver() &&
      Date.now() - TIMERS.lastFire > 100) {

      var x = player.pos[0] + player.sprite.size[0] / 2;
      var y = player.pos[1] + player.sprite.size[1] / 2;

      bullets.push(EL.getEntity('bullet', [x,y]));
      bullets.push(EL.getEntity('topBullet', [x,y]));
      bullets.push(EL.getEntity('bottomBullet', [x,y]));
    
      playSound(SOUNDS.shoot);
      TIMERS.lastFire = Date.now();
    }
  }

  //Shoot X RAY
  function megaShoot(){
    setPower(0);
    playSound(SOUNDS.nyan);
    specials.push(EL.getEntity('special', [player.pos[0] + player.width, player.pos[1] - player.height/2]));
  }
 

  //Add points
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
    
  // Add power
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

  // Update game objects
  function update(dt) {
    STATE.gameTime += dt;

    handleInput(dt);
    updateEntities(dt);

    // It gets harder over time by adding enemies using this
    // equation: 1-.993^gameTime
    if(STATE.level < 6 && !STATE.final_stage){
      var value = Math.random() < 1 - Math.pow(.999, STATE.gameTime);
      if(value) {
        enemies.push(EL.getEnemy(STATE.level, canvas.width, canvas.height));
      }
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
  }

  /** UPDATE ENTITIES */
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

  function moveToDirection(dt){
    return function(entity){
      switch(entity.dir) {
      case 'up': entity.pos[1] -= entity.speed * dt; break;
      case 'down': entity.pos[1] += entity.speed * dt; break;
      case 'left': entity.pos[0] -= entity.speed * dt; break;
      case 'right': entity.pos[0] += entity.speed * dt; break;
      default:
        entity.pos[0] += entity.speed * dt;
      }
      return entity;
    }  
  }

  function removeIfOutsideScreen(entity){
    if(entity.pos[1] < 0 || entity.pos[1] > canvas.height ||
       entity.pos[0] > canvas.width) {
        return void 0;
    }else{
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


  /**
   COLLISION HANDLING
  **/
  function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 || b <= y2 || y > b2);
  }

  function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
  }

    function checkCollisions() {
        checkPlayerBounds();
        
        // Run collision detection for all enemies and bullets
        for(var i=0; i<enemies.length; i++) {
            var pos = enemies[i].pos;
            var size = enemies[i].sprite.size;

            //Damage from bullets
            for(var j=0; j<bullets.length; j++) {
                var pos2 = bullets[j].pos;
                var size2 = bullets[j].sprite.size;

                if(boxCollides(pos, size, pos2, size2)) {
                    enemies[i].life -=  bullets[j].damage;
                    // Remove the bullet and stop this iteration
                    bullets.splice(j, 1);
                    break;
                }
            }
             
            //Damage from bombareas
            for(var z= 0; z<bombareas.length; z++){
                var pos2 = bombareas[z].pos;
                var size2 = bombareas[z].sprite.size;

                if(boxCollides(pos, size, pos2, size2)) {
                    enemies[i].life -=  bombareas[z].damage;
                    break;
                }
            }

            //Damage from bombareas
            for(var z= 0; z<specials.length; z++){
                var pos2 = specials[z].pos;
                var size2 = specials[z].sprite.size;

                if(boxCollides(pos, size, pos2, size2)) {
                    enemies[i].life -=  specials[z].damage;
                    break;
                }
            }

            //If collides with Nyancat
            if(boxCollides(pos, size, player.pos, player.sprite.size)) {
                player.life -= enemies[i].damage;
                enemies[i].life -= player.damage;

                if(player.life <= 0){
                    endGame();
                } 
            }

            if(enemies[i].life <= 0){
                // Add score
                addPoints(enemies[i].points);

                // Add power
                addPower(enemies[i].points);

                // Remove the enemy
                enemies.splice(i, 1);
                i--;

                playSound(SOUNDS.death);
                // Add an explosion
                addExplosion(pos);
               
                if(enemies.length == 0 && final_stage){
                    console.log('YOU WON');
                    alert('you won, now random shit');
                    for (var i = 0; i < 100; i++){
                        level = Math.floor(Math.random()* 5)+1;
                        enemies.push(getEnemy());
                    }
                }
            }
        }
    }

    function addExplosion(pos){
        explosions.push(EL.getEntity('explosion',pos));
        playSound(SOUNDS.explosion);
    }
    
    function checkPlayerBounds() {
        // Check bounds
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
    var BGx = 0;
    // Draw everything
    function render() {
        //ctx.fillStyle = terrainPattern;
        BGx -= 0.3;
        //ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(BGx + canvas.width, 0, canvas.width, canvas.height);
        
       ctx.drawImage(resources.get('images/background.png'), BGx, 0,canvas.width, canvas.height);
       ctx.drawImage(resources.get('images/background.png'), BGx + canvas.width, 0,canvas.width, canvas.height);
     
        // If the image scrolled off the screen, reset
       if (BGx < -canvas.width){
              BGx =0;
        }
      
        // Render the player if the game isn't over
        if(!isGameOver()) {
            renderEntity(player);
        }

        renderEntities(bombs);
        renderEntities(bombareas);
        renderEntities(bullets);
        renderEntities(enemies);
        renderEntities(explosions);
        renderEntities(specials);
        renderPower();
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
    
    function renderPower(){
        var powerColor = STATE.power == STATE.max_power ?  'red': 'blue' ;
        var totalPower = window.innerWidth/3 *( STATE.power / STATE.max_power);

        ctx.beginPath();
        ctx.rect(window.innerWidth/3, 10, window.innerWidth/3, 20);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black'; 
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(window.innerWidth/3, 10, totalPower, 20);
        ctx.fillStyle = powerColor;
        ctx.fill();
        ctx.stroke();
    }    

    
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

  //API 
  return  GAME;

});