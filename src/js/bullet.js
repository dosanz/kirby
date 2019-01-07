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