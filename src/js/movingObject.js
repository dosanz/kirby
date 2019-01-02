'use strict';

var GameObject = require('./gameObject.js');

const NORMAL = 'normal';
const FIRE = 'fire';
const THUNDER = 'thunder';
const STONE = 'stone';

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

MovingObject.prototype.moveToKirby = function(){
	var angle = (this.game.physics.arcade.angleBetween(this, this.kirby) * (180/Math.PI));
	this.game.physics.arcade.velocityFromAngle(angle, 100, this.body.velocity);
}

module.exports = MovingObject;