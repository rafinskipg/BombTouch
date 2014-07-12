define( [ 'game/models/bullets'], function( bullets){


  function Weapon(options){
    this.shootDelay = options.shootDelay;

    this.bullet = options.bullet;
    this.color = options.color || red;
    this.damage = options.damage || 20;
    this.name = options.name;
    
  }

  function createGreenBullet(pos, damage, angle,rotate){
    var opts = {
      speed: [500,500],
      damage : damage || 20,
      color: {
        r: 85,
        g: 202,
        b: 69
      },
      size: 10,
      pos: pos,
      angle: angle,
      rotate: rotate
    }
    return new bullets.Bullet(opts);
  }

  function createRedBullet(pos, damage, angle,rotate){
    var opts = {
      speed: [500,500],
      damage : damage || 20,
      color: {
        r: 255,
        g: 0,
        b: 0
      },
      size: 20,
      pos: pos,
      angle: angle,
      rotate: rotate
    }
    return new bullets.Bullet(opts);
  }


  function Pistol(){
    this.options = new Weapon({
      shootDelay: 0.300,
      color: 'blue',
      damage: 20
    });
    this.shoot = function(arrOfBullets, pos, isCriticalStrike){
      var damage = isCriticalStrike ? this.options.damage * 2 : this.options.damage;
      arrOfBullets.push(createGreenBullet(pos, damage, 0));  
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
      arrOfBullets.push(createGreenBullet(pos, damage, 0)); 
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
      arrOfBullets.push(createGreenBullet(pos, damage, 0.2*Math.PI,  0.2*Math.PI)); 
      arrOfBullets.push(createGreenBullet(pos, damage, 1.8*Math.PI,  1.8*Math.PI)); 
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
      arrOfBullets.push(createGreenBullet(pos, damage,  0.05*Math.PI,  0.05 *Math.PI));  
      arrOfBullets.push(createGreenBullet(pos, damage,  0.1*Math.PI,  0.1 *Math.PI));  
      arrOfBullets.push(createGreenBullet(pos, damage,  0.15*Math.PI,  0.15 *Math.PI));  
      arrOfBullets.push(createGreenBullet(pos, damage,  0.2*Math.PI,  0.2 *Math.PI));  
      arrOfBullets.push(createGreenBullet(pos, damage,  0.3*Math.PI,  0.3 *Math.PI));  
      arrOfBullets.push(createGreenBullet(pos, damage,  -0.05*Math.PI,  -0.05 *Math.PI));  
      arrOfBullets.push(createGreenBullet(pos, damage,  -0.1*Math.PI,  -0.1 *Math.PI));  
      arrOfBullets.push(createGreenBullet(pos, damage,  -0.15*Math.PI,  -0.15 *Math.PI));  
      arrOfBullets.push(createGreenBullet(pos, damage,  -0.2*Math.PI,  -0.2 *Math.PI));  
      arrOfBullets.push(createGreenBullet(pos, damage,  -0.3*Math.PI,  -0.3 *Math.PI));  
    }
  }

  return {
    Pistol : Pistol,
    DoubleShoot: DoubleShoot,
    ShotGun: ShotGun,
    RapidFire: RapidFire
  };

});