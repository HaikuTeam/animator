let Haiku = require('@haiku/core');
module.exports = {
  states: {
    clicks: {
      value: 0,
    },
  },
  eventHandlers: {
    '#box': {
      click: {
        handler () {
          this.state.clicks += 1;
        },
      },
    },
  },
  timelines: {
    Default: {
      '#box': {
        content: { 0: {
          value (clicks) {
            return clicks + '';
          },
        }},
        'style.width': {0: {value: '100px'}},
        'style.height': {0: {value: '100px'}},
        'style.backgroundColor': {0: {value: 'red'}},
        'translation.x': {
          0: {
            value: Haiku.inject(function ($helpers) {
              return $helpers.rand() * 100;
            }),
          },
        },
        'translation.y': {
          0: {
            value: Haiku.inject(function ($helpers) {
              return 100;
            }),
          },
        },
      },
    },
  },
  template: { elementName: 'div',
    attributes: {id: 'top'},
    children:
   [{elementName: 'div', attributes: {id: 'box'}, children: []}] },
};
