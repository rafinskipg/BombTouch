define( ['resources','raf', 'quad_tree'], function(){
  var previouslyLoaded = false;
  var canvas,ctx, then = 0;
  var particles = [];
  var quad;
  var currentFiles = 0;
  var totalFiles = 0;
  var gravity = 0.5; 
  var id ;
  var current = 0;

  function load(elements, cb){
    if(!previouslyLoaded){
      previouslyLoaded = true;
      resources.load(elements, function(){
          canvas.className = '';
          cancelAnimationFrame(id);
          previouslyLoaded = false;
          cb();
      }.bind(this), function(current, total){
        currentFiles = current;
        totalFiles = total;
      }.bind(this));
      load(elements,cb);
    }else{
      mainLoop();
      id =requestAnimationFrame(function(){
        load(elements,cb);
      });
    }
   
  }

  function init(canvasId){
    previouslyLoaded = false;
    canvas = document.getElementById(canvasId);
    canvas.className = 'visible';
    ctx = canvas.getContext("2d");
    //Seems to work
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    canvas.width = window.innerWidth/3;
    canvas.height = window.innerHeight/3 ;
    
    current = 0; then = now();

    createParticles();
  }

  function createParticles(){
    particles = [];
    //Quad tree
    var bounds = {
      x:0,
      y:0,
      width:canvas.width,
      height:canvas.height
    }
    //quad = new QuadTree(bounds);

    for(var i = 0; i < 6; i ++ ){
      particles.push(new Particle( Math.round(Math.random()*canvas.width) , Math.round(Math.random()*canvas.height)))
      //TODO IMPLEMENT Burnes Hut tree algorightm for gravity between particles
      //quad.insert(particles[i]);
    }
  }

  function getRandomColor(){
    return '#'+Math.floor(Math.random()*16777215).toString(16);
  }
  
  function Particle(x,y){
    this.x = x;
    this.y = y;
    this.vel = {};
    this.vel.x = Math.ceil(Math.random() * 5) * 10;
    this.vel.y = Math.ceil(Math.random() * 5) * 10;
    this.acc = {
      x : 0,
      y : 0
    }

    this.radius = 5;
    this.color = getRandomColor();
    this.weight = 10;

    var self = this;
    this.draw = function(ctx) {
      ctx.fillStyle = self.color;
      ctx.beginPath();

      ctx.arc(
          this.x,
          this.y,
          this.radius,
          0,
          Math.PI*2,
          false
      );

      ctx.closePath();
      ctx.fill();
    }
  }

  function mainLoop(){
    var current = now();
    var dt = (current - then);
    then = current;
    
    // Fill the path
    ctx.fillStyle = "#33337a";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = "30px 'Press Start 2P'";
    ctx.fillText("LOADING ... ", 10, 80);
    ctx.fillText(currentFiles + '/'+ totalFiles, 10, 160);


    update(dt/1000.0);
    render();
  }

  function update(dt){
    for(var i = 0; i < particles.length; i++){

      if((particles[i].x + particles[i].vel.x * dt ) <= 0 || (particles[i].x + particles[i].vel.x * dt ) >= canvas.width){
        particles[i].vel.x *= -1;
      }

      if((particles[i].y + particles[i].vel.y * dt ) <= 0 || (particles[i].y + particles[i].vel.y * dt ) >= canvas.height){
        particles[i].vel.y = particles[i].vel.y * -1;
      }
      particles[i].x += particles[i].vel.x * dt;
      particles[i].y += particles[i].vel.y * dt;
    }
  }

  function render(){
    for(var i = 0; i < particles.length; i++){
      particles[i].draw(ctx);
    }
  }

  var LOADER = {
      init: init,
      load: load
  }

  return  LOADER;

});