/**
 * Provides mana for the origin overlay component rendered on stage.
 * @param scale
 * @param x
 * @param y
 * @param isDraggable
 * @returns {*}
 */
export default (scale, x, y, isDraggable, doUseFilters) => isDraggable
  ? {
    elementName: 'g',
    attributes: {
      transform: `scale(${scale}) translate(${x - 12.5} ${y - 12.5})`,
      style: {
        pointerEvents: 'all',
        transformOrigin: `${x}px ${y}px 0px`,
      },
    },
    children: [
      {
        elementName: 'path',
        attributes: {
          d: 'M13 12h3.5a.5.5 0 0 1 0 1H13v3.5a.5.5 0 0 1-1 0V13h-3.5a.5.5 0 0 1 0-1h3.5v-3.5a.5.5 0 0 1 1 0v3.5z',
          fill: '#000',
          filter: (doUseFilters) ? 'url(#b)' : undefined,
        },
      },
      {
        elementName: 'path',
        attributes: {
          d: 'M13 12h3.5a.5.5 0 0 1 0 1H13v3.5a.5.5 0 0 1-1 0V13h-3.5a.5.5 0 0 1 0-1h3.5v-3.5a.5.5 0 0 1 1 0v3.5z',
          fill: '#3f4a4d',
        },
      },
      {
        elementName: 'circle',
        attributes: {
          cx: 12.5,
          cy: 12.5,
          r: 2.5,
          fill: '#000',
          filter: (doUseFilters) ? 'url(#a)' : undefined,
        },
      },
      {
        elementName: 'circle',
        attributes: {
          cx: 12.5,
          cy: 12.5,
          r: 2.5,
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
          class: 'origin',
        },
      },
    ],
  }
  : {
    elementName: 'g',
    attributes: {
      transform: `scale(${scale}) translate(${x - 5.5} ${y - 5.5})`,
      style: {
        pointerEvents: 'none',
        transformOrigin: `${x}px ${y}px 0px`,
      },
    },
    children: [
      {
        elementName: 'path',
        attributes: {
          d: 'M6 5h3.5a.5.5 0 0 1 0 1H6v3.5a.5.5 0 0 1-1 0V6h-3.5a.5.5 0 0 1 0-1h3.5v-3.5a.5.5 0 0 1 1 0v3.5z',
          fill: '#000',
          filter: (doUseFilters) ? 'url(#b)' : undefined,
        },
      },
      {
        elementName: 'path',
        attributes: {
          d: 'M6 5h3.5a.5.5 0 0 1 0 1H6v3.5a.5.5 0 0 1-1 0V6h-3.5a.5.5 0 0 1 0-1h3.5v-3.5a.5.5 0 0 1 1 0v3.5z',
          fill: '#3f4a4d',
        },
      },
    ],
  };
