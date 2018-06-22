var Haiku = require("@haiku/core");
var _code_block_code = require("./../block/code.js");
module.exports = {
  metadata: {
    folder: "/Users/matthew/Code/HaikuTeam/mono/packages/haiku-plumbing/test/fixtures/projects/blank-project/",
    uuid: "HAIKU_SHARE_UUID",
    core: "3.2.22",
    player: "3.2.22",
    username: "matthew+2@haiku.ai",
    organization: "matthew2",
    project: "UsersMatthewHaikuProjects",
    branch: "master",
    version: "0.0.0",
    title: "Main",
    type: "haiku",
    relpath: "code/main/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {},
  timelines: {
    Default: {
      "haiku:e4a9e4d8baa7": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.transformStyle": { "0": { value: "flat" } },
        "style.perspective": { "0": { value: "none" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "visible" } },
        "style.overflowY": { "0": { value: "visible" } },
        "sizeAbsolute.x": { "0": { value: 550 } },
        "sizeAbsolute.y": { "0": { value: 400 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:db5c24d2ae2d": {
        "controlFlow.repeat": {
          "0": {
            value: Haiku.inject(function() {
              const out = []
              for (var i = 0; i < 6; i++) {
                out.push({
                  x: i * 50,
                  y: i * 50
                })
              }
              return out
            }),
            curve: 'linear',
            edited: true
          },
          "1000": {
            value: Haiku.inject(function() {
              const out = []
              for (var i = 0; i < 6; i++) {
                out.push({
                  x: (i * 50) + 100,
                  y: i * 50
                })
              }
              return out
            }),
            edited: true
          }
        },
        "translation.x": {
          "0": {
            value: Haiku.inject(function($flow) {
              return $flow.repeat.payload.x
            }, '$flow'),
            edited: true
          }
        },
        "translation.y": {
          "0": {
            value: Haiku.inject(function($flow) {
              return $flow.repeat.payload.y
            }, '$flow'),
            edited: true
          }
        },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 76 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 79 } },
        "sizeMode.y": { "0": { value: 1 } },
        "style.zIndex": { "0": { value: 1 } }
      },
      "haiku:ec04a19f4e7d": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:19b45acf7c88": {
        "stop-color": { "0": { value: "#EEEEEE" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:7a27598c3392": {
        "stop-color": { "0": { value: "#D8D8D8" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:0a0ec17cfdde": {
        x: { "0": { value: "4" } },
        y: { "0": { value: "2" } },
        "sizeAbsolute.x": { "0": { value: 68 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 71 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:44171628ab23": {
        x: { "0": { value: "-10.3%" } },
        y: { "0": { value: "-7.0%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 1.206 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 1.197 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:351bb21fe71c": {
        dx: { "0": { value: "0" } },
        dy: { "0": { value: "2" } },
        in: { "0": { value: "SourceAlpha" } },
        result: { "0": { value: "shadowOffsetOuter1" } }
      },
      "haiku:ab266f4d28c7": {
        stdDeviation: { "0": { value: "2" } },
        in: { "0": { value: "shadowOffsetOuter1" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:edf1a34904a4": {
        in: { "0": { value: "shadowBlurOuter1" } },
        in2: { "0": { value: "SourceAlpha" } },
        operator: { "0": { value: "out" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:42a41429425a": {
        values: {
          "0": { value: "0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" }
        },
        in: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:e9ec0647ecac": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:2b353082fd1b": {
        fill: { "0": { value: "black" } },
        "fill-opacity": { "0": { value: "1" } },
        filter: { "0": { value: "url(#filter-3-440b5d)" } }
      },
      "haiku:e913f6fc17bf": {
        fill: { "0": { value: "url(#linearGradient-1-440b5d)" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:80ba3bb6868c": {
        stroke: { "0": { value: "#979797" } },
        "stroke-width": { "0": { value: "1" } },
        x: { "0": { value: "4.5" } },
        y: { "0": { value: "2.5" } },
        "sizeAbsolute.x": { "0": { value: 67 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 70 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:e8ae8dd20591": {
        playback: { "0": { value: "loop" } },
        "controlFlow.repeat": {
          "0": {
            value: Haiku.inject(function() {
              const out = []
              for (var i = 0; i < 5; i++) {
                var n = i * 50
                out.push({
                  x: n,
                  y: n + 200,
                  color: 'rgb('+n+','+n+','+n+')'
                })
              }
              return out
            }),
            curve: 'linear',
            edited: true
          },
          "1000": {
            value: Haiku.inject(function() {
              const out = []
              for (var i = 0; i < 5; i++) {
                var n = i * 50
                out.push({
                  x: n,
                  y: n + 400,
                  color: 'rgb('+n+','+n+','+n+')'
                })
              }
              return out
            }),
            edited: true
          }
        },
        "translation.x": {
          "0": {
            value: Haiku.inject(function($flow) {
              return $flow.repeat.payload.x
            }, '$flow'),
            edited: true
          }
        },
        "translation.y": {
          "0": {
            value: Haiku.inject(function($flow) {
              return $flow.repeat.payload.y
            }, '$flow'),
            edited: true
          }
        },
        "bgcolor": {
          "0": {
            value: Haiku.inject(function($flow) {
              return $flow.repeat.payload.color
            }, '$flow'),
            edited: true
          }
        },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: true } },
        "sizeAbsolute.y": { "0": { value: true } },
        "sizeMode.z": { "0": { value: 1 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "style.zIndex": { "0": { value: 2 } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "e4a9e4d8baa7", "haiku-title": "Main" },
    children: [
      {
        elementName: _code_block_code,
        attributes: {
          "haiku-id": "e8ae8dd20591",
          "haiku-var": "_code_block_code",
          "haiku-title": "Block",
          "haiku-source": "./code/block/code.js"
        },
        children: []
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "db5c24d2ae2d",
          "haiku-title": "Rectangle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/Rectangle.svg"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "e697625973a6" },
            children: [
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "ec04a19f4e7d",
                  id: "linearGradient-1-440b5d"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "19b45acf7c88" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "7a27598c3392" },
                    children: []
                  }
                ]
              },
              {
                elementName: "rect",
                attributes: { "haiku-id": "0a0ec17cfdde", id: "path-2-440b5d" },
                children: []
              },
              {
                elementName: "filter",
                attributes: {
                  "haiku-id": "44171628ab23",
                  id: "filter-3-440b5d"
                },
                children: [
                  {
                    elementName: "feOffset",
                    attributes: { "haiku-id": "351bb21fe71c" },
                    children: []
                  },
                  {
                    elementName: "feGaussianBlur",
                    attributes: { "haiku-id": "ab266f4d28c7" },
                    children: []
                  },
                  {
                    elementName: "feComposite",
                    attributes: { "haiku-id": "edf1a34904a4" },
                    children: []
                  },
                  {
                    elementName: "feColorMatrix",
                    attributes: { "haiku-id": "42a41429425a", type: "matrix" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "e9ec0647ecac", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "f0ff7ffc2b11", id: "Rectangle" },
                children: [
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#path-2-440b5d",
                      "haiku-id": "2b353082fd1b"
                    },
                    children: []
                  },
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#path-2-440b5d",
                      "haiku-id": "e913f6fc17bf"
                    },
                    children: []
                  },
                  {
                    elementName: "rect",
                    attributes: { "haiku-id": "80ba3bb6868c" },
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
