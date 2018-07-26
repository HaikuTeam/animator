var Haiku = require("@haiku/core");
var _code_card_code = require("./../card/code.js");
module.exports = {
  metadata: {
    folder: "/Users/taylorpoe/.haiku/projects/taylor/ShadNo",
    uuid: "548ff9e8-fe30-433b-a625-b162a3210a16",
    core: "3.5.1",
    username: "taylor",
    organization: "taylor",
    project: "ShadNo",
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
      "haiku:03757d2ca102": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.transformStyle": { "0": { value: "flat" } },
        "style.perspective": { "0": { value: "700px", edited: true } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "hidden" } },
        "style.overflowY": { "0": { value: "hidden" } },
        "sizeAbsolute.x": { "0": { value: 1100, edited: true } },
        "sizeAbsolute.y": { "0": { value: 600, edited: true } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:f84c206ead67": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: "auto" } },
        "sizeAbsolute.y": { "0": { value: "auto" } },
        "translation.x": { "0": { value: 263, edited: true } },
        "translation.y": { "0": { value: 276, edited: true } },
        "sizeMode.z": { "0": { value: 1 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "style.zIndex": { "0": { value: 1 } },
        playback: { "0": { value: "loop" } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "03757d2ca102", "haiku-title": "Main" },
    children: [
      {
        elementName: _code_card_code,
        attributes: {
          "haiku-id": "f84c206ead67",
          "haiku-var": "_code_card_code",
          "haiku-title": "Card",
          "haiku-source": "./code/card/code.js"
        },
        children: []
      }
    ]
  }
};