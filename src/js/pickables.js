'use strict'

var GameObject = require('./gameObject.js');

function Pickable(game, x, y, spriteName) {
	GameObject.call(this, game, x, y, spriteName);

}

Pickable.prototype = Object.create(GameObject.prototype);
Pickable.prototype.constructor = Pickable;

Pickable.prototype.action = function() {
	// ... lo que haga
}





function Coin(game, x, y, spriteName) { // cambiar spriteName por 'coin'
	Pickable.call(this, game, x, y, spriteName);
}

Coin.prototype = Object.create(Pickable.prototype);
Coin.prototype.constructor = Coin;





function Food(game, x, y, spriteName, healthBoost) { 
	Pickable.call(this, game, x, y, spriteName);
	this.healthValue = healthBoost;
}

Food.prototype = Object.create(Pickable.prototype);
Food.prototype.constructor = Food;