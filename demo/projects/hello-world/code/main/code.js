module.exports = {
  options: {
    autoplay: false,
  },
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
          this.getTimeline('Default').play();
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
        'rotation.z': {
          0: {value: 0, curve: 'linear'},
          1000: {value: 3.14159},
        },
      },
    },
  },
  template: {elementName: 'div', attributes: {id: 'box'}, children: []},
};
