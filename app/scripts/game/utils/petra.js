define( ['hu'], function(hu){
  
  

    var Petra = {

    }

    Petra.random = function(min, max){
      return Math.floor(Math.random()*max)+min;
    }
    Petra.randomFloat = function(min, max){
      return (Math.random() * (max - min) + min).toFixed(2);
    }
    Petra.flipCoin = function(){
      return Math.floor( Math.random() * 2 ) == 1
    }

    Petra.moveToDirection = function(dt, dir){
      return function(entity){
        var newPos = calculateNextPosition(dir, entity, dt);
        entity.pos = newPos;
    
        return entity;
      }
    }

    Petra.radianToDegree  = function(radians){
      return radians * (180/Math.PI)
    }

    Petra.moveByAngle = function(dt){
      return function(entity){
        var newPos = calculateNextPositionByAngle(entity, dt);
        if(newPos[1] > entity.pos[1]){
          entity.moving = 'down';
        }
        entity.pos = newPos;
        return entity;
      }
    }

    Petra.removeIfOutsideScreenleft = function(entity){
      if(! (entity.pos[0] + entity.sprite.getSize()[0] < 0) ) {
        return entity;
      }
    }
    //http://stackoverflow.com/questions/573084/how-to-calculate-bounce-angle
    //http://gamedev.stackexchange.com/questions/23672/determine-resulting-angle-of-wall-collision
    //http://en.wikipedia.org/wiki/Unit_vector
    //https://github.com/craftyjs/Crafty/blob/develop/src/math.js
    /*Petra.calculateBounceAngle = function(entity, normalVector){
      var angle = Petra.calculateAngleAgainstVector(entity.pos, entity.angle, normalVector);
      var u1 = (Petra.vectorDotProduct(entity.speed, normalVector, angle ) / Petra.vectorDotProduct(normalVector,normalVector, 0);
      var u = Petra.vectorDotProduct(ui, normalVector);
      var w = Petra.vectorSubstract(entity.speed, u);
    }*/
    Petra.calculateBounceAngle = function(incidenceAngle,angleDest){
      reflectionAngle = 2*angleDest - incidenceAngle;
      return reflectionAngle;
    }

    Petra.lerp3 = function(start,end, speed, dt){
      return start + (end - start) * 0.1; 
    }
    //Direction helpers
    var calculateNextPositionByAngle = Petra.calculateNextPositionByAngle = function(entity, dt){
      var pos = [entity.pos[0], entity.pos[1]];
      var forX =  dt * entity.speed[0] * Math.cos(entity.angle*Math.PI);
      pos[0] += forX;
      var forY =  dt * entity.speed[0] * Math.sin(entity.angle*Math.PI);
      pos[1] += forY;
      return pos;
    }

    var calculateNextPosition = Petra.calculateNextPosition = function(dir, entity, dt){
      var pos = [entity.pos[0], entity.pos[1]];
      if(dir == 'up') {
        pos = moveUp(entity.pos, entity.speed, dt);
      }else if(dir == 'down'){
        pos = moveDown(entity.pos, entity.speed, dt);
      }else if(dir == 'left'){
        pos = moveLeft(entity.pos, entity.speed, dt);
      }else if(dir == 'right'){
        pos = moveRight(entity.pos, entity.speed, dt);
      }
      return pos;
    }

    //Moving
    var moveLeft = Petra.moveLeft = function (pos, speed, dt){
      return [pos[0] - speed[0] * dt, pos[1]];
    }
    var moveRight = Petra.moveRight = function (pos, speed, dt){
      return [pos[0] + speed[0] * dt, pos[1]];
    }
    var moveDown = Petra.moveDown = function (pos, speed, dt){
      return [pos[0], pos[1] + speed[1] * dt];
    }
    var moveUp = Petra.moveUp = function (pos, speed, dt){
      return [pos[0], pos[1] - speed[1] * dt];
    }

    //Operations to arrays.
    Petra.sumIntegerToArray = function(arr, int){
      var arrret = [];
      for(var i = 0; i < arr.length; i++){
        arrret.push(arr[i] + int);
      }
      return arrret;
    }
    Petra.sumArrays = function(arr, arr2){
      var arrReturn = [];
      arr.map(function(item, i){
        arrReturn.push(item+arr2[i]);
      })
      return arrReturn;
    }
    Petra.multIntegerToArray = function(arr, int){
      var arrret = [];
      for(var i = 0; i < arr.length; i++){
        arrret.push(arr[i] * int);
      }
      return arrret;
    }


  return Petra;
});