var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    version: "0.0.0",
    username: "matthew+2@haiku.ai",
    organization: "matthew2",
    project: "Aug28Rep",
    branch: "master",
    folder: "/Users/matthew/.haiku/projects/matthew2/Aug28Rep",
    uuid: "HAIKU_SHARE_UUID",
    root: "HAIKU_CDN_PROJECT_ROOT",
    core: "4.0.0",
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
        "style.WebkitTapHighlightColor": "rgba(0,0,0,0)",
        "style.position": "relative",
        "style.overflowX": "hidden",
        "style.overflowY": "hidden",
        "sizeAbsolute.x": 550,
        "sizeAbsolute.y": 400,
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeMode.z": 1
      },
      "haiku:Blue-Circle-8276d0fa89f35cac": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 115,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 115,
        "sizeMode.y": 1,
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function($index) {
                return $index * 50;
              },
              "$index"
            ),
            edited: true
          }
        },
        "translation.y": {
          "0": {
            value: Haiku.inject(
              function($index) {
                return $index * 50;
              },
              "$index"
            ),
            edited: true
          }
        },
        "style.zIndex": 1,
        "controlFlow.repeat": { "0": { value: 5, edited: true } },
        "controlFlow.if": {
          "0": {
            value: Haiku.inject(
              function($index) {
                return $index !== 2;
              },
              "$index"
            ),
            edited: true
          }
        }
      },
      "haiku:Page-1-440808db20464c21": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Tutorial-58e62a75da2c167c": {
        "translation.x": -189,
        "translation.y": -622
      },
      "haiku:blue-circle-f52f5fa5cd762428": {
        fill: "#5DE2F9",
        cx: 246.5,
        cy: 679.5,
        r: 57.5
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "Main-03757d2ca1026e0a", "haiku-title": "Main" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Blue-Circle-8276d0fa89f35cac",
          "haiku-title": "blue-circle",
          "haiku-source": "designs/Aug28Rep.sketch.contents/slices/blue-circle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-440808db20464c21", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Tutorial-58e62a75da2c167c",
                  id: "Tutorial"
                },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "blue-circle-f52f5fa5cd762428",
                      id: "blue-circle"
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
