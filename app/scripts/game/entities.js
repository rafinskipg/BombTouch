define( [ ], function(){
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

  //Thanks dr.axel. 
  if (!Function.prototype.construct) {
    Function.prototype.construct = function(argArray) {
      if (! Array.isArray(argArray)) {
        throw new TypeError("Argument must be an array");
      }
      var constr = this;
      var nullaryFunc = Function.prototype.bind.apply(
          constr, [null].concat(argArray));
      return new nullaryFunc();
    };
  }

  function Entity(pos, spriteSchema){
    this.pos = pos;
    this.sprite = Sprite.construct(spriteSchema);
    return this;
  }

  function Bombarea(pos){
    var entity = new Entity(pos, bombareaSpriteSchema);
    entity.damage = 5;
    return entity;
  }

  function Special(pos){
    var entity = new Entity(pos, specialSpriteSchema);
    entity.damage = 100;
    return entity;
  }

  function Rick(pos,opts){
    var entity = new Entity(pos, rickrollSpriteSchema);
    entity.sprite.resize(opts.size[0], opts.size[1])
    entity.damage = opts.damage || 100;
    entity.speed = opts.speed || 300;
    entity.dir = 'right';
    return entity;
  }

  function Bomb(pos){
    var entity = new Entity(pos, bombSpriteSchema);
    return entity;
  }

  function Explosion(pos){
    var entity = new Entity(pos, explosionSpriteSchema);
    return entity;
  }

  function Bullet(pos, opts){
    var entity = new Entity(pos, normalBulletSpriteSchema);
    entity.dir = 'right';
    entity.damage = opts.damage || 50;
    entity.speed = opts.speed || 500;
    return entity;
  } 
  function BlueBullet(pos, opts){
    var entity = new Entity(pos, blueBulletSpriteSchema);
    entity.dir = 'right';
    entity.sprite.resize(20,20);
    entity.damage = opts.damage || 50;
    entity.speed = opts.speed || 500;
    return entity;
  }

  function NyanBullet(pos, opts){
    var entity = new Entity(pos, nyanBulletSpriteSchema);
    entity.dir = 'right';
    entity.damage = opts.damage || 50;
    entity.speed = opts.speed || 500;
    return entity;
  }  
  function BananaBullet(pos, opts){
    var entity = new Entity(pos, bananaBulletSpriteSchema);
    entity.dir = 'right';
    entity.damage = opts.damage || 50;
    entity.speed = opts.speed || 500;
    return entity;
  }  

  function TwitterBullet(pos, opts){
    var entity = new Entity(pos, twitterBulletSpriteSchema);
    entity.sprite.resize(30,30);
    entity.dir = 'right';
    entity.damage = opts.damage || 50;
    entity.speed = opts.speed || 500;
    return entity;
  }

  function BottomBullet(pos, opts){
    var entity = new Entity(pos, bottomBulletSpriteSchema);
    entity.dir = 'down';
    entity.damage = opts.damage || 25;
    entity.speed = opts.speed || 500;
    return entity;
  }

  function TopBullet(pos, opts){
    var entity = new Entity(pos, topBulletSpriteSchema);
    entity.dir = 'up';
    entity.damage = opts.damage || 25;
    entity.speed = opts.speed || 500;
    return entity;
  }

  function Player(pos, opts){
    var sprite = opts.spriteSchema;
    var entity  = new Entity(pos, sprite);
    entity.life = opts.life || 1000;
    entity.totalLife = opts.totalLife || 1000;
    entity.isSuperSaiyan = opts.isSuperSaiyan || false;
    entity.bullet = opts.bullet || 'bullet';
    entity.topBullet = opts.topBullet || 'topBullet';
    entity.bottomBullet = opts.bottomBullet || 'bottomBullet';
    entity.damage = opts.damage || 80;
    entity.baseDamage = opts.damage || 80;
    entity.speed = opts.speed || 200;
    if(opts.resize){
      entity.sprite.resize(opts.resize[0], opts.resize[1]);
    }
    return entity;
  }

  function Grave(pos){
    return new Entity(pos, graveSpriteSheet);
  }

  function Bonus(pos,opts){
    var entity = new Entity(pos,bonusSpriteSchema);
    entity.sprite.resize(50,50);
    entity.speed = opts.speed || 200;
    entity.dirs = opts.dirs || ['right', 'left', 'upright'];
    entity.dir = opts.dir || 'downleft';
    return entity;
  }
  function BonusWeapon(pos,opts){
    var entity = new Entity(pos,bonusWeaponSpriteSchema);
    entity.speed = opts.speed || 20;
    return entity;
  }

  function getRandomDirs(numberOfDirs){
    var possibleDirs = [
      'left', 
      'right', 
      'up', 
      'down',
      'downright',
      'downleft',
      'upright',
      'upleft'
    ];
    var dirs = [];
    for(var i = 0; i < numberOfDirs; i++){
      dirs.push(possibleDirs[parseInt(Math.random() * numberOfDirs +1, 10)]);
    }
    return dirs;
  }

  function getFixedDirs(pattern, numberOfDirs){
    var possibleDirs = [
      [
        'downleft', 
        'up',
        'downleft',
        'upleft',
        'downright',
        'upright',
        'down' ],
      [ 
      'upleft', 
      'down', 
      'up', 
      'down',
      'up',
      'left',
      'down',
      'up']
    ];
    var dirs = [];
    for(var i = 0; i < numberOfDirs; i++){
      dirs.push(possibleDirs[pattern].pop());
    }
    return dirs;
  }

  function getEntity(name, pos, opts){
    if(!opts){
      opts = {};
    }
    if(name == 'bombarea'){
      return new Bombarea(pos);
    }else if(name == 'special'){
      return new Special(pos);
    }else if(name == 'explosion'){
      return new Explosion(pos);
    }else if(name == 'bomb'){
      return new Bomb(pos);
    }else if(name == 'rick'){
      opts.size = opts.size || [70,110];
      return new Rick(pos, opts);
    }else if(name == 'bullet'){
      return new Bullet(pos, opts);
    }else if(name == 'nyanbullet'){
      return new NyanBullet(pos, opts);
    }else if(name == 'bananabullet'){
      return new BananaBullet(pos, opts);
    }else if(name == 'twitterbullet'){
      return new TwitterBullet(pos, opts);
    }else if(name == 'bulletBlue'){
      return new BlueBullet(pos, opts);
    }else if(name == 'bottomBullet'){
      return new BottomBullet(pos, opts);
    }else if(name == 'topBullet'){
      return new TopBullet(pos, opts);
    }else if(name == 'cat'){
      opts.spriteSchema = nyanCatSpriteSchema;
      return new Player(pos, opts);
    }else if(name == 'cooldog'){
      opts.spriteSchema = coolDogSpriteSchema;
      opts.resize = [80,56];
      return new Player(pos, opts);
    }else if(name == 'cooldogshooting'){
      opts.spriteSchema = coolDogShootingSpriteSchema;
      opts.resize = [80,56];
      return new Player(pos, opts);
    }else if(name == 'saiyancat'){
      opts = {
        damage: 160,
        isSuperSaiyan: true,
        speed: 500,
        life: opts.life,
        totalLife: opts.totalLife,
        spriteSchema: superNyanCatSpriteSchema
      };
      return new Player(pos, opts);
    }else if(name == 'supercooldog'){
      opts = {
        damage: 160,
        isSuperSaiyan: true,
        speed: 500,
        life: opts.life,
        totalLife: opts.totalLife,
        spriteSchema: superCoolDogSpriteSchema,
        resize: [80,100]
      };
      return new Player(pos, opts);
    }else if(name == 'grave'){
      return new Grave(pos);
    }else if(name == 'bonus'){
      opts = {
        numberOfBonus : Math.ceil(Math.random(5) * 10),
        dirs: getFixedDirs(parseInt(Math.random()*2),6),
        speed: 200
      }
      return new Bonus(pos, opts);
    }else if(name == 'life'){
      opts = {
        dirs: getRandomDirs(3),
        speed: 200
      } 
      return new Life(pos, opts);
    }else if(name == 'bonusWeapon'){
      return new BonusWeapon(pos, opts);
    }
  }

  //Enemies
  function level1Enemy(pos){
    var entity = new Entity(pos, tacnyanSpriteSchema);
    entity.speed = 45;
    entity.points = 100;
    entity.totalLife = 100;
    entity.life = 100;
    entity.sprite.resize(50,30)
    entity.damage = 100;
    entity.dir = 'left';
    return entity;
  }

  function level2Enemy(pos){
    var entity = new Entity(pos, dolanSpriteSchema);
    entity.speed = 50;
    entity.points = 200;
    entity.totalLife = 200;
    entity.sprite.resize(50,50);
    entity.life = 200;
    entity.damage = 120;
    entity.dir = 'left';
    return entity;
  }  
  function level3Enemy(pos){
    var entity = new Entity(pos, flappySpriteSchema);
    entity.speed = 55;
    entity.points = 300;
    entity.totalLife = 300;
    entity.sprite.resize(50,50);
    entity.life = 300;
    entity.damage = 160;
    entity.dir = 'left';
    return entity;
  }  

  function level4Enemy(pos){
    var entity = new Entity(pos, dramaticSpriteSchema);
    entity.speed = 65;
    entity.points = 400;
    entity.totalLife = 400;
    entity.life = 400;
    entity.sprite.resize(50,45);
    entity.damage = 180;
    entity.dir = 'left';
    return entity;
  }  

  function level5Enemy(pos){
    var entity = new Entity(pos, level5SpriteSchema);
    entity.speed = 75;
    entity.points = 500;
    entity.totalLife = 500;
    entity.life = 500;
    entity.damage = 200;
    entity.dir = 'left';
    return entity;
  }

  function getEnemy(pos, level){
    if(level == 1){
      return new level1Enemy(pos);
    }else if(level == 1){
      return new level1Enemy(pos);
    }else if(level == 2){
      return new level2Enemy(pos);
    }else if(level == 3){
      return new level3Enemy(pos);
    }else if(level == 4){
      return new level4Enemy(pos);
    }else if(level == 5){
      return new level5Enemy(pos);
    }else if(level == 6){
      return new level6Enemy(pos);
    }
  }

  function getBoss(pos){
    var entity = new Entity(pos, bossSpriteSchema);
    entity.actions = [
      'enemyShoot',
      'move',
      'launchEnemy',
      'enemyShoot',
      'enemyShoot',
      'enemyShoot',
      'talk'
    ];
    entity.speed = 25;
    entity.points = 10000;
    entity.totalLife = 10000;
    entity.life = 10000;
    entity.damage = 400;
    entity.sprite.resize(60,60);
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
    var entity =  new Entity(pos, sprite);
    entity.sprite.resize(size[0], size[1]);
    entity.speed = 50;
    entity.dir = 'left';
    return entity;
  }

  function getSpaceInvader(pos){
    return new SpaceInvader(pos);
  }

  function SpaceInvader(pos){
    var entity = new Entity(pos, spaceInvaderSpriteSchema);
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

