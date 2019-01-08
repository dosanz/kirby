'use strict';

var GameObject = require('./gameObject.js');
var FallingObject = require('./fallingEnemy.js');
var EndStar = require('./endStar.js');

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
    this.endStar = null;

    this.dead = false;
}

TreeBoss.prototype = Object.create(GameObject.prototype);
TreeBoss.prototype.constructor = TreeBoss;

TreeBoss.prototype.update = function(){
    if(!this.dead){
        this.collideWithKirby();
        this.act();
    }
    else if (this.dead) {
        if (this.endStar == null){
            this.endStar = new EndStar(this.game, 124, 120, 'starAttack', this.kirby);
        }
        for (var i = 0; i < this.attacks.length; i++){
            if (this.attacks[i] != null){
                this.attacks[i].destroy();
            }
        }
    }
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