define( ['game/models/models', 'petra','game/entities', 'resources','raf', 'quad_tree'], function(models, petra, entities){
  var scene;

  function init(canvasId, endCallback){
    scene = new models.Scene([
      'images/scenes/intro_1_background.png',
      'images/scenes/intro_1_foreground.png'
      ],canvasId, endCallback);

    window.addEventListener('click', function(ev){
      scene.skipped = true;
      window.removeEventListener('click');
    });

    scene.foreground = {
        pos: [0,0],
        speed: [10,10],
        angle: -0.4
      };
    
    
    scene.init = (function(){
      this.texts = [
        ["Dreams..."],
        ['Populated by ghosts'],
        ['what you will find there, CoolDog?'],
        ['Scene 1 - Junk of the space']
      ]
      this.maxTime = this.texts.length * 3 + 2;
      this.currentTimeScene = 3;
      this.currentText = this.texts.shift();
      this.skipped = false;
    }).bind(scene);

    scene.update = (function(dt){
      this.foreground.pos =  petra.calculateNextPositionByAngle(this.foreground, dt);
      
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
      this.bufferCtx.drawImage(resources.get('images/scenes/intro_1_background.png'), 0,0,this.canvas.width,this.canvas.height);

      //TODO: adjust fonts
      this.bufferCtx.font = 15  * window.RESIZEFACTOR + "x 'Press Start 2P'";

      if(this.currentText){
        for(var i = 0; i < this.currentText.length ; i++){
          b = i+1;
          var y = (this.canvas.height/2  * window.RESIZEFACTOR * b) + b* 10  * window.RESIZEFACTOR;
          var x =  40  * window.RESIZEFACTOR;
          this.jittedText(this.currentText[i],x,y);
        }
        
      }

      this.bufferCtx.font = 10 * window.RESIZEFACTOR + "px 'Press Start 2P'";
      this.bufferCtx.fillText('Touch screen to skip', 15  * window.RESIZEFACTOR,(this.canvas.height - 20)  * window.RESIZEFACTOR)

      this.bufferCtx.drawImage(resources.get('images/scenes/intro_1_foreground.png'), this.foreground.pos[0],  this.foreground.pos[1],this.canvas.width, this.canvas.height)
    }).bind(scene);

    scene.load();
  }


  return  {
    init: init
  };

});