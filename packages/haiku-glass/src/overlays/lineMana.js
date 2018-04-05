import Palette from 'haiku-ui-common/lib/Palette'

/**
 * Provides mana for the lines connecting control points rendered on stage.
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 */
export default (x1, y1, x2, y2) => ({
  elementName: 'svg',
  attributes: {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'visible'
    }
  },
  children: [{
    elementName: 'line',
    attributes: {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      stroke: Palette.DARKER_ROCK2,
      'stroke-width': '1px',
      'vector-effect': 'non-scaling-stroke'
    }
  }]
})
