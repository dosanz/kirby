'use strict';

var GameObject = require('./gameObject.js');
var MovingObject = require('./movingObject.js');
var Character = require('./character.js');
var Kirby = require('./Kirby.js');

const FIRST_ENEMY = 2;

function Enemy (game, x, y, ability, kirby){
	// set different values depending on the enemy type ----------------
    if (ability === 'normal') { // waddle dee
		Character.call(this, game, x, y, 'waddleDee');
		// ADJUST THIS VALUES
		this.speed = 48; // speed is diferent depending on the enemy type
		this.actDelay = 2000; // it might depend on the enemy type (and it should be around 2-3 seconds)
		this.enemyAct = Enemy.prototype.normal.call(this);
		// this.edible = true (in case we add enemies like Gordo)
	}
	else if (ability === 'thunder') { // eye thing
		Character.call(this, game, x, y, 'waddleDoo');
	}
	else {
		Character.call(this, game, x, y, 'waddleDee');
	}

	this.originalScale = this.scale.x;

	Enemy.prototype.setAnimations.call(this);
	this.animations.play('idle');

	this.kirby = kirby; // kirby

	this.powerUp = ability; // the power up kirby will get when an enemy is eaten

	this.actTimer = 0; //

	if (this.x > this.kirby.x){
		this.facingRight = false;
	}
	else if (this.x < this.kirby.x){
		this.facingRight = true;
	}

	// control bools --------------------------------
	this.beingAbsorbed = false;
	this.staysIdle = false;
	this.acts = false;
	this.tag = 'enemy';

	console.log(this.powerUp);
}

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;


Enemy.prototype.setAnimations = function() {
	if (this.powerUp === MovingObject.NORMAL) { // waddle dee
		this.idle = this.animations.add('idle', [0, 1, 2, 3], 2, true);
		this.walk = this.animations.add('walk', [4, 5, 6, 7], 5, true);
		this.hurt = this.animations.add('hurt', [8, 9, 10, 11], 20, true);
	}
	else if (this.powerUp === MovingObject.THUNDER) { // eye thing
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
	if (this.facingRight){
		this.scale.x = this.originalScale;
	}
	else if (!this.facingRight){
		this.scale.x = -1 * this.originalScale;
	}
	if (this.body.onFloor() && !this.staysIdle){
		this.animations.play('walk');
		MovingObject.prototype.move.call(this, this.speed);
	}
	if (this.game.time.now > this.actTimer){   // TODO: fix this so it repeats a cycle of acting, staying idle, acting...
		if (!this.acts) {
			this.staysIdle = false;
		}

		this.actTimer = this.game.time.now + this.actDelay;
		// calls the enemy act
		if (!this.staysIdle) { 
			this.enemyAct;
			this.staysIdle = true;
			this.acts = true;
		}
		else {
			MovingObject.prototype.stop.call(this);
			this.animations.play('idle');
			//this.staysIdle = false;
			this.acts = false;
		}
	}
	Enemy.prototype.beingEaten.call(this);
	Enemy.prototype.collideWithKirby.call(this);
	//Enemy.prototype.moveToKirby.call(this);
}


Enemy.prototype.beingEaten = function(){
	if (this.kirby.currentPowerUp == 'normal' && this.kirby.acting && this.kirby.empty){
		if (!this.kirby.facingRight && ((this.x < this.kirby.x) && (this.x >= this.kirby.x - this.kirby.swallowRange))){
			this.beingAbsorbed = true;
			Enemy.prototype.moveToKirby.call(this);
		}
		else if (this.kirby.facingRight && ((this.x > this.kirby.x) && (this.x <= this.kirby.x + this.kirby.swallowRange))){
			this.beingAbsorbed = true;
			Enemy.prototype.moveToKirby.call(this);
		}
	}
	else{
		this.beingAbsorbed = false;
		MovingObject.prototype.stop.call(this);
	}
}

Enemy.prototype.moveToKirby = function(){
	var angle = (this.game.physics.arcade.angleBetween(this, this.kirby) * (180/Math.PI));
	this.game.physics.arcade.velocityFromAngle(angle, 100, this.body.velocity);
}

Enemy.prototype.collideWithKirby = function(){
	if (this.game.physics.arcade.collide(this, this.kirby)){
		if (this.beingAbsorbed == true){
			this.kirby.eat(this.powerUp, this.kirby);
			Enemy.prototype.die.call(this);
		}
		else if (this.kirby.invincible == true){
			Enemy.prototype.die.call(this);
		}
		else if (this.kirby.invincible == false){
			this.kirby.getHurt(1, this.kirby);
		}
	}
}

Enemy.prototype.die = function(){
	this.animations.play('hurt');
	// add a timer or something so the enemy dies when the animation is finished
	this.kill();
}

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