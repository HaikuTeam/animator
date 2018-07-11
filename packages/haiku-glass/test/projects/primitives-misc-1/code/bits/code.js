var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    folder: "/Users/matthew/Code/HaikuTeam/mono/packages/haiku-plumbing/test/fixtures/projects/blank-project/",
    uuid: "HAIKU_SHARE_UUID",
    core: "3.5.1",
    player: "3.5.1",
    username: "matthew+jun25@haiku.ai",
    organization: "matthewjun25",
    project: "UsersMatthewHaikuProjects",
    branch: "master",
    version: "0.0.0",
    title: "Bits",
    type: "haiku",
    relpath: "code/bits/code.js"
  },
  options: {},
  states: {
    width: { type: "number", value: 100, edited: true },
    height: { type: "number", value: 200, edited: true }
  },
  eventHandlers: {},
  timelines: {
    Default: {
      "haiku:cdd967e8a558": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.transformStyle": { "0": { value: "flat" } },
        "style.perspective": { "0": { value: "none" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "visible" } },
        "style.overflowY": { "0": { value: "visible" } },
        "sizeAbsolute.x": {
          "0": {
            value: Haiku.inject(
              function(width) {
                return width;
              },
              "width"
            ),
            edited: true
          }
        },
        "sizeAbsolute.y": {
          "0": {
            value: Haiku.inject(
              function(height) {
                return height;
              },
              "height"
            ),
            edited: true
          }
        },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "style.border": { "0": { value: "2px solid black", edited: true } }
      },
      "haiku:0d5cf3ed0579": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 60 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 51 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 30 } },
        "translation.y": { "0": { value: 25.5, edited: true } },
        "style.zIndex": { "0": { value: 7 } }
      },
      "haiku:b6696f4a039a": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:735ae4d4e53d": {
        stroke: { "0": { value: "#979797" } },
        fill: { "0": { value: "#D8D8D8" } },
        x: { "0": { value: "0.5" } },
        y: { "0": { value: "0.5" } },
        "sizeAbsolute.x": { "0": { value: 59 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 50 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:2c4296837586": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 60 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 51 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function($container) {
                return $container.width;
              },
              "$container"
            ),
            edited: true
          }
        },
        "translation.y": {
          "0": {
            value: Haiku.inject(
              function($container) {
                return $container.height / 2;
              },
              "$container"
            ),
            edited: true
          }
        },
        "style.zIndex": { "0": { value: 8 } }
      },
      "haiku:31aced29d8fd": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:ca0f53f2d9a2": {
        stroke: { "0": { value: "#979797" } },
        fill: { "0": { value: "#D8D8D8" } },
        x: { "0": { value: "0.5" } },
        y: { "0": { value: "0.5" } },
        "sizeAbsolute.x": { "0": { value: 59 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 50 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:51988364606a": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 60 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 51 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function($element, width) {
                return $element.width / 2;
              },
              "$element",
              "width"
            ),
            edited: true
          }
        },
        "translation.y": {
          "0": {
            value: Haiku.inject(
              function($container, height, $element) {
                return $container.height - $element.height / 2;
              },
              "$container",
              "height",
              "$element"
            ),
            edited: true
          }
        },
        "style.zIndex": { "0": { value: 9 } }
      },
      "haiku:f6a51988cd61": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:738fd4f942a2": {
        stroke: { "0": { value: "#979797" } },
        fill: { "0": { value: "#D8D8D8" } },
        x: { "0": { value: "0.5" } },
        y: { "0": { value: "0.5" } },
        "sizeAbsolute.x": { "0": { value: 59 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 50 } },
        "sizeMode.y": { "0": { value: 1 } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "cdd967e8a558", "haiku-title": "Bits" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "51988364606a",
          "haiku-title": "Rectangle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/Rectangle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "f6a51988cd61",
              "haiku-title": "Page-1",
              id: "840fdf87ba91"
            },
            children: [
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "738fd4f942a2",
                  "haiku-title": "Rectangle",
                  id: "d6eed2ca4e29"
                },
                children: []
              }
            ]
          }
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "2c4296837586",
          "haiku-title": "Rectangle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/Rectangle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "31aced29d8fd",
              "haiku-title": "Page-1",
              id: "4501073d0886"
            },
            children: [
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "ca0f53f2d9a2",
                  "haiku-title": "Rectangle",
                  id: "aedeac9a9984"
                },
                children: []
              }
            ]
          }
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "0d5cf3ed0579",
          "haiku-title": "Rectangle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/Rectangle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "b6696f4a039a",
              "haiku-title": "Page-1",
              id: "dedc36b75d62"
            },
            children: [
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "735ae4d4e53d",
                  "haiku-title": "Rectangle",
                  id: "8b9786074521"
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
