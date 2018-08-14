var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    uuid: "HAIKU_SHARE_UUID",
    type: "haiku",
    name: "haikudos",
    relpath: "code/main/code.js",
    version: "0.0.0",
    core: "3.5.2",
    player: "3.4.8",
    organization: "nacholibre",
    project: "haikudos",
    branch: "master",
    title: "Main",
    folder: "/Users/taylorpoe/.haiku/projects/nacholibre/haikudos",
    username: "taylorpoe+tacotruck@gmail.com",
    root: "HAIKU_CDN_PROJECT_ROOT"
  },
  options: {},
  states: {
    snapCount: { type: "number", value: 0, edited: true },
    randomer: { type: "number", value: 0, edited: true },
    randomer2: { type: "number", value: 0, edited: true },
    randomer3: { type: "string", value: "0", edited: true },
    randomer4: { type: "number", value: 0, edited: true },
    randomer5: { type: "number", value: 0, edited: true },
    randomer6: { type: "number", value: 0, edited: true },
    isMouseDown: { type: "boolean", value: false, edited: true },
    disable: { type: "boolean", value: false, edited: true }
  },
  eventHandlers: {
    "haiku:e4a9e4d8baa7": {
      "timeline:Default:48": {
        handler: function(component, element, target, event) {
          /** action logic goes here */ this.getDefaultTimeline().pause();
        }
      },
      "timeline:Default:1": {
        handler: function(component, element, target, event) {
          if (this.state.snapCount < 1) {
            this.getDefaultTimeline().pause();
          }

          this.setState({
            randomer: Math.random(),
            randomer2: Math.random(),
            randomer3: Math.random(),
            randomer4: Math.random(),
            randomer5: Math.random(),
            randomer6: Math.random()
          });
        }
      },
      mousedown: {
        handler: function(component, element, target, event) {
          if (!this.state.disable) {
            this.setState({
              snapCount: this.state.snapCount + 1,
              isMouseDown: true
            });
            this.emit("snap-count", this.state.snapCount);
            this.getDefaultTimeline().gotoAndPlay(0, "ms");
          }
        }
      },
      mouseup: {
        handler: function(component, element, target, event) {
          this.setState({ isMouseDown: false });
        }
      },
      "timeline:Default:28": {
        handler: function(component, element, target, event) {
          if (this.state.isMouseDown && !this.state.disable) {
            this.setState({ snapCount: this.state.snapCount + 1 });
            this.emit("snap-count", this.state.snapCount);
            this.getDefaultTimeline().gotoAndPlay(0, "ms");
          }
        }
      },
      mouseleave: {
        handler: function(component, element, target, event) {
          this.setState({ isMouseDown: false });
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:e4a9e4d8baa7": {
        "style.WebkitTapHighlightColor": "rgba(0,0,0,0)",
        "style.position": "relative",
        "style.overflowX": "hidden",
        "style.overflowY": "hidden",
        "sizeAbsolute.x": 226,
        "sizeAbsolute.y": 234,
        "sizeMode.x": 1,
        "sizeMode.y": 1,
        "sizeMode.z": 1,
        "style.backgroundColor": { "0": { value: "#212D31", edited: true } },
        opacity: {
          "0": { value: 1, edited: true },
          "950": { value: 1, edited: true }
        },
        "style.cursor": { "0": { value: "pointer", edited: true } }
      },
      "haiku:4c5136cab9e2": {
        viewBox: "0 0 152 119",
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 152,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 90,
        "sizeMode.y": 1,
        "translation.x": 111.988,
        "translation.y": 132,
        "style.zIndex": { "0": { value: 3, edited: true } },
        opacity: {
          "0": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 9 && snapCount < 20 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true
          }
        },
        "scale.x": {
          "0": { value: 1, edited: true, curve: "easeOutCirc" },
          "150": { value: 0.5, edited: true, curve: "easeOutElastic" },
          "400": { value: 1, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true, curve: "easeOutCirc" },
          "150": { value: 0.5, edited: true, curve: "easeOutBack" },
          "400": { value: 1, edited: true }
        }
      },
      "haiku:c3dda03a981e": {
        viewBox: "0 0 88 92",
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 88,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 92,
        "sizeMode.y": 1,
        "translation.x": 109.5,
        "translation.y": 121,
        "style.zIndex": 4,
        opacity: {
          "0": { value: 0, edited: true },
          "17": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 0 && snapCount < 10 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true
          },
          "150": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true, curve: "easeOutCirc" },
          "150": { value: 0.5, edited: true, curve: "easeOutElastic" },
          "400": { value: 1, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true, curve: "easeOutCirc" },
          "150": { value: 0.5, edited: true, curve: "easeOutBack" },
          "400": { value: 1, edited: true }
        }
      },
      "haiku:82ba04bd1d42": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 92,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 114,
        "sizeMode.y": 1,
        "translation.x": 112.256,
        "translation.y": 112.584,
        "style.zIndex": 5,
        opacity: {
          "0": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 0 && snapCount < 10 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true
          },
          "17": { value: 0, edited: true },
          "150": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 0 && snapCount < 10 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true
          }
        },
        "scale.x": {
          "0": { value: 1, edited: true, curve: "easeOutCirc" },
          "150": { value: 0.5, edited: true, curve: "easeOutElastic" },
          "400": { value: 1, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true, curve: "easeOutCirc" },
          "150": { value: 0.5, edited: true, curve: "easeOutBack" },
          "400": { value: 1, edited: true }
        }
      },
      "haiku:ba0f4f00e016": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 92,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 114,
        "sizeMode.y": 1,
        "translation.x": 112.144,
        "translation.y": 111.008,
        "style.zIndex": 6,
        opacity: {
          "0": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount == 0 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true
          }
        }
      },
      "haiku:71e06b847817": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 144,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 84,
        "sizeMode.y": 1,
        "translation.x": 112.056,
        "translation.y": 120.19999999999999,
        "style.zIndex": 7,
        opacity: {
          "0": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 19 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true
          }
        },
        "scale.x": {
          "0": { value: 1, edited: true, curve: "easeOutCirc" },
          "150": { value: 0.5, edited: true, curve: "easeOutElastic" },
          "400": { value: 1, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true, curve: "easeOutCirc" },
          "150": { value: 0.5, edited: true, curve: "easeOutBack" },
          "400": { value: 1, edited: true }
        }
      },
      "haiku:417f7f7c0958": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 48,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 48,
        "sizeMode.y": 1,
        "translation.x": 113,
        "translation.y": 123,
        "style.zIndex": { "0": { value: 1, edited: true } },
        "scale.x": {
          "0": { value: 1, edited: true },
          "33": { value: 0.97, edited: true, curve: "easeOutCirc" },
          "317": { value: 4.4, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "33": { value: 0.97, edited: true, curve: "easeOutCirc" },
          "317": { value: 4.4, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "33": { value: 1, edited: true },
          "233": { value: 1, edited: true, curve: "easeInCubic" },
          "333": { value: 0, edited: true }
        }
      },
      "haiku:d5e8a28fd485": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 48,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 48,
        "sizeMode.y": 1,
        "translation.x": 113,
        "translation.y": 123,
        "style.zIndex": { "0": { value: 2, edited: true } },
        "scale.x": {
          "0": { value: 1, edited: true },
          "33": { value: 0.8, edited: true },
          "183": { value: 0.7, edited: true, curve: "easeOutCirc" },
          "333": { value: 4.42, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "33": { value: 0.8, edited: true },
          "183": { value: 0.7, edited: true, curve: "easeOutCirc" },
          "333": { value: 4.42, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "183": { value: 0, edited: true, curve: "linear" },
          "200": { value: 1, edited: true },
          "333": { value: 0, edited: true }
        }
      },
      "haiku:453c1f257b90-cc12b9": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 16,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 15,
        "sizeMode.y": 1,
        "translation.x": {
          "0": { value: 113.5, edited: true },
          "283": { value: 113.5, edited: true, curve: "easeOutCubic" },
          "533": {
            edited: true,
            value: Haiku.inject(
              function(randomer2) {
                return 33 + randomer2 * 10;
              },
              "randomer2"
            )
          }
        },
        "translation.y": {
          "0": { value: 124, edited: true },
          "283": { value: 124, edited: true, curve: "easeOutCirc" },
          "533": { value: 49, edited: true }
        },
        "style.zIndex": 8,
        opacity: {
          "0": { value: 0, edited: true },
          "283": { value: 0, edited: true, curve: "linear" },
          "333": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 19 ? 0 : 1;
              },
              "snapCount"
            ),
            edited: true
          },
          "467": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 19 ? 0 : 1;
              },
              "snapCount"
            ),
            edited: true,
            curve: "linear"
          },
          "533": { value: 0, edited: true }
        },
        "translation.z": 0,
        "rotation.z": {
          "0": { value: 0, edited: true },
          "283": { value: 0, edited: true, curve: "linear" },
          "533": {
            edited: true,
            value: Haiku.inject(
              function(randomer2) {
                return 5 * randomer2;
              },
              "randomer2"
            )
          }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "433": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0.5, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "433": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0.5, edited: true }
        }
      },
      "haiku:453c1f257b90-d83906": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 16,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 15,
        "sizeMode.y": 1,
        "translation.x": {
          "0": { value: 113.5, edited: true },
          "283": { value: 113.5, edited: true, curve: "easeOutCubic" },
          "533": {
            edited: true,
            value: Haiku.inject(
              function(randomer) {
                return 23 + randomer * 20;
              },
              "randomer"
            )
          }
        },
        "translation.y": {
          "0": { value: 124, edited: true },
          "283": { value: 124, edited: true, curve: "easeOutCirc" },
          "533": { value: 178, edited: true }
        },
        "style.zIndex": 9,
        opacity: {
          "0": { value: 0, edited: true },
          "283": { value: 0, edited: true, curve: "linear" },
          "333": { value: 1, edited: true },
          "467": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0, edited: true }
        },
        "translation.z": 0,
        "rotation.z": {
          "0": { value: 0, edited: true },
          "283": { value: 0, edited: true, curve: "linear" },
          "533": {
            edited: true,
            value: Haiku.inject(
              function(randomer) {
                return 5 * randomer;
              },
              "randomer"
            )
          }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "433": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0.5, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "433": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0.5, edited: true }
        }
      },
      "haiku:453c1f257b90-d2e079": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 16,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 15,
        "sizeMode.y": 1,
        "translation.x": {
          "0": { value: 113.5, edited: true },
          "283": { value: 113.5, edited: true, curve: "easeOutCubic" },
          "533": {
            edited: true,
            value: Haiku.inject(
              function(randomer3) {
                return 98 + randomer3 * 40;
              },
              "randomer3"
            )
          }
        },
        "translation.y": {
          "0": { value: 124, edited: true },
          "283": { value: 124, edited: true, curve: "easeOutCirc" },
          "533": { value: 208, edited: true }
        },
        "style.zIndex": 10,
        opacity: {
          "0": { value: 0, edited: true },
          "283": { value: 0, edited: true, curve: "linear" },
          "333": { value: 1, edited: true },
          "467": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0, edited: true }
        },
        "translation.z": 0,
        "rotation.z": {
          "0": { value: 0, edited: true },
          "283": { value: 0, edited: true, curve: "linear" },
          "533": {
            edited: true,
            value: Haiku.inject(
              function(randomer3) {
                return 5 * randomer3;
              },
              "randomer3"
            )
          }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "433": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0.5, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "433": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0.5, edited: true }
        }
      },
      "haiku:453c1f257b90-785118": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 16,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 15,
        "sizeMode.y": 1,
        "translation.x": {
          "0": { value: 113.5, edited: true },
          "283": { value: 113.5, edited: true, curve: "easeOutCubic" },
          "533": {
            edited: true,
            value: Haiku.inject(
              function(randomer4) {
                return 98 + randomer4 * 40;
              },
              "randomer4"
            )
          }
        },
        "translation.y": {
          "0": { value: 124, edited: true },
          "283": { value: 124, edited: true, curve: "easeOutCirc" },
          "533": { value: 30, edited: true }
        },
        "style.zIndex": 11,
        opacity: {
          "0": { value: 0, edited: true },
          "283": { value: 0, edited: true, curve: "linear" },
          "333": { value: 1, edited: true },
          "467": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0, edited: true }
        },
        "translation.z": 0,
        "rotation.z": {
          "0": { value: 0, edited: true },
          "283": { value: 0, edited: true, curve: "linear" },
          "533": {
            edited: true,
            value: Haiku.inject(
              function(randomer4) {
                return 5 * randomer4;
              },
              "randomer4"
            )
          }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "433": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0.5, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "433": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0.5, edited: true }
        }
      },
      "haiku:453c1f257b90-927b8e": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 16,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 15,
        "sizeMode.y": 1,
        "translation.x": {
          "0": { value: 113.5, edited: true },
          "283": { value: 113.5, edited: true, curve: "easeOutCubic" },
          "533": {
            edited: true,
            value: Haiku.inject(
              function(randomer5) {
                return 188.5 + randomer5 * 10;
              },
              "randomer5"
            )
          }
        },
        "translation.y": {
          "0": { value: 124, edited: true },
          "283": { value: 124, edited: true, curve: "easeOutCirc" },
          "533": { value: 68, edited: true }
        },
        "style.zIndex": 12,
        opacity: {
          "0": { value: 0, edited: true },
          "283": { value: 0, edited: true, curve: "linear" },
          "333": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 19 ? 0 : 1;
              },
              "snapCount"
            ),
            edited: true
          },
          "467": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 19 ? 0 : 1;
              },
              "snapCount"
            ),
            edited: true,
            curve: "linear"
          },
          "533": { value: 0, edited: true }
        },
        "translation.z": 0,
        "rotation.z": {
          "0": { value: 0, edited: true },
          "283": { value: 0, edited: true, curve: "linear" },
          "533": {
            edited: true,
            value: Haiku.inject(
              function(randomer5) {
                return 5 * randomer5;
              },
              "randomer5"
            )
          }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "433": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0.5, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "433": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0.5, edited: true }
        }
      },
      "haiku:453c1f257b90-3bc74e": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 16,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 15,
        "sizeMode.y": 1,
        "translation.x": {
          "0": { value: 113.5, edited: true },
          "283": { value: 113.5, edited: true, curve: "easeOutCubic" },
          "533": {
            edited: true,
            value: Haiku.inject(
              function(randomer6) {
                return 188.5 + randomer6 * 14;
              },
              "randomer6"
            )
          }
        },
        "translation.y": {
          "0": { value: 124, edited: true },
          "283": { value: 124, edited: true, curve: "easeOutCirc" },
          "533": { value: 168, edited: true }
        },
        "style.zIndex": 13,
        opacity: {
          "0": { value: 0, edited: true },
          "283": { value: 0, edited: true, curve: "linear" },
          "333": { value: 1, edited: true },
          "467": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0, edited: true }
        },
        "translation.z": 0,
        "rotation.z": {
          "0": { value: 0, edited: true },
          "283": { value: 0, edited: true, curve: "linear" },
          "533": {
            edited: true,
            value: Haiku.inject(
              function(randomer6) {
                return 5 * randomer6;
              },
              "randomer6"
            )
          }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "433": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0.5, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "433": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0.5, edited: true }
        }
      },
      "haiku:6e2200b55397": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 12,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 26,
        "sizeMode.y": 1,
        "translation.x": {
          "0": { value: 141, edited: true },
          "283": { value: 136, edited: true }
        },
        "translation.y": {
          "0": { value: 52, edited: true },
          "283": { value: 64, edited: true, curve: "easeOutCubic" },
          "533": { value: 19, edited: true }
        },
        "style.zIndex": 14,
        "rotation.x": {
          "0": { value: 1, edited: true },
          "283": { value: 0, edited: true }
        },
        "rotation.z": {
          "0": { value: 1, edited: true },
          "283": { value: -0.1, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "283": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 19 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true
          },
          "467": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 19 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true,
            curve: "linear"
          },
          "533": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "433": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0.5, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "433": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0.5, edited: true }
        }
      },
      "haiku:6e2200b55397-fd4654": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 12,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 26,
        "sizeMode.y": 1,
        "translation.x": {
          "0": { value: 141, edited: true },
          "433": { value: 136, edited: true }
        },
        "translation.y": {
          "0": { value: 52, edited: true },
          "433": { value: 64, edited: true, curve: "easeOutCubic" },
          "683": { value: 19, edited: true }
        },
        "style.zIndex": 14,
        "rotation.x": {
          "0": { value: 1, edited: true },
          "433": { value: 0, edited: true }
        },
        "rotation.z": {
          "0": { value: 1, edited: true },
          "433": { value: -0.1, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "433": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 19 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true
          },
          "617": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 19 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true,
            curve: "linear"
          },
          "683": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "583": { value: 1, edited: true, curve: "linear" },
          "683": { value: 0.5, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "583": { value: 1, edited: true, curve: "linear" },
          "683": { value: 0.5, edited: true }
        }
      },
      "haiku:6e2200b55397-f9680b": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 12,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 26,
        "sizeMode.y": 1,
        "translation.x": {
          "0": { value: 141, edited: true },
          "283": { value: 179, edited: true }
        },
        "translation.y": {
          "0": { value: 52, edited: true },
          "283": { value: 83, edited: true, curve: "easeOutCubic" },
          "533": { value: 43, edited: true }
        },
        "style.zIndex": 14,
        "rotation.x": {
          "0": { value: 1, edited: true },
          "283": { value: 0, edited: true }
        },
        "rotation.z": {
          "0": { value: 1, edited: true },
          "283": { value: 0, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "283": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 19 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true
          },
          "467": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 19 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true,
            curve: "linear"
          },
          "533": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "433": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0.5, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "433": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0.5, edited: true }
        }
      },
      "haiku:6e2200b55397-f9680b-5e5fa1": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 12,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 26,
        "sizeMode.y": 1,
        "translation.x": {
          "0": { value: 141, edited: true },
          "433": { value: 179, edited: true }
        },
        "translation.y": {
          "0": { value: 52, edited: true },
          "433": { value: 83, edited: true, curve: "easeOutCubic" },
          "683": { value: 43, edited: true }
        },
        "style.zIndex": 14,
        "rotation.x": {
          "0": { value: 1, edited: true },
          "433": { value: 0, edited: true }
        },
        "rotation.z": {
          "0": { value: 1, edited: true },
          "433": { value: 0, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "433": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 19 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true
          },
          "617": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 19 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true,
            curve: "linear"
          },
          "683": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "583": { value: 1, edited: true, curve: "linear" },
          "683": { value: 0.5, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "583": { value: 1, edited: true, curve: "linear" },
          "683": { value: 0.5, edited: true }
        }
      },
      "haiku:6e2200b55397-f9680b-c06fe9": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 12,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 26,
        "sizeMode.y": 1,
        "translation.x": {
          "0": { value: 141, edited: true },
          "283": { value: 44, edited: true }
        },
        "translation.y": {
          "0": { value: 52, edited: true },
          "283": { value: 83, edited: true, curve: "easeOutCubic" },
          "533": { value: 43, edited: true }
        },
        "style.zIndex": 14,
        "rotation.x": {
          "0": { value: 1, edited: true },
          "283": { value: 0, edited: true }
        },
        "rotation.z": {
          "0": { value: 1, edited: true },
          "283": { value: -0.3, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "283": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 19 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true
          },
          "467": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 19 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true,
            curve: "linear"
          },
          "533": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "433": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0.5, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "433": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0.5, edited: true }
        }
      },
      "haiku:6e2200b55397-f9680b-5e5fa1-1a3ff5": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 12,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 26,
        "sizeMode.y": 1,
        "translation.x": {
          "0": { value: 141, edited: true },
          "433": { value: 44, edited: true }
        },
        "translation.y": {
          "0": { value: 52, edited: true },
          "433": { value: 83, edited: true, curve: "easeOutCubic" },
          "683": { value: 43, edited: true }
        },
        "style.zIndex": 14,
        "rotation.x": {
          "0": { value: 1, edited: true },
          "433": { value: 0, edited: true }
        },
        "rotation.z": {
          "0": { value: 1, edited: true },
          "433": { value: -0.3, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "433": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 19 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true
          },
          "617": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 19 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true,
            curve: "linear"
          },
          "683": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "583": { value: 1, edited: true, curve: "linear" },
          "683": { value: 0.5, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "583": { value: 1, edited: true, curve: "linear" },
          "683": { value: 0.5, edited: true }
        }
      },
      "haiku:6e2200b55397-4e0585": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 12,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 26,
        "sizeMode.y": 1,
        "translation.x": {
          "0": { value: 141, edited: true },
          "283": { value: 89, edited: true }
        },
        "translation.y": {
          "0": { value: 52, edited: true },
          "283": { value: 64, edited: true, curve: "easeOutCubic" },
          "533": { value: 19, edited: true }
        },
        "style.zIndex": 14,
        "rotation.x": {
          "0": { value: 1, edited: true },
          "283": { value: 0, edited: true }
        },
        "rotation.z": {
          "0": { value: 1, edited: true },
          "283": { value: -0.2, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "283": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 19 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true
          },
          "467": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 19 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true,
            curve: "linear"
          },
          "533": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "433": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0.5, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "433": { value: 1, edited: true, curve: "linear" },
          "533": { value: 0.5, edited: true }
        },
        "translation.z": {
          "0": { value: -0.2, edited: true },
          "283": { value: 0, edited: true }
        }
      },
      "haiku:6e2200b55397-fd4654-e02193": {
        "style.position": "absolute",
        "style.margin": "0",
        "style.padding": "0",
        "style.border": "0",
        "sizeAbsolute.x": 12,
        "sizeMode.x": 1,
        "sizeAbsolute.y": 26,
        "sizeMode.y": 1,
        "translation.x": {
          "0": { value: 141, edited: true },
          "433": { value: 89, edited: true }
        },
        "translation.y": {
          "0": { value: 52, edited: true },
          "433": { value: 64, edited: true, curve: "easeOutCubic" },
          "683": { value: 19, edited: true }
        },
        "style.zIndex": 14,
        "rotation.x": {
          "0": { value: 1, edited: true },
          "400": { value: 0, edited: true }
        },
        "rotation.z": {
          "0": { value: 1, edited: true },
          "400": { value: -0.1, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "433": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 19 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true
          },
          "617": {
            value: Haiku.inject(
              function(snapCount) {
                return snapCount > 19 ? 1 : 0;
              },
              "snapCount"
            ),
            edited: true,
            curve: "linear"
          },
          "683": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "583": { value: 1, edited: true, curve: "linear" },
          "683": { value: 0.5, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "583": { value: 1, edited: true, curve: "linear" },
          "683": { value: 0.5, edited: true }
        }
      },
      "haiku:Page-1-2e00ca3304e470ac": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Artboard-b0a02373fa17c64c": {
        fill: "#E4EBEE",
        "translation.x": -942,
        "translation.y": -95
      },
      "haiku:bolt-6b10e4f532972ae2": {
        d: "M945.695257,109.648607 L941.899964,118.227109 C941.761128,118.960164 942.042693,119.171765 942.74466,118.861911 C942.738598,118.87576 946.792484,115.009908 954.906317,107.264355 C955.088585,106.804792 955.00489,106.575011 954.655233,106.575011 C954.305575,106.575011 952.856349,106.575011 950.307555,106.575011 L954.241719,97.5656936 C954.130746,97.0399729 953.871947,96.8806814 953.465322,97.0878193 C953.418068,97.1862689 949.292887,101.107286 941.089779,108.85087 C940.91006,109.315486 941.000161,109.581398 941.360082,109.648607 C941.405615,109.641781 942.850673,109.641781 945.695257,109.648607 Z",
        "translation.x": 38.031,
        "translation.y": 394.923,
        "rotation.z": 5.864
      },
      "haiku:Page-1-572e5f64a8061e0a": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Artboard-ef6f49e8876b11de": {
        fill: "#E4EBEE",
        "translation.x": -942,
        "translation.y": -95
      },
      "haiku:bolt-d09443672579d088": {
        d: "M945.695257,109.648607 L941.899964,118.227109 C941.761128,118.960164 942.042693,119.171765 942.74466,118.861911 C942.738598,118.87576 946.792484,115.009908 954.906317,107.264355 C955.088585,106.804792 955.00489,106.575011 954.655233,106.575011 C954.305575,106.575011 952.856349,106.575011 950.307555,106.575011 L954.241719,97.5656936 C954.130746,97.0399729 953.871947,96.8806814 953.465322,97.0878193 C953.418068,97.1862689 949.292887,101.107286 941.089779,108.85087 C940.91006,109.315486 941.000161,109.581398 941.360082,109.648607 C941.405615,109.641781 942.850673,109.641781 945.695257,109.648607 Z",
        "translation.x": 38.031,
        "translation.y": 394.923,
        "rotation.z": 5.864
      },
      "haiku:Page-1-cf15f2cf7bb94f3a": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Artboard-01176ee47292dde8": {
        fill: "#E4EBEE",
        "translation.x": -942,
        "translation.y": -95
      },
      "haiku:bolt-8635e8fc72141c15": {
        d: "M945.695257,109.648607 L941.899964,118.227109 C941.761128,118.960164 942.042693,119.171765 942.74466,118.861911 C942.738598,118.87576 946.792484,115.009908 954.906317,107.264355 C955.088585,106.804792 955.00489,106.575011 954.655233,106.575011 C954.305575,106.575011 952.856349,106.575011 950.307555,106.575011 L954.241719,97.5656936 C954.130746,97.0399729 953.871947,96.8806814 953.465322,97.0878193 C953.418068,97.1862689 949.292887,101.107286 941.089779,108.85087 C940.91006,109.315486 941.000161,109.581398 941.360082,109.648607 C941.405615,109.641781 942.850673,109.641781 945.695257,109.648607 Z",
        "translation.x": 38.031,
        "translation.y": 394.923,
        "rotation.z": 5.864
      },
      "haiku:Page-1-8e4e0e9c291a4d9b": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Artboard-1129ed4d2f60d121": {
        fill: "#E4EBEE",
        "translation.x": -942,
        "translation.y": -95
      },
      "haiku:bolt-2a3984a02f279ed9": {
        d: "M945.695257,109.648607 L941.899964,118.227109 C941.761128,118.960164 942.042693,119.171765 942.74466,118.861911 C942.738598,118.87576 946.792484,115.009908 954.906317,107.264355 C955.088585,106.804792 955.00489,106.575011 954.655233,106.575011 C954.305575,106.575011 952.856349,106.575011 950.307555,106.575011 L954.241719,97.5656936 C954.130746,97.0399729 953.871947,96.8806814 953.465322,97.0878193 C953.418068,97.1862689 949.292887,101.107286 941.089779,108.85087 C940.91006,109.315486 941.000161,109.581398 941.360082,109.648607 C941.405615,109.641781 942.850673,109.641781 945.695257,109.648607 Z",
        "translation.x": 38.031,
        "translation.y": 394.923,
        "rotation.z": 5.864
      },
      "haiku:Page-1-0c76a00c76f50b8f": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Artboard-f7e5396e9b095d81": {
        fill: "#E4EBEE",
        "translation.x": -942,
        "translation.y": -95
      },
      "haiku:bolt-e07fca6dbdef1811": {
        d: "M945.695257,109.648607 L941.899964,118.227109 C941.761128,118.960164 942.042693,119.171765 942.74466,118.861911 C942.738598,118.87576 946.792484,115.009908 954.906317,107.264355 C955.088585,106.804792 955.00489,106.575011 954.655233,106.575011 C954.305575,106.575011 952.856349,106.575011 950.307555,106.575011 L954.241719,97.5656936 C954.130746,97.0399729 953.871947,96.8806814 953.465322,97.0878193 C953.418068,97.1862689 949.292887,101.107286 941.089779,108.85087 C940.91006,109.315486 941.000161,109.581398 941.360082,109.648607 C941.405615,109.641781 942.850673,109.641781 945.695257,109.648607 Z",
        "translation.x": 38.031,
        "translation.y": 394.923,
        "rotation.z": 5.864
      },
      "haiku:Page-1-272b13dfe402474f": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Artboard-79a3276b47973541": {
        fill: "#E4EBEE",
        "translation.x": -942,
        "translation.y": -95
      },
      "haiku:bolt-cfcaceacf3ecb77d": {
        d: "M945.695257,109.648607 L941.899964,118.227109 C941.761128,118.960164 942.042693,119.171765 942.74466,118.861911 C942.738598,118.87576 946.792484,115.009908 954.906317,107.264355 C955.088585,106.804792 955.00489,106.575011 954.655233,106.575011 C954.305575,106.575011 952.856349,106.575011 950.307555,106.575011 L954.241719,97.5656936 C954.130746,97.0399729 953.871947,96.8806814 953.465322,97.0878193 C953.418068,97.1862689 949.292887,101.107286 941.089779,108.85087 C940.91006,109.315486 941.000161,109.581398 941.360082,109.648607 C941.405615,109.641781 942.850673,109.641781 945.695257,109.648607 Z",
        "translation.x": 38.031,
        "translation.y": 394.923,
        "rotation.z": 5.864
      },
      "haiku:Page-1-b18f11c311698bb1": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Artboard-f0201369ec478486": {
        fill: "#E4EBEE",
        "translation.x": -942,
        "translation.y": -95
      },
      "haiku:bolt-086fe5199463d456": {
        d: "M945.695257,109.648607 L941.899964,118.227109 C941.761128,118.960164 942.042693,119.171765 942.74466,118.861911 C942.738598,118.87576 946.792484,115.009908 954.906317,107.264355 C955.088585,106.804792 955.00489,106.575011 954.655233,106.575011 C954.305575,106.575011 952.856349,106.575011 950.307555,106.575011 L954.241719,97.5656936 C954.130746,97.0399729 953.871947,96.8806814 953.465322,97.0878193 C953.418068,97.1862689 949.292887,101.107286 941.089779,108.85087 C940.91006,109.315486 941.000161,109.581398 941.360082,109.648607 C941.405615,109.641781 942.850673,109.641781 945.695257,109.648607 Z",
        "translation.x": 38.031,
        "translation.y": 394.923,
        "rotation.z": 5.864
      },
      "haiku:Page-1-fc1add7bf1df6600": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Artboard-fd357a417ffc163a": {
        fill: "#E4EBEE",
        "translation.x": -942,
        "translation.y": -95
      },
      "haiku:bolt-b5b6277da555a977": {
        d: "M945.695257,109.648607 L941.899964,118.227109 C941.761128,118.960164 942.042693,119.171765 942.74466,118.861911 C942.738598,118.87576 946.792484,115.009908 954.906317,107.264355 C955.088585,106.804792 955.00489,106.575011 954.655233,106.575011 C954.305575,106.575011 952.856349,106.575011 950.307555,106.575011 L954.241719,97.5656936 C954.130746,97.0399729 953.871947,96.8806814 953.465322,97.0878193 C953.418068,97.1862689 949.292887,101.107286 941.089779,108.85087 C940.91006,109.315486 941.000161,109.581398 941.360082,109.648607 C941.405615,109.641781 942.850673,109.641781 945.695257,109.648607 Z",
        "translation.x": 38.031,
        "translation.y": 394.923,
        "rotation.z": 5.864
      },
      "haiku:Page-1-67f2867a44ddca23": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Artboard-30fb693796a20b88": {
        fill: "#5EE4FB",
        "translation.x": -1068,
        "translation.y": -164
      },
      "haiku:confetti-fdb5b2178dbf60e1": {
        points: "1068 164 1075.66731 179.061099 1083.33461 164"
      },
      "haiku:Page-1-aa46e17d8359abf9": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Artboard-ad9221503224a5a9": {
        fill: "#5EE4FB",
        "translation.x": -1068,
        "translation.y": -164
      },
      "haiku:confetti-686f83394ef9c613": {
        points: "1068 164 1075.66731 179.061099 1083.33461 164"
      },
      "haiku:Page-1-86409bf99058ae4c": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Artboard-39e15359ef6433f7": {
        fill: "#5EE4FB",
        "translation.x": -1068,
        "translation.y": -164
      },
      "haiku:confetti-1f3bb2b1d6362366": {
        points: "1068 164 1075.66731 179.061099 1083.33461 164"
      },
      "haiku:Page-1-7488b89122dd386c": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Artboard-412ed1d8fca1f020": {
        fill: "#5EE4FB",
        "translation.x": -1068,
        "translation.y": -164
      },
      "haiku:confetti-756afc1afbc0684e": {
        points: "1068 164 1075.66731 179.061099 1083.33461 164"
      },
      "haiku:Page-1-a190a4ec442884b2": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Artboard-0dbfb1c4a4ac53f2": {
        fill: "#5EE4FB",
        "translation.x": -1068,
        "translation.y": -164
      },
      "haiku:confetti-6b8b0955d10eb059": {
        points: "1068 164 1075.66731 179.061099 1083.33461 164"
      },
      "haiku:Page-1-8d4f77be74c7847f": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Artboard-3f4aa78231c295f6": {
        fill: "#5EE4FB",
        "translation.x": -1068,
        "translation.y": -164
      },
      "haiku:confetti-39a93345fa3592f5": {
        points: "1068 164 1075.66731 179.061099 1083.33461 164"
      },
      "haiku:Page-1-d0bb20b7d2028ce3": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Artboard-173552c10d0b8a57": {
        "translation.x": -610,
        "translation.y": -122
      },
      "haiku:hands_up-4d0253fe7483c4c7": {
        "translation.x": 613,
        "translation.y": 126
      },
      "haiku:Combined-Shape-6ebfc0936a6c96ae": {
        d: "M39.8640742,82.7114312 C37.3579129,83.4742905 33.8155514,83.7365832 29.2249434,83.653739 C27.2126006,83.6174233 25.1767028,83.521426 22.5583228,83.3577999 C21.9867962,83.3220845 20.1235148,83.2012179 19.7847319,83.1799557 C18.8400705,83.1206682 18.1948281,83.0856585 17.6790945,83.0676041 C12.7622432,82.8954788 8.79063594,79.7465923 5.62483641,74.4362875 C3.36565275,70.6467381 1.67151792,66.0801357 0.293537711,60.8858735 C-0.374786202,58.3666432 -0.95823353,49.8715285 -0.888240435,42.9904593 C-0.847377936,38.973239 -0.599732981,35.6549402 -0.117607978,33.3593138 C0.183275589,31.926664 0.576294962,30.8508727 1.15455594,30.0983896 C2.00649208,28.9897769 3.29869249,28.6142814 4.53511824,29.1730559 C4.6611797,29.1515349 4.8284301,29.1141782 5.03059933,29.0602525 C5.66785011,28.8902752 6.56231336,28.582077 7.76514691,28.1213514 C9.11534181,27.6041813 15.1527785,25.1396526 16.3441755,24.6672492 C17.9176762,24.0433371 19.3365025,23.5003606 20.6912205,23.0080015 C25.9431067,21.0992545 30.0396469,20.0226396 33.2133933,19.9007235 C34.6405336,19.8459014 35.9029993,20.0021261 36.9598639,20.3738656 L36.9598237,11.1120208 C36.9598151,7.57795069 39.824738,4.71301381 43.3589799,4.7130052 L43.6790119,4.71303527 C47.1263067,4.71304739 49.9540066,7.44390303 50.0741036,10.8891053 C50.5270397,23.8824062 50.7534157,32.1801998 50.7534157,35.8116635 C50.7534157,38.8335484 51.1080267,42.3120235 51.8201608,46.2425427 C54.5574515,44.950689 57.5965151,43.562601 60.9376981,42.0780636 C64.210967,40.623684 68.0434795,42.0981994 69.497845,45.3714761 C69.650474,45.7149915 69.772949,46.071126 69.8638867,46.4358571 C71.0125363,51.042839 69.1747758,55.8782295 65.2561908,58.5593272 C62.6370893,60.3513371 59.0839341,62.5181963 54.5895161,65.0661118 L54.3951428,65.1763034 L54.1795815,65.2350955 C53.8773068,65.3175379 53.3876868,66.0644524 52.7070219,67.8778161 C52.5207062,68.3741808 51.7964381,70.4191786 51.8352845,70.311075 C51.442441,71.4042984 51.1113771,72.2594991 50.7431289,73.1019566 C48.4689803,78.3046254 45.2277976,81.5759621 39.8640742,82.7114312 Z",
        stroke: "#F26798",
        strokeWidth: 3.56400008,
        fill: "#212D31"
      },
      "haiku:Rectangle-4-e38ecdfd6387aa3a": {
        stroke: "#F26798",
        strokeWidth: 3.56400008,
        fill: "#212D31",
        x: -0.741346305,
        y: 20.1297136,
        width: 13.0185455,
        height: 31.9889201,
        rx: 6.50927277
      },
      "haiku:Rectangle-4-Copy-078e58f50c34bf6e": {
        stroke: "#F26798",
        strokeWidth: 3.56400008,
        fill: "#212D31",
        x: 11.796676,
        y: 5.91577144,
        width: 13.0185455,
        height: 44.1035109,
        rx: 6.50927277
      },
      "haiku:snap_finger-dbbf52586afc9f1a": {
        stroke: "#F26798",
        strokeWidth: 3.56400008,
        fill: "#212D31",
        x: 24.092274,
        y: -1.72745145,
        width: 12.7761213,
        height: 44.1035109,
        rx: 6.38806064
      },
      "haiku:Path-15-5f5d7d8c94cfaf62": {
        d: "M41.461307,26.9824672 L2.79351663,43.0550496 L1.05834157,45.9431478 C0.99676867,49.0319577 1.05136296,51.3407237 1.22212445,52.8694459 C1.39288594,54.3981681 1.77248827,55.8051428 2.36093144,57.0903701 L39.955065,47.0037271 L41.461307,26.9824672 Z",
        fill: "#142E34"
      },
      "haiku:Rectangle-20-01aebdbaf0b61b2a": {
        d: "M10.0122781,38.5470518 L13.5718288,38.5470518 L13.5718288,40.0148012 C13.5718288,40.997744 12.7749962,41.7945766 11.7920535,41.7945766 L11.7920535,41.7945766 C10.8091107,41.7945766 10.0122781,40.997744 10.0122781,40.0148012 L10.0122781,38.5470518 Z",
        fill: "#F26798"
      },
      "haiku:Rectangle-20-Copy-3-f64936c335984685": {
        d: "M22.3082753,33.188631 L25.867826,33.188631 L25.867826,34.6563804 C25.867826,35.6393232 25.0709934,36.4361558 24.0880507,36.4361558 L24.0880507,36.4361558 C23.1051079,36.4361558 22.3082753,35.6393232 22.3082753,34.6563804 L22.3082753,33.188631 Z",
        fill: "#F26798"
      },
      "haiku:Rectangle-20-Copy-4-b9f56023bbeb6164": {
        d: "M35.0909298,27.9925964 L38.6504805,27.9925964 L38.6504805,29.4603458 C38.6504805,30.4432886 37.8536479,31.2401211 36.8707052,31.2401211 L36.8707052,31.2401211 C35.8877624,31.2401211 35.0909298,30.4432886 35.0909298,29.4603458 L35.0909298,27.9925964 Z",
        fill: "#F26798"
      },
      "haiku:right-a832e0223ce6abca": {
        "translation.x": 146,
        "scale.x": -1,
        "scale.z": -1
      },
      "haiku:Combined-Shape-7bb79030cb8bbcdd": {
        d: "M39.8640742,82.7114312 C37.3579129,83.4742905 33.8155514,83.7365832 29.2249434,83.653739 C27.2126006,83.6174233 25.1767028,83.521426 22.5583228,83.3577999 C21.9867962,83.3220845 20.1235148,83.2012179 19.7847319,83.1799557 C18.8400705,83.1206682 18.1948281,83.0856585 17.6790945,83.0676041 C12.7622432,82.8954788 8.79063594,79.7465923 5.62483641,74.4362875 C3.36565275,70.6467381 1.67151792,66.0801357 0.293537711,60.8858735 C-0.374786202,58.3666432 -0.95823353,49.8715285 -0.888240435,42.9904593 C-0.847377936,38.973239 -0.599732981,35.6549402 -0.117607978,33.3593138 C0.183275589,31.926664 0.576294962,30.8508727 1.15455594,30.0983896 C2.00649208,28.9897769 3.29869249,28.6142814 4.53511824,29.1730559 C4.6611797,29.1515349 4.8284301,29.1141782 5.03059933,29.0602525 C5.66785011,28.8902752 6.56231336,28.582077 7.76514691,28.1213514 C9.11534181,27.6041813 15.1527785,25.1396526 16.3441755,24.6672492 C17.9176762,24.0433371 19.3365025,23.5003606 20.6912205,23.0080015 C25.9431067,21.0992545 30.0396469,20.0226396 33.2133933,19.9007235 C34.6405336,19.8459014 35.9029993,20.0021261 36.9598639,20.3738656 L36.9598237,11.1120208 C36.9598151,7.57795069 39.824738,4.71301381 43.3589799,4.7130052 L43.6790119,4.71303527 C47.1263067,4.71304739 49.9540066,7.44390303 50.0741036,10.8891053 C50.5270397,23.8824062 50.7534157,32.1801998 50.7534157,35.8116635 C50.7534157,38.8335484 51.1080267,42.3120235 51.8201608,46.2425427 C54.5574515,44.950689 57.5965151,43.562601 60.9376981,42.0780636 C64.210967,40.623684 68.0434795,42.0981994 69.497845,45.3714761 C69.650474,45.7149915 69.772949,46.071126 69.8638867,46.4358571 C71.0125363,51.042839 69.1747758,55.8782295 65.2561908,58.5593272 C62.6370893,60.3513371 59.0839341,62.5181963 54.5895161,65.0661118 L54.3951428,65.1763034 L54.1795815,65.2350955 C53.8773068,65.3175379 53.3876868,66.0644524 52.7070219,67.8778161 C52.5207062,68.3741808 51.7964381,70.4191786 51.8352845,70.311075 C51.442441,71.4042984 51.1113771,72.2594991 50.7431289,73.1019566 C48.4689803,78.3046254 45.2277976,81.5759621 39.8640742,82.7114312 Z",
        stroke: "#F26798",
        strokeWidth: 3.56400008,
        fill: "#212D31"
      },
      "haiku:Rectangle-4-39bab4445f049ee1": {
        stroke: "#F26798",
        strokeWidth: 3.56400008,
        fill: "#212D31",
        x: -0.741346305,
        y: 20.1297136,
        width: 13.0185455,
        height: 31.9889201,
        rx: 6.50927277
      },
      "haiku:Rectangle-4-Copy-5a029f31daa38e28": {
        stroke: "#F26798",
        strokeWidth: 3.56400008,
        fill: "#212D31",
        x: 11.796676,
        y: 5.91577144,
        width: 13.0185455,
        height: 44.1035109,
        rx: 6.50927277
      },
      "haiku:snap_finger-b515a61054170673": {
        stroke: "#F26798",
        strokeWidth: 3.56400008,
        fill: "#212D31",
        x: 24.092274,
        y: -1.72745145,
        width: 12.7761213,
        height: 44.1035109,
        rx: 6.38806064
      },
      "haiku:Path-15-023c474bf79038f9": {
        d: "M41.461307,26.9824672 L2.79351663,43.0550496 L1.05834157,45.9431478 C0.99676867,49.0319577 1.05136296,51.3407237 1.22212445,52.8694459 C1.39288594,54.3981681 1.77248827,55.8051428 2.36093144,57.0903701 L39.955065,47.0037271 L41.461307,26.9824672 Z",
        fill: "#142E34"
      },
      "haiku:Rectangle-20-f0eab26c694e86af": {
        d: "M10.0122781,38.5470518 L13.5718288,38.5470518 L13.5718288,40.0148012 C13.5718288,40.997744 12.7749962,41.7945766 11.7920535,41.7945766 L11.7920535,41.7945766 C10.8091107,41.7945766 10.0122781,40.997744 10.0122781,40.0148012 L10.0122781,38.5470518 Z",
        fill: "#F26798"
      },
      "haiku:Rectangle-20-Copy-3-37a47caaa2c72108": {
        d: "M22.3082753,33.188631 L25.867826,33.188631 L25.867826,34.6563804 C25.867826,35.6393232 25.0709934,36.4361558 24.0880507,36.4361558 L24.0880507,36.4361558 C23.1051079,36.4361558 22.3082753,35.6393232 22.3082753,34.6563804 L22.3082753,33.188631 Z",
        fill: "#F26798"
      },
      "haiku:Rectangle-20-Copy-4-e7bef5bfc68503ef": {
        d: "M35.0909298,27.9925964 L38.6504805,27.9925964 L38.6504805,29.4603458 C38.6504805,30.4432886 37.8536479,31.2401211 36.8707052,31.2401211 L36.8707052,31.2401211 C35.8877624,31.2401211 35.0909298,30.4432886 35.0909298,29.4603458 L35.0909298,27.9925964 Z",
        fill: "#F26798"
      },
      "haiku:Page-1-d4cadbe2bd468b21": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Artboard-606af7a7c83e31c0": {
        "translation.x": -849,
        "translation.y": -130
      },
      "haiku:horns-d3a7f416c27b6630": {
        "translation.x": 851,
        "translation.y": 134
      },
      "haiku:Combined-Shape-09a78043dfcca706": {
        d: "M43.9761667,76.6767653 C41.4646929,77.4666188 37.8848895,77.7378345 33.2249434,77.653739 C31.2126006,77.6174233 29.1767028,77.521426 26.5583228,77.3577999 C25.9867962,77.3220845 24.1235148,77.2012179 23.7847319,77.1799557 C22.8400705,77.1206682 22.1948281,77.0856585 21.6790945,77.0676041 C14.641651,76.8212427 10.7257042,73.3126894 8.18487635,67.0221059 C7.77611737,66.0101001 7.57390035,65.4337088 6.89962027,63.4322172 C6.31895647,61.7086105 2.86849497,43.824505 2.86591811,40.7534889 C2.86258007,36.7753075 9.91244584,36.0620474 22.1114029,36.7739901 C29.5544808,37.2083751 36.8538339,38.2028629 40.9600073,39.3635027 L40.9609189,19.9474511 C40.9574339,19.8451175 40.9555437,19.7587785 40.9554076,19.6848859 C40.954717,19.3100915 40.956269,18.9759114 40.9598858,18.7048742 L40.9598753,5.11203838 C40.9598743,1.57796825 43.8248034,-1.28696248 47.358929,-1.28696349 L47.6789986,-1.28695362 C51.1262986,-1.28694935 53.9540068,1.44390809 54.074104,4.88911545 C54.5270398,17.8824106 54.7534157,26.1802008 54.7534157,29.8116635 C54.7534157,33.9622909 55.2605028,38.3638386 56.277437,43.016523 C56.6830828,44.8722687 56.2377595,46.7158835 55.2024329,48.1404194 C55.3839044,48.1815294 55.5628262,48.224765 55.7389797,48.2701081 C59.6094944,49.266405 62.0337163,51.2616426 60.8563847,54.0564313 C60.6840206,54.6226208 59.9755042,57.3068917 59.7247423,58.1737225 C59.0256748,60.5902504 58.2564052,62.7403173 57.2863928,64.8036788 C54.3367625,71.0779832 50.0624865,75.3292722 43.9761667,76.6767653 Z",
        stroke: "#F26798",
        strokeWidth: 3.56400008,
        fill: "#212D31"
      },
      "haiku:Rectangle-4-d59f2a9f33cb2ad2": {
        stroke: "#F26798",
        strokeWidth: 3.56400008,
        fill: "#212D31",
        x: 1.25865369,
        y: 15.1297136,
        width: 13.0185455,
        height: 31.9889201,
        rx: 6.50927277,
        "translation.x": -4.773,
        "translation.y": 1.598,
        "rotation.z": 6.126
      },
      "haiku:Rectangle-4-Copy-8ce233d81eb2f76d": {
        stroke: "#F26798",
        strokeWidth: 3.56400008,
        fill: "#212D31",
        x: 15.796676,
        y: 23.4581211,
        width: 13.0185455,
        height: 20.5611613,
        rx: 6.50927277
      },
      "haiku:snap_finger-e00be793055903c3": {
        stroke: "#F26798",
        strokeWidth: 3.56400008,
        fill: "#212D31",
        x: 28.092274,
        y: 20.8148982,
        width: 12.7761213,
        height: 20.5611613,
        rx: 6.38806064
      },
      "haiku:Path-15-bc7140c2c7894c91": {
        d: "M16.9027823,43.8446185 C15.8266849,42.9562212 14.7672371,41.2726115 13.7244387,38.7937894 C13.3811259,37.3228202 13.0328419,36.1822708 12.6795868,35.3721411 L4.66486377,41.0037271 L6.38996333,52.7763651 L14.970978,54.4109391 L16.9027823,43.8446185 Z",
        fill: "#142E34"
      },
      "haiku:thumb-79dc31d036292d09": {
        stroke: "#F26798",
        strokeWidth: 3.56400008,
        fill: "#212D31",
        x: 35.218,
        y: 27.218,
        width: 14.5640001,
        height: 41.5640001,
        rx: 6.23699985,
        "translation.x": -5.5,
        "translation.y": 90.5,
        "rotation.z": 4.712
      },
      "haiku:left-copy-f2b0af22eba8a95c": {
        "translation.x": 140,
        "scale.x": -1,
        "scale.z": -1
      },
      "haiku:Combined-Shape-cda77bde5c183cb7": {
        d: "M43.9761667,76.6767653 C41.4646929,77.4666188 37.8848895,77.7378345 33.2249434,77.653739 C31.2126006,77.6174233 29.1767028,77.521426 26.5583228,77.3577999 C25.9867962,77.3220845 24.1235148,77.2012179 23.7847319,77.1799557 C22.8400705,77.1206682 22.1948281,77.0856585 21.6790945,77.0676041 C14.641651,76.8212427 10.7257042,73.3126894 8.18487635,67.0221059 C7.77611737,66.0101001 7.57390035,65.4337088 6.89962027,63.4322172 C6.31895647,61.7086105 2.86849497,43.824505 2.86591811,40.7534889 C2.86258007,36.7753075 9.91244584,36.0620474 22.1114029,36.7739901 C29.5544808,37.2083751 36.8538339,38.2028629 40.9600073,39.3635027 L40.9609189,19.9474511 C40.9574339,19.8451175 40.9555437,19.7587785 40.9554076,19.6848859 C40.9547171,19.3101414 40.9562686,18.9760003 40.9598844,18.7049901 L40.9598514,5.11203195 C40.9598468,1.57796182 43.8247729,-1.28697188 47.3589568,-1.28697655 L47.6790052,-1.28695653 C51.1263024,-1.28694922 53.9540067,1.44390692 54.0741038,4.88911155 C54.5270398,17.8824089 54.7534157,26.1802004 54.7534157,29.8116635 C54.7534157,33.560454 55.4023447,37.1497269 56.7010398,40.5899286 C57.6475219,43.0971371 56.9168562,45.8261973 55.066654,47.5431817 C55.3281663,47.6192872 55.5851392,47.6999915 55.8369787,47.7851983 C59.6577925,49.0779227 62.0097537,51.3084227 60.8565759,54.0558036 C60.6845451,54.6206338 59.975597,57.3065709 59.7247423,58.1737225 C59.0256748,60.5902504 58.2564052,62.7403173 57.2863928,64.8036788 C54.3367625,71.0779832 50.0624865,75.3292722 43.9761667,76.6767653 Z",
        stroke: "#F26798",
        strokeWidth: 3.56400008,
        fill: "#212D31"
      },
      "haiku:Rectangle-4-fcadc7ac0b00e10c": {
        stroke: "#F26798",
        strokeWidth: 3.56400008,
        fill: "#212D31",
        x: 1.25865369,
        y: 15.1297136,
        width: 13.0185455,
        height: 31.9889201,
        rx: 6.50927277,
        "translation.x": -4.773,
        "translation.y": 1.598,
        "rotation.z": 6.126
      },
      "haiku:Rectangle-4-Copy-db59ad73841bf01c": {
        stroke: "#F26798",
        strokeWidth: 3.56400008,
        fill: "#212D31",
        x: 15.796676,
        y: 23.4581211,
        width: 13.0185455,
        height: 20.5611613,
        rx: 6.50927277
      },
      "haiku:snap_finger-3e308dd41e82f87a": {
        stroke: "#F26798",
        strokeWidth: 3.56400008,
        fill: "#212D31",
        x: 28.092274,
        y: 20.8148982,
        width: 12.7761213,
        height: 20.5611613,
        rx: 6.38806064
      },
      "haiku:Path-15-7854d4ed254dc447": {
        d: "M16.9027823,43.8446185 C15.8266849,42.9562212 14.7672371,41.2726115 13.7244387,38.7937894 C13.3811259,37.3228202 13.0328419,36.1822708 12.6795868,35.3721411 L4.66486377,41.0037271 L6.38996333,52.7763651 L14.970978,54.4109391 L16.9027823,43.8446185 Z",
        fill: "#142E34"
      },
      "haiku:thumb-c779a93b477bba92": {
        stroke: "#F26798",
        strokeWidth: 3.56400008,
        fill: "#212D31",
        x: 35.218,
        y: 27.218,
        width: 14.5640001,
        height: 41.5640001,
        rx: 6.23699985,
        "translation.x": -5.5,
        "translation.y": 90.5,
        "rotation.z": 4.712
      },
      "haiku:Page-1-a7d066e28ff12dd6": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Artboard-f4c4f00e3f1a4ce7": {
        fill: "#212D31",
        stroke: "#F26798",
        strokeWidth: 4.4000001,
        "translation.x": -252,
        "translation.y": -120
      },
      "haiku:midsnap-2bd5fe3e21a3d3eb": {
        "translation.x": 247.088,
        "translation.y": 165.586,
        "rotation.z": 5.498
      },
      "haiku:base-1bcd3d5f2d6f56e1": { "translation.y": 4.774 },
      "haiku:Combined-Shape-2a6fa26b14382d8c": {
        d: "M14.8012369,33.0419233 C12.4951337,29.2466843 11.9721617,27.5230161 12.9829714,25.9362087 C14.4615389,23.6150973 16.3296558,21.6299365 18.5327404,19.8970054 C20.0254421,18.7228566 21.5708045,17.7350454 23.3472304,16.7547661 C23.8031661,16.5031685 26.039994,15.3281369 26.354176,15.1309216 C28.2290683,13.9540328 30.5896068,13.8276644 33.3427429,14.5347674 L35.9049044,12.1083927 C36.592541,11.4571965 37.3916652,10.9349482 38.264129,10.5665775 L50.8313609,5.26041705 C54.7386519,3.6106848 59.2435094,5.44079779 60.8932416,9.34808884 C61.2923651,10.2933886 61.498,11.3090885 61.498,12.3351933 L61.498,12.449065 L61.4862435,12.5623282 C61.3292156,14.0751531 62.308777,22.0507677 64.379002,35.6652221 C64.5172878,36.5746381 64.4960013,37.4873661 64.3234762,38.369408 C65.7692412,40.2005738 66.8213731,41.8083894 67.4096664,43.1303749 C68.4976617,45.5752675 68.2625639,47.9103601 65.6772253,48.6157027 C65.309026,48.7161563 64.7062336,49.6400173 63.8689599,51.8829352 C63.6406084,52.4946513 62.7559211,55.0058243 62.7991654,54.8848614 C62.3173111,56.2327024 61.9110055,57.2876058 61.4591361,58.3266136 C58.1131316,66.0202634 52.9648649,70.3691224 44.0272061,70.675502 C43.3808228,70.6976598 42.7680496,70.726926 41.8805392,70.7753323 C38.4057096,70.9648552 37.3266774,70.9875547 35.9885675,70.7548061 C34.896031,70.8366029 33.74413,70.8910189 32.5307938,70.9208239 C29.832955,70.987095 27.2018634,70.9370833 23.6144672,70.7945781 C23.3612053,70.7845176 23.106461,70.7741833 22.7818167,70.7608542 C22.3822487,70.7444079 22.3822487,70.7444079 22.0008064,70.7287573 C21.3971313,70.7040951 20.9888085,70.6882633 20.6165388,70.675502 C11.939984,70.3780729 7.11697056,66.0425763 3.99261981,58.2669382 C3.49073579,57.0178888 3.24260993,56.3068576 2.41461984,53.8358858 C1.4080518,50.8319837 0.389260164,41.751813 1.78422894,38.2627373 C4.05314082,32.5877678 9.17701013,30.8381573 14.8012369,33.0419233 Z"
      },
      "haiku:Rectangle-4-0c4430c95c31934a": {
        x: -2.14974752,
        y: 4.01452327,
        width: 16.0868688,
        height: 39.6100314,
        rx: 8.04343439
      },
      "haiku:Rectangle-4-Copy-c12b92442cdf0de4": {
        x: 13.3486411,
        y: -1.49289327,
        width: 16.0868688,
        height: 46.5316615,
        rx: 8.04343439
      },
      "haiku:snap_finger-71189eb5b40f3cce": {
        x: 28.5473665,
        y: 1.86718784,
        width: 15.7872055,
        height: 24.4026501,
        rx: 7.89360274
      },
      "haiku:ring_finger-389b5bb0de5fbb08": {
        x: 47.6392496,
        y: -0.254132502,
        width: 15.7872055,
        height: 28.2825597,
        rx: 7.89360274,
        "translation.x": 6.487,
        "translation.y": -15.629,
        "rotation.z": 0.297
      },
      "haiku:thumb-41cf196359ab3d46": {
        x: 43.0456535,
        y: 20.6181432,
        width: 17.919234,
        height: 39.6044295,
        rx: 7.69999981,
        "translation.x": -12.135,
        "translation.y": 55.399,
        "rotation.z": 5.393
      },
      "haiku:Page-1-3f7d11900d92f460": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd",
        opacity: 0.376754982
      },
      "haiku:Artboard-a731744aab5d31ae": {
        fill: "#F26798",
        "translation.x": -1098,
        "translation.y": -148
      },
      "haiku:oval-3f652b97ef9b641f": { cx: 1122, cy: 172, r: 24 },
      "haiku:Page-1-381aef7d48e0aa07": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Artboard-ac33113bfdb31e25": {
        fill: "#212D31",
        "translation.x": -1128,
        "translation.y": -148
      },
      "haiku:oval_cover-56bf970295c49daa": { cx: 1152, cy: 172, r: 24 },
      "haiku:Page-1-0c77e08f97df7f7b": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Artboard-2fdb83a4199afc1b": {
        "translation.x": -422,
        "translation.y": -109
      },
      "haiku:snapped-c67f30758d58df9b": {
        "translation.x": 402.85,
        "translation.y": 162.182,
        "rotation.z": 5.498
      },
      "haiku:base-2e589934e0f42bd7": {
        fill: "#142E34",
        stroke: "#F26798",
        strokeWidth: 4.4000001,
        "translation.y": 0.774
      },
      "haiku:Combined-Shape-b85b58ad5d00f3cd": {
        d: "M37.6100131,63.0003885 C37.6148817,62.9965538 37.6197519,62.9927205 37.6246235,62.9888884 C39.1173252,61.8147397 40.6626876,60.8269285 42.4391135,59.8466492 C42.7211779,59.6909985 43.6848378,59.1819246 44.4531924,58.769594 L44.4531356,5.92568449 C44.4531322,1.56263494 47.9900799,-1.97431835 52.3531791,-1.97432178 L52.763546,-1.97431284 C57.0191015,-1.97430456 60.5099347,1.39655617 60.6587089,5.64951031 C61.2183125,21.6466893 61.498,31.8632049 61.498,36.3351933 C61.498,40.7420806 62.1125643,45.9363542 63.3471234,51.9090269 C67.8588923,50.8847199 73.0595959,49.928599 78.9518432,49.0392988 C83.977636,48.2807563 88.7560243,51.4685831 89.9856446,56.4003206 C91.2027067,61.2816903 88.3254074,66.2478149 83.485283,67.619737 C74.8586689,70.0649463 68.9240613,71.7298877 65.6772253,72.6157027 C65.309026,72.7161563 64.7062336,73.6400173 63.8689599,75.8829352 C63.6406084,76.4946513 62.7559211,79.0058243 62.7991654,78.8848614 C62.3173111,80.2327024 61.9110055,81.2876058 61.4591361,82.3266136 C58.1131316,90.0202634 52.9648649,94.3691224 44.0272061,94.675502 C43.3808228,94.6976598 42.7680496,94.726926 41.8805392,94.7753323 C38.4057096,94.9648552 37.3266774,94.9875547 35.9885675,94.7548061 C34.896031,94.8366029 33.74413,94.8910189 32.5307938,94.9208239 C29.832955,94.987095 27.2018634,94.9370833 23.6144672,94.7945781 C23.3612053,94.7845176 23.106461,94.7741833 22.7818167,94.7608542 C22.3822487,94.7444079 22.3822487,94.7444079 22.0008064,94.7287573 C21.3971313,94.7040951 20.9888085,94.6882633 20.6165388,94.675502 C11.939984,94.3780729 7.11697056,90.0425763 3.99261981,82.2669382 C3.49073579,81.0178888 3.24260993,80.3068576 2.41461984,77.8358858 C1.4080518,74.8319837 0.389260164,65.751813 1.78422894,62.2627373 C4.45215981,55.5897473 11.0675124,54.3441753 17.8021452,58.5715724 C17.8646412,58.6108018 18.7745557,58.7847785 20.3595166,58.9637701 C20.2085343,58.9467195 23.5940033,59.3079244 24.6944384,59.4437233 C26.6108609,59.680219 28.2880863,59.9466058 29.8984452,60.2907561 C32.8811435,60.9281895 35.4491669,61.7983992 37.6100131,63.0003885 Z"
      },
      "haiku:Rectangle-4-66f0e2aa1031bf1f": {
        x: -2.14974752,
        y: 28.0145233,
        width: 16.0868688,
        height: 39.6100314,
        rx: 8.04343439
      },
      "haiku:Rectangle-4-Copy-3725c30b1a9b36c7": {
        x: 13.3486411,
        y: 22.5071067,
        width: 16.0868688,
        height: 46.5316615,
        rx: 8.04343439
      },
      "haiku:snap_finger-2e5554b567780a4c": {
        stroke: "#F26798",
        strokeWidth: 4.4000001,
        fill: "#142E34",
        x: 28.5473665,
        y: 21.8671878,
        width: 15.7872055,
        height: 46.5316615,
        rx: 7.89360274
      },
      "haiku:tri-8dd766bf9a27eea2": {
        fill: "#D7E1E2",
        points: "87.6167439 19.5266419 92.060014 28.2546791 96.503284 19.5266419",
        "translation.x": 52.691,
        "translation.y": -62.688,
        "rotation.z": 0.89
      },
      "haiku:tri-copy-d96376758a722133": {
        fill: "#D7E1E2",
        points: "92.810418 35.7611046 97.253688 44.4891417 101.696958 35.7611046",
        "translation.x": 126.993,
        "translation.y": -60.79,
        "rotation.z": 1.466
      },
      "haiku:tri3-84475e54066d9fd1": {
        fill: "#D7E1E2",
        points: "74.4281614 8.46034655 78.8714315 17.1883837 83.3147015 8.46034655",
        "translation.x": 9.143,
        "translation.y": -26.202,
        "rotation.z": 0.349
      },
      "haiku:Page-1-6d6fdc223959b9bc": {
        stroke: "none",
        strokeWidth: 1,
        fill: "none",
        fillRule: "evenodd"
      },
      "haiku:Artboard-ce5b17aefad36aeb": {
        "translation.x": -85,
        "translation.y": -105
      },
      "haiku:unsnapped-3fe037345fc7c891": {
        "translation.x": 65.85,
        "translation.y": 158.182,
        "rotation.z": 5.498
      },
      "haiku:base-ad1ef9f85f191ff5": {
        fill: "#212D31",
        stroke: "#F3F5F5",
        strokeWidth: 4.4000001,
        "translation.y": 0.774
      },
      "haiku:Combined-Shape-5c93b7561aaee226": {
        d: "M37.6100131,63.0003885 C37.6148817,62.9965538 37.6197519,62.9927205 37.6246235,62.9888884 C39.1173252,61.8147397 40.6626876,60.8269285 42.4391135,59.8466492 C42.7211779,59.6909985 43.6848378,59.1819246 44.4531924,58.769594 L44.4531356,5.92568449 C44.4531322,1.56263494 47.9900799,-1.97431835 52.3531791,-1.97432178 L52.763546,-1.97431284 C57.0191015,-1.97430456 60.5099347,1.39655617 60.6587089,5.64951031 C61.2183125,21.6466893 61.498,31.8632049 61.498,36.3351933 C61.498,40.7420806 62.1125643,45.9363542 63.3471234,51.9090269 C67.8588923,50.8847199 73.0595959,49.928599 78.9518432,49.0392988 C83.977636,48.2807563 88.7560243,51.4685831 89.9856446,56.4003206 C91.2027067,61.2816903 88.3254074,66.2478149 83.485283,67.619737 C74.8586689,70.0649463 68.9240613,71.7298877 65.6772253,72.6157027 C65.309026,72.7161563 64.7062336,73.6400173 63.8689599,75.8829352 C63.6406084,76.4946513 62.7559211,79.0058243 62.7991654,78.8848614 C62.3173111,80.2327024 61.9110055,81.2876058 61.4591361,82.3266136 C58.1131316,90.0202634 52.9648649,94.3691224 44.0272061,94.675502 C43.3808228,94.6976598 42.7680496,94.726926 41.8805392,94.7753323 C38.4057096,94.9648552 37.3266774,94.9875547 35.9885675,94.7548061 C34.896031,94.8366029 33.74413,94.8910189 32.5307938,94.9208239 C29.832955,94.987095 27.2018634,94.9370833 23.6144672,94.7945781 C23.3612053,94.7845176 23.106461,94.7741833 22.7818167,94.7608542 C22.3822487,94.7444079 22.3822487,94.7444079 22.0008064,94.7287573 C21.3971313,94.7040951 20.9888085,94.6882633 20.6165388,94.675502 C11.939984,94.3780729 7.11697056,90.0425763 3.99261981,82.2669382 C3.49073579,81.0178888 3.24260993,80.3068576 2.41461984,77.8358858 C1.4080518,74.8319837 0.389260164,65.751813 1.78422894,62.2627373 C4.45215981,55.5897473 11.0675124,54.3441753 17.8021452,58.5715724 C17.8646412,58.6108018 18.7745557,58.7847785 20.3595166,58.9637701 C20.2085343,58.9467195 23.5940033,59.3079244 24.6944384,59.4437233 C26.6108609,59.680219 28.2880863,59.9466058 29.8984452,60.2907561 C32.8811435,60.9281895 35.4491669,61.7983992 37.6100131,63.0003885 Z"
      },
      "haiku:Rectangle-4-a5e7c28c5ccf64fb": {
        x: -2.14974752,
        y: 28.0145233,
        width: 16.0868688,
        height: 39.6100314,
        rx: 8.04343439
      },
      "haiku:Rectangle-4-Copy-1d456a38984bfafa": {
        x: 13.3486411,
        y: 22.5071067,
        width: 16.0868688,
        height: 46.5316615,
        rx: 8.04343439
      },
      "haiku:snap_finger-1745426b91874900": {
        stroke: "#F3F5F5",
        strokeWidth: 4.4000001,
        fill: "#212D31",
        x: 28.5473665,
        y: 21.8671878,
        width: 15.7872055,
        height: 46.5316615,
        rx: 7.89360274
      },
      "haiku:tri-6ad8b7926426ad44": {
        fill: "#D7E1E2",
        points: "87.6167439 19.5266419 92.060014 28.2546791 96.503284 19.5266419",
        "translation.x": 52.691,
        "translation.y": -62.688,
        "rotation.z": 0.89
      },
      "haiku:tri-copy-eac92c521defa7a4": {
        fill: "#D7E1E2",
        points: "92.810418 35.7611046 97.253688 44.4891417 101.696958 35.7611046",
        "translation.x": 126.993,
        "translation.y": -60.79,
        "rotation.z": 1.466
      },
      "haiku:tri3-dddc9fc0ad8a7090": {
        fill: "#D7E1E2",
        points: "74.4281614 8.46034655 78.8714315 17.1883837 83.3147015 8.46034655",
        "translation.x": 9.143,
        "translation.y": -26.202,
        "rotation.z": 0.349
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "e4a9e4d8baa7", "haiku-title": "Main" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "4c5136cab9e2",
          "haiku-title": "hands_up",
          "haiku-source": "designs/haikudos.sketch.contents/slices/hands_up.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-d0bb20b7d2028ce3", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Artboard-173552c10d0b8a57",
                  id: "Artboard"
                },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "hands_up-4d0253fe7483c4c7",
                      id: "hands_up"
                    },
                    children: [
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "left-6eaab108838242ed",
                          id: "left"
                        },
                        children: [
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "Combined-Shape-6ebfc0936a6c96ae",
                              id: "Combined-Shape"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "Rectangle-4-e38ecdfd6387aa3a",
                              id: "Rectangle-4"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "Rectangle-4-Copy-078e58f50c34bf6e",
                              id: "Rectangle-4-Copy"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "snap_finger-dbbf52586afc9f1a",
                              id: "snap_finger"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "Path-15-5f5d7d8c94cfaf62",
                              id: "Path-15"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "Rectangle-20-01aebdbaf0b61b2a",
                              id: "Rectangle-20"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "Rectangle-20-Copy-3-f64936c335984685",
                              id: "Rectangle-20-Copy-3"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "Rectangle-20-Copy-4-b9f56023bbeb6164",
                              id: "Rectangle-20-Copy-4"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "right-a832e0223ce6abca",
                          id: "right"
                        },
                        children: [
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "Combined-Shape-7bb79030cb8bbcdd",
                              id: "Combined-Shape"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "Rectangle-4-39bab4445f049ee1",
                              id: "Rectangle-4"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "Rectangle-4-Copy-5a029f31daa38e28",
                              id: "Rectangle-4-Copy"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "snap_finger-b515a61054170673",
                              id: "snap_finger"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "Path-15-023c474bf79038f9",
                              id: "Path-15"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "Rectangle-20-f0eab26c694e86af",
                              id: "Rectangle-20"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "Rectangle-20-Copy-3-37a47caaa2c72108",
                              id: "Rectangle-20-Copy-3"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "Rectangle-20-Copy-4-e7bef5bfc68503ef",
                              id: "Rectangle-20-Copy-4"
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
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "c3dda03a981e",
          "haiku-title": "midsnap",
          "haiku-source": "designs/haikudos.sketch.contents/slices/midsnap.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-a7d066e28ff12dd6", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Artboard-f4c4f00e3f1a4ce7",
                  id: "Artboard"
                },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "midsnap-2bd5fe3e21a3d3eb",
                      id: "midsnap"
                    },
                    children: [
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "base-1bcd3d5f2d6f56e1",
                          id: "base"
                        },
                        children: [
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "Combined-Shape-2a6fa26b14382d8c",
                              id: "Combined-Shape"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "Rectangle-4-0c4430c95c31934a",
                              id: "Rectangle-4"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "Rectangle-4-Copy-c12b92442cdf0de4",
                              id: "Rectangle-4-Copy"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "rect",
                        attributes: {
                          "haiku-id": "snap_finger-71189eb5b40f3cce",
                          id: "snap_finger"
                        },
                        children: []
                      },
                      {
                        elementName: "rect",
                        attributes: {
                          "haiku-id": "ring_finger-389b5bb0de5fbb08",
                          id: "ring_finger"
                        },
                        children: []
                      },
                      {
                        elementName: "rect",
                        attributes: {
                          "haiku-id": "thumb-41cf196359ab3d46",
                          id: "thumb"
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
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "82ba04bd1d42",
          "haiku-title": "snapped",
          "haiku-source": "designs/haikudos.sketch.contents/slices/snapped.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-0c77e08f97df7f7b", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Artboard-2fdb83a4199afc1b",
                  id: "Artboard"
                },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "snapped-c67f30758d58df9b",
                      id: "snapped"
                    },
                    children: [
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "base-2e589934e0f42bd7",
                          id: "base"
                        },
                        children: [
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "Combined-Shape-b85b58ad5d00f3cd",
                              id: "Combined-Shape"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "Rectangle-4-66f0e2aa1031bf1f",
                              id: "Rectangle-4"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "Rectangle-4-Copy-3725c30b1a9b36c7",
                              id: "Rectangle-4-Copy"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "rect",
                        attributes: {
                          "haiku-id": "snap_finger-2e5554b567780a4c",
                          id: "snap_finger"
                        },
                        children: []
                      },
                      {
                        elementName: "polygon",
                        attributes: {
                          "haiku-id": "tri-8dd766bf9a27eea2",
                          id: "tri"
                        },
                        children: []
                      },
                      {
                        elementName: "polygon",
                        attributes: {
                          "haiku-id": "tri-copy-d96376758a722133",
                          id: "tri-copy"
                        },
                        children: []
                      },
                      {
                        elementName: "polygon",
                        attributes: {
                          "haiku-id": "tri3-84475e54066d9fd1",
                          id: "tri3"
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
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "ba0f4f00e016",
          "haiku-title": "unsnapped",
          "haiku-source": "designs/haikudos.sketch.contents/slices/unsnapped.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-6d6fdc223959b9bc", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Artboard-ce5b17aefad36aeb",
                  id: "Artboard"
                },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "unsnapped-3fe037345fc7c891",
                      id: "unsnapped"
                    },
                    children: [
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "base-ad1ef9f85f191ff5",
                          id: "base"
                        },
                        children: [
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "Combined-Shape-5c93b7561aaee226",
                              id: "Combined-Shape"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "Rectangle-4-a5e7c28c5ccf64fb",
                              id: "Rectangle-4"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "Rectangle-4-Copy-1d456a38984bfafa",
                              id: "Rectangle-4-Copy"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "rect",
                        attributes: {
                          "haiku-id": "snap_finger-1745426b91874900",
                          id: "snap_finger"
                        },
                        children: []
                      },
                      {
                        elementName: "polygon",
                        attributes: {
                          "haiku-id": "tri-6ad8b7926426ad44",
                          id: "tri"
                        },
                        children: []
                      },
                      {
                        elementName: "polygon",
                        attributes: {
                          "haiku-id": "tri-copy-eac92c521defa7a4",
                          id: "tri-copy"
                        },
                        children: []
                      },
                      {
                        elementName: "polygon",
                        attributes: {
                          "haiku-id": "tri3-dddc9fc0ad8a7090",
                          id: "tri3"
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
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "71e06b847817",
          "haiku-title": "horns",
          "haiku-source": "designs/haikudos.sketch.contents/slices/horns.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-d4cadbe2bd468b21", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Artboard-606af7a7c83e31c0",
                  id: "Artboard"
                },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "horns-d3a7f416c27b6630",
                      id: "horns"
                    },
                    children: [
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "left-9ab5f33788f21bc7",
                          id: "left"
                        },
                        children: [
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "Combined-Shape-09a78043dfcca706",
                              id: "Combined-Shape"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "Rectangle-4-d59f2a9f33cb2ad2",
                              id: "Rectangle-4"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "Rectangle-4-Copy-8ce233d81eb2f76d",
                              id: "Rectangle-4-Copy"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "snap_finger-e00be793055903c3",
                              id: "snap_finger"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "Path-15-bc7140c2c7894c91",
                              id: "Path-15"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "thumb-79dc31d036292d09",
                              id: "thumb"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "left-copy-f2b0af22eba8a95c",
                          id: "left-copy"
                        },
                        children: [
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "Combined-Shape-cda77bde5c183cb7",
                              id: "Combined-Shape"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "Rectangle-4-fcadc7ac0b00e10c",
                              id: "Rectangle-4"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "Rectangle-4-Copy-db59ad73841bf01c",
                              id: "Rectangle-4-Copy"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "snap_finger-3e308dd41e82f87a",
                              id: "snap_finger"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "Path-15-7854d4ed254dc447",
                              id: "Path-15"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "thumb-c779a93b477bba92",
                              id: "thumb"
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
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "417f7f7c0958",
          "haiku-title": "oval",
          "haiku-source": "designs/haikudos.sketch.contents/slices/oval.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-3f7d11900d92f460", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Artboard-a731744aab5d31ae",
                  id: "Artboard"
                },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "oval-3f652b97ef9b641f",
                      id: "oval"
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
          "haiku-id": "d5e8a28fd485",
          "haiku-title": "oval_cover",
          "haiku-source": "designs/haikudos.sketch.contents/slices/oval_cover.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-381aef7d48e0aa07", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Artboard-ac33113bfdb31e25",
                  id: "Artboard"
                },
                children: [
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "oval_cover-56bf970295c49daa",
                      id: "oval_cover"
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
          "haiku-id": "453c1f257b90-cc12b9",
          "haiku-title": "fetti-6",
          "haiku-source": "designs/haikudos.sketch.contents/slices/confetti.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-67f2867a44ddca23", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Artboard-30fb693796a20b88",
                  id: "Artboard"
                },
                children: [
                  {
                    elementName: "polygon",
                    attributes: {
                      "haiku-id": "confetti-fdb5b2178dbf60e1",
                      id: "confetti"
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
          "haiku-id": "453c1f257b90-d83906",
          "haiku-title": "fetti-5",
          "haiku-source": "designs/haikudos.sketch.contents/slices/confetti.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-aa46e17d8359abf9", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Artboard-ad9221503224a5a9",
                  id: "Artboard"
                },
                children: [
                  {
                    elementName: "polygon",
                    attributes: {
                      "haiku-id": "confetti-686f83394ef9c613",
                      id: "confetti"
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
          "haiku-id": "453c1f257b90-d2e079",
          "haiku-title": "fetti-4",
          "haiku-source": "designs/haikudos.sketch.contents/slices/confetti.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-86409bf99058ae4c", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Artboard-39e15359ef6433f7",
                  id: "Artboard"
                },
                children: [
                  {
                    elementName: "polygon",
                    attributes: {
                      "haiku-id": "confetti-1f3bb2b1d6362366",
                      id: "confetti"
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
          "haiku-id": "453c1f257b90-785118",
          "haiku-title": "fetti-3",
          "haiku-source": "designs/haikudos.sketch.contents/slices/confetti.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-7488b89122dd386c", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Artboard-412ed1d8fca1f020",
                  id: "Artboard"
                },
                children: [
                  {
                    elementName: "polygon",
                    attributes: {
                      "haiku-id": "confetti-756afc1afbc0684e",
                      id: "confetti"
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
          "haiku-id": "453c1f257b90-927b8e",
          "haiku-title": "fetti-2",
          "haiku-source": "designs/haikudos.sketch.contents/slices/confetti.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-a190a4ec442884b2", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Artboard-0dbfb1c4a4ac53f2",
                  id: "Artboard"
                },
                children: [
                  {
                    elementName: "polygon",
                    attributes: {
                      "haiku-id": "confetti-6b8b0955d10eb059",
                      id: "confetti"
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
          "haiku-id": "453c1f257b90-3bc74e",
          "haiku-title": "fetti-1",
          "haiku-source": "designs/haikudos.sketch.contents/slices/confetti.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-8d4f77be74c7847f", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Artboard-3f4aa78231c295f6",
                  id: "Artboard"
                },
                children: [
                  {
                    elementName: "polygon",
                    attributes: {
                      "haiku-id": "confetti-39a93345fa3592f5",
                      id: "confetti"
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
          "haiku-id": "6e2200b55397",
          "haiku-title": "bolt-8",
          "haiku-source": "designs/haikudos.sketch.contents/slices/bolt.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-2e00ca3304e470ac", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Artboard-b0a02373fa17c64c",
                  id: "Artboard"
                },
                children: [
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "bolt-6b10e4f532972ae2",
                      id: "bolt"
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
          "haiku-id": "6e2200b55397-fd4654",
          "haiku-title": "bolt-7",
          "haiku-source": "designs/haikudos.sketch.contents/slices/bolt.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-572e5f64a8061e0a", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Artboard-ef6f49e8876b11de",
                  id: "Artboard"
                },
                children: [
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "bolt-d09443672579d088",
                      id: "bolt"
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
          "haiku-id": "6e2200b55397-f9680b",
          "haiku-title": "bolt-6",
          "haiku-source": "designs/haikudos.sketch.contents/slices/bolt.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-cf15f2cf7bb94f3a", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Artboard-01176ee47292dde8",
                  id: "Artboard"
                },
                children: [
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "bolt-8635e8fc72141c15",
                      id: "bolt"
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
          "haiku-id": "6e2200b55397-f9680b-5e5fa1",
          "haiku-title": "bolt-5",
          "haiku-source": "designs/haikudos.sketch.contents/slices/bolt.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-8e4e0e9c291a4d9b", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Artboard-1129ed4d2f60d121",
                  id: "Artboard"
                },
                children: [
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "bolt-2a3984a02f279ed9",
                      id: "bolt"
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
          "haiku-id": "6e2200b55397-f9680b-c06fe9",
          "haiku-title": "bolt-4",
          "haiku-source": "designs/haikudos.sketch.contents/slices/bolt.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-0c76a00c76f50b8f", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Artboard-f7e5396e9b095d81",
                  id: "Artboard"
                },
                children: [
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "bolt-e07fca6dbdef1811",
                      id: "bolt"
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
          "haiku-id": "6e2200b55397-f9680b-5e5fa1-1a3ff5",
          "haiku-title": "bolt-3",
          "haiku-source": "designs/haikudos.sketch.contents/slices/bolt.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-272b13dfe402474f", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Artboard-79a3276b47973541",
                  id: "Artboard"
                },
                children: [
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "bolt-cfcaceacf3ecb77d",
                      id: "bolt"
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
          "haiku-id": "6e2200b55397-4e0585",
          "haiku-title": "bolt-2",
          "haiku-source": "designs/haikudos.sketch.contents/slices/bolt.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-b18f11c311698bb1", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Artboard-f0201369ec478486",
                  id: "Artboard"
                },
                children: [
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "bolt-086fe5199463d456",
                      id: "bolt"
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
          "haiku-id": "6e2200b55397-fd4654-e02193",
          "haiku-title": "bolt-1",
          "haiku-source": "designs/haikudos.sketch.contents/slices/bolt.svg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "Page-1-fc1add7bf1df6600", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "Artboard-fd357a417ffc163a",
                  id: "Artboard"
                },
                children: [
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "bolt-b5b6277da555a977",
                      id: "bolt"
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
