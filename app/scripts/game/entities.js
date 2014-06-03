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
  var blueBulletSpriteSchema = ['images/newsprites.png', [125, 3], [10, 10], 10, [0,1,2,3]];
  var blueraySpriteSchema = ['images/weapons/bullets.png', [0, 0], [10, 10], 15, [0,1,2,3,4,5]];

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

  var coolDogShootingSpriteSchema = ['images/doggy/pixeleddog.png', [400, 100], [100,100], 10, [0, 1,2,3,4,5,6,7]];
  var coolDogSpriteSchema = ['images/doggy/pixeleddog.png', [400, 200], [100,100], 8, [0, 1,2,3,4,5,6,7]];
  var coolDogMovingDownSpriteSchema = ['images/doggy/pixeleddog.png', [100, 400], [100,100], 10, [3,4]];
  var coolDogMovingUpSpriteSchema = ['images/doggy/pixeleddog.png', [100, 500], [100,100], 10, [0, 1,2]];
  var coolDogMovingUpAndShootingSpriteSchema = ['images/doggy/pixeleddog.png', [100, 600], [100,100], 10, [0, 1,2,3,4,5,6,7,8]];
  var coolDogMovingDownAndShootingSpriteSchema = ['images/doggy/pixeleddog.png', [300, 300], [100,100], 10, [0, 1,2,3,4,5,6,7]];
  var superCoolDogSpriteSchema = ['images/doggy/cooldog.png', [2265, 932], [755,932], 1, [0, 1,2,3]];
  
  var graveSpriteSheet = ['images/newsprites.png', [2,100], [30,30], 4 , [0,1,2,0,1,2], null, true];
  var bulletCasingSpriteSheet = ['images/sparks/sparks.png', [0,150], [50,50], 14 , [0,1,2,3,4,5,6,7,8,9,10], null, true];
  var sparkSpriteSheet = ['images/sparks/sparks.png', [0,200], [50,50], 18 , [0,1,2,3,4,5,6,7,8,9,10,11,12,13], null, true];
  var shootFireSpriteSheet = ['images/sparks/sparks.png', [0,250], [50,50], 20 , [0,1,2,3,4,5,6,7], null, true];

  var nebulaSpriteSheet = ['images/nebula/nebula1.png', [0,0], [1030,780], 1 , [0]]
  var nebula2SpriteSheet = ['images/nebula/nebula2.png', [0,0], [1023,771], 1 , [0]]
  var nebula3SpriteSheet = ['images/nebula/nebula3.png', [0,0], [600,600], 1 , [0]]
  var galaxySpriteSheet = ['images/nebula/galaxy.png', [0,0], [600,600], 1 , [0]]
  var galaxy2SpriteSheet = ['images/nebula/galaxy2.png', [0,0], [600,600], 1 , [0]]
  var blackholeSpriteSheet = ['images/nebula/blackhole.png', [0,0], [1994,1147], 1 , [0]]
  var asteroidsSpriteSheet = ['images/nebula/asteroids.png', [0,0], [600,600], 1 , [0]]
  var asteroids2SpriteSheet = ['images/nebula/asteroids2.png', [0,0], [600,600], 1 , [0]]
  var asteroids3SpriteSheet = ['images/nebula/asteroids3.png', [0,0], [600,600], 1 , [0]]
  var cometSpriteSheet = ['images/nebula/comet.png', [0,0], [750,200], 5 , [0], 'vertical']

  var bonusSpriteSchema = ['images/orbes/coin.png', [0,0], [200,200], 1, [0]];
  var bonusWeaponSpriteSchema = ['images/bonusWeapon.png', [0,0], [40,40], 1, [0]];

  //Var Space invaders version
  var spaceInvaderSpriteSchema = ['images/enemies/rock.png', [0,0], [55,55],8,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]]



  var entities = {
    'bombarea' : {
      sprite : bombareaSpriteSchema,
      damage: 5,
      speed: [0,0]
    },
    'special' : {
      sprite: specialSpriteSchema,
      damage: 100,
      speed: [0,0]
    },
    'explosion' : {
      sprite: explosionSpriteSchema,
      damage: 0,
      speed: [0,0]
    },
    'bomb' : {
      sprite: bombSpriteSchema,
      damage: 0,
      speed: [0,0]
    },
    'rick' : {
      sprite: rickrollSpriteSchema,
      damage: 100,
      speed: [300,300],
      resize: [70,110],
      angle: 1,
    },
    'grave': {
      sprite: graveSpriteSheet,
      speed: [0,0],
      resize : [30,30]
    },
    'bullet' : {
      sprite: normalBulletSpriteSchema,
      damage: 50,
      speed: [500,500], 
      angle : 0
    },
    'bottomBullet' : {
      sprite: normalBulletSpriteSchema,
      damage: 25,
      speed: [500,500], 
      angle : 3/2
    },
    'topBullet' : {
      sprite: normalBulletSpriteSchema,
      damage: 25,
      speed: [500,500], 
      angle : 1/2
    },
    'nyanbullet' : {
      sprite: nyanBulletSpriteSchema,
      damage: 50,
      speed: [500,500], 
      angle : 0
    },
    'bluebullet' : {
      sprite: blueBulletSpriteSchema,
      damage: 50,
      speed: [400,400],
      angle: 0,
      resize: [20,20]
    },'blueray' : {
      sprite: blueraySpriteSchema,
      damage: 50,
      speed: [500,500],
      angle: 0,
      resize: [10,10],
      renderTranslated: [0, 0]
    },
    'cooldog' : {
      sprite: coolDogSpriteSchema,
      damage: 80,
      baseDamage: 80,
      speed: [200,200],
      angle: 0,
      life: 1000,
      totalLife: 1000,
      hitArea: [80,56],
      resize: [80,80],

      bullet: 'bullet',
      topBullet: 'topBullet',
      bottomBullet: 'bottomBullet',
      isSuperSaiyan: false, 
      animations: [
       {
          name: 'shoot',
          sprite: coolDogShootingSpriteSchema
        },
        {
          name: 'moveDown',
          sprite: coolDogMovingDownSpriteSchema
        },{
          name: 'moveUp',
          sprite: coolDogMovingUpSpriteSchema
        },
        {
          name: 'shootMoveDown',
          sprite: coolDogMovingDownAndShootingSpriteSchema
        },
        {
          name: 'shootMoveUp',
          sprite: coolDogMovingUpAndShootingSpriteSchema
        }
      ]
    },
    'bonus': {
      speed: [200,200],
      resize: [50,50],
      sprite: bonusSpriteSchema,
      angle : 1
    },
    'bonusWeapon':{
      sprite: bonusWeaponSpriteSchema,
      speed: [20,20]
    },
    'enemy1' : {
      sprite: tacnyanSpriteSchema,
      speed: [45,45],
      points: 100,
      angle: 1,
      life: 100,
      totalLife: 100,
      resize: [90,60],
      damage: 100
    },
    'enemy2' : {
      sprite: dolanSpriteSchema,
      speed: [55,55],
      points: 200,
      angle: 1,
      life: 200,
      totalLife: 200,
      resize: [50,50],
      damage: 120
    },
    'enemy3' : {
      sprite: flappySpriteSchema,
      speed: [65,65],
      points: 300,
      angle: 1,
      life: 300,
      totalLife: 300,
      resize: [50,50],
      damage: 140
    },
    'enemy4' : {
      sprite: dramaticSpriteSchema,
      speed: [75,75],
      points: 400,
      angle: 1,
      life: 400,
      totalLife: 400,
      resize: [50,45],
      damage: 160
    },
    'enemy5' : {
      sprite: level5SpriteSchema,
      speed: [85,85],
      points: 500,
      angle: 1,
      life: 500,
      totalLife: 500,
      damage: 180
    },
    'boss':{
      speed: [25,25],
      points: 10000,
      totalLife: 10000,
      life: 10000,
      sprite: bossSpriteSchema,
      damage: 400,
      resize:[60,60]
    },
    'shootfire': {
      sprite: shootFireSpriteSheet,
      resize: [50,50],
      renderTranslated: [10,20],
      speed: [0,0]
    },
    'bulletcasing':{
      sprite: bulletCasingSpriteSheet,
      resize: [100,100],
      renderTranslated: [-20,40],
      speed: [0,0]
    },
    'spark':{
      sprite: sparkSpriteSheet,
      resize: [50,50],
      renderTranslated: [10, 15],
      speed: [0,0]
    }
  };



  var backgroundEntities ={
    'nebula': {
      speed: 10,
      resize: [400,350],
      sprite: nebulaSpriteSheet,
      angle: 1
    },
    'nebula2': {
      speed:10 ,
      resize: [400,400],
      sprite: nebula2SpriteSheet,
      angle: 1
    },'nebula3': {
      speed:10 ,
      resize: [400,400],
      sprite: nebula3SpriteSheet,
      angle: 1
    },
    'asteroids': {
      speed: 50,
      resize: [400,400],
      sprite: asteroidsSpriteSheet ,
      angle: 1
    },
    'asteroids2': {
      speed: 50,
      resize: [400,400],
      sprite: asteroids2SpriteSheet,
      angle: 1
    },
    'asteroids3': {
      speed: 50,
      resize: [400,400],
      sprite: asteroids3SpriteSheet,
      angle: 1
    },
    'blackhole': {
      speed: 5,
      resize: [400,400],
      sprite: blackholeSpriteSheet,
      angle: 1
    },
    'galaxy': {
      speed: 10,
      resize: [400,400],
      sprite: galaxySpriteSheet,
      angle: 1
    },
    'galaxy2':{
      speed: 10,
      resize: [400,400],
      sprite: galaxy2SpriteSheet,
      angle: 0.8,
      rotateSprite: -0.8
    },
    'comet':{
      speed: 10,
      resize: [150,50],
      sprite: cometSpriteSheet,
      angle: 1.2,
      rotateSprite: 0.2
    }
  }

  function GameEntity(entityDefinition, opts){
    try{
    entityDefinition.pos = opts.pos;
    }catch(e){
      console.log(e, entityDefinition, opts );
    }
    var entity =  new Models.Entity(entityDefinition);
    
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

    if(opts.angle){
      entity.angle = opts.angle;
    }

    if(opts.resize){
      entity.sprite.resize(opts.resize[0], opts.resize[1]);
    }

    if(opts.resizePercentage){
      entity.sprite.resize(Math.floor(entity.sprite.size[0]*opts.resizePercentage),Math.floor(entity.sprite.size[1]*opts.resizePercentage) );
    }

    if(opts.rotateSprite){
      entity.angle =  opts.rotateSprite * 1 +1 ;
      entity.rotateSprite = opts.rotateSprite;
    }
    return entity;
  }

  //Public
  function getEntity(name, opts, entityList){
    if(!entityList){
      entityList = entities;
    }
    if(!opts){
      opts = {};
    } 
    var entity =  new GameEntity(entityList[name], opts);
    if(name == 'bonus'){
      entity.angle = petra.randomFloat(7/12,17/12);
      entity.bounces = 5;
    }
    return entity;
  }
 
  function getBackgroundEntity(name, opts){
    var entity= getEntity(name, opts, backgroundEntities);
    console.log(entity);
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

  function getSpaceInvader(pos){
    return new SpaceInvader(pos);
  }

  function SpaceInvader(pos){
    var entity = new Models.Entity({pos:pos, sprite: spaceInvaderSpriteSchema});
    entity.speed = [100,100];
    entity.angle = 1;
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

