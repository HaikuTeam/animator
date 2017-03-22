module.exports = {
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
    name: 'click',
    selector: '#box',
    handler: function() {
      this.timelines.play('Move')
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
          0: {
            value: 'red'
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
