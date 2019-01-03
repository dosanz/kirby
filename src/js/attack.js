'use strict'
// attacks are created in enemy or kirby modules and collisions are checked in play_scene's main loop
var Character = require('./character.js');
var Enemy = require('./enemy.js');
var Kirby = require('./Kirby.js');
var MovingObject = require ('./movingObject.js');

function Attack(game, x, y, spriteName, facingRight, power, kirby) {
    MovingObject.call(this, game, x, y, spriteName)

    this.kirby = kirby;

    this.game.world.addChild(this);

    this.moving = this.animations.add('moving', [0,1,2], 20, true);
    this.crash = this.animations.add('crash', [3,4,5], 5, false);
    this.animations.play('moving');

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
                    this.game.physics.arcade.collide(this, enemy, this.collideWithEnemy(enemy, this));
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