var Haiku = require("@haiku/core");
var _code_bits_code = require("./../bits/code.js");
module.exports = {
  metadata: {
    folder: "/Users/matthew/Code/HaikuTeam/mono/packages/haiku-plumbing/test/fixtures/projects/blank-project/",
    uuid: "HAIKU_SHARE_UUID",
    core: "3.5.1",
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
      "haiku:Main-03757d2ca1026e0a": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "hidden" } },
        "style.overflowY": { "0": { value: "hidden" } },
        "sizeAbsolute.x": { "0": { value: 550 } },
        "sizeAbsolute.y": { "0": { value: 400 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:Blur-799cf6dcf4c964ba": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 103 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 98 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 51.5, edited: true } },
        "translation.y": { "0": { value: 56, edited: true } },
        "style.zIndex": { "0": { value: 1 } }
      },
      "haiku:path-1-2db749-b51e5c5e2ec31a47": {
        x: { "0": { value: "13" } },
        y: { "0": { value: "12" } },
        "sizeAbsolute.x": { "0": { value: 74 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 70 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:filter-2-2db749-4e188206596c5f4b": {
        x: { "0": { value: "-27.7%" } },
        y: { "0": { value: "-26.4%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 1.554 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 1.5859999999999999 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:Fe-Offset-331bc49863dd1e6d": {
        dx: { "0": { value: "0" } },
        dy: { "0": { value: "2" } },
        in: { "0": { value: "SourceAlpha" } },
        result: { "0": { value: "shadowOffsetOuter1" } }
      },
      "haiku:Fe-Gaussian-Blur-76fa15b143db172f": {
        stdDeviation: { "0": { value: "6.5" } },
        in: { "0": { value: "shadowOffsetOuter1" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:Fe-Composite-739207859c0c6af4": {
        in: { "0": { value: "shadowBlurOuter1" } },
        in2: { "0": { value: "SourceAlpha" } },
        operator: { "0": { value: "out" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:Fe-Color-Matrix-614d966f6ce422bc": {
        values: {
          "0": { value: "0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" }
        },
        in: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:Page-1-c5d93a3ec80718bb": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:Use-13c7f674a3b5376f": {
        fill: { "0": { value: "black" } },
        fillOpacity: { "0": { value: "1" } },
        filter: { "0": { value: "url(#filter-2-2db749)" } }
      },
      "haiku:Rect-5a8fa269e13cdb45": {
        stroke: { "0": { value: "#979797" } },
        strokeWidth: { "0": { value: "1" } },
        strokeLinejoin: { "0": { value: "square" } },
        fill: { "0": { value: "#D8D8D8" } },
        fillRule: { "0": { value: "evenodd" } },
        x: { "0": { value: "13.5" } },
        y: { "0": { value: "12.5" } },
        "sizeAbsolute.x": { "0": { value: 73 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 69 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:Grad-9153359a09f820e7": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 70 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 72 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 51.5, edited: true } },
        "translation.y": { "0": { value: 141, edited: true } },
        "style.zIndex": { "0": { value: 2 } }
      },
      "haiku:linearGradient-1-fc85a6-64995222efbaedb7": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:Stop-a2e75fbb5491d878": {
        stopColor: { "0": { value: "#393636" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:Stop-896cb65c7bc1babf": {
        stopColor: { "0": { value: "#D8D8D8" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:Page-1-48402695770dd0ed": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:Rectangle-24e66db7ef250e79": {
        stroke: { "0": { value: "#979797" } },
        fill: { "0": { value: "url(#linearGradient-1-fc85a6)" } },
        x: { "0": { value: "0.5" } },
        y: { "0": { value: "0.5" } },
        "sizeAbsolute.x": { "0": { value: 69 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 71 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:Inner-Shad-e2750af03adf6515": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 70 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 71 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 51.5, edited: true } },
        "translation.y": { "0": { value: 235.5, edited: true } },
        "style.zIndex": { "0": { value: 3 } }
      },
      "haiku:path-1-e3080e-7dbb79d22e231cdf": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 70 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 71 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:filter-2-e3080e-7840cdedfb9ca033": {
        x: { "0": { value: "-9.3%" } },
        y: { "0": { value: "-9.2%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 1.186 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 1.183 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:Fe-Gaussian-Blur-eea296a98a866805": {
        stdDeviation: { "0": { value: "6" } },
        in: { "0": { value: "SourceAlpha" } },
        result: { "0": { value: "shadowBlurInner1" } }
      },
      "haiku:Fe-Offset-ca6dcd0495e48d13": {
        dx: { "0": { value: "0" } },
        dy: { "0": { value: "1" } },
        in: { "0": { value: "shadowBlurInner1" } },
        result: { "0": { value: "shadowOffsetInner1" } }
      },
      "haiku:Fe-Composite-8e9c93662305295b": {
        in: { "0": { value: "shadowOffsetInner1" } },
        in2: { "0": { value: "SourceAlpha" } },
        operator: { "0": { value: "arithmetic" } },
        k2: { "0": { value: "-1" } },
        k3: { "0": { value: "1" } },
        result: { "0": { value: "shadowInnerInner1" } }
      },
      "haiku:Fe-Color-Matrix-81a26198c373b519": {
        values: {
          "0": { value: "0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" }
        },
        in: { "0": { value: "shadowInnerInner1" } }
      },
      "haiku:Page-1-655da33045956888": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:Use-8b899d011142ebbd": {
        fill: { "0": { value: "#D8D8D8" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:Use-d30bcc65738d2dbf": {
        fill: { "0": { value: "black" } },
        fillOpacity: { "0": { value: "1" } },
        filter: { "0": { value: "url(#filter-2-e3080e)" } }
      },
      "haiku:Rect-cd3d2194683c64e6": {
        stroke: { "0": { value: "#979797" } },
        strokeWidth: { "0": { value: "1" } },
        strokeLinejoin: { "0": { value: "square" } },
        x: { "0": { value: "0.5" } },
        y: { "0": { value: "0.5" } },
        "sizeAbsolute.x": { "0": { value: 69 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 70 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:Shad-a2d3df704c3b7354": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 121 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 102 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 60.5, edited: true } },
        "translation.y": { "0": { value: 322, edited: true } },
        "style.zIndex": { "0": { value: 4 } }
      },
      "haiku:filter-1-b0fa88-cc8adedb68965964": {
        x: { "0": { value: "-40.5%" } },
        y: { "0": { value: "-42.3%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 1.811 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 1.845 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:Fe-Gaussian-Blur-cd7aeb2e7cbacc2b": {
        stdDeviation: { "0": { value: "10 0" } },
        in: { "0": { value: "SourceGraphic" } }
      },
      "haiku:Page-1-9f942736aee60983": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:Rectangle-4-354c38b7ecf1b20a": {
        stroke: { "0": { value: "#979797" } },
        fill: { "0": { value: "#D8D8D8" } },
        filter: { "0": { value: "url(#filter-1-b0fa88)" } },
        x: { "0": { value: "20.5" } },
        y: { "0": { value: "14.5" } },
        "sizeAbsolute.x": { "0": { value: 73 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 70 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:Bits-6e34dac26cef7af6": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: "auto" } },
        "sizeAbsolute.y": { "0": { value: "auto" } },
        "translation.x": { "0": { value: 240.25 } },
        "translation.y": { "0": { value: 111.75 } },
        "sizeMode.z": { "0": { value: 1 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "style.zIndex": { "0": { value: 5 } },
        playback: { "0": { value: "loop" } }
      },
      "haiku:Bits-87514a1b85d6ee5b": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: "auto" } },
        "sizeAbsolute.y": { "0": { value: "auto" } },
        "translation.x": { "0": { value: 378.75, edited: true } },
        "translation.y": { "0": { value: 235.5, edited: true } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "style.zIndex": { "0": { value: 6 } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "Main-03757d2ca1026e0a", "haiku-title": "Main" },
    children: [
      {
        elementName: _code_bits_code,
        attributes: {
          "haiku-id": "Bits-87514a1b85d6ee5b",
          "haiku-var": "_code_bits_code",
          "haiku-title": "Bits",
          "haiku-source": "./code/bits/code.js"
        },
        children: []
      },
      {
        elementName: _code_bits_code,
        attributes: {
          "haiku-id": "Bits-6e34dac26cef7af6",
          "haiku-var": "_code_bits_code",
          "haiku-title": "Bits",
          "haiku-source": "./code/bits/code.js"
        },
        children: []
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Shad-a2d3df704c3b7354",
          "haiku-title": "Shad",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/Shad.svg"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "Defs-f5825cc6dfc7eec7" },
            children: [
              {
                elementName: "filter",
                attributes: {
                  "haiku-id": "filter-1-b0fa88-cc8adedb68965964",
                  id: "filter-1-b0fa88"
                },
                children: [
                  {
                    elementName: "feGaussianBlur",
                    attributes: {
                      "haiku-id": "Fe-Gaussian-Blur-cd7aeb2e7cbacc2b"
                    },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-9f942736aee60983", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "Rectangle-4-354c38b7ecf1b20a",
                  id: "Rectangle-4"
                },
                children: []
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
          "haiku-id": "Inner-Shad-e2750af03adf6515",
          "haiku-title": "InnerShad",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/InnerShad.svg"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "Defs-f8c5b7be0a5e0911" },
            children: [
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "path-1-e3080e-7dbb79d22e231cdf",
                  id: "path-1-e3080e"
                },
                children: []
              },
              {
                elementName: "filter",
                attributes: {
                  "haiku-id": "filter-2-e3080e-7840cdedfb9ca033",
                  id: "filter-2-e3080e"
                },
                children: [
                  {
                    elementName: "feGaussianBlur",
                    attributes: {
                      "haiku-id": "Fe-Gaussian-Blur-eea296a98a866805"
                    },
                    children: []
                  },
                  {
                    elementName: "feOffset",
                    attributes: { "haiku-id": "Fe-Offset-ca6dcd0495e48d13" },
                    children: []
                  },
                  {
                    elementName: "feComposite",
                    attributes: { "haiku-id": "Fe-Composite-8e9c93662305295b" },
                    children: []
                  },
                  {
                    elementName: "feColorMatrix",
                    attributes: {
                      "haiku-id": "Fe-Color-Matrix-81a26198c373b519",
                      type: "matrix"
                    },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-655da33045956888", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Rectangle-3-536761ea54ad680a",
                  id: "Rectangle-3"
                },
                children: [
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#path-1-e3080e",
                      "haiku-id": "Use-8b899d011142ebbd"
                    },
                    children: []
                  },
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#path-1-e3080e",
                      "haiku-id": "Use-d30bcc65738d2dbf"
                    },
                    children: []
                  },
                  {
                    elementName: "rect",
                    attributes: { "haiku-id": "Rect-cd3d2194683c64e6" },
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
          "haiku-id": "Grad-9153359a09f820e7",
          "haiku-title": "Grad",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/Grad.svg"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "Defs-6017647f73ce3b69" },
            children: [
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "linearGradient-1-fc85a6-64995222efbaedb7",
                  id: "linearGradient-1-fc85a6"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "Stop-a2e75fbb5491d878" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "Stop-896cb65c7bc1babf" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-48402695770dd0ed", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "Rectangle-24e66db7ef250e79",
                  id: "Rectangle"
                },
                children: []
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
          "haiku-id": "Blur-799cf6dcf4c964ba",
          "haiku-title": "Blur",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/Blur.svg"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "Defs-99c67f64aca4b4fc" },
            children: [
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "path-1-2db749-b51e5c5e2ec31a47",
                  id: "path-1-2db749"
                },
                children: []
              },
              {
                elementName: "filter",
                attributes: {
                  "haiku-id": "filter-2-2db749-4e188206596c5f4b",
                  id: "filter-2-2db749"
                },
                children: [
                  {
                    elementName: "feOffset",
                    attributes: { "haiku-id": "Fe-Offset-331bc49863dd1e6d" },
                    children: []
                  },
                  {
                    elementName: "feGaussianBlur",
                    attributes: {
                      "haiku-id": "Fe-Gaussian-Blur-76fa15b143db172f"
                    },
                    children: []
                  },
                  {
                    elementName: "feComposite",
                    attributes: { "haiku-id": "Fe-Composite-739207859c0c6af4" },
                    children: []
                  },
                  {
                    elementName: "feColorMatrix",
                    attributes: {
                      "haiku-id": "Fe-Color-Matrix-614d966f6ce422bc",
                      type: "matrix"
                    },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-c5d93a3ec80718bb", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Rectangle-2-05fbe799757ec5dd",
                  id: "Rectangle-2"
                },
                children: [
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#path-1-2db749",
                      "haiku-id": "Use-13c7f674a3b5376f"
                    },
                    children: []
                  },
                  {
                    elementName: "rect",
                    attributes: { "haiku-id": "Rect-5a8fa269e13cdb45" },
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
