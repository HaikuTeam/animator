import * as tape from 'tape';
import RenderTest from 'haiku-testing/src/RenderTest';

tape('render.dom.alwaysComputeSizing.on', (t) => {
  const template = {
    elementName: 'div',
    attributes: {'haiku-id': 'abcde'},
    children: [],
  };

  const timelines = {
    Default: {
      'haiku:abcde': {
        'sizeAbsolute.x': {0: {value: 1600}},
        'sizeAbsolute.y': {0: {value: 1200}},
      },
    },
  };

  const config = {sizing: 'cover', alwaysComputeSizing: true};

  const rt = new RenderTest('my/folder', {template, timelines}, config, (rt, done) => {
    let scale = rt.$mount.firstChild.haiku.virtual.layout.scale;
    t.equal(scale.x, 0.5, 'cover sizing scales x down by 1/2 to fit container');
    t.equal(scale.y, 0.5, 'cover sizing scales y down by 1/2 to fit container');
    rt.$mount.width /= 2;
    rt.$mount.height /= 2;
    rt.context.tick();
    scale = rt.$mount.firstChild.haiku.virtual.layout.scale;
    t.equal(scale.x, 0.25, 'cover sizing scales x down by 1/4 to fit new container');
    t.equal(scale.y, 0.25, 'cover sizing scales y down by 1/4 to fit new container');

    done();
  });

  rt.run(() => {
    t.end();
  });
});

tape('render.dom.alwaysComputeSizing.off', (t) => {
  const template = {
    elementName: 'div',
    attributes: {'haiku-id': 'abcde'},
    children: [],
  };

  const timelines = {
    Default: {
      'haiku:abcde': {
        'sizeAbsolute.x': {0: {value: 1600}},
        'sizeAbsolute.y': {0: {value: 1200}},
      },
    },
  };

  const config = {sizing: 'cover', alwaysComputeSizing: false};

  const rt = new RenderTest('my/folder', {template, timelines}, config, (rt, done) => {
    let scale = rt.$mount.firstChild.haiku.virtual.layout.scale;
    rt.context.tick();
    t.equal(scale.x, 0.5, 'cover sizing scales x down by 1/2 to fit container');
    t.equal(scale.y, 0.5, 'cover sizing scales y down by 1/2 to fit container');
    rt.$mount.width /= 2;
    rt.$mount.height /= 2;
    rt.context.tick();
    scale = rt.$mount.firstChild.haiku.virtual.layout.scale;
    t.equal(scale.x, 0.5, 'cover sizing.x does not scale although the size of the mount changed');
    t.equal(scale.y, 0.5, 'cover sizing.y does not scale although the size of the mount changed');

    done();
  });

  rt.run(() => {
    t.end();
  });
});
