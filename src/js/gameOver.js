
'use strict';

  var GameOver = {
  create: function () {
    this.game.sound.stopAll();
    this.bg = this.game.add.sprite(0, 0, 'cloudyBackground');
    this.button1 = this.game.add.button(128, 150, 'quitButton', function(){this.game.state.start('mainMenu');}, this, 2, 1, 0);
    this.button2 = this.game.add.button(128, 50, 'retryButton', function(){this.game.state.start(this.game.lastLevel);}, this, 2, 1, 0);
    this.button1.anchor.setTo(0.5, 0);
    this.button2.anchor.setTo(0.5, 0);

  }
};

module.exports = GameOver;