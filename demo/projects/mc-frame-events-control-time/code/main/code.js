var Haiku = require("@haiku/core");
var _code_asdf_code = require("./../asdf/code.js");
module.exports = {
  metadata: {
    folder: "/Users/matthew/Code/HaikuTeam/mono/packages/haiku-plumbing/test/fixtures/projects/blank-project/",
    uuid: "HAIKU_SHARE_UUID",
    core: "3.5.1",
    username: "jenkins@haiku.ai",
    organization: "jenkins",
    project: "UsersMatthewHaikuProjects",
    branch: "master",
    version: "0.0.0",
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
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "hidden" } },
        "style.overflowY": { "0": { value: "hidden" } },
        "sizeAbsolute.x": { "0": { value: 550 }, "1000": { value: 550 } },
        "sizeAbsolute.y": { "0": { value: 400 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "style.backgroundColor": {
          "0": {
            value: Haiku.inject(function($timeline) {
              return 'rgb('+($timeline.frame*2)%255+','+($timeline.frame*2)%255+','+($timeline.frame*2)%255+')'
            }, '$timeline')
          }
        }
      },
      "haiku:Asdf-57bfef02bb474efa": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: "auto" } },
        "sizeAbsolute.y": { "0": { value: "auto" } },
        "translation.x": { "0": { value: 113.5 } },
        "translation.y": { "0": { value: 148 } },
        "sizeMode.z": { "0": { value: 1 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "style.zIndex": { "0": { value: 1 } },
        playback: { "0": { value: "loop" } }
      },
      "haiku:Asdf-71083cd1d52bf2c9": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: "auto" } },
        "sizeAbsolute.y": { "0": { value: "auto" } },
        "translation.x": { "0": { value: 316.5 } },
        "translation.y": { "0": { value: 159 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "style.zIndex": { "0": { value: 2 } }
      },
      "haiku:Asdf-e3764c23b008413a": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: "auto" } },
        "sizeAbsolute.y": { "0": { value: "auto" } },
        "translation.x": { "0": { value: 191.5 } },
        "translation.y": { "0": { value: 288 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "style.zIndex": { "0": { value: 3 } }
      },
      "haiku:Asdf-6da6aacc78061f06": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: "auto" } },
        "sizeAbsolute.y": { "0": { value: "auto" } },
        "translation.x": { "0": { value: 405.5 } },
        "translation.y": { "0": { value: 84 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "style.zIndex": { "0": { value: 4 } }
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
          "haiku-id": "Asdf-6da6aacc78061f06",
          "haiku-var": "_code_asdf_code",
          "haiku-title": "Asdf",
          "haiku-source": "./code/asdf/code.js"
        },
        children: []
      },
      {
        elementName: _code_asdf_code,
        attributes: {
          "haiku-id": "Asdf-e3764c23b008413a",
          "haiku-var": "_code_asdf_code",
          "haiku-title": "Asdf",
          "haiku-source": "./code/asdf/code.js"
        },
        children: []
      },
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
