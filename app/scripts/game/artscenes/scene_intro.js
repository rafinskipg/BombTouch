define( ['game/models/models', 'game/petra','game/entities', 'resources','game/raf', 'game/QuadTree'], function(models, petra, entities){
  var scene;

  function init(canvasId, endCallback){
    scene = new models.Scene([
      'images/doggy/pixeleddog.png',
      'images/weapons/bullets.png'
      ],canvasId, endCallback);

    scene.init = (function(){
      this.dog = entities.getEntity('cooldog',{pos: [50, this.canvas.height / 2]});
    }).bind(scene);

    scene.update = (function(dt){
      this.dog.pos =  petra.moveRight(this.dog.pos, this.dog.speed, dt);
      this.dog.update(dt);
      this.time += dt;
      if(this.time >= 5){
        this.completed = true;
      }
    }).bind(scene);

    scene.render = (function(){
      this.renderEntities([this.dog]);
    }).bind(scene);

    scene.load();
  }


  return  {
    init: init
  };

});