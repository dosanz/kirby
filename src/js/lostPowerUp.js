'use strict';

var Character = require('./character.js');

const LIFE_TIME = 5000;

function LostPowerUp(game, x, y, spriteName, powerUp, kirby) {
    Character.call(this, game, x, y, spriteName);
    this.powerUp = powerUp;
    this.beingAbsorbed = false;
    this.kirby = kirby;
    
    if (this.kirby.facingRight){
        this.body.velocity.x = -30;
    }

    else{
        this.body.velocity.x = 30;
    }
    
    this.spawnTime = game.time.now;
    this.game.world.addChild(this);
}

LostPowerUp.prototype = Object.create(Character.prototype);
LostPowerUp.prototype.constructor = LostPowerUp;

LostPowerUp.prototype.update = function(){
    if (this.body.onFloor()){
        this.body.velocity.y = -200;
    }

    LostPowerUp.prototype.beingEaten.call(this);
    LostPowerUp.prototype.collideWithKirby.call(this);

    if (this.game.time.now > this.spawnTime + LIFE_TIME){
        this.kirby.lostPowerUpCount = 0;
        this.kill();
    }
}

LostPowerUp.prototype.beingEaten = function(){
	if (this.kirby.currentPowerUp == 'normal' && this.kirby.acting && this.kirby.empty){
		if (!this.kirby.facingRight && ((this.x < this.kirby.x) && (this.x >= this.kirby.x - this.kirby.swallowRange))){
			this.beingAbsorbed = true;
			LostPowerUp.prototype.moveToKirby.call(this);
		}
		else if (this.kirby.facingRight && ((this.x > this.kirby.x) && (this.x <= this.kirby.x + this.kirby.swallowRange))){
			this.beingAbsorbed = true;
			LostPowerUp.prototype.moveToKirby.call(this);
		}
	}
	else{
		this.beingAbsorbed = false;
	}
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