'use strict'

var Attack = require ('./attack.js');


function Bullet(game, x, y, spriteName, facingRight, power, kirby){
    Attack.call(this, game, x, y, spriteName, facingRight, power, kirby);

    if (facingRight){
        this.speed = 100;
    }
    else{
        this.speed = -100;
    }
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
    this.kill();
}

module.exports = Bullet;