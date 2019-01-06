'use strict';

var PlayScene = require('./play_scene.js');
var MainMenu = require('./mainMenu.js');
var Level1 = require('./level1.js');
var BossLevel = require('./bossLevel.js');

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
    this.game.load.image('boss', 'images/boss.png');
    this.game.load.image('apple', 'images/apple.png');
    
    this.game.load.image('cloudyBackground', 'images/cloudyBg.png');
    this.game.load.image('grassBackground', 'images/bg-grass.png');
    this.game.load.image('grassTilesPhaser', 'tiled/tile-grass.png');
    this.game.load.tilemap('grassLevel', 'tiled/prueba-grass.json', null, Phaser.Tilemap.TILED_JSON);

    this.game.load.atlas('kirby', 'images/kirby.png', 'images/kirby.json');

    this.game.load.atlas('kirby', 'images/kirby.png', 'images/kirby.json');
    this.game.load.spritesheet('fatKirby', 'images/kirby-big.png', 24, 24, 10);
    this.game.load.spritesheet('waddleDee', 'images/waddle-dee.png', 16, 16);
    this.game.load.spritesheet('waddleDoo', 'images/eye-thing.png', 16, 16);
    this.game.load.spritesheet('starAttack', 'images/star.png', 16, 16);
    this.game.load.spritesheet('sparkAttack', 'images/spark.png', 48, 48);
    this.game.load.spritesheet('fireAttack', 'images/fire.png', 24, 24);
    this.game.load.spritesheet('knifeAttack', 'images/knife.png', 24, 24);
    this.game.load.spritesheet('thunderAttack', 'images/thunder.png', 24, 24);

  },

  create: function () {
    //this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    this.game.state.start('bossLevel');
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
  game.state.add('bossLevel', BossLevel);
  game.state.add('mainMenu', MainMenu);

  game.state.start('boot');
};
