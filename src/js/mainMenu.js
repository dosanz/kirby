'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');
var Kirby = require('./Kirby.js');
var Enemy = require('./enemy.js');

var MainMenu = {
  create: function () {
    this.bg = this.game.add.sprite(0, 0, 'cloudyBackground');
    this.button1 = this.game.add.button(128, 50, 'playButton', function(){this.game.state.start('play');}, this, 2, 1, 0);
    this.button2 = this.game.add.button(128, 150, 'instrButton', function(){this.game.state.start('instructionsScreen');}, this, 2, 1, 0);
    this.button1.anchor.setTo(0.5, 0);
    this.button2.anchor.setTo(0.5, 0);
  }
};

module.exports = MainMenu;