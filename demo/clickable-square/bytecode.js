module.exports = {
  metadata: {
    // uuid: 'HAIKU_SHARE_UUID'
    uuid: '228dbd29-2878-4a1f-bb46-21ac896273e2',
    // project: 'Clickable Square ASDFASF OMG OMASDFASDFSD',
    // organization: 'Haiku LLC Yaya FOOBAR hey'
  },
  properties: [{
    name: 'clicks',
    type: 'number',
    value: 0
  },{
    name: 'rotation',
    type: 'number',
    value: 0
  }],
  eventHandlers: [{
    name: 'onclick',
    selector: '#box',
    handler: function() {
      this.getTimelines()['Move'].play()
      this.clicks = this.clicks + 1
    }
  }],
  timelines: {
    Default: {
      '#box': {
        content: {
          0: {
            value: function (inputs) {
              return inputs.clicks + ''
            }
          }
        },
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
      }
    },
    Move: {
      '#box': {
        'rotation.z': {
          0: {
            value: function (inputs) {
              var n = (inputs.clicks < 1) ? 0 : (inputs.clicks - 1)
              return n * Math.PI / 2
            },
            curve: 'easeInOutBounce'
          },
          2500: {
            value: function (inputs) {
              return inputs.clicks * Math.PI / 2
            }
          }
        }
      }
    }
  },
  template: '<div id="box"></div>'
}
