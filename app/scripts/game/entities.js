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

  var normalBulletSpriteSchema = ['images/newsprites.png', [10, 0], [18, 18], 5, [0,1,2]];
  var bottomBulletSpriteSchema = ['images/newsprites.png', [80, 5], [10, 10], 5, [0,1,2,3]];
  var topBulletSpriteSchema = ['images/newsprites.png', [80, 5], [10, 10], 5, [0,1,2,3]];
  var blueBulletSpriteSchema = ['images/newsprites.png', [125, 3], [10, 10], 5, [0,1,2,3]];

  //Enemies
  var level1SpriteSchema = ['images/newsprites.png', [4,186], [28,30], 6, [0, 1, 2,3,4]];
  var level2SpriteSchema = ['images/newsprites.png', [0,216], [35,50], 8, [0, 1, 2,3]];
  var level3SpriteSchema = ['images/newsprites.png', [175,185], [23,45], 7, [0,1,2,3,4,5,6]];
  var level4SpriteSchema = ['images/newsprites.png', [175,230], [33,40], 8, [0,1,2,3,4,3,2,1]];
  var level5SpriteSchema = ['images/newsprites.png', [172,0], [72,72],1, [0]];
  //Bosses
  var bossSpriteSchema = ['images/creeper.png', [0,35], [30,30], 4, [0,1,2,1,2,1]];
 
  //Player
  var playerSpriteSchema = ['images/newsprites.png', [7, 304], [88,35], 4, [0, 1,2,3,4]];
  var superPlayerSpriteSchema = ['images/newsprites.png', [4, 400], [88,35], 4, [0, 1,2,3,4]];

  var bonusSpriteSchema = ['images/orbes/bonus.png', [0,0], [40,40], 1, [0]];
  var bonusWeaponSpriteSchema = ['images/bonusWeapon.png', [0,0], [40,40], 1, [0]];

  //Thanks dr.axel
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
    entity.isSuperSaiyan = opts.isSuperSaiyan;
    entity.height = 35;
    entity.width = 88;
    entity.damage = opts.damage || 80;
    entity.speed = opts.speed || 200;
    return entity;
  }

  function Bonus(pos,opts){
    var entity = new Entity(pos,bonusSpriteSchema);
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
      case 'bullet':
        return new Bullet(pos, opts);
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
      case 'bonus':
        opts = {
          numberOfBonus : Math.ceil(Math.random(5) * 10),
          dirs: [
            'left',
            'upright',
            'downright',
            'upleft',
            'down',
            'upleft'
          ],
          speed: 200
        }
        return new Bonus(pos, opts);
      break;
      case 'bonusWeapon':
        return new BonusWeapon(pos, opts);
      break;
    }
  }

  //Enemies
  function level1Enemy(pos){
    var entity = new Entity(pos, level1SpriteSchema);
    entity.speed = 50;
    entity.points = 100;
    entity.totalLife = 100;
    entity.life = 100;
    entity.width = 28;
    entity.height = 30;
    entity.damage = 100;
    entity.dir = 'left';
    return entity;
  }

  function level2Enemy(pos){
    var entity = new Entity(pos, level2SpriteSchema);
    entity.speed = 25;
    entity.points = 200;
    entity.totalLife = 200;
    entity.life = 200;
    entity.width = 35;
    entity.height = 50;
    entity.damage = 200;
    entity.dir = 'left';
    return entity;
  }  
  function level3Enemy(pos){
    var entity = new Entity(pos, level3SpriteSchema);
    entity.speed = 75;
    entity.points = 300;
    entity.totalLife = 300;
    entity.life = 300;
    entity.width = 23;
    entity.height = 45;
    entity.damage = 300;
    entity.dir = 'left';
    return entity;
  }  

  function level4Enemy(pos){
    var entity = new Entity(pos, level4SpriteSchema);
    entity.speed = 25;
    entity.points = 400;
    entity.totalLife = 400;
    entity.life = 400;
    entity.width = 30;
    entity.height = 37;
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
    entity.width = 72;
    entity.height = 72;
    entity.damage = 500;
    entity.dir = 'left';
    return entity;
  }

  function getEnemy(level, screenWidth, screenHeight){
    switch(level){
      case 1:
        return new level1Enemy([screenWidth, Math.random() * (screenHeight - 39)]);
      break;
      case 2:
        return new level2Enemy([screenWidth, Math.random() * (screenHeight - 39)]);
      break;
      case 3: 
        return new level3Enemy([screenWidth, Math.random() * (screenHeight - 39)]);
      break;
      case 4: 
        return new level4Enemy([screenWidth, Math.random() * (screenHeight - 39)]);
      break;
      case 5: 
        return new level5Enemy([screenWidth, Math.random() * (screenHeight - 39)]);
      break;
    }
  }

  function getBoss(screenWidth, screenHeight){
    var entity = new Entity([screenWidth, screenHeight / 2], bossSpriteSchema);
    entity.actions = [
      'shoot',
      'launchEnemy',
      'shoot',
      'talk'
    ];
    entity.speed = 25;
    entity.points = 10000;
    entity.totalLife = 10000;
    entity.life = 10000;
    entity.width = 30;
    entity.height = 30;
    entity.damage = 10000;
    return entity;
  }

  return {
    getEntity: getEntity,
    getEnemy: getEnemy,
    getBoss: getBoss
  }
});

