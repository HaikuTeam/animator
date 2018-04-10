/**
 * Provides mana for the origin overlay component rendered on stage.
 * @param scale
 * @param x
 * @param y
 * @returns {*}
 */
export default (scale, x, y) => ({
  elementName: 'div',
  attributes: {
    class: 'origin',
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
                x: '-22.2%',
                y: '-11.1%',
                width: '144.4%',
                height: '144.4%',
                filterUnits: 'objectBoundingBox',
                id: 'b'
              },
              children: [
                {
                  elementName: 'feOffset',
                  attributes: {dy: '1', in: 'SourceAlpha', result: 'shadowOffsetOuter1'}
                },
                {
                  elementName: 'feGaussianBlur',
                  attributes: {stdDeviation: '.5', in: 'shadowOffsetOuter1', result: 'shadowBlurOuter1'}
                },
                {
                  elementName: 'feColorMatrix',
                  attributes: {
                    values: '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.31323596 0',
                    in: 'shadowBlurOuter1',
                    result: 'shadowMatrixOuter1'
                  }
                },
                {
                  elementName: 'feMerge',
                  attributes: {},
                  children: [
                    {
                      elementName: 'feMergeNode',
                      attributes: {in: 'shadowMatrixOuter1'}
                    },
                    {
                      elementName: 'feMergeNode',
                      attributes: {in: 'SourceGraphic'}
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          elementName: 'g',
          attributes: {
            filter: 'url(#b)',
            transform: 'translate(1)',
            fill: 'none',
            'fill-rule': 'evenodd'
          },
          children: [
            {
              elementName: 'g',
              attributes: {
                transform: 'translate(4)',
                fill: '#3F4A4D'
              },
              children: [
                {
                  elementName: 'rect',
                  attributes: {width: 1, height: 2, rx: 0.5}
                },
                {
                  elementName: 'rect',
                  attributes: {y: 7, width: 1, height: 2, rx: 0.5}
                }
              ]
            },
            {
              elementName: 'g',
              attributes: {transform: 'rotate(90 2.5 6.5)', fill: '#3F4A4D'},
              children: [
                {
                  elementName: 'rect',
                  attributes: {width: 1, height: 2, rx: 0.5}
                },
                {
                  elementName: 'rect',
                  attributes: {y: 7, width: 1, height: 2, rx: 0.5}
                }
              ]
            },
            {
              elementName: 'rect',
              attributes: {
                stroke: '#3F4A4D',
                fill: '#FFF',
                x: 1.875,
                y: 1.875,
                width: 5.25,
                height: 5.25,
                rx: 2.625
              }
            }
          ]
        }
      ]
    },
    {
      elementName: 'div',
      attributes: {
        class: 'hit-area',
        style: {
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
