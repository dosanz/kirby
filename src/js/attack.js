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