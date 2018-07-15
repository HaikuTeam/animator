import Palette from 'haiku-ui-common/lib/Palette';

/**
 * Provides mana for the lines connecting control points rendered on stage.
 * @param points
 */
export default ([x1, y1], [x2, y2], stroke = Palette.DARKER_ROCK2, isDashed = false) => ({
  elementName: 'line',
  attributes: {
    stroke,
    'stroke-width': '1px',
    'vector-effect': 'non-scaling-stroke',
    'stroke-dasharray': (isDashed) ? '4' : undefined,
    fill: 'none',
    x1,
    y1,
    x2,
    y2,
  },
});
