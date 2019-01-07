(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var MovingObject = require('./movingObject.js');
var Bullet = require('./bullet.js');
var Aura = require('./aura.js');
var LostPowerUp = require('./lostPowerUp');

const AIR_SPEED = 100;
const GROUND_SPEED = 120;

const AIR_GRAVITY = 180;
const GROUND_GRAVITY = 400;
const INVINCIBLE_TIME = 1500;
const ACT_TIMER = 1000;
const FLY_TIMER = 500;
const JUMP_TIMER = 250;
const INITIAL_HEALTH = 5;

const FLIP_FACTOR = -1;

function Kirby (game, x, y, scene) {
	MovingObject.call(this, game, x, y, 'kirby');
	this.anchor.setTo(0.5, 1);
	this.tag = 'kirby';

	this.initialX = x;
	this.initialY = y;
	this.scene = scene;

	this.body.allowGravity = true;
	this.body.gravity.y = 400;

	this.attack = null;
	this.lostPowerUp = null;
	this.lostPowerUpCount = 0;

	this.movementSpeed = GROUND_SPEED;
	this.jumpHeight = 125;
	this.swallowRange = 100;
	this.originalScale = this.scale.x;
	this.actTimer = 0;
	this.flyTimer = 0;
	this.jumpTimer = 0;

	this.currentPowerUp = this.game.kirbyPowerUp;
	this.storedPowerUp = 'normal';
	this.health = INITIAL_HEALTH;
	this.lifes = 3;
	this.lastHurt = 0;

	// control bools --------------------
	this.empty = true;
	this.grounded = false;
	this.flying = false;
	this.canFly = false;
	this.isMoving = false;
	this.acting = false;
	this.canMove = true;
	this.jumping = false;
	this.justAttacked = false;

	this.facingRight = true;
	this.invincible = false;
	this.full = false;

	this.endedLevel = false;
	this.startedLevel = true;

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
	this.SNjump = this.animations.add('SNjump', Phaser.Animation.generateFrameNames('SNjump', 1, 4), 5, false);
	this.SNinhaleStart = this.animations.add('SNinhaleStart', Phaser.Animation.generateFrameNames('SNinhaleStart', 1, 2), 4, false);
	this.SNinhale = this.animations.add('SNinhale', Phaser.Animation.generateFrameNames('SNinhale', 3, 4), 4, true);
	this.Bidle = this.animations.add('Bidle', Phaser.Animation.generateFrameNames('Bidle', 1, 4), 2, true);
	this.Bwalk = this.animations.add('Bwalk', Phaser.Animation.generateFrameNames('Bwalk', 1, 4), 5, true);
	this.BNfly = this.animations.add('BNfly', Phaser.Animation.generateFrameNames('BNfly', 1, 2), 3, true);

	this.STidle = this.animations.add('STidle', Phaser.Animation.generateFrameNames('STidle', 1, 4), 2, true);
	this.STwalk = this.animations.add('STwalk', Phaser.Animation.generateFrameNames('STwalk', 1, 4), 5, true);
	this.STjump = this.animations.add('STjump', Phaser.Animation.generateFrameNames('STjump', 1, 4), 5, false);
	this.STattack = this.animations.add('STattack', Phaser.Animation.generateFrameNames('STattack', 1, 2), 2, false);
	this.BTfly = this.animations.add('BTfly', Phaser.Animation.generateFrameNames('BTfly', 1, 2), 3, true);
	// this.SHurt = this.animations.add('SHurt', Phaser.Animation.generateFrameNames('SHurt', 1, 2), 3, true);

	this.hurtSound = this.game.add.audio('hurt');
	this.jumpSound = this.game.add.audio('jump');
	this.flySound = this.game.add.audio('fly');
	this.landingSound = this.game.add.audio('landing');
	this.powerUpSound = this.game.add.audio('powerUp');
	this.rockTransformSound = this.game.add.audio('rockTransform');
	this.rockCrashSound = this.game.add.audio('rockCollide');
}


Kirby.prototype = Object.create(MovingObject.prototype);
Kirby.prototype.constructor = Kirby;



Kirby.prototype.update = function () {
	if (!this.endedLevel && !this.startedLevel){
		this.stop();
		this.manageInput();
	}
	else if (this.endedLevel){
		this.levelChange();
	}
	else if (this.startedLevel){
		this.body.velocity.x = 50;
		this.body.velocity.y = 200;
		if (this.grounded){
			this.startedLevel = false;
			this.jump();
			this.body.velocity.x = 200;
		}
	}
	this.manageAnimations();
	
	if (this.body.onFloor()) {
		this.grounded = true;
		if (this.flying) {
			this.body.y += 9; // so it doesn't "float" when it turns small 
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
		this.jumping = false;
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
		if (this.canFly && this.flyTimer < this.game.time.now) {
			this.flyTimer = this.game.time.now + FLY_TIMER;
			this.flySound.play();
			this.flying = true;
			this.jumping = false;
			this.body.gravity.y = AIR_GRAVITY;
			this.jump();
		}
		else if (this.grounded && this.jumpTimer < this.game.time.now) {
			this.jumpTimer = this.game.time.now + JUMP_TIMER;
			this.jumpSound.play();
			this.jumping = true;
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
	if (this.keySpace.isDown && this.keySpace.enable == true) {
		if (this.currentPowerUp == 'normal')
		{
				this.stop();
				if (this.grounded){
					this.acting = true;
				}
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
			Kirby.prototype.animateFly.call(this, this.currentPowerUp);
		}
		else if (this.acting && this.empty && this.currentPowerUp == 'normal') {
			this.animations.play('SNinhale');
		}
		else if (!this.isMoving) {
			Kirby.prototype.animateSmallIdle.call(this, this.currentPowerUp);
		}
		else {
			if (this.grounded) {
				Kirby.prototype.animateSmallWalk.call(this, this.currentPowerUp);
			}
			else {
				Kirby.prototype.animateSmallJump.call(this, this.currentPowerUp);
			}
		}
	}
}


Kirby.prototype.animateSmallIdle = function(powerUp) {
	if (powerUp == 'thunder') {
		this.animations.play('STidle');
	} // TODO: add else-if's before the final else for the rest of power ups
	else { // animates 'normal' and anything we still dont have 
		this.animations.play('SNidle');
	}
}


Kirby.prototype.animateSmallWalk = function(powerUp) {
	if (powerUp == 'thunder') {
		this.animations.play('STwalk');
	} 
	else { // animates 'normal' and anything we still dont have 
		this.animations.play('SNwalk');
	}
}


Kirby.prototype.animateSmallJump = function(powerUp) {
	if (powerUp == 'thunder') {
		this.animations.play('STjump');
	} 
	else { // animates 'normal' and anything we still dont have 
		this.animations.play('SNjump');
	}
}


Kirby.prototype.animateSmallAttack = function(powerUp) {
	if (powerUp == 'thunder') {
		this.animations.play('STattack');
	}
}


Kirby.prototype.animateFly = function(powerUp) {
	if (powerUp == 'thunder') {
		this.animations.play('BTfly');
	} 
	else { // animates 'normal' and anything we still dont have 
		this.animations.play('BNfly');
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
	if (this.storedPowerUp != 'normal'){
		this.powerUpSound.play();
		this.currentPowerUp = this.storedPowerUp;
	}
	this.empty = true;
}

Kirby.prototype.getHurt = function (damage){
	if (this.game.time.now > this.lastHurt){
		this.hurtSound.play();
		this.lastHurt = this.game.time.now + INVINCIBLE_TIME;
		this.jump();
		if (this.facingRight){
			this.body.velocity.x = -400;
		}
		else{
			this.body.velocity.x = 400;
		}
		this.health -= damage;
		if (this.health <= 0){
			this.lifes--;
			if (this.lifes < 0){
				this.game.lastLevel = this.scene.key;
				this.game.state.start('gameOver');
			} 
			else{
				this.reset();
				for (var i = this.game.kirbyIndex + 1; i < this.game.world.children.length; i++){
					if (this.game.world.children[i].tag == 'enemy' || this.game.world.children[i].tag == 'boss'){
						this.game.world.children[i].reset();
					}
				}
			}
		}
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
		this.keySpace.enable = false;
	}
}

// TODO: fill
Kirby.prototype.act = function () {
	if (this.currentPowerUp == 'normal'){
		if (!this.empty && this.keySpace.enable){
			this.empty = true;
			this.storedPowerUp = 'normal';
			if (this.attack != null){
				this.attack.destroy(this);
			}
			this.attack = new Bullet(this.game, this.x, this.y, 3, true, this);
			this.keySpace.enable = false;
		}
	}

	else if (this.currentPowerUp == 'stone'){
		this.jump();
		this.rockTransformSound.play();
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
		this.attack = new Aura(this.game, this.x, this.y, 1, true, this);
		this.invincible = true;
		this.canMove = false;
	}

	else if (this.currentPowerUp == 'knife'){
		if (this.attack != null){
			this.attack.destroy(this);
		}
		this.attack = new Bullet(this.game, this.x, this.y, 3, true, this);
	}
}

Kirby.prototype.reset = function(){
	this.x = this.initialX;
	this.y = this.initialY;
	this.currentPowerUp = 'normal';
	this.storedPowerUp = 'normal';
	if (this.attack != null){
		this.attack.destroy();
		this.attack = null;
	}
	if (this.lostPowerUp != null){
		this.lostPowerUp.destroy();
		this.lostPowerUp = null;
		this.lostPowerUpCount = 0;
	}
	this.health = INITIAL_HEALTH;
}

Kirby.prototype.heal = function (healthBoost){
	this.health += healthBoost;
	if (this.health > INITIAL_HEALTH){
		this.health = INITIAL_HEALTH;
	}
}

Kirby.prototype.lifeUp = function(){
	this.lifes++;
}

Kirby.prototype.levelChange = function(){
	this.game.camera.unfollow();
	this.body.velocity.x = -100;
	this.body.velocity.y = -10;
}

module.exports = Kirby;
},{"./aura.js":3,"./bullet.js":5,"./lostPowerUp":13,"./movingObject.js":16}],2:[function(require,module,exports){
// TODO: make better sprites
'use strict'
var MovingObject = require ('./movingObject.js');

function Attack(game, x, y, spriteName, power, kirby) {
    MovingObject.call(this, game, x, y, spriteName)

    this.kirbyBool = kirby;

    this.game.world.addChild(this);

}

Attack.prototype = Object.create(MovingObject.prototype);
Attack.prototype.constructor = Attack;

Attack.prototype.damage = function(){
    if (this.kirbyBool){
        var enemy = null;
        var count = this.game.kirbyIndex + 1;
        while(enemy == null && count < this.game.world.children.length){
            
            if(this.game.physics.arcade.collide(this, this.game.world.children[count])){
                enemy = this.game.world.children[count];
                if (enemy.tag == 'enemy' || enemy.tag == 'boss' || enemy.tag == 'fallingEnemy'){
                    this.checkCollisions(enemy, this);
                }
            }
            count++;
        }
    }

    if (!this.kirbyBool){
        var player = this.game.world.children[this.game.kirbyIndex];
        if(this.game.physics.arcade.collide(this, player) == true){
            this.collideWithKirby(player);

        }
    }
}

Attack.prototype.checkOverlap = function(enemy){
    var enemyBounds = enemy.getBounds();
    var attackBounds = this.getBounds();

    return Phaser.Rectangle.intersects(enemyBounds, attackBounds);
}

module.exports = Attack;
},{"./movingObject.js":16}],3:[function(require,module,exports){
'use strict'

var Attack = require ('./attack.js');

const LIFE_TIME = 500;

function Aura(game, x, y, power, kirbyBool, attacker){
    this.attacker = attacker;
    this.power = power;

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
        this.anim = this.animations.add('mainAnim', [0,1,2,3,4,5,6,7], 10, true);
        this.verticalOffset = 16;
        if(!kirbyBool){
            this.verticalOffset -= 8;
        }
        this.sound = this.game.add.audio('thunder');
    }
    else if (this.attacker.currentPowerUp == 'fire'){
        Attack.call(this, game, x, y, 'fireAttack', power, kirbyBool);
        this.anim = this.animations.add('mainAnim', [0,1,2,3,4,5], 10, true);
        this.verticalOffset = 16;
        if(!kirbyBool){
            this.verticalOffset -= 8;
        }
        this.sound = this.game.add.audio('fire');
    }
    else if (this.attacker.currentPowerUp == 'spark'){
        Attack.call(this, game, x, y, 'sparkAttack', power, kirbyBool);
        this.anim = this.animations.add('mainAnim', [0,1,2], 10, true);
        this.verticalOffset = 20;
        if(!kirbyBool){
            this.verticalOffset -= 8;
        }
        this.sound = this.game.add.audio('spark');
    }
    
    this.body.collideWorldBounds = false;

    this.scale.x *= this.flip;
    this.body.immovable = true;
    this.game.time.events.add(LIFE_TIME, function(){this.die();}, this);
    this.animations.play('mainAnim');
    this.sound.play();
}

Aura.prototype = Object.create(Attack.prototype);
Aura.prototype.constructor = Aura;

Aura.prototype.update = function(){
    this.y = this.attacker.y -this.verticalOffset;
    this.damage();
}

Aura.prototype.checkCollisions = function(enemy){
    if(this.checkOverlap(enemy)){
        if (enemy.tag == 'enemy'){
            enemy.die();
        }
        else if (enemy.tag == 'boss'){
            console.log('oye');
            enemy.hurt(this.power);
        }
        else if (enemy.tag == 'fallingEnemy'){
            enemy.destroy();
        }
    }
}

Aura.prototype.collideWithKirby = function(kirby){
    if(this.checkOverlap(kirby)){
        kirby.getHurt(this.power);
    }
}

Aura.prototype.die = function(){
    if (this.attacker.tag == 'kirby'){
        this.attacker.canMove = true;
        this.attacker.invincible = false;
    }

    else if (this.attacker.tag == 'enemy'){
        this.attacker.attackAnim = false;
    }
    this.destroy();
}

module.exports = Aura;
},{"./attack.js":2}],4:[function(require,module,exports){
'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');
var Kirby = require('./Kirby.js');
var Enemy = require('./enemy.js');
var TreeBoss = require('./treeBoss.js');

  var BossLevel = {
  create: function () {
    console.log(this.game.kirbyPowerUp);
  	// set background and map
    this.game.stage.backgroundColor = 'ffffff';
    this.bg = this.game.add.image(0, 0, 'bossBackground');
    this.bg.fixedToCamera = true;
    this.map = this.game.add.tilemap('bossTilemap');
    this.map.addTilesetImage('grass', 'grassTilesPhaser');
    this.floor = this.map.createLayer('floor');
    this.map.setCollisionBetween(1, 1000, true, 'floor');
    this.floor.resizeWorld();

    // set music
    this.bossMusic = this.game.add.audio('bossMusic');
    this.bossMusic.loop = true;
    this.bossMusic.play();

    // add characters
    this.player = new Kirby(this.game, 100, 10, this);
    this.game.world.addChild(this.player);
    this.game.kirbyIndex = 2;

    this.boss = new TreeBoss(this.game, 232, 0, this.player, this);
    this.game.world.addChild(this.boss);

  }, 

  update: function(){
    this.game.physics.arcade.collide(this.player, this.floor);
    this.game.physics.arcade.collide(this.boss, this.floor);
  }
};

module.exports = BossLevel;
},{"./Kirby.js":1,"./character.js":6,"./enemy.js":8,"./gameObject.js":10,"./treeBoss.js":18}],5:[function(require,module,exports){
'use strict'

var Attack = require ('./attack.js');


function Bullet(game, x, y, power, kirbyBool, attacker){
    this.attacker = attacker;
    this.power = power;
    
    if (this.attacker.currentPowerUp == 'normal'){
        Attack.call(this, game, x, y, 'starAttack', power, kirbyBool);
        this.attackSound = this.game.add.audio('star');
        this.crashSound = this.game.add.audio('starCrash');
    }
    else if (this.attacker.currentPowerUp == 'knife'){
        Attack.call(this, game, x, y, 'knifeAttack', power, kirbyBool);
    }
    if (this.attacker.facingRight){
        this.speed = 100;
    }
    else{
        this.speed = -100;
    }

    this.dying = false;

    this.moving = this.animations.add('moving', [0,1,2], 20, true);
    this.crash = this.animations.add('crash', [3,4,5], 5, false);
    this.crash.onComplete.add(function(){this.destroy();}, this)
    this.animations.play('moving');
    this.attackSound.play();
}

Bullet.prototype = Object.create(Attack.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function(){
    if (this.game.physics.arcade.collide(this, this.attacker.scene.floor)){
        this.speed = 0;
        this.dying = true;
        this.animations.play('crash');
        this.attackSound.stop();
        this.crashSound.play();
    }
    this.move(this.speed);
    if (!this.dying){
        this.damage();
    }
    if(!this.inCamera){
        this.destroy();
    }
}

Bullet.prototype.checkCollisions = function(enemy){
    if (enemy.tag == 'enemy'){
        this.game.physics.arcade.collide(this, enemy, this.collideWithEnemy(enemy, this));
    }

    else if(enemy.tag == 'boss'){
        if(this.checkOverlap(this, enemy)){
            this.collideWithBoss(enemy);
        }
    }

    else if (enemy.tag == 'fallingEnemy'){
        enemy.destroy();
    }
}

Bullet.prototype.collideWithEnemy = function(enemy){
    enemy.die();
    this.speed = 0;
    this.dying = true;
    this.animations.play('crash');
    this.attackSound.stop();
    this.crashSound.play();
}

Bullet.prototype.collideWithKirby = function(kirby){
    kirby.getHurt(this.power);
    this.speed = 0;
    this.dying = true;
    this.animations.play('crash');
}

Bullet.prototype.collideWithBoss = function(boss){
    boss.hurt(this.power);
    this.speed = 0;
    this.dying = true;
    this.animations.play('crash');
}

module.exports = Bullet;
},{"./attack.js":2}],6:[function(require,module,exports){
'use strict';

var MovingObject = require('./movingObject.js');


function Character(game, x, y, spriteName, edible) {
	MovingObject.call(this, game, x, y, spriteName);
	
	this.body.allowGravity = true;
	this.body.gravity.y = 400;

	this.beingAbsorbed = false;
	this.edible = edible;

	this.hurtSound = this.game.add.audio('hurt');
	//this.body.collideWorldBounds = true;
}

Character.prototype = Object.create(MovingObject.prototype);
Character.prototype.constructor = Character;

Character.prototype.beingEaten = function(){
	if (this.kirby.currentPowerUp == 'normal' && this.kirby.acting && this.kirby.empty && this.kirby.grounded){
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
},{"./movingObject.js":16}],7:[function(require,module,exports){
'use strict'

var GameObject = require('./gameObject.js');

function EndStar(game, x, y, spriteName, kirby) { 
    GameObject.call(this, game, x, y, spriteName);
    this.kirby = kirby;
    this.moving = this.animations.add('moving', [0,1,2], 20, true);
    this.animations.play('moving');
}

EndStar.prototype = Object.create(GameObject.prototype);
EndStar.prototype.constructor = EndStar;

EndStar.prototype.update = function(){
    if (this.inCamera){
		if (this.game.physics.arcade.collide(this, this.kirby)){
            this.kirby.endedLevel = true;
            this.destroy();
        }
	}
}

module.exports = EndStar;
},{"./gameObject.js":10}],8:[function(require,module,exports){
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
	else {
		Character.call(this, game, x, y, 'waddleDee', true);
	}

	this.originalScale = this.scale.x;

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
	this.isHurt = false;

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
	if (this.inCamera == true){
		this.game.physics.arcade.collide(this, this.scene.floor);

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
	// TODO -------------------------- add if enemy collides with walls this.speed = -this.speed
	this.beingEaten();
	this.collideWithKirby();
	}

	else{
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


Enemy.prototype.fire = function() {
}

Enemy.prototype.thunder = function() {
	if (this.attacks != null){
		this.attacks.destroy(this);
	}
	this.attackAnim = true;
	this.animations.play('attack');
	this.attacks = new Aura(this.game, this.x, this.y, 1, false, this);
}

module.exports = Enemy;
},{"./Kirby.js":1,"./aura.js":3,"./bullet.js":5,"./character.js":6,"./gameObject.js":10,"./movingObject.js":16}],9:[function(require,module,exports){
// for the tree boss fight, they fall and when they touch the ground bounce towards kirby

'use strict';

var Character = require('./character.js');

function FallingEnemy (game, x, y, spriteName, kirby, edible, scene){
    Character.call(this, game, x, y, spriteName);
    this.tag = 'fallingEnemy';
    this.kirby = kirby;
    this.edible = edible;
    this.scene = scene;
    this.currentPowerUp = 'normal'
    this.baseSpeed = 30;
    this.bounceHeight = -200;
    this.speedSet = false;
    this.game.world.addChild(this);
}

FallingEnemy.prototype = Object.create(Character.prototype);
FallingEnemy.prototype.constructor = FallingEnemy;

FallingEnemy.prototype.update = function(){
    this.game.physics.arcade.collide(this, this.scene.floor);
    if (this.body.onFloor()) {
        if (this.speedSet == false){
            if (this.x > this.kirby.x){
                this.baseSpeed = -20;
            }
            this.speedSet = true;

        }
        else{
            this.body.velocity.x = this.baseSpeed;
            this.body.velocity.y = this.bounceHeight;
        }
    }
    
    this.beingEaten();
    this.collideWithKirby();
}

FallingEnemy.prototype.collideWithKirby = function(){
	if (this.game.physics.arcade.collide(this, this.kirby)){
		if (this.beingAbsorbed == true){
			this.kirby.eat(this.powerUp, this.kirby);
			this.destroy();
		}
		else if (this.kirby.invincible == true){
			this.destroy();
		}
		else if (this.kirby.invincible == false){
			this.kirby.getHurt(1, this.kirby);
		}
	}
}

module.exports = FallingEnemy;
},{"./character.js":6}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');
var Kirby = require('./Kirby.js');
var Enemy = require('./enemy.js');

  var GameOver = {
  create: function () {
    this.bg = this.game.add.sprite(0, 0, 'cloudyBackground');
    this.button1 = this.game.add.button(100, 50, 'playButton', function(){this.game.state.start('mainMenu');}, this, 2, 1, 0);
    this.button2 = this.game.add.button(100, 150, 'instrButton', function(){this.game.state.start(this.game.lastLevel);}, this, 2, 1, 0);
    this.button1.anchor.setTo(0.5, 0.5);
    this.button2.anchor.setTo(0.5, 0.5);
  }
};

module.exports = GameOver;
},{"./Kirby.js":1,"./character.js":6,"./enemy.js":8,"./gameObject.js":10}],12:[function(require,module,exports){
// level "template"
'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');
var Kirby = require('./Kirby.js');
var Enemy = require('./enemy.js');

  var Level1 = {
  create: function () {
    
  }
};

module.exports = Level1;
},{"./Kirby.js":1,"./character.js":6,"./enemy.js":8,"./gameObject.js":10}],13:[function(require,module,exports){
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

    this.mainSound = this.game.add.audio('star');
    this.bounceSound = this.game.add.audio('starCollide');
    this.crashSound = this.game.add.audio('starCrash');

    this.animations.play('moving');

    this.game.world.addChild(this);
    this.mainSound.play();
    this.game.time.events.add(Phaser.Timer.SECOND + LIFE_TIME, function(){if (!this.beingAbsorbed){this.crashSound.play();} this.animations.play('crash');}, this);
}

LostPowerUp.prototype = Object.create(Character.prototype);
LostPowerUp.prototype.constructor = LostPowerUp;

LostPowerUp.prototype.update = function(){
    this.game.physics.arcade.collide(this, this.kirby.scene.floor);
    this.move(this.speed);

    if (this.body.onFloor()){
        this.bounceSound.play();
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
            this.destroy();
        }
        else if(this.kirby.y > this.y){
            this.body.velocity.y = -100;
        }
	}
}

module.exports = LostPowerUp;
},{"./character.js":6}],14:[function(require,module,exports){
'use strict';

var PlayScene = require('./play_scene.js');
var MainMenu = require('./mainMenu.js');
var Level1 = require('./level1.js');
var BossLevel = require('./bossLevel.js');
var GameOver = require('./gameOver.js');

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
    this.game.load.image('boss', 'images/boss.png');
    this.game.load.image('apple', 'images/apple.png');
    
    this.game.load.image('cloudyBackground', 'images/cloudyBg.png');
    this.game.load.image('grassBackground', 'images/bg-grass.png');
    this.game.load.image('bossBackground', 'images/bg-boss.png');
    this.game.load.image('grassTilesPhaser', 'tiled/tile-grass.png');
    this.game.load.tilemap('grassLevel', 'tiled/prueba-grass.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('bossTilemap', 'tiled/boss.json', null, Phaser.Tilemap.TILED_JSON);

    this.game.load.atlas('kirby', 'images/kirby.png', 'images/kirby.json');

    this.game.load.spritesheet('fatKirby', 'images/kirby-big.png', 24, 24, 10);
    this.game.load.spritesheet('waddleDee', 'images/waddle-dee.png', 16, 16);
    this.game.load.spritesheet('waddleDoo', 'images/eye-thing.png', 16, 16);
    this.game.load.spritesheet('starAttack', 'images/star.png', 16, 16);
    this.game.load.spritesheet('sparkAttack', 'images/spark.png', 48, 36);
    this.game.load.spritesheet('fireAttack', 'images/fire.png', 24, 24);
    this.game.load.spritesheet('knifeAttack', 'images/knife.png', 24, 24);
    this.game.load.spritesheet('thunderAttack', 'images/thunder.png', 24, 24);

    this.game.load.audio('hurt', 'sounds/hurt.wav');
    this.game.load.audio('fly', 'sounds/fly.wav');
    this.game.load.audio('jump', 'sounds/jump.wav');
    this.game.load.audio('landing', 'sounds/landing.wav');
    this.game.load.audio('powerUp', 'sounds/powerUp.wav');
    this.game.load.audio('starCollide', 'sounds/starCollide.wav');
    this.game.load.audio('starCrash', 'sounds/starCrash.wav');
    this.game.load.audio('rockCollide', 'sounds/rockCollide.wav');
    this.game.load.audio('rockTransform', 'sounds/rockTransform.wav');
    this.game.load.audio('star', 'sounds/star.wav');
    this.game.load.audio('fire', 'sounds/fire.wav');
    this.game.load.audio('thunder', 'sounds/thunder.wav');
    this.game.load.audio('spark', 'sounds/spark.wav');

    this.game.load.audio('greenGreensIntro', ['music/greenGreensIntro.mp3', 'music/greenGreensIntro.ogg']);
    this.game.load.audio('greenGreensLoop', ['music/greenGreensLoop.mp3', 'music/greenGreensLoop.ogg']);
    this.game.load.audio('boss-short', ['music/boss-short.mp3', 'music/boss-short.ogg']);
    this.game.load.audio('bossMusic', ['music/boss.mp3', 'music/boss.ogg']);
    this.game.load.audio('starMusic', ['music/star.mp3', 'music/star.ogg']);
    this.game.load.audio('victoryDance', ['music/victory.mp3', 'music/victory.ogg']);
    this.game.load.audio('defeatMusic', ['music/dead.mp3', 'music/dead.ogg']);

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
  game.state.add('bossLevel', BossLevel);
  game.state.add('mainMenu', MainMenu);
  game.state.add('gameOver', GameOver);

  game.state.start('boot');
};

},{"./bossLevel.js":4,"./gameOver.js":11,"./level1.js":12,"./mainMenu.js":15,"./play_scene.js":17}],15:[function(require,module,exports){
'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');
var Kirby = require('./Kirby.js');
var Enemy = require('./enemy.js');

  var MainMenu = {
  create: function () {
    this.bg = this.game.add.sprite(0, 0, 'cloudyBackground');
    this.button1 = this.game.add.button(100, 50, 'playButton', function(){this.game.state.start('play');}, this, 2, 1, 0);
    this.button2 = this.game.add.button(100, 150, 'instrButton', function(){console.log('hola');}, this, 2, 1, 0);
    this.button1.anchor.setTo(0.5, 0.5);
    this.button2.anchor.setTo(0.5, 0.5);
  }
};

module.exports = MainMenu;
},{"./Kirby.js":1,"./character.js":6,"./enemy.js":8,"./gameObject.js":10}],16:[function(require,module,exports){
'use strict';

var GameObject = require('./gameObject.js');

function MovingObject(game, x, y, spriteName) {
	GameObject.call(this, game, x, y, spriteName);

	this.hurtSound = this.game.add.audio('hurt');
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
},{"./gameObject.js":10}],17:[function(require,module,exports){
'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');
var EndStar = require('./endStar.js');
var Kirby = require('./Kirby.js');
var Enemy = require('./enemy.js');

  var PlayScene = {
  create: function () {

    // TODO: Add buttons make it beautiful etc
        // go back to level selection button
        // quit/back to main menu button
    this.input.keyboard.addKey (Phaser.Keyboard.ESC).onDown.add(
      function(){this.game.paused = !this.game.paused;}, this);

    this.input.keyboard.addKey (Phaser.Keyboard.Q).onDown.add(
      function(){if(this.game.paused){this.game.paused = false; this.game.state.start('mainMenu');};}, this);


    // level change test
    // this.input.keyboard.addKey (Phaser.Keyboard.P).onDown.add(function(){this.game.state.start('level1');}, this);
    
    //this.input.keyboard.addKey (Phaser.Keyboard.R).onDown.add(this.restart(), this);
    // var logo = this.game.add.sprite(
    //   this.game.world.centerX, this.game.world.centerY, 'logo');
    // logo.anchor.setTo(0.5, 0.5);

    // Map test -- TODO: maybe migrate to a specific class? like level1 or grassLevel
    this.game.stage.backgroundColor = 'ffffff';
    this.bg = this.game.add.image(0, 0, 'grassBackground');
    this.bg.fixedToCamera = true;
    this.map = this.game.add.tilemap('grassLevel');
    this.map.addTilesetImage('grass', 'grassTilesPhaser');
    this.floor = this.map.createLayer('floor');
    this.map.setCollisionBetween(1, 2000, true, 'floor');
    this.floor.resizeWorld();

    // meter a kirby en el mundo
    this.game.kirbyPowerUp = 'normal';
    this.player = new Kirby(this.game, 100, 10, this);
    this.game.world.addChild(this.player);
    this.game.kirbyIndex = 2;

    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
    
    this.attack
    this.waddleDee = new Enemy(this.game, 40, 40, 'normal', this.player, this);
    this.game.world.addChild(this.waddleDee);
    this.waddleDee1 = new Enemy(this.game, 200, 40, 'normal', this.player, this);
    this.game.world.addChild(this.waddleDee1);
    this.waddleDee2 = new Enemy(this.game, 60, 40, 'normal', this.player, this);
    this.game.world.addChild(this.waddleDee2);
    this.waddleDee3 = new Enemy(this.game, 80, 40, 'thunder', this.player, this);
    this.game.world.addChild(this.waddleDee3);

    this.endStar = new EndStar(this.game,500, 200, 'starAttack', this.player);
    this.game.world.addChild(this.endStar);

    // set music
    this.greenGreensIntro = this.game.add.audio('greenGreensIntro');
    this.greenGreensLoop = this.game.add.audio('greenGreensLoop');

    this.game.sound.setDecodedCallback([ this.greenGreensIntro, this.greenGreensLoop ], this.start, this);
  },

  start: function(){
    this.greenGreensIntro.play();
    this.greenGreensIntro.onStop.add(this.loopMusic, this);

  },


  update: function(){
    if (!this.player.inCamera) {
      this.game.kirbyPowerUp = this.player.currentPowerUp;
        this.greenGreensLoop.stop();
        this.game.state.start('bossLevel');
    }
    

    this.game.physics.arcade.collide(this.player, this.floor);
    // TODO: do this for the enemy group too
  },

  loopMusic: function() {
    this.greenGreensLoop.loop = true;
    this.greenGreensLoop.play();
  }
};

module.exports = PlayScene;
},{"./Kirby.js":1,"./character.js":6,"./endStar.js":7,"./enemy.js":8,"./gameObject.js":10}],18:[function(require,module,exports){
'use strict';

var GameObject = require('./gameObject.js');
var FallingObject = require('./fallingEnemy.js');

const INITIAL_HEALTH = 20;

function TreeBoss(game, x, y, kirby, scene) {
    GameObject.call(this, game, x, y, 'boss');

    this.body.immovable = true;
    this.body.collideWorldBounds = true;
    this.tag = 'boss';

    this.actTimer = 0;
    this.invincibleTime = 0;
    this.health = INITIAL_HEALTH;
    this.kirby = kirby;
    this.scene = scene;
    this.attacks = new Array(2);

    this.dead = false;
}

TreeBoss.prototype = Object.create(GameObject.prototype);
TreeBoss.prototype.constructor = TreeBoss;

TreeBoss.prototype.update = function(){
    console.log(this.health);
    if(!this.dead){
        this.collideWithKirby();
        this.act();
    }
    // else if (this.dead) {new endStar -> credits; destroy the enemies}
}

TreeBoss.prototype.collideWithKirby = function(){
	if (this.game.physics.arcade.collide(this, this.kirby)){
		if (this.kirby.invincible == true && this.kirby.currentPowerUp == 'stone'){
			this.hurt(1);
		}
		else if (this.kirby.invincible == false){
			this.kirby.getHurt(1, this.kirby);
		}
	}
}

TreeBoss.prototype.hurt = function(damage){
    if (this.game.time.now > this.invincibleTime){
        this.invincibleTime += 2000;
        this.health -= damage;
        if (this.health <= 0){
            this.dead = true;
        }
    }
}

TreeBoss.prototype.act = function(){
    if (this.game.time.now > this.actTimer && !this.kirby.startedLevel){
        this.actTimer += Math.floor((Math.random() * 8000) + 6000);
        for (var i = 0; i < this.attacks.length; i++){
            if (this.attacks[i] != null){
                this.attacks[i].destroy();
            }
            this.attacks[i] = new FallingObject(this.game, Math.floor((Math.random() * 256) + 0), 0, 'apple', this.kirby, true, this.scene);
        }
    }
}

TreeBoss.prototype.reset = function(){
    for (var i = 0; i < this.attacks.length; i++){
        if (this.attacks[i] != null){
            this.attacks[i].kill();
        }
    }
    this.health = INITIAL_HEALTH;
}

module.exports = TreeBoss;
},{"./fallingEnemy.js":9,"./gameObject.js":10}]},{},[14]);
