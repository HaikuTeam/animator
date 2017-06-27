var creation = require('@haiku/player/dom');
module.exports = creation(require('./bytecode'), {
  onHaikuComponentDidMount: function(instance) {
    var tl = instance.getDefaultTimeline();
    tl.on('update', function(frame, time) {
      console.log(
        frame,
        Math.round(time),
        tl.getUnboundedFrame(),
        Math.round(tl.getElapsedTime()),
        tl.isPlaying()
      );
    });
  }
});
