var Haiku = require("@haiku/core");
var _code_asdf_code = require("./../asdf/code.js");
module.exports = {
  metadata: {
    version: "0.0.0",
    username: "mrtrost+haiku@gmail.com",
    organization: "matthewtrost",
    project: "Aug30426",
    branch: "master",
    folder: "/Users/matthew/.haiku/projects/matthewtrost/Aug30426",
    uuid: "HAIKU_SHARE_UUID",
    root: "HAIKU_CDN_PROJECT_ROOT",
    core: "4.1.1",
    title: "Main",
    type: "haiku",
    relpath: "code/main/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {
    "haiku:Main-03757d2ca1026e0a": {
      "timeline:Default:0": {
        handler: function(component, element, target, event) {
          this.pause();
        }
      },
      click: {
        handler: function(component, element, target, event) {
          console.log(1);
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
      "haiku:Asdf-57bfef02bb474efa": {
        "translation.y": {
          "0": {
            value: Haiku.inject(function($index) {
              return $index * 50;
            }, "$index"),
            edited: true
          }
        },
        "sizeAbsolute.y": "auto",
        "style.padding": "0",
        "style.border": "0",
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeAbsolute.x": "auto",
        "style.margin": "0",
        "translation.x": {
          "0": {
            value: Haiku.inject(function($index) {
              return $index * 50;
            }, "$index"),
            edited: true
          }
        },
        "style.position": "absolute",
        "sizeMode.z": 1,
        "origin.x": 0.5,
        "origin.y": 0.5,
        "style.zIndex": 1,
        playback: "loop",
        "controlFlow.repeat": { "0": { value: 5, edited: true } },
        color: { "0": { value: "red", edited: true } },
        frame: { "0": { value: 15, edited: true } }
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
