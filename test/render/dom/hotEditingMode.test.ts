import * as tape from 'tape';
import * as TestHelpers from '../../TestHelpers';

tape(
  'render.dom.hotEditingMode.on',
  (t) => {
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

    TestHelpers.createRenderTest(
      template,
      timelines,
      config,
      (err, mount, renderer, context, component, teardown) => {
        if (err) {
          throw err;
        }
        context.tick();
        t.equal(
          mount.firstChild.haiku.virtual.layout.opacity,
          1,
          'initial opacity is 1',
        );
        component.bytecode.timelines.Default['haiku:abcde'].opacity['0'].value = 0.5;
        component.clearCaches();
        component.addHotComponent({
          timelineName: 'Default',
          selector: 'haiku:abcde',
          propertyNames: ['opacity'],
        });
        context.tick();
        t.equal(
          mount.firstChild.haiku.virtual.layout.opacity,
          0.5,
          'non-animated property updated in hot-editing mode',
        );
        teardown();
      },
    );

    t.end();
  },
);

tape(
  'render.dom.hotEditingMode.off',
  (t) => {
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

    TestHelpers.createRenderTest(
      template,
      timelines,
      config,
      (err, mount, renderer, context, component, teardown) => {
        if (err) {
          throw err;
        }
        context.tick();
        t.equal(
          mount.firstChild.haiku.virtual.layout.opacity,
          1,
          'initial opacity is 1',
        );
        component.bytecode.timelines.Default['haiku:abcde'].opacity['0'].value = 0.5;
        component.clearCaches();
        context.tick();
        t.equal(
          mount.firstChild.haiku.virtual.layout.opacity,
          1,
          'non-animated property is static without hot-editing mode',
        );
        teardown();
      },
    );

    t.end();
  },
);
