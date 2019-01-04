'use strict';

var PlayScene = require('./play_scene.js');
var MainMenu = require('./mainMenu.js');
var Level1 = require('./level1.js');


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
    this.game.load.image('playButton', 'images/playButton.png');
    this.game.load.image('instrButton', 'images/instructionsButton.png');
    //this.game.load.spritesheet('kirby', 'images/kirby-small.png', 16, 16, 20);
    this.game.load.atlas('kirby', 'images/kirby.png', 'images/kirby.json');
    this.game.load.spritesheet('fatKirby', 'images/kirby-big.png', 24, 24, 10);
    this.game.load.spritesheet('waddleDee', 'images/waddle-dee.png', 16, 16);
    this.game.load.spritesheet('waddleDoo', 'images/eye-thing.png', 16, 16);
    this.game.load.spritesheet('starAttack', 'images/star.png', 16, 16);
    this.game.load.spritesheet('sparkAttack', 'images/spark.png', 24, 24);
    this.game.load.spritesheet('fireAttack', 'images/fire.png', 16, 16);
    this.game.load.spritesheet('knifeAttack', 'images/knife.png', 16, 16);
    this.game.load.spritesheet('thunderAttack', 'images/thunder.png', 16, 16);
  },

  create: function () {
    //this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    this.game.state.start('mainMenu');
  }
};


window.onload = function () {
  var antialias = false;
  var transparent = false;

  var game = new Phaser.Game(256, 240, Phaser.AUTO, 'game', transparent, antialias);
  
  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);
  game.state.add('level1', Level1);
  game.state.add('mainMenu', MainMenu);

  game.state.start('boot');
};
