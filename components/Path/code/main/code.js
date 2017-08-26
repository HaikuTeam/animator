var Haiku = require('@haiku/player')
module.exports = {
  metadata: {
    type: "haiku",
    name: "Path"
  },
  options: {},
  states: {
    width: { type: 'number', value: 0 },
    height: { type: 'number', value: 0 },
    d: {
      type: 'array',
      // Please refer to SVGPoints.pathToPoints for data format reference
      value: [
        { x: 0, y: 0, moveTo: true },
        { x: 0, y: 0 }
      ]
    },
    stroke: { type: 'string', value: '#000000' },
    strokeWidth: { type: 'number', value: 1 },
    fill: { type: 'string', value: 'none' },
    fillRule: { type: 'string', value: 'evenodd' },
    linecap: { type: 'string', value: 'square' }
  },
  eventHandlers: {},
  timelines: {
    Default: {
      "haiku:HaikuPathWrapper": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "hidden" } },
        "style.overflowY": { "0": { value: "hidden" } },
        "sizeAbsolute.x": { "0": {
          value: Haiku.inject(function (width) {
            return width
          }, 'width')
        } },
        "sizeAbsolute.y": { "0": {
          value: Haiku.inject(function (height) {
            return height
          }, 'height')
        } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:HaikuPathSVGContext": {
        viewBox: { "0": {
          value: Haiku.inject(function (width, height) {
            return "0 0 " + width + " " + height
          }, 'width', 'height')
        } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": {
          value: Haiku.inject(function (width) {
            return width
          }, 'width')
        } },
        "sizeAbsolute.y": { "0": {
          value: Haiku.inject(function (height) {
            return height
          }, 'height')
        } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 0 } },
        "translation.y": { "0": { value: 0 } },
        "style.zIndex": { "0": { value: 1 } }
      },
      "haiku:HaikuPathGroup": {
        stroke: { "0": {
          value: Haiku.inject(function (stroke) {
            return stroke
          }, 'stroke')
        } },
        "stroke-width": { "0": {
          value: Haiku.inject(function (strokeWidth) {
            return strokeWidth
          }, 'strokeWidth')
        } },
        fill: { "0": {
          value: Haiku.inject(function (fill) {
            return fill
          }, 'fill')
        } },
        "fill-rule": { "0": {
          value: Haiku.inject(function (fillRule) {
            return fillRule
          }, 'fillRule')
        } },
        "stroke-linecap": { "0": {
          value: Haiku.inject(function (linecap) {
            return linecap
          }, 'linecap')
        } }
      },
      "haiku:HaikuPathPath": {
        d: { "0": {
          value: Haiku.inject(function (d) {
            return d
          }, 'd')
        } },
        stroke: { "0": {
          value: Haiku.inject(function (stroke) {
            return stroke
          }, 'stroke')
        } }
      }
    }
  },

  template: {
    elementName: "div",
    attributes: {
      "haiku-title": "HaikuPathWrapper",
      "haiku-id": "HaikuPathWrapper"
    },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          source: "@haiku/player/components/Path",
          "haiku-title": "HaikuPathSVGContext",
          "haiku-id": "HaikuPathSVGContext"
        },
        children: [
          {
            elementName: "g",
            attributes: { id: "HaikuPathGroup", "haiku-id": "HaikuPathGroup" },
            children: [
              {
                elementName: "path",
                attributes: { id: "HaikuPathPath", "haiku-id": "HaikuPathPath" },
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
};
