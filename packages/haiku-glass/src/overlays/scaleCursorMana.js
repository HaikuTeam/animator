/**
 * Provides mana for the scale cursor on stage.
 * @param mousePosition
 * @param boxPoints
 * @param origin
 * @param activationIndex
 * @param alt
 * @returns {*}
 */
export default ({x, y}, boxPoints, origin, activationIndex, alt) => {
  const activationPoint = boxPoints[activationIndex]
  const fixedPoint = alt ? origin : boxPoints[8 - activationIndex]
  return {
    elementName: 'svg',
    attributes: {
      width: '28',
      height: '18',
      style: {
        position: 'absolute',
        left: `${x - 14}px`,
        top: `${y - 9}px`,
        transform: `rotateZ(${Math.atan2(activationPoint.y - fixedPoint.y, activationPoint.x - fixedPoint.x)}rad)`
      }
    },
    'children': [{
      elementName: 'defs',
      children: [{
        elementName: 'filter',
        attributes: {
          x: '-18.9%',
          y: '-42.2%',
          width: '134.9%',
          height: '191.9%',
          filterUnits: 'objectBoundingBox',
          id: 'd'
        },
        children: [{
          elementName: 'feMorphology',
          attributes: {
            radius: '1',
            operator: 'dilate',
            in: 'SourceAlpha',
            result: 'shadowSpreadOuter1'
          }
        }, {
          elementName: 'feOffset',
          attributes: {
            dx: -0.3,
            dy: 0.3,
            in: 'shadowSpreadOuter1',
            result: 'shadowOffsetOuter1'
          }
        }, {
          elementName: 'feGaussianBlur',
          attributes: {
            stdDeviation: 0.5,
            in: 'shadowOffsetOuter1',
            result: 'shadowBlurOuter1'
          }
        }, {
          elementName: 'feComposite',
          attributes: {
            in: 'shadowBlurOuter1',
            in2: 'SourceAlpha',
            operator: 'out',
            result: 'shadowBlurOuter1'
          }
        }, {
          elementName: 'feColorMatrix',
          attributes: {
            values: '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.134227808 0',
            in: 'shadowBlurOuter1'
          }
        }]
      }]
    }, {
      elementName: 'g',
      attributes: {
        transform: 'translate(-483 -211)',
        fill: 'none',
        'fill-rule': 'evenodd'
      },
      children: [{
        elementName: 'path',
        attributes: {
          d: 'M503.972 218.5V216l3.972 3.972-3.972 3.972V221.5h-13v2.444L487 219.972l3.972-3.972v2.5h13z',
          fill: '#000',
          filter: 'url(#d)'
        }
      }, {
        elementName: 'path',
        attributes: {
          d: 'M503.972 218.5V216l3.972 3.972-3.972 3.972V221.5h-13v2.444L487 219.972l3.972-3.972v2.5h13z',
          stroke: '#FFF',
          fill: '#0D0C0C'
        }
      }]
    }]
  }
}
