'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');
var Kirby = require('./Kirby.js');
var Enemy = require('./enemy.js');
var TreeBoss = require('./treeBoss.js');

  var BossLevel = {
  create: function () {

    this.input.keyboard.addKey (Phaser.Keyboard.ESC).onDown.add(
      function(){
        this.game.paused = !this.game.paused;
        this.pauseText.exists = !this.pauseText.exists;
        this.exitText.exists = !this.exitText.exists;
      }, this);

    this.input.keyboard.addKey (Phaser.Keyboard.Q).onDown.add(
      function(){if(this.game.paused){this.game.paused = false; this.bossMusic.stop(); this.game.state.start('mainMenu');};}, this);
      
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
    this.player = new Kirby(this.game, 1, 10, this);
    this.game.world.addChild(this.player);
    this.player.loadHealth();
    this.player.loadLives();
    this.game.kirbyIndex = 5;

    this.boss = new TreeBoss(this.game, 232, 0, this.player, this);
    this.game.world.addChild(this.boss);

    this.pauseText = this.game.add.bitmapText(128, 112, 'pixelFont', 'pause', 16);
    this.pauseText.anchor.setTo(0.5, 0.5);
    this.exitText = this.game.add.bitmapText(128, 136, 'pixelFont', 'press Q to go back to main menu', 12);
    this.exitText.anchor.setTo(0.5, 0.5);
    this.pauseText.fixedToCamera = true;
    this.exitText.fixedToCamera = true;
    this.pauseText.exists = false;
    this.exitText.exists = false;

  }, 

  update: function(){
    this.game.physics.arcade.collide(this.player, this.floor);
    this.game.physics.arcade.collide(this.boss, this.floor);

    if (this.player.endedLevel && this.player.x < 40) {
      this.game.kirbyPowerUp = this.player.currentPowerUp;
        this.bossMusic.stop();
        this.game.state.start('win');
    }
  }
};

module.exports = BossLevel;