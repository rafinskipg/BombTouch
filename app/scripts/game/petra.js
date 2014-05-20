define( ['hu'], function(hu){
  
  

    var Petra = {

    }

    Petra.random = function(min, max){
      return Math.floor(Math.random()*max)+min;
    }

    Petra.flipCoin = function(){
      return Math.floor( Math.random() * 2 ) == 1
    }

    Petra.moveToDirection = function(dt){
      return function(entity){
        var newPos = calculateNextDirection(entity, dt);
        entity.pos = newPos;
    
        return entity;
      }
    }

    Petra.radianToDegree  = function(radians){
      return radians * (180/Math.PI)
    }
    Petra.moveByAngle = function(dt){
      return function(entity){
        var angleInDegrees = Petra.radianToDegree(entity.angle*Math.PI);
        var newPos = [];
        
        newPos[0] = entity.pos[0] + dt * entity.speed * Math.cos(entity.angle*Math.PI);
        newPos[1] = entity.pos[1] + dt * entity.speed * Math.sin(entity.angle*Math.PI);
        entity.pos = newPos;
        return entity;
      }
    }

    Petra.removeIfOutsideScreenleft = function(entity){
      if(! (entity.pos[0] + entity.sprite.getSize()[0] < 0) ) {
        return entity;
      }
    }
    Petra.lerp3 = function(start,end, speed, dt){
      return start + (end - start) * 0.1; 
    }
    //Direction helpers
    var calculateNextDirection = Petra.calculateNextDirection = function(entity, dt){
      var pos = [entity.pos[0], entity.pos[1]];
      if(entity.dir == 'up') {
        pos = moveUp(entity.pos, entity.speed, dt);
      }else if(entity.dir == 'down'){
        pos = moveDown(entity.pos, entity.speed, dt);
      }else if(entity.dir == 'left'){
        pos = moveLeft(entity.pos, entity.speed, dt);
      }else if(entity.dir == 'right'){
        pos = moveRight(entity.pos, entity.speed, dt);
      }else if(entity.dir == 'upleft'){
        pos[1] = entity.pos[1] - entity.speed * dt;
        pos[0] = entity.pos[0] - entity.speed * dt;
      }else if(entity.dir == 'upright'){
        pos[1] = entity.pos[1] - entity.speed * dt;
        pos[0] = entity.pos[0] + entity.speed * dt;
      }else if(entity.dir == 'downleft'){
        pos[1] = entity.pos[1] + entity.speed * dt;
        pos[0] = entity.pos[0] - entity.speed * dt;
      }else if(entity.dir == 'downright'){
        pos[1] = entity.pos[1] + entity.speed * dt;
        pos[0] = entity.pos[0] + entity.speed * dt;
      }else {
        pos[0] = entity.pos[0] - entity.speed * dt;
      }
      return pos;
    }

    //Moving
    var moveLeft = Petra.moveLeft = function (pos, speed, dt){
      return [pos[0] - speed * dt, pos[1]];
    }
    var moveRight = Petra.moveRight = function (pos, speed, dt){
      return [pos[0] + speed * dt, pos[1]];
    }
    var moveDown = Petra.moveDown = function (pos, speed, dt){
      return [pos[0], pos[1] + speed * dt];
    }
    var moveUp = Petra.moveUp = function (pos, speed, dt){
      return [pos[0], pos[1] - speed * dt];
    }


  return Petra;
});