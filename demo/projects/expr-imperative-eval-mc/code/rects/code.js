var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    folder: "/Users/matthew/Code/HaikuTeam/mono/packages/haiku-plumbing/test/fixtures/projects/blank-project/",
    uuid: "HAIKU_SHARE_UUID",
    root: "HAIKU_CDN_PROJECT_ROOT",
    core: "3.5.1",
    username: "matthew+2@haiku.ai",
    organization: "matthew2",
    project: "UsersMatthewHaikuProjects",
    branch: "master",
    version: "0.0.0",
    title: "Rects",
    type: "haiku",
    relpath: "code/rects/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {},
  timelines: {
    Default: {
      "haiku:Rects-e41b15e0baa01fb3": {
        "style.WebkitTapHighlightColor": "rgba(0,0,0,0)",
        "style.position": "relative",
        "style.overflowX": "visible",
        "style.overflowY": "visible",
        "sizeAbsolute.x": 70,
        "sizeAbsolute.y": 78.5,
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeMode.z": 1
      },
      "haiku:b52f8a81eaa0": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 36,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 39,
        "sizeMode.y": 1,
        "translation.x": 18,
        "translation.y": 19.5,
        "style.zIndex": 1
      },
      "haiku:d3b6345ab4eb": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:fd26c5e6d0d4": {
        stroke: "#979797",
        fill: "#D8D8D8",
        x: 0.5,
        y: 0.5,
        width: 35,
        height: 38
      },
      "haiku:48a0dfaecae1": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 36,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 39,
        "sizeMode.y": 1,
        "translation.x": 52,
        "translation.y": 59,
        "style.zIndex": 2
      },
      "haiku:d860cb1750e9": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:5a996092cae2": {
        stroke: "#979797",
        fill: "#D8D8D8",
        x: 0.5,
        y: 0.5,
        width: 35,
        height: 38
      },
      "haiku:Oval-b89b9deafe9a1559": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 15,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 15,
        "sizeMode.y": 1,
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
        "style.zIndex": 3
      },
      "haiku:Page-1-9964c758b6777214": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Oval-2169c0422c1adf35": {
        stroke: "#979797",
        fill: "#000000",
        cx: 7.5,
        cy: 7.5,
        r: 6.5
      }
    }
  },
  template: {
    elementName: "div",
    attributes: {
      "haiku-id": "Rects-e41b15e0baa01fb3",
      "haiku-title": "Rects"
    },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Oval-b89b9deafe9a1559",
          "haiku-title": "Oval",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/Oval.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-9964c758b6777214", id: "Page-1" },
            children: [
              {
                elementName: "circle",
                attributes: { "haiku-id": "Oval-2169c0422c1adf35", id: "Oval" },
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
          "haiku-id": "48a0dfaecae1",
          "haiku-title": "Rectangle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/Rectangle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "d860cb1750e9",
              "haiku-title": "Page-1",
              id: "ca8b3d1985e4"
            },
            children: [
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "5a996092cae2",
                  "haiku-title": "Rectangle",
                  id: "d32b112b3629"
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
          "haiku-id": "b52f8a81eaa0",
          "haiku-title": "Rectangle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/Rectangle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "d3b6345ab4eb",
              "haiku-title": "Page-1",
              id: "a02c7324fe0e"
            },
            children: [
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "fd26c5e6d0d4",
                  "haiku-title": "Rectangle",
                  id: "d2b5b737ed19"
                },
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
};
