var Haiku = require("@haiku/player");
module.exports = {
  metadata: {
    uuid: "HAIKU_SHARE_UUID",
    relpath: "code/main/code.js",
    type: "haiku",
    name: "metapoem2",
    player: "3.0.4",
    version: "0.0.21",
    organization: "taylor4",
    project: "metapoem2",
    branch: "master"
  },
  options: {},
  states: {
    isHovered: { type: "boolean", value: false, edited: true },
    hasHovered: { type: "boolean", value: false, edited: true },
    replayHovered: { type: "boolean", value: false, edited: true }
  },
  eventHandlers: {
    "haiku:8b847d4fc375": {},
    "haiku:e4a9e4d8baa7": {
      "timeline:Default:1074": {
        handler: function(event) {
          this.getDefaultTimeline().gotoAndPlay(17070);
        }
      },
      "timeline:Default:1135": {
        handler: function(event) {
          /** action logic goes here */
          this.getDefaultTimeline().gotoAndPlay(18370);
        }
      },
      "timeline:Default:1165": {
        handler: function(event) {
          this.getDefaultTimeline().gotoAndPlay(17070);
        }
      }
    },
    "haiku:e6ecbf414bf7": {
      mouseenter: {
        handler: function(event) {
          if (this.getDefaultTimeline().getTime() > 17060) {
            this.setState({ isHovered: true, hasHovered: true });

            this.getDefaultTimeline().gotoAndPlay(18000);
          }
        }
      },
      mouseleave: {
        handler: function(event) {
          this.setState({ isHovered: false });
          this.getDefaultTimeline().gotoAndPlay(19000);
        }
      }
    },
    "haiku:6658141ee5d1": {
      click: {
        handler: function(event) {
          this.getDefaultTimeline().gotoAndPlay(0);
        }
      },
      mouseenter: {
        handler: function(event) {
          this.setState({ replayHovered: true });
        }
      },
      mouseleave: {
        handler: function(event) {
          this.setState({ replayHovered: false });
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:e4a9e4d8baa7": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "hidden" } },
        "style.overflowY": { "0": { value: "hidden" } },
        "sizeAbsolute.x": { "0": { value: 900, edited: true } },
        "sizeAbsolute.y": { "0": { value: 600, edited: true } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "style.backgroundColor": { "0": { value: "#343f41", edited: true } },
        opacity: {
          "0": { value: 1, edited: true },
          "23117": { value: 1, edited: true }
        }
      },
      "haiku:b7911dbe85c1": {
        viewBox: { "0": { value: "0 0 640 224" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 640 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 224 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 905, edited: true, curve: "easeOutCubic" },
          "650": { value: 290, edited: true, curve: "linear" },
          "1583": { value: 260, edited: true },
          "3433": { value: -399, edited: true }
        },
        "translation.y": {
          "0": { value: 191.5, edited: true },
          "3433": { value: -300, edited: true }
        },
        "style.zIndex": { "0": { value: 1 } },
        opacity: {
          "0": { value: 1, edited: true },
          "1583": { value: 0, edited: true }
        }
      },
      "haiku:2167816a0784": {
        viewBox: { "0": { value: "0 0 640 224" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 640 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 224 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 139, edited: true },
          "1583": { value: 260, edited: true },
          "3433": { value: -300, edited: true }
        },
        "translation.y": {
          "0": { value: 168.5, edited: true },
          "1583": { value: 191.5, edited: true },
          "3433": { value: -300, edited: true }
        },
        "style.zIndex": { "0": { value: 2 } },
        opacity: {
          "0": { value: 0, edited: true },
          "1583": { value: 1, edited: true },
          "3033": { value: 0, edited: true }
        },
        "scale.x": { "0": { value: 1, edited: true } },
        "scale.y": { "0": { value: 1, edited: true } },
        "rotation.x": { "0": { value: 0, edited: true } },
        "rotation.y": { "0": { value: 0, edited: true } }
      },
      "haiku:593166b1dfce": {
        viewBox: { "0": { value: "0 0 173 57" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 173 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 57 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 264.5, edited: true },
          "1583": { value: 259.5, edited: true }
        },
        "translation.y": {
          "0": { value: 294.5, edited: true },
          "1583": { value: 301.5, edited: true }
        },
        "style.zIndex": { "0": { value: 3 } },
        opacity: {
          "0": { value: 0, edited: true },
          "1583": { value: 1, edited: true },
          "1983": { value: 0, edited: true }
        }
      },
      "haiku:e4e7d336c97f": {
        viewBox: { "0": { value: "0 0 159 57" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 159 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 57 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 189.5, edited: true },
          "1983": { value: 266.5, edited: true, curve: "easeInOutCubic" },
          "2600": { value: 306.49999999999994, edited: true }
        },
        "translation.y": {
          "0": { value: 294.5, edited: true },
          "1983": { value: 301.5, edited: true }
        },
        "style.zIndex": { "0": { value: 4 } },
        opacity: {
          "0": { value: 0, edited: true },
          "1983": { value: 1, edited: true },
          "3033": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "1983": { value: 1, edited: true, curve: "easeInOutCubic" },
          "2600": { value: 1.5031446540880506, edited: true }
        }
      },
      "haiku:81677cabe8c7": {
        viewBox: { "0": { value: "0 0 16 19" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 16 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 19 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 275.6, edited: true },
          "1983": { value: 259.6, edited: true }
        },
        "translation.y": {
          "0": { value: 318.66, edited: true },
          "1983": { value: 313.66, edited: true }
        },
        "style.zIndex": { "0": { value: 5 } },
        opacity: {
          "0": { value: 0, edited: true },
          "1983": { value: 1, edited: true },
          "3033": { value: 0, edited: true }
        }
      },
      "haiku:632812278d3b": {
        viewBox: { "0": { value: "0 0 16 19" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 16 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 19 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 382.48, edited: true },
          "1983": { value: 417.48, edited: true, curve: "easeInOutCubic" },
          "2600": { value: 497.48, edited: true }
        },
        "translation.y": {
          "0": { value: 316.74, edited: true },
          "1983": { value: 313.74, edited: true }
        },
        "style.zIndex": { "0": { value: 6 } },
        opacity: {
          "0": { value: 0, edited: true },
          "1983": { value: 1, edited: true },
          "3033": { value: 0, edited: true }
        }
      },
      "haiku:31515d56dab8": {
        viewBox: { "0": { value: "0 0 50 52" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 50 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 52 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 82, edited: true },
          "450": { value: -53, edited: true, curve: "linear" },
          "1550": { value: 403, edited: true },
          "1983": { value: 403, edited: true, curve: "easeInOutCubic" },
          "2600": { value: 484, edited: true, curve: "easeInOutCubic" },
          "2717": { value: 503, edited: true, curve: "easeInOutCubic" },
          "2817": { value: 484, edited: true },
          "3150": { value: 0, edited: true },
          "12017": { value: 150, edited: true, curve: "linear" },
          "13783": { value: 611, edited: true, curve: "easeInOutCubic" },
          "14367": { value: 501, edited: true, curve: "linear" },
          "14883": { value: 566, edited: true }
        },
        "translation.y": {
          "0": { value: 479, edited: true },
          "450": { value: 506, edited: true, curve: "easeOutSine" },
          "1550": { value: 320, edited: true },
          "1983": { value: 320, edited: true, curve: "easeInOutCubic" },
          "2600": { value: 319, edited: true, curve: "easeInOutCubic" },
          "2717": { value: 328, edited: true, curve: "easeInOutCubic" },
          "2817": { value: 317, edited: true },
          "3150": { value: 0, edited: true },
          "12017": { value: 360, edited: true, curve: "easeInOutCubic" },
          "13783": { value: 208, edited: true, curve: "linear" },
          "14367": { value: 228, edited: true, curve: "easeInCubic" },
          "14883": { value: 308, edited: true }
        },
        "style.zIndex": {
          "0": { value: 7 },
          "12017": { value: 40, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "833": { value: 0, edited: true, curve: "linear" },
          "1283": { value: 1, edited: true },
          "3050": { value: 1, edited: true, curve: "linear" },
          "3150": { value: 0, edited: true },
          "12033": { value: 0, edited: true, curve: "linear" },
          "12417": { value: 1, edited: true },
          "14917": { value: 1, edited: true, curve: "linear" },
          "15367": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "2883": { value: 1, edited: true, curve: "easeInOutCubic" },
          "2983": { value: 0.7, edited: true, curve: "easeInOutCubic" },
          "3083": { value: 1, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "2883": { value: 1, edited: true, curve: "easeInOutCubic" },
          "2983": { value: 0.7, edited: true, curve: "easeInOutCubic" },
          "3083": { value: 1, edited: true }
        },
        pointerEvents: { "0": { value: "", edited: true } }
      },
      "haiku:18009d2058c8": {
        viewBox: { "0": { value: "0 0 54 54" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 54 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 54 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 478, edited: true },
          "2983": { value: 478, edited: true },
          "17067": { value: 589, edited: true }
        },
        "translation.y": {
          "0": { value: 299.5, edited: true },
          "2983": { value: 296.5, edited: true },
          "17067": { value: 332.5, edited: true }
        },
        "style.zIndex": {
          "0": { value: 8 },
          "17083": { value: 90, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "2983": { value: 0.3, edited: true, curve: "easeOutCirc" },
          "3200": { value: 3, edited: true },
          "17067": { value: 0.3, edited: true, curve: "easeOutCirc" },
          "17900": { value: 0.7, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "2983": { value: 0.3, edited: true, curve: "easeOutCirc" },
          "3200": { value: 3, edited: true },
          "17067": { value: 0.3, edited: true, curve: "easeOutCirc" },
          "17900": { value: 0.7, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "2983": { value: 1, edited: true, curve: "linear" },
          "3167": { value: 0, edited: true },
          "17067": {
            value: Haiku.inject(
              function(hasHovered) {
                return hasHovered ? 0 : 0.8;
              },
              "hasHovered"
            ),
            edited: true
          },
          "17500": {
            value: Haiku.inject(
              function(hasHovered) {
                return hasHovered ? 0 : 0.8;
              },
              "hasHovered"
            ),
            edited: true,
            curve: "linear"
          },
          "17900": { value: 0, edited: true }
        }
      },
      "haiku:7a129d7b810d": {
        viewBox: { "0": { value: "0 0 47 53" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 47 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 53 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 0, edited: true },
          "2933": { value: 481, edited: true },
          "3117": { value: 481, edited: true, curve: "easeInOutCirc" },
          "3433": { value: 242, edited: true },
          "9867": { value: 286, edited: true },
          "10383": { value: 286, edited: true, curve: "easeOutBack" },
          "10833": { value: 433, edited: true, curve: "easeInOutCubic" },
          "11683": { value: 153, edited: true }
        },
        "translation.y": {
          "0": { value: 0, edited: true },
          "2933": { value: 297, edited: true },
          "3117": { value: 297, edited: true, curve: "easeInOutCirc" },
          "3433": { value: 285, edited: true },
          "10833": { value: 285, edited: true, curve: "easeInOutCubic" },
          "11683": { value: 434, edited: true }
        },
        "style.zIndex": {
          "0": { value: 9, edited: true },
          "3033": { value: 11, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "3033": { value: 1, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "2933": { value: 0.33, edited: true },
          "3117": { value: 0.33, edited: true, curve: "easeOutCubic" },
          "3433": { value: 1, edited: true },
          "11100": { value: 1, edited: true, curve: "easeOutCubic" },
          "11683": { value: 0.6, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "2933": { value: 0.33, edited: true },
          "3117": { value: 0.33, edited: true, curve: "easeOutCubic" },
          "3433": { value: 1, edited: true },
          "11100": { value: 1, edited: true, curve: "easeOutCubic" },
          "11683": { value: 0.6, edited: true }
        },
        "rotation.z": {
          "0": { value: 0, edited: true },
          "3117": { value: 0, edited: true, curve: "easeInOutCirc" },
          "3433": { value: 3.953340816665604, edited: true },
          "10383": {
            value: 3.953340816665604,
            edited: true,
            curve: "easeOutBack"
          },
          "10833": {
            value: Haiku.inject(
              function(Math) {
                return 3 * Math.PI;
              },
              "Math"
            ),
            edited: true
          }
        }
      },
      "haiku:061928db4be5": {
        viewBox: { "0": { value: "0 0 640 224" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 640 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 224 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 130, edited: true },
          "2483": { value: 260, edited: true },
          "3033": { value: 260, edited: true, curve: "easeInCubic" },
          "3283": { value: -124, edited: true }
        },
        "translation.y": {
          "0": { value: 179.25, edited: true },
          "2483": { value: 190.25, edited: true },
          "3033": { value: 190.25, edited: true, curve: "easeInCubic" },
          "3283": { value: 340, edited: true }
        },
        "style.zIndex": { "0": { value: 10 } },
        opacity: {
          "0": { value: 0, edited: true },
          "3033": { value: 1, edited: true, curve: "linear" },
          "3283": { value: 0, edited: true }
        },
        "rotation.x": {
          "0": { value: 0, edited: true },
          "3033": { value: 0, edited: true, curve: "easeInCubic" },
          "3283": { value: 0.4, edited: true }
        },
        "rotation.y": {
          "0": { value: 0, edited: true },
          "3033": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "3033": { value: 1, edited: true, curve: "easeInCubic" },
          "3283": { value: 0.5, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "3033": { value: 1, edited: true, curve: "easeInCubic" },
          "3283": { value: 0.5, edited: true }
        }
      },
      "haiku:6a7baa44cf2b": {
        viewBox: { "0": { value: "0 0 138 61" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 138 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 61 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -100, edited: true },
          "3433": { value: 196.1599344262294, edited: true },
          "10200": {
            value: 196.1599344262294,
            edited: true,
            curve: "easeInCubic"
          },
          "10367": { value: 243.35993442622953, edited: true },
          "10383": { value: -300, edited: true }
        },
        "translation.y": {
          "0": { value: 281.5, edited: true },
          "3433": { value: 280.6806666666665, edited: true }
        },
        "style.zIndex": {
          "0": { value: 11, edited: true },
          "3400": { value: 13, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "3433": {
            value: 0.20312948443810833,
            edited: true,
            curve: "easeOutBack"
          },
          "3650": { value: 1, edited: true },
          "10200": { value: 1, edited: true, curve: "easeInCubic" },
          "10367": { value: 0.31594202898550694, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "3433": {
            value: 0.5702513661202182,
            edited: true,
            curve: "easeOutBack"
          },
          "3650": { value: 1, edited: true },
          "10350": { value: 1, edited: true, curve: "linear" },
          "10383": { value: 0.3, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "3433": { value: 1, edited: true }
        }
      },
      "haiku:17fda90a18d5": {
        viewBox: { "0": { value: "0 0 343 61" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 343 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 61 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -350, edited: true },
          "3650": {
            value: 120.19999999999987,
            edited: true,
            curve: "easeOutCirc"
          },
          "4117": { value: 318.1999999999999, edited: true },
          "9933": {
            value: 318.1999999999999,
            edited: true,
            curve: "easeInCubic"
          },
          "10333": { value: 152.59999999999968, edited: true },
          "10350": { value: -300, edited: true }
        },
        "translation.y": {
          "0": { value: 280.5, edited: true },
          "3650": { value: 280.5, edited: true }
        },
        "style.zIndex": { "0": { value: 12 } },
        "scale.x": {
          "0": { value: 1 },
          "3650": {
            value: 0.17900874635568506,
            edited: true,
            curve: "easeOutBack"
          },
          "4117": { value: 1, edited: true },
          "9933": { value: 1, edited: true, curve: "easeInCubic" },
          "10350": { value: 0.034402332361515256, edited: true }
        }
      },
      "haiku:b334c4fa4453": {
        viewBox: { "0": { value: "0 0 97 17" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 97 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 17 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -299, edited: true },
          "3567": { value: 216.4166603088379, edited: true },
          "10283": { value: -300, edited: true }
        },
        "translation.y": {
          "0": { value: 301.8125, edited: true },
          "3567": { value: 304.0625, edited: true }
        },
        "style.zIndex": { "0": { value: 13 } },
        "scale.x": {
          "0": { value: 1, edited: true },
          "3567": { value: 0.6, edited: true, curve: "easeOutCubic" },
          "3750": { value: 1, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "3567": { value: 0.6, edited: true, curve: "easeOutCubic" },
          "3750": { value: 1, edited: true }
        }
      },
      "haiku:8d326c2993a5": {
        viewBox: { "0": { value: "0 0 435 151" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 435 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 151 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -439, edited: true },
          "3983": { value: 219.91666030883763, edited: true },
          "10067": { value: -200, edited: true },
          "14200": { value: -145, edited: true }
        },
        "translation.y": {
          "0": { value: 221.0625, edited: true },
          "3983": { value: 251.55053146402656, edited: true },
          "14200": { value: 225.0625, edited: true }
        },
        "style.zIndex": {
          "0": { value: 14 },
          "3983": { value: 11, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "4000": { value: 1.3468505747126427, edited: true }
        },
        opacity: {
          "0": { value: 1, edited: true },
          "3983": { value: 0, edited: true, curve: "linear" },
          "4217": { value: 0.4, edited: true },
          "9850": { value: 0.6, edited: true, curve: "linear" },
          "10067": { value: 0, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "4000": { value: 0.9932189597884316, edited: true }
        }
      },
      "haiku:830339d042ae": {
        viewBox: { "0": { value: "0 0 4 35" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 4 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 35 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -100, edited: true },
          "4133": { value: 353, edited: true },
          "5000": { value: 363, edited: true },
          "6400": { value: 382, edited: true },
          "7017": { value: 395, edited: true },
          "7383": { value: 408, edited: true },
          "7750": { value: 419, edited: true },
          "8100": { value: 430, edited: true },
          "8600": { value: 444, edited: true }
        },
        "translation.y": {
          "0": { value: 285.5, edited: true },
          "4133": { value: 293.5, edited: true }
        },
        "style.zIndex": { "0": { value: 15 } },
        opacity: {
          "0": { value: 0, edited: true },
          "3900": { value: 0, edited: true },
          "4117": { value: 1, edited: true },
          "4567": { value: 0, edited: true },
          "5000": { value: 1, edited: true },
          "5400": { value: 0, edited: true },
          "5783": { value: 1, edited: true },
          "6183": { value: 0, edited: true },
          "6400": { value: 1, edited: true, curve: "easeOutCubic" },
          "6783": { value: 0, edited: true },
          "7017": { value: 1, edited: true },
          "7383": { value: 1, edited: true, curve: "easeOutCirc" },
          "7933": { value: 0, edited: true },
          "8100": { value: 1, edited: true, curve: "easeOutCubic" },
          "8383": { value: 0, edited: true },
          "8600": { value: 1, edited: true, curve: "easeOutCubic" },
          "8900": { value: 0, edited: true },
          "9217": { value: 1, edited: true, curve: "easeOutCubic" },
          "9550": { value: 0, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "5000": { value: 1.2, edited: true, curve: "easeOutCubic" },
          "5150": { value: 1, edited: true },
          "6400": { value: 1.5, edited: true, curve: "easeOutCubic" },
          "6533": { value: 1, edited: true },
          "7017": { value: 1.5, edited: true, curve: "easeOutCubic" },
          "7167": { value: 1, edited: true },
          "7383": { value: 1.5, edited: true, curve: "easeOutCubic" },
          "7533": { value: 1, edited: true },
          "7750": { value: 1.5, edited: true, curve: "easeOutCubic" },
          "7917": { value: 1, edited: true },
          "8100": { value: 1.5, edited: true, curve: "easeOutCubic" },
          "8267": { value: 1, edited: true },
          "8600": { value: 1.5, edited: true, curve: "easeOutCubic" },
          "8750": { value: 1, edited: true }
        }
      },
      "haiku:dc742dcd9f12": {
        viewBox: { "0": { value: "0 0 9 6" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 9 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 6 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -20, edited: true },
          "5000": { value: 353.5, edited: true },
          "10283": { value: -200, edited: true }
        },
        "translation.y": {
          "0": { value: 311, edited: true },
          "5000": { value: 310, edited: true }
        },
        "style.zIndex": { "0": { value: 16 } },
        "scale.x": {
          "0": { value: 1, edited: true },
          "5000": { value: 0.6, edited: true, curve: "easeOutCubic" },
          "5150": { value: 1, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "5000": { value: 0.6, edited: true, curve: "easeOutCubic" },
          "5150": { value: 1, edited: true }
        }
      },
      "haiku:75827fef0c84": {
        viewBox: { "0": { value: "0 0 94 71" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 94 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 71 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -200, edited: true },
          "5000": { value: 299, edited: true },
          "9683": { value: 299, edited: true, curve: "easeInCubic" },
          "9900": { value: 309, edited: true }
        },
        "translation.y": {
          "0": { value: 235, edited: true },
          "5000": { value: 260, edited: true, curve: "easeOutBack" },
          "5417": { value: 230, edited: true },
          "9683": { value: 230, edited: true, curve: "easeInCubic" },
          "9900": { value: 270, edited: true }
        },
        "style.zIndex": { "0": { value: 17 } },
        opacity: {
          "0": { value: 1, edited: true },
          "5000": { value: 0, edited: true, curve: "linear" },
          "5150": { value: 1, edited: true },
          "9683": { value: 1, edited: true, curve: "linear" },
          "9883": { value: 0, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "5000": { value: 0.3, edited: true, curve: "easeOutCubic" },
          "5417": { value: 1, edited: true },
          "9683": { value: 1, edited: true, curve: "easeInCubic" },
          "9900": { value: 0.3, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "5000": { value: 0.7, edited: true, curve: "easeOutCubic" },
          "5417": { value: 1, edited: true },
          "9683": { value: 1, edited: true, curve: "easeInCubic" },
          "9900": { value: 0.3, edited: true }
        }
      },
      "haiku:2d3910d542ef": {
        viewBox: { "0": { value: "0 0 6 6" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 6 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 6 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -20, edited: true },
          "5417": { value: 331, edited: true },
          "9717": { value: -300, edited: true }
        },
        "translation.y": {
          "0": { value: 266, edited: true },
          "5417": { value: 257, edited: true }
        },
        "style.zIndex": { "0": { value: 18 } },
        opacity: {
          "0": { value: 1, edited: true },
          "5417": { value: 0.8, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "5417": { value: 0.7, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "5417": { value: 0.7, edited: true }
        }
      },
      "haiku:2d3910d542ef-26e560": {
        viewBox: { "0": { value: "0 0 6 6" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 6 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 6 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -20, edited: true },
          "5417": { value: 344, edited: true },
          "9683": { value: -300, edited: true }
        },
        "translation.y": {
          "0": { value: 266, edited: true },
          "5417": { value: 257, edited: true }
        },
        "style.zIndex": { "0": { value: 19 } },
        opacity: {
          "0": { value: 1, edited: true },
          "5417": { value: 0.8, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "5417": { value: 0.7, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "5417": { value: 0.7, edited: true }
        }
      },
      "haiku:2d3910d542ef-d9d426": {
        viewBox: { "0": { value: "0 0 6 6" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 6 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 6 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -20, edited: true },
          "5417": { value: 357, edited: true },
          "9683": { value: -300, edited: true }
        },
        "translation.y": {
          "0": { value: 266, edited: true },
          "5417": { value: 257, edited: true }
        },
        "style.zIndex": { "0": { value: 20 } },
        opacity: {
          "0": { value: 1, edited: true },
          "5417": { value: 0.8, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "5417": { value: 0.7, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "5417": { value: 0.7, edited: true }
        }
      },
      "haiku:bbc639cf4dd6": {
        viewBox: { "0": { value: "0 0 76 15" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 76 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 15 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -100, edited: true },
          "6400": { value: 366.704, edited: true },
          "10283": { value: -300, edited: true }
        },
        "translation.y": { "0": { value: 305.3, edited: true } },
        "style.zIndex": { "0": { value: 21 } }
      },
      "haiku:713fed8ac321": {
        viewBox: { "0": { value: "0 0 15 11" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 15 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 11 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -30, edited: true },
          "6400": { value: 366.14, edited: true },
          "10283": { value: -399, edited: true }
        },
        "translation.y": {
          "0": { value: 306.276, edited: true },
          "6400": { value: 308.276, edited: true }
        },
        "style.zIndex": { "0": { value: 22 } },
        "scale.x": {
          "0": { value: 1, edited: true },
          "6400": { value: 0.2, edited: true, curve: "easeOutBack" },
          "6533": { value: 1, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "6400": { value: 0.2, edited: true, curve: "easeOutBack" },
          "6533": { value: 1, edited: true }
        }
      },
      "haiku:c4e8215e7ccd": {
        viewBox: { "0": { value: "0 0 11 12" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 11 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 12 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -200, edited: true },
          "7017": { value: 383.692, edited: true },
          "10283": { value: -300, edited: true }
        },
        "translation.y": {
          "0": { value: 306.8, edited: true },
          "7017": { value: 307.8, edited: true }
        },
        "style.zIndex": { "0": { value: 23 } },
        "scale.x": {
          "0": { value: 1, edited: true },
          "7017": { value: 0.2, edited: true, curve: "easeOutBack" },
          "7167": { value: 1, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "7017": { value: 0.2, edited: true, curve: "easeOutBack" },
          "7167": { value: 1, edited: true }
        }
      },
      "haiku:24c9175f69ec": {
        viewBox: { "0": { value: "0 0 9 12" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 9 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 12 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -90, edited: true },
          "7383": { value: 398.076, edited: true },
          "10283": { value: -300, edited: true }
        },
        "translation.y": {
          "0": { value: 306.8, edited: true },
          "7383": { value: 307.8, edited: true }
        },
        "style.zIndex": { "0": { value: 24 } },
        "scale.x": {
          "0": { value: 1, edited: true },
          "7383": { value: 0.2, edited: true, curve: "easeOutBack" },
          "7533": { value: 1, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "7383": { value: 0.2, edited: true, curve: "easeOutBack" },
          "7533": { value: 1, edited: true }
        }
      },
      "haiku:e3f962d5265c": {
        viewBox: { "0": { value: "0 0 9 12" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 9 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 12 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -80, edited: true },
          "7750": { value: 409.75600000000003, edited: true },
          "10283": { value: -300, edited: true }
        },
        "translation.y": { "0": { value: 307.824, edited: true } },
        "style.zIndex": { "0": { value: 25 } },
        "scale.x": {
          "0": { value: 1, edited: true },
          "7750": { value: 0.2, edited: true, curve: "easeOutBack" },
          "7917": { value: 1, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "7750": { value: 0.2, edited: true, curve: "easeOutBack" },
          "7917": { value: 1, edited: true }
        }
      },
      "haiku:9504f28bb0e4": {
        viewBox: { "0": { value: "0 0 10 12" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 10 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 12 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -100, edited: true },
          "8100": { value: 420.37600000000003, edited: true },
          "10283": { value: -300, edited: true }
        },
        "translation.y": { "0": { value: 307.824, edited: true } },
        "style.zIndex": { "0": { value: 26 } },
        "scale.x": {
          "0": { value: 1, edited: true },
          "8100": { value: 0.2, edited: true, curve: "easeOutBack" },
          "8267": { value: 1, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "8100": { value: 0.2, edited: true, curve: "easeOutBack" },
          "8267": { value: 1, edited: true }
        }
      },
      "haiku:8cf12bb597a1": {
        viewBox: { "0": { value: "0 0 12 14" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 12 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 14 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -200, edited: true },
          "8600": { value: 430.808, edited: true },
          "10283": { value: -300, edited: true }
        },
        "translation.y": { "0": { value: 304.776, edited: true } },
        "style.zIndex": { "0": { value: 27 } },
        "scale.x": {
          "0": { value: 1, edited: true },
          "8600": { value: 0.2, edited: true, curve: "easeOutBack" },
          "8767": { value: 1, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "8600": { value: 0.2, edited: true, curve: "easeOutBack" },
          "8767": { value: 1, edited: true }
        }
      },
      "haiku:9bbc47edc527": {
        viewBox: { "0": { value: "0 0 190 84" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 190 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 84 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -200, edited: true },
          "8600": { value: 334, edited: true },
          "9550": { value: 334, edited: true, curve: "easeInCubic" },
          "9783": { value: 319, edited: true }
        },
        "translation.y": {
          "0": { value: 319, edited: true },
          "7017": { value: 322, edited: true },
          "8600": { value: 321.5, edited: true },
          "9550": { value: 321.5, edited: true, curve: "easeInCubic" },
          "9783": { value: 271.5, edited: true }
        },
        "style.zIndex": { "0": { value: 29 } },
        opacity: {
          "0": { value: 0, edited: true },
          "7017": { value: 1, edited: true },
          "9550": { value: 1, edited: true, curve: "linear" },
          "9717": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "9550": { value: 1, edited: true, curve: "easeInCubic" },
          "9783": { value: 0.3, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "9550": { value: 1, edited: true, curve: "easeInCubic" },
          "9783": { value: 0.3, edited: true }
        }
      },
      "haiku:185efe6f3f71": {
        viewBox: { "0": { value: "0 0 188 133" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 188 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 133 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -300, edited: true },
          "6400": { value: 334, edited: true },
          "7017": { value: -300, edited: true }
        },
        "translation.y": {
          "0": { value: 327.5, edited: true },
          "6400": { value: 315, edited: true, curve: "easeOutCubic" },
          "6533": { value: 321.5, edited: true }
        },
        "style.zIndex": { "0": { value: 30 } },
        opacity: {
          "0": { value: 1, edited: true },
          "6400": { value: 0, edited: true, curve: "linear" },
          "6450": { value: 1, edited: true }
        }
      },
      "haiku:28f7ea213958": {
        viewBox: { "0": { value: "0 0 188 106" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 188 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 106 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -330, edited: true },
          "7017": { value: 334, edited: true },
          "8600": { value: -300, edited: true }
        },
        "translation.y": {
          "0": { value: 276, edited: true },
          "7017": { value: 321.5, edited: true }
        },
        "style.zIndex": { "0": { value: 31 } }
      },
      "haiku:624efe4fda7f": {
        viewBox: { "0": { value: "0 0 89 100" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 89 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 100 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -300, edited: true },
          "11933": { value: 298.5, edited: true },
          "16050": { value: -300, edited: true }
        },
        "translation.y": {
          "0": { value: 158, edited: true },
          "11933": { value: 157, edited: true }
        },
        "style.zIndex": {
          "0": { value: 33 },
          "11933": { value: 34, edited: true }
        },
        "rotation.z": {
          "0": { value: 0, edited: true },
          "12933": { value: 0, edited: true, curve: "linear" },
          "13783": {
            value: 3.1392442555653552,
            edited: true,
            curve: "easeInOutCubic"
          },
          "14367": { value: 1.5559834152223422, edited: true, curve: "linear" },
          "14800": {
            value: 2.3164070796011482,
            edited: true,
            curve: "easeOutBack"
          },
          "15150": { value: 0, edited: true }
        }
      },
      "haiku:a37840067945": {
        viewBox: { "0": { value: "0 0 208 53" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 208 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 53 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -400, edited: true },
          "11933": { value: 421, edited: true },
          "16050": { value: -380, edited: true }
        },
        "translation.y": {
          "0": { value: 174.5, edited: true },
          "11933": { value: 181.5, edited: true }
        },
        "style.zIndex": { "0": { value: 35 } }
      },
      "haiku:8b847d4fc375": {
        viewBox: { "0": { value: "0 0 342 132" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 342 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 132 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -400, edited: true },
          "11933": { value: 292, edited: true },
          "15450": { value: 292, edited: true },
          "16050": { value: -400, edited: true }
        },
        "translation.y": {
          "0": { value: 129, edited: true },
          "11933": { value: 135, edited: true },
          "15450": { value: 135, edited: true }
        },
        "style.zIndex": {
          "0": { value: 36 },
          "11933": { value: 33, edited: true }
        },
        "scale.x": {
          "0": { value: 1 },
          "15450": { value: 1.1929824561403526, edited: true }
        },
        "scale.y": {
          "0": { value: 1 },
          "15450": { value: 1.1818181818181817, edited: true }
        },
        "style.cursor": {
          "0": { value: "", edited: true },
          "15450": { value: "pointer", edited: true }
        }
      },
      "haiku:3ab4eda0201c": {
        viewBox: { "0": { value: "0 0 425 189" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 425 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 189 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 282.5, edited: true },
          "10817": { value: 527.625, edited: true, curve: "easeOutCubic" },
          "11917": { value: 250.625, edited: true }
        },
        "translation.y": {
          "0": { value: -300, edited: true },
          "10817": { value: -300, edited: true, curve: "easeOutCubic" },
          "11917": { value: 102.875, edited: true },
          "16050": { value: 102.875, edited: true, curve: "easeInOutCubic" },
          "16450": { value: 206.875, edited: true }
        },
        "style.zIndex": {
          "0": { value: 37, edited: true },
          "6467": { value: 32, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "10817": { value: 1.3, edited: true, curve: "easeOutCubic" },
          "11917": { value: 1, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "10817": { value: 1.3, edited: true, curve: "easeOutCubic" },
          "11917": { value: 1, edited: true }
        }
      },
      "haiku:e6ecbf414bf7": {
        viewBox: { "0": { value: "0 0 409 158" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 409 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 158 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -450, edited: true },
          "12950": { value: 258.5, edited: true }
        },
        "translation.y": {
          "0": { value: 120, edited: true },
          "12950": { value: 122, edited: true },
          "16900": { value: 228, edited: true }
        },
        "style.zIndex": {
          "0": { value: 38 },
          "16900": { value: 100, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "12950": { value: 1, edited: true },
          "14800": { value: 0, edited: true },
          "16900": {
            value: Haiku.inject(
              function(isHovered) {
                return isHovered ? 1 : 0;
              },
              "isHovered"
            ),
            edited: true
          }
        },
        "style.cursor": {
          "0": { value: "", edited: true },
          "16900": { value: "auto", edited: true }
        },
        pointerEvents: {
          "0": { value: "none", edited: true },
          "16900": { value: "auto", edited: true }
        }
      },
      "haiku:86486d90958e": {
        viewBox: { "0": { value: "0 0 67 86" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 67 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 86 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 155.5, edited: true },
          "15050": { value: 134.5, edited: true }
        },
        "translation.y": {
          "0": { value: 410, edited: true },
          "15050": { value: 419, edited: true }
        },
        "style.zIndex": { "0": { value: 39 } },
        opacity: {
          "0": { value: 0, edited: true },
          "15050": { value: 0, edited: true, curve: "linear" },
          "15450": { value: 1, edited: true }
        }
      },
      "haiku:a9deaef426d6": {
        viewBox: { "0": { value: "0 0 99 600" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 99 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 600 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 800.5, edited: true } },
        "translation.y": { "0": { value: 0, edited: true } },
        "style.zIndex": { "0": { value: 40 } }
      },
      "haiku:e3b22ca7677e": {
        viewBox: { "0": { value: "0 0 99 600" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 99 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 600 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 15.5, edited: true } },
        "translation.y": { "0": { value: 1, edited: true } },
        "style.zIndex": { "0": { value: 41 } },
        "scale.x": { "0": { value: -0.9999999999999999, edited: true } }
      },
      "haiku:3ed8746021f6": {
        viewBox: { "0": { value: "0 0 99 600" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 99 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 600 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 407.00722500043304, edited: true } },
        "translation.y": { "0": { value: -251.01232331367413, edited: true } },
        "style.zIndex": { "0": { value: 42 } },
        "rotation.z": { "0": { value: 4.710940411074011, edited: true } },
        "scale.y": { "0": { value: 1.3850333960058705, edited: true } }
      },
      "haiku:9214cf7c8835": {
        viewBox: { "0": { value: "0 0 20 600" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 20 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 600 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 880, edited: true },
          "15883": { value: 883, edited: true }
        },
        "translation.y": {
          "0": { value: -24.5, edited: true },
          "15883": { value: 0.5, edited: true }
        },
        "style.zIndex": { "0": { value: 43 } }
      },
      "haiku:60bcb9094320": {
        viewBox: { "0": { value: "0 0 473 213" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 473 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 213 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -400, edited: true },
          "15883": { value: 218.5, edited: true }
        },
        "translation.y": {
          "0": { value: 218.5, edited: true },
          "15883": { value: 213.5, edited: true },
          "16450": { value: 198.5, edited: true }
        },
        "style.zIndex": { "0": { value: 44 } },
        opacity: {
          "0": { value: 1, edited: true },
          "15883": { value: 0, edited: true },
          "16517": { value: 0, edited: true, curve: "linear" },
          "16650": { value: 1, edited: true }
        }
      },
      "haiku:d4ab44f7468e": {
        viewBox: { "0": { value: "0 0 129 130" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 129 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 130 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -300, edited: true },
          "15883": { value: 278.5, edited: true }
        },
        "translation.y": {
          "0": { value: 248, edited: true },
          "15883": { value: 243, edited: true },
          "16650": { value: 302.5, edited: true, curve: "easeOutCirc" },
          "16900": { value: 243, edited: true }
        },
        "style.zIndex": { "0": { value: 45 } },
        opacity: {
          "0": { value: 1, edited: true },
          "15883": { value: 0, edited: true },
          "16650": { value: 1, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "16650": {
            value: 0.08461538461538484,
            edited: true,
            curve: "easeOutCirc"
          },
          "16900": { value: 1, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "16650": { value: 0.7, edited: true, curve: "easeOutCirc" },
          "16900": { value: 1, edited: true }
        }
      },
      "haiku:d8cef8cf74ee": {
        viewBox: { "0": { value: "0 0 235 117" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 235 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 117 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -350, edited: true },
          "15883": { value: 419.5, edited: true }
        },
        "translation.y": {
          "0": { value: 147.5, edited: true },
          "15883": { value: 232.5, edited: true },
          "16650": { value: 285.5, edited: true, curve: "easeOutCirc" },
          "16900": { value: 229.5, edited: true }
        },
        "style.zIndex": { "0": { value: 47 } },
        opacity: {
          "0": { value: 1, edited: true },
          "15883": { value: 0, edited: true },
          "16450": { value: 0, edited: true },
          "16650": { value: 1, edited: true }
        },
        "scale.y": {
          "0": { value: 1 },
          "16650": {
            value: 0.09401709401709388,
            edited: true,
            curve: "easeOutCirc"
          },
          "16900": { value: 1, edited: true }
        }
      },
      "haiku:db452eaec029": {
        viewBox: { "0": { value: "0 0 293 213" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 293 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 213 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -350, edited: true },
          "15883": { value: 419.5, edited: true }
        },
        "translation.y": {
          "0": { value: 123.5, edited: true },
          "15883": { value: 88.5, edited: true },
          "16450": { value: 192.5, edited: true }
        },
        "style.zIndex": { "0": { value: 48 } },
        opacity: {
          "0": { value: 1, edited: true },
          "15883": { value: 0, edited: true },
          "16650": { value: 1, edited: true }
        }
      },
      "haiku:6658141ee5d1": {
        viewBox: { "0": { value: "0 0 86 13" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 86 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 13 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -300, edited: true },
          "16900": { value: 424, edited: true }
        },
        "translation.y": {
          "0": { value: 372.5, edited: true },
          "16900": { value: 389.5, edited: true, curve: "easeOutCubic" },
          "17067": { value: 402.5, edited: true }
        },
        "style.zIndex": { "0": { value: 49 } },
        opacity: {
          "0": { value: 0, edited: true },
          "16900": { value: 1, edited: true, curve: "linear" },
          "17000": {
            value: Haiku.inject(
              function(replayHovered) {
                return replayHovered ? 1 : 0.7;
              },
              "replayHovered"
            ),
            edited: true
          }
        },
        cursor: {
          "0": { value: "", edited: true },
          "17067": { value: "pointer", edited: true }
        }
      },
      "haiku:5f6585ad2ac0": {
        viewBox: { "0": { value: "0 0 16 15" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 16 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 15 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -300, edited: true },
          "17067": { value: 610, edited: true }
        },
        "translation.y": { "0": { value: 356.5, edited: true } },
        "style.zIndex": { "0": { value: 50 } },
        opacity: {
          "0": { value: 1, edited: true },
          "17067": {
            value: Haiku.inject(
              function(hasHovered) {
                return hasHovered ? 0 : 1;
              },
              "hasHovered"
            ),
            edited: true
          }
        }
      },
      "haiku:e9838c61bb6e": {
        viewBox: { "0": { value: "0 0 182 183" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 182 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 183 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -300, edited: true },
          "16650": { value: 253, edited: true }
        },
        "translation.y": {
          "0": { value: 226.5, edited: true },
          "16650": { value: 217.5, edited: true }
        },
        "style.zIndex": {
          "0": { value: 51, edited: true },
          "16550": { value: 46, edited: true }
        },
        opacity: {
          "0": { value: 1, edited: true },
          "16650": { value: 1, edited: true }
        },
        "rotation.z": {
          "0": { value: 0, edited: true },
          "18000": { value: 0, edited: true, curve: "easeOutCubic" },
          "18367": {
            value: Haiku.inject(
              function($user) {
                return $user.mouse.x / 200;
              },
              "$user"
            ),
            edited: true
          },
          "19000": {
            value: Haiku.inject(
              function($user) {
                return $user.mouse.x / 200;
              },
              "$user"
            ),
            edited: true,
            curve: "easeOutBack"
          },
          "19383": { value: 0, edited: true }
        }
      },
      "haiku:2dc2368f1823": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -430 } },
        "translation.y": { "0": { value: -224 } }
      },
      "haiku:80199a74c3e6": {
        fill: { "0": { value: "#0C1112" } },
        "translation.x": { "0": { value: 159 } },
        "translation.y": { "0": { value: 144 } }
      },
      "haiku:f942d8eff3fd": {
        d: {
          "0": {
            value: "M271.298164,130.48082 L271.298164,82.8318303 C271.298164,82.1120571 271.94596,81.4642611 272.665733,81.4642611 L277.416236,81.4642611 C278.207987,81.4642611 278.783806,82.1120571 278.783806,82.8318303 L278.783806,102.913504 L305.127507,102.913504 L305.127507,82.8318303 C305.127507,82.1120571 305.703325,81.4642611 306.495076,81.4642611 L311.24558,81.4642611 C311.965353,81.4642611 312.613149,82.1120571 312.613149,82.8318303 L312.613149,130.48082 C312.613149,131.200593 311.965353,131.848389 311.24558,131.848389 L306.495076,131.848389 C305.703325,131.848389 305.127507,131.200593 305.127507,130.48082 L305.127507,109.679373 L278.783806,109.679373 L278.783806,130.48082 C278.783806,131.200593 278.207987,131.848389 277.416236,131.848389 L272.665733,131.848389 C271.94596,131.848389 271.298164,131.200593 271.298164,130.48082 Z M320.903469,131.848389 C319.823809,131.848389 319.247991,130.912684 319.679855,129.976979 L341.776894,81.5362385 C341.992826,81.1043745 342.640622,80.7444879 343.000508,80.7444879 L343.720282,80.7444879 C344.080168,80.7444879 344.727964,81.1043745 344.943896,81.5362385 L366.896981,129.976979 C367.328845,130.912684 366.753026,131.848389 365.673366,131.848389 L361.138794,131.848389 C360.275067,131.848389 359.771225,131.416525 359.483316,130.768729 L355.020722,120.907836 L331.484136,120.907836 C330.04459,124.218793 328.533066,127.457772 327.093519,130.768729 C326.877587,131.272571 326.301769,131.848389 325.438041,131.848389 L320.903469,131.848389 Z M334.291252,114.717786 L352.285583,114.717786 L343.432372,94.9959984 L343.072486,94.9959984 L334.291252,114.717786 Z M373.963687,130.48082 L373.963687,82.8318303 C373.963687,82.1120571 374.611482,81.4642611 375.331256,81.4642611 L380.081759,81.4642611 C380.801533,81.4642611 381.449328,82.1120571 381.449328,82.8318303 L381.449328,130.48082 C381.449328,131.200593 380.801533,131.848389 380.081759,131.848389 L375.331256,131.848389 C374.611482,131.848389 373.963687,131.200593 373.963687,130.48082 Z M395.281903,130.120934 L395.281903,83.191717 C395.281903,82.2560117 396.001676,81.4642611 397.009359,81.4642611 L401.184044,81.4642611 C402.119749,81.4642611 402.9115,82.2560117 402.9115,83.191717 L402.9115,103.129436 L423.209106,82.1840344 C423.497015,81.8241478 424.000856,81.4642611 424.576675,81.4642611 L429.974974,81.4642611 C431.270566,81.4642611 431.990339,82.975785 430.982657,84.0554449 L410.18121,105.216779 L432.206271,129.473138 C432.78209,130.192911 432.422203,131.848389 430.910679,131.848389 L425.152493,131.848389 C424.43272,131.848389 424.000856,131.56048 423.856901,131.344548 L402.9115,107.735985 L402.9115,130.120934 C402.9115,131.056639 402.119749,131.848389 401.184044,131.848389 L397.009359,131.848389 C396.001676,131.848389 395.281903,131.056639 395.281903,130.120934 Z M439.488909,113.062307 L439.488909,82.8318303 C439.488909,82.1120571 440.136705,81.4642611 440.856478,81.4642611 L445.678959,81.4642611 C446.47071,81.4642611 447.046528,82.1120571 447.046528,82.8318303 L447.046528,112.558466 C447.046528,119.756199 451.653077,125.37043 458.994765,125.37043 C466.408429,125.37043 471.086955,119.828176 471.086955,112.702421 L471.086955,82.8318303 C471.086955,82.1120571 471.662774,81.4642611 472.454525,81.4642611 L477.277005,81.4642611 C477.996779,81.4642611 478.644575,82.1120571 478.644575,82.8318303 L478.644575,113.062307 C478.644575,124.002861 470.367182,132.568163 458.994765,132.568163 C447.694324,132.568163 439.488909,124.002861 439.488909,113.062307 Z"
          }
        }
      },
      "haiku:369b530a41be": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "4.69999981" } },
        "sizeAbsolute.x": { "0": { value: 62.1 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 39.1 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:ca03764159a2": {
        x: { "0": { value: "-44.3%" } },
        y: { "0": { value: "-52.4%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 1.886 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 2.407 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:65b373f52be4": {
        dx: { "0": { value: "0" } },
        dy: { "0": { value: "7" } },
        in: { "0": { value: "SourceAlpha" } },
        result: { "0": { value: "shadowOffsetOuter1" } }
      },
      "haiku:a118f5f072ec": {
        stdDeviation: { "0": { value: "8" } },
        in: { "0": { value: "shadowOffsetOuter1" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:7f08e30bfad1": {
        values: {
          "0": {
            value: "0 0 0 0 0.0268920068   0 0 0 0 0   0 0 0 0 0.0105154642  0 0 0 0.402088995 0"
          }
        },
        in: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:6e65c773e080": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -309 } },
        "translation.y": { "0": { value: -117 } }
      },
      "haiku:00b6129ac4ab": {
        "translation.x": { "0": { value: 210 } },
        "translation.y": { "0": { value: 126 } }
      },
      "haiku:cdc7440aac60": { "translation.x": { "0": { value: 115 } } },
      "haiku:c94dba50d51a": {
        fill: { "0": { value: "black" } },
        "fill-opacity": { "0": { value: "1" } },
        filter: { "0": { value: "url(#filter-2-632e9a)" } }
      },
      "haiku:85cf2251288b": {
        fill: { "0": { value: "#131E20" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:99a75dbfd7ef": {
        fill: { "0": { value: "#131E20" } },
        points: {
          "0": {
            value: "30.2805187 35.8033146 43.8902593 52.2516142 57.5 35.6492674"
          }
        }
      },
      "haiku:ea4738cba30c": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -230 } },
        "translation.y": { "0": { value: -191 } }
      },
      "haiku:0f3e15266282": {
        fill: { "0": { value: "#FFFFFF" } },
        "translation.x": { "0": { value: 210 } },
        "translation.y": { "0": { value: 126 } }
      },
      "haiku:718ea8b23e10": {
        d: {
          "0": {
            value: "M22.8953851,74.784 L22.8953851,81.5 L20.7103851,81.5 L20.7103851,65.653 L24.8733851,65.653 C26.851395,65.653 28.3502133,66.0286629 29.3698851,66.78 C30.3895568,67.5313371 30.8993851,68.6506592 30.8993851,70.138 C30.8993851,71.2420055 30.6157212,72.1389965 30.0483851,72.829 C29.4810489,73.5190034 28.6223908,74.0403316 27.4723851,74.393 L31.7503851,81.5 L29.1513851,81.5 L25.3563851,74.784 L22.8953851,74.784 Z M27.7023851,72.4035 C28.2850547,71.935831 28.5763851,71.1806719 28.5763851,70.138 C28.5763851,69.1566618 28.2812214,68.4475022 27.6908851,68.0105 C27.1005488,67.5734978 26.1537249,67.355 24.8503851,67.355 L22.8953851,67.355 L22.8953851,73.105 L25.1033851,73.105 C26.2533908,73.105 27.1197155,72.871169 27.7023851,72.4035 Z M43.3839619,66.3315 C44.3883003,66.9678365 45.1702925,67.8993272 45.7299619,69.126 C46.2896314,70.3526728 46.5694619,71.8399913 46.5694619,73.588 C46.5694619,75.3053419 46.2896314,76.7773272 45.7299619,78.004 C45.1702925,79.2306728 44.3883003,80.1659968 43.3839619,80.81 C42.3796236,81.4540032 41.2104686,81.776 39.8764619,81.776 C38.5424553,81.776 37.3733003,81.4616698 36.3689619,80.833 C35.3646236,80.2043302 34.5826314,79.2766728 34.0229619,78.05 C33.4632925,76.8233272 33.1834619,75.3436753 33.1834619,73.611 C33.1834619,71.9089915 33.4632925,70.4370062 34.0229619,69.195 C34.5826314,67.9529938 35.3684569,67.0061699 36.3804619,66.3545 C37.392467,65.7028301 38.5577887,65.377 39.8764619,65.377 C41.2104686,65.377 42.3796236,65.6951635 43.3839619,66.3315 Z M36.6564619,68.735 C35.8897914,69.7776719 35.5064619,71.402989 35.5064619,73.611 C35.5064619,75.8036776 35.8936247,77.4136615 36.6679619,78.441 C37.4422991,79.4683385 38.5117885,79.982 39.8764619,79.982 C42.7898098,79.982 44.2464619,77.850688 44.2464619,73.588 C44.2464619,69.3099786 42.7898098,67.171 39.8764619,67.171 C38.496455,67.171 37.4231324,67.6923281 36.6564619,68.735 Z M54.2355388,67.516 L54.2355388,81.5 L52.0505388,81.5 L52.0505388,67.516 L47.5425388,67.516 L47.5425388,65.653 L58.8585388,65.653 L58.6285388,67.516 L54.2355388,67.516 Z M61.0736157,77.521 L59.8776157,81.5 L57.6696157,81.5 L62.7526157,65.653 L65.5126157,65.653 L70.5726157,81.5 L68.2726157,81.5 L67.0766157,77.521 L61.0736157,77.521 Z M64.0866157,67.47 L61.6026157,75.75 L66.5476157,75.75 L64.0866157,67.47 Z M76.4216925,67.516 L76.4216925,81.5 L74.2366925,81.5 L74.2366925,67.516 L69.7286925,67.516 L69.7286925,65.653 L81.0446925,65.653 L80.8146925,67.516 L76.4216925,67.516 Z M83.3977694,81.5 L83.3977694,65.653 L85.6057694,65.653 L85.6057694,81.5 L83.3977694,81.5 Z M99.1943463,66.3315 C100.198685,66.9678365 100.980677,67.8993272 101.540346,69.126 C102.100016,70.3526728 102.379846,71.8399913 102.379846,73.588 C102.379846,75.3053419 102.100016,76.7773272 101.540346,78.004 C100.980677,79.2306728 100.198685,80.1659968 99.1943463,80.81 C98.1900079,81.4540032 97.0208529,81.776 95.6868463,81.776 C94.3528396,81.776 93.1836846,81.4616698 92.1793463,80.833 C91.1750079,80.2043302 90.3930157,79.2766728 89.8333463,78.05 C89.2736768,76.8233272 88.9938463,75.3436753 88.9938463,73.611 C88.9938463,71.9089915 89.2736768,70.4370062 89.8333463,69.195 C90.3930157,67.9529938 91.1788412,67.0061699 92.1908463,66.3545 C93.2028513,65.7028301 94.368173,65.377 95.6868463,65.377 C97.0208529,65.377 98.1900079,65.6951635 99.1943463,66.3315 Z M92.4668463,68.735 C91.7001758,69.7776719 91.3168463,71.402989 91.3168463,73.611 C91.3168463,75.8036776 91.7040091,77.4136615 92.4783463,78.441 C93.2526835,79.4683385 94.3221728,79.982 95.6868463,79.982 C98.6001942,79.982 100.056846,77.850688 100.056846,73.588 C100.056846,69.3099786 98.6001942,67.171 95.6868463,67.171 C94.3068394,67.171 93.2335168,67.6923281 92.4668463,68.735 Z M113.955923,81.5 L107.515923,68.045 C107.607924,69.1030053 107.680756,70.0804955 107.734423,70.9775 C107.78809,71.8745045 107.814923,72.959327 107.814923,74.232 L107.814923,81.5 L105.767923,81.5 L105.767923,65.653 L108.619923,65.653 L115.128923,79.131 C115.082923,78.7323313 115.02159,78.0346716 114.944923,77.038 C114.868256,76.0413283 114.829923,75.1290041 114.829923,74.301 L114.829923,65.653 L116.876923,65.653 L116.876923,81.5 L113.955923,81.5 Z"
          }
        }
      },
      "haiku:55d396afdd37": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -210 } },
        "translation.y": { "0": { value: -169 } }
      },
      "haiku:124bb9892eb1": {
        fill: { "0": { value: "#DF5887" } },
        "translation.x": { "0": { value: 210 } },
        "translation.y": { "0": { value: 126 } }
      },
      "haiku:57d23f980733": {
        d: {
          "0": {
            value: "M5.06,43.7 L138,43.7 L138,103.5 L5.06,103.5 C2.26543917,103.5 3.00677026e-15,101.234561 2.66453526e-15,98.44 L0,48.76 C-3.42234998e-16,45.9654392 2.26543917,43.7 5.06,43.7 Z"
          }
        }
      },
      "haiku:d2e2ce9efefa": {
        x: { "0": { value: "-17.8%" } },
        y: { "0": { value: "-17.8%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 1.3559999999999999 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 1.3559999999999999 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:e4b80047aec4": {
        stdDeviation: { "0": { value: "2.49162946" } },
        in: { "0": { value: "SourceGraphic" } }
      },
      "haiku:970e1e8d08a9": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -398 } },
        "translation.y": { "0": { value: -277 } }
      },
      "haiku:5a1c055a2f96": {
        d: {
          "0": {
            value: "M425,323 C435.49341,323 444,314.49341 444,304 C444,293.50659 435.49341,285 425,285 C414.50659,285 406,293.50659 406,304 C406,314.49341 414.50659,323 425,323 Z M425,325 C413.40202,325 404,315.59798 404,304 C404,292.40202 413.40202,283 425,283 C436.59798,283 446,292.40202 446,304 C446,315.59798 436.59798,325 425,325 Z"
          }
        },
        fill: { "0": { value: "#DF5887" } },
        "fill-rule": { "0": { value: "nonzero" } },
        filter: { "0": { value: "url(#filter-1-8e83f2)" } }
      },
      "haiku:e81053e051a8": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -365 } },
        "translation.y": { "0": { value: -198 } }
      },
      "haiku:c1fbca40e05f": {
        fill: { "0": { value: "#FFFFFF" } },
        "translation.x": { "0": { value: 210 } },
        "translation.y": { "0": { value: 126 } }
      },
      "haiku:627481c53bd9": {
        "translation.x": { "0": { value: 154 } },
        "translation.y": { "0": { value: 59 } }
      },
      "haiku:854ff247d01c": {
        d: {
          "0": {
            value: "M9.1666,13.1538 L9.1666,14.7477 L1.3834,14.7477 L1.3834,13.1538 L9.1666,13.1538 Z M9.1666,17.1489 L9.1666,18.7428 L1.3834,18.7428 L1.3834,17.1489 L9.1666,17.1489 Z"
          }
        }
      },
      "haiku:b29739d50cfa": {
        x: { "0": { value: "109" } },
        y: { "0": { value: "20" } },
        "sizeAbsolute.x": { "0": { value: 409 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 158 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:de03a36087e4": {
        x: { "0": { value: "-3.4%" } },
        y: { "0": { value: "-6.3%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 1.068 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 1.177 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:2d82e3398e2d": {
        dx: { "0": { value: "0" } },
        dy: { "0": { value: "4" } },
        in: { "0": { value: "SourceAlpha" } },
        result: { "0": { value: "shadowOffsetOuter1" } }
      },
      "haiku:3a6d56d79454": {
        stdDeviation: { "0": { value: "4" } },
        in: { "0": { value: "shadowOffsetOuter1" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:8d45a3a07c7d": {
        values: {
          "0": {
            value: "0 0 0 0 0.0389532811   0 0 0 0 0.0512093759   0 0 0 0 0.0529602466  0 0 0 0.902145607 0"
          }
        },
        in: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:ef8fdd1a3ce4": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -260 } },
        "translation.y": { "0": { value: -145 } }
      },
      "haiku:04768f357c46": {
        "translation.x": { "0": { value: 159 } },
        "translation.y": { "0": { value: 144 } }
      },
      "haiku:75dde0068bd8": {
        fill: { "0": { value: "black" } },
        "fill-opacity": { "0": { value: "1" } },
        filter: { "0": { value: "url(#filter-2-c7f976)" } }
      },
      "haiku:6ba9942d2d2d": {
        fill: { "0": { value: "#FFFFFF" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:e421190a06f7": {
        fill: { "0": { value: "#FFFFFF" } },
        x: { "0": { value: "143" } },
        y: { "0": { value: "33" } },
        "sizeAbsolute.x": { "0": { value: 342 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 132 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:3f7eee332716": {
        d: {
          "0": {
            value: "M271.298164,130.48082 L271.298164,82.8318303 C271.298164,82.1120571 271.94596,81.4642611 272.665733,81.4642611 L277.416236,81.4642611 C278.207987,81.4642611 278.783806,82.1120571 278.783806,82.8318303 L278.783806,102.913504 L305.127507,102.913504 L305.127507,82.8318303 C305.127507,82.1120571 305.703325,81.4642611 306.495076,81.4642611 L311.24558,81.4642611 C311.965353,81.4642611 312.613149,82.1120571 312.613149,82.8318303 L312.613149,130.48082 C312.613149,131.200593 311.965353,131.848389 311.24558,131.848389 L306.495076,131.848389 C305.703325,131.848389 305.127507,131.200593 305.127507,130.48082 L305.127507,109.679373 L278.783806,109.679373 L278.783806,130.48082 C278.783806,131.200593 278.207987,131.848389 277.416236,131.848389 L272.665733,131.848389 C271.94596,131.848389 271.298164,131.200593 271.298164,130.48082 Z M320.903469,131.848389 C319.823809,131.848389 319.247991,130.912684 319.679855,129.976979 L341.776894,81.5362385 C341.992826,81.1043745 342.640622,80.7444879 343.000508,80.7444879 L343.720282,80.7444879 C344.080168,80.7444879 344.727964,81.1043745 344.943896,81.5362385 L366.896981,129.976979 C367.328845,130.912684 366.753026,131.848389 365.673366,131.848389 L361.138794,131.848389 C360.275067,131.848389 359.771225,131.416525 359.483316,130.768729 L355.020722,120.907836 L331.484136,120.907836 C330.04459,124.218793 328.533066,127.457772 327.093519,130.768729 C326.877587,131.272571 326.301769,131.848389 325.438041,131.848389 L320.903469,131.848389 Z M334.291252,114.717786 L352.285583,114.717786 L343.432372,94.9959984 L343.072486,94.9959984 L334.291252,114.717786 Z M373.963687,130.48082 L373.963687,82.8318303 C373.963687,82.1120571 374.611482,81.4642611 375.331256,81.4642611 L380.081759,81.4642611 C380.801533,81.4642611 381.449328,82.1120571 381.449328,82.8318303 L381.449328,130.48082 C381.449328,131.200593 380.801533,131.848389 380.081759,131.848389 L375.331256,131.848389 C374.611482,131.848389 373.963687,131.200593 373.963687,130.48082 Z M395.281903,130.120934 L395.281903,83.191717 C395.281903,82.2560117 396.001676,81.4642611 397.009359,81.4642611 L401.184044,81.4642611 C402.119749,81.4642611 402.9115,82.2560117 402.9115,83.191717 L402.9115,103.129436 L423.209106,82.1840344 C423.497015,81.8241478 424.000856,81.4642611 424.576675,81.4642611 L429.974974,81.4642611 C431.270566,81.4642611 431.990339,82.975785 430.982657,84.0554449 L410.18121,105.216779 L432.206271,129.473138 C432.78209,130.192911 432.422203,131.848389 430.910679,131.848389 L425.152493,131.848389 C424.43272,131.848389 424.000856,131.56048 423.856901,131.344548 L402.9115,107.735985 L402.9115,130.120934 C402.9115,131.056639 402.119749,131.848389 401.184044,131.848389 L397.009359,131.848389 C396.001676,131.848389 395.281903,131.056639 395.281903,130.120934 Z M439.488909,113.062307 L439.488909,82.8318303 C439.488909,82.1120571 440.136705,81.4642611 440.856478,81.4642611 L445.678959,81.4642611 C446.47071,81.4642611 447.046528,82.1120571 447.046528,82.8318303 L447.046528,112.558466 C447.046528,119.756199 451.653077,125.37043 458.994765,125.37043 C466.408429,125.37043 471.086955,119.828176 471.086955,112.702421 L471.086955,82.8318303 C471.086955,82.1120571 471.662774,81.4642611 472.454525,81.4642611 L477.277005,81.4642611 C477.996779,81.4642611 478.644575,82.1120571 478.644575,82.8318303 L478.644575,113.062307 C478.644575,124.002861 470.367182,132.568163 458.994765,132.568163 C447.694324,132.568163 439.488909,124.002861 439.488909,113.062307 Z"
          }
        },
        fill: { "0": { value: "#0C1112" } }
      },
      "haiku:081c16d7e12a": {
        d: {
          "0": {
            value: "M207.397683,107.815293 L207.397683,119.830005 C207.397683,121.327354 206.19908,122.541196 204.720528,122.541196 C204.29222,122.541196 203.887403,122.439336 203.52841,122.258232 C203.472218,122.238705 203.416285,122.217169 203.360692,122.19359 L167.407525,106.944854 C166.656035,106.933453 165.935269,106.600082 165.435169,106.023919 C164.780911,105.529624 164.357262,104.739629 164.357262,103.849426 L164.357262,72.7633604 C164.275504,72.6581656 164.200266,72.5463553 164.132401,72.4282962 L162.42585,71.7296429 L154.678315,68.5578433 L154.678315,142.76076 L164.357262,146.72327 L164.357262,121.784996 C164.357262,121.746201 164.358066,121.707597 164.359659,121.6692 C164.341052,121.278612 164.405976,120.877801 164.565074,120.493084 C165.13623,119.111965 166.704806,118.461247 168.068586,119.039665 L204.204733,134.36702 L204.903529,134.685483 C206.296728,134.780729 207.397683,135.955378 207.397683,137.390439 L207.397683,142.76076 L216.983464,146.685128 L217.07663,146.72327 L217.07663,103.481791 L207.397683,107.815293 Z M202.043372,109.089606 L182.518429,100.808535 L174.640479,104.133838 L202.043372,115.756166 L202.043372,109.089606 Z M169.711572,125.615213 L169.711572,147.135852 L179.390519,143.173342 L179.390519,129.720323 L169.711572,125.615213 Z M167.088096,154.110197 C167.070246,154.110552 167.052352,154.110731 167.034417,154.110731 C166.31789,154.110731 165.66711,153.82566 165.186629,153.3614 L162.42585,152.231151 L151.554715,147.780566 C150.288672,147.565338 149.324004,146.450209 149.324004,145.106905 L149.324004,144.964346 C149.322989,144.919798 149.322984,144.875142 149.324004,144.830412 L149.324004,64.4628367 C149.323069,64.4218332 149.322991,64.3807382 149.32378,64.3395774 C149.322991,64.2984166 149.323069,64.2573215 149.324004,64.2163181 L149.324004,64.1872148 C149.324004,63.3612279 149.688738,62.621512 150.263998,62.1242341 C150.51012,61.8969026 150.799614,61.7092312 151.126544,61.5753879 L165.941073,55.5103979 C166.689069,55.0860601 167.615449,55.0025009 168.467313,55.3644453 L182.368458,61.2708377 C182.4053,61.2693148 182.442333,61.268546 182.479544,61.268546 C183.958097,61.268546 185.1567,62.4823874 185.1567,63.9797367 L185.1567,64.331724 C185.157697,64.3758648 185.157701,64.4201078 185.1567,64.4644206 L185.1567,82.0901716 L202.043372,75.2021247 L202.043372,64.4628367 C202.042438,64.4218332 202.042359,64.3807382 202.043148,64.3395774 C202.042359,64.2984166 202.042438,64.2573215 202.043372,64.2163181 L202.043372,63.9797367 C202.043372,62.527607 203.170674,61.34212 204.587363,61.2718415 L218.660441,55.5103979 C219.408437,55.0860601 220.334817,55.0025009 221.186681,55.3644453 L235.668646,61.5176195 C236.923211,61.7424849 237.876068,62.8521593 237.876068,64.1872148 L237.876068,64.3317233 C237.877065,64.3758648 237.877069,64.4201078 237.876068,64.4644206 L237.876068,145.106905 C237.876068,146.106975 237.341392,146.980578 236.54574,147.450533 C236.294378,147.68822 235.996475,147.88405 235.658582,148.022382 L221.246206,153.922732 C220.309012,154.306414 219.289488,154.155513 218.517201,153.611624 L214.822362,152.098976 L203.845912,147.605275 C202.98188,147.251545 202.379331,146.52184 202.147825,145.677695 C202.085997,145.460503 202.05026,145.232112 202.044272,144.996227 C202.042417,144.941112 202.042109,144.88582 202.043372,144.830412 L202.043372,139.328149 L202.007475,139.311789 L202.043372,139.231004 L202.043372,139.328027 L184.74483,131.991235 L184.74483,145.084672 C184.74483,145.165381 184.741347,145.245267 184.734526,145.324184 C184.730722,146.475457 184.050286,147.56425 182.93124,148.022382 L168.526838,153.919467 C168.054106,154.113001 167.560427,154.17052 167.088096,154.110197 Z M222.430941,147.139117 L232.521757,143.00799 L232.521757,68.7095502 L222.430941,72.8406771 L222.430941,81.9033544 C222.430941,82.7590139 222.039531,83.5220927 221.428142,84.0189816 C221.155697,84.3669939 220.794829,84.6519686 220.361381,84.8349281 L189.465371,97.8762132 L203.274077,103.732869 L218.414559,96.9541025 C219.766849,96.348649 221.347753,96.9680164 221.945605,98.3374984 C221.959904,98.3702511 221.97351,98.4031363 221.986432,98.4361371 C222.267327,98.8650339 222.430941,99.3795499 222.430941,99.9327656 L222.430941,147.139117 Z M217.07663,72.7633604 C216.994872,72.6581656 216.919634,72.5463553 216.85177,72.4282962 L215.145218,71.7296429 L207.397683,68.5578433 L207.397683,74.852311 L217.07663,78.8148205 L217.07663,72.7633604 Z M169.711572,100.33981 L179.802389,96.0804502 L179.802389,68.7095502 L169.711572,72.8406771 L169.711572,100.33981 Z M185.1567,87.9358658 L185.1567,93.8203819 L211.344183,82.7665785 L204.669652,80.034061 C204.646437,80.024557 204.623411,80.0147815 204.600576,80.0047397 L185.1567,87.9358658 Z M212.47915,64.3395774 L217.30632,66.3157951 L220.145002,67.4779366 L227.604698,64.4239765 L220.081183,61.2273453 L212.47915,64.3395774 Z M159.759782,64.3395774 L164.586952,66.3157951 L167.425634,67.4779366 L174.88533,64.4239765 L167.361815,61.2273453 L159.759782,64.3395774 Z"
          }
        },
        fill: { "0": { value: "#0C1112" } },
        "fill-rule": { "0": { value: "nonzero" } }
      },
      "haiku:ec33d8570e83": {
        d: {
          "0": {
            value: "M207.397683,107.815293 L207.397683,119.830005 C207.397683,121.327354 206.19908,122.541196 204.720528,122.541196 C204.29222,122.541196 203.887403,122.439336 203.52841,122.258232 C203.472218,122.238705 203.416285,122.217169 203.360692,122.19359 L167.407525,106.944854 C166.656035,106.933453 165.935269,106.600082 165.435169,106.023919 C164.780911,105.529624 164.357262,104.739629 164.357262,103.849426 L164.357262,72.7633604 C164.275504,72.6581656 164.200266,72.5463553 164.132401,72.4282962 L162.42585,71.7296429 L154.678315,68.5578433 L154.678315,142.76076 L164.357262,146.72327 L164.357262,121.784996 C164.357262,121.746201 164.358066,121.707597 164.359659,121.6692 C164.341052,121.278612 164.405976,120.877801 164.565074,120.493084 C165.13623,119.111965 166.704806,118.461247 168.068586,119.039665 L204.204733,134.36702 L204.903529,134.685483 C206.296728,134.780729 207.397683,135.955378 207.397683,137.390439 L207.397683,142.76076 L216.983464,146.685128 L217.07663,146.72327 L217.07663,103.481791 L207.397683,107.815293 Z M202.043372,109.089606 L182.518429,100.808535 L174.640479,104.133838 L202.043372,115.756166 L202.043372,109.089606 Z M169.711572,125.615213 L169.711572,147.135852 L179.390519,143.173342 L179.390519,129.720323 L169.711572,125.615213 Z M167.088096,154.110197 C167.070246,154.110552 167.052352,154.110731 167.034417,154.110731 C166.31789,154.110731 165.66711,153.82566 165.186629,153.3614 L162.42585,152.231151 L151.554715,147.780566 C150.288672,147.565338 149.324004,146.450209 149.324004,145.106905 L149.324004,144.964346 C149.322989,144.919798 149.322984,144.875142 149.324004,144.830412 L149.324004,64.4628367 C149.323069,64.4218332 149.322991,64.3807382 149.32378,64.3395774 C149.322991,64.2984166 149.323069,64.2573215 149.324004,64.2163181 L149.324004,64.1872148 C149.324004,63.3612279 149.688738,62.621512 150.263998,62.1242341 C150.51012,61.8969026 150.799614,61.7092312 151.126544,61.5753879 L165.941073,55.5103979 C166.689069,55.0860601 167.615449,55.0025009 168.467313,55.3644453 L182.368458,61.2708377 C182.4053,61.2693148 182.442333,61.268546 182.479544,61.268546 C183.958097,61.268546 185.1567,62.4823874 185.1567,63.9797367 L185.1567,64.331724 C185.157697,64.3758648 185.157701,64.4201078 185.1567,64.4644206 L185.1567,82.0901716 L202.043372,75.2021247 L202.043372,64.4628367 C202.042438,64.4218332 202.042359,64.3807382 202.043148,64.3395774 C202.042359,64.2984166 202.042438,64.2573215 202.043372,64.2163181 L202.043372,63.9797367 C202.043372,62.527607 203.170674,61.34212 204.587363,61.2718415 L218.660441,55.5103979 C219.408437,55.0860601 220.334817,55.0025009 221.186681,55.3644453 L235.668646,61.5176195 C236.923211,61.7424849 237.876068,62.8521593 237.876068,64.1872148 L237.876068,64.3317233 C237.877065,64.3758648 237.877069,64.4201078 237.876068,64.4644206 L237.876068,145.106905 C237.876068,146.106975 237.341392,146.980578 236.54574,147.450533 C236.294378,147.68822 235.996475,147.88405 235.658582,148.022382 L221.246206,153.922732 C220.309012,154.306414 219.289488,154.155513 218.517201,153.611624 L214.822362,152.098976 L203.845912,147.605275 C202.98188,147.251545 202.379331,146.52184 202.147825,145.677695 C202.085997,145.460503 202.05026,145.232112 202.044272,144.996227 C202.042417,144.941112 202.042109,144.88582 202.043372,144.830412 L202.043372,139.328149 L202.007475,139.311789 L202.043372,139.231004 L202.043372,139.328027 L184.74483,131.991235 L184.74483,145.084672 C184.74483,145.165381 184.741347,145.245267 184.734526,145.324184 C184.730722,146.475457 184.050286,147.56425 182.93124,148.022382 L168.526838,153.919467 C168.054106,154.113001 167.560427,154.17052 167.088096,154.110197 Z M222.430941,147.139117 L232.521757,143.00799 L232.521757,68.7095502 L222.430941,72.8406771 L222.430941,81.9033544 C222.430941,82.7590139 222.039531,83.5220927 221.428142,84.0189816 C221.155697,84.3669939 220.794829,84.6519686 220.361381,84.8349281 L189.465371,97.8762132 L203.274077,103.732869 L218.414559,96.9541025 C219.766849,96.348649 221.347753,96.9680164 221.945605,98.3374984 C221.959904,98.3702511 221.97351,98.4031363 221.986432,98.4361371 C222.267327,98.8650339 222.430941,99.3795499 222.430941,99.9327656 L222.430941,147.139117 Z M217.07663,72.7633604 C216.994872,72.6581656 216.919634,72.5463553 216.85177,72.4282962 L215.145218,71.7296429 L207.397683,68.5578433 L207.397683,74.852311 L217.07663,78.8148205 L217.07663,72.7633604 Z M169.711572,100.33981 L179.802389,96.0804502 L179.802389,68.7095502 L169.711572,72.8406771 L169.711572,100.33981 Z M185.1567,87.9358658 L185.1567,93.8203819 L211.344183,82.7665785 L204.669652,80.034061 C204.646437,80.024557 204.623411,80.0147815 204.600576,80.0047397 L185.1567,87.9358658 Z M212.47915,64.3395774 L217.30632,66.3157951 L220.145002,67.4779366 L227.604698,64.4239765 L220.081183,61.2273453 L212.47915,64.3395774 Z M159.759782,64.3395774 L164.586952,66.3157951 L167.425634,67.4779366 L174.88533,64.4239765 L167.361815,61.2273453 L159.759782,64.3395774 Z"
          }
        },
        fill: { "0": { value: "#0C1112" } },
        "fill-rule": { "0": { value: "nonzero" } }
      },
      "haiku:1f26b80a7c1f": {
        stroke: { "0": { value: "#94999A" } },
        "stroke-linecap": { "0": { value: "round" } },
        "stroke-width": { "0": { value: "0.8928" } },
        "translation.x": { "0": { value: 110 } },
        "translation.y": { "0": { value: 1 } }
      },
      "haiku:9700d7ef74d5": {
        d: { "0": { value: "M1.23076923,3.94454383 L7,0.563506261" } }
      },
      "haiku:07ceb99d08bb": {
        d: { "0": { value: "M1.23076923,3.94454383 L1.23076923,10.0304114" } }
      },
      "haiku:7ff4ada1302c": {
        d: { "0": { value: "M12.7692308,3.94454383 L12.7692308,10.0304114" } }
      },
      "haiku:fedb821e0f5c": {
        d: { "0": { value: "M7,7.3255814 L7,12.960644" } }
      },
      "haiku:e85c1e0dbddc": {
        d: { "0": { value: "M7,3.94454383 L12.7692308,0.563506261" } },
        "translation.x": { "0": { value: 19.77 } },
        "rotation.y": { "0": { value: 3.14 } },
        "rotation.z": { "0": { value: 3.14 } },
        "scale.x": { "0": { value: -1 } },
        "scale.y": { "0": { value: -1 } },
        "scale.z": { "0": { value: -1 } }
      },
      "haiku:0b52fc66c66f": {
        "translation.x": { "0": { value: 0.65 } },
        "translation.y": { "0": { value: 13.97 } },
        "rotation.y": { "0": { value: 3.14 } },
        "scale.x": { "0": { value: -1 } },
        "scale.y": { "0": { value: -1 } },
        "scale.z": { "0": { value: -1 } }
      },
      "haiku:cfdea90a313b": {
        d: { "0": { value: "M0.576923077,3.94454383 L6.34615385,0.563506261" } }
      },
      "haiku:6c8c03561707": {
        d: { "0": { value: "M6.34615385,3.94454383 L12.1153846,0.563506261" } },
        "translation.x": { "0": { value: 18.46 } },
        "rotation.y": { "0": { value: 3.14 } },
        "rotation.z": { "0": { value: 3.14 } },
        "scale.x": { "0": { value: -1 } },
        "scale.y": { "0": { value: -1 } },
        "scale.z": { "0": { value: -1 } }
      },
      "haiku:cd23d7d833c9": {
        "translation.x": { "0": { value: 0.65 } },
        "translation.y": { "0": { value: 7.89 } },
        "rotation.y": { "0": { value: 3.14 } },
        "scale.x": { "0": { value: -1 } },
        "scale.y": { "0": { value: -1 } },
        "scale.z": { "0": { value: -1 } }
      },
      "haiku:627f4a616125": {
        d: { "0": { value: "M0.576923077,3.94454383 L6.34615385,0.563506261" } }
      },
      "haiku:595220eea732": {
        d: { "0": { value: "M6.34615385,3.94454383 L12.1153846,0.563506261" } },
        "translation.x": { "0": { value: 18.46 } },
        "rotation.y": { "0": { value: 3.14 } },
        "rotation.z": { "0": { value: 3.14 } },
        "scale.x": { "0": { value: -1 } },
        "scale.y": { "0": { value: -1 } },
        "scale.z": { "0": { value: -1 } }
      },
      "haiku:0788dd99b651": {
        d: {
          "0": {
            value: "M128.6016,9.20080007 L128.0608,11 L127.0624,11 L129.3608,3.83440026 L130.6088,3.83440026 L132.8968,11 L131.8568,11 L131.316,9.20080007 L128.6016,9.20080007 Z M129.964,4.65600023 L128.8408,8.4000001 L131.0768,8.4000001 L129.964,4.65600023 Z M137.6164,5.84160019 C137.897201,6.139735 138.0376,6.54879756 138.0376,7.06880014 L138.0376,11 L137.0808,11 L137.0808,7.20400014 C137.0808,6.81573155 137.008,6.54186763 136.8624,6.38240017 C136.716799,6.22293271 136.501868,6.14320018 136.2176,6.14320018 C135.926398,6.14320018 135.669867,6.22639934 135.448,6.39280017 C135.226132,6.55920099 135.018134,6.79839859 134.824,7.11040014 L134.824,11 L133.8672,11 L133.8672,5.5192002 L134.6888,5.5192002 L134.772,6.33040017 C134.966134,6.03919873 135.207065,5.81040102 135.4948,5.6440002 C135.782534,5.47759937 136.099731,5.39440021 136.4464,5.39440021 C136.945602,5.39440021 137.335598,5.54346538 137.6164,5.84160019 Z M139.881599,11 L139.881599,5.5192002 L140.838399,5.5192002 L140.838399,11 L139.881599,11 Z M140.838399,3.07520029 C140.9632,3.20000091 141.025599,3.35599934 141.025599,3.54320027 C141.025599,3.7304012 140.9632,3.88466632 140.838399,4.00600026 C140.713599,4.12733419 140.550667,4.18800025 140.349599,4.18800025 C140.155465,4.18800025 139.996,4.12733419 139.871199,4.00600026 C139.746399,3.88466632 139.683999,3.7304012 139.683999,3.54320027 C139.683999,3.35599934 139.746399,3.20000091 139.871199,3.07520029 C139.996,2.95039967 140.155465,2.8880003 140.349599,2.8880003 C140.550667,2.8880003 140.713599,2.95039967 140.838399,3.07520029 Z M149.317599,5.84680019 C149.588,6.14840169 149.723199,6.55573093 149.723199,7.06880014 L149.723199,11 L148.766399,11 L148.766399,7.20400014 C148.766399,6.49679663 148.509868,6.14320018 147.996799,6.14320018 C147.726398,6.14320018 147.4976,6.2211994 147.310399,6.37720017 C147.123198,6.53320094 146.922134,6.77759849 146.707199,7.11040014 L146.707199,11 L145.750399,11 L145.750399,7.20400014 C145.750399,6.49679663 145.493868,6.14320018 144.980799,6.14320018 C144.703464,6.14320018 144.4712,6.22293271 144.283999,6.38240017 C144.096798,6.54186763 143.8992,6.78453186 143.691199,7.11040014 L143.691199,11 L142.734399,11 L142.734399,5.5192002 L143.555999,5.5192002 L143.639199,6.32000017 C144.048268,5.70293044 144.575196,5.39440021 145.219999,5.39440021 C145.559734,5.39440021 145.849198,5.481066 146.088399,5.6544002 C146.3276,5.82773439 146.499199,6.07039862 146.603199,6.38240017 C146.818134,6.06346525 147.055598,5.81906771 147.315599,5.6492002 C147.5756,5.47933269 147.882397,5.39440021 148.235999,5.39440021 C148.686668,5.39440021 149.047198,5.54519869 149.317599,5.84680019 Z M155.373599,10.2148 C155.449866,10.3222672 155.564265,10.4037331 155.716799,10.4592 L155.498399,11.1248 C155.214131,11.0901332 154.985333,11.0104006 154.811999,10.8856 C154.638665,10.7607994 154.510399,10.566668 154.427199,10.3032 C154.05973,10.8509361 153.515469,11.1248 152.794399,11.1248 C152.253596,11.1248 151.8272,10.9722682 151.515199,10.6672 C151.203197,10.3621318 151.047199,9.96346917 151.047199,9.47120006 C151.047199,8.88879717 151.25693,8.44160165 151.676399,8.12960011 C152.095868,7.81759856 152.690395,7.66160012 153.459999,7.66160012 L154.302399,7.66160012 L154.302399,7.25600014 C154.302399,6.86773154 154.2088,6.59040099 154.021599,6.42400017 C153.834398,6.25759934 153.546667,6.17440018 153.158399,6.17440018 C152.756264,6.17440018 152.264002,6.27146587 151.681599,6.46560017 L151.442399,5.76880019 C152.121869,5.51919895 152.752796,5.39440021 153.335199,5.39440021 C153.980002,5.39440021 154.461864,5.55213196 154.780799,5.86760019 C155.099734,6.18306842 155.259199,6.63199725 155.259199,7.21440014 L155.259199,9.72080005 C155.259199,9.94266781 155.297332,10.1073328 155.373599,10.2148 Z M154.302399,9.55440005 L154.302399,8.2960001 L153.584799,8.2960001 C152.572527,8.2960001 152.066399,8.67039634 152.066399,9.41920006 C152.066399,9.74506834 152.146131,9.99119921 152.305599,10.1576 C152.465066,10.3240009 152.700797,10.4072 153.012799,10.4072 C153.560535,10.4072 153.990397,10.1229362 154.302399,9.55440005 Z M158.683999,11.1248 C158.219463,11.1248 157.8572,10.9913347 157.597199,10.7244 C157.337197,10.4574654 157.207199,10.0709359 157.207199,9.56480005 L157.207199,6.25760017 L156.250399,6.25760017 L156.250399,5.5192002 L157.207199,5.5192002 L157.207199,4.28160025 L158.163999,4.16720025 L158.163999,5.5192002 L159.463999,5.5192002 L159.359999,6.25760017 L158.163999,6.25760017 L158.163999,9.52320005 C158.163999,9.80746813 158.214265,10.0137327 158.314799,10.142 C158.415332,10.2702673 158.583464,10.3344 158.819199,10.3344 C159.048,10.3344 159.290664,10.2546675 159.547199,10.0952 L159.911199,10.7504 C159.550663,11.0000012 159.141601,11.1248 158.683999,11.1248 Z M164.833598,8.58720009 L161.339198,8.58720009 C161.380799,9.19040308 161.53333,9.63413196 161.796798,9.91840004 C162.060266,10.2026681 162.399996,10.3448 162.815998,10.3448 C163.079466,10.3448 163.322131,10.3066671 163.543998,10.2304 C163.765866,10.154133 163.99813,10.0328009 164.240798,9.86640004 L164.656798,10.4384 C164.074395,10.8960023 163.436535,11.1248 162.743198,11.1248 C161.980528,11.1248 161.386001,10.8752025 160.959598,10.376 C160.533196,9.87679755 160.319999,9.19040443 160.319999,8.3168001 C160.319999,7.74826394 160.411864,7.24386901 160.595598,6.80360015 C160.779333,6.3633313 161.042797,6.01840143 161.385998,5.76880019 C161.7292,5.51919895 162.133063,5.39440021 162.597598,5.39440021 C163.325602,5.39440021 163.88373,5.6335978 164.271998,6.11200018 C164.660267,6.59040255 164.854398,7.25252924 164.854398,8.09840011 C164.854398,8.25786756 164.847465,8.42079926 164.833598,8.58720009 Z M163.907998,7.81760012 C163.907998,7.27679743 163.800533,6.86426824 163.585598,6.58000016 C163.370664,6.29573208 163.048267,6.15360018 162.618398,6.15360018 C161.834928,6.15360018 161.408532,6.72906107 161.339198,7.88000011 L163.907998,7.88000011 L163.907998,7.81760012 Z M170.598398,11 L169.755998,11 L169.662398,10.2408 C169.482131,10.5181347 169.256799,10.7347992 168.986398,10.8908 C168.715997,11.0468008 168.4144,11.1248 168.081598,11.1248 C167.429862,11.1248 166.922,10.8682692 166.557998,10.3552 C166.193996,9.84213081 166.011998,9.15227107 166.011998,8.2856001 C166.011998,7.72399731 166.098664,7.22480232 166.271998,6.78800015 C166.445332,6.35119799 166.69493,6.00973475 167.020798,5.76360019 C167.346666,5.51746564 167.727996,5.39440021 168.164798,5.39440021 C168.726401,5.39440021 169.218663,5.61973128 169.641598,6.07040018 L169.641598,3.20000029 L170.598398,3.31440028 L170.598398,11 Z M169.038398,10.1628 C169.246399,10.0275994 169.447464,9.8248014 169.641598,9.55440005 L169.641598,6.87120015 C169.461331,6.63546565 169.268932,6.45693411 169.064398,6.33560017 C168.859864,6.21426624 168.629333,6.15360018 168.372798,6.15360018 C167.949863,6.15360018 167.622266,6.3303984 167.389998,6.68400016 C167.15773,7.03760191 167.041598,7.56452996 167.041598,8.2648001 C167.041598,8.97200361 167.149064,9.49893166 167.363998,9.84560004 C167.578933,10.1922684 167.887463,10.3656 168.289598,10.3656 C168.5808,10.3656 168.830397,10.2980007 169.038398,10.1628 Z M179.153598,10.1368 L179.039198,11 L175.222398,11 L175.222398,3.83440026 L176.210398,3.83440026 L176.210398,10.1368 L179.153598,10.1368 Z M184.122797,6.16400018 C184.5492,6.67706939 184.762397,7.3738624 184.762397,8.2544001 C184.762397,8.82293626 184.665332,9.32386456 184.471197,9.75720005 C184.277063,10.1905355 183.996266,10.5267988 183.628797,10.766 C183.261329,11.0052012 182.824533,11.1248 182.318398,11.1248 C181.548794,11.1248 180.949066,10.8682692 180.519198,10.3552 C180.089329,9.84213081 179.874398,9.1453378 179.874398,8.2648001 C179.874398,7.69626395 179.971463,7.19533564 180.165598,6.76200016 C180.359732,6.32866467 180.640529,5.99240138 181.007998,5.75320019 C181.375466,5.51399901 181.815728,5.39440021 182.328798,5.39440021 C183.098401,5.39440021 183.696395,5.65093096 184.122797,6.16400018 Z M180.903998,8.2648001 C180.903998,9.65840702 181.375459,10.3552 182.318398,10.3552 C183.261336,10.3552 183.732797,9.65494039 183.732797,8.2544001 C183.732797,6.86079318 183.264802,6.16400018 182.328798,6.16400018 C181.378926,6.16400018 180.903998,6.86425982 180.903998,8.2648001 Z M189.996797,5.90400019 C189.747196,5.92480029 189.442132,5.93520019 189.081597,5.93520019 C189.7264,6.22640163 190.048797,6.68746367 190.048797,7.31840014 C190.048797,7.86613619 189.861599,8.3133317 189.487197,8.66000009 C189.112795,9.00666847 188.6032,9.18000007 187.958397,9.18000007 C187.708796,9.18000007 187.476532,9.14533375 187.261597,9.07600007 C187.178397,9.13146701 187.112531,9.2059996 187.063997,9.29960006 C187.015464,9.39320053 186.991197,9.4885329 186.991197,9.58560005 C186.991197,9.88373486 187.230395,10.0328 187.708797,10.0328 L188.582397,10.0328 C188.949866,10.0328 189.275729,10.098666 189.559997,10.2304 C189.844265,10.362134 190.064396,10.5423989 190.220397,10.7712 C190.376398,11.0000011 190.454397,11.2599985 190.454397,11.5512 C190.454397,12.0850693 190.235999,12.4958652 189.799197,12.7835999 C189.362395,13.0713347 188.724535,13.2151999 187.885597,13.2151999 C187.296261,13.2151999 186.829999,13.1545339 186.486797,13.0331999 C186.143596,12.911866 185.899198,12.7298678 185.753597,12.4871999 C185.607997,12.2445321 185.535197,11.9325352 185.535197,11.5512 L186.398397,11.5512 C186.398397,11.7730677 186.439997,11.9481327 186.523197,12.0764 C186.606398,12.2046673 186.755463,12.301733 186.970397,12.3675999 C187.185332,12.4334669 187.490395,12.4663999 187.885597,12.4663999 C188.461067,12.4663999 188.871863,12.395334 189.117997,12.2532 C189.364132,12.1110659 189.487197,11.8978681 189.487197,11.6136 C189.487197,11.3570654 189.390132,11.162934 189.195997,11.0312 C189.001863,10.899466 188.731466,10.8336 188.384797,10.8336 L187.521597,10.8336 C187.057062,10.8336 186.705199,10.734801 186.465997,10.5372 C186.226796,10.339599 186.107197,10.0917349 186.107197,9.79360004 C186.107197,9.61333248 186.159197,9.44000089 186.263197,9.27360006 C186.367198,9.10719924 186.516263,8.95813407 186.710397,8.82640008 C186.391462,8.65999925 186.157465,8.45373466 186.008397,8.2076001 C185.85933,7.96146555 185.784797,7.66160189 185.784797,7.30800014 C185.784797,6.94053164 185.876663,6.61120162 186.060397,6.32000017 C186.244132,6.02879873 186.497196,5.80173434 186.819597,5.6388002 C187.141999,5.47586605 187.500795,5.39440021 187.895997,5.39440021 C188.325866,5.40133357 188.686396,5.38573373 188.977597,5.34760021 C189.268799,5.30946668 189.50973,5.25746721 189.700397,5.19160021 C189.891065,5.12573322 190.125062,5.03040084 190.402397,4.90560022 L190.683197,5.76880019 C190.475196,5.83813387 190.246398,5.88320008 189.996797,5.90400019 Z M187.058797,6.41880017 C186.861196,6.64413462 186.762397,6.94053164 186.762397,7.30800014 C186.762397,7.68240199 186.86293,7.98226565 187.063997,8.2076001 C187.265065,8.43293455 187.549329,8.54560009 187.916797,8.54560009 C188.291199,8.54560009 188.577196,8.43640119 188.774797,8.2180001 C188.972398,7.99959902 189.071197,7.6928021 189.071197,7.29760014 C189.071197,6.48639611 188.679468,6.08080018 187.895997,6.08080018 C187.535462,6.08080018 187.256398,6.19346572 187.058797,6.41880017 Z M195.288397,6.16400018 C195.714799,6.67706939 195.927997,7.3738624 195.927997,8.2544001 C195.927997,8.82293626 195.830931,9.32386456 195.636797,9.75720005 C195.442663,10.1905355 195.161865,10.5267988 194.794397,10.766 C194.426928,11.0052012 193.990133,11.1248 193.483997,11.1248 C192.714393,11.1248 192.114666,10.8682692 191.684797,10.3552 C191.254928,9.84213081 191.039997,9.1453378 191.039997,8.2648001 C191.039997,7.69626395 191.137063,7.19533564 191.331197,6.76200016 C191.525331,6.32866467 191.806129,5.99240138 192.173597,5.75320019 C192.541066,5.51399901 192.981328,5.39440021 193.494397,5.39440021 C194.264001,5.39440021 194.861995,5.65093096 195.288397,6.16400018 Z M192.069597,8.2648001 C192.069597,9.65840702 192.541059,10.3552 193.483997,10.3552 C194.426935,10.3552 194.898397,9.65494039 194.898397,8.2544001 C194.898397,6.86079318 194.430402,6.16400018 193.494397,6.16400018 C192.544526,6.16400018 192.069597,6.86425982 192.069597,8.2648001 Z"
          }
        },
        fill: { "0": { value: "#94999A" } }
      },
      "haiku:1d71f28553c5": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -302 } },
        "translation.y": { "0": { value: -177 } }
      },
      "haiku:d209ba6b8ba1": {
        fill: { "0": { value: "#FFFFFF" } },
        "translation.x": { "0": { value: 159 } },
        "translation.y": { "0": { value: 144 } }
      },
      "haiku:3dcc49e259aa": {
        x: { "0": { value: "143" } },
        y: { "0": { value: "33" } },
        "sizeAbsolute.x": { "0": { value: 342 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 132 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:c5b3cf852ed7": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -467 } },
        "translation.y": { "0": { value: -145 } }
      },
      "haiku:c57a95afadf1": {
        fill: { "0": { value: "#FFFFFF" } },
        "translation.x": { "0": { value: 210 } },
        "translation.y": { "0": { value: 126 } }
      },
      "haiku:89305df7fac4": {
        "translation.x": { "0": { value: 160.5 } },
        "translation.y": { "0": { value: 8.2 } }
      },
      "haiku:1ae49bc1386c": { "translation.x": { "0": { value: 9 } } },
      "haiku:d92e71fcba8e": {
        d: {
          "0": {
            value: "M97.02,16.96 L90.3,16.96 C90.3800004,18.1200058 90.6733308,18.9733306 91.18,19.52 C91.6866692,20.0666694 92.339996,20.34 93.14,20.34 C93.6466692,20.34 94.1133312,20.2666674 94.54,20.12 C94.9666688,19.9733326 95.413331,19.7400016 95.88,19.42 L96.68,20.52 C95.5599944,21.4000044 94.33334,21.84 93,21.84 C91.533326,21.84 90.3900041,21.3600048 89.57,20.4 C88.7499959,19.4399952 88.34,18.1200084 88.34,16.44 C88.34,15.3466612 88.5166649,14.3766709 88.87,13.53 C89.2233351,12.6833291 89.7299967,12.0200024 90.39,11.54 C91.0500033,11.0599976 91.8266622,10.82 92.72,10.82 C94.120007,10.82 95.1933296,11.2799954 95.94,12.2 C96.6866704,13.1200046 97.06,14.3933252 97.06,16.02 C97.06,16.3266682 97.0466668,16.6399984 97.02,16.96 Z M95.24,15.48 C95.24,14.4399948 95.0333354,13.6466694 94.62,13.1 C94.2066646,12.5533306 93.5866708,12.28 92.76,12.28 C91.2533258,12.28 90.433334,13.3866556 90.3,15.6 L95.24,15.6 L95.24,15.48 Z"
          }
        }
      },
      "haiku:9ad45cd320f1": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -109 } },
        "translation.y": { "0": { value: -20 } }
      },
      "haiku:ae79f448f8de": {
        stroke: { "0": { value: "#DF5887" } },
        "stroke-width": { "0": { value: "2" } },
        x: { "0": { value: "110" } },
        y: { "0": { value: "21" } },
        "sizeAbsolute.x": { "0": { value: 407 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 156 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:9b038d8ba250": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:6663a81a6b41": {
        fill: { "0": { value: "#313F41" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 67 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 86 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:f2f67fad6047": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "43.7" } },
        rx: { "0": { value: "5" } },
        "sizeAbsolute.x": { "0": { value: 343 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 59.8 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:9e46d9290f61": {
        x: { "0": { value: "-18.4%" } },
        y: { "0": { value: "-90.3%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 1.367 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 3.1069999999999998 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:6f8d36795834": {
        dx: { "0": { value: "0" } },
        dy: { "0": { value: "9" } },
        in: { "0": { value: "SourceAlpha" } },
        result: { "0": { value: "shadowOffsetOuter1" } }
      },
      "haiku:427355927a7f": {
        stdDeviation: { "0": { value: "19.5" } },
        in: { "0": { value: "shadowOffsetOuter1" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:10df6baf17ab": {
        values: {
          "0": { value: "0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 1 0" }
        },
        in: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:523497a1a2a4": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -171 } },
        "translation.y": { "0": { value: -140 } }
      },
      "haiku:9de19ccd2de9": {
        "translation.x": { "0": { value: 210 } },
        "translation.y": { "0": { value: 126 } }
      },
      "haiku:47e1264856d3": {
        fill: { "0": { value: "black" } },
        "fill-opacity": { "0": { value: "1" } },
        filter: { "0": { value: "url(#filter-2-6e0c15)" } }
      },
      "haiku:d5bf8a8ce997": {
        fill: { "0": { value: "#D8D8D8" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:d944b3fecdec": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -610 } },
        "translation.y": { "0": { value: -315 } }
      },
      "haiku:149699c56c0b": {
        d: {
          "0": {
            value: "M623.527217,320.526107 C623.201937,320.526107 622.900342,320.624796 622.648487,320.793752 C622.432159,320.17872 621.846339,319.736591 621.158671,319.736591 C620.833391,319.736591 620.531796,319.835281 620.279941,320.004237 C620.063614,319.389205 619.477793,318.947076 618.790126,318.947076 C618.502742,318.947076 618.232728,319.024449 618.00061,319.159456 L618.00061,316.57853 C618.00061,315.707695 617.292415,314.9995 616.42158,314.9995 C615.550745,314.9995 614.842549,315.707695 614.842549,316.57853 L614.842549,322.399626 L613.779862,320.557687 C613.573798,320.182668 613.237465,319.915811 612.833233,319.805279 C612.439265,319.697905 612.029507,319.75475 611.678962,319.964761 C610.962872,320.394258 610.689699,321.365361 611.071035,322.129612 C611.094721,322.177773 611.598431,323.209669 613.171146,326.353519 C613.911711,327.83386 614.724122,328.8926 615.586273,329.498947 C616.262887,329.975025 616.73028,329.9995 616.817127,329.9995 L620.764703,329.9995 C621.434212,329.9995 622.053192,329.806069 622.605063,329.423154 C623.138775,329.053661 623.599063,328.513632 623.974083,327.818069 C624.715437,326.441944 625.107037,324.465788 625.107037,322.104348 C625.107037,321.233512 624.398842,320.525317 623.528007,320.525317 L623.527217,320.526107 Z M623.27852,327.444629 C622.845076,328.250724 622.05635,329.210774 620.763914,329.210774 L616.824233,329.210774 C616.793442,329.208406 616.461056,329.171299 615.959713,328.796279 C615.45995,328.422049 614.692541,327.634112 613.876972,326.001395 C612.276625,322.8007 611.784757,321.792489 611.78002,321.783015 C611.77923,321.781436 611.77923,321.780646 611.778441,321.779857 C611.580272,321.382731 611.720806,320.86244 612.085562,320.643744 C612.249781,320.545055 612.441634,320.519001 612.62638,320.56874 C612.822969,320.622428 612.987978,320.755066 613.089826,320.941392 C613.091405,320.94376 613.092984,320.946918 613.094563,320.949287 L614.326996,323.084926 C614.578851,323.545213 614.862287,323.738644 615.169409,323.660482 C615.47732,323.58232 615.632854,323.274409 615.632854,322.747013 L615.632854,316.57932 C615.632854,316.144297 615.987346,315.789805 616.422369,315.789805 C616.857392,315.789805 617.211885,316.144297 617.211885,316.57932 L617.211885,321.711169 C617.211885,321.929075 617.388736,322.105927 617.606642,322.105927 C617.824548,322.105927 618.0014,321.929075 618.0014,321.711169 L618.0014,320.526896 C618.0014,320.091873 618.355892,319.737381 618.790915,319.737381 C619.225938,319.737381 619.58043,320.091873 619.58043,320.526896 L619.58043,321.711169 C619.58043,321.929075 619.757282,322.105927 619.975188,322.105927 C620.193094,322.105927 620.369946,321.929075 620.369946,321.711169 L620.369946,321.316411 C620.369946,320.881389 620.724438,320.526896 621.159461,320.526896 C621.594484,320.526896 621.948976,320.881389 621.948976,321.316411 L621.948976,322.500684 C621.948976,322.71859 622.125827,322.895442 622.343734,322.895442 C622.56164,322.895442 622.738491,322.71859 622.738491,322.500684 L622.738491,322.105927 C622.738491,321.670904 623.092984,321.316411 623.528007,321.316411 C623.963029,321.316411 624.317522,321.670904 624.317522,322.105927 C624.317522,324.337097 623.958292,326.183773 623.279309,327.445418 L623.27852,327.444629 Z"
          }
        },
        fill: { "0": { value: "#DEE4E4" } },
        "fill-rule": { "0": { value: "nonzero" } }
      },
      "haiku:c91a96a305f9": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 337 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:25064df7ea03": {
        x: { "0": { value: "7" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 252 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:02fb1789739f": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 252.800003 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:5881b22b5ad5": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 252.800003 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:7d415a40fdfd": {
        x: { "0": { value: "7" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 252 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:6efa94b3d818": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 137 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:43f92801bd85": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 227 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:51f641db70ec": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -260 } },
        "translation.y": { "0": { value: -172 } }
      },
      "haiku:45eda3611c6b": {
        "translation.x": { "0": { value: 260 } },
        "translation.y": { "0": { value: 172 } }
      },
      "haiku:09da238f64af": {
        "translation.x": { "0": { value: 374 } },
        "translation.y": { "0": { value: 164 } }
      },
      "haiku:ea92f82ceb29": { fill: { "0": { value: "white" } } },
      "haiku:b5b9f855b69d": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:9d7adb36d660": {
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } },
        mask: { "0": { value: "url(#mask-2-4487c7)" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "8" } },
        "sizeAbsolute.x": { "0": { value: 337 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 34 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:aac60f40a348": {
        "translation.x": { "0": { value: 115 } },
        "translation.y": { "0": { value: 164 } }
      },
      "haiku:0bc157211e25": { fill: { "0": { value: "white" } } },
      "haiku:11600e03ab52": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:64c4e2ee8373": {
        d: {
          "0": {
            value: "M266.745355,22.1271913 C266.767974,22.2464573 266.778987,22.3708727 266.778232,22.5 C266.778987,22.6291272 266.767974,22.7535427 266.745355,22.8728087 C266.630116,23.5673534 266.210948,24.3716754 265.46718,25.2294085 L261.067099,30.3036967 C259.925067,31.6207178 258.077629,31.6255162 256.931436,30.3036967 L252.531355,25.2294085 C251.779621,24.3624891 251.359853,23.5497144 251.250649,22.849693 C251.230814,22.7374869 251.221141,22.6208026 251.22176,22.5 C251.221141,22.3791974 251.230814,22.2625131 251.250649,22.150307 C251.359853,21.4502856 251.779621,20.6375109 252.531355,19.7705915 L256.931436,14.6963033 C258.077629,13.3744838 259.925067,13.3792822 261.067099,14.6963033 L265.46718,19.7705915 C266.210948,20.6283246 266.630116,21.4326466 266.745355,22.1271913 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } }
      },
      "haiku:6efde9b57112": {
        d: {
          "0": {
            value: "M15.7453553,22.1271913 C15.7679742,22.2464573 15.7789866,22.3708727 15.7782321,22.5 C15.7789866,22.6291272 15.7679742,22.7535427 15.7453553,22.8728087 C15.6301163,23.5673534 15.2109482,24.3716754 14.4671799,25.2294085 L10.0670993,30.3036967 C8.92506742,31.6207178 7.07762881,31.6255162 5.93143609,30.3036967 L1.53135544,25.2294085 C0.779621448,24.3624891 0.359852872,23.5497144 0.250648702,22.849693 C0.230814212,22.7374869 0.221140676,22.6208026 0.221759532,22.5 C0.221140676,22.3791974 0.230814212,22.2625131 0.250648702,22.150307 C0.359852872,21.4502856 0.779621448,20.6375109 1.53135544,19.7705915 L5.93143609,14.6963033 C7.07762881,13.3744838 8.92506742,13.3792822 10.0670993,14.6963033 L14.4671799,19.7705915 C15.2109482,20.6283246 15.6301163,21.4326466 15.7453553,22.1271913 Z"
          }
        },
        fill: { "0": { value: "#C2CCCD" } }
      },
      "haiku:6a1b182c28d4": {
        d: {
          "0": {
            value: "M7,42.0541765 C22.7351164,41.8105473 33.5338856,41.6646876 39.3963076,41.6165977 C48.1899406,41.5444627 75.19936,42.7500636 80.272515,42.7515037 C85.34567,42.7529438 97.2310715,40.4796867 105.479658,40.4934501 C113.728244,40.5072135 128.629149,43.842126 141.827086,43.842126 C155.025023,43.842126 157.416395,42.0615623 158.202617,41.6165977 C158.988839,41.171633 169.702151,31.0684033 180.740243,31.0684033 C191.778336,31.0684033 197.354728,40.316357 198.220028,41.6165977 C199.085328,42.9168383 203.493893,60 217.887803,60 C232.281712,60 235.93842,43.8795034 236.096515,42.0541765 C236.25461,40.2288497 237.292455,8.02614747 258.994297,8 C259.000716,8.00205343 259.001716,16.0907513 258.997299,32.2660937 C258.996763,34.227952 257.782697,40.4934501 251.492624,41.8539237 C251.340408,41.8868465 251.26478,41.9535974 251.265742,42.0541765 L7,42.0541765 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } }
      },
      "haiku:fb40d1d5b28b": { "translation.y": { "0": { value: 55 } } },
      "haiku:823412c5892d": { "translation.x": { "0": { value: 7 } } },
      "haiku:f1950b51c63d": { fill: { "0": { value: "white" } } },
      "haiku:dc7f86566faa": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:b614aab15f2d": {
        d: {
          "0": {
            value: "M126.38546,42 L0,42 C36.2281101,36.966946 59.9780363,32.1281908 71.2497786,27.4837344 C88.1527947,20.518944 105.070743,8.44874464 126.391291,8.44218121 C126.391299,8.44213549 126.391307,8.4421346 126.391315,8.44217853 C126.39421,8.44217853 126.397106,8.44217875 126.400002,8.4421792 C126.402897,8.44217875 126.405793,8.44217853 126.408688,8.44217853 C126.408696,8.4421346 126.408704,8.44213549 126.408712,8.44218121 C147.72926,8.44874464 164.647208,20.518944 181.550224,27.4837344 C192.821967,32.1281908 216.571893,36.966946 252.800003,42 L126.38546,42 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } },
        mask: { "0": { value: "url(#mask-6-4487c7)" } }
      },
      "haiku:21d4fccbd55b": { "translation.x": { "0": { value: 260 } } },
      "haiku:84cf6f6042ab": { fill: { "0": { value: "white" } } },
      "haiku:de79ea9e3ac6": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:81a5039bd3a2": {
        d: {
          "0": {
            value: "M126.38546,42 L0,42 C36.2281101,36.966946 59.9780363,32.1281908 71.2497786,27.4837344 C88.1527947,20.518944 105.070743,8.44874464 126.391291,8.44218121 C126.391299,8.44213549 126.391307,8.4421346 126.391315,8.44217853 C126.39421,8.44217853 126.397106,8.44217875 126.400002,8.4421792 C126.402897,8.44217875 126.405793,8.44217853 126.408688,8.44217853 C126.408696,8.4421346 126.408704,8.44213549 126.408712,8.44218121 C147.72926,8.44874464 164.647208,20.518944 181.550224,27.4837344 C192.821967,32.1281908 216.571893,36.966946 252.800003,42 L126.38546,42 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } },
        mask: { "0": { value: "url(#mask-8-4487c7)" } }
      },
      "haiku:e3555d5703ce": {
        d: {
          "0": {
            value: "M519.745355,21.1271913 C519.767974,21.2464573 519.778987,21.3708727 519.778232,21.5 C519.778987,21.6291272 519.767974,21.7535427 519.745355,21.8728087 C519.630116,22.5673534 519.210948,23.3716754 518.46718,24.2294085 L514.067099,29.3036967 C512.925067,30.6207178 511.077629,30.6255162 509.931436,29.3036967 L505.531355,24.2294085 C504.779621,23.3624891 504.359853,22.5497144 504.250649,21.849693 C504.230814,21.7374869 504.221141,21.6208026 504.22176,21.5 C504.221141,21.3791974 504.230814,21.2625131 504.250649,21.150307 C504.359853,20.4502856 504.779621,19.6375109 505.531355,18.7705915 L509.931436,13.6963033 C511.077629,12.3744838 512.925067,12.3792822 514.067099,13.6963033 L518.46718,18.7705915 C519.210948,19.6283246 519.630116,20.4326466 519.745355,21.1271913 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } }
      },
      "haiku:bc19cbb1c642": {
        d: {
          "0": {
            value: "M267.745355,21.1271913 C267.767974,21.2464573 267.778987,21.3708727 267.778232,21.5 C267.778987,21.6291272 267.767974,21.7535427 267.745355,21.8728087 C267.630116,22.5673534 267.210948,23.3716754 266.46718,24.2294085 L262.067099,29.3036967 C260.925067,30.6207178 259.077629,30.6255162 257.931436,29.3036967 L253.531355,24.2294085 C252.779621,23.3624891 252.359853,22.5497144 252.250649,21.849693 C252.230814,21.7374869 252.221141,21.6208026 252.22176,21.5 C252.221141,21.3791974 252.230814,21.2625131 252.250649,21.150307 C252.359853,20.4502856 252.779621,19.6375109 253.531355,18.7705915 L257.931436,13.6963033 C259.077629,12.3744838 260.925067,12.3792822 262.067099,13.6963033 L266.46718,18.7705915 C267.210948,19.6283246 267.630116,20.4326466 267.745355,21.1271913 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } }
      },
      "haiku:a2905ac5d230": {
        d: {
          "0": {
            value: "M15.7453553,21.1271913 C15.7679742,21.2464573 15.7789866,21.3708727 15.7782321,21.5 C15.7789866,21.6291272 15.7679742,21.7535427 15.7453553,21.8728087 C15.6301163,22.5673534 15.2109482,23.3716754 14.4671799,24.2294085 L10.0670993,29.3036967 C8.92506742,30.6207178 7.07762881,30.6255162 5.93143609,29.3036967 L1.53135544,24.2294085 C0.779621448,23.3624891 0.359852872,22.5497144 0.250648702,21.849693 C0.230814212,21.7374869 0.221140676,21.6208026 0.221759532,21.5 C0.221140676,21.3791974 0.230814212,21.2625131 0.250648702,21.150307 C0.359852872,20.4502856 0.779621448,19.6375109 1.53135544,18.7705915 L5.93143609,13.6963033 C7.07762881,12.3744838 8.92506742,12.3792822 10.0670993,13.6963033 L14.4671799,18.7705915 C15.2109482,19.6283246 15.6301163,20.4326466 15.7453553,21.1271913 Z"
          }
        },
        fill: { "0": { value: "#C2CCCD" } }
      },
      "haiku:ac1b8fe991a2": { "translation.x": { "0": { value: 115 } } },
      "haiku:46c924b35b8f": { fill: { "0": { value: "white" } } },
      "haiku:6391f490fe74": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:633ca5442266": {
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } },
        mask: { "0": { value: "url(#mask-10-4487c7)" } },
        x: { "0": { value: "-108" } },
        y: { "0": { value: "8" } },
        "sizeAbsolute.x": { "0": { value: 367 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 34 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:286232d4d992": {
        d: {
          "0": {
            value: "M266.745355,22.1271913 C266.767974,22.2464573 266.778987,22.3708727 266.778232,22.5 C266.778987,22.6291272 266.767974,22.7535427 266.745355,22.8728087 C266.630116,23.5673534 266.210948,24.3716754 265.46718,25.2294085 L261.067099,30.3036967 C259.925067,31.6207178 258.077629,31.6255162 256.931436,30.3036967 L252.531355,25.2294085 C251.779621,24.3624891 251.359853,23.5497144 251.250649,22.849693 C251.230814,22.7374869 251.221141,22.6208026 251.22176,22.5 C251.221141,22.3791974 251.230814,22.2625131 251.250649,22.150307 C251.359853,21.4502856 251.779621,20.6375109 252.531355,19.7705915 L256.931436,14.6963033 C258.077629,13.3744838 259.925067,13.3792822 261.067099,14.6963033 L265.46718,19.7705915 C266.210948,20.6283246 266.630116,21.4326466 266.745355,22.1271913 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } }
      },
      "haiku:237e097f776a": {
        d: {
          "0": {
            value: "M15.7453553,22.1271913 C15.7679742,22.2464573 15.7789866,22.3708727 15.7782321,22.5 C15.7789866,22.6291272 15.7679742,22.7535427 15.7453553,22.8728087 C15.6301163,23.5673534 15.2109482,24.3716754 14.4671799,25.2294085 L10.0670993,30.3036967 C8.92506742,31.6207178 7.07762881,31.6255162 5.93143609,30.3036967 L1.53135544,25.2294085 C0.779621448,24.3624891 0.359852872,23.5497144 0.250648702,22.849693 C0.230814212,22.7374869 0.221140676,22.6208026 0.221759532,22.5 C0.221140676,22.3791974 0.230814212,22.2625131 0.250648702,22.150307 C0.359852872,21.4502856 0.779621448,20.6375109 1.53135544,19.7705915 L5.93143609,14.6963033 C7.07762881,13.3744838 8.92506742,13.3792822 10.0670993,14.6963033 L14.4671799,19.7705915 C15.2109482,20.6283246 15.6301163,21.4326466 15.7453553,22.1271913 Z"
          }
        },
        fill: { "0": { value: "#C2CCCD" } }
      },
      "haiku:9da342ee0c1d": { "translation.x": { "0": { value: 374 } } },
      "haiku:ca19e0d045b2": { fill: { "0": { value: "white" } } },
      "haiku:9ab7733d0e33": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:514038c3c1ae": {
        d: {
          "0": {
            value: "M126.414543,41.5578538 C90.1864331,36.5247998 66.4365069,31.6860445 55.1647646,27.0415881 C38.2571512,20.0749035 21.3345973,8.00003229 0.00585465329,8.00003229 C0.0019515511,7.97806509 0,19.1640056 0,41.5578538 L126.414543,41.5578538 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } },
        mask: { "0": { value: "url(#mask-12-4487c7)" } }
      },
      "haiku:ad506a0c75e6": {
        d: {
          "0": {
            value: "M144.745355,22.1271913 C144.767974,22.2464573 144.778987,22.3708727 144.778232,22.5 C144.778987,22.6291272 144.767974,22.7535427 144.745355,22.8728087 C144.630116,23.5673534 144.210948,24.3716754 143.46718,25.2294085 L139.067099,30.3036967 C137.925067,31.6207178 136.077629,31.6255162 134.931436,30.3036967 L130.531355,25.2294085 C129.779621,24.3624891 129.359853,23.5497144 129.250649,22.849693 C129.230814,22.7374869 129.221141,22.6208026 129.22176,22.5 C129.221141,22.3791974 129.230814,22.2625131 129.250649,22.150307 C129.359853,21.4502856 129.779621,20.6375109 130.531355,19.7705915 L134.931436,14.6963033 C136.077629,13.3744838 137.925067,13.3792822 139.067099,14.6963033 L143.46718,19.7705915 C144.210948,20.6283246 144.630116,21.4326466 144.745355,22.1271913 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } }
      },
      "haiku:57d2e290aa7d": {
        "translation.x": { "0": { value: 601 } },
        "translation.y": { "0": { value: 110 } },
        "rotation.y": { "0": { value: 3.14 } },
        "rotation.z": { "0": { value: 3.14 } },
        "scale.x": { "0": { value: -1 } },
        "scale.y": { "0": { value: -1 } },
        "scale.z": { "0": { value: -1 } }
      },
      "haiku:66efa94bd319": { fill: { "0": { value: "white" } } },
      "haiku:6a7ad3cb96b8": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:bc26fd1e089b": {
        d: {
          "0": {
            value: "M216.414543,41.5578538 C154.394069,36.5247998 113.73554,31.6860445 94.4389548,27.0415881 C65.4940776,20.0749035 36.5236231,8.00003229 0.0100228351,8.00003229 C0.00334094502,7.97806509 0,19.1640056 0,41.5578538 L216.414543,41.5578538 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } },
        mask: { "0": { value: "url(#mask-14-4487c7)" } }
      },
      "haiku:220dc7a034de": {
        d: {
          "0": {
            value: "M234.745355,22.1271913 C234.767974,22.2464573 234.778987,22.3708727 234.778232,22.5 C234.778987,22.6291272 234.767974,22.7535427 234.745355,22.8728087 C234.630116,23.5673534 234.210948,24.3716754 233.46718,25.2294085 L229.067099,30.3036967 C227.925067,31.6207178 226.077629,31.6255162 224.931436,30.3036967 L220.531355,25.2294085 C219.779621,24.3624891 219.359853,23.5497144 219.250649,22.849693 C219.230814,22.7374869 219.221141,22.6208026 219.22176,22.5 C219.221141,22.3791974 219.230814,22.2625131 219.250649,22.150307 C219.359853,21.4502856 219.779621,20.6375109 220.531355,19.7705915 L224.931436,14.6963033 C226.077629,13.3744838 227.925067,13.3792822 229.067099,14.6963033 L233.46718,19.7705915 C234.210948,20.6283246 234.630116,21.4326466 234.745355,22.1271913 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } }
      },
      "haiku:ff81784289ed": {
        d: {
          "0": {
            value: "M607.523624,132.420454 C607.546243,132.53972 607.557255,132.664135 607.5565,132.793263 C607.557255,132.92239 607.546243,133.046805 607.523624,133.166071 C607.408385,133.860616 606.989217,134.664938 606.245448,135.522671 L601.845368,140.596959 C600.703336,141.913981 598.855897,141.918779 597.709704,140.596959 L593.309624,135.522671 C592.55789,134.655752 592.138121,133.842977 592.028917,133.142956 C592.009083,133.03075 591.999409,132.914065 592.000028,132.793263 C591.999409,132.67246 592.009083,132.555776 592.028917,132.44357 C592.138121,131.743548 592.55789,130.930774 593.309624,130.063854 L597.709704,124.989566 C598.855897,123.667747 600.703336,123.672545 601.845368,124.989566 L606.245448,130.063854 C606.989217,130.921587 607.408385,131.725909 607.523624,132.420454 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } }
      },
      "haiku:ed33cb83f4f4": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -417 } },
        "translation.y": { "0": { value: -294 } }
      },
      "haiku:eab4a49b170d": {
        fill: { "0": { value: "#DF5887" } },
        "translation.x": { "0": { value: 260 } },
        "translation.y": { "0": { value: 282 } }
      },
      "haiku:280032bba6df": {
        d: {
          "0": {
            value: "M172.745355,21.1271913 C172.767974,21.2464573 172.778987,21.3708727 172.778232,21.5 C172.778987,21.6291272 172.767974,21.7535427 172.745355,21.8728087 C172.630116,22.5673534 172.210948,23.3716754 171.46718,24.2294085 L167.067099,29.3036967 C165.925067,30.6207178 164.077629,30.6255162 162.931436,29.3036967 L158.531355,24.2294085 C157.779621,23.3624891 157.359853,22.5497144 157.250649,21.849693 C157.230814,21.7374869 157.221141,21.6208026 157.22176,21.5 C157.221141,21.3791974 157.230814,21.2625131 157.250649,21.150307 C157.359853,20.4502856 157.779621,19.6375109 158.531355,18.7705915 L162.931436,13.6963033 C164.077629,12.3744838 165.925067,12.3792822 167.067099,13.6963033 L171.46718,18.7705915 C172.210948,19.6283246 172.630116,20.4326466 172.745355,21.1271913 Z"
          }
        }
      },
      "haiku:533317a76846": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -417 } },
        "translation.y": { "0": { value: -294 } }
      },
      "haiku:74f706cb7993": {
        fill: { "0": { value: "#DF5887" } },
        "translation.x": { "0": { value: 260 } },
        "translation.y": { "0": { value: 282 } }
      },
      "haiku:ca81cd694051": {
        d: {
          "0": {
            value: "M172.745355,21.1271913 C172.767974,21.2464573 172.778987,21.3708727 172.778232,21.5 C172.778987,21.6291272 172.767974,21.7535427 172.745355,21.8728087 C172.630116,22.5673534 172.210948,23.3716754 171.46718,24.2294085 L167.067099,29.3036967 C165.925067,30.6207178 164.077629,30.6255162 162.931436,29.3036967 L158.531355,24.2294085 C157.779621,23.3624891 157.359853,22.5497144 157.250649,21.849693 C157.230814,21.7374869 157.221141,21.6208026 157.22176,21.5 C157.221141,21.3791974 157.230814,21.2625131 157.250649,21.150307 C157.359853,20.4502856 157.779621,19.6375109 158.531355,18.7705915 L162.931436,13.6963033 C164.077629,12.3744838 165.925067,12.3792822 167.067099,13.6963033 L171.46718,18.7705915 C172.210948,19.6283246 172.630116,20.4326466 172.745355,21.1271913 Z"
          }
        }
      },
      "haiku:19d391fbf852": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -486 } },
        "translation.y": { "0": { value: -142 } }
      },
      "haiku:0cfd98d04731": {
        fill: { "0": { value: "#FFFFFF" } },
        "translation.x": { "0": { value: 210 } },
        "translation.y": { "0": { value: 126 } }
      },
      "haiku:4b8525026b69": {
        "translation.x": { "0": { value: 160.5 } },
        "translation.y": { "0": { value: 8.2 } }
      },
      "haiku:2ddca17fa4c7": { "translation.x": { "0": { value: 9 } } },
      "haiku:2ef854a8d719": {
        points: {
          "0": {
            value: "115.74 21.6 112.56 15.5 109.34 21.6 107.3 21.6 111.44 14.26 107.66 7.82 109.82 7.82 112.6 13 115.4 7.82 117.44 7.82 113.7 14.16 117.9 21.6"
          }
        }
      },
      "haiku:18740459a80a": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -245 } },
        "translation.y": { "0": { value: -37 } }
      },
      "haiku:0d44e69ddcd4": {
        d: {
          "0": {
            value: "M291.900562,62.3764773 C291.968899,62.7359058 292.00217,63.110853 291.99989,63.5 C292.00217,63.889147 291.968899,64.2640942 291.900562,64.6235227 C291.552397,66.716652 290.285991,69.1406137 288.03889,71.7255388 L274.745199,87.0177737 C271.294849,90.9868417 265.713297,91.0013026 262.250376,87.0177737 L248.956685,71.7255388 C246.685518,69.1129292 245.417297,66.6634936 245.087365,64.5538596 C245.027441,64.2157074 244.998215,63.8640593 245.000084,63.5 C244.998215,63.1359407 245.027441,62.7842926 245.087365,62.4461404 C245.417297,60.3365064 246.685518,57.8870708 248.956685,55.2744612 L262.250376,39.9822263 C265.713297,35.9986974 271.294849,36.0131583 274.745199,39.9822263 L288.03889,55.2744612 C290.285991,57.8593863 291.552397,60.283348 291.900562,62.3764773 Z"
          }
        },
        fill: { "0": { value: "#DF5887" } }
      },
      "haiku:ab46dc408ef8": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -308 } },
        "translation.y": { "0": { value: -199 } }
      },
      "haiku:eb807fee86fa": {
        fill: { "0": { value: "#0C1112" } },
        "fill-rule": { "0": { value: "nonzero" } },
        "translation.x": { "0": { value: 159 } },
        "translation.y": { "0": { value: 144 } }
      },
      "haiku:4b398c8edff1": {
        d: {
          "0": {
            value: "M207.397683,107.815293 L207.397683,119.830005 C207.397683,121.327354 206.19908,122.541196 204.720528,122.541196 C204.29222,122.541196 203.887403,122.439336 203.52841,122.258232 C203.472218,122.238705 203.416285,122.217169 203.360692,122.19359 L167.407525,106.944854 C166.656035,106.933453 165.935269,106.600082 165.435169,106.023919 C164.780911,105.529624 164.357262,104.739629 164.357262,103.849426 L164.357262,72.7633604 C164.275504,72.6581656 164.200266,72.5463553 164.132401,72.4282962 L162.42585,71.7296429 L154.678315,68.5578433 L154.678315,142.76076 L164.357262,146.72327 L164.357262,121.784996 C164.357262,121.746201 164.358066,121.707597 164.359659,121.6692 C164.341052,121.278612 164.405976,120.877801 164.565074,120.493084 C165.13623,119.111965 166.704806,118.461247 168.068586,119.039665 L204.204733,134.36702 L204.903529,134.685483 C206.296728,134.780729 207.397683,135.955378 207.397683,137.390439 L207.397683,142.76076 L216.983464,146.685128 L217.07663,146.72327 L217.07663,103.481791 L207.397683,107.815293 Z M202.043372,109.089606 L182.518429,100.808535 L174.640479,104.133838 L202.043372,115.756166 L202.043372,109.089606 Z M169.711572,125.615213 L169.711572,147.135852 L179.390519,143.173342 L179.390519,129.720323 L169.711572,125.615213 Z M167.088096,154.110197 C167.070246,154.110552 167.052352,154.110731 167.034417,154.110731 C166.31789,154.110731 165.66711,153.82566 165.186629,153.3614 L162.42585,152.231151 L151.554715,147.780566 C150.288672,147.565338 149.324004,146.450209 149.324004,145.106905 L149.324004,144.964346 C149.322989,144.919798 149.322984,144.875142 149.324004,144.830412 L149.324004,64.4628367 C149.323069,64.4218332 149.322991,64.3807382 149.32378,64.3395774 C149.322991,64.2984166 149.323069,64.2573215 149.324004,64.2163181 L149.324004,64.1872148 C149.324004,63.3612279 149.688738,62.621512 150.263998,62.1242341 C150.51012,61.8969026 150.799614,61.7092312 151.126544,61.5753879 L165.941073,55.5103979 C166.689069,55.0860601 167.615449,55.0025009 168.467313,55.3644453 L182.368458,61.2708377 C182.4053,61.2693148 182.442333,61.268546 182.479544,61.268546 C183.958097,61.268546 185.1567,62.4823874 185.1567,63.9797367 L185.1567,64.331724 C185.157697,64.3758648 185.157701,64.4201078 185.1567,64.4644206 L185.1567,82.0901716 L202.043372,75.2021247 L202.043372,64.4628367 C202.042438,64.4218332 202.042359,64.3807382 202.043148,64.3395774 C202.042359,64.2984166 202.042438,64.2573215 202.043372,64.2163181 L202.043372,63.9797367 C202.043372,62.527607 203.170674,61.34212 204.587363,61.2718415 L218.660441,55.5103979 C219.408437,55.0860601 220.334817,55.0025009 221.186681,55.3644453 L235.668646,61.5176195 C236.923211,61.7424849 237.876068,62.8521593 237.876068,64.1872148 L237.876068,64.3317233 C237.877065,64.3758648 237.877069,64.4201078 237.876068,64.4644206 L237.876068,145.106905 C237.876068,146.106975 237.341392,146.980578 236.54574,147.450533 C236.294378,147.68822 235.996475,147.88405 235.658582,148.022382 L221.246206,153.922732 C220.309012,154.306414 219.289488,154.155513 218.517201,153.611624 L214.822362,152.098976 L203.845912,147.605275 C202.98188,147.251545 202.379331,146.52184 202.147825,145.677695 C202.085997,145.460503 202.05026,145.232112 202.044272,144.996227 C202.042417,144.941112 202.042109,144.88582 202.043372,144.830412 L202.043372,139.328149 L202.007475,139.311789 L202.043372,139.231004 L202.043372,139.328027 L184.74483,131.991235 L184.74483,145.084672 C184.74483,145.165381 184.741347,145.245267 184.734526,145.324184 C184.730722,146.475457 184.050286,147.56425 182.93124,148.022382 L168.526838,153.919467 C168.054106,154.113001 167.560427,154.17052 167.088096,154.110197 Z M222.430941,147.139117 L232.521757,143.00799 L232.521757,68.7095502 L222.430941,72.8406771 L222.430941,81.9033544 C222.430941,82.7590139 222.039531,83.5220927 221.428142,84.0189816 C221.155697,84.3669939 220.794829,84.6519686 220.361381,84.8349281 L189.465371,97.8762132 L203.274077,103.732869 L218.414559,96.9541025 C219.766849,96.348649 221.347753,96.9680164 221.945605,98.3374984 C221.959904,98.3702511 221.97351,98.4031363 221.986432,98.4361371 C222.267327,98.8650339 222.430941,99.3795499 222.430941,99.9327656 L222.430941,147.139117 Z M217.07663,72.7633604 C216.994872,72.6581656 216.919634,72.5463553 216.85177,72.4282962 L215.145218,71.7296429 L207.397683,68.5578433 L207.397683,74.852311 L217.07663,78.8148205 L217.07663,72.7633604 Z M169.711572,100.33981 L179.802389,96.0804502 L179.802389,68.7095502 L169.711572,72.8406771 L169.711572,100.33981 Z M185.1567,87.9358658 L185.1567,93.8203819 L211.344183,82.7665785 L204.669652,80.034061 C204.646437,80.024557 204.623411,80.0147815 204.600576,80.0047397 L185.1567,87.9358658 Z M212.47915,64.3395774 L217.30632,66.3157951 L220.145002,67.4779366 L227.604698,64.4239765 L220.081183,61.2273453 L212.47915,64.3395774 Z M159.759782,64.3395774 L164.586952,66.3157951 L167.425634,67.4779366 L174.88533,64.4239765 L167.361815,61.2273453 L159.759782,64.3395774 Z"
          }
        }
      },
      "haiku:bcd6a8fc802a": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        opacity: { "0": { value: "0.160382699" } },
        "translation.x": { "0": { value: -385 } },
        "translation.y": { "0": { value: -192 } }
      },
      "haiku:76d4eac74505": {
        fill: { "0": { value: "#FFFFFF" } },
        "translation.x": { "0": { value: 210 } },
        "translation.y": { "0": { value: 126 } }
      },
      "haiku:80b3f0578bdf": {
        "translation.x": { "0": { value: 160.5 } },
        "translation.y": { "0": { value: 8.2 } }
      },
      "haiku:c56a986b01a2": { "translation.x": { "0": { value: 9 } } },
      "haiku:578176e6c702": {
        d: {
          "0": {
            value: "M18.76,61.69 C19.2800026,62.2700029 19.54,63.0533284 19.54,64.04 L19.54,71.6 L17.7,71.6 L17.7,64.3 C17.7,62.9399932 17.2066716,62.26 16.22,62.26 C15.6999974,62.26 15.2600018,62.4099985 14.9,62.71 C14.5399982,63.0100015 14.1533354,63.4799968 13.74,64.12 L13.74,71.6 L11.9,71.6 L11.9,64.3 C11.9,62.9399932 11.4066716,62.26 10.42,62.26 C9.886664,62.26 9.4400018,62.4133318 9.08,62.72 C8.7199982,63.0266682 8.340002,63.4933302 7.94,64.12 L7.94,71.6 L6.1,71.6 L6.1,61.06 L7.68,61.06 L7.84,62.6 C8.6266706,61.4133274 9.6399938,60.82 10.88,60.82 C11.5333366,60.82 12.0899977,60.986665 12.55,61.32 C13.0100023,61.653335 13.339999,62.119997 13.54,62.72 C13.9533354,62.1066636 14.4099975,61.6366683 14.91,61.31 C15.4100025,60.9833317 15.9999966,60.82 16.68,60.82 C17.546671,60.82 18.2399974,61.1099971 18.76,61.69 Z M31.65,62.3 C32.4700041,63.2866716 32.88,64.6266582 32.88,66.32 C32.88,67.4133388 32.6933352,68.3766625 32.32,69.21 C31.9466648,70.0433375 31.4066702,70.6899977 30.7,71.15 C29.9933298,71.6100023 29.1533382,71.84 28.18,71.84 C26.6999926,71.84 25.5466708,71.3466716 24.72,70.36 C23.8933292,69.3733284 23.48,68.0333418 23.48,66.34 C23.48,65.2466612 23.6666648,64.2833375 24.04,63.45 C24.4133352,62.6166625 24.9533298,61.9700023 25.66,61.51 C26.3666702,61.0499977 27.2133284,60.82 28.2,60.82 C29.6800074,60.82 30.8299959,61.3133284 31.65,62.3 Z M25.46,66.34 C25.46,69.0200134 26.3666576,70.36 28.18,70.36 C29.9933424,70.36 30.9,69.0133468 30.9,66.32 C30.9,63.6399866 30.000009,62.3 28.2,62.3 C26.3733242,62.3 25.46,63.6466532 25.46,66.34 Z M43.18,71.6 L43.04,69.96 C42.639998,70.6133366 42.1800026,71.0899985 41.66,71.39 C41.1399974,71.6900015 40.5066704,71.84 39.76,71.84 C38.8399954,71.84 38.1200026,71.5600028 37.6,71 C37.0799974,70.4399972 36.82,69.6466718 36.82,68.62 L36.82,61.06 L38.66,61.06 L38.66,68.42 C38.66,69.1400036 38.7866654,69.6499985 39.04,69.95 C39.2933346,70.2500015 39.7066638,70.4 40.28,70.4 C41.3066718,70.4 42.186663,69.7933394 42.92,68.58 L42.92,61.06 L44.76,61.06 L44.76,71.6 L43.18,71.6 Z M54.36,61.12 C54.9333362,61.320001 55.4799974,61.619998 56,62.02 L55.2,63.24 C54.733331,62.906665 54.2833355,62.6633341 53.85,62.51 C53.4166645,62.3566659 52.9600024,62.28 52.48,62.28 C51.879997,62.28 51.4066684,62.4033321 51.06,62.65 C50.7133316,62.8966679 50.54,63.2333312 50.54,63.66 C50.54,64.0866688 50.7033317,64.4199988 51.03,64.66 C51.3566683,64.9000012 51.9466624,65.1333322 52.8,65.36 C53.9733392,65.6533348 54.8499971,66.0533308 55.43,66.56 C56.0100029,67.0666692 56.3,67.7599956 56.3,68.64 C56.3,69.6800052 55.8966707,70.4733306 55.09,71.02 C54.2833293,71.5666694 53.3000058,71.84 52.14,71.84 C50.539992,71.84 49.2133386,71.3800046 48.16,70.46 L49.18,69.3 C50.0066708,70.0066702 50.9799944,70.36 52.1,70.36 C52.7800034,70.36 53.3266646,70.2200014 53.74,69.94 C54.1533354,69.6599986 54.36,69.286669 54.36,68.82 C54.36,68.4466648 54.2866674,68.1433345 54.14,67.91 C53.9933326,67.6766655 53.7433351,67.4766675 53.39,67.31 C53.0366649,67.1433325 52.5066702,66.9666676 51.8,66.78 C50.6799944,66.4866652 49.8700025,66.0900025 49.37,65.59 C48.8699975,65.0899975 48.62,64.4600038 48.62,63.7 C48.62,63.1533306 48.7833317,62.6600022 49.11,62.22 C49.4366683,61.7799978 49.8899971,61.4366679 50.47,61.19 C51.0500029,60.9433321 51.6999964,60.82 52.42,60.82 C53.1400036,60.82 53.7866638,60.919999 54.36,61.12 Z M67.82,66.96 L61.1,66.96 C61.1800004,68.1200058 61.4733308,68.9733306 61.98,69.52 C62.4866692,70.0666694 63.139996,70.34 63.94,70.34 C64.4466692,70.34 64.9133312,70.2666674 65.34,70.12 C65.7666688,69.9733326 66.213331,69.7400016 66.68,69.42 L67.48,70.52 C66.3599944,71.4000044 65.13334,71.84 63.8,71.84 C62.333326,71.84 61.1900041,71.3600048 60.37,70.4 C59.5499959,69.4399952 59.14,68.1200084 59.14,66.44 C59.14,65.3466612 59.3166649,64.3766709 59.67,63.53 C60.0233351,62.6833291 60.5299967,62.0200024 61.19,61.54 C61.8500033,61.0599976 62.6266622,60.82 63.52,60.82 C64.920007,60.82 65.9933296,61.2799954 66.74,62.2 C67.4866704,63.1200046 67.86,64.3933252 67.86,66.02 C67.86,66.3266682 67.8466668,66.6399984 67.82,66.96 Z M66.04,65.48 C66.04,64.4399948 65.8333354,63.6466694 65.42,63.1 C65.0066646,62.5533306 64.3866708,62.28 63.56,62.28 C62.0533258,62.28 61.233334,63.3866556 61.1,65.6 L66.04,65.6 L66.04,65.48 Z M78.54,71.6 L75.36,65.5 L72.14,71.6 L70.1,71.6 L74.24,64.26 L70.46,57.82 L72.62,57.82 L75.4,63 L78.2,57.82 L80.24,57.82 L76.5,64.16 L80.7,71.6 L78.54,71.6 Z"
          }
        }
      },
      "haiku:629a84704787": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 337 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:7e7749478051": {
        x: { "0": { value: "7" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 252 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:941ee8ebad66": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 252.800003 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:a3e3986b0da9": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 252.800003 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:88e126c34cf5": {
        x: { "0": { value: "7" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 252 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:52d8c85c536f": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 137 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:fb2d36c17c72": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 227 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:15f989d1722a": {
        x: { "0": { value: "7" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 159 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:5ac33b0c98df": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -260 } },
        "translation.y": { "0": { value: -172 } }
      },
      "haiku:f2e7c4539481": {
        "translation.x": { "0": { value: 260 } },
        "translation.y": { "0": { value: 172 } }
      },
      "haiku:cc2f47922983": {
        "translation.x": { "0": { value: 374 } },
        "translation.y": { "0": { value: 164 } }
      },
      "haiku:dcc7ce6a433f": { fill: { "0": { value: "white" } } },
      "haiku:f15ee3397dc6": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:ed7e1c115348": {
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } },
        mask: { "0": { value: "url(#mask-2-72e505)" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "8" } },
        "sizeAbsolute.x": { "0": { value: 337 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 34 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:896ee1e08484": {
        "translation.x": { "0": { value: 115 } },
        "translation.y": { "0": { value: 164 } }
      },
      "haiku:9242317e7ffc": { fill: { "0": { value: "white" } } },
      "haiku:a103dfac0057": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:00c02b46a379": {
        d: {
          "0": {
            value: "M266.745355,22.1271913 C266.767974,22.2464573 266.778987,22.3708727 266.778232,22.5 C266.778987,22.6291272 266.767974,22.7535427 266.745355,22.8728087 C266.630116,23.5673534 266.210948,24.3716754 265.46718,25.2294085 L261.067099,30.3036967 C259.925067,31.6207178 258.077629,31.6255162 256.931436,30.3036967 L252.531355,25.2294085 C251.779621,24.3624891 251.359853,23.5497144 251.250649,22.849693 C251.230814,22.7374869 251.221141,22.6208026 251.22176,22.5 C251.221141,22.3791974 251.230814,22.2625131 251.250649,22.150307 C251.359853,21.4502856 251.779621,20.6375109 252.531355,19.7705915 L256.931436,14.6963033 C258.077629,13.3744838 259.925067,13.3792822 261.067099,14.6963033 L265.46718,19.7705915 C266.210948,20.6283246 266.630116,21.4326466 266.745355,22.1271913 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } }
      },
      "haiku:97c5f005fab3": {
        d: {
          "0": {
            value: "M15.7453553,22.1271913 C15.7679742,22.2464573 15.7789866,22.3708727 15.7782321,22.5 C15.7789866,22.6291272 15.7679742,22.7535427 15.7453553,22.8728087 C15.6301163,23.5673534 15.2109482,24.3716754 14.4671799,25.2294085 L10.0670993,30.3036967 C8.92506742,31.6207178 7.07762881,31.6255162 5.93143609,30.3036967 L1.53135544,25.2294085 C0.779621448,24.3624891 0.359852872,23.5497144 0.250648702,22.849693 C0.230814212,22.7374869 0.221140676,22.6208026 0.221759532,22.5 C0.221140676,22.3791974 0.230814212,22.2625131 0.250648702,22.150307 C0.359852872,21.4502856 0.779621448,20.6375109 1.53135544,19.7705915 L5.93143609,14.6963033 C7.07762881,13.3744838 8.92506742,13.3792822 10.0670993,14.6963033 L14.4671799,19.7705915 C15.2109482,20.6283246 15.6301163,21.4326466 15.7453553,22.1271913 Z"
          }
        },
        fill: { "0": { value: "#C2CCCD" } }
      },
      "haiku:f90e362936df": {
        d: {
          "0": {
            value: "M7,42.0541765 C22.7351164,41.8105473 33.5338856,41.6646876 39.3963076,41.6165977 C48.1899406,41.5444627 75.19936,42.7500636 80.272515,42.7515037 C85.34567,42.7529438 97.2310715,40.4796867 105.479658,40.4934501 C113.728244,40.5072135 128.629149,43.842126 141.827086,43.842126 C155.025023,43.842126 157.416395,42.0615623 158.202617,41.6165977 C158.988839,41.171633 169.702151,31.0684033 180.740243,31.0684033 C191.778336,31.0684033 197.354728,40.316357 198.220028,41.6165977 C199.085328,42.9168383 203.493893,60 217.887803,60 C232.281712,60 235.93842,43.8795034 236.096515,42.0541765 C236.25461,40.2288497 237.292455,8.02614747 258.994297,8 C259.000716,8.00205343 259.001716,16.0907513 258.997299,32.2660937 C258.996763,34.227952 257.782697,40.4934501 251.492624,41.8539237 C251.340408,41.8868465 251.26478,41.9535974 251.265742,42.0541765 L7,42.0541765 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } }
      },
      "haiku:38cf3eeea7e7": { "translation.y": { "0": { value: 55 } } },
      "haiku:b442e2268613": { "translation.x": { "0": { value: 7 } } },
      "haiku:2f3736bdcbf3": { fill: { "0": { value: "white" } } },
      "haiku:3acd0606791a": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:86ab1c0eec2c": {
        d: {
          "0": {
            value: "M126.38546,42 L0,42 C36.2281101,36.966946 59.9780363,32.1281908 71.2497786,27.4837344 C88.1527947,20.518944 105.070743,8.44874464 126.391291,8.44218121 C126.391299,8.44213549 126.391307,8.4421346 126.391315,8.44217853 C126.39421,8.44217853 126.397106,8.44217875 126.400002,8.4421792 C126.402897,8.44217875 126.405793,8.44217853 126.408688,8.44217853 C126.408696,8.4421346 126.408704,8.44213549 126.408712,8.44218121 C147.72926,8.44874464 164.647208,20.518944 181.550224,27.4837344 C192.821967,32.1281908 216.571893,36.966946 252.800003,42 L126.38546,42 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } },
        mask: { "0": { value: "url(#mask-6-72e505)" } }
      },
      "haiku:3cedf7e1579f": { "translation.x": { "0": { value: 260 } } },
      "haiku:1d7dd9723ef9": { fill: { "0": { value: "white" } } },
      "haiku:563a77fb5e3b": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:7f2a95374f37": {
        d: {
          "0": {
            value: "M126.38546,42 L0,42 C36.2281101,36.966946 59.9780363,32.1281908 71.2497786,27.4837344 C88.1527947,20.518944 105.070743,8.44874464 126.391291,8.44218121 C126.391299,8.44213549 126.391307,8.4421346 126.391315,8.44217853 C126.39421,8.44217853 126.397106,8.44217875 126.400002,8.4421792 C126.402897,8.44217875 126.405793,8.44217853 126.408688,8.44217853 C126.408696,8.4421346 126.408704,8.44213549 126.408712,8.44218121 C147.72926,8.44874464 164.647208,20.518944 181.550224,27.4837344 C192.821967,32.1281908 216.571893,36.966946 252.800003,42 L126.38546,42 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } },
        mask: { "0": { value: "url(#mask-8-72e505)" } }
      },
      "haiku:ca5a4dffb5dc": {
        d: {
          "0": {
            value: "M519.745355,21.1271913 C519.767974,21.2464573 519.778987,21.3708727 519.778232,21.5 C519.778987,21.6291272 519.767974,21.7535427 519.745355,21.8728087 C519.630116,22.5673534 519.210948,23.3716754 518.46718,24.2294085 L514.067099,29.3036967 C512.925067,30.6207178 511.077629,30.6255162 509.931436,29.3036967 L505.531355,24.2294085 C504.779621,23.3624891 504.359853,22.5497144 504.250649,21.849693 C504.230814,21.7374869 504.221141,21.6208026 504.22176,21.5 C504.221141,21.3791974 504.230814,21.2625131 504.250649,21.150307 C504.359853,20.4502856 504.779621,19.6375109 505.531355,18.7705915 L509.931436,13.6963033 C511.077629,12.3744838 512.925067,12.3792822 514.067099,13.6963033 L518.46718,18.7705915 C519.210948,19.6283246 519.630116,20.4326466 519.745355,21.1271913 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } }
      },
      "haiku:81ec1e5b73f3": {
        d: {
          "0": {
            value: "M267.745355,21.1271913 C267.767974,21.2464573 267.778987,21.3708727 267.778232,21.5 C267.778987,21.6291272 267.767974,21.7535427 267.745355,21.8728087 C267.630116,22.5673534 267.210948,23.3716754 266.46718,24.2294085 L262.067099,29.3036967 C260.925067,30.6207178 259.077629,30.6255162 257.931436,29.3036967 L253.531355,24.2294085 C252.779621,23.3624891 252.359853,22.5497144 252.250649,21.849693 C252.230814,21.7374869 252.221141,21.6208026 252.22176,21.5 C252.221141,21.3791974 252.230814,21.2625131 252.250649,21.150307 C252.359853,20.4502856 252.779621,19.6375109 253.531355,18.7705915 L257.931436,13.6963033 C259.077629,12.3744838 260.925067,12.3792822 262.067099,13.6963033 L266.46718,18.7705915 C267.210948,19.6283246 267.630116,20.4326466 267.745355,21.1271913 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } }
      },
      "haiku:99e15a29e08b": {
        d: {
          "0": {
            value: "M15.7453553,21.1271913 C15.7679742,21.2464573 15.7789866,21.3708727 15.7782321,21.5 C15.7789866,21.6291272 15.7679742,21.7535427 15.7453553,21.8728087 C15.6301163,22.5673534 15.2109482,23.3716754 14.4671799,24.2294085 L10.0670993,29.3036967 C8.92506742,30.6207178 7.07762881,30.6255162 5.93143609,29.3036967 L1.53135544,24.2294085 C0.779621448,23.3624891 0.359852872,22.5497144 0.250648702,21.849693 C0.230814212,21.7374869 0.221140676,21.6208026 0.221759532,21.5 C0.221140676,21.3791974 0.230814212,21.2625131 0.250648702,21.150307 C0.359852872,20.4502856 0.779621448,19.6375109 1.53135544,18.7705915 L5.93143609,13.6963033 C7.07762881,12.3744838 8.92506742,12.3792822 10.0670993,13.6963033 L14.4671799,18.7705915 C15.2109482,19.6283246 15.6301163,20.4326466 15.7453553,21.1271913 Z"
          }
        },
        fill: { "0": { value: "#C2CCCD" } }
      },
      "haiku:d809fd973eae": { "translation.x": { "0": { value: 115 } } },
      "haiku:ddf0a49140f1": { fill: { "0": { value: "white" } } },
      "haiku:75124ca0ecdc": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:62fbc594aada": {
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } },
        mask: { "0": { value: "url(#mask-10-72e505)" } },
        x: { "0": { value: "-108" } },
        y: { "0": { value: "8" } },
        "sizeAbsolute.x": { "0": { value: 367 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 34 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:353149e79242": {
        d: {
          "0": {
            value: "M266.745355,22.1271913 C266.767974,22.2464573 266.778987,22.3708727 266.778232,22.5 C266.778987,22.6291272 266.767974,22.7535427 266.745355,22.8728087 C266.630116,23.5673534 266.210948,24.3716754 265.46718,25.2294085 L261.067099,30.3036967 C259.925067,31.6207178 258.077629,31.6255162 256.931436,30.3036967 L252.531355,25.2294085 C251.779621,24.3624891 251.359853,23.5497144 251.250649,22.849693 C251.230814,22.7374869 251.221141,22.6208026 251.22176,22.5 C251.221141,22.3791974 251.230814,22.2625131 251.250649,22.150307 C251.359853,21.4502856 251.779621,20.6375109 252.531355,19.7705915 L256.931436,14.6963033 C258.077629,13.3744838 259.925067,13.3792822 261.067099,14.6963033 L265.46718,19.7705915 C266.210948,20.6283246 266.630116,21.4326466 266.745355,22.1271913 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } }
      },
      "haiku:5515651d7710": {
        d: {
          "0": {
            value: "M15.7453553,22.1271913 C15.7679742,22.2464573 15.7789866,22.3708727 15.7782321,22.5 C15.7789866,22.6291272 15.7679742,22.7535427 15.7453553,22.8728087 C15.6301163,23.5673534 15.2109482,24.3716754 14.4671799,25.2294085 L10.0670993,30.3036967 C8.92506742,31.6207178 7.07762881,31.6255162 5.93143609,30.3036967 L1.53135544,25.2294085 C0.779621448,24.3624891 0.359852872,23.5497144 0.250648702,22.849693 C0.230814212,22.7374869 0.221140676,22.6208026 0.221759532,22.5 C0.221140676,22.3791974 0.230814212,22.2625131 0.250648702,22.150307 C0.359852872,21.4502856 0.779621448,20.6375109 1.53135544,19.7705915 L5.93143609,14.6963033 C7.07762881,13.3744838 8.92506742,13.3792822 10.0670993,14.6963033 L14.4671799,19.7705915 C15.2109482,20.6283246 15.6301163,21.4326466 15.7453553,22.1271913 Z"
          }
        },
        fill: { "0": { value: "#C2CCCD" } }
      },
      "haiku:606df247af22": { "translation.x": { "0": { value: 374 } } },
      "haiku:0f091d625c0b": { fill: { "0": { value: "white" } } },
      "haiku:26f5dc8d4210": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:82c77f50edb0": {
        d: {
          "0": {
            value: "M126.414543,41.5578538 C90.1864331,36.5247998 66.4365069,31.6860445 55.1647646,27.0415881 C38.2571512,20.0749035 21.3345973,8.00003229 0.00585465329,8.00003229 C0.0019515511,7.97806509 0,19.1640056 0,41.5578538 L126.414543,41.5578538 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } },
        mask: { "0": { value: "url(#mask-12-72e505)" } }
      },
      "haiku:6792b8d7e4c1": {
        d: {
          "0": {
            value: "M144.745355,22.1271913 C144.767974,22.2464573 144.778987,22.3708727 144.778232,22.5 C144.778987,22.6291272 144.767974,22.7535427 144.745355,22.8728087 C144.630116,23.5673534 144.210948,24.3716754 143.46718,25.2294085 L139.067099,30.3036967 C137.925067,31.6207178 136.077629,31.6255162 134.931436,30.3036967 L130.531355,25.2294085 C129.779621,24.3624891 129.359853,23.5497144 129.250649,22.849693 C129.230814,22.7374869 129.221141,22.6208026 129.22176,22.5 C129.221141,22.3791974 129.230814,22.2625131 129.250649,22.150307 C129.359853,21.4502856 129.779621,20.6375109 130.531355,19.7705915 L134.931436,14.6963033 C136.077629,13.3744838 137.925067,13.3792822 139.067099,14.6963033 L143.46718,19.7705915 C144.210948,20.6283246 144.630116,21.4326466 144.745355,22.1271913 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } }
      },
      "haiku:cde64dec82b9": {
        "translation.x": { "0": { value: 601 } },
        "translation.y": { "0": { value: 110 } },
        "rotation.y": { "0": { value: 3.14 } },
        "rotation.z": { "0": { value: 3.14 } },
        "scale.x": { "0": { value: -1 } },
        "scale.y": { "0": { value: -1 } },
        "scale.z": { "0": { value: -1 } }
      },
      "haiku:59a577bd8718": { fill: { "0": { value: "white" } } },
      "haiku:ae9eae5fa15e": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:16ea2266c5f1": {
        d: {
          "0": {
            value: "M216.414543,41.5578538 C154.394069,36.5247998 113.73554,31.6860445 94.4389548,27.0415881 C65.4940776,20.0749035 36.5236231,8.00003229 0.0100228351,8.00003229 C0.00334094502,7.97806509 0,19.1640056 0,41.5578538 L216.414543,41.5578538 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } },
        mask: { "0": { value: "url(#mask-14-72e505)" } }
      },
      "haiku:a69582ce7566": {
        d: {
          "0": {
            value: "M234.745355,22.1271913 C234.767974,22.2464573 234.778987,22.3708727 234.778232,22.5 C234.778987,22.6291272 234.767974,22.7535427 234.745355,22.8728087 C234.630116,23.5673534 234.210948,24.3716754 233.46718,25.2294085 L229.067099,30.3036967 C227.925067,31.6207178 226.077629,31.6255162 224.931436,30.3036967 L220.531355,25.2294085 C219.779621,24.3624891 219.359853,23.5497144 219.250649,22.849693 C219.230814,22.7374869 219.221141,22.6208026 219.22176,22.5 C219.221141,22.3791974 219.230814,22.2625131 219.250649,22.150307 C219.359853,21.4502856 219.779621,20.6375109 220.531355,19.7705915 L224.931436,14.6963033 C226.077629,13.3744838 227.925067,13.3792822 229.067099,14.6963033 L233.46718,19.7705915 C234.210948,20.6283246 234.630116,21.4326466 234.745355,22.1271913 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } }
      },
      "haiku:bb86344e60cf": {
        d: {
          "0": {
            value: "M607.523624,132.420454 C607.546243,132.53972 607.557255,132.664135 607.5565,132.793263 C607.557255,132.92239 607.546243,133.046805 607.523624,133.166071 C607.408385,133.860616 606.989217,134.664938 606.245448,135.522671 L601.845368,140.596959 C600.703336,141.913981 598.855897,141.918779 597.709704,140.596959 L593.309624,135.522671 C592.55789,134.655752 592.138121,133.842977 592.028917,133.142956 C592.009083,133.03075 591.999409,132.914065 592.000028,132.793263 C591.999409,132.67246 592.009083,132.555776 592.028917,132.44357 C592.138121,131.743548 592.55789,130.930774 593.309624,130.063854 L597.709704,124.989566 C598.855897,123.667747 600.703336,123.672545 601.845368,124.989566 L606.245448,130.063854 C606.989217,130.921587 607.408385,131.725909 607.523624,132.420454 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } }
      },
      "haiku:74c0a59613ae": { "translation.y": { "0": { value: 110 } } },
      "haiku:28adc39dff86": { fill: { "0": { value: "white" } } },
      "haiku:5ee9c922b23e": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:7e3c6c31e3b0": {
        d: {
          "0": {
            value: "M15.5,41.9803175 C15.5,46.3981465 15.5,50.5670615 15.5,54.4870626 C15.5,56.5044431 16.246193,57.3692324 21.1025739,56.854401 C49.0181764,52.7148996 70.4732135,46.4842179 85.4676852,38.1623558 C109.441463,24.8570206 125.768933,8.24522594 165.975399,8.24522594 C166.019801,8.28447003 165.991812,16.2559753 165.985415,32.1597525 C165.984661,34.0346618 165.16382,41.9803175 158.939846,41.9803175 C113.913547,41.9803175 66.1002649,41.9803175 15.5,41.9803175 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } }
      },
      "haiku:37666eecc513": {
        d: {
          "0": {
            value: "M15.7453553,21.1271913 C15.7679742,21.2464573 15.7789866,21.3708727 15.7782321,21.5 C15.7789866,21.6291272 15.7679742,21.7535427 15.7453553,21.8728087 C15.6301163,22.5673534 15.2109482,23.3716754 14.4671799,24.2294085 L10.0670993,29.3036967 C8.92506742,30.6207178 7.07762881,30.6255162 5.93143609,29.3036967 L1.53135544,24.2294085 C0.779621448,23.3624891 0.359852872,22.5497144 0.250648702,21.849693 C0.230814212,21.7374869 0.221140676,21.6208026 0.221759532,21.5 C0.221140676,21.3791974 0.230814212,21.2625131 0.250648702,21.150307 C0.359852872,20.4502856 0.779621448,19.6375109 1.53135544,18.7705915 L5.93143609,13.6963033 C7.07762881,12.3744838 8.92506742,12.3792822 10.0670993,13.6963033 L14.4671799,18.7705915 C15.2109482,19.6283246 15.6301163,20.4326466 15.7453553,21.1271913 Z"
          }
        },
        fill: { "0": { value: "#C2CCCD" } }
      },
      "haiku:52ce42eb09c4": {
        d: {
          "0": {
            value: "M172.745355,21.1271913 C172.767974,21.2464573 172.778987,21.3708727 172.778232,21.5 C172.778987,21.6291272 172.767974,21.7535427 172.745355,21.8728087 C172.630116,22.5673534 172.210948,23.3716754 171.46718,24.2294085 L167.067099,29.3036967 C165.925067,30.6207178 164.077629,30.6255162 162.931436,29.3036967 L158.531355,24.2294085 C157.779621,23.3624891 157.359853,22.5497144 157.250649,21.849693 C157.230814,21.7374869 157.221141,21.6208026 157.22176,21.5 C157.221141,21.3791974 157.230814,21.2625131 157.250649,21.150307 C157.359853,20.4502856 157.779621,19.6375109 158.531355,18.7705915 L162.931436,13.6963033 C164.077629,12.3744838 165.925067,12.3792822 167.067099,13.6963033 L171.46718,18.7705915 C172.210948,19.6283246 172.630116,20.4326466 172.745355,21.1271913 Z"
          }
        },
        fill: { "0": { value: "#C2CCCD" } }
      },
      "haiku:038a3c470a52": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 337 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:7cd1b048cbae": {
        x: { "0": { value: "7" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 252 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:2465991194f3": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 252.800003 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:abd00996b690": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 252.800003 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:46351729f24d": {
        x: { "0": { value: "7" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 252 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:3983c9599ef1": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 137 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:8b609a529949": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 227 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:db8855ece859": {
        x: { "0": { value: "7" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 241 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:560990adf0c7": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -260 } },
        "translation.y": { "0": { value: -172 } }
      },
      "haiku:406bb25c908d": {
        "translation.x": { "0": { value: 260 } },
        "translation.y": { "0": { value: 172 } }
      },
      "haiku:b4958d75ae3e": {
        "translation.x": { "0": { value: 374 } },
        "translation.y": { "0": { value: 164 } }
      },
      "haiku:489362c341d2": { fill: { "0": { value: "white" } } },
      "haiku:8594dc813f62": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:e43a359fc5fb": {
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } },
        mask: { "0": { value: "url(#mask-2-18a4d8)" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "8" } },
        "sizeAbsolute.x": { "0": { value: 337 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 34 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:a30f2b1d97c7": {
        "translation.x": { "0": { value: 115 } },
        "translation.y": { "0": { value: 164 } }
      },
      "haiku:f176cce6ff46": { fill: { "0": { value: "white" } } },
      "haiku:d80fba014fe8": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:a3a199768eb7": {
        d: {
          "0": {
            value: "M266.745355,22.1271913 C266.767974,22.2464573 266.778987,22.3708727 266.778232,22.5 C266.778987,22.6291272 266.767974,22.7535427 266.745355,22.8728087 C266.630116,23.5673534 266.210948,24.3716754 265.46718,25.2294085 L261.067099,30.3036967 C259.925067,31.6207178 258.077629,31.6255162 256.931436,30.3036967 L252.531355,25.2294085 C251.779621,24.3624891 251.359853,23.5497144 251.250649,22.849693 C251.230814,22.7374869 251.221141,22.6208026 251.22176,22.5 C251.221141,22.3791974 251.230814,22.2625131 251.250649,22.150307 C251.359853,21.4502856 251.779621,20.6375109 252.531355,19.7705915 L256.931436,14.6963033 C258.077629,13.3744838 259.925067,13.3792822 261.067099,14.6963033 L265.46718,19.7705915 C266.210948,20.6283246 266.630116,21.4326466 266.745355,22.1271913 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } }
      },
      "haiku:b31dfc7927e1": {
        d: {
          "0": {
            value: "M15.7453553,22.1271913 C15.7679742,22.2464573 15.7789866,22.3708727 15.7782321,22.5 C15.7789866,22.6291272 15.7679742,22.7535427 15.7453553,22.8728087 C15.6301163,23.5673534 15.2109482,24.3716754 14.4671799,25.2294085 L10.0670993,30.3036967 C8.92506742,31.6207178 7.07762881,31.6255162 5.93143609,30.3036967 L1.53135544,25.2294085 C0.779621448,24.3624891 0.359852872,23.5497144 0.250648702,22.849693 C0.230814212,22.7374869 0.221140676,22.6208026 0.221759532,22.5 C0.221140676,22.3791974 0.230814212,22.2625131 0.250648702,22.150307 C0.359852872,21.4502856 0.779621448,20.6375109 1.53135544,19.7705915 L5.93143609,14.6963033 C7.07762881,13.3744838 8.92506742,13.3792822 10.0670993,14.6963033 L14.4671799,19.7705915 C15.2109482,20.6283246 15.6301163,21.4326466 15.7453553,22.1271913 Z"
          }
        },
        fill: { "0": { value: "#C2CCCD" } }
      },
      "haiku:3ae9796362be": {
        d: {
          "0": {
            value: "M7,42.0541765 C22.7351164,41.8105473 33.5338856,41.6646876 39.3963076,41.6165977 C48.1899406,41.5444627 75.19936,42.7500636 80.272515,42.7515037 C85.34567,42.7529438 97.2310715,40.4796867 105.479658,40.4934501 C113.728244,40.5072135 128.629149,43.842126 141.827086,43.842126 C155.025023,43.842126 157.416395,42.0615623 158.202617,41.6165977 C158.988839,41.171633 169.702151,31.0684033 180.740243,31.0684033 C191.778336,31.0684033 197.354728,40.316357 198.220028,41.6165977 C199.085328,42.9168383 203.493893,60 217.887803,60 C232.281712,60 235.93842,43.8795034 236.096515,42.0541765 C236.25461,40.2288497 237.292455,8.02614747 258.994297,8 C259.000716,8.00205343 259.001716,16.0907513 258.997299,32.2660937 C258.996763,34.227952 257.782697,40.4934501 251.492624,41.8539237 C251.340408,41.8868465 251.26478,41.9535974 251.265742,42.0541765 L7,42.0541765 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } }
      },
      "haiku:3b2e0033821b": { "translation.y": { "0": { value: 55 } } },
      "haiku:879ef59943ad": { "translation.x": { "0": { value: 7 } } },
      "haiku:4ffeb88d73ee": { fill: { "0": { value: "white" } } },
      "haiku:9b33ef29205c": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:80963828aaac": {
        d: {
          "0": {
            value: "M126.38546,42 L0,42 C36.2281101,36.966946 59.9780363,32.1281908 71.2497786,27.4837344 C88.1527947,20.518944 105.070743,8.44874464 126.391291,8.44218121 C126.391299,8.44213549 126.391307,8.4421346 126.391315,8.44217853 C126.39421,8.44217853 126.397106,8.44217875 126.400002,8.4421792 C126.402897,8.44217875 126.405793,8.44217853 126.408688,8.44217853 C126.408696,8.4421346 126.408704,8.44213549 126.408712,8.44218121 C147.72926,8.44874464 164.647208,20.518944 181.550224,27.4837344 C192.821967,32.1281908 216.571893,36.966946 252.800003,42 L126.38546,42 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } },
        mask: { "0": { value: "url(#mask-6-18a4d8)" } }
      },
      "haiku:9f7fa6f41e77": { "translation.x": { "0": { value: 260 } } },
      "haiku:c6a15ef74a22": { fill: { "0": { value: "white" } } },
      "haiku:b876962f38f5": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:855264a88c83": {
        d: {
          "0": {
            value: "M126.38546,42 L0,42 C36.2281101,36.966946 59.9780363,32.1281908 71.2497786,27.4837344 C88.1527947,20.518944 105.070743,8.44874464 126.391291,8.44218121 C126.391299,8.44213549 126.391307,8.4421346 126.391315,8.44217853 C126.39421,8.44217853 126.397106,8.44217875 126.400002,8.4421792 C126.402897,8.44217875 126.405793,8.44217853 126.408688,8.44217853 C126.408696,8.4421346 126.408704,8.44213549 126.408712,8.44218121 C147.72926,8.44874464 164.647208,20.518944 181.550224,27.4837344 C192.821967,32.1281908 216.571893,36.966946 252.800003,42 L126.38546,42 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } },
        mask: { "0": { value: "url(#mask-8-18a4d8)" } }
      },
      "haiku:a5d4604d76cf": {
        d: {
          "0": {
            value: "M519.745355,21.1271913 C519.767974,21.2464573 519.778987,21.3708727 519.778232,21.5 C519.778987,21.6291272 519.767974,21.7535427 519.745355,21.8728087 C519.630116,22.5673534 519.210948,23.3716754 518.46718,24.2294085 L514.067099,29.3036967 C512.925067,30.6207178 511.077629,30.6255162 509.931436,29.3036967 L505.531355,24.2294085 C504.779621,23.3624891 504.359853,22.5497144 504.250649,21.849693 C504.230814,21.7374869 504.221141,21.6208026 504.22176,21.5 C504.221141,21.3791974 504.230814,21.2625131 504.250649,21.150307 C504.359853,20.4502856 504.779621,19.6375109 505.531355,18.7705915 L509.931436,13.6963033 C511.077629,12.3744838 512.925067,12.3792822 514.067099,13.6963033 L518.46718,18.7705915 C519.210948,19.6283246 519.630116,20.4326466 519.745355,21.1271913 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } }
      },
      "haiku:9a2a10796c49": {
        d: {
          "0": {
            value: "M267.745355,21.1271913 C267.767974,21.2464573 267.778987,21.3708727 267.778232,21.5 C267.778987,21.6291272 267.767974,21.7535427 267.745355,21.8728087 C267.630116,22.5673534 267.210948,23.3716754 266.46718,24.2294085 L262.067099,29.3036967 C260.925067,30.6207178 259.077629,30.6255162 257.931436,29.3036967 L253.531355,24.2294085 C252.779621,23.3624891 252.359853,22.5497144 252.250649,21.849693 C252.230814,21.7374869 252.221141,21.6208026 252.22176,21.5 C252.221141,21.3791974 252.230814,21.2625131 252.250649,21.150307 C252.359853,20.4502856 252.779621,19.6375109 253.531355,18.7705915 L257.931436,13.6963033 C259.077629,12.3744838 260.925067,12.3792822 262.067099,13.6963033 L266.46718,18.7705915 C267.210948,19.6283246 267.630116,20.4326466 267.745355,21.1271913 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } }
      },
      "haiku:821faa72f9e3": {
        d: {
          "0": {
            value: "M15.7453553,21.1271913 C15.7679742,21.2464573 15.7789866,21.3708727 15.7782321,21.5 C15.7789866,21.6291272 15.7679742,21.7535427 15.7453553,21.8728087 C15.6301163,22.5673534 15.2109482,23.3716754 14.4671799,24.2294085 L10.0670993,29.3036967 C8.92506742,30.6207178 7.07762881,30.6255162 5.93143609,29.3036967 L1.53135544,24.2294085 C0.779621448,23.3624891 0.359852872,22.5497144 0.250648702,21.849693 C0.230814212,21.7374869 0.221140676,21.6208026 0.221759532,21.5 C0.221140676,21.3791974 0.230814212,21.2625131 0.250648702,21.150307 C0.359852872,20.4502856 0.779621448,19.6375109 1.53135544,18.7705915 L5.93143609,13.6963033 C7.07762881,12.3744838 8.92506742,12.3792822 10.0670993,13.6963033 L14.4671799,18.7705915 C15.2109482,19.6283246 15.6301163,20.4326466 15.7453553,21.1271913 Z"
          }
        },
        fill: { "0": { value: "#C2CCCD" } }
      },
      "haiku:e2ad4afc128f": { "translation.x": { "0": { value: 115 } } },
      "haiku:19e02c20c6e2": { fill: { "0": { value: "white" } } },
      "haiku:716125f24f94": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:5f74cb5c59dc": {
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } },
        mask: { "0": { value: "url(#mask-10-18a4d8)" } },
        x: { "0": { value: "-108" } },
        y: { "0": { value: "8" } },
        "sizeAbsolute.x": { "0": { value: 367 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 34 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:873f927d07e7": {
        d: {
          "0": {
            value: "M266.745355,22.1271913 C266.767974,22.2464573 266.778987,22.3708727 266.778232,22.5 C266.778987,22.6291272 266.767974,22.7535427 266.745355,22.8728087 C266.630116,23.5673534 266.210948,24.3716754 265.46718,25.2294085 L261.067099,30.3036967 C259.925067,31.6207178 258.077629,31.6255162 256.931436,30.3036967 L252.531355,25.2294085 C251.779621,24.3624891 251.359853,23.5497144 251.250649,22.849693 C251.230814,22.7374869 251.221141,22.6208026 251.22176,22.5 C251.221141,22.3791974 251.230814,22.2625131 251.250649,22.150307 C251.359853,21.4502856 251.779621,20.6375109 252.531355,19.7705915 L256.931436,14.6963033 C258.077629,13.3744838 259.925067,13.3792822 261.067099,14.6963033 L265.46718,19.7705915 C266.210948,20.6283246 266.630116,21.4326466 266.745355,22.1271913 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } }
      },
      "haiku:73646488547f": {
        d: {
          "0": {
            value: "M15.7453553,22.1271913 C15.7679742,22.2464573 15.7789866,22.3708727 15.7782321,22.5 C15.7789866,22.6291272 15.7679742,22.7535427 15.7453553,22.8728087 C15.6301163,23.5673534 15.2109482,24.3716754 14.4671799,25.2294085 L10.0670993,30.3036967 C8.92506742,31.6207178 7.07762881,31.6255162 5.93143609,30.3036967 L1.53135544,25.2294085 C0.779621448,24.3624891 0.359852872,23.5497144 0.250648702,22.849693 C0.230814212,22.7374869 0.221140676,22.6208026 0.221759532,22.5 C0.221140676,22.3791974 0.230814212,22.2625131 0.250648702,22.150307 C0.359852872,21.4502856 0.779621448,20.6375109 1.53135544,19.7705915 L5.93143609,14.6963033 C7.07762881,13.3744838 8.92506742,13.3792822 10.0670993,14.6963033 L14.4671799,19.7705915 C15.2109482,20.6283246 15.6301163,21.4326466 15.7453553,22.1271913 Z"
          }
        },
        fill: { "0": { value: "#C2CCCD" } }
      },
      "haiku:55bed3c1f7b1": { "translation.x": { "0": { value: 374 } } },
      "haiku:ae1776c740c8": { fill: { "0": { value: "white" } } },
      "haiku:3faa72675b35": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:9051b0c16305": {
        d: {
          "0": {
            value: "M126.414543,41.5578538 C90.1864331,36.5247998 66.4365069,31.6860445 55.1647646,27.0415881 C38.2571512,20.0749035 21.3345973,8.00003229 0.00585465329,8.00003229 C0.0019515511,7.97806509 0,19.1640056 0,41.5578538 L126.414543,41.5578538 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } },
        mask: { "0": { value: "url(#mask-12-18a4d8)" } }
      },
      "haiku:08d8eebba2b9": {
        d: {
          "0": {
            value: "M144.745355,22.1271913 C144.767974,22.2464573 144.778987,22.3708727 144.778232,22.5 C144.778987,22.6291272 144.767974,22.7535427 144.745355,22.8728087 C144.630116,23.5673534 144.210948,24.3716754 143.46718,25.2294085 L139.067099,30.3036967 C137.925067,31.6207178 136.077629,31.6255162 134.931436,30.3036967 L130.531355,25.2294085 C129.779621,24.3624891 129.359853,23.5497144 129.250649,22.849693 C129.230814,22.7374869 129.221141,22.6208026 129.22176,22.5 C129.221141,22.3791974 129.230814,22.2625131 129.250649,22.150307 C129.359853,21.4502856 129.779621,20.6375109 130.531355,19.7705915 L134.931436,14.6963033 C136.077629,13.3744838 137.925067,13.3792822 139.067099,14.6963033 L143.46718,19.7705915 C144.210948,20.6283246 144.630116,21.4326466 144.745355,22.1271913 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } }
      },
      "haiku:b1cbe3ca1c06": {
        "translation.x": { "0": { value: 601 } },
        "translation.y": { "0": { value: 110 } },
        "rotation.y": { "0": { value: 3.14 } },
        "rotation.z": { "0": { value: 3.14 } },
        "scale.x": { "0": { value: -1 } },
        "scale.y": { "0": { value: -1 } },
        "scale.z": { "0": { value: -1 } }
      },
      "haiku:38d0c3704c6c": { fill: { "0": { value: "white" } } },
      "haiku:4b7af919a829": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:418eef040ad9": {
        d: {
          "0": {
            value: "M216.414543,41.5578538 C154.394069,36.5247998 113.73554,31.6860445 94.4389548,27.0415881 C65.4940776,20.0749035 36.5236231,8.00003229 0.0100228351,8.00003229 C0.00334094502,7.97806509 0,19.1640056 0,41.5578538 L216.414543,41.5578538 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } },
        mask: { "0": { value: "url(#mask-14-18a4d8)" } }
      },
      "haiku:1b3715fb59ed": {
        d: {
          "0": {
            value: "M234.745355,22.1271913 C234.767974,22.2464573 234.778987,22.3708727 234.778232,22.5 C234.778987,22.6291272 234.767974,22.7535427 234.745355,22.8728087 C234.630116,23.5673534 234.210948,24.3716754 233.46718,25.2294085 L229.067099,30.3036967 C227.925067,31.6207178 226.077629,31.6255162 224.931436,30.3036967 L220.531355,25.2294085 C219.779621,24.3624891 219.359853,23.5497144 219.250649,22.849693 C219.230814,22.7374869 219.221141,22.6208026 219.22176,22.5 C219.221141,22.3791974 219.230814,22.2625131 219.250649,22.150307 C219.359853,21.4502856 219.779621,20.6375109 220.531355,19.7705915 L224.931436,14.6963033 C226.077629,13.3744838 227.925067,13.3792822 229.067099,14.6963033 L233.46718,19.7705915 C234.210948,20.6283246 234.630116,21.4326466 234.745355,22.1271913 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } }
      },
      "haiku:f25f30e7fd83": {
        d: {
          "0": {
            value: "M607.523624,132.420454 C607.546243,132.53972 607.557255,132.664135 607.5565,132.793263 C607.557255,132.92239 607.546243,133.046805 607.523624,133.166071 C607.408385,133.860616 606.989217,134.664938 606.245448,135.522671 L601.845368,140.596959 C600.703336,141.913981 598.855897,141.918779 597.709704,140.596959 L593.309624,135.522671 C592.55789,134.655752 592.138121,133.842977 592.028917,133.142956 C592.009083,133.03075 591.999409,132.914065 592.000028,132.793263 C591.999409,132.67246 592.009083,132.555776 592.028917,132.44357 C592.138121,131.743548 592.55789,130.930774 593.309624,130.063854 L597.709704,124.989566 C598.855897,123.667747 600.703336,123.672545 601.845368,124.989566 L606.245448,130.063854 C606.989217,130.921587 607.408385,131.725909 607.523624,132.420454 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } }
      },
      "haiku:e1ddd610eb35": { "translation.y": { "0": { value: 110 } } },
      "haiku:86b3cc36df3d": { fill: { "0": { value: "white" } } },
      "haiku:9a08426ef92f": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:5b3e0b5d6bca": {
        d: {
          "0": {
            value: "M19.9030077,41.9803175 C19.9030077,46.3981465 19.9030077,50.5670615 19.9030077,54.4870626 C19.9030077,56.5044431 21.0357293,57.3692324 28.40772,56.854401 C70.7836298,52.7148996 103.352396,46.4842179 126.114017,38.1623558 C162.506234,24.8570206 187.291347,8.24522594 248.3248,8.24522594 C248.392202,8.28447003 248.349715,16.2559753 248.340005,32.1597525 C248.33886,34.0346618 247.092822,41.9803175 237.644824,41.9803175 C169.294861,41.9803175 96.7142556,41.9803175 19.9030077,41.9803175 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } }
      },
      "haiku:e7aa0853de54": {
        d: {
          "0": {
            value: "M15.7453553,21.1271913 C15.7679742,21.2464573 15.7789866,21.3708727 15.7782321,21.5 C15.7789866,21.6291272 15.7679742,21.7535427 15.7453553,21.8728087 C15.6301163,22.5673534 15.2109482,23.3716754 14.4671799,24.2294085 L10.0670993,29.3036967 C8.92506742,30.6207178 7.07762881,30.6255162 5.93143609,29.3036967 L1.53135544,24.2294085 C0.779621448,23.3624891 0.359852872,22.5497144 0.250648702,21.849693 C0.230814212,21.7374869 0.221140676,21.6208026 0.221759532,21.5 C0.221140676,21.3791974 0.230814212,21.2625131 0.250648702,21.150307 C0.359852872,20.4502856 0.779621448,19.6375109 1.53135544,18.7705915 L5.93143609,13.6963033 C7.07762881,12.3744838 8.92506742,12.3792822 10.0670993,13.6963033 L14.4671799,18.7705915 C15.2109482,19.6283246 15.6301163,20.4326466 15.7453553,21.1271913 Z"
          }
        },
        fill: { "0": { value: "#C2CCCD" } }
      },
      "haiku:61c21c6d1a3e": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -385 } },
        "translation.y": { "0": { value: -195 } }
      },
      "haiku:ba56ad3c1aca": {
        fill: { "0": { value: "#FFFFFF" } },
        "translation.x": { "0": { value: 210 } },
        "translation.y": { "0": { value: 126 } }
      },
      "haiku:c268ae2acf60": {
        "translation.x": { "0": { value: 160.5 } },
        "translation.y": { "0": { value: 8.2 } }
      },
      "haiku:8de6798ef877": { "translation.x": { "0": { value: 9 } } },
      "haiku:678344e53259": {
        d: {
          "0": {
            value: "M18.76,61.69 C19.2800026,62.2700029 19.54,63.0533284 19.54,64.04 L19.54,71.6 L17.7,71.6 L17.7,64.3 C17.7,62.9399932 17.2066716,62.26 16.22,62.26 C15.6999974,62.26 15.2600018,62.4099985 14.9,62.71 C14.5399982,63.0100015 14.1533354,63.4799968 13.74,64.12 L13.74,71.6 L11.9,71.6 L11.9,64.3 C11.9,62.9399932 11.4066716,62.26 10.42,62.26 C9.886664,62.26 9.4400018,62.4133318 9.08,62.72 C8.7199982,63.0266682 8.340002,63.4933302 7.94,64.12 L7.94,71.6 L6.1,71.6 L6.1,61.06 L7.68,61.06 L7.84,62.6 C8.6266706,61.4133274 9.6399938,60.82 10.88,60.82 C11.5333366,60.82 12.0899977,60.986665 12.55,61.32 C13.0100023,61.653335 13.339999,62.119997 13.54,62.72 C13.9533354,62.1066636 14.4099975,61.6366683 14.91,61.31 C15.4100025,60.9833317 15.9999966,60.82 16.68,60.82 C17.546671,60.82 18.2399974,61.1099971 18.76,61.69 Z"
          }
        }
      },
      "haiku:e9e79d51718d": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "4.6" } },
        "sizeAbsolute.x": { "0": { value: 157 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 75 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:131258209317": {
        x: { "0": { value: "-17.5%" } },
        y: { "0": { value: "-27.3%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 1.35 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 1.733 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:c445633e2dfa": {
        dx: { "0": { value: "0" } },
        dy: { "0": { value: "7" } },
        in: { "0": { value: "SourceAlpha" } },
        result: { "0": { value: "shadowOffsetOuter1" } }
      },
      "haiku:b66fddd57df3": {
        stdDeviation: { "0": { value: "8" } },
        in: { "0": { value: "shadowOffsetOuter1" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:1e614358055c": {
        values: {
          "0": {
            value: "0 0 0 0 0.0431372549   0 0 0 0 0.0509803922   0 0 0 0 0.0509803922  0 0 0 0.402088995 0"
          }
        },
        in: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:0033791e70f9": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -355 } },
        "translation.y": { "0": { value: -210 } }
      },
      "haiku:2e398a9b4e5f": {
        "translation.x": { "0": { value: 210 } },
        "translation.y": { "0": { value: 126 } }
      },
      "haiku:5fea9119ba12": {
        "translation.x": { "0": { value: 160.5 } },
        "translation.y": { "0": { value: 8.2 } }
      },
      "haiku:884215717279": { "translation.y": { "0": { value: 84 } } },
      "haiku:d735d4bb8bb4": {
        fill: { "0": { value: "black" } },
        "fill-opacity": { "0": { value: "1" } },
        filter: { "0": { value: "url(#filter-2-b66c26)" } }
      },
      "haiku:44d4a681d55c": {
        fill: { "0": { value: "#131E20" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:5da50aadea38": {
        fill: { "0": { value: "#232D2F" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "12" } },
        "sizeAbsolute.x": { "0": { value: 157 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 27 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:5f6ca51edfb7": {
        d: {
          "0": {
            value: "M143.410737,20.9827759 C143.096842,20.7835315 142.657263,20.6069008 142.104,20.4583843 C141.003789,20.1625736 139.546105,20 138,20 C136.453895,20 134.996211,20.1631848 133.896,20.4583843 C133.342105,20.6069008 132.902526,20.7835315 132.589263,20.9827759 C132.198316,21.2315257 132,21.5169463 132,21.8329259 L132,29.1670741 C132,29.4830537 132.198316,29.7690855 132.589263,30.0172241 C132.903158,30.2164685 133.342737,30.3930992 133.896,30.5416157 C134.996211,30.8374264 136.453895,31 138,31 C139.546105,31 141.003789,30.8368152 142.104,30.5410046 C142.657895,30.3924881 143.097474,30.2158573 143.410737,30.016613 C143.801684,29.7684743 144,29.4824425 144,29.1664629 L144,21.8323147 C144,21.5163351 143.801684,21.2303034 143.410737,20.9821647 L143.410737,20.9827759 Z M134.065263,21.0469497 C135.112421,20.7658073 136.509474,20.6105678 138,20.6105678 C139.490526,20.6105678 140.888211,20.7658073 141.934737,21.0469497 C143.068421,21.351928 143.368421,21.6941882 143.368421,21.8329259 C143.368421,21.9716635 143.069053,22.3139238 141.934737,22.6189021 C140.887579,22.9000444 139.490526,23.0552839 138,23.0552839 C136.509474,23.0552839 135.111789,22.9000444 134.065263,22.6189021 C132.931579,22.3139238 132.631579,21.9716635 132.631579,21.8329259 C132.631579,21.6941882 132.930947,21.351928 134.065263,21.0469497 Z M141.934737,29.9530503 C140.887579,30.2341927 139.490526,30.3894322 138,30.3894322 C136.509474,30.3894322 135.111789,30.2341927 134.065263,29.9530503 C132.931579,29.648072 132.631579,29.3058118 132.631579,29.1670741 L132.631579,27.5987888 C132.942316,27.7876431 133.366737,27.9551061 133.896,28.0975108 C134.996211,28.3933215 136.453895,28.5558951 138,28.5558951 C139.546105,28.5558951 141.003789,28.3927103 142.104,28.0968997 C142.633263,27.9544949 143.058316,27.7870319 143.368421,27.5981776 L143.368421,29.1664629 C143.368421,29.3052006 143.069053,29.6474608 141.934737,29.9524392 L141.934737,29.9530503 Z M141.934737,27.5083343 C140.887579,27.7894766 139.490526,27.9447161 138,27.9447161 C136.509474,27.9447161 135.111789,27.7894766 134.065263,27.5083343 C132.931579,27.2033559 132.631579,26.8610957 132.631579,26.722358 L132.631579,25.1540727 C132.942316,25.342927 133.366737,25.51039 133.896,25.6527948 C134.996211,25.9486054 136.453895,26.111179 138,26.111179 C139.546105,26.111179 141.003789,25.9479942 142.104,25.6527948 C142.633263,25.51039 143.058316,25.342927 143.368421,25.1540727 L143.368421,26.722358 C143.368421,26.8610957 143.069053,27.2033559 141.934737,27.5083343 Z M141.934737,25.0636182 C140.887579,25.3447605 139.490526,25.5 138,25.5 C136.509474,25.5 135.111789,25.3447605 134.065263,25.0636182 C132.931579,24.7586398 132.631579,24.4163796 132.631579,24.277642 L132.631579,22.7093566 C132.942316,22.8982109 133.366737,23.065674 133.896,23.2080787 C134.996211,23.5038893 136.453895,23.6664629 138,23.6664629 C139.546105,23.6664629 141.003789,23.5032781 142.104,23.2080787 C142.633263,23.065674 143.058316,22.8982109 143.368421,22.7093566 L143.368421,24.277642 C143.368421,24.4163796 143.069053,24.7586398 141.934737,25.0636182 Z"
          }
        },
        fill: { "0": { value: "#E8F4F6" } },
        "fill-rule": { "0": { value: "nonzero" } },
        opacity: { "0": { value: "0.44384058" } }
      },
      "haiku:ebf2a52c506c": {
        d: {
          "0": {
            value: "M143.410737,50.9827759 C143.096842,50.7835315 142.657263,50.6069008 142.104,50.4583843 C141.003789,50.1625736 139.546105,50 138,50 C136.453895,50 134.996211,50.1631848 133.896,50.4583843 C133.342105,50.6069008 132.902526,50.7835315 132.589263,50.9827759 C132.198316,51.2315257 132,51.5169463 132,51.8329259 L132,59.1670741 C132,59.4830537 132.198316,59.7690855 132.589263,60.0172241 C132.903158,60.2164685 133.342737,60.3930992 133.896,60.5416157 C134.996211,60.8374264 136.453895,61 138,61 C139.546105,61 141.003789,60.8368152 142.104,60.5410046 C142.657895,60.3924881 143.097474,60.2158573 143.410737,60.016613 C143.801684,59.7684743 144,59.4824425 144,59.1664629 L144,51.8323147 C144,51.5163351 143.801684,51.2303034 143.410737,50.9821647 L143.410737,50.9827759 Z M134.065263,51.0469497 C135.112421,50.7658073 136.509474,50.6105678 138,50.6105678 C139.490526,50.6105678 140.888211,50.7658073 141.934737,51.0469497 C143.068421,51.351928 143.368421,51.6941882 143.368421,51.8329259 C143.368421,51.9716635 143.069053,52.3139238 141.934737,52.6189021 C140.887579,52.9000444 139.490526,53.0552839 138,53.0552839 C136.509474,53.0552839 135.111789,52.9000444 134.065263,52.6189021 C132.931579,52.3139238 132.631579,51.9716635 132.631579,51.8329259 C132.631579,51.6941882 132.930947,51.351928 134.065263,51.0469497 Z M141.934737,59.9530503 C140.887579,60.2341927 139.490526,60.3894322 138,60.3894322 C136.509474,60.3894322 135.111789,60.2341927 134.065263,59.9530503 C132.931579,59.648072 132.631579,59.3058118 132.631579,59.1670741 L132.631579,57.5987888 C132.942316,57.7876431 133.366737,57.9551061 133.896,58.0975108 C134.996211,58.3933215 136.453895,58.5558951 138,58.5558951 C139.546105,58.5558951 141.003789,58.3927103 142.104,58.0968997 C142.633263,57.9544949 143.058316,57.7870319 143.368421,57.5981776 L143.368421,59.1664629 C143.368421,59.3052006 143.069053,59.6474608 141.934737,59.9524392 L141.934737,59.9530503 Z M141.934737,57.5083343 C140.887579,57.7894766 139.490526,57.9447161 138,57.9447161 C136.509474,57.9447161 135.111789,57.7894766 134.065263,57.5083343 C132.931579,57.2033559 132.631579,56.8610957 132.631579,56.722358 L132.631579,55.1540727 C132.942316,55.342927 133.366737,55.51039 133.896,55.6527948 C134.996211,55.9486054 136.453895,56.111179 138,56.111179 C139.546105,56.111179 141.003789,55.9479942 142.104,55.6527948 C142.633263,55.51039 143.058316,55.342927 143.368421,55.1540727 L143.368421,56.722358 C143.368421,56.8610957 143.069053,57.2033559 141.934737,57.5083343 Z M141.934737,55.0636182 C140.887579,55.3447605 139.490526,55.5 138,55.5 C136.509474,55.5 135.111789,55.3447605 134.065263,55.0636182 C132.931579,54.7586398 132.631579,54.4163796 132.631579,54.277642 L132.631579,52.7093566 C132.942316,52.8982109 133.366737,53.065674 133.896,53.2080787 C134.996211,53.5038893 136.453895,53.6664629 138,53.6664629 C139.546105,53.6664629 141.003789,53.5032781 142.104,53.2080787 C142.633263,53.065674 143.058316,52.8982109 143.368421,52.7093566 L143.368421,54.277642 C143.368421,54.4163796 143.069053,54.7586398 141.934737,55.0636182 Z"
          }
        },
        fill: { "0": { value: "#E8F4F6" } },
        "fill-rule": { "0": { value: "nonzero" } },
        opacity: { "0": { value: "0.44384058" } }
      },
      "haiku:230a57a677b6": {
        fill: { "0": { value: "#5DE2F9" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "12" } },
        "sizeAbsolute.x": { "0": { value: 3 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 27 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:d1ecad6e6619": {
        d: {
          "0": {
            value: "M28.5952,21.4828 C29.0736024,22.0164027 29.3128,22.7370621 29.3128,23.6448 L29.3128,30.6 L27.62,30.6 L27.62,23.884 C27.62,22.6327937 27.1661379,22.0072 26.2584,22.0072 C25.7799976,22.0072 25.3752017,22.1451986 25.044,22.4212 C24.7127983,22.6972014 24.3570686,23.1295971 23.9768,23.7184 L23.9768,30.6 L22.284,30.6 L22.284,23.884 C22.284,22.6327937 21.8301379,22.0072 20.9224,22.0072 C20.4317309,22.0072 20.0208017,22.1482653 19.6896,22.4304 C19.3583983,22.7125347 19.0088018,23.1418638 18.6408,23.7184 L18.6408,30.6 L16.948,30.6 L16.948,20.9032 L18.4016,20.9032 L18.5488,22.32 C19.272537,21.2282612 20.2047943,20.6824 21.3456,20.6824 C21.9466697,20.6824 22.4587979,20.8357318 22.882,21.1424 C23.3052021,21.4490682 23.6087991,21.8783972 23.7928,22.4304 C24.1730686,21.8661305 24.5931977,21.4337348 25.0532,21.1332 C25.5132023,20.8326652 26.0559969,20.6824 26.6816,20.6824 C27.4789373,20.6824 28.1167976,20.9491973 28.5952,21.4828 Z M39.3924615,22.044 C40.1468652,22.9517379 40.5240615,24.1845255 40.5240615,25.7424 C40.5240615,26.7482717 40.3523299,27.6345295 40.0088615,28.4012 C39.6653931,29.1678705 39.1685981,29.7627979 38.5184615,30.186 C37.8683249,30.6092021 37.0955326,30.8208 36.2000615,30.8208 C34.8384547,30.8208 33.7773986,30.3669379 33.0168615,29.4592 C32.2563243,28.5514621 31.8760615,27.3186745 31.8760615,25.7608 C31.8760615,24.7549283 32.0477931,23.8686705 32.3912615,23.102 C32.7347299,22.3353295 33.2315249,21.7404021 33.8816615,21.3172 C34.5317981,20.8939979 35.3107236,20.6824 36.2184615,20.6824 C37.5800683,20.6824 38.6380577,21.1362621 39.3924615,22.044 Z M33.6976615,25.7608 C33.6976615,28.2264123 34.5317865,29.4592 36.2000615,29.4592 C37.8683365,29.4592 38.7024615,28.2202791 38.7024615,25.7424 C38.7024615,23.2767877 37.8744697,22.044 36.2184615,22.044 C34.5379197,22.044 33.6976615,23.2829209 33.6976615,25.7608 Z M48.9385229,30.6 L48.8097229,29.0912 C48.4417211,29.6922697 48.0185253,30.1307986 47.5401229,30.4068 C47.0617205,30.6828014 46.4790597,30.8208 45.7921229,30.8208 C44.9457187,30.8208 44.2833253,30.5632026 43.8049229,30.048 C43.3265205,29.5327974 43.0873229,28.8029381 43.0873229,27.8584 L43.0873229,20.9032 L44.7801229,20.9032 L44.7801229,27.6744 C44.7801229,28.3368033 44.8966551,28.8059986 45.1297229,29.082 C45.3627908,29.3580014 45.7430536,29.496 46.2705229,29.496 C47.215061,29.496 48.0246529,28.9378722 48.6993229,27.8216 L48.6993229,20.9032 L50.3921229,20.9032 L50.3921229,30.6 L48.9385229,30.6 Z M58.1625844,20.9584 C58.6900537,21.1424009 59.192982,21.4183982 59.6713844,21.7864 L58.9353844,22.9088 C58.5060489,22.6021318 58.0920531,22.3782674 57.6933844,22.2372 C57.2947157,22.0961326 56.8745866,22.0256 56.4329844,22.0256 C55.8809816,22.0256 55.4455193,22.1390655 55.1265844,22.366 C54.8076495,22.5929345 54.6481844,22.9026647 54.6481844,23.2952 C54.6481844,23.6877353 54.7984496,23.9943989 55.0989844,24.2152 C55.3995192,24.4360011 55.9423138,24.6506656 56.7273844,24.8592 C57.8068565,25.129068 58.6133817,25.4970643 59.1469844,25.9632 C59.6805871,26.4293357 59.9473844,27.067196 59.9473844,27.8768 C59.9473844,28.8336048 59.5763215,29.5634642 58.8341844,30.0664 C58.0920474,30.5693358 57.1873897,30.8208 56.1201844,30.8208 C54.648177,30.8208 53.4276559,30.3976042 52.4585844,29.5512 L53.3969844,28.484 C54.1575215,29.1341366 55.0529793,29.4592 56.0833844,29.4592 C56.7089875,29.4592 57.2119158,29.3304013 57.5921844,29.0728 C57.972453,28.8151987 58.1625844,28.4717355 58.1625844,28.0424 C58.1625844,27.6989316 58.0951184,27.4198677 57.9601844,27.2052 C57.8252504,26.9905323 57.5952527,26.8065341 57.2701844,26.6532 C56.9451161,26.4998659 56.457521,26.3373342 55.8073844,26.1656 C54.7769793,25.895732 54.0317867,25.5308023 53.5717844,25.0708 C53.1117821,24.6107977 52.8817844,24.0312035 52.8817844,23.332 C52.8817844,22.8290642 53.0320496,22.375202 53.3325844,21.9704 C53.6331192,21.565598 54.0501817,21.2497345 54.5837844,21.0228 C55.1173871,20.7958655 55.7153811,20.6824 56.3777844,20.6824 C57.0401877,20.6824 57.6351151,20.7743991 58.1625844,20.9584 Z M69.4842459,26.3312 L63.3018459,26.3312 C63.3754462,27.3984053 63.6453102,28.1834642 64.1114459,28.6864 C64.5775815,29.1893358 65.1786422,29.4408 65.9146459,29.4408 C66.3807815,29.4408 66.8101106,29.373334 67.2026459,29.2384 C67.5951812,29.103466 68.0061104,28.8888015 68.4354459,28.5944 L69.1714459,29.6064 C68.1410407,30.416004 67.0125187,30.8208 65.7858459,30.8208 C64.4365058,30.8208 63.3846497,30.3792044 62.6302459,29.496 C61.8758421,28.6127956 61.4986459,27.3984077 61.4986459,25.8528 C61.4986459,24.8469283 61.6611776,23.9545372 61.9862459,23.1756 C62.3113142,22.3966628 62.7774428,21.7864022 63.3846459,21.3448 C63.9918489,20.9031978 64.7063751,20.6824 65.5282459,20.6824 C66.8162523,20.6824 67.8037091,21.1055958 68.4906459,21.952 C69.1775826,22.7984042 69.5210459,23.9698592 69.5210459,25.4664 C69.5210459,25.7485347 69.5087793,26.0367985 69.4842459,26.3312 Z M67.8466459,24.9696 C67.8466459,24.0127952 67.6565144,23.2829358 67.2762459,22.78 C66.8959773,22.2770642 66.325583,22.0256 65.5650459,22.0256 C64.1789056,22.0256 63.4245132,23.0437232 63.3018459,25.08 L67.8466459,25.08 L67.8466459,24.9696 Z M78.2851073,30.6 L75.3595073,24.988 L72.3971073,30.6 L70.5203073,30.6 L74.3291073,23.8472 L70.8515073,17.9224 L72.8387073,17.9224 L75.3963073,22.688 L77.9723073,17.9224 L79.8491073,17.9224 L76.4083073,23.7552 L80.2723073,30.6 L78.2851073,30.6 Z"
          }
        },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:fe47aba0f970": {
        d: {
          "0": {
            value: "M28.5952,50.4828 C29.0736024,51.0164027 29.3128,51.7370621 29.3128,52.6448 L29.3128,59.6 L27.62,59.6 L27.62,52.884 C27.62,51.6327937 27.1661379,51.0072 26.2584,51.0072 C25.7799976,51.0072 25.3752017,51.1451986 25.044,51.4212 C24.7127983,51.6972014 24.3570686,52.1295971 23.9768,52.7184 L23.9768,59.6 L22.284,59.6 L22.284,52.884 C22.284,51.6327937 21.8301379,51.0072 20.9224,51.0072 C20.4317309,51.0072 20.0208017,51.1482653 19.6896,51.4304 C19.3583983,51.7125347 19.0088018,52.1418638 18.6408,52.7184 L18.6408,59.6 L16.948,59.6 L16.948,49.9032 L18.4016,49.9032 L18.5488,51.32 C19.272537,50.2282612 20.2047943,49.6824 21.3456,49.6824 C21.9466697,49.6824 22.4587979,49.8357318 22.882,50.1424 C23.3052021,50.4490682 23.6087991,50.8783972 23.7928,51.4304 C24.1730686,50.8661305 24.5931977,50.4337348 25.0532,50.1332 C25.5132023,49.8326652 26.0559969,49.6824 26.6816,49.6824 C27.4789373,49.6824 28.1167976,49.9491973 28.5952,50.4828 Z M39.3924615,51.044 C40.1468652,51.9517379 40.5240615,53.1845255 40.5240615,54.7424 C40.5240615,55.7482717 40.3523299,56.6345295 40.0088615,57.4012 C39.6653931,58.1678705 39.1685981,58.7627979 38.5184615,59.186 C37.8683249,59.6092021 37.0955326,59.8208 36.2000615,59.8208 C34.8384547,59.8208 33.7773986,59.3669379 33.0168615,58.4592 C32.2563243,57.5514621 31.8760615,56.3186745 31.8760615,54.7608 C31.8760615,53.7549283 32.0477931,52.8686705 32.3912615,52.102 C32.7347299,51.3353295 33.2315249,50.7404021 33.8816615,50.3172 C34.5317981,49.8939979 35.3107236,49.6824 36.2184615,49.6824 C37.5800683,49.6824 38.6380577,50.1362621 39.3924615,51.044 Z M33.6976615,54.7608 C33.6976615,57.2264123 34.5317865,58.4592 36.2000615,58.4592 C37.8683365,58.4592 38.7024615,57.2202791 38.7024615,54.7424 C38.7024615,52.2767877 37.8744697,51.044 36.2184615,51.044 C34.5379197,51.044 33.6976615,52.2829209 33.6976615,54.7608 Z M48.9385229,59.6 L48.8097229,58.0912 C48.4417211,58.6922697 48.0185253,59.1307986 47.5401229,59.4068 C47.0617205,59.6828014 46.4790597,59.8208 45.7921229,59.8208 C44.9457187,59.8208 44.2833253,59.5632026 43.8049229,59.048 C43.3265205,58.5327974 43.0873229,57.8029381 43.0873229,56.8584 L43.0873229,49.9032 L44.7801229,49.9032 L44.7801229,56.6744 C44.7801229,57.3368033 44.8966551,57.8059986 45.1297229,58.082 C45.3627908,58.3580014 45.7430536,58.496 46.2705229,58.496 C47.215061,58.496 48.0246529,57.9378722 48.6993229,56.8216 L48.6993229,49.9032 L50.3921229,49.9032 L50.3921229,59.6 L48.9385229,59.6 Z M58.1625844,49.9584 C58.6900537,50.1424009 59.192982,50.4183982 59.6713844,50.7864 L58.9353844,51.9088 C58.5060489,51.6021318 58.0920531,51.3782674 57.6933844,51.2372 C57.2947157,51.0961326 56.8745866,51.0256 56.4329844,51.0256 C55.8809816,51.0256 55.4455193,51.1390655 55.1265844,51.366 C54.8076495,51.5929345 54.6481844,51.9026647 54.6481844,52.2952 C54.6481844,52.6877353 54.7984496,52.9943989 55.0989844,53.2152 C55.3995192,53.4360011 55.9423138,53.6506656 56.7273844,53.8592 C57.8068565,54.129068 58.6133817,54.4970643 59.1469844,54.9632 C59.6805871,55.4293357 59.9473844,56.067196 59.9473844,56.8768 C59.9473844,57.8336048 59.5763215,58.5634642 58.8341844,59.0664 C58.0920474,59.5693358 57.1873897,59.8208 56.1201844,59.8208 C54.648177,59.8208 53.4276559,59.3976042 52.4585844,58.5512 L53.3969844,57.484 C54.1575215,58.1341366 55.0529793,58.4592 56.0833844,58.4592 C56.7089875,58.4592 57.2119158,58.3304013 57.5921844,58.0728 C57.972453,57.8151987 58.1625844,57.4717355 58.1625844,57.0424 C58.1625844,56.6989316 58.0951184,56.4198677 57.9601844,56.2052 C57.8252504,55.9905323 57.5952527,55.8065341 57.2701844,55.6532 C56.9451161,55.4998659 56.457521,55.3373342 55.8073844,55.1656 C54.7769793,54.895732 54.0317867,54.5308023 53.5717844,54.0708 C53.1117821,53.6107977 52.8817844,53.0312035 52.8817844,52.332 C52.8817844,51.8290642 53.0320496,51.375202 53.3325844,50.9704 C53.6331192,50.565598 54.0501817,50.2497345 54.5837844,50.0228 C55.1173871,49.7958655 55.7153811,49.6824 56.3777844,49.6824 C57.0401877,49.6824 57.6351151,49.7743991 58.1625844,49.9584 Z M69.4842459,55.3312 L63.3018459,55.3312 C63.3754462,56.3984053 63.6453102,57.1834642 64.1114459,57.6864 C64.5775815,58.1893358 65.1786422,58.4408 65.9146459,58.4408 C66.3807815,58.4408 66.8101106,58.373334 67.2026459,58.2384 C67.5951812,58.103466 68.0061104,57.8888015 68.4354459,57.5944 L69.1714459,58.6064 C68.1410407,59.416004 67.0125187,59.8208 65.7858459,59.8208 C64.4365058,59.8208 63.3846497,59.3792044 62.6302459,58.496 C61.8758421,57.6127956 61.4986459,56.3984077 61.4986459,54.8528 C61.4986459,53.8469283 61.6611776,52.9545372 61.9862459,52.1756 C62.3113142,51.3966628 62.7774428,50.7864022 63.3846459,50.3448 C63.9918489,49.9031978 64.7063751,49.6824 65.5282459,49.6824 C66.8162523,49.6824 67.8037091,50.1055958 68.4906459,50.952 C69.1775826,51.7984042 69.5210459,52.9698592 69.5210459,54.4664 C69.5210459,54.7485347 69.5087793,55.0367985 69.4842459,55.3312 Z M67.8466459,53.9696 C67.8466459,53.0127952 67.6565144,52.2829358 67.2762459,51.78 C66.8959773,51.2770642 66.325583,51.0256 65.5650459,51.0256 C64.1789056,51.0256 63.4245132,52.0437232 63.3018459,54.08 L67.8466459,54.08 L67.8466459,53.9696 Z M76.3715073,59.6 L74.6051073,59.6 L74.6051073,54.7424 L70.5203073,46.9224 L72.4523073,46.9224 L75.5435073,53.1968 L78.6347073,46.9224 L80.4563073,46.9224 L76.3715073,54.724 L76.3715073,59.6 Z"
          }
        },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:070e94ec69ed": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -249 } },
        "translation.y": { "0": { value: -131 } }
      },
      "haiku:2c2e0533f7c9": {
        fill: { "0": { value: "#343F41" } },
        x: { "0": { value: "249" } },
        y: { "0": { value: "131" } },
        "sizeAbsolute.x": { "0": { value: 473 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 213 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:4fe6cac1e71d": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 159 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:c40d90bcd9ea": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -267 } },
        "translation.y": { "0": { value: -282 } }
      },
      "haiku:2a015f60f839": {
        "translation.x": { "0": { value: 260 } },
        "translation.y": { "0": { value: 282 } }
      },
      "haiku:dc299e1c1a84": { "translation.x": { "0": { value: 7 } } },
      "haiku:f93e2a360145": { fill: { "0": { value: "white" } } },
      "haiku:cb1f494889a2": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:790b4ebb8e22": {
        d: {
          "0": {
            value: "M8.5,41.9803175 C8.5,46.3981465 8.5,50.5670615 8.5,54.4870626 C8.5,56.5044431 9.24619297,57.3692324 14.1025739,56.854401 C42.0181764,52.7148996 63.4732135,46.4842179 78.4676852,38.1623558 C102.441463,24.8570206 118.768933,8.24522594 158.975399,8.24522594 C159.019801,8.28447003 158.991812,16.2559753 158.985415,32.1597525 C158.984661,34.0346618 158.16382,41.9803175 151.939846,41.9803175 C106.913547,41.9803175 59.1002649,41.9803175 8.5,41.9803175 Z"
          }
        },
        fill: { "0": { value: "#FF6EA8" } },
        opacity: { "0": { value: "0.219372736" } }
      },
      "haiku:7e38248f09c6": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -447 } },
        "translation.y": { "0": { value: -145 } }
      },
      "haiku:580045054505": {
        fill: { "0": { value: "#FFFFFF" } },
        "translation.x": { "0": { value: 210 } },
        "translation.y": { "0": { value: 126 } }
      },
      "haiku:621a404515e0": {
        "translation.x": { "0": { value: 160.5 } },
        "translation.y": { "0": { value: 8.2 } }
      },
      "haiku:766fc8e50395": { "translation.x": { "0": { value: 9 } } },
      "haiku:5d5b5e599b07": {
        d: {
          "0": {
            value: "M73.9,11.12 C74.4733362,11.320001 75.0199974,11.619998 75.54,12.02 L74.74,13.24 C74.273331,12.906665 73.8233355,12.6633341 73.39,12.51 C72.9566645,12.3566659 72.5000024,12.28 72.02,12.28 C71.419997,12.28 70.9466684,12.4033321 70.6,12.65 C70.2533316,12.8966679 70.08,13.2333312 70.08,13.66 C70.08,14.0866688 70.2433317,14.4199988 70.57,14.66 C70.8966683,14.9000012 71.4866624,15.1333322 72.34,15.36 C73.5133392,15.6533348 74.3899971,16.0533308 74.97,16.56 C75.5500029,17.0666692 75.84,17.7599956 75.84,18.64 C75.84,19.6800052 75.4366707,20.4733306 74.63,21.02 C73.8233293,21.5666694 72.8400058,21.84 71.68,21.84 C70.079992,21.84 68.7533386,21.3800046 67.7,20.46 L68.72,19.3 C69.5466708,20.0066702 70.5199944,20.36 71.64,20.36 C72.3200034,20.36 72.8666646,20.2200014 73.28,19.94 C73.6933354,19.6599986 73.9,19.286669 73.9,18.82 C73.9,18.4466648 73.8266674,18.1433345 73.68,17.91 C73.5333326,17.6766655 73.2833351,17.4766675 72.93,17.31 C72.5766649,17.1433325 72.0466702,16.9666676 71.34,16.78 C70.2199944,16.4866652 69.4100025,16.0900025 68.91,15.59 C68.4099975,15.0899975 68.16,14.4600038 68.16,13.7 C68.16,13.1533306 68.3233317,12.6600022 68.65,12.22 C68.9766683,11.7799978 69.4299971,11.4366679 70.01,11.19 C70.5900029,10.9433321 71.2399964,10.82 71.96,10.82 C72.6800036,10.82 73.3266638,10.919999 73.9,11.12 Z"
          }
        }
      },
      "haiku:2bac2b4cde05": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -435 } },
        "translation.y": { "0": { value: -354 } }
      },
      "haiku:055d74a621a5": {
        fill: { "0": { value: "#FFFFFF" } },
        "translation.x": { "0": { value: 435 } },
        "translation.y": { "0": { value: 354 } }
      },
      "haiku:cdddf3bc1c78": {
        d: {
          "0": {
            value: "M23.0279999,6.96320011 L23.0279999,10 L22.04,10 L22.04,2.83440026 L23.9223999,2.83440026 C24.8168043,2.83440026 25.4945309,3.00426522 25.9555998,3.34400024 C26.4166688,3.68373526 26.6471998,4.18986352 26.6471998,4.86240019 C26.6471998,5.36160267 26.5189344,5.7671986 26.2623998,6.07920014 C26.0058652,6.39120169 25.6176024,6.62693266 25.0975998,6.78640012 L27.0319998,10 L25.8567998,10 L24.1407999,6.96320011 L23.0279999,6.96320011 Z M25.2015998,5.88680015 C25.4650678,5.67533243 25.5967998,5.3338692 25.5967998,4.86240019 C25.5967998,4.41866465 25.4633345,4.0980012 25.1963998,3.90040022 C24.9294652,3.70279924 24.5013362,3.60400023 23.9119999,3.60400023 L23.0279999,3.60400023 L23.0279999,6.20400014 L24.0263999,6.20400014 C24.5464025,6.20400014 24.9381319,6.09826787 25.2015998,5.88680015 Z M29.2399997,3.62480023 L29.2399997,5.96480015 L31.6527996,5.96480015 L31.6527996,6.75520012 L29.2399997,6.75520012 L29.2399997,9.20960003 L32.2143995,9.20960003 L32.2143995,10 L28.2519997,10 L28.2519997,2.83440026 L32.1311995,2.83440026 L32.0167996,3.62480023 L29.2399997,3.62480023 Z M37.6775993,3.39080024 C38.162935,3.76173542 38.4055993,4.3146632 38.4055993,5.04960018 C38.4055993,5.83307074 38.1525351,6.41546489 37.6463993,6.79680012 C37.1402635,7.17813534 36.4677369,7.3688001 35.6287994,7.3688001 L34.7239994,7.3688001 L34.7239994,10 L33.7359994,10 L33.7359994,2.83440026 L35.6183994,2.83440026 C36.5058704,2.83440026 37.1922636,3.01986507 37.6775993,3.39080024 Z M36.9027993,6.25600014 C37.2044008,6.03413237 37.3551993,5.6354697 37.3551993,5.06000018 C37.3551993,4.54693097 37.2044008,4.17600136 36.9027993,3.94720022 C36.6011978,3.71839909 36.1696022,3.60400023 35.6079994,3.60400023 L34.7239994,3.60400023 L34.7239994,6.58880013 L35.5871994,6.58880013 C36.1626689,6.58880013 36.6011978,6.47786791 36.9027993,6.25600014 Z M43.629599,9.13680003 L43.515199,10 L39.6983992,10 L39.6983992,2.83440026 L40.6863991,2.83440026 L40.6863991,9.13680003 L43.629599,9.13680003 Z M45.3591989,8.20080007 L44.818399,10 L43.819999,10 L46.1183989,2.83440026 L47.3663989,2.83440026 L49.6543988,10 L48.6143988,10 L48.0735988,8.20080007 L45.3591989,8.20080007 Z M46.7215989,3.65600023 L45.5983989,7.4000001 L47.8343988,7.4000001 L46.7215989,3.65600023 Z M52.2679986,10 L51.2695987,10 L51.2695987,7.2544001 L48.9607988,2.83440026 L50.0527987,2.83440026 L51.7999987,6.38080013 L53.5471986,2.83440026 L54.5767986,2.83440026 L52.2679986,7.2440001 L52.2679986,10 Z M59.2527983,6.64080012 L59.2527983,10 L58.2647983,10 L58.2647983,2.83440026 L59.2527983,2.83440026 L59.2527983,5.82960015 L62.2687982,5.82960015 L62.2687982,2.83440026 L63.2567981,2.83440026 L63.2567981,10 L62.2687982,10 L62.2687982,6.64080012 L59.2527983,6.64080012 Z M65.818398,8.20080007 L65.277598,10 L64.2791981,10 L66.577598,2.83440026 L67.8255979,2.83440026 L70.1135979,10 L69.0735979,10 L68.5327979,8.20080007 L65.818398,8.20080007 Z M67.180798,3.65600023 L66.057598,7.4000001 L68.2935979,7.4000001 L67.180798,3.65600023 Z M71.1359978,10 L71.1359978,2.83440026 L72.1343977,2.83440026 L72.1343977,10 L71.1359978,10 Z M74.1343976,10 L74.1343976,2.83440026 L75.1223976,2.83440026 L75.1223976,10 L74.1343976,10 Z M79.2199974,10 L78.0031975,10 L75.1743976,6.17280014 L77.8991975,2.83440026 L79.0223974,2.83440026 L76.3079975,6.11040014 L79.2199974,10 Z M84.7923972,8.96520004 C84.5947962,9.32920184 84.3070658,9.61346566 83.9291972,9.81800001 C83.5513287,10.0225344 83.0989332,10.1248 82.5719973,10.1248 C81.77466,10.1248 81.1593328,9.90466887 80.7259973,9.46440002 C80.2926619,9.02413117 80.0759974,8.43653707 80.0759974,7.70160008 L80.0759974,2.83440026 L81.0639973,2.83440026 L81.0639973,7.62880009 C81.0639973,8.18346951 81.1887961,8.59946533 81.4383973,8.87680004 C81.6879985,9.15413475 82.0658614,9.29280003 82.5719973,9.29280003 C83.0850665,9.29280003 83.466396,9.15586807 83.7159972,8.88200004 C83.9655985,8.60813202 84.0903972,8.19040287 84.0903972,7.62880009 L84.0903972,2.83440026 L85.0887972,2.83440026 L85.0887972,7.70160008 C85.0887972,8.18000246 84.9899982,8.60119823 84.7923972,8.96520004 Z"
          }
        }
      },
      "haiku:61358a3cf7f8": {
        d: {
          "0": {
            value: "M13.1311168,1.90411765 C11.927442,0.676764706 10.3262921,0 8.62389851,0 C6.92150491,0 5.32035498,0.676 4.11668021,1.90411765 C2.91300544,3.13223529 2.24929692,4.76411765 2.24929692,6.5 L2.24929692,7.48876471 L0.639897506,5.84770588 C0.493656646,5.69858824 0.255921505,5.69858824 0.109680645,5.84770588 C-0.036560215,5.99682353 -0.036560215,6.23923529 0.109680645,6.38835294 L2.35954003,8.68247059 C2.43303544,8.75741176 2.52902944,8.79411765 2.62502344,8.79411765 C2.72101744,8.79411765 2.81701144,8.75664706 2.89050684,8.68247059 L5.14036623,6.38835294 C5.28660709,6.23923529 5.28660709,5.99682353 5.14036623,5.84770588 C4.99412537,5.69858824 4.75639023,5.69858824 4.61014937,5.84770588 L3.00074995,7.48876471 L3.00074995,6.5 C3.00074995,3.33717647 5.52359228,0.764705882 8.62539841,0.764705882 C11.7272045,0.764705882 14.2500469,3.33717647 14.2500469,6.5 C14.2500469,9.66282353 11.7272045,12.2352941 8.62539841,12.2352941 C8.41841135,12.2352941 8.25042185,12.4065882 8.25042185,12.6176471 C8.25042185,12.8287059 8.41841135,13 8.62539841,13 C10.327792,13 11.9289419,12.324 13.1326167,11.0958824 C14.3362915,9.86776471 15,8.23588235 15,6.5 C15,4.76411765 14.3370414,3.13147059 13.1326167,1.90411765 L13.1311168,1.90411765 Z"
          }
        },
        "fill-rule": { "0": { value: "nonzero" } }
      },
      "haiku:dd656ce1ecee": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "43.7" } },
        rx: { "0": { value: "5" } },
        "sizeAbsolute.x": { "0": { value: 343 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 59.8 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:4fde5a24c37d": {
        x: { "0": { value: "-2.3%" } },
        y: { "0": { value: "-13.4%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 1.047 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 1.268 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:2f712da3ea0d": {
        stdDeviation: { "0": { value: "8" } },
        in: { "0": { value: "SourceAlpha" } },
        result: { "0": { value: "shadowBlurInner1" } }
      },
      "haiku:040189d85a81": {
        dx: { "0": { value: "0" } },
        dy: { "0": { value: "0" } },
        in: { "0": { value: "shadowBlurInner1" } },
        result: { "0": { value: "shadowOffsetInner1" } }
      },
      "haiku:ebd43d1ad07a": {
        in: { "0": { value: "shadowOffsetInner1" } },
        in2: { "0": { value: "SourceAlpha" } },
        operator: { "0": { value: "arithmetic" } },
        k2: { "0": { value: "-1" } },
        k3: { "0": { value: "1" } },
        result: { "0": { value: "shadowInnerInner1" } }
      },
      "haiku:f771a5eb1a83": {
        values: {
          "0": {
            value: "0 0 0 0 0.0627391582   0 0 0 0 0.00143950523   0 0 0 0 0.0227611236  0 0 0 0.297271286 0"
          }
        },
        in: { "0": { value: "shadowInnerInner1" } }
      },
      "haiku:0abbc409ed61": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -210 } },
        "translation.y": { "0": { value: -169 } }
      },
      "haiku:9ad531cd9090": {
        "translation.x": { "0": { value: 210 } },
        "translation.y": { "0": { value: 126 } }
      },
      "haiku:22108cce02b2": {
        fill: { "0": { value: "#343F42" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:5111a9335672": {
        "fill-opacity": { "0": { value: "0.112941576" } },
        fill: { "0": { value: "#C42863" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:c9f1d4914a01": {
        fill: { "0": { value: "black" } },
        "fill-opacity": { "0": { value: "1" } },
        filter: { "0": { value: "url(#filter-2-c225e4)" } }
      },
      "haiku:7755ae3e9bb2": {
        stroke: { "0": { value: "#DF5887" } },
        "stroke-width": { "0": { value: "2.53" } },
        x: { "0": { value: "1.265" } },
        y: { "0": { value: "44.965" } },
        rx: { "0": { value: "5" } },
        "sizeAbsolute.x": { "0": { value: 340.47 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 57.27 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:643cc099340e": {
        x1: { "0": { value: "50%" } },
        y1: { "0": { value: "0%" } },
        x2: { "0": { value: "50%" } },
        y2: { "0": { value: "100%" } }
      },
      "haiku:491c2b6833d6": {
        "stop-color": { "0": { value: "#FFDC64" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:accb836bc8e5": {
        "stop-color": { "0": { value: "#D62663" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:1f639105d992": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -288 } },
        "translation.y": { "0": { value: -183 } }
      },
      "haiku:f28829ef338d": {
        fill: { "0": { value: "url(#linearGradient-1-c13d66)" } },
        x: { "0": { value: "288" } },
        y: { "0": { value: "183" } },
        rx: { "0": { value: "29" } },
        "sizeAbsolute.x": { "0": { value: 129 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 130 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:8841b54abe50": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -354 } },
        "translation.y": { "0": { value: -209 } }
      },
      "haiku:d5e0390dca15": {
        "translation.x": { "0": { value: 210 } },
        "translation.y": { "0": { value: 126 } }
      },
      "haiku:2939aa4006ff": {
        "translation.x": { "0": { value: 160.5 } },
        "translation.y": { "0": { value: 8.2 } }
      },
      "haiku:756ab14333c2": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "stroke-linecap": { "0": { value: "square" } },
        "translation.x": { "0": { value: -412 } },
        "translation.y": { "0": { value: -182 } }
      },
      "haiku:36ea2ce78089": {
        stroke: { "0": { value: "#5DE2F9" } },
        "stroke-width": { "0": { value: "2.7" } },
        "translation.x": { "0": { value: 210 } },
        "translation.y": { "0": { value: 126 } }
      },
      "haiku:ac9f161a0f10": {
        d: { "0": { value: "M203.89,57.35 L203.89,89.55" } }
      },
      "haiku:948a2fa02107": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -435 } },
        "translation.y": { "0": { value: -145 } }
      },
      "haiku:a32a2742f251": {
        fill: { "0": { value: "#FFFFFF" } },
        "translation.x": { "0": { value: 210 } },
        "translation.y": { "0": { value: 126 } }
      },
      "haiku:1474c4f02f14": {
        "translation.x": { "0": { value: 160.5 } },
        "translation.y": { "0": { value: 8.2 } }
      },
      "haiku:8743ec0b2869": { "translation.x": { "0": { value: 9 } } },
      "haiku:b58cc1bc128d": {
        d: {
          "0": {
            value: "M62.36,21.6 L62.22,19.96 C61.819998,20.6133366 61.3600026,21.0899985 60.84,21.39 C60.3199974,21.6900015 59.6866704,21.84 58.94,21.84 C58.0199954,21.84 57.3000026,21.5600028 56.78,21 C56.2599974,20.4399972 56,19.6466718 56,18.62 L56,11.06 L57.84,11.06 L57.84,18.42 C57.84,19.1400036 57.9666654,19.6499985 58.22,19.95 C58.4733346,20.2500015 58.8866638,20.4 59.46,20.4 C60.4866718,20.4 61.366663,19.7933394 62.1,18.58 L62.1,11.06 L63.94,11.06 L63.94,21.6 L62.36,21.6 Z"
          }
        }
      },
      "haiku:2e6a7043a116": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -429 } },
        "translation.y": { "0": { value: -131 } }
      },
      "haiku:55c75fb8954a": {
        fill: { "0": { value: "#343F41" } },
        "translation.x": { "0": { value: 429 } },
        "translation.y": { "0": { value: 131 } }
      },
      "haiku:cad890358caf": {
        d: {
          "0": {
            value: "M0,0 L293,0 L293,213 L0,213 L0,0 Z M1.2981636,143.48082 C1.2981636,144.200593 1.94595953,144.848389 2.66573279,144.848389 L7.41623631,144.848389 C8.2079869,144.848389 8.78380551,144.200593 8.78380551,143.48082 L8.78380551,122.679373 L35.1275068,122.679373 L35.1275068,143.48082 C35.1275068,144.200593 35.7033254,144.848389 36.495076,144.848389 L41.2455795,144.848389 C41.9653528,144.848389 42.6131487,144.200593 42.6131487,143.48082 L42.6131487,95.8318303 C42.6131487,95.1120571 41.9653528,94.4642611 41.2455795,94.4642611 L36.495076,94.4642611 C35.7033254,94.4642611 35.1275068,95.1120571 35.1275068,95.8318303 L35.1275068,115.913504 L8.78380551,115.913504 L8.78380551,95.8318303 C8.78380551,95.1120571 8.2079869,94.4642611 7.41623631,94.4642611 L2.66573279,94.4642611 C1.94595953,94.4642611 1.2981636,95.1120571 1.2981636,95.8318303 L1.2981636,143.48082 Z M50.9034692,144.848389 L55.4380408,144.848389 C56.3017687,144.848389 56.8775873,144.272571 57.0935193,143.768729 C58.5330658,140.457772 60.0445897,137.218793 61.4841362,133.907836 L85.0207218,133.907836 L89.483316,143.768729 C89.7712253,144.416525 90.2750666,144.848389 91.1387945,144.848389 L95.673366,144.848389 C96.7530259,144.848389 97.3288445,143.912684 96.8969806,142.976979 L74.9438961,94.5362385 C74.7279642,94.1043745 74.0801682,93.7444879 73.7202816,93.7444879 L73.0005083,93.7444879 C72.6406217,93.7444879 71.9928258,94.1043745 71.7768938,94.5362385 L49.6798547,142.976979 C49.2479907,143.912684 49.8238094,144.848389 50.9034692,144.848389 Z M103.963687,143.48082 C103.963687,144.200593 104.611482,144.848389 105.331256,144.848389 L110.081759,144.848389 C110.801533,144.848389 111.449328,144.200593 111.449328,143.48082 L111.449328,95.8318303 C111.449328,95.1120571 110.801533,94.4642611 110.081759,94.4642611 L105.331256,94.4642611 C104.611482,94.4642611 103.963687,95.1120571 103.963687,95.8318303 L103.963687,143.48082 Z M125.281903,143.120934 C125.281903,144.056639 126.001676,144.848389 127.009359,144.848389 L131.184044,144.848389 C132.119749,144.848389 132.9115,144.056639 132.9115,143.120934 L132.9115,120.735985 L153.856901,144.344548 C154.000856,144.56048 154.43272,144.848389 155.152493,144.848389 L160.910679,144.848389 C162.422203,144.848389 162.78209,143.192911 162.206271,142.473138 L140.18121,118.216779 L160.982657,97.0554449 C161.990339,95.975785 161.270566,94.4642611 159.974974,94.4642611 L154.576675,94.4642611 C154.000856,94.4642611 153.497015,94.8241478 153.209106,95.1840344 L132.9115,116.129436 L132.9115,96.191717 C132.9115,95.2560117 132.119749,94.4642611 131.184044,94.4642611 L127.009359,94.4642611 C126.001676,94.4642611 125.281903,95.2560117 125.281903,96.191717 L125.281903,143.120934 Z M169.488909,126.062307 C169.488909,137.002861 177.694324,145.568163 188.994765,145.568163 C200.367182,145.568163 208.644575,137.002861 208.644575,126.062307 L208.644575,95.8318303 C208.644575,95.1120571 207.996779,94.4642611 207.277005,94.4642611 L202.454525,94.4642611 C201.662774,94.4642611 201.086955,95.1120571 201.086955,95.8318303 L201.086955,125.702421 C201.086955,132.828176 196.408429,138.37043 188.994765,138.37043 C181.653077,138.37043 177.046528,132.756199 177.046528,125.558466 L177.046528,95.8318303 C177.046528,95.1120571 176.47071,94.4642611 175.678959,94.4642611 L170.856478,94.4642611 C170.136705,94.4642611 169.488909,95.1120571 169.488909,95.8318303 L169.488909,126.062307 Z"
          }
        }
      },
      "haiku:69bd00db7c13": {
        points: {
          "0": {
            value: "64.2999878 127.721787 82.2899876 127.721787 73.4389077 108 73.0791077 108"
          }
        }
      },
      "haiku:e29dff0512bc": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -429 } },
        "translation.y": { "0": { value: -165 } }
      },
      "haiku:47a972806dc9": {
        d: {
          "0": {
            value: "M429.802676,165.434968 C440.068106,162.719033 455.536607,174.950078 488.444106,187.812064 C532.607349,205.073388 520.467522,202.80558 596.649053,211.795419 C647.436741,217.788644 669.22039,241.190171 662,282 L429.524967,282 L429.802676,175.538277 C429.504638,168.88159 429.504638,165.51382 429.802676,165.434968 Z"
          }
        },
        fill: { "0": { value: "#DEE4E4" } }
      },
      "haiku:f0a02db882c4": {
        x: { "0": { value: "7" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "10" } },
        "sizeAbsolute.x": { "0": { value: 159 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 42 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:529edd1f364f": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -260 } },
        "translation.y": { "0": { value: -282 } }
      },
      "haiku:f5f679e6b223": {
        "translation.x": { "0": { value: 260 } },
        "translation.y": { "0": { value: 282 } }
      },
      "haiku:4b6ce565d5e6": { fill: { "0": { value: "white" } } },
      "haiku:97e89ff50cce": {
        "fill-opacity": { "0": { value: "0.0684159873" } },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:13716833aefa": {
        d: {
          "0": {
            value: "M15.5,41.9803175 C15.5,46.3981465 15.5,50.5670615 15.5,54.4870626 C15.5,56.5044431 16.246193,57.3692324 21.1025739,56.854401 C49.0181764,52.7148996 70.4732135,46.4842179 85.4676852,38.1623558 C109.441463,24.8570206 125.768933,8.24522594 165.975399,8.24522594 C166.019801,8.28447003 165.991812,16.2559753 165.985415,32.1597525 C165.984661,34.0346618 165.16382,41.9803175 158.939846,41.9803175 C113.913547,41.9803175 66.1002649,41.9803175 15.5,41.9803175 Z"
          }
        },
        fill: { "0": { value: "#C0CCCD" } },
        opacity: { "0": { value: "0.219372736" } }
      },
      "haiku:c6a9d1667ac1": {
        d: {
          "0": {
            value: "M15.7453553,21.1271913 C15.7679742,21.2464573 15.7789866,21.3708727 15.7782321,21.5 C15.7789866,21.6291272 15.7679742,21.7535427 15.7453553,21.8728087 C15.6301163,22.5673534 15.2109482,23.3716754 14.4671799,24.2294085 L10.0670993,29.3036967 C8.92506742,30.6207178 7.07762881,30.6255162 5.93143609,29.3036967 L1.53135544,24.2294085 C0.779621448,23.3624891 0.359852872,22.5497144 0.250648702,21.849693 C0.230814212,21.7374869 0.221140676,21.6208026 0.221759532,21.5 C0.221140676,21.3791974 0.230814212,21.2625131 0.250648702,21.150307 C0.359852872,20.4502856 0.779621448,19.6375109 1.53135544,18.7705915 L5.93143609,13.6963033 C7.07762881,12.3744838 8.92506742,12.3792822 10.0670993,13.6963033 L14.4671799,18.7705915 C15.2109482,19.6283246 15.6301163,20.4326466 15.7453553,21.1271913 Z"
          }
        },
        fill: { "0": { value: "#C2CCCD" } }
      },
      "haiku:ad1d83ee5faf": {
        d: {
          "0": {
            value: "M172.745355,21.1271913 C172.767974,21.2464573 172.778987,21.3708727 172.778232,21.5 C172.778987,21.6291272 172.767974,21.7535427 172.745355,21.8728087 C172.630116,22.5673534 172.210948,23.3716754 171.46718,24.2294085 L167.067099,29.3036967 C165.925067,30.6207178 164.077629,30.6255162 162.931436,29.3036967 L158.531355,24.2294085 C157.779621,23.3624891 157.359853,22.5497144 157.250649,21.849693 C157.230814,21.7374869 157.221141,21.6208026 157.22176,21.5 C157.221141,21.3791974 157.230814,21.2625131 157.250649,21.150307 C157.359853,20.4502856 157.779621,19.6375109 158.531355,18.7705915 L162.931436,13.6963033 C164.077629,12.3744838 165.925067,12.3792822 167.067099,13.6963033 L171.46718,18.7705915 C172.210948,19.6283246 172.630116,20.4326466 172.745355,21.1271913 Z"
          }
        },
        fill: { "0": { value: "#C2CCCD" } }
      },
      "haiku:4b36924cc911": {
        x1: { "0": { value: "2.61028491%" } },
        y1: { "0": { value: "50%" } },
        x2: { "0": { value: "90.8908089%" } },
        y2: { "0": { value: "50%" } }
      },
      "haiku:5dcafc8be37e": {
        "stop-color": { "0": { value: "#343F41" } },
        "stop-opacity": { "0": { value: "0" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:8bb703974982": {
        "stop-color": { "0": { value: "#313F41" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:fb15487733f5": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:b1094e805098": {
        fill: { "0": { value: "url(#linearGradient-1-728a8d)" } },
        x: { "0": { value: "-3" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 99 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 600 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:12b071c7d53d": {
        x1: { "0": { value: "2.61028491%" } },
        y1: { "0": { value: "50%" } },
        x2: { "0": { value: "90.8908089%" } },
        y2: { "0": { value: "50%" } }
      },
      "haiku:77e6b4e3995f": {
        "stop-color": { "0": { value: "#343F41" } },
        "stop-opacity": { "0": { value: "0" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:ef307d619ab0": {
        "stop-color": { "0": { value: "#313F41" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:5cfd35136ed8": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:da0a606737e6": {
        fill: { "0": { value: "url(#linearGradient-1-9f73da)" } },
        x: { "0": { value: "-3" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 99 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 600 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:e20e996a1268": {
        x1: { "0": { value: "2.61028491%" } },
        y1: { "0": { value: "50%" } },
        x2: { "0": { value: "90.8908089%" } },
        y2: { "0": { value: "50%" } }
      },
      "haiku:fa99bd30b56e": {
        "stop-color": { "0": { value: "#343F41" } },
        "stop-opacity": { "0": { value: "0" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:6e17e7a9308c": {
        "stop-color": { "0": { value: "#313F41" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:8a1135b385a3": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:a4aa40bd140a": {
        fill: { "0": { value: "url(#linearGradient-1-e33cfe)" } },
        x: { "0": { value: "-3" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 99 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 600 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:0f8d23979ff8": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -404 } },
        "translation.y": { "0": { value: -145 } }
      },
      "haiku:912ec87a7bc2": {
        fill: { "0": { value: "#FFFFFF" } },
        "translation.x": { "0": { value: 210 } },
        "translation.y": { "0": { value: 126 } }
      },
      "haiku:0422273899f4": {
        "translation.x": { "0": { value: 160.5 } },
        "translation.y": { "0": { value: 8.2 } }
      },
      "haiku:87d4bd679a14": { "translation.x": { "0": { value: 9 } } },
      "haiku:d2b81f865fea": {
        d: {
          "0": {
            value: "M33.51,12.3 C34.3300041,13.2866716 34.74,14.6266582 34.74,16.32 C34.74,17.4133388 34.5533352,18.3766625 34.18,19.21 C33.8066648,20.0433375 33.2666702,20.6899977 32.56,21.15 C31.8533298,21.6100023 31.0133382,21.84 30.04,21.84 C28.5599926,21.84 27.4066708,21.3466716 26.58,20.36 C25.7533292,19.3733284 25.34,18.0333418 25.34,16.34 C25.34,15.2466612 25.5266648,14.2833375 25.9,13.45 C26.2733352,12.6166625 26.8133298,11.9700023 27.52,11.51 C28.2266702,11.0499977 29.0733284,10.82 30.06,10.82 C31.5400074,10.82 32.6899959,11.3133284 33.51,12.3 Z M27.32,16.34 C27.32,19.0200134 28.2266576,20.36 30.04,20.36 C31.8533424,20.36 32.76,19.0133468 32.76,16.32 C32.76,13.6399866 31.860009,12.3 30.06,12.3 C28.2333242,12.3 27.32,13.6466532 27.32,16.34 Z"
          }
        }
      },
      "haiku:50548fb0bfae": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -338 } },
        "translation.y": { "0": { value: -144 } }
      },
      "haiku:6128cc109342": {
        fill: { "0": { value: "#FFFFFF" } },
        cx: { "0": { value: "341" } },
        cy: { "0": { value: "147" } },
        r: { "0": { value: "3" } }
      },
      "haiku:2a31a0bf8d87": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -338 } },
        "translation.y": { "0": { value: -144 } }
      },
      "haiku:425da8f7ddd5": {
        fill: { "0": { value: "#FFFFFF" } },
        cx: { "0": { value: "341" } },
        cy: { "0": { value: "147" } },
        r: { "0": { value: "3" } }
      },
      "haiku:4ec38dd516d7": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -338 } },
        "translation.y": { "0": { value: -144 } }
      },
      "haiku:6f471720adfe": {
        fill: { "0": { value: "#FFFFFF" } },
        cx: { "0": { value: "341" } },
        cy: { "0": { value: "147" } },
        r: { "0": { value: "3" } }
      },
      "haiku:c1125d1fb147": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "4.6" } },
        "sizeAbsolute.x": { "0": { value: 157 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 102 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:8570971f7b3f": {
        x: { "0": { value: "-17.5%" } },
        y: { "0": { value: "-20.1%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 1.35 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 1.5390000000000001 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:620047d41aa0": {
        dx: { "0": { value: "0" } },
        dy: { "0": { value: "7" } },
        in: { "0": { value: "SourceAlpha" } },
        result: { "0": { value: "shadowOffsetOuter1" } }
      },
      "haiku:b8a26298245b": {
        stdDeviation: { "0": { value: "8" } },
        in: { "0": { value: "shadowOffsetOuter1" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:5f2974f5c120": {
        values: {
          "0": {
            value: "0 0 0 0 0.0431372549   0 0 0 0 0.0509803922   0 0 0 0 0.0509803922  0 0 0 0.402088995 0"
          }
        },
        in: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:aa7a30d037a3": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -355 } },
        "translation.y": { "0": { value: -210 } }
      },
      "haiku:ac7ee2c9d302": {
        "translation.x": { "0": { value: 210 } },
        "translation.y": { "0": { value: 126 } }
      },
      "haiku:1f16874ea10c": {
        "translation.x": { "0": { value: 160.5 } },
        "translation.y": { "0": { value: 8.2 } }
      },
      "haiku:57c4d8cddcb3": { "translation.y": { "0": { value: 84 } } },
      "haiku:111b73b1d732": {
        fill: { "0": { value: "black" } },
        "fill-opacity": { "0": { value: "1" } },
        filter: { "0": { value: "url(#filter-2-da9286)" } }
      },
      "haiku:0c9a17d33503": {
        fill: { "0": { value: "#131E20" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:4027769e8b74": {
        fill: { "0": { value: "#232D2F" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "12" } },
        "sizeAbsolute.x": { "0": { value: 157 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 27 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:7e1588625493": {
        d: {
          "0": {
            value: "M143.410737,20.9827759 C143.096842,20.7835315 142.657263,20.6069008 142.104,20.4583843 C141.003789,20.1625736 139.546105,20 138,20 C136.453895,20 134.996211,20.1631848 133.896,20.4583843 C133.342105,20.6069008 132.902526,20.7835315 132.589263,20.9827759 C132.198316,21.2315257 132,21.5169463 132,21.8329259 L132,29.1670741 C132,29.4830537 132.198316,29.7690855 132.589263,30.0172241 C132.903158,30.2164685 133.342737,30.3930992 133.896,30.5416157 C134.996211,30.8374264 136.453895,31 138,31 C139.546105,31 141.003789,30.8368152 142.104,30.5410046 C142.657895,30.3924881 143.097474,30.2158573 143.410737,30.016613 C143.801684,29.7684743 144,29.4824425 144,29.1664629 L144,21.8323147 C144,21.5163351 143.801684,21.2303034 143.410737,20.9821647 L143.410737,20.9827759 Z M134.065263,21.0469497 C135.112421,20.7658073 136.509474,20.6105678 138,20.6105678 C139.490526,20.6105678 140.888211,20.7658073 141.934737,21.0469497 C143.068421,21.351928 143.368421,21.6941882 143.368421,21.8329259 C143.368421,21.9716635 143.069053,22.3139238 141.934737,22.6189021 C140.887579,22.9000444 139.490526,23.0552839 138,23.0552839 C136.509474,23.0552839 135.111789,22.9000444 134.065263,22.6189021 C132.931579,22.3139238 132.631579,21.9716635 132.631579,21.8329259 C132.631579,21.6941882 132.930947,21.351928 134.065263,21.0469497 Z M141.934737,29.9530503 C140.887579,30.2341927 139.490526,30.3894322 138,30.3894322 C136.509474,30.3894322 135.111789,30.2341927 134.065263,29.9530503 C132.931579,29.648072 132.631579,29.3058118 132.631579,29.1670741 L132.631579,27.5987888 C132.942316,27.7876431 133.366737,27.9551061 133.896,28.0975108 C134.996211,28.3933215 136.453895,28.5558951 138,28.5558951 C139.546105,28.5558951 141.003789,28.3927103 142.104,28.0968997 C142.633263,27.9544949 143.058316,27.7870319 143.368421,27.5981776 L143.368421,29.1664629 C143.368421,29.3052006 143.069053,29.6474608 141.934737,29.9524392 L141.934737,29.9530503 Z M141.934737,27.5083343 C140.887579,27.7894766 139.490526,27.9447161 138,27.9447161 C136.509474,27.9447161 135.111789,27.7894766 134.065263,27.5083343 C132.931579,27.2033559 132.631579,26.8610957 132.631579,26.722358 L132.631579,25.1540727 C132.942316,25.342927 133.366737,25.51039 133.896,25.6527948 C134.996211,25.9486054 136.453895,26.111179 138,26.111179 C139.546105,26.111179 141.003789,25.9479942 142.104,25.6527948 C142.633263,25.51039 143.058316,25.342927 143.368421,25.1540727 L143.368421,26.722358 C143.368421,26.8610957 143.069053,27.2033559 141.934737,27.5083343 Z M141.934737,25.0636182 C140.887579,25.3447605 139.490526,25.5 138,25.5 C136.509474,25.5 135.111789,25.3447605 134.065263,25.0636182 C132.931579,24.7586398 132.631579,24.4163796 132.631579,24.277642 L132.631579,22.7093566 C132.942316,22.8982109 133.366737,23.065674 133.896,23.2080787 C134.996211,23.5038893 136.453895,23.6664629 138,23.6664629 C139.546105,23.6664629 141.003789,23.5032781 142.104,23.2080787 C142.633263,23.065674 143.058316,22.8982109 143.368421,22.7093566 L143.368421,24.277642 C143.368421,24.4163796 143.069053,24.7586398 141.934737,25.0636182 Z"
          }
        },
        fill: { "0": { value: "#E8F4F6" } },
        "fill-rule": { "0": { value: "nonzero" } },
        opacity: { "0": { value: "0.44384058" } }
      },
      "haiku:e9d5d3514aa8": {
        fill: { "0": { value: "#5DE2F9" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "12" } },
        "sizeAbsolute.x": { "0": { value: 3 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 27 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:92166787210b": {
        d: {
          "0": {
            value: "M29.5952,50.4828 C30.0736024,51.0164027 30.3128,51.7370621 30.3128,52.6448 L30.3128,59.6 L28.62,59.6 L28.62,52.884 C28.62,51.6327937 28.1661379,51.0072 27.2584,51.0072 C26.7799976,51.0072 26.3752017,51.1451986 26.044,51.4212 C25.7127983,51.6972014 25.3570686,52.1295971 24.9768,52.7184 L24.9768,59.6 L23.284,59.6 L23.284,52.884 C23.284,51.6327937 22.8301379,51.0072 21.9224,51.0072 C21.4317309,51.0072 21.0208017,51.1482653 20.6896,51.4304 C20.3583983,51.7125347 20.0088018,52.1418638 19.6408,52.7184 L19.6408,59.6 L17.948,59.6 L17.948,49.9032 L19.4016,49.9032 L19.5488,51.32 C20.272537,50.2282612 21.2047943,49.6824 22.3456,49.6824 C22.9466697,49.6824 23.4587979,49.8357318 23.882,50.1424 C24.3052021,50.4490682 24.6087991,50.8783972 24.7928,51.4304 C25.1730686,50.8661305 25.5931977,50.4337348 26.0532,50.1332 C26.5132023,49.8326652 27.0559969,49.6824 27.6816,49.6824 C28.4789373,49.6824 29.1167976,49.9491973 29.5952,50.4828 Z M40.3924615,51.044 C41.1468652,51.9517379 41.5240615,53.1845255 41.5240615,54.7424 C41.5240615,55.7482717 41.3523299,56.6345295 41.0088615,57.4012 C40.6653931,58.1678705 40.1685981,58.7627979 39.5184615,59.186 C38.8683249,59.6092021 38.0955326,59.8208 37.2000615,59.8208 C35.8384547,59.8208 34.7773986,59.3669379 34.0168615,58.4592 C33.2563243,57.5514621 32.8760615,56.3186745 32.8760615,54.7608 C32.8760615,53.7549283 33.0477931,52.8686705 33.3912615,52.102 C33.7347299,51.3353295 34.2315249,50.7404021 34.8816615,50.3172 C35.5317981,49.8939979 36.3107236,49.6824 37.2184615,49.6824 C38.5800683,49.6824 39.6380577,50.1362621 40.3924615,51.044 Z M34.6976615,54.7608 C34.6976615,57.2264123 35.5317865,58.4592 37.2000615,58.4592 C38.8683365,58.4592 39.7024615,57.2202791 39.7024615,54.7424 C39.7024615,52.2767877 38.8744697,51.044 37.2184615,51.044 C35.5379197,51.044 34.6976615,52.2829209 34.6976615,54.7608 Z M49.9385229,59.6 L49.8097229,58.0912 C49.4417211,58.6922697 49.0185253,59.1307986 48.5401229,59.4068 C48.0617205,59.6828014 47.4790597,59.8208 46.7921229,59.8208 C45.9457187,59.8208 45.2833253,59.5632026 44.8049229,59.048 C44.3265205,58.5327974 44.0873229,57.8029381 44.0873229,56.8584 L44.0873229,49.9032 L45.7801229,49.9032 L45.7801229,56.6744 C45.7801229,57.3368033 45.8966551,57.8059986 46.1297229,58.082 C46.3627908,58.3580014 46.7430536,58.496 47.2705229,58.496 C48.215061,58.496 49.0246529,57.9378722 49.6993229,56.8216 L49.6993229,49.9032 L51.3921229,49.9032 L51.3921229,59.6 L49.9385229,59.6 Z M59.1625844,49.9584 C59.6900537,50.1424009 60.192982,50.4183982 60.6713844,50.7864 L59.9353844,51.9088 C59.5060489,51.6021318 59.0920531,51.3782674 58.6933844,51.2372 C58.2947157,51.0961326 57.8745866,51.0256 57.4329844,51.0256 C56.8809816,51.0256 56.4455193,51.1390655 56.1265844,51.366 C55.8076495,51.5929345 55.6481844,51.9026647 55.6481844,52.2952 C55.6481844,52.6877353 55.7984496,52.9943989 56.0989844,53.2152 C56.3995192,53.4360011 56.9423138,53.6506656 57.7273844,53.8592 C58.8068565,54.129068 59.6133817,54.4970643 60.1469844,54.9632 C60.6805871,55.4293357 60.9473844,56.067196 60.9473844,56.8768 C60.9473844,57.8336048 60.5763215,58.5634642 59.8341844,59.0664 C59.0920474,59.5693358 58.1873897,59.8208 57.1201844,59.8208 C55.648177,59.8208 54.4276559,59.3976042 53.4585844,58.5512 L54.3969844,57.484 C55.1575215,58.1341366 56.0529793,58.4592 57.0833844,58.4592 C57.7089875,58.4592 58.2119158,58.3304013 58.5921844,58.0728 C58.972453,57.8151987 59.1625844,57.4717355 59.1625844,57.0424 C59.1625844,56.6989316 59.0951184,56.4198677 58.9601844,56.2052 C58.8252504,55.9905323 58.5952527,55.8065341 58.2701844,55.6532 C57.9451161,55.4998659 57.457521,55.3373342 56.8073844,55.1656 C55.7769793,54.895732 55.0317867,54.5308023 54.5717844,54.0708 C54.1117821,53.6107977 53.8817844,53.0312035 53.8817844,52.332 C53.8817844,51.8290642 54.0320496,51.375202 54.3325844,50.9704 C54.6331192,50.565598 55.0501817,50.2497345 55.5837844,50.0228 C56.1173871,49.7958655 56.7153811,49.6824 57.3777844,49.6824 C58.0401877,49.6824 58.6351151,49.7743991 59.1625844,49.9584 Z M70.4842459,55.3312 L64.3018459,55.3312 C64.3754462,56.3984053 64.6453102,57.1834642 65.1114459,57.6864 C65.5775815,58.1893358 66.1786422,58.4408 66.9146459,58.4408 C67.3807815,58.4408 67.8101106,58.373334 68.2026459,58.2384 C68.5951812,58.103466 69.0061104,57.8888015 69.4354459,57.5944 L70.1714459,58.6064 C69.1410407,59.416004 68.0125187,59.8208 66.7858459,59.8208 C65.4365058,59.8208 64.3846497,59.3792044 63.6302459,58.496 C62.8758421,57.6127956 62.4986459,56.3984077 62.4986459,54.8528 C62.4986459,53.8469283 62.6611776,52.9545372 62.9862459,52.1756 C63.3113142,51.3966628 63.7774428,50.7864022 64.3846459,50.3448 C64.9918489,49.9031978 65.7063751,49.6824 66.5282459,49.6824 C67.8162523,49.6824 68.8037091,50.1055958 69.4906459,50.952 C70.1775826,51.7984042 70.5210459,52.9698592 70.5210459,54.4664 C70.5210459,54.7485347 70.5087793,55.0367985 70.4842459,55.3312 Z M68.8466459,53.9696 C68.8466459,53.0127952 68.6565144,52.2829358 68.2762459,51.78 C67.8959773,51.2770642 67.325583,51.0256 66.5650459,51.0256 C65.1789056,51.0256 64.4245132,52.0437232 64.3018459,54.08 L68.8466459,54.08 L68.8466459,53.9696 Z M77.3715073,59.6 L75.6051073,59.6 L75.6051073,54.7424 L71.5203073,46.9224 L73.4523073,46.9224 L76.5435073,53.1968 L79.6347073,46.9224 L81.4563073,46.9224 L77.3715073,54.724 L77.3715073,59.6 Z"
          }
        },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:197768d72d25": {
        d: {
          "0": {
            value: "M28.5952,21.4828 C29.0736024,22.0164027 29.3128,22.7370621 29.3128,23.6448 L29.3128,30.6 L27.62,30.6 L27.62,23.884 C27.62,22.6327937 27.1661379,22.0072 26.2584,22.0072 C25.7799976,22.0072 25.3752017,22.1451986 25.044,22.4212 C24.7127983,22.6972014 24.3570686,23.1295971 23.9768,23.7184 L23.9768,30.6 L22.284,30.6 L22.284,23.884 C22.284,22.6327937 21.8301379,22.0072 20.9224,22.0072 C20.4317309,22.0072 20.0208017,22.1482653 19.6896,22.4304 C19.3583983,22.7125347 19.0088018,23.1418638 18.6408,23.7184 L18.6408,30.6 L16.948,30.6 L16.948,20.9032 L18.4016,20.9032 L18.5488,22.32 C19.272537,21.2282612 20.2047943,20.6824 21.3456,20.6824 C21.9466697,20.6824 22.4587979,20.8357318 22.882,21.1424 C23.3052021,21.4490682 23.6087991,21.8783972 23.7928,22.4304 C24.1730686,21.8661305 24.5931977,21.4337348 25.0532,21.1332 C25.5132023,20.8326652 26.0559969,20.6824 26.6816,20.6824 C27.4789373,20.6824 28.1167976,20.9491973 28.5952,21.4828 Z M39.3924615,22.044 C40.1468652,22.9517379 40.5240615,24.1845255 40.5240615,25.7424 C40.5240615,26.7482717 40.3523299,27.6345295 40.0088615,28.4012 C39.6653931,29.1678705 39.1685981,29.7627979 38.5184615,30.186 C37.8683249,30.6092021 37.0955326,30.8208 36.2000615,30.8208 C34.8384547,30.8208 33.7773986,30.3669379 33.0168615,29.4592 C32.2563243,28.5514621 31.8760615,27.3186745 31.8760615,25.7608 C31.8760615,24.7549283 32.0477931,23.8686705 32.3912615,23.102 C32.7347299,22.3353295 33.2315249,21.7404021 33.8816615,21.3172 C34.5317981,20.8939979 35.3107236,20.6824 36.2184615,20.6824 C37.5800683,20.6824 38.6380577,21.1362621 39.3924615,22.044 Z M33.6976615,25.7608 C33.6976615,28.2264123 34.5317865,29.4592 36.2000615,29.4592 C37.8683365,29.4592 38.7024615,28.2202791 38.7024615,25.7424 C38.7024615,23.2767877 37.8744697,22.044 36.2184615,22.044 C34.5379197,22.044 33.6976615,23.2829209 33.6976615,25.7608 Z M48.9385229,30.6 L48.8097229,29.0912 C48.4417211,29.6922697 48.0185253,30.1307986 47.5401229,30.4068 C47.0617205,30.6828014 46.4790597,30.8208 45.7921229,30.8208 C44.9457187,30.8208 44.2833253,30.5632026 43.8049229,30.048 C43.3265205,29.5327974 43.0873229,28.8029381 43.0873229,27.8584 L43.0873229,20.9032 L44.7801229,20.9032 L44.7801229,27.6744 C44.7801229,28.3368033 44.8966551,28.8059986 45.1297229,29.082 C45.3627908,29.3580014 45.7430536,29.496 46.2705229,29.496 C47.215061,29.496 48.0246529,28.9378722 48.6993229,27.8216 L48.6993229,20.9032 L50.3921229,20.9032 L50.3921229,30.6 L48.9385229,30.6 Z M58.1625844,20.9584 C58.6900537,21.1424009 59.192982,21.4183982 59.6713844,21.7864 L58.9353844,22.9088 C58.5060489,22.6021318 58.0920531,22.3782674 57.6933844,22.2372 C57.2947157,22.0961326 56.8745866,22.0256 56.4329844,22.0256 C55.8809816,22.0256 55.4455193,22.1390655 55.1265844,22.366 C54.8076495,22.5929345 54.6481844,22.9026647 54.6481844,23.2952 C54.6481844,23.6877353 54.7984496,23.9943989 55.0989844,24.2152 C55.3995192,24.4360011 55.9423138,24.6506656 56.7273844,24.8592 C57.8068565,25.129068 58.6133817,25.4970643 59.1469844,25.9632 C59.6805871,26.4293357 59.9473844,27.067196 59.9473844,27.8768 C59.9473844,28.8336048 59.5763215,29.5634642 58.8341844,30.0664 C58.0920474,30.5693358 57.1873897,30.8208 56.1201844,30.8208 C54.648177,30.8208 53.4276559,30.3976042 52.4585844,29.5512 L53.3969844,28.484 C54.1575215,29.1341366 55.0529793,29.4592 56.0833844,29.4592 C56.7089875,29.4592 57.2119158,29.3304013 57.5921844,29.0728 C57.972453,28.8151987 58.1625844,28.4717355 58.1625844,28.0424 C58.1625844,27.6989316 58.0951184,27.4198677 57.9601844,27.2052 C57.8252504,26.9905323 57.5952527,26.8065341 57.2701844,26.6532 C56.9451161,26.4998659 56.457521,26.3373342 55.8073844,26.1656 C54.7769793,25.895732 54.0317867,25.5308023 53.5717844,25.0708 C53.1117821,24.6107977 52.8817844,24.0312035 52.8817844,23.332 C52.8817844,22.8290642 53.0320496,22.375202 53.3325844,21.9704 C53.6331192,21.565598 54.0501817,21.2497345 54.5837844,21.0228 C55.1173871,20.7958655 55.7153811,20.6824 56.3777844,20.6824 C57.0401877,20.6824 57.6351151,20.7743991 58.1625844,20.9584 Z M69.4842459,26.3312 L63.3018459,26.3312 C63.3754462,27.3984053 63.6453102,28.1834642 64.1114459,28.6864 C64.5775815,29.1893358 65.1786422,29.4408 65.9146459,29.4408 C66.3807815,29.4408 66.8101106,29.373334 67.2026459,29.2384 C67.5951812,29.103466 68.0061104,28.8888015 68.4354459,28.5944 L69.1714459,29.6064 C68.1410407,30.416004 67.0125187,30.8208 65.7858459,30.8208 C64.4365058,30.8208 63.3846497,30.3792044 62.6302459,29.496 C61.8758421,28.6127956 61.4986459,27.3984077 61.4986459,25.8528 C61.4986459,24.8469283 61.6611776,23.9545372 61.9862459,23.1756 C62.3113142,22.3966628 62.7774428,21.7864022 63.3846459,21.3448 C63.9918489,20.9031978 64.7063751,20.6824 65.5282459,20.6824 C66.8162523,20.6824 67.8037091,21.1055958 68.4906459,21.952 C69.1775826,22.7984042 69.5210459,23.9698592 69.5210459,25.4664 C69.5210459,25.7485347 69.5087793,26.0367985 69.4842459,26.3312 Z M67.8466459,24.9696 C67.8466459,24.0127952 67.6565144,23.2829358 67.2762459,22.78 C66.8959773,22.2770642 66.325583,22.0256 65.5650459,22.0256 C64.1789056,22.0256 63.4245132,23.0437232 63.3018459,25.08 L67.8466459,25.08 L67.8466459,24.9696 Z M78.2851073,30.6 L75.3595073,24.988 L72.3971073,30.6 L70.5203073,30.6 L74.3291073,23.8472 L70.8515073,17.9224 L72.8387073,17.9224 L75.3963073,22.688 L77.9723073,17.9224 L79.8491073,17.9224 L76.4083073,23.7552 L80.2723073,30.6 L78.2851073,30.6 Z"
          }
        },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:600935ee63d9": {
        d: {
          "0": {
            value: "M143.410737,49.9827759 C143.096842,49.7835315 142.657263,49.6069008 142.104,49.4583843 C141.003789,49.1625736 139.546105,49 138,49 C136.453895,49 134.996211,49.1631848 133.896,49.4583843 C133.342105,49.6069008 132.902526,49.7835315 132.589263,49.9827759 C132.198316,50.2315257 132,50.5169463 132,50.8329259 L132,58.1670741 C132,58.4830537 132.198316,58.7690855 132.589263,59.0172241 C132.903158,59.2164685 133.342737,59.3930992 133.896,59.5416157 C134.996211,59.8374264 136.453895,60 138,60 C139.546105,60 141.003789,59.8368152 142.104,59.5410046 C142.657895,59.3924881 143.097474,59.2158573 143.410737,59.016613 C143.801684,58.7684743 144,58.4824425 144,58.1664629 L144,50.8323147 C144,50.5163351 143.801684,50.2303034 143.410737,49.9821647 L143.410737,49.9827759 Z M134.065263,50.0469497 C135.112421,49.7658073 136.509474,49.6105678 138,49.6105678 C139.490526,49.6105678 140.888211,49.7658073 141.934737,50.0469497 C143.068421,50.351928 143.368421,50.6941882 143.368421,50.8329259 C143.368421,50.9716635 143.069053,51.3139238 141.934737,51.6189021 C140.887579,51.9000444 139.490526,52.0552839 138,52.0552839 C136.509474,52.0552839 135.111789,51.9000444 134.065263,51.6189021 C132.931579,51.3139238 132.631579,50.9716635 132.631579,50.8329259 C132.631579,50.6941882 132.930947,50.351928 134.065263,50.0469497 Z M141.934737,58.9530503 C140.887579,59.2341927 139.490526,59.3894322 138,59.3894322 C136.509474,59.3894322 135.111789,59.2341927 134.065263,58.9530503 C132.931579,58.648072 132.631579,58.3058118 132.631579,58.1670741 L132.631579,56.5987888 C132.942316,56.7876431 133.366737,56.9551061 133.896,57.0975108 C134.996211,57.3933215 136.453895,57.5558951 138,57.5558951 C139.546105,57.5558951 141.003789,57.3927103 142.104,57.0968997 C142.633263,56.9544949 143.058316,56.7870319 143.368421,56.5981776 L143.368421,58.1664629 C143.368421,58.3052006 143.069053,58.6474608 141.934737,58.9524392 L141.934737,58.9530503 Z M141.934737,56.5083343 C140.887579,56.7894766 139.490526,56.9447161 138,56.9447161 C136.509474,56.9447161 135.111789,56.7894766 134.065263,56.5083343 C132.931579,56.2033559 132.631579,55.8610957 132.631579,55.722358 L132.631579,54.1540727 C132.942316,54.342927 133.366737,54.51039 133.896,54.6527948 C134.996211,54.9486054 136.453895,55.111179 138,55.111179 C139.546105,55.111179 141.003789,54.9479942 142.104,54.6527948 C142.633263,54.51039 143.058316,54.342927 143.368421,54.1540727 L143.368421,55.722358 C143.368421,55.8610957 143.069053,56.2033559 141.934737,56.5083343 Z M141.934737,54.0636182 C140.887579,54.3447605 139.490526,54.5 138,54.5 C136.509474,54.5 135.111789,54.3447605 134.065263,54.0636182 C132.931579,53.7586398 132.631579,53.4163796 132.631579,53.277642 L132.631579,51.7093566 C132.942316,51.8982109 133.366737,52.065674 133.896,52.2080787 C134.996211,52.5038893 136.453895,52.6664629 138,52.6664629 C139.546105,52.6664629 141.003789,52.5032781 142.104,52.2080787 C142.633263,52.065674 143.058316,51.8982109 143.368421,51.7093566 L143.368421,53.277642 C143.368421,53.4163796 143.069053,53.7586398 141.934737,54.0636182 Z"
          }
        },
        fill: { "0": { value: "#E8F4F6" } },
        "fill-rule": { "0": { value: "nonzero" } },
        opacity: { "0": { value: "0.44384058" } }
      },
      "haiku:7d6fa2981ade": {
        d: {
          "0": {
            value: "M27.6816,88.6 L27.24,82.8776 C27.0559991,80.6327888 26.9517335,78.9093393 26.9272,77.7072 L24.1856,87.1648 L22.548,87.1648 L19.6592,77.6888 C19.6592,79.222141 19.5794675,80.9946566 19.42,83.0064 L18.9968,88.6 L17.3408,88.6 L18.3896,75.9224 L20.7448,75.9224 L23.4128,85.1408 L25.952,75.9224 L28.3256,75.9224 L29.3744,88.6 L27.6816,88.6 Z M39.1872615,87.2108 C39.3221955,87.4009343 39.5245935,87.5450662 39.7944615,87.6432 L39.4080615,88.8208 C38.9051256,88.7594664 38.5003297,88.6184011 38.1936615,88.3976 C37.8869933,88.1767989 37.6600622,87.8333357 37.5128615,87.3672 C36.8627249,88.3362715 35.8998012,88.8208 34.6240615,88.8208 C33.6672567,88.8208 32.9128642,88.550936 32.3608615,88.0112 C31.8088587,87.471464 31.5328615,86.7661377 31.5328615,85.8952 C31.5328615,84.8647948 31.9039244,84.0736028 32.6460615,83.5216 C33.3881985,82.9695972 34.4400547,82.6936 35.8016615,82.6936 L37.2920615,82.6936 L37.2920615,81.976 C37.2920615,81.2890632 37.1264631,80.7984015 36.7952615,80.504 C36.4640598,80.2095985 35.9549982,80.0624 35.2680615,80.0624 C34.5565912,80.0624 33.6856666,80.2341316 32.6552615,80.5776 L32.2320615,79.3448 C33.4342008,78.9031978 34.5504563,78.6824 35.5808615,78.6824 C36.7216672,78.6824 37.574192,78.9614639 38.1384615,79.5196 C38.702731,80.0777361 38.9848615,80.8719948 38.9848615,81.9024 L38.9848615,86.3368 C38.9848615,86.7293353 39.0523275,87.0206657 39.1872615,87.2108 Z M37.2920615,86.0424 L37.2920615,83.816 L36.0224615,83.816 C34.2315192,83.816 33.3360615,84.4783934 33.3360615,85.8032 C33.3360615,86.3797362 33.4771267,86.8151985 33.7592615,87.1096 C34.0413962,87.4040015 34.4584587,87.5512 35.0104615,87.5512 C35.979533,87.5512 36.7400587,87.0482717 37.2920615,86.0424 Z M45.0441229,88.8208 C44.2222522,88.8208 43.5813252,88.584669 43.1213229,88.1124 C42.6613206,87.640131 42.4313229,86.9562711 42.4313229,86.0608 L42.4313229,80.2096 L40.7385229,80.2096 L40.7385229,78.9032 L42.4313229,78.9032 L42.4313229,76.7136 L44.1241229,76.5112 L44.1241229,78.9032 L46.4241229,78.9032 L46.2401229,80.2096 L44.1241229,80.2096 L44.1241229,85.9872 C44.1241229,86.4901358 44.2130554,86.8550655 44.3909229,87.082 C44.5687905,87.3089345 44.8662542,87.4224 45.2833229,87.4224 C45.688125,87.4224 46.117454,87.2813347 46.5713229,86.9992 L47.2153229,88.1584 C46.5774531,88.6000022 45.853727,88.8208 45.0441229,88.8208 Z M55.4549844,79.4736 C55.9517869,80.0010693 56.2001844,80.7247954 56.2001844,81.6448 L56.2001844,88.6 L54.5073844,88.6 L54.5073844,81.884 C54.5073844,81.1970632 54.3755191,80.7125347 54.1117844,80.4304 C53.8480498,80.1482653 53.4647203,80.0072 52.9617844,80.0072 C52.4588486,80.0072 52.0111197,80.1543985 51.6185844,80.4488 C51.2260491,80.7432015 50.8580528,81.160264 50.5145844,81.7 L50.5145844,88.6 L48.8217844,88.6 L48.8217844,75.0208 L50.5145844,74.8368 L50.5145844,80.2464 C51.2751215,79.2037281 52.231912,78.6824 53.3849844,78.6824 C54.2681888,78.6824 54.9581819,78.9461307 55.4549844,79.4736 Z"
          }
        },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:e3ed074c3eec": {
        d: {
          "0": {
            value: "M143.064583,86.5497823 L140.040978,83.9853926 L140.394343,83.6183402 C140.693037,83.7234789 141.007731,83.7769815 141.333094,83.7769815 C142.803893,83.7769815 144,82.6608934 144,81.2884907 C144,80.8909543 143.896657,80.4952843 143.701973,80.1444071 C143.653302,80.0560657 143.561961,79.9950977 143.457285,79.9801667 C143.352609,79.9652358 143.245932,79.9975862 143.170592,80.067886 L141.862475,81.2884907 L141.333761,81.2884907 L141.333761,80.7951474 L142.641878,79.5745427 C142.717218,79.5042429 142.751888,79.4053254 142.735887,79.30703 C142.719885,79.2087346 142.654546,79.1241259 142.559871,79.078711 C142.183837,78.896429 141.759799,78.8006221 141.333761,78.8006221 C139.862962,78.8006221 138.666855,79.9167102 138.666855,81.2891129 C138.666855,81.5927087 138.724193,81.8863506 138.83687,82.1650616 L138.363494,82.562598 L136.718013,81.1665547 C136.654674,81.1130521 136.619338,81.041508 136.617337,80.9643648 C136.615337,80.8872216 136.64734,80.8144332 136.708012,80.7578201 L138.236816,79.3312928 C138.332158,79.2423292 138.360827,79.1085729 138.308823,78.9922359 C138.256818,78.875899 138.135474,78.8 138.000795,78.8 C137.973459,78.8 137.316067,78.8006221 136.606003,78.8391937 C135.249881,78.9138485 134.919185,79.0575588 134.764505,79.2018913 L132.430962,81.3793206 C132.368289,81.4378002 132.33362,81.5168098 132.33362,81.5995521 L132.33362,81.9106134 L132.000256,81.9106134 C131.911582,81.9106134 131.826908,81.9435859 131.764235,82.0014433 L131.097509,82.623566 C130.967497,82.7448799 130.967497,82.9420928 131.097509,83.0634067 L132.430962,84.3076521 C132.560973,84.428966 132.772326,84.428966 132.902337,84.3076521 L133.569064,83.6855294 C133.631736,83.6270499 133.666406,83.5480403 133.666406,83.465298 L133.666406,83.1542367 L133.999769,83.1542367 C134.088444,83.1542367 134.173118,83.1212642 134.23579,83.0634067 L134.764505,82.5700635 C134.823176,82.5153167 134.899183,82.4854548 134.978524,82.4854548 C135.063198,82.4854548 135.142538,82.5190494 135.201877,82.5793953 L136.613337,84.028319 L133.605734,86.5504044 C133.405049,86.7183775 133.291039,86.9479408 133.283705,87.1961677 C133.276371,87.4443947 133.377713,87.679557 133.568397,87.8574841 L134.292462,88.5331094 C134.477145,88.7054374 134.7185,88.7993779 134.974523,88.7993779 C134.983191,88.7993779 134.991858,88.7993779 135.000526,88.7987558 C135.26655,88.7919124 135.512572,88.6855294 135.692588,88.4982705 L138.314823,85.7758616 L140.971062,88.5020032 C141.155745,88.6911285 141.417102,88.8 141.687792,88.8 C141.945816,88.8 142.189171,88.7054374 142.373187,88.5331094 L143.097252,87.8574841 C143.287936,87.679557 143.389279,87.4450168 143.382611,87.1967898 C143.375944,86.9485629 143.263267,86.7183775 143.063916,86.5491601 L143.064583,86.5497823 Z M139.536933,82.1090705 C139.401587,81.8521339 139.333581,81.5759114 139.333581,81.2884907 C139.333581,80.2594998 140.230995,79.4221227 141.333761,79.4221227 C141.495775,79.4221227 141.653123,79.4395421 141.80647,79.474381 L140.764376,80.4467587 C140.701704,80.5052383 140.667034,80.5842479 140.667034,80.6669902 L140.667034,81.6001742 C140.667034,81.7718801 140.816381,81.9112355 141.000397,81.9112355 L142.000487,81.9112355 C142.089162,81.9112355 142.173836,81.878263 142.236508,81.8204056 L143.278602,80.8480279 C143.315939,80.9911161 143.334607,81.1385592 143.334607,81.2891129 C143.334607,82.3181038 142.437193,83.1554809 141.334427,83.1554809 C141.025733,83.1554809 140.729707,83.0914023 140.455015,82.9657335 C140.321003,82.9041433 140.159655,82.9333831 140.060313,83.0372776 L139.548934,83.5679482 L138.859539,82.9831529 L139.460926,82.4786114 C139.571603,82.385293 139.602939,82.2353615 139.5376,82.1103148 L139.536933,82.1090705 Z M134.977857,81.8639542 C134.719834,81.8639542 134.476479,81.9585169 134.292462,82.1308448 L133.861757,82.5327361 L133.333043,82.5327361 C133.149026,82.5327361 132.999679,82.6720916 132.999679,82.8437974 L132.999679,83.3371407 L132.666316,83.6482021 L131.804239,82.8437974 L132.137602,82.5327361 L132.666316,82.5327361 C132.850333,82.5327361 132.999679,82.3933806 132.999679,82.2216748 L132.999679,81.7283315 L135.226546,79.6504417 C135.26855,79.6280453 135.53324,79.5179296 136.708679,79.4569616 C136.87136,79.4482518 137.030708,79.4420306 137.179388,79.4370536 L136.23597,80.3173572 C136.045286,80.4952843 135.943944,80.7298246 135.950611,80.9780515 C135.957278,81.2262785 136.069955,81.4564639 136.269306,81.6256812 L136.850692,82.1190245 L136.223969,82.7038198 L135.695255,82.1613289 C135.510571,81.9722036 135.249215,81.8633321 134.978524,81.8633321 L134.977857,81.8639542 Z M135.197877,88.0833147 C135.141205,88.1424163 135.065198,88.1760109 134.983858,88.1778773 C134.902517,88.1797437 134.82451,88.1498818 134.764505,88.0938908 L134.04044,87.4182655 C133.980434,87.3622745 133.948431,87.2894861 133.950431,87.2135872 C133.952432,87.1376882 133.988435,87.0667662 134.051774,87.0138858 L137.062044,84.4893119 L137.865449,85.3136245 L135.197877,88.0826925 L135.197877,88.0833147 Z M142.626543,87.4188876 L141.902478,88.0945129 C141.843806,88.1492597 141.7678,88.1791216 141.688459,88.1791216 C141.603785,88.1791216 141.524445,88.1455269 141.465106,88.085181 L136.672676,83.166057 L137.344736,82.5389573 L142.616543,87.0107752 C142.679882,87.0642777 142.715218,87.1358218 142.717218,87.212965 C142.719218,87.2901082 142.687216,87.3628966 142.626543,87.4195098 L142.626543,87.4188876 Z"
          }
        },
        fill: { "0": { value: "#7A8587" } },
        "fill-rule": { "0": { value: "nonzero" } }
      },
      "haiku:b9e6b0591379": {
        d: {
          "0": {
            value: "M22.7222632,11.2016316 C22.3040526,10.0126316 21.1715263,9.15789474 19.8421053,9.15789474 C19.2132632,9.15789474 18.6302105,9.34868421 18.1433158,9.67531579 C17.7251053,8.48631579 16.5925789,7.63157895 15.2631579,7.63157895 C14.7075789,7.63157895 14.1855789,7.78115789 13.7368421,8.04215789 L13.7368421,3.05263158 C13.7368421,1.36910526 12.3677368,0 10.6842105,0 C9.00068421,0 7.63157895,1.36910526 7.63157895,3.05263158 L7.63157895,14.3061579 L5.57715789,10.7452632 C5.17878947,10.0202632 4.52857895,9.50436842 3.74710526,9.29068421 C2.98547368,9.08310526 2.19331579,9.193 1.51563158,9.599 C0.131263158,10.4293158 -0.396842105,12.3066842 0.340368421,13.7841579 C0.386157895,13.8772632 1.35994737,15.8721579 4.40036842,21.9499474 C5.83205263,24.8117895 7.40263158,26.8585789 9.06936842,28.0307895 C10.3774211,28.9511579 11.281,28.9984737 11.4488947,28.9984737 L19.0804737,28.9984737 C20.3747895,28.9984737 21.5714211,28.6245263 22.6383158,27.8842632 C23.6701053,27.1699474 24.5599474,26.1259474 25.2849474,24.7812632 C26.7181579,22.1208947 27.4752105,18.3005263 27.4752105,13.7353158 C27.4752105,12.0517895 26.1061053,10.6826842 24.4225789,10.6826842 C23.7922105,10.6842105 23.2091579,10.875 22.7222632,11.2016316 Z"
          }
        }
      },
      "haiku:2f9e895d1e16": {
        x: { "0": { value: "-76.5%" } },
        y: { "0": { value: "-51.7%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 2.529 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 2.448 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:b71d685293cf": {
        dx: { "0": { value: "0" } },
        dy: { "0": { value: "6" } },
        in: { "0": { value: "SourceAlpha" } },
        result: { "0": { value: "shadowOffsetOuter1" } }
      },
      "haiku:fcf2f56a4f67": {
        stdDeviation: { "0": { value: "6" } },
        in: { "0": { value: "shadowOffsetOuter1" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:90396720c0cf": {
        values: {
          "0": {
            value: "0 0 0 0 0.00158943046   0 0 0 0 0.0999501443   0 0 0 0 0.121332908  0 0 0 0.273324275 0"
          }
        },
        in: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:859d2b065ca9": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -405 } },
        "translation.y": { "0": { value: -300 } }
      },
      "haiku:abab72303df1": {
        "fill-rule": { "0": { value: "nonzero" } },
        "translation.x": { "0": { value: 416 } },
        "translation.y": { "0": { value: 305 } }
      },
      "haiku:35b63f0e8e41": {
        fill: { "0": { value: "black" } },
        "fill-opacity": { "0": { value: "1" } },
        filter: { "0": { value: "url(#filter-2-a650bf)" } }
      },
      "haiku:3d4a8c97e987": {
        fill: { "0": { value: "#081B20" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:ba9487176f84": {
        d: {
          "0": {
            value: "M24.4210526,10.6842105 C23.7922105,10.6842105 23.2091579,10.875 22.7222632,11.2016316 C22.3040526,10.0126316 21.1715263,9.15789474 19.8421053,9.15789474 C19.2132632,9.15789474 18.6302105,9.34868421 18.1433158,9.67531579 C17.7251053,8.48631579 16.5925789,7.63157895 15.2631579,7.63157895 C14.7075789,7.63157895 14.1855789,7.78115789 13.7368421,8.04215789 L13.7368421,3.05263158 C13.7368421,1.36910526 12.3677368,0 10.6842105,0 C9.00068421,0 7.63157895,1.36910526 7.63157895,3.05263158 L7.63157895,14.3061579 L5.57715789,10.7452632 C5.17878947,10.0202632 4.52857895,9.50436842 3.74710526,9.29068421 C2.98547368,9.08310526 2.19331579,9.193 1.51563158,9.599 C0.131263158,10.4293158 -0.396842105,12.3066842 0.340368421,13.7841579 C0.386157895,13.8772632 1.35994737,15.8721579 4.40036842,21.9499474 C5.83205263,24.8117895 7.40263158,26.8585789 9.06936842,28.0307895 C10.3774211,28.9511579 11.281,28.9984737 11.4488947,28.9984737 L19.0804737,28.9984737 C20.3747895,28.9984737 21.5714211,28.6245263 22.6383158,27.8842632 C23.6701053,27.1699474 24.5599474,26.1259474 25.2849474,24.7812632 C26.7181579,22.1208947 27.4752105,18.3005263 27.4752105,13.7353158 C27.4752105,12.0517895 26.1061053,10.6826842 24.4225789,10.6826842 L24.4210526,10.6842105 Z M23.9402632,24.0593158 C23.1023158,25.6176842 21.5775263,27.4736842 19.0789474,27.4736842 L11.4626316,27.4736842 C11.4031053,27.4691053 10.7605263,27.3973684 9.79131579,26.6723684 C8.82515789,25.9488947 7.34157895,24.4256316 5.76489474,21.2692105 C2.67105263,15.0815263 1.72015789,13.1324211 1.711,13.1141053 C1.70947368,13.1110526 1.70947368,13.1095263 1.70794737,13.108 C1.32484211,12.3402632 1.59652632,11.3344211 2.30168421,10.9116316 C2.61915789,10.7208421 2.99005263,10.6704737 3.34721053,10.7666316 C3.72726316,10.8704211 4.04626316,11.1268421 4.24315789,11.4870526 C4.24621053,11.4916316 4.24926316,11.4977368 4.25231579,11.5023158 L6.63489474,15.631 C7.12178947,16.5208421 7.66973684,16.8947895 8.26347368,16.7436842 C8.85873684,16.5925789 9.15942105,15.9973158 9.15942105,14.9777368 L9.15942105,3.05415789 C9.15942105,2.21315789 9.84473684,1.52784211 10.6857368,1.52784211 C11.5267368,1.52784211 12.2120526,2.21315789 12.2120526,3.05415789 L12.2120526,12.9752105 C12.2120526,13.3964737 12.5539474,13.7383684 12.9752105,13.7383684 C13.3964737,13.7383684 13.7383684,13.3964737 13.7383684,12.9752105 L13.7383684,10.6857368 C13.7383684,9.84473684 14.4236842,9.15942105 15.2646842,9.15942105 C16.1056842,9.15942105 16.791,9.84473684 16.791,10.6857368 L16.791,12.9752105 C16.791,13.3964737 17.1328947,13.7383684 17.5541579,13.7383684 C17.9754211,13.7383684 18.3173158,13.3964737 18.3173158,12.9752105 L18.3173158,12.2120526 C18.3173158,11.3710526 19.0026316,10.6857368 19.8436316,10.6857368 C20.6846316,10.6857368 21.3699474,11.3710526 21.3699474,12.2120526 L21.3699474,14.5015263 C21.3699474,14.9227895 21.7118421,15.2646842 22.1331053,15.2646842 C22.5543684,15.2646842 22.8962632,14.9227895 22.8962632,14.5015263 L22.8962632,13.7383684 C22.8962632,12.8973684 23.5815789,12.2120526 24.4225789,12.2120526 C25.2635789,12.2120526 25.9488947,12.8973684 25.9488947,13.7383684 C25.9488947,18.0517368 25.2544211,21.6217895 23.9417895,24.0608421 L23.9402632,24.0593158 Z"
          }
        },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:371594557871": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -262 } },
        "translation.y": { "0": { value: -156 } }
      },
      "haiku:1563c52a801f": {
        fill: { "0": { value: "#343F41" } },
        "translation.x": { "0": { value: 262 } },
        "translation.y": { "0": { value: 156 } }
      },
      "haiku:23989c87c54e": {
        d: {
          "0": {
            value: "M104.397683,95.8152934 L114.07663,91.4817908 L114.07663,134.72327 L113.983464,134.685128 L104.397683,130.76076 L104.397683,125.390439 C104.397683,123.955378 103.296728,122.780729 101.903529,122.685483 L101.204733,122.36702 L65.0685864,107.039665 C63.7048059,106.461247 62.13623,107.111965 61.565074,108.493084 C61.4059757,108.877801 61.3410522,109.278612 61.3596594,109.6692 C61.3580662,109.707597 61.3572616,109.746201 61.3572616,109.784996 L61.3572616,134.72327 L51.6783151,130.76076 L51.6783151,56.5578433 L59.4258496,59.7296429 L61.1324014,60.4282962 C61.2002659,60.5463553 61.2755039,60.6581656 61.3572616,60.7633604 L61.3572616,91.8494264 C61.3572616,92.7396287 61.7809111,93.5296244 62.4351693,94.0239186 C62.9352687,94.6000817 63.6560346,94.9334533 64.407525,94.944854 L100.360692,110.19359 C100.416285,110.217169 100.472218,110.238705 100.52841,110.258232 C100.887403,110.439336 101.29222,110.541196 101.720528,110.541196 C103.19908,110.541196 104.397683,109.327354 104.397683,107.830005 L104.397683,95.8152934 Z M99.0433725,97.0896055 L99.0433725,103.756166 L71.6404787,92.133838 L79.518429,88.808535 L99.0433725,97.0896055 Z M66.7115725,113.615213 L76.390519,117.720323 L76.390519,131.173342 L66.7115725,135.135852 L66.7115725,113.615213 Z M64.0880963,142.110197 C64.560427,142.17052 65.0541063,142.113001 65.5268382,141.919467 L79.9312396,136.022382 C81.050286,135.56425 81.7307218,134.475457 81.7345264,133.324184 C81.7413474,133.245267 81.7448298,133.165381 81.7448298,133.084672 L81.7448298,119.991235 L99.0433725,127.328027 L99.0433725,127.231004 L99.0074748,127.311789 L99.0433725,127.328149 L99.0433725,132.830412 C99.0421086,132.88582 99.0424174,132.941112 99.0442725,132.996227 C99.0502597,133.232112 99.0859969,133.460503 99.1478254,133.677695 C99.3793306,134.52184 99.9818801,135.251545 100.845912,135.605275 L111.822362,140.098976 L115.517201,141.611624 C116.289488,142.155513 117.309012,142.306414 118.246206,141.922732 L132.658582,136.022382 C132.996475,135.88405 133.294378,135.68822 133.54574,135.450533 C134.341392,134.980578 134.876068,134.106975 134.876068,133.106905 L134.876068,52.4644206 C134.877069,52.4201078 134.877065,52.3758648 134.876068,52.3317241 L134.876068,52.1872148 C134.876068,50.8521593 133.923211,49.7424849 132.668646,49.5176195 L118.186681,43.3644453 C117.334817,43.0025009 116.408437,43.0860601 115.660441,43.5103979 L101.587363,49.2718415 C100.170674,49.34212 99.0433725,50.527607 99.0433725,51.9797367 L99.0433725,52.2163181 C99.0424376,52.2573215 99.0423593,52.2984166 99.0431484,52.3395774 C99.0423593,52.3807382 99.0424376,52.4218332 99.0433725,52.4628367 L99.0433725,63.2021247 L82.1566999,70.0901716 L82.1566999,52.4644207 C82.1577009,52.4201078 82.1576966,52.3758648 82.1566999,52.3317241 L82.1566999,51.9797367 C82.1566999,50.4823874 80.9580966,49.268546 79.4795444,49.268546 C79.4423333,49.268546 79.4052995,49.2693148 79.3684577,49.2708377 L65.4673128,43.3644453 C64.6154491,43.0025009 63.689069,43.0860601 62.9410731,43.5103979 L48.1265437,49.5753879 C47.7996139,49.7092312 47.5101204,49.8969026 47.2639983,50.1242341 C46.6887378,50.621512 46.3240043,51.3612279 46.3240043,52.1872148 L46.3240043,52.2163181 C46.3230694,52.2573215 46.3229911,52.2984166 46.3237802,52.3395774 C46.3229911,52.3807382 46.3230694,52.4218332 46.3240043,52.4628367 L46.3240043,132.830412 C46.322984,132.875142 46.3229886,132.919798 46.3240043,132.964345 L46.3240043,133.106905 C46.3240043,134.450209 47.2886724,135.565338 48.5547149,135.780566 L59.4258496,140.231151 L62.1866288,141.3614 C62.6671096,141.82566 63.3178902,142.110731 64.0344171,142.110731 C64.0523519,142.110731 64.0702455,142.110552 64.0880963,142.110197 Z M119.430941,135.139117 L119.430941,87.9327656 C119.430941,87.3795499 119.267327,86.8650339 118.986432,86.4361371 C118.97351,86.4031363 118.959904,86.3702511 118.945605,86.3374984 C118.347753,84.9680164 116.766849,84.348649 115.414559,84.9541025 L100.274077,91.7328691 L86.4653706,85.8762132 L117.361381,72.8349281 C117.794829,72.6519686 118.155697,72.3669939 118.428142,72.0189816 C119.039531,71.5220927 119.430941,70.7590139 119.430941,69.9033544 L119.430941,60.8406771 L129.521757,56.7095502 L129.521757,131.00799 L119.430941,135.139117 Z M114.07663,60.7633604 L114.07663,66.8148205 L104.397683,62.852311 L104.397683,56.5578433 L112.145218,59.7296429 L113.85177,60.4282962 C113.919634,60.5463553 113.994872,60.6581656 114.07663,60.7633604 Z M66.7115725,88.3398096 L66.7115725,60.8406771 L76.802389,56.7095502 L76.802389,84.0804502 L66.7115725,88.3398096 Z M82.1566999,75.9358658 L101.600576,68.0047397 C101.623411,68.0147815 101.646437,68.024557 101.669652,68.034061 L108.344183,70.7665785 L82.1566999,81.8203819 L82.1566999,75.9358658 Z M109.47915,52.3395774 L117.081183,49.2273453 L124.604698,52.4239765 L117.145002,55.4779366 L114.30632,54.3157951 L109.47915,52.3395774 Z M56.759782,52.3395774 L64.3618149,49.2273453 L71.8853301,52.4239765 L64.425634,55.4779366 L61.5869518,54.3157951 L56.759782,52.3395774 Z M29,0 L153,0 C169.016258,-2.94213882e-15 182,12.9837423 182,29 L182,154 C182,170.016258 169.016258,183 153,183 L29,183 C12.9837423,183 1.96142588e-15,170.016258 0,154 L-3.55271368e-15,29 C-5.51413956e-15,12.9837423 12.9837423,2.94213882e-15 29,0 Z"
          }
        }
      },
      "haiku:6c7889c7a7ab": {
        x1: { "0": { value: "2.61028491%" } },
        y1: { "0": { value: "50%" } },
        x2: { "0": { value: "62.5639151%" } },
        y2: { "0": { value: "50%" } }
      },
      "haiku:278db1d85d24": {
        "stop-color": { "0": { value: "#343F41" } },
        "stop-opacity": { "0": { value: "0" } },
        offset: { "0": { value: "0%" } }
      },
      "haiku:377311492e24": {
        "stop-color": { "0": { value: "#313F41" } },
        offset: { "0": { value: "100%" } }
      },
      "haiku:3cabac107d4f": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:d0601968d8f7": {
        fill: { "0": { value: "url(#linearGradient-1-4b110f)" } },
        x: { "0": { value: "-1" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 21 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 600 } },
        "sizeMode.y": { "0": { value: 1 } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "e4a9e4d8baa7", "haiku-title": "metapoem2" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          source: "designs/metapoem2.sketch.contents/slices/keyframes_all.svg",
          "haiku-id": "b7911dbe85c1",
          "haiku-title": "keyframes_all"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "f54197c957d0" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "629a84704787", id: "path-1-72e505" },
                children: []
              },
              {
                elementName: "rect",
                attributes: { "haiku-id": "7e7749478051", id: "path-3-72e505" },
                children: []
              },
              {
                elementName: "rect",
                attributes: { "haiku-id": "941ee8ebad66", id: "path-5-72e505" },
                children: []
              },
              {
                elementName: "rect",
                attributes: { "haiku-id": "a3e3986b0da9", id: "path-7-72e505" },
                children: []
              },
              {
                elementName: "rect",
                attributes: { "haiku-id": "88e126c34cf5", id: "path-9-72e505" },
                children: []
              },
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "52d8c85c536f",
                  id: "path-11-72e505"
                },
                children: []
              },
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "fb2d36c17c72",
                  id: "path-13-72e505"
                },
                children: []
              },
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "15f989d1722a",
                  id: "path-15-72e505"
                },
                children: []
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "5ac33b0c98df", id: "Artboard" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "f2e7c4539481", id: "keyframes_all" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "cc2f47922983",
                      id: "flat-copy-3"
                    },
                    children: [
                      {
                        elementName: "mask",
                        attributes: {
                          "haiku-id": "dcc7ce6a433f",
                          id: "mask-2-72e505"
                        },
                        children: [
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-1-72e505",
                              "haiku-id": "1ef8cbef6a20"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-1-72e505",
                          "haiku-id": "f15ee3397dc6",
                          id: "Mask"
                        },
                        children: []
                      },
                      {
                        elementName: "rect",
                        attributes: {
                          "haiku-id": "ed7e1c115348",
                          id: "Rectangle"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "896ee1e08484", id: "elastic" },
                    children: [
                      {
                        elementName: "mask",
                        attributes: {
                          "haiku-id": "9242317e7ffc",
                          id: "mask-4"
                        },
                        children: [
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-3-72e505",
                              "haiku-id": "9a017436f814"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-3-72e505",
                          "haiku-id": "a103dfac0057",
                          id: "Mask"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "00c02b46a379",
                          id: "Diamond-Copy-20"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "97c5f005fab3",
                          id: "Diamond-Copy-19"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "f90e362936df",
                          id: "Path-29-Copy"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "38cf3eeea7e7", id: "double" },
                    children: [
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "b442e2268613",
                          id: "Combined-Shape"
                        },
                        children: [
                          {
                            elementName: "mask",
                            attributes: {
                              "haiku-id": "2f3736bdcbf3",
                              id: "mask-6-72e505"
                            },
                            children: [
                              {
                                elementName: "use",
                                attributes: {
                                  "xlink:href": "#path-5-72e505",
                                  "haiku-id": "a0950f13c201"
                                },
                                children: []
                              }
                            ]
                          },
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-5-72e505",
                              "haiku-id": "3acd0606791a",
                              id: "Mask"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "86ab1c0eec2c" },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "3cedf7e1579f",
                          id: "Combined-Shape-Copy-2"
                        },
                        children: [
                          {
                            elementName: "mask",
                            attributes: {
                              "haiku-id": "1d7dd9723ef9",
                              id: "mask-8-72e505"
                            },
                            children: [
                              {
                                elementName: "use",
                                attributes: {
                                  "xlink:href": "#path-7-72e505",
                                  "haiku-id": "6808a422504a"
                                },
                                children: []
                              }
                            ]
                          },
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-7-72e505",
                              "haiku-id": "563a77fb5e3b",
                              id: "Mask"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "7f2a95374f37",
                              id: "Combined-Shape"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "ca5a4dffb5dc",
                          id: "Diamond-Copy-13"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "81ec1e5b73f3",
                          id: "Diamond-Copy-14"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "99e15a29e08b",
                          id: "Diamond-Copy-12"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "d809fd973eae", id: "flat" },
                    children: [
                      {
                        elementName: "mask",
                        attributes: {
                          "haiku-id": "ddf0a49140f1",
                          id: "mask-10-72e505"
                        },
                        children: [
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-9-72e505",
                              "haiku-id": "9aabf0df55df"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-9-72e505",
                          "haiku-id": "75124ca0ecdc",
                          id: "Mask"
                        },
                        children: []
                      },
                      {
                        elementName: "rect",
                        attributes: {
                          "haiku-id": "62fbc594aada",
                          id: "Rectangle"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "353149e79242",
                          id: "Diamond-Copy-20"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "5515651d7710",
                          id: "Diamond-Copy-19"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "606df247af22", id: "ease_out" },
                    children: [
                      {
                        elementName: "mask",
                        attributes: {
                          "haiku-id": "0f091d625c0b",
                          id: "mask-12-72e505"
                        },
                        children: [
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-11-72e505",
                              "haiku-id": "0ca806e9039b"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-11-72e505",
                          "haiku-id": "26f5dc8d4210",
                          id: "Mask"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "82c77f50edb0",
                          id: "Path-25-Copy-3"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "6792b8d7e4c1",
                          id: "Diamond-Copy-20"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "cde64dec82b9", id: "ease_in" },
                    children: [
                      {
                        elementName: "mask",
                        attributes: {
                          "haiku-id": "59a577bd8718",
                          id: "mask-14-72e505"
                        },
                        children: [
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-13-72e505",
                              "haiku-id": "16870010062a"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-13-72e505",
                          "haiku-id": "ae9eae5fa15e",
                          id: "Mask"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "16ea2266c5f1",
                          id: "Path-25-Copy-3"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "a69582ce7566",
                          id: "Diamond-Copy-20"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "bb86344e60cf",
                      id: "Diamond-Copy-20"
                    },
                    children: []
                  },
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "74c0a59613ae",
                      id: "pinky_gray"
                    },
                    children: [
                      {
                        elementName: "mask",
                        attributes: {
                          "haiku-id": "28adc39dff86",
                          id: "mask-16"
                        },
                        children: [
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-15-72e505",
                              "haiku-id": "63fa22dfda4a"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-15-72e505",
                          "haiku-id": "5ee9c922b23e",
                          id: "Mask"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "7e3c6c31e3b0",
                          id: "Path-20-Copy-2"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "37666eecc513",
                          id: "Diamond-Copy-16"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "52ce42eb09c4",
                          id: "keyframe_pink-copy"
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
          source: "designs/metapoem2.sketch.contents/slices/keyframes.svg",
          "haiku-id": "2167816a0784",
          "haiku-title": "keyframes"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "42d2aeda3280" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "c91a96a305f9", id: "path-1-4487c7" },
                children: []
              },
              {
                elementName: "rect",
                attributes: { "haiku-id": "25064df7ea03", id: "path-3-4487c7" },
                children: []
              },
              {
                elementName: "rect",
                attributes: { "haiku-id": "02fb1789739f", id: "path-5-4487c7" },
                children: []
              },
              {
                elementName: "rect",
                attributes: { "haiku-id": "5881b22b5ad5", id: "path-7-4487c7" },
                children: []
              },
              {
                elementName: "rect",
                attributes: { "haiku-id": "7d415a40fdfd", id: "path-9-4487c7" },
                children: []
              },
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "6efa94b3d818",
                  id: "path-11-4487c7"
                },
                children: []
              },
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "43f92801bd85",
                  id: "path-13-4487c7"
                },
                children: []
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "51f641db70ec", id: "Artboard" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "45eda3611c6b", id: "keyframes" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "09da238f64af",
                      id: "flat-copy-3"
                    },
                    children: [
                      {
                        elementName: "mask",
                        attributes: {
                          "haiku-id": "ea92f82ceb29",
                          id: "mask-2-4487c7"
                        },
                        children: [
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-1-4487c7",
                              "haiku-id": "a806dc3650bc"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-1-4487c7",
                          "haiku-id": "b5b9f855b69d",
                          id: "Mask"
                        },
                        children: []
                      },
                      {
                        elementName: "rect",
                        attributes: {
                          "haiku-id": "9d7adb36d660",
                          id: "Rectangle"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "aac60f40a348", id: "elastic" },
                    children: [
                      {
                        elementName: "mask",
                        attributes: {
                          "haiku-id": "0bc157211e25",
                          id: "mask-4"
                        },
                        children: [
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-3-4487c7",
                              "haiku-id": "86e16744df18"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-3-4487c7",
                          "haiku-id": "11600e03ab52",
                          id: "Mask"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "64c4e2ee8373",
                          id: "Diamond-Copy-20"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "6efde9b57112",
                          id: "Diamond-Copy-19"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "6a1b182c28d4",
                          id: "Path-29-Copy"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "fb40d1d5b28b", id: "double" },
                    children: [
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "823412c5892d",
                          id: "Combined-Shape"
                        },
                        children: [
                          {
                            elementName: "mask",
                            attributes: {
                              "haiku-id": "f1950b51c63d",
                              id: "mask-6-4487c7"
                            },
                            children: [
                              {
                                elementName: "use",
                                attributes: {
                                  "xlink:href": "#path-5-4487c7",
                                  "haiku-id": "a27a384c6511"
                                },
                                children: []
                              }
                            ]
                          },
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-5-4487c7",
                              "haiku-id": "dc7f86566faa",
                              id: "Mask"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "b614aab15f2d" },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "21d4fccbd55b",
                          id: "Combined-Shape-Copy-2"
                        },
                        children: [
                          {
                            elementName: "mask",
                            attributes: {
                              "haiku-id": "84cf6f6042ab",
                              id: "mask-8-4487c7"
                            },
                            children: [
                              {
                                elementName: "use",
                                attributes: {
                                  "xlink:href": "#path-7-4487c7",
                                  "haiku-id": "63377b7b841a"
                                },
                                children: []
                              }
                            ]
                          },
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-7-4487c7",
                              "haiku-id": "de79ea9e3ac6",
                              id: "Mask"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "81a5039bd3a2",
                              id: "Combined-Shape"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "e3555d5703ce",
                          id: "Diamond-Copy-13"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "bc19cbb1c642",
                          id: "Diamond-Copy-14"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "a2905ac5d230",
                          id: "Diamond-Copy-12"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "ac1b8fe991a2", id: "flat" },
                    children: [
                      {
                        elementName: "mask",
                        attributes: {
                          "haiku-id": "46c924b35b8f",
                          id: "mask-10-4487c7"
                        },
                        children: [
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-9-4487c7",
                              "haiku-id": "25578c6b0b1f"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-9-4487c7",
                          "haiku-id": "6391f490fe74",
                          id: "Mask"
                        },
                        children: []
                      },
                      {
                        elementName: "rect",
                        attributes: {
                          "haiku-id": "633ca5442266",
                          id: "Rectangle"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "286232d4d992",
                          id: "Diamond-Copy-20"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "237e097f776a",
                          id: "Diamond-Copy-19"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "9da342ee0c1d", id: "ease_out" },
                    children: [
                      {
                        elementName: "mask",
                        attributes: {
                          "haiku-id": "ca19e0d045b2",
                          id: "mask-12-4487c7"
                        },
                        children: [
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-11-4487c7",
                              "haiku-id": "764ef647e631"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-11-4487c7",
                          "haiku-id": "9ab7733d0e33",
                          id: "Mask"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "514038c3c1ae",
                          id: "Path-25-Copy-3"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "ad506a0c75e6",
                          id: "Diamond-Copy-20"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "57d2e290aa7d", id: "ease_in" },
                    children: [
                      {
                        elementName: "mask",
                        attributes: {
                          "haiku-id": "66efa94bd319",
                          id: "mask-14-4487c7"
                        },
                        children: [
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-13-4487c7",
                              "haiku-id": "871b3da7e7e5"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-13-4487c7",
                          "haiku-id": "6a7ad3cb96b8",
                          id: "Mask"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "bc26fd1e089b",
                          id: "Path-25-Copy-3"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "220dc7a034de",
                          id: "Diamond-Copy-20"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "ff81784289ed",
                      id: "Diamond-Copy-20"
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
          source: "designs/metapoem2.sketch.contents/slices/pinky_gray.svg",
          "haiku-id": "593166b1dfce",
          "haiku-title": "pinky_gray"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "235f6b13b78b" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "f0a02db882c4", id: "path-1-346889" },
                children: []
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "529edd1f364f", id: "Artboard" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "f5f679e6b223", id: "pinky_gray" },
                children: [
                  {
                    elementName: "mask",
                    attributes: { "haiku-id": "4b6ce565d5e6", id: "mask-2" },
                    children: [
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-1-346889",
                          "haiku-id": "a0f514585f1d"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#path-1-346889",
                      "haiku-id": "97e89ff50cce",
                      id: "Mask"
                    },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "13716833aefa",
                      id: "Path-20-Copy-2"
                    },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "c6a9d1667ac1",
                      id: "Diamond-Copy-16"
                    },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "ad1d83ee5faf",
                      id: "keyframe_pink-copy"
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
          source: "designs/metapoem2.sketch.contents/slices/pinky_pill.svg",
          "haiku-id": "e4e7d336c97f",
          "haiku-title": "pinky_pill"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "2a682b5813fb" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "4fe6cac1e71d", id: "path-1-5963a8" },
                children: []
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "c40d90bcd9ea", id: "Artboard" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "2a015f60f839", id: "pinky" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "dc299e1c1a84",
                      id: "pinky_pill"
                    },
                    children: [
                      {
                        elementName: "mask",
                        attributes: {
                          "haiku-id": "f93e2a360145",
                          id: "mask-2"
                        },
                        children: [
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-1-5963a8",
                              "haiku-id": "fe037e7cb953"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-1-5963a8",
                          "haiku-id": "cb1f494889a2",
                          id: "Mask"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "790b4ebb8e22",
                          id: "pinky_curve"
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
          source: "designs/metapoem2.sketch.contents/slices/keyframe_pink.svg",
          "haiku-id": "81677cabe8c7",
          "haiku-title": "keyframe_pink"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "ed33cb83f4f4", id: "Artboard" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "eab4a49b170d", id: "pinky" },
                children: [
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "280032bba6df",
                      id: "keyframe_pink"
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
          source: "designs/metapoem2.sketch.contents/slices/keyframe_pink.svg",
          "haiku-id": "632812278d3b",
          "haiku-title": "keyframe_pink"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "533317a76846", id: "Artboard" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "74f706cb7993", id: "pinky" },
                children: [
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "ca81cd694051",
                      id: "keyframe_pink"
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
          source: "designs/metapoem2.sketch.contents/slices/cursor.svg",
          "haiku-id": "31515d56dab8",
          "haiku-title": "cursor"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "f3b25027bd3c" },
            children: [
              {
                elementName: "path",
                attributes: { "haiku-id": "b9e6b0591379", id: "path-1-a650bf" },
                children: []
              },
              {
                elementName: "filter",
                attributes: {
                  "haiku-id": "2f9e895d1e16",
                  id: "filter-2-a650bf"
                },
                children: [
                  {
                    elementName: "feOffset",
                    attributes: { "haiku-id": "b71d685293cf" },
                    children: []
                  },
                  {
                    elementName: "feGaussianBlur",
                    attributes: { "haiku-id": "fcf2f56a4f67" },
                    children: []
                  },
                  {
                    elementName: "feColorMatrix",
                    attributes: { "haiku-id": "90396720c0cf", type: "matrix" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "859d2b065ca9", id: "Artboard" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "abab72303df1", id: "cursor" },
                children: [
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "4c4b53c51fb2", id: "Shape" },
                    children: [
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-1-a650bf",
                          "haiku-id": "35b63f0e8e41"
                        },
                        children: []
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-1-a650bf",
                          "haiku-id": "3d4a8c97e987"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "ba9487176f84",
                      id: "Shape-Copy"
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
          source: "designs/metapoem2.sketch.contents/slices/click.svg",
          "haiku-id": "18009d2058c8",
          "haiku-title": "click"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "9c9e0e6f1492" },
            children: [
              {
                elementName: "filter",
                attributes: {
                  "haiku-id": "d2e2ce9efefa",
                  id: "filter-1-8e83f2"
                },
                children: [
                  {
                    elementName: "feGaussianBlur",
                    attributes: { "haiku-id": "e4b80047aec4" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "970e1e8d08a9", id: "Artboard" },
            children: [
              {
                elementName: "path",
                attributes: { "haiku-id": "5a1c055a2f96", id: "click" },
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
          source: "designs/metapoem2.sketch.contents/slices/keyframe_big.svg",
          "haiku-id": "7a129d7b810d",
          "haiku-title": "keyframe_big"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "18740459a80a", id: "Artboard" },
            children: [
              {
                elementName: "path",
                attributes: { "haiku-id": "0d44e69ddcd4", id: "keyframe_big" },
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
          source: "designs/metapoem2.sketch.contents/slices/keyframes_all_after.svg",
          "haiku-id": "061928db4be5",
          "haiku-title": "keyframes_all_after"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "4d8b832d2cb1" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "038a3c470a52", id: "path-1-18a4d8" },
                children: []
              },
              {
                elementName: "rect",
                attributes: { "haiku-id": "7cd1b048cbae", id: "path-3-18a4d8" },
                children: []
              },
              {
                elementName: "rect",
                attributes: { "haiku-id": "2465991194f3", id: "path-5-18a4d8" },
                children: []
              },
              {
                elementName: "rect",
                attributes: { "haiku-id": "abd00996b690", id: "path-7-18a4d8" },
                children: []
              },
              {
                elementName: "rect",
                attributes: { "haiku-id": "46351729f24d", id: "path-9-18a4d8" },
                children: []
              },
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "3983c9599ef1",
                  id: "path-11-18a4d8"
                },
                children: []
              },
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "8b609a529949",
                  id: "path-13-18a4d8"
                },
                children: []
              },
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "db8855ece859",
                  id: "path-15-18a4d8"
                },
                children: []
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "560990adf0c7", id: "Artboard" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "406bb25c908d",
                  id: "keyframes_all_after"
                },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "b4958d75ae3e",
                      id: "flat-copy-3"
                    },
                    children: [
                      {
                        elementName: "mask",
                        attributes: {
                          "haiku-id": "489362c341d2",
                          id: "mask-2-18a4d8"
                        },
                        children: [
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-1-18a4d8",
                              "haiku-id": "22e49587c2de"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-1-18a4d8",
                          "haiku-id": "8594dc813f62",
                          id: "Mask"
                        },
                        children: []
                      },
                      {
                        elementName: "rect",
                        attributes: {
                          "haiku-id": "e43a359fc5fb",
                          id: "Rectangle"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "a30f2b1d97c7", id: "elastic" },
                    children: [
                      {
                        elementName: "mask",
                        attributes: {
                          "haiku-id": "f176cce6ff46",
                          id: "mask-4"
                        },
                        children: [
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-3-18a4d8",
                              "haiku-id": "2bf5e3a0582d"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-3-18a4d8",
                          "haiku-id": "d80fba014fe8",
                          id: "Mask"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "a3a199768eb7",
                          id: "Diamond-Copy-20"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "b31dfc7927e1",
                          id: "Diamond-Copy-19"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "3ae9796362be",
                          id: "Path-29-Copy"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "3b2e0033821b", id: "double" },
                    children: [
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "879ef59943ad",
                          id: "Combined-Shape"
                        },
                        children: [
                          {
                            elementName: "mask",
                            attributes: {
                              "haiku-id": "4ffeb88d73ee",
                              id: "mask-6-18a4d8"
                            },
                            children: [
                              {
                                elementName: "use",
                                attributes: {
                                  "xlink:href": "#path-5-18a4d8",
                                  "haiku-id": "9ee2d64128bd"
                                },
                                children: []
                              }
                            ]
                          },
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-5-18a4d8",
                              "haiku-id": "9b33ef29205c",
                              id: "Mask"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "80963828aaac" },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "9f7fa6f41e77",
                          id: "Combined-Shape-Copy-2"
                        },
                        children: [
                          {
                            elementName: "mask",
                            attributes: {
                              "haiku-id": "c6a15ef74a22",
                              id: "mask-8-18a4d8"
                            },
                            children: [
                              {
                                elementName: "use",
                                attributes: {
                                  "xlink:href": "#path-7-18a4d8",
                                  "haiku-id": "024a42f01e4b"
                                },
                                children: []
                              }
                            ]
                          },
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-7-18a4d8",
                              "haiku-id": "b876962f38f5",
                              id: "Mask"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "855264a88c83",
                              id: "Combined-Shape"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "a5d4604d76cf",
                          id: "Diamond-Copy-13"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "9a2a10796c49",
                          id: "Diamond-Copy-14"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "821faa72f9e3",
                          id: "Diamond-Copy-12"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "e2ad4afc128f", id: "flat" },
                    children: [
                      {
                        elementName: "mask",
                        attributes: {
                          "haiku-id": "19e02c20c6e2",
                          id: "mask-10-18a4d8"
                        },
                        children: [
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-9-18a4d8",
                              "haiku-id": "890344bad665"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-9-18a4d8",
                          "haiku-id": "716125f24f94",
                          id: "Mask"
                        },
                        children: []
                      },
                      {
                        elementName: "rect",
                        attributes: {
                          "haiku-id": "5f74cb5c59dc",
                          id: "Rectangle"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "873f927d07e7",
                          id: "Diamond-Copy-20"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "73646488547f",
                          id: "Diamond-Copy-19"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "55bed3c1f7b1", id: "ease_out" },
                    children: [
                      {
                        elementName: "mask",
                        attributes: {
                          "haiku-id": "ae1776c740c8",
                          id: "mask-12-18a4d8"
                        },
                        children: [
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-11-18a4d8",
                              "haiku-id": "f410a4001826"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-11-18a4d8",
                          "haiku-id": "3faa72675b35",
                          id: "Mask"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "9051b0c16305",
                          id: "Path-25-Copy-3"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "08d8eebba2b9",
                          id: "Diamond-Copy-20"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "b1cbe3ca1c06", id: "ease_in" },
                    children: [
                      {
                        elementName: "mask",
                        attributes: {
                          "haiku-id": "38d0c3704c6c",
                          id: "mask-14-18a4d8"
                        },
                        children: [
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-13-18a4d8",
                              "haiku-id": "954c10c4768f"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-13-18a4d8",
                          "haiku-id": "4b7af919a829",
                          id: "Mask"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "418eef040ad9",
                          id: "Path-25-Copy-3"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "1b3715fb59ed",
                          id: "Diamond-Copy-20"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "f25f30e7fd83",
                      id: "Diamond-Copy-20"
                    },
                    children: []
                  },
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "e1ddd610eb35",
                      id: "pinky_gray-copy"
                    },
                    children: [
                      {
                        elementName: "mask",
                        attributes: {
                          "haiku-id": "86b3cc36df3d",
                          id: "mask-16"
                        },
                        children: [
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-15-18a4d8",
                              "haiku-id": "262f78dce27b"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-15-18a4d8",
                          "haiku-id": "9a08426ef92f",
                          id: "Mask"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "5b3e0b5d6bca",
                          id: "Path-20-Copy-2"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "e7aa0853de54",
                          id: "Diamond-Copy-16"
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
          source: "designs/metapoem2.sketch.contents/slices/exp_lab_box.svg",
          "haiku-id": "6a7baa44cf2b",
          "haiku-title": "exp_lab_box"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "55d396afdd37", id: "Artboard-2" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "124bb9892eb1", id: "expression" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "d33066dff5e0",
                      id: "active-row"
                    },
                    children: [
                      {
                        elementName: "g",
                        attributes: { "haiku-id": "4b6e6d351ac8", id: "Group" },
                        children: [
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "57d23f980733",
                              id: "exp_lab_box"
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
          source: "designs/metapoem2.sketch.contents/slices/exp_input.svg",
          "haiku-id": "17fda90a18d5",
          "haiku-title": "exp_input"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "8cbb4d80e610" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "dd656ce1ecee", id: "path-1-c225e4" },
                children: []
              },
              {
                elementName: "filter",
                attributes: {
                  "haiku-id": "4fde5a24c37d",
                  id: "filter-2-c225e4"
                },
                children: [
                  {
                    elementName: "feGaussianBlur",
                    attributes: { "haiku-id": "2f712da3ea0d" },
                    children: []
                  },
                  {
                    elementName: "feOffset",
                    attributes: { "haiku-id": "040189d85a81" },
                    children: []
                  },
                  {
                    elementName: "feComposite",
                    attributes: { "haiku-id": "ebd43d1ad07a" },
                    children: []
                  },
                  {
                    elementName: "feColorMatrix",
                    attributes: { "haiku-id": "f771a5eb1a83", type: "matrix" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "0abbc409ed61", id: "Artboard-2" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "9ad531cd9090", id: "expression" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "39f1dc2f448e",
                      id: "active-row"
                    },
                    children: [
                      {
                        elementName: "g",
                        attributes: { "haiku-id": "2f12ea913dc2", id: "Group" },
                        children: [
                          {
                            elementName: "g",
                            attributes: {
                              "haiku-id": "61ad79f17b7b",
                              id: "exp_input"
                            },
                            children: [
                              {
                                elementName: "use",
                                attributes: {
                                  "xlink:href": "#path-1-c225e4",
                                  "haiku-id": "22108cce02b2"
                                },
                                children: []
                              },
                              {
                                elementName: "use",
                                attributes: {
                                  "xlink:href": "#path-1-c225e4",
                                  "haiku-id": "5111a9335672"
                                },
                                children: []
                              },
                              {
                                elementName: "use",
                                attributes: {
                                  "xlink:href": "#path-1-c225e4",
                                  "haiku-id": "c9f1d4914a01"
                                },
                                children: []
                              },
                              {
                                elementName: "rect",
                                attributes: { "haiku-id": "7755ae3e9bb2" },
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
          }
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          source: "designs/metapoem2.sketch.contents/slices/ex_label.svg",
          "haiku-id": "b334c4fa4453",
          "haiku-title": "ex_label"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "ea4738cba30c", id: "Artboard-2" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "0f3e15266282", id: "expression" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "b4c57659973a",
                      id: "active-row"
                    },
                    children: [
                      {
                        elementName: "g",
                        attributes: { "haiku-id": "8253f0c13261", id: "Group" },
                        children: [
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "718ea8b23e10",
                              id: "ex_label"
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
          source: "designs/metapoem2.sketch.contents/slices/exp_shadow.svg",
          "haiku-id": "8d326c2993a5",
          "haiku-title": "exp_shadow"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "177c0aa5fef9" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "f2f67fad6047", id: "path-1-6e0c15" },
                children: []
              },
              {
                elementName: "filter",
                attributes: {
                  "haiku-id": "9e46d9290f61",
                  id: "filter-2-6e0c15"
                },
                children: [
                  {
                    elementName: "feOffset",
                    attributes: { "haiku-id": "6f8d36795834" },
                    children: []
                  },
                  {
                    elementName: "feGaussianBlur",
                    attributes: { "haiku-id": "427355927a7f" },
                    children: []
                  },
                  {
                    elementName: "feColorMatrix",
                    attributes: { "haiku-id": "10df6baf17ab", type: "matrix" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "523497a1a2a4", id: "Artboard-2" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "9de19ccd2de9", id: "expression" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "546ff19d316c",
                      id: "active-row"
                    },
                    children: [
                      {
                        elementName: "g",
                        attributes: { "haiku-id": "33ceb07f4c7e", id: "Group" },
                        children: [
                          {
                            elementName: "g",
                            attributes: {
                              "haiku-id": "02bcc99a9003",
                              id: "exp_shadow"
                            },
                            children: [
                              {
                                elementName: "use",
                                attributes: {
                                  "xlink:href": "#path-1-6e0c15",
                                  "haiku-id": "47e1264856d3"
                                },
                                children: []
                              },
                              {
                                elementName: "use",
                                attributes: {
                                  "xlink:href": "#path-1-6e0c15",
                                  "haiku-id": "d5bf8a8ce997"
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
          }
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          source: "designs/metapoem2.sketch.contents/slices/typer.svg",
          "haiku-id": "830339d042ae",
          "haiku-title": "typer"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "756ab14333c2", id: "Artboard-2" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "36ea2ce78089", id: "expression" },
                children: [
                  {
                    elementName: "path",
                    attributes: { "haiku-id": "ac9f161a0f10", id: "typer" },
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
          source: "designs/metapoem2.sketch.contents/slices/=.svg",
          "haiku-id": "dc742dcd9f12",
          "haiku-title": "="
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "e81053e051a8", id: "Artboard-2" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "c1fbca40e05f", id: "expression" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "692610a196d5",
                      id: "active-row"
                    },
                    children: [
                      {
                        elementName: "g",
                        attributes: { "haiku-id": "1aefcb1d7b66", id: "Group" },
                        children: [
                          {
                            elementName: "g",
                            attributes: {
                              "haiku-id": "627481c53bd9",
                              id: "text"
                            },
                            children: [
                              {
                                elementName: "path",
                                attributes: {
                                  "haiku-id": "854ff247d01c",
                                  id: "="
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
          }
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          source: "designs/metapoem2.sketch.contents/slices/evaluation.svg",
          "haiku-id": "75827fef0c84",
          "haiku-title": "evaluation"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "f48d8bc3674e" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "369b530a41be", id: "path-1-632e9a" },
                children: []
              },
              {
                elementName: "filter",
                attributes: {
                  "haiku-id": "ca03764159a2",
                  id: "filter-2-632e9a"
                },
                children: [
                  {
                    elementName: "feOffset",
                    attributes: { "haiku-id": "65b373f52be4" },
                    children: []
                  },
                  {
                    elementName: "feGaussianBlur",
                    attributes: { "haiku-id": "a118f5f072ec" },
                    children: []
                  },
                  {
                    elementName: "feColorMatrix",
                    attributes: { "haiku-id": "7f08e30bfad1", type: "matrix" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "6e65c773e080", id: "Artboard-2" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "00b6129ac4ab", id: "expression" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "b49ad30c5781",
                      id: "active-row"
                    },
                    children: [
                      {
                        elementName: "g",
                        attributes: { "haiku-id": "7c49203cbbf4", id: "Group" },
                        children: [
                          {
                            elementName: "g",
                            attributes: {
                              "haiku-id": "cdc7440aac60",
                              id: "evaluation"
                            },
                            children: [
                              {
                                elementName: "g",
                                attributes: {
                                  "haiku-id": "74d6819e5199",
                                  id: "Rectangle-23"
                                },
                                children: [
                                  {
                                    elementName: "use",
                                    attributes: {
                                      "xlink:href": "#path-1-632e9a",
                                      "haiku-id": "c94dba50d51a"
                                    },
                                    children: []
                                  },
                                  {
                                    elementName: "use",
                                    attributes: {
                                      "xlink:href": "#path-1-632e9a",
                                      "haiku-id": "85cf2251288b"
                                    },
                                    children: []
                                  }
                                ]
                              },
                              {
                                elementName: "polygon",
                                attributes: {
                                  "haiku-id": "99a75dbfd7ef",
                                  id: "Path-2"
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
          }
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          source: "designs/metapoem2.sketch.contents/slices/elipsis dot.svg",
          "haiku-id": "2d3910d542ef",
          "haiku-title": "elipsis dot"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "50548fb0bfae", id: "Artboard-2" },
            children: [
              {
                elementName: "circle",
                attributes: { "haiku-id": "6128cc109342", id: "elipsis-dot" },
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
          source: "designs/metapoem2.sketch.contents/slices/elipsis dot.svg",
          "haiku-id": "2d3910d542ef-26e560",
          "haiku-title": "elipsis dot"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "2a31a0bf8d87", id: "Artboard-2" },
            children: [
              {
                elementName: "circle",
                attributes: { "haiku-id": "425da8f7ddd5", id: "elipsis-dot" },
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
          source: "designs/metapoem2.sketch.contents/slices/elipsis dot.svg",
          "haiku-id": "2d3910d542ef-d9d426",
          "haiku-title": "elipsis dot"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "4ec38dd516d7", id: "Artboard-2" },
            children: [
              {
                elementName: "circle",
                attributes: { "haiku-id": "6f471720adfe", id: "elipsis-dot" },
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
          source: "designs/metapoem2.sketch.contents/slices/mouseX.svg",
          "haiku-id": "bbc639cf4dd6",
          "haiku-title": "mouseX"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "bcd6a8fc802a", id: "Artboard-2" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "76d4eac74505", id: "expression" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "eecefcf1e738",
                      id: "active-row"
                    },
                    children: [
                      {
                        elementName: "g",
                        attributes: { "haiku-id": "592a49d2f9e1", id: "Group" },
                        children: [
                          {
                            elementName: "g",
                            attributes: {
                              "haiku-id": "80b3f0578bdf",
                              id: "curve"
                            },
                            children: [
                              {
                                elementName: "g",
                                attributes: {
                                  "haiku-id": "c56a986b01a2",
                                  id: "done"
                                },
                                children: [
                                  {
                                    elementName: "path",
                                    attributes: {
                                      "haiku-id": "578176e6c702",
                                      id: "mouseX"
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
          source: "designs/metapoem2.sketch.contents/slices/m.svg",
          "haiku-id": "713fed8ac321",
          "haiku-title": "m"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "61c21c6d1a3e", id: "Artboard-2" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "ba56ad3c1aca", id: "expression" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "441b60e78a1d",
                      id: "active-row"
                    },
                    children: [
                      {
                        elementName: "g",
                        attributes: { "haiku-id": "3c2d1307c70f", id: "Group" },
                        children: [
                          {
                            elementName: "g",
                            attributes: {
                              "haiku-id": "c268ae2acf60",
                              id: "curve"
                            },
                            children: [
                              {
                                elementName: "g",
                                attributes: {
                                  "haiku-id": "8de6798ef877",
                                  id: "done"
                                },
                                children: [
                                  {
                                    elementName: "path",
                                    attributes: {
                                      "haiku-id": "678344e53259",
                                      id: "m"
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
          source: "designs/metapoem2.sketch.contents/slices/o.svg",
          "haiku-id": "c4e8215e7ccd",
          "haiku-title": "o"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "0f8d23979ff8", id: "Artboard-2" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "912ec87a7bc2", id: "expression" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "442cb2d9faf1",
                      id: "active-row"
                    },
                    children: [
                      {
                        elementName: "g",
                        attributes: { "haiku-id": "85cd43d0ac6a", id: "Group" },
                        children: [
                          {
                            elementName: "g",
                            attributes: {
                              "haiku-id": "0422273899f4",
                              id: "curve"
                            },
                            children: [
                              {
                                elementName: "g",
                                attributes: {
                                  "haiku-id": "87d4bd679a14",
                                  id: "done"
                                },
                                children: [
                                  {
                                    elementName: "path",
                                    attributes: {
                                      "haiku-id": "d2b81f865fea",
                                      id: "o"
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
          source: "designs/metapoem2.sketch.contents/slices/u.svg",
          "haiku-id": "24c9175f69ec",
          "haiku-title": "u"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "948a2fa02107", id: "Artboard-2" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "a32a2742f251", id: "expression" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "aa16f1fc74c2",
                      id: "active-row"
                    },
                    children: [
                      {
                        elementName: "g",
                        attributes: { "haiku-id": "35bcc018883c", id: "Group" },
                        children: [
                          {
                            elementName: "g",
                            attributes: {
                              "haiku-id": "1474c4f02f14",
                              id: "curve"
                            },
                            children: [
                              {
                                elementName: "g",
                                attributes: {
                                  "haiku-id": "8743ec0b2869",
                                  id: "done"
                                },
                                children: [
                                  {
                                    elementName: "path",
                                    attributes: {
                                      "haiku-id": "b58cc1bc128d",
                                      id: "u"
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
          source: "designs/metapoem2.sketch.contents/slices/s.svg",
          "haiku-id": "e3f962d5265c",
          "haiku-title": "s"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "7e38248f09c6", id: "Artboard-2" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "580045054505", id: "expression" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "f9a839ce0000",
                      id: "active-row"
                    },
                    children: [
                      {
                        elementName: "g",
                        attributes: { "haiku-id": "4f334050ca9b", id: "Group" },
                        children: [
                          {
                            elementName: "g",
                            attributes: {
                              "haiku-id": "621a404515e0",
                              id: "curve"
                            },
                            children: [
                              {
                                elementName: "g",
                                attributes: {
                                  "haiku-id": "766fc8e50395",
                                  id: "done"
                                },
                                children: [
                                  {
                                    elementName: "path",
                                    attributes: {
                                      "haiku-id": "5d5b5e599b07",
                                      id: "s"
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
          source: "designs/metapoem2.sketch.contents/slices/e.svg",
          "haiku-id": "9504f28bb0e4",
          "haiku-title": "e"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "c5b3cf852ed7", id: "Artboard-2" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "c57a95afadf1", id: "expression" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "b7201a045290",
                      id: "active-row"
                    },
                    children: [
                      {
                        elementName: "g",
                        attributes: { "haiku-id": "94072d0918b4", id: "Group" },
                        children: [
                          {
                            elementName: "g",
                            attributes: {
                              "haiku-id": "89305df7fac4",
                              id: "curve"
                            },
                            children: [
                              {
                                elementName: "g",
                                attributes: {
                                  "haiku-id": "1ae49bc1386c",
                                  id: "done"
                                },
                                children: [
                                  {
                                    elementName: "path",
                                    attributes: {
                                      "haiku-id": "d92e71fcba8e",
                                      id: "e"
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
          source: "designs/metapoem2.sketch.contents/slices/X.svg",
          "haiku-id": "8cf12bb597a1",
          "haiku-title": "X"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "19d391fbf852", id: "Artboard-2" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "0cfd98d04731", id: "expression" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "e993577ae6a8",
                      id: "active-row"
                    },
                    children: [
                      {
                        elementName: "g",
                        attributes: { "haiku-id": "09e4c2ee5d2d", id: "Group" },
                        children: [
                          {
                            elementName: "g",
                            attributes: {
                              "haiku-id": "4b8525026b69",
                              id: "curve"
                            },
                            children: [
                              {
                                elementName: "g",
                                attributes: {
                                  "haiku-id": "2ddca17fa4c7",
                                  id: "done"
                                },
                                children: [
                                  {
                                    elementName: "polygon",
                                    attributes: {
                                      "haiku-id": "2ef854a8d719",
                                      id: "X"
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
          source: "designs/metapoem2.sketch.contents/slices/suggest2.svg",
          "haiku-id": "9bbc47edc527",
          "haiku-title": "suggest2"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "8841b54abe50", id: "Artboard-2" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "d5e0390dca15", id: "expression" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "729c76ad564d",
                      id: "active-row"
                    },
                    children: [
                      {
                        elementName: "g",
                        attributes: { "haiku-id": "3fa507219106", id: "Group" },
                        children: [
                          {
                            elementName: "g",
                            attributes: {
                              "haiku-id": "2939aa4006ff",
                              id: "curve"
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
          source: "designs/metapoem2.sketch.contents/slices/suggestFirst.svg",
          "haiku-id": "185efe6f3f71",
          "haiku-title": "suggestFirst"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "01a8d16d9763" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "c1125d1fb147", id: "path-1-da9286" },
                children: []
              },
              {
                elementName: "filter",
                attributes: {
                  "haiku-id": "8570971f7b3f",
                  id: "filter-2-da9286"
                },
                children: [
                  {
                    elementName: "feOffset",
                    attributes: { "haiku-id": "620047d41aa0" },
                    children: []
                  },
                  {
                    elementName: "feGaussianBlur",
                    attributes: { "haiku-id": "b8a26298245b" },
                    children: []
                  },
                  {
                    elementName: "feColorMatrix",
                    attributes: { "haiku-id": "5f2974f5c120", type: "matrix" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "aa7a30d037a3", id: "Artboard-2" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "ac7ee2c9d302", id: "expression" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "fae99469d345",
                      id: "active-row"
                    },
                    children: [
                      {
                        elementName: "g",
                        attributes: { "haiku-id": "128a7a6e5bea", id: "Group" },
                        children: [
                          {
                            elementName: "g",
                            attributes: {
                              "haiku-id": "1f16874ea10c",
                              id: "curve"
                            },
                            children: [
                              {
                                elementName: "g",
                                attributes: {
                                  "haiku-id": "57c4d8cddcb3",
                                  id: "suggestFirst"
                                },
                                children: [
                                  {
                                    elementName: "g",
                                    attributes: {
                                      "haiku-id": "76b25277112e",
                                      id: "Rectangle-24-Copy"
                                    },
                                    children: [
                                      {
                                        elementName: "use",
                                        attributes: {
                                          "xlink:href": "#path-1-da9286",
                                          "haiku-id": "111b73b1d732"
                                        },
                                        children: []
                                      },
                                      {
                                        elementName: "use",
                                        attributes: {
                                          "xlink:href": "#path-1-da9286",
                                          "haiku-id": "0c9a17d33503"
                                        },
                                        children: []
                                      }
                                    ]
                                  },
                                  {
                                    elementName: "rect",
                                    attributes: {
                                      "haiku-id": "4027769e8b74",
                                      id: "Rectangle"
                                    },
                                    children: []
                                  },
                                  {
                                    elementName: "path",
                                    attributes: {
                                      "haiku-id": "7e1588625493",
                                      id: "Shape"
                                    },
                                    children: []
                                  },
                                  {
                                    elementName: "rect",
                                    attributes: {
                                      "haiku-id": "e9d5d3514aa8",
                                      id: "Rectangle-Copy"
                                    },
                                    children: []
                                  },
                                  {
                                    elementName: "path",
                                    attributes: {
                                      "haiku-id": "92166787210b",
                                      id: "mouseY"
                                    },
                                    children: []
                                  },
                                  {
                                    elementName: "path",
                                    attributes: {
                                      "haiku-id": "197768d72d25",
                                      id: "mouseX-Copy-2"
                                    },
                                    children: []
                                  },
                                  {
                                    elementName: "path",
                                    attributes: {
                                      "haiku-id": "600935ee63d9",
                                      id: "Shape-Copy-2"
                                    },
                                    children: []
                                  },
                                  {
                                    elementName: "path",
                                    attributes: {
                                      "haiku-id": "7d6fa2981ade",
                                      id: "Math-Copy"
                                    },
                                    children: []
                                  },
                                  {
                                    elementName: "path",
                                    attributes: {
                                      "haiku-id": "e3ed074c3eec",
                                      id: "Shape-Copy"
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
          source: "designs/metapoem2.sketch.contents/slices/suggest1.svg",
          "haiku-id": "28f7ea213958",
          "haiku-title": "suggest1"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "2edb3601a69d" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "e9e79d51718d", id: "path-1-b66c26" },
                children: []
              },
              {
                elementName: "filter",
                attributes: {
                  "haiku-id": "131258209317",
                  id: "filter-2-b66c26"
                },
                children: [
                  {
                    elementName: "feOffset",
                    attributes: { "haiku-id": "c445633e2dfa" },
                    children: []
                  },
                  {
                    elementName: "feGaussianBlur",
                    attributes: { "haiku-id": "b66fddd57df3" },
                    children: []
                  },
                  {
                    elementName: "feColorMatrix",
                    attributes: { "haiku-id": "1e614358055c", type: "matrix" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "0033791e70f9", id: "Artboard-2" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "2e398a9b4e5f", id: "expression" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "d3c15577ba2d",
                      id: "active-row"
                    },
                    children: [
                      {
                        elementName: "g",
                        attributes: { "haiku-id": "50aa574e9d3f", id: "Group" },
                        children: [
                          {
                            elementName: "g",
                            attributes: {
                              "haiku-id": "5fea9119ba12",
                              id: "curve"
                            },
                            children: [
                              {
                                elementName: "g",
                                attributes: {
                                  "haiku-id": "884215717279",
                                  id: "suggest1"
                                },
                                children: [
                                  {
                                    elementName: "g",
                                    attributes: {
                                      "haiku-id": "e4a61dfbbbd5",
                                      id: "Rectangle-24-Copy"
                                    },
                                    children: [
                                      {
                                        elementName: "use",
                                        attributes: {
                                          "xlink:href": "#path-1-b66c26",
                                          "haiku-id": "d735d4bb8bb4"
                                        },
                                        children: []
                                      },
                                      {
                                        elementName: "use",
                                        attributes: {
                                          "xlink:href": "#path-1-b66c26",
                                          "haiku-id": "44d4a681d55c"
                                        },
                                        children: []
                                      }
                                    ]
                                  },
                                  {
                                    elementName: "rect",
                                    attributes: {
                                      "haiku-id": "5da50aadea38",
                                      id: "Rectangle"
                                    },
                                    children: []
                                  },
                                  {
                                    elementName: "path",
                                    attributes: {
                                      "haiku-id": "5f6ca51edfb7",
                                      id: "Shape"
                                    },
                                    children: []
                                  },
                                  {
                                    elementName: "path",
                                    attributes: {
                                      "haiku-id": "ebf2a52c506c",
                                      id: "Shape-Copy-3"
                                    },
                                    children: []
                                  },
                                  {
                                    elementName: "rect",
                                    attributes: {
                                      "haiku-id": "230a57a677b6",
                                      id: "Rectangle-Copy"
                                    },
                                    children: []
                                  },
                                  {
                                    elementName: "path",
                                    attributes: {
                                      "haiku-id": "d1ecad6e6619",
                                      id: "mouseX-Copy-2"
                                    },
                                    children: []
                                  },
                                  {
                                    elementName: "path",
                                    attributes: {
                                      "haiku-id": "fe47aba0f970",
                                      id: "mouseY"
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
          source: "designs/metapoem2.sketch.contents/slices/logo.svg",
          "haiku-id": "624efe4fda7f",
          "haiku-title": "logo"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "ab46dc408ef8", id: "Artboard-3" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "eb807fee86fa", id: "artboard_full" },
                children: [
                  {
                    elementName: "path",
                    attributes: { "haiku-id": "4b398c8edff1", id: "logo" },
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
          source: "designs/metapoem2.sketch.contents/slices/HAIKU.svg",
          "haiku-id": "a37840067945",
          "haiku-title": "HAIKU"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "2dc2368f1823", id: "Artboard-3" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "80199a74c3e6", id: "artboard_full" },
                children: [
                  {
                    elementName: "path",
                    attributes: { "haiku-id": "f942d8eff3fd", id: "HAIKU" },
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
          source: "designs/metapoem2.sketch.contents/slices/cover.svg",
          "haiku-id": "8b847d4fc375",
          "haiku-title": "cover"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "1d71f28553c5", id: "Artboard-3" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "d209ba6b8ba1", id: "artboard_full" },
                children: [
                  {
                    elementName: "rect",
                    attributes: { "haiku-id": "3dcc49e259aa", id: "cover" },
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
          source: "designs/metapoem2.sketch.contents/slices/artboard_full.svg",
          "haiku-id": "3ab4eda0201c",
          "haiku-title": "artboard_full"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "0297debf254d" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "b29739d50cfa", id: "path-1-c7f976" },
                children: []
              },
              {
                elementName: "filter",
                attributes: {
                  "haiku-id": "de03a36087e4",
                  id: "filter-2-c7f976"
                },
                children: [
                  {
                    elementName: "feOffset",
                    attributes: { "haiku-id": "2d82e3398e2d" },
                    children: []
                  },
                  {
                    elementName: "feGaussianBlur",
                    attributes: { "haiku-id": "3a6d56d79454" },
                    children: []
                  },
                  {
                    elementName: "feColorMatrix",
                    attributes: { "haiku-id": "8d45a3a07c7d", type: "matrix" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "ef8fdd1a3ce4", id: "Artboard-3" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "04768f357c46", id: "artboard_full" },
                children: [
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "1ea930efc35d", id: "Rectangle" },
                    children: [
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-1-c7f976",
                          "haiku-id": "75dde0068bd8"
                        },
                        children: []
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-1-c7f976",
                          "haiku-id": "6ba9942d2d2d"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "rect",
                    attributes: { "haiku-id": "e421190a06f7", id: "cover" },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: { "haiku-id": "3f7eee332716", id: "HAIKU" },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "081c16d7e12a",
                      id: "Combined-Shape"
                    },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: { "haiku-id": "ec33d8570e83", id: "logo" },
                    children: []
                  },
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "1f26b80a7c1f", id: "full-box" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { "haiku-id": "9700d7ef74d5", id: "Line" },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "07ceb99d08bb",
                          id: "Line-Copy-4"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "7ff4ada1302c",
                          id: "Line-Copy-5"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "fedb821e0f5c",
                          id: "Line-Copy-6"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "e85c1e0dbddc",
                          id: "Line-Copy"
                        },
                        children: []
                      },
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "0b52fc66c66f",
                          id: "bottom-lines"
                        },
                        children: [
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "cfdea90a313b",
                              id: "Line-Copy-3"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "6c8c03561707",
                              id: "Line-Copy-2"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "cd23d7d833c9",
                          id: "bottom-lines-copy"
                        },
                        children: [
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "627f4a616125",
                              id: "Line-Copy-3"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "595220eea732",
                              id: "Line-Copy-2"
                            },
                            children: []
                          }
                        ]
                      }
                    ]
                  },
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "0788dd99b651",
                      id: "Animated-Logo"
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
          source: "designs/metapoem2.sketch.contents/slices/border.svg",
          "haiku-id": "e6ecbf414bf7",
          "haiku-title": "border"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "9ad45cd320f1", id: "Artboard-3" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "ae79f448f8de", id: "border" },
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
          source: "designs/metapoem2.sketch.contents/slices/keyframe cover.svg",
          "haiku-id": "86486d90958e",
          "haiku-title": "keyframe cover"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "9b038d8ba250", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: {
                  "haiku-id": "6663a81a6b41",
                  id: "keyframe-cover"
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
          source: "designs/metapoem2.sketch.contents/slices/vignette.svg",
          "haiku-id": "a9deaef426d6",
          "haiku-title": "vignette"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "3579ba4a6501" },
            children: [
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "4b36924cc911",
                  id: "linearGradient-1-728a8d"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "5dcafc8be37e" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "8bb703974982" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "fb15487733f5", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "b1094e805098", id: "vignette" },
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
          source: "designs/metapoem2.sketch.contents/slices/vignette.svg",
          "haiku-id": "e3b22ca7677e",
          "haiku-title": "vignette"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "80ee7d7602b5" },
            children: [
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "12b071c7d53d",
                  id: "linearGradient-1-9f73da"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "77e6b4e3995f" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "ef307d619ab0" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "5cfd35136ed8", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "da0a606737e6", id: "vignette" },
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
          source: "designs/metapoem2.sketch.contents/slices/vignette.svg",
          "haiku-id": "3ed8746021f6",
          "haiku-title": "vignette"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "801bfc10b238" },
            children: [
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "e20e996a1268",
                  id: "linearGradient-1-e33cfe"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "fa99bd30b56e" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "6e17e7a9308c" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "8a1135b385a3", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "a4aa40bd140a", id: "vignette" },
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
          source: "designs/metapoem2.sketch.contents/slices/secure.svg",
          "haiku-id": "9214cf7c8835",
          "haiku-title": "secure"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "fb8ac1e463da" },
            children: [
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "6c7889c7a7ab",
                  id: "linearGradient-1-4b110f"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "278db1d85d24" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "377311492e24" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "3cabac107d4f", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "d0601968d8f7", id: "secure" },
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
          source: "designs/metapoem2.sketch.contents/slices/punchout_bg.svg",
          "haiku-id": "60bcb9094320",
          "haiku-title": "punchout_bg"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "070e94ec69ed", id: "Artboard-3" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "2c2e0533f7c9", id: "punchout_bg" },
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
          source: "designs/metapoem2.sketch.contents/slices/grad_logo.svg",
          "haiku-id": "d4ab44f7468e",
          "haiku-title": "grad_logo"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "45ba147f431e" },
            children: [
              {
                elementName: "linearGradient",
                attributes: {
                  "haiku-id": "643cc099340e",
                  id: "linearGradient-1-c13d66"
                },
                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "491c2b6833d6" },
                    children: []
                  },
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "accb836bc8e5" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "1f639105d992", id: "Artboard-3" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "f28829ef338d", id: "grad_logo" },
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
          source: "designs/metapoem2.sketch.contents/slices/text_fill.svg",
          "haiku-id": "d8cef8cf74ee",
          "haiku-title": "text_fill"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "e29dff0512bc", id: "Artboard-3" },
            children: [
              {
                elementName: "path",
                attributes: { "haiku-id": "47a972806dc9", id: "text_fill" },
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
          source: "designs/metapoem2.sketch.contents/slices/punchout.svg",
          "haiku-id": "db452eaec029",
          "haiku-title": "punchout"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "2e6a7043a116", id: "Artboard-3" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "55c75fb8954a", id: "punchout" },
                children: [
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "cad890358caf",
                      id: "Combined-Shape"
                    },
                    children: []
                  },
                  {
                    elementName: "polygon",
                    attributes: { "haiku-id": "69bd00db7c13", id: "Path" },
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
          source: "designs/metapoem2.sketch.contents/slices/replay.svg",
          "haiku-id": "6658141ee5d1",
          "haiku-title": "replay"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "2bac2b4cde05", id: "Artboard-3" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "055d74a621a5", id: "replay" },
                children: [
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "cdddf3bc1c78",
                      id: "REPLAY-HAIKU"
                    },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: { "haiku-id": "61358a3cf7f8", id: "Shape" },
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
          source: "designs/metapoem2.sketch.contents/slices/interact_pointer.svg",
          "haiku-id": "5f6585ad2ac0",
          "haiku-title": "interact_pointer"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "d944b3fecdec", id: "Artboard-3" },
            children: [
              {
                elementName: "path",
                attributes: {
                  "haiku-id": "149699c56c0b",
                  id: "interact_pointer"
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
          source: "designs/metapoem2.sketch.contents/slices/punchout_logo2.svg",
          "haiku-id": "e9838c61bb6e",
          "haiku-title": "punchout_logo2"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "371594557871", id: "Artboard-3" },
            children: [
              {
                elementName: "g",
                attributes: {
                  "haiku-id": "1563c52a801f",
                  id: "punchout_logo2"
                },
                children: [
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "23989c87c54e",
                      id: "Combined-Shape"
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
