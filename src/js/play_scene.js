'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');
var Kirby = require('./Kirby.js');

  var PlayScene = {
  create: function () {
    // var logo = this.game.add.sprite(
    //   this.game.world.centerX, this.game.world.centerY, 'logo');
    // logo.anchor.setTo(0.5, 0.5);

    // meter a kirby en el mundo
    this.player = new Kirby(this.game, 10, 10);
    this.game.world.addChild(this.player);
  }
};

module.exports = PlayScene;