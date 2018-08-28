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
          value (state) {
            return state.clicks + '';
          },
        }},
        'style.width': {0: {value: '100px'}},
        'style.height': {0: {value: '100px'}},
        'style.backgroundColor': {0: {value: 'red'}},
        'translation.x': {
          0: {
            value: Haiku.inject(function ($user) {
              return $user.mouse.x;
            }),
          },
        },
        'translation.y': {
          0: {
            value: Haiku.inject(function ($user) {
              return $user.mouse.y;
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
