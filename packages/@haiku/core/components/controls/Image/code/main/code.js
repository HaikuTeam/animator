let Haiku = require('@haiku/core');

module.exports = {
  metadata: {
    type: 'haiku',
    name: 'HaikuControlsImage',
  },

  states: {
    width: {type: 'number', value: 200},
    height: {type: 'number', value: 200},
    href: {type: 'string', value: 'https://via.placeholder.com/200x200'},
  },

  timelines: {
    Default: {
      'haiku:HaikuControlsDiv': {
        'style.WebkitTapHighlightColor': {0: {value: 'rgba(0,0,0,0)'}},
        'style.position': {0: {value: 'relative'}},
        'style.overflowX': {0: {value: 'hidden'}},
        'style.overflowY': {0: {value: 'hidden'}},
        'sizeMode.x': {0: {value: 1}},
        'sizeMode.y': {0: {value: 1}},
        'sizeMode.z': {0: {value: 1}},
        'sizeAbsolute.x': {
          0: {
            value: Haiku.inject(function (width) {
              return width;
            }, 'width'),
          },
        },
        'sizeAbsolute.y': {
          0: {
            value: Haiku.inject(function (height) {
              return height;
            }, 'height'),
          },
        },
      },
      'haiku:HaikuControlsImg': {
        src: {
          0: {
            value: Haiku.inject(function (href) {
              return href || '';
            }, 'href'),
          },
        },
        width: {
          0: {
            value: Haiku.inject(function (width) {
              return width;
            }, 'width'),
          },
        },
        height: {
          0: {
            value: Haiku.inject(function (height) {
              return height;
            }, 'height'),
          },
        },
      },
    },
  },

  template: {
    elementName: 'div',
    attributes: {
      'haiku-title': 'HaikuControlsImage',
      'haiku-id': 'HaikuControlsDiv',
    },
    children: [
      {
        elementName: 'img',
        attributes: {
          'haiku-title': 'HaikuControlsImg',
          'haiku-id': 'HaikuControlsImg',
        },
        children: [],
      },
    ],
  },
};
