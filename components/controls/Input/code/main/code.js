var Haiku = require('@haiku/core')

module.exports = {
  metadata: {
    type: 'haiku',
    name: 'HaikuControlsInput'
  },

  states: {
    'sizeAbsolute.x': { type: 'number', value: 200 },
    'sizeAbsolute.y': { type: 'number', value: 100 },
    text: { type: 'string', value: 'Add text here' },
    color: { type: 'string', value: 'black' },
    fontFamily: { type: 'string', value: 'Helvetica, Arial, sans-serif' },
    fontSize: { type: 'string', value: '16px' },
    fontStyle: { type: 'string', value: 'normal' },
    fontVariant: { type: 'string', value: 'normal' },
    fontWeight: { type: 'string', value: 'normal' },
    textAnchor: { type: 'string', value: 'start' },
    alignmentBaseline: { type: 'string', value: 'auto' },
    x: { type: 'number', value: 0 },
    y: { type: 'number', value: 16 }
  },

  timelines: {
    Default: {
      'haiku:HaikuControlsInput': {
        'style.WebkitTapHighlightColor': { '0': { value: 'rgba(0,0,0,0)' } },
        'style.position': { '0': { value: 'relative' } },
        'style.overflowX': { '0': { value: 'hidden' } },
        'style.overflowY': { '0': { value: 'hidden' } },
        'sizeMode.x': { '0': { value: 1 } },
        'sizeMode.y': { '0': { value: 1 } },
        'sizeMode.z': { '0': { value: 1 } },
        'sizeAbsolute.x': { '0': {
          value: Haiku.inject(function (sizeAbsoluteX) {
            return sizeAbsoluteX
          }, 'sizeAbsolute.x')
        } },
        'sizeAbsolute.y': { '0': {
          value: Haiku.inject(function (sizeAbsoluteY) {
            return sizeAbsoluteY
          }, 'sizeAbsolute.y')
        } }
      },
      'haiku:HaikuControlsInputSVGContext': {
        'sizeMode.x': { '0': { value: 1 } },
        'sizeMode.y': { '0': { value: 1 } },
        'sizeMode.z': { '0': { value: 1 } },
        'sizeAbsolute.x': { '0': {
          value: Haiku.inject(function (sizeAbsoluteX) {
            return sizeAbsoluteX
          }, 'sizeAbsolute.x')
        } },
        'sizeAbsolute.y': { '0': {
          value: Haiku.inject(function (sizeAbsoluteY) {
            return sizeAbsoluteY
          }, 'sizeAbsolute.y')
        } }
      },
      'haiku:HaikuControlsImageSvgTextElement': {
        'sizeMode.x': { '0': { value: 1 } },
        'sizeMode.y': { '0': { value: 1 } },
        'sizeMode.z': { '0': { value: 1 } },
        'sizeAbsolute.x': { '0': {
          value: Haiku.inject(function (sizeAbsoluteX) {
            return sizeAbsoluteX
          }, 'sizeAbsolute.x')
        } },
        'sizeAbsolute.y': { '0': {
          value: Haiku.inject(function (sizeAbsoluteY) {
            return sizeAbsoluteY
          }, 'sizeAbsolute.y')
        } },
        'color': {
          '0': {
            value: Haiku.inject(function (color) {
              return color
            }, 'color')
          }
        },
        'x': {
          '0': {
            value: Haiku.inject(function (x) {
              return x
            }, 'x')
          }
        },
        'y': {
          '0': {
            value: Haiku.inject(function (y) {
              return y
            }, 'y')
          }
        },
        'font-family': {
          '0': {
            value: Haiku.inject(function (fontFamily) {
              return fontFamily
            }, 'fontFamily')
          }
        },
        'font-size': {
          '0': {
            value: Haiku.inject(function (fontSize) {
              return fontSize
            }, 'fontSize')
          }
        },
        'font-style': {
          '0': {
            value: Haiku.inject(function (fontStyle) {
              return fontStyle
            }, 'fontStyle')
          }
        },
        'font-variant': {
          '0': {
            value: Haiku.inject(function (fontVariant) {
              return fontVariant
            }, 'fontVariant')
          }
        },
        'font-weight': {
          '0': {
            value: Haiku.inject(function (fontWeight) {
              return fontWeight
            }, 'fontWeight')
          }
        },
        'text-anchor': {
          '0': {
            value: Haiku.inject(function (textAnchor) {
              return textAnchor
            }, 'textAnchor')
          }
        },
        'alignment-baseline': {
          '0': {
            value: Haiku.inject(function (alignmentBaseline) {
              return alignmentBaseline
            }, 'alignmentBaseline')
          }
        },
        'content': {
          '0': {
            value: Haiku.inject(function (text) {
              return text
            }, 'text')
          }
        }
      }
    }
  },

  template: {
    elementName: 'div',
    attributes: {
      'haiku-title': 'HaikuControlsInput',
      'haiku-id': 'HaikuControlsInput'
    },
    children: [
      {
        elementName: 'svg',
        attributes: {
          version: '1.1',
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          'haiku-title': 'HaikuControlsInputSVGContext',
          'haiku-id': 'HaikuControlsInputSVGContext'
        },
        children: [
          {
            elementName: 'text',
            attributes: {
              'haiku-title': 'HaikuControlsImageSvgTextElement',
              'haiku-id': 'HaikuControlsImageSvgTextElement'
            }
          }
        ]
      }
    ]
  }
}
