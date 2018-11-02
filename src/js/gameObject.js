'use strict';

function GameObject(game, x, y, spriteName) {
	Phaser.Sprite.call(this, game, x, y, spriteName);
	this.x = x;
	this.y = y;
}

