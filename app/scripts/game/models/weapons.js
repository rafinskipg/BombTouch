define( [ 'game/entities'], function( EL){


  function Weapon(options){
    this.shootDelay = options.shootDelay;

    this.bullet = options.bullet;
    this.color = options.color || red;
    this.damage = options.damage || 20;
    this.name = options.name;
    
  }

  function Pistol(){
    this.options = new Weapon({
      shootDelay: 0.300,
      color: 'blue',
      damage: 20
    });
    this.shoot = function(arrOfBullets, pos, isCriticalStrike){
      var damage = isCriticalStrike ? this.options.damage * 2 : this.options.damage;
      arrOfBullets.push(EL.getEntity('greenBullet', {pos: pos, damage: damage, angle: 0}));  
    }
  }  

  function RapidFire(){
    this.options = new Weapon({
      shootDelay: 0.0500,
      color: 'blue',
      damage: 10
    });
    this.shoot = function(arrOfBullets, pos, isCriticalStrike){
      var damage = isCriticalStrike ? this.options.damage * 2 : this.options.damage;
      arrOfBullets.push(EL.getEntity('greenBullet', {pos: pos, damage: damage, angle: 0}));  
    }
  }  

  function DoubleShoot(){
    this.options = new Weapon({
      shootDelay: 0.300,
      color: 'blue',
      damage: 20
    });
    this.shoot = function(arrOfBullets, pos, isCriticalStrike){
      var damage = isCriticalStrike ? this.options.damage * 2 : this.options.damage;
      arrOfBullets.push(EL.getEntity('greenBullet', {pos: pos, damage: damage, angle: 0.2*Math.PI,  rotateSprite: 0.2 *Math.PI}));  
      arrOfBullets.push(EL.getEntity('greenBullet', {pos: pos, damage: damage, angle: 1.8*Math.PI, rotateSprite: 1.8*Math.PI }));  
    }
  }

  function ShotGun(){
    this.options = new Weapon({
      shootDelay: 0.5,
      color: 'blue',
      damage: 10,
      range: 200
    });

    this.shoot = function(arrOfBullets, pos, isCriticalStrike){
      var damage = isCriticalStrike ? this.options.damage * 2 : this.options.damage;
      arrOfBullets.push(EL.getEntity('greenBullet', {pos: pos, damage: damage, angle: 0.05*Math.PI,  rotateSprite: 0.05 *Math.PI}));  
      arrOfBullets.push(EL.getEntity('greenBullet', {pos: pos, damage: damage, angle: 0.1*Math.PI,  rotateSprite: 0.1 *Math.PI}));  
      arrOfBullets.push(EL.getEntity('greenBullet', {pos: pos, damage: damage, angle: 0.15*Math.PI,  rotateSprite: 0.15 *Math.PI}));  
      arrOfBullets.push(EL.getEntity('greenBullet', {pos: pos, damage: damage, angle: 0.2*Math.PI,  rotateSprite: 0.2 *Math.PI}));  
      arrOfBullets.push(EL.getEntity('greenBullet', {pos: pos, damage: damage, angle: 0.3*Math.PI,  rotateSprite: 0.3 *Math.PI}));  
      arrOfBullets.push(EL.getEntity('greenBullet', {pos: pos, damage: damage, angle: -0.05*Math.PI,  rotateSprite: -0.05 *Math.PI}));  
      arrOfBullets.push(EL.getEntity('greenBullet', {pos: pos, damage: damage, angle: -0.1*Math.PI,  rotateSprite: -0.1 *Math.PI}));  
      arrOfBullets.push(EL.getEntity('greenBullet', {pos: pos, damage: damage, angle: -0.15*Math.PI,  rotateSprite: -0.15 *Math.PI}));  
      arrOfBullets.push(EL.getEntity('greenBullet', {pos: pos, damage: damage, angle: -0.2*Math.PI,  rotateSprite: -0.2 *Math.PI}));  
      arrOfBullets.push(EL.getEntity('greenBullet', {pos: pos, damage: damage, angle: -0.3*Math.PI,  rotateSprite: -0.3 *Math.PI}));  
    }
  }

  return {
    Pistol : Pistol,
    DoubleShoot: DoubleShoot,
    ShotGun: ShotGun,
    RapidFire: RapidFire
  };

});