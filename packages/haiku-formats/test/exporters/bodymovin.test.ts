import * as tape from 'tape';

import {HaikuBytecode} from 'haiku-common/lib/types';

import {BodymovinExporter} from '../../lib/exporters/bodymovin/bodymovinExporter';
import baseBytecode from './baseBytecode';

const rawOutput = (bytecode: HaikuBytecode) => (new BodymovinExporter(bytecode).rawOutput());

const overrideShapeAttributes = (bytecode, attributes) => {
  bytecode.timelines.Default['haiku:shape'] = attributes;
  return bytecode;
};

const overrideShapeElement = (bytecode, elementName) => {
  bytecode.template.children[0].children[0].elementName = elementName;
};

tape('BodymovinExporter', (test: tape.Test) => {
  test.test('requires a div wrapper', (test: tape.Test) => {
    const bytecode = {
      ...baseBytecode, template: {
        ...baseBytecode.template, elementName: 'span',
      },
    };
    test.throws(rawOutput.bind(undefined, bytecode));
    test.end();
  });

  test.test('requires svg wrapper children', (test: tape.Test) => {
    const bytecode = {
      ...baseBytecode, template: {
        ...baseBytecode.template, children: [{
          elementName: 'div',
        }],
      },
    };
    test.throws(rawOutput.bind(undefined, bytecode));
    test.end();
  });

  test.test('uses the specified version of Bodymovin', (test: tape.Test) => {
    const {v} = rawOutput(baseBytecode);
    test.deepEqual({v}, {v: '4.11.1'});
    test.end();
  });

  test.test('uses constant in-point and framerate', (test: tape.Test) => {
    const {ip, fr} = rawOutput(baseBytecode);
    test.deepEqual({ip, fr}, {ip: 0, fr: 60});
    test.end();
  });

  test.test('derives animation dimensions from wrapper element', (test: tape.Test) => {
    const {w, h} = rawOutput(baseBytecode);
    test.deepEqual({w, h}, {w: 640, h: 480});
    test.end();
  });

  test.test('morphs translation to positional', (test: tape.Test) => {
    const {
      layers: [{
        ks: {p: {s, y}},
      }],
    } = rawOutput(baseBytecode);
    test.equal(s, true, 'splits positionals');
    test.deepEqual(y, {a: 0, k: 20}, 'passes through scalar values');
    test.end();
  });

  test.test('applies default opacity', (test: tape.Test) => {
    const {
      layers: [{
        ks: {o},
      }],
    } = rawOutput(baseBytecode);
    test.deepEqual(o, {a: 0, k: 100});
    test.end();
  });

  test.test('animates properties', (test: tape.Test) => {
    const {
      layers: [{
        ks: {p: {x: {a, k: [{t, s, e, i, o}, finalKeyframe]}}},
      }], op,
    } = rawOutput(baseBytecode);

    test.equal(op, 60, 'derives out-point from final keyframe');
    test.equal(a, 1, 'knows an animation is active');
    test.deepEqual({t, s, e}, {t: 0, s: 0, e: 10}, 'animates using keyframes');
    test.deepEqual({i, o}, {i: {x: 1, y: 1}, o: {x: 0, y: 0}}, 'uses bezier interpolation points from the curve');
    test.deepEqual(finalKeyframe, {t: 60}, 'provides a final keyframe with no properties');
    test.end();
  });

  test.test('generally supports shapes', (test: tape.Test) => {
    const {
      layers: [{
        ty, shapes: [{it: [_, stroke, fill]}],
      }],
    } = rawOutput(baseBytecode);

    test.equal(ty, 4, 'identifies shape layers');

    {
      const {ty, w, c} = stroke;
      test.equal(ty, 'st', 'identifies stroke');
      test.deepEqual(w, {a: 0, k: 10}, 'parses stroke width');
      test.deepEqual(c, {a: 0, k: [1, 0, 0, 1]}, 'parses stroke color');
    }

    {
      const {ty, c} = fill;
      test.equal(ty, 'fl', 'identifies fill');
      test.deepEqual(c, {a: 0, k: [0, 1, 0, 1]}, 'parses fill color');
    }

    test.end();
  });

  test.test('supports circles', (test: tape.Test) => {
    const bytecode = {...baseBytecode};
    overrideShapeAttributes(bytecode, {cx: {0: {value: 5}}, cy: {0: {value: 5}}, r: {0: {value: 10}}});
    overrideShapeElement(bytecode, 'circle');

    const {
      layers: [{
        shapes: [{it: [{ty, p, s}]}],
      }],
    } = rawOutput(bytecode);

    test.equal(ty, 'el', 'translates circles as ellipses');
    test.deepEqual(p, {a: 0, k: [5, 5]}, 'translates ellipse to (cx, cy)');
    test.deepEqual(s, {a: 0, k: [20, 20]}, 'sizes circles at (2r, 2r)');
    test.end();
  });

  test.test('supports ellipses', (test: tape.Test) => {
    const bytecode = {...baseBytecode};
    overrideShapeAttributes(bytecode, {rx: {0: {value: 10}}, ry: {0: {value: 20}}});
    overrideShapeElement(bytecode, 'ellipse');

    const {
      layers: [{
        shapes: [{it: [{ty, s}]}],
      }],
    } = rawOutput(bytecode);

    test.equal(ty, 'el', 'translates ellipses');
    test.deepEqual(s, {a: 0, k: [20, 40]}, 'sizes ellipses at (2rx, 2ry)');
    test.end();
  });

  test.test('supports rectangles', (test: tape.Test) => {
    const bytecode = {...baseBytecode};
    overrideShapeAttributes(bytecode, {
      x: {0: {value: .5}},
      y: {0: {value: .5}},
      'sizeAbsolute.x': {0: {value: 10}},
      'sizeAbsolute.y': {0: {value: 20}},
      rx: {0: {value: 20}},
    });
    overrideShapeElement(bytecode, 'rect');

    const {
      layers: [{
        shapes: [{it: [{ty, s, r}, transformLayer]}],
      }],
    } = rawOutput(bytecode);

    test.equal(ty, 'rc', 'translates rectangles');
    test.deepEqual(s, {a: 0, k: [10, 20]}, 'sizes rectangles based on absolute size');
    test.deepEqual(r, {a: 0, k: 20}, 'translates border radius');

    test.equal(transformLayer.ty, 'tr', 'creates a translation layer for transposition');
    test.deepEqual(transformLayer.p, {a: 0, k: [5, 10]}, 'translates the rectangle based on its origin');
    test.end();
  });

  test.test('supports polygons', (test: tape.Test) => {
    const bytecode = {...baseBytecode};
    overrideShapeAttributes(bytecode, {
      points: {0: {value: '1,2 3,4'}},
    });
    overrideShapeElement(bytecode, 'polygon');

    const {
      layers: [{
        shapes: [{it: [{ty, ks: {k}}]}],
      }],
    } = rawOutput(bytecode);

    test.equal(ty, 'sh', 'translates polygons as shapes');
    test.deepEqual(k, {c: true, v: [[1, 2], [3, 4]]}, 'parses points into vertex chunks for closed shapes');
    test.end();
  });

  test.end();
});
