var Haiku = require('@haiku/player')
module.exports = {
  states: {
    opacity: { value: 1 }
  },
  timelines: {
    Default: {
      'haiku:abcdefghijk': {
        'opacity': {
          0: {
            "value": Haiku.inject(function(opacity) {
              return opacity
            }, 'opacity')
          }
        },
        'rotation.z': {
          '0': {
            value: 0
          }
        }
      }
    }
  },
  template: {
    elementName: 'div',
    attributes: {'haiku-id':'abcdefghijk'},
    children: []
  }
}
