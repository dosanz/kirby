'use strict';

function GameObject(game, x, y, spriteName) {
	Phaser.Sprite.call(this, game, x, y, spriteName);
	this.anchor.setTo(0.5, 0.5);
	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.collideWorldBounds = true;
	this.body.allowGravity = false;
}

GameObject.prototype = Object.create(Phaser.Sprite.prototype);
GameObject.prototype.constructor = GameObject;


module.exports = GameObject;