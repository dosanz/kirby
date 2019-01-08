'use strict'

var Attack = require ('./attack.js');

const LIFE_TIME = 500;

function Aura(game, x, y, power, kirbyBool, attacker){
    this.attacker = attacker;
    this.power = power;

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
        this.anim = this.animations.add('mainAnim', [0,1,2,3,4,5,6,7], 10, true);
        this.verticalOffset = 16;
        if(!kirbyBool){
            this.verticalOffset -= 8;
        }
        this.sound = this.game.add.audio('thunder');
    }
    else if (this.attacker.currentPowerUp == 'fire'){
        Attack.call(this, game, x, y, 'fireAttack', power, kirbyBool);
        this.anim = this.animations.add('mainAnim', [0,1,2,3,4,5], 10, true);
        this.verticalOffset = 16;
        if(!kirbyBool){
            this.verticalOffset -= 8;
        }
        this.sound = this.game.add.audio('fire');
    }
    else if (this.attacker.currentPowerUp == 'spark'){
        Attack.call(this, game, x, y, 'sparkAttack', power, kirbyBool);
        this.anim = this.animations.add('mainAnim', [0,1,2], 10, true);
        this.verticalOffset = 20;
        if(!kirbyBool){
            this.verticalOffset -= 8;
        }
        this.sound = this.game.add.audio('spark');
    }
    
    this.body.collideWorldBounds = false;

    this.scale.x *= this.flip;
    this.body.immovable = true;
    this.game.time.events.add(LIFE_TIME, function(){this.die();}, this);
    this.animations.play('mainAnim');
    this.sound.play();
}

Aura.prototype = Object.create(Attack.prototype);
Aura.prototype.constructor = Aura;

Aura.prototype.update = function(){
    this.y = this.attacker.y -this.verticalOffset;
    this.damage();
}

Aura.prototype.checkCollisions = function(enemy){
    if(this.checkOverlap(enemy)){
        if (enemy.tag == 'enemy'){
            enemy.die();
        }
        else if (enemy.tag == 'boss'){
            enemy.hurt(this.power);
        }
        else if (enemy.tag == 'fallingEnemy'){
            enemy.destroy();
        }
    }
}

Aura.prototype.collideWithKirby = function(kirby){
    if(this.checkOverlap(kirby)){
        kirby.getHurt(this.power);
    }
}

Aura.prototype.die = function(){
    if (this.attacker.tag == 'kirby'){
        this.attacker.canMove = true;
        this.attacker.invincible = false;
    }

    else if (this.attacker.tag == 'enemy'){
        this.attacker.attackAnim = false;
    }
    this.destroy();
}

module.exports = Aura;