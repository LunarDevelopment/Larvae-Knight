(function() {
  'use strict';

  function Preloader() {
    this.asset = null;
    this.ready = false;
  }

  Preloader.prototype = {
    preload: function () {
      this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
      this.load.setPreloadSprite(this.asset);

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.loadResources();
      this.game.time.advancedTiming = true;
      this.game.debug.renderShadow = false;
      this.game.stage.disableVisibilityChange = true;

      
      // Add and enable the plug-in.
      this.game.plugins.add(new Phaser.Plugin.Isometric(this.game));
      // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
      // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
      this.game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
      this.game.iso.anchor.setTo(0.5, 0.2);

      this.ready = true;
    },

    loadResources: function () {
      // load your assets here
      this.game.load.atlasJSONHash('tileset', '../assets/tileset.png', '../assets/tileset.json');
      this.game.load.image('tile', '../assets/tile.png');
    },

    create: function () {

    },

    update: function () {
      // if (!!this.ready) {
        this.game.state.start('menu');
      // }
    },

    onLoadComplete: function () {
      // this.ready = true;
    }
  };

  window['larvaeknight'] = window['larvaeknight'] || {};
  window['larvaeknight'].Preloader = Preloader;
}());
