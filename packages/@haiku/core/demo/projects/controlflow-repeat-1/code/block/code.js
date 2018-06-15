var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    title: "Block",
    uuid: "HAIKU_SHARE_UUID",
    type: "haiku",
    relpath: "code/block/code.js",
    core: "3.2.22"
  },
  options: {},
  states: { bgcolor: { type: "string", value: "red", edited: true } },
  eventHandlers: {},
  timelines: {
    Default: {
      "haiku:676c062b1296": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.transformStyle": { "0": { value: "flat" } },
        "style.perspective": { "0": { value: "none" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "visible" } },
        "style.overflowY": { "0": { value: "visible" } },
        "sizeAbsolute.x": { "0": { value: 143 } },
        "sizeAbsolute.y": { "0": { value: 149 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "style.backgroundColor": {
          "0": {
            value: Haiku.inject(
              function(bgcolor) {
                return bgcolor;
              },
              "bgcolor"
            ),
            edited: true
          }
        }
      },
      "haiku:66006343a4f0": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 76 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 79 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 38 } },
        "translation.y": { "0": { value: 39.5 } },
        "style.zIndex": { "0": { value: 2 } }
      },
      "haiku:b05791266d3b": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:b0c36cae69d1": {
        "stop-color": { "0": { value: "#EEEEEE" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:4beb2a1a8178": {
        "stop-color": { "0": { value: "#D8D8D8" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:5dbea1c5d1ee": {
        x: { "0": { value: "4" } },
        y: { "0": { value: "2" } },
        "sizeAbsolute.x": { "0": { value: 68 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 71 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:f8da3a9f690c": {
        x: { "0": { value: "-10.3%" } },
        y: { "0": { value: "-7.0%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 1.206 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 1.197 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:98df4fbef9fc": {
        dx: { "0": { value: "0" } },
        dy: { "0": { value: "2" } },
        in: { "0": { value: "SourceAlpha" } },
        result: { "0": { value: "shadowOffsetOuter1" } }
      },
      "haiku:a9b9bf230464": {
        stdDeviation: { "0": { value: "2" } },
        in: { "0": { value: "shadowOffsetOuter1" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:7e8baa8772ae": {
        in: { "0": { value: "shadowBlurOuter1" } },
        in2: { "0": { value: "SourceAlpha" } },
        operator: { "0": { value: "out" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:29fd5f90e9a3": {
        values: {
          "0": { value: "0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" }
        },
        in: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:934317e4127f": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:2fe598272ca7": {
        fill: { "0": { value: "black" } },
        "fill-opacity": { "0": { value: "1" } },
        filter: { "0": { value: "url(#28c85a044c44)" } }
      },
      "haiku:0b5823ef92b2": {
        fill: { "0": { value: "url(#52f080fb0a19)" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:3e8d1b10cfaa": {
        stroke: { "0": { value: "#979797" } },
        "stroke-width": { "0": { value: "1" } },
        x: { "0": { value: "4.5" } },
        y: { "0": { value: "2.5" } },
        "sizeAbsolute.x": { "0": { value: 67 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 70 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:889770170639": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 76 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 79 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 38 } },
        "translation.y": { "0": { value: 109.5 } },
        "style.zIndex": { "0": { value: 3 } }
      },
      "haiku:24a8c5353b80": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:b9f5a6ac896e": {
        "stop-color": { "0": { value: "#EEEEEE" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:99c7c788db92": {
        "stop-color": { "0": { value: "#D8D8D8" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:fc09fe7f7e9c": {
        x: { "0": { value: "4" } },
        y: { "0": { value: "2" } },
        "sizeAbsolute.x": { "0": { value: 68 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 71 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:8ca8061a5559": {
        x: { "0": { value: "-10.3%" } },
        y: { "0": { value: "-7.0%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 1.206 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 1.197 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:e69ea62c0dda": {
        dx: { "0": { value: "0" } },
        dy: { "0": { value: "2" } },
        in: { "0": { value: "SourceAlpha" } },
        result: { "0": { value: "shadowOffsetOuter1" } }
      },
      "haiku:32af6dad6601": {
        stdDeviation: { "0": { value: "2" } },
        in: { "0": { value: "shadowOffsetOuter1" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:da9a25e28f75": {
        in: { "0": { value: "shadowBlurOuter1" } },
        in2: { "0": { value: "SourceAlpha" } },
        operator: { "0": { value: "out" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:796c48d54683": {
        values: {
          "0": { value: "0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" }
        },
        in: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:b02b1d7724a3": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:ab9d3d3df160": {
        fill: { "0": { value: "black" } },
        "fill-opacity": { "0": { value: "1" } },
        filter: { "0": { value: "url(#7aea0e367b7e)" } }
      },
      "haiku:d299ce07350c": {
        fill: { "0": { value: "url(#3d4b37f3f549)" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:e9b9398f1ba4": {
        stroke: { "0": { value: "#979797" } },
        "stroke-width": { "0": { value: "1" } },
        x: { "0": { value: "4.5" } },
        y: { "0": { value: "2.5" } },
        "sizeAbsolute.x": { "0": { value: 67 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 70 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:80a7c3d09cef": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 76 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 79 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 105 } },
        "translation.y": { "0": { value: 39.5 } },
        "style.zIndex": { "0": { value: 4 } }
      },
      "haiku:61a176a736da": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:ea4e4375808b": {
        "stop-color": { "0": { value: "#EEEEEE" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:af4ac545eea5": {
        "stop-color": { "0": { value: "#D8D8D8" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:963c42598a56": {
        x: { "0": { value: "4" } },
        y: { "0": { value: "2" } },
        "sizeAbsolute.x": { "0": { value: 68 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 71 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:f70748aa6b11": {
        x: { "0": { value: "-10.3%" } },
        y: { "0": { value: "-7.0%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 1.206 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 1.197 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:ffbbd6dde9b1": {
        dx: { "0": { value: "0" } },
        dy: { "0": { value: "2" } },
        in: { "0": { value: "SourceAlpha" } },
        result: { "0": { value: "shadowOffsetOuter1" } }
      },
      "haiku:4074ca54ab6c": {
        stdDeviation: { "0": { value: "2" } },
        in: { "0": { value: "shadowOffsetOuter1" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:ee28f733db7c": {
        in: { "0": { value: "shadowBlurOuter1" } },
        in2: { "0": { value: "SourceAlpha" } },
        operator: { "0": { value: "out" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:a57ca04bc332": {
        values: {
          "0": { value: "0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" }
        },
        in: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:f5f522f9e6a8": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:5dc973350e18": {
        fill: { "0": { value: "black" } },
        "fill-opacity": { "0": { value: "1" } },
        filter: { "0": { value: "url(#5a9d71e39084)" } }
      },
      "haiku:53b03daf4a3f": {
        fill: { "0": { value: "url(#2a75c19bef8c)" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:81eec48f6b75": {
        stroke: { "0": { value: "#979797" } },
        "stroke-width": { "0": { value: "1" } },
        x: { "0": { value: "4.5" } },
        y: { "0": { value: "2.5" } },
        "sizeAbsolute.x": { "0": { value: 67 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 70 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:a654a646f497": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 76 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 79 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 105 } },
        "translation.y": { "0": { value: 109.5 } },
        "style.zIndex": { "0": { value: 5 } }
      },
      "haiku:a9b694869d74": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:51f90e040972": {
        "stop-color": { "0": { value: "#EEEEEE" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:83c217a2981d": {
        "stop-color": { "0": { value: "#D8D8D8" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:f4bcf918f879": {
        x: { "0": { value: "4" } },
        y: { "0": { value: "2" } },
        "sizeAbsolute.x": { "0": { value: 68 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 71 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:d0569682376c": {
        x: { "0": { value: "-10.3%" } },
        y: { "0": { value: "-7.0%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 1.206 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 1.197 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:5bb96632fea7": {
        dx: { "0": { value: "0" } },
        dy: { "0": { value: "2" } },
        in: { "0": { value: "SourceAlpha" } },
        result: { "0": { value: "shadowOffsetOuter1" } }
      },
      "haiku:e9b99813bce8": {
        stdDeviation: { "0": { value: "2" } },
        in: { "0": { value: "shadowOffsetOuter1" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:b0a87b20e60e": {
        in: { "0": { value: "shadowBlurOuter1" } },
        in2: { "0": { value: "SourceAlpha" } },
        operator: { "0": { value: "out" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:97bf107568f4": {
        values: {
          "0": { value: "0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" }
        },
        in: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:5de88d0c41d6": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:289757361efc": {
        fill: { "0": { value: "black" } },
        "fill-opacity": { "0": { value: "1" } },
        filter: { "0": { value: "url(#1f2b81045322)" } }
      },
      "haiku:6056865ed99e": {
        fill: { "0": { value: "url(#9095b8348f17)" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:ab686d461f49": {
        stroke: { "0": { value: "#979797" } },
        "stroke-width": { "0": { value: "1" } },
        x: { "0": { value: "4.5" } },
        y: { "0": { value: "2.5" } },
        "sizeAbsolute.x": { "0": { value: 67 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 70 } },
        "sizeMode.y": { "0": { value: 1 } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "676c062b1296", "haiku-title": "Block" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "a654a646f497",
          "haiku-title": "Rectangle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/Rectangle.svg"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "a7b33e55521d" },
            children: [
              {
                elementName: "linearGradient",
                attributes: { "haiku-id": "a9b694869d74", id: "9095b8348f17" },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "51f90e040972" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "83c217a2981d" },
                    children: []
                  }
                ]
              },
              {
                elementName: "rect",
                attributes: { "haiku-id": "f4bcf918f879", id: "e6e2e8f91a2a" },
                children: []
              },
              {
                elementName: "filter",
                attributes: { "haiku-id": "d0569682376c", id: "1f2b81045322" },
                children: [
                  {
                    elementName: "feOffset",
                    attributes: { "haiku-id": "5bb96632fea7" },
                    children: []
                  },
                  {
                    elementName: "feGaussianBlur",
                    attributes: { "haiku-id": "e9b99813bce8" },
                    children: []
                  },
                  {
                    elementName: "feComposite",
                    attributes: { "haiku-id": "b0a87b20e60e" },
                    children: []
                  },
                  {
                    elementName: "feColorMatrix",
                    attributes: { "haiku-id": "97bf107568f4", type: "matrix" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "5de88d0c41d6", id: "d965aeb8166a" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "753795f79ebf", id: "f4fc13bdc70f" },
                children: [
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#e6e2e8f91a2a",
                      "haiku-id": "289757361efc"
                    },
                    children: []
                  },
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#e6e2e8f91a2a",
                      "haiku-id": "6056865ed99e"
                    },
                    children: []
                  },
                  {
                    elementName: "rect",
                    attributes: { "haiku-id": "ab686d461f49" },
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "80a7c3d09cef",
          "haiku-title": "Rectangle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/Rectangle.svg"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "97c5267e8956" },
            children: [
              {
                elementName: "linearGradient",
                attributes: { "haiku-id": "61a176a736da", id: "2a75c19bef8c" },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "ea4e4375808b" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "af4ac545eea5" },
                    children: []
                  }
                ]
              },
              {
                elementName: "rect",
                attributes: { "haiku-id": "963c42598a56", id: "cb2d0115dd7f" },
                children: []
              },
              {
                elementName: "filter",
                attributes: { "haiku-id": "f70748aa6b11", id: "5a9d71e39084" },
                children: [
                  {
                    elementName: "feOffset",
                    attributes: { "haiku-id": "ffbbd6dde9b1" },
                    children: []
                  },
                  {
                    elementName: "feGaussianBlur",
                    attributes: { "haiku-id": "4074ca54ab6c" },
                    children: []
                  },
                  {
                    elementName: "feComposite",
                    attributes: { "haiku-id": "ee28f733db7c" },
                    children: []
                  },
                  {
                    elementName: "feColorMatrix",
                    attributes: { "haiku-id": "a57ca04bc332", type: "matrix" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "f5f522f9e6a8", id: "6f3ab36c2801" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "7d9c75e475c1", id: "038d7a58ad96" },
                children: [
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#cb2d0115dd7f",
                      "haiku-id": "5dc973350e18"
                    },
                    children: []
                  },
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#cb2d0115dd7f",
                      "haiku-id": "53b03daf4a3f"
                    },
                    children: []
                  },
                  {
                    elementName: "rect",
                    attributes: { "haiku-id": "81eec48f6b75" },
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "889770170639",
          "haiku-title": "Rectangle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/Rectangle.svg"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "102b8b2d0092" },
            children: [
              {
                elementName: "linearGradient",
                attributes: { "haiku-id": "24a8c5353b80", id: "3d4b37f3f549" },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "b9f5a6ac896e" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "99c7c788db92" },
                    children: []
                  }
                ]
              },
              {
                elementName: "rect",
                attributes: { "haiku-id": "fc09fe7f7e9c", id: "edeb2a19f5df" },
                children: []
              },
              {
                elementName: "filter",
                attributes: { "haiku-id": "8ca8061a5559", id: "7aea0e367b7e" },
                children: [
                  {
                    elementName: "feOffset",
                    attributes: { "haiku-id": "e69ea62c0dda" },
                    children: []
                  },
                  {
                    elementName: "feGaussianBlur",
                    attributes: { "haiku-id": "32af6dad6601" },
                    children: []
                  },
                  {
                    elementName: "feComposite",
                    attributes: { "haiku-id": "da9a25e28f75" },
                    children: []
                  },
                  {
                    elementName: "feColorMatrix",
                    attributes: { "haiku-id": "796c48d54683", type: "matrix" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "b02b1d7724a3", id: "a63fefd9bfd1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "8ed41ab0d8d0", id: "2f9a4f124702" },
                children: [
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#edeb2a19f5df",
                      "haiku-id": "ab9d3d3df160"
                    },
                    children: []
                  },
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#edeb2a19f5df",
                      "haiku-id": "d299ce07350c"
                    },
                    children: []
                  },
                  {
                    elementName: "rect",
                    attributes: { "haiku-id": "e9b9398f1ba4" },
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "66006343a4f0",
          "haiku-title": "Rectangle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/Rectangle.svg"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "ae260e7a16b9" },
            children: [
              {
                elementName: "linearGradient",
                attributes: { "haiku-id": "b05791266d3b", id: "52f080fb0a19" },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "b0c36cae69d1" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "4beb2a1a8178" },
                    children: []
                  }
                ]
              },
              {
                elementName: "rect",
                attributes: { "haiku-id": "5dbea1c5d1ee", id: "bd6421f5a9f3" },
                children: []
              },
              {
                elementName: "filter",
                attributes: { "haiku-id": "f8da3a9f690c", id: "28c85a044c44" },
                children: [
                  {
                    elementName: "feOffset",
                    attributes: { "haiku-id": "98df4fbef9fc" },
                    children: []
                  },
                  {
                    elementName: "feGaussianBlur",
                    attributes: { "haiku-id": "a9b9bf230464" },
                    children: []
                  },
                  {
                    elementName: "feComposite",
                    attributes: { "haiku-id": "7e8baa8772ae" },
                    children: []
                  },
                  {
                    elementName: "feColorMatrix",
                    attributes: { "haiku-id": "29fd5f90e9a3", type: "matrix" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "934317e4127f", id: "4fa277934229" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "4aa9adc8869c", id: "aef71313d7ab" },
                children: [
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#bd6421f5a9f3",
                      "haiku-id": "2fe598272ca7"
                    },
                    children: []
                  },
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#bd6421f5a9f3",
                      "haiku-id": "0b5823ef92b2"
                    },
                    children: []
                  },
                  {
                    elementName: "rect",
                    attributes: { "haiku-id": "3e8d1b10cfaa" },
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
