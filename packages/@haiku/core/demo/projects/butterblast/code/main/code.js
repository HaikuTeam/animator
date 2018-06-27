var Haiku = require("@haiku/core");
var _code_blast_code = require("./../blast/code.js");
var _code_butterfly_code = require("./../butterfly/code.js");
module.exports = {
  metadata: {
    folder: "/Users/taylorpoe/.haiku/projects/taylor/Butterblast",
    uuid: "16334100-125e-4d09-a6a9-2866eb8ce9f3",
    core: "3.4.0",
    player: "3.4.0",
    username: "taylor",
    organization: "taylor",
    project: "Butterblast",
    branch: "master",
    version: "0.0.0",
    title: "Main",
    type: "haiku",
    relpath: "code/main/code.js"
  },
  options: {},
  states: { clicked: { type: "boolean", value: false, edited: true } },
  eventHandlers: {
    "haiku:e4a9e4d8baa7": {
      click: {
        handler: function(target, event) {
          this.setState({ clicked: true });
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:e4a9e4d8baa7": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.transformStyle": { "0": { value: "flat" } },
        "style.perspective": { "0": { value: "none" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "hidden" } },
        "style.overflowY": { "0": { value: "hidden" } },
        "sizeAbsolute.x": { "0": { value: 800, edited: true } },
        "sizeAbsolute.y": { "0": { value: 500, edited: true } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "style.backgroundColor": { "0": { value: "#E8FDFB", edited: true } }
      },
      "haiku:c79d4a7ef9d7": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 1000 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 130 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 399.3, edited: true } },
        "translation.y": { "0": { value: 436.2, edited: true } },
        "style.zIndex": { "0": { value: 1 } },
        "scale.x": { "0": { value: 0.802, edited: true } },
        "scale.y": { "0": { value: 1, edited: true } }
      },
      "haiku:78ebd138c33d": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:bd41558f2ec5": {
        fill: { "0": { value: "#AFDD92" } },
        "translation.y": { "0": { value: -470 } }
      },
      "haiku:801b87b20ab7": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "470" } },
        "sizeAbsolute.x": { "0": { value: 1000 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 130 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:6b17c6b61192": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: true } },
        "sizeAbsolute.y": { "0": { value: true } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function($user) {
                return $user.mouse.x;
              },
              "$user"
            ),
            edited: true
          }
        },
        "translation.y": {
          "0": {
            value: Haiku.inject(
              function($user) {
                return $user.mouse.y;
              },
              "$user"
            ),
            edited: true
          }
        },
        "sizeMode.z": { "0": { value: 1 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "style.zIndex": { "0": { value: 2 } },
        playback: { "0": { value: "loop" } }
      },
      "haiku:eeb222bb1daa": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: true } },
        "sizeAbsolute.y": { "0": { value: true } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function($user) {
                return $user.mouse.x;
              },
              "$user"
            ),
            edited: true
          }
        },
        "translation.y": {
          "0": {
            value: Haiku.inject(
              function($user) {
                return $user.mouse.y;
              },
              "$user"
            ),
            edited: true
          }
        },
        "sizeMode.z": { "0": { value: 1 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "style.zIndex": { "0": { value: 3 } },
        playback: { "0": { value: "loop", edited: true } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "e4a9e4d8baa7", "haiku-title": "Main" },
    children: [
      {
        elementName: _code_blast_code,
        attributes: {
          "haiku-id": "eeb222bb1daa",
          "haiku-var": "_code_blast_code",
          "haiku-title": "Blast",
          "haiku-source": "./code/blast/code.js"
        },
        children: []
      },
      {
        elementName: _code_butterfly_code,
        attributes: {
          "haiku-id": "6b17c6b61192",
          "haiku-var": "_code_butterfly_code",
          "haiku-title": "Butterfly",
          "haiku-source": "./code/butterfly/code.js"
        },
        children: []
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "c79d4a7ef9d7",
          "haiku-title": "ground",
          "haiku-source": "designs/components_take_flight.sketch.contents/slices/ground.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "78ebd138c33d", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "bd41558f2ec5", id: "Artboard" },
                children: [
                  {
                    elementName: "rect",
                    attributes: { "haiku-id": "801b87b20ab7", id: "ground" },
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
