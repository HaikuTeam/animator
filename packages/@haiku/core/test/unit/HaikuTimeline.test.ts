import HaikuTimeline from '@core/HaikuTimeline';
import * as tape from 'tape';

tape(
  'HaikuTimeline.modulo',
  (t) => {
    t.equal(HaikuTimeline.modulo(0, 100), 0);
    t.equal(HaikuTimeline.modulo(100, 100), 0);
    t.equal(HaikuTimeline.modulo(200, 100), 0);
    t.equal(HaikuTimeline.modulo(99, 100), 99);
    t.equal(HaikuTimeline.modulo(101, 100), 1);
    t.equal(HaikuTimeline.modulo(201, 100), 1);
    t.equal(HaikuTimeline.modulo(-1, 100), 99);
    t.end();
  }
);

tape(
  'HaikuTimeline.didTimeLoop',
  (t) => {
    t.equal(HaikuTimeline.didTimeLoop(62, 103, 100), true);
    t.equal(HaikuTimeline.didTimeLoop(62, 100, 100), true);
    t.equal(HaikuTimeline.didTimeLoop(62, 99, 100), false);
    t.equal(HaikuTimeline.didTimeLoop(100, 110, 100), false);
    t.equal(HaikuTimeline.didTimeLoop(101, 110, 100), false);
    t.equal(HaikuTimeline.didTimeLoop(100, 100, 100), false);
    t.equal(HaikuTimeline.didTimeLoop(0, 100, 100), false);
    t.equal(HaikuTimeline.didTimeLoop(0, 0, 100), false);
    t.end();
  }
);
