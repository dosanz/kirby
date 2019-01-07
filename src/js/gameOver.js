'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');
var Kirby = require('./Kirby.js');
var Enemy = require('./enemy.js');

  var GameOver = {
  create: function () {
    this.bg = this.game.add.sprite(0, 0, 'cloudyBackground');
    this.button1 = this.game.add.button(100, 50, 'playButton', function(){this.game.state.start('mainMenu');}, this, 2, 1, 0);
    this.button2 = this.game.add.button(100, 150, 'instrButton', function(){this.game.state.start(this.game.lastLevel);}, this, 2, 1, 0);
    this.button1.anchor.setTo(0.5, 0.5);
    this.button2.anchor.setTo(0.5, 0.5);
  }
};

module.exports = GameOver;