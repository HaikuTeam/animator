var Haiku = require("@haiku/core");
var _code_cat_code = require("./../cat/code.js");
module.exports = {
  metadata: {
    folder: 'http://localhost:3000/projects/catousel/',
    uuid: "HAIKU_SHARE_UUID",
    root: "HAIKU_CDN_PROJECT_ROOT",
    core: "3.5.1",
    username: "matthew+2@haiku.ai",
    organization: "matthew2",
    project: "Catousel",
    branch: "master",
    version: "0.0.0",
    title: "Main",
    type: "haiku",
    relpath: "code/main/code.js"
  },
  options: {},
  states: {},
  eventHandlers: {
    "haiku:Main-03757d2ca1026e0a": {
      "click": {
        // handler: function(component, target, event) {
        //   this.emit("catclicked");
        // }
      },
      "timeline:Default:0": {
        handler: function(component, target, event) {
          // console.log('frame 0 listener!: pause')
          this.pause();
        }
      },
      "timeline:Default:30": {
        handler: function(component, target, event) {
          console.log('frame 30 listener!: pause')
          this.pause();
        }
      },
      "timeline:Default:61": {
        handler: function(component, target, event) {
          console.log('frame 61 listener!: pause')
          this.pause();
        }
      },
      "component:did-initialize": {
        handler: function(component, target, event) {
          this.on("catclicked", () => {
            var tl = this.getDefaultTimeline();
            var fr = tl.getFrame();
            console.log('GOT CATCLICKED!');
            console.log("frame is", fr);
            if (fr < 1) {
              console.log("gotoAndPlay 1");
              this.gotoAndPlay(1);
            } else if (fr >= 1 && fr < 31) {
              console.log("gotoAndPlay 31");
              this.gotoAndPlay(31);
            } else if (fr >= 31 && fr < 62) {
              console.log("gotoAndPlay 1");
              this.gotoAndPlay(1);
            }
          });
        }
      }
    },
    "haiku:Cat-2ea0dabf16767595": {
      click: {
        handler: function(component, target, event) {
          this.emit("catclicked");
        }
      }
    },
    "haiku:Cat-7c07ab87818918bc": {
      click: {
        handler: function(component, target, event) {
          this.emit("catclicked");
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:Main-03757d2ca1026e0a": {
        "style.WebkitTapHighlightColor": "rgba(0,0,0,0)",
        "style.position": "relative",
        "style.overflowX": "hidden",
        "style.overflowY": "hidden",
        "sizeAbsolute.x": 232.318,
        "sizeAbsolute.y": 238.371,
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeMode.z": 1
      },
      "haiku:Cat-2ea0dabf16767595": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeAbsolute.x": "auto",
        "sizeAbsolute.y": "auto",
        "translation.x": {
          "0": { value: 116.5, edited: true },
          "17": { value: 116.5, edited: true, curve: "easeInCubic" },
          "500": { value: -103.5 },
          "517": { value: 331.5, edited: true, curve: "easeInCubic" },
          "1017": { value: 115.5 }
        },
        "translation.y": {
          "0": { value: 118, edited: true },
          "17": { value: 118, edited: true, curve: "easeInCubic" },
          "500": { value: 118 },
          "517": { value: 118, edited: true, curve: "easeInCubic" },
          "1017": { value: 118 }
        },
        "sizeMode.z": 1,
        "origin.x": {
          "0": { value: 0.5, edited: true },
          "17": { value: 0.5, edited: true }
        },
        "origin.y": {
          "0": { value: 0.5, edited: true },
          "17": { value: 0.5, edited: true }
        },
        "style.zIndex": 1,
        playback: "loop"
      },
      "haiku:Cat-7c07ab87818918bc": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeAbsolute.x": "auto",
        "sizeAbsolute.y": "auto",
        "translation.x": {
          "0": { value: 330.318, edited: true },
          "17": { value: 330.318, edited: true, curve: "easeInCubic" },
          "500": { value: 115.318 },
          "517": { value: 115.318, edited: true, curve: "easeInCubic" },
          "1017": { value: -99.682 }
        },
        "translation.y": {
          "0": { value: 118, edited: true },
          "17": { value: 118, edited: true, curve: "easeInCubic" },
          "500": { value: 118 },
          "517": { value: 118, edited: true, curve: "easeInCubic" },
          "1017": { value: 118 }
        },
        "origin.x": {
          "0": { value: 0.5, edited: true },
          "17": { value: 0.5, edited: true }
        },
        "origin.y": {
          "0": { value: 0.5, edited: true },
          "17": { value: 0.5, edited: true }
        },
        "style.zIndex": 2
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "Main-03757d2ca1026e0a", "haiku-title": "Main" },
    children: [
      {
        elementName: _code_cat_code,
        attributes: {
          "haiku-id": "Cat-7c07ab87818918bc",
          "haiku-var": "_code_cat_code",
          "haiku-title": "Cat",
          "haiku-source": "./code/cat/code.js"
        },
        children: []
      },
      {
        elementName: _code_cat_code,
        attributes: {
          "haiku-id": "Cat-2ea0dabf16767595",
          "haiku-var": "_code_cat_code",
          "haiku-title": "Cat",
          "haiku-source": "./code/cat/code.js"
        },
        children: []
      }
    ]
  }
};
