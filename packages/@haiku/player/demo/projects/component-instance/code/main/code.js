var Path = require('@haiku/player/components/Path/code/main/code')
module.exports = {
  metadata: {
    // uuid: 'HAIKU_SHARE_UUID'
    uuid: '228dbd29-2878-4a1f-bb46-21ac896273e2',
    project: 'Clickable Square',
    organization: 'Haiku'
  },
  states: {
    'clicks': {
      type: 'number',
      value: 0
    },
    'rotation': {
      type: 'number',
      value: 0
    }
  },
  eventHandlers: {
    '#box': {
      'click': {
        handler: function () {
          this.getTimelines()['Move'].gotoAndPlay(0)
          this.state.clicks = this.state.clicks + 1
        }
      }
    },
    '#path': {
      'click': {
        handler: function () {
          console.log('#path click called')
        }
      }
    }
  },
  timelines: {
    Default: {
      '#box': {
        'style.WebkitTapHighlightColor': {
          0: {
            value: 'rgba(0, 0, 0, 0)'
          }
        },
        'style.width': {
          0: {
            value: '300px'
          }
        },
        'style.height': {
          0: {
            value: '300px'
          }
        },
        'style.backgroundColor': {
          0: { value: 'red' },
          500: { value: 'blue' },
          1000: { value: 'green' },
          1500: { value: 'black' },
          2000: { value: 'brown' },
          2500: { value: 'yellow' },
          3000: { value: 'cyan' },
          3500: { value: 'orange' },
          4000: { value: 'gray' },
          4500: { value: 'red' }
        },
        'translation.x': {
          0: {
            value: 78
          }
        },
        'translation.y': {
          0: {
            value: 60
          }
        }
      },
      '#path': {
        'translation.x': {
          '0': {
            value: 45
          }
        },
        'width': {
          '0': {
            value: 100
          }
        },
        'height': {
          '0': {
            value: 100
          }
        },
        'stroke': {
          '0': {
            value: '#fff'
          }
        },
        'strokeWidth': {
          '0': {
            value: 5
          }
        },
        'd': {
          '0': {
            value: [
              { x: 0, y: 0, moveTo: true },
              { x: 10, y: 10 },
              { x: 20, y: 20 },
              { x: 30, y: 30 },
              { x: 40, y: 40 }
            ],
            curve: 'easeInOutBounce'
          },
          '2500': {
            value: [
              { x: 0, y: 0, moveTo: true },
              { x: 10, y: 5 },
              { x: 20, y: 25 },
              { x: 50, y: 80 },
              { x: 150, y: 200 }
            ]
          }
        }
      }
    },
    Move: {
      '#box': {
        'rotation.z': {
          0: {
            value: function ({ clicks }) {
              var n = clicks < 1 ? 0 : clicks - 1
              return n * Math.PI / 2
            },
            curve: 'easeInOutBounce'
          },
          2500: {
            value: function ({ clicks }) {
              return clicks * Math.PI / 2
            }
          }
        }
      }
    }
  },
  template: {
    elementName: 'div',
    attributes: { id: 'box' },
    children: [{
      elementName: Path,
      attributes: { id: 'path' },
      children: []
    }]
  }
}
