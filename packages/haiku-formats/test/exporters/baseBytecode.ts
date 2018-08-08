import {VERSION} from '@core/HaikuComponent';

export default {
  metadata: {
    core: VERSION,
  },
  timelines: {
    Default: {
      'haiku:wrapper': {
        'sizeAbsolute.x': {
          0: {
            value: 640,
          },
        },
        'sizeAbsolute.y': {
          0: {
            value: 480,
          },
        },
      },
      'haiku:svg': {
        'translation.x': {
          0: {
            value: 0,
            curve: 'linear',
          },
          1000: {
            value: 10,
          },
        },
        'translation.y': {
          0: {
            value: 20,
          },
        },
        'scale.x': {},
      },
      'haiku:shape': {
        stroke: {
          0: {
            value: '#FF0000',
          },
        },
        strokeWidth: {
          0: {
            value: 10,
          },
        },
        fill: {
          0: {
            value: '#00FF00',
          },
        },
      },
      __max: 1000,
    },
  },
  template: {
    elementName: 'div',
    attributes: {
      'haiku-id': 'wrapper',
    },
    children: [
      {
        elementName: 'svg',
        attributes: {
          'haiku-id': 'svg',
        },
        children: [
          {
            elementName: 'circle',
            attributes: {
              'haiku-id': 'shape',
            },
            children: [],
          },
        ],
      },
    ],
  },
};
