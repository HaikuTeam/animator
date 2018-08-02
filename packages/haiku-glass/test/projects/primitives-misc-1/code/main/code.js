var Haiku = require("@haiku/core");
var _code_bits_code = require("./../bits/code.js");
var _code_dots_code = require("./../dots/code.js");
var haiku_core_components_controls_Image_code_main_code = require("@haiku/core/components/controls/Image/code/main/code.js");
var haiku_core_components_controls_Text_code_main_code = require("@haiku/core/components/controls/Text/code/main/code.js");
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
    title: "Main",
    type: "haiku",
    relpath: "code/main/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {
    "haiku:e947acc4b7b4": {
      click: {
        handler: function(target, event) {
          console.log('did a click!')
        }
      },
    },
    "haiku:03757d2ca102": {
      'timeline:Default:0': {
        handler: function(target, event) {
          //no-op
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
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:a5894f11b43e": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "1px solid black", edited: true } },
        "sizeAbsolute.x": { "0": { value: "auto" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: "auto" } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 127, edited: true, curve: 'linear' },
          "1000": { value: 227, edited: true }
        },
        "translation.y": { "0": { value: 54, edited: true } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "style.zIndex": { "0": { value: 1 } },
        width: { "0": { value: 128.41085119105702, edited: true } },
        height: { "0": { value: 70.32529446113918, edited: true } }
      },
      "haiku:c97e7dca287c": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: "auto" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: "auto" } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 143, edited: true } },
        "translation.y": { "0": { value: 211, edited: true } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "style.zIndex": { "0": { value: 2 } },
        width: { "0": { value: 229.59079365187327, edited: true } },
        height: { "0": { value: 205.83469495876054, edited: true } },
        "rotation.z": { "0": { value: -0.224, edited: true } }
      },
      "haiku:e947acc4b7b4": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 115 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 115 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 327, edited: true } },
        "translation.y": { "0": { value: 52.5, edited: true } },
        "style.zIndex": { "0": { value: 3 } },
        "scale.x": { "0": { value: 0.766, edited: true } },
        "scale.y": { "0": { value: 1, edited: true } },
        "rotation.z": { "0": { value: -0.543, edited: true } }
      },
      "haiku:cd52247eb4f9": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: "auto" } },
        "sizeAbsolute.y": { "0": { value: "auto" } },
        "translation.x": { "0": { value: 463.5, edited: true } },
        "translation.y": { "0": { value: 188, edited: true } },
        "sizeMode.z": { "0": { value: 1 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "style.zIndex": { "0": { value: 4 } },
        playback: { "0": { value: "loop" } }
      },
      "haiku:83ff79b68192": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 115 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 115 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 261, edited: true } },
        "translation.y": { "0": { value: 362.5, edited: true } },
        "style.zIndex": { "0": { value: 5 } },
        "scale.x": { "0": { value: 0.574, edited: true } },
        "scale.y": { "0": { value: 0.565, edited: true } }
      },
      "haiku:e5c33bf6fa91": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 115 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 115 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 492.5, edited: true } },
        "translation.y": { "0": { value: 74, edited: true } },
        "style.zIndex": { "0": { value: 6 } },
        "scale.x": { "0": { value: 0.27, edited: true } },
        "scale.y": { "0": { value: 0.991, edited: true } },
        "rotation.z": { "0": { value: 1.347, edited: true } }
      },
      "haiku:22f36bbada23": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:97e7fd4e89d2": {
        "translation.x": { "0": { value: -189 } },
        "translation.y": { "0": { value: -622 } }
      },
      "haiku:42dc4d80a39f": {
        fill: { "0": { value: "#5DE2F9" } },
        cx: { "0": { value: "246.5" } },
        cy: { "0": { value: "679.5" } },
        r: { "0": { value: "57.5" } }
      },
      "haiku:d3127af57693": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:bfd973ecb922": {
        "translation.x": { "0": { value: -189 } },
        "translation.y": { "0": { value: -622 } }
      },
      "haiku:b189e84fd281": {
        fill: { "0": { value: "#5DE2F9" } },
        cx: { "0": { value: "246.5" } },
        cy: { "0": { value: "679.5" } },
        r: { "0": { value: "57.5" } }
      },
      "haiku:59df3d4aa6fc": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:c533fcd5d6fb": {
        "translation.x": { "0": { value: -189 } },
        "translation.y": { "0": { value: -622 } }
      },
      "haiku:f3ba7106ade7": {
        fill: { "0": { value: "#5DE2F9" } },
        cx: { "0": { value: "246.5" } },
        cy: { "0": { value: "679.5" } },
        r: { "0": { value: "57.5" } }
      },
      "haiku:bf5db2011ea2": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: "auto" } },
        "sizeAbsolute.y": { "0": { value: "auto" } },
        "translation.x": { "0": { value: 389.5, edited: true } },
        "translation.y": { "0": { value: 297.5, edited: true } },
        "sizeMode.z": { "0": { value: 1 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "style.zIndex": { "0": { value: 7 } },
        playback: { "0": { value: "loop" } },
        width: { "0": { value: 120.95858620857872, edited: true } },
        height: { "0": { value: 160.21147315177296, edited: true } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "03757d2ca102", "haiku-title": "Main" },
    children: [
      {
        elementName: _code_bits_code,
        attributes: {
          "haiku-id": "bf5db2011ea2",
          "haiku-var": "_code_bits_code",
          "haiku-title": "Bits",
          "haiku-source": "./code/bits/code.js"
        },
        children: []
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "e5c33bf6fa91",
          "haiku-title": "blue-circle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/blue-circle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "22f36bbada23", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "97e7fd4e89d2", id: "Tutorial" },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "42dc4d80a39f",
                      id: "blue-circle"
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
          "haiku-id": "83ff79b68192",
          "haiku-title": "blue-circle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/blue-circle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "d3127af57693", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "bfd973ecb922", id: "Tutorial" },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "b189e84fd281",
                      id: "blue-circle"
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
        elementName: _code_dots_code,
        attributes: {
          "haiku-id": "cd52247eb4f9",
          "haiku-var": "_code_dots_code",
          "haiku-title": "Dots",
          "haiku-source": "./code/dots/code.js"
        },
        children: []
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "e947acc4b7b4",
          "haiku-title": "blue-circle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/blue-circle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "59df3d4aa6fc", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "c533fcd5d6fb", id: "Tutorial" },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "f3ba7106ade7",
                      id: "blue-circle"
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
        elementName: haiku_core_components_controls_Image_code_main_code,
        attributes: {
          "haiku-id": "c97e7dca287c",
          "haiku-var": "haiku_core_components_controls_Image_code_main_code",
          "haiku-title": "Image",
          "haiku-source": "@haiku/core/components/controls/Image/code/main/code.js"
        },
        children: []
      },
      {
        elementName: haiku_core_components_controls_Text_code_main_code,
        attributes: {
          "haiku-id": "a5894f11b43e",
          "haiku-var": "haiku_core_components_controls_Text_code_main_code",
          "haiku-title": "Text",
          "haiku-source": "@haiku/core/components/controls/Text/code/main/code.js"
        },
        children: []
      }
    ]
  }
};
