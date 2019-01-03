// level "template"
'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');
var Kirby = require('./Kirby.js');
var Enemy = require('./enemy.js');

  var Level1 = {
  create: function () {
    this.bg = this.game.add.sprite(0, 0, 'cloudyBackground');
    console.log(this.game.world.children.length);
  }
};

module.exports = Level1;