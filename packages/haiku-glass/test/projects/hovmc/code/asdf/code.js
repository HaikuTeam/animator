var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    version: "0.0.0",
    username: "matthew+2@haiku.ai",
    organization: "matthew2",
    project: "Aug28Hov",
    branch: "master",
    folder: "/Users/matthew/.haiku/projects/matthew2/Aug28Hov",
    uuid: "HAIKU_SHARE_UUID",
    root: "HAIKU_CDN_PROJECT_ROOT",
    core: "4.0.0",
    title: "Asdf",
    type: "haiku",
    relpath: "code/asdf/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {
    "haiku:Asdf-0ae0430248b19159": {
      hover: {
        handler: function(component, element, target, event) {
          console.log("HOVER DEF");
        }
      },
      unhover: {
        handler: function(component, element, target, event) {
          console.llog("UNHOVER DEF");
        }
      }
    }
  },
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
        "sizeMode.z": 1,
        "style.border": { "0": { value: "1px solid black", edited: true } }
      },
      "haiku:6e509032f185": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 115,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 115,
        "sizeMode.y": 1,
        "translation.x": 57.50000000000001,
        "translation.y": 57.49999999999999,
        "style.zIndex": 1,
        "translation.z": 0,
        "rotation.x": 0,
        "rotation.y": 0,
        "rotation.z": 0,
        "scale.x": 0.67,
        "scale.y": 0.696,
        "scale.z": 1,
        "shear.xy": 0,
        "shear.xz": 0,
        "shear.yz": 0
      },
      "haiku:9a2f73b33d80": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:91d3c3774299": { "translation.x": -189, "translation.y": -622 },
      "haiku:20ada7bb2d6d": { fill: "#5DE2F9", cx: 246.5, cy: 679.5, r: 57.5 }
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
          "haiku-id": "6e509032f185",
          "haiku-title": "blue-circle",
          "haiku-source": "designs/Aug28Hov.sketch.contents/slices/blue-circle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "9a2f73b33d80",
              "haiku-title": "Page-1",
              id: "f05dcae7e6af"
            },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "91d3c3774299",
                  "haiku-title": "Tutorial",
                  id: "2bfc1a9c4224"
                },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "20ada7bb2d6d",
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
