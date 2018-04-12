import Palette from 'haiku-ui-common/lib/Palette'

/**
 * Provides mana for the lines connecting control points rendered on stage.
 * @param points
 */
export default (points) => ({
  elementName: 'polygon',
  attributes: {
    stroke: Palette.DARKER_ROCK2,
    'stroke-width': '1px',
    'vector-effect': 'non-scaling-stroke',
    fill: 'none',
    points
  }
})
