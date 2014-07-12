define( [ 'petra'], function( petra){

 function SquareHitBox(opts){
    this.pos = opts.pos;
    this.size = opts.size;
    this.width = opts.size[0];
    this.centerOfRotation = opts.centerOfRotation;
    this.hitboxStartPoint = opts.hitboxStartPoint || [0,0];
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
      arr.push(petra.sumArrays(this.points[i], this.pos));
    }
    return arr;
  }

  return {
    SquareHitBox : SquareHitBox
  };

});