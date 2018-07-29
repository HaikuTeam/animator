var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    folder: "/Users/matthew/Code/HaikuTeam/mono/packages/haiku-plumbing/test/fixtures/projects/blank-project/",
    uuid: "HAIKU_SHARE_UUID",
    core: "3.5.1",
    username: "matthew+2@haiku.ai",
    organization: "matthew2",
    project: "UsersMatthewHaikuProjects",
    branch: "master",
    version: "0.0.0",
    title: "Asdf",
    type: "haiku",
    relpath: "code/asdf/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {
    "haiku:Asdf-0ae0430248b19159": {
      "timeline:Default:0": {
        handler: function(target, event) {
          this.pause();
        }
      },
      foobar: {
        handler: function(target, event) {
          console.log("received foobar");
          this.gotoAndPlay(1);
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:Asdf-0ae0430248b19159": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "visible" } },
        "style.overflowY": { "0": { value: "visible" } },
        "sizeAbsolute.x": { "0": { value: 134.95799999999997 } },
        "sizeAbsolute.y": { "0": { value: 136.52100000000002 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:455f85c2afcb": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 115 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 115 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 69.10500000000002, edited: true, curve: "linear" },
          "333": { value: 98.64399999999999 }
        },
        "translation.y": {
          "0": { value: 33.9825, edited: true, curve: "linear" },
          "333": { value: 33.98249816894531 }
        },
        "style.zIndex": { "0": { value: 2 } },
        "translation.z": { "0": { value: 0 } },
        "rotation.x": { "0": { value: 0 } },
        "rotation.y": { "0": { value: 0 } },
        "rotation.z": { "0": { value: 0 } },
        "scale.x": { "0": { value: 0.542 } },
        "scale.y": { "0": { value: 0.591 } },
        "scale.z": { "0": { value: 1 } },
        "shear.xy": { "0": { value: 0 } },
        "shear.xz": { "0": { value: 0 } },
        "shear.yz": { "0": { value: 0 } }
      },
      "haiku:4cd53b6415d0": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:c8378b21e5fd": {
        "translation.x": { "0": { value: -189 } },
        "translation.y": { "0": { value: -622 } }
      },
      "haiku:fa828d87225c": {
        fill: { "0": { value: "#5DE2F9" } },
        cx: { "0": { value: "246.5" } },
        cy: { "0": { value: "679.5" } },
        r: { "0": { value: "57.5" } }
      },
      "haiku:e25897f67ddf": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 115 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 115 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 31.16500000000002, edited: true },
          "17": { value: 31.16500000000002, edited: true, curve: "linear" },
          "333": { value: 6.775002441406244 }
        },
        "translation.y": {
          "0": { value: 72.69250000000001, edited: true, curve: "linear" },
          "333": { value: 33.98249816894531 }
        },
        "style.zIndex": { "0": { value: 3 } },
        "translation.z": { "0": { value: 0 } },
        "rotation.x": { "0": { value: 0 } },
        "rotation.y": { "0": { value: 0 } },
        "rotation.z": { "0": { value: 0 } },
        "scale.x": { "0": { value: 0.542 } },
        "scale.y": { "0": { value: 0.591 } },
        "scale.z": { "0": { value: 1 } },
        "shear.xy": { "0": { value: 0 } },
        "shear.xz": { "0": { value: 0 } },
        "shear.yz": { "0": { value: 0 } }
      },
      "haiku:06828d228c90": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:e7968ce4e167": {
        "translation.x": { "0": { value: -189 } },
        "translation.y": { "0": { value: -622 } }
      },
      "haiku:c4024cc8b0f4": {
        fill: { "0": { value: "#5DE2F9" } },
        cx: { "0": { value: "246.5" } },
        cy: { "0": { value: "679.5" } },
        r: { "0": { value: "57.5" } }
      },
      "haiku:9b77873ba69c": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 115 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 115 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 103.793, edited: true, curve: "linear" },
          "333": { value: 67.47904296875001 }
        },
        "translation.y": {
          "0": { value: 102.53850000000001, edited: true, curve: "linear" },
          "333": { value: 102.53850000000001 }
        },
        "style.zIndex": { "0": { value: 4 } },
        "translation.z": { "0": { value: 0 } },
        "rotation.x": { "0": { value: 0 } },
        "rotation.y": { "0": { value: 0 } },
        "rotation.z": { "0": { value: 0 } },
        "scale.x": { "0": { value: 0.542 } },
        "scale.y": { "0": { value: 0.591 } },
        "scale.z": { "0": { value: 1 } },
        "shear.xy": { "0": { value: 0 } },
        "shear.xz": { "0": { value: 0 } },
        "shear.yz": { "0": { value: 0 } }
      },
      "haiku:8bbac83a9328": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:dbd4b427fe3b": {
        "translation.x": { "0": { value: -189 } },
        "translation.y": { "0": { value: -622 } }
      },
      "haiku:11fcc9f0b5f3": {
        fill: { "0": { value: "#5DE2F9" } },
        cx: { "0": { value: "246.5" } },
        cy: { "0": { value: "679.5" } },
        r: { "0": { value: "57.5" } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "Asdf-0ae0430248b19159", "haiku-title": "Asdf" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "9b77873ba69c",
          "haiku-title": "blue-circle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/blue-circle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "8bbac83a9328",
              "haiku-title": "Page-1",
              id: "f9c92d6d98ec"
            },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "dbd4b427fe3b",
                  "haiku-title": "Tutorial",
                  id: "456ee12ecc35"
                },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "11fcc9f0b5f3",
                      "haiku-title": "blue-circle",
                      id: "2b68ba919703"
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
          "haiku-id": "e25897f67ddf",
          "haiku-title": "blue-circle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/blue-circle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "06828d228c90",
              "haiku-title": "Page-1",
              id: "130d8202a102"
            },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "e7968ce4e167",
                  "haiku-title": "Tutorial",
                  id: "d52dd8d5c603"
                },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "c4024cc8b0f4",
                      "haiku-title": "blue-circle",
                      id: "0d63c1a99670"
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
          "haiku-id": "455f85c2afcb",
          "haiku-title": "blue-circle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/blue-circle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "4cd53b6415d0",
              "haiku-title": "Page-1",
              id: "f05dcae7e6af"
            },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "c8378b21e5fd",
                  "haiku-title": "Tutorial",
                  id: "2bfc1a9c4224"
                },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "fa828d87225c",
                      "haiku-title": "blue-circle",
                      id: "1f70f75561ef"
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
