var Haiku = require("@haiku/core");
var _code_skeet_code = require("./../skeet/code.js");
module.exports = {
  metadata: {
    title: "Main",
    uuid: "25ac232f-b863-455d-8215-892692a9bcde",
    type: "haiku",
    relpath: "code/main/code.js",
    core: "3.5.1",
    version: "0.0.0",
    folder: "/Users/taylorpoe/.haiku/projects/taylor/gameyo",
    username: "taylor",
    organization: "taylor",
    project: "gameyo",
    branch: "master"
  },
  options: {},
  states: {
    score: { type: "string", value: "0", edited: true },
    randPlace: { type: "number", value: 0, edited: true }
  },
  eventHandlers: {
    "haiku:Main-03757d2ca1026e0a": {
      "timeline:Default:86": {
        handler: function(target, event) {
          this.setState({ randPlace: 400 * Math.random() });
        }
      },
      skeet: {
        handler: function(target, event) {
          var numScore = parseInt(this.state.score);
          var newScore = numScore + 1;
          var stringed = newScore.toString();

          this.setState({ score: stringed });

          alert("heard event");
        }
      }
    },
    "haiku:Rectangle-4696643e100ee81c": {},
    "haiku:12-7a3033069ab1773d": {},
    "haiku:Skeet-fb7334e20cc8e1ab": {
      click: {
        handler: function(target, event) {
          var numScore = parseInt(this.state.score);
          var newScore = numScore + 1;
          var stringed = newScore.toString();
          this.setState({ score: stringed });
        }
      }
    },
    "haiku:Grass-b090feab34c69aea": {},
    "haiku:Sky-1ed58ec89ec4195e": {}
  },
  timelines: {
    Default: {
      "haiku:Main-03757d2ca1026e0a": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
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
          "1500": { value: 1, edited: true }
        }
      },
      "haiku:Text-Span-ef10493b5b7d28c1": {
        x: { "0": { value: "24" } },
        y: { "0": { value: "53" } },
        content: { "0": { value: "SCORE", edited: true } }
      },
      "haiku:Text-Span-42f41c7aee23b3ae": {
        x: { "0": { value: "200" } },
        y: { "0": { value: "53" } },
        content: {
          "0": {
            value: Haiku.inject(
              function(score) {
                return score;
              },
              "score"
            ),
            edited: true
          }
        }
      },
      "haiku:Score-19cd6ca01eb899f5": {
        "style.overflow": { "0": { value: "visible" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": { "0": { value: 245.047 } },
        "translation.y": { "0": { value: 64.75 } },
        "sizeAbsolute.x": { "0": { value: 169.09375 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 57.5 } },
        "sizeMode.y": { "0": { value: 1 } },
        "style.zIndex": { "0": { value: 3 } }
      },
      "haiku:Group-edab202f95cbfd7d": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -24 } },
        "translation.y": { "0": { value: -7 } }
      },
      "haiku:SCORE-9648eab085c3a0c0": {
        fontFamily: { "0": { value: "Helvetica, Arial, sans-serif" } },
        fontSize: { "0": { value: "50" } },
        fontWeight: { "0": { value: "300" } },
        letterSpacing: { "0": { value: "-0.08571432" } },
        fill: { "0": { value: "#021013" } }
      },
      "haiku:12-7a3033069ab1773d": {
        "style.overflow": { "0": { value: "visible" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": { "0": { value: 364.258 } },
        "translation.y": { "0": { value: 64.75 } },
        "sizeAbsolute.x": { "0": { value: 55.515625 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 57.5 } },
        "sizeMode.y": { "0": { value: 1 } },
        "style.zIndex": { "0": { value: 4 } }
      },
      "haiku:Group-24ef45e62f766df1": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -200 } },
        "translation.y": { "0": { value: -7 } }
      },
      "haiku:12-1e5ff3fdefc6f7e7": {
        fontFamily: { "0": { value: "Helvetica, Arial, sans-serif" } },
        fontSize: { "0": { value: "50" } },
        fontWeight: { "0": { value: "bold" } },
        letterSpacing: { "0": { value: "-0.08571432" } },
        fill: { "0": { value: "#021013" } }
      },
      "haiku:Rectangle-4696643e100ee81c": {
        "style.overflow": { "0": { value: "visible" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": { "0": { value: 275, edited: true } },
        "translation.y": { "0": { value: 64.75, edited: true } },
        "sizeAbsolute.x": { "0": { value: 276 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 69 } },
        "sizeMode.y": { "0": { value: 1 } },
        "style.zIndex": { "0": { value: 5 } }
      },
      "haiku:Group-211d0f096a990346": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -0.5 } },
        "translation.y": { "0": { value: -0.5 } }
      },
      "haiku:Rectangle-24204321e2f68884": {
        stroke: { "0": { value: "#021013" } },
        fillRule: { "0": { value: "nonzero" } },
        x: { "0": { value: "0.5" } },
        y: { "0": { value: "0.5" } }
      },
      "haiku:Skeet-fb7334e20cc8e1ab": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: "auto" } },
        "sizeAbsolute.y": { "0": { value: "auto" } },
        "translation.x": {
          "0": { value: 275, edited: true },
          "17": { value: 275, edited: true, curve: "linear" },
          "1400": {
            value: Haiku.inject(
              function(randPlace) {
                return randPlace;
              },
              "randPlace"
            ),
            edited: true
          }
        },
        "translation.y": {
          "0": { value: 434.5, edited: true },
          "17": { value: 434.5, edited: true, curve: "easeOutCirc" },
          "1400": { value: -35, edited: true }
        },
        "sizeMode.z": { "0": { value: 1 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "style.zIndex": { "0": { value: 6 } },
        playback: { "0": { value: "loop" } },
        "scale.x": {
          "0": { value: 1.7, edited: true },
          "17": { value: 1.7, edited: true, curve: "easeOutCubic" },
          "1400": { value: 1.1, edited: true }
        },
        "scale.y": {
          "0": { value: 1.7, edited: true },
          "17": { value: 1.7, edited: true, curve: "easeOutCubic" },
          "1400": { value: 1.1, edited: true }
        }
      },
      "haiku:Grass-b090feab34c69aea": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 477 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 125 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 275.0005086051233, edited: true } },
        "translation.y": { "0": { value: 344, edited: true } },
        "style.zIndex": { "0": { value: 1 } },
        "translation.z": { "0": { value: 0, edited: true } },
        "rotation.x": { "0": { value: 0, edited: true } },
        "rotation.y": { "0": { value: 0, edited: true } },
        "rotation.z": { "0": { value: 0, edited: true } },
        "scale.x": { "0": { value: 1.153, edited: true } },
        "scale.y": { "0": { value: 0.896, edited: true } },
        "scale.z": { "0": { value: 1, edited: true }, "1400": { value: 1 } },
        "shear.xy": { "0": { value: 0, edited: true } },
        "shear.xz": { "0": { value: 0, edited: true } },
        "shear.yz": { "0": { value: 0, edited: true } }
      },
      "haiku:Sky-1ed58ec89ec4195e": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 477 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 125 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 274.9945, edited: true } },
        "translation.y": { "0": { value: 144, edited: true } },
        "style.zIndex": { "0": { value: 2 } },
        "translation.z": { "0": { value: 0, edited: true } },
        "rotation.x": { "0": { value: 0, edited: true } },
        "rotation.y": { "0": { value: 0, edited: true } },
        "rotation.z": { "0": { value: 0, edited: true } },
        "scale.x": { "0": { value: 1.153, edited: true } },
        "scale.y": { "0": { value: 2.304, edited: true } },
        "scale.z": { "0": { value: 1, edited: true }, "1400": { value: 1 } },
        "shear.xy": { "0": { value: 0, edited: true } },
        "shear.xz": { "0": { value: 0, edited: true } },
        "shear.yz": { "0": { value: 0, edited: true } }
      },
      "haiku:Page-1-188f1fd07e912407": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:grass-570ae95537750e9e": {
        fill: { "0": { value: "#ACFFB5" } },
        fillRule: { "0": { value: "nonzero" } },
        x: { "0": { value: "-1.13686838e-13" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 477 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 125 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:Page-1-7cabcc9e4bf2023e": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:sky-6f676be7c2e92a29": {
        fill: { "0": { value: "#ACFBFF" } },
        fillRule: { "0": { value: "nonzero" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 477 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 125 } },
        "sizeMode.y": { "0": { value: 1 } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "Main-03757d2ca1026e0a", "haiku-title": "Main" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Sky-1ed58ec89ec4195e",
          "haiku-title": "sky",
          "haiku-source": "designs/gameyo.sketch.contents/slices/sky.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-7cabcc9e4bf2023e", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "sky-6f676be7c2e92a29", id: "sky" },
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
          "haiku-id": "Grass-b090feab34c69aea",
          "haiku-title": "grass",
          "haiku-source": "designs/gameyo.sketch.contents/slices/grass.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-188f1fd07e912407", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "grass-570ae95537750e9e",
                  id: "grass"
                },
                children: []
              }
            ]
          }
        ]
      },
      {
        elementName: _code_skeet_code,
        attributes: {
          "haiku-id": "Skeet-fb7334e20cc8e1ab",
          "haiku-var": "_code_skeet_code",
          "haiku-title": "Skeet",
          "haiku-source": "./code/skeet/code.js"
        },
        children: []
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Rectangle-4696643e100ee81c",
          "haiku-title": "Rectangle",
          "haiku-source": "designs/gameyo.sketch.contents/slices/Group.svg#Rectangle"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Group-211d0f096a990346" },
            children: [
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "Rectangle-24204321e2f68884",
                  id: "Rectangle"
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
          "haiku-id": "12-7a3033069ab1773d",
          "haiku-title": "12",
          "haiku-source": "designs/gameyo.sketch.contents/slices/Group.svg#12"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Group-24ef45e62f766df1" },
            children: [
              {
                elementName: "text",
                attributes: { "haiku-id": "12-1e5ff3fdefc6f7e7", id: "12" },
                children: [
                  {
                    elementName: "tspan",
                    attributes: { "haiku-id": "Text-Span-42f41c7aee23b3ae" },
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
          "haiku-id": "Score-19cd6ca01eb899f5",
          "haiku-title": "SCORE",
          "haiku-source": "designs/gameyo.sketch.contents/slices/Group.svg#SCORE"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Group-edab202f95cbfd7d" },
            children: [
              {
                elementName: "text",
                attributes: {
                  "haiku-id": "SCORE-9648eab085c3a0c0",
                  id: "SCORE"
                },
                children: [
                  {
                    elementName: "tspan",
                    attributes: { "haiku-id": "Text-Span-ef10493b5b7d28c1" },
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