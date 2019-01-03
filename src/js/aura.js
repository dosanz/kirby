'use strict'

var Attack = require ('./attack.js');

const LIFE_TIME = 500;

function Aura(game, x, y, spriteName, facingRight, power, kirby, attacker){
    Attack.call(this, game, x, y, spriteName, facingRight, power, kirby);
    this.body.disable;
    this.attacker = attacker;
    this.game.time.events.add(Phaser.Timer.SECOND + LIFE_TIME, function(){this.attacker.canMove = true; this.kill();}, this);
}

Aura.prototype = Object.create(Attack.prototype);
Aura.prototype.constructor = Aura;

Aura.prototype.update = function(){
    this.y = this.attacker.y;
    this.x = this.attacker.x + 8;
    this.damage();
}

Aura.prototype.checkCollisions = function(enemy){
    if(this.checkOverlap(enemy)){
        enemy.die();
    };
}

Aura.prototype.checkOverlap = function(enemy){
    var enemyBounds = enemy.getBounds();
    var auraBounds = this.getBounds();

    return Phaser.Rectangle.intersects(enemyBounds, auraBounds);
}

module.exports = Aura;