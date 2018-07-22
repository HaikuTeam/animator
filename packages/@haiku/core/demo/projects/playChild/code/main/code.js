var Haiku = require("@haiku/core");
var _code_child_code = require("./../child/code.js");
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
    title: "Main",
    type: "haiku",
    relpath: "code/main/code.js"
  },
  options: {},
  states: {
    playIt: { type: "boolean", value: false, edited: true },
    newState: { type: "string", value: "yolo", edited: true }
  },
  eventHandlers: {
    "haiku:93e07345b919": {
      click: {
        handler: function(target, event) {
          console.log('main got click');
          this.setState({ playIt: true });
        }
      }
    },
    "haiku:50d8c95df59f": {
      reverter: {
        handler: function(target, event) {
          this.setState({ playIt: false });
          console.log("heard 'reverter' event");
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:03757d2ca102": {
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
        "sizeMode.z": { "0": { value: 1 } },
        opacity: {
          "0": { value: 1, edited: true },
          "33": { value: 1, edited: true },
          "83": { value: 1, edited: true },
          "150": { value: 1, edited: true }
        }
      },
      "haiku:93e07345b919": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 181 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 181 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 105.5, edited: true } },
        "translation.y": { "0": { value: 296, edited: true } },
        "style.zIndex": { "0": { value: 1 } }
      },
      "haiku:1a3dd42c0847": {
        x1: { "0": { value: "26.3611693%" } },
        y1: { "0": { value: "90.8138863%" } },
        x2: { "0": { value: "88.1805141%" } },
        y2: { "0": { value: "27.7931468%" } }
      },
      "haiku:ca618f5c3896": {
        "stop-color": { "0": { value: "#9323AE" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:bc2ea61c4748": {
        "stop-color": { "0": { value: "#C86DD7" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:a2ae8e51e11e": {
        cx: { "0": { value: "57.5" } },
        cy: { "0": { value: "57.5" } },
        r: { "0": { value: "57.5" } }
      },
      "haiku:6276139c8467": {
        x: { "0": { value: "-49.6%" } },
        y: { "0": { value: "-39.1%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 1.9909999999999999 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 1.9909999999999999 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:fe9d809d861b": {
        dx: { "0": { value: "0" } },
        dy: { "0": { value: "12" } },
        in: { "0": { value: "SourceAlpha" } },
        result: { "0": { value: "shadowOffsetOuter1" } }
      },
      "haiku:c8895914a6ef": {
        stdDeviation: { "0": { value: "17" } },
        in: { "0": { value: "shadowOffsetOuter1" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:23200ba6dd1a": {
        values: {
          "0": { value: "0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" }
        },
        in: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:027e3d841045": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:67b44a091288": {
        "translation.x": { "0": { value: 33 } },
        "translation.y": { "0": { value: 21 } }
      },
      "haiku:26edfb08e45a": {
        fill: { "0": { value: "black" } },
        "fill-opacity": { "0": { value: "1" } },
        filter: { "0": { value: "url(#filter-3-ba41b8)" } }
      },
      "haiku:0a6d72850bf2": {
        fill: { "0": { value: "url(#linearGradient-1-ba41b8)" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:53510285cba0": {
        fill: { "0": { value: "#FFFFFF" } },
        points: {
          "0": {
            value: "65.5845591 30.1675582 74.4802551 81.8324418 22.8153714 72.9367459"
          }
        },
        "translation.x": { "0": { value: -25.349 } },
        "translation.y": { "0": { value: 50.801 } },
        "rotation.z": { "0": { value: 5.498 } }
      },
      "haiku:50d8c95df59f": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: true } },
        "sizeAbsolute.y": { "0": { value: true } },
        "translation.x": { "0": { value: 384.5 } },
        "translation.y": { "0": { value: 209 } },
        "sizeMode.z": { "0": { value: 1 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "style.zIndex": { "0": { value: 2 } },
        playback: {
          "0": {
            value: Haiku.inject(
              function(playIt) {
                return playIt ? "loop" : "stop";
              },
              "playIt"
            ),
            edited: true
          }
        }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "03757d2ca102", "haiku-title": "Main" },
    children: [
      {
        elementName: _code_child_code,
        attributes: {
          "haiku-id": "50d8c95df59f",
          "haiku-var": "_code_child_code",
          "haiku-title": "Child",
          "haiku-source": "./code/child/code.js"
        },
        children: []
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "93e07345b919",
          "haiku-title": "play",
          "haiku-source": "designs/playChild.sketch.contents/slices/play.svg"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "0755d4ebdbd9" },
            children: [
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "1a3dd42c0847",
                  id: "linearGradient-1-ba41b8"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "ca618f5c3896" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "bc2ea61c4748" },
                    children: []
                  }
                ]
              },
              {
                elementName: "circle",
                attributes: { "haiku-id": "a2ae8e51e11e", id: "path-2-ba41b8" },
                children: []
              },
              {
                elementName: "filter",
                attributes: {
                  "haiku-id": "6276139c8467",
                  id: "filter-3-ba41b8"
                },
                children: [
                  {
                    elementName: "feOffset",
                    attributes: { "haiku-id": "fe9d809d861b" },
                    children: []
                  },
                  {
                    elementName: "feGaussianBlur",
                    attributes: { "haiku-id": "c8895914a6ef" },
                    children: []
                  },
                  {
                    elementName: "feColorMatrix",
                    attributes: { "haiku-id": "23200ba6dd1a", type: "matrix" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "027e3d841045", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "67b44a091288", id: "play" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "b784c7c985fb",
                      id: "blue-circle"
                    },
                    children: [
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-2-ba41b8",
                          "haiku-id": "26edfb08e45a"
                        },
                        children: []
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-2-ba41b8",
                          "haiku-id": "0a6d72850bf2"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "polygon",
                    attributes: { "haiku-id": "53510285cba0", id: "Rectangle" },
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
