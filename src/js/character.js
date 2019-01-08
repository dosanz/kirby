'use strict';

var MovingObject = require('./movingObject.js');


function Character(game, x, y, spriteName, edible) {
	MovingObject.call(this, game, x, y, spriteName);
	
	this.body.allowGravity = true;
	this.body.gravity.y = 400;

	this.beingAbsorbed = false;
	this.edible = edible;

	this.hurtSound = this.game.add.audio('hurt');
}

Character.prototype = Object.create(MovingObject.prototype);
Character.prototype.constructor = Character;

Character.prototype.beingEaten = function(){
	if (this.kirby.currentPowerUp == 'normal' && this.kirby.acting && this.kirby.empty && this.kirby.grounded){
		if (!this.kirby.facingRight && this.edible && ((this.x < this.kirby.x) && (this.x >= this.kirby.x - this.kirby.swallowRange))){
			this.beingAbsorbed = true;
			this.moveToKirby();
		}
		else if (this.kirby.facingRight && this.edible && ((this.x > this.kirby.x) && (this.x <= this.kirby.x + this.kirby.swallowRange))){
			this.beingAbsorbed = true;
			this.moveToKirby();
		}
	}
	else{
		this.beingAbsorbed = false;
	}
}

Character.prototype.moveToKirby = function(){
	var angle = (this.game.physics.arcade.angleBetween(this, this.kirby) * (180/Math.PI));
	this.game.physics.arcade.velocityFromAngle(angle, 100, this.body.velocity);
}

module.exports = Character;