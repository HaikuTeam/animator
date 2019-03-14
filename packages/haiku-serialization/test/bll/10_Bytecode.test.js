const tape = require('tape');
const Bytecode = require('./../../src/bll/Bytecode');

tape('changePlaybackSpeed', (t) => {
  t.plan(2);
  const bytecode = {
    states: {},
    eventHandlers: {},
    timelines: {},
    template: {elementName: 'svg', attributes: {'haiku-id': 'abcdefghijk'}},
  };
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{},"template":{"elementName":"svg","attributes":{"haiku-id":"abcdefghijk"}}}');
  Bytecode.changePlaybackSpeed(bytecode, 63);
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{},"template":{"elementName":"svg","attributes":{"haiku-id":"abcdefghijk"}},"options":{"fps":60}}');
});

tape('componentIdToSelector', (t) => {
  t.plan(1);
  t.equal(Bytecode.componentIdToSelector('abcd'), 'haiku:abcd');
});

tape('createKeyframe (static 1)', (t) => {
  t.plan(1);
  const bc1 = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
        'haiku:abcdefghijk': {

        },
      },
    },
    template: {elementName: 'svg', attributes: {'haiku-id': 'abcdefghijk'}},
  };
  Bytecode.createKeyframe(bc1, 'abcdefghijk', 'Default', 'svg', 'opacity', 150, 0.5);
  t.equal(JSON.stringify(bc1.timelines.Default), '{"haiku:abcdefghijk":{"opacity":{"150":{"value":0.5,"edited":true}}}}');
});

tape('createKeyframe (dynamic 1)', (t) => {
  t.plan(1);
  const bc2 = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
        'haiku:abcdefghijk': {

        },
      },
    },
    template: {elementName: 'svg', attributes: {'haiku-id': 'abcdefghijk'}},
  };

  Bytecode.createKeyframe(bc2, 'abcdefghijk', 'Default', 'svg', 'opacity', 150, {
    __function: {
      name: 'foo',
      params: [],
      body: 'return 123;',
    },
  });

  t.equal(bc2.timelines.Default['haiku:abcdefghijk'].opacity[150].value.toString(), 'function foo() {\n  return 123;\n}');
});

tape('createKeyframe (dynamic via default 1)', (t) => {
  t.plan(1);
  const bc3 = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
        'haiku:abcdefghijk': {
          opacity: {
            0: {
              value: function foo () {
                return 123;
              },
            },
          },
        },
      },
    },
    template: {elementName: 'svg', attributes: {'haiku-id': 'abcdefghijk'}},
  };

  Bytecode.createKeyframe(bc3, 'abcdefghijk', 'Default', 'svg', 'opacity', 150);

  t.equal(bc3.timelines.Default['haiku:abcdefghijk'].opacity[150].value.toString(), 'function foo() {\n  return 123;\n}');
});

tape('createKeyframe (static via default 1)', (t) => {
  t.plan(1);
  const bc4 = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
        'haiku:abcdefghijk': {
          opacity: {
            0: {
              value: 0.234,
            },
          },
        },
      },
    },
    template: {elementName: 'svg', attributes: {'haiku-id': 'abcdefghijk'}},
  };

  Bytecode.createKeyframe(bc4, 'abcdefghijk', 'Default', 'svg', 'opacity', 150);

  t.equal(bc4.timelines.Default['haiku:abcdefghijk'].opacity[150].value, 0.234);
});

tape('createKeyframe (static via default 2)', (t) => {
  t.plan(1);
  const bc4 = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
        'haiku:abcdefghijk': {
          opacity: {
            0: {
              value: 0.234,
            },
            140: {
              value: 0.675,
            },
          },
        },
      },
    },
    template: {elementName: 'svg', attributes: {'haiku-id': 'abcdefghijk'}},
  };

  Bytecode.createKeyframe(bc4, 'abcdefghijk', 'Default', 'svg', 'opacity', 150);

  t.equal(bc4.timelines.Default['haiku:abcdefghijk'].opacity[150].value, 0.675);
});

tape('createTimeline', (t) => {
  t.plan(2);
  const bytecode = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
      },
    },
    template: {},
  };
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{"Default":{}},"template":{}}');
  Bytecode.createTimeline(bytecode, 'FooBar');
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{"Default":{},"FooBar":{}},"template":{}}');
});

tape('deleteTimeline', (t) => {
  t.plan(2);
  const bytecode = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
      },
      FooBar: {
      },
    },
    template: {},
  };
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{"Default":{},"FooBar":{}},"template":{}}');
  Bytecode.deleteTimeline(bytecode, 'FooBar');
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{"Default":{}},"template":{}}');
});

tape('duplicateTimeline', (t) => {
  t.plan(2);
  const bytecode = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
      },
      FooBar: {
      },
    },
    template: {},
  };
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{"Default":{},"FooBar":{}},"template":{}}');
  Bytecode.duplicateTimeline(bytecode, 'FooBar');
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{"Default":{},"FooBar":{},"FooBar copy":{}},"template":{}}');
});

tape('ensureTimeline', (t) => {
  t.plan(2);
  const bytecode = {
    states: {},
    eventHandlers: {},
    timelines: {
    },
    template: {},
  };
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{},"template":{}}');
  Bytecode.ensureTimeline(bytecode, 'FooBar');
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{"FooBar":{}},"template":{}}');
});

tape('ensureTimelineGroup', (t) => {
  t.plan(2);
  const bytecode = {
    states: {},
    eventHandlers: {},
    timelines: {
    },
    template: {},
  };
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{},"template":{}}');
  Bytecode.ensureTimelineGroup(bytecode, 'FooBar', 'abcd');
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{"FooBar":{"haiku:abcd":{}}},"template":{}}');
});

tape('ensureTimelineProperty', (t) => {
  t.plan(2);
  const bytecode = {
    states: {},
    eventHandlers: {},
    timelines: {
    },
    template: {},
  };
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{},"template":{}}');
  Bytecode.ensureTimelineProperty(bytecode, 'FooBar', 'abcd', 'opacity');
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{"FooBar":{"haiku:abcd":{"opacity":{}}}},"template":{}}');
});

tape('getSortedKeyframeKeys', (t) => {
  t.plan(1);
  const keys = Bytecode.getSortedKeyframeKeys({
    0: {value: 123},
    10: {value: 123},
    1000: {value: 123},
    44: {value: 123},
    346: {value: 123},
    2: {value: 123},
    100: {value: 123},
  });
  t.equal(JSON.stringify(keys), '[0,2,10,44,100,346,1000]');
});

tape('joinKeyframes', (t) => {
  t.plan(2);
  const bytecode = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
        'haiku:abcdefghijk': {
          opacity: {
            0: {
              value: 0,
            },
            150: {
              value: 1,
            },
          },
        },
      },
    },
    template: {elementName: 'svg', attributes: {'haiku-id': 'abcdefghijk'}},
  };
  t.equal(JSON.stringify(bytecode.timelines.Default), '{"haiku:abcdefghijk":{"opacity":{"0":{"value":0},"150":{"value":1}}}}');
  Bytecode.joinKeyframes(bytecode, 'abcdefghijk', 'Default', 'svg', 'opacity', 0, 150, 'easeOutBounce');
  t.equal(JSON.stringify(bytecode.timelines.Default), '{"haiku:abcdefghijk":{"opacity":{"0":{"value":0,"curve":"easeOutBounce","edited":true},"150":{"value":1}}}}');
});

tape('moveKeyframes', (t) => {
  t.plan(2);
  const bytecode = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
        'haiku:abcdefghijk': {
          opacity: {
            0: {
              value: 0,
              curve: 'linear',
            },
            150: {
              value: 1,
            },
          },
        },
      },
    },
    template: {elementName: 'svg', attributes: {'haiku-id': 'abcdefghijk'}},
  };
  t.equal(JSON.stringify(bytecode.timelines.Default), '{"haiku:abcdefghijk":{"opacity":{"0":{"value":0,"curve":"linear"},"150":{"value":1}}}}');
  Bytecode.moveKeyframes(bytecode, {
    Default: {
      abcdefghijk: {
        opacity: {
          0: {value: 1},
          150: {value: 3},
        },
      },
    },
  });
  t.equal(JSON.stringify(bytecode.timelines.Default), '{"haiku:abcdefghijk":{"opacity":{"0":{"value":1,"edited":true},"150":{"value":3,"edited":true}}}}');
});

tape('renameTimeline', (t) => {
  t.plan(2);
  const bytecode = {
    states: {},
    eventHandlers: {},
    timelines: {
      Default: {
      },
      FooBar: {
      },
    },
    template: {},
  };
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{"Default":{},"FooBar":{}},"template":{}}');
  Bytecode.renameTimeline(bytecode, 'FooBar', 'BazQux');
  t.equal(JSON.stringify(bytecode), '{"states":{},"eventHandlers":{},"timelines":{"Default":{},"BazQux":{}},"template":{}}');
});
