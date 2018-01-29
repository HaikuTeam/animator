module.exports = {
  timelines: {
    Default: {
      '#hello': {
        content: {
          0: {
            value: ({
              $window
            }) => {
              return JSON.stringify(
                {
                  $window
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
