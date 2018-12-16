'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');

function Enemy (game, x, y, ability, kirby){
	// set different values depending on the enemy type ----------------
    if (ability === Character.NORMAL) { // waddle dee
		Character.call(this, game, x, y, 'waddleDee');
		// ADJUST THIS VALUES
		this.speed = 48; // speed is diferent depending on the enemy type
		this.actDelay = 2000; // it might depend on the enemy type (and it should be around 2-3 seconds)
		this.enemyAct = Enemy.prototype.normal.call(this);
		// this.edible = true (in case we add enemies like Gordo)
	}
	else if (ability === Character.THUNDER) { // eye thing
		Character.call(this, game, x, y, 'waddleDoo');
	}
	else {
		Character.call(this, game, x, y, 'waddleDee');
	}

	Enemy.prototype.setAnimations.call(this);
	this.animations.play('idle');

	this.kirby = kirby; // kirby

	this.powerUp = ability; // the power up kirby will get when an enemy is eaten

	this.actTimer = 0; //

	// control bools --------------------------------
	this.beingAbsorbed = false;
	this.staysIdle = false;
	this.acts = false;

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
	if (this.body.onFloor() && !this.staysIdle){
		this.animations.play('walk');
		Character.prototype.move.call(this, this.speed);
	}
	if (this.game.time.now > this.actTimer){   // TODO: fix this so it repeats a cycle of acting, staying idle, acting...
		if (!this.acts) {
			this.staysIdle = false;
		}

		console.log(this.actTimer);
		this.actTimer = this.game.time.now + this.actDelay;
		// calls the enemy act
		if (!this.staysIdle) { 
			this.enemyAct;
			this.staysIdle = true;
			this.acts = true;
		}
		else {
			Character.prototype.stop.call(this);
			this.animations.play('idle');
			//this.staysIdle = false;
			this.acts = false;
		}
	}
	Enemy.prototype.beingEaten.call(this);
}


Enemy.prototype.beingEaten = function(){
	if (this.kirby.currentPowerUp == Character.NORMAL && this.kirby.acting){
		if (!this.kirby.facingRight && ((this.x < this.kirby.x) && (this.x >= this.kirby.x - this.kirby.swallowRange))){
			console.log("eaten from the right");
			this.beingAbsorbed = true;
		}
		else if (this.kirby.facingRight && ((this.x > this.kirby.x) && (this.x <= this.kirby.x + this.kirby.swallowRange))){
			console.log("eaten from the left");
			this.beingAbsorbed = true;
		}
	}
	else{
		this.beingAbsorbed = false;
	}
}

//Enemy.prototype.moveToKirby() = function(){
//	if (this.beingEaten == true){
//	the enemy moves to kirby (check phaser examples) and if it collides with kirby they're set to full, !acting
//	then the enemy dies but it's powerUp is stored somewhere (maybe create in kirby a this.storedPowerUp value?) and a generic object is created
//	if a full kirby acts they shoot a star, if s key is pressed the storedPowerUp becomes the currentPowerUp (changes in kirby module)
//
//	}
//}

// Enemy.prototype.act() = function(){
//	switch (this.powerUp){
//		case normal:
//		...
//	}
// }

Enemy.prototype.normal = function() {
	this.body.velocity.y = -1000;
	console.log('pk');
}


Enemy.prototype.fire = function() {
	console.log('fire!!');
}

module.exports = Enemy;