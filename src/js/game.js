(function() {
  'use strict';

  function Game() {}
  var isoGroup, cursorPos, cursor;
  Game.prototype = {
    create: function () {
 
      // Create a group for our tiles.
      isoGroup = this.game.add.group();

      // Let's make a load of tiles on a grid.
      this.spawnTiles();

      // Provide a 3D position for the cursor
      cursorPos = new Phaser.Plugin.Isometric.Point3();
      //this.input.onDown.add(this.onInputDown, this);
    },

    update: function () {
      // Update the cursor position.
      // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
      // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
      this.game.iso.unproject(this.game.input.activePointer.position, cursorPos);
      // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
      isoGroup.forEach(function (tile) {
        var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
        // If it does, do a little animation and tint change.
        if (!tile.selected && inBounds) {
          console.log('got one!');
          tile.selected = true;
          tile.tint = 0x86bfda;
          this.game.add.tween(tile).to({ isoZ: 4 }, 200, Phaser.Easing.Quadratic.InOut, true);
        }
        // If not, revert back to how it was.
        else if (tile.selected && !inBounds) {
          tile.selected = false;
          tile.tint = 0xffffff;
          this.game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
        }
      });
      
      /**
       * Grid Based Movement taken from http://stackoverflow.com/questions/27785355/moving-a-sprite-along-a-pre-defined-path-in-phaser-io
       * @param {Function} cursors.left.isDown move along single axis
       */
      /* -----------------------------------------------------------
      if (cursors.left.isDown) {
        game.physics.arcade.moveToXY(
          sprite, 
          sprite.body.x - 70, // target x position
          Phaser.Math.snapTo(sprite.body.y, 70), // keep y position the same as we are moving along x axis
          250 // velocity to move at
        );
      }
      ----------------------------------------------------------- */
    },

    render: function () {
      this.game.debug.text('Move your mouse around!', 2, 36, '#ffffff');
      this.game.debug.text(this.game.time.fps || '--', 2, 14, '#a7aebe');
    },
    onInputDown: function () {
      //this.game.state.start('menu');
    },
    spawnTiles: function () {
      var tile;
      for (var xx = 0; xx < 256; xx += 38) {
        for (var yy = 0; yy < 256; yy += 38) {
          // Create a tile using the new game.add.isoSprite factory method at the specified position.
          // The last parameter is the group you want to add it to (just like game.add.sprite)
          tile = this.game.add.isoSprite(xx, yy, 0, 'tile', 0, isoGroup);
          tile.anchor.set(0.5, 0);
        }
      }
    }
  };

  window['larvaeknight'] = window['larvaeknight'] || {};
  window['larvaeknight'].Game = Game;
}());
