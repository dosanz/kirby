'use strict';

var Character = require('./character.js');
var Aura = require('./aura.js');

const DEAD_ANIM = 150;

function Enemy (game, x, y, ability, kirby, scene){

	this.initialX = x;
	this.initialY = y;

	this.scene = scene;
	this.kirby = kirby; // kirby
	this.currentPowerUp = ability; // the power up kirby will get when an enemy is eaten

	this.tag = 'enemy';

	// set different values depending on the enemy type ----------------
    if (ability === 'normal') { // waddle dee
		Character.call(this, game, x, y, 'waddleDee', true);
		// ADJUST THIS VALUES
		this.baseSpeed = 48;
		this.actDelay = 2000;
	}
	else if (ability === 'thunder') { // eye thing
		Character.call(this, game, x, y, 'waddleDoo', true);
		this.baseSpeed = 16;
		this.actDelay = 3000;
	}
	else if (ability === 'spark') {
		Character.call(this, game, x, y, 'sparky', true);
		this.baseSpeed = 16;
		this.actDelay = 5000;
	}
	else if (ability === 'stone') {
		Character.call(this, game, x, y, 'rocky', true);
		this.baseSpeed = 8;
		this.actDelay = 1000;
	}
	else {
		Character.call(this, game, x, y, 'waddleDee', true);
	}

	this.originalScale = this.scale.x;

	this.actTimer = 0;

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
	this.isHurt = false;
	this.reseted = false;

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
	else if (this.currentPowerUp === 'stone') {
		this.idle = this.animations.add('idle', [0, 1, 2], 2, true);
		this.walk = this.animations.add('walk', [0, 1, 1], 5, true);
		this.hurt = this.animations.add('hurt', [0, 1, 2], 15, true);
	}
	else if (this.currentPowerUp === 'spark') {
		this.idle = this.animations.add('idle', [0, 1], 2, true);
		this.walk = this.animations.add('walk', [0, 1], 5, true);
		this.hurt = this.animations.add('hurt', [0, 1], 15, true);
	}
}


Enemy.prototype.update = function(){

	this.game.physics.arcade.collide(this, this.scene.floor);

	if (this.inCamera == true){

		if (this.facingRight){
			this.scale.x = this.originalScale;
			this.speed = this.baseSpeed;
		}
		else if (!this.facingRight){
			this.scale.x = -1 * this.originalScale;
			this.speed = -this.baseSpeed;
		}

		if (this.isHurt || this.staysIdle){
			this.stop();
			if(this.staysIdle && !this.attackAnim && !this.isHurt){
				this.animations.play('idle');
			}
		}

		else if (this.body.onFloor() && !this.staysIdle && !this.beingAbsorbed && !this.isHurt){
			this.animations.play('walk');
			this.move(this.speed);
		}
		if (this.game.time.now > this.actTimer && !this.beingAbsorbed){
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
	this.beingEaten();
	this.collideWithKirby();
	}

	else if (this.initialX <= this.kirby.x - 160){
		this.reset();
	}
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
		this.hurtSound.play();
		this.animations.play('hurt');
		this.isHurt = true;
		this.stop();
		this.game.time.events.add(DEAD_ANIM, function(){this.destroy();}, this);
	}
	else {
		this.destroy();
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
		else if (this.currentPowerUp == 'spark'){
			this.spark();
		}
	}
}

Enemy.prototype.reset = function(){
	this.x = this.initialX;
	this.y = this.initialY;
	
	if (this.attacks != null){
		this.attacks.destroy();
		this.attacks = null;
	}

	this.isHurt = false;
	this.beingAbsorbed = false;
	this.staysIdle = false;
	this.acts = false;
	this.attackAnim = false;

	if (this.x > this.kirby.x){
		this.facingRight = false;
		this.speed = -this.baseSpeed;
	}
	else if (this.x < this.kirby.x){
		this.facingRight = true;
		this.speed = this.baseSpeed;
	}
}

Enemy.prototype.normal = function() {
	this.body.velocity.y = -100;
}

Enemy.prototype.thunder = function() {
	if (this.attacks != null){
		this.attacks.destroy(this);
	}
	this.attackAnim = true;
	this.animations.play('attack');
	this.attacks = new Aura(this.game, this.x, this.y, 1, false, this);
}

Enemy.prototype.spark = function(){
	if (this.attacks != null){
		this.attacks.destroy(this);
	}
	this.attackAnim = true;
	this.animations.play('attack');
	this.attacks = new Aura(this.game, this.x, this.y, 1, false, this);
}

module.exports = Enemy;