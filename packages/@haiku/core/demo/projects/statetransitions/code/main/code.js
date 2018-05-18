var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    uuid: "HAIKU_SHARE_UUID",
    type: "haiku",
    name: "Move",
    relpath: "code/main/code.js",
    version: "0.0.0",
    organization: "jonaias",
    project: "Move",
    branch: "master",
    player: "3.2.20",
    folder: "/home/jonaias/.haiku/projects/jonaias/Move",
    core: "3.2.23",
    username: "jonas.jonaias@gmail.com",
    title: "Main"
  },
  options: {},
  states: {
    opacityState: { type: "number", value: 0.5, edited: true },
    position1: { type: "number", value: 0, edited: true },
    position2: { type: "number", value: 0, edited: true }
  },
  eventHandlers: {
    "haiku:1dfa2abb91b4": {
      click: {
        handler: function(target, event) {
          this.setState(
            { opacityState: 1, position1: 300 },
            { duration: 3000, curve: "easeInBounce" }
          );

          this.setState(
            { position2: 300 },
            { duration: 3000, curve: "linear" }
          );
        }
      }
    },
    "haiku:1dfa2abb91b4-acbea1": {},
    "haiku:91083482b04d": {
      "timeline:Default:18": {
        handler: function(target, event) {
          this.getDefaultTimeline().pause();
        }
      }
    },
    "haiku:1dfa2abb91b4-288f34": {
      click: {
        handler: function(target, event) {
          this.setState(
            { opacityState: 0.5, position1: 0 },
            { duration: 3000, curve: "easeInBounce" }
          );
          this.setState({ position2: 0 }, { duration: 3000, curve: "linear" });
        }
      }
    },
    "haiku:1dfa2abb91b4-acbea1-d3c284": {}
  },
  timelines: {
    Default: {
      "haiku:91083482b04d": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "hidden" } },
        "style.overflowY": { "0": { value: "hidden" } },
        "sizeAbsolute.x": { "0": { value: 550 } },
        "sizeAbsolute.y": { "0": { value: 400, edited: true } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        opacity: { "0": { value: 1, edited: true } },
        "style.transformStyle": { "0": { value: 1, edited: true } },
        "style.perspective": { "0": { value: 1, edited: true } },
        "style.backgroundColor": { "0": { value: "gray", edited: true } }
      },
      "haiku:1dfa2abb91b4": {
        viewBox: { "0": { value: "0 0 14 14" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 14 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 14 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 348, edited: true },
          "333": { value: 192.88, edited: true }
        },
        "translation.y": {
          "0": { value: 190, edited: true },
          "333": { value: 130.413, edited: true }
        },
        "style.zIndex": { "0": { value: 3 } },
        opacity: {
          "0": {
            value: Haiku.inject(
              function(opacityState) {
                return opacityState;
              },
              "opacityState"
            ),
            edited: true
          }
        }
      },
      "haiku:c991cf5a0eb2": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:3a151b485792": {
        "stroke-width": { "0": { value: "2.5" } },
        stroke: { "0": { value: "#FFD300" } },
        "translation.x": { "0": { value: -153 } },
        "translation.y": { "0": { value: -279 } }
      },
      "haiku:8bfa3e9b1b5a": {
        cx: { "0": { value: "160" } },
        cy: { "0": { value: "286" } },
        r: { "0": { value: "5.75" } }
      },
      "haiku:1dfa2abb91b4-acbea1": {
        viewBox: { "0": { value: "0 0 14 14" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 14 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 14 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function(position1) {
                return position1;
              },
              "position1"
            ),
            edited: true
          }
        },
        "translation.y": { "0": { value: 342, edited: true } },
        "style.zIndex": { "0": { value: 1, edited: true } },
        opacity: {
          "0": {
            value: Haiku.inject(
              function(opacityState) {
                return opacityState;
              },
              "opacityState"
            ),
            edited: true
          }
        },
        "translation.z": { "0": { value: 0, edited: true } }
      },
      "haiku:c991cf5a0eb2-acbea1": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:3a151b485792-acbea1": {
        "stroke-width": { "0": { value: "2.5" } },
        stroke: { "0": { value: "#00FF00" } },
        "translation.x": { "0": { value: -153 } },
        "translation.y": { "0": { value: -279 } }
      },
      "haiku:8bfa3e9b1b5a-acbea1": {
        cx: { "0": { value: "160" } },
        cy: { "0": { value: "286" } },
        r: { "0": { value: "5.75" } }
      },
      "haiku:1dfa2abb91b4-288f34": {
        viewBox: { "0": { value: "0 0 14 14" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 14 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 14 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 207, edited: true },
          "333": { value: 192.88 }
        },
        "translation.y": {
          "0": { value: 191, edited: true },
          "333": { value: 130.413 }
        },
        "style.zIndex": { "0": { value: 2 } },
        opacity: {
          "0": {
            value: Haiku.inject(
              function(opacityState) {
                return opacityState;
              },
              "opacityState"
            )
          }
        }
      },
      "haiku:c991cf5a0eb2-288f34": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:3a151b485792-288f34": {
        "stroke-width": { "0": { value: "2.5" } },
        stroke: { "0": { value: "#FFD300" } },
        "translation.x": { "0": { value: -153 } },
        "translation.y": { "0": { value: -279 } }
      },
      "haiku:8bfa3e9b1b5a-288f34": {
        cx: { "0": { value: "160" } },
        cy: { "0": { value: "286" } },
        r: { "0": { value: "5.75" } }
      },
      "haiku:1dfa2abb91b4-acbea1-d3c284": {
        viewBox: { "0": { value: "0 0 14 14" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 14 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 14 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function(position2) {
                return position2;
              },
              "position2"
            ),
            edited: true
          }
        },
        "translation.y": { "0": { value: 300 }, "333": { value: 131.413 } },
        "style.zIndex": { "0": { value: 1 } },
        opacity: {
          "0": {
            value: Haiku.inject(
              function(opacityState) {
                return opacityState;
              },
              "opacityState"
            )
          }
        },
        "translation.z": { "0": { value: 0 } }
      },
      "haiku:c991cf5a0eb2-acbea1-d3c284": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:3a151b485792-acbea1-d3c284": {
        "stroke-width": { "0": { value: "2.5" } },
        stroke: { "0": { value: "#00FF00" } },
        "translation.x": { "0": { value: -153 } },
        "translation.y": { "0": { value: -279 } }
      },
      "haiku:8bfa3e9b1b5a-acbea1-d3c284": {
        cx: { "0": { value: "160" } },
        cy: { "0": { value: "286" } },
        r: { "0": { value: "5.75" } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "91083482b04d", "haiku-title": "Main" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "1dfa2abb91b4-acbea1-d3c284",
          "haiku-title": "ring yellow",
          "haiku-source": "designs/MoveCopy.sketch.contents/slices/ring yellow.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "95845db38809-acbea1-d3c284" },
            children: ["ring yellow"]
          },
          {
            elementName: "desc",
            attributes: { "haiku-id": "4ee44eea0439-acbea1-d3c284" },
            children: ["Created with sketchtool."]
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "3e658a0d7210-acbea1-d3c284" },
            children: []
          },
          {
            elementName: "g",
            attributes: {
              "haiku-id": "c991cf5a0eb2-acbea1-d3c284",
              id: "Page-1-acbea1-d3c284"
            },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "3a151b485792-acbea1-d3c284",
                  id: "Artboard-acbea1-d3c284"
                },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "8bfa3e9b1b5a-acbea1-d3c284",
                      id: "ring-yellow-acbea1-d3c284"
                    },
                    children: []
                  }
                ]
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
          "haiku-id": "1dfa2abb91b4-288f34",
          "haiku-title": "ring yellow",
          "haiku-source": "designs/MoveCopy.sketch.contents/slices/ring yellow.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "95845db38809-288f34" },
            children: ["ring yellow"]
          },
          {
            elementName: "desc",
            attributes: { "haiku-id": "4ee44eea0439-288f34" },
            children: ["Created with sketchtool."]
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "3e658a0d7210-288f34" },
            children: []
          },
          {
            elementName: "g",
            attributes: {
              "haiku-id": "c991cf5a0eb2-288f34",
              id: "Page-1-288f34"
            },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "3a151b485792-288f34",
                  id: "Artboard-288f34"
                },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "8bfa3e9b1b5a-288f34",
                      id: "ring-yellow-288f34"
                    },
                    children: []
                  }
                ]
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
          "haiku-id": "1dfa2abb91b4-acbea1",
          "haiku-title": "ring yellow",
          "haiku-source": "designs/MoveCopy.sketch.contents/slices/ring yellow.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "95845db38809-acbea1" },
            children: ["ring yellow"]
          },
          {
            elementName: "desc",
            attributes: { "haiku-id": "4ee44eea0439-acbea1" },
            children: ["Created with sketchtool."]
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "3e658a0d7210-acbea1" },
            children: []
          },
          {
            elementName: "g",
            attributes: {
              "haiku-id": "c991cf5a0eb2-acbea1",
              id: "Page-1-acbea1"
            },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "3a151b485792-acbea1",
                  id: "Artboard-acbea1"
                },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "8bfa3e9b1b5a-acbea1",
                      id: "ring-yellow-acbea1"
                    },
                    children: []
                  }
                ]
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
          "haiku-id": "1dfa2abb91b4",
          "haiku-title": "ring yellow",
          "haiku-source": "designs/MoveCopy.sketch.contents/slices/ring yellow.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "95845db38809" },
            children: ["ring yellow"]
          },
          {
            elementName: "desc",
            attributes: { "haiku-id": "4ee44eea0439" },
            children: ["Created with sketchtool."]
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "3e658a0d7210" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "c991cf5a0eb2", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "3a151b485792", id: "Artboard" },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "8bfa3e9b1b5a",
                      id: "ring-yellow"
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
