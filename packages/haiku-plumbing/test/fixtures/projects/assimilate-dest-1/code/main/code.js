var Haiku = require("@haiku/core");
var _code_child_code = require("./../child/code.js");
module.exports = {
  metadata: {
    uuid: "HAIKU_SHARE_UUID",
    version: "0.0.0",
    organization: "Haiku",
    project: "blank-project",
    branch: "master",
    folder:
      "/Users/matthew/Code/HaikuTeam/mono/packages/haiku-plumbing/test/fixtures/projects/blank-project/",
    username: "user@haiku.ai",
    root: "HAIKU_CDN_PROJECT_ROOT",
    core: "4.2.0",
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
      "haiku:Blue-Circle-be44e930590feaf8": {
        "sizeMode.x": 1,
        "style.position": "absolute",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 115,
        "style.margin": "0",
        "sizeAbsolute.y": 115,
        "sizeMode.y": 1,
        "translation.x": 379,
        "translation.y": 196,
        "style.zIndex": 1
      },
      "haiku:Page-1-032c72a93fa93e46": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Tutorial-3d70a7ff849506cc": {
        "translation.x": -189,
        "translation.y": -622
      },
      "haiku:blue-circle-8f6c7b115c018986": {
        fill: "#5DE2F9",
        cx: 246.5,
        cy: 679.5,
        r: 57.5
      },
      "haiku:Child-3bfc99cb9e5f8f7b": {
        "sizeAbsolute.y": "auto",
        "style.position": "absolute",
        "style.padding": "0",
        "style.border": "0",
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeAbsolute.x": "auto",
        "style.margin": "0",
        "translation.x": 86.50049999999999,
        "translation.y": 200,
        "sizeMode.z": 1,
        "origin.x": 0.5,
        "origin.y": 0.5,
        "style.zIndex": 2,
        playback: "loop"
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "Main-03757d2ca1026e0a", "haiku-title": "Main" },
    children: [
      {
        elementName: _code_child_code,
        attributes: {
          "haiku-id": "Child-3bfc99cb9e5f8f7b",
          "haiku-var": "_code_child_code",
          "haiku-title": "Child",
          "haiku-source": "./code/child/code.js"
        },
        children: []
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Blue-Circle-be44e930590feaf8",
          "haiku-title": "blue-circle",
          "haiku-source":
            "designs/blank-project.sketch.contents/slices/blue-circle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-032c72a93fa93e46", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Tutorial-3d70a7ff849506cc",
                  id: "Tutorial"
                },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "blue-circle-8f6c7b115c018986",
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
