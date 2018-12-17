(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');

const AIR_SPEED = 180;
const GROUND_SPEED = 120;

const AIR_GRAVITY = 180;
const GROUND_GRAVITY = 400;

const FLIP_FACTOR = -1;

function Kirby (game, x, y) {
	Character.call(this, game, x, y, 'kirby');
	this.movementSpeed = GROUND_SPEED;
	this.jumpHeight = 120;
	this.swallowRange = 100;
	this.originalScale = this.scale.x;

	this.currentPowerUp = Character.NORMAL;
	this.storedPowerUp = Character.NORMAL;

	// control bools --------------------
	this.empty = true;
	this.grounded = true;
	this.flying = false;
	this.canFly = false;
	this.isMoving = false;
	this.acting = false;

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
	// Character.prototype.update.call(this, ...)
	Character.prototype.stop.call(this);
	Kirby.prototype.manageInput.call(this);
	Kirby.prototype.manageAnimations.call(this);
	
	console.log(this.keySpace.enable);

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
	if (this.keyA.isDown) {
		this.scale.x = -1 * this.originalScale;
		Character.prototype.move.call(this, -this.movementSpeed);
		this.isMoving = true;
		this.facingRight = false;
	} 
	if (this.keyD.isDown) {
		this.scale.x = this.originalScale;
		Character.prototype.move.call(this, this.movementSpeed);
		this.isMoving = true;
		this.facingRight = true;
	}
	if (this.keyW.isDown) {
		if (this.canFly) {
			this.flying = true;
			this.body.gravity.y = AIR_GRAVITY;
			Kirby.prototype.jump.call(this);
		}
		else if (this.grounded) {
			Kirby.prototype.jump.call(this);
		}
	}
	if (this.keyS.isDown) {
		if (this.flying) {
			this.flying = false; 
			this.body.gravity.y = GROUND_GRAVITY;
		}
		if (!this.empty){
			Kirby.prototype.swallow.call(this);
		}
		// add else if grounded: smooshed down sprite
	}
	if (this.keySpace.isDown) {
		Character.prototype.stop.call(this);
		this.acting = true;
		Kirby.prototype.act.call(this);
	}

	if (this.keyW.isUp && !this.grounded && this.empty) {
		this.canFly = true;
	}

	if (this.keySpace.isUp){
		this.keySpace.enable = true;
	}
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


Kirby.prototype.jump = function () {
	this.body.velocity.y = -this.jumpHeight;
}

Kirby.prototype.swallow = function(){
	this.currentPowerUp = this.storedPowerUp;
	this.empty = true;
}


// TODO: fill
Kirby.prototype.act = function () {

	switch(this.currentPowerUp){
		case Character.NORMAL:
			if (this.empty){
				this.invincible = true;
			}
			else if (!this.empty && this.keySpace.enable){
				this.empty = true;
				// shoot a star
			}
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
},{"./character.js":2,"./gameObject.js":4}],2:[function(require,module,exports){
'use strict';

var GameObject = require('./gameObject.js');

const NORMAL = 'normal';
const FIRE = 'fire';
const THUNDER = 'thunder';
const STONE = 'stone';

function Character(game, x, y, spriteName) {
	GameObject.call(this, game, x, y, spriteName);
	//this.body.collideWorldBounds = true;

	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.collideWorldBounds = true;
	this.body.allowGravity = true;
	this.body.gravity.y = 400;
}

Character.prototype = Object.create(GameObject.prototype);
Character.prototype.constructor = Character;



Character.prototype.move = function (movementSpeed) { 
	this.body.velocity.x = movementSpeed;
}


Character.prototype.stop = function () {
	this.body.velocity.x = 0;
}


Character.prototype.update = function () {

}


module.exports = Character;
},{"./gameObject.js":4}],3:[function(require,module,exports){
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
	Enemy.prototype.moveToKirby.call(this);
}


Enemy.prototype.beingEaten = function(){
	if (this.kirby.currentPowerUp == Character.NORMAL && this.kirby.acting && this.kirby.empty){
		if (!this.kirby.facingRight && ((this.x < this.kirby.x) && (this.x >= this.kirby.x - this.kirby.swallowRange))){
			this.beingAbsorbed = true;
		}
		else if (this.kirby.facingRight && ((this.x > this.kirby.x) && (this.x <= this.kirby.x + this.kirby.swallowRange))){
			this.beingAbsorbed = true;
		}
	}
	else{
		this.beingAbsorbed = false;
	}
}

Enemy.prototype.moveToKirby = function(){
	if (this.beingAbsorbed == true){
		var angle = (this.game.physics.arcade.angleBetween(this, this.kirby) * (180/Math.PI));
		this.game.physics.arcade.velocityFromAngle(angle, 100, this.body.velocity);

		if (this.game.physics.arcade.overlap(this, this.kirby)){
			this.kirby.storedPowerUp = this.powerUp;
			this.kirby.empty = false;
			this.kirby.acting = false;
			this.kirby.keySpace.enable = false;
			this.kill();
		}
	}
	else{
		Character.prototype.stop.call(this);
	}
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
},{"./character.js":2,"./gameObject.js":4}],4:[function(require,module,exports){
'use strict';

function GameObject(game, x, y, spriteName) {
	Phaser.Sprite.call(this, game, x, y, spriteName);
	this.anchor.setTo(0.5, 0.5);
	// this.x = x;
	// this.y = y;

	//this.game.physics.enable(this, Phaser.Physics.ARCADE);
}

GameObject.prototype = Object.create(Phaser.Sprite.prototype);
GameObject.prototype.constructor = GameObject;


module.exports = GameObject;
},{}],5:[function(require,module,exports){
'use strict';

var PlayScene = require('./play_scene.js');


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    this.game.load.image('logo', 'images/phaser.png');
    this.game.load.image('cloudyBackground', 'images/cloudyBg.png');
    this.game.load.spritesheet('kirby', 'images/kirby-small.png', 16, 16);
    this.game.load.spritesheet('waddleDee', 'images/waddle-dee.png', 16, 16);
    this.game.load.spritesheet('waddleDoo', 'images/eye-thing.png', 16, 16);
  },

  create: function () {
    //this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.state.start('play');
  }
};


window.onload = function () {
  var antialias = false;
  var transparent = false;

  var game = new Phaser.Game(256, 240, Phaser.AUTO, 'game', transparent, antialias);
  
  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};

},{"./play_scene.js":6}],6:[function(require,module,exports){
'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');
var Kirby = require('./Kirby.js');
var Enemy = require('./enemy.js');

  var PlayScene = {
  create: function () {
    // var logo = this.game.add.sprite(
    //   this.game.world.centerX, this.game.world.centerY, 'logo');
    // logo.anchor.setTo(0.5, 0.5);

    this.bg = this.game.add.sprite(0, 0, 'cloudyBackground');

    // meter a kirby en el mundo
    this.player = new Kirby(this.game, 10, 10);
    this.game.world.addChild(this.player);

    this.waddleDee = new Enemy(this.game, 40, 40, Character.NORMAL, this.player);
    this.game.world.addChild(this.waddleDee);
    this.waddleDee1 = new Enemy(this.game, 200, 40, Character.NORMAL, this.player);
    this.game.world.addChild(this.waddleDee1);
    this.waddleDee2 = new Enemy(this.game, 60, 40, Character.NORMAL, this.player);
    this.game.world.addChild(this.waddleDee2);
    this.waddleDee3 = new Enemy(this.game, 80, 40, Character.NORMAL, this.player);
    this.game.world.addChild(this.waddleDee3);
  }
};

module.exports = PlayScene;
},{"./Kirby.js":1,"./character.js":2,"./enemy.js":3,"./gameObject.js":4}]},{},[5]);
