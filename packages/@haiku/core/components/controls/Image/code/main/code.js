var Haiku = require('@haiku/core')

module.exports = {
  metadata: {
    type: 'haiku',
    name: 'HaikuControlsImage'
  },

  states: {
    'sizeAbsolute.x': { type: 'number', value: 200 },
    'sizeAbsolute.y': { type: 'number', value: 200 },
    href: { type: 'string', value: 'https://via.placeholder.com/200x200' }
  },

  timelines: {
    Default: {
      'haiku:HaikuControlsImageDivWrapper': {
        'style.WebkitTapHighlightColor': { '0': { value: 'rgba(0,0,0,0)' } },
        'style.position': { '0': { value: 'relative' } },
        'style.overflowX': { '0': { value: 'hidden' } },
        'style.overflowY': { '0': { value: 'hidden' } },
        'sizeMode.x': { '0': { value: 1 } },
        'sizeMode.y': { '0': { value: 1 } },
        'sizeMode.z': { '0': { value: 1 } },
        'sizeAbsolute.x': {
          '0': {
            value: Haiku.inject(function (sizeAbsoluteX) {
              return sizeAbsoluteX
            }, 'sizeAbsolute.x')
          }
        },

        'sizeAbsolute.y': {
          '0': {
            value: Haiku.inject(function (sizeAbsoluteY) {
              return sizeAbsoluteY
            }, 'sizeAbsolute.y')
          }
        }
      },
      'haiku:HaikuControlsImageSvgWrapper': {
        'sizeMode.x': { '0': { value: 1 } },
        'sizeMode.y': { '0': { value: 1 } },
        'sizeMode.z': { '0': { value: 1 } },
        'sizeAbsolute.x': {
          '0': {
            value: Haiku.inject(function (sizeAbsoluteX) {
              return sizeAbsoluteX
            }, 'sizeAbsolute.x')
          }
        },
        'sizeAbsolute.y': {
          '0': {
            value: Haiku.inject(function (sizeAbsoluteY) {
              return sizeAbsoluteY
            }, 'sizeAbsolute.y')
          }
        }
      },
      'haiku:HaikuControlsImageSvgImageElement': {
        'sizeMode.x': { '0': { value: 1 } },
        'sizeMode.y': { '0': { value: 1 } },
        'sizeMode.z': { '0': { value: 1 } },
        'sizeAbsolute.x': {
          '0': {
            value: Haiku.inject(function (sizeAbsoluteX) {
              return sizeAbsoluteX
            }, 'sizeAbsolute.x')
          }
        },
        'sizeAbsolute.y': {
          '0': {
            value: Haiku.inject(function (sizeAbsoluteY) {
              return sizeAbsoluteY
            }, 'sizeAbsolute.y')
          }
        },
        'href': {
          '0': {
            value: Haiku.inject(function (href) {
              return href || ''
            }, 'href')
          }
        }
      }
    }
  },

  template: {
    elementName: 'div',
    attributes: {
      'haiku-title': 'HaikuControlsImage',
      'haiku-id': 'HaikuControlsImageDivWrapper'
    },
    children: [
      {
        elementName: 'svg',
        attributes: {
          version: '1.1',
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          'haiku-title': 'HaikuControlsImageSvgWrapper',
          'haiku-id': 'HaikuControlsImageSvgWrapper'
        },
        children: [
          {
            elementName: 'image',
            attributes: {
              'haiku-title': 'HaikuControlsImageSvgImageElement',
              'haiku-id': 'HaikuControlsImageSvgImageElement'
            }
          }
        ]
      }
    ]
  }
}
