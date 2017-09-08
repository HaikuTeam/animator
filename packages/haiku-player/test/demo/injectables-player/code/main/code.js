module.exports = {
  timelines: {
    Default: {
      '#hello': {
        content: {
          0: {
            value: ({
              $player
            }) => {
              return JSON.stringify(
                {
                  $player
                },
                null,
                2
              )
            }
          }
        }
      }
    }
  },
  template: '<pre><code id="hello">Hello World!</code></div>'
}
