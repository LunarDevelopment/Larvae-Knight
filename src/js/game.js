(function() {
  'use strict';

  function Game() {}

  Game.prototype = {
    create: function () {
      this.input.onDown.add(this.onInputDown, this);
    },

    update: function () {
      /**
       * Grid Based Movement taken from http://stackoverflow.com/questions/27785355/moving-a-sprite-along-a-pre-defined-path-in-phaser-io
       * @param {Function} cursors.left.isDown move along single axis
       */
      if (cursors.left.isDown) {
        game.physics.arcade.moveToXY(
          sprite, 
          sprite.body.x - 70, // target x position
          Phaser.Math.snapTo(sprite.body.y, 70), // keep y position the same as we are moving along x axis
          250 // velocity to move at
        );
      }
    },

    onInputDown: function () {
      this.game.state.start('menu');
    }
  };

  window['larvaeknight'] = window['larvaeknight'] || {};
  window['larvaeknight'].Game = Game;
}());
