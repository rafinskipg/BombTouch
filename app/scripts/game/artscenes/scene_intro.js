define( ['game/models/models', 'petra','game/entities', 'resources','raf', 'quad_tree'], function(models, petra, entities){
  var scene;

  function init(canvasId, endCallback){
    scene = new models.Scene([
      'images/doggy/pixeleddog.png',
      'images/weapons/bullets.png'
      ],canvasId, endCallback);

    window.addEventListener('click', function(ev){
      scene.skipped = true;
      window.removeEventListener('click');
    });

    scene.init = (function(){
      this.dog = entities.getEntity('cooldog',{pos: [50, this.canvas.height / 2]});
      this.texts = [
        ["Once upon a time... "],
        ['there was a planet where ', 'all the creatures lived in peace and harmony'],
        ['from the outter universe a voice raised'],
        ["claiming death as said it's master"],
        ["but nobody will destroy this beautiful planet"],
        ['nor when Cool Dog is fully armed']
      ]
      this.maxTime = this.texts.length * 3 + 2;
      this.currentTimeScene = 3;
      this.currentText = this.texts.shift();
      this.skipped = false;
    }).bind(scene);

    scene.update = (function(dt){
      this.dog.pos =  petra.moveRight(this.dog.pos, this.dog.speed, dt);
      this.dog.update(dt);
      this.time += dt;
      if(this.time >= this.maxTime || this.skipped){
        this.completed = true;
      }
      this.updateText(dt);
    }).bind(scene);

    scene.updateText = function(dt){
      this.currentTimeScene -= dt;
      if(this.currentTimeScene <= 0){
        this.currentTimeScene = 3;
        this.currentText = this.texts.shift();
      }
    }

    scene.render = (function(){
      this.bufferCtx.fillStyle = "#33337a";
      this.bufferCtx.fillRect(0,0,canvas.width,canvas.height);
      this.bufferCtx.fillStyle = 'white';
      this.bufferCtx.font = "18px 'Press Start 2P'";

      if(this.currentText){
        for(var i = 0; i < this.currentText.length ; i++){
          b = i+1;
          var y = (80 * b) + b* 10;
          this.bufferCtx.fillText(this.currentText[i], 40, y);    
        }
        
      }

      this.bufferCtx.font = "10px 'Press Start 2P'";
      this.bufferCtx.fillText('Touch screen to skip the awesome story', 15,15)

      this.renderEntities([this.dog]);
    }).bind(scene);

    scene.load();
  }


  return  {
    init: init
  };

});