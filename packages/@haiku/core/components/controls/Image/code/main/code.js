var Haiku = require('@haiku/core')

module.exports = {
  metadata: {
    type: 'haiku',
    name: 'HaikuControlsImage'
  },

  states: {
    width: { type: 'number', value: 200 },
    height: { type: 'number', value: 200 },
    href: { type: 'string', value: 'https://via.placeholder.com/200x200' }
  },

  timelines: {
    Default: {
      'haiku:HaikuControlsImageDivWrapper': {
        'origin.x': { '0': { value: 0 } },
        'origin.y': { '0': { value: 0 } },
        'origin.z': { '0': { value: 0 } },
        'style.WebkitTapHighlightColor': { '0': { value: 'rgba(0,0,0,0)' } },
        'style.position': { '0': { value: 'relative' } },
        'style.overflowX': { '0': { value: 'hidden' } },
        'style.overflowY': { '0': { value: 'hidden' } },
        'sizeMode.x': { '0': { value: 1 } },
        'sizeMode.y': { '0': { value: 1 } },
        'sizeMode.z': { '0': { value: 1 } },
        'sizeAbsolute.x': {
          '0': {
            value: Haiku.inject(function (width) {
              return width
            }, 'width')
          }
        },
        'sizeAbsolute.y': {
          '0': {
            value: Haiku.inject(function (height) {
              return height
            }, 'height')
          }
        }
      },
      'haiku:HaikuControlsImageSvgWrapper': {
        'sizeMode.x': { '0': { value: 1 } },
        'sizeMode.y': { '0': { value: 1 } },
        'sizeMode.z': { '0': { value: 1 } },
        'sizeAbsolute.x': {
          '0': {
            value: Haiku.inject(function (width) {
              return width
            }, 'width')
          }
        },
        'sizeAbsolute.y': {
          '0': {
            value: Haiku.inject(function (height) {
              return height
            }, 'height')
          }
        }
      },
      'haiku:HaikuControlsImageSvgImageElement': {
        'sizeMode.x': { '0': { value: 1 } },
        'sizeMode.y': { '0': { value: 1 } },
        'sizeMode.z': { '0': { value: 1 } },
        'sizeAbsolute.x': {
          '0': {
            value: Haiku.inject(function (width) {
              return width
            }, 'width')
          }
        },
        'sizeAbsolute.y': {
          '0': {
            value: Haiku.inject(function (height) {
              return height
            }, 'height')
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
