define( [ 'hu','game/entities', 'petra','game/assets', 'game/models/models'], function(hu, EL, petra, ASSETSList, models){

  var Scenario = function(canvasId, endCallback, scenespeed, bgspeed){
    this.scene = new models.Scene(ASSETSList ,canvasId, endCallback , {
      scenespeed: scenespeed,
      bgspeed : bgspeed,
      BGx : 0
    });
  };
  
  Scenario.prototype.init = function() {
    var self = this;

    this.scene.init = (function(){
      self.createParallaxLayers.bind(self)();
    }).bind(this.scene);

    this.scene.update = (function(dt,realtimeDt){ this.update(dt,realtimeDt);}).bind(this);
    
    /** Create particles **/
    var particles = createParticles(this.scene.canvas.width, this.scene.canvas.height);

    this.scene.particles = particles;

    this.scene.updateParticles = function(dt){
      this.particles = hu.compact(
        particles.map(function(particle){  particle.update(dt);  return particle; })
        .map(function(particle){ 
          if(particle.pos[0] < 0){
            particle.pos[0] = petra.random(this.canvas.width, this.canvas.width * 2);
            particle.pos[1] = petra.random(0, this.canvas.height);
          }
          return particle;
        })
      )
    }.bind(this.scene);

    this.scene.normalParallaxUpdate = function(dt, parallaxItems,canvasWidth, moving,speed){
        return parallaxItems.map(function(parallax){
          if(parallax.index >= canvasWidth ){
            parallax.index = 0;
            var element = parallax.images.shift();
            parallax.images.push(element);
          }
          parallax.index += dt * speed ;
          if(moving && moving == 'down'){
            parallax.yIndex -= dt * speed;
            if(parallax.yIndex < -parallax.maxYIndex){
              parallax.yIndex = -parallax.maxYIndex;
            }

          }else if(moving && moving == 'up'){
             parallax.yIndex += dt * speed;
            if(parallax.yIndex > parallax.maxYIndex){
              parallax.yIndex = parallax.maxYIndex;
            }
          }
          return parallax;
        })
      }
    
    this.scene.updateParallax = function(dt){
      var canvasWidth = this.canvas.width;
      var moveBackLayer, moveFrontLayer;
      if(self.moving  && self.moving == 'down'){
        moveBackLayer = 'up';
        moveFrontLayer = 'down';
      }else if(self.moving && self.moving == 'up'){
        moveBackLayer = 'down';
        moveFrontLayer = 'up';
      }

      if(self.parallaxLayersBack && self.parallaxLayersBack.length > 0){
        self.parallaxLayersBack = this.normalParallaxUpdate(dt,self.parallaxLayersBack,canvasWidth, moveBackLayer , 0.3);
      }

      if(self.parallaxLayersFront && self.parallaxLayersFront.length > 0){
        self.parallaxLayersFront = this.normalParallaxUpdate(dt, self.parallaxLayersFront,canvasWidth, moveFrontLayer, 0.8);
      }

    }.bind(this.scene);

    this.scene.renderParticles = function(){
      var self = this;

      this.particles.map(function(particle){
        particle.draw(self.bufferCtx);
      })
    }.bind(this.scene);

    this.scene.updateBackground = (function(dt){ 
      this.bufferCtx.fillStyle = '#02022B';
      this.bufferCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.updateParticles(dt);
      this.updateParallax(dt);

    }).bind(this.scene);

    this.scene.load();
  }

  function createParticles(width, height){
    var amount =  (width * height )/ 10000;
    var particles = [];
    for(var i = 0; i < amount; i++){
      var options = { 
        pos: [petra.random(0, width*2), petra.random(0, height)], 
        size: petra.randomFloat(0.15,5), 
        color: 'white',
        speed: [petra.randomFloat(1,5), petra.randomFloat(1,10)]
      }
      var particle = new models.SpaceParticle(options);
      particles.push(particle);
    }
    return particles;
  }

  Scenario.prototype.pause = function(){
    this.scene.pause();
  }

  /** Needs to be defined , it's overwritten by app.js */
  Scenario.prototype.update = function(){ }

  /* Sets the entities that scene has to render */
  Scenario.prototype.setRenderEntities = function(fnEntities, fnTextEntities){
    var self = this;
    this.scene.render = (function(){
      var listOfEntitiesArrays = fnEntities();
      for(var i = 0; i < listOfEntitiesArrays.length; i++){
        if(listOfEntitiesArrays[i].background){
          this.renderEntities(listOfEntitiesArrays[i].entities);
        }
      }

      if(self.parallaxLayersBack && self.parallaxLayersBack.length > 0){
        this.renderParallaxLayers(self.parallaxLayersBack);
      }
      this.darkenLayer();

      if(self.parallaxLayersFront && self.parallaxLayersFront.length > 0){
        this.renderParallaxLayers(self.parallaxLayersFront);
      }
      for(var i = 0; i < listOfEntitiesArrays.length; i++){
        if(!listOfEntitiesArrays[i].background){
          this.renderEntities(listOfEntitiesArrays[i].entities);
        }
      }

      var listOfTextEntitiesArrays = fnTextEntities();
      for(var i = 0; i < listOfTextEntitiesArrays.length; i++){
        this.renderTexts(listOfTextEntitiesArrays[i].entities, listOfTextEntitiesArrays[i].type);
      }
      this.renderParticles();
    }).bind(this.scene);
  }

  Scenario.prototype.setParallaxLayers = function(layers){
    this.temporalLayersData = layers;
  }

  Scenario.prototype.createParallaxLayers = function(){
    var canvasWidth = this.scene.canvas.width;
    var canvasHeight = this.scene.canvas.height;
    var self = this;
    var parallaxLayersBack = [];
    var parallaxLayersFront = [];
    if(this.temporalLayersData && this.temporalLayersData[0]){
      this.createParallaxBotTop(this.temporalLayersData[0], parallaxLayersBack, canvasHeight, 100,0);
    }
    parallaxLayersBack.map(function(layer){
      layer.patterns = [];
      layer.images.map(function(imageList){
        layer.patterns.push(self.scene.generateParallaxPattern(imageList, 100));
      })
      return layer;
    })
    if(this.temporalLayersData && this.temporalLayersData[1]){
      this.createParallaxBotTop(this.temporalLayersData[1], parallaxLayersFront, canvasHeight, 60, -150);
    }
    parallaxLayersFront.map(function(layer){
      layer.patterns = [];
      layer.images.map(function(imageList){
        layer.patterns.push(self.scene.generateParallaxPattern(imageList, 60));
      })
      return layer;
    })
    this.parallaxLayersBack = parallaxLayersBack;
    this.parallaxLayersFront = parallaxLayersFront;
  }

  /**
   * Generates 2 elements, with top and bot positions, Comoposed by 2 images that will rotate on the screen
   * Every one of this images is composed by several images randomly picked from the arraOfImageNames
   */
  Scenario.prototype.createParallaxBotTop = function(arrOfImageNames, parallaxLayers, canvasHeight, parallaxHeight, xOffset){
    var images = arrOfImageNames.map(function(name){
      return resources.get(name);
    });
    var parallax1_top = this.scene.makeParallax(images);
    var parallax2_top = this.scene.makeParallax(images);
    var parallax1_bot = this.scene.makeParallax(images);
    var parallax2_bot = this.scene.makeParallax(images);
    parallaxLayers.push({ 
      index: 0, 
      pos: [xOffset,-parallaxHeight / 2],
      images: [parallax1_top, parallax2_top],
      yIndex : 0,
      maxYIndex: parallaxHeight/2 - 20
    });
    parallaxLayers.push({ 
      index: 0, 
      pos: [xOffset,canvasHeight - parallaxHeight / 2],
      images: [parallax1_bot, parallax2_bot],
      yIndex : 0,
      maxYIndex: parallaxHeight/2 - 20
    });

  }

  Scenario.prototype.moveDown = function(){
    this.moving = 'down';
  }
  Scenario.prototype.moveUp = function(){
    this.moving = 'up';
  }
  Scenario.prototype.stopMove = function(){
    this.moving = null;
  }
  function updateEntity(dt){
    return function(entity){
      entity.update(dt);
      return entity;
    };
  }


  Scenario.prototype.screenShake = function(){
    this.scene.screenShake(0.5);
  }

  return Scenario;
});