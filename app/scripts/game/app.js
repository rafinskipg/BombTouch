define( [ 'jquery','hu','entities','resources','sprite','input', 'jqmobile'], function($,hu, entities){
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

  //GAME DATA
  var gameState = {
    soundActivated: true,
    finalStage : false, 
    level: 1,
    POINTS : 0,
    DEFAULT_POWER: 0,
    MAX_POWER :1000,
    GAME_OVER: false,
    PAUSED: false,
    RESOURCES_LOADED: false
  };

  var gameEntities = {
    bullets: [],
    bombs : [],
    bombareas: [],
    enemies: [],
    explosions: [],
    specials: [],
    bonuses: [],
    player = {
      pos: [0, 0],
      life: 1,
      totalLife: 1,
      height: 35,
      width: 88,
      damage: 80,
      speed: 200,
      sprite: new Sprite('images/newsprites.png', [7, 304], [88,35], 4, [0, 1,2,3,4])
    }
  };

   // var sounds
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

  var canvas, ctx, power = 0;
  var lastFire = Date.now();
  var gameTime = 0,lastTime = 0 ;
  var terrainPattern;
  
  var bulletSpeed = 500;
  var bombTime = 800;
  var bombAreaTime = 800;
  

  //Suscribe to events of the game
  var notifyGameEnd = [];
  var notifyPoints = [];
  var notifyLevelUp = [];
  var notifyPower = [];
  var notifyMaxPower = [];

  //Resources
  resources.load([
      'images/newsprites.png',
      'images/boom.png',
      'images/background.png'
  ]);

  //Flag for initialization
  resources.onReady(function() {
    gameState.RESOURCES_LOADED = true
  });

  // The main game loop
  var main = function() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    if(!isGameOver() && !isPaused()){
      update(dt);
      render();
    }
    lastTime = now;
    requestAnimFrame(main);
  };

  //Start Game
  var start = function() {
    //wait till resources loaded
    if(!gameState.RESOURCES_LOADED){ requestAnimFrame(start); return; }
    initCanvas();
    reset();
    //suscribe changing the player sprite 
    suscribeMaxPower(function(bool){
      if(bool){
        bulletDamage +=80;
        player.sprite =  new Sprite('images/newsprites.png', [4, 400], [88,35], 4, [0, 1,2,3,4]);
      }else{
        bulletDamage = 50;
        player.sprite =  new Sprite('images/newsprites.png', [7, 304], [88,35], 4, [0, 1,2,3,4])
      }
    });

    playSound(SOUNDS.ambient);
    lastTime = Date.now();
    main();
  }

  var initCanvas = function initCanvas(){
    // Create the canvas
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //terrainPattern = ctx.createPattern(resources.get('images/bg2.BMP'), 'repeat');

    $(canvas).on('vclick',function(e){
      var canvasPosition = {
          x: $(canvas).offset().left,
          y: $(canvas).offset().top
      };
      var mouse= {
          x: e.pageX - canvasPosition.x,
          y: e.pageY - canvasPosition.y
      }
      bombs.push(entities.getEntity('bomb', [mouse.x, mouse.y]));                             
    });
  }

  function shoot(){
    if(!isGameOver() &&
      Date.now() - lastFire > 100) {

      var x = player.pos[0] + player.sprite.size[0] / 2;
      var y = player.pos[1] + player.sprite.size[1] / 2;

      bullets.push(entities.getEntity('bullet', [x,y]));
      bullets.push(entities.getEntity('topBullet', [x,y]));
      bullets.push(entities.getEntity('bottomBullet', [x,y]));
    
      playSound(SOUNDS.shoot);
      lastFire = Date.now();
    }
  }

  // Reset game to original state
  function reset() {
    bonuses = [];
    gameOver = false;
    gameTime = 0;
    points = 0;
    level = 1;
    paused = false;
    bulletDamage = DEFAULT_BULLET_DAMAGE;
    finalStage = false;
    setPower(0);
    bombs = [];
    bombareas = [];
    enemies = [];
    bullets = [];
    specials =[];
    player.pos = [50, canvas.height / 2];
    player.life = player.totalLife;
  };
    
    // Game over
    function endGame() {
        gameOver = true;
        stopAmbientSound();
        for(var i = 0; i<notifyGameEnd.length; i++){
            notifyGameEnd[i]();
        }
    }

    //Pause game
    function pause(){
        paused = true;
        pauseAmbientSound();
    }
    function resume(){
        paused = false;
        playSound(SOUNDS.ambient);
    }

    function playSound(sound){
      if(!paused && !isGameOver() &&soundActivated){
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
        level++;
        gameTime = 10 * level;
        
        for(var i = 0; i<notifyLevelUp.length; i++){
            notifyLevelUp[i](level);
        }
    }
    //Add points
    function addPoints(pts){
        if((points < 3000 && points+pts >= 3000)
         ||(points < 10000 && points+pts >= 10000)
         ||(points < 50000 && points+pts >= 50000)
         ||(points < 100000 && points+pts >= 100000)
         ||(points < 200000 && points+pts >= 200000)
        ){
            changeLevel();
        }

        points+=pts;

        for(var i = 0; i<notifyPoints.length; i++){
            notifyPoints[i](points);
        }
    }
    
    // Add power
    function addPower(pow){
        pow = pow/2;
        var newPower = ((power + pow) < MAX_POWER) ? power+pow : MAX_POWER;
        setPower(newPower);
    }
    function setPower(pow){
        if(pow >= MAX_POWER && power < MAX_POWER ){
            console.log('NOTIFYING MAX POWER')
            for(var i = 0; i<notifyMaxPower.length; i++){
                notifyMaxPower[i](true);
            }
        }else if(power != 0 && pow <= 0){
            for(var i = 0; i<notifyMaxPower.length; i++){
                notifyMaxPower[i](false);
            }
        }
        power = pow;
        var percentage = parseFloat((power/MAX_POWER) *100).toFixed(2);
        console.log('notifying', percentage, power, MAX_POWER);
        for(var i = 0; i<notifyPower.length; i++){
            notifyPower[i](percentage);
        }
    }
    //Shoot X RAY
    function megaShoot(){
        setPower(0);
        playSound(SOUNDS.nyan);
        specials.push(getEntity('special'));
    }
    //Check if is game over
    function isGameOver(){
        return gameOver;
    }
    function isPaused(){
        return paused;
    }
   
   
    function handleInput(dt) {
        if(input.isDown('DOWN') || input.isDown('s')) {
            player.pos[1] += playerSpeed * dt;
        }

        if(input.isDown('UP') || input.isDown('w')) {
            player.pos[1] -= playerSpeed * dt;
        }

        if(input.isDown('LEFT') || input.isDown('a')) {
            player.pos[0] -= playerSpeed * dt;
        }

        if(input.isDown('RIGHT') || input.isDown('d')) {
            player.pos[0] += playerSpeed * dt;
        }

        if(input.isDown('SPACE') ){
          shoot();
        }
    }



    // Update game objects
    function update(dt) {
        gameTime += dt;

        handleInput(dt);
        updateEntities(dt);

        // It gets harder over time by adding enemies using this
        // equation: 1-.993^gameTime
        if(level < 6 && !finalStage){
            var value = Math.random() < 1 - Math.pow(.999, gameTime);
            if(value) {
                //console.log(gameTime)
                enemies.push(getEnemy());
            }
        }else if(!finalStage){
            enemies.push(getEnemy());
            finalStage = true;
        }
       
        checkCollisions();

    };

    function updateEntities(dt) {
        // Update the player sprite animation
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
      }
    }
    function moveToDirection(dt){
      return function(entity){
        switch(entity.dir) {
        case 'up': entity.pos[1] -= entity.speed * dt; break;
        case 'down': entity.pos[1] += entity.speed * dt; break;
        default:
            entity.pos[0] += entity.speed * dt;
        }
        return entity;
      }  
    }
    function moveLeft(dt){
      return function(entity){
        entity.pos[0] -= entity.speed * dt;
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
        bombareas.push(getEntity('bombarea',entity.pos));
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
    function updateBullets(dt){
      bullets = hu.compact(
        bullets.map(updateSprite(dt))
        .map(moveToDirection(dt))
        .map(removeIfOutsideScreen)
      );
    }
    function updateEnemies(dt){
      enemies = hu.compact(
                  enemies.map(moveLeft(dt))
                    .map(updateSprite(dt))
                    .map(removeIfOutsideScreenleft)
                );
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
        return !(r <= x2 || x > r2 ||
                 b <= y2 || y > b2);
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
               
                if(enemies.length == 0 && finalStage){
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
        explosions.push(getEntity('explosion',pos));
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
        var powerColor = power == MAX_POWER ?  'red': 'blue' ;
        var totalPower = window.innerWidth/3 *( power / MAX_POWER);

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
      soundActivated = bool;
    }
    function setSoundInGame(bool){
      if(!soundActivated){
        soundActivated = bool;
        playSound(SOUNDS.ambient);
      }else{
        pauseAmbientSound();
        soundActivated = bool;
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