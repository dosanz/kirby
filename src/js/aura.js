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

    Aura.prototype.damage.call(this);
}
Aura.prototype.collideWithEnemy = function(enemy){
    enemy.die();
}

Aura.prototype.damage = function(){
    if (this.kirby){
        var enemy = null;
        var count = 2;
        while(enemy == null && count < this.game.world.children.length){
            
            if(this.game.physics.arcade.collide(this, this.game.world.children[count])){
                enemy = this.game.world.children[count];
                if (enemy.tag == 'enemy'){
                    if (this.checkOverlap(enemy, this)){
                        enemy.die();
                    }
                }
            }
            count++;
        }
    }
}

Aura.prototype.checkOverlap = function(enemy){
    var enemyBounds = enemy.getBounds();
    var auraBounds = this.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);
}

module.exports = Aura;