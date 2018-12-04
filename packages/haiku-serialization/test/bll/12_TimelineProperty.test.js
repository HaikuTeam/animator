const tape = require('tape');
const TimelineProperty = require('./../../src/bll/TimelineProperty');
const HaikuComponent = require('@haiku/core/lib/HaikuComponent').default;

const findElementsByHaikuId = () => {
  return {elementName: 'svg', attributes: {}, children: []};
};

const getClock = () => {
  return {
    getExplicitTime: () => {
      return 1;
    },

    getFrameDuration: () => {
      return 16.666;
    },
  };
};

const renderer = {
  mount: null,
};

const context = {
  clock: getClock(),
  getClock,
  renderer,
};

tape('TimelineProperty.addProperty', function (t) {
  t.plan(4);

  const timelines = {
    Default: {
      'haiku:abcde': {
        zilch: {},
      },
    },
  };

  TimelineProperty.addProperty(
    timelines,
    'Default',
    'abcde',
    'div',
    'opacity',
    0,
    0,
  );

  t.equal(JSON.stringify(timelines), '{"Default":{"haiku:abcde":{"zilch":{},"opacity":{"0":{"value":0,"edited":true}}}}}');

  TimelineProperty.addProperty(
    timelines,
    'Default',
    'abcde',
    'div',
    'opacity',
    0,
    0.5,
  );

  t.equal(JSON.stringify(timelines), '{"Default":{"haiku:abcde":{"zilch":{},"opacity":{"0":{"value":0.5,"edited":true}}}}}');

  TimelineProperty.addProperty(
    timelines,
    'Default',
    'abcde',
    'div',
    'opacity',
    100,
    0.75,
  );

  t.equal(JSON.stringify(timelines), '{"Default":{"haiku:abcde":{"zilch":{},"opacity":{"0":{"value":0.5,"edited":true},"100":{"value":0.75,"edited":true}}}}}');

  TimelineProperty.addProperty(
    timelines,
    'Default',
    'abcde',
    'div',
    'opacity',
    200,
    0.95,
    'linear',
  );

  t.equal(JSON.stringify(timelines), '{"Default":{"haiku:abcde":{"zilch":{},"opacity":{"0":{"value":0.5,"edited":true},"100":{"value":0.75,"edited":true},"200":{"value":0.95,"curve":"linear","edited":true}}}}}');
});

tape('TimelineProperty.getAssignedBaselineValueObject', function (t) {
  t.plan(4);

  const bvo1 = TimelineProperty.getAssignedBaselineValueObject('abcde', 'svg', 'opacity', 'Default', 123, {
    timelines: {
      Default: {
        'haiku:abcde': {
          zilch: {},
          opacity: {
            0: {value: 0},
            100: {value: 1},
            200: {value: 2},
            300: {value: 3},
            400: {value: 4},
          },
        },
      },
    },
  });
  t.equal(JSON.stringify(bvo1), '{"value":1}');

  const bvo2 = TimelineProperty.getAssignedBaselineValueObject('abcde', 'svg', 'opacity', 'Default', 99, {
    timelines: {
      Default: {
        'haiku:abcde': {
          zilch: {},
          opacity: {
            0: {value: 0},
            100: {value: 1},
            200: {value: 2},
            300: {value: 3},
            400: {value: 4},
          },
        },
      },
    },
  });
  t.equal(JSON.stringify(bvo2), '{"value":0}');

  const bvo3 = TimelineProperty.getAssignedBaselineValueObject('abcde', 'svg', 'opacity', 'Default', 100, {
    timelines: {
      Default: {
        'haiku:abcde': {
          zilch: {},
          opacity: {
            0: {value: 0},
            100: {value: 1},
            200: {value: 2},
            300: {value: 3},
            400: {value: 4},
          },
        },
      },
    },
  });
  t.equal(JSON.stringify(bvo3), '{"value":1}');

  const bvo4 = TimelineProperty.getAssignedBaselineValueObject('abcde', 'svg', 'opacity', 'Default', 3333300, {
    timelines: {
      Default: {
        'haiku:abcde': {
          zilch: {},
          opacity: {
            0: {value: 0},
            100: {value: 1},
            200: {value: 2},
            300: {value: 3},
            400: {value: 4},
          },
        },
      },
    },
  });
  t.equal(JSON.stringify(bvo4), '{"value":4}');
});

tape('TimelineProperty.getBaselineValue', function (t) {
  t.plan(6);

  let hostInstance;
  let inputValues;
  let bv;

  hostInstance = new HaikuComponent({}, context, null, {seed:'0'}, {});
  hostInstance.findElementsByHaikuId = findElementsByHaikuId;
  hostInstance.shouldPerformFullFlush = () => {};
  inputValues = {};
  bv = TimelineProperty.getBaselineValue('abcde', 'svg', 'opacity', 'Default', 123, 0.666, {
    timelines: {
      Default: {
        'haiku:abcde': {
          zilch: {},
          opacity: {
            0: {value: 0},
            100: {value: 1},
            200: {value: 2},
            300: {value: 3},
            400: {value: 4},
          },
        },
      },
    },
  }, hostInstance, inputValues);
  t.equal(bv, 1, 'first is correct');

  hostInstance = new HaikuComponent({}, context, null, {seed:'0'}, {});
  hostInstance.findElementsByHaikuId = findElementsByHaikuId;
  hostInstance.shouldPerformFullFlush = () => {};
  inputValues = {};
  bv = TimelineProperty.getBaselineValue('abcde', 'svg', 'opacity', 'Default', 0, 0.666, {
    timelines: {
      Default: {
        'haiku:abcde': {
          zilch: {},
          opacity: {
            0: {value: 0},
            100: {value: 1},
            200: {value: 2},
            300: {value: 3},
            400: {value: 4},
          },
        },
      },
    },
  }, hostInstance, inputValues);
  t.equal(bv, 0, 'second is correct');

  // This is the important test - ensuring we load the PREVIOUS keyframe when we have an exact fit!
  hostInstance = new HaikuComponent({}, context, null, {seed:'0'}, {});
  hostInstance.findElementsByHaikuId = findElementsByHaikuId;
  hostInstance.shouldPerformFullFlush = () => {};
  inputValues = {};
  bv = TimelineProperty.getBaselineValue('abcde', 'svg', 'opacity', 'Default', 100, 0.666, {
    timelines: {
      Default: {
        'haiku:abcde': {
          zilch: {},
          opacity: {
            0: {value: 0},
            100: {value: 1},
            200: {value: 2},
            300: {value: 3},
            400: {value: 4},
          },
        },
      },
    },
  }, hostInstance, inputValues);
  t.equal(bv, 0, 'third is correct - got previous keyframe');

  hostInstance = new HaikuComponent({}, context, null, {seed:'0'}, {});
  hostInstance.findElementsByHaikuId = findElementsByHaikuId;
  hostInstance.shouldPerformFullFlush = () => {};
  inputValues = {};
  bv = TimelineProperty.getBaselineValue('abcde', 'svg', 'opacity', 'Default', 1000000, 0.666, {
    timelines: {
      Default: {
        'haiku:abcde': {
          zilch: {},
          opacity: {
            0: {value: 0},
            100: {value: 1},
            200: {value: 2},
            300: {value: 3},
            400: {value: 4},
          },
        },
      },
    },
  }, hostInstance);
  t.equal(bv, 4, 'fourth is correct');

  // Another important one: Ensure we use the dom.properties-defined fallback if there is no previous
  hostInstance = new HaikuComponent({}, context, null, {seed:'0'}, {});
  hostInstance.findElementsByHaikuId = findElementsByHaikuId;
  hostInstance.shouldPerformFullFlush = () => {};
  inputValues = {};
  bv = TimelineProperty.getBaselineValue('abcde', 'svg', 'opacity', 'Default', 99, 0.666, {
    timelines: {
      Default: {
        'haiku:abcde': {
          zilch: {},
          opacity: {
            // Opacity actually has a fallback of 1.
            100: {value: 1},
            200: {value: 2},
            300: {value: 3},
            400: {value: 4},
          },
        },
      },
    },
  }, hostInstance);
  t.equal(bv, 1, 'fifth correct - prop defined fallback ok');

  // Another important one: Ensure we use the dom.properties-defined fallback if there is no previous
  hostInstance = new HaikuComponent({}, context, null, {seed:'0'}, {});
  hostInstance.findElementsByHaikuId = findElementsByHaikuId;
  hostInstance.shouldPerformFullFlush = () => {};
  inputValues = {};
  bv = TimelineProperty.getBaselineValue('abcde', 'svg', 'boovador', 'Default', 99, undefined, {
    timelines: {
      Default: {
        'haiku:abcde': {
          zilch: {},
          opacity: {
            // Opacity actually has a fallback of 1.
            100: {value: 1},
            200: {value: 2},
            300: {value: 3},
            400: {value: 4},
          },
        },
      },
    },
  }, hostInstance);
  t.equal(bv, undefined, 'sixth ok - prop defined fallback ok');
});
