'use strict';

function GameObject(game, x, y, spriteName) {
	Phaser.Sprite.call(this, game, x, y, spriteName);
	this.anchor.setTo(0.5, 0.5);
	// this.x = x;
	// this.y = y;

	//this.game.physics.enable(this, Phaser.Physics.ARCADE);
}

GameObject.prototype = Object.create(Phaser.Sprite.prototype);
GameObject.prototype.constructor = GameObject;


module.exports = GameObject;