define( [ 'hu','game/entities', 'petra','game/assets', 'game/models/models'], function(hu, EL, petra, ASSETSList, models){

  var Scenario = function(canvasId, endCallback, scenespeed, bgspeed){
    this.scene = new models.Scene(ASSETSList ,canvasId, endCallback , {
      scenespeed: scenespeed,
      bgspeed : bgspeed,
      BGx : 0
    });
  };
  
  Scenario.prototype.init = function() {
    this.bgElements = [];
    this.frontElements = [];
    
    this.scene.init = (function(){}).bind(this.scene);

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
  Scenario.prototype.update = function(){ }

  Scenario.prototype.setRenderEntities = function(fnEntities, fnTextEntities){
    var self = this;
    this.scene.render = (function(){
      var listOfEntitiesArrays = fnEntities();
      for(var i = 0; i < listOfEntitiesArrays.length; i++){
        this.renderEntities(listOfEntitiesArrays[i]);
      }

      var listOfTextEntitiesArrays = fnTextEntities();
      for(var i = 0; i < listOfTextEntitiesArrays.length; i++){
        this.renderTexts(listOfTextEntitiesArrays[i]);
      }
      this.renderParticles();
    }).bind(this.scene);
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