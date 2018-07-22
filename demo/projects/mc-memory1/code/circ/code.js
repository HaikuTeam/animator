var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    title: "Circ",
    uuid: "HAIKU_SHARE_UUID",
    type: "haiku",
    relpath: "code/circ/code.js",
    core: "3.4.4"
  },
  options: {},
  states: {},
  eventHandlers: {
    "haiku:41397f63120c": {
      "timeline:Default:0": {
        handler: function(target, event) {
          console.log('pause')
          this.getDefaultTimeline().pause();
        }
      },
      "timeline:Default:59": {
        handler: function(target, event) {
          console.log('gotoAndStop', 59)
          this.getDefaultTimeline().gotoAndStop(60);
        }
      }
    },
    "haiku:f9f0bf96dffd": {
      click: {
        handler: function(target, event) {
          console.log('gotoAndPlay', 1)
          this.getDefaultTimeline().gotoAndPlay(1);
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:41397f63120c": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.transformStyle": { "0": { value: "flat" } },
        "style.perspective": { "0": { value: "none" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "visible" } },
        "style.overflowY": { "0": { value: "visible" } },
        "sizeAbsolute.x": { "0": { value: 80, edited: true } },
        "sizeAbsolute.y": { "0": { value: 105, edited: true } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:f9f0bf96dffd": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 80 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 104 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 41, edited: true } },
        "translation.y": { "0": { value: 53, edited: true } },
        "style.zIndex": { "0": { value: 1 } },
        "rotation.y": {
          "0": { value: 0, edited: true },
          "17": { value: 0, edited: true, curve: "linear" },
          "500": { value: 1.57, edited: true }
        }
      },
      "haiku:28122186020a": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:44d77b60f5ca": {
        stroke: { "0": { value: "#B50000" } },
        "stroke-width": { "0": { value: "5" } }
      },
      "haiku:74658a739eb1": {
        fill: { "0": { value: "#FFFFFF" } },
        x: { "0": { value: "2.5" } },
        y: { "0": { value: "2.5" } },
        rx: { "0": { value: "11" } },
        "sizeAbsolute.x": { "0": { value: 74 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 98 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:d40ca9dcbc03": {
        d: { "0": { value: "M3.9843771,15.9843771 L76.0018518,88.0018518" } },
        "stroke-linecap": { "0": { value: "square" } }
      },
      "haiku:ee055a92b15d": {
        d: { "0": { value: "M12.9981356,4.99813557 L75.002016,67.002016" } },
        "stroke-linecap": { "0": { value: "square" } }
      },
      "haiku:86676a6d8096": {
        d: { "0": { value: "M32.5,4.5 L75.0029411,47.0029411" } },
        "stroke-linecap": { "0": { value: "square" } }
      },
      "haiku:e8509b1e7fd0": {
        d: { "0": { value: "M51.995543,3.99554302 L75.5,27.5" } },
        "stroke-linecap": { "0": { value: "square" } }
      },
      "haiku:70004b3d8b1f": {
        d: { "0": { value: "M4.49212673,36.4921267 L68.0021008,100.002101" } },
        "stroke-linecap": { "0": { value: "square" } }
      },
      "haiku:c0544c37668a": {
        d: { "0": { value: "M3.48837366,55.4883737 L46.5,98.5" } },
        "stroke-linecap": { "0": { value: "square" } }
      },
      "haiku:3e3d5728603b": {
        d: { "0": { value: "M4.47795335,76.4779533 L27.1681547,99.1681547" } },
        "stroke-linecap": { "0": { value: "square" } }
      },
      "haiku:40faa19a0475": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 79 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 103 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 41, edited: true },
          "17": { value: 41, edited: true }
        },
        "translation.y": {
          "0": { value: 52.5, edited: true },
          "17": { value: 52.5, edited: true }
        },
        "style.zIndex": { "0": { value: 2 } },
        "rotation.y": {
          "0": { value: 1.57, edited: true },
          "17": { value: 1.57, edited: true },
          "500": { value: 1.57, edited: true, curve: "linear" },
          "983": { value: 0, edited: true },
          "1000": { value: 0, edited: true },
        }
      },
      "haiku:9d335ee035a7": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:f2d75a48b773": {
        stroke: { "0": { value: "#B50000" } },
        "stroke-width": { "0": { value: "5" } },
        fill: { "0": { value: "#FFFFFF" } },
        x: { "0": { value: "2.5" } },
        y: { "0": { value: "2.5" } },
        rx: { "0": { value: "11" } },
        "sizeAbsolute.x": { "0": { value: 74 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 98 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:6fdd614852c6": {
        fill: { "0": { value: "#B50000" } },
        cx: { "0": { value: "39" } },
        cy: { "0": { value: "51.5" } },
        rx: { "0": { value: "23" } },
        ry: { "0": { value: "22.5" } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "41397f63120c", "haiku-title": "Circ" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "40faa19a0475",
          "haiku-title": "Circ",
          "haiku-source": "designs/Memory.sketch.contents/slices/Circ.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "9d335ee035a7", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "a48e69e8421f", id: "Circ" },
                children: [
                  {
                    elementName: "rect",
                    attributes: { "haiku-id": "f2d75a48b773", id: "Rectangle" },
                    children: []
                  },
                  {
                    elementName: "ellipse",
                    attributes: { "haiku-id": "6fdd614852c6", id: "Oval" },
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
          "haiku-id": "f9f0bf96dffd",
          "haiku-title": "Back",
          "haiku-source": "designs/Memory.sketch.contents/slices/Back.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "28122186020a",
              "haiku-title": "Page-1",
              id: "3fda277a41cd"
            },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "44d77b60f5ca",
                  "haiku-title": "Back",
                  id: "768d991b6a4b"
                },
                children: [
                  {
                    elementName: "rect",
                    attributes: {
                      "haiku-id": "74658a739eb1",
                      "haiku-title": "Rectangle",
                      id: "46dce7bddbd9"
                    },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "d40ca9dcbc03",
                      "haiku-title": "Line",
                      id: "8ecbe01da87e"
                    },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "ee055a92b15d",
                      "haiku-title": "Line",
                      id: "8ecbe01da87e"
                    },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "86676a6d8096",
                      "haiku-title": "Line",
                      id: "8ecbe01da87e"
                    },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "e8509b1e7fd0",
                      "haiku-title": "Line",
                      id: "8ecbe01da87e"
                    },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "70004b3d8b1f",
                      "haiku-title": "Line",
                      id: "8ecbe01da87e"
                    },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "c0544c37668a",
                      "haiku-title": "Line",
                      id: "8ecbe01da87e"
                    },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "3e3d5728603b",
                      "haiku-title": "Line",
                      id: "8ecbe01da87e"
                    },
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
