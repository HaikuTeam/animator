module.exports = {
  timelines: {
    Default: {
      '#hello': {
        content: {
          0: {
            value: ({
              clicks
            }) => {
              return JSON.stringify(
                {
                  clicks
                },
                null,
                2
              )
            }
          },
          10000: {
            value: 'finished'
          }
        }
      }
    }
  },
  eventHandlers: [
    {
      selector: '#hello',
      name: 'onclick',
      type: 'number',
      handler: function () {
        this.clicks = this.clicks + 1
      }
    }
  ],
  properties: [
    {
      name: 'clicks',
      value: 0
    }
  ],
  template: '<pre><code id="hello">Hello World!</code></div>'
}
