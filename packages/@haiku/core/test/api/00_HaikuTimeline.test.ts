import * as tape from 'tape';
import RenderTest from 'haiku-testing/src/RenderTest';

tape('HaikuTimeline', (t) => {
  t.test('gotoAndStop', (t) => {
    const template = {
      elementName: 'div',
      attributes: {'haiku-id': 'abcde'},
      children: [],
    };

    const timelines = {
      Default: {
        'haiku:abcde': {
          opacity: {
            0: {value: 0, curve: 'linear'},
            1000: {value: 1},
          },
        },
      },
    };

    const rt = new RenderTest('my/folder', {template, timelines}, {}, (rt, done) => {
      rt.component.getDefaultTimeline().play();
      t.equal(rt.$mount.firstChild.haiku.virtual.layout.opacity, 0, 'initial opacity is 0');
      rt.component.getDefaultTimeline().seek(750, 'ms');
      rt.context.tick();
      t.equal(rt.$mount.firstChild.haiku.virtual.layout.opacity, 0.75, 'seek to 750ms');
      setTimeout(() => {
        t.notEqual(rt.$mount.firstChild.haiku.virtual.layout.opacity, 0.75, 'playhead is moving');
        rt.component.getDefaultTimeline().gotoAndStop(500, 'ms');
        setTimeout(() => {
          t.equal(rt.$mount.firstChild.haiku.virtual.layout.opacity, 0.5, 'stopped at 500ms');
          setTimeout(() => {
            t.equal(rt.$mount.firstChild.haiku.virtual.layout.opacity, 0.5, 'still stopped at 500ms');
            done();
          },         100);
        },         100);
      },         100);
    });

    rt.run(() => {
      t.end();
    });
  });

  t.end();
});
