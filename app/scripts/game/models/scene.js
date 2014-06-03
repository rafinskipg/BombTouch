define( ['game/loader','game/raf'], function(Loader){

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
    console.log(this.scenespeed);
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
    
    if(!this.completed){
      this.update((dt/1000.0) * this.scenespeed);
      this.updateBackground((dt/1000.0) * this.bgspeed);
      this.render();
      this.rafID = requestAnimationFrame(this.mainLoop.bind(this));  
    }else{
      cancelAnimationFrame(this.rafID);
      this.endCallback();
    }
  }

  Scene.prototype.updateBackground = function(){
    // Fill the path
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
    this.ctx.fillStyle = 'white';
    this.ctx.font = "30px Arial";
    this.ctx.fillText("Scene 1 ...", 10, 50);
  }

  Scene.prototype.renderEntities = function(list) {
    for(var i=0; i<list.length; i++) {
      this.renderEntity(list[i]);
    }
  }

  Scene.prototype.renderEntity = function(entity) {
    this.ctx.save();

    this.ctx.translate(Math.round(entity.pos[0]), Math.round(entity.pos[1]));
    entity.render(this.ctx);
    this.ctx.restore();
    if(entity.life){
      this.drawLife(entity);
    }
  }

  Scene.prototype.drawLife = function(entity){
    var lifeTotal = entity.sprite.getSize()[0] * (entity.life/ entity.totalLife);
    var x = Math.round(entity.pos[0]);
    var y = Math.round(entity.pos[1]);
    this.ctx.beginPath();
    this.ctx.rect(x, y + entity.sprite.getSize()[1], entity.sprite.getSize()[0], 7);
    this.ctx.fillStyle = 'rgba(255, 10, 0, 0.68)';
    this.ctx.fill();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'black'; 
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.rect(x+ (entity.sprite.getSize()[0]-lifeTotal), y + entity.sprite.getSize()[1], lifeTotal, 7);
    this.ctx.fillStyle = 'rgba(0, 255, 0, 0.68)';
    this.ctx.fill();
    this.ctx.stroke();
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