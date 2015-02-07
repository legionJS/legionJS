define([], function() {
  legion = {
    debug: true,
    locale: 'en',
    // TODO - implement proper logging.
    log: function(message) {
      if (this.debug) {
        console.log(message);
      }
    }
  };
});
