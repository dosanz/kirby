'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');
var Kirby = require('./Kirby.js');
var Enemy = require('./enemy.js');
var TreeBoss = require('./treeBoss.js');

  var BossLevel = {
  create: function () {
  	// set background and map
    this.game.stage.backgroundColor = 'ffffff';
    this.bg = this.game.add.image(0, 0, 'bossBackground');
    this.bg.fixedToCamera = true;
    this.map = this.game.add.tilemap('bossTilemap');
    this.map.addTilesetImage('grass', 'grassTilesPhaser');
    this.floor = this.map.createLayer('floor');
    this.map.setCollisionBetween(1, 1000, true, 'floor');
    this.floor.resizeWorld();

    // set music
    this.bossMusic = this.game.add.audio('bossMusic');
    this.bossMusic.loop = true;
    this.bossMusic.play();

    // add characters
    this.player = new Kirby(this.game, 100, 10, 'kirby');
    this.game.world.addChild(this.player);
    this.game.kirbyIndex = 1;

    this.boss = new TreeBoss(this.game, 232, 0, this.player);
    this.game.world.addChild(this.boss);

  }, 

  update: function(){
    this.game.physics.arcade.collide(this.player, this.floor);
    this.game.physics.arcade.collide(this.boss, this.floor);
  }
};

module.exports = BossLevel;