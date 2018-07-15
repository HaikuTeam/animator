import Palette from 'haiku-ui-common/lib/Palette';

/**
 * Provides mana for the lines connecting control points rendered on stage.
 * @param points
 */
export default (points, stroke = Palette.DARKER_ROCK2) => ({
  elementName: 'polygon',
  attributes: {
    stroke,
    'stroke-width': '1px',
    'vector-effect': 'non-scaling-stroke',
    fill: 'none',
    points,
  },
});
