'use strict';

var GameObject = require('./gameObject.js');
var MovingObject = require('./movingObject.js');
var Character = require('./character.js');
var Attack = require('./attack.js');
var Bullet = require('./bullet.js');
var Aura = require('./aura.js');
var LostPowerUp = require('./lostPowerUp');

const AIR_SPEED = 180;
const GROUND_SPEED = 120;

const AIR_GRAVITY = 180;
const GROUND_GRAVITY = 400;
const INVINCIBLE_TIME = 1500;
const ACT_TIMER = 1000;

const FLIP_FACTOR = -1;

function Kirby (game, x, y) {
	Character.call(this, game, x, y, 'kirby');
	this.attack = null;
	this.lostPowerUp = null;
	this.lostPowerUpCount = 0;
	this.movementSpeed = GROUND_SPEED;
	this.jumpHeight = 120;
	this.swallowRange = 100;
	this.originalScale = this.scale.x;
	this.actTimer = 0;

	this.currentPowerUp = 'thunder';
	this.storedPowerUp = MovingObject.NORMAL;
	this.health = 5;
	this.lastHurt = 0;

	// control bools --------------------
	this.empty = true;
	this.grounded = true;
	this.flying = false;
	this.canFly = false;
	this.isMoving = false;
	this.acting = false;
	this.canMove = true;

	this.facingRight = true;
	this.invincible = false;
	this.full = false;

	// input keys ------------------------
	this.keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
	this.keyA = game.input.keyboard.addKey(Phaser.Keyboard.A);
	this.keyD = game.input.keyboard.addKey(Phaser.Keyboard.D);
	this.keyS = game.input.keyboard.addKey(Phaser.Keyboard.S);
	this.keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	// animation set up --------------------
	this.idle = this.animations.add('idle', [0, 1, 2, 3], 2, true);
	this.walk = this.animations.add('walk', [4, 5, 6, 7], 5, true);
	this.jump = this.animations.add('jump', [8, 9, 10, 11], 1, false);
	this.inhaleStart = this.animations.add('inhaleStart', [12, 13], 4, false);
	this.inhale = this.animations.add('inhale', [14, 15], 4, true);
}


Kirby.prototype = Object.create(Character.prototype);
Kirby.prototype.constructor = Kirby;



Kirby.prototype.update = function () {
	console.log(this.game.time.now);
	MovingObject.prototype.stop.call(this);
	Kirby.prototype.manageInput.call(this);
	Kirby.prototype.manageAnimations.call(this);

	if (this.attack != null){
		MovingObject.prototype.move.call(this.attack, this.attack.speed);
    	Attack.prototype.damage.call(this.attack);
	}
	
	if (this.body.onFloor()) {
		this.grounded = true;
	}
	else {
		this.grounded = false;
	}	
}

Kirby.prototype.manageInput = function () {
	if (this.grounded) {
		this.isMoving = false;
		this.acting = false;
		this.canFly = false;
		this.movementSpeed = GROUND_SPEED;
		this.body.gravity.y = GROUND_GRAVITY;
	}
	else {
		this.isMoving = true;
		this.movementSpeed = AIR_SPEED;
	}

	// key catching -------------------
	if (this.keyA.isDown && this.canMove) {
		this.scale.x = -1 * this.originalScale;
		MovingObject.prototype.move.call(this, -this.movementSpeed);
		this.isMoving = true;
		this.facingRight = false;
	} 
	if (this.keyD.isDown && this.canMove) {
		this.scale.x = this.originalScale;
		MovingObject.prototype.move.call(this, this.movementSpeed);
		this.isMoving = true;
		this.facingRight = true;
	}
	if (this.keyW.isDown && this.canMove) {
		if (this.canFly) {
			this.flying = true;
			this.body.gravity.y = AIR_GRAVITY;
			Kirby.prototype.jump.call(this);
		}
		else if (this.grounded) {
			Kirby.prototype.jump.call(this);
		}
	}
	if (this.keyS.isDown && this.canMove) {
		if (this.flying) {
			this.flying = false; 
			this.body.gravity.y = GROUND_GRAVITY;
		}
		if (!this.empty){
			Kirby.prototype.swallow.call(this);
		}

		if (this.keySpace.isDown && this.lostPowerUpCount == 0){
			Kirby.prototype.releasePowerUp.call(this);
		}
		// add else if grounded: smooshed down sprite
	}
	if (this.keySpace.isDown) {
		if (this.currentPowerUp == 'normal')
		{
			MovingObject.prototype.stop.call(this);
			this.acting = true;
			Kirby.prototype.act.call(this);
		}

		else {
			if (this.game.time.now > this.actTimer) {
				this.actTimer = this.game.time.now + ACT_TIMER;
				this.acting = true;
				Kirby.prototype.act.call(this);
			}
		}
	}

	if (this.keyW.isUp && !this.grounded && this.empty) {
		this.canFly = true;
	}

	if (this.keySpace.isUp){
		this.keySpace.enable = true;
	}
}

Kirby.prototype.pause = function(){
	this.game.physics.arcade.isPaused = (this.game.physics.arcade.isPaused) ? false : true;
}

Kirby.prototype.manageAnimations = function() {
	if (this.acting && this.empty) {
		this.animations.play('inhale');
	}
	else if (!this.isMoving) {
		this.animations.play('idle');
	}
	else {
		if (this.grounded) {
			this.animations.play('walk');
		}
	}
}

Kirby.prototype.eat = function(powerUp){
	this.storedPowerUp = powerUp;
	this.invincible = false;
	this.empty = false;
	this.acting = false;
	this.keySpace.enable = false;

}

Kirby.prototype.jump = function () {
	this.body.velocity.y = -this.jumpHeight;
}

Kirby.prototype.swallow = function(){
	this.currentPowerUp = this.storedPowerUp;
	this.empty = true;
}

Kirby.prototype.getHurt = function (damage){
	if (this.game.time.now > this.lastHurt){
		this.lastHurt = this.game.time.now + INVINCIBLE_TIME;
		this.health -= damage;

		Kirby.prototype.releasePowerUp.call(this);
	}
}

Kirby.prototype.releasePowerUp = function(){
	if (this.currentPowerUp != 'normal'){
		if (this.lostPowerUp != null){
			this.lostPowerUp.destroy();
		}
		this.lostPowerUp = new LostPowerUp(this.game, this.x, this.y, 'starAttack', this.currentPowerUp, this);
		this.currentPowerUp = 'normal';
		this.lostPowerUpCount = 1;
	}
}

// TODO: fill
Kirby.prototype.act = function () {

	switch(this.currentPowerUp){
		case 'normal':
			if (!this.empty && this.keySpace.enable){
				this.empty = true;
				this.invincible = false;
				if (this.attack != null){
					this.attack.destroy(this);
				}
				this.attack = new Bullet(this.game, this.x, this.y, 'starAttack', this.facingRight, 5, true);
			}
			break;

		case 'stone':
			if (!this.invincible){
				this.invincible = true;
				this.canMove = false;
				this.keySpace.enable = false;
				this.body.velocity.x = 0;
				this.body.velocity.y = 300;
			}
			else if (this.invincible){
				this.invincible = false;
				this.canMove = true;
		}
		break;

		case 'thunder':
			if (this.attack != null){
				this.attack.destroy(this);
			}
			this.attack = new Aura(this.game, this.x, this.y, 'starAttack', this.facingRight, 5, true, this);
			this.canMove = false;
		break;

		default:
			break;
	}	
}



module.exports = Kirby;

// class Kirby extends Character {
// 	constructor(game, x, y) {
// 		super(game, x, y, 'Kirby');
// 		this.movementSpeed = 8;
// 		this.empty = true;
// 		this.currentPowerUp = 0;
// 		this.keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
// 	}

// 	update() {

// 	}
// }