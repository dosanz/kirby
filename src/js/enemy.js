'use strict';

var GameObject = require('./gameObject.js');
var MovingObject = require('./movingObject.js');
var Character = require('./character.js');
var Kirby = require('./Kirby.js');
var Aura = require('./aura.js');
var Bullet = require('./bullet.js');


const FIRST_ENEMY = 2;
const DEAD_ANIM = 150;
const ACT = 2000;

function Enemy (game, x, y, ability, kirby){
	// set different values depending on the enemy type ----------------
    if (ability === 'normal') { // waddle dee
		Character.call(this, game, x, y, 'waddleDee', true);
		// ADJUST THIS VALUES
		this.baseSpeed = 48; // speed is diferent depending on the enemy type
		this.actDelay = 2000; // it might depend on the enemy type (and it should be around 2-3 seconds)
		this.enemyAct = Enemy.prototype.normal.call(this);
		// this.edible = true (in case we add enemies like Gordo)
	}
	else if (ability === 'thunder') { // eye thing
		Character.call(this, game, x, y, 'waddleDoo', true);
		this.baseSpeed = 16;
		this.actDelay = 3000;
	}
	else {
		Character.call(this, game, x, y, 'waddleDee', true);
	}

	this.originalScale = this.scale.x;

	this.kirby = kirby; // kirby

	this.currentPowerUp = ability; // the power up kirby will get when an enemy is eaten

	this.actTimer = 0; //

	this.attacks = null;

	if (this.x > this.kirby.x){
		this.facingRight = false;
		this.speed = -this.baseSpeed;
	}
	else if (this.x < this.kirby.x){
		this.facingRight = true;
		this.speed = this.baseSpeed;
	}

	// control bools --------------------------------
	this.beingAbsorbed = false;
	this.staysIdle = false;
	this.acts = false;
	this.attackAnim = false;
	//this.isHurt = false;
	this.tag = 'enemy';
	this.isHurt = false;

	//this.actLoop = this.game.time.events.loop(ACT, function(){this.act();}, this);

	this.setAnimations();
}

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;


Enemy.prototype.setAnimations = function() {
	if (this.currentPowerUp === 'normal') { // waddle dee
		this.idle = this.animations.add('idle', [0, 1, 2, 3], 2, true);
		this.walk = this.animations.add('walk', [4, 5, 6, 7], 5, true);
		this.hurt = this.animations.add('hurt', [8, 9, 10, 11], 15, true);
	}
	else if (this.currentPowerUp === 'thunder') { // eye thing
		this.idle = this.animations.add('idle', [0, 1, 2, 3], 2, true);
		this.walk = this.animations.add('walk', [4, 5, 6, 7], 5, true);
		this.attack = this.animations.add('attack', [8, 9, 10, 11], 1, false);
		this.hurt = this.animations.add('hurt', [12, 13, 14, 15], 15, true);
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

	if (this.isHurt || this.staysIdle){
		this.stop();
		if(this.staysIdle && !this.attackAnim){
			this.animations.play('idle');
		}
	}

	else if (this.body.onFloor() && !this.staysIdle && !this.beingAbsorbed){
		this.animations.play('walk');
		this.move(this.speed);
	}
	if (this.game.time.now > this.actTimer && !this.beingAbsorbed){   // TODO: fix this so it repeats a cycle of acting, staying idle, acting...
		if (!this.acts) {
			this.staysIdle = false;
		}

		this.actTimer = this.game.time.now + this.actDelay;
		// calls the enemy act
		if (!this.staysIdle) { 
			this.act();
			this.staysIdle = true;
			this.acts = true;
		}
		else {
			this.stop();
			this.staysIdle = false;
			this.acts = false;
		}
	}

	// TODO -------------------------- add if enemy collides with walls this.speed = -this.speed
	
	this.beingEaten();
	this.collideWithKirby();
}

Enemy.prototype.collideWithKirby = function(){
	if (this.game.physics.arcade.collide(this, this.kirby)){
		if (this.beingAbsorbed == true){
			this.kirby.eat(this.currentPowerUp, this.kirby);
			this.die();
		}
		else if (this.kirby.invincible == true){
			this.die();
		}
		else if (this.kirby.invincible == false){
			this.kirby.getHurt(1, this.kirby);
		}
	}
}

Enemy.prototype.die = function(){
	if (!this.beingAbsorbed){
		this.animations.play('hurt');
		this.isHurt = true;
		this.game.time.events.add(DEAD_ANIM, function(){this.kill();}, this);
		//this.game.time.events.remove(this.actLoop);
	}
	else {
		//this.game.time.events.remove(this.actLoop);
		this.kill();
	}
}

Enemy.prototype.act = function(){
	if (!this.beingAbsorbed){
		if (this.currentPowerUp == 'normal'){
			this.normal();
		}
		else if (this.currentPowerUp == 'thunder'){
			this.thunder();
		}
	}
}

Enemy.prototype.normal = function() {
	this.body.velocity.y = -100;
}


Enemy.prototype.fire = function() {
}

Enemy.prototype.thunder = function() {
	if (this.attacks != null){
		this.attacks.destroy(this);
	}
	this.attackAnim = true;
	this.animations.play('attack');
	this.attacks = new Aura(this.game, this.x, this.y, 5, false, this);
}

module.exports = Enemy;