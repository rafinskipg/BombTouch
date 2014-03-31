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
    true],

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

  //Enemies
  var level1SpriteSchema = ['images/newsprites.png', [4,186], [28,30], 6, [0, 1, 2,3,4]];
  var level2SpriteSchema = ['images/newsprites.png', [0,216], [35,50], 8, [0, 1, 2,3]];
  var level3SpriteSchema = ['images/newsprites.png', [175,185], [23,45], 7, [0,1,2,3,4,5,6]];
  var level4SpriteSchema = ['images/newsprites.png', [175,230], [33,40], 8, [0,1,2,3,4,3,2,1]];
  var level5SpriteSchema = ['images/newsprites.png', [172,0], [72,72],1, [0]];
  var level6SpriteSchema = ['images/newsprites.png', [557,141], [240,347], 4, [0,1,2,1,2,1]];

  function construct(constructor, args) {
    function F() {
        return constructor.apply(this, args);
    }
    F.prototype = constructor.prototype;
    return new F();
  }

  function Entity(pos, spriteSchema){
    this.pos = pos;
    this.sprite = constructor(Sprite, spriteSchema);
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

  function Bullet(pos){
    var entity = new Entity(pos, normalBulletSpriteSchema);
    entity.dir = 'forward';
    entity.damage = 50;
    entity.speed = 200;
    return entity;
  }

  function BottomBullet(pos){
    var entity = new Entity(pos, bottomBulletSpriteSchema);
    entity.dir = 'down';
    entity.damage = 25;
    entity.speed = 200;
    return entity;
  }

  function TopBullet(pos){
    var entity = new Entity(pos, topBulletSpriteSchema);
    entity.dir = 'up';
    entity.damage = 25;
    entity.speed = 200;
    return entity;
  }

  function getEntity(name, pos){
    switch(name){
      case 'bombarea':
        return new Bombarea(pos);
      break;
      case 'special':
        return new Special( [player.pos[0] + player.width, player.pos[1] - player.height/2])
      break;
      case 'explosion':
        return new Explosion(pos);
      break;
      case 'bomb':
        return new Bomb(pos);
      break;
      case 'bullet':
        return new Bullet(pos);
      break;
      case 'bottomBullet':
         return new BottomBullet(pos);
      break;
      case 'topBullet':
        return new TopBullet(pos);
      break;
      case 'bonus':
        var numberOfBonus = Math.ceil(Math.random(5) * 10);
        return {
            pos:pos,
            number:numberOfBonus,
            speed: 200,
            image: 'images/orb'+numberOfBonus+'.png'
        }
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
    return entity;
  }

  function level6Enemy(pos){
    var entity = new Entity(pos, level5SpriteSchema);
    entity.speed = 25;
    entity.points = 10000;
    entity.totalLife = 10000;
    entity.life = 10000;
    entity.width = 240;
    entity.height = 347;
    entity.damage = 10000;
    return entity;
  }


  function getEnemy(level, width, height){
    switch(level){
      case 1:
        return new level1Enemy([width, Math.random() * (height - 39)]);
      break;
      case 2: 
        return new level2Enemy([width, Math.random() * (height - 39)]);
      break;
      case 3: 
        return new level3Enemy([width, Math.random() * (height - 39)]);
      break;
      case 4: 
        return new level4Enemy([width, Math.random() * (height - 39)]);
      break;
      case 5: 
        return new level5Enemy([width, Math.random() * (height - 39)]);
      break;
      case 6:
        return new level6Enemy([width, 50]);
      break;
    }
  }
  return {
    getEntity: getEntity,
    getEnemy: getEnemy
  }
});

