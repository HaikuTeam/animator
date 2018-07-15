/**
 * Provides mana for the scale cursor on stage.
 * @param scale
 * @param mousePosition
 * @param boxPoints
 * @param origin
 * @param activationIndex
 * @param alt
 * @returns {*}
 */
export default (scale, {x, y}, boxPoints, origin, activationIndex, alt) => {
  const activationPoint = boxPoints[activationIndex];
  const fixedPoint = alt ? origin : boxPoints[8 - activationIndex];
  return {
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
        transform: `translate(${x - 14} ${y - 9}) rotate(${Math.atan2(activationPoint.y - fixedPoint.y, activationPoint.x - fixedPoint.x) * 180 / Math.PI} 14 9)`,
      },
      children: [
        {
          elementName: 'g',
          attributes: {
            transform: 'translate(-483 -211)',
            fill: 'none',
            'fill-rule': 'evenodd',
          },
          children: [
            {
              elementName: 'path',
              attributes: {
                d: 'M503.972 218.5V216l3.972 3.972-3.972 3.972V221.5h-13v2.444L487 219.972l3.972-3.972v2.5h13z',
                fill: '#000',
                filter: 'url(#d)',
              },
            },
            {
              elementName: 'path',
              attributes: {
                d: 'M503.972 218.5V216l3.972 3.972-3.972 3.972V221.5h-13v2.444L487 219.972l3.972-3.972v2.5h13z',
                stroke: '#FFF',
                fill: '#0D0C0C',
              },
            },
          ],
        },
      ],
    }],
  };
};
