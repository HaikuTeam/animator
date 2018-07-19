var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    uuid: "HAIKU_SHARE_UUID",
    type: "haiku",
    name: "percy",
    relpath: "code/main/code.js",
    player: "2.3.75",
    version: "0.0.4",
    organization: "SashaDotCom",
    project: "percy",
    branch: "master",
    core: "3.5.1"
  },
  options: {},
  states: {
    onPage: { type: "number", value: 1 },
    beenCoined: { type: "boolean", value: false }
  },
  eventHandlers: {
    "haiku:cf0a91dca2c6": {
      click: {
        handler: function(event) {
          if (this.state.onPage == 1) {
            this.getDefaultTimeline().gotoAndPlay(600);
            this.setState({ onPage: 2 });
          } else if (this.state.onPage == 2) {
            this.getDefaultTimeline().gotoAndPlay(2220);
            this.setState({ onPage: 3 });
          } else {
            this.getDefaultTimeline().gotoAndPlay(1);
            this.setState({ onPage: 1, beenCoined: false });
          }
        }
      }
    },
    "haiku:4359f1252d70": {
      click: {
        handler: function(event) {
          this.getDefaultTimeline().gotoAndPlay(0);
          this.setState({ onPage: 1, beenCoined: false });
        }
      },
      "timeline:Default:32": {
        handler: function(event) {
          this.getDefaultTimeline().pause();
        }
      },
      "timeline:Default:132": {
        handler: function(event) {
          this.getDefaultTimeline().pause();
        }
      },
      "timeline:Default:297": {
        handler: function(event) {
          this.getDefaultTimeline().gotoAndPlay(4230);
        }
      }
    },
    "haiku:e2107692c018": {
      mouseup: {
        handler: function(event) {
          if (!this.state.beenCoined && this.state.onPage == 3) {
            this.getDefaultTimeline().gotoAndPlay(4980);
            this.setState({ beenCoined: true });
          }
        }
      }
    },
    "haiku:9ea8d8a2afa6": {
      mouseup: {
        handler: function(event) {
          if (!this.state.beenCoined && this.state.onPage == 3) {
            this.getDefaultTimeline().gotoAndPlay(4980);
            this.setState({ beenCoined: true });
          }
        }
      }
    },
    "haiku:7618d3f02ab2": {
      mouseup: {
        handler: function(event) {
          if (!this.state.beenCoined && this.state.onPage == 3) {
            this.getDefaultTimeline().gotoAndPlay(4980);
            this.setState({ beenCoined: true });
          }
        }
      }
    },
    "haiku:266a4c737675": {
      mouseup: {
        handler: function(event) {
          if (!this.state.beenCoined && this.state.onPage == 3) {
            this.getDefaultTimeline().gotoAndPlay(4980);
            this.setState({ beenCoined: true });
          }
        }
      }
    },
    "haiku:8e12c31048ec": {
      "timeline:Default:130": {
        handler: function(event) {
          this.getDefaultTimeline().pause();
        }
      },
      "timeline:Default:409": {
        handler: function(event) {
          /** action logic goes here */ this.getDefaultTimeline().pause();
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:8e12c31048ec": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "hidden" } },
        "style.overflowY": { "0": { value: "hidden" } },
        "sizeAbsolute.x": { "0": { value: 281, edited: true } },
        "sizeAbsolute.y": { "0": { value: 500, edited: true } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        opacity: {
          "0": { value: 1, edited: true },
          "5050": { value: 1, edited: true },
          "7517": { value: 1, edited: true }
        },
        "style.backgroundColor": { "0": { value: "#F8FEFF", edited: true } }
      },
      "haiku:4359f1252d70": {
        viewBox: { "0": { value: "0 0 113 49" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 113 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 49 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 88.5, edited: true } },
        "translation.y": { "0": { value: 18, edited: true } },
        "style.zIndex": { "0": { value: 1 } },
        "offset.x": { "0": { value: 56.5 } },
        "offset.y": { "0": { value: 24.5 } }
      },
      "haiku:94b290b4fbc5": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:bf46288cea0d": {
        "translation.x": { "0": { value: -86 } },
        "translation.y": { "0": { value: -22 } }
      },
      "haiku:0df3df10f758": {
        "translation.x": { "0": { value: 83 } },
        "translation.y": { "0": { value: 10 } }
      },
      "haiku:0ce8733e4298": {
        d: { "0": { value: "M98.5,55.5 L111,55.5" } },
        stroke: { "0": { value: "#81AFBE" } },
        strokeWidth: { "0": { value: "2" } },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:66d3dd154da4": {
        d: { "0": { value: "M5,55.5 L18,55.5" } },
        stroke: { "0": { value: "#81AFBE" } },
        strokeWidth: { "0": { value: "2" } },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:cf0a91dca2c6": {
        viewBox: { "0": { value: "0 0 281 44" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 281 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 44 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: -0.5, edited: true } },
        "translation.y": { "0": { value: 455.5, edited: true } },
        "style.zIndex": { "0": { value: 2 } },
        "offset.x": { "0": { value: 140.5 } },
        "offset.y": { "0": { value: 22 } }
      },
      "haiku:dd5561c5fb75": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:3431f8ac4184": { "translation.y": { "0": { value: -456 } } },
      "haiku:5be999d838e9": { "translation.y": { "0": { value: 456 } } },
      "haiku:278fdbca1f38": {
        fill: { "0": { value: "#D7EFF7" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 281 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 44 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:06144fcc65bf": {
        viewBox: { "0": { value: "0 0 51 11" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 51 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 11 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 113.5, edited: true } },
        "translation.y": { "0": { value: 427, edited: true } },
        "style.zIndex": { "0": { value: 3 } },
        "offset.x": { "0": { value: 25.5 } },
        "offset.y": { "0": { value: 5.5 } }
      },
      "haiku:2272812c65b7": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:cc95eb384704": {
        stroke: { "0": { value: "#FF5E87" } },
        "translation.x": { "0": { value: -114 } },
        "translation.y": { "0": { value: -424 } }
      },
      "haiku:98cfb9744806": {
        "translation.x": { "0": { value: 114 } },
        "translation.y": { "0": { value: 424 } }
      },
      "haiku:a9332ce9c018": {
        cx: { "0": { value: "25.5" } },
        cy: { "0": { value: "5.5" } },
        r: { "0": { value: "5" } }
      },
      "haiku:c0f17bc824e4": {
        cx: { "0": { value: "45.5" } },
        cy: { "0": { value: "5.5" } },
        r: { "0": { value: "5" } }
      },
      "haiku:c8212f440e95": {
        cx: { "0": { value: "5.5" } },
        cy: { "0": { value: "5.5" } },
        r: { "0": { value: "5" } }
      },
      "haiku:3c062f013dd2": {
        viewBox: { "0": { value: "0 0 14 14" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 14 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 14 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 111.63999999999999, edited: true },
          "733": {
            value: 111.63999999999999,
            edited: true,
            curve: "easeInOutCirc"
          },
          "1200": { value: 132.64, edited: true },
          "2200": { value: 132.64, edited: true, curve: "easeInOutCirc" },
          "2700": { value: 151.99007999999938, edited: true }
        },
        "translation.y": { "0": { value: 424.54, edited: true } },
        "style.zIndex": { "0": { value: 4 } },
        opacity: {
          "0": { value: 0, edited: true },
          "350": { value: 0, edited: true, curve: "linear" },
          "417": { value: 1, edited: true }
        },
        "scale.x": {
          "0": { value: 1 },
          "350": { value: 0, edited: true, curve: "easeOutBack" },
          "533": { value: 1, edited: true }
        },
        "scale.y": {
          "0": { value: 1 },
          "350": { value: 0, edited: true, curve: "easeOutBack" },
          "533": { value: 1, edited: true }
        },
        "offset.x": { "0": { value: 7 } },
        "offset.y": { "0": { value: 7 } }
      },
      "haiku:0d46f5f5b382": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:642a89aa993f": {
        fill: { "0": { value: "#FF5E87" } },
        "translation.x": { "0": { value: -83 } },
        "translation.y": { "0": { value: -422 } }
      },
      "haiku:a7df0e99e504": {
        cx: { "0": { value: "90" } },
        cy: { "0": { value: "429" } },
        r: { "0": { value: "7" } }
      },
      "haiku:e2107692c018": {
        viewBox: { "0": { value: "0 0 208 130" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 208 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 130 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 169.79999999999995, edited: true },
          "950": {
            value: 167.79999999999995,
            edited: true,
            curve: "easeInOutCubic"
          },
          "1867": { value: -16.8, edited: true },
          "2200": { value: -16.8, edited: true, curve: "easeOutBack" },
          "2700": { value: 38.2, edited: true }
        },
        "translation.y": {
          "0": { value: 113.75, edited: true },
          "950": { value: 136.75, edited: true, curve: "easeInOutCubic" },
          "1867": { value: 96.625, edited: true },
          "2200": { value: 96.625, edited: true, curve: "easeInOutBack" },
          "2700": { value: 183.625, edited: true }
        },
        "style.zIndex": { "0": { value: 11 } },
        "scale.x": {
          "0": { value: 1.8346153846153832, edited: true },
          "950": {
            value: 1.8346153846153832,
            edited: true,
            curve: "easeInOutBack"
          },
          "1867": { value: 0.15576923076923024, edited: true },
          "2200": {
            value: 0.15576923076923024,
            edited: true,
            curve: "easeOutBack"
          },
          "2700": { value: 1, edited: true },
          "5683": { value: 1, edited: true, curve: "easeOutBack" },
          "6183": { value: 1.1646153846153848, edited: true }
        },
        "scale.y": {
          "0": { value: 1.8346153846153832, edited: true },
          "950": {
            value: 1.8346153846153832,
            edited: true,
            curve: "easeInOutBack"
          },
          "1867": { value: 0.15576923076923024, edited: true },
          "2200": {
            value: 0.15576923076923024,
            edited: true,
            curve: "easeOutBack"
          },
          "2700": { value: 1, edited: true },
          "5683": { value: 1, edited: true, curve: "easeOutBack" },
          "6183": { value: 1.1646153846153848, edited: true }
        },
        "rotation.z": {
          "0": { value: 0, edited: true },
          "950": { value: 0, edited: true, curve: "easeInOutCubic" },
          "1867": { value: -0.1578681362338653, edited: true },
          "2200": {
            value: -0.1578681362338653,
            edited: true,
            curve: "easeOutBack"
          },
          "2700": { value: 0, edited: true },
          "5833": { value: 0, edited: true, curve: "easeOutBack" },
          "6000": { value: -0.12, edited: true, curve: "easeOutBack" },
          "6167": { value: 0.1, edited: true, curve: "easeOutBack" },
          "6350": { value: 0, edited: true }
        },
        opacity: {
          "0": { value: 1 },
          "3717": { value: 0, edited: true },
          "5683": { value: 1, edited: true }
        },
        "offset.x": { "0": { value: 104 } },
        "offset.y": { "0": { value: 65 } }
      },
      "haiku:136424abd63c": {
        d: {
          "0": {
            value: "M11.8953376,47.0810811 C3.75238388,38.0677894 1.4689506,25.0677378 5.04503775,8.08092644 C5.40831039,6.74479047 28.2987403,7.75842988 35.6394558,38.2349828"
          }
        }
      },
      "haiku:998970a805e3": {
        maskContentUnits: { "0": { value: "userSpaceOnUse" } },
        maskUnits: { "0": { value: "objectBoundingBox" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        fill: { "0": { value: "white" } },
        "sizeAbsolute.x": { "0": { value: 32.2312925 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 39.3513514 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:c70267185dc0": {
        "xlink:href": { "0": { value: "#path-1-50b89c" } }
      },
      "haiku:76c2855cc2d7": {
        d: {
          "0": {
            value: "M9.73503271,43.4854773 C0.631189397,33.5252782 -1.92169492,19.1594832 2.07637976,0.388092302 C2.48251952,-1.0884138 28.0740794,0.03171529 36.2810183,33.7100365"
          }
        }
      },
      "haiku:2a9a408ad938": {
        d: {
          "0": {
            value: "M9.73503271,43.4854773 C0.631189397,33.5252782 -1.92169492,19.1594832 2.07637976,0.388092302 C2.46148512,-1.01194402 27.98299,3.08545408 37.481681,31.9449691"
          }
        }
      },
      "haiku:906f0344149c": {
        maskContentUnits: { "0": { value: "userSpaceOnUse" } },
        maskUnits: { "0": { value: "objectBoundingBox" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        fill: { "0": { value: "white" } },
        "sizeAbsolute.x": { "0": { value: 37.2353311 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 43.3343771 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:e1603f0f9bc5": {
        "xlink:href": { "0": { value: "#path-5-50b89c" } }
      },
      "haiku:227906d5ee96": {
        maskContentUnits: { "0": { value: "userSpaceOnUse" } },
        maskUnits: { "0": { value: "objectBoundingBox" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        fill: { "0": { value: "white" } },
        "sizeAbsolute.x": { "0": { value: 37.2353311 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 43.3343771 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:461c623e57e3": {
        "xlink:href": { "0": { value: "#path-5-50b89c" } }
      },
      "haiku:e2bcb410db91": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:24c88ba2e5b7": {
        "translation.x": { "0": { value: -35 } },
        "translation.y": { "0": { value: -181 } }
      },
      "haiku:467a83353229": {
        "translation.x": { "0": { value: 35 } },
        "translation.y": { "0": { value: 181 } }
      },
      "haiku:0ab4bc597a6c": {
        d: {
          "0": {
            value: "M118.199778,28.677 C118.199778,28.847 118.352778,29 118.522778,29 L119.593778,29 C119.780778,29 119.916778,28.847 119.916778,28.677 L119.916778,20.398 L119.933778,20.398 L127.311778,29.17 L127.753778,29.17 C127.923778,29.17 128.076778,29.034 128.076778,28.864 L128.076778,17.423 C128.076778,17.253 127.923778,17.1 127.753778,17.1 L126.665778,17.1 C126.478778,17.1 126.342778,17.253 126.342778,17.423 L126.342778,25.464 L126.325778,25.464 L118.947778,16.93 L118.522778,16.93 C118.352778,16.93 118.199778,17.066 118.199778,17.236 L118.199778,28.677 Z M132.885889,28.677 C132.885889,28.847 133.021889,29 133.208889,29 L140.008889,29 C140.195889,29 140.331889,28.847 140.331889,28.677 L140.331889,27.742 C140.331889,27.572 140.195889,27.419 140.008889,27.419 L134.636889,27.419 L134.636889,23.764 L139.175889,23.764 C139.345889,23.764 139.498889,23.628 139.498889,23.441 L139.498889,22.489 C139.498889,22.319 139.345889,22.166 139.175889,22.166 L134.636889,22.166 L134.636889,18.698 L140.008889,18.698 C140.195889,18.698 140.331889,18.545 140.331889,18.375 L140.331889,17.423 C140.331889,17.253 140.195889,17.1 140.008889,17.1 L133.208889,17.1 C133.021889,17.1 132.885889,17.253 132.885889,17.423 L132.885889,28.677 Z M143.356,28.524 C143.22,28.745 143.356,29 143.662,29 L144.971,29 C145.107,29 145.209,28.915 145.26,28.847 L147.895,24.495 L147.929,24.495 L150.598,28.847 C150.632,28.915 150.751,29 150.887,29 L152.196,29 C152.485,29 152.621,28.762 152.485,28.524 L149,22.897 L152.366,17.576 C152.502,17.355 152.366,17.1 152.077,17.1 L150.632,17.1 C150.496,17.1 150.394,17.185 150.36,17.253 L147.929,21.316 L147.912,21.316 L145.515,17.253 C145.464,17.168 145.345,17.1 145.226,17.1 L143.781,17.1 C143.492,17.1 143.356,17.355 143.492,17.576 L146.858,22.897 L143.356,28.524 Z M157.889111,28.677 C157.889111,28.847 158.042111,29 158.212111,29 L159.334111,29 C159.504111,29 159.657111,28.847 159.657111,28.677 L159.657111,18.698 L162.428111,18.698 C162.615111,18.698 162.751111,18.545 162.751111,18.375 L162.751111,17.423 C162.751111,17.253 162.615111,17.1 162.428111,17.1 L155.118111,17.1 C154.931111,17.1 154.795111,17.253 154.795111,17.423 L154.795111,18.375 C154.795111,18.545 154.931111,18.698 155.118111,18.698 L157.889111,18.698 L157.889111,28.677 Z"
          }
        },
        fill: { "0": { value: "#3D6F80" } }
      },
      "haiku:550f1d1bf4d2": {
        viewBox: { "0": { value: "0 0 89 110" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 89 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 110 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 71.5, edited: true },
          "1617": { value: 65, edited: true }
        },
        "translation.y": {
          "0": { value: 243, edited: true },
          "1617": { value: 197, edited: true, curve: "easeOutBack" },
          "1783": { value: 138, edited: true }
        },
        "style.zIndex": { "0": { value: 10 } },
        opacity: {
          "0": { value: 0, edited: true },
          "1617": { value: 0, edited: true, curve: "linear" },
          "1717": { value: 1, edited: true }
        },
        "rotation.z": {
          "0": { value: 0 },
          "1617": { value: 0, edited: true, curve: "easeOutBack" },
          "1783": { value: -0.12510712313997696, edited: true }
        },
        "scale.x": {
          "0": { value: 1 },
          "2200": { value: 1, edited: true, curve: "linear" },
          "2283": { value: 0, edited: true }
        },
        "scale.y": {
          "0": { value: 1 },
          "2200": { value: 1, edited: true, curve: "linear" },
          "2283": { value: 0, edited: true }
        },
        "offset.x": { "0": { value: 44.5 } },
        "offset.y": { "0": { value: 55 } }
      },
      "haiku:0f6d9bd43588": {
        x: { "0": { value: "99" } },
        y: { "0": { value: "145" } },
        rx: { "0": { value: "6" } },
        "sizeAbsolute.x": { "0": { value: 89 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 110 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:cdf169cc6177": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:f99817abdb6a": {
        "translation.x": { "0": { value: -99 } },
        "translation.y": { "0": { value: -145 } }
      },
      "haiku:db571728a592": {
        fill: { "0": { value: "#FFFFFF" } },
        fillRule: { "0": { value: "evenodd" } },
        "xlink:href": { "0": { value: "#path-1-29843c" } }
      },
      "haiku:6cd9745478ed": {
        stroke: { "0": { value: "#81AFBE" } },
        strokeWidth: { "0": { value: "4" } },
        x: { "0": { value: "101" } },
        y: { "0": { value: "147" } },
        rx: { "0": { value: "6" } },
        "sizeAbsolute.x": { "0": { value: 85 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 106 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:e0fe9ff9c991": {
        viewBox: { "0": { value: "0 0 89 110" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 89 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 110 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 113.5, edited: true },
          "1767": { value: 96, edited: true }
        },
        "translation.y": {
          "0": { value: 219, edited: true },
          "1767": { value: 196, edited: true, curve: "easeOutBack" },
          "1917": { value: 152, edited: true }
        },
        "style.zIndex": { "0": { value: 12 } },
        "rotation.z": {
          "0": { value: 0 },
          "1767": { value: 0, edited: true, curve: "easeOutBack" },
          "1917": { value: 0.05245039077769531, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "1767": { value: 0, edited: true, curve: "linear" },
          "1833": { value: 1, edited: true },
          "2283": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1 },
          "2200": { value: 1, edited: true, curve: "linear" },
          "2283": { value: 0.1, edited: true }
        },
        "scale.y": {
          "0": { value: 1 },
          "2200": { value: 1, edited: true, curve: "linear" },
          "2283": { value: 0.1, edited: true }
        },
        "offset.x": { "0": { value: 44.5 } },
        "offset.y": { "0": { value: 55 } }
      },
      "haiku:1343c9b67711": {
        x: { "0": { value: "99" } },
        y: { "0": { value: "145" } },
        rx: { "0": { value: "6" } },
        "sizeAbsolute.x": { "0": { value: 89 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 110 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:dee5573a6a40": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:f1375d4b685a": {
        "translation.x": { "0": { value: -99 } },
        "translation.y": { "0": { value: -145 } }
      },
      "haiku:171b7a9748d7": {
        fill: { "0": { value: "#FFFFFF" } },
        fillRule: { "0": { value: "evenodd" } },
        "xlink:href": { "0": { value: "#path-1-e28417" } }
      },
      "haiku:c8b57e1885da": {
        stroke: { "0": { value: "#81AFBE" } },
        strokeWidth: { "0": { value: "4" } },
        x: { "0": { value: "101" } },
        y: { "0": { value: "147" } },
        rx: { "0": { value: "6" } },
        "sizeAbsolute.x": { "0": { value: 85 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 106 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:765a09ca1a45": {
        viewBox: { "0": { value: "0 0 89 110" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 89 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 110 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 154.5, edited: true },
          "167": { value: 155.5, edited: true },
          "1850": { value: 123, edited: true }
        },
        "translation.y": {
          "0": { value: 201, edited: true },
          "1850": { value: 211, edited: true, curve: "easeOutBack" },
          "1983": { value: 174, edited: true }
        },
        "style.zIndex": { "0": { value: 13 } },
        "rotation.z": {
          "0": { value: 0 },
          "1850": {
            value: 0.2638975339115412,
            edited: true,
            curve: "easeOutBack"
          },
          "1983": { value: 0.2638975339115412, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "1850": { value: 0, edited: true, curve: "linear" },
          "1900": { value: 1, edited: true },
          "2200": { value: 1, edited: true }
        },
        "scale.x": {
          "0": { value: 1 },
          "2200": { value: 1, edited: true, curve: "linear" },
          "2283": { value: 0, edited: true }
        },
        "scale.y": {
          "0": { value: 1 },
          "2200": { value: 1, edited: true, curve: "linear" },
          "2283": { value: 0, edited: true }
        },
        "offset.x": { "0": { value: 44.5 } },
        "offset.y": { "0": { value: 55 } }
      },
      "haiku:b1af1892eec3": {
        x: { "0": { value: "99" } },
        y: { "0": { value: "145" } },
        rx: { "0": { value: "6" } },
        "sizeAbsolute.x": { "0": { value: 89 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 110 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:6224efeee656": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:af3b68441eed": {
        "translation.x": { "0": { value: -99 } },
        "translation.y": { "0": { value: -145 } }
      },
      "haiku:668d472e3731": {
        fill: { "0": { value: "#FFFFFF" } },
        fillRule: { "0": { value: "evenodd" } },
        "xlink:href": { "0": { value: "#path-1-39283e" } }
      },
      "haiku:8c986bd9591c": {
        stroke: { "0": { value: "#81AFBE" } },
        strokeWidth: { "0": { value: "4" } },
        x: { "0": { value: "101" } },
        y: { "0": { value: "147" } },
        rx: { "0": { value: "6" } },
        "sizeAbsolute.x": { "0": { value: 85 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 106 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:ee5e030047e6": {
        viewBox: { "0": { value: "0 0 53 11" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 53 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 11 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 160.5, edited: true },
          "1983": { value: 126.5, edited: true, curve: "easeOutBack" },
          "2067": { value: 144.5, edited: true }
        },
        "translation.y": {
          "0": { value: 191.5, edited: true },
          "1983": { value: 180.5, edited: true, curve: "easeOutBack" },
          "2067": { value: 186.5, edited: true }
        },
        "style.zIndex": { "0": { value: 14 } },
        "rotation.z": {
          "0": { value: 0 },
          "1983": { value: 0.26195496080530156, edited: true }
        },
        "scale.x": {
          "0": { value: 1 },
          "1983": { value: 0.3, edited: true, curve: "easeOutBack" },
          "2067": { value: 1, edited: true },
          "2200": { value: 1, edited: true, curve: "linear" },
          "2283": { value: 0, edited: true }
        },
        "scale.y": {
          "0": { value: 1 },
          "2067": { value: 1, edited: true },
          "2200": { value: 1, edited: true, curve: "linear" },
          "2283": { value: 0, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "1983": { value: 1, edited: true },
          "2233": { value: 0, edited: true },
          "2283": { value: 0, edited: true }
        },
        "offset.x": { "0": { value: 26.5 } },
        "offset.y": { "0": { value: 5.5 } }
      },
      "haiku:abb95145e89b": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:1708e96a1a1e": {
        fill: { "0": { value: "#81AFBE" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "4" } },
        "sizeAbsolute.x": { "0": { value: 53 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 11 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:b4141bc315b0": {
        viewBox: { "0": { value: "0 0 53 11" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 53 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 11 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 160.5, edited: true },
          "2017": { value: 121.5, edited: true, curve: "easeOutBack" },
          "2100": { value: 146.5, edited: true }
        },
        "translation.y": {
          "0": { value: 191.5, edited: true },
          "2017": { value: 199.5, edited: true, curve: "easeOutBack" },
          "2100": { value: 205.5, edited: true }
        },
        "style.zIndex": { "0": { value: 15 } },
        "rotation.z": {
          "0": { value: 0 },
          "2017": { value: 0.26195496080530156, edited: true }
        },
        "scale.x": {
          "0": { value: 1 },
          "2017": { value: 0.3, edited: true, curve: "easeOutBack" },
          "2100": { value: 1.2, edited: true },
          "2200": { value: 1.2, edited: true, curve: "linear" },
          "2283": { value: 0, edited: true }
        },
        "scale.y": {
          "0": { value: 1 },
          "2017": { value: 0.5, edited: true },
          "2200": { value: 0.5, edited: true, curve: "linear" },
          "2283": { value: 0, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "2017": { value: 1, edited: true },
          "2233": { value: 0, edited: true }
        },
        "offset.x": { "0": { value: 26.5 } },
        "offset.y": { "0": { value: 5.5 } }
      },
      "haiku:758d56c30bf2": {},
      "haiku:a394c06eb6bb": {},
      "haiku:a8a3adb60f8f": {},
      "haiku:d6c1eb05d14a": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:b6feec71fdbf": {
        fill: { "0": { value: "#81AFBE" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "4" } },
        "sizeAbsolute.x": { "0": { value: 53 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 11 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:8b7b55c1730c": {
        viewBox: { "0": { value: "0 0 53 11" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 53 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 11 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 160.5, edited: true },
          "2050": { value: 120.5, edited: true, curve: "easeOutBack" },
          "2133": { value: 132.5, edited: true }
        },
        "translation.y": {
          "0": { value: 191.5, edited: true },
          "2050": { value: 213.5, edited: true, curve: "easeOutBack" },
          "2133": { value: 216.5, edited: true }
        },
        "style.zIndex": { "0": { value: 16 } },
        "rotation.z": {
          "0": { value: 0 },
          "2050": { value: 0.26195496080530156, edited: true }
        },
        "scale.x": {
          "0": { value: 1 },
          "2050": { value: 0.3, edited: true, curve: "easeOutBack" },
          "2133": { value: 0.8, edited: true },
          "2200": { value: 0.8, edited: true, curve: "linear" },
          "2283": { value: 0, edited: true }
        },
        "scale.y": {
          "0": { value: 1 },
          "2050": { value: 0.5, edited: true },
          "2200": { value: 0.5, edited: true, curve: "linear" },
          "2283": { value: 0, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "2050": { value: 1, edited: true },
          "2233": { value: 0, edited: true }
        },
        "offset.x": { "0": { value: 26.5 } },
        "offset.y": { "0": { value: 5.5 } }
      },
      "haiku:37fcc6767ee8": {},
      "haiku:dd9e11a76b1c": {},
      "haiku:5e8182f984e1": {},
      "haiku:cffaa913f574": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:1f36a9d40987": {
        fill: { "0": { value: "#81AFBE" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "4" } },
        "sizeAbsolute.x": { "0": { value: 53 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 11 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:d300f3906156": {
        viewBox: { "0": { value: "0 0 53 11" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 53 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 11 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 160.5, edited: true },
          "2083": { value: 116.5, edited: true, curve: "easeOutBack" },
          "2167": { value: 133.5, edited: true }
        },
        "translation.y": {
          "0": { value: 191.5, edited: true },
          "2083": { value: 229.5, edited: true, curve: "easeOutBack" },
          "2167": { value: 232.5, edited: true }
        },
        "style.zIndex": { "0": { value: 17 } },
        "rotation.z": {
          "0": { value: 0 },
          "2083": { value: 0.26195496080530156, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "2083": { value: 0.3, edited: true, curve: "easeOutBack" },
          "2167": { value: 1, edited: true },
          "2200": { value: 1, edited: true, curve: "linear" },
          "2283": { value: 0, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "2083": { value: 0.5, edited: true },
          "2200": { value: 0.5, edited: true, curve: "linear" },
          "2283": { value: 0, edited: true }
        },
        opacity: {
          "0": { value: 0, edited: true },
          "2083": { value: 1, edited: true },
          "2233": { value: 0, edited: true }
        },
        "offset.x": { "0": { value: 26.5 } },
        "offset.y": { "0": { value: 5.5 } }
      },
      "haiku:23edd78618fd": {},
      "haiku:4aa79f4f6814": {},
      "haiku:1a9dbf097391": {},
      "haiku:57aff1d2af87": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:0d0df41361a9": {
        fill: { "0": { value: "#81AFBE" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "4" } },
        "sizeAbsolute.x": { "0": { value: 53 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 11 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:3c0f3e94c6f0": {
        d: {
          "0": {
            value: "M3.589,38.297 L3.589,13.803 C3.589,13.433 3.885,13.1 4.292,13.1 L12.728,13.1 C17.279,13.1 21.016,16.8 21.016,21.277 C21.016,25.865 17.279,29.602 12.765,29.602 L7.4,29.602 L7.4,38.297 C7.4,38.667 7.067,39 6.697,39 L4.292,39 C3.885,39 3.589,38.667 3.589,38.297 Z M7.4,25.976 L12.506,25.976 C15.059,25.976 17.205,23.904 17.205,21.24 C17.205,18.724 15.059,16.8 12.506,16.8 L7.4,16.8 L7.4,25.976 Z M25.567,38.297 C25.567,38.667 25.863,39 26.27,39 L41.07,39 C41.477,39 41.773,38.667 41.773,38.297 L41.773,36.262 C41.773,35.892 41.477,35.559 41.07,35.559 L29.378,35.559 L29.378,27.604 L39.257,27.604 C39.627,27.604 39.96,27.308 39.96,26.901 L39.96,24.829 C39.96,24.459 39.627,24.126 39.257,24.126 L29.378,24.126 L29.378,16.578 L41.07,16.578 C41.477,16.578 41.773,16.245 41.773,15.875 L41.773,13.803 C41.773,13.433 41.477,13.1 41.07,13.1 L26.27,13.1 C25.863,13.1 25.567,13.433 25.567,13.803 L25.567,38.297 Z M47.36,38.297 L47.36,13.803 C47.36,13.433 47.656,13.1 48.063,13.1 L58.127,13.1 C62.567,13.1 66.193,16.615 66.193,21.018 C66.193,24.422 63.936,27.234 60.717,28.529 L65.786,37.927 C66.045,38.408 65.786,39 65.157,39 L62.271,39 C61.975,39 61.753,38.815 61.679,38.667 L56.758,28.862 L51.171,28.862 L51.171,38.297 C51.171,38.667 50.838,39 50.468,39 L48.063,39 C47.656,39 47.36,38.667 47.36,38.297 Z M51.245,25.68 L57.831,25.68 C60.236,25.68 62.345,23.645 62.345,21.092 C62.345,18.687 60.236,16.689 57.831,16.689 L51.245,16.689 L51.245,25.68 Z M70.078,26.087 C70.078,33.487 76.035,39.37 83.435,39.37 C86.728,39.37 89.91,38.223 92.426,35.781 C92.685,35.522 92.759,35.041 92.463,34.782 L90.761,33.117 C90.539,32.932 90.206,32.895 89.873,33.154 C88.097,34.523 86.21,35.596 83.509,35.596 C78.218,35.596 74.185,31.193 74.185,26.013 C74.185,20.833 78.181,16.393 83.472,16.393 C85.766,16.393 88.134,17.355 89.873,18.872 C90.206,19.205 90.539,19.205 90.798,18.872 L92.426,17.207 C92.722,16.911 92.722,16.467 92.389,16.171 C89.873,13.988 87.172,12.73 83.435,12.73 C76.035,12.73 70.078,18.687 70.078,26.087 Z M102.786,38.297 C102.786,38.667 103.082,39 103.489,39 L105.931,39 C106.301,39 106.634,38.667 106.634,38.297 L106.634,26.494 L115.403,14.173 C115.699,13.692 115.403,13.1 114.811,13.1 L112.036,13.1 C111.777,13.1 111.555,13.285 111.444,13.433 L104.747,22.868 L98.05,13.433 C97.939,13.285 97.754,13.1 97.458,13.1 L94.72,13.1 C94.128,13.1 93.832,13.692 94.128,14.173 L102.786,26.531 L102.786,38.297 Z"
          }
        },
        fill: { "0": { value: "#81AFBE" } }
      },
      "haiku:66856a9e9d7c": {
        d: {
          "0": {
            value: "M26.455,59.715 L26.455,49.785 C26.455,49.635 26.575,49.5 26.74,49.5 L30.1,49.5 C31.915,49.5 33.22,50.7 33.22,52.275 C33.22,53.43 32.365,54.255 31.66,54.66 C32.455,54.99 33.535,55.725 33.535,57.105 C33.535,58.785 32.155,60 30.265,60 L26.74,60 C26.575,60 26.455,59.865 26.455,59.715 Z M27.985,54.06 L30.01,54.06 C30.97,54.06 31.555,53.355 31.555,52.455 C31.555,51.54 30.97,50.91 30.01,50.91 L27.985,50.91 L27.985,54.06 Z M27.97,58.62 L30.25,58.62 C31.165,58.62 31.87,57.915 31.87,56.985 C31.87,56.07 31,55.41 30.025,55.41 L27.97,55.41 L27.97,58.62 Z M34.63,60 C34.405,60 34.285,59.805 34.375,59.61 L38.98,49.515 C39.025,49.425 39.16,49.35 39.235,49.35 L39.385,49.35 C39.46,49.35 39.595,49.425 39.64,49.515 L44.215,59.61 C44.305,59.805 44.185,60 43.96,60 L43.015,60 C42.835,60 42.73,59.91 42.67,59.775 L41.74,57.72 L36.835,57.72 C36.535,58.41 36.22,59.085 35.92,59.775 C35.875,59.88 35.755,60 35.575,60 L34.63,60 Z M37.42,56.43 L41.17,56.43 L39.325,52.32 L39.25,52.32 L37.42,56.43 Z M45.715,59.715 C45.715,59.865 45.85,60 46,60 L46.945,60 C47.11,60 47.23,59.865 47.23,59.715 L47.23,52.41 L47.245,52.41 L53.755,60.15 L54.145,60.15 C54.295,60.15 54.43,60.03 54.43,59.88 L54.43,49.785 C54.43,49.635 54.295,49.5 54.145,49.5 L53.185,49.5 C53.02,49.5 52.9,49.635 52.9,49.785 L52.9,56.88 L52.885,56.88 L46.375,49.35 L46,49.35 C45.85,49.35 45.715,49.47 45.715,49.62 L45.715,59.715 Z M57.34,59.64 C57.34,59.835 57.49,60 57.7,60 L58.57,60 C58.765,60 58.93,59.835 58.93,59.64 L58.93,54.975 L63.295,59.895 C63.325,59.94 63.415,60 63.565,60 L64.765,60 C65.08,60 65.155,59.655 65.035,59.505 L60.445,54.45 L64.78,50.04 C64.99,49.815 64.84,49.5 64.57,49.5 L63.445,49.5 C63.325,49.5 63.22,49.575 63.16,49.65 L58.93,54.015 L58.93,49.86 C58.93,49.665 58.765,49.5 58.57,49.5 L57.7,49.5 C57.49,49.5 57.34,49.665 57.34,49.86 L57.34,59.64 Z M66.88,59.715 C66.88,59.865 67.015,60 67.165,60 L68.155,60 C68.305,60 68.44,59.865 68.44,59.715 L68.44,49.785 C68.44,49.635 68.305,49.5 68.155,49.5 L67.165,49.5 C67.015,49.5 66.88,49.635 66.88,49.785 L66.88,59.715 Z M71.35,59.715 C71.35,59.865 71.485,60 71.635,60 L72.58,60 C72.745,60 72.865,59.865 72.865,59.715 L72.865,52.41 L72.88,52.41 L79.39,60.15 L79.78,60.15 C79.93,60.15 80.065,60.03 80.065,59.88 L80.065,49.785 C80.065,49.635 79.93,49.5 79.78,49.5 L78.82,49.5 C78.655,49.5 78.535,49.635 78.535,49.785 L78.535,56.88 L78.52,56.88 L72.01,49.35 L71.635,49.35 C71.485,49.35 71.35,49.47 71.35,49.62 L71.35,59.715 Z M82.21,54.765 C82.21,57.765 84.625,60.15 87.61,60.15 C89.785,60.15 91.33,59.16 91.33,59.16 C91.39,59.115 91.45,58.995 91.45,58.92 C91.45,57.72 91.435,56.49 91.435,55.29 C91.435,55.14 91.315,55.005 91.165,55.005 L88.435,55.005 C88.27,55.005 88.15,55.125 88.15,55.29 L88.15,56.16 C88.15,56.31 88.27,56.43 88.435,56.43 L89.905,56.43 L89.905,58.11 C89.755,58.17 88.9,58.62 87.655,58.62 C85.525,58.62 83.89,56.82 83.89,54.735 C83.89,52.635 85.525,50.835 87.655,50.835 C88.57,50.835 89.5,51.24 90.205,51.855 C90.355,51.99 90.475,52.005 90.595,51.87 C90.82,51.63 91.045,51.405 91.27,51.165 C91.39,51.045 91.375,50.865 91.255,50.745 C90.235,49.875 89.05,49.35 87.61,49.35 C84.625,49.35 82.21,51.765 82.21,54.765 Z"
          }
        },
        fill: { "0": { value: "#81AFBE" } }
      },
      "haiku:642c141595ca": {
        viewBox: { "0": { value: "0 0 38 38" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 38 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 38 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 133.5, edited: true },
          "2900": { value: 124.5, edited: true, curve: "easeOutElastic" },
          "4200": {
            value: Haiku.inject(
              function($user) {
                return $user.mouches.length
                  ? $user.mouches[0].x - 28
                  : $user.mouse.x - 28;
              },
              "$user"
            ),
            edited: true
          },
          "4983": { value: 137, edited: true }
        },
        "translation.y": {
          "0": { value: 17.5, edited: true },
          "2900": { value: 20.5, edited: true, curve: "easeOutElastic" },
          "4200": {
            value: Haiku.inject(
              function($user) {
                return $user.mouches.length
                  ? $user.mouches[0].y - 93
                  : $user.mouse.y - 43;
              },
              "$user"
            ),
            edited: true
          },
          "4983": { value: 176, edited: true, curve: "easeOutCirc" },
          "5233": { value: 210, edited: true }
        },
        "style.zIndex": { "0": { value: 29 } },
        opacity: {
          "0": { value: 0, edited: true },
          "2900": { value: 0, edited: true, curve: "linear" },
          "2967": { value: 1, edited: true },
          "4200": { value: 1, edited: true },
          "5683": { value: 0, edited: true }
        },
        "scale.x": { "0": { value: 0.8, edited: true } },
        "scale.y": { "0": { value: 0.8, edited: true } },
        "offset.x": { "0": { value: 19 } },
        "offset.y": { "0": { value: 19 } }
      },
      "haiku:d32e841241d9": {
        cx: { "0": { value: "141" } },
        cy: { "0": { value: "114" } },
        r: { "0": { value: "19" } }
      },
      "haiku:82d9fb1d186a": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:e3d5279ecd91": {
        "translation.x": { "0": { value: -122 } },
        "translation.y": { "0": { value: -95 } }
      },
      "haiku:cd128ad9db7a": {
        fill: { "0": { value: "#D7EFF7" } },
        fillRule: { "0": { value: "evenodd" } },
        "xlink:href": { "0": { value: "#path-1-e5be6d" } }
      },
      "haiku:e5a0a538455c": {
        stroke: { "0": { value: "#81AFBE" } },
        strokeWidth: { "0": { value: "3.5" } },
        cx: { "0": { value: "141" } },
        cy: { "0": { value: "114" } },
        r: { "0": { value: "17.25" } }
      },
      "haiku:fe23f62c2ba1": { "translation.x": { "0": { value: 5 } } },
      "haiku:69de80af50ad": {
        d: {
          "0": {
            value: "M121.611576,105.463163 C123.620232,116.509327 125.308166,122.442108 126.675378,123.261505 C128.726197,124.4906 132.425079,125.976878 137.057783,123.261505 C140.146252,121.451256 142.846089,114.787579 145.157293,103.270474"
          }
        },
        stroke: { "0": { value: "#FF5E87" } },
        strokeWidth: { "0": { value: "3.5" } },
        fill: { "0": { value: "#FEDFE6" } },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:d522abad56d4": {
        d: {
          "0": {
            value: "M55.7476301,104.057758 C57.9987663,115.232703 59.6867005,121.165483 60.8114328,121.856099 C62.4985311,122.892024 66.3532916,125.495491 70.9859955,122.780118 C74.0744647,120.969869 76.8435821,113.998186 79.2933476,101.865068"
          }
        },
        stroke: { "0": { value: "#FF5E87" } },
        strokeWidth: { "0": { value: "3.5" } },
        fill: { "0": { value: "#FEDFE6" } },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:5f3ebbe5315a": {
        stroke: { "0": { value: "#FF5E87" } },
        mask: { "0": { value: "url(#mask-2-50b89c)" } },
        strokeWidth: { "0": { value: "7" } },
        fill: { "0": { value: "#FEDFE6" } },
        strokeLinecap: { "0": { value: "round" } },
        strokeDasharray: { "0": { value: "0.6299999833106994" } },
        "xlink:href": { "0": { value: "#path-1-50b89c" } }
      },
      "haiku:a932d40dc93a": {
        d: {
          "0": {
            value: "M67.5421945,27.868301 C60.9535238,24.0006169 53.2842211,21.7837838 45.0986395,21.7837838 C20.5257251,21.7837838 0.605442177,41.7615643 0.605442177,66.4054054 C0.605442177,91.0492465 20.5257251,111.027027 45.0986395,111.027027 C54.3174209,111.027027 62.8813667,108.21525 69.9843139,103.400184 C70.3882985,103.766419 70.7911931,104.131932 71.1924499,104.496833 C74.5613422,107.560485 73.7438679,113.122154 77.428101,115.620043 C82.6743597,119.176975 82.9336743,125.797222 89.5918367,126.915521 C93.8037939,127.622958 95.6344685,117.708058 100.518224,117.708058 C107.095704,117.708058 126.248082,112.378744 132.263627,111.027027 C138.279172,109.67531 181.380952,90.7632964 181.380952,66.7567568 C181.380952,37.6498578 150.951544,14.0540541 113.414966,14.0540541 C95.7350209,14.0540541 79.631776,19.2886992 67.5421945,27.868301 Z"
          }
        },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:0b5a2c439f1c": {
        d: {
          "0": {
            value: "M32.3156054,24.1222199 L11.5879266,38.8240689 L0.730407755,61.11408 L11.5879266,92.6872978 L32.3156054,107.722655 L51,107.722655 C30.7950548,100.923594 18.9593193,89.7688464 15.4927936,74.2584132 C12.026268,58.74798 17.6338719,42.0359156 32.3156054,24.1222199 Z"
          }
        },
        fill: { "0": { value: "#FEDFE6" } }
      },
      "haiku:1ca0d35e7f9c": {
        d: {
          "0": {
            value: "M153.096685,18.551731 L120.134088,32.590493 L107.809524,58.865439 C109.067759,79.4900092 110.636287,93.0131747 112.515107,99.4349356 C114.393927,105.856696 118.607694,114.90389 125.156406,126.576515 L135.445456,126.576515 L149.361715,110.080714 L179.100795,119.459459 C149.754498,111.003174 132.650666,95.4212915 127.789301,72.7138119 C122.927935,50.0063323 131.36373,31.9523053 153.096685,18.551731 Z"
          }
        },
        fill: { "0": { value: "#FEDFE6" } },
        "translation.x": { "0": { value: 286.91 } },
        "rotation.y": { "0": { value: 3.14 } },
        "rotation.z": { "0": { value: 3.14 } },
        "scale.x": { "0": { value: -1 } },
        "scale.y": { "0": { value: -1 } },
        "scale.z": { "0": { value: -1 } }
      },
      "haiku:ae8b942d477d": {
        d: {
          "0": {
            value: "M161.996049,125.683899 C169.531496,117.961313 179.580952,81.4310166 179.580952,66.7567568 C179.580952,38.758468 150.043168,15.854054 113.414966,15.854054 C96.5658771,15.854054 80.7180081,20.7250406 68.5839309,29.3362196 L67.6347288,30.009839 L66.6309598,29.4206061 C60.1519137,25.6172739 52.7754995,23.5837837 45.0986395,23.5837837 C21.5210009,23.5837837 2.40544213,42.7545173 2.40544213,66.4054054 C2.40544213,90.0562935 21.5210009,109.227027 45.0986395,109.227027 C52.5684945,109.227027 59.7550747,107.301979 66.110319,103.690913 L67.1180481,103.118319 L68.05632,103.798781 C69.5361002,104.871959 71.079147,105.892683 72.6803391,106.857342 C74.6048512,108.01679 75.6709684,110.453193 77.5697909,116.449944 C77.645262,116.688292 77.7227496,116.934086 77.8235248,117.254541 C77.9501388,117.657365 77.9501388,117.657365 78.0766503,118.05966 C79.9844192,124.12162 81.2125368,126.862897 82.1946179,127.23559 C82.8838903,127.497165 84.7052791,127.863515 86.4132963,127.995005 C88.7029002,128.171267 90.6640865,127.95333 91.9287108,127.312741 C92.8864663,126.827594 93.8276423,125.780763 95.6419239,123.317924 C96.3478109,122.359701 96.3865005,122.30742 96.6600348,121.946874 C98.8792633,119.021708 100.457368,117.65946 102.660589,117.65946 L108.190175,117.65946 L113.414966,117.65946 C115.776823,117.65946 118.407496,116.883802 123.099657,115.007393 C123.371565,114.898655 123.637983,114.791567 124.042546,114.628561 C132.232194,111.328813 135.383246,110.522678 138.980477,111.89855 C142.175943,113.120754 144.01471,115.278957 146.510071,119.669875 C146.638069,119.895104 147.068763,120.658165 147.134506,120.774172 C148.446512,123.089251 149.228216,124.232584 150.189383,125.096618 C152.936037,127.565702 158.969862,127.61432 161.996049,125.683899 Z"
          }
        },
        stroke: { "0": { value: "#FF5E87" } },
        strokeWidth: { "0": { value: "3.5999999" } }
      },
      "haiku:d520cc2c4e8f": { "translation.x": { "0": { value: 30.73 } } },
      "haiku:bc6ecbb40d85": { fill: { "0": { value: "white" } } },
      "haiku:96b5c9c70379": {
        "xlink:href": { "0": { value: "#path-3-50b89c" } }
      },
      "haiku:96f8f4d7f9d5": {
        fill: { "0": { value: "#FFFFFF" } },
        "xlink:href": { "0": { value: "#path-3-50b89c" } }
      },
      "haiku:61d01e65b92d": { mask: { "0": { value: "url(#mask-4-50b89c)" } } },
      "haiku:6167f607a68b": {
        d: {
          "0": {
            value: "M2.79927798,11.8808701 C8.53672394,11.9807055 14.1392782,13.8697746 19.6069406,17.5480774 C25.0746031,21.2263802 29.9793986,26.4308818 34.3213271,33.1615823 L30.5704988,22.740282 L14.8712105,1.49646098 L2.79927798,1.49646098 L2.79927798,11.8808701 Z"
          }
        },
        fill: { "0": { value: "#FEDFE6" } },
        mask: { "0": { value: "url(#mask-4-50b89c)" } }
      },
      "haiku:2eff2488f347": { fill: { "0": { value: "white" } } },
      "haiku:9cd13d1dfd4f": {
        "xlink:href": { "0": { value: "#path-5-50b89c" } }
      },
      "haiku:0d05641ec4cf": {
        stroke: { "0": { value: "#FF5E87" } },
        mask: { "0": { value: "url(#mask-6-50b89c)" } },
        strokeWidth: { "0": { value: "7" } },
        strokeLinecap: { "0": { value: "round" } },
        strokeDasharray: { "0": { value: "0.7" } }
      },
      "haiku:b686462c6508": {
        mask: { "0": { value: "url(#mask-8-50b89c)" } },
        "xlink:href": { "0": { value: "#path-5-50b89c" } }
      },
      "haiku:596ca721a8a4": {
        stroke: { "0": { value: "#FF5E87" } },
        strokeWidth: { "0": { value: "3.5" } },
        "translation.x": { "0": { value: 175.78 } },
        "translation.y": { "0": { value: 28.11 } }
      },
      "haiku:911d4b0b1a58": {
        d: {
          "0": {
            value: "M0.313643355,23.0927526 C6.53483006,19.8718795 11.5928296,15.786979 15.4876419,10.8380511"
          }
        },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:0489de4c256a": {
        cx: { "0": { value: "10.8605442" } },
        cy: { "0": { value: "7.37837838" } },
        rx: { "0": { value: "5.60714286" } },
        ry: { "0": { value: "5.62837838" } }
      },
      "haiku:e5edc1ecbeaa": {
        d: {
          "0": {
            value: "M10.1389619,12.9020559 C13.5734747,13.2770154 18.4222664,11.912808 24.6853368,8.80943363"
          }
        },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:1207fc16f64b": {
        d: {
          "0": {
            value: "M33.6326531,56.9189189 C37.0280505,53.1711712 40.5314519,53.1711712 44.1428571,56.9189189"
          }
        },
        stroke: { "0": { value: "#FF5E87" } },
        strokeWidth: { "0": { value: "3.91999977" } },
        strokeLinecap: { "0": { value: "round" } },
        "translation.x": { "0": { value: 17.93 } },
        "translation.y": { "0": { value: -8.94 } },
        "rotation.z": { "0": { value: 0.3 } }
      },
      "haiku:8d2897fde72b": {
        d: {
          "0": {
            value: "M3.50340136,56.9189189 C6.8987988,53.1711712 10.4022002,53.1711712 14.0136054,56.9189189"
          }
        },
        stroke: { "0": { value: "#FF5E87" } },
        strokeWidth: { "0": { value: "3.91999977" } },
        strokeLinecap: { "0": { value: "round" } },
        "translation.x": { "0": { value: -18.46 } },
        "translation.y": { "0": { value: 6.34 } },
        "rotation.z": { "0": { value: 5.93 } }
      },
      "haiku:9f15451da432": { "translation.y": { "0": { value: 72.38 } } },
      "haiku:27bfab5848b1": {
        fill: { "0": { value: "#FFFFFF" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "13.3513514" } },
        "sizeAbsolute.x": { "0": { value: 41.3401361 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 26.7027027 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:765354e19b61": {
        d: {
          "0": {
            value: "M41.3401361,13.3513514 L41.3401361,13.3513514 L41.3401361,13.3513514 C41.3401361,20.7250991 35.3625324,26.7027027 27.9887847,26.7027027 L24.1967592,26.7027027 C26.8633644,22.1984406 28.1966671,17.7479901 28.1966671,13.3513514 C28.1966671,8.95471259 26.8633644,4.50426213 24.1967592,-8.41863632e-15 L27.9887847,-2.82210434e-14 L27.9887847,-2.66453526e-14 C35.3625324,-6.72951098e-14 41.3401361,5.97760361 41.3401361,13.3513514 Z"
          }
        },
        fill: { "0": { value: "#FEDFE6" } }
      },
      "haiku:db01e0904b21": {
        stroke: { "0": { value: "#FF5E87" } },
        strokeWidth: { "0": { value: "3.5" } },
        x: { "0": { value: "1.75" } },
        y: { "0": { value: "1.75" } },
        rx: { "0": { value: "11.6013514" } },
        "sizeAbsolute.x": { "0": { value: 37.8401361 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 23.2027027 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:e84bdc4aeab5": {
        fill: { "0": { value: "#FF5E87" } },
        cx: { "0": { value: "10.8605442" } },
        cy: { "0": { value: "13.7027027" } },
        rx: { "0": { value: "3.15306122" } },
        ry: { "0": { value: "3.16216216" } }
      },
      "haiku:101568e1ab8a": {
        fill: { "0": { value: "#FF5E87" } },
        cx: { "0": { value: "24.8741497" } },
        cy: { "0": { value: "13.7027027" } },
        rx: { "0": { value: "3.15306122" } },
        ry: { "0": { value: "3.16216216" } }
      },
      "haiku:aa6a78061cf4": {
        "translation.x": { "0": { value: 72.07 } },
        "translation.y": { "0": { value: 24.7 } }
      },
      "haiku:6a04380d532f": {
        d: {
          "0": {
            value: "M18.1170665,0.438788149 C32.5402768,5.783363 50.9412991,5.783363 73.3201332,0.438788149 C78.085464,7.3448382 78.085464,26.2899691 73.3201332,57.2741808 L0.0205461621,52.7045816 L18.1170665,0.438788149 Z"
          }
        },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:10ecf1673d63": {
        d: {
          "0": {
            value: "M29.2020431,4.50211517 C41.6761062,6.85644954 52.7166077,6.85644954 62.3235477,4.50211517"
          }
        },
        stroke: { "0": { value: "#FF5E87" } },
        strokeWidth: { "0": { value: "3.91999977" } },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:266a4c737675": {
        viewBox: { "0": { value: "0 0 203 130" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 203 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 130 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -239.5, edited: true },
          "3717": { value: 42.5, edited: true }
        },
        "translation.y": {
          "0": { value: 187.5, edited: true },
          "3717": { value: 183.5, edited: true }
        },
        "style.zIndex": { "0": { value: 21 } },
        opacity: {
          "0": { value: 0, edited: true },
          "3717": { value: 1, edited: true },
          "5683": { value: 0, edited: true }
        },
        "rotation.z": { "0": { value: 0 } },
        "offset.x": { "0": { value: 101.5 } },
        "offset.y": { "0": { value: 65 } }
      },
      "haiku:bd2369e6b224": {
        d: {
          "0": {
            value: "M11.8953376,47.0810811 C3.75238388,38.0677894 1.4689506,25.0677378 5.04503775,8.08092644 C5.40831039,6.74479047 28.2987403,7.75842988 35.6394558,38.2349828"
          }
        }
      },
      "haiku:0761139d1c35": {
        maskContentUnits: { "0": { value: "userSpaceOnUse" } },
        maskUnits: { "0": { value: "objectBoundingBox" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        fill: { "0": { value: "white" } },
        "sizeAbsolute.x": { "0": { value: 32.2312925 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 39.3513514 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:132faf8a4b73": {
        "xlink:href": { "0": { value: "#path-1-a981d5" } }
      },
      "haiku:6afeba17f276": {
        d: {
          "0": {
            value: "M9.73503271,43.4854773 C0.631189397,33.5252782 -1.92169492,19.1594832 2.07637976,0.388092302 C2.48251952,-1.0884138 28.0740794,0.03171529 36.2810183,33.7100365"
          }
        }
      },
      "haiku:986dc1eb4768": {
        d: {
          "0": {
            value: "M9.73503271,43.4854773 C0.631189397,33.5252782 -1.92169492,19.1594832 2.07637976,0.388092302 C2.46148512,-1.01194402 27.98299,3.08545408 37.481681,31.9449691"
          }
        }
      },
      "haiku:fa23b8a54ddf": {
        maskContentUnits: { "0": { value: "userSpaceOnUse" } },
        maskUnits: { "0": { value: "objectBoundingBox" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        fill: { "0": { value: "white" } },
        "sizeAbsolute.x": { "0": { value: 37.2353311 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 43.3343771 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:539149c40a0c": {
        "xlink:href": { "0": { value: "#path-5-a981d5" } }
      },
      "haiku:b17f0580e073": {
        maskContentUnits: { "0": { value: "userSpaceOnUse" } },
        maskUnits: { "0": { value: "objectBoundingBox" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        fill: { "0": { value: "white" } },
        "sizeAbsolute.x": { "0": { value: 37.2353311 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 43.3343771 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:14e1511fd4e6": {
        "xlink:href": { "0": { value: "#path-5-a981d5" } }
      },
      "haiku:107b6b889ade": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:1763fed7d9ad": {
        "translation.x": { "0": { value: -40 } },
        "translation.y": { "0": { value: -181 } }
      },
      "haiku:fb2ddf1ad465": {
        "translation.x": { "0": { value: 35 } },
        "translation.y": { "0": { value: 181 } }
      },
      "haiku:53fbe5377c0c": { "translation.x": { "0": { value: 5 } } },
      "haiku:e3ebcfa572f6": {
        d: {
          "0": {
            value: "M121.611576,105.463163 C123.620232,116.509327 125.308166,122.442108 126.675378,123.261505 C128.726197,124.4906 132.425079,125.976878 137.057783,123.261505 C140.146252,121.451256 142.846089,114.787579 145.157293,103.270474"
          }
        },
        stroke: { "0": { value: "#FF5E87" } },
        strokeWidth: { "0": { value: "3.5" } },
        fill: { "0": { value: "#FEDFE6" } },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:6583f4a948c4": {
        d: {
          "0": {
            value: "M55.7476301,104.057758 C57.9987663,115.232703 59.6867005,121.165483 60.8114328,121.856099 C62.4985311,122.892024 66.3532916,125.495491 70.9859955,122.780118 C74.0744647,120.969869 76.8435821,113.998186 79.2933476,101.865068"
          }
        },
        stroke: { "0": { value: "#FF5E87" } },
        strokeWidth: { "0": { value: "3.5" } },
        fill: { "0": { value: "#FEDFE6" } },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:271edd4b2ae0": {
        stroke: { "0": { value: "#FF5E87" } },
        mask: { "0": { value: "url(#mask-2-a981d5)" } },
        strokeWidth: { "0": { value: "7" } },
        fill: { "0": { value: "#FEDFE6" } },
        strokeLinecap: { "0": { value: "round" } },
        strokeDasharray: { "0": { value: "0.6299999833106994" } },
        "xlink:href": { "0": { value: "#path-1-a981d5" } }
      },
      "haiku:38edbc124546": {
        d: {
          "0": {
            value: "M67.5421945,27.868301 C60.9535238,24.0006169 53.2842211,21.7837838 45.0986395,21.7837838 C20.5257251,21.7837838 0.605442177,41.7615643 0.605442177,66.4054054 C0.605442177,91.0492465 20.5257251,111.027027 45.0986395,111.027027 C54.3174209,111.027027 62.8813667,108.21525 69.9843139,103.400184 C70.3882985,103.766419 70.7911931,104.131932 71.1924499,104.496833 C74.5613422,107.560485 73.7438679,113.122154 77.428101,115.620043 C82.6743597,119.176975 82.9336743,125.797222 89.5918367,126.915521 C93.8037939,127.622958 95.6344685,117.708058 100.518224,117.708058 C107.095704,117.708058 126.248082,112.378744 132.263627,111.027027 C138.279172,109.67531 181.380952,90.7632964 181.380952,66.7567568 C181.380952,37.6498578 150.951544,14.0540541 113.414966,14.0540541 C95.7350209,14.0540541 79.631776,19.2886992 67.5421945,27.868301 Z"
          }
        },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:a756242bc906": {
        d: {
          "0": {
            value: "M32.3156054,24.1222199 L11.5879266,38.8240689 L0.730407755,61.11408 L11.5879266,92.6872978 L32.3156054,107.722655 L51,107.722655 C30.7950548,100.923594 18.9593193,89.7688464 15.4927936,74.2584132 C12.026268,58.74798 17.6338719,42.0359156 32.3156054,24.1222199 Z"
          }
        },
        fill: { "0": { value: "#FEDFE6" } }
      },
      "haiku:fe656a23dcaa": {
        d: {
          "0": {
            value: "M153.096685,18.551731 L120.134088,32.590493 L107.809524,58.865439 C109.067759,79.4900092 110.636287,93.0131747 112.515107,99.4349356 C114.393927,105.856696 118.607694,114.90389 125.156406,126.576515 L135.445456,126.576515 L149.361715,110.080714 L179.100795,119.459459 C149.754498,111.003174 132.650666,95.4212915 127.789301,72.7138119 C122.927935,50.0063323 131.36373,31.9523053 153.096685,18.551731 Z"
          }
        },
        fill: { "0": { value: "#FEDFE6" } },
        "translation.x": { "0": { value: 286.91 } },
        "rotation.y": { "0": { value: 3.14 } },
        "rotation.z": { "0": { value: 3.14 } },
        "scale.x": { "0": { value: -1 } },
        "scale.y": { "0": { value: -1 } },
        "scale.z": { "0": { value: -1 } }
      },
      "haiku:0f9f733fe02a": {
        d: {
          "0": {
            value: "M161.996049,125.683899 C169.531496,117.961313 179.580952,81.4310166 179.580952,66.7567568 C179.580952,38.758468 150.043168,15.854054 113.414966,15.854054 C96.5658771,15.854054 80.7180081,20.7250406 68.5839309,29.3362196 L67.6347288,30.009839 L66.6309598,29.4206061 C60.1519137,25.6172739 52.7754995,23.5837837 45.0986395,23.5837837 C21.5210009,23.5837837 2.40544213,42.7545173 2.40544213,66.4054054 C2.40544213,90.0562935 21.5210009,109.227027 45.0986395,109.227027 C52.5684945,109.227027 59.7550747,107.301979 66.110319,103.690913 L67.1180481,103.118319 L68.05632,103.798781 C69.5361002,104.871959 71.079147,105.892683 72.6803391,106.857342 C74.6048512,108.01679 75.6709684,110.453193 77.5697909,116.449944 C77.645262,116.688292 77.7227496,116.934086 77.8235248,117.254541 C77.9501388,117.657365 77.9501388,117.657365 78.0766503,118.05966 C79.9844192,124.12162 81.2125368,126.862897 82.1946179,127.23559 C82.8838903,127.497165 84.7052791,127.863515 86.4132963,127.995005 C88.7029002,128.171267 90.6640865,127.95333 91.9287108,127.312741 C92.8864663,126.827594 93.8276423,125.780763 95.6419239,123.317924 C96.3478109,122.359701 96.3865005,122.30742 96.6600348,121.946874 C98.8792633,119.021708 100.457368,117.65946 102.660589,117.65946 L108.190175,117.65946 L113.414966,117.65946 C115.776823,117.65946 118.407496,116.883802 123.099657,115.007393 C123.371565,114.898655 123.637983,114.791567 124.042546,114.628561 C132.232194,111.328813 135.383246,110.522678 138.980477,111.89855 C142.175943,113.120754 144.01471,115.278957 146.510071,119.669875 C146.638069,119.895104 147.068763,120.658165 147.134506,120.774172 C148.446512,123.089251 149.228216,124.232584 150.189383,125.096618 C152.936037,127.565702 158.969862,127.61432 161.996049,125.683899 Z"
          }
        },
        stroke: { "0": { value: "#FF5E87" } },
        strokeWidth: { "0": { value: "3.5999999" } }
      },
      "haiku:0e91a3b85f79": { "translation.x": { "0": { value: 30.73 } } },
      "haiku:7f43ea93ad2e": { fill: { "0": { value: "white" } } },
      "haiku:1c73a088f9dd": {
        "xlink:href": { "0": { value: "#path-3-a981d5" } }
      },
      "haiku:4c42120d6e2e": {
        fill: { "0": { value: "#FFFFFF" } },
        "xlink:href": { "0": { value: "#path-3-a981d5" } }
      },
      "haiku:d91a7892e232": { mask: { "0": { value: "url(#mask-4-a981d5)" } } },
      "haiku:95cbb9a9a6aa": {
        d: {
          "0": {
            value: "M2.79927798,11.8808701 C8.53672394,11.9807055 14.1392782,13.8697746 19.6069406,17.5480774 C25.0746031,21.2263802 29.9793986,26.4308818 34.3213271,33.1615823 L30.5704988,22.740282 L14.8712105,1.49646098 L2.79927798,1.49646098 L2.79927798,11.8808701 Z"
          }
        },
        fill: { "0": { value: "#FEDFE6" } },
        mask: { "0": { value: "url(#mask-4-a981d5)" } }
      },
      "haiku:a84480a6a256": { fill: { "0": { value: "white" } } },
      "haiku:ef5973525520": {
        "xlink:href": { "0": { value: "#path-5-a981d5" } }
      },
      "haiku:ef091282c770": {
        stroke: { "0": { value: "#FF5E87" } },
        mask: { "0": { value: "url(#mask-6-a981d5)" } },
        strokeWidth: { "0": { value: "7" } },
        strokeLinecap: { "0": { value: "round" } },
        strokeDasharray: { "0": { value: "0.7" } }
      },
      "haiku:6415af45d9d6": {
        mask: { "0": { value: "url(#mask-8-a981d5)" } },
        "xlink:href": { "0": { value: "#path-5-a981d5" } }
      },
      "haiku:b80a081c3a49": {
        stroke: { "0": { value: "#FF5E87" } },
        strokeWidth: { "0": { value: "3.5" } },
        "translation.x": { "0": { value: 175.78 } },
        "translation.y": { "0": { value: 28.11 } }
      },
      "haiku:66d916dd4d97": {
        d: {
          "0": {
            value: "M0.313643355,23.0927526 C6.53483006,19.8718795 11.5928296,15.786979 15.4876419,10.8380511"
          }
        },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:afe50977227f": {
        cx: { "0": { value: "10.8605442" } },
        cy: { "0": { value: "7.37837838" } },
        rx: { "0": { value: "5.60714286" } },
        ry: { "0": { value: "5.62837838" } }
      },
      "haiku:bcd90effd922": {
        d: {
          "0": {
            value: "M10.1389619,12.9020559 C13.5734747,13.2770154 18.4222664,11.912808 24.6853368,8.80943363"
          }
        },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:24807e4c556f": {
        viewBox: { "0": { value: "0 0 42 28" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 42 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 28 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 56, edited: true },
          "3717": { value: 38, edited: true }
        },
        "translation.y": {
          "0": { value: 259.5, edited: true },
          "3717": { value: 255.5, edited: true },
          "5150": { value: 255.5, edited: true, curve: "easeInBack" },
          "5350": { value: 258.5, edited: true, curve: "easeOutBack" },
          "5517": { value: 253, edited: true, curve: "easeOutBack" },
          "5683": { value: 255.5, edited: true }
        },
        "style.zIndex": { "0": { value: 22 } },
        opacity: {
          "0": { value: 0, edited: true },
          "3717": { value: 1, edited: true },
          "5683": { value: 0, edited: true }
        },
        "offset.x": { "0": { value: 21 } },
        "offset.y": { "0": { value: 14 } }
      },
      "haiku:d059caa49ac5": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:2d9936e649b4": {
        "translation.x": { "0": { value: -35 } },
        "translation.y": { "0": { value: -253 } }
      },
      "haiku:16921b5aa0b1": {
        "translation.x": { "0": { value: 35 } },
        "translation.y": { "0": { value: 181 } }
      },
      "haiku:df8b56f17fd9": { "translation.y": { "0": { value: 72.38 } } },
      "haiku:50cb74cdecd6": {
        fill: { "0": { value: "#FFFFFF" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "13.3513514" } },
        "sizeAbsolute.x": { "0": { value: 41.3401361 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 26.7027027 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:c459af7c050e": {
        d: {
          "0": {
            value: "M41.3401361,13.3513514 L41.3401361,13.3513514 L41.3401361,13.3513514 C41.3401361,20.7250991 35.3625324,26.7027027 27.9887847,26.7027027 L24.1967592,26.7027027 C26.8633644,22.1984406 28.1966671,17.7479901 28.1966671,13.3513514 C28.1966671,8.95471259 26.8633644,4.50426213 24.1967592,-8.41863632e-15 L27.9887847,-2.82210434e-14 L27.9887847,-2.66453526e-14 C35.3625324,-6.72951098e-14 41.3401361,5.97760361 41.3401361,13.3513514 Z"
          }
        },
        fill: { "0": { value: "#FEDFE6" } }
      },
      "haiku:24b8dc6eb210": {
        stroke: { "0": { value: "#FF5E87" } },
        strokeWidth: { "0": { value: "3.5" } },
        x: { "0": { value: "1.75" } },
        y: { "0": { value: "1.75" } },
        rx: { "0": { value: "11.6013514" } },
        "sizeAbsolute.x": { "0": { value: 37.8401361 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 23.2027027 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:536fd6f4cdc4": {
        fill: { "0": { value: "#FF5E87" } },
        cx: { "0": { value: "10.8605442" } },
        cy: { "0": { value: "13.7027027" } },
        rx: { "0": { value: "3.15306122" } },
        ry: { "0": { value: "3.16216216" } }
      },
      "haiku:676787d364d0": {
        fill: { "0": { value: "#FF5E87" } },
        cx: { "0": { value: "24.8741497" } },
        cy: { "0": { value: "13.7027027" } },
        rx: { "0": { value: "3.15306122" } },
        ry: { "0": { value: "3.16216216" } }
      },
      "haiku:4995dc8b328a": {
        viewBox: { "0": { value: "0 0 15 9" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 15 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 9 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 98.5, edited: true },
          "3717": { value: 68.5, edited: true },
          "5150": { value: 68.5, edited: true, curve: "easeOutCubic" },
          "5417": { value: 71.5, edited: true, curve: "easeOutCubic" },
          "5683": { value: 68.5, edited: true }
        },
        "translation.y": {
          "0": { value: 239, edited: true },
          "3717": { value: 236, edited: true },
          "5150": { value: 236, edited: true, curve: "easeOutCubic" },
          "5417": { value: 232, edited: true, curve: "easeOutCubic" },
          "5683": { value: 236, edited: true }
        },
        "style.zIndex": { "0": { value: 23 } },
        opacity: {
          "0": { value: 0, edited: true },
          "3717": { value: 1, edited: true },
          "5683": { value: 0, edited: true }
        },
        "rotation.z": {
          "0": { value: 0 },
          "5150": { value: 0, edited: true, curve: "easeOutBack" },
          "5417": {
            value: 0.48865647613863616,
            edited: true,
            curve: "easeOutBack"
          },
          "5683": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1 },
          "5150": { value: 1, edited: true, curve: "easeOutBack" },
          "5417": { value: 1.4, edited: true, curve: "easeOutBack" },
          "5683": { value: 1, edited: true }
        },
        "scale.y": {
          "0": { value: 1 },
          "5150": { value: 1, edited: true, curve: "easeOutBack" },
          "5417": { value: 1.4, edited: true, curve: "easeOutBack" },
          "5683": { value: 1, edited: true }
        },
        "offset.x": { "0": { value: 7.5 } },
        "offset.y": { "0": { value: 4.5 } }
      },
      "haiku:e00d33b60adc": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:9272e0f30696": {
        stroke: { "0": { value: "#FF5E87" } },
        strokeWidth: { "0": { value: "3.91999977" } },
        "translation.x": { "0": { value: -66 } },
        "translation.y": { "0": { value: -233 } }
      },
      "haiku:85c13d8b1c5e": {
        "translation.x": { "0": { value: 35 } },
        "translation.y": { "0": { value: 181 } }
      },
      "haiku:0bf69575f186": {
        d: {
          "0": {
            value: "M33.6326531,56.9189189 C37.0280505,53.1711712 40.5314519,53.1711712 44.1428571,56.9189189"
          }
        },
        "translation.x": { "0": { value: 17.93 } },
        "translation.y": { "0": { value: -8.94 } },
        "rotation.z": { "0": { value: 0.3 } }
      },
      "haiku:d7e232348f2f": {
        viewBox: { "0": { value: "0 0 15 9" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 15 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 9 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 46.9119104, edited: true },
          "3717": { value: 39.9119104, edited: true },
          "5150": { value: 39.9119104, edited: true, curve: "easeOutCubic" },
          "5417": { value: 35.9119104, edited: true, curve: "easeOutCubic" },
          "5683": { value: 39.9119104, edited: true }
        },
        "translation.y": {
          "0": { value: 235.7482432, edited: true },
          "5150": { value: 235.7482432, edited: true, curve: "easeOutCubic" },
          "5417": { value: 231.7482432, edited: true, curve: "easeOutCubic" },
          "5683": { value: 235, edited: true }
        },
        "style.zIndex": { "0": { value: 24 } },
        opacity: {
          "0": { value: 0, edited: true },
          "3717": { value: 1, edited: true },
          "5683": { value: 0, edited: true }
        },
        "rotation.z": {
          "0": { value: 0, edited: true },
          "5150": { value: 0, edited: true, curve: "easeOutBack" },
          "5417": { value: -0.5, edited: true, curve: "easeOutBack" },
          "5683": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1, edited: true },
          "5150": { value: 1, edited: true, curve: "easeOutBack" },
          "5417": { value: 1.4, edited: true, curve: "easeOutBack" },
          "5683": { value: 1, edited: true }
        },
        "scale.y": {
          "0": { value: 1, edited: true },
          "5150": { value: 1, edited: true, curve: "easeOutBack" },
          "5417": { value: 1.4, edited: true, curve: "easeOutBack" },
          "5683": { value: 1, edited: true }
        },
        "offset.x": { "0": { value: 7.5 } },
        "offset.y": { "0": { value: 4.5 } }
      },
      "haiku:854088cc8b39": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:af9df620e765": {
        stroke: { "0": { value: "#FF5E87" } },
        strokeWidth: { "0": { value: "3.91999977" } },
        "translation.x": { "0": { value: -37 } },
        "translation.y": { "0": { value: -233 } }
      },
      "haiku:dab6a7543589": {
        "translation.x": { "0": { value: 35 } },
        "translation.y": { "0": { value: 181 } }
      },
      "haiku:495f5cec5105": {
        d: {
          "0": {
            value: "M3.50340136,56.9189189 C6.8987988,53.1711712 10.4022002,53.1711712 14.0136054,56.9189189"
          }
        },
        "translation.x": { "0": { value: -18.46 } },
        "translation.y": { "0": { value: 6.34 } },
        "rotation.z": { "0": { value: 5.93 } }
      },
      "haiku:9ea8d8a2afa6": {
        viewBox: { "0": { value: "0 0 77 57" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 77 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 57 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 127.4803968, edited: true },
          "3717": { value: 110.4803968, edited: true }
        },
        "translation.y": {
          "0": { value: 218.45912959999998, edited: true },
          "3717": { value: 209.45912959999998, edited: true }
        },
        "style.zIndex": { "0": { value: 30 } },
        opacity: {
          "0": { value: 0, edited: true },
          "3717": { value: 0, edited: true },
          "4983": { value: 1, edited: true },
          "5683": { value: 0, edited: true },
          "6283": { value: 0, edited: true }
        },
        "offset.x": { "0": { value: 38.5 } },
        "offset.y": { "0": { value: 28.5 } }
      },
      "haiku:dbc3ba58fb09": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:51ce80e32a2f": {
        "translation.x": { "0": { value: -107 } },
        "translation.y": { "0": { value: -206 } }
      },
      "haiku:4d50b2d4f105": {
        "translation.x": { "0": { value: 35 } },
        "translation.y": { "0": { value: 181 } }
      },
      "haiku:8f23c92f7406": {
        "translation.x": { "0": { value: 72.07 } },
        "translation.y": { "0": { value: 24.7 } }
      },
      "haiku:10c70e054501": {
        d: {
          "0": {
            value: "M18.1170665,0.438788149 C32.5402768,5.783363 50.9412991,5.783363 73.3201332,0.438788149 C78.085464,7.3448382 78.085464,26.2899691 73.3201332,57.2741808 L0.0205461621,52.7045816 L18.1170665,0.438788149 Z"
          }
        },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:506d060dabca": {
        d: {
          "0": {
            value: "M29.2020431,4.50211517 C41.6761062,6.85644954 52.7166077,6.85644954 62.3235477,4.50211517"
          }
        },
        stroke: { "0": { value: "#FF5E87" } },
        strokeWidth: { "0": { value: "3.91999977" } },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:7618d3f02ab2": {
        viewBox: { "0": { value: "0 0 77 57" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 77 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 57 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 134.5, edited: true },
          "3717": { value: 109.5, edited: true }
        },
        "translation.y": {
          "0": { value: 207, edited: true },
          "3717": { value: 209, edited: true }
        },
        "style.zIndex": { "0": { value: 27 } },
        opacity: {
          "0": { value: 0, edited: true },
          "3717": { value: 1, edited: true },
          "4983": { value: 0, edited: true },
          "5683": { value: 0, edited: true }
        },
        "offset.x": { "0": { value: 38.5 } },
        "offset.y": { "0": { value: 28.5 } }
      },
      "haiku:ead1929672bf": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:3395b2665897": {
        "translation.x": { "0": { value: -107 } },
        "translation.y": { "0": { value: -206 } }
      },
      "haiku:8bfc283f0cf2": {
        "translation.x": { "0": { value: 35 } },
        "translation.y": { "0": { value: 181 } }
      },
      "haiku:ba48c5f19d23": {
        "translation.x": { "0": { value: 72.07 } },
        "translation.y": { "0": { value: 24.7 } }
      },
      "haiku:d367f2c8fc6d": {
        d: {
          "0": {
            value: "M18.1170665,0.438788149 C32.5402768,5.783363 50.9412991,5.783363 73.3201332,0.438788149 C78.085464,7.3448382 78.085464,26.2899691 73.3201332,57.2741808 L0.0205461621,52.7045816 L18.1170665,0.438788149 Z"
          }
        },
        fill: { "0": { value: "#FFFFFF" } }
      },
      "haiku:8f661fc336a0": {
        d: {
          "0": {
            value: "M29.2020431,4.50211517 C41.6761062,6.85644954 52.7166077,6.85644954 62.3235477,4.50211517"
          }
        },
        stroke: { "0": { value: "#FF5E87" } },
        strokeWidth: { "0": { value: "3.91999977" } },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:5a2822e9e08e": {
        viewBox: { "0": { value: "0 0 112 22" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 112 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 22 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 300, edited: true, curve: "easeOutBack" },
          "500": { value: 86, edited: true },
          "600": { value: 85, edited: true, curve: "easeInBack" },
          "867": { value: -160, edited: true }
        },
        "translation.y": { "0": { value: 348.5, edited: true } },
        "style.zIndex": { "0": { value: 33 } },
        opacity: {
          "0": { value: 0, edited: true, curve: "linear" },
          "83": { value: 1, edited: true }
        },
        "offset.x": { "0": { value: 56 } },
        "offset.y": { "0": { value: 11 } }
      },
      "haiku:bbbf2565cfde": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:676767d9fc9d": {
        fill: { "0": { value: "#5A8E9F" } },
        "translation.x": { "0": { value: -84 } },
        "translation.y": { "0": { value: -338 } }
      },
      "haiku:fe335cf20166": {
        "translation.x": { "0": { value: 37 } },
        "translation.y": { "0": { value: 334 } }
      },
      "haiku:dd9fad545309": {
        d: {
          "0": {
            value: "M47.56,12.02 C47.56,16.02 50.78,19.2 54.76,19.2 C57.66,19.2 59.72,17.88 59.72,17.88 C59.8,17.82 59.88,17.66 59.88,17.56 C59.88,15.96 59.86,14.32 59.86,12.72 C59.86,12.52 59.7,12.34 59.5,12.34 L55.86,12.34 C55.64,12.34 55.48,12.5 55.48,12.72 L55.48,13.88 C55.48,14.08 55.64,14.24 55.86,14.24 L57.82,14.24 L57.82,16.48 C57.62,16.56 56.48,17.16 54.82,17.16 C51.98,17.16 49.8,14.76 49.8,11.98 C49.8,9.18 51.98,6.78 54.82,6.78 C56.04,6.78 57.28,7.32 58.22,8.14 C58.42,8.32 58.58,8.34 58.74,8.16 C59.04,7.84 59.34,7.54 59.64,7.22 C59.8,7.06 59.78,6.82 59.62,6.66 C58.26,5.5 56.68,4.8 54.76,4.8 C50.78,4.8 47.56,8.02 47.56,12.02 Z M61.8,15 C61.8,12.74 63.4,10.8 65.8,10.8 C67.88,10.8 69.48,12.36 69.48,14.5 C69.48,14.64 69.46,14.9 69.44,15.04 C69.42,15.24 69.26,15.38 69.08,15.38 L63.64,15.38 C63.7,16.46 64.64,17.52 65.94,17.52 C66.66,17.52 67.32,17.2 67.72,16.94 C67.96,16.8 68.1,16.72 68.26,16.92 L68.82,17.68 C68.96,17.84 69.02,18 68.78,18.2 C68.2,18.7 67.16,19.2 65.82,19.2 C63.4,19.2 61.8,17.3 61.8,15 Z M63.74,14.12 L67.62,14.12 C67.56,13.16 66.76,12.34 65.78,12.34 C64.7,12.34 63.86,13.12 63.74,14.12 Z M71.92,16.82 C71.92,18.24 72.38,19.2 73.96,19.2 C74.92,19.2 76.1,18.72 76.3,18.6 C76.5,18.5 76.58,18.34 76.48,18.12 L76.12,17.24 C76.04,17.06 75.92,16.94 75.66,17.06 C75.42,17.18 74.86,17.42 74.44,17.42 C74.06,17.42 73.8,17.3 73.8,16.62 L73.8,12.66 L75.84,12.66 C76.06,12.66 76.22,12.48 76.22,12.28 L76.22,11.38 C76.22,11.16 76.06,11 75.84,11 L73.8,11 L73.8,8.76 C73.8,8.56 73.64,8.38 73.44,8.38 L72.3,8.4 C72.1,8.4 71.92,8.58 71.92,8.78 L71.92,11 L71.08,11 C70.86,11 70.7,11.16 70.7,11.38 L70.7,12.28 C70.7,12.48 70.86,12.66 71.08,12.66 L71.92,12.66 L71.92,16.82 Z M78.84,16.82 C78.84,18.24 79.3,19.2 80.88,19.2 C81.84,19.2 83.02,18.72 83.22,18.6 C83.42,18.5 83.5,18.34 83.4,18.12 L83.04,17.24 C82.96,17.06 82.84,16.94 82.58,17.06 C82.34,17.18 81.78,17.42 81.36,17.42 C80.98,17.42 80.72,17.3 80.72,16.62 L80.72,12.66 L82.76,12.66 C82.98,12.66 83.14,12.48 83.14,12.28 L83.14,11.38 C83.14,11.16 82.98,11 82.76,11 L80.72,11 L80.72,8.76 C80.72,8.56 80.56,8.38 80.36,8.38 L79.22,8.4 C79.02,8.4 78.84,8.58 78.84,8.78 L78.84,11 L78,11 C77.78,11 77.62,11.16 77.62,11.38 L77.62,12.28 C77.62,12.48 77.78,12.66 78,12.66 L78.84,12.66 L78.84,16.82 Z M86.16,7.74 C86.82,7.74 87.34,7.22 87.34,6.58 C87.34,5.92 86.82,5.4 86.16,5.4 C85.52,5.4 85.02,5.92 85.02,6.58 C85.02,7.22 85.52,7.74 86.16,7.74 Z M85.24,18.62 C85.24,18.82 85.42,19 85.62,19 L86.76,19 C86.96,19 87.14,18.82 87.14,18.62 L87.14,11.38 C87.14,11.18 86.96,11 86.76,11 L85.62,11 C85.42,11 85.24,11.18 85.24,11.38 L85.24,18.62 Z M89.74,18.62 C89.74,18.82 89.92,19 90.12,19 L91.16,19 C91.5,19 91.62,18.88 91.62,18.62 L91.62,13.74 C91.72,13.46 92.58,12.54 93.84,12.54 C94.88,12.54 95.5,13.24 95.5,14.52 L95.5,18.62 C95.5,18.82 95.66,19 95.88,19 L97.02,19 C97.22,19 97.4,18.82 97.4,18.62 L97.4,14.6 C97.4,12.52 96.5,10.8 94.06,10.8 C92.46,10.8 91.4,11.76 91.26,11.92 L91.02,11.24 C90.98,11.1 90.86,11 90.7,11 L90.12,11 C89.92,11 89.74,11.18 89.74,11.38 L89.74,18.62 Z M99.1,18.52 C99.1,16.98 100.52,16.24 100.52,16.24 C100.52,16.24 99.9,15.5 99.9,14.3 C99.9,12.44 101.3,10.8 103.34,10.8 L106.84,10.8 C107.06,10.8 107.22,10.96 107.22,11.18 L107.22,11.68 C107.22,11.82 107.14,12 107,12.02 L105.9,12.32 C105.9,12.32 106.76,12.96 106.76,14.46 C106.76,16.16 105.44,17.72 103.36,17.72 C102.34,17.72 101.78,17.4 101.62,17.4 C101.48,17.4 100.8,17.74 100.8,18.38 C100.8,18.84 101.16,19.2 101.76,19.2 L104.48,19.2 C106.22,19.2 107.62,20.14 107.62,21.88 C107.62,23.64 106.02,25.2 103.36,25.2 C100.54,25.2 99.4,23.76 99.4,22.46 C99.4,21.26 100.38,20.7 100.58,20.58 L100.58,20.52 C100.16,20.4 99.1,19.86 99.1,18.52 Z M103.38,16.18 C104.38,16.18 105.06,15.42 105.06,14.34 C105.06,13.26 104.38,12.5 103.38,12.5 C102.36,12.5 101.62,13.26 101.62,14.34 C101.62,15.42 102.36,16.18 103.38,16.18 Z M101.26,22.14 C101.26,22.96 102.12,23.56 103.34,23.56 C104.56,23.56 105.62,22.94 105.62,21.98 C105.62,21.66 105.42,20.84 104.12,20.84 C103.54,20.84 102.94,20.84 102.36,20.88 C102.24,20.92 101.26,21.24 101.26,22.14 Z M113.14,18.38 C113.56,18.72 114.44,19.2 115.78,19.2 C117.56,19.2 118.74,18.1 118.74,16.86 C118.74,15.36 117.54,14.74 116.08,14.1 C115.3,13.76 114.8,13.54 114.8,13.02 C114.8,12.72 115.02,12.42 115.7,12.42 C116.46,12.42 117.34,12.84 117.34,12.84 C117.5,12.92 117.76,12.86 117.86,12.68 L118.22,12 C118.34,11.8 118.24,11.54 118.06,11.42 C117.66,11.16 116.82,10.8 115.7,10.8 C113.78,10.8 112.96,12 112.96,13 C112.96,14.32 114,15.08 115.24,15.62 C116.34,16.12 116.78,16.38 116.78,16.92 C116.78,17.36 116.4,17.6 115.8,17.6 C114.82,17.6 113.94,17.08 113.94,17.08 C113.74,16.96 113.52,17.02 113.44,17.18 L113.02,17.96 C112.94,18.12 113.02,18.3 113.14,18.38 Z M120.08,15 C120.08,12.74 121.68,10.8 124.08,10.8 C126.16,10.8 127.76,12.36 127.76,14.5 C127.76,14.64 127.74,14.9 127.72,15.04 C127.7,15.24 127.54,15.38 127.36,15.38 L121.92,15.38 C121.98,16.46 122.92,17.52 124.22,17.52 C124.94,17.52 125.6,17.2 126,16.94 C126.24,16.8 126.38,16.72 126.54,16.92 L127.1,17.68 C127.24,17.84 127.3,18 127.06,18.2 C126.48,18.7 125.44,19.2 124.1,19.2 C121.68,19.2 120.08,17.3 120.08,15 Z M122.02,14.12 L125.9,14.12 C125.84,13.16 125.04,12.34 124.06,12.34 C122.98,12.34 122.14,13.12 122.02,14.12 Z M130.2,16.82 C130.2,18.24 130.66,19.2 132.24,19.2 C133.2,19.2 134.38,18.72 134.58,18.6 C134.78,18.5 134.86,18.34 134.76,18.12 L134.4,17.24 C134.32,17.06 134.2,16.94 133.94,17.06 C133.7,17.18 133.14,17.42 132.72,17.42 C132.34,17.42 132.08,17.3 132.08,16.62 L132.08,12.66 L134.12,12.66 C134.34,12.66 134.5,12.48 134.5,12.28 L134.5,11.38 C134.5,11.16 134.34,11 134.12,11 L132.08,11 L132.08,8.76 C132.08,8.56 131.92,8.38 131.72,8.38 L130.58,8.4 C130.38,8.4 130.2,8.58 130.2,8.78 L130.2,11 L129.36,11 C129.14,11 128.98,11.16 128.98,11.38 L128.98,12.28 C128.98,12.48 129.14,12.66 129.36,12.66 L130.2,12.66 L130.2,16.82 Z M140.88,15.42 C140.88,17.5 141.72,19.2 144.12,19.2 C145.74,19.2 146.58,18.26 146.76,18.1 L146.96,18.68 C147.02,18.86 147.12,19 147.32,19 L147.88,19 C148.08,19 148.26,18.82 148.26,18.62 L148.26,11.38 C148.26,11.18 148.08,11 147.88,11 L146.84,11 C146.56,11 146.4,11.06 146.4,11.38 L146.4,16.16 C146.34,16.52 145.6,17.48 144.42,17.48 C143.4,17.48 142.78,16.78 142.78,15.48 L142.78,11.38 C142.78,11.18 142.6,11 142.4,11 L141.26,11 C141.06,11 140.88,11.18 140.88,11.38 L140.88,15.42 Z M152.78,18.66 L152.78,24.62 C152.78,24.84 152.64,25 152.36,25 L151.24,25 C151.04,25 150.86,24.82 150.86,24.62 L150.86,11.38 C150.86,11.18 151.04,11 151.24,11 L151.84,11 C152,11 152.1,11.08 152.18,11.26 L152.38,11.78 C152.52,11.64 153.34,10.8 154.82,10.8 C157.02,10.8 158.64,12.72 158.64,15.02 C158.64,17.36 156.92,19.2 154.74,19.2 C153.7,19.2 152.92,18.74 152.78,18.66 Z M152.74,16.9 C152.74,16.9 153.44,17.48 154.5,17.48 C155.82,17.48 156.78,16.38 156.78,15.02 C156.78,13.68 155.94,12.54 154.58,12.54 C153.42,12.54 152.82,13.46 152.74,13.7 L152.74,16.9 Z"
          }
        }
      },
      "haiku:72c6fb8758ed": {
        viewBox: { "0": { value: "0 0 195 33" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 195 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 33 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 200, edited: true, curve: "easeOutBack" },
          "500": { value: 42.5, edited: true },
          "733": { value: 42.5, edited: true, curve: "easeInBack" },
          "983": { value: -202.5, edited: true }
        },
        "translation.y": { "0": { value: 376, edited: true } },
        "style.zIndex": { "0": { value: 34 } },
        opacity: {
          "0": { value: 0, edited: true, curve: "linear" },
          "83": { value: 1, edited: true }
        },
        "offset.x": { "0": { value: 97.5 } },
        "offset.y": { "0": { value: 16.5 } }
      },
      "haiku:01f8bb4204e2": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:a3b255b78059": {
        fill: { "0": { value: "#5A8E9F" } },
        "translation.x": { "0": { value: -43 } },
        "translation.y": { "0": { value: -368 } }
      },
      "haiku:361d62e7b3f0": {
        "translation.x": { "0": { value: 37 } },
        "translation.y": { "0": { value: 334 } }
      },
      "haiku:1beae6be009b": {
        d: {
          "0": {
            value: "M12.602,45 C12.672,44.86 12.7,44.664 12.7,44.426 C12.7,44.188 12.672,43.992 12.602,43.852 L7.842,43.852 L7.842,35.34 C7.716,35.27 7.52,35.242 7.212,35.242 C6.904,35.242 6.694,35.27 6.568,35.34 L6.568,45 L12.602,45 Z M19.644,42.004 L15.038,42.004 C15.094,43.53 16.046,44.174 17.558,44.174 C18.412,44.174 19.126,43.964 19.672,43.642 C19.714,44.034 19.56,44.552 19.364,44.776 C18.93,45.042 18.202,45.28 17.278,45.28 C15.024,45.28 13.778,43.88 13.778,41.696 C13.778,39.526 15.038,37.972 17.11,37.972 C18.958,37.972 19.812,39.176 19.812,40.87 C19.812,41.29 19.756,41.668 19.644,42.004 Z M15.052,40.982 L18.608,40.982 C18.706,40.058 18.412,39.022 17.054,39.022 C15.864,39.022 15.15,39.806 15.052,40.982 Z M21.016,38.252 C20.904,38.546 20.848,38.938 20.848,39.358 L21.884,39.358 L21.884,43.11 C21.884,44.58 22.43,45.28 23.774,45.28 C24.376,45.28 24.824,45.14 25.188,44.888 C25.398,44.636 25.538,44.076 25.482,43.642 C25.062,43.992 24.558,44.146 24.138,44.146 C23.298,44.146 23.102,43.712 23.102,42.956 L23.102,39.358 L25.16,39.358 C25.216,39.246 25.244,39.05 25.244,38.798 C25.244,38.546 25.216,38.364 25.16,38.252 L23.102,38.252 L23.102,36.334 C22.64,36.348 22.178,36.474 21.884,36.712 L21.884,38.252 L21.016,38.252 Z M27.12,34.99 C27.064,35.928 26.84,36.936 26.504,37.706 C26.686,37.916 27.05,38.07 27.414,38.112 C27.834,37.398 28.254,35.914 28.31,34.766 C27.806,34.766 27.428,34.85 27.12,34.99 Z M29.5,43.558 C29.444,43.908 29.514,44.524 29.724,44.832 C30.242,45.14 31.026,45.28 31.74,45.28 C33.21,45.28 34.372,44.678 34.372,43.096 C34.372,40.716 30.984,41.262 30.984,39.82 C30.984,39.33 31.32,39.022 32.132,39.022 C32.818,39.022 33.504,39.246 34.05,39.68 C34.106,39.33 34.008,38.742 33.826,38.462 C33.308,38.112 32.65,37.972 32.006,37.972 C30.55,37.972 29.752,38.658 29.752,39.946 C29.752,42.256 33.14,41.668 33.14,43.25 C33.14,43.852 32.622,44.216 31.712,44.216 C30.97,44.216 30.046,43.964 29.5,43.558 Z M44.284,42.004 L39.678,42.004 C39.734,43.53 40.686,44.174 42.198,44.174 C43.052,44.174 43.766,43.964 44.312,43.642 C44.354,44.034 44.2,44.552 44.004,44.776 C43.57,45.042 42.842,45.28 41.918,45.28 C39.664,45.28 38.418,43.88 38.418,41.696 C38.418,39.526 39.678,37.972 41.75,37.972 C43.598,37.972 44.452,39.176 44.452,40.87 C44.452,41.29 44.396,41.668 44.284,42.004 Z M39.692,40.982 L43.248,40.982 C43.346,40.058 43.052,39.022 41.694,39.022 C40.504,39.022 39.79,39.806 39.692,40.982 Z M47.154,38.266 C47.07,38.238 46.888,38.196 46.608,38.196 C46.258,38.196 45.992,38.266 45.838,38.364 L47.966,41.43 L45.488,44.93 C45.6,45.014 45.81,45.042 46.118,45.042 C46.412,45.042 46.706,45.014 46.86,44.944 L48.204,42.998 C48.372,42.76 48.582,42.438 48.638,42.228 L48.694,42.228 C48.778,42.452 48.96,42.746 49.142,43.012 L50.486,44.944 C50.584,45 50.92,45.042 51.214,45.042 C51.536,45.042 51.746,45 51.872,44.93 L49.436,41.458 L51.564,38.364 C51.41,38.266 51.172,38.196 50.822,38.196 C50.556,38.196 50.374,38.238 50.29,38.266 L49.198,39.904 C49.044,40.128 48.834,40.478 48.778,40.674 L48.722,40.674 C48.638,40.464 48.456,40.142 48.288,39.904 L47.154,38.266 Z M54.42,39.162 L54.476,39.162 C54.756,38.546 55.386,37.972 56.604,37.972 C58.032,37.972 59.418,38.826 59.418,41.374 C59.418,43.586 58.396,45.28 55.988,45.28 C55.498,45.28 54.91,45.21 54.56,45.028 L54.56,48.192 C54.434,48.262 54.252,48.29 53.958,48.29 C53.664,48.29 53.468,48.262 53.342,48.192 L53.342,38.336 C53.594,38.21 53.972,38.14 54.336,38.14 L54.42,39.162 Z M54.56,40.058 L54.56,43.964 C54.896,44.104 55.302,44.188 55.764,44.188 C57.5,44.188 58.172,43.04 58.172,41.486 C58.172,39.904 57.486,39.106 56.268,39.106 C55.344,39.106 54.882,39.596 54.56,40.058 Z M63.688,45.028 C63.884,44.776 63.982,44.286 63.954,43.88 C63.744,44.048 63.436,44.16 63.1,44.16 C62.694,44.16 62.47,44.006 62.47,43.39 L62.47,34.71 C61.952,34.71 61.532,34.808 61.252,34.976 L61.252,43.614 C61.252,44.734 61.728,45.28 62.68,45.28 C63.086,45.28 63.45,45.182 63.688,45.028 Z M68.042,37.972 C69.988,37.972 71.234,39.218 71.234,41.528 C71.234,43.964 70.016,45.28 68.042,45.28 C65.97,45.28 64.836,44.02 64.836,41.528 C64.836,39.288 66.096,37.972 68.042,37.972 Z M66.082,41.528 C66.082,43.222 66.74,44.216 68.042,44.216 C69.344,44.216 69.988,43.208 69.988,41.528 C69.988,39.988 69.274,39.036 68.042,39.036 C66.726,39.036 66.082,40.002 66.082,41.528 Z M74.258,39.372 L74.202,39.372 L74.104,38.14 C73.712,38.14 73.348,38.21 73.11,38.336 L73.11,44.93 C73.236,45 73.432,45.028 73.726,45.028 C74.02,45.028 74.202,45 74.328,44.93 L74.328,40.772 C74.678,39.736 75.28,39.19 76.134,39.19 C76.47,39.19 76.778,39.274 77.002,39.4 C77.044,39.302 77.086,39.134 77.086,38.882 C77.086,38.532 77.016,38.294 76.904,38.098 C76.75,38.014 76.484,37.972 76.176,37.972 C75.098,37.972 74.552,38.532 74.258,39.372 Z M83.834,42.004 L79.228,42.004 C79.284,43.53 80.236,44.174 81.748,44.174 C82.602,44.174 83.316,43.964 83.862,43.642 C83.904,44.034 83.75,44.552 83.554,44.776 C83.12,45.042 82.392,45.28 81.468,45.28 C79.214,45.28 77.968,43.88 77.968,41.696 C77.968,39.526 79.228,37.972 81.3,37.972 C83.148,37.972 84.002,39.176 84.002,40.87 C84.002,41.29 83.946,41.668 83.834,42.004 Z M79.242,40.982 L82.798,40.982 C82.896,40.058 82.602,39.022 81.244,39.022 C80.054,39.022 79.34,39.806 79.242,40.982 Z M89.826,40.184 C90.12,39.624 90.708,39.106 91.73,39.106 C92.892,39.106 93.256,39.778 93.256,40.884 L93.256,44.93 C93.382,45 93.578,45.028 93.872,45.028 C94.166,45.028 94.348,45 94.474,44.93 L94.474,40.632 C94.474,38.364 93.214,37.972 92.08,37.972 C90.708,37.972 90.064,38.56 89.77,39.176 L89.714,39.176 C89.798,38.616 89.826,38.028 89.826,37.244 L89.826,34.71 C89.308,34.71 88.888,34.808 88.608,34.976 L88.608,44.93 C88.734,45 88.93,45.028 89.224,45.028 C89.518,45.028 89.7,45 89.826,44.93 L89.826,40.184 Z M99.472,37.972 C101.418,37.972 102.664,39.218 102.664,41.528 C102.664,43.964 101.446,45.28 99.472,45.28 C97.4,45.28 96.266,44.02 96.266,41.528 C96.266,39.288 97.526,37.972 99.472,37.972 Z M97.512,41.528 C97.512,43.222 98.17,44.216 99.472,44.216 C100.774,44.216 101.418,43.208 101.418,41.528 C101.418,39.988 100.704,39.036 99.472,39.036 C98.156,39.036 97.512,40.002 97.512,41.528 Z M110.952,44.118 C110.854,43.558 110.7,42.872 110.588,42.438 L109.454,38.168 C108.81,38.168 108.348,38.238 107.97,38.378 L106.724,42.466 C106.598,42.9 106.458,43.544 106.402,44.118 L106.346,44.118 C106.262,43.502 106.136,42.914 105.954,42.298 L104.778,38.28 C104.694,38.238 104.526,38.196 104.288,38.196 C103.952,38.196 103.756,38.266 103.616,38.364 L105.632,45.14 C106.178,45.14 106.654,45.084 107.046,44.958 L108.292,40.954 C108.46,40.408 108.614,39.778 108.67,39.204 L108.726,39.204 C108.782,39.778 108.908,40.38 109.062,40.912 L110.252,45.14 C110.812,45.14 111.316,45.084 111.708,44.958 L113.682,38.35 C113.528,38.266 113.318,38.196 113.024,38.196 C112.772,38.196 112.632,38.238 112.534,38.28 L111.386,42.27 C111.232,42.816 111.092,43.53 111.008,44.118 L110.952,44.118 Z M117.196,38.252 C117.084,38.546 117.028,38.938 117.028,39.358 L118.064,39.358 L118.064,43.11 C118.064,44.58 118.61,45.28 119.954,45.28 C120.556,45.28 121.004,45.14 121.368,44.888 C121.578,44.636 121.718,44.076 121.662,43.642 C121.242,43.992 120.738,44.146 120.318,44.146 C119.478,44.146 119.282,43.712 119.282,42.956 L119.282,39.358 L121.34,39.358 C121.396,39.246 121.424,39.05 121.424,38.798 C121.424,38.546 121.396,38.364 121.34,38.252 L119.282,38.252 L119.282,36.334 C118.82,36.348 118.358,36.474 118.064,36.712 L118.064,38.252 L117.196,38.252 Z M125.82,37.972 C127.766,37.972 129.012,39.218 129.012,41.528 C129.012,43.964 127.794,45.28 125.82,45.28 C123.748,45.28 122.614,44.02 122.614,41.528 C122.614,39.288 123.874,37.972 125.82,37.972 Z M123.86,41.528 C123.86,43.222 124.518,44.216 125.82,44.216 C127.122,44.216 127.766,43.208 127.766,41.528 C127.766,39.988 127.052,39.036 125.82,39.036 C124.504,39.036 123.86,40.002 123.86,41.528 Z M133.142,43.558 C133.086,43.908 133.156,44.524 133.366,44.832 C133.884,45.14 134.668,45.28 135.382,45.28 C136.852,45.28 138.014,44.678 138.014,43.096 C138.014,40.716 134.626,41.262 134.626,39.82 C134.626,39.33 134.962,39.022 135.774,39.022 C136.46,39.022 137.146,39.246 137.692,39.68 C137.748,39.33 137.65,38.742 137.468,38.462 C136.95,38.112 136.292,37.972 135.648,37.972 C134.192,37.972 133.394,38.658 133.394,39.946 C133.394,42.256 136.782,41.668 136.782,43.25 C136.782,43.852 136.264,44.216 135.354,44.216 C134.612,44.216 133.688,43.964 133.142,43.558 Z M145.182,42.004 L140.576,42.004 C140.632,43.53 141.584,44.174 143.096,44.174 C143.95,44.174 144.664,43.964 145.21,43.642 C145.252,44.034 145.098,44.552 144.902,44.776 C144.468,45.042 143.74,45.28 142.816,45.28 C140.562,45.28 139.316,43.88 139.316,41.696 C139.316,39.526 140.576,37.972 142.648,37.972 C144.496,37.972 145.35,39.176 145.35,40.87 C145.35,41.29 145.294,41.668 145.182,42.004 Z M140.59,40.982 L144.146,40.982 C144.244,40.058 143.95,39.022 142.592,39.022 C141.402,39.022 140.688,39.806 140.59,40.982 Z M146.554,38.252 C146.442,38.546 146.386,38.938 146.386,39.358 L147.422,39.358 L147.422,43.11 C147.422,44.58 147.968,45.28 149.312,45.28 C149.914,45.28 150.362,45.14 150.726,44.888 C150.936,44.636 151.076,44.076 151.02,43.642 C150.6,43.992 150.096,44.146 149.676,44.146 C148.836,44.146 148.64,43.712 148.64,42.956 L148.64,39.358 L150.698,39.358 C150.754,39.246 150.782,39.05 150.782,38.798 C150.782,38.546 150.754,38.364 150.698,38.252 L148.64,38.252 L148.64,36.334 C148.178,36.348 147.716,36.474 147.422,36.712 L147.422,38.252 L146.554,38.252 Z M159.784,44.23 L159.952,45.112 C160.33,45.112 160.666,45.056 160.89,44.916 L160.89,38.322 C160.764,38.252 160.582,38.224 160.288,38.224 C159.994,38.224 159.798,38.252 159.672,38.322 L159.672,43.25 C159.364,43.726 158.762,44.132 157.852,44.132 C156.704,44.132 156.354,43.502 156.354,42.368 L156.354,38.168 C155.836,38.168 155.43,38.266 155.136,38.42 L155.136,42.606 C155.136,44.874 156.368,45.28 157.488,45.28 C158.86,45.28 159.476,44.706 159.728,44.23 L159.784,44.23 Z M164.348,39.162 L164.404,39.162 C164.684,38.546 165.314,37.972 166.532,37.972 C167.96,37.972 169.346,38.826 169.346,41.374 C169.346,43.586 168.324,45.28 165.916,45.28 C165.426,45.28 164.838,45.21 164.488,45.028 L164.488,48.192 C164.362,48.262 164.18,48.29 163.886,48.29 C163.592,48.29 163.396,48.262 163.27,48.192 L163.27,38.336 C163.522,38.21 163.9,38.14 164.264,38.14 L164.348,39.162 Z M164.488,40.058 L164.488,43.964 C164.824,44.104 165.23,44.188 165.692,44.188 C167.428,44.188 168.1,43.04 168.1,41.486 C168.1,39.904 167.414,39.106 166.196,39.106 C165.272,39.106 164.81,39.596 164.488,40.058 Z M176.318,44.412 C176.22,43.852 176.066,43.236 175.912,42.83 L174.176,38.28 C174.092,38.238 173.938,38.196 173.686,38.196 C173.364,38.196 173.098,38.266 172.944,38.364 L175.632,45.224 C175.128,46.176 174.302,47.002 172.958,47.38 C173,47.8 173.182,48.136 173.49,48.374 C175.044,47.87 175.968,46.988 176.724,45.56 C177.312,44.454 177.914,42.788 178.418,41.36 L179.482,38.364 C179.328,38.266 179.118,38.196 178.782,38.196 C178.53,38.196 178.39,38.238 178.292,38.28 L176.738,42.83 C176.584,43.264 176.458,43.838 176.374,44.412 L176.318,44.412 Z M183.514,37.972 C185.46,37.972 186.706,39.218 186.706,41.528 C186.706,43.964 185.488,45.28 183.514,45.28 C181.442,45.28 180.308,44.02 180.308,41.528 C180.308,39.288 181.568,37.972 183.514,37.972 Z M181.554,41.528 C181.554,43.222 182.212,44.216 183.514,44.216 C184.816,44.216 185.46,43.208 185.46,41.528 C185.46,39.988 184.746,39.036 183.514,39.036 C182.198,39.036 181.554,40.002 181.554,41.528 Z M193.146,44.23 L193.314,45.112 C193.692,45.112 194.028,45.056 194.252,44.916 L194.252,38.322 C194.126,38.252 193.944,38.224 193.65,38.224 C193.356,38.224 193.16,38.252 193.034,38.322 L193.034,43.25 C192.726,43.726 192.124,44.132 191.214,44.132 C190.066,44.132 189.716,43.502 189.716,42.368 L189.716,38.168 C189.198,38.168 188.792,38.266 188.498,38.42 L188.498,42.606 C188.498,44.874 189.73,45.28 190.85,45.28 C192.222,45.28 192.838,44.706 193.09,44.23 L193.146,44.23 Z M197.78,39.372 L197.724,39.372 L197.626,38.14 C197.234,38.14 196.87,38.21 196.632,38.336 L196.632,44.93 C196.758,45 196.954,45.028 197.248,45.028 C197.542,45.028 197.724,45 197.85,44.93 L197.85,40.772 C198.2,39.736 198.802,39.19 199.656,39.19 C199.992,39.19 200.3,39.274 200.524,39.4 C200.566,39.302 200.608,39.134 200.608,38.882 C200.608,38.532 200.538,38.294 200.426,38.098 C200.272,38.014 200.006,37.972 199.698,37.972 C198.62,37.972 198.074,38.532 197.78,39.372 Z M81.923,62.93 L81.923,53.354 C82.707,53.2 83.603,53.13 84.527,53.13 C87.145,53.13 88.713,54.124 88.713,56.378 C88.713,58.66 87.117,59.654 84.933,59.654 C84.415,59.654 83.575,59.598 83.197,59.542 L83.197,62.93 C83.071,63 82.875,63.028 82.567,63.028 C82.259,63.028 82.049,63 81.923,62.93 Z M84.541,54.25 C84.079,54.25 83.617,54.278 83.197,54.362 L83.197,58.408 C83.575,58.478 84.233,58.534 84.751,58.534 C86.445,58.534 87.411,57.96 87.411,56.476 C87.411,54.88 86.305,54.25 84.541,54.25 Z M95.531,60.004 L90.925,60.004 C90.981,61.53 91.933,62.174 93.445,62.174 C94.299,62.174 95.013,61.964 95.559,61.642 C95.601,62.034 95.447,62.552 95.251,62.776 C94.817,63.042 94.089,63.28 93.165,63.28 C90.911,63.28 89.665,61.88 89.665,59.696 C89.665,57.526 90.925,55.972 92.997,55.972 C94.845,55.972 95.699,57.176 95.699,58.87 C95.699,59.29 95.643,59.668 95.531,60.004 Z M90.939,58.982 L94.495,58.982 C94.593,58.058 94.299,57.022 92.941,57.022 C91.751,57.022 91.037,57.806 90.939,58.982 Z M98.709,57.372 L98.653,57.372 L98.555,56.14 C98.163,56.14 97.799,56.21 97.561,56.336 L97.561,62.93 C97.687,63 97.883,63.028 98.177,63.028 C98.471,63.028 98.653,63 98.779,62.93 L98.779,58.772 C99.129,57.736 99.731,57.19 100.585,57.19 C100.921,57.19 101.229,57.274 101.453,57.4 C101.495,57.302 101.537,57.134 101.537,56.882 C101.537,56.532 101.467,56.294 101.355,56.098 C101.201,56.014 100.935,55.972 100.627,55.972 C99.549,55.972 99.003,56.532 98.709,57.372 Z M103.665,59.584 C103.665,57.89 104.603,57.106 106.031,57.106 C106.689,57.106 107.207,57.26 107.753,57.596 C107.823,57.19 107.725,56.658 107.529,56.392 C107.137,56.14 106.549,55.972 105.793,55.972 C103.917,55.972 102.419,57.134 102.419,59.682 C102.419,61.908 103.581,63.28 105.653,63.28 C106.479,63.28 107.109,63.084 107.557,62.832 C107.781,62.58 107.935,61.992 107.893,61.614 C107.375,61.922 106.773,62.132 106.059,62.132 C104.575,62.132 103.665,61.32 103.665,59.584 Z M112.051,62.412 C111.953,61.852 111.799,61.236 111.645,60.83 L109.909,56.28 C109.825,56.238 109.671,56.196 109.419,56.196 C109.097,56.196 108.831,56.266 108.677,56.364 L111.365,63.224 C110.861,64.176 110.035,65.002 108.691,65.38 C108.733,65.8 108.915,66.136 109.223,66.374 C110.777,65.87 111.701,64.988 112.457,63.56 C113.045,62.454 113.647,60.788 114.151,59.36 L115.215,56.364 C115.061,56.266 114.851,56.196 114.515,56.196 C114.263,56.196 114.123,56.238 114.025,56.28 L112.471,60.83 C112.317,61.264 112.191,61.838 112.107,62.412 L112.051,62.412 Z M117.035,61.544 C116.531,61.544 116.195,61.838 116.195,62.37 C116.195,62.93 116.503,63.21 117.035,63.21 C117.553,63.21 117.861,62.916 117.861,62.356 C117.861,61.824 117.539,61.544 117.035,61.544 Z M120.409,61.544 C119.905,61.544 119.569,61.838 119.569,62.37 C119.569,62.93 119.877,63.21 120.409,63.21 C120.927,63.21 121.235,62.916 121.235,62.356 C121.235,61.824 120.913,61.544 120.409,61.544 Z M123.783,61.544 C123.279,61.544 122.943,61.838 122.943,62.37 C122.943,62.93 123.251,63.21 123.783,63.21 C124.301,63.21 124.609,62.916 124.609,62.356 C124.609,61.824 124.287,61.544 123.783,61.544 Z"
          }
        }
      },
      "haiku:dfd8db140205": {
        viewBox: { "0": { value: "0 0 176 20" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 176 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 20 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 315.5, edited: true },
          "933": { value: 309, edited: true, curve: "easeOutBack" },
          "1300": { value: 52, edited: true },
          "2200": { value: 52, edited: true, curve: "easeInBack" },
          "2483": { value: -200, edited: true }
        },
        "translation.y": { "0": { value: 349, edited: true } },
        "style.zIndex": { "0": { value: 35 } },
        "offset.x": { "0": { value: 88 } },
        "offset.y": { "0": { value: 10 } }
      },
      "haiku:0e0c7872e0d1": {
        viewBox: { "0": { value: "0 0 192 30" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 192 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 30 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 303.5, edited: true },
          "1017": { value: 309, edited: true, curve: "easeOutBack" },
          "1383": { value: 44, edited: true },
          "2283": { value: 44, edited: true, curve: "easeInBack" },
          "2533": { value: -200, edited: true }
        },
        "translation.y": {
          "0": { value: 376, edited: true },
          "1017": { value: 379, edited: true }
        },
        "style.zIndex": { "0": { value: 36 } },
        "offset.x": { "0": { value: 96 } },
        "offset.y": { "0": { value: 15 } }
      },
      "haiku:7b27d0fc26c6": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:aab5a76eca90": {
        fill: { "0": { value: "#5A8E9F" } },
        "translation.x": { "0": { value: -45 } },
        "translation.y": { "0": { value: -366 } }
      },
      "haiku:9e722b6e907e": {
        d: {
          "0": {
            value: "M54.368,376.23 C54.284,375.544 54.144,374.886 54.004,374.256 L52.366,367.242 C52.184,367.186 51.82,367.158 51.484,367.158 C51.148,367.158 50.798,367.186 50.616,367.242 L48.866,374.256 C48.74,374.774 48.614,375.516 48.53,376.23 L48.474,376.23 C48.39,375.516 48.264,374.732 48.138,374.228 L46.472,367.354 C46.332,367.27 46.108,367.242 45.814,367.242 C45.506,367.242 45.324,367.284 45.198,367.354 L47.62,377.028 C47.802,377.084 48.138,377.112 48.474,377.112 C48.81,377.112 49.16,377.084 49.342,377.028 L51.008,370.336 C51.176,369.678 51.344,368.768 51.428,368.054 L51.484,368.054 C51.582,368.796 51.75,369.636 51.904,370.308 L53.472,377.028 C53.654,377.084 54.018,377.112 54.354,377.112 C54.69,377.112 55.026,377.084 55.208,377.028 L57.756,367.34 C57.644,367.27 57.476,367.242 57.168,367.242 C56.888,367.242 56.664,367.27 56.552,367.34 L54.774,374.312 C54.62,374.9 54.508,375.53 54.424,376.23 L54.368,376.23 Z M64.672,374.004 L60.066,374.004 C60.122,375.53 61.074,376.174 62.586,376.174 C63.44,376.174 64.154,375.964 64.7,375.642 C64.742,376.034 64.588,376.552 64.392,376.776 C63.958,377.042 63.23,377.28 62.306,377.28 C60.052,377.28 58.806,375.88 58.806,373.696 C58.806,371.526 60.066,369.972 62.138,369.972 C63.986,369.972 64.84,371.176 64.84,372.87 C64.84,373.29 64.784,373.668 64.672,374.004 Z M60.08,372.982 L63.636,372.982 C63.734,372.058 63.44,371.022 62.082,371.022 C60.892,371.022 60.178,371.806 60.08,372.982 Z M70.664,372.184 C70.958,371.624 71.532,371.106 72.526,371.106 C73.688,371.106 74.038,371.792 74.038,372.87 L74.038,376.93 C74.164,377 74.36,377.028 74.654,377.028 C74.948,377.028 75.13,377 75.256,376.93 L75.256,372.632 C75.256,370.364 74.01,369.972 72.904,369.972 C71.588,369.972 70.888,370.546 70.58,371.19 L70.524,371.19 L70.44,370.14 C70.048,370.14 69.684,370.21 69.446,370.336 L69.446,376.93 C69.572,377 69.768,377.028 70.062,377.028 C70.356,377.028 70.538,377 70.664,376.93 L70.664,372.184 Z M82.886,374.004 L78.28,374.004 C78.336,375.53 79.288,376.174 80.8,376.174 C81.654,376.174 82.368,375.964 82.914,375.642 C82.956,376.034 82.802,376.552 82.606,376.776 C82.172,377.042 81.444,377.28 80.52,377.28 C78.266,377.28 77.02,375.88 77.02,373.696 C77.02,371.526 78.28,369.972 80.352,369.972 C82.2,369.972 83.054,371.176 83.054,372.87 C83.054,373.29 82.998,373.668 82.886,374.004 Z M78.294,372.982 L81.85,372.982 C81.948,372.058 81.654,371.022 80.296,371.022 C79.106,371.022 78.392,371.806 78.294,372.982 Z M90.25,374.004 L85.644,374.004 C85.7,375.53 86.652,376.174 88.164,376.174 C89.018,376.174 89.732,375.964 90.278,375.642 C90.32,376.034 90.166,376.552 89.97,376.776 C89.536,377.042 88.808,377.28 87.884,377.28 C85.63,377.28 84.384,375.88 84.384,373.696 C84.384,371.526 85.644,369.972 87.716,369.972 C89.564,369.972 90.418,371.176 90.418,372.87 C90.418,373.29 90.362,373.668 90.25,374.004 Z M85.658,372.982 L89.214,372.982 C89.312,372.058 89.018,371.022 87.66,371.022 C86.47,371.022 85.756,371.806 85.658,372.982 Z M96.62,370.238 L96.62,366.976 C96.9,366.808 97.32,366.71 97.838,366.71 L97.838,376.916 C97.6,377.056 97.278,377.112 96.928,377.112 L96.76,376.314 L96.704,376.314 C96.284,376.916 95.584,377.28 94.618,377.28 C92.924,377.28 91.762,376.146 91.762,373.836 C91.762,371.33 93.106,369.972 95.178,369.972 C95.766,369.972 96.284,370.084 96.62,370.238 Z M96.62,375.404 L96.62,371.274 C96.298,371.12 95.878,371.05 95.444,371.05 C93.708,371.05 93.008,372.184 93.008,373.766 C93.008,375.32 93.694,376.132 94.954,376.132 C95.808,376.132 96.27,375.754 96.62,375.404 Z M106.658,376.454 L106.602,376.454 C106.196,376.986 105.552,377.28 104.628,377.28 C103.424,377.28 102.374,376.706 102.374,375.18 C102.374,373.542 103.592,372.87 105.174,372.87 C105.636,372.87 106.168,372.926 106.574,373.094 L106.574,372.73 C106.574,371.568 106.126,371.078 105.034,371.078 C104.236,371.078 103.48,371.33 102.892,371.694 C102.794,371.344 102.836,370.798 103.032,370.476 C103.508,370.196 104.334,369.972 105.258,369.972 C106.924,369.972 107.778,370.686 107.778,372.604 L107.778,375.656 C107.778,376.062 107.988,376.174 108.268,376.174 C108.534,376.174 108.786,376.076 108.926,375.978 C108.954,376.342 108.87,376.776 108.688,377.028 C108.45,377.168 108.142,377.28 107.764,377.28 C107.134,377.28 106.77,376.972 106.658,376.454 Z M106.574,375.446 L106.574,374.074 C106.224,373.948 105.832,373.864 105.356,373.864 C104.194,373.864 103.592,374.382 103.592,375.124 C103.592,375.852 104.18,376.174 104.936,376.174 C105.538,376.174 106.21,375.978 106.574,375.446 Z M112.384,370.252 L113.266,370.252 L113.266,369.104 C113.266,367.116 114.218,366.514 115.492,366.514 C116.066,366.514 116.514,366.64 116.878,366.892 C117.074,367.158 117.158,367.69 117.088,368.082 C116.64,367.746 116.22,367.62 115.744,367.62 C114.764,367.62 114.484,368.152 114.484,369.02 L114.484,370.252 L116.36,370.252 C116.416,370.364 116.444,370.546 116.444,370.798 C116.444,371.05 116.416,371.246 116.36,371.358 L114.484,371.358 L114.484,376.93 C114.358,377 114.176,377.028 113.882,377.028 C113.588,377.028 113.392,377 113.266,376.93 L113.266,371.358 L112.216,371.358 C112.216,370.938 112.272,370.546 112.384,370.252 Z M122.898,374.004 L118.292,374.004 C118.348,375.53 119.3,376.174 120.812,376.174 C121.666,376.174 122.38,375.964 122.926,375.642 C122.968,376.034 122.814,376.552 122.618,376.776 C122.184,377.042 121.456,377.28 120.532,377.28 C118.278,377.28 117.032,375.88 117.032,373.696 C117.032,371.526 118.292,369.972 120.364,369.972 C122.212,369.972 123.066,371.176 123.066,372.87 C123.066,373.29 123.01,373.668 122.898,374.004 Z M118.306,372.982 L121.862,372.982 C121.96,372.058 121.666,371.022 120.308,371.022 C119.118,371.022 118.404,371.806 118.306,372.982 Z M131.34,376.118 C131.242,375.558 131.088,374.872 130.976,374.438 L129.842,370.168 C129.198,370.168 128.736,370.238 128.358,370.378 L127.112,374.466 C126.986,374.9 126.846,375.544 126.79,376.118 L126.734,376.118 C126.65,375.502 126.524,374.914 126.342,374.298 L125.166,370.28 C125.082,370.238 124.914,370.196 124.676,370.196 C124.34,370.196 124.144,370.266 124.004,370.364 L126.02,377.14 C126.566,377.14 127.042,377.084 127.434,376.958 L128.68,372.954 C128.848,372.408 129.002,371.778 129.058,371.204 L129.114,371.204 C129.17,371.778 129.296,372.38 129.45,372.912 L130.64,377.14 C131.2,377.14 131.704,377.084 132.096,376.958 L134.07,370.35 C133.916,370.266 133.706,370.196 133.412,370.196 C133.16,370.196 133.02,370.238 132.922,370.28 L131.774,374.27 C131.62,374.816 131.48,375.53 131.396,376.118 L131.34,376.118 Z M142.582,370.238 L142.582,366.976 C142.862,366.808 143.282,366.71 143.8,366.71 L143.8,376.916 C143.562,377.056 143.24,377.112 142.89,377.112 L142.722,376.314 L142.666,376.314 C142.246,376.916 141.546,377.28 140.58,377.28 C138.886,377.28 137.724,376.146 137.724,373.836 C137.724,371.33 139.068,369.972 141.14,369.972 C141.728,369.972 142.246,370.084 142.582,370.238 Z M142.582,375.404 L142.582,371.274 C142.26,371.12 141.84,371.05 141.406,371.05 C139.67,371.05 138.97,372.184 138.97,373.766 C138.97,375.32 139.656,376.132 140.916,376.132 C141.77,376.132 142.232,375.754 142.582,375.404 Z M151.514,374.004 L146.908,374.004 C146.964,375.53 147.916,376.174 149.428,376.174 C150.282,376.174 150.996,375.964 151.542,375.642 C151.584,376.034 151.43,376.552 151.234,376.776 C150.8,377.042 150.072,377.28 149.148,377.28 C146.894,377.28 145.648,375.88 145.648,373.696 C145.648,371.526 146.908,369.972 148.98,369.972 C150.828,369.972 151.682,371.176 151.682,372.87 C151.682,373.29 151.626,373.668 151.514,374.004 Z M146.922,372.982 L150.478,372.982 C150.576,372.058 150.282,371.022 148.924,371.022 C147.734,371.022 147.02,371.806 146.922,372.982 Z M152.886,370.252 C152.774,370.546 152.718,370.938 152.718,371.358 L153.754,371.358 L153.754,375.11 C153.754,376.58 154.3,377.28 155.644,377.28 C156.246,377.28 156.694,377.14 157.058,376.888 C157.268,376.636 157.408,376.076 157.352,375.642 C156.932,375.992 156.428,376.146 156.008,376.146 C155.168,376.146 154.972,375.712 154.972,374.956 L154.972,371.358 L157.03,371.358 C157.086,371.246 157.114,371.05 157.114,370.798 C157.114,370.546 157.086,370.364 157.03,370.252 L154.972,370.252 L154.972,368.334 C154.51,368.348 154.048,368.474 153.754,368.712 L153.754,370.252 L152.886,370.252 Z M162.504,376.454 L162.448,376.454 C162.042,376.986 161.398,377.28 160.474,377.28 C159.27,377.28 158.22,376.706 158.22,375.18 C158.22,373.542 159.438,372.87 161.02,372.87 C161.482,372.87 162.014,372.926 162.42,373.094 L162.42,372.73 C162.42,371.568 161.972,371.078 160.88,371.078 C160.082,371.078 159.326,371.33 158.738,371.694 C158.64,371.344 158.682,370.798 158.878,370.476 C159.354,370.196 160.18,369.972 161.104,369.972 C162.77,369.972 163.624,370.686 163.624,372.604 L163.624,375.656 C163.624,376.062 163.834,376.174 164.114,376.174 C164.38,376.174 164.632,376.076 164.772,375.978 C164.8,376.342 164.716,376.776 164.534,377.028 C164.296,377.168 163.988,377.28 163.61,377.28 C162.98,377.28 162.616,376.972 162.504,376.454 Z M162.42,375.446 L162.42,374.074 C162.07,373.948 161.678,373.864 161.202,373.864 C160.04,373.864 159.438,374.382 159.438,375.124 C159.438,375.852 160.026,376.174 160.782,376.174 C161.384,376.174 162.056,375.978 162.42,375.446 Z M166.102,376.93 C166.228,377 166.424,377.028 166.718,377.028 C167.012,377.028 167.194,377 167.32,376.93 L167.32,370.322 C167.194,370.252 167.012,370.224 166.718,370.224 C166.424,370.224 166.228,370.252 166.102,370.322 L166.102,376.93 Z M166.718,367.046 C166.242,367.046 165.906,367.354 165.906,367.858 C165.906,368.404 166.186,368.684 166.718,368.684 C167.208,368.684 167.53,368.39 167.53,367.844 C167.53,367.326 167.208,367.046 166.718,367.046 Z M172.108,377.028 C172.304,376.776 172.402,376.286 172.374,375.88 C172.164,376.048 171.856,376.16 171.52,376.16 C171.114,376.16 170.89,376.006 170.89,375.39 L170.89,366.71 C170.372,366.71 169.952,366.808 169.672,366.976 L169.672,375.614 C169.672,376.734 170.148,377.28 171.1,377.28 C171.506,377.28 171.87,377.182 172.108,377.028 Z M173.27,375.558 C173.214,375.908 173.284,376.524 173.494,376.832 C174.012,377.14 174.796,377.28 175.51,377.28 C176.98,377.28 178.142,376.678 178.142,375.096 C178.142,372.716 174.754,373.262 174.754,371.82 C174.754,371.33 175.09,371.022 175.902,371.022 C176.588,371.022 177.274,371.246 177.82,371.68 C177.876,371.33 177.778,370.742 177.596,370.462 C177.078,370.112 176.42,369.972 175.776,369.972 C174.32,369.972 173.522,370.658 173.522,371.946 C173.522,374.256 176.91,373.668 176.91,375.25 C176.91,375.852 176.392,376.216 175.482,376.216 C174.74,376.216 173.816,375.964 173.27,375.558 Z M182.104,370.252 C181.992,370.546 181.936,370.938 181.936,371.358 L182.986,371.358 L182.986,376.93 C183.112,377 183.308,377.028 183.602,377.028 C183.896,377.028 184.078,377 184.204,376.93 L184.204,371.358 L186.08,371.358 C186.136,371.246 186.164,371.05 186.164,370.798 C186.164,370.546 186.136,370.364 186.08,370.252 L184.204,370.252 L184.204,369.02 C184.204,368.152 184.484,367.62 185.464,367.62 C185.94,367.62 186.36,367.746 186.808,368.082 C186.878,367.69 186.794,367.158 186.598,366.892 C186.234,366.64 185.786,366.514 185.212,366.514 C183.938,366.514 182.986,367.116 182.986,369.104 L182.986,370.252 L182.104,370.252 Z M188.432,371.372 L188.376,371.372 L188.278,370.14 C187.886,370.14 187.522,370.21 187.284,370.336 L187.284,376.93 C187.41,377 187.606,377.028 187.9,377.028 C188.194,377.028 188.376,377 188.502,376.93 L188.502,372.772 C188.852,371.736 189.454,371.19 190.308,371.19 C190.644,371.19 190.952,371.274 191.176,371.4 C191.218,371.302 191.26,371.134 191.26,370.882 C191.26,370.532 191.19,370.294 191.078,370.098 C190.924,370.014 190.658,369.972 190.35,369.972 C189.272,369.972 188.726,370.532 188.432,371.372 Z M195.376,369.972 C197.322,369.972 198.568,371.218 198.568,373.528 C198.568,375.964 197.35,377.28 195.376,377.28 C193.304,377.28 192.17,376.02 192.17,373.528 C192.17,371.288 193.43,369.972 195.376,369.972 Z M193.416,373.528 C193.416,375.222 194.074,376.216 195.376,376.216 C196.678,376.216 197.322,375.208 197.322,373.528 C197.322,371.988 196.608,371.036 195.376,371.036 C194.06,371.036 193.416,372.002 193.416,373.528 Z M201.662,372.184 C201.942,371.624 202.516,371.106 203.496,371.106 C204.616,371.106 204.966,371.806 204.966,372.884 L204.966,376.93 C205.092,377 205.288,377.028 205.582,377.028 C205.876,377.028 206.058,377 206.184,376.93 L206.184,372.814 C206.184,372.576 206.17,372.282 206.156,372.198 C206.464,371.61 206.982,371.106 207.99,371.106 C209.11,371.106 209.46,371.792 209.46,372.87 L209.46,376.93 C209.586,377 209.782,377.028 210.076,377.028 C210.37,377.028 210.552,377 210.678,376.93 L210.678,372.632 C210.678,370.364 209.46,369.972 208.34,369.972 C206.968,369.972 206.296,370.616 206.016,371.232 L205.96,371.232 C205.568,370.224 204.742,369.972 203.846,369.972 C202.516,369.972 201.886,370.574 201.578,371.19 L201.522,371.19 L201.438,370.14 C201.046,370.14 200.682,370.21 200.444,370.336 L200.444,376.93 C200.57,377 200.766,377.028 201.06,377.028 C201.354,377.028 201.536,377 201.662,376.93 L201.662,372.184 Z M218.084,376.412 C217.986,375.852 217.832,375.236 217.678,374.83 L215.942,370.28 C215.858,370.238 215.704,370.196 215.452,370.196 C215.13,370.196 214.864,370.266 214.71,370.364 L217.398,377.224 C216.894,378.176 216.068,379.002 214.724,379.38 C214.766,379.8 214.948,380.136 215.256,380.374 C216.81,379.87 217.734,378.988 218.49,377.56 C219.078,376.454 219.68,374.788 220.184,373.36 L221.248,370.364 C221.094,370.266 220.884,370.196 220.548,370.196 C220.296,370.196 220.156,370.238 220.058,370.28 L218.504,374.83 C218.35,375.264 218.224,375.838 218.14,376.412 L218.084,376.412 Z M225.28,369.972 C227.226,369.972 228.472,371.218 228.472,373.528 C228.472,375.964 227.254,377.28 225.28,377.28 C223.208,377.28 222.074,376.02 222.074,373.528 C222.074,371.288 223.334,369.972 225.28,369.972 Z M223.32,373.528 C223.32,375.222 223.978,376.216 225.28,376.216 C226.582,376.216 227.226,375.208 227.226,373.528 C227.226,371.988 226.512,371.036 225.28,371.036 C223.964,371.036 223.32,372.002 223.32,373.528 Z M234.912,376.23 L235.08,377.112 C235.458,377.112 235.794,377.056 236.018,376.916 L236.018,370.322 C235.892,370.252 235.71,370.224 235.416,370.224 C235.122,370.224 234.926,370.252 234.8,370.322 L234.8,375.25 C234.492,375.726 233.89,376.132 232.98,376.132 C231.832,376.132 231.482,375.502 231.482,374.368 L231.482,370.168 C230.964,370.168 230.558,370.266 230.264,370.42 L230.264,374.606 C230.264,376.874 231.496,377.28 232.616,377.28 C233.988,377.28 234.604,376.706 234.856,376.23 L234.912,376.23 Z M46.92,388.252 C46.808,388.546 46.752,388.938 46.752,389.358 L47.788,389.358 L47.788,393.11 C47.788,394.58 48.334,395.28 49.678,395.28 C50.28,395.28 50.728,395.14 51.092,394.888 C51.302,394.636 51.442,394.076 51.386,393.642 C50.966,393.992 50.462,394.146 50.042,394.146 C49.202,394.146 49.006,393.712 49.006,392.956 L49.006,389.358 L51.064,389.358 C51.12,389.246 51.148,389.05 51.148,388.798 C51.148,388.546 51.12,388.364 51.064,388.252 L49.006,388.252 L49.006,386.334 C48.544,386.348 48.082,386.474 47.788,386.712 L47.788,388.252 L46.92,388.252 Z M55.544,387.972 C57.49,387.972 58.736,389.218 58.736,391.528 C58.736,393.964 57.518,395.28 55.544,395.28 C53.472,395.28 52.338,394.02 52.338,391.528 C52.338,389.288 53.598,387.972 55.544,387.972 Z M53.584,391.528 C53.584,393.222 54.242,394.216 55.544,394.216 C56.846,394.216 57.49,393.208 57.49,391.528 C57.49,389.988 56.776,389.036 55.544,389.036 C54.228,389.036 53.584,390.002 53.584,391.528 Z M64.574,384.71 L64.574,387.342 C64.574,387.916 64.546,388.574 64.476,389.106 L64.532,389.106 C64.798,388.476 65.456,387.972 66.59,387.972 C68.032,387.972 69.418,388.84 69.418,391.388 C69.418,393.978 68.032,395.28 65.666,395.28 C64.896,395.28 64.056,395.14 63.356,394.846 L63.356,384.976 C63.636,384.808 64.056,384.71 64.574,384.71 Z M64.574,390.03 L64.574,394.062 C64.854,394.16 65.274,394.216 65.68,394.216 C67.486,394.216 68.172,393.138 68.172,391.528 C68.172,389.918 67.486,389.092 66.268,389.092 C65.386,389.092 64.91,389.54 64.574,390.03 Z M76.614,392.004 L72.008,392.004 C72.064,393.53 73.016,394.174 74.528,394.174 C75.382,394.174 76.096,393.964 76.642,393.642 C76.684,394.034 76.53,394.552 76.334,394.776 C75.9,395.042 75.172,395.28 74.248,395.28 C71.994,395.28 70.748,393.88 70.748,391.696 C70.748,389.526 72.008,387.972 74.08,387.972 C75.928,387.972 76.782,389.176 76.782,390.87 C76.782,391.29 76.726,391.668 76.614,392.004 Z M72.022,390.982 L75.578,390.982 C75.676,390.058 75.382,389.022 74.024,389.022 C72.834,389.022 72.12,389.806 72.022,390.982 Z M85.084,394.454 L85.028,394.454 C84.622,394.986 83.978,395.28 83.054,395.28 C81.85,395.28 80.8,394.706 80.8,393.18 C80.8,391.542 82.018,390.87 83.6,390.87 C84.062,390.87 84.594,390.926 85,391.094 L85,390.73 C85,389.568 84.552,389.078 83.46,389.078 C82.662,389.078 81.906,389.33 81.318,389.694 C81.22,389.344 81.262,388.798 81.458,388.476 C81.934,388.196 82.76,387.972 83.684,387.972 C85.35,387.972 86.204,388.686 86.204,390.604 L86.204,393.656 C86.204,394.062 86.414,394.174 86.694,394.174 C86.96,394.174 87.212,394.076 87.352,393.978 C87.38,394.342 87.296,394.776 87.114,395.028 C86.876,395.168 86.568,395.28 86.19,395.28 C85.56,395.28 85.196,394.972 85.084,394.454 Z M85,393.446 L85,392.074 C84.65,391.948 84.258,391.864 83.782,391.864 C82.62,391.864 82.018,392.382 82.018,393.124 C82.018,393.852 82.606,394.174 83.362,394.174 C83.964,394.174 84.636,393.978 85,393.446 Z M89.9,384.71 L89.9,387.342 C89.9,387.916 89.872,388.574 89.802,389.106 L89.858,389.106 C90.124,388.476 90.782,387.972 91.916,387.972 C93.358,387.972 94.744,388.84 94.744,391.388 C94.744,393.978 93.358,395.28 90.992,395.28 C90.222,395.28 89.382,395.14 88.682,394.846 L88.682,384.976 C88.962,384.808 89.382,384.71 89.9,384.71 Z M89.9,390.03 L89.9,394.062 C90.18,394.16 90.6,394.216 91.006,394.216 C92.812,394.216 93.498,393.138 93.498,391.528 C93.498,389.918 92.812,389.092 91.594,389.092 C90.712,389.092 90.236,389.54 89.9,390.03 Z M99.014,395.028 C99.21,394.776 99.308,394.286 99.28,393.88 C99.07,394.048 98.762,394.16 98.426,394.16 C98.02,394.16 97.796,394.006 97.796,393.39 L97.796,384.71 C97.278,384.71 96.858,384.808 96.578,384.976 L96.578,393.614 C96.578,394.734 97.054,395.28 98.006,395.28 C98.412,395.28 98.776,395.182 99.014,395.028 Z M106,392.004 L101.394,392.004 C101.45,393.53 102.402,394.174 103.914,394.174 C104.768,394.174 105.482,393.964 106.028,393.642 C106.07,394.034 105.916,394.552 105.72,394.776 C105.286,395.042 104.558,395.28 103.634,395.28 C101.38,395.28 100.134,393.88 100.134,391.696 C100.134,389.526 101.394,387.972 103.466,387.972 C105.314,387.972 106.168,389.176 106.168,390.87 C106.168,391.29 106.112,391.668 106,392.004 Z M101.408,390.982 L104.964,390.982 C105.062,390.058 104.768,389.022 103.41,389.022 C102.22,389.022 101.506,389.806 101.408,390.982 Z M110.116,388.252 C110.004,388.546 109.948,388.938 109.948,389.358 L110.984,389.358 L110.984,393.11 C110.984,394.58 111.53,395.28 112.874,395.28 C113.476,395.28 113.924,395.14 114.288,394.888 C114.498,394.636 114.638,394.076 114.582,393.642 C114.162,393.992 113.658,394.146 113.238,394.146 C112.398,394.146 112.202,393.712 112.202,392.956 L112.202,389.358 L114.26,389.358 C114.316,389.246 114.344,389.05 114.344,388.798 C114.344,388.546 114.316,388.364 114.26,388.252 L112.202,388.252 L112.202,386.334 C111.74,386.348 111.278,386.474 110.984,386.712 L110.984,388.252 L110.116,388.252 Z M118.74,387.972 C120.686,387.972 121.932,389.218 121.932,391.528 C121.932,393.964 120.714,395.28 118.74,395.28 C116.668,395.28 115.534,394.02 115.534,391.528 C115.534,389.288 116.794,387.972 118.74,387.972 Z M116.78,391.528 C116.78,393.222 117.438,394.216 118.74,394.216 C120.042,394.216 120.686,393.208 120.686,391.528 C120.686,389.988 119.972,389.036 118.74,389.036 C117.424,389.036 116.78,390.002 116.78,391.528 Z M127.266,391.584 C127.266,389.89 128.204,389.106 129.632,389.106 C130.29,389.106 130.808,389.26 131.354,389.596 C131.424,389.19 131.326,388.658 131.13,388.392 C130.738,388.14 130.15,387.972 129.394,387.972 C127.518,387.972 126.02,389.134 126.02,391.682 C126.02,393.908 127.182,395.28 129.254,395.28 C130.08,395.28 130.71,395.084 131.158,394.832 C131.382,394.58 131.536,393.992 131.494,393.614 C130.976,393.922 130.374,394.132 129.66,394.132 C128.176,394.132 127.266,393.32 127.266,391.584 Z M134.434,389.372 L134.378,389.372 L134.28,388.14 C133.888,388.14 133.524,388.21 133.286,388.336 L133.286,394.93 C133.412,395 133.608,395.028 133.902,395.028 C134.196,395.028 134.378,395 134.504,394.93 L134.504,390.772 C134.854,389.736 135.456,389.19 136.31,389.19 C136.646,389.19 136.954,389.274 137.178,389.4 C137.22,389.302 137.262,389.134 137.262,388.882 C137.262,388.532 137.192,388.294 137.08,388.098 C136.926,388.014 136.66,387.972 136.352,387.972 C135.274,387.972 134.728,388.532 134.434,389.372 Z M144.01,392.004 L139.404,392.004 C139.46,393.53 140.412,394.174 141.924,394.174 C142.778,394.174 143.492,393.964 144.038,393.642 C144.08,394.034 143.926,394.552 143.73,394.776 C143.296,395.042 142.568,395.28 141.644,395.28 C139.39,395.28 138.144,393.88 138.144,391.696 C138.144,389.526 139.404,387.972 141.476,387.972 C143.324,387.972 144.178,389.176 144.178,390.87 C144.178,391.29 144.122,391.668 144.01,392.004 Z M139.418,390.982 L142.974,390.982 C143.072,390.058 142.778,389.022 141.42,389.022 C140.23,389.022 139.516,389.806 139.418,390.982 Z M149.736,394.454 L149.68,394.454 C149.274,394.986 148.63,395.28 147.706,395.28 C146.502,395.28 145.452,394.706 145.452,393.18 C145.452,391.542 146.67,390.87 148.252,390.87 C148.714,390.87 149.246,390.926 149.652,391.094 L149.652,390.73 C149.652,389.568 149.204,389.078 148.112,389.078 C147.314,389.078 146.558,389.33 145.97,389.694 C145.872,389.344 145.914,388.798 146.11,388.476 C146.586,388.196 147.412,387.972 148.336,387.972 C150.002,387.972 150.856,388.686 150.856,390.604 L150.856,393.656 C150.856,394.062 151.066,394.174 151.346,394.174 C151.612,394.174 151.864,394.076 152.004,393.978 C152.032,394.342 151.948,394.776 151.766,395.028 C151.528,395.168 151.22,395.28 150.842,395.28 C150.212,395.28 149.848,394.972 149.736,394.454 Z M149.652,393.446 L149.652,392.074 C149.302,391.948 148.91,391.864 148.434,391.864 C147.272,391.864 146.67,392.382 146.67,393.124 C146.67,393.852 147.258,394.174 148.014,394.174 C148.616,394.174 149.288,393.978 149.652,393.446 Z M152.676,388.252 C152.564,388.546 152.508,388.938 152.508,389.358 L153.544,389.358 L153.544,393.11 C153.544,394.58 154.09,395.28 155.434,395.28 C156.036,395.28 156.484,395.14 156.848,394.888 C157.058,394.636 157.198,394.076 157.142,393.642 C156.722,393.992 156.218,394.146 155.798,394.146 C154.958,394.146 154.762,393.712 154.762,392.956 L154.762,389.358 L156.82,389.358 C156.876,389.246 156.904,389.05 156.904,388.798 C156.904,388.546 156.876,388.364 156.82,388.252 L154.762,388.252 L154.762,386.334 C154.3,386.348 153.838,386.474 153.544,386.712 L153.544,388.252 L152.676,388.252 Z M163.932,392.004 L159.326,392.004 C159.382,393.53 160.334,394.174 161.846,394.174 C162.7,394.174 163.414,393.964 163.96,393.642 C164.002,394.034 163.848,394.552 163.652,394.776 C163.218,395.042 162.49,395.28 161.566,395.28 C159.312,395.28 158.066,393.88 158.066,391.696 C158.066,389.526 159.326,387.972 161.398,387.972 C163.246,387.972 164.1,389.176 164.1,390.87 C164.1,391.29 164.044,391.668 163.932,392.004 Z M159.34,390.982 L162.896,390.982 C162.994,390.058 162.7,389.022 161.342,389.022 C160.152,389.022 159.438,389.806 159.34,390.982 Z M172.402,394.454 L172.346,394.454 C171.94,394.986 171.296,395.28 170.372,395.28 C169.168,395.28 168.118,394.706 168.118,393.18 C168.118,391.542 169.336,390.87 170.918,390.87 C171.38,390.87 171.912,390.926 172.318,391.094 L172.318,390.73 C172.318,389.568 171.87,389.078 170.778,389.078 C169.98,389.078 169.224,389.33 168.636,389.694 C168.538,389.344 168.58,388.798 168.776,388.476 C169.252,388.196 170.078,387.972 171.002,387.972 C172.668,387.972 173.522,388.686 173.522,390.604 L173.522,393.656 C173.522,394.062 173.732,394.174 174.012,394.174 C174.278,394.174 174.53,394.076 174.67,393.978 C174.698,394.342 174.614,394.776 174.432,395.028 C174.194,395.168 173.886,395.28 173.508,395.28 C172.878,395.28 172.514,394.972 172.402,394.454 Z M172.318,393.446 L172.318,392.074 C171.968,391.948 171.576,391.864 171.1,391.864 C169.938,391.864 169.336,392.382 169.336,393.124 C169.336,393.852 169.924,394.174 170.68,394.174 C171.282,394.174 171.954,393.978 172.318,393.446 Z M177.218,390.184 C177.512,389.624 178.086,389.106 179.08,389.106 C180.242,389.106 180.592,389.792 180.592,390.87 L180.592,394.93 C180.718,395 180.914,395.028 181.208,395.028 C181.502,395.028 181.684,395 181.81,394.93 L181.81,390.632 C181.81,388.364 180.564,387.972 179.458,387.972 C178.142,387.972 177.442,388.546 177.134,389.19 L177.078,389.19 L176.994,388.14 C176.602,388.14 176.238,388.21 176,388.336 L176,394.93 C176.126,395 176.322,395.028 176.616,395.028 C176.91,395.028 177.092,395 177.218,394.93 L177.218,390.184 Z M190.546,394.454 L190.49,394.454 C190.084,394.986 189.44,395.28 188.516,395.28 C187.312,395.28 186.262,394.706 186.262,393.18 C186.262,391.542 187.48,390.87 189.062,390.87 C189.524,390.87 190.056,390.926 190.462,391.094 L190.462,390.73 C190.462,389.568 190.014,389.078 188.922,389.078 C188.124,389.078 187.368,389.33 186.78,389.694 C186.682,389.344 186.724,388.798 186.92,388.476 C187.396,388.196 188.222,387.972 189.146,387.972 C190.812,387.972 191.666,388.686 191.666,390.604 L191.666,393.656 C191.666,394.062 191.876,394.174 192.156,394.174 C192.422,394.174 192.674,394.076 192.814,393.978 C192.842,394.342 192.758,394.776 192.576,395.028 C192.338,395.168 192.03,395.28 191.652,395.28 C191.022,395.28 190.658,394.972 190.546,394.454 Z M190.462,393.446 L190.462,392.074 C190.112,391.948 189.72,391.864 189.244,391.864 C188.082,391.864 187.48,392.382 187.48,393.124 C187.48,393.852 188.068,394.174 188.824,394.174 C189.426,394.174 190.098,393.978 190.462,393.446 Z M194.858,391.584 C194.858,389.89 195.796,389.106 197.224,389.106 C197.882,389.106 198.4,389.26 198.946,389.596 C199.016,389.19 198.918,388.658 198.722,388.392 C198.33,388.14 197.742,387.972 196.986,387.972 C195.11,387.972 193.612,389.134 193.612,391.682 C193.612,393.908 194.774,395.28 196.846,395.28 C197.672,395.28 198.302,395.084 198.75,394.832 C198.974,394.58 199.128,393.992 199.086,393.614 C198.568,393.922 197.966,394.132 197.252,394.132 C195.768,394.132 194.858,393.32 194.858,391.584 Z M201.592,391.584 C201.592,389.89 202.53,389.106 203.958,389.106 C204.616,389.106 205.134,389.26 205.68,389.596 C205.75,389.19 205.652,388.658 205.456,388.392 C205.064,388.14 204.476,387.972 203.72,387.972 C201.844,387.972 200.346,389.134 200.346,391.682 C200.346,393.908 201.508,395.28 203.58,395.28 C204.406,395.28 205.036,395.084 205.484,394.832 C205.708,394.58 205.862,393.992 205.82,393.614 C205.302,393.922 204.7,394.132 203.986,394.132 C202.502,394.132 201.592,393.32 201.592,391.584 Z M210.314,387.972 C212.26,387.972 213.506,389.218 213.506,391.528 C213.506,393.964 212.288,395.28 210.314,395.28 C208.242,395.28 207.108,394.02 207.108,391.528 C207.108,389.288 208.368,387.972 210.314,387.972 Z M208.354,391.528 C208.354,393.222 209.012,394.216 210.314,394.216 C211.616,394.216 212.26,393.208 212.26,391.528 C212.26,389.988 211.546,389.036 210.314,389.036 C208.998,389.036 208.354,390.002 208.354,391.528 Z M219.946,394.23 L220.114,395.112 C220.492,395.112 220.828,395.056 221.052,394.916 L221.052,388.322 C220.926,388.252 220.744,388.224 220.45,388.224 C220.156,388.224 219.96,388.252 219.834,388.322 L219.834,393.25 C219.526,393.726 218.924,394.132 218.014,394.132 C216.866,394.132 216.516,393.502 216.516,392.368 L216.516,388.168 C215.998,388.168 215.592,388.266 215.298,388.42 L215.298,392.606 C215.298,394.874 216.53,395.28 217.65,395.28 C219.022,395.28 219.638,394.706 219.89,394.23 L219.946,394.23 Z M224.65,390.184 C224.944,389.624 225.518,389.106 226.512,389.106 C227.674,389.106 228.024,389.792 228.024,390.87 L228.024,394.93 C228.15,395 228.346,395.028 228.64,395.028 C228.934,395.028 229.116,395 229.242,394.93 L229.242,390.632 C229.242,388.364 227.996,387.972 226.89,387.972 C225.574,387.972 224.874,388.546 224.566,389.19 L224.51,389.19 L224.426,388.14 C224.034,388.14 223.67,388.21 223.432,388.336 L223.432,394.93 C223.558,395 223.754,395.028 224.048,395.028 C224.342,395.028 224.524,395 224.65,394.93 L224.65,390.184 Z M230.88,388.252 C230.768,388.546 230.712,388.938 230.712,389.358 L231.748,389.358 L231.748,393.11 C231.748,394.58 232.294,395.28 233.638,395.28 C234.24,395.28 234.688,395.14 235.052,394.888 C235.262,394.636 235.402,394.076 235.346,393.642 C234.926,393.992 234.422,394.146 234.002,394.146 C233.162,394.146 232.966,393.712 232.966,392.956 L232.966,389.358 L235.024,389.358 C235.08,389.246 235.108,389.05 235.108,388.798 C235.108,388.546 235.08,388.364 235.024,388.252 L232.966,388.252 L232.966,386.334 C232.504,386.348 232.042,386.474 231.748,386.712 L231.748,388.252 L230.88,388.252 Z"
          }
        }
      },
      "haiku:e50af4fbb652": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:cc6ff2206d25": {
        fill: { "0": { value: "#5A8E9F" } },
        "translation.x": { "0": { value: -54 } },
        "translation.y": { "0": { value: -336 } }
      },
      "haiku:2398f4c5bae0": {
        d: {
          "0": {
            value: "M54.66,349.62 C54.66,349.82 54.82,350 55.04,350 L56.34,350 C56.54,350 56.72,349.82 56.72,349.62 L56.72,344.36 L62.06,344.36 C62.26,344.36 62.44,344.18 62.44,343.98 L62.44,342.88 C62.44,342.68 62.26,342.5 62.06,342.5 L56.72,342.5 L56.72,337.88 L63.04,337.88 C63.26,337.88 63.42,337.7 63.42,337.5 L63.42,336.38 C63.42,336.18 63.26,336 63.04,336 L55.04,336 C54.82,336 54.66,336.18 54.66,336.38 L54.66,349.62 Z M66.26,338.74 C66.92,338.74 67.44,338.22 67.44,337.58 C67.44,336.92 66.92,336.4 66.26,336.4 C65.62,336.4 65.12,336.92 65.12,337.58 C65.12,338.22 65.62,338.74 66.26,338.74 Z M65.34,349.62 C65.34,349.82 65.52,350 65.72,350 L66.86,350 C67.06,350 67.24,349.82 67.24,349.62 L67.24,342.38 C67.24,342.18 67.06,342 66.86,342 L65.72,342 C65.52,342 65.34,342.18 65.34,342.38 L65.34,349.62 Z M69.84,349.62 C69.84,349.82 70.02,350 70.22,350 L71.36,350 C71.56,350 71.74,349.82 71.74,349.62 L71.74,336.38 C71.74,336.18 71.56,336 71.36,336 L70.22,336 C70.02,336 69.84,336.18 69.84,336.38 L69.84,349.62 Z M73.76,346 C73.76,343.74 75.36,341.8 77.76,341.8 C79.84,341.8 81.44,343.36 81.44,345.5 C81.44,345.64 81.42,345.9 81.4,346.04 C81.38,346.24 81.22,346.38 81.04,346.38 L75.6,346.38 C75.66,347.46 76.6,348.52 77.9,348.52 C78.62,348.52 79.28,348.2 79.68,347.94 C79.92,347.8 80.06,347.72 80.22,347.92 L80.78,348.68 C80.92,348.84 80.98,349 80.74,349.2 C80.16,349.7 79.12,350.2 77.78,350.2 C75.36,350.2 73.76,348.3 73.76,346 Z M75.7,345.12 L79.58,345.12 C79.52,344.16 78.72,343.34 77.74,343.34 C76.66,343.34 75.82,344.12 75.7,345.12 Z M87.76,349.62 C87.76,349.82 87.94,350 88.14,350 L89.18,350 C89.52,350 89.64,349.88 89.64,349.62 L89.64,344.74 C89.74,344.46 90.6,343.54 91.86,343.54 C92.9,343.54 93.52,344.24 93.52,345.52 L93.52,349.62 C93.52,349.82 93.68,350 93.9,350 L95.04,350 C95.24,350 95.42,349.82 95.42,349.62 L95.42,345.6 C95.42,343.52 94.52,341.8 92.08,341.8 C90.48,341.8 89.42,342.76 89.28,342.92 L89.04,342.24 C89,342.1 88.88,342 88.72,342 L88.14,342 C87.94,342 87.76,342.18 87.76,342.38 L87.76,349.62 Z M97.34,346 C97.34,343.74 98.94,341.8 101.34,341.8 C103.42,341.8 105.02,343.36 105.02,345.5 C105.02,345.64 105,345.9 104.98,346.04 C104.96,346.24 104.8,346.38 104.62,346.38 L99.18,346.38 C99.24,347.46 100.18,348.52 101.48,348.52 C102.2,348.52 102.86,348.2 103.26,347.94 C103.5,347.8 103.64,347.72 103.8,347.92 L104.36,348.68 C104.5,348.84 104.56,349 104.32,349.2 C103.74,349.7 102.7,350.2 101.36,350.2 C98.94,350.2 97.34,348.3 97.34,346 Z M99.28,345.12 L103.16,345.12 C103.1,344.16 102.3,343.34 101.32,343.34 C100.24,343.34 99.4,344.12 99.28,345.12 Z M106.36,346 C106.36,343.74 107.96,341.8 110.36,341.8 C112.44,341.8 114.04,343.36 114.04,345.5 C114.04,345.64 114.02,345.9 114,346.04 C113.98,346.24 113.82,346.38 113.64,346.38 L108.2,346.38 C108.26,347.46 109.2,348.52 110.5,348.52 C111.22,348.52 111.88,348.2 112.28,347.94 C112.52,347.8 112.66,347.72 112.82,347.92 L113.38,348.68 C113.52,348.84 113.58,349 113.34,349.2 C112.76,349.7 111.72,350.2 110.38,350.2 C107.96,350.2 106.36,348.3 106.36,346 Z M108.3,345.12 L112.18,345.12 C112.12,344.16 111.32,343.34 110.34,343.34 C109.26,343.34 108.42,344.12 108.3,345.12 Z M115.38,346 C115.38,343.66 117.1,341.8 119.32,341.8 C120.34,341.8 121.06,342.18 121.24,342.24 L121.24,336.38 C121.24,336.18 121.42,336 121.62,336 L122.78,336 C122.98,336 123.16,336.18 123.16,336.38 L123.16,349.62 C123.16,349.82 122.98,350 122.78,350 L122.18,350 C122,350 121.88,349.86 121.82,349.66 L121.66,349.08 C121.66,349.08 120.7,350.2 119.12,350.2 C117,350.2 115.38,348.3 115.38,346 Z M117.24,346 C117.24,347.34 118.08,348.48 119.36,348.48 C120.58,348.48 121.16,347.5 121.26,347.28 L121.26,344.02 C121.26,344.02 120.56,343.54 119.52,343.54 C118.18,343.54 117.24,344.64 117.24,346 Z M125.18,346 C125.18,343.74 126.78,341.8 129.18,341.8 C131.26,341.8 132.86,343.36 132.86,345.5 C132.86,345.64 132.84,345.9 132.82,346.04 C132.8,346.24 132.64,346.38 132.46,346.38 L127.02,346.38 C127.08,347.46 128.02,348.52 129.32,348.52 C130.04,348.52 130.7,348.2 131.1,347.94 C131.34,347.8 131.48,347.72 131.64,347.92 L132.2,348.68 C132.34,348.84 132.4,349 132.16,349.2 C131.58,349.7 130.54,350.2 129.2,350.2 C126.78,350.2 125.18,348.3 125.18,346 Z M127.12,345.12 L131,345.12 C130.94,344.16 130.14,343.34 129.16,343.34 C128.08,343.34 127.24,344.12 127.12,345.12 Z M134.2,346 C134.2,343.66 135.92,341.8 138.14,341.8 C139.16,341.8 139.88,342.18 140.06,342.24 L140.06,336.38 C140.06,336.18 140.24,336 140.44,336 L141.6,336 C141.8,336 141.98,336.18 141.98,336.38 L141.98,349.62 C141.98,349.82 141.8,350 141.6,350 L141,350 C140.82,350 140.7,349.86 140.64,349.66 L140.48,349.08 C140.48,349.08 139.52,350.2 137.94,350.2 C135.82,350.2 134.2,348.3 134.2,346 Z M136.06,346 C136.06,347.34 136.9,348.48 138.18,348.48 C139.4,348.48 139.98,347.5 140.08,347.28 L140.08,344.02 C140.08,344.02 139.38,343.54 138.34,343.54 C137,343.54 136.06,344.64 136.06,346 Z M150.9,349.66 L150.9,355.62 C150.9,355.84 150.76,356 150.48,356 L149.36,356 C149.16,356 148.98,355.82 148.98,355.62 L148.98,342.38 C148.98,342.18 149.16,342 149.36,342 L149.96,342 C150.12,342 150.22,342.08 150.3,342.26 L150.5,342.78 C150.64,342.64 151.46,341.8 152.94,341.8 C155.14,341.8 156.76,343.72 156.76,346.02 C156.76,348.36 155.04,350.2 152.86,350.2 C151.82,350.2 151.04,349.74 150.9,349.66 Z M150.86,347.9 C150.86,347.9 151.56,348.48 152.62,348.48 C153.94,348.48 154.9,347.38 154.9,346.02 C154.9,344.68 154.06,343.54 152.7,343.54 C151.54,343.54 150.94,344.46 150.86,344.7 L150.86,347.9 Z M158.2,347.52 C158.2,346.06 159.36,344.94 161.4,344.94 C162.24,344.94 162.98,345.18 162.98,345.18 C163,343.92 162.76,343.42 161.74,343.42 C160.82,343.42 159.92,343.66 159.5,343.78 C159.26,343.84 159.12,343.68 159.06,343.46 L158.9,342.72 C158.84,342.46 158.98,342.32 159.16,342.26 C159.3,342.2 160.44,341.8 161.92,341.8 C164.48,341.8 164.72,343.36 164.72,345.36 L164.72,349.62 C164.72,349.82 164.54,350 164.34,350 L163.78,350 C163.6,350 163.52,349.92 163.44,349.72 L163.24,349.18 C162.8,349.6 162.02,350.2 160.78,350.2 C159.28,350.2 158.2,349.18 158.2,347.52 Z M159.94,347.5 C159.94,348.22 160.42,348.78 161.16,348.78 C161.96,348.78 162.72,348.18 162.96,347.78 L162.96,346.5 C162.84,346.42 162.28,346.18 161.56,346.18 C160.6,346.18 159.94,346.68 159.94,347.5 Z M169.16,349.66 L169.16,355.62 C169.16,355.84 169.02,356 168.74,356 L167.62,356 C167.42,356 167.24,355.82 167.24,355.62 L167.24,342.38 C167.24,342.18 167.42,342 167.62,342 L168.22,342 C168.38,342 168.48,342.08 168.56,342.26 L168.76,342.78 C168.9,342.64 169.72,341.8 171.2,341.8 C173.4,341.8 175.02,343.72 175.02,346.02 C175.02,348.36 173.3,350.2 171.12,350.2 C170.08,350.2 169.3,349.74 169.16,349.66 Z M169.12,347.9 C169.12,347.9 169.82,348.48 170.88,348.48 C172.2,348.48 173.16,347.38 173.16,346.02 C173.16,344.68 172.32,343.54 170.96,343.54 C169.8,343.54 169.2,344.46 169.12,344.7 L169.12,347.9 Z M176.46,346 C176.46,343.74 178.06,341.8 180.46,341.8 C182.54,341.8 184.14,343.36 184.14,345.5 C184.14,345.64 184.12,345.9 184.1,346.04 C184.08,346.24 183.92,346.38 183.74,346.38 L178.3,346.38 C178.36,347.46 179.3,348.52 180.6,348.52 C181.32,348.52 181.98,348.2 182.38,347.94 C182.62,347.8 182.76,347.72 182.92,347.92 L183.48,348.68 C183.62,348.84 183.68,349 183.44,349.2 C182.86,349.7 181.82,350.2 180.48,350.2 C178.06,350.2 176.46,348.3 176.46,346 Z M178.4,345.12 L182.28,345.12 C182.22,344.16 181.42,343.34 180.44,343.34 C179.36,343.34 178.52,344.12 178.4,345.12 Z M186.06,349.62 C186.06,349.82 186.24,350 186.44,350 L187.4,350 C187.72,350 187.94,349.96 187.94,349.62 L187.94,344.54 C188.02,344.4 188.58,343.56 189.74,343.56 C190,343.56 190.3,343.64 190.42,343.7 C190.6,343.78 190.8,343.74 190.9,343.52 L191.38,342.54 C191.6,342 190.68,341.8 189.92,341.8 C188.46,341.8 187.72,342.76 187.58,342.96 L187.36,342.28 C187.32,342.12 187.16,342 187.02,342 L186.44,342 C186.24,342 186.06,342.18 186.06,342.38 L186.06,349.62 Z M194.4,350 C194.44,350.12 194.58,350.2 194.74,350.2 L194.84,350.2 C195,350.2 195.12,350.12 195.16,350.02 L197.6,344.68 L197.62,344.68 L200.08,350.02 C200.12,350.12 200.26,350.2 200.42,350.2 L200.5,350.2 C200.68,350.2 200.82,350.12 200.86,350 L203.2,342.46 C203.32,342.2 203.18,342 202.9,342 L202.12,342 C201.9,342 201.6,342 201.5,342.24 L200.18,346.68 L200.16,346.68 L198.04,342 C198,341.9 197.88,341.8 197.7,341.8 L197.58,341.8 C197.42,341.8 197.28,341.9 197.24,342 L195.1,346.66 L195.08,346.66 L193.74,342.24 C193.7,342.1 193.52,342 193.38,342 L192.3,342 C192.02,342 191.9,342.2 192.02,342.46 L194.4,350 Z M204.44,345.98 C204.44,343.72 206.24,341.8 208.48,341.8 C210.72,341.8 212.52,343.72 212.52,345.98 C212.52,348.28 210.72,350.2 208.48,350.2 C206.24,350.2 204.44,348.28 204.44,345.98 Z M206.22,345.98 C206.22,347.36 207.22,348.48 208.48,348.48 C209.74,348.48 210.74,347.36 210.74,345.98 C210.74,344.64 209.74,343.54 208.48,343.54 C207.22,343.54 206.22,344.64 206.22,345.98 Z M214.52,349.62 C214.52,349.82 214.7,350 214.9,350 L215.86,350 C216.18,350 216.4,349.96 216.4,349.62 L216.4,344.54 C216.48,344.4 217.04,343.56 218.2,343.56 C218.46,343.56 218.76,343.64 218.88,343.7 C219.06,343.78 219.26,343.74 219.36,343.52 L219.84,342.54 C220.06,342 219.14,341.8 218.38,341.8 C216.92,341.8 216.18,342.76 216.04,342.96 L215.82,342.28 C215.78,342.12 215.62,342 215.48,342 L214.9,342 C214.7,342 214.52,342.18 214.52,342.38 L214.52,349.62 Z M221.24,349.62 C221.24,349.82 221.42,350 221.62,350 L222.78,350 C222.98,350 223.16,349.82 223.16,349.62 L223.16,346.12 L226.78,349.84 C226.84,349.92 227,350 227.14,350 L228.78,350 C229.12,350 229.18,349.66 229,349.48 L225.08,345.56 L228.4,342.54 C228.58,342.38 228.52,342 228.18,342 L226.78,342 C226.58,342 226.42,342.12 226.28,342.24 L223.16,345.04 L223.16,336.38 C223.16,336.18 222.98,336 222.78,336 L221.62,336 C221.42,336 221.24,336.18 221.24,336.38 L221.24,349.62 Z"
          }
        }
      },
      "haiku:3044af1ec2a5": {
        viewBox: { "0": { value: "0 0 108 21" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 108 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 21 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 316.5, edited: true },
          "2383": { value: 301.5, edited: true, curve: "easeOutBack" },
          "2733": { value: 83.5, edited: true }
        },
        "translation.y": {
          "0": { value: 350.5, edited: true },
          "2383": { value: 347, edited: true }
        },
        "style.zIndex": { "0": { value: 37 } },
        "offset.x": { "0": { value: 54 } },
        "offset.y": { "0": { value: 10.5 } }
      },
      "haiku:926ea1631976": {
        viewBox: { "0": { value: "0 0 193 33" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 193 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 33 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 297, edited: true },
          "2467": { value: 299, edited: true, curve: "easeOutBack" },
          "2817": { value: 43, edited: true }
        },
        "translation.y": {
          "0": { value: 377.5, edited: true },
          "2467": { value: 377, edited: true }
        },
        "style.zIndex": { "0": { value: 38 } },
        "offset.x": { "0": { value: 96.5 } },
        "offset.y": { "0": { value: 16.5 } }
      },
      "haiku:7aeffe055c08": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:b18da4749a37": {
        fill: { "0": { value: "#5A8E9F" } },
        "translation.x": { "0": { value: -88 } },
        "translation.y": { "0": { value: -333 } }
      },
      "haiku:15be6763689a": {
        d: {
          "0": {
            value: "M88.03,347.62 L88.03,334.38 C88.03,334.18 88.19,334 88.39,334 L92.99,334 C96.85,334 100.01,337.14 100.01,340.98 C100.01,344.86 96.85,348 92.99,348 L88.39,348 C88.19,348 88.03,347.82 88.03,347.62 Z M90.07,346.1 L92.71,346.1 C95.65,346.1 97.79,343.94 97.79,340.98 C97.79,338.04 95.65,335.9 92.71,335.9 L90.07,335.9 L90.07,346.1 Z M101.67,344 C101.67,341.74 103.27,339.8 105.67,339.8 C107.75,339.8 109.35,341.36 109.35,343.5 C109.35,343.64 109.33,343.9 109.31,344.04 C109.29,344.24 109.13,344.38 108.95,344.38 L103.51,344.38 C103.57,345.46 104.51,346.52 105.81,346.52 C106.53,346.52 107.19,346.2 107.59,345.94 C107.83,345.8 107.97,345.72 108.13,345.92 L108.69,346.68 C108.83,346.84 108.89,347 108.65,347.2 C108.07,347.7 107.03,348.2 105.69,348.2 C103.27,348.2 101.67,346.3 101.67,344 Z M103.61,343.12 L107.49,343.12 C107.43,342.16 106.63,341.34 105.65,341.34 C104.57,341.34 103.73,342.12 103.61,343.12 Z M113.19,347.66 L113.19,353.62 C113.19,353.84 113.05,354 112.77,354 L111.65,354 C111.45,354 111.27,353.82 111.27,353.62 L111.27,340.38 C111.27,340.18 111.45,340 111.65,340 L112.25,340 C112.41,340 112.51,340.08 112.59,340.26 L112.79,340.78 C112.93,340.64 113.75,339.8 115.23,339.8 C117.43,339.8 119.05,341.72 119.05,344.02 C119.05,346.36 117.33,348.2 115.15,348.2 C114.11,348.2 113.33,347.74 113.19,347.66 Z M113.15,345.9 C113.15,345.9 113.85,346.48 114.91,346.48 C116.23,346.48 117.19,345.38 117.19,344.02 C117.19,342.68 116.35,341.54 114.99,341.54 C113.83,341.54 113.23,342.46 113.15,342.7 L113.15,345.9 Z M120.47,343.98 C120.47,341.72 122.27,339.8 124.51,339.8 C126.75,339.8 128.55,341.72 128.55,343.98 C128.55,346.28 126.75,348.2 124.51,348.2 C122.27,348.2 120.47,346.28 120.47,343.98 Z M122.25,343.98 C122.25,345.36 123.25,346.48 124.51,346.48 C125.77,346.48 126.77,345.36 126.77,343.98 C126.77,342.64 125.77,341.54 124.51,341.54 C123.25,341.54 122.25,342.64 122.25,343.98 Z M130.19,347.38 C130.61,347.72 131.49,348.2 132.83,348.2 C134.61,348.2 135.79,347.1 135.79,345.86 C135.79,344.36 134.59,343.74 133.13,343.1 C132.35,342.76 131.85,342.54 131.85,342.02 C131.85,341.72 132.07,341.42 132.75,341.42 C133.51,341.42 134.39,341.84 134.39,341.84 C134.55,341.92 134.81,341.86 134.91,341.68 L135.27,341 C135.39,340.8 135.29,340.54 135.11,340.42 C134.71,340.16 133.87,339.8 132.75,339.8 C130.83,339.8 130.01,341 130.01,342 C130.01,343.32 131.05,344.08 132.29,344.62 C133.39,345.12 133.83,345.38 133.83,345.92 C133.83,346.36 133.45,346.6 132.85,346.6 C131.87,346.6 130.99,346.08 130.99,346.08 C130.79,345.96 130.57,346.02 130.49,346.18 L130.07,346.96 C129.99,347.12 130.07,347.3 130.19,347.38 Z M138.63,336.74 C139.29,336.74 139.81,336.22 139.81,335.58 C139.81,334.92 139.29,334.4 138.63,334.4 C137.99,334.4 137.49,334.92 137.49,335.58 C137.49,336.22 137.99,336.74 138.63,336.74 Z M137.71,347.62 C137.71,347.82 137.89,348 138.09,348 L139.23,348 C139.43,348 139.61,347.82 139.61,347.62 L139.61,340.38 C139.61,340.18 139.43,340 139.23,340 L138.09,340 C137.89,340 137.71,340.18 137.71,340.38 L137.71,347.62 Z M142.73,345.82 C142.73,347.24 143.19,348.2 144.77,348.2 C145.73,348.2 146.91,347.72 147.11,347.6 C147.31,347.5 147.39,347.34 147.29,347.12 L146.93,346.24 C146.85,346.06 146.73,345.94 146.47,346.06 C146.23,346.18 145.67,346.42 145.25,346.42 C144.87,346.42 144.61,346.3 144.61,345.62 L144.61,341.66 L146.65,341.66 C146.87,341.66 147.03,341.48 147.03,341.28 L147.03,340.38 C147.03,340.16 146.87,340 146.65,340 L144.61,340 L144.61,337.76 C144.61,337.56 144.45,337.38 144.25,337.38 L143.11,337.4 C142.91,337.4 142.73,337.58 142.73,337.78 L142.73,340 L141.89,340 C141.67,340 141.51,340.16 141.51,340.38 L141.51,341.28 C141.51,341.48 141.67,341.66 141.89,341.66 L142.73,341.66 L142.73,345.82 Z M154.15,347.62 C154.15,347.82 154.33,348 154.53,348 L155.71,348 C155.91,348 156.09,347.82 156.09,347.62 L156.09,341.66 L158.25,341.66 C158.47,341.66 158.63,341.48 158.63,341.28 L158.63,340.38 C158.63,340.16 158.47,340 158.25,340 L156.09,340 L156.09,337.52 C156.09,336.18 156.71,335.54 157.59,335.54 C158.07,335.54 158.65,335.84 158.91,336.02 C159.11,336.16 159.31,336.14 159.41,335.96 L159.91,335.06 C159.99,334.92 159.97,334.72 159.83,334.6 C159.47,334.28 158.63,333.8 157.55,333.8 C155.63,333.8 154.15,335.04 154.15,337.52 L154.15,340 L153.21,340 C152.99,340 152.83,340.16 152.83,340.38 L152.83,341.28 C152.83,341.48 152.99,341.66 153.21,341.66 L154.15,341.66 L154.15,347.62 Z M160.11,344.42 C160.11,346.5 160.95,348.2 163.35,348.2 C164.97,348.2 165.81,347.26 165.99,347.1 L166.19,347.68 C166.25,347.86 166.35,348 166.55,348 L167.11,348 C167.31,348 167.49,347.82 167.49,347.62 L167.49,340.38 C167.49,340.18 167.31,340 167.11,340 L166.07,340 C165.79,340 165.63,340.06 165.63,340.38 L165.63,345.16 C165.57,345.52 164.83,346.48 163.65,346.48 C162.63,346.48 162.01,345.78 162.01,344.48 L162.01,340.38 C162.01,340.18 161.83,340 161.63,340 L160.49,340 C160.29,340 160.11,340.18 160.11,340.38 L160.11,344.42 Z M170.09,347.62 C170.09,347.82 170.27,348 170.47,348 L171.51,348 C171.85,348 171.97,347.88 171.97,347.62 L171.97,342.74 C172.07,342.46 172.93,341.54 174.19,341.54 C175.23,341.54 175.85,342.24 175.85,343.52 L175.85,347.62 C175.85,347.82 176.01,348 176.23,348 L177.37,348 C177.57,348 177.75,347.82 177.75,347.62 L177.75,343.6 C177.75,341.52 176.85,339.8 174.41,339.8 C172.81,339.8 171.75,340.76 171.61,340.92 L171.37,340.24 C171.33,340.1 171.21,340 171.05,340 L170.47,340 C170.27,340 170.09,340.18 170.09,340.38 L170.09,347.62 Z M179.67,344 C179.67,341.66 181.39,339.8 183.61,339.8 C184.63,339.8 185.35,340.18 185.53,340.24 L185.53,334.38 C185.53,334.18 185.71,334 185.91,334 L187.07,334 C187.27,334 187.45,334.18 187.45,334.38 L187.45,347.62 C187.45,347.82 187.27,348 187.07,348 L186.47,348 C186.29,348 186.17,347.86 186.11,347.66 L185.95,347.08 C185.95,347.08 184.99,348.2 183.41,348.2 C181.29,348.2 179.67,346.3 179.67,344 Z M181.53,344 C181.53,345.34 182.37,346.48 183.65,346.48 C184.87,346.48 185.45,345.5 185.55,345.28 L185.55,342.02 C185.55,342.02 184.85,341.54 183.81,341.54 C182.47,341.54 181.53,342.64 181.53,344 Z M189.69,347.38 C190.11,347.72 190.99,348.2 192.33,348.2 C194.11,348.2 195.29,347.1 195.29,345.86 C195.29,344.36 194.09,343.74 192.63,343.1 C191.85,342.76 191.35,342.54 191.35,342.02 C191.35,341.72 191.57,341.42 192.25,341.42 C193.01,341.42 193.89,341.84 193.89,341.84 C194.05,341.92 194.31,341.86 194.41,341.68 L194.77,341 C194.89,340.8 194.79,340.54 194.61,340.42 C194.21,340.16 193.37,339.8 192.25,339.8 C190.33,339.8 189.51,341 189.51,342 C189.51,343.32 190.55,344.08 191.79,344.62 C192.89,345.12 193.33,345.38 193.33,345.92 C193.33,346.36 192.95,346.6 192.35,346.6 C191.37,346.6 190.49,346.08 190.49,346.08 C190.29,345.96 190.07,346.02 189.99,346.18 L189.57,346.96 C189.49,347.12 189.57,347.3 189.69,347.38 Z"
          }
        }
      },
      "haiku:cdedd4f53ec6": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:aeb62764bcdd": {
        fill: { "0": { value: "#5A8E9F" } },
        "translation.x": { "0": { value: -47 } },
        "translation.y": { "0": { value: -366 } }
      },
      "haiku:6002784f0068": {
        d: {
          "0": {
            value: "M56.221,376.23 C56.137,375.544 55.997,374.886 55.857,374.256 L54.219,367.242 C54.037,367.186 53.673,367.158 53.337,367.158 C53.001,367.158 52.651,367.186 52.469,367.242 L50.719,374.256 C50.593,374.774 50.467,375.516 50.383,376.23 L50.327,376.23 C50.243,375.516 50.117,374.732 49.991,374.228 L48.325,367.354 C48.185,367.27 47.961,367.242 47.667,367.242 C47.359,367.242 47.177,367.284 47.051,367.354 L49.473,377.028 C49.655,377.084 49.991,377.112 50.327,377.112 C50.663,377.112 51.013,377.084 51.195,377.028 L52.861,370.336 C53.029,369.678 53.197,368.768 53.281,368.054 L53.337,368.054 C53.435,368.796 53.603,369.636 53.757,370.308 L55.325,377.028 C55.507,377.084 55.871,377.112 56.207,377.112 C56.543,377.112 56.879,377.084 57.061,377.028 L59.609,367.34 C59.497,367.27 59.329,367.242 59.021,367.242 C58.741,367.242 58.517,367.27 58.405,367.34 L56.627,374.312 C56.473,374.9 56.361,375.53 56.277,376.23 L56.221,376.23 Z M62.409,372.184 C62.703,371.624 63.291,371.106 64.313,371.106 C65.475,371.106 65.839,371.778 65.839,372.884 L65.839,376.93 C65.965,377 66.161,377.028 66.455,377.028 C66.749,377.028 66.931,377 67.057,376.93 L67.057,372.632 C67.057,370.364 65.797,369.972 64.663,369.972 C63.291,369.972 62.647,370.56 62.353,371.176 L62.297,371.176 C62.381,370.616 62.409,370.028 62.409,369.244 L62.409,366.71 C61.891,366.71 61.471,366.808 61.191,366.976 L61.191,376.93 C61.317,377 61.513,377.028 61.807,377.028 C62.101,377.028 62.283,377 62.409,376.93 L62.409,372.184 Z M74.687,374.004 L70.081,374.004 C70.137,375.53 71.089,376.174 72.601,376.174 C73.455,376.174 74.169,375.964 74.715,375.642 C74.757,376.034 74.603,376.552 74.407,376.776 C73.973,377.042 73.245,377.28 72.321,377.28 C70.067,377.28 68.821,375.88 68.821,373.696 C68.821,371.526 70.081,369.972 72.153,369.972 C74.001,369.972 74.855,371.176 74.855,372.87 C74.855,373.29 74.799,373.668 74.687,374.004 Z M70.095,372.982 L73.651,372.982 C73.749,372.058 73.455,371.022 72.097,371.022 C70.907,371.022 70.193,371.806 70.095,372.982 Z M77.935,372.184 C78.229,371.624 78.803,371.106 79.797,371.106 C80.959,371.106 81.309,371.792 81.309,372.87 L81.309,376.93 C81.435,377 81.631,377.028 81.925,377.028 C82.219,377.028 82.401,377 82.527,376.93 L82.527,372.632 C82.527,370.364 81.281,369.972 80.175,369.972 C78.859,369.972 78.159,370.546 77.851,371.19 L77.795,371.19 L77.711,370.14 C77.319,370.14 76.955,370.21 76.717,370.336 L76.717,376.93 C76.843,377 77.039,377.028 77.333,377.028 C77.627,377.028 77.809,377 77.935,376.93 L77.935,372.184 Z M89.933,376.412 C89.835,375.852 89.681,375.236 89.527,374.83 L87.791,370.28 C87.707,370.238 87.553,370.196 87.301,370.196 C86.979,370.196 86.713,370.266 86.559,370.364 L89.247,377.224 C88.743,378.176 87.917,379.002 86.573,379.38 C86.615,379.8 86.797,380.136 87.105,380.374 C88.659,379.87 89.583,378.988 90.339,377.56 C90.927,376.454 91.529,374.788 92.033,373.36 L93.097,370.364 C92.943,370.266 92.733,370.196 92.397,370.196 C92.145,370.196 92.005,370.238 91.907,370.28 L90.353,374.83 C90.199,375.264 90.073,375.838 89.989,376.412 L89.933,376.412 Z M97.129,369.972 C99.075,369.972 100.321,371.218 100.321,373.528 C100.321,375.964 99.103,377.28 97.129,377.28 C95.057,377.28 93.923,376.02 93.923,373.528 C93.923,371.288 95.183,369.972 97.129,369.972 Z M95.169,373.528 C95.169,375.222 95.827,376.216 97.129,376.216 C98.431,376.216 99.075,375.208 99.075,373.528 C99.075,371.988 98.361,371.036 97.129,371.036 C95.813,371.036 95.169,372.002 95.169,373.528 Z M106.761,376.23 L106.929,377.112 C107.307,377.112 107.643,377.056 107.867,376.916 L107.867,370.322 C107.741,370.252 107.559,370.224 107.265,370.224 C106.971,370.224 106.775,370.252 106.649,370.322 L106.649,375.25 C106.341,375.726 105.739,376.132 104.829,376.132 C103.681,376.132 103.331,375.502 103.331,374.368 L103.331,370.168 C102.813,370.168 102.407,370.266 102.113,370.42 L102.113,374.606 C102.113,376.874 103.345,377.28 104.465,377.28 C105.837,377.28 106.453,376.706 106.705,376.23 L106.761,376.23 Z M111.395,371.372 L111.339,371.372 L111.241,370.14 C110.849,370.14 110.485,370.21 110.247,370.336 L110.247,376.93 C110.373,377 110.569,377.028 110.863,377.028 C111.157,377.028 111.339,377 111.465,376.93 L111.465,372.772 C111.815,371.736 112.417,371.19 113.271,371.19 C113.607,371.19 113.915,371.274 114.139,371.4 C114.181,371.302 114.223,371.134 114.223,370.882 C114.223,370.532 114.153,370.294 114.041,370.098 C113.887,370.014 113.621,369.972 113.313,369.972 C112.235,369.972 111.689,370.532 111.395,371.372 Z M122.077,376.454 L122.021,376.454 C121.615,376.986 120.971,377.28 120.047,377.28 C118.843,377.28 117.793,376.706 117.793,375.18 C117.793,373.542 119.011,372.87 120.593,372.87 C121.055,372.87 121.587,372.926 121.993,373.094 L121.993,372.73 C121.993,371.568 121.545,371.078 120.453,371.078 C119.655,371.078 118.899,371.33 118.311,371.694 C118.213,371.344 118.255,370.798 118.451,370.476 C118.927,370.196 119.753,369.972 120.677,369.972 C122.343,369.972 123.197,370.686 123.197,372.604 L123.197,375.656 C123.197,376.062 123.407,376.174 123.687,376.174 C123.953,376.174 124.205,376.076 124.345,375.978 C124.373,376.342 124.289,376.776 124.107,377.028 C123.869,377.168 123.561,377.28 123.183,377.28 C122.553,377.28 122.189,376.972 122.077,376.454 Z M121.993,375.446 L121.993,374.074 C121.643,373.948 121.251,373.864 120.775,373.864 C119.613,373.864 119.011,374.382 119.011,375.124 C119.011,375.852 119.599,376.174 120.355,376.174 C120.957,376.174 121.629,375.978 121.993,375.446 Z M126.389,373.584 C126.389,371.89 127.327,371.106 128.755,371.106 C129.413,371.106 129.931,371.26 130.477,371.596 C130.547,371.19 130.449,370.658 130.253,370.392 C129.861,370.14 129.273,369.972 128.517,369.972 C126.641,369.972 125.143,371.134 125.143,373.682 C125.143,375.908 126.305,377.28 128.377,377.28 C129.203,377.28 129.833,377.084 130.281,376.832 C130.505,376.58 130.659,375.992 130.617,375.614 C130.099,375.922 129.497,376.132 128.783,376.132 C127.299,376.132 126.389,375.32 126.389,373.584 Z M133.123,373.584 C133.123,371.89 134.061,371.106 135.489,371.106 C136.147,371.106 136.665,371.26 137.211,371.596 C137.281,371.19 137.183,370.658 136.987,370.392 C136.595,370.14 136.007,369.972 135.251,369.972 C133.375,369.972 131.877,371.134 131.877,373.682 C131.877,375.908 133.039,377.28 135.111,377.28 C135.937,377.28 136.567,377.084 137.015,376.832 C137.239,376.58 137.393,375.992 137.351,375.614 C136.833,375.922 136.231,376.132 135.517,376.132 C134.033,376.132 133.123,375.32 133.123,373.584 Z M141.845,369.972 C143.791,369.972 145.037,371.218 145.037,373.528 C145.037,375.964 143.819,377.28 141.845,377.28 C139.773,377.28 138.639,376.02 138.639,373.528 C138.639,371.288 139.899,369.972 141.845,369.972 Z M139.885,373.528 C139.885,375.222 140.543,376.216 141.845,376.216 C143.147,376.216 143.791,375.208 143.791,373.528 C143.791,371.988 143.077,371.036 141.845,371.036 C140.529,371.036 139.885,372.002 139.885,373.528 Z M151.477,376.23 L151.645,377.112 C152.023,377.112 152.359,377.056 152.583,376.916 L152.583,370.322 C152.457,370.252 152.275,370.224 151.981,370.224 C151.687,370.224 151.491,370.252 151.365,370.322 L151.365,375.25 C151.057,375.726 150.455,376.132 149.545,376.132 C148.397,376.132 148.047,375.502 148.047,374.368 L148.047,370.168 C147.529,370.168 147.123,370.266 146.829,370.42 L146.829,374.606 C146.829,376.874 148.061,377.28 149.181,377.28 C150.553,377.28 151.169,376.706 151.421,376.23 L151.477,376.23 Z M156.181,372.184 C156.475,371.624 157.049,371.106 158.043,371.106 C159.205,371.106 159.555,371.792 159.555,372.87 L159.555,376.93 C159.681,377 159.877,377.028 160.171,377.028 C160.465,377.028 160.647,377 160.773,376.93 L160.773,372.632 C160.773,370.364 159.527,369.972 158.421,369.972 C157.105,369.972 156.405,370.546 156.097,371.19 L156.041,371.19 L155.957,370.14 C155.565,370.14 155.201,370.21 154.963,370.336 L154.963,376.93 C155.089,377 155.285,377.028 155.579,377.028 C155.873,377.028 156.055,377 156.181,376.93 L156.181,372.184 Z M162.411,370.252 C162.299,370.546 162.243,370.938 162.243,371.358 L163.279,371.358 L163.279,375.11 C163.279,376.58 163.825,377.28 165.169,377.28 C165.771,377.28 166.219,377.14 166.583,376.888 C166.793,376.636 166.933,376.076 166.877,375.642 C166.457,375.992 165.953,376.146 165.533,376.146 C164.693,376.146 164.497,375.712 164.497,374.956 L164.497,371.358 L166.555,371.358 C166.611,371.246 166.639,371.05 166.639,370.798 C166.639,370.546 166.611,370.364 166.555,370.252 L164.497,370.252 L164.497,368.334 C164.035,368.348 163.573,368.474 163.279,368.712 L163.279,370.252 L162.411,370.252 Z M171.077,376.93 C171.203,377 171.399,377.028 171.693,377.028 C171.987,377.028 172.169,377 172.295,376.93 L172.295,370.322 C172.169,370.252 171.987,370.224 171.693,370.224 C171.399,370.224 171.203,370.252 171.077,370.322 L171.077,376.93 Z M171.693,367.046 C171.217,367.046 170.881,367.354 170.881,367.858 C170.881,368.404 171.161,368.684 171.693,368.684 C172.183,368.684 172.505,368.39 172.505,367.844 C172.505,367.326 172.183,367.046 171.693,367.046 Z M174.185,375.558 C174.129,375.908 174.199,376.524 174.409,376.832 C174.927,377.14 175.711,377.28 176.425,377.28 C177.895,377.28 179.057,376.678 179.057,375.096 C179.057,372.716 175.669,373.262 175.669,371.82 C175.669,371.33 176.005,371.022 176.817,371.022 C177.503,371.022 178.189,371.246 178.735,371.68 C178.791,371.33 178.693,370.742 178.511,370.462 C177.993,370.112 177.335,369.972 176.691,369.972 C175.235,369.972 174.437,370.658 174.437,371.946 C174.437,374.256 177.825,373.668 177.825,375.25 C177.825,375.852 177.307,376.216 176.397,376.216 C175.655,376.216 174.731,375.964 174.185,375.558 Z M186.043,377.028 C186.239,376.776 186.337,376.286 186.309,375.88 C186.099,376.048 185.791,376.16 185.455,376.16 C185.049,376.16 184.825,376.006 184.825,375.39 L184.825,366.71 C184.307,366.71 183.887,366.808 183.607,366.976 L183.607,375.614 C183.607,376.734 184.083,377.28 185.035,377.28 C185.441,377.28 185.805,377.182 186.043,377.028 Z M187.695,376.93 C187.821,377 188.017,377.028 188.311,377.028 C188.605,377.028 188.787,377 188.913,376.93 L188.913,370.322 C188.787,370.252 188.605,370.224 188.311,370.224 C188.017,370.224 187.821,370.252 187.695,370.322 L187.695,376.93 Z M188.311,367.046 C187.835,367.046 187.499,367.354 187.499,367.858 C187.499,368.404 187.779,368.684 188.311,368.684 C188.801,368.684 189.123,368.39 189.123,367.844 C189.123,367.326 188.801,367.046 188.311,367.046 Z M193.547,376.174 C193.449,375.67 193.295,375.138 193.155,374.746 L191.503,370.28 C191.419,370.238 191.265,370.196 191.013,370.196 C190.677,370.196 190.425,370.266 190.271,370.364 L192.819,377.112 C193.379,377.112 193.869,377.07 194.317,376.944 L196.781,370.364 C196.627,370.266 196.417,370.196 196.081,370.196 C195.815,370.196 195.675,370.238 195.577,370.28 L193.967,374.746 C193.841,375.11 193.687,375.67 193.603,376.174 L193.547,376.174 Z M203.445,374.004 L198.839,374.004 C198.895,375.53 199.847,376.174 201.359,376.174 C202.213,376.174 202.927,375.964 203.473,375.642 C203.515,376.034 203.361,376.552 203.165,376.776 C202.731,377.042 202.003,377.28 201.079,377.28 C198.825,377.28 197.579,375.88 197.579,373.696 C197.579,371.526 198.839,369.972 200.911,369.972 C202.759,369.972 203.613,371.176 203.613,372.87 C203.613,373.29 203.557,373.668 203.445,374.004 Z M198.853,372.982 L202.409,372.982 C202.507,372.058 202.213,371.022 200.855,371.022 C199.665,371.022 198.951,371.806 198.853,372.982 Z M205.391,375.978 C205.335,376.958 205.083,378.036 204.719,378.862 C204.929,379.086 205.265,379.226 205.657,379.268 C206.091,378.526 206.595,376.958 206.651,375.74 C206.133,375.74 205.713,375.824 205.391,375.978 Z M217.851,376.118 C217.753,375.558 217.599,374.872 217.487,374.438 L216.353,370.168 C215.709,370.168 215.247,370.238 214.869,370.378 L213.623,374.466 C213.497,374.9 213.357,375.544 213.301,376.118 L213.245,376.118 C213.161,375.502 213.035,374.914 212.853,374.298 L211.677,370.28 C211.593,370.238 211.425,370.196 211.187,370.196 C210.851,370.196 210.655,370.266 210.515,370.364 L212.531,377.14 C213.077,377.14 213.553,377.084 213.945,376.958 L215.191,372.954 C215.359,372.408 215.513,371.778 215.569,371.204 L215.625,371.204 C215.681,371.778 215.807,372.38 215.961,372.912 L217.151,377.14 C217.711,377.14 218.215,377.084 218.607,376.958 L220.581,370.35 C220.427,370.266 220.217,370.196 219.923,370.196 C219.671,370.196 219.531,370.238 219.433,370.28 L218.285,374.27 C218.131,374.816 217.991,375.53 217.907,376.118 L217.851,376.118 Z M227.343,374.004 L222.737,374.004 C222.793,375.53 223.745,376.174 225.257,376.174 C226.111,376.174 226.825,375.964 227.371,375.642 C227.413,376.034 227.259,376.552 227.063,376.776 C226.629,377.042 225.901,377.28 224.977,377.28 C222.723,377.28 221.477,375.88 221.477,373.696 C221.477,371.526 222.737,369.972 224.809,369.972 C226.657,369.972 227.511,371.176 227.511,372.87 C227.511,373.29 227.455,373.668 227.343,374.004 Z M222.751,372.982 L226.307,372.982 C226.405,372.058 226.111,371.022 224.753,371.022 C223.563,371.022 222.849,371.806 222.751,372.982 Z M229.555,366.99 C229.499,367.928 229.275,368.936 228.939,369.706 C229.121,369.916 229.485,370.07 229.849,370.112 C230.269,369.398 230.689,367.914 230.745,366.766 C230.241,366.766 229.863,366.85 229.555,366.99 Z M234.833,377.028 C235.029,376.776 235.127,376.286 235.099,375.88 C234.889,376.048 234.581,376.16 234.245,376.16 C233.839,376.16 233.615,376.006 233.615,375.39 L233.615,366.71 C233.097,366.71 232.677,366.808 232.397,366.976 L232.397,375.614 C232.397,376.734 232.873,377.28 233.825,377.28 C234.231,377.28 234.595,377.182 234.833,377.028 Z M238.893,377.028 C239.089,376.776 239.187,376.286 239.159,375.88 C238.949,376.048 238.641,376.16 238.305,376.16 C237.899,376.16 237.675,376.006 237.675,375.39 L237.675,366.71 C237.157,366.71 236.737,366.808 236.457,366.976 L236.457,375.614 C236.457,376.734 236.933,377.28 237.885,377.28 C238.291,377.28 238.655,377.182 238.893,377.028 Z M63.501,390.184 C63.795,389.624 64.369,389.106 65.363,389.106 C66.525,389.106 66.875,389.792 66.875,390.87 L66.875,394.93 C67.001,395 67.197,395.028 67.491,395.028 C67.785,395.028 67.967,395 68.093,394.93 L68.093,390.632 C68.093,388.364 66.847,387.972 65.741,387.972 C64.425,387.972 63.725,388.546 63.417,389.19 L63.361,389.19 L63.277,388.14 C62.885,388.14 62.521,388.21 62.283,388.336 L62.283,394.93 C62.409,395 62.605,395.028 62.899,395.028 C63.193,395.028 63.375,395 63.501,394.93 L63.501,390.184 Z M73.091,387.972 C75.037,387.972 76.283,389.218 76.283,391.528 C76.283,393.964 75.065,395.28 73.091,395.28 C71.019,395.28 69.885,394.02 69.885,391.528 C69.885,389.288 71.145,387.972 73.091,387.972 Z M71.131,391.528 C71.131,393.222 71.789,394.216 73.091,394.216 C74.393,394.216 75.037,393.208 75.037,391.528 C75.037,389.988 74.323,389.036 73.091,389.036 C71.775,389.036 71.131,390.002 71.131,391.528 Z M77.501,388.252 C77.389,388.546 77.333,388.938 77.333,389.358 L78.369,389.358 L78.369,393.11 C78.369,394.58 78.915,395.28 80.259,395.28 C80.861,395.28 81.309,395.14 81.673,394.888 C81.883,394.636 82.023,394.076 81.967,393.642 C81.547,393.992 81.043,394.146 80.623,394.146 C79.783,394.146 79.587,393.712 79.587,392.956 L79.587,389.358 L81.645,389.358 C81.701,389.246 81.729,389.05 81.729,388.798 C81.729,388.546 81.701,388.364 81.645,388.252 L79.587,388.252 L79.587,386.334 C79.125,386.348 78.663,386.474 78.369,386.712 L78.369,388.252 L77.501,388.252 Z M83.423,394.93 C83.549,395 83.745,395.028 84.039,395.028 C84.333,395.028 84.515,395 84.641,394.93 L84.641,388.322 C84.515,388.252 84.333,388.224 84.039,388.224 C83.745,388.224 83.549,388.252 83.423,388.322 L83.423,394.93 Z M84.039,385.046 C83.563,385.046 83.227,385.354 83.227,385.858 C83.227,386.404 83.507,386.684 84.039,386.684 C84.529,386.684 84.851,386.39 84.851,385.844 C84.851,385.326 84.529,385.046 84.039,385.046 Z M86.405,388.252 L87.287,388.252 L87.287,387.104 C87.287,385.116 88.239,384.514 89.513,384.514 C90.087,384.514 90.535,384.64 90.899,384.892 C91.095,385.158 91.179,385.69 91.109,386.082 C90.661,385.746 90.241,385.62 89.765,385.62 C88.785,385.62 88.505,386.152 88.505,387.02 L88.505,388.252 L90.381,388.252 C90.437,388.364 90.465,388.546 90.465,388.798 C90.465,389.05 90.437,389.246 90.381,389.358 L88.505,389.358 L88.505,394.93 C88.379,395 88.197,395.028 87.903,395.028 C87.609,395.028 87.413,395 87.287,394.93 L87.287,389.358 L86.237,389.358 C86.237,388.938 86.293,388.546 86.405,388.252 Z M93.951,394.412 L94.007,394.412 C94.091,393.838 94.217,393.264 94.371,392.83 L95.925,388.28 C96.023,388.238 96.163,388.196 96.415,388.196 C96.751,388.196 96.961,388.266 97.115,388.364 L96.051,391.36 C95.547,392.788 94.945,394.454 94.357,395.56 C93.601,396.988 92.677,397.87 91.123,398.374 C90.815,398.136 90.633,397.8 90.591,397.38 C91.935,397.002 92.761,396.176 93.265,395.224 L90.577,388.364 C90.731,388.266 90.997,388.196 91.319,388.196 C91.571,388.196 91.725,388.238 91.809,388.28 L93.545,392.83 C93.699,393.236 93.853,393.852 93.951,394.412 Z M103.555,394.412 C103.457,393.852 103.303,393.236 103.149,392.83 L101.413,388.28 C101.329,388.238 101.175,388.196 100.923,388.196 C100.601,388.196 100.335,388.266 100.181,388.364 L102.869,395.224 C102.365,396.176 101.539,397.002 100.195,397.38 C100.237,397.8 100.419,398.136 100.727,398.374 C102.281,397.87 103.205,396.988 103.961,395.56 C104.549,394.454 105.151,392.788 105.655,391.36 L106.719,388.364 C106.565,388.266 106.355,388.196 106.019,388.196 C105.767,388.196 105.627,388.238 105.529,388.28 L103.975,392.83 C103.821,393.264 103.695,393.838 103.611,394.412 L103.555,394.412 Z M110.751,387.972 C112.697,387.972 113.943,389.218 113.943,391.528 C113.943,393.964 112.725,395.28 110.751,395.28 C108.679,395.28 107.545,394.02 107.545,391.528 C107.545,389.288 108.805,387.972 110.751,387.972 Z M108.791,391.528 C108.791,393.222 109.449,394.216 110.751,394.216 C112.053,394.216 112.697,393.208 112.697,391.528 C112.697,389.988 111.983,389.036 110.751,389.036 C109.435,389.036 108.791,390.002 108.791,391.528 Z M120.383,394.23 L120.551,395.112 C120.929,395.112 121.265,395.056 121.489,394.916 L121.489,388.322 C121.363,388.252 121.181,388.224 120.887,388.224 C120.593,388.224 120.397,388.252 120.271,388.322 L120.271,393.25 C119.963,393.726 119.361,394.132 118.451,394.132 C117.303,394.132 116.953,393.502 116.953,392.368 L116.953,388.168 C116.435,388.168 116.029,388.266 115.735,388.42 L115.735,392.606 C115.735,394.874 116.967,395.28 118.087,395.28 C119.459,395.28 120.075,394.706 120.327,394.23 L120.383,394.23 Z M125.955,388.252 C125.843,388.546 125.787,388.938 125.787,389.358 L126.823,389.358 L126.823,393.11 C126.823,394.58 127.369,395.28 128.713,395.28 C129.315,395.28 129.763,395.14 130.127,394.888 C130.337,394.636 130.477,394.076 130.421,393.642 C130.001,393.992 129.497,394.146 129.077,394.146 C128.237,394.146 128.041,393.712 128.041,392.956 L128.041,389.358 L130.099,389.358 C130.155,389.246 130.183,389.05 130.183,388.798 C130.183,388.546 130.155,388.364 130.099,388.252 L128.041,388.252 L128.041,386.334 C127.579,386.348 127.117,386.474 126.823,386.712 L126.823,388.252 L125.955,388.252 Z M134.579,387.972 C136.525,387.972 137.771,389.218 137.771,391.528 C137.771,393.964 136.553,395.28 134.579,395.28 C132.507,395.28 131.373,394.02 131.373,391.528 C131.373,389.288 132.633,387.972 134.579,387.972 Z M132.619,391.528 C132.619,393.222 133.277,394.216 134.579,394.216 C135.881,394.216 136.525,393.208 136.525,391.528 C136.525,389.988 135.811,389.036 134.579,389.036 C133.263,389.036 132.619,390.002 132.619,391.528 Z M146.731,388.238 L146.731,384.976 C147.011,384.808 147.431,384.71 147.949,384.71 L147.949,394.916 C147.711,395.056 147.389,395.112 147.039,395.112 L146.871,394.314 L146.815,394.314 C146.395,394.916 145.695,395.28 144.729,395.28 C143.035,395.28 141.873,394.146 141.873,391.836 C141.873,389.33 143.217,387.972 145.289,387.972 C145.877,387.972 146.395,388.084 146.731,388.238 Z M146.731,393.404 L146.731,389.274 C146.409,389.12 145.989,389.05 145.555,389.05 C143.819,389.05 143.119,390.184 143.119,391.766 C143.119,393.32 143.805,394.132 145.065,394.132 C145.919,394.132 146.381,393.754 146.731,393.404 Z M155.663,392.004 L151.057,392.004 C151.113,393.53 152.065,394.174 153.577,394.174 C154.431,394.174 155.145,393.964 155.691,393.642 C155.733,394.034 155.579,394.552 155.383,394.776 C154.949,395.042 154.221,395.28 153.297,395.28 C151.043,395.28 149.797,393.88 149.797,391.696 C149.797,389.526 151.057,387.972 153.129,387.972 C154.977,387.972 155.831,389.176 155.831,390.87 C155.831,391.29 155.775,391.668 155.663,392.004 Z M151.071,390.982 L154.627,390.982 C154.725,390.058 154.431,389.022 153.073,389.022 C151.883,389.022 151.169,389.806 151.071,390.982 Z M158.771,389.162 L158.827,389.162 C159.107,388.546 159.737,387.972 160.955,387.972 C162.383,387.972 163.769,388.826 163.769,391.374 C163.769,393.586 162.747,395.28 160.339,395.28 C159.849,395.28 159.261,395.21 158.911,395.028 L158.911,398.192 C158.785,398.262 158.603,398.29 158.309,398.29 C158.015,398.29 157.819,398.262 157.693,398.192 L157.693,388.336 C157.945,388.21 158.323,388.14 158.687,388.14 L158.771,389.162 Z M158.911,390.058 L158.911,393.964 C159.247,394.104 159.653,394.188 160.115,394.188 C161.851,394.188 162.523,393.04 162.523,391.486 C162.523,389.904 161.837,389.106 160.619,389.106 C159.695,389.106 159.233,389.596 158.911,390.058 Z M168.333,387.972 C170.279,387.972 171.525,389.218 171.525,391.528 C171.525,393.964 170.307,395.28 168.333,395.28 C166.261,395.28 165.127,394.02 165.127,391.528 C165.127,389.288 166.387,387.972 168.333,387.972 Z M166.373,391.528 C166.373,393.222 167.031,394.216 168.333,394.216 C169.635,394.216 170.279,393.208 170.279,391.528 C170.279,389.988 169.565,389.036 168.333,389.036 C167.017,389.036 166.373,390.002 166.373,391.528 Z M172.911,393.558 C172.855,393.908 172.925,394.524 173.135,394.832 C173.653,395.14 174.437,395.28 175.151,395.28 C176.621,395.28 177.783,394.678 177.783,393.096 C177.783,390.716 174.395,391.262 174.395,389.82 C174.395,389.33 174.731,389.022 175.543,389.022 C176.229,389.022 176.915,389.246 177.461,389.68 C177.517,389.33 177.419,388.742 177.237,388.462 C176.719,388.112 176.061,387.972 175.417,387.972 C173.961,387.972 173.163,388.658 173.163,389.946 C173.163,392.256 176.551,391.668 176.551,393.25 C176.551,393.852 176.033,394.216 175.123,394.216 C174.381,394.216 173.457,393.964 172.911,393.558 Z M179.617,394.93 C179.743,395 179.939,395.028 180.233,395.028 C180.527,395.028 180.709,395 180.835,394.93 L180.835,388.322 C180.709,388.252 180.527,388.224 180.233,388.224 C179.939,388.224 179.743,388.252 179.617,388.322 L179.617,394.93 Z M180.233,385.046 C179.757,385.046 179.421,385.354 179.421,385.858 C179.421,386.404 179.701,386.684 180.233,386.684 C180.723,386.684 181.045,386.39 181.045,385.844 C181.045,385.326 180.723,385.046 180.233,385.046 Z M182.557,388.252 C182.445,388.546 182.389,388.938 182.389,389.358 L183.425,389.358 L183.425,393.11 C183.425,394.58 183.971,395.28 185.315,395.28 C185.917,395.28 186.365,395.14 186.729,394.888 C186.939,394.636 187.079,394.076 187.023,393.642 C186.603,393.992 186.099,394.146 185.679,394.146 C184.839,394.146 184.643,393.712 184.643,392.956 L184.643,389.358 L186.701,389.358 C186.757,389.246 186.785,389.05 186.785,388.798 C186.785,388.546 186.757,388.364 186.701,388.252 L184.643,388.252 L184.643,386.334 C184.181,386.348 183.719,386.474 183.425,386.712 L183.425,388.252 L182.557,388.252 Z M190.607,388.252 C190.495,388.546 190.439,388.938 190.439,389.358 L191.489,389.358 L191.489,394.93 C191.615,395 191.811,395.028 192.105,395.028 C192.399,395.028 192.581,395 192.707,394.93 L192.707,389.358 L194.583,389.358 C194.639,389.246 194.667,389.05 194.667,388.798 C194.667,388.546 194.639,388.364 194.583,388.252 L192.707,388.252 L192.707,387.02 C192.707,386.152 192.987,385.62 193.967,385.62 C194.443,385.62 194.863,385.746 195.311,386.082 C195.381,385.69 195.297,385.158 195.101,384.892 C194.737,384.64 194.289,384.514 193.715,384.514 C192.441,384.514 191.489,385.116 191.489,387.104 L191.489,388.252 L190.607,388.252 Z M200.351,394.23 L200.519,395.112 C200.897,395.112 201.233,395.056 201.457,394.916 L201.457,388.322 C201.331,388.252 201.149,388.224 200.855,388.224 C200.561,388.224 200.365,388.252 200.239,388.322 L200.239,393.25 C199.931,393.726 199.329,394.132 198.419,394.132 C197.271,394.132 196.921,393.502 196.921,392.368 L196.921,388.168 C196.403,388.168 195.997,388.266 195.703,388.42 L195.703,392.606 C195.703,394.874 196.935,395.28 198.055,395.28 C199.427,395.28 200.043,394.706 200.295,394.23 L200.351,394.23 Z M205.055,390.184 C205.349,389.624 205.923,389.106 206.917,389.106 C208.079,389.106 208.429,389.792 208.429,390.87 L208.429,394.93 C208.555,395 208.751,395.028 209.045,395.028 C209.339,395.028 209.521,395 209.647,394.93 L209.647,390.632 C209.647,388.364 208.401,387.972 207.295,387.972 C205.979,387.972 205.279,388.546 204.971,389.19 L204.915,389.19 L204.831,388.14 C204.439,388.14 204.075,388.21 203.837,388.336 L203.837,394.93 C203.963,395 204.159,395.028 204.453,395.028 C204.747,395.028 204.929,395 205.055,394.93 L205.055,390.184 Z M216.283,388.238 L216.283,384.976 C216.563,384.808 216.983,384.71 217.501,384.71 L217.501,394.916 C217.263,395.056 216.941,395.112 216.591,395.112 L216.423,394.314 L216.367,394.314 C215.947,394.916 215.247,395.28 214.281,395.28 C212.587,395.28 211.425,394.146 211.425,391.836 C211.425,389.33 212.769,387.972 214.841,387.972 C215.429,387.972 215.947,388.084 216.283,388.238 Z M216.283,393.404 L216.283,389.274 C215.961,389.12 215.541,389.05 215.107,389.05 C213.371,389.05 212.671,390.184 212.671,391.766 C212.671,393.32 213.357,394.132 214.617,394.132 C215.471,394.132 215.933,393.754 216.283,393.404 Z M219.391,393.558 C219.335,393.908 219.405,394.524 219.615,394.832 C220.133,395.14 220.917,395.28 221.631,395.28 C223.101,395.28 224.263,394.678 224.263,393.096 C224.263,390.716 220.875,391.262 220.875,389.82 C220.875,389.33 221.211,389.022 222.023,389.022 C222.709,389.022 223.395,389.246 223.941,389.68 C223.997,389.33 223.899,388.742 223.717,388.462 C223.199,388.112 222.541,387.972 221.897,387.972 C220.441,387.972 219.643,388.658 219.643,389.946 C219.643,392.256 223.031,391.668 223.031,393.25 C223.031,393.852 222.513,394.216 221.603,394.216 C220.861,394.216 219.937,393.964 219.391,393.558 Z"
          }
        }
      },
      "haiku:d725c1b4e945": { content: { "0": { value: "Title 1" } } },
      "haiku:e42c8c13e1b2": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:a010078b425d": { content: { "0": { value: "Desc 1" } } },
      "haiku:cde3a8811c4f": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:4fa9cd3ef0b4": { content: { "0": { value: "Title 2" } } },
      "haiku:2ac1e23a642e": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:6484f00c1877": { content: { "0": { value: "Desc 2" } } },
      "haiku:199acd5f244a": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:5d190d26f1ce": { content: { "0": { value: "Title 3" } } },
      "haiku:29405ac3f5cd": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:d1e66e2b54fd": { content: { "0": { value: "Desc 3" } } },
      "haiku:b429c303562f": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:92f84f968746": { content: { "0": { value: "logo_b" } } },
      "haiku:67b508561898": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:7417e68dfacb": { content: { "0": { value: "next_btn" } } },
      "haiku:886f42bf2fcc": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:04d2b3027fd8": { content: { "0": { value: "indicator bgs" } } },
      "haiku:37e8bf355166": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:9f6b88a10b13": { content: { "0": { value: "indicator" } } },
      "haiku:261c676f78df": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:d123f900a86e": { content: { "0": { value: "percy" } } },
      "haiku:4d00eef89ee1": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:df6656205379": { content: { "0": { value: "page" } } },
      "haiku:e3a89d9bd6de": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:ec1183644ce8": { content: { "0": { value: "page" } } },
      "haiku:bf15ac0879f6": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:a511ea2a30e2": { content: { "0": { value: "page" } } },
      "haiku:e9fc7165dcc2": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:d0693c80ed3f": { content: { "0": { value: "headline2" } } },
      "haiku:27f7bb5f2702": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:c5990328fa96": { content: { "0": { value: "coin" } } },
      "haiku:9dbb842e95c9": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:067ac1a02e35": { content: { "0": { value: "remaining_ham" } } },
      "haiku:ec51e662e971": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:3b0c11316b6f": { content: { "0": { value: "nose" } } },
      "haiku:d0d10f2d3aa0": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:10038e1f49e0": { content: { "0": { value: "eye" } } },
      "haiku:c1a0d6fcaf4a": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:1b24ee27f3e5": { content: { "0": { value: "eye_left" } } },
      "haiku:9971d985ab29": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:bb36063120da": { content: { "0": { value: "coin pocket" } } },
      "haiku:46401159cc14": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:820f8c262ef6": { content: { "0": { value: "coin pocket" } } },
      "haiku:e220d63d2a44": {
        content: { "0": { value: "Created with sketchtool." } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "8e12c31048ec", "haiku-title": "percy" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "5a2822e9e08e",
          "haiku-title": "Title 1",
          "haiku-source": "designs/percy.sketch.contents/slices/Title 1.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "d725c1b4e945" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "e42c8c13e1b2"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "427a0b8c3932" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "bbbf2565cfde", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "676767d9fc9d", id: "Screen-1" },
                children: [
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "fe335cf20166", id: "text" },
                    children: [
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "dd9fad545309",
                          id: "Title-1"
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
          "haiku-id": "72c6fb8758ed",
          "haiku-title": "Desc 1",
          "haiku-source": "designs/percy.sketch.contents/slices/Desc 1.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "a010078b425d" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "cde3a8811c4f"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "05eb591b6abc" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "01f8bb4204e2", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "a3b255b78059", id: "Screen-1" },
                children: [
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "361d62e7b3f0", id: "text" },
                    children: [
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "1beae6be009b",
                          id: "Desc-1"
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
          "haiku-id": "dfd8db140205",
          "haiku-title": "Title 2",
          "haiku-source": "designs/percy.sketch.contents/slices/Title 2.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "4fa9cd3ef0b4" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "2ac1e23a642e"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "68fa967c49ca" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "e50af4fbb652", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "cc6ff2206d25", id: "Screen-2" },
                children: [
                  {
                    elementName: "path",
                    attributes: { "haiku-id": "2398f4c5bae0", id: "Title-2" },
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
          "haiku-id": "0e0c7872e0d1",
          "haiku-title": "Desc 2",
          "haiku-source": "designs/percy.sketch.contents/slices/Desc 2.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "6484f00c1877" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "199acd5f244a"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "cdefddb30f95" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "7b27d0fc26c6", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "aab5a76eca90", id: "Screen-2" },
                children: [
                  {
                    elementName: "path",
                    attributes: { "haiku-id": "9e722b6e907e", id: "Desc-2" },
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
          "haiku-id": "3044af1ec2a5",
          "haiku-title": "Title 3",
          "haiku-source": "designs/percy.sketch.contents/slices/Title 3.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "5d190d26f1ce" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "29405ac3f5cd"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "b85ac7412d8b" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "7aeffe055c08", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "b18da4749a37", id: "Screen-3" },
                children: [
                  {
                    elementName: "path",
                    attributes: { "haiku-id": "15be6763689a", id: "Title-3" },
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
          "haiku-id": "926ea1631976",
          "haiku-title": "Desc 3",
          "haiku-source": "designs/percy.sketch.contents/slices/Desc 3.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "d1e66e2b54fd" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "b429c303562f"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "ac30782f116b" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "cdedd4f53ec6", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "aeb62764bcdd", id: "Screen-3" },
                children: [
                  {
                    elementName: "path",
                    attributes: { "haiku-id": "6002784f0068", id: "Desc-3" },
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
          "haiku-id": "4359f1252d70",
          "haiku-title": "logo_b",
          "haiku-source": "designs/percy.sketch.contents/slices/logo_b.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "92f84f968746" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "67b508561898"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "e6e62792c780" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "94b290b4fbc5", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "bf46288cea0d", id: "Screen-2" },
                children: [
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "0df3df10f758", id: "logo_b" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { "haiku-id": "3c0f3e94c6f0", id: "PERCY" },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "66856a9e9d7c",
                          id: "BANKING"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: { "haiku-id": "0ce8733e4298", id: "Line" },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "66d3dd154da4",
                          id: "Line-Copy"
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
          "haiku-id": "cf0a91dca2c6",
          "haiku-title": "next_btn",
          "haiku-source": "designs/percy.sketch.contents/slices/next_btn.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "7417e68dfacb" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "886f42bf2fcc"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "7cd1bbb7d7b8" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "dd5561c5fb75", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "3431f8ac4184", id: "Screen-1" },
                children: [
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "5be999d838e9", id: "next_btn" },
                    children: [
                      {
                        elementName: "rect",
                        attributes: {
                          "haiku-id": "278fdbca1f38",
                          id: "Rectangle"
                        },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: { "haiku-id": "0ab4bc597a6c", id: "NEXT" },
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
          "haiku-id": "06144fcc65bf",
          "haiku-title": "indicator bgs",
          "haiku-source": "designs/percy.sketch.contents/slices/indicator bgs.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "04d2b3027fd8" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "37e8bf355166"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "6b7c1dcd2892" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "2272812c65b7", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "cc95eb384704", id: "Screen-1" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "98cfb9744806",
                      id: "indicator-bgs"
                    },
                    children: [
                      {
                        elementName: "circle",
                        attributes: { "haiku-id": "a9332ce9c018", id: "Oval" },
                        children: []
                      },
                      {
                        elementName: "circle",
                        attributes: {
                          "haiku-id": "c0f17bc824e4",
                          id: "Oval-Copy"
                        },
                        children: []
                      },
                      {
                        elementName: "circle",
                        attributes: {
                          "haiku-id": "c8212f440e95",
                          id: "Oval-Copy-3"
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
          "haiku-id": "3c062f013dd2",
          "haiku-title": "indicator",
          "haiku-source": "designs/percy.sketch.contents/slices/indicator.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "9f6b88a10b13" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "261c676f78df"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "5b415b5040e8" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "0d46f5f5b382", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "642a89aa993f", id: "Screen-1" },
                children: [
                  {
                    elementName: "circle",
                    attributes: { "haiku-id": "a7df0e99e504", id: "indicator" },
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
          "haiku-id": "e2107692c018",
          "haiku-title": "percy",
          "haiku-source": "designs/percy.sketch.contents/slices/percy.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "d123f900a86e" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "4d00eef89ee1"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "fe171732a48d" },
            children: [
              {
                elementName: "path",
                attributes: { "haiku-id": "136424abd63c", id: "path-1-50b89c" },
                children: []
              },
              {
                elementName: "mask",
                attributes: { "haiku-id": "998970a805e3", id: "mask-2-50b89c" },
                children: [
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#path-1-50b89c",
                      "haiku-id": "c70267185dc0"
                    },
                    children: []
                  }
                ]
              },
              {
                elementName: "path",
                attributes: { "haiku-id": "76c2855cc2d7", id: "path-3-50b89c" },
                children: []
              },
              {
                elementName: "path",
                attributes: { "haiku-id": "2a9a408ad938", id: "path-5-50b89c" },
                children: []
              },
              {
                elementName: "mask",
                attributes: { "haiku-id": "906f0344149c", id: "mask-6-50b89c" },
                children: [
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#path-5-50b89c",
                      "haiku-id": "e1603f0f9bc5"
                    },
                    children: []
                  }
                ]
              },
              {
                elementName: "mask",
                attributes: { "haiku-id": "227906d5ee96", id: "mask-8-50b89c" },
                children: [
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#path-5-50b89c",
                      "haiku-id": "461c623e57e3"
                    },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "e2bcb410db91", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "24c88ba2e5b7", id: "Screen-3" },
                children: [
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "467a83353229", id: "percy" },
                    children: [
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "fe23f62c2ba1",
                          id: "remaining_ham"
                        },
                        children: [
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "69de80af50ad",
                              id: "Path-5"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "d522abad56d4",
                              id: "Path-5-Copy"
                            },
                            children: []
                          },
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-1-50b89c",
                              "haiku-id": "5f3ebbe5315a",
                              id: "Mask-Copy-2"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "a932d40dc93a",
                              id: "Combined-Shape"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "0b5a2c439f1c",
                              id: "Path-2"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "1ca0d35e7f9c",
                              id: "Path-2-Copy"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "ae8b942d477d",
                              id: "Combined-Shape-Copy"
                            },
                            children: []
                          },
                          {
                            elementName: "g",
                            attributes: {
                              "haiku-id": "d520cc2c4e8f",
                              id: "ear"
                            },
                            children: [
                              {
                                elementName: "mask",
                                attributes: {
                                  "haiku-id": "bc6ecbb40d85",
                                  id: "mask-4-50b89c"
                                },
                                children: [
                                  {
                                    elementName: "use",
                                    attributes: {
                                      "xlink:href": "#path-3-50b89c",
                                      "haiku-id": "96b5c9c70379"
                                    },
                                    children: []
                                  }
                                ]
                              },
                              {
                                elementName: "use",
                                attributes: {
                                  "xlink:href": "#path-3-50b89c",
                                  "haiku-id": "96f8f4d7f9d5",
                                  id: "Mask"
                                },
                                children: []
                              },
                              {
                                elementName: "g",
                                attributes: {
                                  "haiku-id": "61d01e65b92d",
                                  id: "Path-3"
                                },
                                children: []
                              },
                              {
                                elementName: "path",
                                attributes: {
                                  "haiku-id": "6167f607a68b",
                                  id: "Path-3"
                                },
                                children: []
                              },
                              {
                                elementName: "mask",
                                attributes: {
                                  "haiku-id": "2eff2488f347",
                                  id: "mask-7"
                                },
                                children: [
                                  {
                                    elementName: "use",
                                    attributes: {
                                      "xlink:href": "#path-5-50b89c",
                                      "haiku-id": "9cd13d1dfd4f"
                                    },
                                    children: []
                                  }
                                ]
                              },
                              {
                                elementName: "g",
                                attributes: {
                                  "haiku-id": "0d05641ec4cf",
                                  id: "Mask-Copy"
                                },
                                children: [
                                  {
                                    elementName: "use",
                                    attributes: {
                                      "xlink:href": "#path-5-50b89c",
                                      "haiku-id": "b686462c6508"
                                    },
                                    children: []
                                  }
                                ]
                              }
                            ]
                          },
                          {
                            elementName: "g",
                            attributes: {
                              "haiku-id": "596ca721a8a4",
                              id: "tail"
                            },
                            children: [
                              {
                                elementName: "path",
                                attributes: {
                                  "haiku-id": "911d4b0b1a58",
                                  id: "Path-6"
                                },
                                children: []
                              },
                              {
                                elementName: "ellipse",
                                attributes: {
                                  "haiku-id": "0489de4c256a",
                                  id: "Oval-5"
                                },
                                children: []
                              },
                              {
                                elementName: "path",
                                attributes: {
                                  "haiku-id": "e5edc1ecbeaa",
                                  id: "Path-7"
                                },
                                children: []
                              }
                            ]
                          }
                        ]
                      },
                      {
                        elementName: "path",
                        attributes: { "haiku-id": "1207fc16f64b", id: "eye" },
                        children: []
                      },
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "8d2897fde72b",
                          id: "eye_left"
                        },
                        children: []
                      },
                      {
                        elementName: "g",
                        attributes: { "haiku-id": "9f15451da432", id: "nose" },
                        children: [
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "27bfab5848b1",
                              id: "Rectangle-2"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "765354e19b61",
                              id: "Rectangle-2-Copy"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "db01e0904b21",
                              id: "Rectangle-2-Copy-2"
                            },
                            children: []
                          },
                          {
                            elementName: "ellipse",
                            attributes: {
                              "haiku-id": "e84bdc4aeab5",
                              id: "Oval-4"
                            },
                            children: []
                          },
                          {
                            elementName: "ellipse",
                            attributes: {
                              "haiku-id": "101568e1ab8a",
                              id: "Oval-4-Copy"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "aa6a78061cf4",
                          id: "coin-pocket"
                        },
                        children: [
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "6a04380d532f",
                              id: "Path-4"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "10ecf1673d63",
                              id: "coinhole"
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
          "haiku-id": "550f1d1bf4d2",
          "haiku-title": "page",
          "haiku-source": "designs/percy.sketch.contents/slices/page.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "df6656205379" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "e3a89d9bd6de"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "71901b0f9924" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "0f6d9bd43588", id: "path-1-29843c" },
                children: []
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "cdf169cc6177", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "f99817abdb6a", id: "Screen-2" },
                children: [
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "d68acbe98227", id: "page" },
                    children: [
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-1-29843c",
                          "haiku-id": "db571728a592"
                        },
                        children: []
                      },
                      {
                        elementName: "rect",
                        attributes: { "haiku-id": "6cd9745478ed" },
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
          "haiku-id": "e0fe9ff9c991",
          "haiku-title": "page",
          "haiku-source": "designs/percy.sketch.contents/slices/page.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "ec1183644ce8" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "bf15ac0879f6"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "915145d77fea" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "1343c9b67711", id: "path-1-e28417" },
                children: []
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "dee5573a6a40", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "f1375d4b685a", id: "Screen-2" },
                children: [
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "4280e7dde2d1", id: "page" },
                    children: [
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-1-e28417",
                          "haiku-id": "171b7a9748d7"
                        },
                        children: []
                      },
                      {
                        elementName: "rect",
                        attributes: { "haiku-id": "c8b57e1885da" },
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
          "haiku-id": "765a09ca1a45",
          "haiku-title": "page",
          "haiku-source": "designs/percy.sketch.contents/slices/page.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "a511ea2a30e2" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "e9fc7165dcc2"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "fe019e36a05a" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "b1af1892eec3", id: "path-1-39283e" },
                children: []
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "6224efeee656", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "af3b68441eed", id: "Screen-2" },
                children: [
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "3829b11ac250", id: "page" },
                    children: [
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-1-39283e",
                          "haiku-id": "668d472e3731"
                        },
                        children: []
                      },
                      {
                        elementName: "rect",
                        attributes: { "haiku-id": "8c986bd9591c" },
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
          "haiku-id": "ee5e030047e6",
          "haiku-title": "headline2",
          "haiku-source": "designs/percy.sketch.contents/slices/headline2.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "d0693c80ed3f" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "27f7bb5f2702"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "bc7c55d25949" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "abb95145e89b", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "1708e96a1a1e", id: "headline2" },
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
          "haiku-id": "b4141bc315b0",
          "haiku-title": "headline2",
          "haiku-source": "designs/percy.sketch.contents/slices/headline2.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "758d56c30bf2" },
            children: []
          },
          {
            elementName: "desc",
            attributes: { "haiku-id": "a394c06eb6bb" },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "a8a3adb60f8f" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "d6c1eb05d14a", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "b6feec71fdbf", id: "headline2" },
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
          "haiku-id": "8b7b55c1730c",
          "haiku-title": "headline2",
          "haiku-source": "designs/percy.sketch.contents/slices/headline2.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "37fcc6767ee8" },
            children: []
          },
          {
            elementName: "desc",
            attributes: { "haiku-id": "dd9e11a76b1c" },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "5e8182f984e1" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "cffaa913f574", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "1f36a9d40987", id: "headline2" },
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
          "haiku-id": "d300f3906156",
          "haiku-title": "headline2",
          "haiku-source": "designs/percy.sketch.contents/slices/headline2.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "23edd78618fd" },
            children: []
          },
          {
            elementName: "desc",
            attributes: { "haiku-id": "4aa79f4f6814" },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "1a9dbf097391" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "57aff1d2af87", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "0d0df41361a9", id: "headline2" },
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
          "haiku-id": "642c141595ca",
          "haiku-title": "coin",
          "haiku-source": "designs/percy.sketch.contents/slices/coin.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "c5990328fa96" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "9dbb842e95c9"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "f661c5fa14a3" },
            children: [
              {
                elementName: "circle",
                attributes: { "haiku-id": "d32e841241d9", id: "path-1-e5be6d" },
                children: []
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "82d9fb1d186a", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "e3d5279ecd91", id: "Screen-3" },
                children: [
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "422ef795174c", id: "coin" },
                    children: [
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-1-e5be6d",
                          "haiku-id": "cd128ad9db7a"
                        },
                        children: []
                      },
                      {
                        elementName: "circle",
                        attributes: { "haiku-id": "e5a0a538455c" },
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
          "haiku-id": "266a4c737675",
          "haiku-title": "remaining_ham",
          "haiku-source": "designs/percy.sketch.contents/slices/remaining_ham.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "067ac1a02e35" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "ec51e662e971"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "9beda2be0a5e" },
            children: [
              {
                elementName: "path",
                attributes: { "haiku-id": "bd2369e6b224", id: "path-1-a981d5" },
                children: []
              },
              {
                elementName: "mask",
                attributes: { "haiku-id": "0761139d1c35", id: "mask-2-a981d5" },
                children: [
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#path-1-a981d5",
                      "haiku-id": "132faf8a4b73"
                    },
                    children: []
                  }
                ]
              },
              {
                elementName: "path",
                attributes: { "haiku-id": "6afeba17f276", id: "path-3-a981d5" },
                children: []
              },
              {
                elementName: "path",
                attributes: { "haiku-id": "986dc1eb4768", id: "path-5-a981d5" },
                children: []
              },
              {
                elementName: "mask",
                attributes: { "haiku-id": "fa23b8a54ddf", id: "mask-6-a981d5" },
                children: [
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#path-5-a981d5",
                      "haiku-id": "539149c40a0c"
                    },
                    children: []
                  }
                ]
              },
              {
                elementName: "mask",
                attributes: { "haiku-id": "b17f0580e073", id: "mask-8-a981d5" },
                children: [
                  {
                    elementName: "use",
                    attributes: {
                      "xlink:href": "#path-5-a981d5",
                      "haiku-id": "14e1511fd4e6"
                    },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "107b6b889ade", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "1763fed7d9ad", id: "Screen-3" },
                children: [
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "fb2ddf1ad465", id: "percy" },
                    children: [
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "53fbe5377c0c",
                          id: "remaining_ham"
                        },
                        children: [
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "e3ebcfa572f6",
                              id: "Path-5"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "6583f4a948c4",
                              id: "Path-5-Copy"
                            },
                            children: []
                          },
                          {
                            elementName: "use",
                            attributes: {
                              "xlink:href": "#path-1-a981d5",
                              "haiku-id": "271edd4b2ae0",
                              id: "Mask-Copy-2"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "38edbc124546",
                              id: "Combined-Shape"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "a756242bc906",
                              id: "Path-2"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "fe656a23dcaa",
                              id: "Path-2-Copy"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "0f9f733fe02a",
                              id: "Combined-Shape-Copy"
                            },
                            children: []
                          },
                          {
                            elementName: "g",
                            attributes: {
                              "haiku-id": "0e91a3b85f79",
                              id: "ear"
                            },
                            children: [
                              {
                                elementName: "mask",
                                attributes: {
                                  "haiku-id": "7f43ea93ad2e",
                                  id: "mask-4-a981d5"
                                },
                                children: [
                                  {
                                    elementName: "use",
                                    attributes: {
                                      "xlink:href": "#path-3-a981d5",
                                      "haiku-id": "1c73a088f9dd"
                                    },
                                    children: []
                                  }
                                ]
                              },
                              {
                                elementName: "use",
                                attributes: {
                                  "xlink:href": "#path-3-a981d5",
                                  "haiku-id": "4c42120d6e2e",
                                  id: "Mask"
                                },
                                children: []
                              },
                              {
                                elementName: "g",
                                attributes: {
                                  "haiku-id": "d91a7892e232",
                                  id: "Path-3"
                                },
                                children: []
                              },
                              {
                                elementName: "path",
                                attributes: {
                                  "haiku-id": "95cbb9a9a6aa",
                                  id: "Path-3"
                                },
                                children: []
                              },
                              {
                                elementName: "mask",
                                attributes: {
                                  "haiku-id": "a84480a6a256",
                                  id: "mask-7"
                                },
                                children: [
                                  {
                                    elementName: "use",
                                    attributes: {
                                      "xlink:href": "#path-5-a981d5",
                                      "haiku-id": "ef5973525520"
                                    },
                                    children: []
                                  }
                                ]
                              },
                              {
                                elementName: "g",
                                attributes: {
                                  "haiku-id": "ef091282c770",
                                  id: "Mask-Copy"
                                },
                                children: [
                                  {
                                    elementName: "use",
                                    attributes: {
                                      "xlink:href": "#path-5-a981d5",
                                      "haiku-id": "6415af45d9d6"
                                    },
                                    children: []
                                  }
                                ]
                              }
                            ]
                          },
                          {
                            elementName: "g",
                            attributes: {
                              "haiku-id": "b80a081c3a49",
                              id: "tail"
                            },
                            children: [
                              {
                                elementName: "path",
                                attributes: {
                                  "haiku-id": "66d916dd4d97",
                                  id: "Path-6"
                                },
                                children: []
                              },
                              {
                                elementName: "ellipse",
                                attributes: {
                                  "haiku-id": "afe50977227f",
                                  id: "Oval-5"
                                },
                                children: []
                              },
                              {
                                elementName: "path",
                                attributes: {
                                  "haiku-id": "bcd90effd922",
                                  id: "Path-7"
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
          "haiku-id": "24807e4c556f",
          "haiku-title": "nose",
          "haiku-source": "designs/percy.sketch.contents/slices/nose.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "3b0c11316b6f" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "d0d10f2d3aa0"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "2af6b60daa80" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "d059caa49ac5", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "2d9936e649b4", id: "Screen-3" },
                children: [
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "16921b5aa0b1", id: "percy" },
                    children: [
                      {
                        elementName: "g",
                        attributes: { "haiku-id": "df8b56f17fd9", id: "nose" },
                        children: [
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "50cb74cdecd6",
                              id: "Rectangle-2"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "c459af7c050e",
                              id: "Rectangle-2-Copy"
                            },
                            children: []
                          },
                          {
                            elementName: "rect",
                            attributes: {
                              "haiku-id": "24b8dc6eb210",
                              id: "Rectangle-2-Copy-2"
                            },
                            children: []
                          },
                          {
                            elementName: "ellipse",
                            attributes: {
                              "haiku-id": "536fd6f4cdc4",
                              id: "Oval-4"
                            },
                            children: []
                          },
                          {
                            elementName: "ellipse",
                            attributes: {
                              "haiku-id": "676787d364d0",
                              id: "Oval-4-Copy"
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
          "haiku-id": "4995dc8b328a",
          "haiku-title": "eye",
          "haiku-source": "designs/percy.sketch.contents/slices/eye.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "10038e1f49e0" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "c1a0d6fcaf4a"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "7a45f1a1f3c4" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "e00d33b60adc", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "9272e0f30696", id: "Screen-3" },
                children: [
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "85c13d8b1c5e", id: "percy" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { "haiku-id": "0bf69575f186", id: "eye" },
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
          "haiku-id": "d7e232348f2f",
          "haiku-title": "eye_left",
          "haiku-source": "designs/percy.sketch.contents/slices/eye_left.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "1b24ee27f3e5" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "9971d985ab29"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "692de7056a89" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "854088cc8b39", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "af9df620e765", id: "Screen-3" },
                children: [
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "dab6a7543589", id: "percy" },
                    children: [
                      {
                        elementName: "path",
                        attributes: {
                          "haiku-id": "495f5cec5105",
                          id: "eye_left"
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
          "haiku-id": "9ea8d8a2afa6",
          "haiku-title": "coin pocket",
          "haiku-source": "designs/percy.sketch.contents/slices/coin pocket.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "bb36063120da" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "46401159cc14"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "29f71cd2fac7" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "dbc3ba58fb09", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "51ce80e32a2f", id: "Screen-3" },
                children: [
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "4d50b2d4f105", id: "percy" },
                    children: [
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "8f23c92f7406",
                          id: "coin-pocket"
                        },
                        children: [
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "10c70e054501",
                              id: "Path-4"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "506d060dabca",
                              id: "coinhole"
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
          "haiku-id": "7618d3f02ab2",
          "haiku-title": "coin pocket",
          "haiku-source": "designs/percy.sketch.contents/slices/coin pocket.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "820f8c262ef6" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "e220d63d2a44"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "c07d99686b48" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "ead1929672bf", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "3395b2665897", id: "Screen-3" },
                children: [
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "8bfc283f0cf2", id: "percy" },
                    children: [
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "ba48c5f19d23",
                          id: "coin-pocket"
                        },
                        children: [
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "d367f2c8fc6d",
                              id: "Path-4"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "8f661fc336a0",
                              id: "coinhole"
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
};
