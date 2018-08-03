var Haiku = require("@haiku/core");
var _code_inserter_code = require("./../inserter/code.js");
module.exports = {
  metadata: {
    folder: "/Users/zack/.haiku/projects/zack4/shift",
    uuid: "3819ddc1-7dd3-4016-92ad-3082180f0756",
    core: "3.5.1",
    username: "zack4",
    organization: "zack4",
    project: "shift",
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
      "haiku:Inserter-1120494b911b3ee3": {
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
        "origin.x": 0.5,
        "origin.y": 0.5,
        "style.zIndex": 1
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "Main-03757d2ca1026e0a", "haiku-title": "Main" },
    children: [
      {
        elementName: _code_inserter_code,
        attributes: {
          "haiku-id": "Inserter-1120494b911b3ee3",
          "haiku-var": "_code_inserter_code",
          "haiku-title": "Inserter",
          "haiku-source": "./code/inserter/code.js"
        },
        children: []
      }
    ]
  }
};
