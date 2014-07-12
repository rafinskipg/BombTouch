define( ['game/loader/loader','petra', 'raf'], function(Loader, petra){
  var PARALLAX_IMAGE_WIDTH = 200;
  var PARALLAX_IMAGE_HEIGHT = 68;
  function Scene(assets, canvasId,endCallback, opts){
    this.canvasId = canvasId;
    this.completed = false;
    this.endCallback = endCallback;
    this.assets = assets;
    this.time = 0;
    this.canvas = document.getElementById(this.canvasId);
    canvas.className = 'visible';

    this.ctx = this.canvas.getContext("2d");

    this.canvasFake = document.createElement('canvas');
    this.bufferCtx = this.canvasFake.getContext('2d');
    
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;

    this.canvas.width = window.innerWidth* window.RESIZEFACTOR;
    this.canvas.height = window.innerHeight* window.RESIZEFACTOR ;
    this.canvasFake.width = this.canvas.width;
    this.canvasFake.height = this.canvas.height;
    
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
    var current = Date.now();
    var dt = (current - this.then);
    this.then = current;
    //frames = (1000/ (dt * 60)) * 60;
    var realtimeDt = dt / 1000.0;
    this.ctx.globalCompositeOperation = "source-over";

    if(!this.completed){
      this.update(realtimeDt * this.scenespeed, realtimeDt);
      
      this.updateBackground(realtimeDt * this.bgspeed);

      if(this.shaking){
        this.updateShaking(realtimeDt * this.scenespeed);
      }

      this.render();
      this.ctx.drawImage(this.canvasFake, 0,0);
      
      this.rafID = requestAnimationFrame(this.mainLoop.bind(this));  
    }else{
      cancelAnimationFrame(this.rafID);
      this.endCallback();
    }
  }

  Scene.prototype.updateBackground = function(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.bufferCtx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  Scene.prototype.renderEntities = function(list) {
    this.bufferCtx.globalAlpha = 1.0;
    for(var i=0; i<list.length; i++) {
      this.renderEntity(list[i]);
    }
  }

  Scene.prototype.renderEntity = function(entity) {
    
    if(window.DEBUGGER){
      this.bufferCtx.beginPath();
      this.bufferCtx.rect((this.offSetX + entity.getX()),this.offSetY + entity.getY(), 5, 7);
      this.bufferCtx.fillStyle = 'green';
      this.bufferCtx.fill();
      
      if(entity.getShootOrigin){
        this.bufferCtx.beginPath();
        this.bufferCtx.rect((this.offSetX + entity.getShootOrigin()[0]),this.offSetY + entity.getShootOrigin()[1], 15, 7);
        this.bufferCtx.fillStyle = 'purple';
        this.bufferCtx.fill();  
      }
    }

    this.bufferCtx.save();
    this.bufferCtx.translate(Math.round(this.offSetX + entity.getX()), Math.round(this.offSetY + entity.getY()));
    entity.render(this.bufferCtx);
    this.bufferCtx.restore();

    if(entity.life){
      this.bufferCtx.save();
      this.bufferCtx.translate(Math.round(this.offSetX +entity.getHitBoxLeftPadding()), Math.round(this.offSetY + entity.getY() + entity.getHeight()));
      entity.drawLife(this.bufferCtx);
      this.bufferCtx.restore();
    }

  }

  Scene.prototype.renderTexts = function(list, type) {
    for(var i=0; i<list.length; i++) {
      this.renderText(list[i],type);
    }
  }
  Scene.prototype.renderText = function (entity, type){
    if(type == 'dialog'){
      this.bufferCtx.font = "bold "+entity.font+" 'Press Start 2P'";
      var textWidth = this.bufferCtx.measureText(entity.text).width + 20 * window.RESIZEFACTOR;
      var textHeight = 30 * window.RESIZEFACTOR;

      this.bufferCtx.save();
      this.bufferCtx.translate(Math.round(entity.pos[0] - textWidth), Math.round(entity.pos[1] - textHeight));
      this.bufferCtx.fillStyle = entity.background;
      this.bufferCtx.globalAlpha = 0.6;
      this.roundRect(0,0, textWidth, textHeight, 5, true);
      this.bufferCtx.fillStyle = entity.color;
     
      this.bufferCtx.fillText(entity.text, 15 * window.RESIZEFACTOR , 15 * window.RESIZEFACTOR);
      this.bufferCtx.restore();  
    }else{
      this.bufferCtx.save();
      this.bufferCtx.translate(Math.round(entity.pos[0]), Math.round(entity.pos[1]));
      this.bufferCtx.fillStyle = entity.color;
      this.bufferCtx.font = "bold "+entity.font+" 'Press Start 2P'";
      this.bufferCtx.fillText(entity.text, 0, 0);
      this.bufferCtx.restore();  
    }
    
  }

  /**
 * Draws a rounded rectangle using the current state of the canvas. 
 * If you omit the last three params, it will draw a rectangle 
 * outline with a 5 pixel border radius 
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate 
 * @param {Number} width The width of the rectangle 
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 */
  Scene.prototype.roundRect = function(x,y, width, height, radius, fill, stroke){
    if (typeof stroke == "undefined" ) {
      stroke = true;
    }
    if (typeof radius === "undefined") {
      radius = 5;
    }
    this.bufferCtx.beginPath();
    this.bufferCtx.moveTo(x + radius, y);
    this.bufferCtx.lineTo(x + width - radius, y);
    this.bufferCtx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.bufferCtx.lineTo(x + width, y + height - radius);
    this.bufferCtx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.bufferCtx.lineTo(x + radius, y + height);
    this.bufferCtx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.bufferCtx.lineTo(x, y + radius);
    this.bufferCtx.quadraticCurveTo(x, y, x + radius, y);
    this.bufferCtx.closePath();
    if (stroke) {
      this.bufferCtx.stroke();
    }
    if (fill) {
      this.bufferCtx.fill();
    }        
  }

  // make the image repeat by copying
  // a mirrored version in x, y, x+y.
  //   returns a new Canvas  X2,X2 its size.
  Scene.prototype.makeRepeat = function(img) {
      var tmpCv = document.createElement('canvas');
      tmpCv.width = img.width * 2;
      tmpCv.height = img.height * 2;
      var tmpCtx = tmpCv.getContext('2d');
      tmpCtx.drawImage(img, 0, 0);
      tmpCtx.save();
      tmpCtx.translate(2 * img.width, 0);
      tmpCtx.scale(-1, 1);
      tmpCtx.drawImage(img, 0, 0);
      tmpCtx.translate(0, 2 * img.height);
      tmpCtx.scale(1, -1);
      tmpCtx.drawImage(img, 0, 0);
      tmpCtx.restore();
      tmpCtx.save();
      tmpCtx.translate(0, 2 * img.height);
      tmpCtx.scale(1, -1);
      tmpCtx.drawImage(img, 0, 0);
      tmpCtx.restore();
      return tmpCv;
  }
  Scene.prototype.makeParallax = function(images, forceResize){
    var maxWidth = this.canvas.width;
    var reachedWidth = 0;
    var generatedParallax = [];
    while(reachedWidth < maxWidth){
      var image = petra.getRandomElementFromArray(images);
      if(forceResize){
        reachedWidth += image.width;  
      }else{
        reachedWidth += PARALLAX_IMAGE_WIDTH;
      }
      
      generatedParallax.push(image);
    }

    return generatedParallax;
  }

  Scene.prototype.generateParallaxPattern = function(images, height, forceResize){
    var tmpCv = document.createElement('canvas');
    tmpCv.width = this.canvas.width ;
    tmpCv.height = height;
    var tmpCtx = tmpCv.getContext('2d');
    var currWidthIndex = 0;

    for(var i = 0; i < images.length; i++){
      if(!forceResize){
        tmpCtx.drawImage(images[i], 0, 0, images[i].width, images[i].height, currWidthIndex, 0, images[i].width, images[i].height);
        currWidthIndex+= images[i].width;
      }else{
        tmpCtx.drawImage(images[i], 0, 0, images[i].width, images[i].height, currWidthIndex, 0, PARALLAX_IMAGE_WIDTH, PARALLAX_IMAGE_HEIGHT);
        currWidthIndex+= PARALLAX_IMAGE_WIDTH-5;
      }
    }
    return tmpCv;
  }

  Scene.prototype.drawParallax = function(pattern, pos, height){
    this.bufferCtx.save();
    var pat = this.bufferCtx.createPattern(pattern,"repeat-x");
    this.bufferCtx.translate(pos[0]+this.offSetX , pos[1] +this.offSetY)
    this.bufferCtx.rect(0,0,this.canvas.width,height);
    this.bufferCtx.fillStyle=pat;
    this.bufferCtx.fill();
    this.bufferCtx.restore();
  }

  Scene.prototype.renderParallaxLayers = function(parallaxLayers){
   for(var i = 0; i < parallaxLayers.length; i++){
      for(var j = 0; j< parallaxLayers[i].patterns.length; j++){
        var posX = parallaxLayers[i].pos[0] + j * this.canvas.width - parallaxLayers[i].index;
        var posY = parallaxLayers[i].pos[1] + parallaxLayers[i].yIndex;
        this.drawParallax(parallaxLayers[i].patterns[j], [posX, posY], PARALLAX_IMAGE_HEIGHT);
      } 
    }
  }


  Scene.prototype.drawFrames = function(frames){
    this.bufferCtx.fillStyle = "blue";
    this.bufferCtx.font = "bold 12px 'Press Start 2P'";
    this.bufferCtx.fillText(frames, 100, 100);
  }
  Scene.prototype.updateShaking = function(dt){
    this.shakeTime -= dt;

    if(this.shakeTime <= 0){
      this.shaking = false;
      this.offSetX = 0;
      this.offSetY = 0;
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

  Scene.prototype.darkenLayer = function(){
    this.bufferCtx.fillStyle =  'rgba(2, 2, 43, 0.3)';
    this.bufferCtx.fillRect(0,0,this.canvas.width, this.canvas.height);
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