var Haiku = require("@haiku/core");
var _code_asdf_code = require("./../asdf/code.js");
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
    title: "Main",
    type: "haiku",
    relpath: "code/main/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {
    "haiku:Asdf-57bfef02bb474efa": {
      hover: {
        handler: function(component, element, target, event) {
          console.log("HOVER WRAPPER");
        }
      },
      unhover: {
        handler: function(component, element, target, event) {
          console.log("UNHOVER WRAPPER");
        }
      }
    },
    "haiku:Main-03757d2ca1026e0a": {
      hover: {
        handler: function(component, element, target, event) {
          console.log("HOVER MAIN");
        }
      },
      unhover: {
        handler: function(component, element, target, event) {
          console.log("UNHOVER MAIN");
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:Main-03757d2ca1026e0a": {
        "style.border": "1px solid black",
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
      "haiku:Asdf-57bfef02bb474efa": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeAbsolute.x": "auto",
        "sizeAbsolute.y": "auto",
        "translation.x": 275,
        "translation.y": 200,
        "sizeMode.z": 1,
        "origin.x": 0.5,
        "origin.y": 0.5,
        "style.zIndex": 1,
        playback: "loop"
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
