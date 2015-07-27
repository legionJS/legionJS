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

    // Render view background color, default 0x000000
    backgroundColor: 0x000000,

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
      console.log(entity.serialize());
      //this.entities.push(entity);
      entity._bindGame(this.game);
      this.entities[entity.id] = entity;
    },

    removeEntity: function(entityID) {
      // If the entity is passed in get its id
      if (entityID instanceof Class) {
        entityID = entityID.id;
      }
      var entity = this.entities[entityID];

      this.entities[entityID] = undefined;

      return entity;
    },



    /*
      forEachEntity() calls a function for each entity in the environment.

      @param {function} func
    */
    forEachEntity: function(func) {
      for (var id in this.entities) {
        if (this.entities.hasOwnProperty(id) &&
          this.entities[id] !== undefined) {
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
      this.forEachEntity(function(entity) {
        if (entity.sync) {
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
          this.addEntity(new legion._classes[entity.className](entity));
          //this.entities.push(entity);
        } else {
          // Don't override local copy with servers if it's the player's entity.
          if (!this.game.clientID || this.game.clientID !== entity.clientID) {
            this.entities[entity.id].mixin(entity);
          }
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

        this.stage = new PIXI.Stage(this.backgroundColor);
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

      removeEntity: function(entityID) {
        var entity = this.parent(entityID);

        if ('displayObject' in entity) {
          this.stage.removeChild(entity.displayObject);
        }

        return entity;
      },

      /*
        _render() renders the environment.
      */
      _render: function() {
        legion._renderer.render(this.stage);
      }

    });
  }
});
