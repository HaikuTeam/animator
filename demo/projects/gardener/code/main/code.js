var Haiku = require("@haiku/core");
var _code_flow_code = require("./../flow/code.js");
module.exports = {
  metadata: {
    folder: "/Users/matthew/.haiku/projects/matthew2/gardener",
    uuid: "HAIKU_SHARE_UUID",
    root: "HAIKU_CDN_PROJECT_ROOT",
    core: "3.5.1",
    username: "matthew+2@haiku.ai",
    organization: "matthew2",
    project: "gardener",
    branch: "master",
    version: "0.0.0",
    title: "Main",
    type: "haiku",
    relpath: "code/main/code.js"
  },
  options: {},
  states: {
    flows: { type: "array", value: [{ x: 275, y: 200 }], edited: true }
  },
  eventHandlers: {
    "haiku:Main-03757d2ca1026e0a": {
      click: {
        handler: function(component, target, event) {
          const flows = this.state.flows;
          const mouse = this.evaluate("$user.mouse");

          // Add a flower at the clicked position
          flows.push({
            x: mouse.x,
            y: mouse.y
          });

          // Tell all newly established flowers to grow
          this.send("down", "grow");
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
      "haiku:Flow-db384ac1a242ba3a": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeAbsolute.x": "auto",
        "sizeAbsolute.y": "auto",
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function($payload) {
                return $payload.x;
              },
              "$payload"
            ),
            edited: true
          }
        },
        "translation.y": {
          "0": {
            value: Haiku.inject(
              function($payload) {
                return $payload.y;
              },
              "$payload"
            ),
            edited: true
          }
        },
        "sizeMode.z": 1,
        "origin.x": 0.5,
        "origin.y": 0.5,
        "style.zIndex": 1,
        playback: "loop",
        "controlFlow.repeat": {
          "0": {
            value: Haiku.inject(
              function(flows) {
                return flows;
              },
              "flows"
            ),
            edited: true
          }
        }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "Main-03757d2ca1026e0a", "haiku-title": "Main" },
    children: [
      {
        elementName: _code_flow_code,
        attributes: {
          "haiku-id": "Flow-db384ac1a242ba3a",
          "haiku-var": "_code_flow_code",
          "haiku-title": "Flow",
          "haiku-source": "./code/flow/code.js"
        },
        children: []
      }
    ]
  }
};
