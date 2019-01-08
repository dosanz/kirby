'use strict'

var GameObject = require('./gameObject.js');

function LifeUp(game, x, y, spriteName, kirby) { 
	GameObject.call(this, game, x, y, spriteName);
	this.healthValue = healthBoost;
	this.kirby = kirby;
}

LifeUp.prototype = Object.create(GameObject.prototype);
LifeUp.prototype.constructor = Food;

LifeUp.prototype.update = function(){
	if (this.inCamera){
		if (this.game.physics.arcade.collide(this, this.kirby)){
            this.kirby.lifeUp();
            this.destroy();
        }
	}
}

module.exports = LifeUp;