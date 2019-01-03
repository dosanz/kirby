// for the tree boss fight, they fall and when they touch the ground bounce towards kirby

'use strict';

var Character = require('./character.js');

function FallingEnemy (game, x, y, spriteName, kirby, edible){
    Character.call(this, game, x, y, spriteName);
    this.kirby = kirby;
    this.edible = edible;
    this.baseSpeed = 10;
    this.bounceHeight = -100;
    this.speedSet = false;
}

FallingEnemy.prototype = Object.create(Character.prototype);
FallingEnemy.prototype.constructor = FallingEnemy;

FallingEnemy.prototype.update = function(){
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
}

FallingEnemy.prototype.collideWithKirby = function(){
	if (this.game.physics.arcade.collide(this, this.kirby)){
		if (this.beingAbsorbed == true){
			this.kirby.eat(this.powerUp, this.kirby);
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

module.exports = FallingEnemy;