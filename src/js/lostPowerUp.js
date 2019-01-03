'use strict';

var Character = require('./character.js');

const LIFE_TIME = 5000;

function LostPowerUp(game, x, y, spriteName, powerUp, kirby) {
    Character.call(this, game, x, y, spriteName, true);
    this.powerUp = powerUp;
    this.beingAbsorbed = false;
    this.kirby = kirby;

    if (this.kirby.facingRight){
        this.speed = -30;
    }

    else{
        this.speed = 30;
    }
    
    this.game.world.addChild(this);
    this.game.time.events.add(Phaser.Timer.SECOND + LIFE_TIME, function(){this.kirby.lostPowerUpCount = 0; this.kill();}, this);
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