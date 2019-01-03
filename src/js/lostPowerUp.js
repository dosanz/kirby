'use strict';

var Character = require('./character.js');

const LIFE_TIME = 5000;

function LostPowerUp(game, x, y, kirby) {
    Character.call(this, game, x, y, 'starAttack', true);
    this.kirby = kirby;
    this.powerUp = this.kirby.currentPowerUp;
    this.beingAbsorbed = false;

    if (this.kirby.facingRight){
        this.speed = -30;
    }

    else{
        this.speed = 30;
    }

    this.moving = this.animations.add('moving', [0,1,2], 20, true);
    this.crash = this.animations.add('crash', [3,4,5], 5, false);
    this.crash.onComplete.add(function(){this.kirby.lostPowerUpCount = 0; this.kill();}, this);
    this.animations.play('moving');

    this.game.world.addChild(this);
    this.game.time.events.add(Phaser.Timer.SECOND + LIFE_TIME, function(){this.animations.play('crash');}, this);
}

LostPowerUp.prototype = Object.create(Character.prototype);
LostPowerUp.prototype.constructor = LostPowerUp;

LostPowerUp.prototype.update = function(){
    this.move(this.speed);

    if (this.body.onFloor()){
        this.body.velocity.y = -200;
    }

    this.beingEaten();
	this.collideWithKirby();
}


LostPowerUp.prototype.collideWithKirby = function(){
	if (this.game.physics.arcade.collide(this, this.kirby)){
		if (this.beingAbsorbed == true){
            this.kirby.eat(this.powerUp, this.kirby);
            this.kirby.lostPowerUpCount = 0;
            this.kill();
		}
	}
}

module.exports = LostPowerUp;