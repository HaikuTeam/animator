import HaikuElement from '@core/HaikuElement';
import * as tape from 'tape';

tape(
  'HaikuElement.computeLayout',
  (t) => {
    const {offset, matrix, opacity, origin, shown, size, computed} = HaikuElement.computeLayout(
      { // targetNode
        elementName: 'div',
        attributes: {},
        children: [],
        layout: {
          shown: true,
          opacity: 1,
          offset: {
            x: 0,
            y: 0,
            z: 0,
          },
          origin: {
            x: 0,
            y: 0,
            z: 0,
          },
          translation: {
            x: 33,
            y: 0,
            z: 0,
          },
          rotation: {
            x: 0,
            y: 0,
            z: 0,
          },
          scale: {
            x: 1,
            y: 1,
            z: 1,
          },
          shear: {
            xy: 0,
            xz: 0,
            yz: 0,
          },
          sizeProportional: {
            x: 0.5,
            y: 1,
            z: 1,
          },
          sizeMode: {
            x: 0,
            y: 0,
            z: 0,
          },
          sizeDifferential: {
            x: 0,
            y: 0,
            z: 0,
          },
          sizeAbsolute: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
      },
      { // parentLayout
        shown: true,
        opacity: 1,
        offset: {
          x: 0,
          y: 0,
          z: 0,
        },
        origin: {
          x: 0,
          y: 0,
          z: 0,
        },
        translation: {
          x: 33,
          y: 0,
          z: 0,
        },
        rotation: {
          x: 0,
          y: 0,
          z: 0,
          // w: 0,
        },
        orientation: {
          x: 0,
          y: 0,
          z: 0,
          w: 0,
        },
        scale: {
          x: 1,
          y: 1,
          z: 1,
        },
        shear: {
          xy: 0,
          xz: 0,
          yz: 0,
        },
        sizeProportional: {
          x: 0.5,
          y: 1,
          z: 1,
        },
        sizeMode: {
          x: 0,
          y: 0,
          z: 0,
        },
        sizeDifferential: {
          x: 0,
          y: 0,
          z: 0,
        },
        sizeAbsolute: {
          x: 0,
          y: 0,
          z: 0,
        },
        computed: {
          shown: true,
          opacity: 1,
          offset: {
            x: 0,
            y: 0,
            z: 0,
          },
          origin: {
            x: 0,
            y: 0,
            z: 0,
          },
          translation: {
            x: 33,
            y: 0,
            z: 0,
          },
          rotation: {
            x: 0,
            y: 0,
            z: 0,
            // w: 0,
          },
          scale: {
            x: 1,
            y: 1,
            z: 1,
          },
          shear: {
            xy: 0,
            xz: 0,
            yz: 0,
          },
          sizeProportional: {
            x: 0.5,
            y: 1,
            z: 1,
          },
          sizeMode: {
            x: 0,
            y: 0,
            z: 0,
          },
          sizeDifferential: {
            x: 0,
            y: 0,
            z: 0,
          },
          sizeAbsolute: {
            x: 0,
            y: 0,
            z: 0,
          },
          bounds: {
            left: null,
            right: null,
            bottom: null,
            top: null,
            back: null,
            front: null,
          },
          matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 33, 0, 0, 1],
          size: {
            x: 852,
            y: 839,
            z: 0,
          },
        },
      },
    );

    t.deepEqual(
      matrix,
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 33, 0, 0, 1],
    );
    t.deepEqual(
      offset,
      {
        x: 0,
        y: 0,
        z: 0,
      },
    );
    t.equal(
      opacity,
      1,
    );
    t.deepEqual(
      origin,
      {
        x: 0,
        y: 0,
        z: 0,
      },
    );
    t.true(shown);
    t.deepEqual(
      size,
      {
        x: 426,
        y: 839,
        z: 0,
      },
    );
    t.is(
      undefined,
      computed,
    );
    t.end();
  },
);
