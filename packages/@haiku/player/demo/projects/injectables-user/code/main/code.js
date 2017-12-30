module.exports = {
  timelines: {
    Default: {
      '#hello': {
        content: {
          0: {
            value: ({
              $user,
              $user: { mouse: { x } }
            }) => {
              return JSON.stringify(
                {
                  $user,
                  x
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
