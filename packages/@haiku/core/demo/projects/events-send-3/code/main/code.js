var Haiku = require("@haiku/core");
var _code_brotherheart_code = require("./../brotherheart/code.js");
var _code_double_code = require("./../double/code.js");
module.exports = {
  metadata: {
    folder: "/Users/taylorpoe/.haiku/projects/taylor/canhasemit",
    uuid: "a1a6e692-1f9d-4c38-b7a6-49dfca49871f",
    core: "3.5.1",
    username: "taylor",
    organization: "taylor",
    project: "canhasemit",
    branch: "master",
    version: "0.0.0",
    title: "Main",
    type: "haiku",
    relpath: "code/main/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {
    "haiku:Main-03757d2ca1026e0a": {
      bronze: {
        handler: function(target, event) {
          console.log(this.$id,"main heard bronze");
        }
      },
      bro: {
        handler: function(target, event) {
          console.log(this.$id,"main heard bro (THIS SHOULD NOT HAPPEN)");
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
        "sizeMode.z": 1
      },
      "haiku:Double-1ef39d0d969a4c64": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeAbsolute.x": "auto",
        "sizeAbsolute.y": "auto",
        "translation.x": 245.7519346620945,
        "translation.y": 277.5,
        "sizeMode.z": 1,
        "origin.x": 0.5,
        "origin.y": 0.5,
        "style.zIndex": 1,
        playback: "loop"
      },
      "haiku:Brotherheart-4cfab28cd2cb4be6": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeAbsolute.x": "auto",
        "sizeAbsolute.y": "auto",
        "translation.x": 194,
        "translation.y": 79,
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
        elementName: _code_brotherheart_code,
        attributes: {
          "haiku-id": "Brotherheart-4cfab28cd2cb4be6",
          "haiku-var": "_code_brotherheart_code",
          "haiku-title": "Brotherheart",
          "haiku-source": "./code/brotherheart/code.js"
        },
        children: []
      },
      {
        elementName: _code_double_code,
        attributes: {
          "haiku-id": "Double-1ef39d0d969a4c64",
          "haiku-var": "_code_double_code",
          "haiku-title": "Double",
          "haiku-source": "./code/double/code.js"
        },
        children: []
      }
    ]
  }
};