var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    username: "sarah@intentionalfutures.com",
    uuid: "9c184950-bebb-413b-9569-94300ef17438",
    organization: "south",
    project: "Home",
    branch: "master",
    folder: "/Users/sarah/.haiku/projects/south/Home",
    version: "0.0.21",
    root: "https://cdn.haiku.ai/47d9717a-3aad-48bf-b85f-b8df56b9f9ff/d5ab0c4c15ce07ed519636ae723c5e919afd66b9/",
    core: "4.3.11",
    title: "Feedback",
    type: "haiku",
    relpath: "code/feedback/code.js"
  },
  options: {},
  states: { active: { type: "boolean", value: false, edited: true } },
  eventHandlers: {
    "haiku:Feedbacktotransaction-15369686b3ae6e10": {
      "timeline:Default:100": {
        handler: function(component, element, target, event) {
          if (!this.state.active) {
            this.stop();
          }
        }
      },
      active4: {
        handler: function(component, element, target, event) {
          this.gotoAndPlay(101);
        }
      },
      inactive4: {
        handler: function(component, element, target, event) {
          this.gotoAndStop(100);
          this.setState({ active: false });
        }
      },
      active4once: {
        handler: function(component, element, target, event) {
          this.gotoAndPlay(101);
        }
      },
      hover: {
        handler: function(component, element, target, event) {
          this.setState({ active: true });
          this.gotoAndPlay(101);
        }
      },
      unhover: {
        handler: function(component, element, target, event) {
          this.setState({ active: false });
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:Edge-4-f6f0d00477c629ea": {
        "scale.y": -1,
        r: 4.82759,
        "translation.y": 45.3853,
        "rotation.x": 3.141593,
        "rotation.z": 3.141593,
        "scale.x": -1,
        "translation.x": 45.385201,
        "scale.z": -1,
        cy: {
          "0": { value: 0, edited: true, curve: "easeInOutQuad" },
          "517": { value: 3.2, edited: true, curve: "easeInOutQuad" },
          "667": { value: 3.2, edited: true, curve: "easeOutQuad" },
          "1183": { value: 0, edited: true },
          "1683": { value: 0, edited: true, curve: "easeInQuad" },
          "2183": { value: 3.2, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 3.5, edited: true, curve: "easeInOutQuad" },
          "2833": { value: 0, edited: true }
        },
        cx: {
          "0": { value: 0, edited: true, curve: "easeInOutQuad" },
          "517": { value: -3.2, edited: true, curve: "easeInOutQuad" },
          "667": { value: -3.2, edited: true, curve: "easeOutQuad" },
          "1183": { value: 0, edited: true },
          "1683": { value: 0, edited: true, curve: "easeInQuad" },
          "2183": { value: -3.2, edited: true, curve: "easeInOutQuad" },
          "2350": { value: -3.5, edited: true, curve: "easeInOutQuad" },
          "2833": { value: 0, edited: true }
        },
        strokeWidth: {
          "0": { value: 0, edited: true },
          "517": { value: 0, edited: true, curve: "easeInOutQuad" },
          "833": { value: 1.5, edited: true },
          "2017": { value: 1.5, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 0, edited: true }
        },
        fillOpacity: {
          "0": { value: 1, edited: true },
          "517": { value: 1, edited: true, curve: "easeInOutQuad" },
          "833": { value: 0, edited: true },
          "2017": { value: 0, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 1, edited: true }
        }
      },
      "haiku:Feedbacktotransaction-15369686b3ae6e10": {
        "style.WebkitTapHighlightColor": "rgba(0,0,0,0)",
        "style.position": "relative",
        "style.overflowX": "visible",
        "style.overflowY": "visible",
        "sizeAbsolute.x": 58,
        "sizeAbsolute.y": 58,
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeMode.z": 1
      },
      "haiku:Feedback-dfdeb543f6ce0a70": {
        fill: "#00F2AC",
        stroke: "black",
        strokeWidth: 1.5
      },
      "haiku:Edge-8-b62adcd321421f34": {
        "scale.y": -1,
        r: 4.82759,
        "translation.y": 12.6148,
        "rotation.x": 3.141593,
        "rotation.z": 3.141593,
        "scale.x": -1,
        "translation.x": 12.6147,
        "scale.z": -1,
        cy: {
          "0": { value: 0, edited: true, curve: "easeInOutQuad" },
          "517": { value: -3.2, edited: true, curve: "easeInOutQuad" },
          "667": { value: -3.2, edited: true, curve: "easeOutQuad" },
          "1183": { value: 0, edited: true },
          "1683": { value: 0, edited: true, curve: "easeInQuad" },
          "2183": { value: -3.2, edited: true, curve: "easeInOutQuad" },
          "2350": { value: -3.2, edited: true, curve: "easeInOutQuad" },
          "2833": { value: 0, edited: true }
        },
        cx: {
          "0": { value: 0, edited: true, curve: "easeInOutQuad" },
          "517": { value: 3.2, edited: true, curve: "easeInOutQuad" },
          "667": { value: 3.2, edited: true, curve: "easeOutQuad" },
          "1183": { value: 0, edited: true },
          "1683": { value: 0, edited: true, curve: "easeInQuad" },
          "2183": { value: 3.2, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 3.2, edited: true, curve: "easeInOutQuad" },
          "2833": { value: 0, edited: true }
        },
        strokeWidth: {
          "0": { value: 0, edited: true },
          "517": { value: 0, edited: true, curve: "easeInOutQuad" },
          "833": { value: 1.5, edited: true },
          "2017": { value: 1.5, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 0, edited: true }
        },
        fillOpacity: {
          "0": { value: 1, edited: true },
          "517": { value: 1, edited: true, curve: "easeInOutQuad" },
          "833": { value: 0, edited: true },
          "2017": { value: 0, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 1, edited: true }
        }
      },
      "haiku:Edge-7-7c02671379f445a8": {
        "scale.y": -1,
        r: 4.82759,
        "translation.y": 29.000099,
        "rotation.x": 3.141593,
        "rotation.z": 3.141593,
        "scale.x": -1,
        "translation.x": 5.82759,
        "scale.z": -1,
        cy: {
          "0": { value: 0, edited: true },
          "667": { value: 0, edited: true },
          "1183": { value: 0, edited: true },
          "1683": { value: 0, edited: true },
          "2350": { value: 0, edited: true }
        },
        cx: {
          "0": { value: 0, edited: true, curve: "easeInOutQuad" },
          "517": { value: 4.5, edited: true, curve: "easeInOutQuad" },
          "667": { value: 4.5, edited: true, curve: "easeOutQuad" },
          "1183": { value: 0, edited: true },
          "1683": { value: 0, edited: true, curve: "easeInQuad" },
          "2183": { value: 4.5, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 4.5, edited: true, curve: "easeInOutQuad" },
          "2833": { value: 0, edited: true }
        },
        strokeWidth: {
          "0": { value: 0, edited: true },
          "517": { value: 0, edited: true, curve: "easeInOutQuad" },
          "833": { value: 1.5, edited: true },
          "2017": { value: 1.5, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 0, edited: true }
        },
        fillOpacity: {
          "0": { value: 1, edited: true },
          "517": { value: 1, edited: true, curve: "easeInOutQuad" },
          "833": { value: 0, edited: true },
          "2017": { value: 0, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 1, edited: true }
        }
      },
      "haiku:Edge-6-1ec28a281dd157c0": {
        "scale.y": -1,
        r: 4.82759,
        "translation.y": 45.3853,
        "rotation.x": 3.141593,
        "rotation.z": 3.141593,
        "scale.x": -1,
        "translation.x": 12.6147,
        "scale.z": -1,
        cy: {
          "0": { value: 0, edited: true, curve: "easeInOutQuad" },
          "517": { value: 3.2, edited: true, curve: "easeInOutQuad" },
          "667": { value: 3.2, edited: true, curve: "easeOutQuad" },
          "1183": { value: 0, edited: true },
          "1683": { value: 0, edited: true, curve: "easeInQuad" },
          "2183": { value: 3.2, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 3.5, edited: true, curve: "easeInOutQuad" },
          "2833": { value: 0, edited: true }
        },
        cx: {
          "0": { value: 0, edited: true, curve: "easeInOutQuad" },
          "517": { value: 3.2, edited: true, curve: "easeInOutQuad" },
          "667": { value: 3.2, edited: true, curve: "easeOutQuad" },
          "1183": { value: 0, edited: true },
          "1683": { value: 0, edited: true, curve: "easeInQuad" },
          "2183": { value: 3.2, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 3.5, edited: true, curve: "easeInOutQuad" },
          "2833": { value: 0, edited: true }
        },
        strokeWidth: {
          "0": { value: 0, edited: true },
          "517": { value: 0, edited: true, curve: "easeInOutQuad" },
          "833": { value: 1.5, edited: true },
          "2017": { value: 1.5, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 0, edited: true }
        },
        fillOpacity: {
          "0": { value: 1, edited: true },
          "517": { value: 1, edited: true, curve: "easeInOutQuad" },
          "833": { value: 0, edited: true },
          "2017": { value: 0, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 1, edited: true }
        }
      },
      "haiku:Edge-5-d7482b925ea9fb03": {
        "scale.y": -1,
        r: 4.82759,
        "translation.y": 52.172401,
        "rotation.x": 3.141593,
        "rotation.z": 3.141593,
        "scale.x": -1,
        "translation.x": 28.999901,
        "scale.z": -1,
        cy: {
          "0": { value: 0, edited: true, curve: "easeInOutQuad" },
          "517": { value: 4.5, edited: true, curve: "easeInOutQuad" },
          "667": { value: 4.5, edited: true, curve: "easeOutQuad" },
          "1183": { value: 0, edited: true },
          "1683": { value: 0, edited: true, curve: "easeInQuad" },
          "2183": { value: 4.5, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 5, edited: true, curve: "easeInOutQuad" },
          "2833": { value: 0, edited: true }
        },
        cx: {
          "0": { value: 0, edited: true },
          "667": { value: 0, edited: true },
          "1183": { value: 0, edited: true },
          "1683": { value: 0, edited: true },
          "2350": { value: 0, edited: true }
        },
        strokeWidth: {
          "0": { value: 0, edited: true },
          "517": { value: 0, edited: true, curve: "easeInOutQuad" },
          "833": { value: 1.5, edited: true },
          "2017": { value: 1.5, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 0, edited: true }
        },
        fillOpacity: {
          "0": { value: 1, edited: true },
          "517": { value: 1, edited: true, curve: "easeInOutQuad" },
          "833": { value: 0, edited: true },
          "2017": { value: 0, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 1, edited: true }
        }
      },
      "haiku:Feedback-Circles-362b4cf9ed3dd921": {
        "sizeMode.x": 1,
        fill: "none",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 58,
        "style.position": "absolute",
        "sizeAbsolute.y": 58,
        "sizeMode.y": 1,
        "translation.x": 29,
        "translation.y": 29,
        "style.zIndex": 2,
        opacity: 1
      },
      "haiku:Edge-3-125c4f56038d4511": {
        "scale.y": -1,
        r: 4.82759,
        "translation.y": 29.000099,
        "rotation.x": 3.141593,
        "rotation.z": 3.141593,
        "scale.x": -1,
        "translation.x": 52.172298,
        "scale.z": -1,
        cy: {
          "0": { value: 0, edited: true },
          "667": { value: 0, edited: true },
          "1183": { value: 0, edited: true },
          "1683": { value: 0, edited: true },
          "2350": { value: 0, edited: true }
        },
        cx: {
          "0": { value: 0, edited: true, curve: "easeInOutQuad" },
          "517": { value: -4.5, edited: true, curve: "easeInOutQuad" },
          "667": { value: -4.5, edited: true, curve: "easeOutQuad" },
          "1183": { value: 0, edited: true },
          "1683": { value: 0, edited: true, curve: "easeInQuad" },
          "2183": { value: -4.5, edited: true, curve: "easeInOutQuad" },
          "2350": { value: -5, edited: true, curve: "easeInOutQuad" },
          "2833": { value: 0, edited: true }
        },
        strokeWidth: {
          "0": { value: 0, edited: true },
          "517": { value: 0, edited: true, curve: "easeInOutQuad" },
          "833": { value: 1.5, edited: true },
          "2017": { value: 1.5, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 0, edited: true }
        },
        fillOpacity: {
          "0": { value: 1, edited: true },
          "517": { value: 1, edited: true, curve: "easeInOutQuad" },
          "833": { value: 0, edited: true },
          "2017": { value: 0, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 1, edited: true }
        }
      },
      "haiku:Edge-2-9fcbe5e2064596a6": {
        "scale.y": -1,
        r: 4.82759,
        "translation.y": 12.6148,
        "rotation.x": 3.141593,
        "rotation.z": 3.141593,
        "scale.x": -1,
        "translation.x": 45.385201,
        "scale.z": -1,
        cy: {
          "0": { value: 0, edited: true, curve: "easeInOutQuad" },
          "517": { value: -3.2, edited: true, curve: "easeInOutQuad" },
          "667": { value: -3.2, edited: true, curve: "easeOutQuad" },
          "1183": { value: 0, edited: true },
          "1683": { value: 0, edited: true, curve: "easeInQuad" },
          "2183": { value: -3.2, edited: true, curve: "easeInOutQuad" },
          "2350": { value: -3.5, edited: true, curve: "easeInOutQuad" },
          "2833": { value: 0, edited: true }
        },
        cx: {
          "0": { value: 0, edited: true, curve: "easeInOutQuad" },
          "517": { value: -3.2, edited: true, curve: "easeInOutQuad" },
          "667": { value: -3.2, edited: true, curve: "easeOutQuad" },
          "1183": { value: 0, edited: true },
          "1683": { value: 0, edited: true, curve: "easeInQuad" },
          "2183": { value: -3.2, edited: true, curve: "easeInOutQuad" },
          "2350": { value: -3.5, edited: true, curve: "easeInOutQuad" },
          "2833": { value: 0, edited: true }
        },
        strokeWidth: {
          "0": { value: 0, edited: true },
          "517": { value: 0, edited: true, curve: "easeInOutQuad" },
          "833": { value: 1.5, edited: true },
          "2017": { value: 1.5, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 0, edited: true }
        },
        fillOpacity: {
          "0": { value: 1, edited: true },
          "517": { value: 1, edited: true, curve: "easeInOutQuad" },
          "833": { value: 0, edited: true },
          "2017": { value: 0, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 1, edited: true }
        }
      },
      "haiku:Edge-1-27c8bec6723b96ab": {
        "scale.y": -1,
        r: 4.82759,
        "translation.y": 5.82769,
        "rotation.x": 3.141593,
        "rotation.z": 3.141593,
        "scale.x": -1,
        "translation.x": 28.999901,
        "scale.z": -1,
        cx: {
          "0": { value: 0, edited: true },
          "667": { value: 0, edited: true },
          "1183": { value: 0, edited: true },
          "1683": { value: 0, edited: true },
          "2350": { value: 0, edited: true }
        },
        cy: {
          "0": { value: 0, edited: true, curve: "easeInOutQuad" },
          "517": { value: -4.5, edited: true, curve: "easeInOutQuad" },
          "667": { value: -4.5, edited: true, curve: "easeOutQuad" },
          "1183": { value: 0, edited: true },
          "1683": { value: 0, edited: true, curve: "easeInQuad" },
          "2183": { value: -4.5, edited: true, curve: "easeInOutQuad" },
          "2350": { value: -5, edited: true, curve: "easeInOutQuad" },
          "2833": { value: 0, edited: true }
        },
        strokeWidth: {
          "0": { value: 0, edited: true },
          "517": { value: 0, edited: true, curve: "easeInOutQuad" },
          "833": { value: 1.5, edited: true },
          "2017": { value: 1.5, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 0, edited: true }
        },
        fillOpacity: {
          "0": { value: 1, edited: true },
          "517": { value: 1, edited: true, curve: "easeInOutQuad" },
          "833": { value: 0, edited: true },
          "2017": { value: 0, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 1, edited: true }
        }
      },
      "haiku:Feedback-Center-b2260114dce6a076": {
        "sizeMode.x": 1,
        fill: "none",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 58,
        "style.position": "absolute",
        "sizeAbsolute.y": 58,
        "sizeMode.y": 1,
        "translation.x": 29.000000000000007,
        "translation.y": 28.999999999999993,
        "style.zIndex": 1
      },
      "haiku:Center-Transaction-4f5408065d7aaf8d": {
        d: {
          "0": {
            value:
              "M42 29C42 36.1797 36.1797 42 29 42C21.8203 42 16 36.1797 16 29C16 21.8203 21.8203 16 29 16C36.1797 16 42 21.8203 42 29Z",
            edited: true
          },
          "667": {
            value:
              "M42 29C42 36.1797 36.1797 42 29 42C21.8203 42 16 36.1797 16 29C16 21.8203 21.8203 16 29 16C36.1797 16 42 21.8203 42 29Z",
            edited: true
          }
        },
        fill: "#00F2AC",
        fillOpacity: { "0": { value: 0, edited: true } }
      },
      "haiku:Subtract-5d503a991f544bad": {
        d: {
          "0": {
            value:
              "M42,29C42,36.1797,36.1797,42,29,42C21.8203,42,16,36.1797,16,29C16,21.8203,21.8203,16,29,16C36.1797,16,42,21.8203,42,29Z",
            edited: true
          },
          "667": {
            value:
              "M42,29C42,36.1797,36.1797,42,29,42C21.8203,42,16,36.1797,16,29C16,21.8203,21.8203,16,29,16C36.1797,16,42,21.8203,42,29Z",
            edited: true,
            curve: "easeOutQuad"
          },
          "1183": {
            value:
              "M41.6725 14.8432C40.4377 15.9356 38.8144 16.5986 37.0361 16.5986C33.3145 16.5986 30.2712 13.6943 30.0491 10.0285C29.7018 10.0096 29.352 10 29 10C28.6478 10 28.2979 10.0096 27.9504 10.0285C27.7282 13.6942 24.6849 16.5984 20.9634 16.5984C19.1853 16.5984 17.5621 15.9355 16.3274 14.8433C15.8058 15.3105 15.3102 15.8062 14.843 16.3278C15.9352 17.5625 16.5981 19.1858 16.5981 20.9639C16.5981 24.6854 13.6941 27.7285 10.0285 27.9509C10.0096 28.2982 10 28.648 10 29C10 29.352 10.0096 29.7018 10.0285 30.0491C13.6941 30.2715 16.5981 33.3146 16.5981 37.0361C16.5981 38.8142 15.9352 40.4375 14.843 41.6722C15.3101 42.1938 15.8057 42.6894 16.3273 43.1566C17.562 42.0643 19.1853 41.4014 20.9634 41.4014C24.685 41.4014 27.7283 44.3057 27.9504 47.9715C28.2979 47.9904 28.6478 48 29 48C29.352 48 29.7018 47.9904 30.0491 47.9715C30.2712 44.3057 33.3145 41.4014 37.0361 41.4014C38.8144 41.4014 40.4377 42.0644 41.6725 43.1568C42.194 42.6896 42.6896 42.194 43.1568 41.6725C42.0644 40.4377 41.4014 38.8144 41.4014 37.0361C41.4014 33.3145 44.3057 30.2712 47.9715 30.0491C47.9904 29.7018 48 29.352 48 29C48 28.6479 47.9904 28.298 47.9715 27.9506C44.3057 27.7286 41.4014 24.6853 41.4014 20.9636C41.4014 19.1854 42.0644 17.5621 43.1567 16.3274C42.6895 15.8059 42.194 15.3103 41.6725 14.8432Z",
            edited: true
          },
          "1683": {
            value:
              "M48,29C48,29.352,47.9904,29.7018,47.9715,30.0491C44.3057,30.2712,41.4014,33.3145,41.4014,37.0361C41.4014,38.8144,42.0644,40.4377,43.1568,41.6725C42.6896,42.194,42.194,42.6896,41.6725,43.1568C40.4377,42.0644,38.8144,41.4014,37.0361,41.4014C33.3145,41.4014,30.2712,44.3057,30.0491,47.9715C29.7018,47.9904,29.352,48,29,48C28.6478,48,28.2979,47.9904,27.9504,47.9715C27.7283,44.3057,24.685,41.4014,20.9634,41.4014C19.1853,41.4014,17.562,42.0643,16.3273,43.1566C15.8057,42.6894,15.3101,42.1938,14.843,41.6722C15.9352,40.4375,16.5981,38.8142,16.5981,37.0361C16.5981,33.3146,13.6941,30.2715,10.0285,30.0491C10.0096,29.7018,10,29.352,10,29C10,28.648,10.0096,28.2982,10.0285,27.9509C13.6941,27.7285,16.5981,24.6854,16.5981,20.9639C16.5981,19.1858,15.9352,17.5625,14.843,16.3278C15.3102,15.8062,15.8058,15.3105,16.3274,14.8433C17.5621,15.9355,19.1853,16.5984,20.9634,16.5984C24.6849,16.5984,27.7282,13.6942,27.9504,10.0285C28.2979,10.0096,28.6478,10,29,10C29.352,10,29.7018,10.0096,30.0491,10.0285C30.2712,13.6943,33.3145,16.5986,37.0361,16.5986C38.8144,16.5986,40.4377,15.9356,41.6725,14.8432C42.194,15.3103,42.6895,15.8059,43.1567,16.3274C42.0644,17.5621,41.4014,19.1854,41.4014,20.9636C41.4014,24.6853,44.3057,27.7286,47.9715,27.9506C47.9904,28.298,48,28.6479,48,29Z",
            edited: true,
            curve: "easeInQuad"
          },
          "2183": {
            value:
              "M42,29C42,36.1797,36.1797,42,29,42C21.8203,42,16,36.1797,16,29C16,21.8203,21.8203,16,29,16C36.1797,16,42,21.8203,42,29Z",
            edited: true
          }
        },
        fill: "#00F2AC",
        strokeWidth: {
          "0": { value: 1.5, edited: true },
          "517": { value: 1.5, edited: true, curve: "easeInOutQuad" },
          "833": { value: 0, edited: true },
          "2017": { value: 0, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 1.5, edited: true }
        },
        fillOpacity: {
          "0": { value: 0, edited: true },
          "517": { value: 0, edited: true, curve: "easeInOutQuad" },
          "833": { value: 1, edited: true },
          "2017": { value: 1, edited: true, curve: "easeInOutQuad" },
          "2350": { value: 0, edited: true }
        },
        stroke: { "0": { value: "black", edited: true } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: {
      "haiku-id": "Feedbacktotransaction-15369686b3ae6e10",
      "haiku-title": "Feedback"
    },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Feedback-Center-b2260114dce6a076",
          "haiku-title": "Feedback_center",
          "haiku-source":
            "designs/HvOfkaTSa2VYT0zbt1Q8Nw-BGS_haiku_ProductIdeas.figma.contents/slices/Feedback_center.svg#lock"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "Feedback-8210d1c3e3e8a87c",
              id: "Feedback"
            },
            children: [
              {
                elementName: "path",
                attributes: {
                  "haiku-id": "Center-Transaction-4f5408065d7aaf8d",
                  id: "Center Transaction"
                },
                children: []
              }
            ]
          },
          {
            elementName: "path",
            attributes: {
              "haiku-id": "Subtract-5d503a991f544bad",
              id: "Subtract"
            },
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
          "haiku-id": "Feedback-Circles-362b4cf9ed3dd921",
          "haiku-title": "Feedback_circles",
          "haiku-source":
            "designs/HvOfkaTSa2VYT0zbt1Q8Nw-BGS_haiku_ProductIdeas.figma.contents/slices/Feedback_circles.svg#lock"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "Feedback-dfdeb543f6ce0a70",
              id: "Feedback"
            },
            children: [
              {
                elementName: "circle",
                attributes: {
                  "haiku-id": "Edge-8-b62adcd321421f34",
                  id: "Edge 8"
                },
                children: []
              },
              {
                elementName: "circle",
                attributes: {
                  "haiku-id": "Edge-7-7c02671379f445a8",
                  id: "Edge 7"
                },
                children: []
              },
              {
                elementName: "circle",
                attributes: {
                  "haiku-id": "Edge-6-1ec28a281dd157c0",
                  id: "Edge 6"
                },
                children: []
              },
              {
                elementName: "circle",
                attributes: {
                  "haiku-id": "Edge-5-d7482b925ea9fb03",
                  id: "Edge 5"
                },
                children: []
              },
              {
                elementName: "circle",
                attributes: {
                  "haiku-id": "Edge-4-f6f0d00477c629ea",
                  id: "Edge 4"
                },
                children: []
              },
              {
                elementName: "circle",
                attributes: {
                  "haiku-id": "Edge-3-125c4f56038d4511",
                  id: "Edge 3"
                },
                children: []
              },
              {
                elementName: "circle",
                attributes: {
                  "haiku-id": "Edge-2-9fcbe5e2064596a6",
                  id: "Edge 2"
                },
                children: []
              },
              {
                elementName: "circle",
                attributes: {
                  "haiku-id": "Edge-1-27c8bec6723b96ab",
                  id: "Edge 1"
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