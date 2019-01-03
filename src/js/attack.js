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