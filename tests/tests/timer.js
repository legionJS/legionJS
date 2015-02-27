define([
  'legion',
  'legion/game'
], function(legion, Game) {
  describe('Timer', function() {
    it('100ms Second Timer', function(done) {
      var g = new Game();
      var t = g.createTimer({target: 100});
      chai.assert.equal(t.delta(), 100);
      g.loop();
      setTimeout(function() {
        g.paused = true;
        chai.assert.equal(t.triggered(), 1);
        done();
      }, 125);
    });

    it('Looping Timer', function(done) {
      var g = new Game();
      var t = g.createTimer({target: 25, loop: true});
      g.loop();
      setTimeout(function() {
        g.paused = true;
        chai.assert.equal(t.triggered(), 4);
        done();
      }, 120);
    });

    it('Looping Timer + Constant Checking', function(done) {
      var g = new Game();
      var t = g.createTimer({target: 50, loop: true});
      g.loop();
      var count = 0;
      var i = setInterval(function() {
        chai.assert(t.triggered() >= 1);
        if (++count === 2) {
          clearInterval(i);
          g.paused = true;
          done();
        }
      }, 75);
    });

    it('Reset Timer', function(done) {
      var g = new Game();
      var t = g.createTimer({target: 100});
      g.loop();
      setTimeout(function() {
        g.paused = true;
        chai.assert(t._elapsed > 100);
        chai.assert(t.delta() < 0);
        t.reset();
        chai.assert(t._elapsed == 0);
        done();
      }, 150);
    });

  });
});
