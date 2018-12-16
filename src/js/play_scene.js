'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');
var Kirby = require('./Kirby.js');
var Enemy = require('./enemy.js');

  var PlayScene = {
  create: function () {
    // var logo = this.game.add.sprite(
    //   this.game.world.centerX, this.game.world.centerY, 'logo');
    // logo.anchor.setTo(0.5, 0.5);

    this.bg = this.game.add.sprite(0, 0, 'cloudyBackground');

    // meter a kirby en el mundo
    this.player = new Kirby(this.game, 10, 10);
    this.game.world.addChild(this.player);

    this.waddleDee = new Enemy(this.game, 40, 40, Character.NORMAL, this.player);
    this.game.world.addChild(this.waddleDee);
    this.waddleDee1 = new Enemy(this.game, 200, 40, Character.NORMAL, this.player);
    this.game.world.addChild(this.waddleDee1);
    this.waddleDee2 = new Enemy(this.game, 60, 40, Character.NORMAL, this.player);
    this.game.world.addChild(this.waddleDee2);
    this.waddleDee3 = new Enemy(this.game, 80, 40, Character.NORMAL, this.player);
    this.game.world.addChild(this.waddleDee3);
  }
};

module.exports = PlayScene;