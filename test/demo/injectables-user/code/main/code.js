module.exports = {
  timelines: {
    Default: {
      '#hello': {
        content: {
          0: {
            value: ({
              $user
            }) => {
              return JSON.stringify(
                {
                  $user
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
