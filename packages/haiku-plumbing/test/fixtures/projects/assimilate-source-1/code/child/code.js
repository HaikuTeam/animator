var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    uuid: "HAIKU_SHARE_UUID",
    version: "0.0.0",
    organization: "Haiku",
    project: "blank-project",
    branch: "master",
    folder:
      "/Users/matthew/Code/HaikuTeam/mono/packages/haiku-plumbing/test/fixtures/projects/blank-project/",
    username: "user@haiku.ai",
    root: "HAIKU_CDN_PROJECT_ROOT",
    core: "4.2.0",
    title: "Child",
    type: "haiku",
    relpath: "code/child/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {},
  timelines: {
    Default: {
      "haiku:Child-a3d8c7fdf7c8d289": {
        "style.WebkitTapHighlightColor": "rgba(0,0,0,0)",
        "style.position": "relative",
        "style.overflowX": "visible",
        "style.overflowY": "visible",
        "sizeAbsolute.x": 142.962,
        "sizeAbsolute.y": 96.50049999999999,
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeMode.z": 1
      },
      "haiku:bea18b47bcd3": {
        "sizeMode.x": 1,
        "style.position": "absolute",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 80,
        "style.margin": "0",
        "sizeAbsolute.y": 53,
        "sizeMode.y": 1,
        "translation.x": 40,
        "translation.y": 70.00049999999999,
        "style.zIndex": 4
      },
      "haiku:e70e5c052f2e": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:cd037e3b0557": {
        fill: "#D8D8D8",
        stroke: "#979797",
        "translation.x": -31,
        "translation.y": -63
      },
      "haiku:f5c005a14f8e": { x: 31.5, y: 63.5, width: 79, height: 52 },
      "haiku:8ab1295e251d": {
        "style.zIndex": 5,
        "style.position": "absolute",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 237,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 179,
        "sizeMode.y": 1,
        "translation.x": 92.481,
        "translation.y": 34.9945,
        "style.margin": "0",
        "translation.z": 0,
        "rotation.x": 0,
        "rotation.y": 0,
        "rotation.z": 0,
        "scale.x": 0.426,
        "scale.y": 0.391,
        "scale.z": 1,
        "shear.xy": 0,
        "shear.xz": 0,
        "shear.yz": 0
      },
      "haiku:0337a8cd663b": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:5e16c25c506f": {
        fill: "#D8D8D8",
        stroke: "#979797",
        "translation.x": -41,
        "translation.y": -58
      },
      "haiku:c08c6e7e50cf": { x: 41.5, y: 58.5, width: 236, height: 178 }
    }
  },
  template: {
    elementName: "div",
    attributes: {
      "haiku-id": "Child-a3d8c7fdf7c8d289",
      "haiku-title": "Child"
    },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "8ab1295e251d",
          "haiku-title": "Rectangle",
          "haiku-source":
            "designs/Foo-bar.Baz.sketch.contents/slices/Rectangle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "0337a8cd663b",
              "haiku-title": "Page-1",
              id: "6eee7bd7b179"
            },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "5e16c25c506f",
                  "haiku-title": "Artboard",
                  id: "fbd61172b0c5"
                },
                children: [
                  {
                    elementName: "rect",
                    attributes: {
                      "haiku-id": "c08c6e7e50cf",
                      "haiku-title": "Rectangle",
                      id: "747c65b90b93"
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
          "haiku-id": "bea18b47bcd3",
          "haiku-title": "Rectangle 2",
          "haiku-source":
            "designs/Foo-bar.Baz.sketch.contents/slices/Rectangle 2.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "e70e5c052f2e",
              "haiku-title": "Page-1",
              id: "3f2c4067321e"
            },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "cd037e3b0557",
                  "haiku-title": "Artboard-2",
                  id: "684c363ff306"
                },
                children: [
                  {
                    elementName: "rect",
                    attributes: {
                      "haiku-id": "f5c005a14f8e",
                      "haiku-title": "Rectangle-2",
                      id: "ba97dc399c11"
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
