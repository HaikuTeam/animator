/**
 * Provides mana for the rotation cursor on stage.
 * @param scale
 * @param mousePosition
 * @param originPosition
 */
export default (scale, {x, y}, {x: originX, y: originY}) => ({
  elementName: 'g',
  attributes: {
    transform: `scale(${scale})`,
    style: {
      transformOrigin: `${x}px ${y}px 0px`,
    },
  },
  children: [{
    elementName: 'g',
    attributes: {
      transform: `translate(${x - 10} ${y - 7}) rotate(${Math.atan2(y - originY, x - originX) * 180 / Math.PI - 270} 10 7)`,
    },
    children: [
      {
        elementName: 'g',
        attributes: {
          transform: 'rotate(-45 13.77 695.552)',
          fill: 'none',
          'fill-rule': 'evenodd',
        },
        children: [
          {
            elementName: 'path',
            attributes: {
              d: 'M494.984 200.871a8.501 8.501 0 0 1 7.726 8.288h2.245l-3.971 3.972-3.972-3.972h2.197a5.002 5.002 0 0 0-4.225-4.763v2.384l-3.972-3.972 3.972-3.972v2.035z',
              fill: '#000',
              filter: 'url(#c)',
            },
          },
          {
            elementName: 'path',
            attributes: {
              d: 'M494.984 200.871a8.501 8.501 0 0 1 7.726 8.288h2.245l-3.971 3.972-3.972-3.972h2.197a5.002 5.002 0 0 0-4.225-4.763v2.384l-3.972-3.972 3.972-3.972v2.035z',
              stroke: '#FFF',
              fill: '#0D0C0C',
            },
          },
        ],
      },
    ],
  }],
});
