define([
  'legion',
  'legion/game'
], function(legion, Game) {
  describe('Timer', function() {
    it('1 Second Timer', function(done) {
      var g = new Game();
      var t = g.createTimer({target: 1000});
      chai.assert.equal(t.delta(), 1000);
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

    it('Reset Timer', function(done) {
      var g = new Game();
      var t = g.createTimer({target: 500});
      g.loop();
      setTimeout(function() {
        g.paused = true;
        chai.assert(t._elapsed > 500);
        chai.assert(t.delta() < 0);
        t.reset();
        chai.assert(t._elapsed == 0);
        done();
      }, 600);
    });

  });
});
