var Haiku = require("@haiku/core");
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
    title: "Asdf",
    type: "haiku",
    relpath: "code/asdf/code.js"
  },
  options: {},
  states: {
    color: { type: "string", value: "blue", edited: true },
    frame: { type: "number", value: 0, edited: true }
  },
  eventHandlers: {
    "haiku:Asdf-0ae0430248b19159": {
      "timeline:Default:0": {
        handler: function(component, element, target, event) {
          this.pause();
        }
      },
      "component:will-mount": {
        handler: function(component, element, target, event) {
          console.log(this.evaluate("$index"), "will-mount", this.state.frame);
          this.gotoAndStop(this.state.frame);
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:Asdf-0ae0430248b19159": {
        "style.WebkitTapHighlightColor": "rgba(0,0,0,0)",
        "style.position": "relative",
        "style.overflowX": "visible",
        "style.overflowY": "visible",
        "sizeAbsolute.x": 115,
        "sizeAbsolute.y": 115,
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeMode.z": 1,
        "style.border": { "0": { value: "1px solid black", edited: true } }
      },
      "haiku:5697cadbf11b": {
        "style.position": "absolute",
        "sizeAbsolute.y": 115,
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 115,
        "style.margin": "0",
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "translation.x": {
          "0": { value: -57.5, edited: true, curve: "linear" },
          "500": { value: 172.5 }
        },
        "translation.y": 57.5,
        "style.zIndex": 1,
        "scale.x": {
          "0": { value: 1, edited: true, curve: "linear" },
          "500": { value: 0.1, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true, curve: "linear" },
          "500": { value: 0.1, edited: true }
        }
      },
      "haiku:ab97c9047c29": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:15f1ab54f95e": { "translation.x": -189, "translation.y": -622 },
      "haiku:78016b462414": {
        fill: {
          "0": {
            value: Haiku.inject(function(color) {
              return color;
            }, "color"),
            edited: true
          }
        },
        cx: 246.5,
        cy: 679.5,
        r: 57.5
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "Asdf-0ae0430248b19159", "haiku-title": "Asdf" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "5697cadbf11b",
          "haiku-title": "blue-circle",
          "haiku-source":
            "designs/Aug30426.sketch.contents/slices/blue-circle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "ab97c9047c29",
              "haiku-title": "Page-1",
              id: "f05dcae7e6af"
            },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "15f1ab54f95e",
                  "haiku-title": "Tutorial",
                  id: "2bfc1a9c4224"
                },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "78016b462414",
                      "haiku-title": "blue-circle",
                      id: "1f70f75561ef"
                    },
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
