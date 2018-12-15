'use strict';

var GameObject = require('./gameObject.js');

const NORMAL = 'normal';
const FIRE = 'fire';
const THUNDER = 'thunder';
const STONE = 'stone'

function Character(game, x, y, spriteName) {
	GameObject.call(this, game, x, y, spriteName);
	//this.body.collideWorldBounds = true;

	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.collideWorldBounds = true;
	this.body.allowGravity = true;
	this.body.gravity.y = 400;
}

Character.prototype = Object.create(GameObject.prototype);
Character.prototype.constructor = Character;



Character.prototype.move = function (movementSpeed) { 
	this.body.velocity.x = movementSpeed;
}


Character.prototype.stop = function () {
	this.body.velocity.x = 0;
}


Character.prototype.update = function () {

}


module.exports = Character;