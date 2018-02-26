var Haiku = require('@haiku/core')
module.exports = {
  metadata: {
    type: 'haiku',
    name: 'HaikuControlsPath'
  },
  options: {},
  states: {
    'sizeAbsolute.x': { type: 'number', value: 200 },
    'sizeAbsolute.y': { type: 'number', value: 200 },
    d: {
      type: 'array',
      // Please refer to SVGPoints.pathToPoints for data format reference
      value: [
        { x: 25, y: 0, moveTo: true },
        { x: 175, y: 0 },
        { x: 200, y: 25 },
        { x: 200, y: 175 },
        { x: 175, y: 200 },
        { x: 25, y: 200 },
        { x: 0, y: 175 },
        { x: 0, y: 25 },
        { x: 25, y: 0 }
      ]
    },
    stroke: { type: 'string', value: '#aaa' },
    strokeWidth: { type: 'number', value: 1 },
    fill: { type: 'string', value: '#eee' },
    fillRule: { type: 'string', value: 'evenodd' },
    linecap: { type: 'string', value: 'square' }
  },
  eventHandlers: {},
  timelines: {
    Default: {
      'haiku:HaikuControlsPathWrapper': {
        'style.WebkitTapHighlightColor': { '0': { value: 'rgba(0,0,0,0)' } },
        'style.position': { '0': { value: 'relative' } },
        'style.overflowX': { '0': { value: 'hidden' } },
        'style.overflowY': { '0': { value: 'hidden' } },
        'sizeAbsolute.x': { '0': {
          value: Haiku.inject(function (sizeAbsoluteX) {
            return sizeAbsoluteX
          }, 'sizeAbsolute.x')
        } },
        'sizeAbsolute.y': { '0': {
          value: Haiku.inject(function (sizeAbsoluteY) {
            return sizeAbsoluteY
          }, 'sizeAbsolute.y')
        } },
        'sizeMode.x': { '0': { value: 1 } },
        'sizeMode.y': { '0': { value: 1 } },
        'sizeMode.z': { '0': { value: 1 } }
      },
      'haiku:HaikuControlsPathSVGContext': {
        viewBox: { '0': {
          value: Haiku.inject(function (sizeAbsoluteX, sizeAbsoluteY) {
            return '0 0 ' + sizeAbsoluteX + ' ' + sizeAbsoluteY
          }, 'sizeAbsolute.x', 'sizeAbsolute.y')
        } },
        'style.position': { '0': { value: 'absolute' } },
        'style.margin': { '0': { value: '0' } },
        'style.padding': { '0': { value: '0' } },
        'style.border': { '0': { value: '0' } },
        'sizeAbsolute.x': { '0': {
          value: Haiku.inject(function (sizeAbsoluteX) {
            return sizeAbsoluteX
          }, 'sizeAbsolute.x')
        } },
        'sizeAbsolute.y': { '0': {
          value: Haiku.inject(function (sizeAbsoluteY) {
            return sizeAbsoluteY
          }, 'sizeAbsolute.y')
        } },
        'sizeMode.x': { '0': { value: 1 } },
        'sizeMode.y': { '0': { value: 1 } },
        'translation.x': { '0': { value: 0 } },
        'translation.y': { '0': { value: 0 } },
        'style.zIndex': { '0': { value: 1 } }
      },
      'haiku:HaikuControlsPathGroup': {
        stroke: { '0': {
          value: Haiku.inject(function (stroke) {
            return stroke
          }, 'stroke')
        } },
        'stroke-width': { '0': {
          value: Haiku.inject(function (strokeWidth) {
            return strokeWidth
          }, 'strokeWidth')
        } },
        fill: { '0': {
          value: Haiku.inject(function (fill) {
            return fill
          }, 'fill')
        } },
        'fill-rule': { '0': {
          value: Haiku.inject(function (fillRule) {
            return fillRule
          }, 'fillRule')
        } },
        'stroke-linecap': { '0': {
          value: Haiku.inject(function (linecap) {
            return linecap
          }, 'linecap')
        } }
      },
      'haiku:HaikuControlsPathPath': {
        d: { '0': {
          value: Haiku.inject(function (d) {
            return d
          }, 'd')
        } },
        stroke: { '0': {
          value: Haiku.inject(function (stroke) {
            return stroke
          }, 'stroke')
        } }
      }
    }
  },

  template: {
    elementName: 'div',
    attributes: {
      'haiku-title': 'HaikuControlsPathWrapper',
      'haiku-id': 'HaikuControlsPathWrapper'
    },
    children: [
      {
        elementName: 'svg',
        attributes: {
          version: '1.1',
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          'haiku-title': 'HaikuControlsPathSVGContext',
          'haiku-id': 'HaikuControlsPathSVGContext'
        },
        children: [
          {
            elementName: 'g',
            attributes: { id: 'HaikuControlsPathGroup', 'haiku-id': 'HaikuControlsPathGroup' },
            children: [
              {
                elementName: 'path',
                attributes: { id: 'HaikuControlsPathPath', 'haiku-id': 'HaikuControlsPathPath' },
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
}
