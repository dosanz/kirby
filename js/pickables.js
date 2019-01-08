'use strict'

var GameObject = require('./gameObject.js');

function Pickable(game, x, y, spriteName, kirby) {
	GameObject.call(this, game, x, y, spriteName);

}

Pickable.prototype = Object.create(GameObject.prototype);
Pickable.prototype.constructor = Pickable;

Pickable.prototype.collideWithKirby = function() {
	var returnValue = false;
	if (this.game.physics.arcade.collide(this, this.kirby)){
		returnValue = true;
	}

	return returnValue;
}

module.exports = Pickable;





function Food(game, x, y, spriteName, healthBoost, kirby) { 
	Pickable.call(this, game, x, y, spriteName, kirby);
	this.healthValue = healthBoost;
	this.kirby = kirby;
}

Food.prototype = Object.create(Pickable.prototype);
Food.prototype.constructor = Food;

Food.prototype.update = function(){
	if (this.inCamera){
		if (this.collideWithKirby){

		}
	}
}

module.exports = Food;


function EndStar(game, x, y, spriteName, kirby) { 
	Pickable.call(this, game, x, y, kirby);
}

EndStar.prototype = Object.create(Pickable.prototype);
EndStar.prototype.constructor = EndStar;

module.exports = EndStar;