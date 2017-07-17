module.exports = {
  timelines: {
    Default: {
      '.span': {
        'sizeMode.x': { '0': { value: 1 }},
        'sizeMode.y': { '0': { value: 1 }}
      },
      '#d': {
        'style.color': {
          '0': {
            value: ({ $tree, $player: { timeline: { time }} }) => {
              return 'red'
            }
          }
        }
      }
    }
  },
  template: `
    <span class="span" id="a">
      <span class="span" id="b">
        <span class="span" id="c">CCCC</span>
        <span class="span" id="d">
          <span class="span" id="g">GGGG</span>
          <span class="span" id="h">HHHH</span>
          <span class="span" id="i">IIII</span>
        </span>
        <span class="span" id="e">EEEE</span>
        <span class="span" id="f">FFFF</span>
      </span>
    </span>
  `
}
