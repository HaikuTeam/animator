var Haiku = require("@haiku/core");
module.exports = {
  states: {
    myState: { type: "number", value: 18 },
    mouseY: { type: "string", value: "2" },
    mouseX: { type: "number", value: 3 }
  },

  metadata: {
    uuid: "fc9c5e17-a933-4b1a-93c3-213ea0dfad77",
    type: "haiku",
    name: "Pulse3000",
    relpath: "code/main/code.js",
    version: "0.0.52",
    organization: "taylor",
    project: "Pulse3000",
    branch: "master",
    core: "2.1.48"
  },

  options: {},
  properties: [],
  eventHandlers: {},
  timelines: {
    Default: {
      "haiku:93b6533e3ff3": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "hidden" } },
        "style.overflowY": { "0": { value: "hidden" } },
        "sizeAbsolute.x": { "0": { value: 516, edited: true } },
        "sizeAbsolute.y": { "0": { value: 334, edited: true } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        backgroundColor: { "0": { value: "none", edited: true } },
        opacity: { "0": { value: 1 }, "183": { value: 1, edited: true } }
      },
      "haiku:bdeb175c9bd8": {
        viewBox: { "0": { value: "0 0 46 46" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 46 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 46 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function(mouseX) {
                if (mouseX >= 258) {
                  return 516 - mouseX / 10 - 260;
                } else {
                  return -(mouseX / 10 - 258);
                }
              },
              "mouseX"
            ),
            edited: true
          }
        },
        "translation.y": {
          "0": {
            value: Haiku.inject(
              function(mouseY) {
                if (mouseY >= 167) {
                  return 334 - mouseY / 10 - 168;
                } else {
                  return -(mouseY / 10 - 167);
                }
              },
              "mouseY"
            ),
            edited: true
          }
        },
        "style.zIndex": { "0": { value: 14 } },
        opacity: { "0": { value: 1, edited: true } },
        "scale.x": {
          "0": { value: 0.7, edited: true },
          "350": { value: 0.7, edited: true, curve: "easeInOutBack" },
          "1017": { value: 1, edited: true, curve: "linear" },
          "1150": { value: 1.1, edited: true, curve: "easeInOutBack" },
          "1767": { value: 0.7, edited: true }
        },
        "scale.y": {
          "0": { value: 0.7, edited: true },
          "350": { value: 0.7, edited: true, curve: "easeInOutBack" },
          "1017": { value: 1, edited: true, curve: "linear" },
          "1150": { value: 1.1, edited: true, curve: "easeInOutBack" },
          "1767": { value: 0.7, edited: true }
        },
        "rotation.z": {
          "0": { value: 0, edited: true, curve: "linear" },
          "3517": {
            value: Haiku.inject(function() {
              return 3.14 * 2;
            }),
            edited: true
          }
        }
      },
      "haiku:2214c2c6e6ec": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "stroke-linecap": { "0": { value: "round" } },
        "stroke-dasharray": { "0": { value: "8,16" } }
      },
      "haiku:7611d5d3c042": {
        stroke: { "0": { value: "#FFDBBD" } },
        "stroke-width": { "0": { value: "7" } },
        "translation.x": { "0": { value: -236 } },
        "translation.y": { "0": { value: -145 } }
      },
      "haiku:860bbd56cf65": {
        cx: { "0": { value: "258.5" } },
        cy: { "0": { value: "167.5" } },
        r: { "0": { value: "19.5" } }
      },
      "haiku:24f02081c065": {
        viewBox: { "0": { value: "0 0 85 85" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 85 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 85 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function(mouseX) {
                if (mouseX >= 258) {
                  return 516 - mouseX / 20 - 291;
                } else {
                  return -(mouseX / 20 - 258) - 32;
                }
              },
              "mouseX"
            ),
            edited: true
          }
        },
        "translation.y": {
          "0": {
            value: Haiku.inject(
              function(mouseY) {
                if (mouseY >= 167) {
                  return 334 - mouseY / 20 - 198;
                } else {
                  return -(mouseY / 20 - 167) - 30;
                }
              },
              "mouseY"
            ),
            edited: true
          }
        },
        "style.zIndex": { "0": { value: 15 } },
        opacity: { "0": { value: 1, edited: true } },
        "scale.x": {
          "0": { value: 0.7, edited: true },
          "267": { value: 0.7, edited: true, curve: "easeInOutBack" },
          "950": { value: 1, edited: true, curve: "linear" },
          "1283": { value: 1.1, edited: true, curve: "easeInOutBack" },
          "1883": { value: 0.7, edited: true }
        },
        "scale.y": {
          "0": { value: 0.7, edited: true },
          "267": { value: 0.7, edited: true, curve: "easeInOutBack" },
          "950": { value: 1, edited: true, curve: "linear" },
          "1283": { value: 1.1, edited: true, curve: "easeInOutBack" },
          "1883": { value: 0.7, edited: true }
        },
        "rotation.z": {
          "0": { value: 0, edited: true, curve: "linear" },
          "3517": {
            value: Haiku.inject(function() {
              return 3.14 * 2;
            }),
            edited: true
          }
        }
      },
      "haiku:3d8533b8ca1d": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "stroke-linecap": { "0": { value: "round" } },
        "stroke-dasharray": { "0": { value: "1,30" } }
      },
      "haiku:9efcbb977a89": {
        stroke: { "0": { value: "#FFFFFF" } },
        "stroke-width": { "0": { value: "7" } },
        "translation.x": { "0": { value: -216 } },
        "translation.y": { "0": { value: -125 } }
      },
      "haiku:f815bef25250": {
        cx: { "0": { value: "258.5" } },
        cy: { "0": { value: "167.5" } },
        r: { "0": { value: "38.5" } }
      },
      "haiku:25bbb3d91227": {
        viewBox: { "0": { value: "0 0 130 130" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 130 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 130 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function(mouseX) {
                return mouseX / 40 + 186;
              },
              "mouseX"
            ),
            edited: true
          }
        },
        "translation.y": {
          "0": {
            value: Haiku.inject(
              function(mouseY) {
                if (mouseY >= 167) {
                  return -(334 - mouseY / 40) + 434;
                } else {
                  return mouseY / 40 - 167 + 267;
                }
              },
              "mouseY"
            ),
            edited: true
          }
        },
        "style.zIndex": { "0": { value: 17 } },
        opacity: { "0": { value: 1, edited: true } },
        "scale.x": {
          "0": { value: 0.7, edited: true },
          "183": { value: 0.7, edited: true, curve: "easeInOutBack" },
          "867": { value: 1, edited: true, curve: "linear" },
          "1367": { value: 1.1, edited: true, curve: "easeInOutBack" },
          "2000": { value: 0.7, edited: true }
        },
        "scale.y": {
          "0": { value: 0.7, edited: true },
          "183": { value: 0.7, edited: true, curve: "easeInOutBack" },
          "867": { value: 1, edited: true, curve: "linear" },
          "1367": { value: 1.1, edited: true, curve: "easeInOutBack" },
          "2000": { value: 0.7, edited: true }
        },
        "rotation.z": {
          "0": { value: 0, edited: true, curve: "linear" },
          "3517": {
            value: Haiku.inject(function() {
              return 3.14;
            }),
            edited: true
          }
        }
      },
      "haiku:60ec15be306c": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "stroke-linecap": { "0": { value: "round" } },
        "stroke-dasharray": { "0": { value: "32" } }
      },
      "haiku:61853b5e7ec2": {
        stroke: { "0": { value: "#FF6EA8" } },
        "stroke-width": { "0": { value: "7" } },
        "translation.x": { "0": { value: -193 } },
        "translation.y": { "0": { value: -102 } }
      },
      "haiku:5693a3c3a484": {
        cx: { "0": { value: "258" } },
        cy: { "0": { value: "167" } },
        r: { "0": { value: "61" } }
      },
      "haiku:500eaa801e21": {
        viewBox: { "0": { value: "0 0 179 180" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 179 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 180 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function(mouseX) {
                return mouseX / 20 + 155;
              },
              "mouseX"
            ),
            edited: true
          }
        },
        "translation.y": {
          "0": {
            value: Haiku.inject(
              function(mouseY) {
                return mouseY / 20 + 70;
              },
              "mouseY"
            ),
            edited: true
          }
        },
        "style.zIndex": { "0": { value: 18 } },
        opacity: { "0": { value: 1, edited: true } },
        "scale.x": {
          "0": { value: 0.7, edited: true },
          "100": { value: 0.7, edited: true, curve: "easeInOutBack" },
          "783": { value: 1, edited: true, curve: "linear" },
          "1483": { value: 1.1, edited: true, curve: "easeInOutBack" },
          "2117": { value: 0.7, edited: true }
        },
        "scale.y": {
          "0": { value: 0.7, edited: true },
          "100": { value: 0.7, edited: true, curve: "easeInOutBack" },
          "783": { value: 1, edited: true, curve: "linear" },
          "1483": { value: 1.1, edited: true, curve: "easeInOutBack" },
          "2117": { value: 0.7, edited: true }
        },
        "rotation.z": {
          "0": { value: 0, edited: true, curve: "linear" },
          "3517": { value: 2.96, edited: true }
        }
      },
      "haiku:81ff7ee04c23": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "stroke-linecap": { "0": { value: "round" } },
        "stroke-dasharray": { "0": { value: "9,23" } }
      },
      "haiku:fc682550cec3": {
        stroke: { "0": { value: "#FFFFFF" } },
        "stroke-width": { "0": { value: "7" } },
        "translation.x": { "0": { value: -169 } },
        "translation.y": { "0": { value: -77 } }
      },
      "haiku:1155275b7f3c": {
        cx: { "0": { value: "258" } },
        cy: { "0": { value: "167" } },
        r: { "0": { value: "86" } }
      },
      "haiku:ac37be39aa99": {
        viewBox: { "0": { value: "0 0 230 230" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 230 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 230 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function(mouseX) {
                return mouseX / 10 + 116;
              },
              "mouseX"
            ),
            edited: true
          }
        },
        "translation.y": {
          "0": {
            value: Haiku.inject(
              function(mouseY) {
                return mouseY / 10 + 37;
              },
              "mouseY"
            ),
            edited: true
          }
        },
        "style.zIndex": { "0": { value: 19 } },
        opacity: { "0": { value: 1, edited: true } },
        "rotation.z": {
          "0": { value: 0, edited: true, curve: "linear" },
          "3517": {
            value: Haiku.inject(function() {
              return 3.14;
            }),
            edited: true
          }
        },
        "scale.x": {
          "0": { value: 0.7, edited: true },
          "17": { value: 0.7, edited: true, curve: "easeInOutBack" },
          "683": { value: 1, edited: true, curve: "linear" },
          "1583": { value: 1.1, edited: true, curve: "easeInOutBack" },
          "2233": { value: 0.7, edited: true }
        },
        "scale.y": {
          "0": { value: 0.7, edited: true },
          "17": { value: 0.7, edited: true, curve: "easeInOutBack" },
          "683": { value: 1, edited: true, curve: "linear" },
          "1583": { value: 1.1, edited: true, curve: "easeInOutBack" },
          "2233": { value: 0.7, edited: true }
        }
      },
      "haiku:9ec421c81231": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "stroke-linecap": { "0": { value: "round" } },
        "stroke-dasharray": { "0": { value: "25" } }
      },
      "haiku:03aa862ef817": {
        stroke: { "0": { value: "#5DE2F9" } },
        "stroke-width": { "0": { value: "7" } },
        "translation.x": { "0": { value: -143 } },
        "translation.y": { "0": { value: -52 } }
      },
      "haiku:07e1e8eaee96": {
        cx: { "0": { value: "258" } },
        cy: { "0": { value: "167" } },
        r: { "0": { value: "111" } }
      }
    }
  },

  template: {
    elementName: "div",
    attributes: { "haiku-title": "Pulse3000", "haiku-id": "93b6533e3ff3" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          source: "designs/wild-loader.sketch.contents/slices/Oval green.svg",
          "haiku-id": "bdeb175c9bd8",
          "haiku-title": "Oval green"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "cb5e11d5d96c" },
            children: ["Oval green"]
          },
          {
            elementName: "desc",
            attributes: { "haiku-id": "f1ae48f431ba" },
            children: ["Created with sketchtool."]
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "72fc77a97331" },
            children: []
          },
          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "2214c2c6e6ec" },
            children: [
              {
                elementName: "g",
                attributes: { id: "Artboard-Copy", "haiku-id": "7611d5d3c042" },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      id: "Oval-green",
                      "haiku-id": "860bbd56cf65"
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
          source: "designs/wild-loader.sketch.contents/slices/Oval blue.svg",
          "haiku-id": "24f02081c065",
          "haiku-title": "Oval blue"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "eec51e6921f9" },
            children: ["Oval blue"]
          },
          {
            elementName: "desc",
            attributes: { "haiku-id": "526eeb641369" },
            children: ["Created with sketchtool."]
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "7173b541f772" },
            children: []
          },
          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "3d8533b8ca1d" },
            children: [
              {
                elementName: "g",
                attributes: { id: "Artboard-Copy", "haiku-id": "9efcbb977a89" },
                children: [
                  {
                    elementName: "circle",
                    attributes: { id: "Oval-blue", "haiku-id": "f815bef25250" },
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
          source: "designs/wild-loader.sketch.contents/slices/Oval red.svg",
          "haiku-id": "25bbb3d91227",
          "haiku-title": "Oval red"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "ed42fe013e4b" },
            children: ["Oval red"]
          },
          {
            elementName: "desc",
            attributes: { "haiku-id": "643bbe914ad3" },
            children: ["Created with sketchtool."]
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "b69b6570effc" },
            children: []
          },
          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "60ec15be306c" },
            children: [
              {
                elementName: "g",
                attributes: { id: "Artboard-Copy", "haiku-id": "61853b5e7ec2" },
                children: [
                  {
                    elementName: "circle",
                    attributes: { id: "Oval-red", "haiku-id": "5693a3c3a484" },
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
          source: "designs/wild-loader.sketch.contents/slices/Oval white.svg",
          "haiku-title": "Oval white",
          "haiku-id": "500eaa801e21"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "22026b6b9986" },
            children: ["Oval white"]
          },
          {
            elementName: "desc",
            attributes: { "haiku-id": "a96486c3c70a" },
            children: ["Created with sketchtool."]
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "badba261c1c3" },
            children: []
          },
          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "81ff7ee04c23" },
            children: [
              {
                elementName: "g",
                attributes: { id: "Artboard-Copy", "haiku-id": "fc682550cec3" },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      id: "Oval-white",
                      "haiku-id": "1155275b7f3c"
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
          source: "designs/wild-loader.sketch.contents/slices/Oval purple.svg",
          "haiku-id": "ac37be39aa99",
          "haiku-title": "Oval purple"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "cc842e29b1e5" },
            children: ["Oval purple"]
          },
          {
            elementName: "desc",
            attributes: { "haiku-id": "e9eea6fc510e" },
            children: ["Created with sketchtool."]
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "392b91baeb33" },
            children: []
          },
          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "9ec421c81231" },
            children: [
              {
                elementName: "g",
                attributes: { id: "Artboard-Copy", "haiku-id": "03aa862ef817" },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      id: "Oval-purple",
                      "haiku-id": "07e1e8eaee96"
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
