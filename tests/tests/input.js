define([
  'legion',
  'legion/input'
], function(legion, Input) {
  describe('Input', function() {
    it('Keyboard keydown and keyup', function() {
      if (!legion.isNode && navigator.userAgent.indexOf('PhantomJS') >= 0) {
        chai.assert(!Input.state(Input.keys.UP));
        window.callPhantom({sendEvent: ['keydown', 16777235]});
        console.log(Input.state(Input.keys.UP));
        window.callPhantom({sendEvent: ['keyup', 16777235]});
        chai.assert(!Input.state(Input.keys.UP));
      }
    });
  });
});