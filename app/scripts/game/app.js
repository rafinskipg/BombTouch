define( [ 'jquery','resources','sprite','input', 'jqmobile'], function($){
  
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
    
    var canvas, ctx, soundActivated = true, gameOver = false, level = 1,  paused = false, points = 0,  resourcesLoaded = false;
    var bullets = bombs = bombareas = enemies = explosions = [];
       
    var lastFire = Date.now();
    var gameTime = 0,lastTime = 0 ;
    var terrainPattern;
    
    var player = {
        pos: [0, 0],
        life: 10000,
        totalLife: 10000,
        height: 35,
        width: 88,
        damage: 80,
        sprite: new Sprite('images/newsprites.png', [7, 304], [88,35], 4, [0, 1,2,3,4])
    };
    // Speed in pixels per second
    var playerSpeed = 200;
    var bulletSpeed = 500;
    var bombTime = 800;
    var bombAreaTime = 800;
    var enemySpeed = 50;
    // var sounds
    var SOUNDS = {
        death: new Howl({
          urls: ['../sounds/cut_grunt2.wav']
        }),
        shoot: new Howl({
          urls: ['../sounds/laser5.wav']
        }),
        explosion: new Howl({
          urls: ['../sounds/atari_boom2.wav']
        }),
        ambient: new Howl({
          urls: ['../sounds/April_Kisses.mp3']
        })
    } 
    //Suscribe to events of the game
    var notifyGameEnd = [];
    var notifyPoints = [];
    var notifyLevelUp = [];

    //Resources
    resources.load([
        'images/newsprites.png',
        'images/bg2.BMP'
    ]);
    resources.onReady(function() {
        resourcesLoaded = true
        if(soundActivated){
            SOUNDS.ambient.play();
        }
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
        if(!resourcesLoaded){ requestAnimFrame(start); return; }
        
        // Create the canvas
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        terrainPattern = ctx.createPattern(resources.get('images/bg2.BMP'), 'repeat');

        $(canvas).on('vclick',function(e){
            var canvasPosition = {
                x: $(canvas).offset().left,
                y: $(canvas).offset().top
            };
            var mouse= {
                x: e.pageX - canvasPosition.x,
                y: e.pageY - canvasPosition.y
            }
            bombs.push( { pos: [mouse.x, mouse.y],
                           sprite: new Sprite('images/newsprites.png', [282, 50], [50, 42],14,[0,1,2,3,4,5,6,7],null,
                                           true) });
                                           
        });
        reset();
        lastTime = Date.now();
        main();
    }

    // Reset game to original state
    function reset() {
        
        gameOver = false;
        gameTime = 0;
        points = 0;
        level = 1;
        paused = false;

        bombs = [];
        bombareas = [];
        enemies = [];
        bullets = [];

        player.pos = [50, canvas.height / 2];
        player.life = player.totalLife;
    };
    
    // Game over
    function endGame() {
        gameOver = true;
        for(var i = 0; i<notifyGameEnd.length; i++){
            notifyGameEnd[i]();
        }
    }

    //Pause game
    function pause(){
        paused = true;
    }
    function resume(){
        paused = false;
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
         ||(points < 40000 && points+pts >= 40000)
         ||(points < 70000 && points+pts >= 70000)
        ){
            changeLevel();
        }

        points+=pts;

        for(var i = 0; i<notifyPoints.length; i++){
            notifyPoints[i](points);
        }
    }
    
    //Check if is game over
    function isGameOver(){
        return gameOver;
    }
    function isPaused(){
        return paused;
    }
    // Update game objects
    function update(dt) {
        gameTime += dt;

        handleInput(dt);
        updateEntities(dt);

        // It gets harder over time by adding enemies using this
        // equation: 1-.993^gameTime
        var value = Math.random() < 1 - Math.pow(.999, gameTime);
        if(value) {
            console.log(gameTime)
            enemies.push(getEnemy());
            
        }

        checkCollisions();

    };
   
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

        if(input.isDown('SPACE') &&
           !isGameOver() &&
           Date.now() - lastFire > 100) {
            var x = player.pos[0] + player.sprite.size[0] / 2;
            var y = player.pos[1] + player.sprite.size[1] / 2;

            bullets.push({ pos: [x, y],
                           dir: 'forward',
                           damage: 100,
                           sprite: new Sprite('images/newsprites.png', [10, 0], [18, 18], 5, [0,1,2],null, true) });
            bullets.push({ pos: [x, y],
                           dir: 'up',
                           damage: 50,
                           sprite: new Sprite('images/newsprites.png', [77, 5], [11, 11], 5, [0,1,2,3],null, true) });
            bullets.push({ pos: [x, y],
                           dir: 'down',
                           damage: 50,
                           sprite: new Sprite('images/newsprites.png', [77, 5], [11, 11], 5, [0,1,2,3],null, true) });
            if(soundActivated){
                SOUNDS.shoot.play();
            }
            lastFire = Date.now();
        }
    }

    function updateEntities(dt) {
        // Update the player sprite animation
        player.sprite.update(dt);

        // Update all the bullets
        for(var i=0; i<bullets.length; i++) {
            var bullet = bullets[i];

            switch(bullet.dir) {
            case 'up': bullet.pos[1] -= bulletSpeed * dt; break;
            case 'down': bullet.pos[1] += bulletSpeed * dt; break;
            default:
                bullet.pos[0] += bulletSpeed * dt;
            }

            // Remove the bullet if it goes offscreen
            if(bullet.pos[1] < 0 || bullet.pos[1] > canvas.height ||
               bullet.pos[0] > canvas.width) {
                bullets.splice(i, 1);
                i--;
            }
        }

        // Update all the enemies
        for(var i=0; i<enemies.length; i++) {
            enemies[i].pos[0] -= enemies[i].speed * dt;
            enemies[i].sprite.update(dt);

            // Remove if offscreen
            if(enemies[i].pos[0] + enemies[i].sprite.size[0] < 0) {
                enemies.splice(i, 1);
                i--;
            }
        }
        
       for(var i=0; i<bombs.length; i++) {
            bombs[i].sprite.update(dt);

            // Remove if animation is done
            if(bombs[i].sprite.done) {
                bombareas.push({ 
                            pos: bombs[i].pos,
                            sprite: new Sprite('images/newsprites.png',
                                           [15, 340],
                                           [39, 39],
                                           16,
                                           [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                                           null,
                                           true),
                            damage: 5
                            });
                bombs.splice(i, 1);
                   
                i--;
                if(soundActivated){
                    SOUNDS.explosion.play();
                }
            }
        }
                             
                  
        for(var i = 0; i<bombareas.length; i++){
            bombareas[i].sprite.update(dt);
             //Remove if animation is done
            if(bombareas[i].sprite.done){
              bombareas.splice(i,1);
                i--;
            }
        }
        
        
        // Update all the explosions
        for(var i=0; i<explosions.length; i++) {
            explosions[i].sprite.update(dt);

            // Remove if animation is done
            if(explosions[i].sprite.done) {
                explosions.splice(i, 1);
                i--;
            }
        }
    }

    // Collisions

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

                // Remove the enemy
                enemies.splice(i, 1);
                i--;
                if(soundActivated){
                    SOUNDS.death.play();
                }
                // Add an explosion
                addExplosion(pos);
               
            }
        }
    }

    function addExplosion(pos){
        explosions.push({
            pos: pos,
            sprite: new Sprite('images/newsprites.png',
                           [15, 340],
                           [39, 39],
                           16,
                           [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                           null,
                           true)
        });
        if(soundActivated){
            SOUNDS.explosion.play();
        }
        
    }
    function getEnemy(){
        // Sprite(url, pos, size, speed, frames, dir, once)
        switch(level){
            case 1:

                return {
                    pos: [canvas.width,
                          Math.random() * (canvas.height - 39)],
                    sprite: new Sprite('images/newsprites.png', [4,186], [28,30],
                                       6, [0, 1, 2,3,4]),
                    speed: enemySpeed,
                    points: 100,
                    totalLife: 100,
                    life: 100,
                    width: 28,
                    height: 30,
                    damage: 100

                }

            break;

            case 2: 
                return {
                    pos: [canvas.width,
                          Math.random() * (canvas.height - 39)],
                    sprite: new Sprite('images/newsprites.png', [0,216], [35,50],
                                       8, [0, 1, 2,3]),
                    speed: enemySpeed /2,
                    points: 200,
                    totalLife: 200,
                    life: 200,
                    width: 35,
                    height: 50,
                    damage: 200
                }

            break;
            case 3: 
                return {
                    pos: [canvas.width,
                          Math.random() * (canvas.height - 39)],
                    sprite: new Sprite('images/newsprites.png', [175,185], [23,45],
                                       7, [0,1,2,3,4,5,6]),
                    speed: enemySpeed *1.5,
                    points: 300,
                    totalLife: 300,
                    life: 300,
                    width: 23,
                    height: 45,
                    damage: 300
                }

            break;
            case 4: 
                return {
                    pos: [canvas.width,
                          Math.random() * (canvas.height - 39)],
                    sprite: new Sprite('images/newsprites.png', [175,230], [33,40],
                                       8, [0,1,2,3,4,3,2,1]),
                    speed: enemySpeed /2,
                    points: 400,
                    totalLife: 400,
                    life: 400,
                    width: 30,
                    height: 37,
                    damage: 400
                }

            break;
            case 5: 
                return {
                    pos: [canvas.width,
                          Math.random() * (canvas.height - 39)],
                    sprite: new Sprite('images/newsprites.png', [172,0], [72,72],
                                       1, [0]),
                    speed: enemySpeed /2,
                    points: 500,
                    totalLife: 500,
                    life: 500,
                    width: 72,
                    height: 72,
                    damage: 500
                }

            break;
        }
       
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
        ctx.fillStyle = terrainPattern;
       // BGx -= 0.3;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //ctx.fillRect(BGx + canvas.width, 0, canvas.width, canvas.height);
        
       //ctx.drawImage(resources.get('images/bg2.BMP'), BGx, 0,canvas.width, canvas.height);
       //ctx.drawImage(resources.get('images/bg2.BMP'), BGx + canvas.width, 0,canvas.width, canvas.height);
     
        // If the image scrolled off the screen, reset
       // if (BGx < -canvas.width){
        //      BGx =0;
        //}
      
        // Render the player if the game isn't over
        if(!isGameOver()) {
            renderEntity(player);
        }

        //renderEntities(bullets);
        renderEntities(bombs);
        renderEntities(bombareas);
        renderEntities(bullets);
        renderEntities(enemies);
        renderEntities(explosions);
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
      //ctx.translate(entity.pos[0], entity.pos[1]);
      ctx.rect(entity.pos[0], entity.pos[1] + entity.height, entity.width, 7);
      ctx.fillStyle = 'yellow';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'black'; 
      ctx.stroke();

      ctx.beginPath();
      // ctx.translate(entity.pos[0], entity.pos[1]);
      ctx.rect(entity.pos[0], entity.pos[1] + entity.height, lifeTotal, 7);
      ctx.fillStyle = 'blue';
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
    function setSound(bool){
        soundActivated = bool;
    }
    
    var GAME = {
        suscribeGameOver : suscribeGameOver,
        suscribeLevelUp : suscribeLevelUp,
        suscribePoints : suscribePoints,
        setSound : setSound,
        endGame : endGame,
        start : start,
        pause: pause,
        resume : resume
       };
    //API 
    return  GAME;

});