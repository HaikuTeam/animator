var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    version: "0.0.0",
    username: "matthew+2@haiku.ai",
    organization: "matthew2",
    project: "Aug27Overr",
    branch: "master",
    folder: "/Users/matthew/.haiku/projects/matthew2/Aug27Overr",
    uuid: "HAIKU_SHARE_UUID",
    root: "HAIKU_CDN_PROJECT_ROOT",
    core: "4.0.0",
    title: "Asdf",
    type: "haiku",
    relpath: "code/asdf/code.js"
  },
  options: {},
  states: { color: { type: "string", value: "blue", edited: true } },
  eventHandlers: {},
  timelines: {
    Default: {
      "haiku:Asdf-0ae0430248b19159": {
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
      "haiku:2be6ea3d502c": {
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
      "haiku:f98e519672d1": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:55605a769ab4": { "translation.x": -189, "translation.y": -622 },
      "haiku:5118cf650fec": {
        fill: {
          "0": {
            value: Haiku.inject(
              function(color) {
                return color;
              },
              "color"
            ),
            edited: true
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
    attributes: { "haiku-id": "Asdf-0ae0430248b19159", "haiku-title": "Asdf" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "2be6ea3d502c",
          "haiku-title": "blue-circle",
          "haiku-source": "designs/Aug27Overr.sketch.contents/slices/blue-circle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "f98e519672d1",
              "haiku-title": "Page-1",
              id: "f05dcae7e6af"
            },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "55605a769ab4",
                  "haiku-title": "Tutorial",
                  id: "2bfc1a9c4224"
                },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "5118cf650fec",
                      "haiku-title": "blue-circle",
                      id: "1f70f75561ef"
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
