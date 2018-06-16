var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    folder: "/Users/matthew/Code/HaikuTeam/mono/packages/haiku-plumbing/test/fixtures/projects/blank-project/",
    uuid: "HAIKU_SHARE_UUID",
    core: "3.3.4",
    player: "3.3.4",
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
  eventHandlers: {
    "haiku:b4f67f7f3bb4": {
      mouseenter: {
        handler: function(target, event) {
          console.log("ENTER!");
        }
      },
      mouseleave: {
        handler: function(target, event) {
          console.log("LEAVE!");
        }
      },
      mouseover: {
        handler: function(target, event) {
          console.log("OVER!");
        }
      },
      mouseout: {
        handler: function(target, event) {
          console.log("OUT!");
        }
      }
    }
  },
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
      "haiku:b4f67f7f3bb4": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 115 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 115 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 273 } },
        "translation.y": { "0": { value: 195.5 } },
        "style.zIndex": { "0": { value: 1 } }
      },
      "haiku:b93ae9f1702c": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:d5e36900eb48": {
        "translation.x": { "0": { value: -189 } },
        "translation.y": { "0": { value: -622 } }
      },
      "haiku:862a72ba99f3": {
        fill: { "0": { value: "#5DE2F9" } },
        cx: { "0": { value: "246.5" } },
        cy: { "0": { value: "679.5" } },
        r: { "0": { value: "57.5" } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "e4a9e4d8baa7", "haiku-title": "Main" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "b4f67f7f3bb4",
          "haiku-title": "blue-circle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/blue-circle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "b93ae9f1702c", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "d5e36900eb48", id: "Tutorial" },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "862a72ba99f3",
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
