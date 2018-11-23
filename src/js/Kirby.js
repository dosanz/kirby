'use strict';

var GameObject = require('./gameObject');
var Character = require('./character');

// const powerup = ['normal', 'fire', 'thunder']; // casi seguro que no vale
const NORMAL = 'normal';
const FIRE = 'fire';
const THUNDER = 'thunder';

var Kirby = function (game, x, y) {
	Character.call(this, game, x, y, 'kirby');
	this.movementSpeed = 8;
	this.jumpHeight = 8;
	this.empty = true;
	this.currentPowerUp = NORMAL;
	this.keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
	this.keyA = game.input.keyboard.addKey(Phaser.Keyboard.A);
	this.keyD = game.input.keyboard.addKey(Phaser.Keyboard.D);
	this.keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

Kirby.prototype = Object.create(Character.prototype);
Kirby.prototype.constructor = Kirby;

Kirby.prototype.update = function () {
	this.keyA.onDown.Character.prototype.move.call(-this.movementSpeed);
	this.keyD.onDown.Character.prototype.move.call(this.movementSpeed);
	this.keyW.onDown.jump();
	this.keySpace.onDown.attack();

}

Kirby.prototype.jump = function () {
	this.y += this.jumpHeight;
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