var Haiku = require('@haiku/core')

module.exports = {
  metadata: {
    type: 'haiku',
    name: 'HaikuControlsFont',
    nonrendered: true
  },

  states: {
    name: { type: 'string', value: '' },
    href: { type: 'string', value: '' }
  },

  timelines: {
    Default: {
      'haiku:HaikuControlsDiv': {
        'style.position': 'relative',
        'sizeAbsolute.x': 100,
        'sizeAbsolute.y': 50,
        'sizeMode.x': 1,
        'sizeMode.y': 1,
        'sizeMode.z': 1,
        'content': {
          '0': {
            value: Haiku.inject(function (href, name) {
              const style = {
                elementName: 'style',
                attributes: {},
                children: [`
                  @font-face {
                    font-family: "${name}";
                    src: url("${href}");
                  }
                `]
              }

              if (this.isEditMode()) {
                return {
                  elementName: 'div',
                  attributes: {
                    style: {
                      position: 'absolute',
                      overflow: 'hidden',
                      top: '25px',
                      left: '50px',
                      fontSize: '11px',
                      fontFamily: name,
                      width: '100%',
                      height: '100%',
                      padding: '5px',
                      borderRadius: '4px',
                      backgroundColor: 'rgb(52, 63, 65)',
                      border: '1px solid rgb(33, 45, 49)',
                      wordWrap: 'break-word'
                    }
                  },
                  children: [
                    name,
                    style
                  ]
                }
              }

              return style
            }, 'href', 'name')
          }
        }
      }
    }
  },

  template: {
    elementName: 'div',
    attributes: {
      'haiku-title': 'HaikuControlsFont',
      'haiku-id': 'HaikuControlsDiv'
    },
    children: []
  }
}
