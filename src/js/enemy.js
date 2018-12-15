'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');

function Enemy (game, x, y, ability){
    if (ability === Character.NORMAL) { // waddle dee
		Character.call(this, game, x, y, 'waddleDee');
	}
	else if (ability === Character.THUNDER) { // eye thing
		Character.call(this, game, x, y, 'waddleDoo');
	}
	else {
		Character.call(this, game, x, y, 'waddleDee');
	}

	Enemy.prototype.setAnimations.call(this);
	this.animations.play('idle');

    this.powerUp = ability;
}

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;


Enemy.prototype.setAnimations = function() {
	if (this.powerUp === Character.NORMAL) { // waddle dee
		this.idle = this.animations.add('idle', [0, 1, 2, 3], 2, true);
		this.walk = this.animations.add('walk', [4, 5, 6, 7], 5, true);
	}
	else if (this.powerUp === Character.THUNDER) { // eye thing
		this.idle = this.animations.add('idle', [0, 1, 2, 3], 2, true);
		this.walk = this.animations.add('walk', [4, 5, 6, 7], 5, true);
		this.attack = this.animations.add('attack', [8, 9, 10, 11], 1, false);
	}
	/* TODO: fill when we have their sprite sheets
	else if (this.powerUp === Character.FIRE) {
		
	}
	else if (this.powerUp === Character.STONE) {
	
	}

	*/
}


Enemy.prototype.update = function(){
    // calls move with a speed depending on the direction the enemy is facing until the enemy is out of the camera (when enemies appear they are always facing kirby)
}

Enemy.prototype.beingEaten = function(){
    // if the enemy is in kirbys swallow range (depends on the direction kirby is facing)
    //  moveToXY(displayObject, x, y, speed, maxTime)
    // if the enemy collides with kirby, kirby gets full (slower and unable to fly)
    // the enemy is killed but the powerUp is stored. Kirby contains a generic object that can be spitted (causes damage or disappears after a few seconds) 
    //                                                                                             or swallowed (kirby gets a power up)
}

module.exports = Enemy;