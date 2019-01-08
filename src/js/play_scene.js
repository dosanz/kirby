'use strict';

var GameObject = require('./gameObject.js');
var Character = require('./character.js');
var EndStar = require('./endStar.js');
var Kirby = require('./Kirby.js');
var Enemy = require('./enemy.js');

  var PlayScene = {
  create: function () {

    // TODO: Add buttons make it beautiful etc
        // go back to level selection button
        // quit/back to main menu button
    this.input.keyboard.addKey (Phaser.Keyboard.ESC).onDown.add(
      function(){this.game.paused = !this.game.paused;}, this);

    this.input.keyboard.addKey (Phaser.Keyboard.Q).onDown.add(
      function(){if(this.game.paused){this.game.paused = false; this.game.state.start('mainMenu');};}, this);


    // level change test
    // this.input.keyboard.addKey (Phaser.Keyboard.P).onDown.add(function(){this.game.state.start('level1');}, this);
    
    //this.input.keyboard.addKey (Phaser.Keyboard.R).onDown.add(this.restart(), this);
    // var logo = this.game.add.sprite(
    //   this.game.world.centerX, this.game.world.centerY, 'logo');
    // logo.anchor.setTo(0.5, 0.5);

    // Map test -- TODO: maybe migrate to a specific class? like level1 or grassLevel
    this.game.stage.backgroundColor = 'ffffff';
    this.bg = this.game.add.image(0, 0, 'grassBackground');
    this.bg.fixedToCamera = true;
    this.map = this.game.add.tilemap('grassLevel');
    this.map.addTilesetImage('grass', 'grassTilesPhaser');
    this.floor = this.map.createLayer('floor');
    this.map.setCollisionBetween(1, 2000, true, 'floor');
    this.floor.resizeWorld();

    // meter a kirby en el mundo
    this.game.kirbyPowerUp = 'normal';
    this.player = new Kirby(this.game, 100, 10, this);
    this.game.world.addChild(this.player);
    this.game.kirbyIndex = 2;

    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
    
    this.attack
    this.waddleDee = new Enemy(this.game, 40, 40, 'normal', this.player, this);
    this.game.world.addChild(this.waddleDee);
    this.waddleDee1 = new Enemy(this.game, 200, 40, 'normal', this.player, this);
    this.game.world.addChild(this.waddleDee1);
    this.waddleDee2 = new Enemy(this.game, 60, 40, 'normal', this.player, this);
    this.game.world.addChild(this.waddleDee2);
    this.waddleDee3 = new Enemy(this.game, 80, 40, 'thunder', this.player, this);
    this.game.world.addChild(this.waddleDee3);

    this.endStar = new EndStar(this.game,700, 112, 'starAttack', this.player);
    this.game.world.addChild(this.endStar);

    // set music
    this.greenGreensIntro = this.game.add.audio('greenGreensIntro');
    this.greenGreensLoop = this.game.add.audio('greenGreensLoop');

    this.game.sound.setDecodedCallback([ this.greenGreensIntro, this.greenGreensLoop ], this.start, this);
  },

  start: function(){
    this.greenGreensIntro.play();
    this.greenGreensIntro.onStop.add(this.loopMusic, this);

  },


  update: function(){
    if (!this.player.inCamera) {
      this.game.kirbyPowerUp = this.player.currentPowerUp;
        this.greenGreensLoop.stop();
        this.game.state.start('bossLevel');
    }
    

    this.game.physics.arcade.collide(this.player, this.floor);
    // TODO: do this for the enemy group too
  },

  loopMusic: function() {
    this.greenGreensLoop.loop = true;
    this.greenGreensLoop.play();
  }
};

module.exports = PlayScene;