var Haiku = require("@haiku/core");
var _code_card_code = require("./../card/code.js");
module.exports = {
  metadata: {
    folder: "/Users/taylorpoe/.haiku/projects/taylor/pup2",
    uuid: "e7989ce9-8d98-4d2c-aba6-bd00edb9cdb2",
    core: "3.5.1",
    username: "taylor",
    organization: "taylor",
    project: "pup2",
    branch: "master",
    version: "0.0.0",
    title: "Cardwrapper",
    type: "haiku",
    relpath: "code/cardwrapper/code.js"
  },
  options: {},
  states: {
    rotReducer: { type: "number", value: 1300, edited: true },
    dog: { type: "number", value: 3, edited: true },
    offsetX: { type: "number", value: 0, edited: true },
    offsetY: { type: "number", value: 0, edited: true },
    name: { type: "string", value: "toshi", edited: true },
    type: { type: "string", value: "horse", edited: true },
    weight: { type: "number", value: 10, edited: true }
  },
  eventHandlers: {
    "haiku:Cardwrapper-aedeb3d3e683a349": {
      "timeline:Default:11": {
        handler: function(target, event) {
          this.getDefaultTimeline().pause();
        }
      },
      "timeline:Default:0": {
        handler: function(target, event) {
          this.getDefaultTimeline().pause();
        }
      },
      mouseenter: {
        handler: function(target, event) {
          this.gotoAndPlay(1);
          this.send("down", "playCard");
        }
      },
      mouseleave: {
        handler: function(target, event) {
          this.send("down", "pauseCard");
          this.gotoAndPlay(17);
        }
      },
      "timeline:Default:25": {
        handler: function(target, event) {
          this.getDefaultTimeline().pause();
        }
      },
      "timeline:Default:28": {
        handler: function(target, event) {
          this.getDefaultTimeline().pause();
        }
      }
    },
    "haiku:Card-4e1537efd834b278": {}
  },
  timelines: {
    Default: {
      "haiku:Cardwrapper-aedeb3d3e683a349": {
        "style.WebkitTapHighlightColor": "rgba(0,0,0,0)",
        "style.position": "relative",
        "style.overflowX": "visible",
        "style.overflowY": "visible",
        "sizeAbsolute.x": 353,
        "sizeAbsolute.y": 427,
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeMode.z": 1,
        "style.pointerEvents": { "0": { value: "auto", edited: true } },
        "style.transformStyle": { "0": { value: "preserve-3d", edited: true } },
        "style.perspective": { "0": { value: "900px", edited: true } },
        opacity: {
          "0": { value: 1, edited: true },
          "483": { value: 1, edited: true }
        }
      },
      "haiku:Card-4e1537efd834b278": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeAbsolute.x": "auto",
        "sizeAbsolute.y": "auto",
        "translation.x": 176.50050647161842,
        "translation.y": 211.50050782827495,
        "origin.x": 0.5,
        "origin.y": 0.5,
        "style.zIndex": 2,
        "rotation.x": {
          "0": { value: 0, edited: true },
          "17": { value: 0, edited: true, curve: "easeOutBack" },
          "183": {
            value: Haiku.inject(
              function($user, offsetY, $component, rotReducer) {
                return ($user.mouse.y - offsetY - $component.height / 2) /
                  -rotReducer;
              },
              "$user",
              "offsetY",
              "$component",
              "rotReducer"
            ),
            edited: true
          },
          "283": {
            value: Haiku.inject(
              function($user, offsetY, $component, rotReducer) {
                return ($user.mouse.y - offsetY - $component.height / 2) /
                  -rotReducer;
              },
              "$user",
              "offsetY",
              "$component",
              "rotReducer"
            ),
            edited: true,
            curve: "easeInOutCubic"
          },
          "417": { value: 0, edited: true }
        },
        "rotation.y": {
          "0": { value: 0, edited: true },
          "17": { value: 0, edited: true, curve: "easeOutBack" },
          "183": {
            value: Haiku.inject(
              function($user, offsetX, $component, rotReducer) {
                return ($user.mouse.x - offsetX - $component.width / 2) /
                  rotReducer;
              },
              "$user",
              "offsetX",
              "$component",
              "rotReducer"
            ),
            edited: true
          },
          "283": {
            value: Haiku.inject(
              function($user, offsetX, $component, rotReducer) {
                return ($user.mouse.x - offsetX - $component.width / 2) /
                  rotReducer;
              },
              "$user",
              "offsetX",
              "$component",
              "rotReducer"
            ),
            edited: true,
            curve: "easeInOutCubic"
          },
          "417": { value: 0, edited: true }
        },
        "rotation.z": 0,
        "translation.z": 0,
        "scale.x": 0.845,
        "scale.y": 0.845,
        "scale.z": 1,
        "shear.xy": 0,
        "shear.xz": 0,
        "shear.yz": 0,
        dog: {
          "0": {
            value: Haiku.inject(
              function(dog) {
                return dog;
              },
              "dog"
            ),
            edited: true
          }
        },
        offset: {
          "0": {
            value: Haiku.inject(
              function(offsetX) {
                return offsetX;
              },
              "offsetX"
            ),
            edited: true
          }
        },
        zProtection: { "0": { value: 1, edited: true } },
        name: {
          "0": {
            value: Haiku.inject(
              function(name) {
                return name;
              },
              "name"
            ),
            edited: true
          }
        },
        type: {
          "0": {
            value: Haiku.inject(
              function(type) {
                return type;
              },
              "type"
            ),
            edited: true
          }
        },
        weight: {
          "0": {
            value: Haiku.inject(
              function(weight) {
                return weight;
              },
              "weight"
            ),
            edited: true
          }
        }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: {
      "haiku-id": "Cardwrapper-aedeb3d3e683a349",
      "haiku-title": "Cardwrapper"
    },
    children: [
      {
        elementName: _code_card_code,
        attributes: {
          "haiku-id": "Card-4e1537efd834b278",
          "haiku-var": "_code_card_code",
          "haiku-title": "Card",
          "haiku-source": "./code/card/code.js",
          name: "toshi",
          type: "horse"
        },
        children: []
      }
    ]
  }
};
