'use strict'

var Attack = require ('./attack.js');

function Aura(game, x, y, spriteName, facingRight, power, kirby){
    Attack.call(this, game, x, y, spriteName, facingRight, power, kirby);
}

Aura.prototype = Object.create(Attack.prototype);
Aura.prototype.constructor = Aura;

Aura.prototype.update = function(){
    // kill after a few seconds

}
Aura.prototype.collideWithEnemy = function(enemy){
    enemy.die();
}

module.exports = Bullet;