'use strict';

var PlayScene = require('./play_scene.js');
var MainMenu = require('./mainMenu.js');
var InstructionsScreen = require('./instructionsScreen.js');
var Level1 = require('./level1.js');
var BossLevel = require('./bossLevel.js');
var GameOver = require('./gameOver.js');
var EndScene = require('./endScene.js');
var Win = require('./winMenu.js');

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
    this.game.load.image('playButton', 'images/playButton.png');
    this.game.load.image('cloudyBackground', 'images/cloudyBg.png');
    this.game.load.image('instrButton', 'images/instructionsButton.png');
    this.game.load.image('quitButton', 'images/quitButton.png');
    this.game.load.image('retryButton', 'images/retryButton.png');
    this.game.load.image('boss', 'images/boss.png');
    this.game.load.image('apple', 'images/apple.png');
    this.game.load.image('lifeFull', 'images/life-full.png');
    this.game.load.image('lifeEmpty', 'images/life-empty.png');
    this.game.load.image('livesLeftIcon', 'images/livesLeftIcon.png');

    this.game.load.image('instructionsAD', 'images/instructions-AD.png');
    this.game.load.image('instructionsS', 'images/instructions-S.png');
    this.game.load.image('instructionsW', 'images/instructions-W.png');
    this.game.load.image('instructionsSpace', 'images/instructions-spacebar.png');
    this.game.load.image('win', 'images/win.png');

    
    this.game.load.image('cloudyBackground', 'images/cloudyBg.png');
    this.game.load.image('grassBackground', 'images/bg-grass.png');
    this.game.load.image('bossBackground', 'images/bg-boss.png');
    this.game.load.image('grassTilesPhaser', 'tiled/tile-grass.png');
    this.game.load.image('cloudTile', 'images/basicHubTile.png');
    this.game.load.tilemap('endScene', 'tiled/end.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('grassLevel', 'tiled/prueba-grass.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('bossTilemap', 'tiled/boss.json', null, Phaser.Tilemap.TILED_JSON);

    this.game.load.atlas('kirby', 'images/kirby.png', 'images/kirby.json');

    this.game.load.spritesheet('fatKirby', 'images/kirby-big.png', 24, 24, 10);
    this.game.load.spritesheet('waddleDee', 'images/waddle-dee.png', 16, 16);
    this.game.load.spritesheet('waddleDoo', 'images/eye-thing.png', 16, 16);
    this.game.load.spritesheet('starAttack', 'images/star.png', 16, 16);
    this.game.load.spritesheet('sparkAttack', 'images/spark.png', 48, 36);
    this.game.load.spritesheet('fireAttack', 'images/fire.png', 24, 24);
    this.game.load.spritesheet('knifeAttack', 'images/knife.png', 24, 24);
    this.game.load.spritesheet('thunderAttack', 'images/thunder.png', 24, 24);
    this.game.load.spritesheet('sparky', 'images/sparky.png', 16, 16);
    this.game.load.spritesheet('rocky', 'images/rocky.png', 16, 16);

    this.game.load.audio('hurt', 'sounds/hurt.wav');
    this.game.load.audio('fly', 'sounds/fly.wav');
    this.game.load.audio('jump', 'sounds/jump.wav');
    this.game.load.audio('landing', 'sounds/landing.wav');
    this.game.load.audio('powerUp', 'sounds/powerUp.wav');
    this.game.load.audio('starCollide', 'sounds/starCollide.wav');
    this.game.load.audio('starCrash', 'sounds/starCrash.wav');
    this.game.load.audio('rockCollide', 'sounds/rockCollide.wav');
    this.game.load.audio('rockTransform', 'sounds/rockTransform.wav');
    this.game.load.audio('star', 'sounds/star.wav');
    this.game.load.audio('fire', 'sounds/fire.wav');
    this.game.load.audio('thunder', 'sounds/thunder.wav');
    this.game.load.audio('spark', 'sounds/spark.wav');

    this.game.load.audio('greenGreensIntro', ['music/greenGreensIntro.mp3', 'music/greenGreensIntro.ogg']);
    this.game.load.audio('greenGreensLoop', ['music/greenGreensLoop.mp3', 'music/greenGreensLoop.ogg']);
    this.game.load.audio('boss-short', ['music/boss-short.mp3', 'music/boss-short.ogg']);
    this.game.load.audio('bossMusic', ['music/boss.mp3', 'music/boss.ogg']);
    this.game.load.audio('starMusic', ['music/star.mp3', 'music/star.ogg']);
    this.game.load.audio('victoryDance', ['music/victory.mp3', 'music/victory.ogg']);
    this.game.load.audio('defeatMusic', ['music/dead.mp3', 'music/dead.ogg']);

    this.game.load.bitmapFont('pixelFont', 'fonts/nokia16black.png', 'fonts/nokia16black.xml');
  },

  create: function () {
    //this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.kirbyHealth; // to save Kirby's health when we change scenes
    this.game.kirbyLives;

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
  game.state.add('bossLevel', BossLevel);
  game.state.add('mainMenu', MainMenu);
  game.state.add('gameOver', GameOver);
  game.state.add('instructionsScreen', InstructionsScreen);
  game.state.add('win', Win);

  game.state.start('boot');
};
