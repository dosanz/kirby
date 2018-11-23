'use strict';

var GameObject = require('./gameObject');
var Character = require('./character');
var Kirby = require('./Kirby');

  var PlayScene = {
  create: function () {
    // var logo = this.game.add.sprite(
    //   this.game.world.centerX, this.game.world.centerY, 'logo');
    // logo.anchor.setTo(0.5, 0.5);

    // meter a kirby en el mundo
    this.game.player = new Kirby(this.game, 10, 10);
    this.game.world.addChild(player);
  }
};

module.exports = PlayScene;