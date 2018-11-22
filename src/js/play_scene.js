'use strict';

  var PlayScene = {
  create: function () {
    var logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);

    // meter a kirby en el mundo
    // var kirby = new Kirby(this.game, 10, 10);
    // this.game.world.addChild(kirby);
  }
};

module.exports = PlayScene;