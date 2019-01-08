'use strict'

var GameObject = require('./gameObject.js');

function EndStar(game, x, y, spriteName, kirby) { 
    GameObject.call(this, game, x, y, spriteName);
    this.kirby = kirby;
    this.moving = this.animations.add('moving', [0,1,2], 20, true);
    this.animations.play('moving');

    this.game.world.addChild(this);
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