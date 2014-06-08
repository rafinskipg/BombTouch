define( ['game/models/scene', 'game/petra'], function(Scene, petra){
  
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
    this.animations = {};
    this.rotateSprite = opts.rotateSprite ? opts.rotateSprite : null;
    this.bulletName = opts.bulletName || null;
    this.bulletShotFireName = opts.bulletShotFireName || null;
    
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
    if(this.enabledAnimation == 'default'){
      this.sprite.render(ctx, this.rotateSprite, this.renderTranslated);
    }else{
      this.animations[this.enabledAnimation].render(ctx,this.rotateSprite, this.renderTranslated);
    }
    
    if(this.hitbox){
      ctx.beginPath();
      var hitbox = this.getHitBox();
      var pos = [0,0];
      pos = this.hitbox.pos
     
      ctx.rect(pos[0], pos[1], hitbox.size[0], hitbox.size[1]);
      ctx.fillStyle = 'rgba(255, 10, 0, 0.68)';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'black'; 
      ctx.stroke();
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

  RenderableEntity.prototype.getHeight = function(){
    return this.getSize()[1];
  }
   RenderableEntity.prototype.getWidth = function(){
    return this.getSize()[1];
  }

  RenderableEntity.prototype.getHitBox = function() {
    if(!this.hitbox){
      return { 
        pos: this.pos,
        size: this.getSize()
      };
    }else{
      //console.log('wat');
      //console.log(this.hitbox.pos, this.pos);
      return {
        pos: petra.sumArrays(this.pos, this.hitbox.pos),
        size: this.hitbox.size
      };
    }
  };

  RenderableEntity.prototype.getHitBoxWidth = function(){
    return this.getHitBox().size[0];
  }
  RenderableEntity.prototype.getHitBoxLeftPadding = function(){
    return this.getHitBox().pos[0];
  }

  RenderableEntity.prototype.getX = function(){
    return this.pos[0];
  }

  RenderableEntity.prototype.getY = function(){
    return this.pos[1];
  }

  RenderableEntity.prototype.drawLife = function(ctx){
    var lifeTotal = (this.getHitBoxWidth() - 5 ) * (this.life/ this.totalLife);

    ctx.beginPath();
    ctx.rect(5, 0, this.getHitBoxWidth() - 5, 7);
    ctx.fillStyle = 'rgba(255, 10, 0, 0.68)';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black'; 
    ctx.stroke();

    ctx.beginPath();
    ctx.rect( (this.getHitBoxWidth() - lifeTotal -5), 0, lifeTotal, 7);
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
    this.enabledAnimation = name;
    if(cb){
      this.animations[this.enabledAnimation].setFrameChangeCallback(cb);
    }
    if(reset){
      this.resetAnimation(this.enabledAnimation);
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
  }


  return  {
    Message: Message,
    Entity: RenderableEntity,
    Scene: Scene
  };

});