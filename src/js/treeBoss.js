'use strict';

var GameObject = require('./gameObject.js');
var FallingObject = require('./fallingEnemy.js');

function TreeBoss(game, x, y, kirby) {
    GameObject.call(this, game, x, y, 'boss');
    this.body.immovable = true;
    this.tag = 'boss';
    this.actTimer = 0;
    this.invincibleTime = 0;
    this.health = 20;
    this.kirby = kirby;
    this.body.collideWorldBounds = true;
    this.attacks = new Array(3);
}

TreeBoss.prototype = Object.create(GameObject.prototype);
TreeBoss.prototype.constructor = TreeBoss;

TreeBoss.prototype.update = function(){
    this.collideWithKirby();
    this.act();
}

TreeBoss.prototype.collideWithKirby = function(){
	if (this.game.physics.arcade.collide(this, this.kirby)){
		if (this.kirby.invincible == true){
			this.getHurt();
		}
		else if (this.kirby.invincible == false){
			this.kirby.getHurt(1, this.kirby);
		}
	}
}

TreeBoss.prototype.hurt = function(damage){
    if (this.game.time.now > this.invincibleTime){
        this.invincibleTime += 4000;
        this.health -= damage;
    }
}

TreeBoss.prototype.act = function(){
    if (this.game.time.now > this.actTimer){
        this.actTimer += 6000;
        for (var i = 0; i < this.attacks.length; i++){
            if (this.attacks[i] != null){
                this.attacks[i].destroy();
            }
            this.attacks[i] = new FallingObject(this.game, Math.floor((Math.random() * 256) + 0), 0, 'apple', this.kirby, true);
        }
    }
}

module.exports = TreeBoss;