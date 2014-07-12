define( [ 'game/models/hitboxes'], function( hitboxes){

  function getRgbaColors(color){
    color = color.r + ',' + color.g + ',' + color.b;
    return {
      full: 'rgba(' + color + ', 1)',
      medium: 'rgba(' + color + ', 0.7)',
      clear: 'rgba(' + color + ', 0)'
    }
  }

  function Bullet(options){
    this.pos = options.pos;
    this.speed = options.speed
    this.damage = options.damage;
    this.color = options.color  || { r: 255, g: 255, b: 255};
    this.colors = getRgbaColors(this.color);
    this.size = options.size;
    this.angle = options.angle;
    this.rotate = options.rotate || null;

    this.getHitBox = function(){
      var opts = {
        pos: this.pos, 
        hitboxStartPoint: [0,0],
        size: this.size
      }
      
      return new hitboxes.SquareHitBox(opts);
    }

    this.getSize = function(){
      return [this.size, this.size];
    }

    this.getX = function(){
      return this.pos[0];
    }
    this.getY = function(){
      return this.pos[1];
    }
    this.drawCircle = function(ctx) {
      ctx.fillStyle = this.colors.full;
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
      ctx.fillStyle = this.colors.full;

      ctx.fillRect(0,
          0,
          this.size,
          this.size
      );
    }

    this.render = function(ctx){
     // ctx.globalCompositeOperation = "lighter";

      var radgrad = ctx.createRadialGradient( 
          this.size/2,
          this.size/2,
          0,
          this.size/2,
          this.size/2,
          this.size/2);
      
      radgrad.addColorStop(0, 'white');
      radgrad.addColorStop(0.4, 'white');
      radgrad.addColorStop(0.4, this.colors.full);
      radgrad.addColorStop(1, this.colors.clear);

      // draw shape
      ctx.fillStyle = radgrad;
      ctx.fillRect(0,0,
          this.size,
          this.size
      );
    }

  }

  Bullet.prototype.update = function(dt){
    //this.pos[0] -= this.speed[0] * dt;
  }

  return {
    Bullet : Bullet
  };

});