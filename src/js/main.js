'use strict';

var PlayScene = require('./play_scene.js');


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    this.game.load.image('logo', 'images/phaser.png');
    this.game.load.image('cloudyBackground', 'images/cloudyBg.png');
    this.game.load.spritesheet('kirby', 'images/kirby-small.png', 16, 16);
    this.game.load.spritesheet('waddleDee', 'images/waddle-dee.png', 16, 16);
    this.game.load.spritesheet('waddleDoo', 'images/eye-thing.png', 16, 16);
  },

  create: function () {
    //this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.state.start('play');
  }
};


window.onload = function () {
  var antialias = false;
  var transparent = false;

  var game = new Phaser.Game(256, 240, Phaser.AUTO, 'game', transparent, antialias);
  
  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};
