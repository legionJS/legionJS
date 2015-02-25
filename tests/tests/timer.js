define([
  'legion',
  'legion/game'
], function(legion, Game) {
  describe('Timer', function() {
    it('1 Second Timer', function(done) {
      var g = new Game();
      var t = g.createTimer({target: 1000});
      g.loop();
      setTimeout(function() {
        g.paused = true;
        chai.assert.equal(t.triggered(), 1);
        done();
      }, 1050);
    });

    it('Looping Timer', function(done) {
      var g = new Game();
      var t = g.createTimer({target: 250, loop: true});
      g.loop();
      setTimeout(function() {
        g.paused = true;
        chai.assert.equal(t.triggered(), 4);
        done();
      }, 1050);
    });

    it('Looping Timer + Constant Checking', function(done) {
      var g = new Game();
      var t = g.createTimer({target: 250, loop: true});
      g.loop();
      var count = 0;
      var i = setInterval(function() {
        chai.assert.equal(t.triggered(), 1);
        if (++count === 4) {
          clearInterval(i);
          g.paused = true;
          done();
        }
      }, 275);
    });
  });
});
