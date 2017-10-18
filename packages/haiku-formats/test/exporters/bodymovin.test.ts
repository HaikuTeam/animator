import * as tape from 'tape';

import {HaikuBytecode} from 'haiku-common/lib/types';

import {BodymovinExporter} from '../../lib/exporters/bodymovin/bodymovinExporter';
import baseBytecode from './baseBytecode';

const rawOutput = (bytecode: HaikuBytecode) => (new BodymovinExporter(bytecode).rawOutput());

tape('BodymovinExporter', (test: tape.Test) => {
  test.test('requires a div wrapper', (test: tape.Test) => {
    const bytecode = {
      ...baseBytecode,
      template: {
        ...baseBytecode.template,
        elementName: 'span',
      },
    };
    test.throws(rawOutput.bind(undefined, bytecode));
    test.end();
  });

  test.test('requires svg wrapper children', (test: tape.Test) => {
    const bytecode = {
      ...baseBytecode,
      template: {
        ...baseBytecode.template,
        children: [{
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

  test.test('animates properties', (test: tape.Test) => {
    const {
      layers: [{
        ks: {p: {x}},
      }],
      op,
    } = rawOutput(baseBytecode);
    test.equal(op, 60, 'derives out-point from final keyframe');
    test.deepEqual(x, {a: 1, k: [{t: 0, s: 0, e: 10}, {t: 60}]}, 'animates using keyframes');
    test.end();
  });

  test.test('generally supports shapes', (test: tape.Test) => {
    const {
      layers: [{
        ty,
        shapes: [{it: [stroke, fill]}],
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

  test.end();
});
