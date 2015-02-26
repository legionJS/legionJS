define([
  'legion',
  'legion/input',
  'legion/game'
], function(legion, Input, Game) {
  describe('Input', function() {
    it('Keyboard state keydown and keyup', function() {
      legion.game = new Game();
      if (!legion.isNode && navigator.userAgent.indexOf('PhantomJS') >= 0) {
        chai.assert(!Input.state(Input.keys.UP));
        window.callPhantom({sendEvent: ['keydown', 16777235]});
        chai.assert(Input.state(Input.keys.UP));
        window.callPhantom({sendEvent: ['keyup', 16777235]});
        chai.assert(!Input.state(Input.keys.UP));
      }
    });

    it('Keyboard events onDown/onUp', function() {
      var game = new Game();
      if (!legion.isNode && navigator.userAgent.indexOf('PhantomJS') >= 0) {
        var b1 = false;
        var b2 = false;

        Input.onDown(Input.keys.UP, function() {
          b1 = true;
        });
        Input.onUp(Input.keys.UP, function() {
          b2 = true;
        });

        window.callPhantom({sendEvent: ['keydown', 16777235]});
        window.callPhantom({sendEvent: ['keyup', 16777235]});

        game.event._resolveEventQueue();

        chai.assert(b1);
        chai.assert(b2);
      }
    });
  });
});