var Haiku = require("@haiku/core");
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
    title: "Separator",
    type: "haiku",
    relpath: "code/separator/code.js"
  },
  options: {},
  states: { isActive: { type: "boolean", value: false, edited: true } },
  eventHandlers: {
    "haiku:Separator-f0e07a3e38dfc1dc": {
      "timeline:Default:14": {
        handler: function(component, target, event) {
          this.pause();
        }
      },
      "timeline:Default:28": {
        handler: function(component, target, event) {
          this.pause();
        }
      }
    },
    "haiku:Layer-1-Shift-04-8f3e6808f688acef": {}
  },
  timelines: {
    Default: {
      "haiku:Separator-f0e07a3e38dfc1dc": {
        "style.WebkitTapHighlightColor": "rgba(0,0,0,0)",
        "style.position": "relative",
        "style.overflowX": "visible",
        "style.overflowY": "visible",
        "sizeAbsolute.x": 2,
        "sizeAbsolute.y": 50,
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeMode.z": 1
      },
      "haiku:Layer-1-Shift-04-8f3e6808f688acef": {
        x: "0px",
        y: "0px",
        viewBox: "0 0 2 50",
        enableBackground: "new 0 0 2 50",
        "xml:space": "preserve",
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeAbsolute.x": 2,
        "sizeAbsolute.y": 50,
        "translation.x": 0,
        "translation.y": 0,
        "style.zIndex": 1,
        "origin.x": 0,
        "origin.y": 0,
        opacity: {
          "0": { value: 1, edited: true, curve: "linear" },
          "233": { value: 1, edited: true, curve: "linear" },
          "467": { value: 0, edited: true }
        }
      },
      "haiku:Rect-6dfa744f105b7df0": {
        x: 0.5,
        y: 0,
        fill: {
          "0": {
            value: Haiku.inject(
              function(isActive) {
                return !isActive ? "#29ABE2" : "#222222";
              },
              "isActive"
            ),
            edited: true
          }
        },
        width: 1,
        height: 50
      }
    }
  },
  template: {
    elementName: "div",
    attributes: {
      "haiku-id": "Separator-f0e07a3e38dfc1dc",
      "haiku-title": "Separator"
    },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Layer-1-Shift-04-8f3e6808f688acef",
          "haiku-title": "shift-04",
          "haiku-source": "designs/shift.ai.contents/artboards/shift-04.svg",
          id: "Layer_1"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Group-5fe74a7c710c0d19" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "Rect-6dfa744f105b7df0" },
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
};
