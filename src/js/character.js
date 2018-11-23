'use strict';

var GameObject = require('./gameObject');

function Character(game, x, y, spriteName) {
	GameObject.call(this, game, x, y, spriteName);
	//this.game.physics.enable(this, Phaser.Physics.ARCADE);
	//this.body.collideWorldBounds = true;
}

Character.prototype = Object.create(GameObject.prototype);
Character.prototype.constructor = Character;

Character.prototype.move = function (movementSpeed) { 
	this.x += movementSpeed;
}


module.exports = Character;