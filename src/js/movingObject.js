'use strict';

var GameObject = require('./gameObject.js');

function MovingObject(game, x, y, spriteName) {
	GameObject.call(this, game, x, y, spriteName);
	//this.body.collideWorldBounds = true;
}

MovingObject.prototype = Object.create(GameObject.prototype);
MovingObject.prototype.constructor = MovingObject;

MovingObject.prototype.move = function (movementSpeed) {
	this.body.velocity.x = movementSpeed;
}


MovingObject.prototype.stop = function () {
	this.body.velocity.x = 0;
}

module.exports = MovingObject;