'use strict';

define(['legion/class'], function(Class) {
  var Environment = Class.extend({

    className: 'Environment',

    // Width of the environment in pixels, default 0
    width: 0,

    // Height of the environment in pixels, default 0
    height: 0,

    // Map of Entities, default {}
    entities: null,

    // Hashmap of entities to access them by id
    //entityMap: null,

    /*
      init()

      @param {object} properties
    */
    init: function(properties) {
      properties = typeof properties !== 'undefined' ? properties : {};
      this.entities = {};
      //this.entityMap = {};
      this.parent(properties);
    },

    /*
      addEntity() adds the entity to the environment.

      @param {object} entity
    */
    addEntity: function(entity) {
      //this.entities.push(entity);
      entity._bindGame(this.game);
      this.entities[entity.id] = entity;
    },

    /*
      forEachEntity() calls a function for each entity in the environment.

      @param {function} func
    */
    forEachEntity: function(func) {
      for (var id in this.entities) {
        if (this.entities.hasOwnProperty(id)) {
          func(this.entities[id]);
        }
      }
    },

    /*
      _update() is called once each frame and calls update for all
      objects within it.
    */
    _update: function() {
      /*for (var i = 0; i < this.entities.length; i++) {
        this.entities[i]._update();
      }*/
      this.forEachEntity(function(entity) {
        entity._update();
      });
    },

    /*
      _bindGame(game) overrides the default _bindGame to also bind all
      entities in the environment to the game.
    */
    _bindGame: function(game) {
      this.parent(game);

      /*for (var i = 0; i < this.entities.length; i++) {
        this.entities[i]._bindGame(game);
      }*/
      this.forEachEntity(function(entity) {
        entity._bindGame(game);
      });
    },

    _getSyncMessage: function() {
      var message = [];
      /*for (var i = 0; i < this.entities.length; i++) {
        if (legion.isNode || (this.entities[i].syncDirection == legion.syncDirection)) {
          message.push(this.entities[i].serialize());
        }
      }*/
      this.forEachEntity(function(entity) {
        if (legion.isNode || (entity.syncDirection == legion.syncDirection)) {
          message.push(entity.serialize());
        }
      });
      return message;
    },


    _sync: function(entities) {
      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        //If the entity is new to the client/server.
        if (this.entities[entity.id] === undefined) {
          this.addEntity(new legion.classes[entity.className](entity));
          //this.entities.push(entity);
        } else {
          this.entities[entity.id].mixin(entity);
        }
      }
    },
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
