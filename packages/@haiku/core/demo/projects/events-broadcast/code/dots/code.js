var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    folder: "/Users/matthew/Code/HaikuTeam/mono/packages/haiku-plumbing/test/fixtures/projects/blank-project/",
    uuid: "HAIKU_SHARE_UUID",
    core: "3.5.1",
    username: "matthew+jul11121@haiku.ai",
    organization: "matthewjul11121",
    project: "UsersMatthewHaikuProjects",
    branch: "master",
    version: "0.0.0",
    title: "Dots",
    type: "haiku",
    relpath: "code/dots/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {
    "haiku:15ead2c70f10": {
      "foobar": {
        handler: function () {
          console.log(this.$id,'heard foobar!')
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:15ead2c70f10": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.transformStyle": { "0": { value: "flat" } },
        "style.perspective": { "0": { value: "none" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "visible" } },
        "style.overflowY": { "0": { value: "visible" } },
        "sizeAbsolute.x": { "0": { value: 154 } },
        "sizeAbsolute.y": { "0": { value: 197 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:472c9631605d": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 115 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 115 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 96.5, edited: true, curve: "linear" },
          "500": { value: -0.5 }
        },
        "translation.y": {
          "0": { value: 57.5, edited: true, curve: "linear" },
          "500": { value: 57.5 }
        },
        "style.zIndex": { "0": { value: 1 } }
      },
      "haiku:3df7357b96a7": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:0384c394c9d5": {
        "translation.x": { "0": { value: -189 } },
        "translation.y": { "0": { value: -622 } }
      },
      "haiku:811ef0791fee": {
        fill: { "0": { value: "#5DE2F9" } },
        cx: { "0": { value: "246.5" } },
        cy: { "0": { value: "679.5" } },
        r: { "0": { value: "57.5" } }
      },
      "haiku:9be7e4adbc98": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 115 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 115 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 57.5, edited: true, curve: "linear" },
          "500": { value: 154 }
        },
        "translation.y": {
          "0": { value: 139.5, edited: true, curve: "linear" },
          "500": { value: 139.5 }
        },
        "style.zIndex": { "0": { value: 2 } }
      },
      "haiku:8cbe24cb8956": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:02d8967391de": {
        "translation.x": { "0": { value: -189 } },
        "translation.y": { "0": { value: -622 } }
      },
      "haiku:572348ca4ad5": {
        fill: { "0": { value: "#5DE2F9" } },
        cx: { "0": { value: "246.5" } },
        cy: { "0": { value: "679.5" } },
        r: { "0": { value: "57.5" } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "15ead2c70f10", "haiku-title": "Dots" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "9be7e4adbc98",
          "haiku-title": "blue-circle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/blue-circle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "8cbe24cb8956",
              "haiku-title": "Page-1",
              id: "506b7c89c37d"
            },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "02d8967391de",
                  "haiku-title": "Tutorial",
                  id: "2c134d42da96"
                },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "572348ca4ad5",
                      "haiku-title": "blue-circle",
                      id: "b5167cd9b39a"
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
          "haiku-id": "472c9631605d",
          "haiku-title": "blue-circle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/blue-circle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "3df7357b96a7",
              "haiku-title": "Page-1",
              id: "6216ecb3245c"
            },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "0384c394c9d5",
                  "haiku-title": "Tutorial",
                  id: "564ef9f51ac3"
                },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "811ef0791fee",
                      "haiku-title": "blue-circle",
                      id: "e2187c6c920d"
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
