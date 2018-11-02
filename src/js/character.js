'use strict';

function Character(game, x, y, spriteName) {
	GameObject.apply(this, [game, x, y, spriteName]);
}

Character.prototype = Object.create(GameObject.prototype);
Character.prototype.constructor = Character;

Character.prototype.move = function (movementSpeed) { 
	this.x += movementSpeed;
}