module.exports = {
  metadata: {
  },
  states: {},
  eventHandlers: {},
  timelines: {
    Default: {
      'haiku:div': {
        'style.position': { 0: { value: 'relative' } }
      },
      'haiku:d1': {
        'style.position': { 0: { value: 'absolute' } },
        'style.backgroundColor': { 0: { value: 'red' }, },
        'sizeAbsolute.x': { 0: { value: 100 } },
        'sizeAbsolute.y': { 0: { value: 100 } },
        'sizeMode.x': { 0: { value: 1 } },
        'sizeMode.y': { 0: { value: 1 } },
        'translation.x': { 0: { value: 0 } },
        'translation.y': { 0: { value: 0 } },
        'fake.foo': { 0: { value: '_1_' } }
      },
      'haiku:d2': {
        'style.position': { 0: { value: 'absolute' } },
        'style.backgroundColor': { 0: { value: 'green' }, },
        'sizeAbsolute.x': { 0: { value: 100 } },
        'sizeAbsolute.y': { 0: { value: 100 } },
        'sizeMode.x': { 0: { value: 1 } },
        'sizeMode.y': { 0: { value: 1 } },
        'translation.x': { 0: { value: 50 } },
        'translation.y': { 0: { value: 50 } },
        'fake.foo': { 0: { value: '_2_' } }
      },
      'haiku:d3': {
        'style.position': { 0: { value: 'absolute' } },
        'style.backgroundColor': { 0: { value: 'blue' }, },
        'sizeAbsolute.x': { 0: { value: 100 } },
        'sizeAbsolute.y': { 0: { value: 100 } },
        'sizeMode.x': { 0: { value: 1 } },
        'sizeMode.y': { 0: { value: 1 } },
        'translation.x': { 0: { value: 100 } },
        'translation.y': { 0: { value: 100 } },
        'fake.foo': { 0: { value: '_3_' } }
      },
      'haiku:d4': {
        'style.position': { 0: { value: 'absolute' } },
        'style.backgroundColor': { 0: { value: 'yellow' }, },
        'sizeAbsolute.x': { 0: { value: 100 } },
        'sizeAbsolute.y': { 0: { value: 100 } },
        'sizeMode.x': { 0: { value: 1 } },
        'sizeMode.y': { 0: { value: 1 } },
        'translation.x': { 0: { value: 150 } },
        'translation.y': { 0: { value: 150 } },
        'fake.foo': { 0: { value: '_4_' } }
      },
      'haiku:d5': {
        'style.position': { 0: { value: 'absolute' } },
        'style.backgroundColor': { 0: { value: 'violet' }, },
        'sizeAbsolute.x': { 0: { value: 100 } },
        'sizeAbsolute.y': { 0: { value: 100 } },
        'sizeMode.x': { 0: { value: 1 } },
        'sizeMode.y': { 0: { value: 1 } },
        'translation.x': { 0: { value: 200 } },
        'translation.y': { 0: { value: 200 } },
        'fake.foo': { 0: { value: '_5_' } }
      }
    }
  },
  template: {
    elementName: 'div',
    attributes: { 'haiku-id': 'div' },
    children: [
      { elementName: 'div', attributes: { 'haiku-id': 'd1' }, children: [] },
      { elementName: 'div', attributes: { 'haiku-id': 'd2' }, children: [] },
      { elementName: 'div', attributes: { 'haiku-id': 'd3' }, children: [] },
      { elementName: 'div', attributes: { 'haiku-id': 'd4' }, children: [] },
      { elementName: 'div', attributes: { 'haiku-id': 'd5' }, children: [] }
    ]
  }
}
