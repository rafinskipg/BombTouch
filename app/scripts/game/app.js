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
    
    var canvas, ctx, soundActivated = false, gameOver = false, points = 0,  resourcesLoaded = false;
    var bullets = bombs = bombareas = enemies = explosions = [];
       
    var lastFire = Date.now();
    var gameTime = 0,lastTime = 0 ;
    var terrainPattern;
    
    var player = {
        pos: [0, 0],
        sprite: new Sprite('../../images/nyan1.png', [0, 0], [88,35], 4, [0, 1,2,3,4])
    };
    // Speed in pixels per second
    var playerSpeed = 200;
    var bulletSpeed = 500;
    var bombTime = 800;
    var bombAreaTime = 800;
    var enemySpeed = 50;
    
    
    resources.load([
        '../../images/sprites.png',
        '../../images/nyan1.png',
        '../../images/nyan_cat.png',
        '../../images/enemies.png',
        '../../images/bg2.BMP'
    ]);
    resources.onReady(function() {resourcesLoaded = true});
    
    
    // The main game loop
    var main = function() {
        var now = Date.now();
        var dt = (now - lastTime) / 1000.0;
        if(!isGameOver()){
             update(dt);
            render();
        }
        lastTime = now;
        requestAnimFrame(main);
    };

    //Start Game
    var start = function() {
        
        if(!resourcesLoaded){ requestAnimFrame(start); return; }
        
        // Create the canvas
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        terrainPattern = ctx.createPattern(resources.get('../../images/bg2.BMP'), 'repeat');

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
                           sprite: new Sprite('../../images/nyan_cat.png', [0, 0], [49, 42],14,[0,1,2,3,4,5,6,7],null,
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
        
        bombs = [];
        bombareas = [];
        enemies = [];
        bullets = [];

        player.pos = [50, canvas.height / 2];
    };
    
    // Game over
    function endGame() {
        gameOver = true;
    }
    
    // Update game objects
    function update(dt) {
        gameTime += dt;

        handleInput(dt);
        updateEntities(dt);

        // It gets harder over time by adding enemies using this
        // equation: 1-.993^gameTime
        if(Math.random() < 1 - Math.pow(.999, gameTime)) {
            enemies.push({
                pos: [canvas.width,
                      Math.random() * (canvas.height - 39)],
                sprite: new Sprite('../../images/enemies.png', [18,344], [28,30],
                                   6, [0, 1, 2,3,4,5])
            });
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
                           sprite: new Sprite('../../images/sprites.png', [0, 39], [18, 8]) });
            bullets.push({ pos: [x, y],
                           dir: 'up',
                           sprite: new Sprite('../../images/sprites.png', [0, 50], [9, 5]) });
            bullets.push({ pos: [x, y],
                           dir: 'down',
                           sprite: new Sprite('../../images/sprites.png', [0, 60], [9, 5]) });

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
            enemies[i].pos[0] -= enemySpeed * dt;
            enemies[i].sprite.update(dt);

            // Remove if offscreen
            if(enemies[i].pos[0] + enemies[i].sprite.size[0] < 0) {
                enemies.splice(i, 1);
                i--;
            }
        }
        console.log(bombs.length);
       for(var i=0; i<bombs.length; i++) {
            bombs[i].sprite.update(dt);

            // Remove if animation is done
            if(bombs[i].sprite.done) {
                bombareas.push({ pos: bombs[i].pos,
                           sprite: new Sprite('../../images/sprites.png',
                                           [0, 117],
                                           [39, 39],
                                           16,
                                           [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                                           null,
                                           true)});
                bombs.splice(i, 1);
                   
                i--;
            }
        }
            
               /* */
                        
                  
        
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

            for(var j=0; j<bullets.length; j++) {
                var pos2 = bullets[j].pos;
                var size2 = bullets[j].sprite.size;

                if(boxCollides(pos, size, pos2, size2)) {
                    // Remove the enemy
                    enemies.splice(i, 1);
                    i--;

                    // Add score
                    score += 100;

                    // Add an explosion
                    explosions.push({
                        pos: pos,
                        sprite: new Sprite('../../images/sprites.png',
                                           [0, 117],
                                           [39, 39],
                                           16,
                                           [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                                           null,
                                           true)
                    });

                    // Remove the bullet and stop this iteration
                    bullets.splice(j, 1);
                    break;
                }
            }
             
            
            for(var z= 0; z<bombareas.length; z++){
                var pos2 = bombareas[j].pos;
                var size2 = bombareas[j].sprite.size;

                if(boxCollides(pos, size, pos2, size2)) {
                    // Remove the enemy
                    enemies.splice(i, 1);
                    i--;

                    // Add score
                    points += 100;

                    // Add an explosion
                    explosions.push({
                        pos: pos,
                        sprite: new Sprite('../../images/sprites.png',
                                           [0, 117],
                                           [39, 39],
                                           16,
                                           [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                                           null,
                                           true)
                    });
                    break;
                }
            }
            if(boxCollides(pos, size, player.pos, player.sprite.size)) {
                endGame();
            }
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
        
       //ctx.drawImage(resources.get('../../images/bg2.BMP'), BGx, 0,canvas.width, canvas.height);
       //ctx.drawImage(resources.get('../../images/bg2.BMP'), BGx + canvas.width, 0,canvas.width, canvas.height);
     
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
    }
    
    
    function stop(){
        endGame();
    }
        
    function getPoints(){
        return points;
    }
    
    function isGameOver(){
        return gameOver;
    }
    
    function setSound(bool){
        soundActivated = bool;
    }
    
    var GAME = {
        isGameOver : isGameOver,
        start : start,
        getPoints : getPoints,
        setSound : setSound,
        stop : stop
       };
    //API 
    return  GAME;

});