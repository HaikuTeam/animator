import * as tape from 'tape';
import {createRenderTest} from '../../TestHelpers';

tape(
  'render.dom.alwaysComputeSizing.on',
  (t) => {
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

    const config = {
      sizing: 'cover',
      alwaysComputeSizing: true,
    };

    createRenderTest(
      template,
      timelines,
      config,
      (err, mount, renderer, context, component, teardown) => {
        if (err) {
          throw err;
        }
        let scale = mount.firstChild.haiku.virtual.layout.scale;
        t.equal(
          scale.x,
          0.5,
          'cover sizing scales x down by 1/2 to fit container',
        );
        t.equal(
          scale.y,
          0.5,
          'cover sizing scales y down by 1/2 to fit container',
        );
        mount.width /= 2;
        mount.height /= 2;
        context.tick();
        scale = mount.firstChild.haiku.virtual.layout.scale;
        t.equal(
          scale.x,
          0.25,
          'cover sizing scales x down by 1/4 to fit new container',
        );
        t.equal(
          scale.y,
          0.25,
          'cover sizing scales y down by 1/4 to fit new container',
        );
        teardown();
      },
    );

    t.end();
  },
);

tape(
  'render.dom.alwaysComputeSizing.off',
  (t) => {
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

    const config = {
      sizing: 'cover',
      alwaysComputeSizing: false,
    };

    createRenderTest(
      template,
      timelines,
      config,
      (err, mount, renderer, context, component, teardown) => {
        if (err) {
          throw err;
        }
        let scale = mount.firstChild.haiku.virtual.layout.scale;
        context.tick();
        t.equal(
          scale.x,
          0.5,
          'cover sizing scales x down by 1/2 to fit container',
        );
        t.equal(
          scale.y,
          0.5,
          'cover sizing scales y down by 1/2 to fit container',
        );
        mount.width /= 2;
        mount.height /= 2;
        context.tick();
        scale = mount.firstChild.haiku.virtual.layout.scale;
        t.equal(
          scale.x,
          0.5,
          'cover sizing.x does not scale although the size of the mount changed',
        );
        t.equal(
          scale.y,
          0.5,
          'cover sizing.y does not scale although the size of the mount changed',
        );
        teardown();
      },
    );

    t.end();
  },
);
