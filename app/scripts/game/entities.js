define( [ 'game/models/models','game/petra'], function(Models,petra){
  // Sprite(url, pos, size, speed, frames, dir, once)
  var bombareaSpriteSchema = ['images/newsprites.png',
    [15, 340],
    [39, 39],
    16,
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    null,
    true];
  var specialSpriteSchema = ['images/boom.png',
    [0, 0],
    [590, 100],
    40,
    [0, 1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3, 4,3,2,1,2,3,4,3,2,1,0,1,2,3],
    'vertical',
    true];

  var explosionSpriteSchema = ['images/newsprites.png',
    [15, 340],
    [39, 39],
    16,
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    null,
    true];

  var bombSpriteSchema = ['images/newsprites.png',
    [282, 50],
    [50, 42],
    14,
    [0,1,2,3,4,5,6,7],
    null,
    true];

  var rickrollSpriteSchema = ['images/rick/rickrollsprite.png', 
  [0,0],
  [138,220],
  10,
  [0,1,2,3,4,5,6,7,8,9,10,11,12,13]];

  var normalBulletSpriteSchema = ['images/newsprites.png', [10, 0], [18, 18], 5, [0,1,2]];
  var nyanBulletSpriteSchema = ['images/newsprites.png', [1, 51], [21, 20], 15, [0,1,2, 3]];
  var bananaBulletSpriteSchema = ['images/newsprites.png', [670, 70], [40, 70], 15, [0,1,2, 3,4,5,6]];
  //var twitterBulletSpriteSchema = ['images/weapons/twitter.png', [0, 0], [150, 150], 4, [0,1,2, 3]];
  var bottomBulletSpriteSchema = ['images/newsprites.png', [80, 5], [10, 10], 5, [0,1,2,3]];
  var topBulletSpriteSchema = ['images/newsprites.png', [80, 5], [10, 10], 5, [0,1,2,3]];
  var blueBulletSpriteSchema = ['images/newsprites.png', [125, 3], [10, 10], 5, [0,1,2,3]];

  //Enemies
  var tacnyanSpriteSchema = ['images/enemies/tacnyan.png', [0,0], [255,152], 5, [0,1,2,1]];
  var dolanSpriteSchema = ['images/newsprites.png', [350,100], [85,73], 8, [0, 1, 2,3]];
  var flappySpriteSchema = ['images/newsprites.png', [4,450], [125,117], 7, [0,1,2,3,4]];
  var dramaticSpriteSchema = ['images/newsprites.png', [5,600], [85,73], 6, [0,0,0,0,0,1,2,3,4,5,6,7,8,9,9,9]];
  var level5SpriteSchema = ['images/newsprites.png', [282, 50], [50, 42], 14, [0,1,2,3,4,5,6,7]];
  //Bosses
  var bossSpriteSchema = ['images/creeper.png', [0,35], [30,30], 4, [0,1,2,1,2,1]];
 
  //Player
  var nyanCatSpriteSchema = ['images/newsprites.png', [7, 304], [88,35], 4, [0, 1,2,3,4]];
  var superNyanCatSpriteSchema = ['images/newsprites.png', [4, 400], [88,35], 5, [0, 1,2,3,4]];

 // var coolDogSpriteSchema = ['images/doggy/cooldog.png', [2265, 0], [755,932], 5, [0, 1,2,3]];
  //var coolDogSpriteSchema = ['images/doggy/dog2.png', [0, 350], [350,350], 1, [0, 1,2,3,4,5,6,7,8,9]];
  var coolDogShootingSpriteSchema = ['images/doggy/pixeleddog.png', [400, 20], [100,70], 10, [0, 1,2,3,4,5,6,7]];
  var coolDogSpriteSchema = ['images/doggy/pixeleddog.png', [400, 120], [100,70], 8, [0, 1,2,3,4,5,6,7]];
  var superCoolDogSpriteSchema = ['images/doggy/cooldog.png', [2265, 932], [755,932], 1, [0, 1,2,3]];
  
  var graveSpriteSheet = ['images/newsprites.png', [2,100], [30,30], 4 , [0,1,2,0,1,2], null, true]
  var nebulaSpriteSheet = ['images/nebula/nebula2.png', [0,0], [1023,771], 1 , [0], null, true]
  var nebula2SpriteSheet = ['images/nebula/nebula3.png', [0,0], [600,600], 1 , [0], null, true]
  var galaxySpriteSheet = ['images/nebula/galaxy.png', [0,0], [600,600], 1 , [0], null, true]
  var galaxy2SpriteSheet = ['images/nebula/galaxy2.png', [0,0], [600,600], 1 , [0], null, true]
  var blackholeSpriteSheet = ['images/nebula/blackhole.png', [0,0], [1994,1147], 1 , [0], null, true]
  var asteroidsSpriteSheet = ['images/nebula/asteroids.png', [0,0], [600,600], 1 , [0], null, true]
  var asteroids2SpriteSheet = ['images/nebula/asteroids2.png', [0,0], [600,600], 1 , [0], null, true]
  var asteroids3SpriteSheet = ['images/nebula/asteroids3.png', [0,0], [600,600], 1 , [0], null, true]

  var bonusSpriteSchema = ['images/orbes/coin.png', [0,0], [200,200], 1, [0]];
  var bonusWeaponSpriteSchema = ['images/bonusWeapon.png', [0,0], [40,40], 1, [0]];

  //Var Space invaders version
  var spaceInvaderSpriteSchema = ['images/enemies/rock.png', [0,0], [55,55],8,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]]



  var entities = {
    'bombarea' : {
      sprite : bombareaSpriteSchema,
      damage: 5,
      speed: 0
    },
    'special' : {
      sprite: specialSpriteSchema,
      damage: 100,
      speed: 0
    },
    'explosion' : {
      sprite: explosionSpriteSchema,
      damage: 0,
      speed: 0
    },
    'bomb' : {
      sprite: bombSpriteSchema,
      damage: 0,
      speed: 0
    },
    'rick' : {
      sprite: rickrollSpriteSchema,
      damage: 100,
      speed: 300,
      resize: [70,110],
      angle: 1,
    },
    'grave': {
      sprite: graveSpriteSheet,
      speed: 0,
      resize : [30,30]
    },
    'bullet' : {
      sprite: normalBulletSpriteSchema,
      damage: 50,
      speed: 500, 
      angle : 0
    },
    'bottomBullet' : {
      sprite: normalBulletSpriteSchema,
      damage: 25,
      speed: 500, 
      angle : 3/2
    },
    'topBullet' : {
      sprite: normalBulletSpriteSchema,
      damage: 25,
      speed: 500, 
      angle : 1/2
    },
    'nyanbullet' : {
      sprite: nyanBulletSpriteSchema,
      damage: 50,
      speed: 500, 
      angle : 0
    },
    'bluebullet' : {
      sprite: blueBulletSpriteSchema,
      damage: 50,
      speed: 500,
      angle: 0,
      resize: [20,20]
    },
    'cooldog' : {
      sprite: coolDogSpriteSchema,
      damage: 80,
      baseDamage: 80,
      speed: 200,
      angle: 0,
      life: 1000,
      totalLife: 1000,
      resize: [80,56],
      bullet: 'bullet',
      topBullet: 'topBullet',
      bottomBullet: 'bottomBullet',
      isSuperSaiyan: false
    },
    'cooldogshooting' : {
      sprite: coolDogShootingSpriteSchema,
      damage: 80,
      baseDamage: 80,
      speed: 200,
      angle: 0,
      life: 1000,
      totalLife: 1000,
      resize: [80,56],
      isSuperSaiyan: false
    },
    'bonus': {
      speed: 200,
      resize: [50,50],
      sprite: bonusSpriteSchema,
      angle : 1
    },
    'bonusWeapon':{
      sprite: bonusWeaponSpriteSchema,
      speed: 20
    },
    'enemy1' : {
      sprite: tacnyanSpriteSchema,
      speed: 45,
      points: 100,
      angle: 1,
      life: 100,
      totalLife: 100,
      resize: [50,30],
      damage: 100
    },
    'enemy2' : {
      sprite: dolanSpriteSchema,
      speed: 55,
      points: 200,
      angle: 1,
      life: 200,
      totalLife: 200,
      resize: [50,50],
      damage: 120
    },
    'enemy3' : {
      sprite: flappySpriteSchema,
      speed: 65,
      points: 300,
      angle: 1,
      life: 300,
      totalLife: 300,
      resize: [50,50],
      damage: 140
    },
    'enemy4' : {
      sprite: dramaticSpriteSchema,
      speed: 75,
      points: 400,
      angle: 1,
      life: 400,
      totalLife: 400,
      resize: [50,45],
      damage: 160
    },
    'enemy5' : {
      sprite: level5SpriteSchema,
      speed: 85,
      points: 500,
      angle: 1,
      life: 500,
      totalLife: 500,
      damage: 180
    },
    'boss':{
      speed: 25, 
      points: 10000,
      totalLife: 10000,
      life: 10000,
      sprite: bossSpriteSchema,
      damage: 400,
      resize:[60,60]
    }


  };


  function GameEntity(entityDefinition, opts){
    entityDefinition.pos = opts.pos;
    
    var entity =  new Models.Entity(entityDefinition);
    if(entityDefinition.resize){
      entity.sprite.resize(entityDefinition.resize[0], entityDefinition.resize[1]);
    }
    if(opts.damage){
      entity.damage = opts.damage;  
    }
    if(opts.speed){
      entity.speed = opts.speed;  
    }
    if(opts.life){
      entity.life  = opts.life;
    }
    if(opts.totalLife){
      entity.totalLife = opts.totalLife;
    }
    return entity;
  }

  //Public
  function getEntity(name, opts){
    if(!opts){
      opts = {};
    } 
    var entity =  new GameEntity(entities[name], opts);
    if(name == 'bonus'){
      entity.angle = petra.randomFloat(7/12,17/12);
      entity.maxBounces = 5;
    }
    return entity;
  }

  function getEnemy(pos, level){
    return getEntity('enemy'+level, {pos: pos});
  }
 
  function getBoss(pos){
    var entity = getEntity('boss', {pos:pos});

    entity.actions = [
      'enemyShoot',
      'move',
      'launchEnemy',
      'enemyShoot',
      'enemyShoot',
      'enemyShoot',
      'talk'
    ];

    return entity;
  }

  function getBackgroundEntity(name, pos,speed, resizePercentage){
    var entity;
    if(name == 'nebula'){
      entity = StaticEntity(pos,nebulaSpriteSheet,[400,350]);
    }else if(name == 'nebula2'){
      entity = StaticEntity(pos,nebula2SpriteSheet,[400,400]);
    }else if(name == 'asteroids'){
      entity = StaticEntity(pos,asteroidsSpriteSheet,[400,400]);
    }else if(name == 'asteroids2'){
      entity = StaticEntity(pos,asteroids2SpriteSheet,[400,400]);
    }else if(name == 'asteroids3'){
      entity = StaticEntity(pos,asteroids3SpriteSheet,[400,400]);
    }else if(name == 'galaxy'){
      entity = StaticEntity(pos,galaxySpriteSheet,[400,400]);
    }else if(name == 'galaxy2'){
      entity = StaticEntity(pos,galaxy2SpriteSheet,[400,400]);
    }else if(name == 'blackhole'){
      entity = StaticEntity(pos,blackholeSpriteSheet,[400,400]);
    }
    if(speed){
      entity.speed = speed;
    }
    if(resizePercentage){
      entity.sprite.resize(Math.floor(entity.sprite.size[0]*resizePercentage),Math.floor(entity.sprite.size[1]*resizePercentage) );
    }
    return entity;
  }

 function StaticEntity(pos,sprite,size){
    var entity =  new Models.Entity({pos: pos, sprite: sprite} );
    entity.sprite.resize(size[0], size[1]);
    entity.speed = 50;
    entity.dir = 'left';
    return entity;
  }

  function getSpaceInvader(pos){
    return new SpaceInvader(pos);
  }

  function SpaceInvader(pos){
    var entity = new Models.Entity({pos:pos, sprite: spaceInvaderSpriteSchema});
    entity.speed = 100;
    entity.dir = 'left';
    entity.damage = 100;
    entity.life = 100;  
    entity.points = 100;
    entity.totalLife = 100;
    entity.sprite.resize(40,40);
    return entity;
  }
  return {
    getEntity: getEntity,
    getBackgroundEntity: getBackgroundEntity,
    getEnemy: getEnemy,
    getSpaceInvader: getSpaceInvader,
    getBoss: getBoss
  }
});

