/**
 * Provides mana for the rotation cursor on stage.
 * @param mousePosition
 * @param originPosition
 */
export default ({x, y}, {x: originX, y: originY}) => {
  return {
    elementName: 'svg',
    attributes: {
      width: 20,
      height: 14,
      style: {
        position: 'absolute',
        left: `${x - 10}px`,
        top: `${y - 7}px`,
        transform: `rotateZ(${Math.atan2(y - originY, x - originX) - 3 * Math.PI / 2}rad)`
      }
    },
    children: [
      {
        elementName: 'defs',
        children: [
          {
            elementName: 'filter',
            attributes: {
              x: '-28.3%',
              y: '-23.4%',
              width: '152.4%',
              height: '151.1%',
              filterUnits: 'objectBoundingBox',
              id: 'c'
            },
            children: [
              {
                elementName: 'feMorphology',
                attributes: {
                  radius: '1',
                  operator: 'dilate',
                  in: 'SourceAlpha',
                  result: 'shadowSpreadOuter1'
                }
              },
              {
                elementName: 'feOffset',
                attributes: {
                  dx: -0.3,
                  dy: 0.3,
                  in: 'shadowSpreadOuter1',
                  result: 'shadowOffsetOuter1'
                }
              },
              {
                elementName: 'feGaussianBlur',
                attributes: {
                  stdDeviation: 0.5,
                  in: 'shadowOffsetOuter1',
                  result: 'shadowBlurOuter1'
                }
              },
              {
                elementName: 'feComposite',
                attributes: {
                  in: 'shadowBlurOuter1',
                  in2: 'SourceAlpha',
                  operator: 'out',
                  result: 'shadowBlurOuter1'
                }
              },
              {
                elementName: 'feColorMatrix',
                attributes: {
                  'values': '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.134227808 0',
                  'in': 'shadowBlurOuter1'
                }
              }
            ]
          }
        ]
      },
      {
        elementName: 'g',
        attributes: {
          transform: 'rotate(-45 13.77 695.552)',
          fill: 'none',
          'fill-rule': 'evenodd'
        },
        children: [
          {
            elementName: 'path',
            attributes: {
              d: 'M494.984 200.871a8.501 8.501 0 0 1 7.726 8.288h2.245l-3.971 3.972-3.972-3.972h2.197a5.002 5.002 0 0 0-4.225-4.763v2.384l-3.972-3.972 3.972-3.972v2.035z',
              fill: '#000',
              filter: 'url(#c)'
            }
          },
          {
            elementName: 'path',
            attributes: {
              d: 'M494.984 200.871a8.501 8.501 0 0 1 7.726 8.288h2.245l-3.971 3.972-3.972-3.972h2.197a5.002 5.002 0 0 0-4.225-4.763v2.384l-3.972-3.972 3.972-3.972v2.035z',
              stroke: '#FFF',
              fill: '#0D0C0C'
            }
          }
        ]
      }
    ]
  }
}
