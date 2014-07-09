define( [ 'game/models/models','petra', 'hu'], function(Models,petra, hu){
  // Sprite(url, pos, size, speed, frames, dir, once)
  var bombareaSpriteSchema = ['images/newsprites.png',
    [15, 340],
    [39, 39],
    16,
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    null,
    null,
    true];
  var specialSpriteSchema = ['images/boom.png',
    [0, 0],
    [590, 100],
    40,
    [0, 1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3, 4,3,2,1,2,3,4,3,2,1,0,1,2,3],
    null,
    'vertical',
    true];

  var explosionSpriteSchema = ['images/newsprites.png',
    [15, 340],
    [39, 39],
    16,
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    null,
    null,
    true];

  var bombSpriteSchema = ['images/newsprites.png',
    [282, 50],
    [50, 42],
    14,
    [0,1,2,3,4,5,6,7],
    null,
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
  var greenBulletSchema = ['images/weapons/bullets.png', [0, 0], [10, 10], 0, [0]];
  var redBulletSchema = ['images/weapons/bullets.png', [0, 10],  [10, 10], 0, [0]];

  //Enemies
  var tacnyanSpriteSchema = ['images/enemies/tacnyan.png', [0,0], [255,152], 5, [0,1,2,1], true];
  var dolanSpriteSchema = ['images/newsprites.png', [350,100], [85,73], 8, [0, 1, 2,3], true];
  var flappySpriteSchema = ['images/newsprites.png', [4,450], [125,117], 7, [0,1,2,3,4], true];
  var dramaticSpriteSchema = ['images/newsprites.png', [5,600], [85,73], 6, [0,0,0,0,0,1,2,3,4,5,6,7,8,9,9,9], true];
  var level5SpriteSchema = ['images/newsprites.png', [282, 50], [50, 42], 14, [0,1,2,3,4,5,6,7], true];
  //Level1
  var level1_junk1Sprite  = ['images/backgrounds/parallax_1_sprited.png', [0, 0], [50, 50], 0, [0], true];
  var level1_junk2Sprite  = ['images/backgrounds/parallax_1_sprited.png', [50, 0], [50, 50], 0, [0], true];
  var level1_junk3Sprite  = ['images/backgrounds/parallax_1_sprited.png', [100, 0], [50, 50], 0, [0], true];
  var level1_junk4Sprite  = ['images/backgrounds/parallax_1_sprited.png', [150, 0], [50, 50], 0, [0], true];

  var level1_tireSprite  = ['images/enemies/level_1.png', [200, 0], [50, 50], 10, [0,1,2,4,5,6,7], true];
  var level1_ship1Sprite  = ['images/enemies/level_1.png', [500, 50], [100, 75], 0, [0], true];
  var level1_ship2Sprite  = ['images/enemies/level_1.png', [375, 50], [100, 100], 0, [0], true];
  var level1_ship3Sprite  = ['images/enemies/level_1.png', [475, 150], [125, 75], 0, [0], true];
  

  var level1_ratSprite  = ['images/enemies/level_1.png', [0,50], [50,50], 4, [0,1], true];
  var level1_ratSpriteShooting  = ['images/enemies/level_1.png', [100,50], [50,50], 4, [0,1,2,1,0], true];
  var level1_droneSpriteDefinition = {
    normal: {
      standby :['images/enemies/level_1.png', [0,125], [50, 50], 1, [0],true],
      aiming :['images/enemies/level_1.png', [0,125], [50, 50], 1, [0],true]
    }
  }
  var level1_battleStationSprite  = ['images/enemies/level_1.png', [0,175], [100, 100], 1, [0], true];
  
  var level1_worm_headSprite  = ['images/enemies/level_1.png', [0,150], [50, 50], 1, [0], true];
  var level1_worm_bodySprite  = ['images/enemies/level_1.png', [50,150], [50, 50], 1, [0], true];
  var level1_worm_tailSprite  = ['images/enemies/level_1.png', [100,150], [50, 50], 1, [0], true];
  var level1_junkMutantSprite  = ['images/enemies/level_1.png', [0,300], [100, 100], 1, [0],true];
 
  //Bosses
  var bossSpriteDefinition ={
    normal: {
      standby :['images/enemies/boss_1.png', [0,0], [40,75], 4, [4],true],
      shooting :['images/enemies/boss_1.png', [0,0], [40,75], 15, [4,3,2,1,0,0,2,3,4],true],
      talking :['images/enemies/boss_1.png', [0,0], [40,75], 4, [5,4,5,6,5,4],true],
      happy :['images/enemies/boss_1.png', [0,0], [40,75], 4, [7],true],
      teleport :['images/enemies/boss_1.png', [80,225], [40,75], 30, [0,1,2,3,4,5,6,6,5,4,3,2,1,0],true, 'vertical']
    },
    damaged: {
      standby :['images/enemies/boss_1.png', [0,75], [40,75], 4, [4],true],
      shooting :['images/enemies/boss_1.png', [0,75], [40,75], 4, [4,3,3,2,1,0,1,0],true],
      talking :['images/enemies/boss_1.png', [0,75], [40,75], 4, [5,4,5,6,5,4],true],
      happy :['images/enemies/boss_1.png', [0,75], [40,75], 4, [7],true],
      teleport :['images/enemies/boss_1.png', [40,225], [40,75], 30, [0,1,2,3,4,5,6,6,5,4,3,2,1,0],true, 'vertical']
    },
    verydamaged: {
      standby :['images/enemies/boss_1.png', [0,150], [40,75], 4, [4],true],
      shooting :['images/enemies/boss_1.png', [0,150], [40,75], 4, [4,3,3,2,1,0,1,0],true],
      talking :['images/enemies/boss_1.png', [0,150], [40,75], 4, [5,4,5,6,5,4],true],
      happy :['images/enemies/boss_1.png', [0,150], [40,75], 4, [7],true],
      teleport :['images/enemies/boss_1.png', [0,225], [40,75], 30, [0,1,2,3,4,5,6,6,5,4,3,2,1,0],true, 'vertical']
    }
  } 
 
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
  
  var graveSpriteSheet = ['images/newsprites.png', [2,100], [30,30], 4 , [0,1,2,0,1,2],null, null, true];
  
  //BUllets
  var bulletCasingSpriteSheet = ['images/sparks/sparks.png', [0,150], [50,50], 14 , [0,1,2,3,4,5,6,7,8,9,10], null ,null, true];
  var sparkSpriteSheet = ['images/sparks/sparks.png', [0,200], [50,50], 18 , [0,1,2,3,4,5,6,7,8,9,10,11,12,13],null, null, true];
  var shootFireSpriteSheet = ['images/sparks/sparks.png', [0,250], [50,50], 20 , [0,1,2,3,4,5,6,7], null,null, true];
  var bossShotFireSpriteSheet = ['images/sparks/sparks.png', [0,300], [50,50], 20 , [0,1,2,3,4,5,6,7,8,9,10,11], true, null, true];
  var portalBackSpriteSheet = ['images/sparks/sparks.png', [0,350], [50,50], 40 , [0,1,2,3,4,5,6,5,5,6,5,6,5,6,5,4,3,2,1,0], null, null, true];
  var portalFrontSpriteSheet = ['images/sparks/sparks.png', [0,400], [50,50], 40 , [0,1,2,3,4,5,6,5,5,6,5,6,5,6,5,4,3,2,1,0],null, null, true];
  
  //Background entities
  var nebulaSpriteSheet = ['images/nebula/nebula1.png', [0,0], [1030,780], 1 , [0]]
  var nebula2SpriteSheet = ['images/nebula/nebula2.png', [0,0], [1023,771], 1 , [0]]
  var nebula3SpriteSheet = ['images/nebula/nebula3.png', [0,0], [600,600], 1 , [0]]
  var galaxySpriteSheet = ['images/nebula/galaxy.png', [0,0], [600,600], 1 , [0]]
  var galaxy2SpriteSheet = ['images/nebula/galaxy2.png', [0,0], [600,600], 1 , [0]]
  var blackholeSpriteSheet = ['images/nebula/blackhole.png', [0,0], [1994,1147], 1 , [0]]
  var asteroidsSpriteSheet = ['images/nebula/asteroids.png', [0,0], [600,600], 1 , [0]]
  var asteroids2SpriteSheet = ['images/nebula/asteroids2.png', [0,0], [600,600], 1 , [0]]
  var asteroids3SpriteSheet = ['images/nebula/asteroids3.png', [0,0], [600,600], 1 , [0]]
  var dustSpriteSheet = ['images/backgrounds/dust.png', [0,0], [600,400], 1 , [0]]

 // var bonusSpriteSchema = ['images/weapons/bonus.png', [50,50], [100,50], 1, [0]];
  var bonusSpriteSchema = ['images/weapons/bonus.png', [100,0], [50,50], 12, [0,1,2,3,4,5,6,7,8]];
  var doubleShootBonusSpriteSchema = ['images/weapons/bonus.png', [100,150], [50,50], 8, [0,1,2,3,4,5]];
  var rapidShotBonusSpriteSchema = ['images/weapons/bonus.png', [100,200], [50,50], 8, [0,1,2,3,4,5]];
  var shotGunBonusSpriteSchema = ['images/weapons/bonus.png', [100,250], [50,50], 8, [0,1,2,3,4,5]];
  var bonusWeaponSpriteSchema = ['images/bonusWeapon.png', [0,0], [40,40], 1, [0]];
  var greenGemSpriteSheet =['images/weapons/bonus.png', [0,200], [50,50], 1, [0]];
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
    },
    'greenBullet' : {
      sprite: greenBulletSchema,
      damage: 50,
      speed: [500,500],
      angle: 0,
      resize: [10,10],
      renderTranslated: [0, 0]
    },
    'redBullet' : {
      sprite: redBulletSchema,
      damage: 50,
      speed: [500,500],
      angle: 0,
      resize: [10,10],
      renderTranslated: [0, 0]
    },
    'cooldog' : {
      sprite: coolDogSpriteSchema,
      damage: 30,
      baseDamage: 30,
      bulletName : 'greenBullet',
      critChance: 0.05,
      hitbox: {
        pos: [25,30],
        size: [30,40]
      },
      shootOrigin : [80, 40],
      speed: [200,200],
      angle: 0,
      life: 100,
      totalLife: 100,
      hitArea: [80,56],
      resize: [80,80],
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

    'bonusWeapon':{
      sprite: bonusWeaponSpriteSchema,
      damage: 20,
      bulletName: 'bluebullet',
      speed: [20,20]
    },
    'boss':{
      speed: [25,25],
      points: 10000,
      totalLife: 10000,
      angle: 1,
      life: 10000,
      bulletName: 'bullet',
      bulletShotFireName: 'bossShootFire',
      sprite: bossSpriteDefinition.normal.standby,
      animations: [
       {
          name: 'shootnormal',
          sprite:  bossSpriteDefinition.normal.shooting
        },
        {
          name: 'standbynormal',
          sprite:  bossSpriteDefinition.normal.standby
        },
        {
          name: 'talknormal',
          sprite:  bossSpriteDefinition.normal.talking
        },{
          name:'teleportnormal',
          sprite: bossSpriteDefinition.normal.teleport
        },{
          name: 'happy',
          sprite: bossSpriteDefinition.normal.happy
        },
        {
          name: 'shootdamaged',
          sprite:  bossSpriteDefinition.damaged.shooting
        },
        {
          name: 'standbydamaged',
          sprite:  bossSpriteDefinition.damaged.standby
        },
        {
          name: 'talkdamaged',
          sprite:  bossSpriteDefinition.damaged.talking
        },{
          name:'teleportdamaged',
          sprite: bossSpriteDefinition.damaged.teleport
        },{
          name: 'shootverydamaged',
          sprite:  bossSpriteDefinition.verydamaged.shooting
        },
        {
          name: 'standbyverydamaged',
          sprite:  bossSpriteDefinition.verydamaged.standby
        },
        {
          name: 'talkverydamaged',
          sprite:  bossSpriteDefinition.verydamaged.talking
         },{
          name:'teleportverydamaged',
          sprite: bossSpriteDefinition.verydamaged.teleport
        }
      ],
      damage: 60,
      //resize:[40,75]
      hitbox: {
        pos: [0,0],
        size: [40,107]
      },
      resize:[60,107]
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
      renderTranslated: [20, 40],
      speed: [0,0],
      centerOfRotation: [0, 50]
    },
    'bossShootFire':{
      sprite: bossShotFireSpriteSheet,
      resize: [50,50],
      renderTranslated: [25,20],
      speed: [0,0]
    },
    'portal_front':{
      sprite: portalFrontSpriteSheet,
      resize: [100,100],
      renderTranslated: [20,30],
      speed: [0,0]
    },
    'portal_back':{
      sprite: portalBackSpriteSheet,
      resize: [100,100],
      renderTranslated: [20,30],
      speed: [0,0]
    },
    'spark':{
      sprite: sparkSpriteSheet,
      resize: [50,50],
      renderTranslated: [10, 15],
      speed: [0,0]
    }
  };

  var joke_entities = {
    'enemy1' : {
      sprite: tacnyanSpriteSchema,
      speed: [45,45],
      points: 100,
      angle: 1,
      life: 100,
      totalLife: 100,
      resize: [90,60],
      damage: 10
    },
    'enemy2' : {
      sprite: dolanSpriteSchema,
      speed: [55,55],
      points: 200,
      angle: 1,
      life: 200,
      totalLife: 200,
      resize: [50,50],
      damage: 10
    },
    'enemy3' : {
      sprite: flappySpriteSchema,
      speed: [65,65],
      points: 300,
      angle: 1,
      life: 300,
      totalLife: 300,
      resize: [50,50],
      damage: 30
    },
    'enemy4' : {
      sprite: dramaticSpriteSchema,
      speed: [75,75],
      points: 400,
      angle: 1,
      life: 400,
      totalLife: 400,
      resize: [50,45],
      damage: 20
    },
    'enemy5' : {
      sprite: level5SpriteSchema,
      speed: [85,85],
      points: 500,
      angle: 1,
      life: 500,
      totalLife: 500,
      damage: 10
    }
  };

  var level_1_entities = {
    'junk1' : {
      sprite: level1_junk1Sprite,
      speed: [65,65],
      points: 25,
      angle: 1,
      life: 65,
      totalLife: 65,
      resize: [50,50],
      damage: 5
    }, 'junk2' : {
      sprite: level1_junk2Sprite,
      speed: [65,65],
      points: 25,
      angle: 1,
      life: 65,
      totalLife: 65,
      resize: [50,50],
      damage: 5
    }, 'junk3' : {
      sprite: level1_junk3Sprite,
      speed: [65,65],
      points: 25,
      angle: 1,
      life: 65,
      totalLife: 65,
      resize: [50,50],
      damage: 5
    },'junk4' : {
      sprite: level1_junk4Sprite,
      speed: [65,65],
      points: 25,
      angle: 1,
      life: 65,
      totalLife: 65,
      resize: [50,50],
      damage: 5
    },
    'rat' : {
      sprite: level1_ratSprite,
      speed: [45,45],
      points: 50,
      angle: 1,
      shootOrigin: [5,25],
      bulletName: 'redBullet',
      messages: ['Tsttck', 'Rattattaaa', 'Rat is clever', 'You smell like dog', 'Rat army! RAT!', 'dammit, george'],
      life: 100,
      totalLife: 100,
      resize: [40,40],
      damage: 20,
      animations:[
        {
          name: 'shootnormal',
          sprite:  level1_ratSpriteShooting,
          resetAfterEnd: true
        },
        {
          name: 'shootdamaged',
          sprite:  level1_ratSpriteShooting,
          resetAfterEnd: true
        },
        {
          name: 'shootverydamaged',
          sprite:  level1_ratSpriteShooting,
          resetAfterEnd: true
        }
      ],
      actions : [{name: 'enemyShoot', delay: 2.5}]
    },
    'drone': {
      sprite: level1_droneSpriteDefinition.normal.standby,
      speed: [15,15],
      points: 50,
      angle: 1,
      life: 300,
      bulletName: 'redBullet',
      totalLife: 300,
      resize: [50,50],
      messages: ['Beep beep', 'Drone search', 'Drone destroy', 'Aiming, beep'],
      shootOrigin: [-30,20],
      hitbox: {
        pos: [5,5],
        size: [40,40]
      },
      bulletName: 'greenBullet',
      damage: 20,
      actions : [{name: 'aim', delay: 1.5}, {name : 'neutralShoot', delay: 0.2}],
      animations: [
        {
          name: 'aiming',
          sprite:  level1_droneSpriteDefinition.normal.aiming
        }
      ],
    },
    'ratship' : {
      sprite: level1_battleStationSprite,
      speed: [20,20],
      points: 150,
      angle: 1,
      life: 1000,
      bulletName: 'redBullet',
      totalLife: 1000,
      messages: ['alpha bravo rat', 'v formation', 'clearing area'],
      resize: [100,100],
      damage: 20,
      actions : [{name: 'enemyShoot', delay: 2.5}]
    }
  }


  var bonusItems  = {
    'greenGem': {
      speed: [10,10],
      resize: [50,50],
      sprite: greenGemSpriteSheet,
      points: 100,
      angle: 1
    },
    'dogeBonus': {
      speed: [200,200],
      resize: [50,50],
      sprite: bonusSpriteSchema,
      angle : 1
    }, 
    'doubleShootBonus': {
      speed: [200,200],
      sprite: doubleShootBonusSpriteSchema,
      angle : 1
    }, 
    'rapidShotBonus': {
      speed: [200,200],
      sprite: rapidShotBonusSpriteSchema,
      angle : 1
    }, 
    'shotGunBonus': {
      speed: [200,200],
      sprite: shotGunBonusSpriteSchema,
      angle : 1
    }
  }


  var backgroundEntities ={
    'junk1' : {
      sprite: level1_junk1Sprite,
      speed: [65,65],
      angle: 1,
      resize: [50,50]
    }, 'junk2' : {
      sprite: level1_junk2Sprite,
      speed: [65,65],
      angle: 1,
      resize: [50,50]
    }, 'junk3' : {
      sprite: level1_junk3Sprite,
      speed: [40,40],
      angle: 1,
      resize: [50,50]
    },'junk4' : {
      sprite: level1_junk4Sprite,
      speed: [65,65],
      angle: 1,
      resize: [50,50]
    },'tire' : {
      sprite: level1_tireSprite,
      speed: [80,80],
      angle: 1,
      resize: [50,50]
    },'ship1' : {
      sprite: level1_ship1Sprite,
      speed: [80,80],
      resize:[200,150],
      angle: 1
    },'ship2' : {
      sprite: level1_ship2Sprite,
      speed: [80,80],
      resize:[200,200],
      angle: 1
    },'ship3' : {
      sprite: level1_ship3Sprite,
      speed: [80,80],
      resize:[125,75],
      angle: 1
    },
    'nebula': {
      speed: [10,10],
      resize: [400,350],
      sprite: nebulaSpriteSheet,
      angle: 1
    },
    'nebula2': {
      speed:[10,10],
      resize: [400,400],
      sprite: nebula2SpriteSheet,
      angle: 1
    },'nebula3': {
      speed: [10,10],
      resize: [400,400],
      sprite: nebula3SpriteSheet,
      angle: 1
    },
    'asteroids': {
      speed: [50,50],
      resize: [400,400],
      sprite: asteroidsSpriteSheet ,
      angle: 1
    },
    'asteroids2': {
      speed: [50,50],
      resize: [400,400],
      sprite: asteroids2SpriteSheet,
      angle: 1
    },
    'asteroids3': {
      speed: [50,50],
      resize: [400,400],
      sprite: asteroids3SpriteSheet,
      angle: 1
    },
    'blackhole': {
      speed: [5,5],
      resize: [400,400],
      sprite: blackholeSpriteSheet,
      angle: 1
    },
    'galaxy': {
      speed: [10,10],
      resize: [400,400],
      sprite: galaxySpriteSheet,
      angle: 1
    },
    'galaxy2':{
      speed: [10,10],
      resize: [400,400],
      sprite: galaxy2SpriteSheet,
      angle: 0.8,
      rotateSprite: -0.8
    },
    'dust':{
      speed: [10,10],
      sprite: dustSpriteSheet,
      angle: 1.2,
      rotateSprite: 0.2
    }
  }

  function GameEntity(entityDefinition, opts){
    
    entityDefinition.angle = entityDefinition.angle ? entityDefinition.angle * Math.PI : null;
    entityDefinition.rotateSprite = entityDefinition.rotateSprite ?  entityDefinition.rotateSprite * Math.PI : null;

    for(var opt in opts){
      entityDefinition[opt] = opts[opt];
    }
    
    if(opts.rotateSprite){
      entityDefinition.rotateSprite = opts.rotateSprite;
    }
    
    var entity =  new Models.Entity(entityDefinition);
    //Scale
    var size = entity.getSize();
    entity.resizeByFactor(RESIZEFACTOR);

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
    var entity =  new GameEntity(JSON.parse(JSON.stringify(entityList[name])), opts);
    entity.name = name;

    return entity;
  }
  
  function getBackgroundEntity(name, opts){
    var entity = getEntity(name, opts, backgroundEntities);
    return entity;
  }

  function getEnemy(pos, name, entitiesList){
    var list; 
    if(entitiesList == 'joke'){
      list = joke_entities;
    }else if(entitiesList == 'level_1'){
      list = level_1_entities;
    }

    var entity = getEntity(name, {pos: pos}, list);

    entity.behaviourUpdate = function(dt){
      this.pos = petra.moveByAngle(dt)(this).pos;
    }.bind(entity);

    return entity;
  }
  
  function getBonus(name, opts){
    var list = bonusItems;

    var entity = getEntity(name, opts, list);
    entity.angle = - petra.randomFloat(7/12,17/12) * Math.PI;
    entity.bounces = 5;
    return entity;
  }

  function getBoss(pos){
    var entity = getEntity('boss', {pos:pos});
    var shoot = {
      name : 'enemyShoot',
      delay: 0.7
    };
    var doubleShoot = {
      name : 'doubleShoot', 
      delay: 0.2
    }
    var move = {
      name: 'move', 
      delay: 1.2
    };
    var launchEnemy = {
      name: 'launchEnemy',
      delay: 0.5
    };

    var teleport = {
      name : 'teleport',
      delay: 0.8
    };

    var talk = {
      name : 'talk',
      delay: 1.5
    }
    entity.actions = [];

    entity.actions.push(shoot)
    entity.actions.push(shoot)
    entity.actions.push(doubleShoot)
    entity.actions.push(launchEnemy)
    entity.actions.push(teleport)
    entity.actions.push(doubleShoot)
    entity.actions.push(shoot)
    entity.actions.push(move)
    entity.actions.push(doubleShoot)
    entity.actions.push(talk)
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
    getBoss: getBoss,
    getBonus: getBonus
  }
});

