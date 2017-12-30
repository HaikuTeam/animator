module.exports = {
  states: {
    foobar: {
      value: 1.2
    }
  },
  timelines: {
    Default: {
      '#hello': {
        content: {
          0: {
            value: ({
              foobar,
              parseInt,
              Math,
              Number
            }) => {
              return parseInt(foobar) * Math.sin(Number('1.2'))
            }
          }
        }
      }
    }
  },
  template: '<pre><code id="hello">Hello World!</code></div>'
}
