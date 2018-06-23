var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    folder: "/Users/taylorpoe/.haiku/projects/taylor/playChild",
    uuid: "6db4f792-41d9-43f5-b45d-ad5252e62247",
    core: "3.4.6",
    player: "3.4.6",
    username: "taylor",
    organization: "taylor",
    project: "playChild",
    branch: "master",
    version: "0.0.0",
    title: "Child",
    type: "haiku",
    relpath: "code/child/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {
    "haiku:a3d8c7fdf7c8": {
      "timeline:Default:41": {
        handler: function(target, event) {
          this.emit("reverter");
        }
      }
    },
    "haiku:fdfcc718294b": {
      click: {
        handler: function(target, event) {
          this.emit("reverter");
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:a3d8c7fdf7c8": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.transformStyle": { "0": { value: "flat" } },
        "style.perspective": { "0": { value: "none" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "visible" } },
        "style.overflowY": { "0": { value: "visible" } },
        "sizeAbsolute.x": { "0": { value: 200 } },
        "sizeAbsolute.y": { "0": { value: 330 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:fdfcc718294b": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 200 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 330 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 100, edited: true, curve: "linear" },
          "817": { value: 100 }
        },
        "translation.y": {
          "0": { value: 292, edited: true, curve: "linear" },
          "817": { value: 166 }
        },
        "style.zIndex": { "0": { value: 2 } },
        "scale.x": {
          "0": { value: 1, edited: true, curve: "linear" },
          "817": { value: 1 }
        },
        "scale.y": {
          "0": { value: 0.235, edited: true, curve: "linear" },
          "817": { value: 0.994 }
        }
      },
      "haiku:cd29a5ee68e3": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "stroke-linecap": { "0": { value: "round" } },
        "stroke-linejoin": { "0": { value: "round" } }
      },
      "haiku:0f9a32a48854": {
        stroke: { "0": { value: "#979797" } },
        "stroke-width": { "0": { value: "31" } },
        points: {
          "0": {
            value: "51.9931588 314.383573 96.2050671 215.233332 144.933365 314.383573 98.4632617 199.4149 98.4632617 146.934014 169.945084 146.934014 98.4632617 134.790684 16.4376631 146.934014 98.4632617 110.708809 51.9931588 90.8057016 51.9931588 27.028308 98.4632617 16.290814 184.036661 27.028308 144.933365 90.8057016 110.678545 120.72678"
          }
        }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "a3d8c7fdf7c8", "haiku-title": "Child" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "fdfcc718294b",
          "haiku-title": "child",
          "haiku-source": "designs/playChild.sketch.contents/slices/child.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "cd29a5ee68e3",
              "haiku-title": "Page-1",
              id: "1acd2598fd2c"
            },
            children: [
              {
                elementName: "polyline",
                attributes: {
                  "haiku-id": "0f9a32a48854",
                  "haiku-title": "child",
                  id: "473fbcaa1940"
                },
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
};
