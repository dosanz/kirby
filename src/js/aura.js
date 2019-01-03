'use strict'

var Attack = require ('./attack.js');

const LIFE_TIME = 500;

function Aura(game, x, y, power, kirbyBool, attacker){
    this.attacker = attacker;

    this.flip = 1;

    if (this.attacker.currentPowerUp != 'spark'){
        if (this.attacker.facingRight){
            x += 16;
        }
        else{
                x -= 16;
            this.flip = -1;
        }
    }

    if (this.attacker.currentPowerUp == 'thunder'){
        Attack.call(this, game, x, y, 'thunderAttack', power, kirbyBool);
        this.anim = this.animations.add('mainAnim', [0,1,2,3,4,5], 10, true);
    }
    else if (this.attacker.currentPowerUp == 'fire'){
        Attack.call(this, game, x, y, 'fireAttack', power, kirbyBool);
        this.anim = this.animations.add('mainAnim', [0,1,2,3,4,5], 10, true);
    }
    else if (this.attacker.currentPowerUp == 'spark'){
        Attack.call(this, game, x, y, 'sparkAttack', power, kirbyBool);
        this.anim = this.animations.add('mainAnim', [0,1,2], 10, true);
    }

    this.scale.x *= this.flip;
    this.body.disable;
    this.game.time.events.add(LIFE_TIME, function(){this.attacker.canMove = true; this.kill();}, this);
    this.animations.play('mainAnim');
}

Aura.prototype = Object.create(Attack.prototype);
Aura.prototype.constructor = Aura;

Aura.prototype.update = function(){
    this.y = this.attacker.y;
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