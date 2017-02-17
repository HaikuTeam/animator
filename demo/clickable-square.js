var creation = require('./../src/creation/dom')

module.exports = creation({
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
    }
  },
  template: '<div id="box"></div>'
})
