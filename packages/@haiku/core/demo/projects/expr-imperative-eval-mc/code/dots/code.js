var Haiku = require("@haiku/core");
var _code_rects_code = require("./../rects/code.js");
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
    title: "Dots",
    type: "haiku",
    relpath: "code/dots/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {},
  timelines: {
    Default: {
      "haiku:Dots-15ead2c70f10c1ee": {
        "style.WebkitTapHighlightColor": "rgba(0,0,0,0)",
        "style.position": "relative",
        "style.overflowX": "visible",
        "style.overflowY": "visible",
        "sizeAbsolute.x": 191,
        "sizeAbsolute.y": 197,
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeMode.z": 1
      },
      "haiku:946dbe7d7eb8": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 115,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 115,
        "sizeMode.y": 1,
        "translation.x": 57.5,
        "translation.y": 57.5,
        "style.zIndex": 1
      },
      "haiku:641c60115e6a": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:368740f9e7af": { "translation.x": -189, "translation.y": -622 },
      "haiku:0820886521e9": { fill: "#5DE2F9", cx: 246.5, cy: 679.5, r: 57.5 },
      "haiku:cebb448114b4": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 115,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 115,
        "sizeMode.y": 1,
        "translation.x": 133.5,
        "translation.y": 139.5,
        "style.zIndex": 2
      },
      "haiku:b0d1f0492642": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:251bebc0860c": { "translation.x": -189, "translation.y": -622 },
      "haiku:034bb43ce56b": { fill: "#5DE2F9", cx: 246.5, cy: 679.5, r: 57.5 },
      "haiku:Oval-593c2e323a08e6c2": {
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
      "haiku:Page-1-808f0e04083c524b": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Oval-85569d3cb78ae47d": {
        stroke: "#979797",
        fill: "#000000",
        cx: 7.5,
        cy: 7.5,
        r: 6.5
      },
      "haiku:Rects-a60014f5040f5a6e": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeAbsolute.x": "auto",
        "sizeAbsolute.y": "auto",
        "translation.x": 133.5,
        "translation.y": 98.5,
        "origin.x": 0.5,
        "origin.y": 0.5,
        "style.zIndex": 4,
        "translation.z": 0,
        "rotation.z": 0.741
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "Dots-15ead2c70f10c1ee", "haiku-title": "Dots" },
    children: [
      {
        elementName: _code_rects_code,
        attributes: {
          "haiku-id": "Rects-a60014f5040f5a6e",
          "haiku-var": "_code_rects_code",
          "haiku-title": "Rects",
          "haiku-source": "./code/rects/code.js"
        },
        children: []
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Oval-593c2e323a08e6c2",
          "haiku-title": "Oval",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/Oval.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-808f0e04083c524b", id: "Page-1" },
            children: [
              {
                elementName: "circle",
                attributes: { "haiku-id": "Oval-85569d3cb78ae47d", id: "Oval" },
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
          "haiku-id": "cebb448114b4",
          "haiku-title": "blue-circle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/blue-circle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "b0d1f0492642",
              "haiku-title": "Page-1",
              id: "3e72c7ff7aa3"
            },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "251bebc0860c",
                  "haiku-title": "Tutorial",
                  id: "e85ad6781e5d"
                },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "034bb43ce56b",
                      "haiku-title": "blue-circle",
                      id: "df033fc74a47"
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
          "haiku-id": "946dbe7d7eb8",
          "haiku-title": "blue-circle",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/blue-circle.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "641c60115e6a",
              "haiku-title": "Page-1",
              id: "7abf2f616bcd"
            },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "368740f9e7af",
                  "haiku-title": "Tutorial",
                  id: "cf4182e4dd51"
                },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "0820886521e9",
                      "haiku-title": "blue-circle",
                      id: "6e42fe5092c4"
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
