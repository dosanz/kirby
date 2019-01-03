'use strict'

var Attack = require ('./attack.js');


function Bullet(game, x, y, power, kirby, attacker){
    this.attacker = attacker;
    if (this.attacker.currentPowerUp == 'normal'){
        Attack.call(this, game, x, y, 'starAttack', power, kirby);
    }
    else if (this.attacker.currentPowerUp == 'knife'){
        Attack.call(this, game, x, y, 'knifeAttack', power, kirby);
    }
    if (this.attacker.facingRight){
        this.speed = 100;
    }
    else{
        this.speed = -100;
    }

    this.moving = this.animations.add('moving', [0,1,2], 20, true);
    this.crash = this.animations.add('crash', [3,4,5], 5, false);
    this.crash.onComplete.add(function(){this.kill();}, this)
    this.animations.play('moving');
}

Bullet.prototype = Object.create(Attack.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function(){
    this.move(this.speed);
    this.damage();
}

Bullet.prototype.checkCollisions = function(enemy){
    this.game.physics.arcade.collide(this, enemy, this.collideWithEnemy(enemy, this));
}

Bullet.prototype.collideWithEnemy = function(enemy){
    enemy.die();
    this.speed = 0;
    this.animations.play('crash');
}

module.exports = Bullet;