'use strict';

var MovingObject = require('./movingObject.js');


function Character(game, x, y, spriteName) {
	MovingObject.call(this, game, x, y, spriteName);
	//this.body.collideWorldBounds = true;
	this.body.allowGravity = true;
	this.body.gravity.y = 400;
}

Character.prototype = Object.create(MovingObject.prototype);
Character.prototype.constructor = Character;

module.exports = Character;