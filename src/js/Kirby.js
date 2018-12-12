'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');

// const powerup = ['normal', 'fire', 'thunder']; // casi seguro que no vale
const NORMAL = 'normal';
const FIRE = 'fire';
const THUNDER = 'thunder';

const AIR_SPEED = 180;
const GROUND_SPEED = 120;

const AIR_GRAVITY = 200;
const GROUND_GRAVITY = 400;

function Kirby (game, x, y) {
	Character.call(this, game, x, y, 'kirby');
	this.movementSpeed = GROUND_SPEED;
	this.jumpHeight = 120;
	this.empty = true;
	this.grounded = true;
	this.flying = false;
	this.canFly = false;

	this.currentPowerUp = NORMAL;


	this.keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
	this.keyA = game.input.keyboard.addKey(Phaser.Keyboard.A);
	this.keyD = game.input.keyboard.addKey(Phaser.Keyboard.D);
	this.keyS = game.input.keyboard.addKey(Phaser.Keyboard.S);
	this.keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}


Kirby.prototype = Object.create(Character.prototype);
Kirby.prototype.constructor = Kirby;


Kirby.prototype.update = function () {
	// Character.prototype.update.call(this, ...)
	Character.prototype.stop.call(this);
	Kirby.prototype.manageInput.call(this);
	
	
	if (this.body.onFloor()) {
		this.grounded = true;
	}
	else {
		this.grounded = false;
	}

}


Kirby.prototype.manageInput = function () {
	if (this.grounded) {
		this.movementSpeed = GROUND_SPEED;
		this.canFly = false;
		this.body.gravity.y = GROUND_GRAVITY;
	}
	else {
		this.movementSpeed = AIR_SPEED;
	}

	if (this.keyA.isDown) {
		Character.prototype.move.call(this, -this.movementSpeed);
	} 
	if (this.keyD.isDown) {
		Character.prototype.move.call(this, this.movementSpeed);
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
		Kirby.prototype.attack.call(this);
	}

	if (this.keyW.isUp && !this.grounded) {
		this.canFly = true;
	}
}


Kirby.prototype.jump = function () {
	this.body.velocity.y = -this.jumpHeight;
}


Kirby.prototype.attack = function () {
	console.log('bium');
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