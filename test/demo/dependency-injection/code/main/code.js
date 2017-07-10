module.exports = {
  timelines: {
    Default: {
      '#hello': {
        content: {
          0: {
            value: ({
              clicks,
              $window: { width },
              $player
            }) => {
              return JSON.stringify(
                {
                  width,
                  clicks,
                  time: $player.clock.time.apparent
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
