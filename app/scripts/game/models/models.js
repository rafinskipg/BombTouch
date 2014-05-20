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
    this.sprite = Sprite.construct(opts.sprite);
  }

  RenderableEntity.prototype.render = function(ctx){
    
  }



  return  {
    Message: Message,
    Entity: RenderableEntity
  };

});