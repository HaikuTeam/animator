var Haiku = require("@haiku/core");
var _code_dotdeep_code = require("./../dotdeep/code.js");
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
    title: "Dot",
    type: "haiku",
    relpath: "code/dot/code.js"
  },
  options: {},
  states: { color: { type: "string", value: "blue", edited: true } },
  eventHandlers: {},
  timelines: {
    Default: {
      "haiku:Dot-9686cc9f4807e40f": {
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
      "haiku:Dotdeep-7814fa674316f446": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeAbsolute.x": "auto",
        "sizeAbsolute.y": "auto",
        "translation.x": 57.5,
        "translation.y": 57.5,
        "sizeMode.z": 1,
        "origin.x": 0.5,
        "origin.y": 0.5,
        "style.zIndex": 1,
        playback: "loop",
        color: {
          "0": {
            value: Haiku.inject(
              function(color) {
                return color;
              },
              "color"
            )
          }
        }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "Dot-9686cc9f4807e40f", "haiku-title": "Dot" },
    children: [
      {
        elementName: _code_dotdeep_code,
        attributes: {
          "haiku-id": "Dotdeep-7814fa674316f446",
          "haiku-var": "_code_dotdeep_code",
          "haiku-title": "Dotdeep",
          "haiku-source": "./code/dotdeep/code.js"
        },
        children: []
      }
    ]
  }
};
