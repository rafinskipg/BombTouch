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
  var twitterBulletSpriteSchema = ['images/weapons/twitter.png', [0, 0], [150, 150], 4, [0,1,2, 3]];
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
  var playerSpriteSchema = ['images/newsprites.png', [7, 304], [88,35], 4, [0, 1,2,3,4]];
  var superPlayerSpriteSchema = ['images/newsprites.png', [4, 400], [88,35], 4, [0, 1,2,3,4]];
  var graveSpriteSheet = ['images/newsprites.png', [2,100], [30,30], 4 , [0,1,2,0,1,2], null, true]

  var bonusSpriteSchema = ['images/orbes/coin.png', [0,0], [200,200], 1, [0]];
  var bonusWeaponSpriteSchema = ['images/bonusWeapon.png', [0,0], [40,40], 1, [0]];

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
    var sprite = opts.isSuperSaiyan ? superPlayerSpriteSchema : playerSpriteSchema;
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
    switch(name){
      case 'bombarea':
        return new Bombarea(pos);
      break;
      case 'special':
        return new Special(pos);
      break;
      case 'explosion':
        return new Explosion(pos);
      break;
      case 'bomb':
        return new Bomb(pos);
      break;
      case 'rick':
        opts.size = opts.size || [70,110];
        return new Rick(pos, opts);
      break;
      case 'bullet':
        return new Bullet(pos, opts);
      break;
      case 'nyanbullet':
        return new NyanBullet(pos, opts);
      break;     
      case 'bananabullet':
        return new BananaBullet(pos, opts);
      break; 
      case 'twitterbullet':
        return new TwitterBullet(pos, opts);
      break;
      case 'bulletBlue':
        return new BlueBullet(pos, opts);
      break;
      case 'bottomBullet':
         return new BottomBullet(pos, opts);
      break;
      case 'topBullet':
        return new TopBullet(pos, opts);
      break;
      case 'player': 
        return new Player(pos, opts);
      break;
      case 'superPlayer':
        opts = {
          damage: 160,
          isSuperSaiyan: true,
          speed: 500,
          life: opts.life,
          totalLife: opts.totalLife
        };
        return new Player(pos, opts);
      break;
      case 'grave': 
        return new Grave(pos);
      break;
      case 'bonus':
        opts = {
          numberOfBonus : Math.ceil(Math.random(5) * 10),
          dirs: getFixedDirs(parseInt(Math.random()*2),6),
          speed: 200
        }
        return new Bonus(pos, opts);
      break;
      case 'life':
        opts = {
          dirs: getRandomDirs(3),
          speed: 200
        } 
        return new Life(pos, opts);
      break;
      case 'bonusWeapon':
        return new BonusWeapon(pos, opts);
      break;
    }
  }

  //Enemies
  function level1Enemy(pos){
    var entity = new Entity(pos, tacnyanSpriteSchema);
    entity.speed = 50;
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
    entity.speed = 25;
    entity.points = 200;
    entity.totalLife = 200;
    entity.sprite.resize(50,50);
    entity.life = 200;
    entity.damage = 200;
    entity.dir = 'left';
    return entity;
  }  
  function level3Enemy(pos){
    var entity = new Entity(pos, flappySpriteSchema);
    entity.speed = 75;
    entity.points = 300;
    entity.totalLife = 300;
    entity.sprite.resize(50,50);
    entity.life = 300;
    entity.damage = 300;
    entity.dir = 'left';
    return entity;
  }  

  function level4Enemy(pos){
    var entity = new Entity(pos, dramaticSpriteSchema);
    entity.speed = 25;
    entity.points = 400;
    entity.totalLife = 400;
    entity.life = 400;
    entity.sprite.resize(50,45);
    entity.damage = 400;
    entity.dir = 'left';
    return entity;
  }  

  function level5Enemy(pos){
    var entity = new Entity(pos, level5SpriteSchema);
    entity.speed = 25;
    entity.points = 500;
    entity.totalLife = 500;
    entity.life = 500;
    entity.damage = 500;
    entity.dir = 'left';
    return entity;
  }

  function getEnemy(pos, level){
    switch(level){
      case 1:
        return new level1Enemy(pos);
      break;
      case 2:
        return new level2Enemy(pos);
      break;
      case 3: 
        return new level3Enemy(pos);
      break;
      case 4: 
        return new level4Enemy(pos);
      break;
      case 5: 
        return new level5Enemy(pos);
      break;
    }
  }

  function getBoss(screenWidth, screenHeight){
    var entity = new Entity([screenWidth, screenHeight / 2], bossSpriteSchema);
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
    entity.damage = 10000;
    return entity;
  }

  return {
    getEntity: getEntity,
    getEnemy: getEnemy,
    getBoss: getBoss
  }
});

