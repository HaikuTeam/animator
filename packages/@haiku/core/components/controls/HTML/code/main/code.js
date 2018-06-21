var Haiku = require('@haiku/core')
var xmlToMana = require('@haiku/core/lib/HaikuNode').xmlToMana

module.exports = {
  metadata: {
    type: 'haiku',
    name: 'HaikuControlsHTML'
  },

  states: {
    'sizeAbsolute.x': { type: 'number', value: 300 },
    'sizeAbsolute.y': { type: 'number', value: 100 },

    html: {
      type: 'any',

      value: {
        elementName: 'div',
        attributes: {
          style: {
            width: '100%',
            height: '100%',
            backgroundColor: '#eee',
            color: '#999'
          }
        },
        children: ['Add raw HTML here']
      },

      setter: function (value) {
        if (!value) {
          return ''
        }

        // If we were passed an object, assume the user knows what they're doing
        if (typeof value === 'object') {
          return value
        }

        // If the string looks like XML, try to parse to our format, otherwise use as-is
        if (typeof value === 'string') {
          var trimmed = value.trim()

          if (trimmed[0] === '<' && trimmed[trimmed.length - 1] === '>') {
            try {
              return xmlToMana(trimmed)
            } catch (exception) {
              console.warn(exception)
              return trimmed
            }
          }

          return trimmed
        }

        return value + ''
      }
    }
  },

  timelines: {
    Default: {
      'haiku:HaikuControlsHTML': {
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
        } },

        'insert': {
          '0': {
            'value': Haiku.inject(function (html) {
              if (!html) {
                return ''
              }

              return html
            }, 'html')
          }
        }
      }
    }
  },

  template: {
    elementName: 'div',
    attributes: {
      'haiku-title': 'HaikuControlsHTML',
      'haiku-id': 'HaikuControlsHTML'
    },
    children: []
  }
}
