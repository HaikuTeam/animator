var Haiku = require("@haiku/core");
var _code_brick_code = require("./../brick/code.js");
module.exports = {
  metadata: {
    folder: "/Users/matthew/.haiku/projects/matthew2/Bricks",
    uuid: "HAIKU_SHARE_UUID",
    core: "3.4.3",
    player: "3.4.3",
    username: "matthew+2@haiku.ai",
    organization: "matthew2",
    project: "Bricks",
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
      "haiku:e4a9e4d8baa7": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.transformStyle": { "0": { value: "flat" } },
        "style.perspective": { "0": { value: "none" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "hidden" } },
        "style.overflowY": { "0": { value: "hidden" } },
        "sizeAbsolute.x": { "0": { value: 550 } },
        "sizeAbsolute.y": { "0": { value: 400 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:4dc308611294": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: true } },
        "sizeAbsolute.y": { "0": { value: true } },
        "translation.x": { "0": { value: 134.5 } },
        "translation.y": { "0": { value: 134.25 } },
        "sizeMode.z": { "0": { value: 1 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "style.zIndex": { "0": { value: 1 } },
        playback: { "0": { value: "once", edited: true } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "e4a9e4d8baa7", "haiku-title": "Main" },
    children: [
      {
        elementName: _code_brick_code,
        attributes: {
          "haiku-id": "4dc308611294",
          "haiku-var": "_code_brick_code",
          "haiku-title": "Brick",
          "haiku-source": "./code/brick/code.js"
        },
        children: []
      }
    ]
  }
};
