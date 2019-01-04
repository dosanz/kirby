'use strict'

var Attack = require ('./attack.js');


function Bullet(game, x, y, power, kirbyBool, attacker){
    this.attacker = attacker;
    this.power = power;
    if (this.attacker.currentPowerUp == 'normal'){
        Attack.call(this, game, x, y, 'starAttack', power, kirbyBool);
    }
    else if (this.attacker.currentPowerUp == 'thunder'){
        Attack.call(this, game, x, y, 'starAttack', power, kirbyBool);
    }
    else if (this.attacker.currentPowerUp == 'knife'){
        Attack.call(this, game, x, y, 'knifeAttack', power, kirbyBool);
    }
    if (this.attacker.facingRight){
        this.speed = 100;
    }
    else{
        this.speed = -100;
    }

    this.dying = false;

    this.moving = this.animations.add('moving', [0,1,2], 20, true);
    this.crash = this.animations.add('crash', [3,4,5], 5, false);
    this.crash.onComplete.add(function(){this.destroy();}, this)
    this.animations.play('moving');
}

Bullet.prototype = Object.create(Attack.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function(){
    this.move(this.speed);
    if (!this.dying){
        this.damage();
    }
}

Bullet.prototype.checkCollisions = function(enemy){
    this.game.physics.arcade.collide(this, enemy, this.collideWithEnemy(enemy, this));
}

Bullet.prototype.collideWithEnemy = function(enemy){
    enemy.die();
    this.speed = 0;
    this.dying = true;
    this.animations.play('crash');
}

Bullet.prototype.collideWithKirby = function(kirby){
    kirby.getHurt(this.power);
    this.speed = 0;
    this.dying = true;
    this.animations.play('crash');
}

module.exports = Bullet;