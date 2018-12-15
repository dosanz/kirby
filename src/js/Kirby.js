'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');

const AIR_SPEED = 180;
const GROUND_SPEED = 120;

const AIR_GRAVITY = 180;
const GROUND_GRAVITY = 400;

const FLIP_FACTOR = -1;

function Kirby (game, x, y) {
	Character.call(this, game, x, y, 'kirby');
	this.movementSpeed = GROUND_SPEED;
	this.jumpHeight = 120;
	this.originalScale = this.scale.x;

	this.currentPowerUp = NORMAL;

	// control bools --------------------
	this.empty = true;
	this.grounded = true;
	this.flying = false;
	this.canFly = false;
	this.isMoving = false;
	this.acting = false;

	this.facingRight = true;
	this.invincible = false;
	this.full = false;

	// input keys ------------------------
	this.keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
	this.keyA = game.input.keyboard.addKey(Phaser.Keyboard.A);
	this.keyD = game.input.keyboard.addKey(Phaser.Keyboard.D);
	this.keyS = game.input.keyboard.addKey(Phaser.Keyboard.S);
	this.keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	// animation set up --------------------
	this.idle = this.animations.add('idle', [0, 1, 2, 3], 2, true);
	this.walk = this.animations.add('walk', [4, 5, 6, 7], 5, true);
	this.jump = this.animations.add('jump', [8, 9, 10, 11], 1, false);
	this.inhaleStart = this.animations.add('inhaleStart', [12, 13], 4, false);
	this.inhale = this.animations.add('inhale', [14, 15], 4, true);
}


Kirby.prototype = Object.create(Character.prototype);
Kirby.prototype.constructor = Kirby;



Kirby.prototype.update = function () {
	// Character.prototype.update.call(this, ...)
	Character.prototype.stop.call(this);
	Kirby.prototype.manageInput.call(this);
	Kirby.prototype.manageAnimations.call(this);
	
	if (this.body.onFloor()) {
		this.grounded = true;
	}
	else {
		this.grounded = false;
	}

}


Kirby.prototype.manageInput = function () {
	if (this.grounded) {
		this.isMoving = false;
		this.acting = false;
		this.canFly = false;
		this.movementSpeed = GROUND_SPEED;
		this.body.gravity.y = GROUND_GRAVITY;
	}
	else {
		this.isMoving = true;
		this.movementSpeed = AIR_SPEED;
	}

	// key catching -------------------
	if (this.keyA.isDown) {
		this.scale.x = -1 * this.originalScale;
		Character.prototype.move.call(this, -this.movementSpeed);
		this.isMoving = true;
	} 
	if (this.keyD.isDown) {
		this.scale.x = this.originalScale;
		Character.prototype.move.call(this, this.movementSpeed);
		this.isMoving = true;
	}
	if (this.keyW.isDown) {
		if (this.canFly) {
			this.flying = true;
			this.body.gravity.y = AIR_GRAVITY;
			Kirby.prototype.jump.call(this);
		}
		else if (this.grounded) {
			Kirby.prototype.jump.call(this);
		}
	}
	if (this.keyS.isDown) {
		if (this.flying) {
			this.flying = false; 
			this.body.gravity.y = GROUND_GRAVITY;
		}
		// add else if grounded: smooshed down sprite
	}
	if (this.keySpace.isDown) {
		this.acting = true;
		Kirby.prototype.act.call(this);
	}

	if (this.keyW.isUp && !this.grounded) {
		this.canFly = true;
	}
}


Kirby.prototype.manageAnimations = function() {
	if (this.acting) {
		this.animations.play('inhale');
	}
	else if (!this.isMoving) {
		this.animations.play('idle');
	}
	else {
		if (this.grounded) {
			this.animations.play('walk');
		}
	}
}


Kirby.prototype.jump = function () {
	this.body.velocity.y = -this.jumpHeight;
}


// TODO: fill
Kirby.prototype.act = function () {
	switch(this.currentPowerUp){
		case NORMAL:
			this.invincible = true;
			// calls enemy.beingEaten()

	}
	
}



module.exports = Kirby;

// class Kirby extends Character {
// 	constructor(game, x, y) {
// 		super(game, x, y, 'Kirby');
// 		this.movementSpeed = 8;
// 		this.empty = true;
// 		this.currentPowerUp = 0;
// 		this.keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
// 	}

// 	update() {

// 	}
// }