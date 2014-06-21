define( [ 'hu','game/entities', 'petra','game/assets', 'game/models/models'], function(hu, EL, petra, ASSETSList, models){
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
    'dust'
  ];

  var Scenario = function(canvasId, endCallback, scenespeed, bgspeed){
    TIME_SINCE_LAST_OUT = 0; TIME = 0; DELAY = 0;
    this.scene = new models.Scene(ASSETSList ,canvasId, endCallback , {
      scenespeed: scenespeed,
      bgspeed : bgspeed,
      BGx : 0
    });
    this.scene.backgrounds = [];
    this.scene.backgrounds.push('images/backgrounds/galaxy.png');
    this.scene.backgrounds.push('images/backgrounds/dust.png');
    this.scene.backgrounds.push('images/backgrounds/thing.png');

  };
  
  Scenario.prototype.init = function() {
    this.bgElements = [];
    this.frontElements = [];
    
    this.scene.init = (function(){
      
    }).bind(this.scene);

    this.scene.update = (function(dt,realtimeDt){ this.update(dt,realtimeDt); this.updateBackgrounds(dt,realtimeDt);}).bind(this);
    
    this.scene.updateBackground = (function(dt){ 
      this.BGx -= dt;
      this.ctx.drawImage(resources.get('images/backgrounds/background.png'), this.offSetX + this.BGx, this.offSetY + 0,this.canvas.width, this.canvas.height);
      this.ctx.drawImage(resources.get(this.backgrounds[0]), this.offSetX +  this.BGx,  this.offSetY + 0,640, 400);
      this.ctx.drawImage(resources.get('images/backgrounds/background.png'),this.offSetX +  this.BGx + this.canvas.width, this.offSetY + 0,this.canvas.width, this.canvas.height);
      this.ctx.drawImage(resources.get(this.backgrounds[1]), this.offSetX +  this.BGx + this.canvas.width,this.offSetY +  0,640, 400);
      
      // If the image scrolled off the screen, reset
      if (this.BGx < -this.canvas.width){
        this.BGx =0;
        this.backgrounds.push(this.backgrounds.shift());
      }

    }).bind(this.scene);
    this.scene.load();
  }

  Scenario.prototype.pause = function(){
    this.scene.pause();
  }
  Scenario.prototype.update = function(){ }

  Scenario.prototype.setRenderEntities = function(fnEntities, fnTextEntities){
    var self = this;
    this.scene.render = (function(){
      var listOfEntitiesArrays = fnEntities();
      this.renderEntities(self.bgElements);
      for(var i = 0; i < listOfEntitiesArrays.length; i++){
        this.renderEntities(listOfEntitiesArrays[i]);
      }

      var listOfTextEntitiesArrays = fnTextEntities();
      for(var i = 0; i < listOfTextEntitiesArrays.length; i++){
        this.renderTexts(listOfTextEntitiesArrays[i]);
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
      .map(updateEntity(dt))
      .map(petra.moveByAngle(dt))
      .map(petra.removeIfOutsideScreenleft)); 

    this.bgElements = hu.compact(
      this.bgElements
      .map(updateEntity(dt))
      .map(petra.moveByAngle(dt))
      .map(petra.removeIfOutsideScreenleft));

    if(TIME_SINCE_LAST_OUT >= DELAY){
      TIME_SINCE_LAST_OUT = 0;
      DELAY = parseInt(Math.random() * 15);
      this.addBackground();
    }
  }

  function updateEntity(dt){
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

  Scenario.prototype.screenShake = function(){
    this.scene.screenShake(0.5);
  }

  return Scenario;
});