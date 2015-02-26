'use strict';

define(['legion/class'], function(Class) {
  var Environment = Class.extend({

    // Width of the environment in pixels, default 0
    width: 0,

    // Height of the environment in pixels, default 0
    height: 0,

    // Array of entities in the environment, default []
    entities: null,

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
    },

    /*
      _update() is called once each frame and calls update for all
      objects within it.
    */
    _update: function() {
      for (var i = 0; i < this.entities.length; i++) {
        this.entities[i]._update();
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

        var backgroundColor = 'backgroundColor' in properties ?
          properties.backgroundColor : 0x000000;

        this.stage = new PIXI.Stage(backgroundColor);
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
