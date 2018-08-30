var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    version: "0.0.0",
    username: "matthew+2@haiku.ai",
    organization: "matthew2",
    project: "Aug23Comp443",
    branch: "master",
    folder: "/Users/matthew/.haiku/projects/matthew2/Aug23Comp443",
    uuid: "HAIKU_SHARE_UUID",
    root: "HAIKU_CDN_PROJECT_ROOT",
    core: "4.0.0",
    title: "Dotdeep",
    type: "haiku",
    relpath: "code/dotdeep/code.js"
  },
  options: {},
  states: { color: { type: "string", value: "blue", edited: true } },
  eventHandlers: {},
  timelines: {
    Default: {
      "haiku:Dotdeep-b28aa0f408e5afc3": {
        "style.WebkitTapHighlightColor": "rgba(0,0,0,0)",
        "style.position": "relative",
        "style.overflowX": "visible",
        "style.overflowY": "visible",
        "sizeAbsolute.x": 115,
        "sizeAbsolute.y": 115,
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeMode.z": 1
      },
      "haiku:6fa8c4e69067": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 115,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 115,
        "sizeMode.y": 1,
        "translation.x": 57.5,
        "translation.y": 57.5,
        "style.zIndex": 1
      },
      "haiku:1fdb24aebfe6": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:6d32ad429420": { "translation.x": -189, "translation.y": -622 },
      "haiku:b7b6a60285c9": {
        fill: {
          "0": {
            value: Haiku.inject(
              function(color) {
                return color;
              },
              "color"
            )
          }
        },
        cx: 246.5,
        cy: 679.5,
        r: 57.5
      }
    }
  },
  template: {
    elementName: "div",
    attributes: {
      "haiku-id": "Dotdeep-b28aa0f408e5afc3",
      "haiku-title": "Dotdeep"
    },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "6fa8c4e69067",
          "haiku-title": "blue-circle",
          "haiku-source": "designs/Aug23Comp443.sketch.contents/slices/blue-circle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "1fdb24aebfe6",
              "haiku-title": "Page-1",
              id: "248fd28affdb"
            },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "6d32ad429420",
                  "haiku-title": "Tutorial",
                  id: "37b0ade05203"
                },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "b7b6a60285c9",
                      "haiku-title": "blue-circle",
                      id: "8dfa97018ca1"
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
