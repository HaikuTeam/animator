let N = null;
module.exports = {
  states: {},
  eventHandlers: {},
  timelines: {
    Default: {
      '#title': {
        'translation.x': {
          0: {value: 0, curve: 'linear'},
          1000: {value: 100},
        },
        'sizeProportional.y': {0: {value: 0.1}},
      },
      '#subti': {
        'translation.x': {
          0: {value: 0, curve: 'linear'},
          1000: {value: 120},
        },
        'sizeProportional.y': {0: {value: 0.1}},
      },
      '#box1': {
        'translation.x': {
          0: {value: 0, curve: 'linear'},
          1000: {value: 150},
        },
        'sizeProportional.y': {0: {value: 0.1}},
        'controlFlow.placeholder': {0: {value: 'meow'}},
      },
      '#box2': {
        'translation.x': {
          0: {value: 0, curve: 'linear'},
          1000: {value: 60},
        },
        'sizeProportional.y': {0: {value: 0.1}},
        'controlFlow.placeholder': {0: {value: 'ruff'}},
      },
      '#box3': {
        'translation.x': {
          0: {value: 0, curve: 'linear'},
          1000: {value: 200},
        },
        'sizeProportional.y': {0: {value: 0.1}},
        'controlFlow.placeholder': {0: {value: N}},
      },
      '#box4': {
        'translation.x': {
          0: {value: 0, curve: 'linear'},
          1000: {value: 103},
        },
        'sizeProportional.y': {0: {value: 0.1}},
        'controlFlow.placeholder': {0: {value: 'tweet'}},
      },
    },
  },
  template: { elementName: 'div',
    attributes: {},
    children:
    [{ elementName: 'span',
      attributes: {id: 'title'},
      children:
      [{ elementName: 'strong',
        attributes: {},
        children: ['Run me in react-dom mode for checking correct behavior'] }] },
    { elementName: 'span',
      attributes: {id: 'box1'},
      children: ['box1 - this should become "chirp chirp"'] },
    { elementName: 'span',
      attributes: {id: 'box2'},
      children: ['box2 - this should become "Thing..."'] },
    { elementName: 'span',
      attributes: {id: 'box3'},
      children:
      [{ elementName: 'em',
        attributes: {},
        children: ['box3 - this should NOT be replaced'] }] },
    { elementName: 'span',
      attributes: {},
      children:
      [{ elementName: 'span',
        attributes: {id: 'subti'},
        children:
             [{elementName: 'strong', attributes: {}, children: ['Hullo']}] },
      { elementName: 'span',
        attributes: {id: 'box4'},
        children: ['box4 - this should become "Meow meow"'] }] }] },
};
