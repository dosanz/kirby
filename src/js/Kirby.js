'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');

// const powerup = ['normal', 'fire', 'thunder']; // casi seguro que no vale
const NORMAL = 'normal';
const FIRE = 'fire';
const THUNDER = 'thunder';

const AIR_SPEED = 240;
const GROUND_SPEED = 120;

function Kirby (game, x, y) {
	Character.call(this, game, x, y, 'kirby');
	this.movementSpeed = GROUND_SPEED;
	this.jumpHeight = 120;
	this.empty = true;
	this.grounded = true;
	this.currentPowerUp = NORMAL;


	this.keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
	this.keyA = game.input.keyboard.addKey(Phaser.Keyboard.A);
	this.keyD = game.input.keyboard.addKey(Phaser.Keyboard.D);
	this.keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


}

Kirby.prototype = Object.create(Character.prototype);
Kirby.prototype.constructor = Kirby;

Kirby.prototype.update = function () {
	// Character.prototype.update.call(this, ...)
	Character.prototype.stop.call(this);

	if (this.grounded) {
		this.movementSpeed = GROUND_SPEED;
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
		Kirby.prototype.jump.call(this);
	}
	if (this.keySpace.isDown) {
		Kirby.prototype.attack.call(this);
	}
	
	if (this.body.onFloor()) {
		this.grounded = true;
	}
	else {
		this.grounded = false;
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