import * as tape from 'tape';
import RenderTest from 'haiku-testing/src/RenderTest';

tape('render.dom.hotEditingMode.on', (t) => {
  const template = {
    elementName: 'div',
    attributes: {'haiku-id': 'abcde'},
    children: [],
  };

  const timelines = {
    Default: {
      'haiku:abcde': {
        opacity: {0: {value: 1}},
      },
    },
  };

  const config = {hotEditingMode: true};

  const rt = new RenderTest('my/folder', {template, timelines}, config, (rt, done) => {
    rt.context.tick();
    t.equal(rt.$mount.firstChild.haiku.virtual.layout.opacity, 1, 'initial opacity is 1');
    rt.component.bytecode.timelines.Default['haiku:abcde'].opacity['0'].value = 0.5;
    rt.component.clearCaches();
    rt.component.addHotComponent({
      timelineName: 'Default',
      selector: 'haiku:abcde',
      propertyNames: ['opacity'],
    });
    rt.context.tick();
    t.equal(
      rt.$mount.firstChild.haiku.virtual.layout.opacity,
      0.5,
      'non-animated property updated in hot-editing mode',
    );
    done();
  });

  rt.run(() => {
    t.end();
  });
});

tape('render.dom.hotEditingMode.off', (t) => {
  const template = {
    elementName: 'div',
    attributes: {'haiku-id': 'abcde'},
    children: [],
  };

  const timelines = {
    Default: {
      'haiku:abcde': {
        opacity: {0: {value: 1}},
      },
    },
  };

  const config = {hotEditingMode: false};

  const rt = new RenderTest('my/folder', {template, timelines}, config, (rt, done) => {
    rt.context.tick();
    t.equal(rt.$mount.firstChild.haiku.virtual.layout.opacity, 1, 'initial opacity is 1');
    rt.component.bytecode.timelines.Default['haiku:abcde'].opacity['0'].value = 0.5;
    rt.component.clearCaches();
    rt.context.tick();
    // tslint:disable-next-line:max-line-length
    t.equal(rt.$mount.firstChild.haiku.virtual.layout.opacity, 1, 'non-animated property is static without hot-editing mode');
    done();
  });

  rt.run(() => {
    t.end();
  });
});
