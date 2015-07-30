'use strict';

define([
  'legion/environment',
  'legion/game',
  'legion/entity',
  'legion/graphics/displayobject',
  'legion/graphics/shape',
  'legion/input',
  'legion/util',
  'game/bunny'
], function(Environment, Game, Entity, DisplayObject, Shape, Input, Util, Bunny) {
  return Game.extend({
    serverInit: function() {
      this.parent(arguments);
      this.setEnvironment(new Environment());
    },

    clientInit: function() {
      this.parent(arguments);
      var env = new Environment({backgroundColor: 0x66FF99});
      this.setEnvironment(env);
      /*legion.constructors = {
        'Bunny': Bunny,
      };*/

      /* Basic Shapes */

      /*var CustomEnt = Entity.implement([DisplayObject, Shape])
        .extend({
          _update: function() {
            this.parent();

            //Loop the entities
            if (this.x > 500) {
              this.x = -100;
            }

            if (this.y > 500) {
              this.y = -100;
            }
          }
        });

      // Create an entity that implements Shape and create
      // a rectangle instance.
      var ent2 = new CustomEnt({
        w: 50, h: 50, x: 300, y:300, vx: 200,
        color: 0xFFFF00, shape: 'rect'
      });
      env.addEntity(ent2);

      var ent3 = new CustomEnt({
        x: 250, y:250, r: 30, vx: 200, vy: 200,
        color: 0x0000FF, shape: 'circle'
      });
      env.addEntity(ent3);*/
      this.event.on('removeEntity', Util.hitch(this, function(id) {
        this.environment.removeEntity(id);
      }));
      this.socket.on('removeEntity', Util.hitch(this, function(id) {
        this.event.trigger('removeEntity', [id]);
      }));
    },

    /*
      Create a bunny object for the player on the server.
    */
    serverConnectionMessage: function(socket) {
      var message = this.parent(socket);
      console.log("connectionMessage", message);
      var bunny = new Bunny({clientID: message.clientID, sync: true});
      this.environment.addEntity(bunny);
      socket.bunny = bunny;

      message.bunny = bunny.serialize();
      message.bunny.syncDirection = 'up';
      return message;
    },

    serverOnDisconnect: function(socket) {
      this.parent(socket);
      this.environment.removeEntity(socket.bunny.id);
      this.io.emit('removeEntity', socket.bunny.id);
    },

    /*
      Add the bunny to the env when the server sends it.
    */
    clientOnConnection: function(message) {
      this.parent(message);
      this.clientID = message.clientID;
      message.bunny.sync = true;
      this.environment.addEntity(new Bunny(message.bunny));
    }
  })
});
