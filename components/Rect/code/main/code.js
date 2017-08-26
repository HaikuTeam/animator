var Haiku = require('@haiku/player')
module.exports = {
  metadata: {
    type: "haiku",
    name: "Rect"
  },
  options: {},
  states: {
    width: { type: 'number', value: 100 },
    height: { type: 'number', value: 100 },
    stroke: { type: 'string', value: '#979797' },
    strokeWidth: { type: 'number', value: 1 },
    fill: { type: 'string', value: 'none' },
    fillRule: { type: 'string', value: 'evenodd' },
    linecap: { type: 'string', value: 'square' }
  },
  eventHandlers: {},
  timelines: {
    Default: {
      "haiku:HaikuRectWrapper": {
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
      "haiku:HaikuRectSVGContext": {
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
      "haiku:HaikuRectGroup": {
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
      "haiku:HaikuRectRect": {
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
      "haiku-title": "HaikuRectWrapper",
      "haiku-id": "HaikuRectWrapper"
    },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          source: "@haiku/player/components/Rect",
          "haiku-title": "HaikuRectSVGContext",
          "haiku-id": "HaikuRectSVGContext",
          "viewBox": "0 0 100 100"
        },
        children: [
          {
            elementName: "g",
            attributes: { id: "HaikuRectGroup", "haiku-id": "HaikuRectGroup" },
            children: [
              {
                elementName: "rect",
                attributes: { id: "HaikuRectRect", "haiku-id": "HaikuRectRect" },
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
};
