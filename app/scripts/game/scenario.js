define( [ 'hu','game/entities', 'game/petra'], function(hu, EL, petra){
  var TIME,
    TIME_SINCE_LAST_OUT,
    BG_X,
    DELAY;

  var backgroundEntities =
  [
    'nebula',
    'nebula2',
    'asteroids',
    'asteroids2',
    'asteroids3',
    'blackhole',
    'galaxy',
    'galaxy2'
  ];


  var Scenario = function(canvas, ctx){
    this.canvas = canvas;
    this.ctx = ctx;
    TIME_SINCE_LAST_OUT = 0; TIME = 0; DELAY = 0;
    this.bgElements = [];
    this.frontElements = [];
  };
  
  Scenario.prototype.update = function(dt){
    TIME +=dt;
    TIME_SINCE_LAST_OUT += dt;

    this.frontElements = hu.compact(
      this.frontElements.map(petra.moveByAngle(dt))
      .map(petra.removeIfOutsideScreenleft)); 

    this.bgElements = hu.compact(
      this.bgElements.map(petra.moveByAngle(dt))
      .map(petra.removeIfOutsideScreenleft));

    if(TIME_SINCE_LAST_OUT >= DELAY){
      TIME_SINCE_LAST_OUT = 0;
      DELAY = parseInt(Math.random() * 15);
      this.addBackground();
    }
  }

  Scenario.prototype.addBackground = function(){
    var index = petra.random(0, backgroundEntities.length);
    this.addItem(backgroundEntities[index]);
  }

  Scenario.prototype.addItem = function(item){
    if(petra.flipCoin()){
      this.bgElements.push(EL.getBackgroundEntity(item, [this.canvas.width, petra.random(0, this.canvas.height)], petra.random(20,50),Math.random().toFixed(2)));  
    }else{
      this.frontElements.push(EL.getBackgroundEntity(item, [this.canvas.width, petra.random(0, this.canvas.height)],petra.random(50,70),1+Math.random().toFixed(2)));  
    }
    
  }

  Scenario.prototype.render = function(listOfEntitiesArrays){
    this.renderEntities(this.bgElements);
    for(var i = 0; i < listOfEntitiesArrays.length; i++){
      this.renderEntities(listOfEntitiesArrays[i]);
    }
    this.renderEntities(this.frontElements);
  }

  Scenario.prototype.renderEntities = function(list) {
    for(var i=0; i<list.length; i++) {
      this.renderEntity(list[i]);
    }
  }

  Scenario.prototype.renderEntity = function(entity) {
    this.ctx.save();

    this.ctx.translate(Math.round(entity.pos[0]), Math.round(entity.pos[1]));
    entity.sprite.render(this.ctx);
    this.ctx.restore();
    if(entity.life){
      this.drawLife(entity);
    }
 
  }

  Scenario.prototype.drawFrames = function(frames){
    this.ctx.fillStyle = "blue";
    this.ctx.font = "bold 16px Arial";
    this.ctx.fillText(frames, 100, 100);
  }

  Scenario.prototype.drawLife = function(entity){
    var lifeTotal = entity.sprite.getSize()[0] * (entity.life/ entity.totalLife);
    var x = Math.round(entity.pos[0]);
    var y = Math.round(entity.pos[1]);
    this.ctx.beginPath();
    this.ctx.rect(x, y + entity.sprite.getSize()[1], entity.sprite.getSize()[0], 7);
    this.ctx.fillStyle = 'rgba(255, 10, 0, 0.68)';
    this.ctx.fill();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'black'; 
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.rect(x+ (entity.sprite.getSize()[0]-lifeTotal), y + entity.sprite.getSize()[1], lifeTotal, 7);
    this.ctx.fillStyle = 'rgba(0, 255, 0, 0.68)';
    this.ctx.fill();
    this.ctx.stroke();
  }
  return Scenario;
});