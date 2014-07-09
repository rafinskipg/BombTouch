define( ['game/models/scene', 'petra'], function(Scene, petra){
  
  //Thanks dr.axel. 
  //Allows Sprite to accept array as args
  if (!Function.prototype.construct) {
    Function.prototype.construct = function(argArray) {
      if (! Array.isArray(argArray)) {
        throw new TypeError("Argument must be an array");
      }
      var constr = this;
      var nullaryFunc = Function.prototype.bind.apply(
          constr, [null].concat(argArray));
      return new nullaryFunc();
    };
  }

  function SpaceParticle(options){
    this.pos = options.pos;
    this.speed = options.speed
    this.color = options.color  || 'white';
    this.size = options.size;
    this.color = options.color;

    this.drawCircle = function(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();

      ctx.arc(
          this.pos[0],
          this.pos[1],
          this.size,
          0,
          Math.PI*2,
          false
      );

      ctx.closePath();
      ctx.fill();
    }

    this.drawSquare = function(ctx) {
      ctx.fillStyle = this.color;

      ctx.fillRect(
          this.pos[0],
          this.pos[1],
          this.size,
          this.size
      );
    }

    this.draw = function(ctx){
      var radgrad = ctx.createRadialGradient( 
          this.pos[0] + this.size/2,
          this.pos[1]+ this.size/2,
          0,
          this.pos[0] + this.size/2,
          this.pos[1] +this.size/2,
          this.size/2);
      
      radgrad.addColorStop(0, 'rgba(224, 224, 224, 1)');
      radgrad.addColorStop(0.2, 'rgba(224, 224, 224, 0.83)');
      radgrad.addColorStop(1, 'rgba(224, 224, 224,0)');

      // draw shape
      ctx.fillStyle = radgrad;
      ctx.fillRect(
          this.pos[0] ,
          this.pos[1] ,
          this.size,
          this.size
      );
    }
  }

  SpaceParticle.prototype.update = function(dt){
    this.pos[0] -= this.speed[0] * dt;
  }

  function SquareHitBox(opts){
    this.pos = opts.pos;
    this.size = opts.size;
    this.width = opts.size[0];
    this.centerOfRotation = opts.centerOfRotation;
    this.hitboxStartPoint = opts.hitboxStartPoint;
    this.getShootOrigin = opts.getShootOrigin;
    var withpadding = petra.sumArrays([0,0], opts.hitboxStartPoint);
    this.points = [];

    this.topLeft = withpadding;
    this.topRight = petra.sumArrays(withpadding, [opts.size[0], 0]);
    this.bottomLeft = petra.sumArrays(withpadding, [0, opts.size[1]]);
    this.bottomRight = petra.sumArrays(withpadding, [opts.size[0], opts.size[1]]);

    this.points.push(this.topLeft);
    this.points.push(this.topRight);
    this.points.push(this.bottomLeft);
    this.points.push(this.bottomRight);
    
   /* var topLeft = petra.rotatePoint(opts.pos, opts.hitboxStartPoint, angle, centerOfRotation);
    
    var topRight = petra.rotatePoint(opts.pos,[opts.hitboxStartPoint[0]  + opts.size[0], opts.hitboxStartPoint[1]], angle, centerOfRotation);
    
    var bottomLeft = petra.rotatePoint(opts.pos, [opts.hitboxStartPoint[0] , opts.hitboxStartPoint[1] + opts.size[1]], angle, centerOfRotation);
    
    var bottomRight = petra.rotatePoint(opts.pos, [opts.hitboxStartPoint[0]  + opts.size[0], opts.hitboxStartPoint[1] + opts.size[1]], angle, centerOfRotation);
    */
  }

  SquareHitBox.prototype.rotatePoint = function(point, angle, center){
    var s  = Math.sin(angle);
    var c = Math.cos(angle);
    point[0]-=center[0];
    point[1]-=center[1];

    xnew = point[0]* c - point[1]*s;
    ynew = point[0]* s + point[1]*c;

    return [xnew + center[0], ynew + center[1]]
  }


  SquareHitBox.prototype.rotate = function(angle){
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    
    for(var i = 0; i <this.points.length; i++){
      var x = this.points[i][0] -this.centerOfRotation[0] ;
      var y = this.points[i][1] - this.centerOfRotation[1];

      this.points[i][0] = x*cos - y*sin + this.centerOfRotation[0] ;
      this.points[i][1] = y*cos + x*sin  + this.centerOfRotation[1];
    }
  }

  SquareHitBox.prototype.getPos = function(){
    return petra.sumArrays(this.pos, this.hitboxStartPoint);
  } 
  SquareHitBox.prototype.getPoints = function(){
    var arr = [];
    for(var i = 0; i < this.points.length; i++){
      //arr.push(petra.sumArrays(this.points[i], this.pos));
      arr.push(petra.sumArrays(this.points[i], this.pos));
    }
    return arr;
  }

  function RenderableText(opts){
    this.text = opts.text;
    this.color = opts.color || white;
    this.pos = opts.pos;
    this.speed = opts.speed || [30,30];
    this.timeAlive = 0;
    this.font = opts.font || '12px';
  }


  function Dialog(message, sender){
    this.text = message.text;
    this.color = 'black';
    this.background = 'white';
    this.entity = sender;
    this.timeAlive = 0;
    this.font = '8px';
    this.pos = sender.pos;
    this.duration = message.duration;
  }

  function Message(text, sender, duration){
    this.text = text;
    this.sender = sender;
    this.duration =  duration || 2000;
  }

  /*RenderableEntity*/
  function RenderableEntity(opts){

    this.speed = opts.speed || [0,0];
    this.angle = opts.angle || 0;
    this.damage = opts.damage || 0;
    this.life = opts.life || 0;
    this.totalLife = opts.totalLife || 0;
    this.baseDamage = opts.baseDamage || 0;
    this.points = opts.points || 0;

    this.sprite = Sprite.construct(opts.sprite);
    this.transparency = opts.transparency ? opts.transparency :  null;
    this.animations = {};

    this.bulletShotFireName = opts.bulletShotFireName || 'bossShootFire';
    this.bulletName =  opts.bulletName || 'bullet';
    this.actions = opts.actions || null;
    this.dropProbabilities = opts.dropProbabilities || 0.05;
    this.dropItem = opts.dropItem || 'greenGem';
    this.critChance = opts.critChance || 0;

    //Origins and movement things
    this.pos = opts.pos;
    this.shootOrigin = opts.shootOrigin || [0,0];
    this.renderTranslated = opts.renderTranslated || null;
    this.centerOfRotation = opts.centerOfRotation || null;
    this.rotateSprite = opts.rotateSprite ? opts.rotateSprite : null;

    this.messages = opts.messages || null;

    if(opts.resize){
      this.sprite.resize(opts.resize[0], opts.resize[1]);
    }
    if(opts.resizePercentage){
      this.sprite.resize(Math.floor(this.sprite.getSize()[0]*opts.resizePercentage),Math.floor(this.sprite.getSize()[1]*opts.resizePercentage) );
    }

    if(opts.animations){
      var self = this;
      opts.animations.map(function(anim){ 
        self.animations[anim.name] = Sprite.construct(anim.sprite);
        if(anim.resetAfterEnd){
          self.animations[anim.name].setEndCallback(function(){
            this.setDefaultAnimation();
          }.bind(self));
        }
        if(opts.resize){
          self.animations[anim.name].resize(opts.resize[0], opts.resize[1]);
        }
        if(opts.resizePercentage){
          self.animations[anim.name].resize(Math.floor(self.animations[anim.name].getSize()[0]*opts.resizePercentage),Math.floor(self.animations[anim.name].getSize()[1]*opts.resizePercentage) );
        }
      });
    }

    this.enabledAnimation = 'default';
    this.hitbox = opts.hitbox || null;
    
  }

  RenderableEntity.prototype.render = function(ctx){
    if(window.DEBUGGER && this.hitbox){
      ctx.beginPath();
      var hitbox = this.getHitBox();

      for(var i = 0; i < hitbox.points.length; i++){
        ctx.rect(hitbox.points[i][0] , hitbox.points[i][1] , 4, 4);
      }
      
      ctx.fillStyle = 'rgba(255, 10, 0, 0.68)';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'black'; 
      ctx.stroke();
    }

    if(this.enabledAnimation == 'default'){
      this.sprite.render(ctx, this.getLookingPosition(), this.renderTranslated, this.getCenterOfRotation(), this.transparency);
    }else{
      this.animations[this.enabledAnimation].render(ctx,this.getLookingPosition(), this.renderTranslated, this.getCenterOfRotation(), this.transparency);
    }
  }
  RenderableEntity.prototype.getCenterOfRotation = function(){
    if(this.centerOfRotation){
      return this.centerOfRotation;
    }else{
      var size = this.getSize();
      return [size[0]/2, size[1]/2];
    }
  }

  RenderableEntity.prototype.getSprite = function(){
    if(this.enabledAnimation == 'default'){
      return this.sprite;
    }else{
      return this.animations[this.enabledAnimation];
    }
  }

  RenderableEntity.prototype.getSize = function(){
    return this.getSprite().getSize();
  }
  RenderableEntity.prototype.resizeByFactor = function(factor){
    var size = petra.multIntegerToArray(this.getSize(), factor);
    this.centerOfRotation = this.centerOfRotation ? petra.multIntegerToArray(this.centerOfRotation, factor) : null;
    this.shootOrigin = petra.multIntegerToArray(this.shootOrigin, factor);
    
    for(var i in this.animations){
      this.animations[i].resize(size[0], size[1]);
    }
    this.sprite.resize(size[0],size[1]);

    if(this.hitbox){
      this.hitbox.pos[0] = this.hitbox.pos[0] * factor ;
      this.hitbox.pos[1] = this.hitbox.pos[1] * factor ;
      this.hitbox.size[0] = this.hitbox.size[0] * factor ;
      this.hitbox.size[1] = this.hitbox.size[1] * factor ;
    }
  }
  RenderableEntity.prototype.getHeight = function(){
    return this.getSize()[1];
  }
   RenderableEntity.prototype.getWidth = function(){
    return this.getSize()[0];
  }

  RenderableEntity.prototype.getHitBox = function() {
    var opts;
    if(!this.hitbox){
      opts = { 
        pos: this.pos,
        hitboxStartPoint : [0,0],
        size: this.getSize()
      };

    }else{
      opts = {
        pos: this.pos, 
        hitboxStartPoint: this.hitbox.pos,
        size: this.hitbox.size
      };
    }
    opts.centerOfRotation = this.getCenterOfRotation();
      opts.getShootOrigin = this.getShootOrigin.bind(this);
    squareHitB = new SquareHitBox(opts);
    
    //If it has a specified rotation angle. If not we leave it by default
    if(this.getLookingPosition()){
      var angle = this.getBulletAngle();
      if(this.getSprite().lookingLeft){
        angle = angle -Math.PI;
      }
      squareHitB.rotate(angle);  
    }
    
    return squareHitB;
  };

  RenderableEntity.prototype.getHitBoxLeftPadding = function(){
    return this.getHitBox().getPos()[0];
  }

  RenderableEntity.prototype.getX = function(){
      return this.pos[0];
  }

  RenderableEntity.prototype.getY = function(){
    return this.pos[1];
  }

  RenderableEntity.prototype.drawLife = function(ctx){
    var hitBoxWidth = this.getHitBox().width;

    var lifeSize = 80;
    var chunkLifeValue = 10;
    var chunks = 0;
    var minChunkSize = 5;
    var maxChunksPerBar = lifeSize/minChunkSize;
    var lifePerBar = maxChunksPerBar * chunkLifeValue;

    /** Chunks of life */
    chunks = Math.round(this.totalLife / chunkLifeValue);
    var chunksPerBar = chunks < maxChunksPerBar ? chunks : maxChunksPerBar;
    var aliveChunks = Math.round(this.life / chunkLifeValue);

    //Todo change 100 by hitBoxWidth
    var chunkSize = lifeSize / chunks;
    chunkSize = chunkSize > minChunkSize ? chunkSize :  minChunkSize;
    //Draw red squares
    
    ctx.beginPath();
    for(var i = 0; i < chunksPerBar; i ++){
      ctx.rect(lifeSize - (i+1) * chunkSize +1 , 0, chunkSize, 10);
    }
    ctx.fillStyle = 'rgba(255, 10, 0, 0.68)';
    ctx.fill();
    ctx.stroke();

    //Draw green squares
    var index = 0;
    var barNumber = 0;
    var color = 'rgba(0, 255, 0, 0.68)';

    ctx.beginPath();
    for(var i = 0; i < aliveChunks; i++){
      if(i  % chunksPerBar  == 0 && i != 0){
        index = 0;
        barNumber++;
        color = fillAndRenew(ctx, barNumber, color);
      }
      ctx.rect(index * chunkSize+1 , 0, chunkSize, 10);
      index++;
    }
    fillColor(ctx, color);

  }
  function fillColor(ctx, color){
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
  }
  function fillAndRenew(ctx, barNumber, color){
    fillColor(ctx,color);
    ctx.beginPath();
    
    if(barNumber == 1){
      return 'blue';
    }else if(barNumber >= 2 &&  barNumber < 5 ){
      return 'pink';
    }else{
      return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
    }
  }

  RenderableEntity.prototype.resetAnimation = function(animation){
    if(animation == 'default'){
      this.sprite.reset();
    }else{
      this.animations[this.enabledAnimation].reset();
    }
  }

  RenderableEntity.prototype.setAnimation = function(name, cb,reset){
    if(this.animations[name]){
      this.enabledAnimation = name;
      if(cb){
        this.animations[this.enabledAnimation].setFrameChangeCallback(cb);
      }
      if(reset){
        this.resetAnimation(this.enabledAnimation);
      }
    }
  }
  RenderableEntity.prototype.setDefaultAnimation = function(){
    this.enabledAnimation = 'default';
  }

  RenderableEntity.prototype.update = function(dt){
    if(this.enabledAnimation == 'default'){
      this.sprite.update(dt);
    }else{
      this.animations[this.enabledAnimation].update(dt);
    }
    if(this.behaviourUpdate){
      this.behaviourUpdate(dt);
    }
  }


  RenderableEntity.prototype.getLookingPosition = function(){
    if(this.aimingAt){
      return (petra.calculateAngleFromAToB(this.pos, this.aimingAt.pos));
    }else if(this.rotateSprite){
      return this.rotateSprite;
    }else{
      return null;
    }
  }
  RenderableEntity.prototype.getBulletAngle = function(){
    var lookingPosition = this.getLookingPosition();
    if(lookingPosition){
      return lookingPosition;
    }else{
      return this.angle;
    }
  }

  RenderableEntity.prototype.getShootOrigin = function(){
    var angle = this.getBulletAngle() ;
    angle = this.getSprite().lookingLeft ? angle - Math.PI: angle;
    var center = this.getCenterOfRotation();
    var point =petra.sumArrays([0,0], this.shootOrigin);

     var s  = Math.sin(angle);
    var c = Math.cos(angle);
    point[0]-=center[0];
    point[1]-=center[1];

    xnew = point[0]* c - point[1]*s;
    ynew = point[0]* s + point[1]*c;

    return petra.sumArrays(this.pos, [xnew + center[0], ynew + center[1]]);
  }

  return  {
    Dialog: Dialog,
    Message: Message,
    Entity: RenderableEntity,
    Scene: Scene,
    RenderableText: RenderableText,
    SpaceParticle: SpaceParticle
  };

});