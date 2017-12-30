var Haiku = require('@haiku/player')
module.exports = {
  states: {
    clicks: {
      value: 0,
    },
  },
  eventHandlers: {
    "#box": {
      "click": {
        handler: function () {
          this.state.clicks += 1
        }
      },
    },
  },
  timelines: {
    Default: {
      "#box": {
        "content": { 0: { 
          value: function (clicks) {
            return clicks + ""
          },
        }},
        "style.width": { 0: { value: "100px" }},
        "style.height": { 0: { value: "100px" }},
        "style.backgroundColor": { 0: { value: "red" }},
        "translation.x": {
          0: {
            value: Haiku.inject(function($helpers) {
              return $helpers.random()
            })
          }
        },
        "translation.y": {
          0: {
            value: Haiku.inject(function($helpers) {
              return 100
            })
          }
        }
      },
    },
  },
  template: `
    <div id="top">
      <div id="box"></div>
    </div>
  `,
}
