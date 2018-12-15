'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');

function Enemy (game, x, y, spriteName){
    Character.call(this, game, x, y, spriteName, reward);

    this.powerUp = reward;

}

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(){
    // calls move with a speed depending on the direction the enemy is facing until the enemy is out of the camera (when enemies appear they are always facing kirby)
}

Enemy.prototype.beingEaten = function(){
    // if the enemy is in kirbys swallow range (depends on the direction kirby is facing)
    //  moveToXY(displayObject, x, y, speed, maxTime)
    // if the enemy collides with kirby, kirby gets full (slower and unable to fly)
    // the enemy is killed but the powerUp is stored. Kirby contains a generic object that can be spitted (causes damage or disappears after a few seconds) 
    //                                                                                             or swallowed (kirby gets a power up)
}