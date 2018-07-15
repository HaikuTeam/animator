/**
 * Provides mana for the control point overlay rendered on stage.
 * @param scale
 * @param mousePosition
 * @param index
 * @param cursor
 * @returns {*}
 */
export default (scale, {x, y}, index, cursor) => ({
  elementName: 'g',
  attributes: {
    transform: `scale(${scale}) translate(${x - 12.5} ${y - 12.5})`,
    style: {
      cursor,
      pointerEvents: 'all',
      transformOrigin: `${x}px ${y}px 0px`,
    },
    onmouseenter: `hoverControlPoint(${index})`,
    onmouseleave: 'unhoverControlPoint()',
  },
  children: [
    {
      elementName: 'circle',
      attributes: {
        cx: 12.5,
        cy: 12.5,
        r: 3.5,
        fill: '#000',
        filter: 'url(#a)',
      },
    },
    {
      elementName: 'circle',
      attributes: {
        cx: 12.5,
        cy: 12.5,
        r: 3.5,
        fill: '#fff',
        stroke: '#3f4a4d',
      },
    },
    {
      elementName: 'circle',
      attributes: {
        cx: 12.5,
        cy: 12.5,
        r: 12.5,
        fill: 'none',
        class: 'control-point',
        'data-index': index,
      },
    },
  ],
});
