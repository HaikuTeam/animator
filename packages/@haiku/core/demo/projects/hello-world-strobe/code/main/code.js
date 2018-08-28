module.exports = {
  timelines: {
    Default: {
      '#div': {
        shown: {
          0: {value: true},
          100: {value: false},
          200: {value: true},
          300: {value: false},
          400: {value: true},
          500: {value: false},
          600: {value: true},
          700: {value: false},
          800: {value: true},
          900: {value: false},
          1000: {value: true},
        },
      },
    },
  },
  eventHandlers: {},
  states: {},
  template: {
    elementName: 'div',
    attributes: {id: 'div'},
    children: ['Hello World!'],
  },
};
