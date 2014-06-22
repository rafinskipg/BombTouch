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

    this.shaking = false;
    this.offSetX = 0;
    this.offSetY = 0;

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
      if(this.shaking){
        this.updateShaking(realtimeDt * this.scenespeed);
      }
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
    
    if(window.DEBUGGER){
      this.ctx.beginPath();
      this.ctx.rect((this.offSetX + entity.getX()),this.offSetY + entity.getY(), 5, 7);
      this.ctx.fillStyle = 'purple';
      this.ctx.fill();
      
      this.ctx.beginPath();
      this.ctx.rect((this.offSetX + entity.getShootOrigin()[0]),this.offSetY + entity.getShootOrigin()[1], 15, 7);
      this.ctx.fillStyle = 'purple';
      this.ctx.fill();
    }

    this.ctx.save();
    this.ctx.translate(Math.round(this.offSetX + entity.getX()), Math.round(this.offSetY + entity.getY()));
    entity.render(this.ctx);
    this.ctx.restore();

    if(entity.life){
      this.ctx.save();
      this.ctx.translate(Math.round(this.offSetX +entity.getHitBoxLeftPadding()), Math.round(this.offSetY + entity.getY() + entity.getHeight()));
      entity.drawLife(this.ctx);
      this.ctx.restore();
    }

  }

  Scene.prototype.renderTexts = function(list) {
    for(var i=0; i<list.length; i++) {
      this.renderText(list[i]);
    }
  }
  Scene.prototype.renderText = function (entity){
    this.ctx.save();
    this.ctx.translate(Math.round(entity.pos[0]), Math.round(entity.pos[1]));
    this.ctx.fillStyle = entity.color;
    this.ctx.font = "bold 16px Arial";
    this.ctx.fillText(entity.text, 0, 0);
    this.ctx.restore();
  }

  Scene.prototype.drawFrames = function(frames){
    this.ctx.fillStyle = "blue";
    this.ctx.font = "bold 16px Arial";
    this.ctx.fillText(frames, 100, 100);
  }
  Scene.prototype.updateShaking = function(dt){
    this.shakeTime -= dt;

    if(this.shakeTime <= 0){
      this.shaking = false;
      this.offSetX = 0;
      this.offSetY = 0;
      console.log('ended')
      return;
    }

    this.offSetX += this.offSetDir * 30*dt;
    this.offSetY+=  this.offSetDir * 30*dt;

    if(this.offSetX < 0){
      this.offSetDir  = 1;
      this.bounces++;
    }else if(this.offSetX > 5){
      this.bounces++;
      this.offSetDir = -1;
    }

    
  }
  Scene.prototype.screenShake = function(time){
    this.shaking = true;
    this.offSetX = 5;
    this.offSetY = 5;
    this.offSetDir = -1;
    this.bounces = 0;
    this.shakeTime = time;
  }
  //ABSTRACT
  //-createEntities
  //-update
  //-render
  return Scene;
});