define( ['game/loader/loader','raf'], function(Loader){

  function Scene(assets, canvasId,endCallback, opts){
    this.canvasId = canvasId;
    this.completed = false;
    this.endCallback = endCallback;
    this.assets = assets;
    this.time = 0;
    this.canvas = document.getElementById(this.canvasId);
    canvas.className = 'visible';

    this.ctx = this.canvas.getContext("2d");
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight ;
    this.paused = false;

    this.scenespeed = 1.0;
    this.bgspeed = 1.0;
    for(var opt in opts){
      this[opt] = opts[opt];
    }
  }

  Scene.prototype.load = function(){
    Loader.init(this.canvasId);
    Loader.load(this.assets, this.start.bind(this));
  }

  Scene.prototype.remove = function(){
    //STOP request anim frame
  }

  Scene.prototype.start = function(){
    this.init();
    this.then = Date.now();
    this.mainLoop();
  }

  Scene.prototype.pause = function(){
    if(this.paused){
      this.paused = false;
      this.then = Date.now();
      this.mainLoop();
    }else{
      this.paused = true;
      cancelAnimationFrame(this.rafID);
    }
  }

  Scene.prototype.mainLoop = function(){
    var now = Date.now();
    var dt = (now - this.then);
    this.then = now;
    //frames = (1000/ (dt * 60)) * 60;
    var realtimeDt = dt / 1000.0;
    
    if(!this.completed){
      this.update(realtimeDt * this.scenespeed, realtimeDt);
      //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      //this.ctx.save();
      this.updateBackground(realtimeDt * this.bgspeed);
      //this.ctx.scale(0.8,0.8);
      this.render();
      //this.ctx.restore();
      this.rafID = requestAnimationFrame(this.mainLoop.bind(this));  
    }else{
      cancelAnimationFrame(this.rafID);
      this.endCallback();
    }
  }

  Scene.prototype.updateBackground = function(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  Scene.prototype.renderEntities = function(list) {
    for(var i=0; i<list.length; i++) {
      this.renderEntity(list[i]);
    }
  }

  Scene.prototype.renderEntity = function(entity) {
    this.ctx.save();
    this.ctx.translate(Math.round(entity.getX()), Math.round(entity.getY()));
    entity.render(this.ctx);
    this.ctx.restore();

    if(entity.life){
      this.ctx.save();
      this.ctx.translate(Math.round(entity.getHitBoxLeftPadding()), Math.round(entity.getY() + entity.getHeight()));
      entity.drawLife(this.ctx);
      this.ctx.restore();
    }

  }

  Scene.prototype.drawFrames = function(frames){
    this.ctx.fillStyle = "blue";
    this.ctx.font = "bold 16px Arial";
    this.ctx.fillText(frames, 100, 100);
  }


  //ABSTRACT
  //-createEntities
  //-update
  //-render
  return Scene;
});