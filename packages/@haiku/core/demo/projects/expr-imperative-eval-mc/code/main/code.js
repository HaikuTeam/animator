var Haiku = require("@haiku/core");
var _code_rects_code = require("./../rects/code.js");
var _code_dots_code = require("./../dots/code.js");
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
    title: "Main",
    type: "haiku",
    relpath: "code/main/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {},
  timelines: {
    Default: {
      "haiku:Main-03757d2ca1026e0a": {
        "style.WebkitTapHighlightColor": "rgba(0,0,0,0)",
        "style.position": "relative",
        "style.overflowX": "hidden",
        "style.overflowY": "hidden",
        "sizeAbsolute.x": 550,
        "sizeAbsolute.y": 400,
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeMode.z": 1
      },
      "haiku:Dots-851f5cfd486f1739": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": { "0": { value: "1px solid black", edited: true } },
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeAbsolute.x": "auto",
        "sizeAbsolute.y": "auto",
        "translation.x": 179.5,
        "translation.y": 179,
        "sizeMode.z": 1,
        "origin.x": 0.5,
        "origin.y": 0.5,
        "style.zIndex": 1,
        playback: "loop"
      },
      "haiku:Rects-63cb5778cba14998": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": { "0": { value: "1px solid gray", edited: true } },
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeAbsolute.x": "auto",
        "sizeAbsolute.y": "auto",
        "translation.x": 426.5,
        "translation.y": 175.75,
        "sizeMode.z": 1,
        "origin.x": 0.5,
        "origin.y": 0.5,
        "style.zIndex": 2,
        playback: "loop"
      },
      "haiku:Oval-9342fc0bac71049a": {
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
      "haiku:Page-1-d1e89bf1aee37dc2": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Oval-58f28ca863d7a556": {
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
    attributes: { "haiku-id": "Main-03757d2ca1026e0a", "haiku-title": "Main" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Oval-9342fc0bac71049a",
          "haiku-title": "Oval",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/Oval.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-d1e89bf1aee37dc2", id: "Page-1" },
            children: [
              {
                elementName: "circle",
                attributes: { "haiku-id": "Oval-58f28ca863d7a556", id: "Oval" },
                children: []
              }
            ]
          }
        ]
      },
      {
        elementName: _code_rects_code,
        attributes: {
          "haiku-id": "Rects-63cb5778cba14998",
          "haiku-var": "_code_rects_code",
          "haiku-title": "Rects",
          "haiku-source": "./code/rects/code.js"
        },
        children: []
      },
      {
        elementName: _code_dots_code,
        attributes: {
          "haiku-id": "Dots-851f5cfd486f1739",
          "haiku-var": "_code_dots_code",
          "haiku-title": "Dots",
          "haiku-source": "./code/dots/code.js"
        },
        children: []
      }
    ]
  }
};
