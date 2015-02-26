define([
  'legion',
  'legion/event'
], function(legion, Event) {
  describe('Events', function() {
    it('Create and trigger event', function(done) {
      var e = new Event();
      e.on('test', function() {
        done();
      });
      e.trigger('test');
      e._resolveEventQueue();
    });

    it('Multiple events', function() {
      var e = new Event();
      var b1 = false;
      var b2 = false;
      e.on('test1', function() {
        b1 = true;
      });
      e.on('test2', function() {
        b2 = true;
      });
      e.trigger('test1');
      e.trigger('test2');
      e._resolveEventQueue();
      chai.assert(b1);
      chai.assert(b2);
    });

    it('Multiple callbacks on an event', function() {
      var e = new Event();
      var b1 = false;
      var b2 = false;
      e.on('test', function() {
        b1 = true;
      });
      e.on('test', function() {
        b2 = true;
      });
      e.trigger('test');
      e._resolveEventQueue();
      chai.assert(b1);
      chai.assert(b2);
    });
  });
});