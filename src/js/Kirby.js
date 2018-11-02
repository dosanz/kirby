'use strict';

function Kirby(game, x, y) {
	Character.apply(this, [game, x, y, 'Kirby']);
	var movementSpeed = 8;
}

Kirby.prototype = Object.create(Character.prototype);
Kirby.prototype.constructor = Kirby;

