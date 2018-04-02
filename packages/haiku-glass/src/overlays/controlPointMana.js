/**
 * Provides mana for the control point overlay rendered on stage.
 * @param scale
 * @param mousePosition
 * @param index
 * @param cursor
 * @returns {*}
 */
export default (scale, {x, y}, index, cursor) => ({
  elementName: 'div',
  attributes: {
    class: 'control-point',
    'data-index': index,
    style: {
      transform: `scale(${scale},${scale})`,
      position: 'absolute',
      pointerEvents: 'auto',
      left: (x - 6) + 'px',
      top: (y - 5) + 'px',
      width: '11px',
      height: '11px'
    }
  },
  children: [
    {
      elementName: 'svg',
      attributes: {
        width: 11,
        height: 11,
        style: {
          position: 'absolute'
        }
      },
      children: [
        {
          elementName: 'defs',
          children: [
            {
              elementName: 'filter',
              attributes: {
                x: '-35.7%',
                y: '-21.4%',
                width: '171.4%',
                height: '171.4%',
                filterUnits: 'objectBoundingBox',
                id: 'a'
              },
              children: [
                {
                  elementName: 'feMorphology',
                  attributes: {
                    radius: 0.5,
                    operator: 'dilate',
                    in: 'SourceAlpha',
                    result: 'shadowSpreadOuter1'
                  }
                },
                {
                  elementName: 'feOffset',
                  attributes: {
                    dy: '1', in: 'shadowSpreadOuter1', result: 'shadowOffsetOuter1'
                  }
                },
                {
                  elementName: 'feGaussianBlur',
                  attributes: {
                    stdDeviation: '.5', in: 'shadowOffsetOuter1', result: 'shadowBlurOuter1'
                  }
                },
                {
                  elementName: 'feComposite',
                  attributes: {
                    in: 'shadowBlurOuter1', in2: 'SourceAlpha', operator: 'out', result: 'shadowBlurOuter1'
                  }
                },
                {
                  elementName: 'feColorMatrix',
                  attributes: {
                    values: '0 0 0 0 0.0572963765 0 0 0 0 0.0587644961 0 0 0 0 0.059204932 0 0 0 0.307631341 0',
                    in: 'shadowBlurOuter1'
                  }
                }
              ]
            }
          ]
        },
        {
          elementName: 'rect',
          attributes: {
            x: 2,
            y: 1,
            width: 7,
            height: 7,
            rx: 3.5,
            fill: '#000',
            filter: 'url(#a)'
          }
        },
        {
          elementName: 'rect',
          attributes: {
            x: 2,
            y: 1,
            width: 7,
            height: 7,
            rx: 3.5,
            fill: '#fff',
            stroke: '#3f4a4d'
          }
        }
      ]
    },
    {
      elementName: 'div',
      attributes: {
        class: 'hit-area',
        onmouseenter: `hoverControlPoint(${index})`,
        onmouseleave: 'unhoverControlPoint()',
        style: {
          cursor,
          position: 'absolute',
          pointerEvents: 'auto',
          left: '-15px',
          top: '-15px',
          width: '30px',
          height: '30px'
        }
      }
    }
  ]
})
