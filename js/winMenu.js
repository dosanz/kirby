'use strict';

  var Win = {
  create: function () {
    this.game.sound.stopAll();
    this.bg = this.game.add.sprite(0, 0, 'cloudyBackground');
    this.button1 = this.game.add.button(128, 150, 'playButton', function(){this.game.state.start('mainMenu');}, this, 2, 1, 0);
    this.win = this.game.add.sprite(128, 50, 'win');
    this.button1.anchor.setTo(0.5, 0);
    this.win.anchor.setTo(0.5, 0);
  }
};

module.exports = Win;