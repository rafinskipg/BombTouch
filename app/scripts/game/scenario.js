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

    this.scene.updateParallax = function(dt){
      var canvasWidth = this.canvas.width;
      if(self.parallaxLayers && self.parallaxLayers.length > 0){
        self.parallaxLayers = self.parallaxLayers.map(function(parallax){
          if(parallax.index >= canvasWidth ){
            parallax.index = 0;
            var element = parallax.images.shift();
            parallax.images.push(element);
          }
          parallax.index += dt;
          return parallax;
        })
      }
    }.bind(this.scene);

    this.scene.renderParticles = function(){
      var self = this;
      console
      this.particles.map(function(particle){
        particle.draw(self.ctx);
      })
    }.bind(this.scene);

    this.scene.updateBackground = (function(dt){ 
      this.ctx.fillStyle = '#02022B';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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

      if(self.parallaxLayers && self.parallaxLayers.length > 0){
        for(var i = 0; i < self.parallaxLayers.length; i++){
          for(var j = 0; j< self.parallaxLayers[i].patterns.length; j++){
            var posX = self.parallaxLayers[i].pos[0] + j * this.canvas.width - self.parallaxLayers[i].index;
            var posY = self.parallaxLayers[i].pos[1];
            this.drawParallax(self.parallaxLayers[i].patterns[j], [posX, posY], 100);
          } 
        }
      }
      this.darkenLayer();

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
    var parallaxLayers = [];
    if(this.temporalLayersData && this.temporalLayersData[0]){
      this.createParallaxBotTop(this.temporalLayersData[0], parallaxLayers, canvasHeight, 100);
    }
    parallaxLayers.map(function(layer){
      layer.patterns = [];
      layer.images.map(function(imageList){
        layer.patterns.push(self.scene.generateParallaxPattern(imageList, 100));
      })
      return layer;
    })
    this.parallaxLayers = parallaxLayers;
  }


  /**
   * Generates 2 elements, with top and bot positions, Comoposed by 2 images that will rotate on the screen
   * Every one of this images is composed by several images randomly picked from the arraOfImageNames
   */
  Scenario.prototype.createParallaxBotTop = function(arrOfImageNames, parallaxLayers, canvasHeight, parallaxHeight){
    var images = arrOfImageNames.map(function(name){
      return resources.get(name);
    });
    var parallax1_top = this.scene.makeParallax(images);
    var parallax2_top = this.scene.makeParallax(images);
    var parallax1_bot = this.scene.makeParallax(images);
    var parallax2_bot = this.scene.makeParallax(images);
    parallaxLayers.push({ 
      index: 0, 
      pos: [0,-parallaxHeight / 2],
      images: [parallax1_top, parallax2_top]
    });
    parallaxLayers.push({ 
      index: 0, 
      pos: [0,canvasHeight - parallaxHeight / 2],
      images: [parallax1_bot, parallax2_bot]
    });

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