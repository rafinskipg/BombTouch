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

  function Message(text, sender, duration){
    this.text = text;
    this.sender = sender;
    this.duration = duration || 2000;
  }

  function SquareHitBox(opts){
    this.pos = opts.pos;
    this.size = opts.size;
    this.width = opts.size[0];
    this.hitboxStartPoint = opts.hitboxStartPoint;

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

  SquareHitBox.prototype.rotate = function(angle){
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    for(var i = 0; i <this.points.length; i++){
      var x = this.points[i][0];
      var y = this.points[i][1];

      this.points[i][0] = x*cos - y*sin;
      this.points[i][1] = y*cos + x*sin;
    }
  }

  SquareHitBox.prototype.getPos = function(){
    return petra.sumArrays(this.topLeft, this.pos);
  } 
  SquareHitBox.prototype.getPoints = function(){
    var arr = [];
    for(var i = 0; i < this.points.length; i++){
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
    this.font = opts.font || '16px';
  }

  /*RenderableEntity*/
  function RenderableEntity(opts){
    this.pos = opts.pos;
    this.speed = opts.speed || [0,0];
    this.angle = opts.angle || 0;
    this.damage = opts.damage || 0;
    this.life = opts.life || 0;
    this.totalLife = opts.totalLife || 0;
    this.baseDamage = opts.baseDamage || 0;
    this.points = opts.points || 0;
    this.sprite = Sprite.construct(opts.sprite);
    this.renderTranslated = opts.renderTranslated || null;
    this.centerOfRotation = opts.centerOfRotation || null;
    this.animations = {};
    this.rotateSprite = opts.rotateSprite ? opts.rotateSprite : null;
    this.bulletShotFireName = opts.bulletShotFireName || 'bossShootFire';
    this.bulletName =  opts.bulletName || 'bullet';
    this.actions = opts.actions || null;
    this.dropProbabilities = opts.dropProbabilities || 0.05;
    this.dropItem = opts.dropItem || 'greenGem';
    this.shootOrigin = opts.shootOrigin || [0,0];
    this.critChance = opts.critChance || 0;

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
    this.lifeBox = opts.lifeBox || null;
  }

  RenderableEntity.prototype.render = function(ctx){
    if(this.hitbox  || true){
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
      this.sprite.render(ctx, this.getLookingPosition(), this.renderTranslated, this.getCenterOfRotation());
    }else{
      this.animations[this.enabledAnimation].render(ctx,this.getLookingPosition(), this.renderTranslated, this.getCenterOfRotation());
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
    
    squareHitB = new SquareHitBox(opts);
    squareHitB.rotate(this.getBulletAngle());
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

    var lifeTotal = (hitBoxWidth - 5 ) * (this.life/ this.totalLife);
    ctx.beginPath();
    ctx.rect(5, 0, hitBoxWidth - 5, 7);
    ctx.fillStyle = 'rgba(255, 10, 0, 0.68)';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black'; 
    ctx.stroke();

    ctx.beginPath();
    ctx.rect( (hitBoxWidth - lifeTotal -5), 0, lifeTotal, 7);
    ctx.fillStyle = 'rgba(0, 255, 0, 0.68)';
    ctx.fill();
    ctx.stroke();

    if(this.lifeBox){
      this.lifeBox.render(ctx, this.rotateSprite, this.renderTranslated);
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
    return petra.rotatePoint(this.pos,this.shootOrigin, this.getBulletAngle(), this.getCenterOfRotation());
  }

  return  {
    Message: Message,
    Entity: RenderableEntity,
    Scene: Scene,
    RenderableText: RenderableText
  };

});