'use strict';

define(['legion/class'], function(Class) {
  var Environment = Class.extend({

    // Width of the environment in pixels, default 0
    width: 0,

    // Height of the environment in pixels, default 0
    height: 0,

    // Array of entities in the environment, default []
    entities: null,

    // Render view background color, default 0x000000
    backgroundColor: 0x000000,

    /*
      init()

      @param {object} properties
    */
    init: function(properties) {
      properties = typeof properties !== 'undefined' ? properties : {};
      this.entities = [];
      this.parent(properties);
    },

    /*
      addEntity() adds the entity to the environment.

      @param {object} entity
    */
    addEntity: function(entity) {
      this.entities.push(entity);
      entity._bindGame(this.game);
    },

    /*
      _update() is called once each frame and calls update for all
      objects within it.
    */
    _update: function() {
      for (var i = 0; i < this.entities.length; i++) {
        this.entities[i]._update();
      }
    },

    /*
      _bindGame(game) overrides the default _bindGame to also bind all
      entities in the environment to the game.
    */
    _bindGame: function(game) {
      this.parent(game);

      for (var i = 0; i < this.entities.length; i++) {
        this.entities[i]._bindGame(game);
      }
    }
  });

  // On node return an environment without rendering
  if (legion.isNode) {
    return Environment;
  } else {

    // Return an environment with rendering
    return Environment.extend({

      // PIXI stage
      stage: null,

      /*
        init()

        @param {object} properties
      */
      init: function(properties) {
        properties = typeof properties !== 'undefined' ? properties : {};
        this.parent(properties);

        this.stage = new PIXI.Stage(
          properties.backgroundColor || this.backgroundColor
        );
      },

      /*
        addEntity() adds the entity to the environment.

        @param {object} entity
      */
      addEntity: function(entity) {
        this.parent(entity);

        if ('displayObject' in entity) {
          this.stage.addChild(entity.displayObject);
        }
      },

      /*
        _render() renders the environment.
      */
      _render: function() {
        legion.renderer.render(this.stage);
      }

    });
  }
});
