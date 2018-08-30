var Haiku = require("@haiku/core");
var _code_asdf_code = require("./../asdf/code.js");
module.exports = {
  metadata: {
    version: "0.0.0",
    username: "matthew+2@haiku.ai",
    organization: "matthew2",
    project: "Aug28",
    branch: "master",
    folder: "/Users/matthew/.haiku/projects/matthew2/Aug28",
    uuid: "HAIKU_SHARE_UUID",
    root: "HAIKU_CDN_PROJECT_ROOT",
    core: "4.0.0",
    title: "Main",
    type: "haiku",
    relpath: "code/main/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {
    "haiku:Main-03757d2ca1026e0a": {
      "timeline:Default:26": {
        handler: function(component, element, target, event) {
          this.gotoAndPlay(0);
        }
      }
    }
  },
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
        "sizeMode.z": 1,
        opacity: {
          "0": { value: 1, edited: true },
          "433": { value: 1, edited: true }
        }
      },
      "haiku:Asdf-57bfef02bb474efa": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeAbsolute.x": "auto",
        "sizeAbsolute.y": "auto",
        "translation.x": 173.5,
        "translation.y": 186,
        "sizeMode.z": 1,
        "origin.x": 0.5,
        "origin.y": 0.5,
        "style.zIndex": 1,
        playback: "loop",
        color: { "0": { value: "green", edited: true } }
      },
      "haiku:Asdf-71083cd1d52bf2c9": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeAbsolute.x": "auto",
        "sizeAbsolute.y": "auto",
        "translation.x": 377,
        "translation.y": 186,
        "origin.x": 0.5,
        "origin.y": 0.5,
        "style.zIndex": 2
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "Main-03757d2ca1026e0a", "haiku-title": "Main" },
    children: [
      {
        elementName: _code_asdf_code,
        attributes: {
          "haiku-id": "Asdf-71083cd1d52bf2c9",
          "haiku-var": "_code_asdf_code",
          "haiku-title": "Asdf",
          "haiku-source": "./code/asdf/code.js"
        },
        children: []
      },
      {
        elementName: _code_asdf_code,
        attributes: {
          "haiku-id": "Asdf-57bfef02bb474efa",
          "haiku-var": "_code_asdf_code",
          "haiku-title": "Asdf",
          "haiku-source": "./code/asdf/code.js"
        },
        children: []
      }
    ]
  }
};
