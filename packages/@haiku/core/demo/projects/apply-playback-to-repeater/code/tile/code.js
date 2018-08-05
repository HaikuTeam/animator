var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    folder: "/Users/zack/.haiku/projects/zack4/shift",
    uuid: "3819ddc1-7dd3-4016-92ad-3082180f0756",
    core: "3.5.1",
    username: "zack4",
    organization: "zack4",
    project: "shift",
    branch: "master",
    version: "0.0.0",
    title: "Tile",
    type: "haiku",
    relpath: "code/tile/code.js"
  },
  options: {},
  states: { frame: { type: "number", value: 1, edited: true } },
  eventHandlers: {
    "haiku:Tile-5011c6f5f107c27e": {
      "timeline:Default:0": {
        handler: function(component, target, event) {
          this.pause();
        }
      },
      "component:did-mount": {
        handler: function(component, target, event) {
          this.getDefaultTimeline().gotoAndStop(this.state.frame);
        }
      }
    },
    "haiku:1bb2058074d8": {},
    "haiku:fc053a93d102": {},
    "haiku:bb60e288237c": {}
  },
  timelines: {
    Default: {
      "haiku:Tile-5011c6f5f107c27e": {
        "style.WebkitTapHighlightColor": "rgba(0,0,0,0)",
        "style.position": "relative",
        "style.overflowX": "visible",
        "style.overflowY": "visible",
        "sizeAbsolute.x": 50,
        "sizeAbsolute.y": 50,
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeMode.z": 1
      },
      "haiku:fc053a93d102": {
        x: "0px",
        y: "0px",
        viewBox: "0 0 50 50",
        enableBackground: "new 0 0 50 50",
        "xml:space": "preserve",
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeAbsolute.x": 50,
        "sizeAbsolute.y": 50,
        "translation.x": {
          "0": { value: 220, edited: true },
          "33": { value: 25 }
        },
        "translation.y": {
          "0": { value: 25, edited: true },
          "33": { value: 25 }
        },
        "style.zIndex": 3
      },
      "haiku:071f751bb9db": {
        fill: "#FBB03B",
        d: "M45,49.5H5c-2.75,0-5-2.25-5-5v-39c0-2.75,2.25-5,5-5h40c2.75,0,5,2.25,5,5v39C50,47.25,47.75,49.5,45,49.5z\n\t"
      },
      "haiku:bb60e288237c": {
        x: "0px",
        y: "0px",
        viewBox: "0 0 50 50",
        enableBackground: "new 0 0 50 50",
        "xml:space": "preserve",
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeAbsolute.x": 50,
        "sizeAbsolute.y": 50,
        "translation.x": {
          "0": { value: 170, edited: true },
          "17": { value: 25 },
          "33": { value: -26 }
        },
        "translation.y": {
          "0": { value: 25, edited: true },
          "17": { value: 25 },
          "33": { value: 25 }
        },
        "style.zIndex": 2
      },
      "haiku:6bc722c38666": {
        fill: "#F15A24",
        d: "M45,49.5H5c-2.75,0-5-2.25-5-5v-39c0-2.75,2.25-5,5-5h40c2.75,0,5,2.25,5,5v39C50,47.25,47.75,49.5,45,49.5z\n\t"
      },
      "haiku:1bb2058074d8": {
        x: "0px",
        y: "0px",
        viewBox: "0 0 50 50",
        enableBackground: "new 0 0 50 50",
        "xml:space": "preserve",
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeAbsolute.x": 50,
        "sizeAbsolute.y": 50,
        "translation.x": {
          "0": { value: 25, edited: true },
          "17": { value: -25 },
          "33": { value: -76 }
        },
        "translation.y": {
          "0": { value: 25, edited: true },
          "17": { value: 25 },
          "33": { value: 25 }
        },
        "style.zIndex": 1
      },
      "haiku:dfa8f395b556": {
        fill: "#C1272D",
        d: "M45,50H5c-2.75,0-5-2.25-5-5V6c0-2.75,2.25-5,5-5h40c2.75,0,5,2.25,5,5v39C50,47.75,47.75,50,45,50z"
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "Tile-5011c6f5f107c27e", "haiku-title": "Tile" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "1bb2058074d8",
          "haiku-title": "shift-01",
          "haiku-source": "designs/shift.ai.contents/artboards/shift-01.svg",
          id: "be84cc72c63b"
        },
        children: [
          {
            elementName: "path",
            attributes: { "haiku-id": "dfa8f395b556" },
            children: []
          }
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "bb60e288237c",
          "haiku-title": "shift-02",
          "haiku-source": "designs/shift.ai.contents/artboards/shift-02.svg",
          id: "b66a7470fcc5"
        },
        children: [
          {
            elementName: "path",
            attributes: { "haiku-id": "6bc722c38666" },
            children: []
          }
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "fc053a93d102",
          "haiku-title": "shift-03",
          "haiku-source": "designs/shift.ai.contents/artboards/shift-03.svg",
          id: "249eee0decc6"
        },
        children: [
          {
            elementName: "path",
            attributes: { "haiku-id": "071f751bb9db" },
            children: []
          }
        ]
      }
    ]
  }
};
