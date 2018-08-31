var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    title: "Main",
    uuid: "HAIKU_SHARE_UUID",
    type: "haiku",
    relpath: "code/main/code.js",
    core: "3.5.1"
  },
  options: {},
  states: {
    tweets: {
      type: "array",
      value: [
        { t: "meow cat", c: "red", x: 100, y: 100 },
        { t: "ruff dog", c: "green", x: 200, y: 200 },
        { t: "chirp bird", c: "blue", x: 300, y: 300 }
      ],
      edited: true
    }
  },
  eventHandlers: {
    "haiku:03757d2ca102": {},
    "haiku:0835d2f1965f": {},
    "haiku:39bbb9926bf5": {}
  },
  timelines: {
    Default: {
      "haiku:03757d2ca102": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "hidden" } },
        "style.overflowY": { "0": { value: "hidden" } },
        "sizeAbsolute.x": { "0": { value: 550 }, "500": { value: 550 } },
        "sizeAbsolute.y": { "0": { value: 400 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
      },
      "haiku:0835d2f1965f": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 262 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 138 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function($flow) {
                return $flow.repeat.payload.x;
              },
              "$flow"
            ),
            edited: true
          }
        },
        "translation.y": {
          "0": {
            value: Haiku.inject(
              function($flow) {
                return $flow.repeat.payload.y;
              },
              "$flow"
            ),
            edited: true
          }
        },
        "style.zIndex": { "0": { value: 1 } },
        "controlFlow.repeat": {
          "0": {
            value: Haiku.inject(
              function(tweets) {
                return tweets;
              },
              "tweets"
            ),
            edited: true
          }
        }
      },
      "haiku:6b2b31cca562": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:58645d7e6350": {
        stroke: { "0": { value: "#979797" } },
        fill: { "0": { value: "#D8D8D8" } },
        x: { "0": { value: "7.5" } },
        y: { "0": { value: "7.5" } },
        "sizeAbsolute.x": { "0": { value: 240 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 118 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:5e51b1a61f0c": {
        stroke: { "0": { value: "#979797" } },
        fill: {
          "0": {
            value: Haiku.inject(
              function($flow) {
                return $flow.repeat.payload.c;
              },
              "$flow"
            ),
            edited: true
          }
        },
        x: { "0": { value: "153.5" } },
        y: { "0": { value: "37.5" } },
        "sizeAbsolute.x": { "0": { value: 63 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 62 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:b3f59aa9bade": {
        fontFamily: { "0": { value: "Helvetica, Arial, sans-serif" } },
        fontSize: { "0": { value: "14" } },
        fontWeight: { "0": { value: "bold" } },
        letterSpacing: { "0": { value: "-0.02333334" } },
        fill: { "0": { value: "#000000" } }
      },
      "haiku:eeebf802cf0e": {
        x: { "0": { value: "36" } },
        y: { "0": { value: "78" } },
        content: {
          "0": {
            value: Haiku.inject(
              function($flow) {
                return $flow.repeat.payload.t;
              },
              "$flow"
            ),
            edited: true
          }
        }
      },
      "haiku:39bbb9926bf5": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 262 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 138 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 466.5 } },
        "translation.y": { "0": { value: 75.5 } },
        "style.zIndex": { "0": { value: 2 } },
        "controlFlow.if": {
          "0": {
            value: Haiku.inject(
              function($core) {
                return $core.timeline.frame % 2 === 0;
              },
              "$core"
            ),
            edited: true
          }
        }
      },
      "haiku:ae65cf9f18dc": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:efe1cd1056d6": {
        stroke: { "0": { value: "#979797" } },
        fill: { "0": { value: "#D8D8D8" } },
        x: { "0": { value: "7.5" } },
        y: { "0": { value: "7.5" } },
        "sizeAbsolute.x": { "0": { value: 240 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 118 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:47b389ce9027": {
        stroke: { "0": { value: "#979797" } },
        fill: { "0": { value: "#CD8D8D" } },
        x: { "0": { value: "153.5" } },
        y: { "0": { value: "37.5" } },
        "sizeAbsolute.x": { "0": { value: 63 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 62 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:64e506aa28df": {
        fontFamily: { "0": { value: "Helvetica, Arial, sans-serif" } },
        fontSize: { "0": { value: "14" } },
        fontWeight: { "0": { value: "bold" } },
        letterSpacing: { "0": { value: "-0.02333334" } },
        fill: { "0": { value: "#000000" } }
      },
      "haiku:9a010b3fb24b": {
        x: { "0": { value: "36" } },
        y: { "0": { value: "78" } },
        content: { "0": { value: "moo cow" } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "03757d2ca102", "haiku-title": "Main" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "39bbb9926bf5",
          "haiku-title": "Slice",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/Slice.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "ae65cf9f18dc", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "efe1cd1056d6", id: "Rectangle" },
                children: []
              },
              {
                elementName: "rect",
                attributes: { "haiku-id": "47b389ce9027", id: "Rectangle-2" },
                children: []
              },
              {
                elementName: "text",
                attributes: { "haiku-id": "64e506aa28df", id: "moo-cow" },
                children: [
                  {
                    elementName: "tspan",
                    attributes: { "haiku-id": "9a010b3fb24b" },
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
          "haiku-id": "0835d2f1965f",
          "haiku-title": "Slice",
          "haiku-source": "designs/UsersMatthewHaikuPro.sketch.contents/slices/Slice.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "6b2b31cca562", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "58645d7e6350", id: "Rectangle" },
                children: []
              },
              {
                elementName: "rect",
                attributes: { "haiku-id": "5e51b1a61f0c", id: "Rectangle-2" },
                children: []
              },
              {
                elementName: "text",
                attributes: { "haiku-id": "b3f59aa9bade", id: "moo-cow" },
                children: [
                  {
                    elementName: "tspan",
                    attributes: { "haiku-id": "eeebf802cf0e" },
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
