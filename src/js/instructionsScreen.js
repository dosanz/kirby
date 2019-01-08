'use strict';


var InstructionsScreen = {
  create: function () {
    this.bg = this.game.add.sprite(0, 0, 'cloudyBackground');
    
    this.button1 = this.game.add.button(128, 180, 'playButton', function(){this.game.state.start('play');}, this, 2, 1, 0);
    this.button1.anchor.setTo(0.5, 0);

    this.AD = this.game.add.image(16*4, 16*5, 'instructionsAD');
    this.W = this.game.add.image(72, 40, 'instructionsW');
    this.S = this.game.add.image(72, 120, 'instructionsS');
    this.space = this.game.add.image(16*10, 16*5, 'instructionsSpace');
  }
};

module.exports = InstructionsScreen;