define( [ 'hu','game/entities', 'game/petra','game/assets', 'game/models/models'], function(hu, EL, petra, ASSETSList, models){
  var TIME,
    TIME_SINCE_LAST_OUT,
    BG_X,
    DELAY;

  var backgroundEntities =
  [
    'nebula',
    'nebula2',
    'nebula3',
    'asteroids',
    'asteroids2',
    'asteroids3',
    'blackhole',
    'galaxy',
    'galaxy2',
    'comet'
  ];



  var Scenario = function(canvasId, endCallback, scenespeed, bgspeed){
    TIME_SINCE_LAST_OUT = 0; TIME = 0; DELAY = 0;
    this.scene = new models.Scene(ASSETSList ,canvasId, endCallback , {
      scenespeed: scenespeed,
      bgspeed : bgspeed,
      BGx : 0
    });
  };
  
  Scenario.prototype.init = function() {
    this.bgElements = [];
    this.frontElements = [];
    
    this.scene.init = (function(){
      
    }).bind(this.scene);

    this.scene.update = (function(dt,realtimeDt){ this.update(dt,realtimeDt); this.updateBackgrounds(dt,realtimeDt);}).bind(this);
    
    this.scene.updateBackground = (function(dt){ 
      this.BGx -= dt;
      this.ctx.drawImage(resources.get('images/background.png'), this.BGx, 0,this.canvas.width, this.canvas.height);
      this.ctx.drawImage(resources.get('images/background.png'), this.BGx + this.canvas.width, 0,this.canvas.width, this.canvas.height);
     
      // If the image scrolled off the screen, reset
      if (this.BGx < -this.canvas.width){
        this.BGx =0;
      }
    }).bind(this.scene);
    this.scene.load();
  }

  Scenario.prototype.pause = function(){
    this.scene.pause();
  }

  Scenario.prototype.setRenderEntities = function(fn){
    var self = this;
    this.scene.render = (function(){
      var listOfEntitiesArrays = fn();
      this.renderEntities(self.bgElements);
      for(var i = 0; i < listOfEntitiesArrays.length; i++){
        this.renderEntities(listOfEntitiesArrays[i]);
      }
      this.renderEntities(self.frontElements);
    }).bind(this.scene);
  }

  Scenario.prototype.updateBackgrounds = function(dt){
    TIME +=dt;
    TIME_SINCE_LAST_OUT += dt;
    var self = this;

    this.frontElements = hu.compact(
      this.frontElements
      .map(self.updateSprite(dt))
      .map(petra.moveByAngle(dt))
      .map(petra.removeIfOutsideScreenleft)); 

    this.bgElements = hu.compact(
      this.bgElements
      .map(self.updateSprite(dt))
      .map(petra.moveByAngle(dt))
      .map(petra.removeIfOutsideScreenleft));

    if(TIME_SINCE_LAST_OUT >= DELAY){
      TIME_SINCE_LAST_OUT = 0;
      DELAY = parseInt(Math.random() * 15);
      this.addBackground();
    }
  }

  Scenario.prototype.updateSprite = function updateSprite(dt){
    return function(entity){
      entity.update(dt);
      return entity;
    };
  }

  Scenario.prototype.addBackground = function(){
    var index = petra.random(0, backgroundEntities.length);
    this.addItem(backgroundEntities[index]);
  }

  Scenario.prototype.addItem = function(item){
    var opts = {
      pos : [this.scene.canvas.width+100, petra.random(-30, this.scene.canvas.height + 30)],
      speed: [petra.random(20,50),petra.random(20,50)],
      resizePercentage: Math.random().toFixed(2),
      //rotateSprite : petra.flipCoin() ?  petra.randomFloat(-0.4, 0.4) : 0
    }
    if(petra.flipCoin()){
      this.bgElements.push(EL.getBackgroundEntity(item, opts));  
    }else{
      opts.speed = [petra.random(70,90),petra.random(70,90)];
      opts.resizePercentage = 1+Math.random().toFixed(2);
      this.frontElements.push(EL.getBackgroundEntity(item, opts));  
    }
  }

  return Scenario;
});