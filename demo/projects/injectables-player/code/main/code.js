module.exports = {
  timelines: {
    Default: {
      '#hello': {
        content: {
          0: {
            value: ({
              $core
            }) => {
              return JSON.stringify(
                {
                  $core
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
