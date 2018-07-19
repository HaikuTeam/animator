var Haiku = require("@haiku/core");
var bubtonkillingsworth = require("../bubtonkillingsworth/code.js");
module.exports = {
  metadata: {
    relpath: "code/main/code.js"
  },

  states: {
    hello: {
      value: 123
    },

    goodbye: {
      value: true
    },

    edgar: {
      value: "abc"
    }
  },

  eventHandlers: {},
  timelines: {
    Default: {
      "haiku:bubtonkillingsworth": {
        opacity: {
          "0": {
            value: 0
          }
        },

        bazzzleDeeBoopla: {
          "0": {
            value: [{ x: 0.5, y: 0.5, moveTo: true }, { x: 71.5, y: 58.5 }]
          },

          "100": {
            value: [{ x: 0.5, y: 0.5, moveTo: true }, { x: 71.5, y: 58.5 }]
          }
        },

        playback: { "0": { value: "loop" } },
      },

      "haiku:bubtonkillingsworth2": {
        "controlFlow.repeat": {
          "0": {
            value: 2
          }
        },

        opacity: {
          "0": {
            value: 0
          }
        },

        bazzzleDeeBoopla: {
          "0": {
            value: [{ x: 0.5, y: 0.5, moveTo: true }, { x: 71.5, y: 58.5 }]
          },

          "100": {
            value: [{ x: 0.5, y: 0.5, moveTo: true }, { x: 71.5, y: 58.5 }]
          }
        },

        playback: { "0": { value: "loop" } },
      },

      "haiku:f203a65f49c0": {
        shown: {
          "0": { value: false, curve: "linear" },
          "80": { value: true, curve: "linear" },
          "160": { value: false },
          "240": { value: false },
          "320": { value: true, curve: "linear" },
          "400": { value: true },
          "450": { value: true }
        },

        opacity: {
          "0": { value: 0 },
          "183": { value: 0.5, curve: "easeInOutBounce" },
          "250": { value: 1 },
          "217": { value: 0.0, curve: "linear" },
          "300": { value: 0.5, curve: "linear" },
          "350": { value: 1.0 },
          "1750": { value: 0 },
          "5000": { value: 1.0 }
        },

        "sizeAbsolute.x": {
          "0": { value: 550 },
          "150": { value: 100 },
          "200": { value: 600 }
        },

        "sizeAbsolute.y": {
          "0": { value: 400 },
          "100": { value: 100 },
          "300": { value: 500, curve: "linear" },
          "850": { value: 515 }
        },

        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 50, curve: "linear" },
          "1000": { value: 55, curve: "linear" },
          "2000": { value: 56, curve: "linear" },
          "3000": { value: 100 }
        },

        "translation.y": { "0": { value: 55 }, "3000": { value: 300 } },
        "style.outline": { "0": { value: "1px solid gray" } },
        "scale.x": {
          "0": {
            value: 0
          },

          "10": { value: 0 },
          "20": { value: 0 },
          "166": { value: 0 },
          "200": {
            value: [{ x: 0.5, y: 0.5, moveTo: true }, { x: 71.5, y: 58.5 }]
          },

          "300": { value: 0 },
          "400": { value: 0 },
          "500": { value: 0 },
          "600": { value: 0 },
          "700": { value: 0 },
          "800": { value: 0 }
        },

        backgroundColor: {
          "0": {
            value: Haiku.inject(function() {
              return Date.now() % 2 === 0 ? "#eee" : "#fff";
            })
          },

          "50": { value: "#fff", curve: "linear" },
          "100": { value: "#fff" },
          "160": { value: "#eee" },
          "500": { value: "#fff" },
          "1250": { value: "#cdcdcd" }
        }
      },

      "haiku:e5e416e36283": {
        pathInstructions: {
          "0": {
            value: [{ x: 0.5, y: 0.5, moveTo: true }, { x: 71.5, y: 58.5 }]
          }
        },

        "translation.x": { "0": { value: -5.5, edited: true } },
        "translation.y": { "0": { value: 67.5, edited: true } },
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 172 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "style.border": { "0": { value: "0" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.position": { "0": { value: "absolute" } },
        viewBox: { "0": { value: "0 0 172 172" } },
        "scale.y": {
          "0": {
            value: 1.4844644736875778,
            edited: true,
            curve: "easeInOutBounce"
          },

          "100": { value: 2 },
          "200": { value: 3, curve: "linear" },
          "300": { value: 4.23423242 }
        },

        "rotation.z": {
          "0": { value: 0.5324304373222316, edited: true },
          "50": { value: 1.2, curve: "linear" },
          "266": { value: 2.1222, curve: "linear" },
          "450": { value: 2.99 }
        }
      },

      "haiku:56b197082bd8": {
        fill: { "0": { value: "none" } },
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:8ead96e5f2d1": { fill: { "0": { value: "#22E1FF", edited: true } } },
      "haiku:32fa8857ae54": {
        stroke: {
          "0": {
            value: "red",
            edited: true
          }
        },
        strokeWidth: {
          "0": {
            value: "5",
            edited: true
          }
        },
        points: {
          "0": {
            value: "86 137.5 33.6871125 165.002512 43.677985 106.751256 1.35597005 65.4974875 59.8435563 56.9987438 86 4 112.156444 56.9987438 170.64403 65.4974875 128.322015 106.751256 138.312887 165.002512"
          }
        }
      },

      "haiku:ff46fa758156": {
        "translation.x": { "0": { value: 241.5, edited: true } },
        "translation.y": { "0": { value: 7.5, edited: true } },
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 172 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "style.border": { "0": { value: "0" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.position": { "0": { value: "absolute" } },
        viewBox: { "0": { value: "0 0 172 172" } },
        "rotation.z": { "0": { value: -0.20396835189761076, edited: true } }
      },

      "haiku:cfe0effd2375": {
        fill: { "0": { value: "none" } },
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:020aed882537": { fill: { "0": { value: "#D485B6" } } },
      "haiku:98f3b0fd36ad": {
        points: { "0": { value: "86 0 172 172 0 172" } }
      },

      "haiku:d96344f002ed": {
        "translation.x": { "0": { value: 167.5, edited: true } },
        "translation.y": { "0": { value: 264.5, edited: true } },
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 172 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "style.border": { "0": { value: "0" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.position": { "0": { value: "absolute" } },
        viewBox: { "0": { value: "0 0 172 172" } },
        "rotation.z": { "0": { value: -0.28953336697793053, edited: true } },
        "style.backgroundColor": {"0": {value:"white",edited:true}}
      },

      "haiku:dbd305a592fe": {
        fill: { "0": { value: "none" } },
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "style.backgroundColor": { "0": { value: "red", edited: true } },
        "style.border": { "0": { value: "1px solid blue", edited: true } }
      },

      "haiku:aa39ef0b00d9": {
        fill: { "0": { value: "#F6A623" } },
        cx: { "0": { value: "86" } },
        cy: { "0": { value: "86.5" } },
        rx: { "0": { value: "86" } },
        ry: { "0": { value: "86.5" } }
      },

      "haiku:cfef9d559b15": {
        "translation.x": {
          "0": { value: 410.5, curve: "linear", edited: true },
          "5000": { value: 123, edited: true }
        },

        "translation.y": { "0": { value: 127.5, edited: true } },
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 172 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "style.border": { "0": { value: "0" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.position": { "0": { value: "absolute" } },
        viewBox: { "0": { value: "0 0 172 172" } },
        "scale.x": { "0": { value: 2.7694331936637946, edited: true } },
        "scale.y": { "0": { value: 1.0848358458966114, edited: true } }
      },

      "haiku:9a67b92383eb": {
        fill: { "0": { value: "none" } },
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:aba43f1ee250": { fill: { "0": { value: "#F8E81C" } } },
      "haiku:42907ffaa556": {
        "mount.x": { "0": { value: 0.5 } },
        "mount.y": { "0": { value: 0.5 } },
        "align.x": { "0": { value: 0.5 } },
        "align.y": { "0": { value: 0.5 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "translation.x": { "0": { value: 0 } },
        "translation.y": { "0": { value: 0 } },
        "rotation.z": { "0": { value: -5.497787143782138 } },
        "sizeAbsolute.x": { "0": { value: 116.689863 } },
        "sizeAbsolute.y": { "0": { value: 116.689863 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },

      "haiku:f4a5c879f6d5": {
        "controlFlow.repeat": {
          "0": {
            value: [{x: 0, y: 0}]
          }
        },
        "translation.x": { "0": { value: 135.5, edited: true } },
        "translation.y": { "0": { value: 100.5, edited: true } },
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 172 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "style.border": { "0": { value: "0" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.position": { "0": { value: "absolute" } },
        viewBox: { "0": { value: "0 0 172 172" } },
        "scale.x": { "0": { value: 1.0909090909090917, edited: true } },
        "scale.y": { "0": { value: 1.1279069767441863, edited: true } }
      },

      "haiku:338ec32c9bc0": {
        fill: { "0": { value: "none" } },
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:0482734fff4e": { fill: { "0": { value: "#2FAC19" } } },
      "haiku:eb5dd3fc2c0b": {
        "mount.x": { "0": { value: 0.5 } },
        "mount.y": { "0": { value: 0.5 } },
        "align.x": { "0": { value: 0.5 } },
        "align.y": { "0": { value: 0.5 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "translation.x": { "0": { value: 0 } },
        "translation.y": { "0": { value: 0 } },
        "rotation.z": { "0": { value: -4.71238898038469 } },
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 176 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },

      "haiku:92a15d09b679": {
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 172 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 172 172" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": { "0": { value: 46.5, edited: true } },
        "translation.y": { "0": { value: 222.5, edited: true } },
        "scale.x": { "0": { value: 0.26136363636363746, edited: true } },
        "scale.y": { "0": { value: 0.27906976744186074, edited: true } }
      },

      "haiku:e65032d2b41b": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:84e4f11d56a5": { fill: { "0": { value: "#2FAC19" } } },
      "haiku:643cc296de5f": {
        "translation.x": { "0": { value: 0 } },
        "translation.y": { "0": { value: 0 } },
        "rotation.z": { "0": { value: -4.71238898038469 } },
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 176 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "align.x": { "0": { value: 0.5 } },
        "align.y": { "0": { value: 0.5 } },
        "mount.x": { "0": { value: 0.5 } },
        "mount.y": { "0": { value: 0.5 } }
      },

      "haiku:751d264dd836": {
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 172 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 172 172" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": { "0": { value: 26.5, edited: true } },
        "translation.y": { "0": { value: 181.5, edited: true } },
        "scale.x": { "0": { value: 0.17045454545454652, edited: true } },
        "scale.y": { "0": { value: 0.18604651162790653, edited: true } }
      },

      "haiku:79d5774770ee": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:65ad56f95a8f": { fill: { "0": { value: "#2FAC19" } } },
      "haiku:ccd04fdcf96b": {
        "translation.x": { "0": { value: 0 } },
        "translation.y": { "0": { value: 0 } },
        "rotation.z": { "0": { value: -4.71238898038469 } },
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 176 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "align.x": { "0": { value: 0.5 } },
        "align.y": { "0": { value: 0.5 } },
        "mount.x": { "0": { value: 0.5 } },
        "mount.y": { "0": { value: 0.5 } }
      },

      "haiku:2f2e55f6a44e": {
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 172 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 172 172" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": { "0": { value: -60.5, edited: true } },
        "translation.y": { "0": { value: -63.5, edited: true } },
        "scale.x": { "0": { value: 0.3023255813953486, edited: true } },
        "scale.y": { "0": { value: 0.2790697674418601, edited: true } }
      },

      "haiku:21bce2629aa2": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:925cb02df2bc": { fill: { "0": { value: "#D485B6" } } },
      "haiku:c8a644434aef": { points: { "0": { value: "86 0 172 172 0 172" } } }
    }
  },

  template: {
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          source: "designs/Primitives.sketch.contents/artboards/Star.svg",
          "haiku-title": "Star",
          "haiku-id": "e5e416e36283"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "239786b58b2b" },
            children: ["Star"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "087bb2967f58" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "7dddaf39cadf" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "56b197082bd8" },
            children: [
              {
                elementName: "g",
                attributes: { id: "Star", "haiku-id": "8ead96e5f2d1" },
                children: [
                  {
                    elementName: "polygon",
                    attributes: { "haiku-id": "32fa8857ae54" },
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },

      {
        elementName: bubtonkillingsworth,
        attributes: {
          "haiku-title": "bubtonkillingsworth",
          "haiku-id": "bubtonkillingsworth"
        },

        children: []
      },

      {
        elementName: bubtonkillingsworth,
        attributes: {
          "haiku-title": "bubtonkillingsworth2",
          "haiku-id": "bubtonkillingsworth2"
        },

        children: []
      },

      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          source: "designs/Primitives.sketch.contents/artboards/Triangle.svg",
          "haiku-title": "TriangleAsdfMakeArtificiallyLonger",
          "haiku-id": "ff46fa758156"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "bb3d06f70c1a" },
            children: ["Triangle"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "73deface3a4f" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "8300259b3274" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "cfe0effd2375" },
            children: [
              {
                elementName: "g",
                attributes: { id: "Triangle", "haiku-id": "020aed882537" },
                children: [
                  {
                    elementName: "polygon",
                    attributes: { "haiku-id": "98f3b0fd36ad" },
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
          source: "designs/Primitives.sketch.contents/artboards/Circle.svg",
          "haiku-title": "Circle",
          "haiku-id": "d96344f002ed"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "22cb677c6d42" },
            children: ["Circle"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "aece603aaffc" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "aa263d0f8d6f" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "dbd305a592fe" },
            children: [
              {
                elementName: "ellipse",
                attributes: { id: "Oval", "haiku-id": "aa39ef0b00d9" },
                children: []
              },
              {
                elementName: "g",
                attributes: { id: "Circle", "haiku-id": "9861b2ec5e0f" },
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
          source: "designs/Primitives.sketch.contents/artboards/Diamond.svg",
          "haiku-title": "Diamond",
          "haiku-id": "cfef9d559b15"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "1cf9bac2951f" },
            children: ["Diamond"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "065f2db6e053" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "fcddb5efa49a" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "9a67b92383eb" },
            children: [
              {
                elementName: "g",
                attributes: { id: "Diamond", "haiku-id": "aba43f1ee250" },
                children: [
                  {
                    elementName: "rect",
                    attributes: { id: "Rectangle", "haiku-id": "42907ffaa556" },
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
          source: "designs/Primitives.sketch.contents/artboards/Rectangle.svg",
          "haiku-title": "Rectangle",
          "haiku-id": "f4a5c879f6d5"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "60ad5f3e3bc9" },
            children: ["Rectangle"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "cb55fd06d7db" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "8f968580c491" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "338ec32c9bc0" },
            children: [
              {
                elementName: "g",
                attributes: { id: "Rectangle", "haiku-id": "0482734fff4e" },
                children: [
                  {
                    elementName: "rect",
                    attributes: { "haiku-id": "eb5dd3fc2c0b" },
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
          source: "designs/Primitives.sketch.contents/artboards/Rectangle.svg",
          "haiku-title": "Rectangle",
          "haiku-id": "92a15d09b679"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "8db57e9017df" },
            children: ["Rectangle"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "4b8b30181a34" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "2e548b17065e" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "e65032d2b41b" },
            children: [
              {
                elementName: "g",
                attributes: { id: "Rectangle", "haiku-id": "84e4f11d56a5" },
                children: [
                  {
                    elementName: "rect",
                    attributes: { "haiku-id": "643cc296de5f" },
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
          source: "designs/Primitives.sketch.contents/artboards/Rectangle.svg",
          "haiku-title": "Rectangle",
          "haiku-id": "751d264dd836"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "8988dfc50fca" },
            children: ["Rectangle"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "0e6a60cc1112" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "39e4e3c9d024" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "79d5774770ee" },
            children: [
              {
                elementName: "g",
                attributes: { id: "Rectangle", "haiku-id": "65ad56f95a8f" },
                children: [
                  {
                    elementName: "rect",
                    attributes: { "haiku-id": "ccd04fdcf96b" },
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
          source: "designs/Primitives.sketch.contents/artboards/Triangle.svg",
          "haiku-title": "Triangle",
          "haiku-id": "2f2e55f6a44e"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "e47cbeef61d8" },
            children: ["Triangle"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "0f73d3321dfe" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "c1be02c32cc3" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "21bce2629aa2" },
            children: [
              {
                elementName: "g",
                attributes: { id: "Triangle", "haiku-id": "925cb02df2bc" },
                children: [
                  {
                    elementName: "polygon",
                    attributes: { "haiku-id": "c8a644434aef" },
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      }
    ],

    elementName: "div",
    attributes: {
      "haiku-title": "ComplexYayayHeyHeyWawaGoogoo",
      "haiku-id": "f203a65f49c0"
    }
  }
};
