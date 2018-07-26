var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    folder: "/Users/taylorpoe/.haiku/projects/taylor/recorder",
    uuid: "ad1f917c-299e-4286-b85f-897d5a77e399",
    core: "3.5.1",
    username: "taylor",
    organization: "taylor",
    project: "recorder",
    branch: "master",
    version: "0.0.0",
    title: "Main",
    type: "haiku",
    relpath: "code/main/code.js"
  },
  options: {},
  states: { bgColor: { type: "string", value: "#0D0A34", edited: true } },
  eventHandlers: {
    "haiku:03757d2ca102": {
      click: {
        handler: function(target, event) {
          console.log('click')
          this.pause();
        }
      }
    },
    "haiku:6e8f4d1ecd47": {
      mouseenter: {
        handler: function(target, event) {
          console.log('mouseenter')
          this.pause();
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:03757d2ca102": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.transformStyle": { "0": { value: "flat" } },
        "style.perspective": { "0": { value: "1000px", edited: true } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "hidden" } },
        "style.overflowY": { "0": { value: "hidden" } },
        "sizeAbsolute.x": { "0": { value: 300, edited: true } },
        "sizeAbsolute.y": { "0": { value: 300, edited: true } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "style.backgroundColor": {
          "0": {
            value: Haiku.inject(
              function(bgColor) {
                return bgColor;
              },
              "bgColor"
            ),
            edited: true
          }
        }
      },
      "haiku:6e8f4d1ecd47": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 75 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 75 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 150, edited: true } },
        "translation.y": { "0": { value: 150, edited: true } },
        "style.zIndex": { "0": { value: 2 } },
        opacity: {
          "0": { value: 1, edited: true, curve: "linear" },
          "417": { value: 0, edited: true }
        },
        "translation.z": { "0": { value: 0, edited: true } }
      },
      "haiku:368d7f45ab6f": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:6be2c58d9e76": {
        "translation.x": { "0": { value: -63 } },
        "translation.y": { "0": { value: -64 } }
      },
      "haiku:3b4417d0ddc2": {
        fill: { "0": { value: "transparent", edited: true } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 200 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 200 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:74ac25f8fa36": {
        fill: { "0": { value: "#FFFFFF" } },
        fillRule: { "0": { value: "nonzero" } },
        cx: { "0": { value: "100.5" } },
        cy: { "0": { value: "101.5" } },
        r: { "0": { value: "37.5" } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "03757d2ca102", "haiku-title": "Main" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "6e8f4d1ecd47",
          "haiku-title": "o-center",
          "haiku-source": "designs/recorder.sketch.contents/slices/o-center.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "368d7f45ab6f", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "6be2c58d9e76", id: "prerecord" },
                children: [
                  {
                    elementName: "rect",
                    attributes: { "haiku-id": "3b4417d0ddc2" },
                    children: []
                  },
                  {
                    elementName: "circle",
                    attributes: { "haiku-id": "74ac25f8fa36", id: "o-center" },
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