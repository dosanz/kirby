(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
	MovingObject.call(this, game, x, y, 'kirby');
	this.anchor.setTo(0.5, 1);

	this.body.allowGravity = true;
	this.body.gravity.y = 400;

	this.attack = null;
	this.lostPowerUp = null;
	this.lostPowerUpCount = 0;
	this.movementSpeed = GROUND_SPEED;
	this.jumpHeight = 120;
	this.swallowRange = 100;
	this.originalScale = this.scale.x;
	this.actTimer = 0;

	this.currentPowerUp = 'spark';
	this.storedPowerUp = 'normal';
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
	// KEY: XY -- X = Big|Small   Y = Normal|Thunder|...     
	this.SNidle = this.animations.add('SNidle', Phaser.Animation.generateFrameNames('SNidle', 1, 4), 2, true);
	this.SNwalk = this.animations.add('SNwalk', Phaser.Animation.generateFrameNames('SNwalk', 1, 4), 5, true);
	this.SNjump = this.animations.add('SNjump', Phaser.Animation.generateFrameNames('SNjump', 1, 4), 1, false);
	this.SNinhaleStart = this.animations.add('SNinhaleStart', Phaser.Animation.generateFrameNames('SNinhaleStart', 1, 2), 4, false);
	this.SNinhale = this.animations.add('SNinhale', Phaser.Animation.generateFrameNames('SNinhale', 1, 2), 4, true);
	this.Bidle = this.animations.add('Bidle', Phaser.Animation.generateFrameNames('Bidle', 1, 4), 2, true);
	this.Bwalk = this.animations.add('Bwalk', Phaser.Animation.generateFrameNames('Bwalk', 1, 4), 5, true);
	this.BNfly = this.animations.add('BNfly', Phaser.Animation.generateFrameNames('BNfly', 1, 2), 3, true);
}


Kirby.prototype = Object.create(MovingObject.prototype);
Kirby.prototype.constructor = Kirby;



Kirby.prototype.update = function () {
	this.stop();
	this.manageInput();
	this.manageAnimations();

	//if (this.attack != null){
	//	MovingObject.prototype.move.call(this.attack, this.attack.speed);
    //	Attack.prototype.damage.call(this.attack);
	//}
	
	if (this.body.onFloor()) {
		this.grounded = true;
		if (this.flying) {
			this.body.y += 9;
		}
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
		this.flying = false;
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
		this.move(-this.movementSpeed);
		this.isMoving = true;
		this.facingRight = false;
	} 
	if (this.keyD.isDown && this.canMove) {
		this.scale.x = this.originalScale;
		this.move(this.movementSpeed);
		this.isMoving = true;
		this.facingRight = true;
	}
	if (this.keyW.isDown && this.canMove) {
		if (this.canFly) {
			this.flying = true;
			this.body.gravity.y = AIR_GRAVITY;
			this.jump();
		}
		else if (this.grounded) {
			this.jump();
		}
	}
	if (this.keyS.isDown && this.canMove) {
		if (this.flying) {
			this.flying = false; 
			this.body.gravity.y = GROUND_GRAVITY;
		}
		if (!this.empty){
			this.swallow();
		}

		if (this.keySpace.isDown && this.lostPowerUpCount == 0){
			this.releasePowerUp();
		}
		// add else if grounded: smooshed down sprite
	}
	if (this.keySpace.isDown) {
		if (this.currentPowerUp == 'normal')
		{
			this.stop();
			this.acting = true;
			this.act();
		}

		else {
			if (this.game.time.now > this.actTimer) {
				this.actTimer = this.game.time.now + ACT_TIMER;
				this.acting = true;
				this.act();
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


// Kirby.prototype.getFat = function() {
// 	this.loadTexture('fatKirby');
// 	this.fatIdle = this.animations.add('fatIdle', [0, 1, 2, 3], 2, true);
// 	this.fatWalk = this.animations.add('fatWalk', [4, 5, 6, 7], 5, true);
// 	this.fly = this.animations.add('fly', [8, 9], 3, true);
// 	this.body.width = 24;    this.body.height = 24;
// }


// Kirby.prototype.getSmall = function() {
// 	this.loadTexture('kirby');
// 	this.idle = this.animations.add('idle', [0, 1, 2, 3], 2, true);
// 	this.walk = this.animations.add('walk', [4, 5, 6, 7], 5, true);
// 	this.jumpAnim = this.animations.add('jump', [8, 9, 10, 11], 1, false);
// 	this.inhaleStart = this.animations.add('inhaleStart', [12, 13], 4, false);
// 	this.inhale = this.animations.add('inhale', [14, 15], 4, true);
// 	this.animations.play('idle');
// 	this.body.width = 16;    this.body.height = 16;	 
// }


Kirby.prototype.manageAnimations = function() {
	if (!this.empty) {
		this.body.width = 24;    this.body.height = 24;

		if (this.isMoving && this.grounded){
			this.animations.play('Bwalk');
		}
		else if (!this.isMoving){
			this.animations.play('Bidle');
		}
	}
	else {
		this.body.width = 16;    this.body.height = 16;

		if (this.flying) {
			this.body.width = 24;    this.body.height = 24;
			this.animations.play('BNfly');
		}
		if (this.acting && this.empty && this.currentPowerUp == 'normal') {
			this.animations.play('SNinhale');
		}
		else if (!this.isMoving) {
			this.animations.play('SNidle');
		}
		else {
			if (this.grounded) {
				this.animations.play('SNwalk');
			}
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

		this.releasePowerUp();
	}
}

Kirby.prototype.releasePowerUp = function(){
	if (this.currentPowerUp != 'normal'){
		if (this.lostPowerUp != null){
			this.lostPowerUp.destroy();
		}
		this.lostPowerUp = new LostPowerUp(this.game, this.x, this.y, this);
		this.currentPowerUp = 'normal';
		this.lostPowerUpCount = 1;
	}
}

// TODO: fill
Kirby.prototype.act = function () {
	if (this.currentPowerUp == 'normal'){
		if (!this.empty && this.keySpace.enable){
			this.empty = true;
			this.invincible = false;
			if (this.attack != null){
				this.attack.destroy(this);
			}
			this.attack = new Bullet(this.game, this.x, this.y, 5, true, this);
		}
	}

	else if (this.currentPowerUp == 'stone'){
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
	}

	else if (this.currentPowerUp == 'spark' || this.currentPowerUp == 'thunder' || this.currentPowerUp == 'fire') {
		if (this.attack != null){
			this.attack.destroy(this);
		}
		this.attack = new Aura(this.game, this.x, this.y, 5, true, this);
		this.canMove = false;
	}

	else if (this.currentPowerUp == 'knife'){
		if (this.attack != null){
			this.attack.destroy(this);
		}
		this.attack = new Bullet(this.game, this.x, this.y, 5, true, this);
	}

	/*switch(this.currentPowerUp){
		case 'normal':
			if (!this.empty && this.keySpace.enable){
				this.empty = true;
				this.invincible = false;
				if (this.attack != null){
					this.attack.destroy(this);
				}
				this.attack = new Bullet(this.game, this.x, this.y, 5, true, this);
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
			this.attack = new Aura(this.game, this.x, this.y, 5, true, this);
			this.canMove = false;
		break;

		default:
			break;
	}	
	*/
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
},{"./attack.js":2,"./aura.js":3,"./bullet.js":4,"./character.js":5,"./gameObject.js":7,"./lostPowerUp":9,"./movingObject.js":12}],2:[function(require,module,exports){
// TODO: make better sprites
'use strict'
var Character = require('./character.js');
var Enemy = require('./enemy.js');
var Kirby = require('./Kirby.js');
var MovingObject = require ('./movingObject.js');

function Attack(game, x, y, spriteName, power, kirby) {
    MovingObject.call(this, game, x, y, spriteName)

    this.kirby = kirby;

    this.game.world.addChild(this);

}

Attack.prototype = Object.create(MovingObject.prototype);
Attack.prototype.constructor = Attack;

Attack.prototype.damage = function(){
    if (this.kirby){
        var enemy = null;
        var count = 2;
        while(enemy == null && count < this.game.world.children.length){
            
            if(this.game.physics.arcade.collide(this, this.game.world.children[count])){
                enemy = this.game.world.children[count];
                if (enemy.tag == 'enemy'){
                    this.checkCollisions(enemy, this);
                }
            }
            count++;
        }
        /* 
        if (!this.kirby){
            var player = this.game.world.children[1];
            this.game.physics.arcade.collide(this, player, this.collideWithKirby(kirby, this));
        }
            
        });*/
    }
    //else if (!this.kirby){
    //}
    // if attack collides with enemy ---- enemy dies and the bullet is killed
    // else if collides with the world or is out of the camera ---- the bullet is killed
    // else if after a few seconds the bullet isn't killed ---- the bullet is killed
}

module.exports = Attack;
},{"./Kirby.js":1,"./character.js":5,"./enemy.js":6,"./movingObject.js":12}],3:[function(require,module,exports){
'use strict'

var Attack = require ('./attack.js');

const LIFE_TIME = 500;

function Aura(game, x, y, power, kirbyBool, attacker){
    this.attacker = attacker;

    this.flip = 1;

    if (this.attacker.currentPowerUp != 'spark'){
        if (this.attacker.facingRight){
            x += 16;
        }
        else{
                x -= 16;
            this.flip = -1;
        }
    }

    if (this.attacker.currentPowerUp == 'thunder'){
        Attack.call(this, game, x, y, 'thunderAttack', power, kirbyBool);
        this.anim = this.animations.add('mainAnim', [0,1,2,3,4,5], 10, true);
    }
    else if (this.attacker.currentPowerUp == 'fire'){
        Attack.call(this, game, x, y, 'fireAttack', power, kirbyBool);
        this.anim = this.animations.add('mainAnim', [0,1,2,3,4,5], 10, true);
    }
    else if (this.attacker.currentPowerUp == 'spark'){
        Attack.call(this, game, x, y, 'sparkAttack', power, kirbyBool);
        this.anim = this.animations.add('mainAnim', [0,1,2], 10, true);
    }

    this.scale.x *= this.flip;
    this.body.disable;
    this.game.time.events.add(LIFE_TIME, function(){this.attacker.canMove = true; this.kill();}, this);
    this.animations.play('mainAnim');
}

Aura.prototype = Object.create(Attack.prototype);
Aura.prototype.constructor = Aura;

Aura.prototype.update = function(){
    this.y = this.attacker.y;
    this.damage();
}

Aura.prototype.checkCollisions = function(enemy){
    if(this.checkOverlap(enemy)){
        enemy.die();
    };
}

Aura.prototype.checkOverlap = function(enemy){
    var enemyBounds = enemy.getBounds();
    var auraBounds = this.getBounds();

    return Phaser.Rectangle.intersects(enemyBounds, auraBounds);
}

module.exports = Aura;
},{"./attack.js":2}],4:[function(require,module,exports){
'use strict'

var Attack = require ('./attack.js');


function Bullet(game, x, y, power, kirby, attacker){
    this.attacker = attacker;
    if (this.attacker.currentPowerUp == 'normal'){
        Attack.call(this, game, x, y, 'starAttack', power, kirby);
    }
    else if (this.attacker.currentPowerUp == 'knife'){
        Attack.call(this, game, x, y, 'knifeAttack', power, kirby);
    }
    if (this.attacker.facingRight){
        this.speed = 100;
    }
    else{
        this.speed = -100;
    }

    this.moving = this.animations.add('moving', [0,1,2], 20, true);
    this.crash = this.animations.add('crash', [3,4,5], 5, false);
    this.crash.onComplete.add(function(){this.kill();}, this)
    this.animations.play('moving');
}

Bullet.prototype = Object.create(Attack.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function(){
    this.move(this.speed);
    this.damage();
}

Bullet.prototype.checkCollisions = function(enemy){
    this.game.physics.arcade.collide(this, enemy, this.collideWithEnemy(enemy, this));
}

Bullet.prototype.collideWithEnemy = function(enemy){
    enemy.die();
    this.speed = 0;
    this.animations.play('crash');
}

module.exports = Bullet;
},{"./attack.js":2}],5:[function(require,module,exports){
'use strict';

var MovingObject = require('./movingObject.js');


function Character(game, x, y, spriteName, edible) {
	MovingObject.call(this, game, x, y, spriteName);
	
	this.body.allowGravity = true;
	this.body.gravity.y = 400;

	this.beingAbsorbed = false;
	this.edible = edible;
	//this.body.collideWorldBounds = true;
}

Character.prototype = Object.create(MovingObject.prototype);
Character.prototype.constructor = Character;

Character.prototype.beingEaten = function(){
	if (this.kirby.currentPowerUp == 'normal' && this.kirby.acting && this.kirby.empty){
		if (!this.kirby.facingRight && this.edible && ((this.x < this.kirby.x) && (this.x >= this.kirby.x - this.kirby.swallowRange))){
			this.beingAbsorbed = true;
			this.moveToKirby();
		}
		else if (this.kirby.facingRight && this.edible && ((this.x > this.kirby.x) && (this.x <= this.kirby.x + this.kirby.swallowRange))){
			this.beingAbsorbed = true;
			this.moveToKirby();
		}
	}
	else{
		this.beingAbsorbed = false;
	}
}

Character.prototype.moveToKirby = function(){
	var angle = (this.game.physics.arcade.angleBetween(this, this.kirby) * (180/Math.PI));
	this.game.physics.arcade.velocityFromAngle(angle, 100, this.body.velocity);
}

module.exports = Character;
},{"./movingObject.js":12}],6:[function(require,module,exports){
'use strict';

var GameObject = require('./gameObject.js');
var MovingObject = require('./movingObject.js');
var Character = require('./character.js');
var Kirby = require('./Kirby.js');

const FIRST_ENEMY = 2;
const DEAD_ANIM = 150;

function Enemy (game, x, y, ability, kirby){
	// set different values depending on the enemy type ----------------
    if (ability === 'normal') { // waddle dee
		Character.call(this, game, x, y, 'waddleDee', true);
		// ADJUST THIS VALUES
		this.speed = 48; // speed is diferent depending on the enemy type
		this.actDelay = 2000; // it might depend on the enemy type (and it should be around 2-3 seconds)
		this.enemyAct = Enemy.prototype.normal.call(this);
		// this.edible = true (in case we add enemies like Gordo)
	}
	else if (ability === 'thunder') { // eye thing
		Character.call(this, game, x, y, 'waddleDoo', true);
	}
	else {
		Character.call(this, game, x, y, 'waddleDee', true);
	}

	this.originalScale = this.scale.x;

	this.kirby = kirby; // kirby

	this.currentPowerUp = ability; // the power up kirby will get when an enemy is eaten

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
	//this.isHurt = false;
	this.tag = 'enemy';

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
	if (!this.beingAbsorbed){
		this.stop();
	}
	if (this.facingRight){
		this.scale.x = this.originalScale;
	}
	else if (!this.facingRight){
		this.scale.x = -1 * this.originalScale;
	}
	if (this.body.onFloor() && !this.staysIdle && !this.beingAbsorbed){
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
			this.enemyAct;
			this.staysIdle = true;
			this.acts = true;
		}
		else {
			this.stop();
			this.animations.play('idle');
			//this.staysIdle = false;
			this.acts = false;
		}
	}
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
		this.game.time.events.add(DEAD_ANIM, function(){this.kill();}, this);
	}
	else {
		this.kill();
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
},{"./Kirby.js":1,"./character.js":5,"./gameObject.js":7,"./movingObject.js":12}],7:[function(require,module,exports){
'use strict';

function GameObject(game, x, y, spriteName) {
	Phaser.Sprite.call(this, game, x, y, spriteName);
	this.anchor.setTo(0.5, 0.5);
	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.collideWorldBounds = true;
	this.body.allowGravity = false;
	// this.x = x;
	// this.y = y;

	//this.game.physics.enable(this, Phaser.Physics.ARCADE);
}

GameObject.prototype = Object.create(Phaser.Sprite.prototype);
GameObject.prototype.constructor = GameObject;


module.exports = GameObject;
},{}],8:[function(require,module,exports){
// level "template"
'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');
var Kirby = require('./Kirby.js');
var Enemy = require('./enemy.js');

  var Level1 = {
  create: function () {
    this.bg = this.game.add.sprite(0, 0, 'cloudyBackground');
    console.log(this.game.world.children.length);
  }
};

module.exports = Level1;
},{"./Kirby.js":1,"./character.js":5,"./enemy.js":6,"./gameObject.js":7}],9:[function(require,module,exports){
'use strict';

var Character = require('./character.js');

const LIFE_TIME = 5000;

function LostPowerUp(game, x, y, kirby) {
    Character.call(this, game, x, y, 'starAttack', true);
    this.kirby = kirby;
    this.powerUp = this.kirby.currentPowerUp;
    this.beingAbsorbed = false;

    if (this.kirby.facingRight){
        this.speed = -30;
    }

    else{
        this.speed = 30;
    }

    this.moving = this.animations.add('moving', [0,1,2], 20, true);
    this.crash = this.animations.add('crash', [3,4,5], 5, false);
    this.crash.onComplete.add(function(){this.kirby.lostPowerUpCount = 0; this.kill();}, this);
    this.animations.play('moving');

    this.game.world.addChild(this);
    this.game.time.events.add(Phaser.Timer.SECOND + LIFE_TIME, function(){this.animations.play('crash');}, this);
}

LostPowerUp.prototype = Object.create(Character.prototype);
LostPowerUp.prototype.constructor = LostPowerUp;

LostPowerUp.prototype.update = function(){
    this.move(this.speed);

    if (this.body.onFloor()){
        this.body.velocity.y = -200;
    }

    this.beingEaten();
	this.collideWithKirby();
}


LostPowerUp.prototype.collideWithKirby = function(){
	if (this.game.physics.arcade.collide(this, this.kirby)){
		if (this.beingAbsorbed == true){
            this.kirby.eat(this.powerUp, this.kirby);
            this.kirby.lostPowerUpCount = 0;
            this.kill();
		}
	}
}

module.exports = LostPowerUp;
},{"./character.js":5}],10:[function(require,module,exports){
'use strict';

var PlayScene = require('./play_scene.js');
var MainMenu = require('./mainMenu.js');
var Level1 = require('./level1.js');


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
    this.game.load.image('playButton', 'images/playButton.png');
    this.game.load.image('instrButton', 'images/instructionsButton.png');
    //this.game.load.spritesheet('kirby', 'images/kirby-small.png', 16, 16, 20);
    this.game.load.atlas('kirby', 'images/kirby.png', 'images/kirby.json');
    this.game.load.spritesheet('fatKirby', 'images/kirby-big.png', 24, 24, 10);
    this.game.load.spritesheet('waddleDee', 'images/waddle-dee.png', 16, 16);
    this.game.load.spritesheet('waddleDoo', 'images/eye-thing.png', 16, 16);
    this.game.load.spritesheet('starAttack', 'images/star.png', 16, 16);
    this.game.load.spritesheet('sparkAttack', 'images/spark.png', 24, 24);
    this.game.load.spritesheet('fireAttack', 'images/fire.png', 16, 16);
    this.game.load.spritesheet('knifeAttack', 'images/knife.png', 16, 16);
    this.game.load.spritesheet('thunderAttack', 'images/thunder.png', 16, 16);
  },

  create: function () {
    //this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    this.game.state.start('mainMenu');
  }
};


window.onload = function () {
  var antialias = false;
  var transparent = false;

  var game = new Phaser.Game(256, 240, Phaser.AUTO, 'game', transparent, antialias);
  
  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);
  game.state.add('level1', Level1);
  game.state.add('mainMenu', MainMenu);

  game.state.start('boot');
};

},{"./level1.js":8,"./mainMenu.js":11,"./play_scene.js":13}],11:[function(require,module,exports){
'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');
var Kirby = require('./Kirby.js');
var Enemy = require('./enemy.js');

  var MainMenu = {
  create: function () {
    this.bg = this.game.add.sprite(0, 0, 'cloudyBackground');
    this.button1 = this.game.add.button(this.game.world.centerX - 72, this.game.world.centerY - 50, 'playButton', function(){this.game.state.start('play');}, this, 2, 1, 0);
    this.button2 = this.game.add.button(this.game.world.centerX - 72, this.game.world.centerY + 50, 'instrButton', function(){console.log('hola');}, this, 2, 1, 0);
  }
};

module.exports = MainMenu;
},{"./Kirby.js":1,"./character.js":5,"./enemy.js":6,"./gameObject.js":7}],12:[function(require,module,exports){
'use strict';

var GameObject = require('./gameObject.js');

function MovingObject(game, x, y, spriteName) {
	GameObject.call(this, game, x, y, spriteName);
	//this.body.collideWorldBounds = true;
}

MovingObject.prototype = Object.create(GameObject.prototype);
MovingObject.prototype.constructor = MovingObject;

MovingObject.prototype.move = function (movementSpeed) {
	this.body.velocity.x = movementSpeed;
}


MovingObject.prototype.stop = function () {
	this.body.velocity.x = 0;
}

module.exports = MovingObject;
},{"./gameObject.js":7}],13:[function(require,module,exports){
'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');
var Kirby = require('./Kirby.js');
var Enemy = require('./enemy.js');

  var PlayScene = {
  create: function () {

    // TODO: Add buttons make it beautiful etc
        // go back to level selection button
        // quit/back to main menu button
    this.input.keyboard.addKey (Phaser.Keyboard.ESC).onDown.add(function(){this.game.paused = !this.game.paused;}, this);


    // level change test
    // this.input.keyboard.addKey (Phaser.Keyboard.P).onDown.add(function(){this.game.state.start('level1');}, this);
    
    //this.input.keyboard.addKey (Phaser.Keyboard.R).onDown.add(this.restart(), this);
    // var logo = this.game.add.sprite(
    //   this.game.world.centerX, this.game.world.centerY, 'logo');
    // logo.anchor.setTo(0.5, 0.5);

    this.bg = this.game.add.sprite(0, 0, 'cloudyBackground');

    // meter a kirby en el mundo
    this.player = new Kirby(this.game, 100, 10, 'kirby');
    this.game.world.addChild(this.player);

    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
    
    this.attack
    this.waddleDee = new Enemy(this.game, 40, 40, 'normal', this.player, 'enemy');
    this.game.world.addChild(this.waddleDee);
    this.waddleDee1 = new Enemy(this.game, 200, 40, 'normal', this.player, 'enemy');
    this.game.world.addChild(this.waddleDee1);
    this.waddleDee2 = new Enemy(this.game, 60, 40, 'normal', this.player, 'enemy');
    this.game.world.addChild(this.waddleDee2);
    this.waddleDee3 = new Enemy(this.game, 80, 40, 'thunder', this.player, 'enemy');
    this.game.world.addChild(this.waddleDee3);
  },
  
  pauseGame: function(){
    this.game.paused = !this.game.paused;
  },

};

module.exports = PlayScene;
},{"./Kirby.js":1,"./character.js":5,"./enemy.js":6,"./gameObject.js":7}]},{},[10]);
