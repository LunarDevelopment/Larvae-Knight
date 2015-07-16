(function () {
  'use strict';

  function Game() {}
  var isoGroup, cursorPos, cursor, player, water = [];
  Game.prototype = {
    create: function () {
      var myself = this;
      
      //  A more suitable underwater background color
      myself.game.stage.backgroundColor = '#1873CE';
      // Create a group for our tiles.
      isoGroup = myself.game.add.group();
      // Set the global gravity for IsoArcade.
      myself.game.physics.isoArcade.gravity.setTo(0, 0, -500);
      // we won't really be using IsoArcade physics, but I've enabled it anyway so the debug bodies can be seen
      isoGroup.enableBody = true;
      //isoGroup.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;

      var tileArray = [];
      tileArray[0] = 'water';
      tileArray[1] = 'sand';
      tileArray[2] = 'grass';
      tileArray[3] = 'stone';
      tileArray[4] = 'wood';
      tileArray[5] = 'watersand';
      tileArray[6] = 'grasssand';
      tileArray[7] = 'sandstone';
      tileArray[8] = 'bush1';
      tileArray[9] = 'bush2';
      tileArray[10] = 'mushroom';
      tileArray[11] = 'wall';
      tileArray[12] = 'window';

      var tiles = [
            9, 2, 1, 1, 4, 4, 1, 6, 2, 10, 2,
            2, 6, 1, 0, 4, 4, 0, 0, 2, 2, 2,
            6, 1, 0, 0, 4, 4, 0, 0, 8, 8, 2,
            0, 0, 0, 0, 4, 4, 0, 0, 0, 9, 2,
            0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0,
            11, 11, 12, 11, 3, 3, 11, 12, 11, 11, 11,
            3, 7, 3, 3, 3, 3, 3, 3, 7, 3, 3,
            7, 1, 7, 7, 3, 3, 7, 7, 1, 1, 7
        ];

      var size = 32;

      var i = 0,
        tile;
      for (var y = size; y <= myself.game.physics.isoArcade.bounds.frontY - size; y += size) {
        for (var x = size; x <= myself.game.physics.isoArcade.bounds.frontX - size; x += size) {
          // this bit would've been so much cleaner if I'd ordered the tileArray better, but I can't be bothered fixing it :P
          tile = myself.game.add.isoSprite(x, y, tileArray[tiles[i]].match('water') ? 0 : myself.game.rnd.pick([2, 3, 4]), 'tileset', tileArray[tiles[i]], isoGroup);
          tile.anchor.set(0.5, 1);
          tile.smoothed = false;
          tile.body.moves = false;
          if (tiles[i] === 4) {
            tile.isoZ += 6;
          }
          if (tiles[i] <= 10 && (tiles[i] < 5 || tiles[i] > 6)) {
            tile.scale.x = myself.game.rnd.pick([-1, 1]);
          }
          if (tiles[i] === 0) {
            water.push(tile);
          }
          i++;
        }
      }


              // Create another cube as our 'player', and set it up just like the cubes above.
        player = myself.game.add.isoSprite(75, 138, 0, 'larvaeknight', 'sprite15', isoGroup);
        player.animations.add('wbl', ['sprite17','sprite18'], 3, true, false);
        player.anchor.set(0.4, 0.2);
        myself.game.physics.isoArcade.enable(player);
        player.body.collideWorldBounds = true;
        
        player.animations.play('wbl');
        // Set up our controls.
        myself.cursors = myself.game.input.keyboard.createCursorKeys();

        myself.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR
        ]);

        var space = myself.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        space.onDown.add(function () {
            player.body.velocity.z = 300;
        }, myself);
      // Let's make a load of tiles on a grid.
      //myself.spawnTiles();

      // Provide a 3D position for the cursor
      cursorPos = new Phaser.Plugin.Isometric.Point3();
      //this.input.onDown.add(this.onInputDown, this);
    },

    update: function () {
      var myself = this;
      // Update the cursor position.
      // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
      // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
      myself.game.iso.unproject(myself.game.input.activePointer.position, cursorPos);

      water.forEach(function (w) {
        w.isoZ = (-2 * Math.sin((myself.game.time.now + (w.isoX * 7)) * 0.004)) + (-1 * Math.sin((myself.game.time.now + (w.isoY * 8)) * 0.005));
        w.alpha = Phaser.Math.clamp(1 + (w.isoZ * 0.1), 0.2, 1);
      });

      // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
      isoGroup.forEach(function (tile) {
        var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
        // If it does, do a little animation and tint change.
        if (!tile.selected && inBounds) {
          console.log(water);
          console.log(tile);
          tile.selected = true;
          tile.tint = 0x86bfda;
          myself.game.add.tween(tile).to({
            // This causes the tile to raise and lower itself, however needs a fix because it breaks the current level design. if (wter) dont move, if land, read backup isoZ and return? or add tween to space.. 
            //isoZ: 4
          }, 200, Phaser.Easing.Quadratic.InOut, true);
        }
        // If not, revert back to how it was.
        else if (tile.selected && !inBounds) {
          tile.selected = false;
          tile.tint = 0xffffff;
          myself.game.add.tween(tile).to({
            // This causes the tile to raise and lower itself, however needs a fix because it breaks the current level design. if (wter) dont move, if land, read backup isoZ and return? or add tween to space.. 
            //isoZ: 0
          }, 200, Phaser.Easing.Quadratic.InOut, true);
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
      var myself = this;
      /*isoGroup.forEach(function (tile) {
        myself.game.debug.body(tile, 'rgba(189, 221, 235, 0.6)', false);
      });*/
      myself.game.debug.text('Move your mouse around!', 2, 36, '#ffffff');
      myself.game.debug.text(myself.game.time.fps || '--', 2, 14, '#a7aebe');
    },
    onInputDown: function () {
      //this.game.state.start('menu');
    }
    /*,
    spawnTiles: function () {
      var myself = this;
      var tile;
      for (var xx = 0; xx < 256; xx += 38) {
        for (var yy = 0; yy < 256; yy += 38) {
          // Create a tile using the new game.add.isoSprite factory method at the specified position.
          // The last parameter is the group you want to add it to (just like game.add.sprite)
          tile = myself.game.add.isoSprite(xx, yy, 0, 'tile', 0, isoGroup);
          tile.anchor.set(0.5, 0);
        }
      }
    }
    */
  };

  window['larvaeknight'] = window['larvaeknight'] || {};
  window['larvaeknight'].Game = Game;
}());