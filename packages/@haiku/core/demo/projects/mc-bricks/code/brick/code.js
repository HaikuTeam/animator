var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    title: "Brick",
    uuid: "HAIKU_SHARE_UUID",
    type: "haiku",
    relpath: "code/brick/code.js",
    core: "3.4.3"
  },
  options: {},
  states: {},
  eventHandlers: {
    "haiku:ecf13be9fb45": {
      click: {
        handler: function(target, event) {
          console.log(this.getBytecodeRelpath(),'brick click gotoAndPlay 1')
          this.getDefaultTimeline().gotoAndPlay(1);
        }
      },
      "timeline:Default:0": {
        handler: function(target, event) {
          console.log(this.getBytecodeRelpath(),'brick frame 0 pause')
          this.getDefaultTimeline().pause();
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:ecf13be9fb45": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.transformStyle": { "0": { value: "flat" } },
        "style.perspective": { "0": { value: "none" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "visible" } },
        "style.overflowY": { "0": { value: "visible" } },
        "sizeAbsolute.x": { "0": { value: 107 } },
        "sizeAbsolute.y": { "0": { value: 52.5 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:26daec20e6a1": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 54 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 26 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 27, edited: true },
          "17": { value: 27, edited: true, curve: "linear" },
          "500": { value: -41.504 }
        },
        "translation.y": {
          "0": { value: 13, edited: true },
          "17": { value: 13, edited: true, curve: "linear" },
          "500": { value: -16.993 }
        },
        "style.zIndex": { "0": { value: 1 } },
        "rotation.z": {
          "0": { value: 0, edited: true },
          "17": { value: 0, edited: true, curve: "linear" },
          "500": { value: 3.002 }
        },
        opacity: {
          "0": { value: 1, edited: true },
          "17": { value: 1, edited: true, curve: "linear" },
          "500": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "17": { value: 1, edited: true, curve: "linear" },
          "500": { value: 1.437 }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "17": { value: 1, edited: true, curve: "linear" },
          "500": { value: 1.437 }
        }
      },
      "haiku:d41632eac92b": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:ea92604b542f": {
        "stop-color": { "0": { value: "#D50000" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:0a3f7cddcec3": {
        "stop-color": { "0": { value: "#AA0000" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:caf162913bc7": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:fc00665fe61c": {
        "stop-color": { "0": { value: "#A13F3F" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:93c127ed1af6": {
        "stop-color": { "0": { value: "#842424" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:5391082cb99e": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:2a7156601db7": {
        stroke: { "0": { value: "url(#df05e5f6a456)" } },
        "stroke-width": { "0": { value: "4" } },
        fill: { "0": { value: "url(#fee9116f4c04)" } },
        x: { "0": { value: "2" } },
        y: { "0": { value: "2" } },
        "sizeAbsolute.x": { "0": { value: 104 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 49 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:55bc38c272fc": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 54 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 26 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 80, edited: true },
          "17": { value: 80, edited: true, curve: "linear" },
          "500": { value: 138.912 }
        },
        "translation.y": {
          "0": { value: 13, edited: true },
          "17": { value: 13, edited: true, curve: "linear" },
          "500": { value: -6.067 }
        },
        "style.zIndex": { "0": { value: 2 } },
        "rotation.z": {
          "0": { value: 0, edited: true },
          "17": { value: 0, edited: true, curve: "linear" },
          "500": { value: -4.524 }
        },
        opacity: {
          "0": { value: 1, edited: true },
          "17": { value: 1, edited: true, curve: "linear" },
          "500": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "17": { value: 1, edited: true, curve: "linear" },
          "500": { value: 1.38 }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "17": { value: 1, edited: true, curve: "linear" },
          "500": { value: 1.38 }
        }
      },
      "haiku:f750bce940b6": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:46e185f01b45": {
        "stop-color": { "0": { value: "#D50000" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:137663b21b56": {
        "stop-color": { "0": { value: "#AA0000" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:9a120f22facb": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:98918d785c5f": {
        "stop-color": { "0": { value: "#A13F3F" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:149c986283b4": {
        "stop-color": { "0": { value: "#842424" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:a16cbf02d79b": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:b3a8bbc453dd": {
        stroke: { "0": { value: "url(#eee35dfe03ec)" } },
        "stroke-width": { "0": { value: "4" } },
        fill: { "0": { value: "url(#dc98ed360ebb)" } },
        x: { "0": { value: "-52" } },
        y: { "0": { value: "2" } },
        "sizeAbsolute.x": { "0": { value: 104 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 49 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:f0f94d64ba04": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 54 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 27 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 80, edited: true },
          "17": { value: 80, edited: true, curve: "linear" },
          "500": { value: 127.723 }
        },
        "translation.y": {
          "0": { value: 39, edited: true },
          "17": { value: 39, edited: true, curve: "linear" },
          "500": { value: 79.156 }
        },
        "style.zIndex": { "0": { value: 3 } },
        "rotation.z": {
          "0": { value: 0, edited: true },
          "17": { value: 0, edited: true, curve: "linear" },
          "500": { value: -3.399 }
        },
        opacity: {
          "0": { value: 1, edited: true },
          "17": { value: 1, edited: true, curve: "linear" },
          "500": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "17": { value: 1, edited: true, curve: "linear" },
          "500": { value: 1.413 }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "17": { value: 1, edited: true, curve: "linear" },
          "500": { value: 1.413 }
        }
      },
      "haiku:4bfb91544be5": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:7779c20fcc22": {
        "stop-color": { "0": { value: "#D50000" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:0281f4eddb27": {
        "stop-color": { "0": { value: "#AA0000" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:4849182b4945": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:54f4da33446f": {
        "stop-color": { "0": { value: "#A13F3F" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:3e9b6435a5fe": {
        "stop-color": { "0": { value: "#842424" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:de7c9320e669": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:d2d3e7185b96": {
        stroke: { "0": { value: "url(#011627d571dc)" } },
        "stroke-width": { "0": { value: "4" } },
        fill: { "0": { value: "url(#e21a35269bf3)" } },
        x: { "0": { value: "-52" } },
        y: { "0": { value: "-24" } },
        "sizeAbsolute.x": { "0": { value: 104 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 49 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:624ccb298343": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 54 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 27 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 27, edited: true },
          "17": { value: 27, edited: true, curve: "linear" },
          "500": { value: -18.823 }
        },
        "translation.y": {
          "0": { value: 39, edited: true },
          "17": { value: 39, edited: true, curve: "linear" },
          "500": { value: 76.374 }
        },
        "style.zIndex": { "0": { value: 4 } },
        "rotation.z": {
          "0": { value: 0, edited: true },
          "17": { value: 0, edited: true, curve: "linear" },
          "500": { value: 3.261 }
        },
        opacity: {
          "0": { value: 1, edited: true },
          "17": { value: 1, edited: true, curve: "linear" },
          "500": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "17": { value: 1, edited: true, curve: "linear" },
          "500": { value: 1.443 }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "17": { value: 1, edited: true, curve: "linear" },
          "500": { value: 1.443 }
        }
      },
      "haiku:c553c575014b": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:c546e12b25ec": {
        "stop-color": { "0": { value: "#D50000" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:c2d442d1ed7c": {
        "stop-color": { "0": { value: "#AA0000" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:2f76288af4f7": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:308b61ee64b3": {
        "stop-color": { "0": { value: "#A13F3F" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:9d6925cf7f5b": {
        "stop-color": { "0": { value: "#842424" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:67f799bd1a6a": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:0ecf4f2306b5": {
        stroke: { "0": { value: "url(#bfc51bb0d86a)" } },
        "stroke-width": { "0": { value: "4" } },
        fill: { "0": { value: "url(#ac9ec92136f9)" } },
        x: { "0": { value: "2" } },
        y: { "0": { value: "-24" } },
        "sizeAbsolute.x": { "0": { value: 104 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 49 } },
        "sizeMode.y": { "0": { value: 1 } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "ecf13be9fb45", "haiku-title": "Brick" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "624ccb298343",
          "haiku-title": "BL",
          "haiku-source": "designs/Bricks.sketch.contents/slices/BL.svg"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "201dc5b362b4" },
            children: [
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "c553c575014b",
                  "haiku-title": "linearGradient-1-7c7d81",
                  id: "ac9ec92136f9"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "c546e12b25ec" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "c2d442d1ed7c" },
                    children: []
                  }
                ]
              },
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "2f76288af4f7",
                  "haiku-title": "linearGradient-2-7c7d81",
                  id: "bfc51bb0d86a"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "308b61ee64b3" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "9d6925cf7f5b" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: {
              "haiku-id": "67f799bd1a6a",
              "haiku-title": "Page-1",
              id: "a3c77f1cd9a0"
            },
            children: [
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "0ecf4f2306b5",
                  "haiku-title": "Rectangle",
                  id: "96a03200fc19"
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
          "haiku-id": "f0f94d64ba04",
          "haiku-title": "BR",
          "haiku-source": "designs/Bricks.sketch.contents/slices/BR.svg"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "884ccd230ec0" },
            children: [
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "4bfb91544be5",
                  "haiku-title": "linearGradient-1-ddf632",
                  id: "e21a35269bf3"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "7779c20fcc22" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "0281f4eddb27" },
                    children: []
                  }
                ]
              },
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "4849182b4945",
                  "haiku-title": "linearGradient-2-ddf632",
                  id: "011627d571dc"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "54f4da33446f" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "3e9b6435a5fe" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: {
              "haiku-id": "de7c9320e669",
              "haiku-title": "Page-1",
              id: "67fd2bf877f3"
            },
            children: [
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "d2d3e7185b96",
                  "haiku-title": "Rectangle",
                  id: "e64f707b7932"
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
          "haiku-id": "55bc38c272fc",
          "haiku-title": "TR",
          "haiku-source": "designs/Bricks.sketch.contents/slices/TR.svg"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "a5b72c9e4b48" },
            children: [
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "f750bce940b6",
                  "haiku-title": "linearGradient-1-56de6b",
                  id: "dc98ed360ebb"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "46e185f01b45" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "137663b21b56" },
                    children: []
                  }
                ]
              },
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "9a120f22facb",
                  "haiku-title": "linearGradient-2-56de6b",
                  id: "eee35dfe03ec"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "98918d785c5f" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "149c986283b4" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: {
              "haiku-id": "a16cbf02d79b",
              "haiku-title": "Page-1",
              id: "35d91ab563f8"
            },
            children: [
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "b3a8bbc453dd",
                  "haiku-title": "Rectangle",
                  id: "0c06d9a34166"
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
          "haiku-id": "26daec20e6a1",
          "haiku-title": "TL",
          "haiku-source": "designs/Bricks.sketch.contents/slices/TL.svg"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "1d760bc91062" },
            children: [
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "d41632eac92b",
                  "haiku-title": "linearGradient-1-440b5d",
                  id: "fee9116f4c04"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "ea92604b542f" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "0a3f7cddcec3" },
                    children: []
                  }
                ]
              },
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "caf162913bc7",
                  "haiku-title": "linearGradient-2-440b5d",
                  id: "df05e5f6a456"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "fc00665fe61c" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "93c127ed1af6" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: {
              "haiku-id": "5391082cb99e",
              "haiku-title": "Page-1",
              id: "3947bfba350b"
            },
            children: [
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "2a7156601db7",
                  "haiku-title": "Rectangle",
                  id: "4e40ef7094ce"
                },
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
};
