var Haiku = require("@haiku/player");
module.exports = {
  metadata: {
    uuid: "HAIKU_SHARE_UUID",
    type: "haiku",
    name: "designs_ted_sketch_contents_artboards_ted_svg",
    relpath: "code/designs_ted_sketch_contents_artboards_ted_svg/code.js"
  },

  options: {},
  states: {
    viewBox: { value: "0 0 92 47", type: "string" },
    stylePosition: { value: "absolute", type: "string" },
    styleMargin: { value: 0, type: "number" },
    stylePadding: { value: 0, type: "number" },
    styleBorder: { value: 0, type: "number" },
    sizeAbsoluteX: { value: 92, type: "number" },
    sizeModeX: { value: 1, type: "number" },
    sizeAbsoluteY: { value: 47, type: "number" },
    sizeModeY: { value: 1, type: "number" },
    content: { value: "TED", type: "string" },
    content_1: { value: "Created with sketchtool.", type: "string" },
    stroke: { value: "none", type: "string" },
    strokeWidth: { value: 1, type: "number" },
    fill: { value: "none", type: "string" },
    fillRule: { value: "evenodd", type: "string" },
    fill_1: { value: "#0000AA", type: "string" },
    fillRule_1: { value: "nonzero", type: "string" },
    pathInstructions: {
      value: [
        { x: 13, y: 18.203, moveTo: true },
        { x: 13, y: 12 },
        { x: 34.012, y: 12 },
        { x: 34.012, y: 18.203 },
        { x: 27.25, y: 18.203 },
        { x: 27.25, y: 36.3 },
        { x: 19.761, y: 36.3 },
        { x: 19.761, y: 18.203 },
        { x: 13, y: 18.203 },
        { x: 35.175, y: 12, moveTo: true },
        { x: 55.605, y: 12 },
        { x: 55.605, y: 18.203 },
        { x: 42.664, y: 18.203 },
        { x: 42.664, y: 21.195 },
        { x: 55.605, y: 21.195 },
        { x: 55.605, y: 27.032 },
        { x: 42.664, y: 27.032 },
        { x: 42.664, y: 30.097 },
        { x: 55.605, y: 30.097 },
        { x: 55.605, y: 36.3 },
        { x: 35.175, y: 36.3 },
        { x: 35.175, y: 12 },
        { x: 35.175, y: 12 },
        { x: 56.841, y: 12, moveTo: true },
        { x: 69.128, y: 12 },
        {
          curve: { type: "cubic", x1: 77.199, y1: 12, x2: 80.034, y2: 17.984 },
          x: 80.034,
          y: 24.114
        },

        {
          curve: {
            type: "cubic",
            x1: 80.034,
            y1: 31.557,
            x2: 76.108,
            y2: 36.3
          },

          x: 67.674,
          y: 36.3
        },

        { x: 56.841, y: 36.3 },
        { x: 56.841, y: 12 },
        { x: 56.841, y: 12 },
        { x: 64.33, y: 30.097, moveTo: true },
        { x: 67.238, y: 30.097 },
        {
          curve: {
            type: "cubic",
            x1: 71.891,
            y1: 30.097,
            x2: 72.546,
            y2: 26.303
          },

          x: 72.546,
          y: 24.041
        },

        {
          curve: {
            type: "cubic",
            x1: 72.546,
            y1: 22.508,
            x2: 72.037,
            y2: 18.276
          },

          x: 66.656,
          y: 18.276
        },

        { x: 64.257, y: 18.276 },
        { x: 64.33, y: 30.097 },
        { x: 64.33, y: 30.097 }
      ],

      type: "array"
    }
  },

  eventHandlers: {},
  timelines: {
    Default: {
      "haiku:10cab88a2d7e": {
        viewBox: {
          "0": {
            value: Haiku.inject(
              function(viewBox) {
                return viewBox;
              },
              "viewBox"
            )
          }
        },

        "style.position": {
          "0": {
            value: Haiku.inject(
              function(stylePosition) {
                return stylePosition;
              },
              "stylePosition"
            )
          }
        },

        "style.margin": {
          "0": {
            value: Haiku.inject(
              function(styleMargin) {
                return styleMargin;
              },
              "styleMargin"
            )
          }
        },

        "style.padding": {
          "0": {
            value: Haiku.inject(
              function(stylePadding) {
                return stylePadding;
              },
              "stylePadding"
            )
          }
        },

        "style.border": {
          "0": {
            value: Haiku.inject(
              function(styleBorder) {
                return styleBorder;
              },
              "styleBorder"
            )
          }
        },

        "sizeAbsolute.x": {
          "0": {
            value: Haiku.inject(
              function(sizeAbsoluteX) {
                return sizeAbsoluteX;
              },
              "sizeAbsoluteX"
            )
          }
        },

        "sizeMode.x": {
          "0": {
            value: Haiku.inject(
              function(sizeModeX) {
                return sizeModeX;
              },
              "sizeModeX"
            )
          }
        },

        "sizeAbsolute.y": {
          "0": {
            value: Haiku.inject(
              function(sizeAbsoluteY) {
                return sizeAbsoluteY;
              },
              "sizeAbsoluteY"
            )
          }
        },

        "sizeMode.y": {
          "0": {
            value: Haiku.inject(
              function(sizeModeY) {
                return sizeModeY;
              },
              "sizeModeY"
            )
          }
        },

        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.overflowX": { "0": { value: "hidden" } },
        "style.overflowY": { "0": { value: "hidden" } },
        "sizeMode.z": { "0": { value: 1 } }
      },

      "haiku:2ea6169eb698": {
        content: {
          "0": {
            value: Haiku.inject(
              function(content) {
                return content;
              },
              "content"
            )
          }
        }
      },

      "haiku:f65a6a9867f0": {
        content: {
          "0": {
            value: Haiku.inject(
              function(content_1) {
                return content_1;
              },
              "content_1"
            )
          }
        }
      },

      "haiku:9218c26b87e2": {
        stroke: {
          "0": {
            value: Haiku.inject(
              function(stroke) {
                return stroke;
              },
              "stroke"
            )
          }
        },

        "stroke-width": {
          "0": {
            value: Haiku.inject(
              function(strokeWidth) {
                return strokeWidth;
              },
              "strokeWidth"
            )
          }
        },

        fill: {
          "0": {
            value: Haiku.inject(
              function(fill) {
                return fill;
              },
              "fill"
            )
          }
        },

        "fill-rule": {
          "0": {
            value: Haiku.inject(
              function(fillRule) {
                return fillRule;
              },
              "fillRule"
            )
          }
        }
      },

      "haiku:3071afdf1521": {
        fill: {
          "0": {
            value: Haiku.inject(
              function(fill_1) {
                return fill_1;
              },
              "fill_1"
            )
          }
        },

        "fill-rule": {
          "0": {
            value: Haiku.inject(
              function(fillRule_1) {
                return fillRule_1;
              },
              "fillRule_1"
            )
          }
        }
      },

      "haiku:f2f8bfe00abf": {
        d: {
          "0": {
            value: Haiku.inject(
              function(pathInstructions) {
                return pathInstructions;
              },
              "pathInstructions"
            )
          }
        }
      }
    }
  },

  template: {
    elementName: "svg",
    attributes: {
      source: "designs/TED.sketch.contents/artboards/TED.svg",
      "haiku-id": "10cab88a2d7e",
      "haiku-title": "TED"
    },

    children: [
      {
        elementName: "title",
        attributes: { "haiku-id": "2ea6169eb698" },
        children: []
      },

      {
        elementName: "desc",
        attributes: { "haiku-id": "f65a6a9867f0" },
        children: []
      },

      {
        elementName: "defs",
        attributes: { "haiku-id": "2a77e17312ee" },
        children: []
      },

      {
        elementName: "g",
        attributes: { "haiku-id": "9218c26b87e2" },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "3071afdf1521" },
            children: [
              {
                elementName: "path",
                attributes: { "haiku-id": "f2f8bfe00abf" },
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
};
