define( [], function(){
  
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
    this.speed = opts.speed;
    this.angle = opts.angle || 0;
    this.damage = opts.damage || 0;
    this.life = opts.life || 0;
    this.totalLife = opts.totalLife || 0;
    this.baseDamage = opts.baseDamage || 0;
    this.points = opts.points || 0;
    this.sprite = Sprite.construct(opts.sprite)
    this.animations = {};
    if(opts.resize){
      this.sprite.resize(opts.resize[0], opts.resize[1]);
    }

    if(opts.animations){
      var self = this;
      opts.animations.map(function(anim){ 
        self.animations[anim.name] = Sprite.construct(anim.sprite);
        if(opts.resize){
          self.animations[anim.name].resize(opts.resize[0], opts.resize[1]);
        }
      });  
    }
    
    this.enabledAnimation = 'default';
  }

  RenderableEntity.prototype.render = function(ctx){
    if(this.enabledAnimation == 'default'){
      this.sprite.render(ctx);
    }else{
      this.animations[this.enabledAnimation].render(ctx);
    }
  }

  RenderableEntity.prototype.setAnimation = function(name){
    this.enabledAnimation = name;
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
    Entity: RenderableEntity
  };

});