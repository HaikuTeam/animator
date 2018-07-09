/* tslint:disable:no-shadowed-variable */
import {BytecodeNode, BytecodeTimelineProperties, HaikuBytecode} from '@haiku/core/lib/api/HaikuBytecode';
import SVGPoints from '@haiku/core/lib/helpers/SVGPoints';
import tape = require('tape');

import {BodymovinExporter} from '@formats/exporters/bodymovin/bodymovinExporter';
import baseBytecode from './baseBytecode';

const {pathToPoints, polyPointsStringToPoints} = SVGPoints;
const rawOutput = (bytecode: HaikuBytecode) => (new BodymovinExporter(bytecode, '/tmp').rawOutput());

const overrideShapeAttributes = (bytecode: HaikuBytecode, attributes: BytecodeTimelineProperties) => {
  bytecode.timelines.Default['haiku:shape'] = attributes;
  return bytecode;
};

const overrideShapeElement = (bytecode: HaikuBytecode, elementName: string) => {
  // tslint:disable-next-line:max-line-length
  (((bytecode.template as BytecodeNode).children[0] as BytecodeNode).children[0] as BytecodeNode).elementName = elementName;
};

const baseBytecodeCopy = () => JSON.parse(JSON.stringify(baseBytecode));

tape('BodymovinExporter', (suite: tape.Test) => {
  suite.test('requires a div wrapper', (test: tape.Test) => {
    const bytecode = {
      ...baseBytecodeCopy(), template: {
        ...baseBytecodeCopy().template, elementName: 'span',
      },
    };
    test.throws(rawOutput.bind(undefined, bytecode), 'throws if provided a span wrapper');
    test.end();
  });

  suite.test('requires svg wrapper children', (test: tape.Test) => {
    const bytecode = {
      ...baseBytecodeCopy(), template: {
        ...baseBytecodeCopy().template, children: [{
          elementName: 'div',
        }],
      },
    };
    test.throws(rawOutput.bind(undefined, bytecode), 'throws if provided a div child');
    test.end();
  });

  suite.test('uses the specified version of Bodymovin', (test: tape.Test) => {
    const {v} = rawOutput(baseBytecodeCopy());
    test.deepEqual({v}, {v: '5.1.7'}, 'gets the Bodymovin version from package.json');
    test.end();
  });

  suite.test('uses constant in-point and framerate', (test: tape.Test) => {
    const {ip, fr} = rawOutput(baseBytecodeCopy());
    test.deepEqual({ip, fr}, {ip: 0, fr: 60}, 'always uses in-point of 0 and 60 fps');
    test.end();
  });

  suite.test('derives animation dimensions from wrapper element', (test: tape.Test) => {
    const {w, h} = rawOutput(baseBytecodeCopy());
    test.deepEqual({w, h}, {w: 640, h: 480}, 'gets animation width and height from stage');
    test.end();
  });

  suite.test('morphs translation to positional', (test: tape.Test) => {
    const {
      layers: [{
        ks: {p: {s, y}},
      }],
    } = rawOutput(baseBytecodeCopy());
    test.equal(s, true, 'splits positionals');
    test.deepEqual(y, {a: 0, k: 20}, 'passes through scalar values');
    test.end();
  });

  suite.test('animates properties', (test: tape.Test) => {
    const {
      layers: [{
        ks: {p: {x: {a, k: [{t, s, e, i, o}, finalKeyframe]}}},
      }], op,
    } = rawOutput(baseBytecodeCopy());

    test.equal(op, 60, 'derives out-point from final keyframe');
    test.equal(a, 1, 'knows an animation is active');
    test.deepEqual({t, s, e}, {t: 0, s: [0], e: [10]}, 'animates using keyframes');
    test.deepEqual({i, o}, {i: {x: [1], y: [1]}, o: {x: [0], y: [0]}}, 'derives bezier interpolation points');
    test.deepEqual(finalKeyframe, {t: 60}, 'provides a final keyframe with no properties');
    test.end();
  });

  suite.test('normalizes curves for transitions lacking tweens', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();
    bytecode.timelines.Default['haiku:svg'].opacity = {
      0: {value: 0},
      1000: {value: 1},
    };

    const {
      layers: [{
        ks: {o: {k: [initialKeyframe, injectedKeyframe, finalKeyframe]}},
      }],
    } = rawOutput(bytecode);

    test.deepEqual(initialKeyframe.e, [0], 'forks initial keyframe to transition back to itself');
    test.equal(injectedKeyframe.t, 59, 'injects a keyframe one frame before the jumped-to keyframe');
    test.deepEqual(injectedKeyframe.s, [0], 'initializes the injected keyframe at the same value as the initial');
    test.deepEqual(injectedKeyframe.e, [100], 'terminates the injected keyframe at the jumped-to value');
    test.equal(finalKeyframe.t, 60, 'terminates the final keyframe as it originally was');
    test.end();
  });

  suite.test('decomposes compound curves into sequential beziers', (test: tape.Test) => {
    // Note: A more expressive set of tests for the calculation of the replacement beziers is in curves.test.ts.
    const bytecode = baseBytecodeCopy();
    bytecode.timelines.Default['haiku:svg'].opacity = {
      0: {value: 0, curve: 'easeInBounce'},
      1000: {value: 1},
    };

    const {
      layers: [{
        ks: {o: {k: keyframes}},
      }],
    } = rawOutput(bytecode);

    test.equal(keyframes.length, 8, 'injects multiple keyframes to approximate a compound curve');
    test.equal(keyframes[0].t, 0, 'begins the initial keyframe at the original time');
    test.equal(keyframes[keyframes.length - 1].t, 60, 'terminates the final keyframe at the original time');
    test.end();
  });

  suite.test('inserts missing keyframes for properties that must be animated together', (test: tape.Test) => {
    // Note: We use linear curves to produce predictable/obviously correct test results. A more expressive set of
    // tests for the calculation of the replacement beziers is in curves.test.ts.
    const bytecode = baseBytecodeCopy();
    bytecode.timelines.Default['haiku:svg']['scale.x'] = {
      0: {value: 0, curve: 'linear'},
      1000: {value: 1},
    };

    bytecode.timelines.Default['haiku:svg']['scale.y'] = {
      0: {value: 0, curve: 'linear'},
      500: {value: 0.5, curve: 'linear'},
      1000: {value: 1},
    };

    const {
      layers: [{
        ks: {s: {k: [initialKeyframe, injectedKeyframe, finalKeyframe]}},
      }],
    } = rawOutput(bytecode);
    const [iInitial, oInitial] = [initialKeyframe.i, initialKeyframe.o];
    const [iInjected, oInjected] = [injectedKeyframe.i, injectedKeyframe.o];

    // Test for correctness of the initial keyframe.
    test.deepEqual(initialKeyframe.s, [0, 0], 'initial keyframe starts at the correct value');
    test.deepEqual(initialKeyframe.e, [50, 50], 'initial keyframe ends at the correct value');
    test.deepEqual(iInitial, {x: [0.5, 1], y: [0.5, 1]}, 'preserves linear interpolation  at initial in-points');
    test.deepEqual(oInitial, {x: [0, 0], y: [0, 0]}, 'preserves linear interpolation  at initial out-points');

    // Test for correctness of the (partially) injected keyframe.
    test.equal(injectedKeyframe.t, 30, 'injected keyframe has the expected time');
    test.deepEqual(injectedKeyframe.s, [50, 50], 'middle keyframe starts at the correct value');
    test.deepEqual(injectedKeyframe.e, [100, 100], 'injected keyframe ends at the correct value');
    test.deepEqual(iInjected, {x: [1, 1], y: [1, 1]}, 'preserves linear interpolation  at injected in-points');
    test.deepEqual(oInjected, {x: [0.5, 0], y: [0.5, 0]}, 'preserves linear interpolation  at injected out-points');

    // Test for preservation of the final keyframe timing.
    test.deepEqual(finalKeyframe, {t: 60});
    test.end();
  });

  suite.test('provides default transforms for layers', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();
    // Provide no information about how to transform the SVG layer.
    delete bytecode.timelines.Default['haiku:svg'];
    const {
      layers: [{
        ks: {p, o, s, a},
      }],
    } = rawOutput(bytecode);
    test.deepEqual(p.k, [0, 0, 0], 'default translation is (0, 0, 0)');
    test.equal(o.k, 100, 'default opacity is 100%');
    test.deepEqual(s.k, [100, 100, 100], 'default scaling is 100%');
    test.deepEqual(a.k, [0, 0, 0], 'default transform origin is (0, 0, 0)');
    test.end();
  });

  suite.test('uses necessary defaults for layers', (test: tape.Test) => {
    const {
      layers: [{ip, op, st}],
    } = rawOutput(baseBytecodeCopy());

    test.equal(ip, 0, 'in-point is always 0');
    test.equal(st, 0, 'start time is always 0');
    test.equal(op, 60, 'out-point is the same as the entire animation');
    test.end();
  });

  suite.test('transforms opacity correctly', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();
    bytecode.timelines.Default['haiku:svg'].opacity = {0: {value: 0.2}};
    const {layers: [{ks: {o}}]} = rawOutput(bytecode);
    test.equal(o.k, 20, 'denormalizes opacity in [0, 100]');
    test.end();
  });

  suite.test('transforms 2.5D rotations correctly', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();
    bytecode.timelines.Default['haiku:svg']['rotation.x'] = {0: {value: Math.PI / 2}};
    bytecode.timelines.Default['haiku:svg']['rotation.y'] = {0: {value: -Math.PI / 6}};
    bytecode.timelines.Default['haiku:svg']['rotation.z'] = {0: {value: Math.PI / 3}};
    const {layers: [{ks: {rx, ry, rz}}]} = rawOutput(bytecode);
    test.equal(Number(rx.k.toFixed(6)), 90, 'transforms rotation.x from radians to degrees');
    test.equal(Number(ry.k.toFixed(6)), -30, 'transforms rotation.y from radians to degrees');
    test.equal(Number(rz.k.toFixed(6)), 60, 'transforms rotation.z from radians to degrees');
    test.end();
  });

  suite.test('transforms scaling correctly', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();
    bytecode.timelines.Default['haiku:svg']['scale.x'] = {0: {value: 0.5}};
    bytecode.timelines.Default['haiku:svg']['scale.y'] = {0: {value: 0.8}};
    const {layers: [{ks: {s}}]} = rawOutput(bytecode);
    test.deepEqual(s.k, [50, 80], 'denormalizes scale in [0, 100] as an ordered pair (x, y)');
    test.end();
  });

  suite.test('animates scale as a compound animation', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();
    bytecode.timelines.Default['haiku:svg']['scale.x'] = {0: {value: 0.5, curve: 'easeInOutQuad'}, 1000: {value: 0.6}};
    bytecode.timelines.Default['haiku:svg']['scale.y'] = {0: {value: 0.8, curve: 'easeOutExpo'}, 1000: {value: 0.9}};
    const {layers: [{ks: {s: {a, k : [keyframe]}}}]} = rawOutput(bytecode);

    // The animated property reducer is responsible for both applying the standard transformations to scaling and
    // reducing the presentation of an animation to a sequence of waypoints and bezier curve descriptions in a
    // single package. easeInOutQuad uses interpolation points [.455, .03, .515, .955] to animate from 50% to 60%
    // opacity, and easeOutExpo uses interpolation points [.19, 1, .22, 1] to animate from 80% to 90% opacity. The
    // result of compound-reducing these should be be a curve with out-points x = [.455, .19], y = [.03, 1], etc.
    test.equal(a, 1, 'knows when scale is compound-animated');
    test.deepEqual(keyframe.s, [50, 80], 'starts at the correct compound property');
    test.deepEqual(keyframe.e, [60, 90], 'ends at the correct compound property');
    test.deepEqual(keyframe.o, {x: [.455, .19], y: [.03, 1]}, 'correctly reduces compound interpolation out-points');
    test.deepEqual(keyframe.i, {x: [.515, .22], y: [.955, 1]}, 'correctly reduces compound interpolation in-points');
    test.end();
  });

  suite.test('uses the correct transform-origin for layers', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();
    bytecode.timelines.Default['haiku:svg']['sizeAbsolute.x'] = {0: {value: 100}};
    bytecode.timelines.Default['haiku:svg']['sizeAbsolute.y'] = {0: {value: 200}};
    bytecode.timelines.Default['haiku:svg']['translation.x'] = {0: {value: 10}};
    bytecode.timelines.Default['haiku:svg']['translation.y'] = {0: {value: 20}};
    bytecode.timelines.Default['haiku:svg']['origin.x'] = {0: {value: 0.25}};
    bytecode.timelines.Default['haiku:svg']['origin.y'] = {0: {value: 0.25}};
    // Simulates legacy mode for old Haiku.
    bytecode.timelines.Default['haiku:svg']['mount.x'] = {0: {value: -0.5}};
    bytecode.timelines.Default['haiku:svg']['mount.y'] = {0: {value: -0.5}};
    const {layers: [{ks: {a, p}}]} = rawOutput(bytecode);
    test.deepEqual(a.k, [25, 50, 0], 'places the transform-origin in self-coordinates');
    test.equal(p.x.k, 10 + 100 / 2, 'decrements translation.x by the x-mount');
    test.equal(p.y.k, 20 + 200 / 2, 'decrements translation.y by the y-mount');
    test.end();
  });

  suite.test('generally supports shapes', (test: tape.Test) => {
    const {
      layers: [{
        ty, shapes: [{it: [_, stroke, fill]}],
      }],
    } = rawOutput(baseBytecodeCopy());

    test.equal(ty, 4, 'identifies shape layers');

    {
      const bytecode = baseBytecodeCopy();
      delete bytecode.timelines.Default['haiku:svg']['translation.x'];
      delete bytecode.timelines.Default['haiku:svg']['translation.y'];
      const {layers: [{ks}]} = rawOutput(bytecode);
      const {p: {k}} = ks;
      test.deepEqual(k, [0, 0, 0], 'provides a default transform with translation <0, 0>');
    }

    {
      const bytecode = baseBytecodeCopy();
      bytecode.timelines.Default['haiku:svg']['translation.x'] = {0: {value: 10}};
      delete bytecode.timelines.Default['haiku:svg']['translation.y'];
      const {layers: [{ks}]} = rawOutput(bytecode);
      const {p: {x, y}} = ks;
      test.equal(x.k, 10, 'parses translation.x');
      test.equal(y.k, 0, 'default translation.y is 0');
    }

    {
      const bytecode = baseBytecodeCopy();
      bytecode.timelines.Default['haiku:svg']['translation.y'] = {0: {value: 10}};
      delete bytecode.timelines.Default['haiku:svg']['translation.x'];
      const {layers: [{ks}]} = rawOutput(bytecode);
      const {p: {x, y}} = ks;
      test.equal(y.k, 10, 'parses translation.y');
      test.equal(x.k, 0, 'default translation.x is 0');
    }

    {
      const bytecode = baseBytecodeCopy();
      bytecode.timelines.Default['haiku:svg']['scale.x'] = {0: {value: 2}};
      const {layers: [{ks}]} = rawOutput(bytecode);
      const {s: {k}} = ks;
      test.deepEqual(k, [200, 100], 'parses scale.x');
    }

    {
      const bytecode = baseBytecodeCopy();
      bytecode.timelines.Default['haiku:svg']['scale.y'] = {0: {value: 2}};
      const {layers: [{ks}]} = rawOutput(bytecode);
      const {s: {k}} = ks;
      test.deepEqual(k, [100, 200], 'parses scale.y');
    }

    {
      const {ty, w, c, lc, lj, d} = stroke;
      test.equal(ty, 'st', 'identifies stroke');
      test.deepEqual(w, {a: 0, k: 10}, 'parses stroke width');
      test.deepEqual(c, {a: 0, k: [1, 0, 0, 1]}, 'parses stroke color');
      test.equal(lc, 3, 'uses strokeLinecap="square" by default');
      test.equal(lj, 1, 'uses strokeLinejoin="miter" by default');
      test.is(d, undefined, 'uses no strokeDasharray by default');
    }

    {
      const {ty, c, r} = fill;
      test.equal(ty, 'fl', 'identifies fill');
      test.deepEqual(c, {a: 0, k: [0, 1, 0, 1]}, 'parses fill color');
      test.equal(r, 1, 'uses fillRule="nonzero" by default');
    }

    test.end();
  });

  suite.test('handles special stroke behaviors', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();
    overrideShapeAttributes(bytecode, {
      stroke: {0: {value: '#000'}},
      'strokeWidth': {0: {value: 10}},
      'strokeLinecap': {0: {value: 'butt'}},
      'strokeLinejoin': {0: {value: 'bevel'}},
      'strokeDasharray': {0: {value: '1'}},
    });

    const {
      layers: [{
        shapes: [{it: [_, stroke]}],
      }],
    } = rawOutput(bytecode);

    const {lc, lj, d} = stroke;
    test.equal(lc, 1, 'parses and transforms strokeLinecap');
    test.equal(lj, 3, 'parses and transforms strokeLinejoin');
    test.deepEqual(
      d,
      [
        {
          n: 'd',
          v: {
            a: 0,
            k: 1,
          },
          nm: '0',
        },
        {
          n: 'g',
          v: {
            a: 0,
            k: 1,
          },
          nm: '1',
        },
      ],
      'parses and transforms strokeDasharray',
    );

    test.end();
  });

  suite.test('handles special fill behaviors', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();
    overrideShapeAttributes(bytecode, {
      fill: {0: {value: '#000'}},
      'fillRule': {0: {value: 'evenodd'}},
    });

    const {
      layers: [{
        shapes: [{it: [_, __, fill]}],
      }],
    } = rawOutput(bytecode);

    const {r} = fill;
    test.equal(r, 2, 'parses and transforms fillRule');
    test.end();
  });

  suite.test('handles gradient fills', (test: tape.Test) => {
    // We'll fill a 100x200 rectangle in this test.
    const bytecode = baseBytecodeCopy();
    overrideShapeElement(bytecode, 'rect');

    bytecode.timelines.Default['haiku:stop1'] = {
      offset: {0: {value: '0%'}},
      'stopColor': {0: {value: '#000'}},
    };

    bytecode.timelines.Default['haiku:stop2'] = {
      offset: {0: {value: '100%'}},
      'stopColor': {0: {value: '#FFF'}},
    };

    // Scope for testing linear gradients.
    {
      overrideShapeAttributes(bytecode, {
        'sizeAbsolute.x': {0: {value: 100}},
        'sizeAbsolute.y': {0: {value: 200}},
        fill: {0: {value: 'url( "#gradient" )'}},
      });

      bytecode.timelines.Default['haiku:g'] = {
        x1: {0: {value: '50%'}},
        y1: {0: {value: '50%'}},
        x2: {0: {value: '75%'}},
        y2: {0: {value: '75%'}},
      };

      bytecode.template.children[0].children.push({
        elementName: 'defs',
        attributes: {'haiku-id': 'unused'},
        children: [{
          elementName: 'linearGradient',
          attributes: {'haiku-id': 'g', id: 'gradient'},
          children: [
            {elementName: 'stop', attributes: {'haiku-id': 'stop1'}, children: []},
            {elementName: 'stop', attributes: {'haiku-id': 'stop2'}, children: []},
          ],
        }],
      });

      const {
        layers: [{
          shapes: [{it: [_, __, fill]}],
        }],
      } = rawOutput(bytecode);

      const {ty, t, g, s, e} = fill;
      test.equal(ty, 'gf', 'identifies a gradient fill for <linearGradient>');
      test.equal(t, 1, 'identifies a linear gradient');
      test.deepEqual(s.k, [50, 100], 'interprets percents as whole values to transform <linearGradient> (x1, y1)');
      test.deepEqual(e.k, [75, 150], 'interprets percents as whole values to transform <linearGradient> (x2, y2)');
      test.deepEqual(g.p, 2, 'correctly counts the number of gradient stop-points');
      test.deepEqual(
        g.k.k,
        [0, 0, 0, 0, 1, 1, 1, 1],
        'reformats the stop chain into as a flattened list: <normalizedOffset, normalizedR, normalizedG, normalizedB>',
      );
    }

    // Scope for testing radial gradients.
    {
      bytecode.timelines.Default['haiku:rg'] = {
        cx: {0: {value: '50%'}},
        cy: {0: {value: '50%'}},
        fx: {0: {value: '60%'}},
        fy: {0: {value: '60%'}},
        r: {0: {value: '50%'}},
      };

      // We can reuse most of the mutations of the base bytecode in this scope. We just need to change the name of
      // the element to trigger the special handling.
      bytecode.template.children[0].children[0].children[0].elementName = 'radialGradient';

      const {
        layers: [{
          shapes: [{it: [_, __, fill]}],
        }],
      } = rawOutput(bytecode);

      const {ty, t, g, s, e} = fill;
      test.equal(ty, 'gf', 'identifies a gradient fill for <radialGradient>');
      test.equal(t, 2, 'identifies a radial gradient');
      test.deepEqual(s.k, [50, 100], 'interprets percents as whole values to transform <linearGradient> (cx, cy)');
      // Note: Adding support for fx and fy should break the next assertion. If it doesn't, something is wrong.
      test.deepEqual(e.k, [50, 200], 'interprets percents as whole values to transform <linearGradient> (r)');
      test.deepEqual(g.p, 2, 'correctly counts the number of gradient stop-points');
      test.deepEqual(
        g.k.k,
        [0, 0, 0, 0, 1, 1, 1, 1],
        'reformats the stop chain into as a flattened list: <normalizedOffset, normalizedR, normalizedG, normalizedB>',
      );
    }

    test.end();
  });

  suite.test('handles non-CSS colors gracefully', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();

    {
      bytecode.timelines.Default['haiku:shape'].stroke = {0: {value: 'none'}};
      const {layers: [{shapes: [{it: [_, stroke]}]}]} = rawOutput(bytecode);
      test.deepEqual(stroke.c.k, [0, 0, 0, 0], '"none" is treated like "transparent"');
    }

    {
      bytecode.timelines.Default['haiku:shape'].stroke = {0: {value: 'tomfoolery'}};
      const {layers: [{shapes: [{it: [_, stroke]}]}]} = rawOutput(bytecode);
      test.deepEqual(stroke.c.k, [0, 0, 0, 0], 'nonsense colors are treated like "transparent"');
    }

    test.end();
  });

  suite.test('cascades group properties down to shapes', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();

    // Shim in a group to wrap our shape.
    bytecode.timelines.Default['haiku:group'] = {
      'strokeWidth': {0: {value: 5}},
      'translation.x': {0: {value: 10}},
      'translation.y': {0: {value: 10}},
    };
    bytecode.timelines.Default['haiku:shape']['translation.x'] = {0: {value: -10}};
    bytecode.timelines.Default['haiku:shape']['translation.y'] = {0: {value: -10}};
    bytecode.template.children[0].children = [{
      elementName: 'g',
      attributes: {'haiku-id': 'group'},
      children: bytecode.template.children[0].children,
    }];

    {
      const {
        layers: [{
          shapes: [{it: [_, stroke, __, transform]}],
        }],
      } = rawOutput(bytecode);
      test.equal(stroke.w.k, 10, 'child shape properties override parent group properties');
      test.deepEqual(transform.p.k, [0, 0], 'parent translations are composed with child translations');
    }

    {
      delete bytecode.timelines.Default['haiku:shape']['strokeWidth'];
      const {
        layers: [{
          shapes: [{it: [_, stroke, __]}],
        }],
      } = rawOutput(bytecode);
      test.equal(stroke.w.k, 5, 'parent group properties cascade to child shapes');
    }

    test.end();
  });

  suite.test('composes layout correctly', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();

    // Shim in a group to wrap our shape.
    bytecode.timelines.Default['haiku:group'] = {
      'translation.x': {0: {value: 10}},
      'rotation.z': {0: {value: Math.PI / 2}},
    };
    // Add
    bytecode.timelines.Default['haiku:shape'] = {
      ...bytecode.timelines.Default['haiku:shape'],
      'translation.y': {0: {value: -10}},
      'rotation.z': {0: {value: -Math.PI / 2}},
    };
    bytecode.template.children[0].children = [{
      elementName: 'g',
      attributes: {'haiku-id': 'group'},
      children: bytecode.template.children[0].children,
    }];

    const {
      layers: [{
        shapes: [{it: [_, __, ___, {p, r}]}],
      }],
    } = rawOutput(bytecode);
    test.deepEqual(p, {a: 0, k: [20, 0]}, 'position was correctly composed');
    test.deepEqual(r, {a: 0, k: 0}, 'rotation was correctly composed');

    test.end();
  });

  suite.test('transcludes defs down to shapes through use', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();

    // Shim in <defs>, and replace our shape element with a <use>.
    bytecode.timelines.Default['haiku:def'] = {
      'strokeWidth': {0: {value: 5}},
    };
    overrideShapeElement(bytecode, 'use');
    bytecode.template.children[0].children.unshift({
      elementName: 'defs',
      attributes: {'haiku-id': 'unused'},
      children: [{
        elementName: 'ellipse',
        attributes: {'haiku-id': 'def', id: 'my-circle'},
        children: [],
      }],
    });
    overrideShapeAttributes(
      bytecode, {stroke: {0: {value: '#FF0000'}}, 'strokeWidth': {0: {value: 10}}, href: {0: {value: '#my-circle'}}});

    {
      const {
        layers: [{
          shapes: [{it: [shape, stroke]}],
        }],
      } = rawOutput(bytecode);
      test.equal(shape.ty, 'el', 'transcludes the correct vector element');
      test.deepEqual(stroke.w.k, 10, 'attributes from <use> override attributes from <defs>');
    }

    {
      delete bytecode.timelines.Default['haiku:shape']['strokeWidth'];
      const {
        layers: [{
          shapes: [{it: [_, stroke]}],
        }],
      } = rawOutput(bytecode);
      test.deepEqual(stroke.w.k, 5, 'attributes from <defs> transclude through to <use>');
    }

    test.end();
  });

  suite.test('supports circles', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();
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

  suite.test('supports ellipses', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();
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

  suite.test('supports rectangles', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();
    overrideShapeAttributes(bytecode, {
      x: {0: {value: 10}},
      y: {0: {value: 10}},
      'sizeAbsolute.x': {0: {value: 10}},
      'sizeAbsolute.y': {0: {value: 20}},
      rx: {0: {value: 20}},
      'translation.x': {0: {value: -60}},
      'translation.y': {0: {value: -90}},
    });
    overrideShapeElement(bytecode, 'rect');

    const {
      layers: [{
        shapes: [{it: [{ty, s, r, p}, _, __, transformLayer]}],
      }],
    } = rawOutput(bytecode);

    test.equal(ty, 'rc', 'translates rectangles');
    test.deepEqual(s, {a: 0, k: [10, 20]}, 'sizes rectangles based on absolute size');
    test.deepEqual(r, {a: 0, k: 20}, 'translates border radius');
    test.deepEqual(p, {a: 0, k: [15, 20]}, 'translates the shape layer relative to a center origin');

    test.equal(transformLayer.ty, 'tr', 'creates a translation layer for transposition');
    test.deepEqual(transformLayer.p, {a: 0, k: [-60, -90]}, 'translates the rectangle correctly');
    test.end();
  });

  suite.test('supports polygons', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();
    overrideShapeAttributes(bytecode, {
      points: {0: {value: '1,2 3,4'}},
    });
    overrideShapeElement(bytecode, 'polygon');

    const {
      layers: [{
        shapes: [{it: [{ty, ks: {k: {c, v, i, o}}}]}],
      }],
    } = rawOutput(bytecode);

    test.equal(ty, 'sh', 'translates polygons as shapes');
    test.equal(c, true, 'creates a closed shape');
    test.deepEqual(v, [[1, 2], [3, 4]], 'parses points into vertex chunks for closed shapes');
    test.deepEqual(i, [[0, 0], [0, 0]], 'uses null interpolation in-points');
    test.deepEqual(o, [[0, 0], [0, 0]], 'uses null interpolation in-points');
    test.end();
  });

  suite.test('supports polygons, array-style', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();
    overrideShapeAttributes(bytecode, {
      points: {0: {value: polyPointsStringToPoints('1,2 3,4')}},
    });
    overrideShapeElement(bytecode, 'polygon');

    const {
      layers: [{
        shapes: [{it: [{ty, ks: {k: {c, v, i, o}}}]}],
      }],
    } = rawOutput(bytecode);

    test.equal(ty, 'sh', 'translates polygons as shapes');
    test.equal(c, true, 'creates a closed shape');
    test.deepEqual(v, [[1, 2], [3, 4]], 'parses points into vertex chunks for closed shapes');
    test.deepEqual(i, [[0, 0], [0, 0]], 'uses null interpolation in-points');
    test.deepEqual(o, [[0, 0], [0, 0]], 'uses null interpolation in-points');
    test.end();
  });

  suite.test('supports paths', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();
    overrideShapeElement(bytecode, 'path');

    // Scope for testing closed shape support.
    {
      overrideShapeAttributes(bytecode, {
        d: {0: {value: 'M0,0 L1,1 L0,0 Z'}},
      });

      const {
        layers: [{
          shapes: [{it: [{ty, ks: {k: {c, v, i, o}}}]}],
        }],
      } = rawOutput(bytecode);
      test.equal(ty, 'sh', 'translates paths as shapes');
      test.equal(c, true, 'creates a closed shape');
      test.deepEqual(v, [[0, 0], [1, 1]], 'gets coordinates from movetos and line endpoints');
      test.deepEqual(i, [[0, 0], [0, 0]], 'translates lines in relative to vertices');
      test.deepEqual(o, [[0, 0], [0, 0]], 'translates lines out relative to vertices');
    }

    // Scope for testing closed shape support, array-style.
    {
      overrideShapeAttributes(bytecode, {
        d: {0: {value: pathToPoints('M0,0 L1,1 L0,0 Z')}},
      });

      const {
        layers: [{
          shapes: [{it: [{ks: {k: {c, v, i, o}}}]}],
        }],
      } = rawOutput(bytecode);
      test.equal(c, true, 'creates a closed shape');
      test.deepEqual(v, [[0, 0], [1, 1]], 'gets coordinates from movetos and line endpoints');
      test.deepEqual(i, [[0, 0], [0, 0]], 'translates lines in relative to vertices');
      test.deepEqual(o, [[0, 0], [0, 0]], 'translates lines out relative to vertices');
    }

    // Scope for testing compound shape support.
    {
      overrideShapeAttributes(bytecode, {
        d: {0: {value: 'M0,0 L1,1 L0,0 Z M2,2 L3,3 L2,2 Z'}},
      });

      const {layers: [{shapes: [{it: [it0, it1]}]}]} = rawOutput(bytecode);
      test.deepEqual(it0.ks.k.v, [[0, 0], [1, 1]], 'creates a shape from the first closed segment');
      test.deepEqual(it1.ks.k.v, [[2, 2], [3, 3]], 'creates additional shapes from other closed segments');
    }

    // Scope for testing compound shape support, array-style.
    {
      overrideShapeAttributes(bytecode, {
        d: {0: {value: pathToPoints('M0,0 L1,1 L0,0 Z M2,2 L3,3 L2,2 Z')}},
      });

      const {layers: [{shapes: [{it: [it0, it1]}]}]} = rawOutput(bytecode);
      test.deepEqual(it0.ks.k.v, [[0, 0], [1, 1]], 'creates a shape from the first closed segment');
      test.deepEqual(it1.ks.k.v, [[2, 2], [3, 3]], 'creates additional shapes from other closed segments');
    }

    // Scope for testing cubic bezier support.
    {
      overrideShapeAttributes(bytecode, {
        d: {0: {value: 'M0,0 C1,2 3,4 5,6 L0,0 Z'}},
      });

      const {
        layers: [{
          shapes: [{it: [{ks: {k: {v, i, o}}}]}],
        }],
      } = rawOutput(bytecode);
      test.deepEqual(v, [[0, 0], [5, 6]], 'gets coordinates from bezier curve endpoints');
      test.deepEqual(i, [[0, 0], [-2, -2]], 'translates lines in relative to vertices');
      test.deepEqual(o, [[1, 2], [0, 0]], 'translates lines out relative to vertices');
    }

    // Scope for testing cubic bezier support, array style.
    {
      overrideShapeAttributes(bytecode, {
        d: {0: {value: pathToPoints('M0,0 C1,2 3,4 5,6 L0,0 Z')}},
      });

      const {
        layers: [{
          shapes: [{it: [{ks: {k: {v, i, o}}}]}],
        }],
      } = rawOutput(bytecode);
      test.deepEqual(v, [[0, 0], [5, 6]], 'gets coordinates from bezier curve endpoints');
      test.deepEqual(i, [[0, 0], [-2, -2]], 'translates lines in relative to vertices');
      test.deepEqual(o, [[1, 2], [0, 0]], 'translates lines out relative to vertices');
    }

    test.end();
  });

  suite.test('stacks elements in order of descending z-index', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();
    // Shim in three SVG layers.
    bytecode.template.children = [
      {
        elementName: 'svg',
        attributes: {'haiku-id': 'svg0'},
        children: [],
      },
      {
        elementName: 'svg',
        attributes: {'haiku-id': 'svg1'},
        children: [],
      },
      {
        elementName: 'svg',
        attributes: {'haiku-id': 'svg2'},
        children: [],
      },
    ];
    bytecode.timelines.Default['haiku:svg0'] = {
      opacity: {0: {value: .25}},
      'style.zIndex': {0: {value: 1}},
    };
    bytecode.timelines.Default['haiku:svg1'] = {
      opacity: {0: {value: .5}},
      'style.zIndex': {0: {value: 1}},
    };
    bytecode.timelines.Default['haiku:svg2'] = {
      opacity: {0: {value: 1}},
      'style.zIndex': {0: {value: 2}},
    };

    const {layers} = rawOutput(bytecode);
    test.equal(layers[0].ks.o.k, 100, 'elements with higher z-index come earlier');
    test.equal(layers[1].ks.o.k, 50, 'elements with lower z-index come later');
    test.equal(layers[2].ks.o.k, 25, 'z-index conflicts are resolved based on original order');
    test.end();
  });

  suite.test('simulates wrapper div with a background color as a rectangle', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();
    bytecode.timelines.Default['haiku:wrapper']['style.backgroundColor'] = {0: {value: '#000'}};
    const {layers: [_, {ind, ty, shapes: [{it: [shape, __, fill]}]}]} = rawOutput(bytecode);
    test.equal(ind, 0, 'wrapper rectangle has z-index 0');
    test.equal(ty, 4, 'wrapper rectangle is an ordinary shape layer');
    test.equal(shape.ty, 'rc', 'wrapper rectangle is in fact a rectangle');
    test.deepEqual(shape.s.k, [640, 480], 'wrapper rectangle uses the animation dimensions');
    test.deepEqual(fill.c.k, [0, 0, 0, 1], 'wrapper rectangle is filled with the wrapper backgroundColor');
    test.end();
  });

  suite.test('preprocesses injectables in the context of the bytecode state tree defaults', (test: tape.Test) => {
    const bytecode = baseBytecodeCopy();
    bytecode.states = {
      two: {value: 2},
    };

    // Simulate the actual result of calling `Haiku.inject`.
    const haiku = require('@haiku/core');
    bytecode.timelines.Default['haiku:svg'].opacity = {
      0: {
        value: haiku.inject(
          // tslint:disable-next-line:variable-name
          (two: any, Math: any, $user: any, $basicMagic: any, $deepMagic: any) => {
            return .12 * two + $user.mouse.x / 100 + $basicMagic - $deepMagic.arbitrarily.nested.magic + Math.sqrt(0);
          },
          'two',
          'Math',
          '$user',
          '$basicMagic',
          '$deepMagic',
        ),
      },
    };

    const {
      layers: [{
        ks: {o: {k}},
      }],
    } = rawOutput(bytecode);

    test.equal(k, 25, 'resolves state variables from bytecode and casts summonables as 1');
    test.end();
  });

  suite.end();
});
