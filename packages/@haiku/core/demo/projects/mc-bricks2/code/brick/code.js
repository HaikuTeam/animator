var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    title: "Brick",
    uuid: "HAIKU_SHARE_UUID",
    type: "haiku",
    relpath: "code/brick/code.js",
    core: "3.4.3",
    version: "0.0.0",
    folder: "/Users/matthew/.haiku/projects/matthew2/Bricks",
    player: "3.4.3",
    username: "matthew+2@haiku.ai",
    organization: "matthew2",
    project: "Bricks",
    branch: "master"
  },
  options: {},
  states: {},
  eventHandlers: {
    "haiku:ecf13be9fb45": {
      click: {
        handler: function(target, event) {
          console.log('click handler in brick called', event);
          this.getDefaultTimeline().gotoAndPlay(1);
        }
      },
      "timeline:Default:0": {
        handler: function(target, event) {
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
      "haiku:aeda00e52c62": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:b7a36df2cb1d": {
        "stop-color": { "0": { value: "#D50000" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:f95d0fcdf905": {
        "stop-color": { "0": { value: "#AA0000" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:9e232874fc1c": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:aefa0705ccc8": {
        "stop-color": { "0": { value: "#A13F3F" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:f0ff86abe006": {
        "stop-color": { "0": { value: "#842424" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:3bbf83c2087a": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:30bf759ade66": {
        stroke: { "0": { value: "url(#linearGradient-2-8073d6)" } },
        "stroke-width": { "0": { value: "4" } },
        fill: { "0": { value: "url(#linearGradient-1-8073d6)" } },
        x: { "0": { value: "2" } },
        y: { "0": { value: "-24" } },
        "sizeAbsolute.x": { "0": { value: 104 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 49 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:bde032a7fd90": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:7f2a0d6c6fb0": {
        "stop-color": { "0": { value: "#D50000" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:23f78b9867b6": {
        "stop-color": { "0": { value: "#AA0000" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:7a306782ba72": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:d293cccc9bd9": {
        "stop-color": { "0": { value: "#A13F3F" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:318ba2719770": {
        "stop-color": { "0": { value: "#842424" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:32b5d0b57590": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:930c1c457fd4": {
        stroke: { "0": { value: "url(#linearGradient-2-73f83f)" } },
        "stroke-width": { "0": { value: "4" } },
        fill: { "0": { value: "url(#linearGradient-1-73f83f)" } },
        x: { "0": { value: "-52" } },
        y: { "0": { value: "-24" } },
        "sizeAbsolute.x": { "0": { value: 104 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 49 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:06e9f34727c0": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:15aff3e60361": {
        "stop-color": { "0": { value: "#D50000" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:9305563ad31e": {
        "stop-color": { "0": { value: "#AA0000" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:2bbd1502abca": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:599eaaa536dd": {
        "stop-color": { "0": { value: "#A13F3F" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:12714a2b10f7": {
        "stop-color": { "0": { value: "#842424" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:36d3c704d55c": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:82ee6252f296": {
        stroke: { "0": { value: "url(#linearGradient-2-0037db)" } },
        "stroke-width": { "0": { value: "4" } },
        fill: { "0": { value: "url(#linearGradient-1-0037db)" } },
        x: { "0": { value: "2" } },
        y: { "0": { value: "2" } },
        "sizeAbsolute.x": { "0": { value: 104 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 49 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:d25499a356ee": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:4008e2e71d07": {
        "stop-color": { "0": { value: "#D50000" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:40513a01d0d3": {
        "stop-color": { "0": { value: "#AA0000" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:948ee3b5d69d": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:ce0201e7b4fa": {
        "stop-color": { "0": { value: "#A13F3F" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:a41198e6e94d": {
        "stop-color": { "0": { value: "#842424" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:1f59ce5da3b3": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:2ddeb965aa23": {
        stroke: { "0": { value: "url(#linearGradient-2-6046be)" } },
        "stroke-width": { "0": { value: "4" } },
        fill: { "0": { value: "url(#linearGradient-1-6046be)" } },
        x: { "0": { value: "-52" } },
        y: { "0": { value: "2" } },
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
            attributes: { "haiku-id": "9f6f4f7dc5ab" },
            children: [
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "aeda00e52c62",
                  id: "linearGradient-1-8073d6"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "b7a36df2cb1d" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "f95d0fcdf905" },
                    children: []
                  }
                ]
              },
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "9e232874fc1c",
                  id: "linearGradient-2-8073d6"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "aefa0705ccc8" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "f0ff86abe006" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "3bbf83c2087a", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "30bf759ade66", id: "Rectangle" },
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
            attributes: { "haiku-id": "42bc5cd3ca1e" },
            children: [
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "bde032a7fd90",
                  id: "linearGradient-1-73f83f"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "7f2a0d6c6fb0" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "23f78b9867b6" },
                    children: []
                  }
                ]
              },
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "7a306782ba72",
                  id: "linearGradient-2-73f83f"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "d293cccc9bd9" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "318ba2719770" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "32b5d0b57590", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "930c1c457fd4", id: "Rectangle" },
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
            attributes: { "haiku-id": "bf018fb864d7" },
            children: [
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "d25499a356ee",
                  id: "linearGradient-1-6046be"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "4008e2e71d07" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "40513a01d0d3" },
                    children: []
                  }
                ]
              },
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "948ee3b5d69d",
                  id: "linearGradient-2-6046be"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "ce0201e7b4fa" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "a41198e6e94d" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "1f59ce5da3b3", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "2ddeb965aa23", id: "Rectangle" },
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
            attributes: { "haiku-id": "7ac4ae0fb814" },
            children: [
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "06e9f34727c0",
                  id: "linearGradient-1-0037db"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "15aff3e60361" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "9305563ad31e" },
                    children: []
                  }
                ]
              },
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "2bbd1502abca",
                  id: "linearGradient-2-0037db"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "599eaaa536dd" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "12714a2b10f7" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "36d3c704d55c", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "82ee6252f296", id: "Rectangle" },
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
};
