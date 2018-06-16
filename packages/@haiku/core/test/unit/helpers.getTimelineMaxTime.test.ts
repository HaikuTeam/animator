import * as tape from 'tape';

import getTimelineMaxTime from '@core/helpers/getTimelineMaxTime';

tape(
  'helpers.getTimelineMaxTime',
  (t) => {
    t.plan(1);
    const timelinesObject = {
      'haiku:0e366ff49e89': {
        'style.WebkitTapHighlightColor': {0: {value: 'rgba(0,0,0,0)'}},
        'style.position': {0: {value: 'relative'}},
        'style.overflowX': {0: {value: 'hidden'}},
        'style.overflowY': {0: {value: 'hidden'}},
        'sizeAbsolute.x': {0: {value: 550}},
        'sizeAbsolute.y': {0: {value: 400}},
        'sizeMode.x': {0: {value: 1}},
        'sizeMode.y': {0: {value: 1}},
        'sizeMode.z': {0: {value: 1}},
      },
      __max: 0,
      'haiku:a2f83a742779': {
        viewBox: {0: {value: '0 0 50 46'}},
        'style.position': {0: {value: 'absolute'}},
        'style.margin': {0: {value: '0'}},
        'style.padding': {0: {value: '0'}},
        'style.border': {0: {value: '0'}},
        'sizeAbsolute.x': {0: {value: 50}},
        'sizeMode.x': {0: {value: 1}},
        'sizeAbsolute.y': {0: {value: 46}},
        'sizeMode.y': {0: {value: 1}},
        'translation.x': {
          0: {
            value: 77.5,
            edited: true,
          },
        },
        'translation.y': {
          0: {
            value: 162,
            edited: true,
          },
          833: {
            value: 161,
            edited: true,
          },
          1000: {
            value: 160,
            edited: true,
          },
          1083: {
            value: 159,
            edited: true,
          },
        },
        'style.zIndex': {0: {value: 1}},
      },
      // tslint:disable-next-line:max-line-length
      'haiku:236164e88fdf': {d: {0: {value: 'M32.999,21.4233261 C30.173,15.7283261 21,17.3593261 21,24.6933261 C21,31.9633261 30.903,35.6313261 32.999,40.0043261 C35.095,35.6313261 44.999,31.9633261 44.999,24.6933261 C44.999,17.3663261 35.829,15.7213261 32.999,21.4233261 L32.999,21.4233261 Z'}}},
      'haiku:3c879655e7dc': {
        x: {0: {value: '-95.8%'}},
        y: {0: {value: '-72.7%'}},
        filterUnits: {0: {value: 'objectBoundingBox'}},
        'sizeProportional.x': {0: {value: 2.917}},
        'sizeMode.x': {0: {value: 0}},
        'sizeProportional.y': {0: {value: 3.09}},
        'sizeMode.y': {0: {value: 0}},
      },
      'haiku:d4376ca58f72': {
        dx: {0: {value: '0'}},
        dy: {0: {value: '7'}},
        in: {0: {value: 'SourceAlpha'}},
        result: {0: {value: 'shadowOffsetOuter1'}},
      },
      'haiku:07fb9083ae74': {
        stdDeviation: {0: {value: '6.5'}},
        in: {0: {value: 'shadowOffsetOuter1'}},
        result: {0: {value: 'shadowBlurOuter1'}},
      },
      'haiku:b1041d8013de': {
        values: {0: {value: '0 0 0 0 0.0823529412   0 0 0 0 0.101960784   0 0 0 0 0.105882353  0 0 0 0.200662364 0'}},
        in: {0: {value: 'shadowBlurOuter1'}},
      },
      'haiku:4045b7eaf1f5': {
        stroke: {0: {value: 'none'}},
        'stroke-width': {0: {value: '1'}},
        fill: {0: {value: 'none'}},
        'fill-rule': {0: {value: 'evenodd'}},
      },
      'haiku:772a1ae0e48d': {
        'fill-rule': {0: {value: 'nonzero'}},
        'translation.x': {0: {value: -8}},
        'translation.y': {0: {value: -12}},
      },
      'haiku:40943e4d551f': {
        fill: {0: {value: 'black'}},
        'fill-opacity': {0: {value: '1'}},
        filter: {0: {value: 'url(#filter-2-8ecf01)'}},
        'xlink:href': {0: {value: '#path-1-8ecf01'}},
      },
      'haiku:72d67ab0f84c': {
        fill: {0: {value: '#E5167A'}},
        'fill-rule': {0: {value: 'evenodd'}},
        'xlink:href': {0: {value: '#path-1-8ecf01'}},
      },
    };
    const maxTime = getTimelineMaxTime(timelinesObject);
    t.equal(
      maxTime,
      1083,
    );
  },
);
