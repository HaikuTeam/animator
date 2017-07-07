var N = null
module.exports = {
  states: {},
  eventHandlers: {},
  timelines: {
    Default: {
      '#title': {
        'translation.x': {
          0: { value: 0, curve: 'linear' },
          1000: { value: 100 }
        },
        'sizeProportional.y': { 0: { value: 0.1 } }
      },
      '#subti': {
        'translation.x': {
          0: { value: 0, curve: 'linear' },
          1000: { value: 120 }
        },
        'sizeProportional.y': { 0: { value: 0.1 } }
      },
      '#box1': {
        'translation.x': {
          0: { value: 0, curve: 'linear' },
          1000: { value: 150 }
        },
        'sizeProportional.y': { 0: { value: 0.1 } },
        'controlFlow.insert': { 0: { value: 2 } }
      },
      '#box2': {
        'translation.x': {
          0: { value: 0, curve: 'linear' },
          1000: { value: 60 }
        },
        'sizeProportional.y': { 0: { value: 0.1 } },
        'controlFlow.insert': { 0: { value: 1 } }
      },
      '#box3': {
        'translation.x': {
          0: { value: 0, curve: 'linear' },
          1000: { value: 200 }
        },
        'sizeProportional.y': { 0: { value: 0.1 } },
        'controlFlow.insert': { 0: { value: N } }
      },
      '#box4': {
        'translation.x': {
          0: { value: 0, curve: 'linear' },
          1000: { value: 103 }
        },
        'sizeProportional.y': { 0: { value: 0.1 } },
        'controlFlow.insert': { 0: { value: 0 } }
      }
    }
  },
  template: `
    <div>
      <span id="title"><strong>Run me in react-dom mode for checking correct behavior</strong></span>
      <span id="box1">box1 - this should become "chirp chirp"</span>
      <span id="box2">box2 - this should become "Thing..."</span>
      <span id="box3"><em>box3 - this should NOT be replaced</em></span>
      <span>
        <span id="subti"><strong>Hullo</strong></span>
        <span id="box4">box4 - this should become "Meow meow"</span>
      </span>
    </div>
  `
}
