'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');
var Kirby = require('./Kirby.js');
var Enemy = require('./enemy.js');
var TreeBoss = require('./treeBoss.js');

  var BossLevel = {
  create: function () {
    this.bg = this.game.add.sprite(0, 0, 'cloudyBackground');

    this.player = new Kirby(this.game, 100, 10, 'kirby');
    this.game.world.addChild(this.player);

    this.boss = new TreeBoss(this.game, 200, 240, this.player);
    this.game.world.addChild(this.boss);

  }
};

module.exports = BossLevel;