'use strict'

var GameObject = require('./gameObject.js');

function Food(game, x, y, spriteName, healthBoost, kirby) { 
	GameObject.call(this, game, x, y, spriteName);
	this.healthValue = healthBoost;
	this.kirby = kirby;
}

Food.prototype = Object.create(GameObject.prototype);
Food.prototype.constructor = Food;

Food.prototype.update = function(){
	if (this.inCamera){
		if (this.game.physics.arcade.collide(this, this.kirby)){
            this.kirby.heal(this.healthValue);
            this.destroy();
        }
	}
}

module.exports = Food;