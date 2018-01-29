var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    uuid: "HAIKU_SHARE_UUID",
    type: "haiku",
    name: "Alien",
    relpath: "code/main/code.js",
    player: "2.3.39",
    version: "0.0.27",
    organization: "SashaDotCom",
    project: "Alien",
    branch: "master"
  },

  options: {},
  states: {
    currentBaby: { type: "string", value: "" },
    axisTilt: { type: "number", value: 0 },
    fatness: { type: "number", value: 1 }
  },

  eventHandlers: {
    "haiku:437db6fd4baf": {
      click: {
        handler: function(event) {
          if (/baby\d/.test(this.state.currentBaby)) {
            this.setState({
              fatness: Math.min(this.state.fatness + 0.025, 1.25),
              currentBaby: ""
            });

            return;
          }

          if (this.state.currentBaby || this.state.fatness >= 1.225) {
            return;
          }

          this.setState({
            currentBaby: "pending"
          });

          let interval = setInterval(
            () => {
              if (this.state.axisTilt >= 1) {
                clearInterval(interval);
                interval = setInterval(
                  () => {
                    if (this.state.axisTilt <= 0) {
                      clearInterval(interval);
                      this.setState({
                        currentBaby: `baby${Math.floor(Math.random() * 8)}`
                      });
                    }
                    this.setState({
                      axisTilt: this.state.axisTilt - 0.05
                    });
                  },
                  10
                );
              }
              this.setState({
                axisTilt: this.state.axisTilt + 0.05
              });
            },
            10
          );
        }
      }
    }
  },

  timelines: {
    Default: {
      "haiku:437db6fd4baf": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "hidden" } },
        "style.overflowY": { "0": { value: "hidden" } },
        "sizeAbsolute.x": { "0": { value: 550 } },
        "sizeAbsolute.y": { "0": { value: 400 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "style.cursor": { "0": { value: "none" } }
      },

      "haiku:00392079a04f": {
        viewBox: { "0": { value: "0 0 36 120" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 36 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 120 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 295.5, edited: true } },
        "translation.y": { "0": { value: 254, edited: true } },
        "style.zIndex": { "0": { value: 4 } }
      },

      "haiku:2dd8cbf3ab8a": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:77020991450a": {
        fill: { "0": { value: "#417505" } },
        "translation.x": { "0": { value: -208 } },
        "translation.y": { "0": { value: -334 } }
      },

      "haiku:bf3dfc8d32ab": {
        x: { "0": { value: "208" } },
        y: { "0": { value: "334" } },
        "sizeAbsolute.x": { "0": { value: 36 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 120 } },
        "sizeMode.y": { "0": { value: 1 } }
      },

      "haiku:69eff41fbb42": {
        viewBox: { "0": { value: "0 0 36 120" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 36 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 120 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 214.5, edited: true } },
        "translation.y": { "0": { value: 253, edited: true } },
        "style.zIndex": { "0": { value: 5 } }
      },

      "haiku:72883c4a4d5f": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:712ba0586f44": {
        fill: { "0": { value: "#417505" } },
        "translation.x": { "0": { value: -128 } },
        "translation.y": { "0": { value: -334 } }
      },

      "haiku:a02f0862939a": {
        x: { "0": { value: "128" } },
        y: { "0": { value: "334" } },
        "sizeAbsolute.x": { "0": { value: 36 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 120 } },
        "sizeMode.y": { "0": { value: 1 } }
      },

      "haiku:e72f607d8bd8": {
        viewBox: { "0": { value: "0 0 45 44" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 45 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 44 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 291, edited: true } },
        "translation.y": { "0": { value: 330, edited: true } },
        "style.zIndex": { "0": { value: 6 } }
      },

      "haiku:f16cd3f51f4d": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:bd1b31eb0328": {
        "translation.x": { "0": { value: -204 } },
        "translation.y": { "0": { value: -418 } }
      },

      "haiku:b43e66031e71": {
        "translation.x": { "0": { value: 204 } },
        "translation.y": { "0": { value: 420 } }
      },

      "haiku:e5a4e8fea4d8": {
        d: {
          "0": {
            value: "M22.5,7 L22.5,7 L22.5,7 C34.9264069,7 45,17.0735931 45,29.5 L45,34 L0,34 L0,29.5 L0,29.5 C-1.52179594e-15,17.0735931 10.0735931,7 22.5,7 Z"
          }
        },

        fill: { "0": { value: "#F5A623" } }
      },

      "haiku:6ca9774ddfc7": {
        stroke: { "0": { value: "#000000" } },
        "stroke-width": { "0": { value: "3" } },
        cx: { "0": { value: "15" } },
        cy: { "0": { value: "7" } },
        r: { "0": { value: "7" } }
      },

      "haiku:e415173a458c": {
        stroke: { "0": { value: "#000000" } },
        "stroke-width": { "0": { value: "3" } },
        cx: { "0": { value: "29" } },
        cy: { "0": { value: "7" } },
        r: { "0": { value: "7" } }
      },

      "haiku:0f114001c9d9": {
        fill: { "0": { value: "#8B572A" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "34" } },
        "sizeAbsolute.x": { "0": { value: 45 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 8 } },
        "sizeMode.y": { "0": { value: 1 } }
      },

      "haiku:616599855810": {
        viewBox: { "0": { value: "0 0 45 44" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 45 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 44 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 211, edited: true } },
        "translation.y": { "0": { value: 331, edited: true } },
        "style.zIndex": { "0": { value: 7 } }
      },

      "haiku:0a0228e2f0ab": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:88c35270c608": {
        "translation.x": { "0": { value: -124 } },
        "translation.y": { "0": { value: -418 } }
      },

      "haiku:d596ae069f7b": {
        "translation.x": { "0": { value: 124 } },
        "translation.y": { "0": { value: 420 } }
      },

      "haiku:cd536ac08b6a": {
        d: {
          "0": {
            value: "M22.5,7 L22.5,7 L22.5,7 C34.9264069,7 45,17.0735931 45,29.5 L45,34 L0,34 L0,29.5 L0,29.5 C-1.52179594e-15,17.0735931 10.0735931,7 22.5,7 Z"
          }
        },

        fill: { "0": { value: "#F5A623" } }
      },

      "haiku:8beca84bf846": {
        stroke: { "0": { value: "#000000" } },
        "stroke-width": { "0": { value: "3" } },
        cx: { "0": { value: "15" } },
        cy: { "0": { value: "7" } },
        r: { "0": { value: "7" } }
      },

      "haiku:31e25393a803": {
        stroke: { "0": { value: "#000000" } },
        "stroke-width": { "0": { value: "3" } },
        cx: { "0": { value: "29" } },
        cy: { "0": { value: "7" } },
        r: { "0": { value: "7" } }
      },

      "haiku:0befb3d72c18": {
        fill: { "0": { value: "#8B572A" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "34" } },
        "sizeAbsolute.x": { "0": { value: 45 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 8 } },
        "sizeMode.y": { "0": { value: 1 } }
      },

      "haiku:bf14028a23ad": {
        viewBox: { "0": { value: "0 0 83 141" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 83 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 141 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 350, edited: true } },
        "translation.y": {
          "0": {
            value: Haiku.inject(
              function(axisTilt) {
                return 63.5 + 20 * axisTilt;
              },
              "axisTilt"
            ),

            edited: true
          }
        },

        "style.zIndex": { "0": { value: 8 } },
        "rotation.x": {
          "0": {
            value: Haiku.inject(
              function(axisTilt) {
                return axisTilt;
              },
              "axisTilt"
            ),

            edited: true
          }
        }
      },

      "haiku:749bc326c251": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:7db059c74422": {
        "translation.x": { "0": { value: -263 } },
        "translation.y": { "0": { value: -152 } }
      },

      "haiku:a37e7d015684": {
        "translation.x": { "0": { value: 263 } },
        "translation.y": { "0": { value: 152 } }
      },

      "haiku:8d042c10919a": {
        d: {
          "0": {
            value: "M0,26 L0,62.928139 L-7.10542736e-15,62.928139 C-2.92319875e-15,97.0786272 27.6844407,124.763068 61.8349289,124.763068 L61.8349289,124.763068"
          }
        },

        stroke: { "0": { value: "#417505" } },
        "stroke-width": { "0": { value: "31" } },
        "translation.x": { "0": { value: 61.83 } },
        "rotation.y": { "0": { value: 3.14 } },
        "rotation.z": { "0": { value: 3.14 } },
        "scale.x": { "0": { value: -1 } },
        "scale.y": { "0": { value: -1 } },
        "scale.z": { "0": { value: -1 } }
      },

      "haiku:16d31978cba4": {
        d: {
          "0": {
            value: "M49,8.22431012e-12 C44.1274959,3.8457183 41,9.80439008 41,16.4935277 C41,28.0915074 50.4020203,37.4935277 62,37.4935277 C73.5979797,37.4935277 83,28.0915074 83,16.4935277 C83,9.80439008 79.8725041,3.8457183 75,9.91939864e-12 L75,16.4935277 L49,16.4935277 L49,-1.06954445e-11 Z"
          }
        },

        fill: { "0": { value: "#417505" } }
      },

      "haiku:129153ab8819": {
        viewBox: { "0": { value: "0 0 83 141" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 83 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 141 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 103, edited: true } },
        "translation.y": { "0": { value: 69.5, edited: true } },
        "style.zIndex": { "0": { value: 9 } }
      },

      "haiku:5d2b806c1323": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:1356a1d19cc9": {
        "translation.x": { "0": { value: -26 } },
        "translation.y": { "0": { value: -152 } }
      },

      "haiku:183a5d09fa7a": {
        "translation.x": { "0": { value: 26 } },
        "translation.y": { "0": { value: 152 } }
      },

      "haiku:6fa33e11eeb9": {
        d: {
          "0": {
            value: "M21,26 L21,62.928139 L21,62.928139 C21,97.0786272 48.6844407,124.763068 82.8349289,124.763068 L82.8349289,124.763068"
          }
        },

        stroke: { "0": { value: "#417505" } },
        "stroke-width": { "0": { value: "31" } }
      },

      "haiku:2de712efcbe1": {
        d: {
          "0": {
            value: "M8,8.22431012e-12 C3.12749589,3.8457183 0,9.80439008 0,16.4935277 C0,28.0915074 9.40202025,37.4935277 21,37.4935277 C32.5979797,37.4935277 42,28.0915074 42,16.4935277 C42,9.80439008 38.8725041,3.8457183 34,9.91939864e-12 L34,16.4935277 L8,16.4935277 L8,-1.06954445e-11 Z"
          }
        },

        fill: { "0": { value: "#417505" } }
      },

      "haiku:337c0e95e0df": {
        viewBox: { "0": { value: "0 0 198 234" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 198 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 234 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 176.5, edited: true } },
        "translation.y": { "0": { value: 59, edited: true } },
        "style.zIndex": { "0": { value: 10 } },
        opacity: { "0": { value: 1, edited: true } },
        "scale.x": {
          "0": {
            value: Haiku.inject(
              function(fatness) {
                return fatness;
              },
              "fatness"
            ),

            edited: true
          }
        },

        "scale.y": {
          "0": {
            value: Haiku.inject(
              function(fatness) {
                return fatness;
              },
              "fatness"
            ),

            edited: true
          }
        }
      },

      "haiku:4aee7d859989": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:680384bd9195": {
        fill: { "0": { value: "#417505" } },
        "translation.x": { "0": { value: -90 } },
        "translation.y": { "0": { value: -147 } }
      },

      "haiku:c5d5a35a2c7c": {
        x: { "0": { value: "90" } },
        y: { "0": { value: "147" } },
        rx: { "0": { value: "99" } },
        "sizeAbsolute.x": { "0": { value: 198 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 234 } },
        "sizeMode.y": { "0": { value: 1 } }
      },

      "haiku:bef028f38a37": {
        viewBox: { "0": { value: "0 0 87 30" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 87 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 30 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 232, edited: true } },
        "translation.y": { "0": { value: 231, edited: true } },
        "style.zIndex": { "0": { value: 11 } }
      },

      "haiku:5a0994d97003": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:0530bf34176d": {
        fill: { "0": { value: "#000000" } },
        "translation.x": { "0": { value: -145 } },
        "translation.y": { "0": { value: -319 } }
      },

      "haiku:22cf48bded3f": {
        d: {
          "0": {
            value: "M175,319 L202,319 L202,319 C218.568542,319 232,332.431458 232,349 L232,349 L145,349 L145,349 L145,349 C145,332.431458 158.431458,319 175,319 Z"
          }
        },

        "translation.x": { "0": { value: 377 } },
        "translation.y": { "0": { value: 668 } },
        "rotation.z": { "0": { value: 3.14 } }
      },

      "haiku:3bc434d35c3a": {
        viewBox: { "0": { value: "0 0 138 120" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 138 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 120 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 207.5, edited: true } },
        "translation.y": { "0": { value: 90, edited: true } },
        "style.zIndex": { "0": { value: 12 } },
        opacity: { "0": { value: 1, edited: true } }
      },

      "haiku:c6eecbdfcf76": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "60" } },
        "sizeAbsolute.x": { "0": { value: 138 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 120 } },
        "sizeMode.y": { "0": { value: 1 } }
      },

      "haiku:a58c48c69695": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:ea91d4ec9bc5": {
        "translation.x": { "0": { value: -121 } },
        "translation.y": { "0": { value: -178 } }
      },

      "haiku:4415bcee4202": {
        "translation.x": { "0": { value: 121 } },
        "translation.y": { "0": { value: 178 } }
      },

      "haiku:a5763e546d76": {
        fill: { "0": { value: "#FFFFFF" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "xlink:href": { "0": { value: "#path-1-69bb6e" } }
      },

      "haiku:e5a7b4e6baf4": {
        stroke: { "0": { value: "#979797" } },
        "stroke-width": { "0": { value: "1" } },
        x: { "0": { value: "0.5" } },
        y: { "0": { value: "0.5" } },
        rx: { "0": { value: "59.5" } },
        "sizeAbsolute.x": { "0": { value: 137 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 119 } },
        "sizeMode.y": { "0": { value: 1 } }
      },

      "haiku:79b13c1a485c": {
        viewBox: { "0": { value: "0 0 72 72" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 72 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 72 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function($user) {
                return 238.5 + ($user.mouse.x - 550 / 2) / 35;
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
                return 114 + ($user.mouse.y - 400 / 2) / 35;
              },
              "$user"
            ),

            edited: true
          }
        },

        "style.zIndex": { "0": { value: 13 } }
      },

      "haiku:cf3b708ad006": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:40703169c495": {
        "translation.x": { "0": { value: -152 } },
        "translation.y": { "0": { value: -202 } }
      },

      "haiku:9cbcba72d890": {
        "translation.x": { "0": { value: 121 } },
        "translation.y": { "0": { value: 178 } }
      },

      "haiku:251210949acf": {
        "translation.x": { "0": { value: 32 } },
        "translation.y": { "0": { value: 25 } }
      },

      "haiku:344cf943301f": {
        stroke: { "0": { value: "#979797" } },
        fill: { "0": { value: "#000000" } },
        cx: { "0": { value: "35" } },
        cy: { "0": { value: "35" } },
        r: { "0": { value: "35" } }
      },

      "haiku:c4c6e7c0c7b9": {
        fill: { "0": { value: "#FFFFFF" } },
        cx: { "0": { value: "35" } },
        cy: { "0": { value: "35" } },
        r: { "0": { value: "8" } }
      },

      "haiku:8d565d98a185": {
        viewBox: { "0": { value: "0 0 91 62" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 91 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 62 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 231, edited: true } },
        "translation.y": { "0": { value: 15, edited: true } },
        "style.zIndex": { "0": { value: 14 } }
      },

      "haiku:f311b466e70b": {
        d: {
          "0": {
            value: "M41,0 L41,0 L41,0 C63.6436747,-4.15957557e-15 82,18.3563253 82,41 L82,52 L0,52 L0,41 L0,41 C-2.77305038e-15,18.3563253 18.3563253,4.15957557e-15 41,0 Z"
          }
        }
      },

      "haiku:0caff2ed386b": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:0ccca86307c0": {
        "translation.x": { "0": { value: -144 } },
        "translation.y": { "0": { value: -103 } }
      },

      "haiku:3c4bed8d2b82": {
        "translation.x": { "0": { value: 144 } },
        "translation.y": { "0": { value: 103 } }
      },

      "haiku:a5763e546d76:path-1-116e19": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        rx: { "0": { value: "60" } },
        "sizeAbsolute.x": { "0": { value: 138 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 120 } },
        "sizeMode.y": { "0": { value: 1 } },
        fill: { "0": { value: "#FFFFFF" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "xlink:href": { "0": { value: "#path-1-116e19" } }
      },

      "haiku:c5e73b0bfb56": {
        viewBox: { "0": { value: "0 0 219 351" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 219 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 351 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function($user) {
                return $user.mouse.x - 144;
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
                return $user.mouse.y - 288;
              },
              "$user"
            ),

            edited: true
          }
        },

        "style.zIndex": { "0": { value: 30 } },
        "scale.x": { "0": { value: 0.3, edited: true } },
        "scale.y": { "0": { value: 0.3, edited: true } },
        opacity: {
          "0": {
            value: Haiku.inject(
              function(currentBaby) {
                return currentBaby === "baby0" ? 1 : 0;
              },
              "currentBaby"
            ),

            edited: true
          }
        }
      },

      "haiku:d8ec64c16182": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:c370392e3391": { "fill-rule": { "0": { value: "nonzero" } } },
      "haiku:b7b1e984479c": {
        "translation.x": { "0": { value: 3 } },
        "translation.y": { "0": { value: 230 } }
      },

      "haiku:c6a5cdc7d240": {
        d: {
          "0": {
            value: "M39.9,2.9 C37.4,1.9 34.7,1.7 32,1.6 C26.6,1.5 21,1.9 16.1,4.1 C5.3,9 0.1,22.1 1.2,33.9 C2.3,45.7 8.4,56.4 15.2,66.2 C22.6,77 31.3,87.5 43,93.4 C49.7,96.8 58.4,98.2 64.1,93.4 C67.8,90.2 69.2,85.1 69.9,80.3 C74,54.3 65,26.5 46.5,7.8 C44.5,5.9 42.4,4 39.9,2.9 Z"
          }
        },

        fill: { "0": { value: "#DC4F9C" } }
      },

      "haiku:f89a83770045": {
        d: {
          "0": {
            value: "M10.9,8.7 C15.4,4.1 22.4,2.7 28.6,2.4 C31.5,2.3 34.4,2.2 37.3,2.6 C37.5,2.6 39.8,3.2 39.9,3.1 C40.8,2.5 38.8,1.9 38.6,1.9 C35.9,1 33,0.9 30.1,0.9 C26.8,0.9 23.6,1.1 20.4,1.8 C14.3,3.2 9.1,7 5.7,12.2 C2,17.9 0.2,24.7 0.3,31.5 C0.5,38.3 2.5,45 5.4,51.2 C8.3,57.3 12,63.1 15.9,68.6 C19.7,74 23.9,79.2 28.7,83.9 C33.5,88.5 39,92.7 45.3,95.2 C51.4,97.6 59,98.4 64.4,94 C69.5,89.7 70.3,82.5 71.1,76.3 C71.9,69.5 71.7,62.2 70.6,55.4 C68.9,44.7 65.4,34.5 60.1,25.1 C57.4,20.2 54.1,15.8 50.5,11.6 C48.8,9.6 46.9,7.7 45,5.9 C44.7,5.7 40.2,2.3 40,2.8 C40.1,2.5 44.5,6 44.8,6.2 C47.2,8.4 49.3,11 51.4,13.5 C55.8,18.9 59.3,24.8 62.3,31 C68.2,43.1 70.8,57.1 70.3,70.5 C70.2,74.1 69.8,77.6 69.2,81.1 C68.6,84.3 67.8,87.5 65.9,90.2 C62.1,95.9 55,96.4 48.9,94.7 C42.5,92.9 36.8,88.9 31.9,84.5 C27,80.1 22.7,74.9 18.8,69.5 C12.3,60.6 6,50.9 3.3,40 C0.4,29.2 2.4,16.9 10.9,8.7 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:3eabc9cfd4fb": {
        "translation.x": { "0": { value: 57 } },
        "translation.y": { "0": { value: 179 } }
      },

      "haiku:8fa9c99e1000": {
        d: {
          "0": {
            value: "M54.7,7.2 C48.5,10 43,14.1 37.9,18.7 C22,32.9 9.9,51.4 3.3,71.7 C1.2,78.1 -0.3,85 1.7,91.4 C4.6,100.2 13.4,105.4 21.7,109.4 C31.3,114 41.3,118.2 51.9,120 C62.4,121.8 73.6,121.3 83.3,116.8 C93.7,112 101.8,103 107.1,92.8 C112.4,82.6 115.2,71.3 117,60 C119.2,46.3 120.2,32 115.7,18.9 C114.6,15.8 113.2,12.7 111,10.4 C108.9,8.2 106.2,6.7 103.5,5.5 C83.4,-3.4 59.3,0.8 40.2,11.7"
          }
        },

        fill: { "0": { value: "#DC4F9C" } }
      },

      "haiku:df841dd2db7b": {
        d: {
          "0": {
            value: "M20.8,39.1 C27.7,29.6 35.8,20.7 45.2,13.6 C47.4,11.9 49.7,10.4 52.1,9.1 C53,8.6 53.9,8.2 54.8,7.6 C55,7.5 54.8,7.3 54.7,7.1 C54.6,6.9 53.7,7.3 53.5,7.4 C48.5,9.5 43.9,12.8 39.8,16.2 C30.4,24 22.4,33.3 15.8,43.6 C12.2,49.3 9,55.2 6.4,61.4 C3.8,67.6 1.2,74.2 0.3,80.9 C-0.6,87.7 0.9,94.1 5.5,99.2 C9.8,104.1 15.7,107.3 21.5,110.1 C34.3,116.2 47.9,121.6 62.3,121.7 C69.2,121.8 76.1,120.7 82.5,118 C88.5,115.5 93.8,111.6 98.2,106.9 C107.3,97.3 112.4,84.8 115.5,72.1 C117.1,65.3 118.3,58.3 119.1,51.3 C119.8,44.4 120,37.4 119.2,30.4 C118.4,24.1 116.9,16.9 113.1,11.7 C109.2,6.3 102.1,3.9 95.9,2.3 C86.2,-0.3 76,-0.2 66.2,1.8 C61.5,2.7 56.9,4.1 52.4,5.8 C51.4,6.2 40.1,11.3 40.3,11.7 C40.3,11.7 47.3,8.3 47.9,8.1 C50.8,6.8 53.8,5.6 56.9,4.7 C63.3,2.8 69.8,1.5 76.4,1.2 C83.2,0.9 90.2,1.6 96.7,3.6 C102.8,5.5 109.4,7.9 112.8,13.6 C116.2,19.3 117.5,26.5 118.1,33 C118.7,39.9 118.3,46.9 117.4,53.8 C115.7,67.2 112.8,80.9 106.4,92.9 C100.3,104.2 90.8,114 78.4,118 C64.8,122.4 50.1,119.9 37,115.1 C30.5,112.7 24.1,109.9 18,106.6 C12.5,103.6 6.9,99.8 3.9,94.1 C0.6,87.9 1.6,80.7 3.5,74.3 C5.4,67.8 8,61.5 11,55.5 C13.8,49.7 17.1,44.3 20.8,39.1 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:a3c848611701": {
        d: {
          "0": {
            value: "M161.3,253.2 C164.8,254.5 169.2,254.5 171.6,251.7 C173.7,249.3 173.6,245.7 173.2,242.5 C172.6,236.2 171.7,229.9 169.4,224 C167.1,218.1 163.4,212.6 158.1,209.2 C152.8,205.8 145.7,204.8 140.1,207.6 C138.2,212.9 138.3,218.8 139.7,224.3 C141.1,229.8 143.8,234.9 146.8,239.6 C150.5,245.3 155,250.8 161.3,253.2 Z"
          }
        },

        fill: { "0": { value: "#C4408E" } }
      },

      "haiku:45f19db3cb60": {
        d: {
          "0": {
            value: "M156.6,175.5 C149.3,174.3 141.7,175.1 134.4,176.3 C122.7,178.2 111.1,181.3 100.9,187.4 C98.8,188.7 96.7,190.1 95.4,192.1 C93.8,194.6 93.6,197.8 94.6,200.6 C95.6,203.4 97.5,205.8 100,207.5 C104.2,210.5 109.6,211.3 114.7,211.7 C124.6,212.5 134.8,211.9 144,208.2 C153.2,204.5 161.4,197.4 164.8,188.1 C165.7,185.6 166.3,182.7 165.1,180.3 C163.5,177.3 159.9,176 156.6,175.5 Z"
          }
        },

        fill: { "0": { value: "#C4408E" } }
      },

      "haiku:8754d3cc4329": {
        d: {
          "0": {
            value: "M200.9,38 C205.5,38.4 209.8,40.5 213,43.8 C214.8,33.3 211.5,22.1 204.4,14.1 C196.5,15.1 188.8,17.8 182.1,22.1 C185.5,17.2 188.8,12.3 192.2,7.4 C189,8.9 186.2,11.1 184,13.7 C181.9,6.8 175.7,1.3 168.6,0 C172.7,3 174.3,8.4 174,13.5 C173.7,18.6 171.7,23.3 169.8,28 C167.9,17.8 161.5,8.6 152.5,3.4 C160.7,15.9 163.2,32 159.1,46.3 C163.8,45.3 168.4,48.9 173.3,48.8 C176.7,48.7 179.7,46.8 182.9,45.5 C193.1,41.2 205.8,43.9 213.5,51.9 C211.8,45.7 206.9,40.3 200.9,38 Z"
          }
        },

        fill: { "0": { value: "#B28337" } }
      },

      "haiku:10db6af2d8e3": {
        d: {
          "0": {
            value: "M151.3,43.5 C151.2,39.1 154.3,35 158.3,33.1 C162.3,31.2 166.9,31.1 171.2,31.8 C177.5,32.8 183.5,35.3 188.7,39.1 C193.3,42.5 197.5,47.7 196.9,53.4 C196.2,60.3 188.6,64.7 181.7,64.5 C174.7,64.2 168.4,60.5 162.4,56.8 C157.3,53.7 151.5,49.5 151.3,43.5 Z"
          }
        },

        fill: { "0": { value: "#CADC46" } }
      },

      "haiku:5530e1fe5dc4": {
        d: {
          "0": {
            value: "M105.2,45.2 C92.7,44.6 79.4,47.2 70.1,55.6 C60.1,64.6 56.2,79.1 58.3,92.4 C60.4,105.6 68,117.6 77.5,127 C90.3,139.5 106.6,147.8 123.6,153.4 C140.6,159 158.3,161.9 175.9,164.8 C181.8,165.8 187.9,166.7 193.6,165.2 C202.8,162.7 209.2,154.1 212.9,145.3 C219.3,130.5 220.4,113.6 217.3,97.8 C214.2,81.9 207.1,67 197.7,53.9 C194.6,49.6 191,45.2 185.9,43.6 C177.6,41 168.5,46.8 160,44.9 C152.2,43.1 146.7,35.3 138.7,33.9 C134.4,33.2 130.1,34.5 126,35.9 C110.7,41.1 95.9,47.4 81.5,54.8"
          }
        },

        fill: { "0": { value: "#B28337" } }
      },

      "haiku:f2f87fbeca55": {
        "translation.x": { "0": { value: 47 } },
        "translation.y": { "0": { value: 40 } }
      },

      "haiku:f1677b3c9e86": {
        d: {
          "0": {
            value: "M102.6,4.2 C87.3,-0.5 70.2,0.7 55.5,7 C39.9,13.7 29.7,25.4 24.2,41.2 C22.8,45.4 21.1,49.4 20.5,53.8 C19.8,58.5 20.2,63.4 19.1,68.1 C16.6,78.5 7.3,85.8 3.4,95.7 C-1.1,107.2 2.4,120.7 9.9,130.5 C17.4,140.3 28.2,147 39.3,152.3 C43.6,154.4 48,156.3 52.6,157.4 C57.3,158.6 62.2,158.9 67.1,158.9 C101.2,158.8 142,144.9 155.5,110.3 C163.6,89.4 160.7,65.7 151.5,45.6 C141.5,24 125.1,11.1 102.6,4.2 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:255effefc899": {
        d: {
          "0": {
            value: "M45.6,13.4 C56.2,6.3 68.6,2.5 81.4,2.1 C87.1,1.9 92.8,2.5 98.5,3.6 C99.7,3.8 100.9,4.2 102.1,4.4 C102.5,4.5 102.6,4.6 102.7,4.2 C102.8,3.7 102.4,3.8 102,3.6 C99.6,2.8 97.2,2.2 94.7,1.7 C82.1,-0.7 68.9,0.8 57,5.5 C45.3,10.1 35.4,18.1 29,29 C25.5,34.9 23,41.5 21,48.1 C20,51.4 19.5,54.7 19.3,58.2 C19.1,61.4 19.1,64.7 18.3,67.9 C16.8,74.4 12.3,79.8 8.6,85.1 C5.2,89.9 2.2,95 1.2,100.8 C-1.2,113.9 4.9,127.1 14,136.2 C18.7,140.9 24.1,144.7 29.8,148 C35.7,151.4 42,154.6 48.4,156.8 C55.3,159.2 62.4,159.7 69.6,159.5 C76.6,159.4 83.6,158.6 90.5,157.3 C103.8,154.8 116.9,150.2 128.3,143 C139.6,135.8 149.2,125.8 154.7,113.4 C160.4,100.6 161.8,86.2 159.9,72.4 C158.1,59.3 153.5,46.2 146.3,35.1 C139.2,24.2 129.2,15.4 117.5,9.7 C116.3,9.1 102.8,3.4 102.7,4 C102.7,4 109,6.4 109.5,6.5 C112.3,7.6 115.1,8.9 117.7,10.2 C123.4,13.2 128.9,16.9 133.6,21.2 C143.3,30 150.1,41.5 154.4,53.9 C158.9,66.9 160.8,81 158.8,94.7 C156.8,108.3 150.8,120.9 141.2,130.7 C131.9,140.3 119.7,147 107.1,151.3 C94.1,155.7 80.2,157.9 66.5,157.8 C59.4,157.8 52.6,156.7 46,154.1 C39.6,151.6 33.4,148.3 27.6,144.7 C16.8,137.9 7.1,128.5 3.6,115.9 C1.9,109.8 1.6,103 3.7,97 C5.9,90.8 10.1,85.8 13.7,80.4 C17,75.5 19.8,70.4 20.5,64.5 C20.9,61 20.8,57.5 21.3,54 C21.8,50.5 22.9,47.2 24.1,44 C26.3,37.7 28.8,31.7 32.6,26.2 C36.1,21.3 40.5,16.9 45.6,13.4 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:5b1d73150db2": {
        d: {
          "0": {
            value: "M124.2,184.9 C109.8,185.7 95.1,185.1 81.7,179.8 C73,176.3 65.3,171 57.6,165.7 C64.2,174.9 73.6,181.8 83.9,186.3 C94.2,190.8 105.3,193 116.4,193.8 C129.4,194.7 142.7,193.6 155.1,189.6 C167.6,185.6 179.2,178.7 188.1,168.9 C183.9,168.4 179.7,167.2 175.9,165.3 C169.7,172.5 161.1,177.5 152.1,180.4 C143.1,183.2 133.6,184.3 124.2,184.9 Z"
          }
        },

        fill: { "0": { value: "#E2A286" } }
      },

      "haiku:f2ce40483fb2": {
        d: {
          "0": {
            value: "M91.8,52.6 C83.9,59.6 82.7,71.6 84.1,82 C91.2,71.5 100.7,62.5 111.7,56.1 C109.4,64 110,72.8 113.4,80.3 C118,72.3 123.9,65 130.8,59 C134.3,70.7 141.7,81.2 151.7,88.2 C152.3,82 153.9,75.9 156.5,70.2 C167.3,85.9 171.7,105.9 168.5,124.6 C167.2,132.2 164.7,140.3 167.6,147.5 C168.2,148.9 169.1,150.4 170.5,150.9 C173.5,152 176.2,148.7 177.7,145.8 C182.8,136.1 187.9,126.3 193,116.6 C196.7,109.5 200.4,102.4 202.1,94.6 C203.7,86.8 203.1,78.2 198.5,71.6 C193.9,65 186.2,61.6 178.8,58.4 C170.3,54.7 161.7,51 153.2,47.3 C145.8,44.1 138.3,40.9 130.3,40.5 C122,40.1 114,42.8 106.1,45.5 C101,47.2 95.8,49 91.8,52.6 Z"
          }
        },

        fill: { "0": { value: "#E2A286" } }
      },

      "haiku:d2b1324b6c1a": {
        "translation.x": { "0": { value: 169 } },
        "translation.y": { "0": { value: 132 } }
      },

      "haiku:3a93a5e75e0e": {
        d: {
          "0": {
            value: "M6.4,14.1 C11,6.9 19.3,2.2 27.9,1.9 C29.9,1.8 32,2 33.9,2.8 C39,4.9 41.6,11 41,16.4 C40.4,21.9 37.3,26.7 33.7,30.9 C30.3,34.9 26.2,38.6 21.3,40.5 C16.4,42.4 10.5,42.4 6.1,39.4 C1.8,36.4 -0.3,30.1 2.3,25.5"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:58181d29ac45": {
        d: {
          "0": {
            value: "M15.9,4.3 C13.3,5.7 10.9,7.6 8.9,9.8 C8,10.8 7.2,11.9 6.5,13.1 C6.4,13.4 6.2,13.6 6.1,13.9 C6.1,14 6.5,14.3 6.6,14.3 C7.2,14.1 8,12.8 8.4,12.4 C9.5,11.2 10.7,10 12,9 C14.4,7 17.1,5.4 20,4.4 C25.5,2.4 33.3,1.4 37.4,6.5 C41.6,11.8 40.5,18.9 37.4,24.4 C35,28.6 31.7,32.5 28.1,35.6 C24.5,38.7 20.1,41.1 15.3,41.4 C10.8,41.7 6.2,40.1 3.5,36.4 C2.3,34.7 1.6,32.8 1.4,30.8 C1.3,29.9 1.4,29 1.5,28 C1.5,27.8 2.2,25.7 2.2,25.6 C1.9,25.4 1.1,28.1 1,28.3 C0.7,29.8 0.7,31.3 1.1,32.7 C1.8,35.8 3.7,38.5 6.4,40.2 C11.8,43.6 18.7,42.8 24.1,39.9 C29.7,36.9 34.4,31.8 37.8,26.5 C41.3,21 43.2,14.2 40.2,8 C38.5,4.4 35.4,1.9 31.4,1.2 C26.3,0.4 20.5,1.8 15.9,4.3 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:0893f05521d7": {
        fill: { "0": { value: "#5D3A3E" } },
        "translation.x": { "0": { value: 72 } },
        "translation.y": { "0": { value: 78 } }
      },

      "haiku:5d839e4051a0": {
        d: {
          "0": {
            value: "M17.9,4.5 C16.9,4.5 15.9,4.8 14.9,4.8 C9.5,5 5.7,6.7 0.4,9.3 C2.6,6.5 5.7,4.4 8.9,2.8 C11.8,1.3 15.1,0.2 18.2,1.1 C19.1,1.4 19.9,3 19.3,3.8 C19,4.2 18.4,4.5 17.9,4.5 Z"
          }
        }
      },

      "haiku:f8bda8951acc": {
        d: {
          "0": {
            value: "M59.8,8.7 C59.6,10.7 61.6,12.2 63.3,13.2 C69.3,17.1 74.4,22.4 77.9,28.7 C78.1,26.9 77.3,25.1 76.6,23.4 C74.3,18.4 72,13.3 68.4,9.1 C67.2,7.7 65.7,6.4 63.9,6.1 C62.2,5.8 60,6.9 59.8,8.7 Z"
          }
        }
      },

      "haiku:2fadd71da569": {
        d: {
          "0": {
            value: "M75.5,171.9 C80.8,176 86.4,180.2 93.1,180.8 C89,182.7 84,181.7 80,179.6 C78.6,178.8 77.2,177.9 76.2,176.6 C75.3,175.2 74.9,173.4 75.5,171.9 Z"
          }
        },

        fill: { "0": { value: "#5D3A3E" } }
      },

      "haiku:1a7523415d9a": {
        fill: { "0": { value: "#5D3A3E" } },
        "translation.x": { "0": { value: 116 } },
        "translation.y": { "0": { value: 105 } }
      },

      "haiku:50e376545016": {
        d: {
          "0": {
            value: "M19.7,1.3 C18.1,2.28983499e-16 15.7,-0.3 13.8,0.5 C11.9,1.3 10.5,3.3 10.4,5.4 C12.4,2.5 16.1,0.9 19.7,1.3 Z"
          }
        }
      },

      "haiku:cecf9965bea5": { "translation.y": { "0": { value: 6 } } },
      "haiku:5e79f801afcc": {
        d: {
          "0": {
            value: "M14.3,3.4 C11.8,3.4 9.3,3.7 6.9,4.4 C9.3,1.2 13.6,-0.4 17.5,0.2 C21.5,0.8 25,3.3 27.1,6.7 C27.2,6.9 27.4,7.1 27.3,7.4 C27.2,7.7 27,7.9 26.7,8 C25.8,8.6 25.2,9.5 24.9,10.5 C23.8,8.4 21.8,6.9 19.9,5.5 C19.2,4.9 18.4,4.4 17.5,4 C16.6,3.4 15.4,3.4 14.3,3.4 Z"
          }
        }
      },

      "haiku:d0a487c38d47": {
        d: {
          "0": {
            value: "M0.8,4.1 C3.1,4 5.4,4.3 7.5,5.2 C9.4,6 11,7.1 12.7,8.2 C17,11 21.3,14 24.3,18.1 C24.3,16.8 23.6,15.7 22.9,14.6 C21.5,12.2 20,9.9 18,7.9 C16.1,5.9 13.6,4.3 10.9,3.8 C7.6,3.1 4.2,4.1 0.8,4.1 Z"
          }
        }
      },

      "haiku:2a3e7860fc14": {
        fill: { "0": { value: "#5D3A3E" } },
        "translation.x": { "0": { value: 70 } },
        "translation.y": { "0": { value: 93 } }
      },

      "haiku:de2cc352fe64": {
        d: {
          "0": {
            value: "M15.7,0.5 C17.8,0.2 20,1.2 21.2,2.9 C22.4,4.6 22.6,7 21.6,8.9 C21.2,5.2 18.9,2 15.7,0.5 Z"
          }
        }
      },

      "haiku:74e3a5b9ff05": { "translation.y": { "0": { value: 4 } } },
      "haiku:fcaf2df3153e": {
        d: {
          "0": {
            value: "M16.2,6.1 C18.4,7.4 20.3,9 22.1,10.8 C21.7,6.8 18.9,3.3 15.2,1.7 C11.5,0.1 7.2,0.5 3.6,2.3 C3.4,2.4 3.2,2.5 3.1,2.8 C3,3.1 3.1,3.4 3.3,3.6 C3.7,4.5 3.8,5.7 3.5,6.7 C5.5,5.5 8,5.2 10.3,4.9 C11.2,4.8 12.2,4.7 13.1,4.9 C14.1,5 15.2,5.6 16.2,6.1 Z"
          }
        }
      },

      "haiku:a14266536378": {
        d: {
          "0": {
            value: "M27.3,13.7 C25.4,12.4 23.3,11.6 21,11.2 C19,10.9 17,11 15,11.1 C9.9,11.3 4.7,11.6 0,13.6 C0.7,12.5 1.9,11.9 3,11.3 C5.4,10 7.9,8.8 10.6,8.1 C13.3,7.4 16.2,7.3 18.8,8.2 C22,9.4 24.4,12 27.3,13.7 Z"
          }
        }
      },

      "haiku:6494cead8f7a": {
        d: {
          "0": {
            value: "M193.5,157.9 C192,156.6 190.5,155.3 188.9,154 C188.2,152.3 190.3,150.4 189.7,148.6 C189.3,147.4 187.9,146.4 188.5,145.3 C188.7,145 189,144.8 189.2,144.6 C193.5,141.9 199,140.9 204,142.1 C200.7,140.5 197.2,138.9 193.6,139.6 C190.9,140.2 188.7,142 186.7,143.9 C183,147.5 179.8,152 179,157.1 C179,157.3 178.9,157.6 179,157.8 C179.3,158.4 180.2,158.2 180.9,157.8 C182.9,156.7 185.2,155.9 187.4,156.4 C189.6,156.9 191.6,159 191.1,161.3 C190.6,163.8 187.6,165.1 187,167.5 C188.8,168.1 190.9,167 192,165.5 C193.2,164 193.6,162.1 194.1,160.2 C194.2,159.7 194.4,159.1 194.1,158.6 C194,158.3 193.7,158.1 193.5,157.9 Z"
          }
        },

        fill: { "0": { value: "#5D3A3E" } }
      },

      "haiku:88259307d25a": {
        d: {
          "0": {
            value: "M197.7,146.2 C195.6,145.2 193.3,144.2 191.1,144.7 C189.2,145.1 187.6,146.5 186.9,148.3 C186.2,150.1 186.3,152.2 187.2,153.9 C188,151.5 189.9,149.5 192.2,148.4 C194.5,147.3 197.3,147.2 199.7,148.2 C199.5,147.2 198.6,146.6 197.7,146.2 Z"
          }
        },

        fill: { "0": { value: "#5D3A3E" } }
      },

      "haiku:a78fe40c34d5": {
        "translation.x": { "0": { value: 29 } },
        "translation.y": { "0": { value: 254 } }
      },

      "haiku:a705e2c5adf9": {
        d: {
          "0": {
            value: "M136.3,2.7 C137.4,3.7 138.4,4.7 139.1,6 C139.8,7.4 140.1,9 140.2,10.6 C141.7,28.1 134.2,45.2 125.3,60.4 C118.6,71.7 110.7,82.9 99.4,89.6 C81.5,100.1 58.4,97.4 39.6,88.6 C29.5,83.9 20,77.5 12.8,68.9 C5.6,60.3 0.9,49.5 0.7,38.4 C0.5,28.2 4,18.4 8.2,9.1 C9.1,7.1 10,5.1 11.6,3.7 C13.2,2.2 15.4,1.3 17.5,0.6"
          }
        },

        fill: { "0": { value: "#DC4F9C" } }
      },

      "haiku:d0e451336526": {
        d: {
          "0": {
            value: "M138.1,34.6 C140.1,28.3 141.2,21.6 141.1,15 C141.1,12.1 141.1,8.7 139.7,6 C139.1,4.9 138.2,3.9 137.3,3 C137.1,2.8 136.8,2.6 136.6,2.5 C136.5,2.5 136.1,2.9 136.2,3 C136.9,3.9 137.7,4.6 138.3,5.6 C139.1,6.9 139.4,8.4 139.5,9.9 C139.8,13 139.7,16.1 139.5,19.2 C139,25.7 137.4,32.1 135.1,38.2 C132.8,44.6 129.8,50.7 126.4,56.6 C123,62.6 119.4,68.4 115.2,73.8 C107.9,83.3 98.5,90.7 86.7,93.7 C74.5,96.9 61.4,95.5 49.5,91.6 C36.9,87.5 24.7,80.7 15.6,71 C7,61.9 1,49.7 1.1,37 C1.2,30.4 2.7,23.9 4.9,17.7 C6,14.7 7.2,11.7 8.5,8.7 C9.8,5.8 11.3,3.3 14.1,1.8 C14.3,1.7 17.4,0.3 17.4,0.3 C17.4,0.2 14.8,1.2 14.6,1.3 C13.2,1.9 11.8,2.8 10.7,3.9 C8.6,6.2 7.5,9.3 6.3,12.1 C3.7,18.1 1.5,24.3 0.6,30.7 C-1.3,43.4 2.5,56 10,66.2 C17.8,76.9 29.2,84.6 41.2,89.9 C52.1,94.6 63.8,97.3 75.7,96.8 C88.2,96.3 99.9,91.4 108.9,82.9 C113.7,78.4 117.7,73.2 121.3,67.7 C125,62 128.5,56.1 131.5,50 C134.2,45.3 136.4,40 138.1,34.6 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:8092f07eaf5f": {
        d: {
          "0": {
            value: "M84.8,333.7 C84.3,336.5 84.2,339.4 85.3,342 C87.6,347.4 94.5,349 100.3,348.9 C115.8,348.6 130.9,340.3 139.5,327.4 C141.7,324.1 143.6,320.4 144.2,316.4 C144.8,312.4 144.2,308.1 141.8,304.9 C138.2,299.9 131.4,298.4 125.2,298.5 C115.5,298.8 106,302.5 98.6,308.9 C91.4,315.2 86.4,324.1 84.8,333.7 Z"
          }
        },

        fill: { "0": { value: "#C4408E" } }
      },

      "haiku:fb41c15bf632": {
        d: {
          "0": {
            value: "M81.3,336.5 C82.9,334.7 83.2,332.1 83.2,329.6 C83.2,316.9 78,304 68,296.1 C58,288.3 43.2,286.5 32.4,293.1 C33.6,308.5 42.6,322.7 55.1,331.7 C60.9,335.9 67.8,339 74.9,338.8 C77.3,338.7 79.8,338.2 81.3,336.5 Z"
          }
        },

        fill: { "0": { value: "#C4408E" } }
      },

      "haiku:71b38d4113f6": {
        "translation.x": { "0": { value: 117 } },
        "translation.y": { "0": { value: 171 } }
      },

      "haiku:378f544c4b04": {
        d: {
          "0": {
            value: "M13.7,9.6 C8,8.9 2.4,10.9 3.4,16.1 C5.8,17 8.8,16 10.9,16 C8.6,16.1 5.9,16.5 3.6,17.5 C-0.3,19.2 2,25.2 6.1,23.8 C7.5,23.3 8.9,22.8 10.3,22.2 C7.9,23.1 5.4,24.1 3.5,25.8 C1.6,27.6 0.4,30.3 1.2,32.8 C2,35.3 5.4,36.8 7.4,35.2 C7,32.6 11.2,31.9 13.3,33.4 C15.5,34.9 17.4,37.4 20.1,37.1 C23.5,51.8 31.7,65.4 43,75.4 C50,81.6 60.7,86.4 68.4,81 C74,77.1 75.3,69.3 74.5,62.6 C72.2,44 55.6,28.3 36.9,27.1 C38.5,18.3 34.5,8.7 27,3.8 C23.8,1.7 20,0.4 16.2,1 C13.4,1.4 10.6,3.1 9.1,5.4 C8.3,6.7 8.8,8.4 10.2,9 C11.3,9.5 12.5,9.8 13.7,9.6 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:3868b9c30d60": {
        d: {
          "0": {
            value: "M2.7,21.6 C2.2,20.9 2.4,19.7 3,19.1 C3.7,18.1 5.4,17.8 6.5,17.5 C8,17.1 9.5,17 11,16.9 C11.2,16.7 11,15.6 11,15.3 C8.8,15.4 6.6,16.1 4.4,15.7 C4,15.4 4.1,14.8 4.2,14.3 C4.4,13.2 5.1,12.3 6,11.7 C7.7,10.5 9.9,10.2 12,10.1 C12.2,10.1 13.8,10.2 13.8,10 C13.9,9.2 13.3,9.4 12.6,9.3 C8.8,8.9 3.2,10 2.7,14.6 C2.7,15.1 2.5,16.4 2.8,16.8 C2.8,17.1 4.7,17.4 4.8,17.4 C6,17.5 7.3,17.4 8.5,17.3 C9.2,17.2 9.9,17.1 10.6,17.1 C11,17.2 11.1,17.1 11,16.7 C11,16.3 11,15.9 11,15.5 C7.3,15.7 -1.7,17 1.4,22.9 C3.5,26.9 7.8,24.5 10.8,23.3 C10.6,22.9 10.5,22.5 10.3,22.1 C10.3,22 10.2,21.7 10.1,21.7 C9.6,21.9 9.2,22.1 8.7,22.2 C6.7,23 4.8,23.9 3.2,25.3 C0.3,27.9 -1.4,33.1 2.3,35.9 C4.1,37.2 6.1,37.3 8,36.2 C8.3,35.9 8.3,35.9 8.3,35.4 C8.3,34.7 8.7,34.3 9.3,34.1 C13.3,32.7 15.7,38.1 19.5,38.3 C19.5,38.3 19.5,38.3 19.5,38.3 C22.6,50.6 28.7,62.1 37.4,71.4 C42,76.3 47.2,80.8 53.6,83.1 C59.6,85.3 66.6,85 71.1,80 C75.5,75.1 76.1,67.7 75,61.5 C74,56.2 72.1,51.6 69.4,46.9 C66.1,41.3 61,36.5 55.5,33.1 C50.4,30 44.8,27.8 38.9,27.2 C38.7,27.2 37.6,27.2 37.6,27 C37.5,26.9 37.7,26.4 37.7,26.4 C37.8,25.3 37.9,24.3 37.9,23.2 C37.9,20.5 37.3,17.7 36.3,15.2 C34.5,10.5 31.2,6.3 27,3.6 C22.8,1 17.4,-0.2 12.8,2.2 C11,3.2 8.2,5.3 8.7,7.7 C9,8.8 9.8,9.4 10.8,9.8 C11,9.9 13.9,10.5 13.9,10.1 C13.9,10.3 11.2,9.6 11,9.6 C9.8,9.1 8.7,8.1 9.2,6.6 C10,4.1 13.4,2.3 15.8,1.9 C20.7,0.9 25.8,3.3 29.3,6.5 C33.8,10.6 36.4,16.3 36.9,22.3 C37,23.9 36.9,25.4 36.7,27 C36.6,27.6 36.3,28.2 36.9,28.2 C39.5,28.5 42.1,28.8 44.7,29.6 C56.6,33.3 66.3,41.8 71.3,53.3 C73.7,58.7 74.9,65.2 73.9,71 C72.8,77.3 68.6,82.8 61.8,83.1 C54.9,83.5 48.2,79.4 43.3,74.9 C38.4,70.5 34.1,65.4 30.6,59.9 C27,54.3 24,48.1 22.3,41.7 C22.3,41.7 20.9,36.8 20.9,36.8 C20.6,36.6 19.5,36.8 19,36.7 C17.4,36.2 16.2,34.9 14.9,33.9 C13,32.4 9.8,31.5 7.7,33.3 C7.2,33.7 6.6,34.6 6.7,35.3 C6.8,35.9 4,35.2 3.8,35 C1.2,33.5 1.7,30.1 3.2,28 C5,25.6 8,24.4 10.8,23.4 C10.6,22.9 10.4,22.4 10.2,21.8 C9.6,22 9,22.3 8.4,22.5 C7.9,22.7 7.4,22.9 6.9,23.1 C5.1,23.3 3.4,23.3 2.7,21.6 C2.6,21.5 3.2,22.7 2.7,21.6 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:107b4fe9460e": {
        "translation.x": { "0": { value: 124 } },
        "translation.y": { "0": { value: 192 } }
      },

      "haiku:3a779f2bbe15": {
        d: {
          "0": {
            value: "M0.4,2.3 C1.4,1.9 2.3,1.6 3.3,1.1 C2.3,1.5 1.3,1.9 0.4,2.3 Z"
          }
        },

        fill: { "0": { value: "#DC4F9C" } }
      },

      "haiku:1dbef39cb970": {
        d: {
          "0": {
            value: "M0.8,1.3 C0.3,1.5 0.2,1.9 0.4,2.4 C0.7,3.1 1.2,3 1.8,2.7 C2.3,2.5 3.7,2.2 3.5,1.6 C3.3,1.2 3.2,0.8 3,0.4 C2.7,0.6 0.1,1.7 0.4,2.3 C0.7,2.9 3.2,2 3.6,1.8 C3.4,1.3 3.3,0.3 2.7,0.5 C2,0.8 1.4,1 0.8,1.3 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:52dce86bd07c": {
        "translation.x": { "0": { value: 142 } },
        "translation.y": { "0": { value: 197 } }
      },

      "haiku:f896ea096c19": {
        d: {
          "0": {
            value: "M49.4,36.6 C47.4,20 33.8,5.6 17.5,1.9 C19.3,12.4 11.3,22.9 3.3,27.7 C2.7,28 2.2,28.3 1.6,28.6 C5.7,36.4 11.3,43.5 17.9,49.3 C24.9,55.5 35.6,60.3 43.3,54.9 C48.9,51.1 50.3,43.4 49.4,36.6 Z"
          }
        },

        fill: { "0": { value: "#DC4F9C" } }
      },

      "haiku:e688ce6da50a": {
        d: {
          "0": {
            value: "M41.9,19.6 C45.6,24.4 47.3,30.2 48.9,36 C48.9,36.2 49,36.8 49.3,36.7 C49.7,36.7 49.8,36.7 49.8,36.3 C49.8,34.8 49.5,33.3 49.2,31.9 C48.6,29.1 47.6,26.3 46.3,23.8 C41.3,13.7 31.4,4.9 20.5,2 C19.3,1.7 18,1.3 16.8,1 C16.5,0.9 16.7,1.6 16.8,1.8 C16.9,2.6 17,3.4 17.1,4.1 C17.4,9.8 14.9,15.3 11.5,19.7 C9.5,22.3 7.1,24.6 4.4,26.4 C3.5,27 2.5,27.6 1.6,28.1 C1.4,28.2 1,28.3 0.8,28.5 C0.8,28.6 1.1,29.1 1.2,29.2 C3.7,33.8 6.6,38.2 10,42.2 C13.4,46.2 17.3,50.1 21.7,53.1 C26.2,56.1 31.8,58.5 37.3,57.9 C42.4,57.4 46.5,54 48.5,49.3 C49.4,47.1 49.9,44.6 50,42.2 C50,41.7 50,36.7 49.6,36.7 C49.7,36.7 49.5,42.3 49.4,42.9 C49,46 48.1,49.2 46.2,51.7 C42.1,57.3 35,57.8 28.9,55.5 C22.7,53.1 17.6,48.6 13.2,43.8 C10.9,41.3 8.8,38.6 6.9,35.8 C6,34.5 5.1,33.1 4.3,31.7 C4,31.1 3.7,30.6 3.3,30 C3.2,29.9 2.8,29.2 2.8,29.1 C2.8,28.9 4.9,27.8 5.2,27.6 C6.4,26.8 7.5,25.9 8.6,25 C10.7,23.1 12.6,21 14.1,18.7 C17.1,14.2 19.2,8.7 18.6,3.2 C18.6,3.3 19.7,3.5 19.9,3.5 C20.9,3.8 21.9,4.1 22.9,4.5 C25.4,5.5 27.8,6.7 30.1,8.2 C34.6,11.1 38.7,15 41.9,19.6 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:ae15ff3800f7": {
        "translation.x": { "0": { value: 48 } },
        "translation.y": { "0": { value: 192 } }
      },

      "haiku:4ffa5dfb583c": {
        d: {
          "0": {
            value: "M42.4,5.2 C41.2,2.3 37.5,1.5 34.4,1.6 C24.2,1.9 14.6,7.7 8.1,15.6 C5.4,18.9 3.1,22.6 2.1,26.7 C1.1,30.8 1.6,35.4 3.9,38.9 C6.3,42.4 10.8,44.6 14.9,43.6 C17.6,43 19.9,41.1 22.1,39.2 C31.4,31.2 40.8,21.6 42.6,9.4 C42.8,8 42.9,6.5 42.4,5.2 Z"
          }
        },

        fill: { "0": { value: "#DC4F9C" } }
      },

      "haiku:45a2b7957470": {
        d: {
          "0": {
            value: "M28.5,3.2 C31.4,2.4 34.7,2 37.7,2.6 C38.9,2.8 40.1,3.3 41.1,4.1 C41.5,4.4 41.7,4.9 42.1,5.2 C42.2,5.3 42.7,5.1 42.7,4.8 C42.2,2.1 38.6,1 36.4,0.8 C33.3,0.4 30,0.9 27.1,1.8 C20.8,3.5 15.1,7.2 10.4,11.8 C5.8,16.3 1.7,22.2 1,28.8 C0.3,34.9 3,41.5 9.1,43.7 C15.9,46.2 21.1,41.1 25.7,36.8 C30.6,32.3 35.3,27.3 38.6,21.5 C40.1,18.9 41.4,16 42.1,13.1 C42.5,11.7 42.8,10.2 42.9,8.7 C42.9,8.5 42.8,5 42.4,5.2 C42.5,5.2 42.6,7.6 42.6,7.7 C42.5,9.2 42.1,10.7 41.7,12.2 C40.8,15.2 39.6,18 38,20.7 C34.5,26.5 29.8,31.4 24.8,35.9 C20.4,39.8 15.3,45 8.9,42.1 C3.1,39.4 1.5,32.5 2.9,26.7 C4.4,20.7 8.6,15.5 13.2,11.4 C17.6,7.6 22.8,4.6 28.5,3.2 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:7eff9eabf786": {
        d: {
          "0": {
            value: "M56.8,232.2 C58.6,234.2 61.9,233.5 64.4,232.4 C71.8,228.9 77.8,222.6 80.8,215 C78.1,212.1 75.4,209.2 72.7,206.3 C65.5,210.7 59.8,217.5 56.7,225.4 C55.8,227.5 55.2,230.4 56.8,232.2 Z"
          }
        },

        fill: { "0": { value: "#C4408E" } }
      },

      "haiku:cbff980576d6": {
        "translation.x": { "0": { value: 69 } },
        "translation.y": { "0": { value: 187 } }
      },

      "haiku:60210fc90af0": {
        d: {
          "0": {
            value: "M30.1,24.7 C28.6,23.6 27.2,22.6 26.5,22.5 C27.3,25.3 30.1,29.3 28.4,31.6 C27.6,32.8 26.4,33.9 25,34.1 C23.6,34.4 21.9,33.6 21.5,32.2 C22.4,35.7 21.2,38.3 17.3,38.1 C14.3,38 11.6,36.2 10.1,33.6 C8.4,30.6 5.8,26.7 5.8,23.6 C4.4,24.3 2.9,22.7 2.3,21.2 C-0.3,14.4 3,5.9 9.5,2.7 C13.8,0.6 19,0.6 23.4,2.3 C27.9,3.9 31.8,7 35,10.5 C35.8,11.3 36.5,12.3 36.8,13.4 C37.1,14.5 36.8,15.8 35.8,16.4 C34.3,17 32.6,16.9 31.3,16 C32.7,16.8 34,18.8 34.8,21.2 C35.8,24.1 32.5,26.5 30.1,24.7 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:213efbf25a70": {
        d: {
          "0": {
            value: "M27.6,33.8 C29.3,32.4 30.1,30.5 29.5,28.3 C29.4,27.9 27.8,23.9 27.7,23.9 C28,23.7 29.1,24.6 29.4,24.7 C29.6,24.8 29.8,25 30,24.8 C30.1,24.6 30.4,24.5 30.2,24.3 C29.2,23.1 27.1,21.6 25.5,21.5 C26.1,23.7 27.1,25.8 27.8,28 C28.1,29 28.3,30.1 27.8,31 C27.4,31.8 26.5,32.6 25.7,33 C24.5,33.6 23.1,33.3 22.4,32.2 C22.2,31.8 21.4,32.3 21.1,32.4 C20.6,32.6 20.7,32.6 20.8,33 C20.9,33.6 21,34.2 20.9,34.9 C20.7,37.4 17.9,37.6 16,37.1 C13.8,36.6 12,35.1 10.8,33.2 C9.5,31 8.1,28.9 7.2,26.5 C6.7,25.1 6.6,23.9 6.6,22.5 C5.7,22.8 5.1,23.3 4.2,22.6 C3.3,21.8 2.9,20.7 2.7,19.6 C1.9,16.5 2.3,13.1 3.6,10.2 C6.4,3.9 12.9,1 19.6,2 C25.8,2.9 31.6,6.9 35.4,11.7 C36.2,12.7 36.9,14.2 36.2,15.4 C35.5,16.5 33.6,16.4 32.5,16 C32.2,15.9 31.8,15.7 31.6,15.5 C31.3,15.9 31,16.1 31.5,16.4 C32.1,16.8 32.5,17.3 32.9,17.8 C33.8,19 34.9,20.8 34.8,22.3 C34.8,23.4 33.9,24.4 32.8,24.8 C32.3,25 31.8,25 31.2,24.9 C31.1,24.9 30.1,24.5 30.1,24.5 C30,24.6 30.8,25 30.9,25 C31.4,25.2 32,25.3 32.6,25.2 C33.9,24.9 35,23.8 35.2,22.5 C35.4,21.1 34.7,19.7 34.1,18.6 C33.5,17.4 32.6,16.2 31.4,15.4 C31.3,15.5 31,16 31,16.1 C31.6,16.5 32.3,16.8 33.1,16.9 C34.4,17.1 36.1,16.9 36.9,15.7 C38.7,12.9 35.6,10 33.8,8.2 C29.2,3.6 23.2,0.1 16.5,0.1 C9.8,0.1 3.9,4.1 1.6,10.5 C0.5,13.6 0.3,17 1.2,20.1 C1.6,21.6 2.9,24.6 5,24.3 C5.1,24.3 5.4,26 5.4,26.1 C5.8,27.4 6.4,28.7 7.1,29.9 C8.3,32.2 9.6,34.8 11.6,36.5 C14.8,39.2 22.3,40.2 22.6,34.3 C24.3,35.5 26.2,35 27.6,33.8 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:3a8cc29a0dd9": { "translation.y": { "0": { value: 226 } } },
      "haiku:28b7b0fdc909": {
        d: {
          "0": {
            value: "M42.9,3.8 C50.2,7.1 56.1,12.9 61.2,19.1 C72.6,32.8 81.5,49.5 81.7,67.3 C81.7,68.4 81.7,69.6 81.1,70.6 C80.5,71.7 79.4,72.3 78.2,72.8 C73.3,74.9 67.8,74.9 62.5,74.4 C51.7,73.2 41.2,69.9 30.8,66.5 C26.3,65.1 21.9,63.6 17.8,61.2 C9.7,56.4 4,48.1 1.6,39 C-0.2,32.2 -0.1,24.8 2.6,18.3 C5.6,11 12,5.2 19.5,2.6 C27,1.13242749e-13 35.6,0.6 42.9,3.8 Z"
          }
        },

        fill: { "0": { value: "#DC4F9C" } }
      },

      "haiku:ac2a3b3b92fb": {
        d: {
          "0": {
            value: "M65.2,22.9 C61.3,17.8 57,12.8 51.9,8.8 C49.7,7.1 47.3,5.5 44.7,4.3 C44.3,4.1 43,3.3 42.8,3.9 C42.6,4.4 43,4.4 43.4,4.7 C53.9,10.8 62,20.5 68.5,30.6 C72.2,36.3 75.3,42.4 77.5,48.9 C78.6,52.2 79.5,55.5 80,58.9 C80.3,60.6 80.5,62.3 80.6,64 C80.7,65.7 81,67.7 80.6,69.4 C79.9,72.4 75,73.3 72.5,73.7 C69,74.2 65.5,74 62,73.6 C54.9,72.8 48.1,71.1 41.3,69.1 C34.9,67.2 28.2,65.4 22.1,62.7 C16.3,60.2 11.5,56.1 7.9,51 C0.6,40.5 -1.7,25.3 5.6,14.3 C9.8,8 16.4,3.5 23.8,2.1 C27.4,1.4 31.1,1.3 34.7,1.9 C35.5,2 42.9,3.9 42.9,4.1 C43.1,3.7 37.1,1.9 36.4,1.8 C33.5,1.1 30.6,0.9 27.7,1 C21.2,1.3 15,3.7 10,8 C5.3,12 2,17.5 0.7,23.5 C-0.7,30 0.1,36.9 2.4,43.2 C4.5,49.1 8.1,54.5 12.8,58.6 C18,63.2 24.4,65.5 30.9,67.6 C37.5,69.8 44.2,71.9 51,73.5 C57.7,75.1 65,76.4 71.9,75.7 C74.5,75.4 77.1,74.8 79.4,73.6 C81.8,72.4 82.7,70.4 82.6,67.7 C82.5,62.3 81.7,57 80.2,51.9 C77.2,41.1 71.8,31.5 65.2,22.9 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:1809c39de49d": {
        d: {
          "0": {
            value: "M40.3,230.7 C47.5,233 53.1,238.9 57.5,245.1 C61.9,251.3 65.5,258.1 70.7,263.7 C69.8,264.7 68.9,265.7 68.1,266.7 C56.1,247.7 33.9,235.7 11.5,236 C20.3,231.4 30.7,227.6 40.3,230.7 Z"
          }
        },

        fill: { "0": { value: "#E372AC" } }
      },

      "haiku:7e61a2273f73": {
        d: {
          "0": {
            value: "M6.3,269.2 C8.4,277.3 15.8,282.8 23.2,286.6 C36,293.1 50.4,296.5 64.8,296.2 C64.6,290.2 63.9,284.3 62.8,278.4 C56.2,283.4 47.3,283.6 39,283.1 C32.9,282.7 26.6,282.1 20.8,280 C15,278 9.6,274.4 6.3,269.2 Z"
          }
        },

        fill: { "0": { value: "#C4408E" } }
      },

      "haiku:b7ade9cf6675": {
        "translation.x": { "0": { value: 50 } },
        "translation.y": { "0": { value: 242 } }
      },

      "haiku:f2d1a7d52569": {
        d: {
          "0": {
            value: "M38.4,0.7 C42.8,0.7 46.9,3.6 49.3,7.3 C51.6,11.1 52.5,15.6 52.6,20.1 C53.1,36.2 44.8,52.3 31.5,61.2 C28.5,63.2 25.2,64.9 21.7,65.1 C17.5,65.4 13.5,63.6 9.6,61.9 C7.3,60.9 4.9,59.7 3.4,57.6 C2.4,56.1 2,54.2 1.7,52.4 C0.5,42.9 3.1,33.1 8.1,24.9 C13.1,16.7 20.2,10 28.2,4.7 C31.3,2.7 34.7,0.7 38.4,0.7 Z"
          }
        },

        fill: { "0": { value: "#DC4F9C" } }
      },

      "haiku:2731b55a84a4": {
        d: {
          "0": {
            value: "M53,15.1 C52,9.2 48.8,3.2 42.9,1 C41.7,0.6 40.4,0.3 39.1,0.3 C38.9,0.3 38.4,0.3 38.4,0.5 C38.4,1 38.4,1 38.9,1.1 C41.7,1.6 44.3,2.8 46.3,4.9 C50.8,9.4 51.9,16.3 51.7,22.4 C51.6,28.5 50.1,34.3 47.9,39.9 C44.5,48.4 38.1,55.9 30.4,60.9 C27.8,62.6 24.7,64.1 21.5,64.3 C18,64.5 14.6,63.3 11.5,61.9 C8.8,60.7 5.5,59.6 3.8,57 C2.1,54.4 2,50.7 2,47.7 C1.9,36.3 7,25.5 14.4,17 C17.9,13 21.9,9.5 26.2,6.4 C28.4,4.8 30.6,3.2 33.1,2.1 C33.5,1.9 38.3,0.4 38.4,0.7 C38.4,0.4 35.4,0.9 35.2,1 C33.7,1.4 32.3,2 30.9,2.7 C28.3,4.1 25.8,5.9 23.4,7.7 C18.5,11.4 13.9,15.8 10.2,20.8 C6.3,26 3.4,31.9 1.9,38.2 C1.1,41.5 0.7,44.9 0.7,48.3 C0.7,51.4 0.9,55.2 2.6,57.9 C4.3,60.6 7.4,61.8 10.2,63.1 C13.3,64.5 16.5,65.8 19.9,66 C26.6,66.4 32.9,61.9 37.6,57.5 C43.7,51.8 48.4,44.6 50.9,36.7 C53.2,29.7 54.1,22.2 53,15.1 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:ce53b744c46c": {
        d: {
          "0": {
            value: "M71,310 C74.8,311.9 79.3,311 83,309 C90.3,305.1 95,297.5 97.3,289.6 C99.6,281.7 99.7,273.3 99.8,265 C99.8,260.9 99.8,256.4 97.1,253.3 C94.2,249.9 88.9,249.3 84.7,250.8 C80.5,252.4 77.2,255.7 74.3,259.2 C69.5,265.1 65.7,271.9 63.7,279.2 C61.7,286.5 61.8,294.5 64.4,301.6 C65.8,305.1 67.8,308.4 71,310 Z"
          }
        },

        fill: { "0": { value: "#954F9F" } }
      },

      "haiku:76847a99ddb4": {
        "translation.x": { "0": { value: 77 } },
        "translation.y": { "0": { value: 243 } }
      },

      "haiku:81d645230e4e": {
        d: {
          "0": {
            value: "M89.2,31.2 C90.3,26.9 88.4,22.3 85.9,18.6 C78.2,7.2 64.1,0.5 50.5,1.7 C46.9,2 43.4,2.9 40.3,4.6 C37.5,6.2 35.1,8.6 32.9,11 C17.2,28.4 7.7,50.8 2.9,73.7 C1.9,78.5 1.1,83.5 1.9,88.3 C2.7,93.2 5.4,97.9 9.8,100.1 C13.8,102.1 18.7,101.8 22.8,100.1 C27,98.5 30.5,95.7 34,92.8 C40.4,87.5 46.7,81.9 51.4,75 C50,77.3 51,80.6 53.1,82.2 C55.3,83.8 58.3,84 60.9,83.3 C63.5,82.5 65.8,80.9 67.8,79.1 C75.7,72.2 81.3,63.1 85.7,53.6 C89.9,44.6 93.3,34.6 91.7,24.7"
          }
        },

        fill: { "0": { value: "#DC4F9C" } }
      },

      "haiku:568cfd9b822b": {
        d: {
          "0": {
            value: "M66.8,4.8 C71.8,6.6 76.4,9.5 80.2,13.1 C84.3,17 88.6,22.3 89,28.1 C89.1,29.1 88.9,30.1 88.9,31.1 C88.9,31.2 89.4,31.4 89.5,31.3 C89.6,31.3 89.9,29.9 89.9,29.8 C90.3,27 89.6,24.1 88.4,21.6 C85.8,15.9 81.2,11.2 76.1,7.7 C67.8,2 57,-0.6 47,1.4 C43.7,2 40.6,3.3 37.9,5.2 C35.2,7.2 33,9.7 30.8,12.2 C26.2,17.5 22.1,23.3 18.6,29.4 C11.5,41.7 6.4,55 3.2,68.8 C1.7,75.5 -0.2,82.7 1.4,89.6 C2.7,95.5 6.7,100.8 12.8,102.1 C21.3,103.8 28.8,98.2 35,93.1 C40.5,88.5 46.3,83.7 50.3,77.7 C49.9,78.4 50.3,79.5 50.6,80.1 C51.2,81.6 52.3,82.8 53.8,83.5 C56.7,85 60.2,84.6 63,83.2 C66,81.8 68.5,79.4 70.8,77.1 C73.3,74.6 75.5,71.9 77.5,69 C81.4,63.4 84.6,57.3 87.3,51 C89.8,45.1 91.8,38.9 92.2,32.5 C92.2,31.9 92.1,24.7 91.7,24.8 C91.8,24.8 91.9,31.6 91.9,32.1 C91.7,35.2 91.1,38.2 90.2,41.2 C88.4,47.5 85.5,53.6 82.4,59.4 C79.1,65.4 75.2,71.1 70.4,76 C66.5,79.9 59.9,85.8 54,82.2 C52.5,81.3 51.3,79.5 51.4,77.7 C51.4,77.3 51.6,76.9 51.6,76.4 C51.6,76 51.9,76.3 51.5,75.8 C51.3,75.6 51.2,75.3 51.4,75.1 C51.3,75.1 51.1,75.2 51,75.2 C50.5,75.3 50.5,75.4 50.1,75.9 C49.3,77 48.5,78 47.7,79 C45.5,81.7 43,84.2 40.5,86.5 C37.9,88.9 35.2,91.1 32.5,93.3 C29.9,95.4 27.2,97.3 24.3,98.8 C18.9,101.4 11.9,101.9 7.3,97.4 C2.6,92.8 2,85.8 2.7,79.6 C3.6,72.6 5.5,65.6 7.6,58.8 C9.7,52.1 12.2,45.5 15.3,39.1 C18.3,32.7 21.9,26.6 26.1,20.9 C28.1,18.1 30.2,15.5 32.4,12.9 C34.4,10.5 36.6,8.2 39.2,6.3 C46.8,0.9 58.4,1.5 66.8,4.8 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:780472a2b511": {
        d: {
          "0": {
            value: "M90.6,290.9 C89.6,293.2 88.7,295.7 89.4,298 C90.6,301.9 95.8,304.3 95.3,308.3 C98.6,288.6 105.8,269.5 116.2,252.5 C105.4,263.6 96.6,276.7 90.6,290.9 Z"
          }
        },

        fill: { "0": { value: "#E372AC" } }
      },

      "haiku:05b475ec122d": {
        d: {
          "0": {
            value: "M116.9,318.1 C110.9,323.1 104.3,327.4 97.4,331 C95.3,332.1 93.2,333.2 91.7,335.1 C90.3,337 89.8,339.8 91.4,341.6 C92.6,343 94.7,343.3 96.5,342.8 C98.3,342.3 99.8,341.2 101.3,340.1 C119,326.6 133.9,308.9 142.1,288.1 C135.6,299.6 127,309.8 116.9,318.1 Z"
          }
        },

        fill: { "0": { value: "#C4408E" } }
      },

      "haiku:98385ffb5cae": {
        "translation.x": { "0": { value: 50 } },
        "translation.y": { "0": { value: 286 } }
      },

      "haiku:c66eb05f6490": {
        d: {
          "0": {
            value: "M50.5,46.9 C51.9,36.2 50.4,24.7 44.5,15.7 C38.6,6.6 27.7,0.4 17,1.9 C13.2,2.4 9.6,3.8 6,5.3 C4.5,5.9 2.8,6.6 2,8.1 C1.5,9 1.4,10.1 1.3,11.1 C1.1,14.3 1.1,17.6 2.2,20.6 C4.7,27.8 12.4,32.2 14.7,39.5 C15.3,41.4 15.5,43.5 15.9,45.5 C17.2,52.3 21.3,58.8 27.6,61.8 C33.9,64.8 42.3,63.6 46.5,58.1 C49,54.8 50,50.8 50.5,46.9 Z"
          }
        },

        fill: { "0": { value: "#DC4F9C" } }
      },

      "haiku:fe71aa1ea0f2": {
        d: {
          "0": {
            value: "M48.3,26 C50,31.9 50.4,38 50.2,44.1 C50.2,44.9 50.1,45.8 50.1,46.6 C50.1,46.9 50.7,47.1 50.8,46.8 C51.5,44.8 51.5,42.3 51.6,40.2 C52,27.9 47.8,15.1 37.9,7.3 C32.9,3.4 26.6,0.8 20.3,0.8 C14.8,0.9 9.3,2.7 4.4,5 C3.2,5.6 2,6.4 1.3,7.6 C0.5,9.1 0.6,10.9 0.5,12.5 C0.4,15.8 0.7,19.2 2.1,22.3 C4.9,28.4 11.1,32.2 13.7,38.5 C14.6,41 14.9,43.6 15.5,46.2 C16.1,48.9 17.1,51.5 18.6,53.9 C21.3,58.4 25.5,62.1 30.7,63.4 C35.7,64.6 41.5,63.5 45.4,60 C47.3,58.2 48.6,56 49.4,53.5 C49.6,53 51,47.1 50.6,47 C50.7,47 49,53.2 48.8,53.7 C47.7,56.5 46,58.9 43.5,60.6 C38.2,64.1 30.9,63.6 25.7,60 C20.4,56.4 17.5,50.3 16.5,44.1 C15.9,40.7 15.2,37.6 13.3,34.7 C11.4,31.9 9,29.4 6.9,26.8 C4.8,24.2 3.1,21.4 2.5,18.1 C2.2,16.5 2.2,14.8 2.2,13.2 C2.2,11.7 2.1,9.9 2.9,8.5 C3.6,7.3 5,6.7 6.3,6.2 C7.9,5.5 9.6,4.9 11.3,4.3 C13.8,3.4 16.6,2.6 19.3,2.6 C31.9,2.5 42.4,10.8 47.1,22.2 C47.4,23.3 47.9,24.6 48.3,26 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:89acf1e9a31e": {
        d: {
          "0": {
            value: "M115.8,72.3 C118.6,61.1 126.2,51.1 136.2,45.4 C138.3,59.5 143,73.3 150,85.7 C150.2,74.5 153,63.4 158.2,53.5 C167.6,66.2 172.3,82.2 171.3,97.9 C173.1,88.9 174.9,79.9 176.7,71 C182.9,85.2 183.2,101.8 177.4,116.2 C181.4,107.4 185.4,98.7 189.4,89.9 C191.1,97 188.3,104.4 184.5,110.7 C180.7,116.9 176,122.6 173.1,129.4 C170.3,136.1 169.8,144.5 174.4,150.2 C187,144.2 181.8,127.6 209.4,136.4 C208.2,121.6 211.2,105.7 206.7,91.6 C202.3,77.4 194.4,63.9 182.3,55.3 C172.2,48.2 159.9,44.9 147.8,42.3 C137.4,40 126.7,38 116.1,38.8 C98.1,40.2 81.5,49.9 68.8,62.6 C78.9,55.2 90.7,50 103.1,47.5 C92.6,51.3 85.3,62.5 86,73.7 C95.1,61.4 108.3,52.1 122.9,47.7 C116.5,54 113.7,63.6 115.8,72.3 Z"
          }
        },

        fill: { "0": { value: "#B28337" } }
      },

      "haiku:8164c477b864": {
        d: {
          "0": {
            value: "M149.4,230.9 C153.8,237.2 158.6,243.4 165.2,247.4 C171.8,251.4 180.3,252.9 187.2,249.4 C180.6,249.5 174.4,245.6 170.4,240.4 C166.3,235.2 164,228.9 162.1,222.6 C158.4,226.1 154.1,228.9 149.4,230.9 Z"
          }
        },

        fill: { "0": { value: "#C4408E" } }
      },

      "haiku:acf80bfe565c": {
        d: {
          "0": {
            value: "M92.3,332.9 C92.4,322.8 89,312.9 83.5,304.5 C81.1,300.8 78.2,297.3 74.5,294.8 C70.8,292.3 66.2,290.9 61.9,291.7 C58.9,292.2 56,293.9 54.7,296.6 C53.4,299.5 54.1,303 55.7,305.8 C57.3,308.6 59.6,310.8 61.6,313.3 C65,317.5 67.6,322.5 69.1,327.7 C70.3,332 70.8,336.5 72.8,340.4 C74.8,344.4 78.8,347.8 83.2,347.3 C86.3,347 89,344.7 90.5,341.9 C91.8,339.3 92.3,336 92.3,332.9 Z"
          }
        },

        fill: { "0": { value: "#954F9F" } }
      },

      "haiku:3b86d546bb4a": {
        d: {
          "0": {
            value: "M190.3,233.6 C186.3,220.8 176.1,210 163.5,205.2 C163,206.1 162.6,206.9 162.1,207.8 C174.5,211.8 183.6,222.5 190.3,233.6 Z"
          }
        },

        fill: { "0": { value: "#E372AC" } }
      },

      "haiku:372f5201d98a": {
        d: {
          "0": {
            value: "M51.7,227.2 C52,222 54.5,217.1 57.8,213 C61.1,208.9 65.2,205.6 69.3,202.3 C69.2,201.9 69.1,201.4 69,201 C64.2,203.9 59.6,207.2 56.1,211.6 C52.7,215.9 50.7,221.7 51.7,227.2 Z"
          }
        },

        fill: { "0": { value: "#E372AC" } }
      },

      "haiku:eaceda6a32c4": {
        "translation.x": { "0": { value: 71 } },
        "translation.y": { "0": { value: 120 } }
      },

      "haiku:05456f9f47c9": {
        d: {
          "0": {
            value: "M32.4,2.8 C29.4,2.4 26.8,0.2 23.8,0.2 C21.3,0.2 19.1,1.8 17.2,3.5 C10.9,8.7 5.3,15 2.5,22.7 C-0.3,30.4 0.1,39.5 5.1,46 C10.2,52.5 18.9,55.2 27.2,54.9 C35.4,54.6 43.3,51.7 51.1,48.9 C49.7,35.9 48.3,22.9 46.9,9.9 C46.6,7.6 46.3,5 44.5,3.5 C42.9,2.2 40.7,2.1 38.7,2.3 C36.4,2.6 34.4,3.1 32.4,2.8 Z"
          }
        },

        fill: { "0": { value: "#E2A286" } }
      },

      "haiku:3728d51f8123": {
        d: {
          "0": {
            value: "M2.7,29.8 C4.4,17.1 12.7,7.1 23.8,4.7 C28.1,3.8 26.5,6.6 30.5,10.1 C32.5,11.8 40.7,11.7 41.8,14.1 C46.7,24.3 46.6,35.5 46.3,46 C46.3,46.5 46.3,47.1 46,47.5 C45.7,47.9 45.2,48 44.8,48.1 C31.7,50.4 16.6,45.4 4.7,34.8 C4,34.2 3.3,33.5 2.9,32.6 C2.5,31.7 2.6,30.7 2.7,29.8 Z"
          }
        },

        fill: { "0": { value: "#B3362A" } }
      },

      "haiku:50e81f7ae3c0": {
        d: {
          "0": {
            value: "M33.8,16.3 C27.7,18.9 23.2,25 22.5,31.7 C22.4,33 22.4,34.4 22.8,35.6 C23.6,38 25.7,39.7 28,40.5 C30.3,41.4 32.8,41.6 35.3,41.7 C38.2,41.9 41.5,41.9 43.2,39.6 C44,38.6 44.2,37.3 44.5,36.1 C45.2,32.1 45.6,27.8 43.7,24.2 C43.4,23.6 43,23 42.4,22.6 C41.8,22.3 40.9,22.3 40.5,22.8 C39.6,23.8 40.7,25.4 40.1,26.6 C39.6,27.7 37.7,27.7 36.9,26.6 C36.2,25.6 36.4,24.1 37,23 C37.5,22.1 38.3,21.4 38.5,20.4 C38.7,19.2 38,18 37.1,17.4 C36.2,16.7 35,16.5 33.8,16.3 Z"
          }
        },

        fill: { "0": { value: "#5D3A3E" } }
      },

      "haiku:41ad371547df": {
        d: {
          "0": {
            value: "M21.9,11.2 C24.8,11.3 27.7,11.8 30.4,12.8 C32.6,13.7 34.8,14.8 37.2,15.2 C38.7,15.4 40.4,15.2 41.7,14.4 C41,13.1 38.5,9.2 37.6,7.9 C36.2,5.9 25.5,3.4 21.9,4.9 C19.7,5.8 17.8,7 16,8.5 C16.1,8.9 16.2,9.2 16.5,9.6 C17.6,11.2 19.9,11.2 21.9,11.2 Z"
          }
        },

        fill: { "0": { value: "#E9E9F5" } }
      },

      "haiku:f4e166c715b1": {
        d: {
          "0": { value: "M101.9,104.4 C101.8,104.3 101.8,104.1 101.7,104" }
        },

        fill: { "0": { value: "#E9E9F5" } }
      },

      "haiku:d7e199a1e559": {
        "translation.x": { "0": { value: 91 } },
        "translation.y": { "0": { value: 104 } }
      },

      "haiku:28f54fdb48a8": {
        d: {
          "0": {
            value: "M11.1,17.3 C15.2,18.2 19.5,18.2 23.7,17.5 C26.5,17 29.6,15.8 30.5,13.2 C31.1,11.6 30.7,9.7 29.9,8.2 C29.1,6.7 27.8,5.4 26.6,4.2 C24.4,1.9 21.5,-0.5 18.5,0.3 C17.6,0.6 16.8,1.1 15.9,1.5 C13.8,2.4 11.4,2.2 9.1,2.2 C6.8,2.2 4.3,2.5 2.6,4.1 C0.3,6.3 0.6,10.5 2.6,13 C4.7,15.5 8,16.7 11.1,17.3 Z"
          }
        },

        fill: { "0": { value: "#E2A286" } }
      },

      "haiku:3f92f664b7d1": {
        d: {
          "0": {
            value: "M8.7,12.8 C7.5,13.1 6.1,13.4 4.9,12.8 C3.7,12.3 3,10.7 3.7,9.6 C4.4,8.6 6,8.7 7,9.5 C7.9,10.4 8.3,11.6 8.7,12.8 Z"
          }
        },

        fill: { "0": { value: "#C97557" } }
      },

      "haiku:5b05ecfc5cfa": {
        d: {
          "0": {
            value: "M18.6,11.9 C19.2,11.1 20.1,10.4 21.1,10.5 C22.1,10.6 22.7,11.5 23,12.5 C23.3,13.4 23.3,14.4 23.6,15.3 C21.5,16 19.3,16.3 17.1,16 C17.1,14.6 17.7,13.1 18.6,11.9 Z"
          }
        },

        fill: { "0": { value: "#C97557" } }
      },

      "haiku:1690056751a1": {
        d: {
          "0": {
            value: "M17.9,4.9 C15.1,2.7 11,2.2 7.8,3.8 C6.8,4.3 5.7,5.2 5.9,6.4 C6,7.3 6.9,8 7.7,8.4 C10.3,9.7 13.3,10.2 16.2,9.7 C16.9,9.6 17.7,9.3 18.3,8.9 C18.9,8.5 19.4,7.7 19.3,7 C19.2,6.1 18.5,5.4 17.9,4.9 Z"
          }
        },

        fill: { "0": { value: "#E9C5B6" } }
      },

      "haiku:513a978c54a9": {
        viewBox: { "0": { value: "0 0 244 331" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 244 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 331 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function($user) {
                return $user.mouse.x - 144;
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
                return $user.mouse.y - 288;
              },
              "$user"
            ),

            edited: true
          }
        },

        "style.zIndex": { "0": { value: 32 } },
        "scale.x": { "0": { value: 0.3, edited: true } },
        "scale.y": { "0": { value: 0.3, edited: true } },
        opacity: {
          "0": {
            value: Haiku.inject(
              function(currentBaby) {
                return currentBaby === "baby2" ? 1 : 0;
              },
              "currentBaby"
            ),

            edited: true
          }
        }
      },

      "haiku:1c10355dd9ec": {
        x1: { "0": { value: "-0.34709223%" } },
        y1: { "0": { value: "49.8660754%" } },
        x2: { "0": { value: "100.035904%" } },
        y2: { "0": { value: "49.8660754%" } }
      },

      "haiku:13e091a9aea1": {
        "stop-color": { "0": { value: "#FDCEA5" } },
        offset: { "0": { value: "0%" } }
      },

      "haiku:00aabf016cb1": {
        "stop-color": { "0": { value: "#F8ACAC" } },
        offset: { "0": { value: "100%" } }
      },

      "haiku:776a760b9697": {
        x1: { "0": { value: "0.0402343506%" } },
        y1: { "0": { value: "50.087879%" } },
        x2: { "0": { value: "99.9907132%" } },
        y2: { "0": { value: "50.087879%" } }
      },

      "haiku:6210a619fdc8": {
        "stop-color": { "0": { value: "#FDCEA5" } },
        offset: { "0": { value: "0%" } }
      },

      "haiku:0d7adb177666": {
        "stop-color": { "0": { value: "#F8ACAC" } },
        offset: { "0": { value: "100%" } }
      },

      "haiku:fc68f7b2cf33": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:6d1b64cc9dc4": { "fill-rule": { "0": { value: "nonzero" } } },
      "haiku:4e49736e1e39": {
        "translation.x": { "0": { value: 130 } },
        "translation.y": { "0": { value: 214 } }
      },

      "haiku:a0d49104c865": {
        d: {
          "0": {
            value: "M58.8,2.5 C67.9,5.1 77.1,11.5 78.5,20.9 C79.7,29.1 74.6,37 68.4,42.5 C57.3,52.5 41.5,57.7 27,54 C12.6,50.3 0.6,36.8 0.8,21.8 C0.9,17.4 2,12.8 4.8,9.4 C9,4.4 15.9,2.8 22.4,1.8 C34.5,9.15933995e-16 47,-0.9 58.8,2.5 Z"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:77ca2bc8b674": {
        d: {
          "0": {
            value: "M78.5,17.9 C76.8,12.2 71.9,7.8 66.8,5.1 C64.5,3.9 61.7,2.6 59.1,2.2 C58.7,2.1 58.5,2.7 58.9,2.9 C59.6,3.3 60.4,3.5 61.1,3.8 C66.6,6.1 72.1,9.5 75.3,14.8 C78.8,20.6 78.2,27.3 75,33.1 C71.7,39 66.4,43.8 60.7,47.3 C55,50.8 48.6,53.3 42,54.1 C35.1,55 28.1,54.2 21.7,51.4 C16.1,48.9 10.7,44.7 7.3,39.5 C4.2,34.7 1.8,29.5 1.6,23.7 C1.4,17.6 2.8,11.4 7.9,7.6 C13.3,3.6 20.5,2.8 27,1.9 C33.3,1 39.8,0.5 46.2,0.8 C48.6,0.9 51.1,1.2 53.5,1.6 C54,1.7 59,2.7 59,2.6 C59.1,2.3 53.2,1.1 52.5,1 C49.6,0.5 46.6,0.2 43.6,0.1 C37.2,-0.1 30.9,0.5 24.6,1.3 C18.2,2.2 11,3.2 6,7.8 C1.3,12.1 0.2,18.3 0.4,24.4 C0.8,36.5 10.1,47.7 20.7,52.6 C33.2,58.5 48.1,56.5 59.9,49.8 C70.3,43.6 83,31.4 78.5,17.9 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:c68870808903": {
        "translation.x": { "0": { value: 176 } },
        "translation.y": { "0": { value: 217 } }
      },

      "haiku:2c8fab26867c": {
        d: {
          "0": {
            value: "M12.4,1.3 C16.7,0.7 21.6,2.7 25.2,5.5 C38.7,15.6 43.6,35.5 36.4,50.7 C33.6,56.5 28.3,62 21.9,61.4 C16.4,60.9 12.3,56.1 9.5,51.4 C2.6,39.8 -0.8,25.7 2.4,12.6"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:21df713d4930": {
        d: {
          "0": {
            value: "M28.2,6.9 C25.7,4.9 23.3,3 20.3,1.9 C18,1 15.1,0.3 12.7,1 C12.4,1.1 12.3,1.7 12.6,1.7 C13.6,1.9 14.6,1.8 15.6,2 C18.7,2.5 21.6,3.9 24.1,5.7 C34.2,12.8 39.7,25.7 38.9,37.9 C38.5,44.1 36.6,50.6 32.6,55.4 C30.7,57.7 28.2,59.7 25.3,60.5 C22.1,61.3 18.9,60.4 16.3,58.5 C11.1,54.6 7.9,48 5.6,42.1 C3.2,36.2 1.8,29.9 1.6,23.6 C1.5,21 1.7,18.4 2,15.8 C2,15.6 2.5,12.7 2.4,12.7 C2.1,12.6 1.2,18.3 1.1,18.8 C0.7,21.7 0.8,24.7 1,27.7 C1.6,34.3 3.5,40.8 6.3,46.8 C9,52.4 12.6,59.1 18.7,61.5 C25.2,64 31.3,59.9 35,54.7 C40.1,47.4 41.4,37.5 39.9,28.9 C38.6,20.5 34.5,12.5 28.2,6.9 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:232112441234": {
        d: {
          "0": {
            value: "M179.5,239 C185.7,248.1 196.6,253.7 207.6,253.6 C201.3,259.1 198,268 199.2,276.3 C192.7,273 187.9,266.9 185,260.2 C182,253.5 180.6,246.3 179.5,239 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:d30035687e7a": {
        "translation.x": { "0": { value: 209 } },
        "translation.y": { "0": { value: 142 } }
      },

      "haiku:f99138ede6f0": {
        d: {
          "0": {
            value: "M12.4,32.9 C13.8,34.2 15.2,35.4 16.9,36.1 C17.3,36.2 17.7,36.3 18,36.4 C19.8,36.7 20.8,34.8 19.6,33.3 C18.6,31.9 17.9,30.3 17.9,28.7 C21.3,30.8 25.1,32.2 29,32.8 C30.2,33 31.7,32.8 31.7,31.7 C31.7,31 31.1,30.5 30.5,30.1 C27.6,27.8 24.6,25.6 21.7,23.3 C23.5,22.6 25.7,23.7 27.6,24.6 C29.5,25.5 32.2,25.8 33.1,24.2 C33.9,22.8 32.8,20.9 31.3,20 C29.8,19.1 28.1,18.8 26.4,18.4 C24.7,18 22.9,17.2 22,15.8 C23.7,15.5 25.6,16.2 27.4,16.4 C29.2,16.6 31.4,15.9 31.5,14.2 C31.6,12.7 29.9,11.3 28.3,10.9 C26,10.4 23.7,11.2 21.3,10.3 C20.6,10 20,9.6 19.6,9.1 C18.2,7.4 24.7,7.1 25.2,5.5 C26.6,1.4 21,1.7 18.6,2.1 C17.1,2.3 15.4,2.7 14,3.4 C12.8,4 12,4.7 10.7,5 C9.3,5.3 7.8,5.4 6.5,5.8 C1.3,7.5 -0.2,14 1.7,19.4 C3.6,24.5 8,28.8 12.4,32.9 Z"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:932459b0b69c": {
        d: {
          "0": {
            value: "M20.9,29.3 C19.5,28.6 18.2,27.8 16.9,27.1 C17,28.4 17,29.6 17.4,30.9 C17.6,31.6 17.9,32.2 18.3,32.8 C18.7,33.4 19.4,34.1 19.3,34.9 C19,36.8 15.9,35 15.1,34.4 C14.5,34 13.9,33.6 13.3,33.1 C12.8,32.7 12.7,32.5 12.2,33 C11.9,33.3 14,35.1 14.3,35.3 C15.5,36.2 17.1,37.3 18.7,37.1 C20.5,36.8 21.2,34.9 20.5,33.3 C20.2,32.6 19.7,32.1 19.4,31.4 C19.3,31.2 19.1,30.4 19,30.3 C20.4,31.1 21.9,31.7 23.5,32.3 C24.9,32.8 26.2,33.2 27.7,33.4 C29,33.7 30.5,34 31.6,33.3 C34.6,31.5 29.9,28.5 28.6,27.5 C27.4,26.6 26.2,25.7 25,24.7 C24.8,24.5 24.3,24 24,23.9 C24,23.9 24,23.9 24.1,23.9 C24.4,23.7 25.8,24.5 26.1,24.6 C26.7,24.9 27.4,25.2 28.1,25.4 C30.2,26.1 33.6,26.3 34.1,23.5 C34.6,21.3 32.6,19.2 30.7,18.4 C29.4,17.8 28.1,17.6 26.8,17.3 C26.2,17.1 24.4,16.9 24.1,16.2 C24.9,16 26.2,16.6 27,16.7 C28.4,16.9 30.1,16.7 31.2,15.8 C34,13.5 30.8,10.3 28.3,9.8 C26.8,9.5 25.2,9.7 23.7,9.7 C22.7,9.7 20.6,9.5 20.2,8.4 C20.2,7.9 23.3,7.1 23.8,7 C25,6.5 26,5.8 26.1,4.5 C26.5,1.2 22.5,0.9 20.2,1 C18.7,1.1 17.1,1.4 15.6,1.8 C14,2.3 12.8,3.3 11.3,3.9 C10,4.4 8.5,4.5 7.1,4.8 C5.6,5.2 4.2,5.9 3.1,7 C1,9.2 0.2,12.4 0.5,15.4 C0.8,19.5 3.1,23.2 5.7,26.3 C6.2,26.9 12.1,33.1 12.4,32.7 C12.5,32.6 7.8,27.9 7.6,27.5 C5.5,25.2 3.6,22.6 2.5,19.8 C1.3,16.8 1,13.3 2.2,10.3 C3.5,7.2 6,6 9.2,5.5 C10.8,5.3 12.1,4.8 13.5,4 C15,3.1 16.6,2.7 18.3,2.4 C19.7,2.2 25.7,1.4 24.9,4.4 C24.6,5.4 23.5,5.7 22.5,6 C21.4,6.3 19,6.8 18.9,8.2 C18.8,9.5 20.6,10.4 21.6,10.7 C23.1,11.2 24.7,11 26.3,11 C27.7,11 29.2,11.2 30.2,12.2 C31.3,13.3 30.9,14.6 29.4,15 C28,15.4 26.5,14.9 25.1,14.7 C23.6,14.4 22.3,14.6 20.8,14.8 C21.6,15.8 22.2,16.8 23.3,17.5 C24.3,18.2 25.5,18.5 26.6,18.8 C28.7,19.3 32.2,19.8 32.7,22.5 C33.3,25.8 27.5,23.2 26.4,22.7 C24.7,22 22.3,21.3 20.5,22.5 C21.3,23.5 22,24.1 23.1,24.9 C25.1,26.4 27.1,28 29,29.5 C29.2,29.7 31.2,31 31,31.4 C30.6,32 28.9,31.6 28.3,31.5 C25.6,31.3 23.2,30.4 20.9,29.3 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:2b5f58aa2714": {
        "translation.x": { "0": { value: 144 } },
        "translation.y": { "0": { value: 131 } }
      },

      "haiku:63151743593f": {
        d: {
          "0": {
            value: "M76.3,18.4 C71.4,12.8 63.9,10.3 56.8,8.2 C44,4.3 30.7,0.3 17.4,2 C12.8,2.6 8,4 4.8,7.4 C-0.5,13.1 0.6,22.9 5.9,28.7 C11.2,34.5 19.4,36.7 27.2,36.7 C35,36.7 42.7,34.6 50.3,33.2 C55.8,32.2 61.5,31.4 66.9,32.4 C69.8,33 72.9,34 75.7,32.8"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:c443ccf319e0": {
        d: {
          "0": {
            value: "M58,9.4 C63.9,11.3 69.8,13.3 74.5,17.3 C74.9,17.7 75.4,18.3 76,18.5 C76.1,18.5 76.5,18.2 76.5,18.1 C76.6,18 75.8,17.1 75.8,17 C73.9,14.8 71.4,13.1 68.9,11.7 C62.9,8.5 56.2,6.8 49.7,5 C42.8,3 35.8,1.3 28.7,0.8 C22.2,0.2 14.5,0.5 8.6,3.6 C2.7,6.6 -0.1,12.8 0.8,19.3 C1.7,25.8 6,30.9 11.7,33.9 C17.7,37 24.6,37.7 31.2,37.1 C39,36.4 46.6,34.2 54.3,32.9 C58.2,32.3 62.2,32 66.1,32.5 C68,32.8 69.9,33.3 71.8,33.4 C72,33.4 76,33.2 75.8,32.7 C75.8,32.8 73.7,33.1 73.6,33.1 C72,33.2 70.4,32.8 68.9,32.4 C65.8,31.7 62.7,31.3 59.4,31.5 C52.9,31.8 46.6,33.4 40.2,34.6 C33.4,35.8 26.3,36.7 19.5,35.2 C13.3,33.9 7.2,30.5 4.2,24.7 C1.6,19.6 1.3,12.8 5.1,8.3 C8.9,3.8 15.4,2.7 21,2.4 C33.6,1.8 46,5.7 58,9.4 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:1be95ed8989e": {
        d: {
          "0": {
            value: "M178.2,164.8 C174.4,165.5 170.6,166.2 166.8,165.9 C163,165.5 159.1,163.9 157,160.7 C154.9,157.5 155.3,152.6 158.4,150.4 C161.3,153.9 166,155.4 170.5,155.7 C175,156 179.5,155.2 184,154.9 C194.7,154.2 205.6,156.4 215.2,161.3 C202.9,161.4 190.4,162.6 178.2,164.8 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:21db024ba738": {
        "translation.x": { "0": { value: 77 } },
        "translation.y": { "0": { value: 127 } }
      },

      "haiku:2308405ad1ea": {
        d: {
          "0": {
            value: "M26.9,13.6 C24.6,18 22.3,22.4 19.9,26.8 C14.4,37.2 8.9,47.7 5.3,59 C1.7,70.2 -2.44249065e-15,82.3 2.4,93.9 C5.7,109.8 17,124 32.1,130.2 C47.1,136.4 65.4,134.3 78.4,124.6 C91.4,114.8 98.5,97.6 95.7,81.6 C94.5,74.7 91.6,68.2 90.2,61.3 C88.2,51.8 89,42 88.2,32.4 C87.3,22.8 84.3,12.6 76.8,6.7 C71.3,2.4 64,0.8 57,1 C50,1.2 43.2,3 36.4,4.8"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:1cdb77955ec1": {
        d: {
          "0": {
            value: "M8.8,52 C13.5,40.1 19.9,28.9 25.5,17.4 C26,16.3 26.5,15.3 27,14.2 C27,14.2 27.2,13.7 27.2,13.7 C27.1,13.5 26.7,13.4 26.6,13.5 C25.2,15.3 24.2,17.6 23.1,19.6 C20,25.2 16.9,30.9 14,36.6 C7.9,48.6 2.6,61.2 1,74.6 C-0.6,88.2 2.1,101.9 10,113.2 C17.1,123.3 27.7,130.7 39.8,133.3 C53.1,136.1 67.7,133.4 78.6,125.2 C88.9,117.5 95.6,105.3 96.7,92.5 C97.3,85.5 96,78.8 93.9,72.1 C92.9,68.8 91.8,65.5 91,62.1 C90.2,58.6 89.7,55.1 89.5,51.5 C88.7,38.5 90,24.2 82.8,12.7 C79.5,7.5 74.6,3.7 68.7,1.9 C62.6,-3.16413562e-15 56,0.1 49.7,1.2 C48.6,1.4 36,4.1 36.2,4.6 C36.2,4.7 43.3,3 43.9,2.8 C46.9,2.1 49.9,1.6 53,1.3 C59.5,0.6 66.3,1.2 72.2,4.1 C83.9,9.9 87.2,23.6 87.8,35.6 C88.2,42.6 87.9,49.6 88.8,56.5 C89.7,63.6 92.3,70.2 94.1,77.1 C97.4,90.1 94.7,103.9 86.8,114.7 C78.8,125.5 66.3,131.8 53,132.6 C40,133.4 27.3,128.5 17.9,119.5 C9.4,111.4 3.9,100.4 2.7,88.7 C1.1,76.3 4.1,63.7 8.8,52 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:e07455fc3a44": {
        d: {
          "0": {
            value: "M93.5,181 C89.7,180.4 86.1,183.1 84.3,186.5 C82.5,189.9 82.2,193.8 81.9,197.6 C81.2,207.7 80.8,218.1 83.3,227.9 C91.5,228.1 98.7,233 106,236.6 C108.4,237.8 111.8,238.8 113.6,236.8 C99,222.4 91.4,201.3 93.5,181 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:a3720d3da253": {
        d: {
          "0": {
            value: "M145.7,134.2 C137.2,131.4 127.8,131.4 119.3,134.1 C117.3,134.8 115.2,135.6 113.6,137.1 C112,138.6 111,140.8 111.5,142.9 C112.2,146 115.6,147.6 118.6,148.5 C127.7,151.1 137.6,150.8 146.6,147.8 C149.4,146.9 152.4,145.3 153,142.4 C153.4,140.4 152.4,138.4 151,137 C149.6,135.6 147.7,134.9 145.7,134.2 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:f5ef79c9e64f": {
        "translation.x": { "0": { value: 73 } },
        "translation.y": { "0": { value: 212 } }
      },

      "haiku:0360c7ea7d37": {
        d: {
          "0": {
            value: "M30,33.2 C25.2,31.2 20,30.1 15.1,28.3 C10.2,26.5 5.4,23.8 2.5,19.4 C0.9,16.9 0.1,13.8 0.3,10.9 C0.6,7.8 4.3,6.3 6.7,8.3 C19.7,19.1 36.8,24.8 53.7,23.8 C71.1,22.8 87.9,14.6 99.5,1.7 C100.6,0.4 102.7,0.9 103.3,2.5 C108,16.1 106.7,31.7 99.7,44.2 C93.1,55.9 74.8,64.8 60,68.3 C56,69.2 52,67.1 50.5,63.2 C45.6,50.5 43.1,38.7 30,33.2 Z"
          }
        },

        fill: { "0": { value: "#FFFFFF" } }
      },

      "haiku:14f9ad3ef72b": {
        d: {
          "0": {
            value: "M50.6,61.2 L50.5,60.9 C48.8,56.3 47.3,51.9 45.5,48 C43.7,44.1 41.4,40.8 39.1,38.5 C36.8,36.2 34.4,34.8 32.8,34 C31.1,33.3 30.2,32.9 30.2,33 L30,33.6 C30,33.7 30.8,34.2 32.4,35 C33.9,35.9 36,37.3 38.2,39.6 C40.3,41.9 42.4,45 44.1,48.8 C45.8,52.6 47.3,57 49,61.6 L49.1,61.9 L49.7,63.5 C49.8,63.8 49.9,64.1 50.1,64.3 C50.2,64.6 50.4,64.9 50.5,65.1 C51.2,66.2 52,67.1 53,67.8 C55,69.3 57.7,69.8 60.1,69.3 C64.5,68.3 68.7,66.9 72.9,65.3 C77,63.7 81,61.7 84.7,59.5 C88.4,57.3 92,54.7 95.1,51.7 C95.5,51.3 95.9,50.9 96.2,50.5 L97.3,49.3 C98,48.5 98.7,47.6 99.3,46.7 C100.5,44.9 101.5,43 102.4,41.1 C104.2,37.2 105.4,33.2 106.2,29.1 C107.7,20.9 107.3,12.6 105.1,5 C104.8,4 104.5,3.1 104.2,2.2 C104,1.6 103.5,1 103,0.7 C102.4,0.4 101.8,0.2 101.1,0.2 C100.4,0.2 99.8,0.5 99.3,0.9 C99,1.1 98.9,1.3 98.7,1.5 L98.2,2 C97.5,2.7 96.9,3.4 96.2,4 C93.5,6.6 90.7,9 87.7,11.1 C84.7,13.2 81.6,15 78.4,16.6 C75.2,18.1 71.9,19.4 68.7,20.4 C65.4,21.4 62.1,22.1 58.9,22.6 C55.6,23.1 52.4,23.3 49.2,23.2 C47.6,23.2 46,23.1 44.5,23 C43,22.8 41.4,22.7 39.9,22.4 C36.9,22 34,21.3 31.2,20.5 C28.4,19.7 25.7,18.7 23.2,17.6 C21.9,17 20.7,16.5 19.5,15.8 C18.9,15.5 18.3,15.2 17.7,14.9 C17.1,14.6 16.5,14.2 16,13.9 C14.8,13.3 13.8,12.5 12.7,11.8 C11.6,11.1 10.6,10.3 9.6,9.6 C9.1,9.2 8.6,8.8 8.1,8.5 L7.4,7.9 C7.2,7.7 6.9,7.5 6.6,7.3 C5.4,6.6 3.9,6.6 2.7,7.1 C1.5,7.6 0.5,8.7 0.2,10 C0.1,10.6 -3.41060513e-13,11.2 -3.41060513e-13,11.8 C-3.41060513e-13,12.4 -3.41060513e-13,12.9 0.1,13.5 C0.4,15.7 1.2,17.8 2.3,19.5 C4.6,23 7.8,25.1 10.8,26.6 C13.8,28.1 16.6,29 19,29.7 C21.4,30.4 23.5,31 25.2,31.5 C26.9,32 28.1,32.4 29,32.7 C29.8,33 30.3,33.1 30.3,33.1 C30.3,33.1 29.9,32.9 29.1,32.5 C28.3,32.1 27,31.7 25.4,31.1 C23.8,30.5 21.7,29.9 19.3,29.2 C16.9,28.4 14.1,27.5 11.2,26 C8.3,24.5 5.3,22.4 3.1,19 C2.1,17.4 1.3,15.4 1.1,13.3 C1,12.8 1,12.2 1,11.7 C1,11.2 1,10.6 1.2,10.2 C1.4,9.2 2.2,8.4 3.1,8 C4,7.6 5.2,7.6 6.1,8.2 C6.3,8.3 6.5,8.5 6.8,8.7 L7.5,9.3 C8,9.7 8.5,10.1 9,10.5 C10,11.2 11,12 12.1,12.7 C13.2,13.4 14.3,14.2 15.4,14.8 C16,15.1 16.6,15.5 17.1,15.8 C17.7,16.1 18.3,16.4 18.9,16.8 C20.1,17.5 21.4,18 22.7,18.6 C25.3,19.7 28,20.8 30.9,21.6 C33.7,22.5 36.7,23.2 39.8,23.6 C41.3,23.9 42.9,24 44.5,24.2 C46.1,24.3 47.7,24.4 49.3,24.4 C52.5,24.5 55.9,24.3 59.2,23.8 C62.5,23.3 65.9,22.6 69.3,21.6 C72.7,20.6 76,19.3 79.3,17.8 C82.6,16.2 85.8,14.4 88.8,12.3 C91.9,10.2 94.8,7.8 97.6,5.1 C98.3,4.5 98.9,3.7 99.6,3 L100.1,2.5 C100.3,2.3 100.5,2.1 100.5,2.1 C100.7,1.9 101,1.8 101.3,1.8 C101.9,1.8 102.5,2.1 102.7,2.7 C103,3.6 103.3,4.5 103.6,5.4 C105.7,12.8 106.1,20.8 104.6,28.7 C103.9,32.6 102.6,36.5 100.9,40.2 C100.1,42.1 99.1,43.9 97.9,45.6 C97.3,46.4 96.7,47.2 96,48 L95,49.1 C94.7,49.5 94.3,49.9 93.9,50.2 C90.9,53.1 87.5,55.6 83.8,57.7 C80.1,59.9 76.3,61.7 72.2,63.4 C68.2,65 64,66.4 59.7,67.3 C57.8,67.7 55.7,67.3 54.1,66.1 C53.3,65.5 52.6,64.8 52.1,63.9 C51.8,63.5 51.6,63 51.5,62.5 L50.6,61.2 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:169c9be932e6": {
        "translation.x": { "0": { value: 33 } },
        "translation.y": { "0": { value: 230 } }
      },

      "haiku:fbffeb34923f": {
        d: {
          "0": {
            value: "M1.1,44.6 C3.4,51.1 10.6,54.1 17.2,55.9 C38.4,61.6 61,61.7 82.2,56.2 C87.1,54.9 91.9,53.3 95.9,50.3 C99.9,47.3 103,42.7 103.1,37.7 C103.3,29 95.1,22.8 87.7,18.1 C79.2,12.7 70.6,7.2 61.1,4 C51.6,0.8 40.9,-0.1 31.6,3.7 C22.3,7.5 15.5,15.5 9,23.2 C3.9,29.3 -1.6,37 1.1,44.6 Z"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:5e258bbe524d": {
        d: {
          "0": {
            value: "M27.6,57.3 C21.4,56.1 14.9,55 9.3,52.1 C6.8,50.8 4.4,49.1 2.8,46.8 C2.4,46.3 1.7,44.3 1.1,44.5 C0.4,44.8 1.6,46.9 1.9,47.3 C4.9,52.5 11.3,55 16.8,56.5 C23.3,58.3 30.1,59.5 36.8,60.3 C50.9,61.8 65.3,61 79.1,57.7 C85.5,56.2 92.2,54.5 97.3,50.2 C102.2,46.1 105.2,39.8 103.4,33.5 C101.6,27.1 95.9,22.6 90.6,19 C84.6,15 78.4,11.1 72,7.9 C60,1.8 45.7,-2.1 32.5,2.7 C23.3,6.1 16.4,13.6 10.3,21 C7.2,24.7 4,28.5 2,32.9 C1.1,34.9 0.3,37.1 0.2,39.4 C0.2,39.7 0.5,44.7 1,44.5 C1,44.5 0.6,42 0.5,41.8 C0.4,40.3 0.5,38.8 0.9,37.4 C1.6,34.3 3.2,31.5 5,28.9 C6.9,26.2 9,23.7 11.2,21.2 C13.4,18.7 15.6,16.2 18,13.9 C22.5,9.5 27.7,5.6 33.8,3.5 C40.2,1.4 47.1,1.3 53.7,2.6 C60.6,3.9 67.1,6.7 73.3,10.1 C79.5,13.5 85.8,17.3 91.5,21.5 C96.6,25.2 102.2,30.3 102.4,37.1 C102.6,43.4 97.8,48.6 92.6,51.5 C88,54 82.6,55.4 77.5,56.4 C72.2,57.5 66.8,58.4 61.4,58.9 C50.1,59.9 38.7,59.4 27.6,57.3 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:17ad28e4d05d": {
        d: {
          "0": {
            value: "M126.6,279.4 C121.1,283.6 113.3,284.5 107,281.8 C103.1,280.1 99.8,277.2 96.6,274.3 C91.1,269.3 85.6,264.3 80,259.2 C84.1,260.4 88.4,261.2 92.6,260.4 C96.8,259.6 100.8,257 102.2,253 C103.6,249 101.5,243.8 97.4,242.8 C108.1,243 117.2,250.1 125.2,257.2 C128.3,260 131.6,263.1 132.3,267.2 C133.1,271.8 130.4,276.5 126.6,279.4 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:6cf4a931d9ae": {
        "translation.x": { "0": { value: 31 } },
        "translation.y": { "0": { value: 253 } }
      },

      "haiku:d6fca15e49a7": {
        d: {
          "0": {
            value: "M45.8,3 C56.2,9.6 76.2,18.7 80.9,30.1 C83.7,36.9 73.6,45.2 73.7,52.6 C63.1,53.7 52.3,53.7 41.6,52.7 C33.3,51.9 24.7,50.4 17.6,45.9 C12.6,42.8 6.1,34.9 3.4,29.6 C-2.1,18.6 2.5,6.6 12.9,1.13686838e-13"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:c262ecf85c7e": {
        d: {
          "0": {
            value: "M65.2,13.6 C60,10.3 54.6,7.3 49.2,4.4 C48.3,3.9 47.4,3.4 46.5,3 C46.3,2.9 46.1,2.8 46,2.8 C45.9,2.8 45.6,3.2 45.6,3.3 C45.7,3.7 46.6,4.1 46.8,4.3 C48,5.1 49.2,5.9 50.5,6.7 C55.8,9.9 61.2,12.9 66.2,16.4 C71,19.7 75.5,23.3 78.8,28.2 C80.5,30.8 80.8,33.3 79.8,36.2 C78.6,39.4 76.7,42.2 75.1,45.2 C74.4,46.6 73.7,48.1 73.3,49.6 C73.1,50.2 73,50.8 72.9,51.4 C72.9,51.9 73,51.9 72.4,51.9 C69,52.2 65.6,52.4 62.2,52.6 C55.1,52.8 48,52.6 41,51.9 C34.3,51.2 27.5,50.1 21.4,47.2 C16.7,45 13,41.6 9.7,37.7 C6.4,33.8 3.1,29.3 2.1,24.2 C1,19 2,13.8 4.6,9.2 C5.8,7.2 7.2,5.3 8.9,3.7 C9.3,3.3 13.1,0.1 13.1,0.1 C12.9,-0.3 8.2,3.8 7.7,4.2 C5.5,6.4 3.8,8.9 2.6,11.8 C-2.66453526e-15,17.9 0.4,24.8 3.5,30.7 C5.1,33.6 7.1,36.4 9.2,38.9 C11.3,41.4 13.6,43.9 16.3,45.8 C21.6,49.6 28.1,51.5 34.5,52.6 C41.4,53.8 48.5,54.2 55.5,54.3 C59.1,54.3 62.7,54.3 66.3,54.1 C67.9,54 69.5,53.9 71.1,53.8 C71.9,53.7 72.7,53.7 73.6,53.6 C73.8,53.6 74.4,53.6 74.5,53.5 C74.7,53.4 74.6,52.5 74.6,52.3 C74.6,51.2 74.9,50.1 75.3,49 C76.5,45.8 78.4,43 80,40 C81.5,37.1 82.9,33.8 81.8,30.5 C81.2,28.7 80,26.8 78.8,25.4 C75.1,20.5 70.3,16.8 65.2,13.6 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:f61107d4849b": {
        d: {
          "0": {
            value: "M107,283.4 C107.6,284.3 108.3,285.3 108.1,286.4 C107.8,287.9 105.9,288.7 104.4,288.4 C102.9,288.1 101.6,287 100.3,286.2 C99,285.4 97.4,284.6 95.9,284.9 C94.1,278.4 89.6,272.9 84.4,268.8 C79.2,264.7 73,261.6 67,258.7 C82.9,260.9 97.7,270.1 107,283.4 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:373110078596": {
        "translation.x": { "0": { value: 17 } },
        "translation.y": { "0": { value: 141 } }
      },

      "haiku:63faa7b35c40": {
        d: {
          "0": {
            value: "M92.3,8.1 C88.3,4.2 82.7,1.8 77.1,1.4 C67.9,0.7 58.9,4.2 50.7,8.4 C29.2,19.5 9.6,36.9 2.6,60 C1.1,64.8 0.5,70.7 3.9,74.4 C7.3,78 13.3,77.8 17.7,75.5 C22.1,73.2 25.3,69.3 28.9,65.9 C35.5,59.6 43.4,54.6 51.9,51.5 C61.8,47.9 72.5,46.7 81.9,42"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:6c023db29848": {
        d: {
          "0": {
            value: "M67.6,2.9 C73.8,1.7 80.2,1.8 86,4.6 C88.1,5.6 89.9,6.8 91.7,8.2 C91.9,8.3 92.6,8.4 92.4,8 C92.1,7.1 90.8,6.3 90.2,5.8 C79.5,-2.6 65.2,0.7 53.9,6 C30.7,16.9 8.7,35.7 1.5,61.2 C-0.3,67.4 0.4,75.6 7.7,77.6 C14.3,79.4 20.2,75.4 24.7,71 C26.9,68.9 29,66.6 31.3,64.5 C33.8,62.3 36.5,60.2 39.3,58.4 C44.6,55 50.4,52.4 56.5,50.5 C61.2,49 66,47.9 70.7,46.5 C71.5,46.3 82.1,42.6 81.8,42.1 C81.8,42 77,44 76.5,44.1 C73.8,45 71,45.8 68.2,46.6 C62.1,48.2 56,49.5 50.1,51.7 C44.3,53.9 38.9,57 34,60.7 C31.4,62.7 28.9,64.9 26.6,67.2 C24.3,69.5 22.1,71.8 19.5,73.6 C14.8,76.9 6.5,78.5 3.2,72.3 C1.6,69.3 1.9,65.7 2.6,62.6 C3.3,59.3 4.6,56.1 5.9,53.1 C11,41.4 19.4,31.5 29.2,23.4 C34.8,18.8 40.8,14.7 47.1,11.2 C53.7,7.6 60.4,4.4 67.6,2.9 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:66deeb51881e": {
        d: {
          "0": {
            value: "M54.7,184.8 C67.8,187.9 81.5,184.1 94.8,181.9 C85,188.1 72.2,187.3 61.8,192.6 C49.7,198.8 41.8,212.8 28.5,215.6 C39.9,207.9 49,197.2 54.7,184.8 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:ad17e22850bc": { "translation.y": { "0": { value: 208 } } },
      "haiku:22377c734ced": {
        d: {
          "0": {
            value: "M20.8,1 C19.5,1.5 18.2,2.1 17,2.9 C11.2,6.9 7.9,13.4 4.8,19.7 C3.8,21.7 0.9,24.3 0.8,26.5 C0.8,26.5 0.8,26.5 0.8,26.6 C0.8,29.3 4.2,30.6 6.1,28.7 C7.9,26.9 10.5,25.4 12.5,24.8 C11.4,29.8 11.4,35.1 12.7,40.1 C12.9,41 13.7,41.7 14.6,41.7 C15.7,41.7 16.2,40.6 16.5,39.7 C18,35.6 19.5,31.5 21,27.4 C22.7,29.2 22.3,32.1 22.1,34.7 C21.9,37.4 22.7,40.8 25.5,41 C26.9,41.1 28.1,40.3 28.8,39.1 C30.3,36.6 29.6,33.9 29.3,31.3 C29.1,29.2 29.2,27 30.5,25.4 C32.3,28.1 31.3,32 33.6,34.6 C34.2,35.3 34.9,35.7 35.8,35.9 C38.5,36.3 39.8,33.4 39.4,31.1 C39,28.3 36.9,25.9 37,22.9 C37,22.1 37.2,21.2 37.7,20.5 C39.2,18.4 41.9,18.9 44.2,19 C46.4,19.1 49.2,18.1 49,15.8 C48.9,15 48.5,14.3 47.9,13.9 C46.1,12.5 43.8,12.7 41.8,11.7 C38.9,10.3 37.9,6.8 35.9,4.3"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:a7a8d4ced661": {
        d: {
          "0": {
            value: "M7.2,16.8 C9.9,11.4 13.3,6 18.5,2.7 C18.7,2.6 20.9,1.5 20.9,1.3 C21.2,0.2 19,1.2 18.8,1.3 C16.1,2.5 13.7,4.5 11.7,6.8 C9.5,9.3 7.8,12.2 6.2,15.1 C4.9,17.5 3.9,19.8 2.3,21.9 C0.6,24.1 -1.4,27.4 1.5,29.6 C3.3,30.9 5.4,30.5 6.9,29.1 C8.2,27.9 9.8,26.9 11.4,26.1 C11.2,26.2 11.1,27.9 11.1,28.1 C10.9,29.7 10.8,31.4 10.9,33.1 C11,34.8 11.1,36.4 11.4,38.1 C11.6,39.3 11.8,40.9 12.7,41.8 C13.6,42.7 15.1,42.9 16.1,42 C17.2,41.1 17.6,39.2 18,37.9 C18.6,36.3 19.2,34.7 19.7,33.1 C20,32.3 20.3,31.6 20.5,30.8 C20.6,30.6 21.1,29.3 21.1,29.3 C21.7,29.9 21.4,31.7 21.4,32.5 C21.3,34.2 21.1,35.8 21.4,37.5 C22,40.1 24.1,42.6 27,41.5 C29.6,40.6 30.4,37.6 30.4,35.2 C30.4,33.6 30,32 29.9,30.4 C29.9,29.6 29.7,27.4 30.4,26.8 C31.1,27.8 31.1,29.5 31.3,30.7 C31.5,32 31.9,33.3 32.6,34.4 C34.1,36.6 37.2,37.4 39,35 C40.9,32.5 39.7,29.5 38.6,27 C37.7,24.8 36.4,21.3 39.1,19.8 C41.6,18.4 44.7,20 47.3,18.8 C50.1,17.5 49.9,14.3 47.3,12.9 C44.9,11.6 42.1,12 40.1,9.9 C39.8,9.5 36,4.1 35.9,4.1 C35.8,4.2 39,9.2 39.3,9.6 C40.1,10.6 41,11.5 42.2,12 C43.5,12.5 44.9,12.7 46.2,13.1 C47.4,13.5 48.7,14.4 48.6,15.8 C48.6,17.1 47.3,17.8 46.2,18.1 C43.7,18.7 40.8,17.4 38.4,18.9 C35.9,20.5 36.2,23.7 37.1,26.1 C38,28.5 39.9,31.6 38,34.1 C36.1,36.7 33.4,33.9 32.8,31.8 C32.4,30.5 32.3,29.1 32,27.8 C31.7,26.4 31.1,25.3 30.4,24.1 C28.5,26.4 28.1,28.6 28.4,31.6 C28.7,34.2 29.6,39.2 26.1,40.1 C22.6,41 22.5,35.9 22.6,33.7 C22.7,32 22.9,30.2 22.3,28.6 C22.1,27.9 21.7,27.4 21.3,26.8 C21.3,26.8 20.6,26 20.6,26 C19.3,28.3 18.6,30.8 17.7,33.3 C17.1,35 16.4,36.8 15.8,38.5 C15.5,39.3 14.6,42.1 13.4,40.4 C12.7,39.4 12.6,37.5 12.5,36.3 C12.3,34.4 12.2,32.6 12.3,30.7 C12.4,28.3 12.9,26 13.3,23.7 C13.3,23.8 11.8,24.2 11.8,24.2 C10.9,24.5 10.1,24.9 9.3,25.3 C8.1,26 6.9,26.8 5.8,27.7 C5.3,28.2 4.8,28.7 4,28.8 C2.9,29 1.7,28.3 1.5,27.2 C1.2,25.8 2.3,24.5 3.1,23.5 C3.9,22.5 4.7,21.5 5.3,20.4 C6.1,19.1 6.7,17.9 7.2,16.8 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:f8dd3f8cfdc5": {
        "translation.x": { "0": { value: 54 } },
        "translation.y": { "0": { value: 278 } }
      },

      "haiku:fbd4ca9a4a8b": {
        d: {
          "0": {
            value: "M66.4,26.9 C69.3,21.9 71,15.4 68.1,10.3 C66.2,7.1 62.8,5.1 59.3,3.7 C47.6,-0.9 33.8,0.6 23.3,7.5 C19.4,10.1 15.6,13.5 11,14.1 C8.2,14.4 5,13.8 2.9,15.6 C0.4,17.8 1.5,22.3 4.3,24.2 C7,26.1 10.6,26.1 14,25.9 C10.6,27.1 7.1,28.5 4.9,31.3 C2.7,34.1 2.5,38.9 5.5,40.8 C9,43.1 13.4,40.3 16.6,37.6 C15.1,38.6 13.7,39.7 12.7,41.2 C11.7,42.7 11.4,44.7 12.4,46.2 C13.6,48 16.4,48.2 18.3,47.2 C20.2,46.2 21.6,44.3 22.8,42.5 C19.6,44 19.3,49.4 22.4,51.2 C25.4,53 30,50.3 29.8,46.7 C29.6,48.4 29.3,50.1 29.1,51.8 C33.9,53.1 39.4,49.6 40.3,44.7 C51,43.1 60.9,36.4 66.4,26.9 Z"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:803f48b4f42f": {
        d: {
          "0": {
            value: "M58.8,4.5 C64.4,6.5 69,10.5 68.9,16.8 C68.9,19.6 68.1,22.2 67,24.8 C66.8,25.3 65.8,26.7 66.4,27 C67,27.4 67.8,25.5 68,25 C70.7,19.7 71.6,12.8 67.3,8 C63.2,3.4 56.2,1.4 50.3,0.7 C44.1,-0.1 37.6,0.6 31.7,2.6 C28.8,3.6 26,4.9 23.5,6.6 C20.9,8.3 18.5,10.3 15.7,11.8 C14.5,12.4 13.2,13 11.9,13.3 C10.3,13.6 8.8,13.5 7.2,13.6 C4.2,13.8 1.1,15.1 0.8,18.5 C0.5,21.3 2.1,24.2 4.5,25.5 C7.4,27.2 10.8,27.2 14,27 C13.9,26.5 13.8,26 13.7,25.5 C8.3,27.5 0.8,31.2 2.7,38.3 C3.6,41.6 6.8,43.3 10.1,42.5 C11.6,42.1 12.9,41.5 14.2,40.7 C14.8,40.3 15.4,39.9 16,39.4 C16.4,39.1 17.3,38.7 16.9,38.3 C16.7,38 16.5,37.7 16.2,37.4 C16.1,37.3 15,38.2 14.9,38.3 C13.8,39.2 12.7,40.1 12,41.4 C10.5,44 11.1,47.7 14.3,48.6 C19.3,50.1 22.4,44.7 24.8,41.3 C23.2,42 21.5,42.6 20.6,44.2 C19.1,46.7 19.5,50.6 22.2,52.1 C24.8,53.6 28.2,52.2 29.7,49.8 C30,49.3 31,47 30.1,47 C29.5,47 29.4,46.8 29.3,47.4 C29.2,48.4 29,49.4 28.9,50.4 C28.8,51.1 28.7,51.8 28.6,52.5 C28.6,52.8 30,52.9 30.3,52.9 C33.1,53.2 36,52.1 38.1,50.2 C39.1,49.2 40,48.1 40.4,46.8 C40.6,46.3 40.6,45.6 41.1,45.5 C44.1,44.9 47,44 49.8,42.7 C53.5,41 57,38.6 60,35.8 C61.4,34.4 62.8,33 63.9,31.4 C64.2,31.1 66.7,27.4 66.5,27.3 C66.5,27.3 63.6,31.2 63.3,31.6 C61.7,33.5 60,35.2 58.1,36.7 C54.4,39.7 50,42.1 45.4,43.5 C45,43.6 39.9,44.7 40,44.8 C39.7,45.1 39.7,45.9 39.6,46.3 C39.2,47.4 38.5,48.4 37.7,49.3 C36,51 33.3,52.3 30.8,52 C30.4,52 29.9,52 29.9,51.6 C30.1,50.1 30.3,48.7 30.5,47.2 C30.1,47.2 29.8,47.2 29.4,47.2 C29.6,50.4 25.2,52.9 22.6,51 C20.2,49.3 20.5,44.8 23.2,43.6 C22.9,43.3 22.7,43 22.4,42.7 C20.7,45.2 17.2,49.5 13.7,47.1 C12.2,46.1 12.3,44 13.1,42.5 C14,40.9 15.6,39.8 17,38.8 C16.7,38.4 16.4,38 16.1,37.7 C13.6,39.8 9.3,42.9 6,40.8 C2.6,38.6 4,33.6 6.5,31.2 C9.9,28 15.1,26.9 19.3,25.3 C15.8,25.5 12.2,26 8.7,25.5 C5.8,25 3.2,23.5 2.5,20.5 C1.7,17.1 4.3,15.6 7.3,15.5 C9,15.4 10.6,15.5 12.2,15.2 C13.9,14.9 15.5,14.2 17,13.3 C19.9,11.7 22.4,9.5 25.2,7.8 C30.9,4.4 37.5,2.5 44.2,2.4 C49.1,1.9 54.1,2.7 58.8,4.5 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:f7ff469daa78": {
        "translation.x": { "0": { value: 194 } },
        "translation.y": { "0": { value: 233 } }
      },

      "haiku:394d78def2b1": {
        d: {
          "0": {
            value: "M15.9,48.3 C11.2,48.6 5.9,47.5 3.1,43.8 C1.3,41.4 1,38.4 1.1,35.6 C1.6,26.2 7.3,17.3 15.8,12.6 C19,10.8 22.8,9.5 24.7,6.5 C25.9,4.7 26.4,2.3 28.5,1.5 C31,0.6 33.9,2.9 34.4,5.4 C34.9,7.9 33.7,10.3 32.5,12.5 C34.5,10.6 36.7,8.7 39.5,8.2 C42.3,7.7 45.9,9.2 46.3,11.9 C46.8,15 43.3,17.1 40.3,18.3 C41.5,17.7 42.8,17 44.2,16.9 C45.6,16.8 47.2,17.3 48,18.4 C48.9,19.8 48.1,21.8 46.7,22.7 C45.3,23.7 43.5,23.9 41.8,24.1 C44,22.4 48,24.1 48.4,26.8 C48.7,29.5 45.2,31.6 42.6,30.3 C43.9,30.7 45.3,31.2 46.6,31.6 C46,35.3 41.5,37.8 37.7,36.7 C32.9,43.4 24.6,47.8 15.9,48.3 Z"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:e1ef7a8289dd": {
        d: {
          "0": {
            value: "M0.3,35.8 C0.2,38.7 0.6,41.8 2.4,44.2 C4.3,46.8 7.4,48.1 10.5,48.6 C11.7,48.8 13,48.9 14.2,48.8 C14.7,48.8 15.3,48.8 15.9,48.6 C16.1,48.5 16.1,48 15.9,47.9 C15.1,47.5 13.8,47.7 12.9,47.6 C11.4,47.4 10,47.1 8.6,46.6 C5.9,45.6 3.7,43.8 2.7,41 C1.7,38.2 1.9,35.1 2.5,32.3 C3.7,26 7.1,20.3 12,16.3 C13.6,14.9 15.4,13.8 17.3,12.8 C19.3,11.8 21.3,10.9 23.1,9.5 C24.8,8.2 25.8,6.6 26.8,4.7 C27.6,3.1 28.9,1.6 30.9,2.3 C35.5,3.9 33.7,9.1 31.9,12.1 C31.1,13.6 30.2,15 29.4,16.5 C32,14.1 34.6,11.1 37.8,9.6 C40.2,8.4 44.6,8.5 45.6,11.6 C46.6,14.7 42.4,16.7 40.2,17.6 C40.4,18 40.6,18.5 40.8,18.9 C42.1,18.2 43.5,17.5 45,17.5 C46.1,17.5 47.5,18 47.8,19.2 C48.7,22.4 43.9,23.2 41.9,23.5 C42.1,23.9 42.2,24.3 42.4,24.6 C44,23.4 46.7,24.3 47.6,25.9 C49.2,28.5 45.3,30.9 43,29.7 C42.9,30 42.7,30.4 42.6,30.7 C43.2,30.9 46.3,31.5 46.1,32.1 C45.5,34 43.9,35.3 42.1,36 C41.2,36.3 40.2,36.5 39.3,36.4 C38.9,36.4 38.3,36.1 37.9,36.2 C37.5,36.3 37.5,36.5 37.2,36.8 C36.6,37.6 36,38.4 35.3,39.1 C32.7,41.8 29.6,44 26.1,45.5 C24.2,46.3 22.3,47 20.3,47.4 C19.9,47.5 16,48.1 16,48.2 C16,48.7 22.2,47.4 22.7,47.3 C25.4,46.6 28.1,45.4 30.5,43.9 C33.1,42.3 35.5,40.3 37.4,37.9 C38.1,37.1 38.1,37.2 39,37.3 C40.5,37.5 42,37.1 43.3,36.5 C44.7,35.8 46,34.7 46.6,33.3 C46.8,32.9 47.2,32 47.2,31.5 C47.3,30.9 45.9,30.7 45.4,30.6 C44.6,30.4 43.9,30.1 43.1,29.9 C42.5,29.7 42.6,30.1 42.4,30.6 C42.1,31.4 45.5,31.1 45.9,31 C47.3,30.5 48.5,29.4 48.9,28 C49.7,24.8 46,22.4 43.1,22.9 C41.7,23.1 40.6,24.3 39.4,25.1 C42.6,24.7 47.6,24.7 48.8,20.9 C49.6,18.3 47.6,16.3 45.2,16.1 C43.9,16 42.7,16.3 41.6,16.8 C41.1,17 40.5,17.3 40,17.6 C40,17.7 40.3,18.3 40.4,18.4 C40.6,18.8 40.5,18.9 41,18.7 C41.6,18.4 42.2,18.1 42.8,17.8 C43.8,17.2 44.8,16.6 45.7,15.7 C47.5,13.8 47.7,10.9 45.6,9 C43.7,7.3 40.9,6.8 38.5,7.5 C36,8.2 33.9,10 32,11.8 C32.4,12.1 32.8,12.4 33.2,12.8 C34.5,10.5 35.8,7.9 35.2,5.2 C34.7,2.8 32.5,0.6 30,0.5 C27.1,0.3 25.8,2.8 24.6,5 C23.3,7.4 21.2,8.9 18.8,10.1 C16.3,11.4 13.9,12.6 11.7,14.3 C9.4,16 7.4,18.1 5.7,20.3 C2.5,24.8 0.5,30.2 0.3,35.8 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:c7e459cfdea2": { "translation.x": { "0": { value: 26 } } },
      "haiku:0819b89e6439": {
        "translation.x": { "0": { value: 6 } },
        "translation.y": { "0": { value: 9 } }
      },

      "haiku:915466cd6fed": {
        d: {
          "0": {
            value: "M41.2,8.1 C31.5,12 22.3,17.6 14.9,25.1 C2.4,37.9 -0.3,57.9 2.7,75.1 C5.9,93.5 16.8,109.4 30.3,121.8 C40,130.7 49.2,135.2 62.5,136.1 C79.3,137.3 97.4,134.3 113.3,128.6 C134.1,121.3 149.7,96.2 140,74.7 C137.4,68.8 132.9,63.9 129.8,58.3 C124.1,47.9 124.2,36.1 119.2,25.6 C109.1,4.1 87.9,-1.3 65.9,1.5 C58,2.6 49.4,4.7 41.2,8.1 Z"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:291b6ddb01bf": {
        d: {
          "0": {
            value: "M5.2,43.6 C7,37.6 10.1,31.8 14.2,27.1 C18.4,22.3 23.6,18.3 29,14.9 C31.5,13.4 34.1,12 36.7,10.7 C37.8,10.1 39,9.6 40.1,9 C40.8,8.7 41.4,8.7 41.1,7.9 C40.7,6.9 27.6,14.1 26.6,14.7 C21.2,18.1 16,22.1 12,27.1 C7.9,32 5.1,37.8 3.3,43.9 C-0.7,57.3 0.1,72.5 4.6,85.6 C9.1,98.7 17.3,110.1 27,119.7 C31.8,124.4 37,128.7 43,131.8 C49.4,135 56.4,136.5 63.4,136.9 C77.6,137.8 92.1,135.8 105.7,131.8 C112.2,130 118.4,127.7 124,123.9 C128.8,120.5 133,116.3 136.3,111.4 C143.5,100.7 146.1,87 140.9,74.9 C138.2,68.7 133.6,63.8 130.4,57.9 C127.1,51.7 125.7,44.9 124,38.1 C123.2,34.8 122.3,31.4 121,28.3 C119.8,25.2 118.2,22.4 116.4,19.6 C113.2,14.2 107.9,9.8 102.5,6.7 C96.6,3.6 90.3,1.7 83.6,1 C77,0.3 70.4,0.7 63.9,1.7 C59.7,2.3 55.6,3.3 51.5,4.5 C50.5,4.8 41,7.9 41.1,8.3 C41,8.1 53.3,4.5 54.7,4.1 C60.7,2.6 66.8,1.7 73,1.5 C79.7,1.2 86.3,2 92.7,3.7 C98.8,5.3 105.1,8.7 109.6,13.2 C114.3,17.9 118,23.4 120.2,29.6 C122.6,36.1 123.6,43.1 125.6,49.7 C126.6,53 127.9,56.3 129.6,59.3 C131.2,62.2 133.2,64.9 135.1,67.7 C138.9,73.3 141.7,79.3 142.2,86.1 C143,98.6 137,110.7 127.9,119 C123.2,123.3 117.7,126.5 111.6,128.6 C105,130.8 98.2,132.6 91.2,133.8 C84.1,135 76.9,135.7 69.7,135.7 C62.7,135.7 55.7,135.1 49.1,132.9 C42.7,130.7 37,126.9 31.9,122.4 C26.8,117.9 22,112.8 17.9,107.3 C11.2,98.7 6.2,88.3 3.9,77.7 C1.7,66.4 1.7,54.4 5.2,43.6 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:f13833f509d1": {
        d: {
          "0": {
            value: "M11,72.7 C15,90.5 25,106.9 39,118.6 C53,130.3 71,137.1 89.3,137.7 C70.1,142.8 48.6,138 33.4,125.4 C18.2,112.8 9.5,92.5 11,72.7 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:b265ad79e0b5": {
        d: {
          "0": {
            value: "M29.4,32.5 C44.9,34.5 59.8,26 75.3,25 C78.2,24.8 81.2,24.9 83.9,23.8 C86.6,22.7 89,20.2 88.7,17.3 C88.5,15.1 86.8,13.3 84.9,12.3 C83,11.3 80.7,11.1 78.5,11 C69.4,10.6 60.2,11.9 51.6,14.9 C42.4,18.1 33.5,23.7 29.4,32.5 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:f99fd6c9cb21": {
        d: {
          "0": {
            value: "M98.5,84.9 C95.3,85.6 91.5,85.5 89.2,83.1 C86.9,80.6 87.2,76.5 89.1,73.7 C91,70.9 94.2,69.2 97.3,67.8 C100.7,66.4 104.4,65.2 107.9,66 C111.5,66.8 114.6,70.3 113.8,73.9 C113.4,75.7 112.1,77.2 110.8,78.4 C107.5,81.7 103.1,83.9 98.5,84.9 Z"
          }
        },

        fill: { "0": { value: "#FAAE71" } }
      },

      "haiku:cc0bb17186e0": {
        d: {
          "0": {
            value: "M72.2,68.3 C72.1,65.9 69.8,64 67.4,63.8 C65,63.6 62.7,64.6 60.8,66.1 C56.5,69.4 54.1,74.9 54.5,80.3 C56.7,72.9 64.5,67.6 72.2,68.3 Z"
          }
        },

        fill: { "0": { value: "#934730" } }
      },

      "haiku:d921386cd008": {
        d: {
          "0": {
            value: "M101.5,91.6 C104.2,90 107.3,88.6 110.3,89.4 C113.9,90.3 116.1,94.1 116.7,97.8 C117,99.5 116.8,101.6 115.4,102.5 C113.8,103.6 111.7,102.7 109.7,102.6 C106.7,102.5 104,104.3 101.7,106.4 C99.4,108.4 97.3,110.7 94.4,111.7 C91.5,112.7 87.7,111.7 86.7,108.9 C85.8,106.3 87.6,103.6 89.5,101.5 C93,97.5 97,94.2 101.5,91.6 Z"
          }
        },

        fill: { "0": { value: "#934730" } }
      },

      "haiku:2dc25e5c0705": {
        d: {
          "0": {
            value: "M102.8,58 C101.9,54.2 105.2,50.3 109.1,49.8 C113,49.4 116.7,51.9 118.6,55.3 C112.2,53.6 106.9,52.9 102.8,58 Z"
          }
        },

        fill: { "0": { value: "#934730" } }
      },

      "haiku:929f7462f436": {
        d: {
          "0": {
            value: "M55,53.4 C55.5,52.6 56.1,51.7 56.3,50.7 C56.4,50.2 56.5,49.7 56.3,49.2 C56,48.4 54.9,48.1 54.1,48.3 C53.3,48.5 52.6,49.1 52,49.8 C48.9,53.2 47.2,58 47.6,62.6 C50.4,59.8 52.8,56.7 55,53.4 Z"
          }
        },

        fill: { "0": { value: "#F9A163" } }
      },

      "haiku:40fbade7c7f2": {
        d: {
          "0": {
            value: "M106.1,41.6 C106.7,41.6 107.5,41.5 107.8,40.9 C108.2,40.2 107.7,39.3 107.1,38.8 C104.5,36.2 100.4,35.3 96.8,36.4 C96.5,38.4 98.1,40.4 100,41.1 C102,41.8 104.1,41.7 106.1,41.6 Z"
          }
        },

        fill: { "0": { value: "#F9A163" } }
      },

      "haiku:3cd4bc26fc68": {
        d: {
          "0": {
            value: "M89.6,70.8 C91.4,68.2 94.8,67.2 97.9,66.4 C99.7,66 101.4,65.5 103.3,65.6 C105.1,65.7 107,66.6 107.9,68.1 C109.4,70.8 107.7,74.2 105.4,76.2 C102.2,79.1 97.9,80.8 93.6,80.8 C92,80.8 90.3,80.5 89.1,79.5 C87.2,77.8 87.3,74.5 88.8,72.3 C90.1,70.2 88.1,73 89.6,70.8 Z"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:1dbfeccc3130": {
        d: {
          "0": {
            value: "M105.4,101.1 C103.2,101.4 101.5,103 99.8,104.5 C98.2,106 96.1,107.4 93.9,107.1 C94.6,101.7 98.9,96.9 104.2,95.7 C105.8,95.3 107.6,95.3 108.9,96.2 C110.2,97.1 110.7,99.4 109.4,100.4 C108.5,101.3 106.9,100.9 105.4,101.1 Z"
          }
        },

        fill: { "0": { value: "#EC7256" } }
      },

      "haiku:3229849527a8": {
        d: {
          "0": {
            value: "M61.8,105.7 C66.4,105.2 69.4,100.4 70.6,95.9 C71.8,91.4 72,86.5 74.5,82.6 C75.8,80.5 77.7,78.2 76.6,76 C75.9,74.7 74.4,74.1 73,73.9 C68.3,73.1 63.3,74.7 59.6,77.8 C55.9,80.9 53.5,85.3 52.5,90 C51.7,93.5 51.7,97.3 53.3,100.5 C54.9,103.7 58.2,106.1 61.8,105.7 Z"
          }
        },

        fill: { "0": { value: "url(#linearGradient-1-7217aa)" } }
      },

      "haiku:f835913d071f": {
        d: {
          "0": {
            value: "M115.2,66.3 C117.4,71.9 123,76.1 129,76.4 C130.4,76.5 132,76.3 132.9,75.3 C134,74.1 133.8,72.2 133.3,70.6 C131.4,64.9 126.1,60.5 120.1,59.8 C118.4,59.6 116.5,59.8 115.4,61.1 C114.2,62.5 114.5,64.6 115.2,66.3 Z"
          }
        },

        fill: { "0": { value: "url(#linearGradient-2-7217aa)" } }
      },

      "haiku:350f77e0f784": {
        d: {
          "0": {
            value: "M40,15.5 C39.3,17.1 38.7,18.7 39.1,20.4 C40.1,24.3 45.8,26 50.6,26 C58.1,25.9 65.3,23.4 72.8,22.6 C80.3,21.8 89.1,23.3 92.6,28.9 C92.7,24.4 89.1,19.9 84,18.2 C89.3,18.3 94.4,20.6 97.5,24.1 C98.2,18.9 95.4,13.5 90.4,10.3 C85.4,7.1 78.3,6.3 72.5,8.2 C77.3,6.6 82.6,6.2 87.7,7 C80.8,1.4 70.4,-1 61,0.7 C51.6,2.3 43.5,8.1 40,15.5 Z"
          }
        },

        fill: { "0": { value: "#E09628" } }
      },

      "haiku:fdf9665044ec": { "translation.y": { "0": { value: 91 } } },
      "haiku:2d45ee817df2": {
        d: {
          "0": {
            value: "M20.7,8.3 C18.7,5.8 16.5,3.4 13.6,2.1 C10.7,0.8 7.1,0.7 4.6,2.7 C2.5,4.4 1.6,7.1 1.3,9.7 C0.5,17.2 4,25.1 10.1,29.5 C13,31.6 16.8,33 20.3,31.9 C24.8,30.5 27.2,25.3 26.7,20.7"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:6f331689b5b6": {
        d: {
          "0": {
            value: "M13.7,3.1 C16.1,4.3 17.8,6.2 19.8,8 C19.9,8.1 20.4,8.6 20.5,8.5 C20.6,8.5 21,8.2 20.9,8 C20.7,7 19.6,6 19,5.3 C15.4,1.1 8.3,-2 3.6,2.5 C-1.1,7 1.14519505e-13,15.5 2.4,20.9 C4.8,26.3 9.5,31.4 15.5,32.7 C19.2,33.5 22.9,32.2 25.1,29 C26,27.6 26.6,26.1 26.9,24.5 C26.9,24.2 27.2,20.8 26.8,20.9 C26.7,20.9 26.5,23.4 26.5,23.6 C26.3,24.8 25.9,26 25.3,27.1 C24.2,29.3 22.2,31.2 19.7,31.7 C14.8,32.7 10,29.3 7.1,25.7 C3.6,21.5 1.8,16 2.2,10.5 C2.4,7.8 3.2,4.8 5.5,3.2 C7.8,1.4 11.2,1.8 13.7,3.1 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:7c39d1779e37": {
        d: {
          "0": {
            value: "M175.4,224.1 C178.2,236 175.7,249 168.6,259 C161.5,268.9 150,275.6 137.9,276.8 C140.9,270.9 138.9,263.6 135,258.3 C131.1,253 125.7,249.1 120.8,244.6 C133.3,247.7 146.2,242.8 158.2,238 C161.8,236.6 165.4,235.1 168.5,232.9 C171.6,230.7 174.3,227.8 175.4,224.1 Z"
          }
        },

        fill: { "0": { value: "#DCDBDD" } }
      },

      "haiku:c088d4120e5d": {
        d: {
          "0": {
            value: "M135.3,254.3 C138.8,258.2 140.9,263.4 141,268.7 C141,270.3 140.9,272.1 142.1,273.2 C143.6,274.7 146.2,273.9 148.2,273 C145,276.5 140.2,278.3 135.5,277.8 C137.6,275.8 139,272.9 139.2,270 C139.5,266 137.9,262.1 135.5,258.9 C133.1,255.7 130,253.1 126.9,250.6 C143.1,250.3 159.2,244.3 171.8,234 C164,245.9 149.4,251.6 135.3,254.3 Z"
          }
        },

        fill: { "0": { value: "#B3B1B5" } }
      },

      "haiku:6848912ad722": {
        "translation.x": { "0": { value: 149 } },
        "translation.y": { "0": { value: 212 } }
      },

      "haiku:7d0209427588": {
        d: {
          "0": {
            value: "M4,1 C3.1,1.8 2.2,2.7 1.7,3.8 C1.2,4.9 0.8,6.2 1.2,7.4 C1.6,8.6 2.6,9.6 3.8,9.6 C5,9.6 6.2,8.5 6.1,7.3"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:324d0e05299e": {
        d: {
          "0": {
            value: "M3.4,2.8 C3.8,2.4 4.8,1.2 3.8,0.8 C3.2,0.1 1.5,2.5 1.3,2.9 C-0.2,5.2 -0.2,9.4 3.1,10.1 C4.4,10.4 5.8,9.7 6.2,8.4 C6.2,8.3 6.4,7.2 6.1,7.3 C5.9,7.3 5.3,8.5 5,8.7 C3.8,9.5 2.4,8.6 1.9,7.3 C1.4,5.7 2.4,4 3.4,2.8 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:c4dcaaa81258": {
        "translation.x": { "0": { value: 30 } },
        "translation.y": { "0": { value: 96 } }
      },

      "haiku:280934a6a3f9": {
        d: {
          "0": {
            value: "M0.6,4.1 C1.4,2.2 3.7,1.3 5.7,1.7 C7.7,2.1 9.4,3.5 10.5,5.2 C11.6,6.9 12.3,8.9 12.9,10.8 C13,9.7 11.7,8.8 10.6,9 C9.5,9.2 8.7,10.2 8.4,11.3 C8.1,12.4 8.3,13.6 8.6,14.7 C9,16.3 9.7,18 10.9,19.1 C12.2,20.2 14.2,20.6 15.6,19.5"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:27a3845d76de": {
        d: {
          "0": {
            value: "M4.2,0.8 C3,0.9 1.6,1.5 0.9,2.5 C0.7,2.8 0.2,3.5 0.3,3.9 C0.4,4.1 0.9,4.2 1.1,4.1 C3.6,2 6.6,2 8.9,4.5 C11.6,7.4 12.5,11.9 13.7,15.6 C13.7,14.1 13.7,12.6 13.7,11.1 C13.7,9.1 11.6,7.5 9.7,8.5 C6.5,10.2 7.7,14.8 9,17.3 C9.7,18.7 10.9,19.9 12.4,20.3 C13.1,20.5 13.9,20.5 14.7,20.2 C14.7,20.2 15.8,19.6 15.7,19.5 C15.7,19.4 14.7,19.8 14.7,19.8 C14.1,19.9 13.5,19.8 12.9,19.7 C11.4,19.2 10.4,17.8 9.9,16.4 C9.3,14.9 8.7,12.8 9.3,11.3 C9.6,10.6 10.1,9.9 10.9,9.9 C11.4,9.8 12.3,10.3 12.2,11 C12.7,10.9 13.2,10.9 13.7,10.8 C12.3,6.3 9.8,0.2 4.2,0.8 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:ddf7b55c828d": {
        d: {
          "0": {
            value: "M204,275.5 C205.2,276.8 206.7,277.6 208.4,278.3 C209.8,278.9 211.5,279.3 212.9,278.7 C214.4,278 215.3,276.4 215.7,274.8 C216.5,271.9 216.4,268.6 214.9,265.9 C213.4,263.2 210.3,261.4 207.3,261.8 C205.9,262 204.6,262.6 203.7,263.6 C202.2,265.2 201.7,267.5 201.8,269.7 C201.9,271.8 202.6,273.9 204,275.5 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:b0fc7cc2050f": {
        d: {
          "0": {
            value: "M219.6,271 C222.7,273.1 227.3,272.1 229.7,269.3 C232.1,266.4 232.4,262.2 231.1,258.7 C229.7,255.2 226.9,252.5 223.7,250.6 C221.9,249.6 219.7,248.8 217.8,249.6 C216.3,250.3 215.4,251.8 215,253.3 C214.2,256.1 214.7,259.1 215.2,261.9 C215.9,265.3 216.8,269.1 219.6,271 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:3717585a8706": {
        d: {
          "0": {
            value: "M76.5,300.9 C75.6,306.5 77.5,312.6 81.8,316.2 C86.1,319.8 92.9,320.4 97.5,317.2 C99.7,315.6 101.4,313.2 101.6,310.5 C101.9,307.8 100.8,305.2 99.4,302.9 C97.5,299.8 94.9,297.1 91.9,295 C88.9,293 85.1,291.6 81.8,293 C78.7,294.2 77.1,297.6 76.5,300.9 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:aa140d4f6337": {
        d: {
          "0": {
            value: "M113.5,290.9 C111.4,289.1 108.4,288.1 105.7,288.6 C103.3,289 100.9,290.6 100.4,293 C99.8,295.6 101.6,298.1 103.2,300.3 C104.7,302.3 106.4,304.4 108.8,305 C112.1,305.9 115.8,303.5 116.7,300.2 C117.6,296.8 116.1,293.1 113.5,290.9 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:65dbbd103a53": {
        viewBox: { "0": { value: "0 0 242 365" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 242 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 365 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function($user) {
                return $user.mouse.x - 144;
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
                return $user.mouse.y - 288;
              },
              "$user"
            ),

            edited: true
          }
        },

        "style.zIndex": { "0": { value: 31 } },
        "scale.x": { "0": { value: 0.3, edited: true } },
        "scale.y": { "0": { value: 0.3, edited: true } },
        opacity: {
          "0": {
            value: Haiku.inject(
              function(currentBaby) {
                return currentBaby === "baby1" ? 1 : 0;
              },
              "currentBaby"
            ),

            edited: true
          }
        }
      },

      "haiku:af5f2250bfe6": {
        x1: { "0": { value: "-0.490951617%" } },
        y1: { "0": { value: "49.86833%" } },
        x2: { "0": { value: "99.8916442%" } },
        y2: { "0": { value: "49.86833%" } }
      },

      "haiku:27b73990f4b0": {
        "stop-color": { "0": { value: "#FDCEA5" } },
        offset: { "0": { value: "0%" } }
      },

      "haiku:cfcdf53a4da1": {
        "stop-color": { "0": { value: "#F8ACAC" } },
        offset: { "0": { value: "100%" } }
      },

      "haiku:20b39ac5b82a": {
        x1: { "0": { value: "-0.0176045393%" } },
        y1: { "0": { value: "50.087879%" } },
        x2: { "0": { value: "100.326804%" } },
        y2: { "0": { value: "50.087879%" } }
      },

      "haiku:3415e8d033b1": {
        "stop-color": { "0": { value: "#FDCEA5" } },
        offset: { "0": { value: "0%" } }
      },

      "haiku:839f29180f10": {
        "stop-color": { "0": { value: "#F8ACAC" } },
        offset: { "0": { value: "100%" } }
      },

      "haiku:50c68c4fad77": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:8b029d10d709": { "fill-rule": { "0": { value: "nonzero" } } },
      "haiku:92a19d7bf16c": {
        d: {
          "0": {
            value: "M79.7,2.8 C68.5,-1.9 54.7,0.6 45.8,8.9 C50.2,11.8 53.8,15.8 56.4,20.4 C53.7,18.8 51.5,16.4 49,14.5 C46.4,12.6 43.1,11.4 40.2,12.4 C38.4,13.1 37,14.5 35.8,16 C31.8,20.9 29,26.6 27.5,32.8 C33.4,30.9 39.9,30.6 46,32 C37.9,30.6 29.1,34.6 24.8,41.6 C31.6,38.8 39.2,38.1 46.4,39.6 C42.1,40.2 37.7,41.4 34.1,43.9 C30.5,46.4 27.7,50.3 27.1,54.6 C26.5,58.9 28.4,63.7 32.2,65.9 C30.1,62.3 31.5,57.5 34.4,54.5 C37.2,51.5 41.2,49.8 45,48.3 C37.6,56 36.2,68.7 41.6,77.8 C41.4,68.1 46,58.5 53.5,52.5 C61,46.5 71.4,44.2 80.8,46.5 C83.4,39.7 86,32.8 90.2,26.9 C94.4,21 100.6,16.1 107.7,14.9 C103,14 97.9,15.4 94.2,18.4 C96.7,15.1 100.7,12.9 104.9,12.7 C101.2,9.3 96.8,6.5 92.1,4.6 C90.6,4 89,3.4 87.3,3.6 C83.3,4.2 81.5,8.8 80.4,12.6 C80.3,9.4 80,6.1 79.7,2.8 Z"
          }
        },

        fill: { "0": { value: "#E09628" } }
      },

      "haiku:ea41118eb28a": {
        d: {
          "0": {
            value: "M74.4,32.4 C69.8,33.8 65.2,35.3 61.2,37.9 C57.2,40.5 53.7,44.3 52.5,49 C51.3,53.6 52.8,59.1 56.7,61.9 C60,64.3 64.5,64.3 68.5,63.7 C76.9,62.3 84.9,58.1 90.7,51.8 C94.6,47.6 97.7,41.4 95,36.3 C93.2,32.9 89.4,31.1 85.6,30.8 C81.8,30.5 78.1,31.3 74.4,32.4 Z"
          }
        },

        fill: { "0": { value: "#EC7256" } }
      },

      "haiku:c701876810f8": {
        "translation.x": { "0": { value: 128 } },
        "translation.y": { "0": { value: 247 } }
      },

      "haiku:9d8922b212ec": {
        d: {
          "0": {
            value: "M59.4,3.5 C68.5,6.1 77.7,12.5 79.1,21.9 C80.3,30.1 75.2,38 69,43.5 C57.9,53.5 42.1,58.7 27.6,55 C13.2,51.3 1.2,37.8 1.4,22.8 C1.5,18.4 2.6,13.8 5.4,10.4 C9.6,5.4 16.5,3.8 23,2.8 C35.1,1 47.6,0.1 59.4,3.5 Z"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:0769dc6e52d0": {
        d: {
          "0": {
            value: "M34.1,2.5 L34.4,2.5 C41.3,1.9 47.6,2.1 52.1,2.7 C56.6,3.2 59.3,4 59.4,3.8 L59.6,3.2 C59.6,3.1 59,2.9 57.7,2.5 C56.5,2.1 54.6,1.7 52.4,1.3 C47.8,0.5 41.4,0.1 34.4,0.7 L34.1,0.7 C30.9,1 27.7,1.4 24.5,1.8 C21.4,2.3 18.2,2.8 15.1,3.7 C12,4.6 9,6 6.6,8.2 C4.1,10.3 2.5,13.3 1.6,16.3 C0.7,19.3 0.6,22.5 0.8,25.6 C1.1,28.7 1.8,31.6 2.9,34.4 C5.2,40 8.8,44.7 13.2,48.4 C17.6,52.1 22.7,54.6 27.9,55.9 C30.5,56.5 33.2,56.9 35.8,57 C36.5,57 37.1,57 37.7,57 L38.7,57 L39.7,56.9 C40.3,56.9 41,56.8 41.6,56.8 C42.2,56.7 42.9,56.6 43.5,56.5 L44.4,56.4 L45.3,56.2 C45.9,56.1 46.5,56 47.1,55.8 C47.7,55.6 48.3,55.5 48.9,55.3 C49.5,55.2 50.1,55 50.7,54.8 C51.3,54.6 51.9,54.4 52.4,54.2 C53,54 53.5,53.8 54.1,53.6 C55.2,53.2 56.3,52.7 57.3,52.2 C61.5,50.2 65.2,47.6 68.5,44.9 C71.8,42.1 74.5,39 76.5,35.7 C78.5,32.4 79.7,28.8 79.9,25.4 C80.1,22 79.2,18.7 77.8,16.2 C76.4,13.6 74.5,11.6 72.7,10.1 C69,7 65.6,5.5 63.3,4.7 C62.1,4.3 61.2,4 60.6,3.8 C60,3.6 59.7,3.6 59.7,3.6 C59.7,3.7 60.9,4 63.2,5 C65.4,6 68.8,7.6 72.3,10.6 C74,12.1 75.8,14.1 77.1,16.6 C78.4,19.1 79.2,22.1 79,25.4 C78.8,28.7 77.6,32 75.6,35.2 C73.7,38.4 71,41.4 67.8,44 C61.5,49.4 53.1,53.7 43.4,55.1 C42.8,55.2 42.2,55.3 41.6,55.3 C41,55.3 40.4,55.4 39.8,55.4 L38.9,55.5 L38,55.5 C37.4,55.5 36.8,55.5 36.1,55.5 C33.6,55.4 31.1,55 28.5,54.4 C23.5,53.1 18.6,50.7 14.5,47.2 C10.3,43.7 6.9,39.1 4.7,33.9 C3.7,31.3 3,28.5 2.7,25.6 C2.5,22.7 2.6,19.8 3.5,17 C4.3,14.2 5.8,11.6 8,9.7 C10.2,7.8 13,6.5 15.9,5.6 C18.8,4.7 21.9,4.2 25,3.8 C27.7,3.1 30.9,2.7 34.1,2.5 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:4937bbcb03e4": {
        d: {
          "0": {
            value: "M169.1,277.5 C166.2,279.2 164.1,282.1 162.8,285.1 C161.5,288.1 160.7,291.5 160,294.8 C159.7,296 159.5,297.4 160.3,298.4 C160.9,299.2 162,299.4 162.9,299.6 C170.2,300.8 178,299.1 184.2,295 C181.8,288.6 180.6,281.9 180.5,275.1 C176.5,275.2 172.4,275.5 169.1,277.5 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:6f7b1b50a626": {
        "translation.x": { "0": { value: 178 } },
        "translation.y": { "0": { value: 252 } }
      },

      "haiku:054063dbdc44": {
        d: {
          "0": {
            value: "M12.7,0.3 C17,-0.3 21.9,1.7 25.5,4.5 C39,14.6 43.9,34.5 36.7,49.7 C33.9,55.5 28.6,61 22.2,60.4 C16.7,59.9 12.6,55.1 9.8,50.4 C2.9,38.8 -0.5,24.7 2.7,11.6"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:043e3095828f": {
        d: {
          "0": {
            value: "M2.9,28.3 L2.9,28.1 C2.3,23.6 2.3,19.5 2.6,16.5 C2.7,15.8 2.7,15.1 2.8,14.5 C2.9,13.9 3,13.4 3,13 C3.1,12.2 3.1,11.7 3,11.7 L2.4,11.6 C2.3,11.6 2.1,12 1.9,12.8 C1.8,13.2 1.6,13.7 1.5,14.3 C1.4,14.9 1.3,15.6 1.1,16.3 C1,17.1 0.9,17.9 0.8,18.8 C0.7,19.7 0.7,20.7 0.6,21.7 C0.6,23.7 0.7,26 1,28.3 L1,28.5 C2.2,37.1 5.4,45.1 9.7,52 C10.8,53.7 12.1,55.4 13.5,56.8 C15,58.2 16.6,59.5 18.5,60.3 C20.4,61.1 22.5,61.4 24.6,61.1 C26.6,60.8 28.5,60 30.1,58.9 C31.7,57.8 33.1,56.5 34.2,55 C35.4,53.5 36.3,52 37.1,50.4 C38.6,47.2 39.6,43.8 40.2,40.5 C40.7,37.2 40.7,33.9 40.5,30.9 C40.4,30.1 40.3,29.4 40.2,28.6 C40.1,27.8 39.9,27.1 39.8,26.4 C39.5,24.9 39.1,23.6 38.7,22.2 C36.9,16.8 34.1,12.4 31.2,9 C29.7,7.3 28.2,5.9 26.6,4.7 C25.1,3.5 23.6,2.6 22.2,1.9 C19.3,0.5 16.9,0.1 15.2,-1.13686838e-13 C14.4,-1.13686838e-13 13.7,-1.13686838e-13 13.3,0.1 C12.9,0.2 12.7,0.2 12.7,0.3 C12.7,0.4 13.6,0.3 15.2,0.4 C16.8,0.6 19.2,1.1 21.9,2.6 C23.2,3.3 24.7,4.2 26.1,5.5 C27.6,6.7 29,8.1 30.4,9.8 C33.2,13.1 35.8,17.5 37.5,22.7 C37.9,24 38.3,25.4 38.5,26.8 C38.6,27.5 38.8,28.2 38.9,28.9 C39,29.6 39.1,30.4 39.2,31.1 C39.4,34.1 39.4,37.2 38.9,40.4 C38.3,43.6 37.4,46.7 35.9,49.8 C34.4,52.8 32.2,55.7 29.3,57.6 C27.9,58.6 26.2,59.3 24.5,59.5 C22.8,59.7 21,59.5 19.4,58.8 C16.1,57.4 13.5,54.4 11.4,51.1 C7.2,44.4 4,36.6 2.9,28.3 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:df8fe74c0a4e": {
        "translation.x": { "0": { value: 207 } },
        "translation.y": { "0": { value: 174 } }
      },

      "haiku:5e78ea7cf30e": {
        d: {
          "0": {
            value: "M13,34.9 C14.4,36.2 15.8,37.4 17.5,38.1 C17.9,38.2 18.3,38.3 18.6,38.4 C20.4,38.7 21.4,36.8 20.2,35.3 C19.2,33.9 18.5,32.3 18.5,30.7 C21.9,32.8 25.7,34.2 29.6,34.8 C30.8,35 32.3,34.8 32.3,33.7 C32.3,33 31.7,32.5 31.1,32.1 C28.2,29.8 25.2,27.6 22.3,25.3 C24.1,24.6 26.3,25.7 28.2,26.6 C30.1,27.5 32.8,27.8 33.7,26.2 C34.5,24.8 33.4,22.9 31.9,22 C30.4,21.1 28.7,20.8 27,20.4 C25.3,20 23.5,19.2 22.6,17.8 C24.3,17.5 26.2,18.2 28,18.4 C29.8,18.6 32,17.9 32.1,16.2 C32.2,14.7 30.5,13.3 28.9,12.9 C26.6,12.4 24.3,13.2 21.9,12.3 C21.2,12 20.6,11.6 20.2,11.1 C18.8,9.4 19.8,7.6 20.4,5.9 C20.9,4.4 20.8,2.3 19.2,1.6 C18,1.1 16.8,1.8 16.1,2.7 C15.4,3.6 15,4.7 14.2,5.5 C12.5,7.2 9.5,6.9 7.1,7.7 C1.9,9.4 0.4,15.9 2.3,21.3 C4.2,26.5 8.6,30.8 13,34.9 Z"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:76bb05caac4a": {
        d: {
          "0": {
            value: "M1,20.2 L1,20.4 C1.8,23 3.1,25.2 4.5,27.1 C5.9,28.9 7.3,30.4 8.5,31.6 C11,33.9 12.6,35.2 12.7,35.1 L13.1,34.7 C13.2,34.6 11.8,33.1 9.5,30.6 C8.4,29.4 7.1,27.9 5.8,26.1 C4.6,24.3 3.4,22.3 2.7,19.9 L2.7,19.7 C2,17.1 2.2,14.2 3.3,11.9 C3.9,10.8 4.7,9.7 5.8,9.1 C6.3,8.8 6.9,8.5 7.5,8.3 C8.1,8.1 8.8,8 9.5,7.9 C10.9,7.7 12.4,7.5 13.8,6.6 C14.5,6.2 15.1,5.5 15.5,4.8 C15.9,4.2 16.2,3.5 16.5,3.1 C16.8,2.7 17.2,2.3 17.7,2.1 C18.1,1.9 18.5,2 18.9,2.2 C19.6,2.6 19.8,3.8 19.6,4.9 C19.3,6 18.5,7.3 18.6,9 C18.6,9.8 19,10.7 19.5,11.3 C20,11.9 20.7,12.4 21.5,12.7 C22.9,13.3 24.4,13.2 25.7,13.2 C27,13.2 28.2,13.1 29.2,13.5 C30.2,13.9 31.1,14.7 31.2,15.4 C31.3,15.8 31.2,16.1 30.9,16.4 C30.6,16.7 30.2,16.9 29.7,17 C29.2,17.1 28.7,17.1 28.1,17.1 C27.5,17 27,16.9 26.4,16.8 L25.4,16.6 C24.8,16.5 24.3,16.4 23.8,16.4 C22.8,16.4 22.1,16.6 21.2,16.7 C21.5,17.2 21.8,17.6 22.1,18 C22.4,18.4 22.8,18.8 23.3,19.2 C23.5,19.4 23.8,19.6 24.1,19.7 C24.2,19.8 24.4,19.9 24.5,19.9 L24.8,20 C25.2,20.2 25.5,20.3 25.9,20.4 C27.4,20.9 28.8,21.1 30,21.5 C30.6,21.7 31.2,22 31.7,22.3 C32.2,22.6 32.6,23.1 32.9,23.6 C33.2,24.1 33.3,24.6 33.2,25.1 C33.1,25.5 32.8,25.9 32.4,26 C32,26.2 31.4,26.2 30.8,26.1 C30.2,26 29.6,25.9 29.1,25.7 C28.5,25.5 28,25.2 27.4,25 C26.8,24.7 26.2,24.5 25.5,24.3 C24.4,24 23.4,24 22.7,24.1 C22.3,24.2 22,24.3 21.6,24.4 L21.4,24.5 C21.4,24.5 21.3,24.5 21.3,24.6 L21.5,24.8 L21.8,25.2 L22.1,25.6 C22.2,25.7 22.2,25.7 22.3,25.8 L22.6,26 C23,26.3 23.4,26.6 23.8,27 C24.3,27.4 24.8,27.8 25.3,28.2 C27.2,29.6 29,31 30.7,32.3 C31.1,32.6 31.5,32.9 31.6,33.2 C31.7,33.3 31.7,33.5 31.6,33.6 C31.6,33.7 31.5,33.8 31.3,33.8 C31,34 30.5,34 30.1,34 C29.7,34 29.2,33.9 28.7,33.8 C26.8,33.4 25,32.9 23.3,32.3 C22.5,32 21.7,31.6 20.9,31.3 C20.7,31.2 20.5,31.1 20.3,31 C20.1,30.9 19.8,30.7 19.5,30.6 C19,30.3 18.4,30 17.9,29.7 C17.8,29.7 17.9,30 17.9,30.2 C17.9,30.4 17.9,30.6 18,30.8 C18.1,31.2 18.1,31.7 18.2,32.1 C18.3,32.3 18.3,32.5 18.4,32.7 C18.5,32.9 18.5,33 18.6,33.1 C18.7,33.4 18.9,33.7 19,33.9 C19.1,34.2 19.3,34.4 19.5,34.7 C19.7,34.9 19.9,35.2 20,35.4 C20.3,35.8 20.3,36.3 20.3,36.7 C20.2,37.6 19.3,38 18.5,37.8 C17.7,37.7 17,37.4 16.4,37.1 C15.2,36.4 14.4,35.7 13.8,35.3 C13.2,34.8 12.9,34.6 12.9,34.6 C12.9,34.6 13.1,34.9 13.6,35.4 C14.1,35.9 14.9,36.7 16.1,37.4 C16.7,37.8 17.5,38.1 18.4,38.3 C18.9,38.4 19.4,38.4 19.9,38.1 C20.4,37.8 20.8,37.3 20.9,36.7 C21,36.1 20.9,35.5 20.6,34.9 C20.4,34.6 20.3,34.4 20.1,34.2 C20,34 19.8,33.7 19.7,33.5 C19.6,33.3 19.5,33 19.3,32.7 C19.2,32.6 19.2,32.4 19.2,32.3 C19.2,32.2 19.1,32.1 19.1,32 C19.1,31.8 19,31.7 19,31.5 C19,31.4 19,31.3 19,31.3 C19,31.2 19,31.1 19.1,31.2 C19.3,31.3 19.5,31.4 19.7,31.5 L20,31.7 C20.2,31.8 20.4,31.9 20.6,32 C21.4,32.4 22.2,32.8 23,33.1 C24.7,33.8 26.6,34.4 28.6,34.8 C29.6,35 30.7,35.3 32,34.7 C32.3,34.5 32.7,34.3 32.8,33.8 C33,33.4 32.9,33 32.8,32.6 C32.5,31.9 32,31.5 31.5,31.2 C29.8,29.9 28,28.4 26.1,27 C25.7,26.7 25.2,26.3 24.8,26 L24.4,25.7 L24.3,25.6 L24.3,25.6 C24.3,25.6 24.3,25.6 24.3,25.6 C24.4,25.6 24.5,25.6 24.5,25.6 C24.7,25.6 24.8,25.6 25,25.7 C25.5,25.9 26.1,26.1 26.7,26.4 C27.3,26.7 27.8,26.9 28.5,27.2 C29.2,27.4 29.8,27.6 30.6,27.7 C31.3,27.8 32.1,27.8 32.9,27.5 C33.7,27.2 34.4,26.4 34.6,25.5 C34.8,24.6 34.5,23.7 34.1,23 C33.7,22.3 33.2,21.7 32.5,21.2 C31.8,20.7 31.1,20.4 30.4,20.1 C29,19.6 27.5,19.4 26.2,19 C25.9,18.9 25.6,18.8 25.3,18.6 L25,18.5 L24.9,18.5 C24.8,18.5 24.8,18.4 24.7,18.3 C24.8,18.3 24.8,18.3 24.9,18.3 C25.2,18.4 25.5,18.4 25.8,18.5 C26.4,18.6 27,18.8 27.7,18.8 C28.4,18.9 29.1,18.8 29.8,18.7 C30.5,18.5 31.2,18.2 31.8,17.6 C32.4,17 32.7,16 32.6,15.1 C32.4,14.2 31.9,13.5 31.4,13 C30.8,12.5 30.2,12.1 29.5,11.8 C28.1,11.3 26.6,11.3 25.4,11.4 C24.1,11.4 22.9,11.4 21.9,11 C20.9,10.6 20.2,9.8 20.1,8.8 C20.1,8.3 20.2,7.8 20.4,7.2 C20.5,6.9 20.6,6.6 20.7,6.3 C20.8,6 20.9,5.6 21,5.2 C21.2,4.4 21.2,3.6 21,2.8 C20.8,2 20.4,1.1 19.5,0.6 C19.1,0.4 18.6,0.2 18.1,0.1 C17.6,0.1 17.1,0.1 16.7,0.3 C15.9,0.6 15.2,1.2 14.7,1.9 C14.2,2.5 13.9,3.2 13.6,3.7 C13.3,4.2 12.9,4.6 12.4,4.9 C11.4,5.5 10.1,5.7 8.7,5.9 C8,6 7.3,6.1 6.5,6.4 C5.8,6.6 5,6.9 4.3,7.4 C2.9,8.2 1.9,9.5 1.2,10.9 C0.4,14 0.2,17.2 1,20.2 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:b199d6df9ce3": {
        "translation.x": { "0": { value: 142 } },
        "translation.y": { "0": { value: 165 } }
      },

      "haiku:0963b69bfb38": {
        d: {
          "0": {
            value: "M76.9,18.4 C72,12.8 64.5,10.3 57.4,8.2 C44.6,4.3 31.3,0.3 18,2 C13.4,2.6 8.6,4 5.4,7.4 C0.1,13.1 1.2,22.9 6.5,28.7 C11.8,34.5 20,36.7 27.8,36.7 C35.6,36.7 43.3,34.6 50.9,33.2 C56.4,32.2 62.1,31.4 67.5,32.4 C70.4,33 73.5,34 76.3,32.8"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:22c5ed9b296b": {
        d: {
          "0": {
            value: "M55.9,33.3 L56.1,33.3 C58.9,32.9 61.5,32.8 63.9,32.9 C65.1,33 66.2,33.1 67.3,33.2 C68.4,33.4 69.4,33.6 70.3,33.7 C72.2,34 73.8,34 74.9,33.8 C76,33.5 76.5,33.2 76.5,33.1 L76.3,32.5 C76.3,32.4 75.7,32.6 74.8,32.7 C73.8,32.8 72.4,32.7 70.7,32.3 C69.8,32.1 68.8,31.8 67.7,31.6 C66.6,31.4 65.4,31.2 64.1,31.1 C61.6,30.9 58.8,31.1 55.9,31.4 L55.7,31.4 C50.4,32.1 45.4,33.4 40.4,34.3 C35.4,35.2 30.5,35.9 25.7,35.7 C23.3,35.6 20.9,35.2 18.6,34.6 C16.3,34 14.1,33.2 12.2,32 C10.2,30.9 8.4,29.5 7,27.8 C5.6,26.1 4.5,24.2 3.8,22.1 C2.4,18 2.6,13.4 4.6,9.9 C5.6,8.2 7,6.7 8.7,5.7 C10.4,4.6 12.2,3.9 14.1,3.4 C16,2.9 17.9,2.6 19.8,2.4 C21.7,2.2 23.6,2.1 25.4,2.1 C29.1,2.1 32.6,2.5 36,3.1 C42.7,4.2 48.7,5.9 53.9,7.5 C59.1,9 63.6,10.3 67.1,11.8 C68.8,12.5 70.4,13.3 71.6,14.1 C72.8,14.9 73.8,15.6 74.6,16.2 C76.1,17.5 76.8,18.3 76.9,18.2 C76.9,18.2 76.8,18 76.4,17.6 C76.1,17.2 75.5,16.6 74.8,15.9 C74,15.2 73.1,14.4 71.8,13.6 C70.6,12.8 69,11.9 67.3,11.1 C63.8,9.5 59.3,8 54.1,6.4 C48.9,4.8 42.9,3 36.1,1.8 C29.3,0.6 21.6,-4.5519144e-13 13.5,1.9 C11.5,2.4 9.5,3.2 7.6,4.3 C5.7,5.5 4.1,7.1 2.9,9.1 C0.6,13.1 0.4,18.1 1.9,22.6 C2.7,24.8 3.8,27 5.4,28.8 C7,30.6 8.9,32.2 11.1,33.4 C13.2,34.6 15.6,35.5 18,36.2 C20.4,36.8 22.9,37.2 25.4,37.3 C30.5,37.6 35.5,36.9 40.6,35.9 C45.7,35.3 50.8,34 55.9,33.3 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:9840c668d5d2": {
        "translation.x": { "0": { value: 143 } },
        "translation.y": { "0": { value: 165 } }
      },

      "haiku:60c45f03dcdb": {
        d: {
          "0": {
            value: "M59.2,9.1 C58.3,8.8 57.3,8.5 56.4,8.2 C43.6,4.3 30.3,0.3 17,2 C12.4,2.6 7.6,4 4.4,7.4 C-0.9,13.1 0.2,22.9 5.5,28.7 C10.8,34.5 19,36.7 26.8,36.7 C34.6,36.7 42.3,34.6 49.9,33.2 C53.3,32.5 56.8,32 60.3,31.9 C63.3,24.3 63.8,16.5 59.2,9.1 Z"
          }
        },

        fill: { "0": { value: "#77C043" } }
      },

      "haiku:4554360ab6ba": {
        d: {
          "0": {
            value: "M26.6,37.5 C21.3,37.5 11.4,36.4 4.9,29.2 C-0.3,23.4 -2,13.1 3.9,6.8 C6.8,3.7 11,1.9 17,1.1 C19.1,0.8 21.4,0.7 23.6,0.7 C35.1,0.7 46.6,4.2 56.7,7.3 C57.6,7.6 58.6,7.9 59.5,8.2 L59.8,8.3 L60,8.6 C64.3,15.5 64.7,23.2 61.2,32.2 L61,32.7 L60.5,32.7 C56.9,32.8 53.3,33.4 50.3,33.9 C48.6,34.2 47,34.6 45.3,34.9 C39.4,36.1 33.2,37.4 27,37.4 L26.6,37.5 Z M23.5,2.4 C21.3,2.4 19.1,2.5 17.1,2.8 C11.5,3.5 7.6,5.2 5,8 C-0.3,13.6 1.3,23 6.1,28.2 C12.2,34.9 21.6,35.9 26.6,35.9 L26.8,35.9 C32.8,35.9 38.9,34.6 44.8,33.4 C46.5,33.1 48.2,32.7 49.8,32.4 C52.7,31.8 56.2,31.3 59.8,31.1 C62.9,23 62.5,15.9 58.7,9.7 C57.9,9.4 57,9.2 56.2,8.9 C46.2,5.9 34.8,2.4 23.5,2.4 Z"
          }
        },

        fill: { "0": { value: "#2F803E" } }
      },

      "haiku:501ae14eeef8": {
        d: {
          "0": {
            value: "M155.3,185.2 C156.5,189.8 157.1,194.6 157.2,199.3 C164.6,201.6 172.5,200 180,198 C187.4,196 195,193.6 202.7,194.2 C202.6,191.1 202.5,187.9 202.5,184.8 C186.7,184.9 171,185 155.3,185.2 Z"
          }
        },

        fill: { "0": { value: "#66B245" } }
      },

      "haiku:af279fe408ee": {
        "translation.x": { "0": { value: 76 } },
        "translation.y": { "0": { value: 160 } }
      },

      "haiku:15740722150e": {
        d: {
          "0": {
            value: "M26.6,14.6 C24.3,19 22,23.4 19.6,27.8 C14.1,38.2 8.6,48.7 5,60 C1.4,71.2 -0.3,83.3 2.1,94.9 C5.4,110.8 16.7,125 31.8,131.2 C46.9,137.4 65.1,135.3 78.1,125.6 C91.1,115.8 98.2,98.6 95.4,82.6 C94.2,75.7 91.3,69.2 89.9,62.3 C87.9,52.8 88.7,43 87.9,33.4 C87,23.8 84,13.6 76.5,7.7 C71,3.4 63.7,1.8 56.7,2 C49.7,2.2 42.9,4 36.1,5.8"
          }
        },

        fill: { "0": { value: "#77C043" } }
      },

      "haiku:e0c2ec579f2b": {
        d: {
          "0": {
            value: "M49.7,135.5 C43.4,135.5 37.2,134.3 31.3,131.9 C16.1,125.6 4.5,111.5 1.2,95 C-1,84.4 -3.31679129e-15,72.5 4.2,59.7 C7.9,48.4 13.5,37.7 18.9,27.4 L25.9,14.2 L27.3,14.9 L20.3,28.1 C14.9,38.4 9.3,49 5.7,60.1 C1.6,72.6 0.7,84.2 2.8,94.6 C6.1,110.5 17.2,124.2 32,130.3 C46.9,136.5 64.8,134.3 77.5,124.8 C90.4,115.1 97.2,98.1 94.5,82.5 C93.9,78.8 92.7,75.2 91.6,71.7 C90.6,68.6 89.6,65.4 89,62.2 C87.8,56.2 87.6,50 87.5,44.1 C87.4,40.5 87.3,36.8 87,33.3 C86.3,25.2 83.8,14.3 75.9,8.1 C71.1,4.3 64.2,2.4 56.6,2.6 C49.7,2.8 42.8,4.6 36.2,6.4 L35.8,4.9 C42.5,3.1 49.5,1.2 56.6,1 C62.3,0.8 70.4,1.7 76.9,6.9 C83.5,12.1 87.6,21.2 88.6,33.2 C88.9,36.8 89,40.6 89.1,44.1 C89.2,50 89.4,56.1 90.6,61.9 C91.3,65.1 92.2,68.2 93.2,71.2 C94.3,74.8 95.5,78.4 96.1,82.2 C98.9,98.4 91.9,116 78.5,126 C70.3,132.3 60,135.5 49.7,135.5 Z"
          }
        },

        fill: { "0": { value: "#2F803E" } }
      },

      "haiku:5dfbc9299720": {
        d: {
          "0": {
            value: "M82.1,252.3 C79.1,248.5 79.2,243.2 79.4,238.3 C79.6,233.7 79.9,229 81.9,224.9 C83.9,220.8 88.2,217.4 92.7,217.9 C88.9,235.1 96,254.3 110.2,264.9 C103.7,262.7 97.3,260.3 90.9,257.8 C87.6,256.4 84.2,255 82.1,252.3 Z"
          }
        },

        fill: { "0": { value: "#66B245" } }
      },

      "haiku:a35be1d47e9d": {
        d: {
          "0": {
            value: "M143.2,186.3 C146.7,185.9 150.5,185.1 152.7,182.3 C155.2,179 154.4,174.1 151.8,170.9 C149.2,167.7 145.2,165.9 141.3,164.8 C130.8,161.8 119.3,162.4 109.2,166.5 C107.2,167.3 105,168.5 104.2,170.5 C103.5,172.3 104.1,174.4 105.3,176 C106.5,177.5 108.2,178.6 109.9,179.6 C120,185 131.8,187.4 143.2,186.3 Z"
          }
        },

        fill: { "0": { value: "#66B245" } }
      },

      "haiku:e94bf7362f07": {
        "translation.x": { "0": { value: 67 } },
        "translation.y": { "0": { value: 243 } }
      },

      "haiku:0957730c33d5": {
        d: {
          "0": {
            value: "M100.5,8.3 C102.6,6.3 103.4,3.8 105.2,1.6 C111.5,15.9 111.9,33.6 104.2,47.2 C96.5,60.8 73.7,70.9 58.2,72.9 C51.3,57.9 49.9,42.6 34.6,36.3 C29.8,34.3 24.6,33.2 19.7,31.4 C14.8,29.6 0.5,29.7 1.4,24.6 C2.7,17.3 6.2,11.4 9.8,7.5 C23.1,20.5 39.6,28.1 58.2,27"
          }
        },

        fill: { "0": { value: "#77C043" } }
      },

      "haiku:a8242c748674": {
        d: {
          "0": {
            value: "M57.7,73.7 L57.5,73.2 C55.8,69.5 54.4,65.8 53.1,62.1 C49,51.1 45.5,41.6 34.4,36.9 C31.7,35.8 28.8,34.9 26.1,34.1 C23.9,33.5 21.7,32.8 19.5,32 C18.1,31.5 15.7,31.1 13.2,30.7 C8.2,29.9 3,29.1 1.3,26.7 C0.8,26 0.6,25.2 0.8,24.3 C2,17.9 5.1,11.5 9.3,6.8 L9.9,6.2 L10.5,6.8 C24.4,20.4 40.9,27.1 58.3,26 L58.4,27.6 C40.8,28.6 24.1,22 10,8.5 C6.2,12.9 3.4,18.7 2.4,24.6 C2.3,25.1 2.4,25.4 2.7,25.8 C4,27.7 9.3,28.5 13.6,29.2 C16.2,29.6 18.6,30 20.2,30.6 C22.3,31.4 24.5,32 26.7,32.7 C29.5,33.5 32.4,34.4 35.2,35.6 C47,40.6 50.8,50.8 54.8,61.7 C56.1,65.1 57.4,68.6 58.9,72.1 C75,69.9 96.6,59.7 103.8,46.9 C110.8,34.5 111.3,17.9 105.3,3.3 C104.9,3.9 104.6,4.5 104.2,5 C103.4,6.4 102.6,7.8 101.3,9 L100.2,7.8 C101.3,6.7 102.1,5.5 102.9,4.1 C103.5,3.1 104.1,2.1 104.9,1.1 L105.7,0.1 L106.2,1.3 C113,16.7 112.6,34.4 105.1,47.6 C97.5,61 75,71.5 58.5,73.7 L57.7,73.7 Z"
          }
        },

        fill: { "0": { value: "#2F803E" } }
      },

      "haiku:91d2880c4694": {
        d: {
          "0": {
            value: "M139.2,310.1 C135.5,312.9 130.5,313.1 125.9,312.6 C115.8,311.4 106.3,307.2 97.9,301.5 C89.5,295.8 82.3,288.5 75.8,280.8 C73.8,278.4 71.8,275.9 70.8,273 C69.8,270 70.1,266.5 72.1,264.2 C74.2,261.9 77.7,261.3 80.7,261.8 C83.7,262.3 86.6,263.7 89.5,264.9 C98.3,268.6 107.9,270.3 117,273.3 C126.1,276.3 135.1,281 140.4,289.1 C142.5,292.4 144,296.2 143.9,300.1 C144,303.8 142.3,307.7 139.2,310.1 Z"
          }
        },

        fill: { "0": { value: "#66B245" } }
      },

      "haiku:5ddd83adbe7f": {
        "translation.x": { "0": { value: 31 } },
        "translation.y": { "0": { value: 263 } }
      },

      "haiku:80b02c8bb366": {
        d: {
          "0": {
            value: "M1.7,45.6 C4,52.1 11.2,55.1 17.8,56.9 C39,62.6 61.6,62.7 82.8,57.2 C87.7,55.9 92.5,54.3 96.5,51.3 C100.5,48.3 103.6,43.7 103.7,38.7 C103.9,30 95.7,23.8 88.3,19.1 C79.8,13.7 71.2,8.2 61.7,5 C52.2,1.8 47,-0.5 37.7,3.3 C28.4,7.1 16,16.5 9.5,24.2 C4.5,30.3 -1,38 1.7,45.6 Z"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:5c95618f5d3f": {
        d: {
          "0": {
            value: "M13.9,18.4 L13.7,18.6 C12.1,20.1 10.7,21.6 9.4,23.1 C8.1,24.6 6.9,26.2 5.8,27.7 C3.6,30.7 2,33.7 1.2,36.5 C0.3,39.3 0.4,41.7 0.7,43.3 C0.8,43.7 0.8,44 0.9,44.3 C1,44.6 1.1,44.8 1.2,45 C1.4,45.4 1.5,45.6 1.5,45.6 L2.1,45.4 C2.1,45.4 2.1,45.2 2.1,44.8 C2.1,44.6 2,44.4 2,44.1 C2,43.8 1.9,43.5 1.9,43.1 C1.8,41.6 1.8,39.5 2.7,36.9 C3.6,34.4 5.2,31.6 7.3,28.7 C8.4,27.3 9.6,25.8 10.9,24.3 C12.2,22.8 13.6,21.4 15.1,19.9 L15.3,19.7 C18.1,17.1 21.1,14.6 24.2,12.4 C27.3,10.2 30.4,8.1 33.7,6.3 C37,4.5 40.4,3 43.9,2.4 C45.7,2.1 47.4,2.1 49.2,2.3 C51,2.5 52.7,2.9 54.4,3.4 C56.1,3.9 57.9,4.5 59.6,5.1 C61.3,5.7 63,6.3 64.7,6.9 C68,8.2 71.2,9.8 74.3,11.4 C77.4,13.1 80.4,14.9 83.3,16.7 C86.2,18.5 89.1,20.3 91.9,22.2 C94.6,24.1 97.2,26.2 99.2,28.7 C100.2,29.9 101.1,31.2 101.8,32.6 C102.5,34 102.9,35.5 103.1,36.9 C103.5,39.9 102.6,42.9 101.1,45.4 C99.5,47.9 97.4,50 94.9,51.5 C92.4,53.1 89.7,54.2 87,55.1 C85.6,55.5 84.3,55.9 82.9,56.3 C81.5,56.6 80.2,57 78.8,57.3 C73.4,58.5 68.1,59.4 63.1,59.9 C53,60.9 43.7,60.6 35.7,59.7 C33.7,59.5 31.8,59.2 29.9,58.9 C28.1,58.6 26.3,58.3 24.6,57.9 C23.8,57.7 22.9,57.5 22.1,57.4 C21.3,57.2 20.5,57 19.7,56.8 C18.2,56.4 16.7,56.1 15.4,55.6 C12.7,54.8 10.4,53.7 8.5,52.6 C6.6,51.5 5.2,50.3 4.2,49.2 C2.2,47 1.9,45.3 1.8,45.4 C1.8,45.4 1.9,45.8 2.2,46.5 C2.4,46.9 2.6,47.3 2.8,47.8 C3.1,48.3 3.5,48.9 4,49.4 C5,50.6 6.4,51.9 8.2,53.1 C10.1,54.3 12.4,55.4 15.2,56.3 C16.6,56.8 18,57.2 19.6,57.6 C20.4,57.8 21.2,58 22,58.2 C22.8,58.4 23.6,58.6 24.5,58.8 C26.2,59.2 28,59.5 29.8,59.9 C31.7,60.2 33.6,60.5 35.6,60.8 C43.7,61.8 53,62.2 63.2,61.3 C68.3,60.8 73.6,60 79.1,58.8 C80.5,58.5 81.8,58.1 83.2,57.8 C84.6,57.4 86,57.1 87.4,56.6 C90.2,55.7 93,54.6 95.6,52.9 C98.2,51.3 100.6,49.1 102.3,46.3 C103.2,44.9 103.8,43.4 104.3,41.8 C104.7,40.2 104.8,38.5 104.7,36.8 C104.5,35.1 104,33.5 103.3,31.9 C102.6,30.3 101.6,29 100.5,27.6 C98.3,25 95.7,22.8 92.9,20.8 C90.1,18.8 87.2,17 84.3,15.2 C81.4,13.4 78.4,11.5 75.2,9.8 C72.1,8.1 68.8,6.5 65.4,5.1 C63.7,4.4 62,3.8 60.3,3.2 C58.6,2.6 56.8,2 55.1,1.5 C53.3,1 51.5,0.5 49.5,0.3 C47.6,0.1 45.6,0.1 43.7,0.4 C39.8,1 36.3,2.7 32.9,4.5 C29.5,6.3 26.3,8.4 23.1,10.7 C19.8,13.2 16.8,15.7 13.9,18.4 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:4e0e1b75d899": {
        d: {
          "0": {
            value: "M74.2,302.1 C75.1,297.8 79.4,295.1 83.6,293.6 C88.4,291.9 93.6,291.1 98.4,289.3 C103.2,287.5 107.9,284.4 109.8,279.7 C116.1,282.5 122.5,285.6 126.9,290.8 C131.3,296.1 133,304.3 128.9,309.8 C125.3,314.6 118.7,315.9 112.7,316.7 C101.9,318.3 90,319.6 80.7,313.8 C76.7,311.4 73.2,306.8 74.2,302.1 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:754269583607": {
        "translation.x": { "0": { value: 29 } },
        "translation.y": { "0": { value: 286 } }
      },

      "haiku:0e411ac22ead": {
        d: {
          "0": {
            value: "M46.4,4 C56.8,10.6 76.8,19.7 81.5,31.1 C84.3,37.9 74.2,46.2 74.3,53.6 C63.7,54.7 52.9,54.7 42.2,53.7 C33.9,52.9 25.3,51.4 18.2,46.9 C13.2,43.8 6.7,35.9 4,30.6 C-1.5,19.6 3.1,7.6 13.5,1"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:03543a4ceb3f": {
        d: {
          "0": {
            value: "M2.9,18.9 L2.9,18.7 C3.2,15.8 4.2,13.2 5.3,11 C6.5,8.8 7.9,7 9.2,5.6 C11.8,2.8 13.9,1.5 13.8,1.3 L13.5,0.8 C13.5,0.7 12.9,1 11.9,1.6 C11.4,1.9 10.9,2.3 10.2,2.8 C9.5,3.3 8.9,3.9 8.1,4.6 C6.7,6 5.1,7.9 3.7,10.2 C2.4,12.5 1.3,15.4 1,18.5 L1,18.7 C0.7,21.6 1,24.5 1.8,27.2 C2,27.9 2.2,28.6 2.5,29.2 C2.8,29.8 3.1,30.5 3.4,31.1 C4,32.4 4.8,33.5 5.5,34.7 C7,37 8.7,39.1 10.5,41.1 C12.3,43.1 14.2,45 16.4,46.6 C20.8,49.8 25.8,51.6 30.8,52.7 C35.8,53.8 40.7,54.3 45.5,54.7 C55.1,55.4 64.3,55.2 72.8,54.4 L73.7,54.3 L74.4,54.2 L74.8,54.2 C74.9,54.2 75.1,54.2 75,54.1 L75,53.4 L75,53 C75,52.9 75,52.9 75,52.8 L75,52.7 C75,52.5 75,52.2 75.1,52 C75.3,51 75.6,50.1 75.9,49.2 C76.6,47.4 77.6,45.6 78.6,43.9 C79.6,42.2 80.6,40.5 81.3,38.7 C82.1,36.9 82.7,35 82.5,33 C82.4,32 82.1,31 81.6,30.2 C81.2,29.4 80.8,28.6 80.3,27.8 C80.1,27.4 79.8,27.1 79.6,26.7 C79.4,26.3 79.1,26 78.8,25.7 C78.2,25 77.7,24.4 77.1,23.8 C74.8,21.4 72.3,19.5 70,17.8 C65.3,14.4 60.9,12 57.4,10 C53.9,8 51.1,6.5 49.2,5.5 C47.3,4.5 46.4,3.9 46.3,4 C46.3,4 46.5,4.2 47,4.5 C47.5,4.8 48.1,5.3 49,5.8 C50.8,7 53.5,8.5 57,10.6 C60.5,12.7 64.7,15.2 69.4,18.6 C71.7,20.3 74.1,22.2 76.3,24.6 C76.9,25.2 77.4,25.8 77.9,26.4 C78.2,26.7 78.4,27 78.7,27.4 C78.9,27.7 79.2,28.1 79.4,28.4 C79.9,29.1 80.2,29.9 80.6,30.6 C81,31.4 81.2,32.1 81.3,32.9 C81.4,34.5 80.9,36.3 80.2,38 C79.5,39.7 78.5,41.3 77.5,43.1 C76.5,44.8 75.5,46.6 74.7,48.6 C74.3,49.6 74,50.6 73.8,51.7 C73.7,52 73.7,52.3 73.7,52.5 L73.7,52.6 L73.7,52.6 L73.7,52.7 C73.7,52.7 73.6,52.7 73.6,52.7 L72.9,52.8 C64.4,53.5 55.3,53.7 45.8,52.9 C41,52.5 36.2,52 31.4,50.9 C29,50.3 26.6,49.6 24.3,48.7 C22,47.7 19.7,46.6 17.7,45.1 C15.7,43.6 13.8,41.7 12.1,39.8 C10.4,37.8 8.7,35.8 7.3,33.6 C6.6,32.5 5.9,31.4 5.3,30.2 C5,29.6 4.8,29 4.5,28.4 C4.2,27.8 4.1,27.2 3.9,26.5 C2.9,24.2 2.6,21.5 2.9,18.9 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:9be9858d0094": {
        "translation.x": { "0": { value: 16 } },
        "translation.y": { "0": { value: 175 } }
      },

      "haiku:6d3fd706ad4a": {
        d: {
          "0": {
            value: "M91.9,8.1 C87.9,4.2 82.3,1.8 76.7,1.4 C67.5,0.7 58.5,4.2 50.3,8.4 C28.8,19.5 9.2,36.9 2.2,60 C0.7,64.8 0.1,70.7 3.5,74.4 C6.9,78 12.9,77.8 17.3,75.5 C21.7,73.2 24.9,69.3 28.5,65.9 C35.1,59.6 43,54.6 51.5,51.5 C61.4,47.9 72.1,46.7 81.5,42"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:9884ec12c2d0": {
        d: {
          "0": {
            value: "M56.4,50.9 L56.7,50.8 C60.2,49.8 63.5,48.9 66.6,48.1 C69.7,47.3 72.4,46.4 74.7,45.6 C77,44.8 78.7,44 79.9,43.4 C81.1,42.8 81.7,42.4 81.7,42.3 L81.4,41.8 C81.3,41.6 78.7,42.9 74.2,44.3 C71.9,45 69.2,45.7 66.2,46.5 C63.2,47.3 59.8,48.1 56.2,49.1 L55.9,49.2 C49.4,51.1 43.2,53.9 37.7,57.5 C34.9,59.3 32.3,61.3 29.9,63.5 C27.4,65.6 25.3,68 23,70.2 C20.8,72.3 18.4,74.3 15.7,75.4 C14.4,76 12.9,76.3 11.5,76.4 C10.1,76.5 8.6,76.4 7.3,75.9 C4.6,75.1 2.8,72.7 2.2,70 C1.6,67.3 2,64.4 2.7,61.7 C4.3,56.2 6.5,51 9.2,46.3 C11.9,41.6 15.1,37.3 18.4,33.5 C25.2,25.9 32.8,19.9 40.1,15.1 C47.4,10.4 54.5,6.7 61,4.3 C64.3,3.1 67.4,2.4 70.3,2 C73.2,1.6 75.9,1.6 78.3,2 C83.1,2.7 86.6,4.5 88.7,5.8 C90.9,7.2 91.8,8.2 91.9,8.1 C91.9,8.1 91.7,7.8 91.2,7.3 C90.7,6.8 90,6.2 88.9,5.4 C86.8,3.9 83.3,2 78.4,1.2 C75.9,0.8 73.2,0.8 70.2,1.1 C67.2,1.4 64,2.2 60.7,3.3 C54,5.6 46.9,9.3 39.5,14 C32.1,18.7 24.4,24.7 17.4,32.5 C10.5,40.3 4.4,49.9 1.2,61.3 C0.5,64.2 2.29594121e-13,67.3 0.7,70.4 C1,72 1.7,73.5 2.8,74.8 C3.9,76.1 5.3,77 6.9,77.6 C8.5,78.2 10.1,78.3 11.8,78.2 C13.4,78.1 15,77.7 16.6,77.1 C19.7,75.8 22.2,73.7 24.5,71.6 C26.8,69.4 28.9,67 31.3,65 C33.7,62.9 36.2,61 38.9,59.2 C44.1,55.4 50,52.7 56.4,50.9 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:4024f68d4396": {
        "translation.x": { "0": { value: 22 } },
        "translation.y": { "0": { value: 175 } }
      },

      "haiku:187fc735a213": {
        d: {
          "0": {
            value: "M85.9,8.1 C81.9,4.2 76.3,1.8 70.7,1.4 C61.5,0.7 52.5,4.2 44.3,8.4 C26.7,17.4 10.5,30.7 1.3,47.9 C11.8,48.4 21.3,53.7 27.6,61.4 C33,57.2 39.1,53.8 45.5,51.5 C55.4,47.9 66.1,46.7 75.5,42"
          }
        },

        fill: { "0": { value: "#77C043" } }
      },

      "haiku:9caa507498a8": {
        d: {
          "0": {
            value: "M27.5,62.6 L27,62 C20.6,54.1 11.2,49.3 1.3,48.7 L0,48.6 L0.6,47.5 C11.3,27.5 30.1,14.8 44,7.7 C51.2,4 60.8,-0.2 70.8,0.6 C76.7,1.1 82.4,3.6 86.5,7.5 L85.4,8.6 C81.7,5 76.2,2.5 70.7,2.1 C61.1,1.3 51.8,5.4 44.7,9.1 C31.3,16 13.2,28.2 2.6,47.2 C12.2,48 21.3,52.8 27.7,60.4 C33.1,56.3 38.9,53.1 45.2,50.8 C49.2,49.3 53.4,48.3 57.5,47.2 C63.4,45.7 69.5,44.1 75.1,41.4 L75.8,42.8 C70.1,45.6 63.9,47.2 57.9,48.8 C53.9,49.8 49.7,50.9 45.7,52.4 C39.3,54.7 33.4,58 28,62.2 L27.5,62.6 Z"
          }
        },

        fill: { "0": { value: "#2F803E" } }
      },

      "haiku:b7f4be0d6279": { "translation.y": { "0": { value: 243 } } },
      "haiku:8b98726454f1": {
        d: {
          "0": {
            value: "M19.4,0 C18.1,0.5 16.8,1.1 15.6,1.9 C9.8,5.9 6.5,12.4 3.4,18.7 C2.4,20.7 1.5,22.7 1.4,24.9 C1.4,27.1 2.5,29.4 4.6,30.1 C5.6,27.1 8.1,24.6 11.1,23.7 C10.1,28.3 10,33.2 11,37.8 C11.3,39.2 12.3,40.9 13.6,40.5 C14.4,40.3 14.8,39.4 15.1,38.6 C16.6,34.5 18.1,30.4 19.6,26.3 C21.3,28.1 20.9,31 20.7,33.6 C20.5,36.1 21.2,39.3 23.7,39.8 C25.7,40.2 27.6,38.4 28.1,36.3 C28.6,34.2 28.2,32.2 27.9,30.1 C27.7,28 27.8,25.8 29.1,24.2 C30.3,26.1 30.3,28.5 30.8,30.6 C31.4,32.8 33.2,35 35.4,34.6 C37.4,34.2 38.3,31.8 38,29.8 C37.7,27.8 36.6,26 36,24.1 C35.4,22.2 35.4,19.8 36.9,18.5 C38.5,17.2 40.8,17.6 42.8,17.7 C44.8,17.8 47.4,16.9 47.6,14.9 C47.7,13.4 46.3,12.1 44.8,11.6 C43.4,11.1 41.8,11 40.4,10.3 C37.5,8.9 36.5,5.4 34.5,2.9"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:85c9c56cad5e": {
        d: {
          "0": {
            value: "M46.8,17.8 C46.9,17.8 47,17.7 47,17.7 C47.4,17.5 47.7,17.1 48.1,16.8 C48.4,16.4 48.6,15.9 48.7,15.4 C48.9,14.4 48.6,13.4 48,12.7 C46.9,11.3 45.3,10.8 44.1,10.5 C42.8,10.2 41.7,10 40.9,9.6 C40,9.2 39.4,8.5 38.8,7.8 C37.7,6.4 36.9,5 36.2,4.1 C35.5,3.2 35.1,2.8 35,2.8 L34.5,3.2 C34.4,3.3 34.7,3.7 35.3,4.7 C35.8,5.6 36.4,7 37.6,8.7 C38.2,9.5 39,10.4 40.1,11.1 C41.2,11.8 42.6,12 43.7,12.3 C44.3,12.5 44.9,12.6 45.3,12.9 C45.8,13.2 46.2,13.5 46.5,13.9 C47.1,14.7 47,15.7 46,16.3 C46,16.3 45.9,16.4 45.9,16.4 C45.3,16.7 44.5,16.9 43.8,17 C43.1,17 42.2,16.9 41.3,16.9 C40.4,16.9 39.4,16.8 38.4,17.1 C37.4,17.4 36.4,18 35.8,19 C35.2,19.9 35,21 35,22 C35,23 35.2,23.9 35.5,24.8 C36.1,26.5 36.9,28 37.3,29.5 C37.5,30.3 37.5,30.9 37.4,31.6 C37.3,32.3 36.9,32.9 36.5,33.4 C36.1,33.8 35.5,34 34.9,33.9 C34.3,33.8 33.8,33.5 33.3,33 C32.8,32.5 32.4,31.9 32.2,31.2 C31.9,30.6 31.8,29.8 31.7,29 C31.6,28.2 31.4,27.4 31.2,26.5 C31.1,26.3 31.1,26.1 31,25.8 C30.9,25.4 30.7,25.1 30.6,24.7 C30.3,24 29.9,23.5 29.5,22.9 C28.9,23.7 28.4,24.2 27.9,25.1 L27.6,25.8 C27.6,25.9 27.5,26 27.5,26.1 L27.4,26.3 C27.3,26.6 27.3,26.9 27.2,27.2 C27,28.3 27.1,29.4 27.2,30.5 C27.4,32.6 27.8,34.5 27.4,36.3 C27.2,37.1 26.8,37.9 26.2,38.5 C25.6,39.1 24.9,39.4 24.2,39.4 C23.5,39.3 22.9,39 22.4,38.3 C22,37.6 21.7,36.8 21.6,35.9 C21.5,35 21.5,34.2 21.6,33.2 C21.7,32.2 21.8,31.3 21.7,30.3 C21.7,29.8 21.6,29.3 21.5,28.8 C21.5,28.6 21.3,28.1 21.2,27.7 C21,27.3 20.8,27 20.6,26.7 C20.4,26.4 20.2,26.2 19.9,25.9 L19.5,25.5 L19.5,25.4 L19.5,25.5 L19.4,25.6 L19.3,25.8 L18.8,26.6 L18.4,27.8 C17.1,31.4 15.9,34.8 14.6,38.2 C14.3,39 14,39.8 13.6,40.2 C13.2,40.5 12.9,40.4 12.4,39.9 C12,39.4 11.7,38.7 11.6,37.9 C11.4,37.1 11.3,36.3 11.2,35.5 C10.8,32.3 10.9,29.2 11.3,26.2 C11.4,25.6 11.5,25 11.6,24.4 L11.7,23.5 L11.7,23.3 C11.7,23.2 11.8,23.1 11.7,23.2 L11.3,23.4 C10.2,23.8 8.8,24.4 8.4,24.7 C7.1,25.5 6,26.7 5.2,27.9 C5,28.2 4.8,28.5 4.6,28.9 C4.5,29.1 4.4,29.2 4.4,29.4 C4.3,29.5 4.3,29.5 4.3,29.6 C4.3,29.7 4.3,29.7 4.2,29.8 C4.1,29.8 4.1,29.8 4,29.7 C3.9,29.7 3.9,29.6 3.9,29.6 C3.8,29.6 3.7,29.4 3.6,29.4 C2.7,28.6 2.2,27.5 2,26.3 C1.8,25.2 2,23.9 2.4,22.8 C2.7,21.7 3.2,20.6 3.7,19.6 C4.7,17.5 5.6,15.6 6.6,13.8 C8.5,10.3 10.5,7.4 12.4,5.4 C13.4,4.4 14.3,3.6 15.1,2.9 C15.9,2.2 16.7,1.8 17.3,1.4 C18.6,0.7 19.3,0.4 19.3,0.4 C19.3,0.4 19.1,0.4 18.7,0.5 C18.3,0.6 17.8,0.8 17.1,1.1 C16.4,1.4 15.6,1.9 14.7,2.5 C13.8,3.1 12.8,3.9 11.8,4.9 C9.8,6.9 7.6,9.7 5.7,13.3 C4.7,15.1 3.7,17 2.7,19.1 C2.2,20.1 1.7,21.2 1.3,22.4 C0.9,23.6 0.7,24.9 0.8,26.3 C1,27.7 1.6,29.1 2.8,30.1 C3,30.2 3.1,30.3 3.3,30.5 C3.5,30.7 3.8,30.8 4,30.9 C4.2,31 4.5,31.1 4.8,31.2 C4.8,31.2 4.9,31.2 4.9,31.2 L4.9,31.1 L5,30.9 L5.2,30.5 C5.3,30.3 5.4,29.9 5.5,29.8 C5.6,29.6 5.6,29.5 5.7,29.4 C5.8,29.1 6,28.8 6.2,28.6 C6.9,27.5 7.9,26.5 9.1,25.8 C9.9,25.3 9.9,25.4 10.1,25.3 L10.2,25.3 C10.2,25.3 10.2,25.3 10.2,25.4 L10.2,25.6 L10.2,25.8 L10.1,26.1 C9.6,29.2 9.5,32.5 9.9,35.8 C10,36.6 10.1,37.5 10.3,38.3 C10.5,39.2 10.8,40.1 11.4,40.9 C11.7,41.3 12.2,41.7 12.8,41.9 C13.5,42 14.2,41.9 14.6,41.4 C15.5,40.6 15.7,39.6 16,38.8 C17.2,35.6 18.4,32.3 19.6,29 L19.7,28.8 C19.7,28.8 19.7,28.8 19.7,28.8 C19.7,28.8 19.7,28.8 19.7,28.9 C19.7,28.9 19.7,29 19.7,29 C19.7,29.1 19.7,29 19.8,29.2 C19.9,29.6 19.9,30 19.9,30.5 C19.9,31.4 19.9,32.3 19.8,33.2 C19.7,34.1 19.6,35.2 19.8,36.2 C19.9,37.2 20.2,38.3 20.9,39.3 C21.5,40.3 22.7,41.1 24,41.2 C25.3,41.3 26.5,40.7 27.3,39.9 C28.1,39.1 28.7,38 29,36.9 C29.5,34.7 29,32.5 28.8,30.6 C28.7,29.6 28.7,28.7 28.8,27.8 C28.8,27.6 28.9,27.4 28.9,27.1 L29,26.8 L29,26.8 C29,26.8 29,26.8 29,26.8 C29,26.8 29,26.8 29,26.8 L29.1,27.3 C29.3,28 29.4,28.8 29.5,29.7 C29.6,30.5 29.8,31.4 30.1,32.3 C30.4,33.2 30.9,34 31.6,34.7 C32.3,35.4 33.2,36 34.3,36.2 C35.4,36.4 36.6,36 37.4,35.2 C38.2,34.4 38.6,33.5 38.8,32.5 C39,31.6 39,30.5 38.7,29.6 C38.3,27.8 37.4,26.2 36.9,24.7 C36.4,23.3 36.3,21.6 37,20.5 C37.3,20 37.9,19.6 38.6,19.4 C39.3,19.2 40.1,19.2 40.9,19.2 C41.8,19.2 42.6,19.4 43.6,19.3 C44.8,18.6 45.8,18.4 46.8,17.8 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:87c07883413c": {
        "translation.x": { "0": { value: 53 } },
        "translation.y": { "0": { value: 312 } }
      },

      "haiku:bc354b9e4a38": {
        d: {
          "0": {
            value: "M66,26.9 C68.9,21.9 70.6,15.4 67.7,10.3 C65.8,7.1 62.4,5.1 58.9,3.7 C47.2,-0.9 33.4,0.6 22.9,7.5 C19,10.1 15.2,13.5 10.6,14.1 C7.8,14.4 4.6,13.8 2.5,15.6 C2.25375274e-13,17.8 1.1,22.3 3.9,24.2 C6.6,26.1 10.2,26.1 13.6,25.9 C10.2,27.1 6.7,28.5 4.5,31.3 C2.3,34.1 2.1,38.9 5.1,40.8 C8.6,43.1 13,40.3 16.2,37.6 C14.7,38.6 13.3,39.7 12.3,41.2 C11.3,42.7 11,44.7 12,46.2 C13.2,48 16,48.2 17.9,47.2 C19.8,46.2 21.2,44.3 22.4,42.5 C19.2,44 18.9,49.4 22,51.2 C25,53 29.6,50.3 29.4,46.7 C29.2,48.4 28.9,50.1 28.7,51.8 C33.5,53.1 39,49.6 39.9,44.7 C50.6,43.1 60.5,36.4 66,26.9 Z"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:e551edc36a05": {
        d: {
          "0": {
            value: "M43.8,44.9 L44.1,44.8 C48,43.7 51.5,42 54.4,40.1 C57.3,38.2 59.7,36.1 61.5,34.1 C63.3,32.1 64.5,30.4 65.3,29.1 C66,27.8 66.4,27.1 66.3,27.1 L65.8,26.8 C65.6,26.7 64.1,29.5 60.5,33.1 C58.7,34.9 56.4,36.9 53.6,38.6 C50.8,40.4 47.4,42 43.7,43 L43.4,43.1 C42.5,43.3 41.5,43.6 40.5,43.7 L39.2,43.9 L39.1,43.9 C39.1,43.9 39.1,44 39.1,44 L39.1,44.2 L39,44.6 L38.9,45.2 C38.9,45.4 38.8,45.6 38.7,45.8 C38.6,46 38.5,46.2 38.4,46.4 C37.6,48 36.3,49.3 34.7,50.2 C33.9,50.6 33.1,50.9 32.2,51.1 C31.8,51.2 31.3,51.2 30.9,51.2 C30.7,51.2 30.5,51.2 30.2,51.2 L29.8,51.2 C29.8,51.2 29.8,51.2 29.8,51.2 L30,49.8 C30.1,48.8 30.3,47.9 30.4,46.9 C29.8,46.9 29.2,46.9 28.6,46.8 C28.7,48.2 27.8,49.5 26.5,50.3 C25.2,51.1 23.6,51.2 22.5,50.5 C21.4,49.8 20.8,48.3 20.9,46.8 C21,45.3 21.7,43.9 22.9,43.4 C22.5,43 22.2,42.5 21.8,42.1 C20.7,43.7 19.5,45.3 18,46.3 C17.3,46.8 16.5,47 15.6,47 C14.8,47 13.9,46.8 13.4,46.4 C12.8,46 12.5,45.3 12.4,44.5 C12.3,43.7 12.5,42.9 12.9,42.2 C13.7,40.7 15.2,39.6 16.8,38.5 C16.4,38 16.1,37.6 15.8,37.1 C14.7,38 13.6,38.9 12.4,39.5 C11.2,40.2 9.9,40.7 8.7,40.8 C8.1,40.9 7.5,40.8 6.9,40.6 C6.3,40.4 5.8,40.1 5.4,39.8 C4.5,39 4,37.8 4,36.6 C3.9,35.4 4.2,34.1 4.7,33 C5.2,31.9 6.1,31 7.1,30.2 C9.1,28.6 11.6,27.7 14.1,26.7 L19.2,24.8 L13.8,25.1 C11.8,25.2 9.8,25.3 8,24.9 C6.2,24.5 4.5,23.7 3.4,22.4 C2.4,21 1.8,19.2 2.3,17.7 C2.5,16.9 3,16.3 3.6,15.9 C4.2,15.5 5,15.2 5.9,15.1 C7.6,14.9 9.5,15.1 11.4,14.8 C13.3,14.5 15.1,13.8 16.6,12.9 C19.7,11.1 22.3,8.8 25.1,7.2 C30.7,3.9 36.7,2.2 42.4,1.8 C48,1.4 53.3,2.2 57.7,3.7 C59.9,4.4 62,5.4 63.7,6.5 C65.4,7.6 66.8,9.1 67.7,10.6 C68.6,12.2 69,13.8 69.1,15.3 C69.2,16.8 69.1,18.2 68.8,19.5 C68.3,22 67.5,23.8 67,25 C66.5,26.2 66.1,26.8 66.2,26.8 C66.2,26.8 66.3,26.7 66.5,26.4 C66.7,26.1 66.9,25.7 67.3,25.1 C67.9,23.9 68.8,22.1 69.4,19.6 C69.7,18.3 69.9,16.9 69.8,15.3 C69.7,13.7 69.3,11.9 68.4,10.2 C67.5,8.5 66,7 64.2,5.7 C62.4,4.5 60.3,3.5 58,2.7 C53.5,1 48.1,0.2 42.3,0.5 C36.5,0.8 30.2,2.5 24.4,5.9 C21.5,7.6 18.9,9.8 15.9,11.5 C14.4,12.3 12.8,13 11.1,13.2 C9.4,13.5 7.6,13.2 5.6,13.5 C4.6,13.6 3.6,13.9 2.7,14.5 C1.8,15.1 1.1,16.1 0.8,17.1 C0.5,18.2 0.5,19.3 0.8,20.3 C1.1,21.3 1.5,22.3 2.2,23.2 C2.9,24.1 3.8,24.8 4.7,25.3 C5.6,25.8 6.7,26.1 7.7,26.3 C9.8,26.7 11.9,26.7 13.9,26.6 C13.8,26.1 13.7,25.6 13.6,25.1 C11.1,26 8.4,27 6.1,28.8 C5,29.7 3.9,30.8 3.2,32.2 C2.5,33.6 2.2,35.1 2.3,36.7 C2.4,38.3 3,39.9 4.3,41 C4.9,41.6 5.7,41.9 6.5,42.2 C7.3,42.4 8.1,42.5 9,42.4 C10.6,42.2 12.1,41.6 13.4,40.9 C14.7,40.2 15.9,39.2 17.1,38.3 L16.1,36.9 C14.5,38 12.8,39.2 11.7,41.2 C11.2,42.2 10.9,43.3 11,44.5 C11.1,45.7 11.7,46.9 12.7,47.6 C13.7,48.3 14.9,48.6 16.1,48.6 C17.2,48.6 18.4,48.2 19.4,47.6 C21.3,46.4 22.6,44.6 23.7,43 L25.6,40.3 L22.6,41.7 C21.7,42.1 20.9,42.9 20.4,43.8 C19.9,44.7 19.6,45.7 19.6,46.6 C19.5,47.6 19.7,48.6 20.1,49.5 C20.5,50.4 21.2,51.3 22.1,51.9 C23,52.5 24.1,52.7 25.1,52.7 C26.1,52.6 27.1,52.3 28,51.8 C28.9,51.3 29.6,50.6 30.2,49.7 C30.8,48.8 31.1,47.8 31,46.7 L29.2,46.6 C29.1,47.6 28.9,48.5 28.8,49.5 L28.6,51 L28.4,52.5 C28.3,52.7 28.5,52.6 28.6,52.7 L29,52.8 L29.7,52.9 C30.3,53 30.4,53 30.7,53 C31,53 31.2,53 31.5,53 C32,53 32.6,52.9 33.1,52.9 C34.2,52.7 35.2,52.3 36.2,51.8 C37.2,51.3 38,50.6 38.8,49.9 C39.6,49.1 40.2,48.2 40.7,47.2 C40.8,47 40.9,46.7 41,46.4 C41.1,46.1 41.2,45.9 41.3,45.6 L41.3,45.5 L41.3,45.5 L41.3,45.5 C41.3,45.5 41.3,45.5 41.3,45.5 C41.3,45.5 41.3,45.5 41.3,45.5 L41.5,45.5 C41.8,45.4 42.8,45.2 43.8,44.9 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:efa408038007": {
        "translation.x": { "0": { value: 193 } },
        "translation.y": { "0": { value: 267 } }
      },

      "haiku:0632a16fd4c5": {
        d: {
          "0": {
            value: "M15.5,48.3 C10.8,48.6 5.5,47.5 2.7,43.8 C0.9,41.4 0.6,38.4 0.7,35.6 C1.2,26.2 6.9,17.3 15.4,12.6 C18.6,10.8 22.4,9.5 24.3,6.5 C25.5,4.7 26,2.3 28.1,1.5 C30.6,0.6 33.5,2.9 34,5.4 C34.5,7.9 33.3,10.3 32.1,12.5 C34.1,10.6 36.3,8.7 39.1,8.2 C41.9,7.7 45.5,9.2 45.9,11.9 C46.4,15 42.9,17.1 39.9,18.3 C41.1,17.7 42.4,17 43.8,16.9 C45.2,16.8 46.8,17.3 47.6,18.4 C48.5,19.8 47.7,21.8 46.3,22.7 C44.9,23.7 43.1,23.9 41.4,24.1 C43.6,22.4 47.6,24.1 48,26.8 C48.3,29.5 44.8,31.6 42.2,30.3 C43.5,30.7 44.9,31.2 46.2,31.6 C45.6,35.3 41.1,37.8 37.3,36.7 C32.5,43.4 24.2,47.8 15.5,48.3 Z"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:83aec60d5cad": {
        d: {
          "0": {
            value: "M34.7,38.5 C34.7,38.6 34.6,38.6 34.5,38.7 C33.5,39.8 32.4,40.7 31.3,41.6 C30.2,42.4 29.1,43.2 27.9,43.8 C25.7,45.1 23.5,46 21.6,46.5 C17.8,47.6 15.4,47.8 15.4,48 L15.4,48.6 C15.4,48.7 16,48.7 17.2,48.7 C18.3,48.6 20,48.4 22,47.9 C24,47.4 26.3,46.6 28.8,45.3 C30,44.7 31.2,43.9 32.4,43 C33.6,42.1 34.8,41.1 35.9,39.9 C36,39.8 36,39.8 36.1,39.7 C36.6,39.1 37.2,38.5 37.7,37.8 L37.7,37.7 C37.7,37.7 37.7,37.7 37.7,37.7 L37.7,37.7 L37.7,37.7 L37.9,37.7 L37.9,37.7 L37.9,37.7 L38,37.7 L38.3,37.7 C38.5,37.7 38.7,37.8 39,37.7 C40.8,37.7 42.5,37.2 44,36.2 C44.7,35.7 45.4,35.1 45.9,34.4 C46.2,34 46.4,33.7 46.6,33.3 C46.7,33.1 46.8,32.9 46.9,32.7 C47,32.4 47.1,32 47.2,31.6 L47.3,31 L47.3,30.9 C47.3,30.9 47.3,30.8 47.3,30.8 L47,30.7 C46.7,30.6 46.3,30.5 45.9,30.3 L44.7,29.9 C44,29.7 43.2,29.4 42.5,29.2 L41.8,30.9 C43.4,31.7 45.3,31.5 46.6,30.6 C47.3,30.2 47.9,29.6 48.4,28.8 C48.8,28.1 49,27.1 48.9,26.2 C48.7,25.3 48.3,24.5 47.7,24 C47.1,23.4 46.4,23 45.7,22.7 C45,22.4 44.2,22.3 43.3,22.3 C42.5,22.3 41.6,22.6 40.9,23.1 L38.2,25.2 L41.6,24.7 C43.2,24.5 44.9,24.3 46.5,23.4 C47.3,23 48,22.2 48.5,21.4 C48.9,20.6 49.2,19.5 48.9,18.5 C48.6,17.5 47.8,16.7 47,16.3 C46.2,15.9 45.2,15.7 44.3,15.7 C42.5,15.8 41,16.6 39.6,17.3 L40.3,18.9 C41.4,18.4 42.5,17.9 43.5,17.3 C44.5,16.6 45.5,15.8 46.2,14.7 C46.9,13.6 47.1,12 46.6,10.7 C46.1,9.4 45,8.5 43.9,7.9 C42.8,7.3 41.6,7.1 40.4,7 C39.2,7 38,7.3 36.9,7.8 C34.8,8.8 33.1,10.3 31.6,11.7 C32,12 32.4,12.4 32.8,12.7 C33.6,11.3 34.3,9.9 34.7,8.2 C34.9,7.4 35,6.5 34.9,5.7 C34.8,4.9 34.5,4 34.1,3.2 C33.2,1.8 31.8,0.6 30,0.4 C29.1,0.3 28.2,0.4 27.4,0.8 C26.6,1.2 26,1.9 25.6,2.5 C24.7,3.8 24.3,5.2 23.5,6.2 C22.8,7.2 21.7,8.1 20.7,8.8 C18.5,10.2 16,11.2 13.8,12.6 C9.4,15.4 6,19.1 3.8,23.1 C1.6,27 0.5,31.2 0.3,34.9 C0.2,36.8 0.3,38.6 0.7,40.2 C1.1,41.8 1.9,43.3 2.9,44.4 C3.9,45.5 5.1,46.3 6.2,46.8 C7.3,47.3 8.4,47.6 9.4,47.9 C11.4,48.3 12.9,48.3 13.9,48.3 C14.4,48.3 14.8,48.3 15.1,48.2 C15.4,48.2 15.5,48.1 15.5,48.1 C15.5,48 15,48.1 13.9,48 C12.9,47.9 11.4,47.9 9.5,47.4 C7.6,46.9 5.3,46 3.4,44 C2.5,43 1.8,41.6 1.5,40.1 C1.1,38.6 1.1,36.8 1.2,35 C1.5,31.4 2.6,27.5 4.8,23.7 C7,20 10.2,16.4 14.5,13.8 C16.6,12.5 19.1,11.5 21.5,10 C22.7,9.2 23.9,8.3 24.7,7.1 C25.6,5.9 26.1,4.5 26.8,3.4 C27.2,2.9 27.6,2.4 28.1,2.2 C28.6,1.9 29.2,1.9 29.8,2 C31,2.2 32.1,3.1 32.8,4.2 C33.5,5.3 33.5,6.7 33.2,8 C32.9,9.4 32.2,10.7 31.4,12 L28.8,16.4 L32.6,12.9 C34.1,11.5 35.7,10.1 37.5,9.3 C38.4,8.9 39.4,8.7 40.3,8.7 C41.3,8.7 42.2,8.9 43.1,9.4 C43.9,9.8 44.7,10.5 45,11.3 C45.3,12.1 45.2,13 44.7,13.8 C44.2,14.6 43.4,15.3 42.5,15.8 C41.6,16.4 40.6,16.8 39.6,17.3 C39.8,17.8 40.1,18.3 40.3,18.9 C41.6,18.2 42.9,17.6 44.2,17.6 C45.5,17.6 46.8,18.2 47,19.2 C47.1,19.7 47,20.3 46.8,20.8 C46.5,21.3 46.1,21.8 45.5,22.1 C44.3,22.8 42.8,23 41.3,23.2 C41.5,23.7 41.7,24.3 42,24.8 C42.7,24.2 44,24.2 45,24.6 C46,25 46.9,25.8 47.1,26.8 C47.3,27.7 46.7,28.7 45.7,29.3 C44.8,29.9 43.5,30 42.6,29.5 C42.4,30 42.1,30.6 41.9,31.2 C42.6,31.4 43.4,31.7 44.1,31.9 L45.1,32.2 L45.1,32.2 L45.1,32.2 C45,32.4 45,32.5 44.9,32.6 C44.8,32.9 44.6,33.2 44.4,33.4 C44,33.9 43.5,34.4 42.9,34.8 C41.8,35.6 40.4,36 39,35.9 C38.8,35.9 38.7,35.9 38.5,35.9 L38.2,35.9 L38.1,35.9 L38,35.9 L37.8,35.8 L37.3,35.7 L37.1,35.6 L37,35.6 C37,35.6 36.9,35.7 36.9,35.7 L36.2,36.6 C35.8,37.3 35.2,37.9 34.7,38.5 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:199fdbe10ae5": {
        "translation.x": { "0": { value: 43 } },
        "translation.y": { "0": { value: 43 } }
      },

      "haiku:6dcad20e5d51": {
        d: {
          "0": {
            value: "M41.1,8.1 C31.4,12 22.2,17.6 14.8,25.1 C2.3,37.9 -0.4,57.9 2.6,75.1 C5.8,93.5 16.7,109.4 30.2,121.8 C39.9,130.7 49.1,135.2 62.4,136.1 C79.2,137.3 97.3,134.3 113.2,128.6 C134,121.3 149.6,96.2 139.9,74.7 C137.3,68.8 132.8,63.9 129.7,58.3 C124,47.9 124.1,36.1 119.1,25.6 C109,4.1 87.8,-1.3 65.8,1.5 C57.9,2.6 49.3,4.7 41.1,8.1 Z"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:f68660bf88ba": {
        d: {
          "0": {
            value: "M93,2.1 L92.5,2 C89,1 85.4,0.5 81.9,0.2 C80.2,0.1 78.5,0 76.8,0 C76,0 75.2,0 74.3,0 C73.5,0 72.7,0.1 71.9,0.1 C71.1,0.2 70.3,0.2 69.6,0.3 C68.8,0.4 68.1,0.5 67.3,0.5 C65.8,0.6 64.4,0.9 63,1.1 C60.2,1.6 57.7,2.1 55.4,2.7 C50.8,3.9 47.1,5.1 44.7,6.1 C43.5,6.6 42.5,7 41.9,7.3 C41.3,7.6 40.9,7.8 41,7.8 L41.2,8.4 C41.2,8.5 42.6,8 45.1,7.2 C47.6,6.4 51.2,5.3 55.8,4.2 C58.1,3.7 60.6,3.2 63.3,2.8 C64.7,2.6 66.1,2.4 67.5,2.3 C68.2,2.2 69,2.2 69.7,2.1 C70.5,2 71.2,2 72,2 C72.8,2 73.6,1.9 74.3,1.9 C75.1,1.9 75.9,1.9 76.7,1.9 C77.1,1.9 77.5,1.9 77.9,1.9 C78.3,1.9 78.7,1.9 79.1,2 C79.9,2 80.8,2.1 81.6,2.1 C84.9,2.4 88.4,2.9 91.8,3.9 L92.3,4 C93.1,4.2 93.9,4.5 94.6,4.7 C95.4,5 96.1,5.2 96.9,5.5 C98.4,6.2 99.9,6.8 101.3,7.6 C104.2,9.1 106.7,11.1 109.1,13.2 C113.7,17.6 117.2,23.1 119.6,29 C121.9,34.9 122.9,41.3 124.6,47.5 C125.4,50.6 126.5,53.7 127.8,56.6 C129.2,59.5 131,62.2 132.7,64.8 C134.5,67.4 136.3,69.9 137.7,72.6 C139.2,75.2 140.3,78.1 140.9,81 C142.3,86.8 141.9,93 140.3,98.6 C138.7,104.3 135.8,109.5 132.1,114 C128.4,118.5 124,122.2 119.1,125 C116.6,126.4 114.1,127.5 111.4,128.4 C108.7,129.3 106,130.1 103.4,130.9 C98,132.4 92.6,133.5 87.3,134.3 C81.9,135.1 76.6,135.6 71.4,135.6 C70.1,135.6 68.8,135.6 67.5,135.6 L65.6,135.6 L63.7,135.5 C61.1,135.4 58.6,135.1 56.1,134.7 C51.1,133.8 46.4,132.2 42.2,129.8 C40.1,128.6 38.1,127.3 36.1,125.9 C34.2,124.5 32.4,122.9 30.6,121.3 C23.6,114.9 17.7,107.9 13.2,100.6 C8.6,93.3 5.5,85.6 3.8,78 C2.9,74.2 2.5,70.4 2.2,66.8 C2,63.1 2,59.6 2.3,56.2 C2.9,49.4 4.5,43.1 6.9,37.7 C8.1,35 9.5,32.6 11,30.4 C12.6,28.2 14.2,26.3 15.9,24.6 C19.3,21.2 22.8,18.6 25.9,16.5 C29,14.4 31.8,12.9 34,11.7 C36.3,10.5 38,9.7 39.2,9.2 C39.8,8.9 40.2,8.7 40.6,8.6 C40.9,8.5 41.1,8.4 41,8.4 C41,8.4 40.8,8.4 40.5,8.5 C40.2,8.6 39.7,8.8 39.1,9 C37.9,9.5 36.1,10.3 33.8,11.4 C31.5,12.5 28.7,14 25.5,16.1 C22.4,18.2 18.9,20.8 15.3,24.2 C13.5,25.9 11.8,27.9 10.2,30.1 C8.7,32.3 7.1,34.8 5.9,37.5 C3.4,42.9 1.7,49.3 1.1,56.2 C0.7,59.7 0.7,63.3 0.9,67 C1.1,70.7 1.6,74.5 2.4,78.4 C4.1,86.1 7.3,94 11.9,101.5 C16.5,109 22.5,116.1 29.5,122.6 C31.3,124.2 33.1,125.8 35.1,127.3 C37.1,128.8 39.1,130.1 41.3,131.4 C45.7,133.9 50.6,135.5 55.7,136.5 C58.3,137 60.9,137.2 63.5,137.4 C64.2,137.4 64.8,137.5 65.5,137.5 C66.2,137.5 66.8,137.5 67.5,137.6 C68.8,137.7 70.1,137.6 71.5,137.6 C76.8,137.5 82.2,137.1 87.7,136.3 C93.1,135.5 98.6,134.4 104,132.9 C106.7,132.1 109.4,131.3 112.1,130.4 C114.8,129.5 117.5,128.4 120.1,126.9 C125.2,124 129.8,120.1 133.6,115.5 C137.4,110.9 140.4,105.5 142.2,99.5 C143.9,93.6 144.3,87.2 142.9,81 C142.2,77.9 141,74.9 139.5,72.2 C138,69.4 136.1,66.8 134.4,64.3 C132.6,61.7 130.9,59.1 129.6,56.4 C128.3,53.6 127.3,50.6 126.5,47.6 C124.8,41.5 123.8,35.1 121.5,28.9 C119.1,22.8 115.5,17 110.6,12.4 C108.1,10.2 105.4,8.1 102.4,6.5 C101,5.6 99.4,5 97.8,4.3 C97,4 96.2,3.7 95.4,3.4 C94.6,2.6 93.8,2.3 93,2.1 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:ba092b7ad5c7": {
        d: {
          "0": {
            value: "M105.5,171.7 C98.6,173.4 91.1,172.3 84.6,169.5 C78,166.7 72.3,162.1 67.5,156.9 C65.8,155 64.1,153 62.5,151 C61.9,150.3 61.8,149.3 62.4,148.6 C63.4,147.3 65.1,148.4 66.1,149.5 C71.5,155 77.3,160.3 83.8,164.4 C90.4,168.4 97.8,171.3 105.5,171.7 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:82a6bc5449ea": {
        d: {
          "0": {
            value: "M82.4,50.6 C94.5,46.2 107.1,41.8 120,42.8 C133.6,43.9 146.2,51.2 155.8,60.9 C143.5,55.5 129.3,55.3 116.4,59 C99.4,63.9 84.3,75.5 75.3,90.7 C66.2,105.9 63.2,124.7 67.1,142 C58,130.5 50,117.7 47.2,103.3 C44.4,88.9 47.8,72.7 58.7,62.8 C65.3,56.8 74,53.6 82.4,50.6 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:3eed044cbd9e": {
        d: {
          "0": {
            value: "M135.4,118.9 C132.2,119.6 128.4,119.5 126.1,117.1 C123.8,114.6 124.1,110.5 126,107.7 C127.9,104.9 131.1,103.2 134.2,101.8 C137.6,100.4 141.3,99.2 144.8,100 C148.4,100.8 151.5,104.3 150.7,107.9 C150.3,109.7 149,111.2 147.7,112.4 C144.3,115.7 140,117.9 135.4,118.9 Z"
          }
        },

        fill: { "0": { value: "#FAAE71" } }
      },

      "haiku:63affce7ef69": {
        d: {
          "0": {
            value: "M109.1,102.3 C109,99.9 106.7,98 104.3,97.8 C101.9,97.6 99.6,98.6 97.7,100.1 C93.4,103.4 91,108.9 91.4,114.3 C93.6,106.9 101.4,101.6 109.1,102.3 Z"
          }
        },

        fill: { "0": { value: "#934730" } }
      },

      "haiku:d65c75b11afe": {
        d: {
          "0": {
            value: "M138.4,125.6 C141.1,124 144.2,122.6 147.2,123.4 C150.8,124.3 153,128.1 153.6,131.8 C153.9,133.5 153.7,135.6 152.3,136.5 C150.7,137.6 148.6,136.7 146.6,136.6 C143.6,136.5 140.9,138.3 138.6,140.4 C136.3,142.4 134.2,144.7 131.3,145.7 C128.4,146.7 124.6,145.7 123.6,142.9 C122.7,140.3 124.5,137.6 126.4,135.5 C129.8,131.5 133.9,128.2 138.4,125.6 Z"
          }
        },

        fill: { "0": { value: "#934730" } }
      },

      "haiku:b3c1f6881274": {
        d: {
          "0": {
            value: "M139.6,92 C138.7,88.2 142,84.3 145.9,83.8 C149.8,83.4 153.5,85.9 155.4,89.3 C149.1,87.6 143.7,86.9 139.6,92 Z"
          }
        },

        fill: { "0": { value: "#934730" } }
      },

      "haiku:b4418376e47c": {
        d: {
          "0": {
            value: "M91.8,87.4 C92.3,86.6 92.9,85.7 93.1,84.7 C93.2,84.2 93.3,83.7 93.1,83.2 C92.8,82.4 91.7,82.1 90.9,82.3 C90.1,82.5 89.4,83.1 88.8,83.8 C85.7,87.2 84,92 84.4,96.6 C87.2,93.8 89.7,90.7 91.8,87.4 Z"
          }
        },

        fill: { "0": { value: "#F9A163" } }
      },

      "haiku:3e06aac4ed71": {
        d: {
          "0": {
            value: "M143,75.6 C143.6,75.6 144.4,75.5 144.7,74.9 C145.1,74.2 144.6,73.3 144,72.8 C141.4,70.2 137.3,69.3 133.7,70.4 C133.4,72.4 135,74.4 136.9,75.1 C138.8,75.8 141,75.7 143,75.6 Z"
          }
        },

        fill: { "0": { value: "#F9A163" } }
      },

      "haiku:6d90708bf332": {
        d: {
          "0": {
            value: "M126.4,104.8 C128.2,102.2 131.6,101.2 134.7,100.4 C136.5,100 138.2,99.5 140.1,99.6 C141.9,99.7 143.8,100.6 144.7,102.1 C146.2,104.8 144.5,108.2 142.2,110.2 C139,113.1 134.7,114.8 130.4,114.8 C128.8,114.8 127.1,114.5 125.9,113.5 C124,111.8 124.1,108.5 125.6,106.3 C127,104.2 125,107 126.4,104.8 Z"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:4130e4b8a29c": {
        d: {
          "0": {
            value: "M142.3,135.1 C140.1,135.4 138.4,137 136.7,138.5 C135.1,140 133,141.4 130.8,141.1 C131.5,135.7 135.8,130.9 141.1,129.7 C142.7,129.3 144.5,129.3 145.8,130.2 C147.1,131.1 147.6,133.4 146.3,134.4 C145.4,135.3 143.7,134.9 142.3,135.1 Z"
          }
        },

        fill: { "0": { value: "#EC7256" } }
      },

      "haiku:7904fb95714b": {
        d: {
          "0": {
            value: "M98.7,139.7 C103.3,139.2 106.3,134.4 107.5,129.9 C108.7,125.4 108.9,120.5 111.4,116.6 C112.7,114.5 114.6,112.2 113.5,110 C112.8,108.7 111.3,108.1 109.9,107.9 C105.2,107.1 100.2,108.7 96.5,111.8 C92.8,114.9 90.4,119.3 89.4,124 C88.6,127.5 88.6,131.3 90.2,134.5 C91.6,137.6 95.1,140.1 98.7,139.7 Z"
          }
        },

        fill: { "0": { value: "url(#linearGradient-1-756e26)" } }
      },

      "haiku:3fe699c2e695": {
        d: {
          "0": {
            value: "M152,100.3 C154.2,105.9 159.8,110.1 165.8,110.4 C167.2,110.5 168.8,110.3 169.7,109.3 C170.8,108.1 170.6,106.2 170.1,104.6 C168.2,98.9 162.9,94.5 156.9,93.8 C155.2,93.6 153.3,93.8 152.2,95.1 C151.1,96.5 151.4,98.6 152,100.3 Z"
          }
        },

        fill: { "0": { value: "url(#linearGradient-2-756e26)" } }
      },

      "haiku:ec38f68164b4": {
        d: {
          "0": {
            value: "M98,49.3 C110.7,51.4 123.4,53.4 136,55.5 C134.1,53.8 132.2,52 130.2,50.3 C143.3,57.5 157.2,65.4 164.3,78.5 C168.2,85.8 169.7,94.1 171,102.3 C174.9,94.2 176.9,85.1 176.1,76.2 C175.2,67.3 171.4,58.5 164.9,52.4 C157,44.9 146,41.6 135.5,38.6 C124.3,35.4 112.3,32.2 101.2,35.8 C94.8,37.9 89.3,42.1 82.9,44.1 C78.2,45.6 73.2,45.9 68.4,47.1 C56,50.4 46.3,60 39.3,70.6 C31.1,83.1 26,98.1 27.7,113 C29.4,127.9 38.9,142.2 53,147.2 C54.1,141.7 60.6,138.6 61.6,133.1 C61.9,131.6 61.7,130.1 61.5,128.7 C60.5,120 59.5,111.2 58.5,102.5 C59.1,111.6 61.6,120.6 65.7,128.7 C65.5,114.1 66.3,99.5 68.1,85 C68.5,90.5 70.7,95.8 74.4,99.9 C69.1,87 66.9,72.8 68,58.9 C70.7,62.2 73.4,65.5 76.1,68.8 C84.8,60.9 96.2,56.2 107.9,55.4 C105,52.8 101.7,50.7 98,49.3 Z"
          }
        },

        fill: { "0": { value: "#E09628" } }
      },

      "haiku:fa853a71c991": {
        "translation.x": { "0": { value: 37 } },
        "translation.y": { "0": { value: 125 } }
      },

      "haiku:c24395434caf": {
        d: {
          "0": {
            value: "M20.5,8.3 C18.5,5.8 16.3,3.4 13.4,2.1 C10.5,0.8 6.9,0.7 4.4,2.7 C2.3,4.4 1.4,7.1 1.1,9.7 C0.3,17.2 3.8,25.1 9.9,29.5 C12.8,31.6 16.6,33 20.1,31.9 C24.6,30.5 27,25.3 26.5,20.7"
          }
        },

        fill: { "0": { value: "#FDCEA5" } }
      },

      "haiku:838abcc89137": {
        d: {
          "0": {
            value: "M24.9,29.7 L24.9,29.7 C26.6,27.5 27.2,25.1 27.3,23.4 C27.4,21.7 27.1,20.7 26.9,20.7 L26.3,20.8 C26.1,20.8 26.1,21.8 25.8,23.3 C25.5,24.8 24.9,26.8 23.5,28.6 L23.4,28.7 C22.1,30.3 20.3,31.4 18.3,31.5 C16.3,31.7 14.3,31.1 12.5,30.2 C8.9,28.3 6.1,25.3 4.3,22 C2.5,18.7 1.7,15.1 1.7,11.7 C1.7,10 1.9,8.4 2.4,7 C2.9,5.6 3.6,4.3 4.6,3.4 C5.6,2.5 6.9,2.1 8.1,1.9 C9.3,1.7 10.5,1.9 11.6,2.1 C13.8,2.7 15.4,3.9 16.7,4.9 C17.9,5.9 18.8,6.9 19.4,7.5 C20,8.1 20.3,8.4 20.4,8.4 C20.4,8.4 20.2,8 19.7,7.3 C19.2,6.6 18.4,5.6 17.2,4.4 C16,3.3 14.3,1.9 11.9,1.2 C10.7,0.8 9.4,0.7 8,0.8 C6.6,0.9 5.1,1.4 3.8,2.5 C2.5,3.5 1.6,5 1.1,6.6 C0.5,8.2 0.3,10 0.3,11.8 C0.2,15.4 1,19.3 2.9,22.9 C4.8,26.5 7.7,29.8 11.7,31.9 C13.7,32.9 16,33.6 18.4,33.4 C19.6,33.3 20.8,32.9 21.9,32.3 C23.1,31.5 24.1,30.6 24.9,29.7 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:8051d4bb8ee8": {
        d: {
          "0": {
            value: "M158,85.1 C157.2,86.6 155.9,88.4 154.2,88.1 C153,87.9 152.1,86.8 150.9,86.7 C153.3,86.2 155.6,85.6 158,85.1 Z"
          }
        },

        fill: { "0": { value: "#934730" } }
      },

      "haiku:3ba32602b3e6": {
        d: {
          "0": {
            value: "M87,111 C89.8,110.2 92.5,108.7 94.6,106.6 C93.2,108.7 91.9,110.8 90.5,113 C89.3,112.4 88.1,111.7 87,111 Z"
          }
        },

        fill: { "0": { value: "#934730" } }
      },

      "haiku:4fbf61e7ffbe": {
        d: {
          "0": {
            value: "M85.8,325.6 C82.1,326.8 79.6,330.3 78,333.8 C76.1,337.8 74.8,342.7 77,346.6 C79.6,351.1 85.6,352.2 90.8,352.1 C94.4,352 98,351.6 101.3,350.1 C104.5,348.6 107.3,345.8 108.2,342.3 C109.2,338.3 107.4,334 104.4,331.2 C101.4,328.4 97.5,326.8 93.5,325.8 C90.9,325.1 88.3,324.8 85.8,325.6 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:ebfaa5b4f695": {
        d: {
          "0": {
            value: "M119.1,326.9 C119,324.9 117.4,323.2 115.7,322.1 C112.1,319.8 107.5,319.3 103.5,320.6 C104.7,324.9 106.2,329.6 109.7,332.4 C111.3,333.7 113.7,334.5 115.5,333.5 C116.6,332.9 117.4,331.7 118,330.6 C118.6,329.5 119.2,328.3 119.1,326.9 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:11969e518490": {
        d: {
          "0": {
            value: "M200.5,310.3 C202.5,311.3 204.8,311.1 207,310.8 C209.2,310.5 211.8,309.9 212.5,307.8 C213.2,305.7 211.6,303.6 210.1,302 C208.3,300.1 206.5,298.2 204.1,297.3 C201.7,296.4 198.6,296.9 197.2,299.1 C196.4,300.3 196.3,301.9 196.5,303.3 C196.8,306 198,309 200.5,310.3 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:ec7493e6a92b": {
        d: {
          "0": {
            value: "M230.5,294.4 C229.5,291.3 226.9,288.9 224.1,287.3 C221.3,285.6 218.2,284.4 215.4,282.7 C211.7,285.8 209.4,290.7 209.8,295.5 C210.2,300.3 213.7,304.9 218.3,306.2 C223,307.5 228.5,305 230.3,300.5 C231.1,298.5 231.1,296.3 230.5,294.4 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:74988edc4277": {
        d: {
          "0": {
            value: "M51.4,150.1 L51.4,150.1 C52.7,151 54.1,151.3 55.1,151.2 C56.1,151.1 56.6,150.8 56.6,150.7 L56.5,150.1 C56.5,149.9 55.9,149.9 55.2,149.8 C54.4,149.7 53.4,149.3 52.5,148.7 L52.5,148.7 C51.5,148 50.7,147 50.4,145.9 C50.1,144.8 50.1,143.5 50.5,142.5 C50.7,142 51,141.5 51.3,141 C51.5,140.8 51.7,140.6 51.8,140.4 C51.8,140.4 51.8,140.4 51.8,140.4 C51.8,140.4 51.8,140.4 51.8,140.4 C51.8,140.4 51.9,140.4 51.9,140.4 C52.3,140.4 52.7,140.7 52.9,141 C53.2,141.3 53.3,141.7 53.2,142.1 C53.7,142.2 54.3,142.3 54.8,142.3 C55.1,139.1 53.7,136.2 51.8,134.4 C49.9,132.6 47.5,132 45.7,132 C43.9,132 42.5,132.5 41.6,133 C40.7,133.5 40.4,133.8 40.4,133.9 C40.5,134 40.9,133.8 41.8,133.5 C42.7,133.2 44,132.9 45.6,133 C47.2,133.1 49.2,133.8 50.8,135.4 C52.3,137 53.4,139.5 53.1,142.1 L54.7,142.3 C54.8,141.5 54.6,140.6 54.1,139.9 C53.6,139.3 52.9,138.7 52,138.6 C51.9,138.6 51.8,138.6 51.7,138.6 C51.6,138.6 51.4,138.6 51.2,138.6 L51,138.6 C50.9,138.6 50.8,138.6 50.8,138.7 C50.7,138.8 50.6,138.9 50.4,139 C50.1,139.3 49.9,139.5 49.6,139.8 C49.1,140.4 48.8,141 48.5,141.8 C48,143.2 47.8,144.8 48.3,146.4 C49,147.9 50.1,149.3 51.4,150.1 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:b9a18256f843": {
        d: {
          "0": {
            value: "M144.3,168.9 C145,166.4 145.8,163.8 147.7,162.1 C149.6,160.4 153,160 154.6,162 C155.7,163.7 154.6,166 152.9,167.1 C151.3,168.1 146.3,168.9 144.3,168.9 Z"
          }
        },

        fill: { "0": { value: "#F1B486" } }
      },

      "haiku:1a2c86894b5a": {
        d: {
          "0": {
            value: "M100.8,208 C91.5,212.3 81.1,212.9 71,214.4 C60.9,215.9 50.4,218.7 43.4,226.1 C46.8,227.4 49.7,229.8 51.6,232.9 C58.9,227.2 68.2,224.7 77,221.9 C85.8,219.1 94.9,215.3 100.8,208 Z"
          }
        },

        fill: { "0": { value: "#66B245" } }
      },

      "haiku:f3e8b1914e2d": {
        viewBox: { "0": { value: "0 0 275 269" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 275 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 269 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function($user) {
                return $user.mouse.x - 144;
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
                return $user.mouse.y - 288;
              },
              "$user"
            ),

            edited: true
          }
        },

        "style.zIndex": { "0": { value: 33 } },
        "scale.x": { "0": { value: 0.3, edited: true } },
        "scale.y": { "0": { value: 0.3, edited: true } },
        opacity: {
          "0": {
            value: Haiku.inject(
              function(currentBaby) {
                return currentBaby === "baby3" ? 1 : 0;
              },
              "currentBaby"
            ),

            edited: true
          }
        }
      },

      "haiku:0866a31f4dba": {
        cx: { "0": { value: "50.1405738%" } },
        cy: { "0": { value: "49.8782787%" } },
        fx: { "0": { value: "50.1405738%" } },
        fy: { "0": { value: "49.8782787%" } },
        r: { "0": { value: "49.8122951%" } }
      },

      "haiku:c8ef03a82867": {
        "stop-color": { "0": { value: "#D78280" } },
        offset: { "0": { value: "0%" } }
      },

      "haiku:41b557a4699c": {
        "stop-color": { "0": { value: "#E9B092" } },
        offset: { "0": { value: "100%" } }
      },

      "haiku:9e67c7a041b8": {
        cx: { "0": { value: "50.1418033%" } },
        cy: { "0": { value: "49.8782787%" } },
        fx: { "0": { value: "50.1418033%" } },
        fy: { "0": { value: "49.8782787%" } },
        r: { "0": { value: "49.8122951%" } }
      },

      "haiku:4be3058f9878": {
        "stop-color": { "0": { value: "#D78280" } },
        offset: { "0": { value: "0%" } }
      },

      "haiku:ef71c8440c67": {
        "stop-color": { "0": { value: "#E9B092" } },
        offset: { "0": { value: "100%" } }
      },

      "haiku:d804b00ec88f": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:7feb72e47a56": { "fill-rule": { "0": { value: "nonzero" } } },
      "haiku:32772e6b2f9a": { "translation.y": { "0": { value: 135 } } },
      "haiku:37f3a4945a42": { "translation.y": { "0": { value: 62 } } },
      "haiku:fb4011da42dc": { "translation.x": { "0": { value: 61 } } },
      "haiku:239ea4d7c4cc": {
        d: {
          "0": {
            value: "M70.1,63.6 C53.5,59.6 35.7,59.4 23.3,46.1 C15.1,37.4 5.3,28.2 2.5,16.1 C1.9,13.5 0.7,9.3 2.1,6.8 C4,3.4 9.2,2.1 12.8,1.6 C24.4,0.1 37.3,5.3 46.6,12 C53,16.6 60.4,20.7 64.5,27.7 C67.7,33.2 70.8,39.5 71.7,45.9 C72.1,49.6 75.8,64.9 70.1,63.6 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:b1572b669eb2": {
        d: {
          "0": {
            value: "M45.1,59.1 C50.9,60.6 56.8,61.6 62.8,62.6 C65.1,63 67.4,63.6 69.7,63.8 C70,63.8 70.4,63.3 70.1,63.2 C69.1,62.7 67.8,62.5 66.7,62.2 C54.4,59.1 41.3,58.1 30.5,51 C27.8,49.2 25.3,47 23.1,44.6 C20.7,42 18.2,39.5 15.8,36.8 C11.4,31.9 7.2,26.6 4.8,20.4 C3.6,17.4 2.6,13.9 2.3,10.7 C2.2,9.2 2.3,7.7 3.2,6.5 C4.2,5.2 5.7,4.3 7.1,3.7 C13.4,1.1 20.9,1.6 27.3,3.3 C33.8,5 39.9,8 45.5,11.8 C50.9,15.6 56.9,19.1 61.3,24.1 C63.4,26.5 65,29.4 66.5,32.3 C68.1,35.3 69.4,38.4 70.4,41.7 C71.3,44.9 71.8,48.3 72.3,51.5 C72.8,54.3 73.3,57.3 73,60.2 C72.9,61.1 72.8,62.1 72.2,62.8 C71.9,63.2 71.5,63.4 71.1,63.5 C71,63.5 70.2,63.5 70.2,63.5 C70.2,63.7 71.3,63.6 71.4,63.6 C72.1,63.5 72.5,63 72.8,62.4 C73.4,61.3 73.5,60 73.5,58.8 C73.6,55.7 73.1,52.5 72.6,49.4 C72.1,46.1 71.7,42.8 70.6,39.6 C69.5,36.2 68,33 66.3,29.9 C64.7,27 63.1,24.3 60.8,22 C58.5,19.6 55.8,17.6 53.1,15.7 C47.5,11.8 42,7.7 35.8,4.9 C29.6,2.1 22.9,0.3 16.1,0.5 C10.7,0.6 1.1,2.1 0.7,9.1 C0.5,12.3 1.5,15.7 2.4,18.7 C3.4,21.9 4.9,25 6.7,27.9 C10.3,33.7 15.1,38.7 19.8,43.6 C21.8,45.7 23.7,47.9 26,49.7 C31.7,54.3 38.1,57.2 45.1,59.1 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:7230478f76fa": {
        d: {
          "0": {
            value: "M97.2,29.5 C104.1,32.7 111,35.9 116.7,40.8 C122.4,45.7 126.9,52.6 127.2,60.1 C117,58.6 106.5,57.1 97.5,52.1 C88.5,47.1 81,37.9 81.2,27.6 C86.1,24.8 92.1,27.1 97.2,29.5 Z"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:3d58451ee58a": { "translation.x": { "0": { value: 33 } } },
      "haiku:36a4fa6956e1": {
        d: {
          "0": {
            value: "M43.8,0.7 C35.4,1.3 29.2,1.8 24.1,8.7 C20.6,13.5 17.6,19.1 15.1,24.5 C12.7,29.8 11,35.5 8.9,41 C7.1,45.7 4.4,49.6 2.2,53.9 C-1.6,61.2 16.3,63.1 20.6,62.9 C26.4,62.7 32.5,59.4 37.5,56.6 C43.4,53.3 47.5,48.9 51.3,43.4 C56.5,36 57,28.4 57.1,19.4 C57,11.6 52.7,0.1 43.8,0.7 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:5f5c990acdd1": {
        d: {
          "0": {
            value: "M24.7,9.3 C26.6,6.8 28.9,4.7 31.7,3.5 C34.6,2.3 37.7,1.9 40.8,1.5 C41.7,1.4 42.6,1.3 43.4,1.1 C43.8,1 43.9,0.4 43.4,0.3 C40.7,0.1 37.8,0.4 35.2,0.9 C31.9,1.5 28.8,2.7 26.3,5 C23.9,7.1 22.2,9.8 20.5,12.4 C16.9,18.2 13.9,24.4 11.5,30.9 C10.3,34.1 9.3,37.4 8,40.5 C6.7,43.7 5,46.8 3.3,49.8 C1.9,52.3 -0.6,55.5 1.4,58.3 C3.2,60.8 6.9,61.8 9.8,62.5 C13.2,63.3 16.7,63.8 20.2,63.7 C23.5,63.6 26.8,62.6 29.8,61.2 C35.7,58.6 41.5,55.3 46,50.6 C49.7,46.8 53,42.2 54.9,37.2 C56.8,32.2 57.1,26.8 57.2,21.5 C57.4,16.7 56.5,11.7 54.2,7.4 C53,5.2 51.5,3.4 49.5,1.9 C48.6,1.4 47.8,1 46.8,0.7 C46.5,0.6 43.5,0.2 43.5,0.5 C43.5,0.4 46.8,1 47.1,1.2 C48.4,1.7 49.5,2.4 50.5,3.4 C52.5,5.4 53.9,8 54.8,10.6 C56.9,16.8 56.5,23.8 55.5,30.2 C54.5,36.4 51.7,41.7 47.8,46.5 C46,48.8 43.9,50.8 41.7,52.7 C39.3,54.7 36.6,56.1 33.8,57.6 C30.9,59.1 27.8,60.6 24.6,61.4 C21.2,62.3 17.7,62.1 14.2,61.6 C10.9,61.1 7.5,60.5 4.6,58.8 C3.5,58.2 2.1,57.1 2.1,55.7 C2.1,54.2 3.3,52.8 3.9,51.5 C5.6,48.5 7.3,45.6 8.7,42.4 C10.1,39.2 11.2,35.9 12.3,32.6 C14.6,26.1 17.5,19.8 21.1,13.8 C22.5,12.5 23.6,10.9 24.7,9.3 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:747c07b1f2e4": { "translation.y": { "0": { value: 29 } } },
      "haiku:65a42313583d": {
        "translation.x": { "0": { value: 11 } },
        "translation.y": { "0": { value: 29 } }
      },

      "haiku:4673a7d12254": {
        d: {
          "0": {
            value: "M1.5,2.3 C0.7,3.4 0.7,5.1 1.6,6.1 C3,7.6 5.4,7.4 7.4,7 C8,6.9 8.6,6.8 9,6.4 C10,5.7 10.1,4.1 9.5,3.1 C8.8,2 7.6,1.5 6.4,1.3 C5.2,1.2 3.9,1.4 2.7,1.6 C2.4,1.7 2.1,1.7 1.9,1.9 C1.8,2 1.6,2.2 1.5,2.3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:bff2558354e0": {
        d: {
          "0": {
            value: "M1.9,4.9 C1.6,4.2 2.1,2.8 1.5,2.3 C0.5,1.5 0.1,4 0.1,4.6 C0.5,8.2 4.7,8.3 7.4,7.8 C8.9,7.5 10.3,6.9 10.6,5.3 C10.9,3.8 10.2,2.4 8.9,1.6 C7.7,0.8 6.2,0.7 4.9,0.9 C4.2,1 3.6,1.1 2.9,1.3 C2.8,1.3 1,2 1.5,2.3 C1.5,2.3 3.2,1.9 3.3,1.9 C4.1,1.8 4.8,1.8 5.6,1.8 C7,1.9 9,2.5 9.2,4.2 C9.4,6.1 7.5,6.2 6.1,6.4 C4.7,6.6 2.5,6.6 1.9,4.9 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:b2e9af565e7b": { "translation.x": { "0": { value: 3 } } },
      "haiku:15b1dc247f52": {
        d: {
          "0": {
            value: "M1,6.1 C1,8.7 3,10.8 5.3,12 C10.2,14.6 16.9,13.8 20.6,9.6 C15.3,8.1 10.3,5.3 6.2,1.7 C5.5,1.1 4.8,0.5 3.9,0.6 C3,0.7 2.5,1.6 2.1,2.4 C1.6,3.6 1.1,4.8 1,6.1 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:4f2cbdcf2e67": {
        d: {
          "0": {
            value: "M4.4,10.4 C3.3,9.6 2.3,8.5 1.8,7.2 C1.7,6.9 1.6,6.1 1.2,6.1 C0.8,6.1 0.6,6 0.5,6.5 C1.36002321e-14,9.7 3.4,12.2 5.9,13.3 C9,14.6 12.6,14.7 15.8,13.6 C18.3,12.7 20.1,11.2 21.9,9.3 C17.6,7.9 13.5,6.3 9.7,3.8 C8.6,3.1 7.6,2.3 6.6,1.5 C5.7,0.7 4.5,-0.3 3.2,0.3 C2.1,0.8 1.6,2.2 1.2,3.3 C1.1,3.5 0.5,6 0.9,6 C1,6 1.2,4.9 1.3,4.8 C1.6,3.8 2.1,2.8 2.7,2 C4.2,-0.3 6.4,2.7 7.7,3.8 C9.5,5.3 11.5,6.5 13.6,7.6 C14.1,7.9 18.8,10.2 19,10 C18.5,10.6 17.5,11.1 16.8,11.4 C15.4,12 14,12.5 12.5,12.6 C9.7,12.9 6.7,12.2 4.4,10.4 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:52a11f6ae600": {
        "translation.x": { "0": { value: 5 } },
        "translation.y": { "0": { value: 25 } }
      },

      "haiku:163d170fdb7f": {
        d: {
          "0": {
            value: "M0.9,5.1 C2,6.6 3.7,7.6 5.6,7.7 C7.4,7.8 9.3,7 10.5,5.5 C10.7,5.2 10.9,5 10.9,4.6 C10.9,4.3 10.8,4.1 10.7,3.9 C10,2.4 8.2,1.8 6.5,1.6 C5.4,1.5 4.3,1.6 3.3,2 C2.1,2.7 1.2,3.8 0.9,5.1 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:569b4433dd9d": {
        d: {
          "0": {
            value: "M3.5,6.3 C2.7,5.9 2.1,5.2 1.3,4.9 C0.6,4.7 0.6,5.5 0.8,5.9 C1.9,7.9 4.6,8.7 6.7,8.4 C8.5,8.2 12,6.6 11.7,4.3 C11.4,1.7 7.9,0.9 5.8,0.9 C3.7,1 1.2,2.3 0.9,4.6 C0.8,5.5 1.4,4.4 1.5,4.2 C2.2,3.2 3.1,2.5 4.3,2.2 C5.5,1.9 6.8,2.1 7.9,2.5 C8.5,2.7 10.5,3.7 10.1,4.7 C8.9,7 5.5,7.3 3.5,6.3 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:84a22b796753": {
        "translation.x": { "0": { value: 2 } },
        "translation.y": { "0": { value: 18 } }
      },

      "haiku:02f3277b47f7": {
        d: {
          "0": {
            value: "M1.4,4.3 C1.2,4.8 1,5.2 0.9,5.7 C0.7,7.2 1.4,8.8 2.7,9.8 C3.9,10.7 5.6,11 7.1,10.8 C9,10.5 10.8,9.5 12,7.9 C12.7,6.3 12.1,4.4 10.8,3.2 C9.5,2 7.8,1.5 6,1.5 C4.9,1.5 3.8,1.7 2.9,2.3 C2.2,2.8 1.8,3.5 1.4,4.3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:deaa0ea4c4e6": {
        d: {
          "0": {
            value: "M2.1,7.7 C1.7,6.9 1.6,6 1.7,5.2 C1.7,4.8 1.8,4.1 1.1,4.2 C0.7,4 0.2,5.5 0.1,5.7 C-0.1,6.6 -4.30211422e-16,7.6 0.4,8.4 C2.1,12 6.8,12.4 10,10.6 C11.5,9.7 12.8,8.5 12.9,6.6 C12.9,4.7 11.7,2.9 10.1,1.9 C8.4,0.9 6.2,0.6 4.4,1.1 C3.6,1.3 2.8,1.7 2.2,2.4 C2.1,2.5 1,4 1.4,4.2 C1.4,4.2 3,2.6 3.2,2.5 C4.2,1.9 5.5,1.9 6.6,2 C8.8,2.3 11.2,3.6 11.5,6 C11.8,8.1 9.4,9.4 7.6,9.8 C5.5,10.3 3,9.7 2.1,7.7 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:ae8f36552d66": { "translation.y": { "0": { value: 11 } } },
      "haiku:8c2aae8e8ed9": {
        d: {
          "0": {
            value: "M1,3.9 C1.5,5.1 2.1,6.2 2.9,7.3 C3.3,7.9 3.7,8.4 4.3,8.9 C6,10.4 8.7,10.8 10.8,9.9 C12.9,9 14.3,6.7 14.3,4.4 C10.6,3.5 7,2.5 3.3,1.6 C2.5,1.4 1.6,1.3 1,1.9 C0.5,2.4 0.7,3.2 1,3.9 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:01da0be5ca1d": {
        d: {
          "0": {
            value: "M3.8,7.1 C3.5,6.7 1.8,3.6 1.2,3.8 C0.7,4 0.6,4.1 0.8,4.7 C1,5.6 1.5,6.5 2,7.4 C3.2,9.3 4.9,10.7 7.1,11.1 C9.5,11.5 12,10.6 13.5,8.7 C14.3,7.6 15.4,5.5 15,4.1 C15,3.6 14.3,3.6 13.9,3.5 C12.8,3.2 11.6,3 10.4,2.7 C8.2,2.2 5.9,1.7 3.7,1.2 C2.8,1 1.5,0.7 0.8,1.6 C0.5,1.9 0.5,4.2 1,3.9 C1.4,3.7 0.4,1.9 1.8,1.8 C3,1.7 4.4,2.4 5.6,2.7 C7,3.1 8.3,3.5 9.7,3.9 C10.9,4.2 12.3,4.4 13.4,4.9 C13.6,5.1 13.2,6.1 13.1,6.3 C12.6,7.4 11.8,8.4 10.7,8.9 C8.2,10.2 5.4,9.2 3.8,7.1 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:9b70741fac1f": {
        "translation.x": { "0": { value: 6 } },
        "translation.y": { "0": { value: 5 } }
      },

      "haiku:438f9028a4d3": {
        d: {
          "0": {
            value: "M53.2,6.5 C46.7,5.1 43.7,5 37.7,6.2 C35.4,6.6 33.3,7.2 30.9,7 C24.8,6.6 18.7,3.3 12.8,1.9 C8.2,0.8 4.3,0.4 2.1,5.4 C-0.1,10.5 0.7,17.6 3.5,22.5 C5.7,26.3 9.3,30.1 13.7,30.8 C20.3,31.9 26.2,28.4 32.8,29.7 C39.2,31 48.1,31.2 53.9,27.4 C61.5,22.6 57.7,12 53.2,6.5 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:bdc1168a9311": {
        d: {
          "0": {
            value: "M35.4,7.5 C38.5,6.9 41.6,6.2 44.8,6.1 C47.5,6.1 50,6.6 52.7,6.8 C52.9,6.8 53.7,6.5 53.2,6.2 C52.6,5.8 51.7,5.7 51,5.5 C47.9,4.7 44.7,4.4 41.5,4.8 C38.3,5.1 35.1,6.3 31.8,6.2 C28.3,6.2 24.9,5.1 21.6,3.9 C18.4,2.8 15.3,1.6 12,0.9 C8.9,0.3 5.4,-0.1 3,2.5 C0.7,4.9 5.68434189e-14,8.7 5.68434189e-14,12 C5.68434189e-14,15.4 0.7,18.9 2.2,22 C3.6,24.8 5.6,27.3 8,29.2 C10.7,31.3 13.9,32.1 17.3,31.9 C20.7,31.7 24.1,30.8 27.5,30.4 C30.9,30 34.1,30.9 37.4,31.2 C43.6,31.7 50.3,31.1 55.4,27.1 C58.6,24.6 58.9,19.8 58.1,16.1 C57.7,14.1 56.8,12.2 55.9,10.5 C55.7,10.1 53.3,6.5 53.1,6.7 C53.2,6.6 55.9,11.6 56.1,12.1 C57.3,15 58.1,18.2 57.6,21.3 C57,27.8 48.8,29.8 43.6,30.1 C40.2,30.3 36.8,30 33.5,29.4 C29.9,28.8 26.6,29.1 23,29.7 C19.9,30.2 16.7,30.8 13.6,30.2 C10.5,29.6 7.9,27.5 6,25.1 C3.1,21.4 1.5,16.9 1.5,12.2 C1.5,8.2 2.7,2.4 7.6,2.1 C9.9,2 12.3,2.7 14.4,3.3 C16.8,4 19.2,4.9 21.6,5.8 C26.3,7.3 30.7,8.4 35.4,7.5 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:4175c74c4fea": {
        d: {
          "0": {
            value: "M55.2,15.6 C46.6,13.8 37,15.7 30.4,20.4 C33,22.9 35.7,25.5 38.8,27.6 C41.9,29.7 45.7,31.4 49.8,31.9 C53.9,32.4 58.4,31.7 61.4,29.5 C64.5,27.3 65.8,23.5 64,20.6 C62.5,17.9 58.8,16.3 55.2,15.6 Z"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:812fad7bb4a7": {
        "translation.x": { "0": { value: 3 } },
        "translation.y": { "0": { value: 17 } }
      },

      "haiku:b1c6d9fed6ce": {
        d: { "0": { value: "M1.6,1 C1.6,0.9 1.6,0.8 1.6,0.7" } },
        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:223d960d92be": {
        d: {
          "0": { value: "M0.8,1 C0.8,1 2.5,1 2.5,1 C2.5,0.6 0.8,0.6 0.8,1 Z" }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:1421f162373b": {
        "translation.x": { "0": { value: 140 } },
        "translation.y": { "0": { value: 62 } }
      },

      "haiku:12b9008afbd4": {
        d: {
          "0": {
            value: "M4,63.6 C20.6,59.6 38.4,59.4 50.8,46.1 C59,37.4 68.8,28.2 71.6,16.1 C72.2,13.5 73.4,9.3 72,6.8 C70.1,3.4 64.9,2.1 61.3,1.6 C49.7,0.1 36.8,5.3 27.5,12 C21.1,16.6 13.7,20.7 9.6,27.7 C6.4,33.2 3.3,39.5 2.4,45.9 C2,49.6 -1.7,64.9 4,63.6 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:466df666fb0f": {
        d: {
          "0": {
            value: "M28.5,57.5 C22.6,59 16.6,60.1 10.6,61.4 C10,61.5 3.8,62.8 3.9,63.3 C4,63.9 4.1,63.8 4.7,63.7 C5.7,63.6 6.8,63.4 7.8,63.2 C20.2,61 33.4,59.5 44.2,52.5 C47.1,50.6 49.6,48.4 51.9,45.9 C56.1,41.5 60.4,37.1 64.1,32.3 C68.3,26.8 71.2,21 72.7,14.3 C73.4,11.3 74,7.8 71.9,5.2 C69.9,2.8 66.6,1.7 63.6,1.1 C50.1,-1.7 36.6,4.6 25.9,12.3 C20.5,16.1 14.6,19.7 10.6,25.2 C8.6,27.9 7,31.1 5.6,34.2 C4.2,37.3 3,40.5 2.4,43.8 C1.6,48 0.9,52.3 0.7,56.6 C0.6,58.2 0.6,59.8 1,61.4 C1.2,62.2 1.5,63.1 2.3,63.5 C2.4,63.6 4.2,64 4.1,63.6 C4.1,63.6 3.1,63.6 2.9,63.5 C2.3,63.3 1.9,62.9 1.7,62.3 C1.2,61.2 1.1,60 1.1,58.8 C1.1,55.7 1.6,52.6 2.2,49.5 C2.8,46.2 3.2,43 4.3,39.8 C5.4,36.5 6.9,33.4 8.6,30.3 C10.2,27.5 11.8,25 14,22.7 C16.3,20.4 18.9,18.4 21.6,16.6 C27.2,12.7 32.7,8.7 39,6 C45.3,3.3 52.1,1.6 59,2 C62.3,2.2 65.8,2.8 68.6,4.5 C69.8,5.2 71,6.3 71.5,7.7 C72,9.3 71.7,11.1 71.4,12.7 C70.1,19.3 67.4,25.2 63.4,30.6 C59.3,36.1 54.5,41.2 49.6,46 C43.8,51.9 36.5,55.3 28.5,57.5 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:f3022a1c55db": {
        d: {
          "0": {
            value: "M54.9,18.9 C54,19 53.2,19.6 52.5,20.2 C38.7,31.5 24.6,43 15.4,58.3 C33.8,56.8 50.9,44.1 57.7,26.9 C58.3,25.3 58.9,23.6 58.6,21.9 C58.1,20.2 56.6,18.7 54.9,18.9 Z"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:48ed248e6881": { "translation.x": { "0": { value: 44 } } },
      "haiku:282c04c010c6": {
        d: {
          "0": {
            value: "M14.4,0.7 C22.8,1.3 29,1.8 34.1,8.7 C37.6,13.5 40.6,19.1 43.1,24.5 C45.5,29.8 47.2,35.5 49.3,41 C51.1,45.7 53.8,49.6 56,53.9 C59.8,61.2 41.9,63.1 37.6,62.9 C31.8,62.7 25.7,59.4 20.7,56.6 C14.8,53.3 10.7,48.9 6.9,43.4 C1.7,36 1.2,28.4 1.1,19.4 C1.1,11.6 5.4,0.1 14.4,0.7 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:477c670d9408": {
        d: {
          "0": {
            value: "M34.8,8.3 C32.9,5.8 30.7,3.7 27.8,2.4 C24.9,1.1 21.7,0.6 18.5,0.4 C17.3,0.3 16,0.2 14.8,0.3 C14.3,0.3 14,0.9 14.5,1 C16.8,1.6 19.2,1.6 21.6,2.1 C24.8,2.7 27.9,3.8 30.4,6 C32.8,8.1 34.5,10.8 36.2,13.4 C39.9,19.3 42.8,25.6 45.2,32.1 C46.4,35.4 47.5,38.7 48.8,41.9 C50.1,45.1 51.8,48 53.5,51 C54.2,52.3 54.9,53.5 55.5,54.8 C55.9,56.5 55.3,57.6 53.9,58.5 C51.2,60.4 47.6,61 44.4,61.6 C41,62.1 37.4,62.5 34,61.7 C30.7,60.9 27.7,59.6 24.7,58 C21.9,56.6 19.2,55.1 16.7,53.2 C14.4,51.4 12.3,49.4 10.4,47.1 C7.5,43.7 5,39.8 3.6,35.6 C2,30.7 1.7,25.4 1.6,20.3 C1.5,15.8 2.4,11.3 4.5,7.3 C5.5,5.4 7,3.4 8.9,2.2 C9.7,1.7 10.5,1.3 11.5,1 C11.7,0.9 14.3,0.6 14.3,0.6 C14.3,0.3 11,0.8 10.7,0.9 C9.4,1.4 8.2,2 7.1,2.9 C4.9,4.8 3.4,7.4 2.4,10.1 C0.1,16.1 0.3,22.9 1,29.2 C1.4,32.5 2.2,35.7 3.5,38.8 C4.8,41.9 6.8,44.7 8.9,47.4 C10.9,50 13.2,52.3 15.8,54.4 C18.4,56.4 21.3,58 24.2,59.5 C27.1,61 30.1,62.4 33.2,63.2 C36.5,64 39.9,63.9 43.3,63.4 C47.8,62.8 59.9,60.8 56.6,53.7 C55.2,50.6 53.2,47.7 51.7,44.7 C50.2,41.7 49,38.5 47.9,35.3 C45.6,28.8 43.1,22.5 39.7,16.4 C38.3,13.6 36.6,10.9 34.8,8.3 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:e7094326b365": {
        "translation.x": { "0": { value: 70 } },
        "translation.y": { "0": { value: 29 } }
      },

      "haiku:ca53ccb12a8d": {
        "translation.x": { "0": { value: 43 } },
        "translation.y": { "0": { value: 29 } }
      },

      "haiku:cd3079348364": {
        d: {
          "0": {
            value: "M9.6,2.3 C10.4,3.4 10.4,5.1 9.5,6.1 C8.1,7.6 5.7,7.4 3.7,7 C3.1,6.9 2.5,6.8 2.1,6.4 C1.1,5.7 1,4.1 1.6,3.1 C2.3,2 3.5,1.5 4.7,1.3 C5.9,1.2 7.2,1.4 8.4,1.6 C8.7,1.7 9,1.7 9.2,1.9 C9.4,2 9.5,2.2 9.6,2.3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:b6dbc8d62bc0": {
        d: {
          "0": {
            value: "M10.8,5.4 C11.1,4.5 11,3.3 10.4,2.5 C10,1.9 9.2,2.1 9.3,2.9 C9.4,3.8 9.4,4.8 8.8,5.5 C7.9,6.4 6.6,6.5 5.4,6.4 C4.5,6.3 2.9,6.3 2.2,5.6 C1.4,4.6 2,3.3 2.9,2.6 C3.9,1.8 5.3,1.7 6.5,1.8 C7,1.8 7.6,1.9 8.1,1.9 C8.2,1.9 9.7,2.2 9.6,2.3 C10.1,1.9 7.8,1.2 7.6,1.1 C6.6,0.9 5.5,0.7 4.5,0.8 C2.5,1 0.5,2.3 0.4,4.5 C0.3,7.2 2.9,7.8 5.1,8 C7.3,8.3 10,7.8 10.8,5.4 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:52aaef61da35": { "translation.x": { "0": { value: 40 } } },
      "haiku:719e56f6f119": {
        d: {
          "0": {
            value: "M21.1,6.1 C21.1,8.7 19.1,10.8 16.8,12 C11.9,14.6 5.2,13.8 1.5,9.6 C6.8,8.1 11.8,5.3 15.9,1.7 C16.6,1.1 17.3,0.5 18.2,0.6 C19.1,0.7 19.6,1.6 20,2.4 C20.6,3.6 21.1,4.8 21.1,6.1 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:4de1eb7fead2": {
        d: {
          "0": {
            value: "M18.7,11.8 C19.7,11.1 20.5,10.2 21,9.1 C21.3,8.5 22,6.8 21.4,6.1 C20.7,5.4 20.2,7.4 20.1,7.6 C19.6,8.8 18.7,9.7 17.6,10.5 C15.3,12.2 12.3,12.9 9.4,12.7 C7.9,12.6 6.5,12.1 5.1,11.5 C4.4,11.1 3.4,10.7 2.9,10.1 C3.1,10.4 7.8,8 8.3,7.7 C10.4,6.6 12.4,5.3 14.2,3.9 C15.5,2.8 17.7,-0.2 19.2,2.1 C19.8,3 20.2,3.9 20.6,4.9 C20.6,5 20.9,6.1 21,6.1 C21.4,6.1 20.8,3.9 20.8,3.8 C20.5,2.7 20,1.3 19,0.6 C17.8,-0.2 16.5,0.6 15.6,1.4 C14.5,2.3 13.4,3.1 12.3,3.9 C8.5,6.4 4.4,8 0.1,9.4 C2.2,11.6 4.3,13.3 7.4,14 C11.3,14.9 15.5,14.2 18.7,11.8 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:8c1081765707": {
        "translation.x": { "0": { value: 48 } },
        "translation.y": { "0": { value: 25 } }
      },

      "haiku:5971c4b16051": {
        d: {
          "0": {
            value: "M11.3,5.1 C10.2,6.6 8.5,7.6 6.6,7.7 C4.8,7.8 2.9,7 1.7,5.5 C1.5,5.2 1.3,5 1.3,4.6 C1.3,4.3 1.4,4.1 1.5,3.9 C2.2,2.4 4,1.8 5.7,1.6 C6.8,1.5 7.9,1.6 8.9,2 C10,2.7 10.9,3.8 11.3,5.1 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:e3f2e1678c08": {
        d: {
          "0": {
            value: "M9.4,7.9 C10.2,7.5 11,6.9 11.4,6 C11.6,5.6 11.5,4.8 10.9,5 C10.1,5.3 9.4,6 8.7,6.4 C7.4,7 6,7.1 4.6,6.6 C3.7,6.3 2.6,5.6 2.1,4.8 C1.7,3.8 3.6,2.9 4.3,2.6 C6.6,1.8 9.3,2.2 10.8,4.3 C10.9,4.5 11.5,5.6 11.4,4.7 C11.3,3.7 10.6,2.8 9.9,2.2 C7.9,0.5 4.5,0.6 2.4,1.9 C1.5,2.4 0.7,3.3 0.5,4.3 C0.4,5.5 1.5,6.5 2.3,7.1 C4.3,8.7 7.1,9 9.4,7.9 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:215265fe1c0c": {
        "translation.x": { "0": { value: 50 } },
        "translation.y": { "0": { value: 19 } }
      },

      "haiku:026daf8d7805": {
        d: {
          "0": {
            value: "M11.7,3.3 C11.9,3.8 12.1,4.2 12.2,4.7 C12.4,6.2 11.7,7.8 10.4,8.8 C9.2,9.7 7.5,10 6,9.8 C4.1,9.5 2.3,8.5 1.1,6.9 C0.4,5.3 1,3.4 2.3,2.2 C3.6,1 5.3,0.5 7.1,0.5 C8.2,0.5 9.3,0.7 10.2,1.3 C10.9,1.8 11.3,2.5 11.7,3.3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:91066a13f419": {
        d: {
          "0": {
            value: "M12.6,7.4 C13.2,6.2 13.2,4.7 12.5,3.5 C12.2,3 12,3.1 11.6,3.3 C11.2,3.5 11.5,4.4 11.5,4.8 C11.6,8.3 7.8,9.7 4.9,8.7 C3.8,8.3 2,7.4 1.7,6.1 C1.4,4.5 2.3,2.9 3.6,2.1 C4.9,1.2 6.7,0.9 8.3,1.1 C9.1,1.2 9.9,1.5 10.5,2 C10.6,2.1 11.6,3.4 11.7,3.3 C12.2,3.1 10.4,1 10.2,0.9 C9.1,0.1 7.6,-1.38777878e-17 6.3,0.1 C3.4,0.3 0.4,2.2 0.2,5.4 C-5.66768854e-14,8.2 2.9,10.1 5.3,10.6 C8.1,11.1 11.3,10.1 12.6,7.4 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:418530c13505": {
        "translation.x": { "0": { value: 50 } },
        "translation.y": { "0": { value: 11 } }
      },

      "haiku:b2acb5d1df44": {
        d: {
          "0": {
            value: "M14.1,3.9 C13.6,5.1 13,6.2 12.2,7.3 C11.8,7.9 11.4,8.4 10.8,8.9 C9.1,10.4 6.4,10.8 4.3,9.9 C2.2,9 0.8,6.7 0.8,4.4 C4.5,3.5 8.1,2.5 11.8,1.6 C12.6,1.4 13.5,1.3 14.1,1.9 C14.6,2.4 14.4,3.2 14.1,3.9 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:d5e6c3c6bdef": {
        d: {
          "0": {
            value: "M12.7,8.1 C13.5,7.1 14.5,5.5 14.5,4.2 C14.5,4 14.1,3.7 13.8,3.8 C13.4,3.9 13,4.7 12.8,5 C11.8,6.5 10.9,8.2 9.2,9 C7.5,9.8 5.4,9.7 3.9,8.6 C3.2,8.1 2.6,7.4 2.2,6.7 C2.1,6.4 1.5,5.4 1.7,5 C1.8,4.7 2.4,4.7 2.7,4.6 C3.7,4.3 4.8,4 5.8,3.7 C7.8,3.2 9.7,2.6 11.7,2 C12.3,1.8 13.5,1.4 14,2 C14.2,2.3 14.1,3.8 14.2,3.8 C14.5,3.9 14.7,2.6 14.8,2.4 C14.8,1.7 14.4,1.1 13.7,1 C12.2,0.6 10.1,1.4 8.6,1.8 C7,2.2 5.3,2.5 3.7,2.9 C2.9,3.1 2.2,3.3 1.4,3.4 C1.1,3.5 0.4,3.5 0.3,3.7 C-5.67879077e-14,4.3 0.4,5.8 0.6,6.3 C1.1,7.9 2.3,9.4 3.8,10.3 C6.7,12.1 10.6,10.9 12.7,8.1 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:395dc8425aa4": { "translation.y": { "0": { value: 5 } } },
      "haiku:89a3a6dcd342": {
        d: {
          "0": {
            value: "M5.9,6.5 C12.4,5.1 15.4,5 21.4,6.2 C23.7,6.6 25.8,7.2 28.2,7 C34.3,6.6 40.4,3.3 46.3,1.9 C50.9,0.8 54.8,0.4 57,5.4 C59.2,10.5 58.4,17.6 55.6,22.5 C53.4,26.3 49.8,30.1 45.4,30.8 C38.8,31.9 32.9,28.4 26.3,29.7 C19.9,31 11,31.2 5.2,27.4 C-2.4,22.6 1.4,12 5.9,6.5 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:af9c28c84b83": {
        d: {
          "0": {
            value: "M24,5.9 C20.8,5.3 17.6,4.6 14.3,4.7 C11.7,4.8 8.9,5.2 6.4,6.1 C6.3,6.1 6,6.2 5.9,6.3 C5.9,6.3 6,6.9 6,6.9 C6.4,7.2 7.8,6.8 8.2,6.7 C11.3,6.3 14.3,6.1 17.4,6.5 C20.5,6.9 23.6,7.9 26.8,8 C30.1,8.1 33.4,7.2 36.5,6.1 C39.8,5 43,3.7 46.4,2.8 C49.4,2.1 53.1,1.3 55.2,4.2 C57.1,6.8 57.5,10.4 57.3,13.5 C57.1,16.8 56.1,20.1 54.4,23 C52.8,25.6 50.5,28.2 47.6,29.5 C44.9,30.8 41.8,30.6 38.8,30.2 C35.3,29.7 31.8,28.8 28.2,29 C24.8,29.2 21.5,30.1 18.1,30.1 C12.7,30.2 4.7,29.3 2.1,23.7 C0.5,20.4 1.1,16.6 2.3,13.3 C2.8,12 3.4,10.7 4.1,9.5 C4.2,9.3 5.9,6.7 5.9,6.6 C5.5,6.2 2.3,11.9 2.1,12.4 C0.8,15.3 -5.5788707e-14,18.6 0.6,21.7 C1.8,27.8 8.1,30.2 13.6,31 C17.1,31.5 20.6,31.3 24.1,30.9 C25.7,30.7 27.2,30.3 28.8,30.3 C30.5,30.3 32.2,30.5 33.8,30.7 C37.2,31.3 40.7,32.1 44.2,31.8 C47.5,31.4 50.2,30 52.6,27.7 C56.2,24.2 58.3,19.5 58.9,14.5 C59.4,10 58.7,3.1 54,1.1 C51.7,0.1 49.1,0.6 46.7,1.1 C44.2,1.7 41.8,2.5 39.4,3.4 C34.5,5 29.2,7.1 24,5.9 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:63ff6f605995": {
        d: {
          "0": {
            value: "M10.6,33.6 C16,34.1 21.7,33.7 26.4,30.9 C31.1,28.1 34.4,22.7 33.5,17.3 C28.7,16.5 23.8,16.3 19.1,17.2 C14.4,18.2 9.8,20.4 6.6,24 C5,25.8 3.7,28.5 4.8,30.6 C5.7,32.8 8.3,33.4 10.6,33.6 Z"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:59db1c72c5cd": {
        d: {
          "0": {
            value: "M50.7,10.8 C43.9,11.2 37.7,16.6 36.5,23.4 C36.2,25.2 36.2,27 36.9,28.7 C37.6,30.4 38.9,31.8 40.7,32.3 C43.5,33 46.2,31.1 48.1,29 C52.1,24.2 51.5,16.9 50.7,10.8 Z"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:0ad37f2a4df1": {
        "translation.x": { "0": { value: 59 } },
        "translation.y": { "0": { value: 17 } }
      },

      "haiku:af713f2b9b7a": {
        d: { "0": { value: "M1.5,1 C1.5,0.9 1.5,0.8 1.5,0.7" } },
        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:44d72b8de5a1": {
        d: {
          "0": { value: "M0.7,1 C0.7,1 2.4,1 2.4,1 C2.3,0.6 0.7,0.6 0.7,1 Z" }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:8c945432d0ea": {
        "translation.x": { "0": { value: 153 } },
        "translation.y": { "0": { value: 11 } }
      },

      "haiku:2a478ec3c204": {
        d: {
          "0": {
            value: "M22.3,0.6 C40.9,2 46.5,23.2 48.7,37.8 C50.7,50.9 61.3,60.3 62.6,73.9 C63.3,80.6 63,87.6 63,94.4 C63,100.4 65.3,104.8 66.1,110.2 C61,112 55.1,115 49.7,115.6 C46.8,115.9 47.3,116.9 45.6,113.5 C44.6,111.4 44.5,108.6 43.7,106.3 C42.3,102.4 40,99 38.2,95.2 C35.8,90.4 35.1,85.3 33.3,80.2 C30.7,73.1 32.4,64.9 27.8,59 C21.9,51.4 14.7,45.4 7.9,38.4 C1.7,32 0.3,24.2 1.9,15.5 C3.6,5.5 12.6,-0.1 22.3,0.6 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:6205a67a3299": {
        d: {
          "0": {
            value: "M46.2,23.1 C44.4,17.2 41.6,11.3 37.2,6.9 C35.1,4.8 32.6,3 29.8,1.8 C28.6,1.3 27.3,0.9 26,0.6 C24.9,0.4 23.4,6.38378239e-16 22.3,0.2 C22.2,0.2 22.2,0.8 22.3,0.8 C22.7,1 23.3,1 23.7,1.1 C25,1.3 26.3,1.7 27.6,2.1 C30.4,3.1 33,4.7 35.1,6.8 C39.7,11.2 42.6,17.2 44.5,23.2 C45.5,26.4 46.3,29.7 47,33 C47.7,36.4 48,39.8 49.1,43.1 C51.2,49.6 55,55.3 58,61.5 C59.5,64.5 60.7,67.7 61.4,71 C62.1,74.5 62.2,78.2 62.3,81.7 C62.4,85.3 62.3,88.8 62.3,92.4 C62.3,95.9 62.7,99.2 63.5,102.6 C63.9,104.2 64.4,105.8 64.8,107.4 C65,108.1 65.1,108.8 65.2,109.5 C65.2,109.8 64.7,109.8 64.5,109.9 C61.5,111.1 58.5,112.4 55.5,113.4 C54,113.9 52.4,114.3 50.8,114.6 C50.1,114.7 49.4,114.8 48.7,114.9 C48,115 47.5,115.4 47.1,114.7 C45.4,111.7 45.3,108.4 44.1,105.3 C42.9,102.2 41.2,99.4 39.6,96.5 C37.9,93.4 36.8,90.1 35.9,86.7 C35,83.4 33.7,80.2 33,76.9 C32.3,73.6 32.2,70.2 31.5,66.8 C30.9,63.4 29.7,60.5 27.5,57.8 C25.4,55.2 23,52.7 20.6,50.3 C18.2,47.9 15.8,45.6 13.3,43.2 C10.9,40.9 8.3,38.6 6.2,35.9 C2,30.5 1,23.9 1.8,17.2 C2.6,11.2 5.6,5.9 11,2.9 C13.1,1.7 15.5,1 17.9,0.6 C18.1,0.6 22.2,0.3 22.2,0.3 C22.2,0.1 19.2,0.2 19,0.2 C17.5,0.3 16,0.5 14.5,1 C11.7,1.8 9,3.3 6.8,5.3 C2.2,9.6 0.7,15.9 0.7,22.1 C0.7,25.5 1.3,28.9 2.7,32.1 C4.1,35.2 6.3,37.8 8.7,40.3 C13.6,45.2 18.8,50 23.5,55.2 C25.7,57.7 28,60.2 29.2,63.3 C30.3,66.4 30.6,69.8 31,73.1 C31.4,76.6 32.4,79.8 33.4,83.2 C34.4,86.6 35.2,90 36.5,93.3 C37.7,96.4 39.5,99.3 41.1,102.3 C41.8,103.7 42.5,105.2 43,106.7 C43.6,108.4 43.8,110.2 44.2,111.9 C44.6,113.3 45.2,114.6 45.9,115.8 C46.8,117.3 48.2,116.6 49.6,116.4 C52.9,116 56.1,115 59.2,113.8 C61.5,112.9 63.7,112 66,111.1 C66.6,110.9 66.9,110.9 66.8,110.3 C66.6,109.1 66.4,107.9 66.1,106.8 C65.3,103.5 64.2,100.2 63.9,96.7 C63.6,93.2 63.8,89.6 63.9,86.1 C63.9,79.1 63.9,72 61.4,65.3 C59,58.8 55,53 52.2,46.6 C50.6,42.9 49.8,39.2 49.1,35.3 C48.4,31.3 47.5,27.1 46.2,23.1 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:ecb7a4913e82": {
        d: {
          "0": {
            value: "M35.4,77.1 C34.9,73 34.9,68.7 33.4,64.8 C31.7,60.5 28.4,57.2 26.1,53.2 C19.8,42.7 21.1,28.2 29.2,19 C32.6,23.4 33.3,29.4 33.5,34.9 C33.7,40.4 33.4,46.2 35.2,51.5 C36.4,54.8 38.4,57.9 38.9,61.4 C39.3,63.9 38.8,66.5 38.6,69.1 C37.5,80.7 41,92.6 48.2,101.8 C44.5,102 41.9,98.3 40.4,95 C37.8,89.4 36.1,83.3 35.4,77.1 Z"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:17963ee0cbfc": {
        "translation.x": { "0": { value: 32 } },
        "translation.y": { "0": { value: 98 } }
      },

      "haiku:c973ea94412a": {
        d: {
          "0": {
            value: "M3.4,11.6 C4.2,11.1 5.1,10.8 5.8,10.2 C6.5,8.9 7.3,7.6 8.3,6.3 C8.8,5.1 9.4,3.9 11.1,3.4 C12.8,2 14.7,1.1 16.8,1.1 C22.2,1.2 28.9,4.7 33.3,7.7 C35.6,9.3 39.5,12.8 38.7,16 C37.8,19.4 33.6,20.7 30.4,20.7 C28.7,20.7 27.1,20.2 25.3,20.3 C23.7,20.4 22.3,21.3 20.6,21.3 C19,21.3 16.8,21.2 15.4,20.3 C14.6,19.8 13.9,18.9 13.3,18.2 C12.2,17 11.6,16.3 10.7,15.6 C8.6,17 5.4,18.1 3.2,17.6 C-1,16.7 0.8,13.2 3.4,11.6 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:3630f5e92c22": {
        d: {
          "0": {
            value: "M10.7,2.7 C8.9,3.3 8.3,4.8 7.4,6.2 C6.6,7.3 5.9,8.5 5.3,9.7 C4.9,10.5 2.8,10.6 3.5,11.7 C3.8,12.1 5.9,10.9 6.2,10.7 C6.5,10.5 6.7,10 6.8,9.8 C7.3,9 7.8,8.3 8.4,7.6 C8.8,7.1 9.1,6.5 9.4,6 C10,5 10.8,4.7 11.7,4.1 C13.7,2.8 15.4,1.9 17.8,2.2 C20.7,2.5 23.4,3.5 26,4.7 C29.6,6.4 42,12.7 36.7,18 C35.3,19.5 33,20.1 31,20.2 C28.9,20.4 26.7,19.6 24.6,20 C23.7,20.2 22.8,20.5 21.8,20.7 C20.7,21 19.6,20.9 18.5,20.8 C16.2,20.6 15,19.7 13.5,18 C12.8,17.3 12.1,16.5 11.4,15.9 C10.9,15.5 10.7,15.1 10.2,15.5 C8.6,16.5 6.8,17.3 4.9,17.5 C3.4,17.7 0.7,17.3 0.8,15.3 C0.8,14.5 1.3,13.7 1.8,13.1 C1.9,13 3.2,11.8 3.2,11.7 C3.1,11.4 1.1,13.2 1,13.4 C-5.74540415e-14,14.7 -0.2,16.4 1.3,17.4 C4,19.3 7.7,17.9 10.3,16.5 C11,16.3 12.3,18.2 12.7,18.7 C13.8,20 14.9,21.1 16.6,21.6 C18,22 19.7,22.2 21.2,22 C22.9,21.8 24.4,21 26.1,21.1 C27.6,21.2 29.1,21.6 30.6,21.5 C32.3,21.4 34,21.1 35.6,20.3 C38.5,18.9 40.2,15.9 38.8,12.8 C37.5,9.8 34.6,7.7 31.9,6 C29.1,4.2 26.2,2.7 23,1.6 C21.1,0.9 19,0.4 17,0.3 C14.8,0.2 12.6,1.2 10.7,2.7 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:ab4422e959b6": {
        "translation.x": { "0": { value: 34 } },
        "translation.y": { "0": { value: 9 } }
      },

      "haiku:649c20420d23": {
        d: {
          "0": {
            value: "M2.6,1.3 C6.1,2.1 7.3,4 8.1,7.3 C8.6,9.1 8.8,12.2 6.3,12.7 C2,13.5 -1.5,0.3 2.6,1.3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:2e554d46cb0f": {
        d: {
          "0": {
            value: "M6.4,2.2 C5.5,1.4 4.3,0.8 3.1,0.8 C2.6,0.8 2.6,1 2.5,1.4 C2.4,1.8 3,1.9 3.2,2.1 C4.4,2.8 5.5,3.5 6.2,4.7 C6.9,6 7.4,7.7 7.5,9.2 C7.5,10.4 7,12.3 5.3,11.8 C3.9,11.3 2.9,9.5 2.3,8.2 C1.7,6.8 1.2,5.2 1.1,3.6 C1.1,3.1 1.1,2.5 1.3,2 C1.4,1.7 2.5,1.3 2.5,1.3 C2.6,1 1.5,1.1 1.4,1.2 C0.9,1.4 0.6,1.9 0.5,2.4 C0.1,3.6 0.2,4.8 0.4,6 C0.8,8.4 1.9,11.6 4.1,13 C6.6,14.6 8.9,12.4 9,9.8 C9.3,7.2 8.4,3.9 6.4,2.2 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:8098fde11871": {
        "translation.x": { "0": { value: 11 } },
        "translation.y": { "0": { value: 4 } }
      },

      "haiku:0975d6140f8e": {
        d: {
          "0": {
            value: "M10.5,9.3 C10,10.5 9.6,11.8 9,13 C8.1,14.8 7.2,16.2 5.7,17.5 C3.2,19.7 1.8,18 1.2,15 C0.4,11.5 1.7,7.2 2.9,3.9 C4,1.1 7.2,-1.4 9.5,2.3 C9.5,2.4 11.6,6.5 10.5,9.3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:3a381996ad83": {
        d: {
          "0": {
            value: "M9.1,14.6 C9.6,13.7 9.9,12.8 10.2,11.9 C10.4,11.3 11,10.1 10.8,9.5 C10.6,8.9 10,9.4 9.8,9.6 C9.2,10.4 8.8,11.4 8.4,12.3 C7.5,14.2 6.4,16.1 4.6,17.3 C2.4,18.7 1.8,14.8 1.8,13.4 C1.6,11 2.2,8.5 2.9,6.2 C3.5,4.3 4.2,1.9 6.3,1.2 C8.4,0.5 9.6,3.4 10.1,4.9 C10.4,5.8 10.6,6.8 10.6,7.8 C10.6,7.9 10.4,9.3 10.5,9.4 C10.7,9.5 11,8 11.1,7.9 C11.2,7 11.1,6 10.9,5.1 C10.6,3.5 10,1.7 8.6,0.7 C7.1,-0.3 5.4,0.1 4.1,1.3 C2.7,2.5 2.1,4.2 1.6,5.9 C0.3,9.6 -0.6,13.9 1.1,17.6 C3.2,22 7.7,17.2 9.1,14.6 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:291dc6f22a62": {
        "translation.x": { "0": { value: 29 } },
        "translation.y": { "0": { value: 8 } }
      },

      "haiku:67c42d451cfb": {
        d: {
          "0": {
            value: "M3.9,0.9 C0.2,1.3 2,4.2 2.9,6.4 C3.8,8.6 4,14 6.8,14.5 C10,15.1 9.5,11.2 9.5,9.3 C9.5,6.2 8.4,4.4 7.6,1.8 C5.9,1 3.9,0.9 3.9,0.9 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:f3098b196d3b": {
        d: {
          "0": {
            value: "M2.7,3.5 C2.5,2.9 2.4,2.3 3,1.8 C3.3,1.6 4.4,1.2 3.9,0.6 C3.8,1.66533454e-16 2.1,0.7 1.8,0.8 C0.9,1.4 0.7,2.5 0.9,3.5 C1.1,4.5 1.6,5.4 2,6.2 C2.4,7.2 2.7,8.2 2.9,9.3 C3.3,11.2 3.9,13.8 5.7,14.8 C7.4,15.7 9.4,15 9.9,13.1 C10.5,11.1 10.2,8.4 9.8,6.5 C9.5,5.4 9.2,4.4 8.7,3.4 C8.5,2.9 8.3,1.7 7.8,1.3 C7.5,1 3.8,0.3 3.8,0.7 C3.8,0.9 5.6,1.3 5.7,1.3 C6.2,1.5 6.7,1.6 7.1,1.9 C7.4,2.2 7.5,3.1 7.6,3.5 C8.5,6.1 8.9,8.7 8.6,11.5 C8.5,12.4 8.3,13.8 7.1,13.6 C5.8,13.4 5.3,12.3 5,11.2 C4.6,9.9 4.4,8.6 4,7.4 C3.8,6.1 3.1,4.9 2.7,3.5 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:ef7c381f1870": {
        "translation.x": { "0": { value: 23 } },
        "translation.y": { "0": { value: 6 } }
      },

      "haiku:543956f51737": {
        d: {
          "0": {
            value: "M7.8,0.8 C10.8,2.8 11.2,13.2 8.8,16.3 C7.7,17.7 5.5,17.9 4.2,16.7 C2.3,14.8 1.4,9 1.6,6.5 C1.9,3.6 3.3,0.7 6.6,1 L7.8,0.8 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:5557a1ca8cd4": {
        d: {
          "0": {
            value: "M10.8,5.1 C10.5,3.6 9.8,1.2 8.2,0.6 C7.8,0.4 7.6,1.2 7.8,1.5 C8.3,2.2 8.6,3.2 8.8,4 C9.4,6.1 9.6,8.4 9.5,10.6 C9.4,12.4 9.2,15.6 7.4,16.6 C3.5,18.7 2.4,10.8 2.2,8.6 C2,6.7 2.2,4.4 3.4,2.8 C4,2 4.8,1.5 5.8,1.4 C6,1.4 7.8,1.2 7.8,0.9 C7.7,0.6 4.6,1 4.3,1.1 C2.8,1.7 2,3 1.5,4.5 C0.3,7.8 1,12.1 2.4,15.3 C3,16.7 3.9,18 5.5,18.4 C7.1,18.7 8.9,18 9.7,16.6 C11.6,13.3 11.5,8.6 10.8,5.1 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:0f9aa4c677b3": {
        "translation.x": { "0": { value: 53 } },
        "translation.y": { "0": { value: 11 } }
      },

      "haiku:82a9d21324db": {
        d: {
          "0": {
            value: "M45.5,0.6 C26.9,2 21.3,23.2 19.1,37.8 C17.1,50.9 6.5,60.3 5.2,73.9 C4.5,80.6 4.8,87.6 4.8,94.4 C4.8,100.4 2.5,104.8 1.7,110.2 C6.8,112 12.7,115 18.1,115.6 C21,115.9 20.5,116.9 22.2,113.5 C23.2,111.4 23.3,108.6 24.1,106.3 C25.5,102.4 27.8,99 29.6,95.2 C32,90.4 32.7,85.3 34.5,80.2 C37.1,73.1 35.4,64.9 40,59 C45.9,51.4 53.1,45.4 59.9,38.4 C66.1,32 67.5,24.2 65.9,15.5 C64.1,5.5 55.2,-0.1 45.5,0.6 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:86fef673926a": {
        d: {
          "0": {
            value: "M23.1,23.6 C24.9,17.8 27.7,11.9 32,7.5 C34.1,5.4 36.6,3.7 39.4,2.5 C40.5,2.1 41.7,1.7 42.8,1.4 C43.4,1.2 44.1,1.1 44.7,1 C45.3,0.9 45.4,0.9 45.3,0.3 C45.2,-0.5 39,1.2 38.4,1.4 C35.6,2.5 33,4.1 30.9,6.2 C26.3,10.6 23.4,16.6 21.5,22.6 C20.5,25.8 19.7,29 19,32.3 C18.4,35.6 18,39 17,42.2 C14.9,48.9 10.9,54.7 8,61 C6.6,64.1 5.4,67.3 4.7,70.6 C4,74 3.9,77.7 3.8,81.2 C3.7,84.8 3.8,88.4 3.8,92 C3.8,95.5 3.5,98.8 2.6,102.2 C1.9,104.9 1.2,107.5 0.7,110.3 C0.6,110.9 1.1,110.9 1.6,111 C2.4,111.3 3.1,111.6 3.9,111.9 C7.2,113.2 10.4,114.6 13.8,115.5 C15.3,115.9 16.8,116.1 18.3,116.3 C19.8,116.5 20.9,116.9 21.8,115.4 C23.5,112.5 23.6,109.2 24.7,106.1 C25.9,103 27.6,100.1 29.2,97.1 C30.8,94 32,90.8 32.9,87.4 C33.8,84.1 35.1,80.8 35.8,77.5 C36.6,74.1 36.7,70.7 37.3,67.3 C37.9,64 39,61.2 41,58.6 C45.4,53.1 50.5,48.4 55.5,43.5 C58,41.1 60.6,38.7 62.6,35.9 C64.6,33.1 65.9,29.9 66.5,26.6 C67.5,20.7 66.8,13.5 63.4,8.5 C61.4,5.6 58.6,3.3 55.3,1.9 C53.6,1.2 51.9,0.7 50.1,0.5 C49.8,0.5 45.4,0.2 45.4,0.5 C45.4,0.3 50.8,1 51.1,1 C54,1.6 56.7,2.8 59,4.6 C64,8.5 65.8,14.6 66,20.7 C66.1,24.1 65.7,27.5 64.4,30.7 C63.2,33.8 61.2,36.3 58.9,38.7 C54.1,43.6 49,48.1 44.3,53.1 C42.1,55.5 39.5,58 38,60.9 C36.5,63.9 36,67.2 35.6,70.4 C35.2,73.8 34.7,77.1 33.7,80.4 C32.5,83.7 31.8,87.1 30.7,90.4 C28.6,96.9 23.9,102.3 22.5,109 C22.2,110.6 21.9,112.1 21.1,113.6 C20.8,114.1 20.6,114.8 20.2,115.2 C20,115.4 18.5,114.9 18.2,114.9 C14.9,114.4 11.7,113.4 8.6,112.2 C7,111.5 5.3,110.9 3.7,110.2 C2.9,109.9 2.4,110 2.6,109.1 C3.3,105.7 4.4,102.5 5,99.1 C5.6,95.7 5.4,92.1 5.4,88.7 C5.4,85.1 5.4,81.5 5.5,78 C5.7,74.5 6.1,71 7.2,67.7 C8.2,64.5 9.7,61.4 11.3,58.4 C14.5,52.4 18.1,46.5 19.5,39.7 C20.7,34.3 21.4,28.9 23.1,23.6 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:ef8121933443": {
        d: {
          "0": {
            value: "M93.4,65.4 C98.2,52.5 92,38.1 93.1,24.4 C85.9,36.9 93.7,53.7 87.6,66.7 C86.3,69.4 84.4,72 83.7,74.9 C83.1,77.4 83.5,80.1 83.6,82.7 C84,93.8 79.1,104.2 74.2,114.2 C79.7,107.5 83.5,99.5 85.3,91.1 C86.4,86 86.7,80.8 88.5,75.9 C89.9,72.3 92,69 93.4,65.4 Z"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:cebfb3c122fb": {
        "translation.x": { "0": { value: 90 } },
        "translation.y": { "0": { value: 10 } }
      },

      "haiku:1f96e98ac42a": {
        d: {
          "0": {
            value: "M45.8,105.8 C46,105.8 46.3,105.8 46.5,105.8 C46.7,105.8 47,105.8 47.2,105.8 L47.2,105.8 C48.8,105.8 50.5,105.7 52.1,105.6 C55.8,105.4 59.5,105.1 63.1,104.6 C66.8,102.3 70.4,99.9 73.9,97.2 C80.4,92.3 85.5,85.9 89.8,79.1 C90.7,68 86,56.6 89,45.5 C90.7,39.3 92.4,34.9 92.3,28.1 C92.2,18.1 89.5,8.9 82.8,1.7 C79.2,1.3 75.7,4.7 72.2,5.1 C64.9,5.9 57.2,5.2 49.8,5.2 C48.7,5.2 47.6,5.2 46.5,5.2 C45.4,5.2 44.3,5.2 43.2,5.2 C35.9,5.2 28.1,5.9 20.8,5.1 C17.3,4.7 13.7,1.3 10.2,1.7 C3.5,8.9 0.8,18 0.7,28.1 C0.6,34.9 2.3,39.4 4,45.5 C6.8,55.8 2.9,66.4 3.1,76.8 C7.2,82.7 10.6,89.1 15.8,94 C20.7,98.7 26.6,102.1 32.7,105 C35.4,105.3 38.1,105.5 40.8,105.6 C42.5,105.7 44.1,105.7 45.8,105.8 L45.8,105.8 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:03ff30d5385f": {
        d: {
          "0": {
            value: "M81.1,89.3 C75.8,95.1 69.5,99.5 62.9,103.8 C62.4,104.1 61.8,104 61.3,104.1 C60.2,104.2 59.1,104.4 58,104.5 C56.2,104.7 54.5,104.8 52.7,105 C51.4,105.1 50.1,105.2 48.8,105.3 C48.3,105.3 47.8,105.4 47.4,105.4 C46.9,105.4 46.8,105.4 46.8,105.9 C46.9,105.8 47.1,105.6 47.2,105.5 C46.5,105.5 45.7,105.3 45.7,106.1 C45.7,106.4 47.3,106.3 47.6,106.4 C47.6,106.2 47.6,106.1 47.6,105.9 C47.5,106 47.3,106.2 47.2,106.3 C52.3,106.3 57.4,106.2 62.4,105.5 C63.5,105.4 64.3,104.7 65.2,104.1 C66.7,103.2 68.1,102.2 69.6,101.2 C72.5,99.3 75.3,97.2 77.8,94.9 C82.4,90.7 86.3,85.7 89.7,80.5 C89.9,80.2 90.4,79.6 90.4,79.2 C90.4,78.5 90.5,77.8 90.5,77.2 C90.6,73.6 90.2,70.1 89.8,66.5 C88.9,59.6 87.9,52.7 89.6,45.9 C91,40.2 92.9,34.9 93,29 C93.1,22.2 91.9,15.3 88.8,9.2 C87.5,6.5 85.8,4.1 83.8,1.9 C83.5,1.6 83.2,1 82.7,1 C81.3,0.9 80,1.2 78.6,1.7 C77.2,2.2 76,3 74.6,3.5 C73.1,4.2 71.7,4.4 70.1,4.5 C66.6,4.8 63.1,4.7 59.6,4.7 C52.4,4.5 45.2,4.4 38.1,4.6 C34.5,4.7 30.9,4.8 27.3,4.8 C23.9,4.8 20.5,4.8 17.4,3.3 C15.9,2.6 14.5,1.9 13,1.4 C12.4,1.2 10.2,0.6 9.7,1.2 C9.3,1.4 9,2 8.7,2.3 C7.6,3.5 6.6,4.9 5.8,6.3 C2.1,12.1 0.5,19 0.1,25.8 C-0.1,29.3 0.1,32.8 0.8,36.2 C1.5,39.5 2.6,42.7 3.4,46 C5.1,52.9 4,59.9 3.2,66.8 C3,68.5 2.8,70.2 2.7,71.8 C2.6,73.4 2.3,75.3 2.5,76.9 C2.7,77.3 3.1,77.8 3.4,78.2 C4.4,79.7 5.4,81.3 6.4,82.8 C8.8,86.4 11.2,90 14.2,93.1 C17.3,96.3 20.9,98.9 24.7,101.2 C26.5,102.3 28.3,103.3 30.2,104.2 C30.9,104.6 31.7,104.9 32.4,105.3 C33.1,105.6 34.3,105.5 35.1,105.5 C37.1,105.6 39,105.8 41,105.9 C41.9,105.9 42.7,105.9 43.6,105.9 C44,105.9 45.2,106.1 45.6,105.9 C45.6,105.9 45.6,105.9 45.6,105.9 C45.6,105.9 45.6,105.9 45.6,105.9 C43.4,105.4 40.9,105.6 38.6,105.4 C37.1,105.3 35.5,105.1 34,105 C33.4,104.9 32.8,105 32.3,104.7 C31.6,104.3 30.9,104 30.2,103.6 C24.3,100.5 18.5,96.8 14,91.7 C11.8,89.2 9.9,86.5 8.1,83.8 C7.2,82.4 6.2,80.9 5.3,79.5 C4.7,78.6 3.5,77.4 3.5,76.4 C3.6,69.8 5,63.3 5.4,56.7 C5.6,53.2 5.5,49.7 4.7,46.3 C3.9,42.9 2.8,39.6 2.1,36.3 C0.7,29.5 1.2,22.1 3.2,15.5 C4.2,12.3 5.6,9.1 7.6,6.3 C8.4,5.2 9.1,4.2 10,3.2 C10.7,2.5 10.9,2.5 12,2.7 C15.3,3.4 17.9,5.7 21.4,6.1 C25,6.4 28.6,6.5 32.2,6.4 C39.4,6.3 46.5,6.1 53.7,6.2 C57.3,6.3 60.8,6.4 64.4,6.4 C67.7,6.4 71.3,6.6 74.4,5.5 C75.9,5 77.2,4.2 78.6,3.6 C79.4,3.2 81.4,2.2 82.3,2.7 C82.6,2.6 84,4.7 84.1,4.8 C85.1,6.1 86,7.4 86.7,8.8 C89.7,14.2 91.1,20.4 91.3,26.5 C91.4,29.5 91.3,32.5 90.7,35.4 C90.2,38.2 89.3,41 88.5,43.8 C87,49.3 86.7,54.7 87.3,60.3 C87.9,66.3 89.1,72.2 88.8,78.3 C88.7,79.8 87.5,81.1 86.7,82.3 C85.1,84.5 83.2,87 81.1,89.3 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:df372070c571": {
        fill: { "0": { value: "#E29C7D" } },
        cx: { "0": { value: "134.9" } },
        cy: { "0": { value: "17.3" } },
        rx: { "0": { value: "34.3" } },
        ry: { "0": { value: "17.1" } }
      },

      "haiku:9e3146b4dc20": {
        d: {
          "0": {
            value: "M97.8,86 C97.8,87.2 97.7,88.5 98.3,89.5 C99,90.8 100.6,91.5 102,92 C125.3,100.5 152.4,97.9 173.6,85 C175.2,84 176.9,82.9 177.6,81.2 C178.8,78.6 177.6,75.6 176.7,72.9 C175.3,68.7 174.5,64.1 175.2,59.7 C175.9,55 178.2,50.6 179.3,46 C180.4,41.3 179.8,35.7 176,32.8 C178.6,42.8 176,53.9 169.8,62.3 C163.6,70.6 154.2,76.3 144.1,78.7 C134,81.1 123.3,80.4 113.3,77.7 C109.8,76.7 106.3,75.5 103.4,73.2 C100.5,71 98.4,67.6 98.3,63.9 C98.2,71.2 98,78.6 97.8,86 Z"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:deb08fb728c1": {
        "translation.x": { "0": { value: 45 } },
        "translation.y": { "0": { value: 109 } }
      },

      "haiku:63bbee432fc1": { "translation.x": { "0": { value: 4 } } },
      "haiku:0dc3b0eef11d": {
        d: {
          "0": {
            value: "M36.3,11.6 C35.5,11.1 34.6,10.8 33.9,10.2 C33.2,8.9 32.4,7.6 31.4,6.3 C30.9,5.1 30.3,3.9 28.6,3.4 C26.9,2 25,1.1 22.9,1.1 C17.5,1.2 10.8,4.7 6.4,7.7 C4.1,9.3 0.2,12.8 1,16 C1.9,19.4 6.1,20.7 9.3,20.7 C11,20.7 12.6,20.2 14.4,20.3 C16,20.4 17.4,21.3 19.1,21.3 C20.7,21.3 22.9,21.2 24.3,20.3 C25.1,19.8 25.8,18.9 26.4,18.2 C27.5,17 28.1,16.3 29,15.6 C31.1,17 34.3,18.1 36.5,17.6 C40.7,16.7 39,13.2 36.3,11.6 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:7578cf8ca527": {
        d: {
          "0": {
            value: "M28.4,4.3 C29.4,4.6 30,5.4 30.5,6.3 C30.9,7.1 31.5,7.8 32.1,8.6 C32.6,9.3 33,10.4 33.7,10.9 C34,11.1 36.6,12.6 36.5,11.4 C36.6,11.3 34.5,9.8 34.3,9.5 C33.7,8.3 33,7.2 32.2,6.1 C31.9,5.6 31.7,5 31.4,4.5 C30.8,3.5 29.8,3.2 28.9,2.6 C26.5,0.8 24.1,0.2 21.1,0.6 C18.2,1 15.3,2.1 12.7,3.3 C9.7,4.7 6.6,6.5 4.1,8.7 C1.9,10.6 -0.6,13.7 0.5,16.8 C2.1,21 7.5,21.9 11.5,21.3 C12.5,21.2 13.5,21 14.6,21.1 C15.8,21.2 16.8,21.7 18,21.9 C20.1,22.3 23,22 24.8,20.8 C26.5,19.7 27.5,17.8 29,16.5 C29.3,16.2 30.9,17.3 31.3,17.4 C32.4,17.8 33.6,18.1 34.7,18.2 C36.5,18.3 39.6,17.6 39.4,15.3 C39.3,14.3 38.7,13.4 38,12.8 C37.9,12.7 36.4,11.5 36.4,11.7 C36.4,11.7 38.2,13.6 38.4,13.8 C39.1,15 39.1,16.3 37.7,17 C35.1,18.3 31.8,16.9 29.6,15.5 C29.5,15.4 29.2,15.2 29.1,15.2 C28.7,15.5 28.2,15.9 27.9,16.2 C26.7,17.3 25.8,18.7 24.5,19.7 C22,21.5 18.6,20.7 16,20 C14.5,19.6 13,19.8 11.5,20 C9.9,20.2 8.2,20.2 6.6,19.7 C3.3,18.8 0.7,16.1 2.8,12.7 C4.5,9.9 7.5,8.1 10.2,6.5 C13.1,4.8 16.3,3.3 19.5,2.5 C20.8,2.2 22.1,2 23.4,2 C24.6,2.1 25.7,2.4 26.7,3 C27.1,3.4 27.7,4 28.4,4.3 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:27b2cd6537ae": { "translation.y": { "0": { value: 9 } } },
      "haiku:6cf9cde8e086": {
        d: {
          "0": {
            value: "M7.1,1.3 C3.6,2.1 2.4,4 1.6,7.3 C1.1,9.1 0.9,12.2 3.4,12.7 C7.7,13.5 11.2,0.3 7.1,1.3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:497948027c02": {
        d: {
          "0": {
            value: "M4.5,3.5 C4.8,3.3 7.3,1.9 7.2,1.6 C7.5,0.2 4.7,1.3 4.3,1.6 C2.8,2.4 1.9,4 1.4,5.6 C0.8,7.4 0.3,9.5 0.9,11.4 C1.5,13 3.3,14.1 4.9,13.4 C6.5,12.7 7.6,11 8.2,9.4 C8.9,7.7 9.4,5.8 9.4,3.9 C9.4,3.2 9.3,2.4 8.9,1.8 C8.7,1.5 8.4,1.2 8,1.1 C7.9,1.1 7,1 7.1,1.3 C7.1,1.4 7.7,1.5 7.8,1.5 C8.1,1.7 8.3,2 8.4,2.3 C8.6,3.1 8.5,4.1 8.3,4.9 C7.9,7 7,9.4 5.5,11 C4.8,11.7 4,12.1 3.1,11.7 C2.2,11.3 2.1,10.1 2.2,9.2 C2.3,7.4 3,4.8 4.5,3.5 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:bdea95fda14e": {
        "translation.x": { "0": { value: 21 } },
        "translation.y": { "0": { value: 4 } }
      },

      "haiku:73c2c330f003": {
        d: {
          "0": {
            value: "M1.3,9.3 C1.8,10.5 2.2,11.8 2.8,13 C3.7,14.8 4.6,16.2 6.1,17.5 C8.6,19.7 10,18 10.6,15 C11.4,11.5 10.1,7.2 8.9,3.9 C7.8,1.1 4.6,-1.4 2.3,2.3 C2.2,2.4 0.1,6.5 1.3,9.3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:2976d4bda244": {
        d: {
          "0": {
            value: "M4.1,13.8 C3.7,13.1 2.3,8.9 1.3,9.3 C0.2,9.7 2.2,13.8 2.6,14.5 C3.6,16.3 5.3,18.6 7.4,19.2 C10.3,20 11.3,16.1 11.5,14 C11.8,11.3 11.1,8.5 10.3,6 C9.6,3.9 8.8,1.5 6.6,0.4 C4.4,-0.7 2.3,0.6 1.5,2.7 C1,3.8 0.7,5 0.6,6.3 C0.6,6.5 0.7,9.6 1.2,9.3 C1.2,9.3 1.2,6.9 1.2,6.7 C1.4,5.3 1.9,3.7 2.6,2.5 C3.4,1.3 4.6,0.6 6,1.3 C7.4,2.1 8,3.5 8.5,4.9 C9.6,8.1 10.5,11.7 9.7,15.1 C9.4,16.4 8.7,18.2 7.2,17.1 C5.9,16.5 4.9,15.2 4.1,13.8 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:ef8af28bc7dd": {
        "translation.x": { "0": { value: 4 } },
        "translation.y": { "0": { value: 8 } }
      },

      "haiku:d6b9eeaef9f7": {
        d: {
          "0": {
            value: "M6.8,0.9 C10.5,1.3 8.7,4.2 7.8,6.4 C6.9,8.6 6.7,14 3.9,14.5 C0.7,15.1 1.2,11.2 1.2,9.3 C1.2,6.2 2.3,4.4 3.1,1.8 C4.8,1 6.8,0.9 6.8,0.9 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:70ab7e0fec33": {
        d: {
          "0": {
            value: "M9.7,4 C10.1,2.5 9.6,0.8 7.9,0.5 C7.4,0.4 6.8,0.3 6.8,0.9 C6.7,1.6 7.5,1.6 7.9,2 C8.9,2.9 7.2,5.4 6.8,6.3 C6.1,8.2 6,10.2 5.2,12.1 C4.7,13.1 2.9,14.8 2.1,13.1 C1.4,11.5 1.6,9 1.8,7.3 C2,5.6 2.7,3.9 3.3,2.2 C3.5,1.6 6.7,1.3 6.7,0.9 C6.7,0.5 3.8,1.1 3.6,1.2 C2.4,1.5 2.4,2.2 1.9,3.3 C0.7,6.2 -0.1,9.5 0.4,12.7 C0.9,16 4.8,16 6.3,13.4 C7.1,12 7.4,10.3 7.8,8.7 C8.4,7 9.2,5.6 9.7,4 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:f3f1cd5fc9f2": {
        "translation.x": { "0": { value: 9 } },
        "translation.y": { "0": { value: 6 } }
      },

      "haiku:4551b584a9ea": {
        d: {
          "0": {
            value: "M3.9,0.8 C0.9,2.8 0.5,13.2 2.9,16.3 C4,17.7 6.2,17.9 7.5,16.7 C9.4,14.8 10.3,9 10.1,6.5 C9.8,3.6 8.4,0.7 5.1,1 L3.9,0.8 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:dd61067d7a0f": {
        d: {
          "0": {
            value: "M2.6,5.4 C2.8,4.5 3,3.6 3.3,2.7 C3.5,2.1 4.3,1.3 3.9,0.8 C3,-0.6 1.1,4.1 1,4.7 C0.4,7.1 0.4,9.6 0.7,12 C1,14.2 1.6,17.1 3.9,18 C9.3,20.2 10.6,12 10.7,8.5 C10.8,6.3 10.4,3.7 8.8,2 C8.2,1.3 7.4,0.9 6.4,0.7 C6.2,0.7 3.8,0.6 3.8,0.7 C3.8,1 6.6,1.4 6.8,1.5 C8,2.1 8.7,3.2 9.1,4.4 C10,7.3 9.3,10.9 8.3,13.7 C7.9,14.7 7.5,15.9 6.5,16.5 C5.2,17.2 3.8,16.4 3.2,15.2 C1.8,12.4 2,8.5 2.6,5.4 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:129c445a3cf5": {
        "translation.x": { "0": { value: 91 } },
        "translation.y": { "0": { value: 81 } }
      },

      "haiku:6445c00ba97c": {
        d: {
          "0": {
            value: "M3.2,0.5 C-1.11022302e-16,9.5 8.8,19.2 15.5,23.8 C22.1,28.3 28.4,34.1 32.9,41 C35.1,44.4 38.6,46.6 42.6,47.1 C49,47.8 56.6,47.1 61.3,45.3 C67.4,42.9 69.6,33.1 74.5,28.2 C80.2,22.5 90.1,21.3 91.6,12.6 C92,10.1 92.6,6 91.6,3.7 C90,-1.11022302e-16 87.2,1.8 83.6,3.3 C68.4,9.5 52.8,16.5 35.8,13.8 C23.2,11.8 12.5,5.1 0.5,2.2"
          }
        },

        fill: { "0": { value: "#EDDDD5" } }
      },

      "haiku:56574d82eac5": {
        d: {
          "0": {
            value: "M16.1,23.1 C11.5,19.8 7.2,15.7 4.7,10.5 C3.6,8.2 2.8,5.4 3.1,2.8 C3.2,2.2 3.3,1.6 3.4,1 C3.5,0.4 3.5,0.5 3,0.3 C2.6,0.1 2,3.1 2,3.5 C1.3,10 5.7,16.1 10.1,20.3 C12.4,22.5 15.1,24.3 17.7,26.2 C20.3,28.1 22.7,30.2 25,32.5 C27.3,34.8 29.4,37.2 31.3,39.9 C33.2,42.5 35,44.9 37.9,46.3 C41,47.8 44.5,47.9 47.8,47.9 C51.3,47.9 54.9,47.6 58.3,46.7 C60.8,46.1 63,45.3 64.8,43.5 C67.2,41.2 68.7,38.2 70.3,35.3 C71.8,32.5 73.4,29.7 75.8,27.6 C78.4,25.4 81.4,23.9 84.3,22.2 C87,20.6 89.6,18.6 91.1,15.8 C92,14.1 92.3,12.2 92.5,10.3 C92.9,7.5 93.3,3.3 90.9,1.2 C88.5,-0.8 84.8,1.6 82.5,2.6 C69.8,7.8 56.6,13.6 42.5,13.5 C34.4,13.4 26.8,11 19.3,8.2 C18.2,7.8 0.6,1.1 0.4,1.8 C0.4,1.6 14.3,6.9 15.2,7.3 C21.3,9.8 27.5,12.4 34,13.7 C47.9,16.4 61.5,12.5 74.4,7.4 C77.7,6.1 80.9,4.8 84.2,3.5 C85.6,2.9 87.1,2.1 88.6,2 C90.2,1.9 90.9,3.4 91.2,4.7 C91.8,7.5 91.2,10.6 90.6,13.3 C90,15.6 88.4,17.5 86.6,19 C84,21.1 81,22.4 78.2,24.2 C75.4,26 73.1,28.1 71.3,30.9 C69.5,33.7 68.1,36.7 66.3,39.5 C64.9,41.6 63.2,43.6 60.7,44.5 C56.3,46.1 51.3,46.5 46.7,46.4 C42.1,46.3 37.8,45.5 34.7,41.8 C33.3,40.2 32.3,38.4 31,36.7 C29.6,35 28.2,33.3 26.7,31.8 C23.4,28.6 19.9,25.7 16.1,23.1 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:1c39287516d5": {
        "translation.x": { "0": { value: 90 } },
        "translation.y": { "0": { value: 72 } }
      },

      "haiku:fc84b08e15e0": {
        d: {
          "0": {
            value: "M5,0.5 C-3.4,6.2 5.6,20.8 11.3,24.9 C24.2,34.2 48.5,33.7 63.3,30.9 C73.8,28.9 89.6,23.1 92.4,11.4 C93,9 93.1,5.2 90.5,3.9 C87.4,2.4 83.6,6.8 81.1,8.7 C67,18.9 50.1,23.9 32.9,19.7 C26.9,18.2 21,17 15.2,14.9 C8.8,12.5 7.9,8.5 3.2,4.5"
          }
        },

        fill: { "0": { value: "#EDDDD5" } }
      },

      "haiku:76f47ebd4889": {
        d: {
          "0": {
            value: "M10.6,23.3 C6.3,19.4 2.3,13.2 2.2,7.2 C2.2,5.8 2.4,4.5 3.1,3.3 C3.4,2.8 3.7,2.4 4,1.9 C4.3,1.5 4.9,1.2 5.1,0.8 C5.1,0.7 4.8,0.3 4.7,0.3 C4.2,0.5 3.7,0.9 3.3,1.3 C2.2,2.3 1.5,3.6 1.2,5 C-0.3,11 3.6,17.9 7.3,22.2 C9.7,25 12.9,27.2 16.3,28.6 C28.2,33.4 41.2,34.1 53.9,32.9 C60.7,32.3 67.5,31 73.9,28.6 C79.8,26.4 85.7,23.2 89.7,18.2 C91.6,15.8 92.9,12.9 93.3,9.8 C93.6,6.9 92.7,3 89.2,2.8 C86.2,2.6 83.6,5.5 81.5,7.3 C78.9,9.4 76,11.2 73.1,12.8 C60.9,19.6 46.9,22.2 33.2,19.1 C27.2,17.8 21.1,16.5 15.3,14.4 C12.6,13.4 10.4,11.8 8.4,9.7 C8,9.3 3.3,4 3,4.3 C3,4.3 6.8,8.5 7.1,8.9 C9,11.2 11.1,13.3 14,14.6 C19.7,17.1 25.9,18.3 31.8,19.8 C38.4,21.5 45.2,22 52,21.2 C58.9,20.3 65.5,18.1 71.7,15 C74.7,13.5 77.6,11.8 80.3,9.8 C81.6,8.9 82.9,7.8 84.1,6.8 C85.3,5.8 86.7,4.7 88.2,4.3 C91.9,3.4 92,8.5 91.5,10.8 C90.8,14 89.1,16.7 86.8,19 C82.3,23.5 76.1,26.3 70.1,28.2 C63.4,30.3 56.5,31.2 49.5,31.6 C42.5,32 35.4,31.8 28.5,30.5 C22.2,29.4 15.8,27.5 10.6,23.3 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:f83067e8d1e0": {
        "translation.x": { "0": { value: 47 } },
        "translation.y": { "0": { value: 79 } }
      },

      "haiku:239cadc96cb5": {
        d: {
          "0": {
            value: "M9.4,3 C8.1,2.2 6.7,1.4 5.2,1.3 C3.7,1.2 2,1.9 1.4,3.3 C0.6,5.2 1.9,7.2 2.6,9.1 C4.8,14.8 2.2,21.9 5.8,26.7 C7.6,29.2 10.9,30.7 11.6,33.7 C11.8,34.5 11.8,35.4 12.3,36.1 C12.6,36.5 13.1,36.7 13.6,36.9 C16.5,37.7 19.3,35.5 21.2,33.1 C22.9,30.8 24.3,28 23.9,25.2 C23.7,24 23.3,22.8 22.8,21.7 C21.1,17.6 19.3,13.4 16.6,9.8 C14.7,7.2 12.2,4.8 9.4,3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:97a4b48150fc": {
        d: {
          "0": {
            value: "M2,5 C1.8,3.9 2.5,2.8 3.5,2.3 C5,1.6 6.6,2.1 8,2.7 C8.2,2.8 9.2,3.3 9.3,3.2 C9.5,3.1 9.7,2.7 9.5,2.5 C8.6,1.5 7.2,0.9 5.9,0.6 C3.1,2.79221091e-14 -0.2,2 0.4,5.2 C0.6,6.7 1.3,7.9 1.8,9.3 C2.4,10.9 2.6,12.6 2.7,14.3 C2.9,17.7 2.6,21.3 3.8,24.6 C5,27.8 7.7,29.3 9.7,31.8 C10.7,33 10.7,34.3 11.2,35.7 C11.7,37.2 13.3,37.8 14.8,37.8 C18,37.8 20.6,35.1 22.3,32.6 C24,30 25.1,26.9 24.2,23.8 C23.3,20.7 21.7,17.6 20.2,14.8 C18.8,12.1 17.1,9.5 15,7.3 C14.7,7 9.6,2.3 9.3,2.9 C9.3,2.8 14.2,7.5 14.5,7.9 C16.5,10.2 18.1,12.9 19.4,15.7 C20.1,17.1 20.7,18.6 21.3,20 C22,21.6 22.8,23.2 23.1,24.9 C23.7,28.1 21.8,31.4 19.7,33.6 C18.7,34.7 17.4,35.7 15.9,36.1 C14.7,36.4 12.9,36.4 12.5,34.9 C12.1,33.4 11.9,32.1 10.9,30.8 C9.8,29.4 8.4,28.4 7.3,27.2 C4.9,24.8 4.5,21.5 4.5,18.3 C4.4,14.9 4.5,11.4 3.2,8.2 C2.7,7.2 2.2,6.2 2,5 C2,5 2.2,6.2 2,5 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:250843d25545": {
        d: {
          "0": {
            value: "M59.5,89.9 C58.2,89.1 56.5,88.5 55.2,89.3 C53.9,90.1 53.8,91.9 53.9,93.4 C54.4,99.5 57.2,105.5 61.8,109.6 C62.5,110.2 63.2,110.8 64,111.1 C64.9,111.4 65.9,111.3 66.5,110.7 C67.3,110 67.3,108.7 67.3,107.6 C67.1,104.2 66.7,100.9 65.5,97.7 C64.3,94.5 62.3,91.8 59.5,89.9 Z"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:7e332b05ab69": {
        "translation.x": { "0": { value: 191 } },
        "translation.y": { "0": { value: 79 } }
      },

      "haiku:ad7bd76b6dca": {
        d: {
          "0": {
            value: "M16.3,3 C17.6,2.2 19,1.4 20.5,1.3 C22,1.2 23.7,1.9 24.3,3.3 C25.1,5.2 23.8,7.2 23.1,9.1 C20.9,14.8 23.5,21.9 19.9,26.7 C18.1,29.2 14.8,30.7 14.1,33.7 C13.9,34.5 13.9,35.4 13.4,36.1 C13.1,36.5 12.6,36.7 12.1,36.9 C9.2,37.7 6.4,35.5 4.5,33.1 C2.8,30.8 1.4,28 1.8,25.2 C2,24 2.4,22.8 2.9,21.7 C4.6,17.6 6.4,13.4 9.1,9.8 C11,7.2 13.5,4.8 16.3,3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:a7e980a6f0db": {
        d: {
          "0": {
            value: "M25.3,5.2 C25.9,2 22.6,0 19.8,0.6 C18.6,0.8 17.4,1.5 16.4,2.3 C16,2.7 16.1,2.7 16.3,3.1 C16.5,3.4 17.4,2.8 17.6,2.7 C18.9,2.2 20.3,1.7 21.7,2.2 C22.9,2.6 23.8,3.7 23.5,5 C23.3,6.6 22.4,8 21.9,9.4 C21.4,11.1 21.2,12.8 21.1,14.6 C20.9,17.9 21.3,21.6 19.9,24.7 C18.6,27.6 15.5,29.1 13.9,31.8 C13.5,32.5 13.2,33.2 13.1,34 C13,34.5 13,35.2 12.6,35.7 C11.7,36.8 9.5,36.3 8.4,35.8 C5.6,34.4 3.3,31.3 2.5,28.3 C1.7,25.5 2.8,23 3.9,20.4 C4.9,17.9 6,15.5 7.3,13.1 C8.5,10.8 10.1,8.7 11.8,6.9 C12.1,6.6 16.1,3 16.1,3 C15.8,2.5 10.7,7.1 10.4,7.4 C8.3,9.6 6.6,12.2 5.2,14.9 C3.7,17.7 2.1,20.8 1.2,23.9 C0.3,27.1 1.5,30.3 3.3,33 C5,35.5 7.7,38 11,37.8 C12.4,37.7 13.7,37.1 14.2,35.7 C14.4,35 14.4,34.3 14.7,33.6 C14.9,32.8 15.4,32.1 16,31.5 C18.2,29.1 20.8,27.4 21.8,24.2 C22.9,20.9 22.5,17.3 22.8,13.8 C22.9,12.2 23.2,10.7 23.7,9.2 C24.4,8 25.1,6.7 25.3,5.2 C25.3,5.2 25.1,6.9 25.3,5.2 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:584d2f43cf57": {
        d: {
          "0": {
            value: "M196.8,105.5 C197.4,99.8 199.7,94.2 203.2,89.6 C204.1,88.4 205.6,87.1 207,87.8 C208.2,88.3 208.4,89.9 208.5,91.2 C208.7,97.1 208.4,103.3 205.3,108.3 C204.1,110.3 201.9,112.2 199.6,111.8 C197.7,111.5 196.4,109.6 196,107.8 C195.6,106 196.6,107.4 196.8,105.5 Z"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:e39cab39b3f5": {
        "translation.x": { "0": { value: 56 } },
        "translation.y": { "0": { value: 2 } }
      },

      "haiku:ebfea7a0e9ad": {
        d: {
          "0": {
            value: "M146.4,38.9 C141.9,30.6 134.4,23.9 126.7,18.4 C121.3,14.5 115.5,10.8 109.5,7.7 C105,5.4 91.3,1.6 77,1.6 C62.3,1.6 47,5.4 42.5,7.7 C36.5,10.8 30.7,14.5 25.3,18.4 C17.6,23.9 10.1,30.6 5.6,38.9 C-2.4,53.7 1.2,70.7 7,85.6 C11.1,96 10.7,104.7 9.8,115.4 C8.9,126.1 10.4,136.7 20,143.2 C32.1,151.3 44.6,152.9 58.8,153.6 C58.8,154 70.2,154.7 75.9,154.5 C81.4,154.7 93,154 93,153.6 C107.2,152.9 119.7,151.3 131.8,143.2 C141.5,136.7 142.9,126.1 142,115.4 C141.1,104.7 140.8,96 144.8,85.6 C150.9,70.7 154.4,53.7 146.4,38.9 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:070c6491a496": {
        d: {
          "0": {
            value: "M98.4,4.9 C101.3,5.6 104.1,6.3 106.8,7.4 C110,8.6 113.1,10.5 116,12.3 C121.7,15.7 127.2,19.5 132.4,23.7 C136.8,27.4 140.9,31.5 144.2,36.2 C144.8,37 145.3,37.9 145.9,38.7 C146.2,39.1 146.8,39 146.5,38.4 C145.4,36 143.9,33.8 142.3,31.8 C138.5,26.9 133.8,22.7 128.8,18.9 C123.2,14.7 117.4,10.9 111.2,7.6 C105.7,4.6 99.3,3.2 93.1,2.1 C86,0.9 78.8,0.4 71.6,0.8 C64.5,1.2 57.5,2.2 50.6,4 C47.2,4.9 43.9,5.8 40.9,7.5 C37.7,9.2 34.6,11 31.6,13 C20.7,20 9.2,28.6 3.7,40.9 C-2.2,54.1 0.2,68.8 4.8,82 C5.9,85.3 7.3,88.4 8.2,91.8 C9.1,95.3 9.5,98.8 9.6,102.4 C9.8,109.5 8.4,116.7 9,123.8 C9.4,128.9 10.8,134.1 13.9,138.3 C17,142.5 21.6,145.3 26.3,147.6 C36.5,152.5 47.7,153.7 58.9,154.3 C58.7,154.1 58.5,153.9 58.2,153.7 C58.3,154.5 59.4,154.5 59.9,154.5 C61.4,154.7 63,154.8 64.5,154.9 C68.2,155.1 71.8,155.3 75.5,155.1 C79.2,155 82.8,155.1 86.5,154.9 C88.3,154.8 90,154.7 91.8,154.5 C92.4,154.4 93.6,154.5 93.7,153.7 C93.5,153.9 93.3,154.1 93.1,154.3 C106.9,153.6 121.2,151.7 132.8,143.3 C138.1,139.5 141.2,133.8 142.3,127.5 C143.5,120.6 142.3,113.7 142,106.8 C141.8,100.7 142.4,94.5 144.3,88.7 C146.2,82.8 148.5,77.2 149.8,71.1 C151,65.3 151.6,59.2 150.9,53.3 C150.6,50.7 150,48.2 149.3,45.7 C149.1,45.2 146.6,38.8 146.3,39 C146.5,38.9 149,45.9 149.2,46.5 C150,49.3 150.4,52.2 150.6,55.1 C151,61.8 149.9,68.6 148.1,75 C146.2,81.6 143.1,87.8 141.9,94.6 C140.6,101.7 141.1,108.8 141.6,115.9 C142,121.7 141.8,127.8 139.4,133.3 C137,138.8 132.5,142.4 127.3,145.2 C121.8,148.2 115.8,150.1 109.7,151.2 C106.7,151.8 103.7,152.1 100.6,152.4 C99,152.5 97.5,152.6 95.9,152.7 C95,152.8 94.2,152.8 93.3,152.8 C92.7,152.8 92.9,152.9 92.9,153.5 C92.8,153.5 92.6,153.1 92.6,153 C86.9,153.8 81.1,153.6 75.3,153.8 C72.3,153.9 69.2,153.8 66.2,153.6 C63.9,153.5 61.3,153.5 59,153 C59,153.1 58.8,153.6 58.7,153.6 C58.7,153.1 58.9,152.9 58.3,152.9 C57.5,152.9 56.7,152.8 55.9,152.8 C54.1,152.7 52.4,152.6 50.6,152.4 C47.2,152.1 43.8,151.6 40.4,150.9 C33.8,149.5 27.4,147.2 21.7,143.5 C16.1,139.9 12.4,134.9 11,128.4 C9.5,121.3 10.8,114.3 11,107.2 C11.2,100 10.4,93.1 7.9,86.3 C5.5,79.8 3.2,73.3 2.2,66.4 C1.2,59.6 1.4,52.7 3.4,46.1 C5.3,39.8 9,34.2 13.6,29.5 C18.2,24.6 23.7,20.5 29.2,16.7 C34.8,12.9 40.8,8.8 47.4,6.8 C61.1,2.7 75.9,1.5 90,3.6 C93,3.7 95.7,4.3 98.4,4.9 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:0bdae02edf8e": {
        d: {
          "0": {
            value: "M156.5,124.8 C155.7,121.5 154.7,118 152.6,115.4 C149.7,111.7 145.1,110.2 140.7,109.3 C137.6,108.7 134.5,108.3 131.4,108.6 C128.3,108.3 125.2,108.6 122.1,109.3 C117.7,110.2 113.1,111.7 110.2,115.4 C108.1,118 107.1,121.5 106.3,124.8 C105.7,127.3 105.1,129.9 105.5,132.4 C106.3,136.6 111.2,140.8 115.1,140.5 C118.8,140.2 120.7,140.3 123.6,137.8 C125.9,135.8 128.5,133.9 131.4,133.5 C134.2,133.9 136.9,135.8 139.2,137.8 C142,140.3 146.1,140.2 149.7,140.5 C153.7,140.8 156.6,136.6 157.3,132.4 C157.7,129.9 157.1,127.3 156.5,124.8 Z"
          }
        },

        fill: { "0": { value: "#D78280" } }
      },

      "haiku:9a42636fddce": {
        d: {
          "0": {
            value: "M154.6,126.7 C153.8,123.8 152.9,120.8 150.9,118.5 C149,116.3 146.3,114.9 143.6,114.1 C140.5,113.2 137.3,112.6 134.1,112.5 C132.4,112.5 130.8,112.5 129.1,112.5 C127.3,112.5 125.5,112.7 123.7,113 C117.8,114 111.9,116 109.3,121.9 C108.1,124.7 107,128.2 106.9,131.3 C106.8,134.2 108.1,136.8 110.6,138.3 C115.2,141.2 119.8,138.1 123.4,135.1 C125.4,133.5 127.6,131.8 130.1,131.1 C132.6,130.5 135.3,132.3 137.2,133.7 C140.9,136.4 144.9,140.8 150,139.1 C152.1,138.4 153.9,136.8 154.8,134.8 C156,132.2 155.3,129.3 154.6,126.7 C153.8,123.8 155.2,128.9 154.6,126.7 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:7babdec67c2f": {
        fill: { "0": { value: "#893C30" } },
        "translation.x": { "0": { value: 82 } },
        "translation.y": { "0": { value: 75 } }
      },

      "haiku:6227c342c6df": {
        d: {
          "0": {
            value: "M25,17.2 C25,17.2 24.6,17 23.9,16.8 C20.8,15.8 11.5,13.6 6.6,20.8 L0.7,16.7 C0.7,16.7 15.2,4.3 25,17.2 Z"
          }
        }
      },

      "haiku:16b7e23d249c": {
        d: {
          "0": {
            value: "M23.2,18.2 C24.6,17.9 26.1,17.5 27.5,17.9 C22.1,15.8 15.6,16.9 11.2,20.5 C10.4,21.2 9.5,22.3 10,23.3 C13.8,20.5 18.6,19.3 23.2,18.2 Z"
          }
        }
      },

      "haiku:e8d2989bea9c": {
        d: {
          "0": {
            value: "M24.6,11.8 C21,7.1 15.5,3.9 9.6,3.1 C10.6,2.3 11.4,1.4 12,0.4 C18.3,2.5 22.3,5.6 24.6,11.8 Z"
          }
        }
      },

      "haiku:e3fd453d4391": {
        fill: { "0": { value: "#893C30" } },
        "translation.x": { "0": { value: 151 } },
        "translation.y": { "0": { value: 75 } }
      },

      "haiku:db0af267f35d": {
        d: {
          "0": {
            value: "M2.7,17.2 C2.7,17.2 3.1,17 3.8,16.8 C6.9,15.8 16.2,13.6 21.1,20.8 L27,16.7 C27,16.7 12.5,4.3 2.7,17.2 Z"
          }
        }
      },

      "haiku:4c86a3e4ea8e": {
        d: {
          "0": {
            value: "M4.6,18.2 C3.2,17.9 1.7,17.5 0.3,17.9 C5.7,15.8 12.2,16.9 16.6,20.5 C17.4,21.2 18.3,22.3 17.8,23.3 C14,20.5 9.2,19.3 4.6,18.2 Z"
          }
        }
      },

      "haiku:b968c32f1aeb": {
        d: {
          "0": {
            value: "M3.2,11.8 C6.8,7.1 12.3,3.9 18.2,3.1 C17.2,2.3 16.4,1.4 15.8,0.4 C9.5,2.5 5.4,5.6 3.2,11.8 Z"
          }
        }
      },

      "haiku:b2a05c253af4": {
        d: {
          "0": {
            value: "M148.9,126.6 C149.6,129 148.7,131.9 146.6,133.4 C144.5,134.9 141.5,135 139.4,133.5 C138.7,133 138.1,132.4 137.4,131.9 C135.1,130 131.7,129.3 128.9,130.4 C126.9,131.2 125.3,132.7 123.6,134 C121.9,135.3 120,136.6 117.8,136.5 C114.6,136.4 112.1,133.2 112.1,130 C112,126.8 113.9,123.9 116.4,121.8 C118.3,120.3 120.7,119.1 123.1,119.4 C125.5,119.7 127.8,121.6 127.9,124.1 C127.9,124.7 127.8,125.3 128,125.8 C128.3,126.5 129.1,127 129.8,127.1 C130.6,127.2 131.4,127 132.1,126.8 C132.7,126.6 133.3,126.4 133.6,125.9 C134.2,124.8 132.7,123.8 132.2,122.6 C131.6,121 133.1,119.3 134.8,118.7 C136.9,117.9 139.4,118.1 141.4,119 C143.5,119.9 145.3,121.4 146.8,123.1 C147.8,124.2 148.5,125.3 148.9,126.6 Z"
          }
        },

        fill: { "0": { value: "#893C30" } }
      },

      "haiku:dd84cfe15002": {
        fill: { "0": { value: "url(#radialGradient-1-65c1b4)" } },
        cx: { "0": { value: "89.4" } },
        cy: { "0": { value: "113.7" } },
        r: { "0": { value: "12.2" } }
      },

      "haiku:641ba30a96c3": {
        fill: { "0": { value: "url(#radialGradient-2-65c1b4)" } },
        cx: { "0": { value: "170.6" } },
        cy: { "0": { value: "113.7" } },
        r: { "0": { value: "12.2" } }
      },

      "haiku:755a3881c7fb": {
        d: {
          "0": {
            value: "M79.6,70 C82.4,66.8 85.7,64.2 89.4,62.2 C92.8,60.3 96.7,59 100.6,58.9 C102.1,58.8 103.6,58.9 105.1,58.5 C105.4,58.4 105.6,58.3 105.8,58.1 C106,57.9 106,57.5 106.1,57.2 C106.2,56.3 106.1,55.3 105.5,54.6 C104.7,53.6 103.3,53.4 102.1,53.4 C95.3,53.5 89.1,57.3 84.1,61.9 C82.5,63.4 81,65 80,66.9 C79.3,67.8 79,69 79.6,70 Z"
          }
        },

        fill: { "0": { value: "#B77153" } }
      },

      "haiku:a866ab2a803b": {
        d: {
          "0": {
            value: "M180.2,70 C177.4,66.8 174.1,64.2 170.4,62.2 C167,60.3 163.1,59 159.2,58.9 C157.7,58.8 156.2,58.9 154.7,58.5 C154.4,58.4 154.2,58.3 154,58.1 C153.8,57.9 153.8,57.5 153.7,57.2 C153.6,56.3 153.7,55.3 154.3,54.6 C155.1,53.6 156.5,53.4 157.7,53.4 C164.5,53.5 170.7,57.3 175.7,61.9 C177.3,63.4 178.8,65 179.8,66.9 C180.4,67.8 180.7,69 180.2,70 Z"
          }
        },

        fill: { "0": { value: "#B77153" } }
      },

      "haiku:0c72b32c0033": {
        "translation.x": { "0": { value: 119 } },
        "translation.y": { "0": { value: 112 } }
      },

      "haiku:08103d74441f": {
        d: {
          "0": {
            value: "M21.5,1.7 C19.4,3.7 16.1,4 13.2,4.1 C11.4,4.2 9.6,4.2 7.8,4.3 C6.6,4.3 5.3,4.4 4.2,4.1 C3,3.8 1.9,3 1.4,1.9 C2.9,1.1 4.7,0.8 6.4,0.7 C11.4,0.2 16.4,0.4 21.4,1.1 C21.2,1.3 21.3,1.6 21.5,1.7 Z"
          }
        },

        fill: { "0": { value: "#FFFFFF" } }
      },

      "haiku:acd5b2045206": {
        d: {
          "0": {
            value: "M6.4,4.8 C5.4,4.8 4.7,4.7 4,4.5 C2.6,4.1 1.4,3.2 1,2.1 L0.9,1.8 L1.2,1.6 C2.8,0.7 4.7,0.5 6.3,0.3 C11.3,-0.2 16.4,-1.11022302e-16 21.4,0.7 L21.8,0.8 L21.7,1.2 C21.7,1.3 21.7,1.4 21.8,1.5 L22.1,1.8 L21.8,2.1 C19.6,4.2 16.5,4.5 13.2,4.6 L7.8,4.8 C7.3,4.7 6.9,4.8 6.4,4.8 Z M1.9,2.1 C2.4,2.9 3.2,3.4 4.2,3.7 C4.8,3.9 5.5,3.9 6.4,3.9 C6.8,3.9 7.3,3.9 7.7,3.9 L13.1,3.7 C16.1,3.6 19,3.3 20.9,1.6 C20.9,1.5 20.8,1.4 20.8,1.4 C16,0.7 11.1,0.6 6.3,1.1 C4.9,1.2 3.3,1.4 1.9,2.1 Z"
          }
        },

        fill: { "0": { value: "#857C89" } }
      },

      "haiku:37fe2ae5bed9": {
        d: {
          "0": {
            value: "M122.4,146.8 C125.2,147.4 128.1,147.8 130.8,146.9 C133.5,146 135.7,143.2 135.1,140.5 C132.3,139.9 129.3,139.3 126.6,140.2 C123.8,141.1 121.5,144 122.4,146.8 Z"
          }
        },

        fill: { "0": { value: "#E8A3A3" } }
      },

      "haiku:471fb21f6a07": {
        d: {
          "0": {
            value: "M135.3,141.3 C136.3,142 137,143.1 137.4,144.3 C136.8,143.3 135.6,142.9 134.5,142.6 C132.9,142.1 131.4,141.7 129.8,141.7 C128.1,141.7 126.5,142.3 124.9,142.8 C124.5,142.9 124.1,143.1 123.7,143.3 C123.5,143.2 123.6,143 123.8,142.8 C124.8,141.7 126.1,140.7 127.5,140 C129.2,139.1 131.2,138.7 132.9,139.5 C133.3,139.7 133.7,140 134.1,140.3 C134.4,140.8 134.9,141 135.3,141.3 Z"
          }
        },

        fill: { "0": { value: "#B77153" } }
      },

      "haiku:7bbb6893d311": {
        d: {
          "0": {
            value: "M208.4,38.9 C212,41.5 214.5,45.7 215.1,50.1 C216.5,43.1 213.1,35.9 208.4,30.4 C196.3,16.2 177.2,10.5 159.2,5.5 C155,4.3 150.8,3.2 146.5,2.8 C143.5,2.6 140.4,2.7 137.5,2.1 C134.6,1.5 131.8,0.2 128.9,0.1 C124.6,2.60902411e-14 120.7,2.5 116.6,3.7 C114.5,4.3 112.3,4.6 110.2,4.9 C86.1,9 64.5,26.1 55.2,48.8 C65,37.5 77.3,28.4 91,22.3 C81.7,28.7 72.3,35.2 65.1,43.9 C86.5,31.5 108.7,18.8 133.3,15.6 C122.9,22.3 112.6,29 102.2,35.7 C115.3,30.1 127.8,22.7 139,13.9 C140.5,12.7 142.7,11.4 144.3,12.5 C143.9,21.6 143.5,30.7 143.1,39.9 C148.9,32.6 152.4,23.4 152.9,14 C153.5,15.6 153.7,17.4 153.4,19.1 C154.2,18.2 154.9,17.2 155.3,16 C164.6,22.3 173.7,28.9 182.7,35.7 C179.7,29.3 176.3,23 172.7,17 C180.5,25.5 188.3,34 194.3,43.8 C200.3,53.6 204.5,64.8 204.2,76.3 C210.7,65 212.3,51.1 208.4,38.9 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:016c080c575e": {
        "translation.x": { "0": { value: 198 } },
        "translation.y": { "0": { value: 86 } }
      },

      "haiku:5ca4f5dca41d": {
        d: {
          "0": {
            value: "M11.8,0.4 C9.3,1.7 7.1,3.4 5.6,5.7 C4.1,8 3.5,11 4.3,13.6 C4.9,15.4 6,17.1 5.6,18.9 C5.1,21.1 2.6,22 0.4,22.6"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:e146687566f1": {
        d: {
          "0": {
            value: "M3.2,20.7 C2.9,20.9 0.2,22 0.3,22.4 C2.77555756e-16,23.7 2.5,22.8 3,22.6 C4.3,22.1 5.6,21.2 6.1,19.9 C6.9,18.3 6.3,16.6 5.7,15.1 C5.1,13.7 4.6,12.4 4.6,10.8 C4.6,9.1 5.2,7.4 6.1,5.9 C6.9,4.6 8,3.5 9.1,2.5 C9.4,2.3 11.8,0.6 11.7,0.4 C11.4,-0.2 7.7,2.4 7.4,2.7 C5.6,4.2 4.2,6.2 3.5,8.4 C2.8,10.8 3.1,13.1 4,15.4 C4.9,17.4 5.3,19.4 3.2,20.7 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:92a55e2bd459": {
        "translation.x": { "0": { value: 52 } },
        "translation.y": { "0": { value: 86 } }
      },

      "haiku:325066522105": {
        d: {
          "0": {
            value: "M0.8,0.7 C3.4,2.5 5.7,4.7 7.5,7.3 C8,8 8.4,8.7 8.5,9.5 C8.6,10.9 7.6,12.1 7,13.4 C6.2,15.1 6.3,17.2 7.2,18.9 C8.1,20.6 9.8,21.8 11.6,22.2"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:46eefcb8fa66": {
        d: {
          "0": {
            value: "M8.1,21.4 C8.7,22 10.6,23.2 11.5,22.6 C11.6,22.5 11.7,22 11.6,21.9 C11.4,21.5 10.7,21.3 10.4,21.1 C7.7,19.4 6.5,16.3 8,13.3 C8.7,12 9.6,10.6 9.2,9 C8.9,7.6 7.7,6.4 6.8,5.3 C6.5,4.9 1.3,-5.67323966e-14 0.8,0.7 C0.7,0.9 3.8,3.7 4.1,4 C4.9,4.9 5.7,5.8 6.4,6.8 C7,7.6 7.9,8.7 7.8,9.7 C7.8,10.8 7,11.7 6.5,12.6 C6,13.6 5.7,14.6 5.6,15.8 C5.6,18 6.5,20.1 8.1,21.4 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:81414bcb2b05": {
        "translation.x": { "0": { value: 118 } },
        "translation.y": { "0": { value: 80 } }
      },

      "haiku:00d9976dc581": {
        d: {
          "0": {
            value: "M6.8,13.9 C7.5,13.5 8.2,13.1 9,13 C10.5,12.8 12,13.8 13.5,13.8 C14.5,13.8 15.5,13.4 16.5,13.4 C18.6,13.3 20.5,14.7 21.6,16.5 C22.7,18.3 23.1,20.4 23.5,22.4 C23.6,23.1 23.7,23.8 23.3,24.3 C23,24.6 22.6,24.8 22.2,24.9 C19.8,25.3 17.5,23.6 15.1,23.9 C14.4,24 13.7,24.3 13,24.5 C10.6,25.3 8.1,25.6 5.6,25.4 C5,25.4 4.4,25.3 3.9,25 C2.8,24.4 2.5,22.9 2.6,21.7 C2.7,18.5 4.3,15.6 6.8,13.9 Z"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:6d608150488a": {
        d: {
          "0": {
            value: "M8.9,18.9 C10.1,16.9 9.6,14.9 8.2,15.5 C8.1,15.6 7.9,15.6 7.8,15.7 C6.9,16.2 6,17.4 5.6,18.7 C5.2,20 5.6,21 6.4,21 C7.2,21 8.2,20.1 8.9,18.9 C8.9,18.9 8.9,18.9 8.9,18.9 Z"
          }
        },

        fill: { "0": { value: "#F6CDC2" } }
      },

      "haiku:affa976122b0": {
        d: {
          "0": {
            value: "M6.7,23.5 C6.3,23.5 5.9,23.4 5.7,23.1 C5.3,22.6 5.7,22 6.1,21.5 C6.6,20.8 7.2,20.1 7.9,19.7 C8.7,19.3 9.7,19.3 10.3,19.9 C11,20.7 10.6,22 9.8,22.7 C8.9,23.4 7.8,23.5 6.7,23.5 Z"
          }
        },

        fill: { "0": { value: "#893C30" } }
      },

      "haiku:fd0d629fab06": {
        d: {
          "0": {
            value: "M19.7,23.5 C20.1,23.5 20.5,23.4 20.7,23.1 C21.1,22.6 20.7,22 20.3,21.5 C19.8,20.8 19.2,20.1 18.5,19.7 C17.7,19.3 16.7,19.3 16.1,19.9 C15.4,20.7 15.8,22 16.6,22.7 C17.5,23.4 18.6,23.5 19.7,23.5 Z"
          }
        },

        fill: { "0": { value: "#893C30" } }
      },

      "haiku:23dd53978120": {
        d: {
          "0": {
            value: "M7.8,4.9 C7.3,3.6 6.4,1.8 5.1,1 C4.9,0.9 4.4,1.1 4.4,1.3 C4.3,1.8 5,2.7 5.2,3.1 C6.2,5.1 7,7.1 7.4,9.3 C7.5,9.9 7.5,10.4 7.6,11 C7.6,11.6 7.8,11.4 7.2,11.5 C6.1,11.7 5,12.2 4.1,12.9 C0.9,15.5 -0.8,22 2.9,24.9 C4.5,26.2 6.7,26.5 8.7,26.2 C9.1,26.1 13.8,25 13.7,24.5 C13.7,24.4 8.7,25.4 8.2,25.4 C6.1,25.4 3.6,24.7 2.6,22.6 C1.7,20.5 2.4,17.9 3.5,16.1 C4,15.2 4.7,14.3 5.7,13.8 C6.9,13.1 7.9,13.1 9.2,13.2 C9.2,10.3 8.9,7.6 7.8,4.9 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:8b9fa71b9bc5": {
        d: {
          "0": {
            value: "M18.3,256.3 C19.8,257.3 21.4,258.1 23.2,258.3 C25,258.5 26.9,257.9 27.9,256.4 C29.3,254.4 28.6,251.5 27.4,249.4 C24.8,244.7 20.2,241.2 15,240 C14.1,239.8 13.1,239.6 12.2,240.1 C11.3,240.6 10.9,241.6 10.7,242.6 C10.2,245.3 10.9,248.2 12.3,250.5 C13.9,252.9 16,254.8 18.3,256.3 Z"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:1571f5c60cd5": {
        viewBox: { "0": { value: "0 0 275 336" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 275 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 336 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function($user) {
                return $user.mouse.x - 144;
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
                return $user.mouse.y - 288;
              },
              "$user"
            ),

            edited: true
          }
        },

        "style.zIndex": { "0": { value: 34 } },
        "scale.x": { "0": { value: 0.3, edited: true } },
        "scale.y": { "0": { value: 0.3, edited: true } },
        opacity: {
          "0": {
            value: Haiku.inject(
              function(currentBaby) {
                return currentBaby === "baby4" ? 1 : 0;
              },
              "currentBaby"
            ),

            edited: true
          }
        }
      },

      "haiku:49b016751668": {
        cx: { "0": { value: "50.1889344%" } },
        cy: { "0": { value: "49.8782787%" } },
        fx: { "0": { value: "50.1889344%" } },
        fy: { "0": { value: "49.8782787%" } },
        r: { "0": { value: "49.8122951%" } }
      },

      "haiku:775575a5dfbb": {
        "stop-color": { "0": { value: "#D78280" } },
        offset: { "0": { value: "0%" } }
      },

      "haiku:ad1259e1ac55": {
        "stop-color": { "0": { value: "#E9B092" } },
        offset: { "0": { value: "100%" } }
      },

      "haiku:c4fd6d3e659b": {
        cx: { "0": { value: "50.1905738%" } },
        cy: { "0": { value: "49.8782787%" } },
        fx: { "0": { value: "50.1905738%" } },
        fy: { "0": { value: "49.8782787%" } },
        r: { "0": { value: "49.8122951%" } }
      },

      "haiku:6eb667806455": {
        "stop-color": { "0": { value: "#D78280" } },
        offset: { "0": { value: "0%" } }
      },

      "haiku:4e56a9e4b1a5": {
        "stop-color": { "0": { value: "#E9B092" } },
        offset: { "0": { value: "100%" } }
      },

      "haiku:3c3cc2d6c8cc": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:d924e289fb9e": { "fill-rule": { "0": { value: "nonzero" } } },
      "haiku:bc4ca3487bac": {
        d: {
          "0": {
            value: "M136.1,67 C131.7,62.6 130.4,55.9 130.4,49.7 C130.3,41.2 132,32.6 135.4,24.8 C135,29 134.6,33.3 134.1,37.5 C133.8,40.2 133.8,43.3 135.8,44.9 C135.3,36.8 135.8,28.5 138.3,20.7 C140.7,12.9 145.1,5.6 151.5,0.5 C151.7,4.3 149.9,7.9 148.3,11.4 C143.2,23.1 141.4,36.3 143.2,48.9 C144.4,42.1 146.6,35.5 150.5,29.8 C154.4,24.2 160.2,19.7 166.9,18.2 C175.9,16.1 185.8,19.9 192,26.8 C198.2,33.7 200.9,43.4 200.2,52.6 C198.6,50.3 197,47.9 195.5,45.6 C201.1,63 200.4,82.4 193.5,99.4 C195.4,93.8 195.7,87.7 194.4,82 C193,87.5 191.3,93.5 186.5,96.5 C186.4,93.4 186.4,90.3 186.3,87.2 C180.5,91.1 173,92.2 166.3,90.2 C164.6,89.7 162.8,88.9 161.8,87.4 C159.7,84.2 162,79.6 160.3,76.2 C159.3,74.1 157,72.9 154.7,72.5 C152.4,72.1 150.1,72.2 147.8,72.1 C143.6,71.6 139.2,70.1 136.1,67 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:e8d08299bba1": {
        "translation.x": { "0": { value: 128 } },
        "translation.y": { "0": { value: 58 } }
      },

      "haiku:487467f95a4f": {
        d: {
          "0": {
            value: "M0.7,7.4 C-3.33066907e-16,5.1 1.7,2.5 3.9,1.4 C6.1,0.3 8.7,0.3 11.1,0.4 C15.1,0.5 19.1,0.7 23,1.6 C26.7,2.4 30.2,3.9 33.6,5.3 C40,8.1 46.5,11.1 51.7,15.7 C56.9,20.4 60.8,26.9 60.7,33.9 C51.9,31.7 43.3,28.3 35.2,24 C28.6,20.5 22.3,16.3 15,14.7 C12.2,14.1 9.3,13.9 6.7,12.9 C4,12.1 1.5,10.2 0.7,7.4 Z"
          }
        },

        fill: { "0": { value: "#F15C55" } }
      },

      "haiku:61b64daafc6e": {
        d: {
          "0": {
            value: "M61.2,34.5 L60.7,34.4 C51.8,32.2 43.2,28.8 35.1,24.5 C33.7,23.8 32.4,23 31,22.3 C25.9,19.4 20.7,16.5 14.9,15.3 C13.9,15.1 13,14.9 12,14.8 C10.2,14.5 8.3,14.2 6.5,13.6 C3.3,12.5 1,10.3 0.3,7.7 C-0.5,5.1 1.4,2.4 3.7,1.3 C5.6,0.4 7.7,0.2 9.6,0.2 C10.1,0.2 10.6,0.2 11.1,0.2 C15,0.3 19.2,0.5 23.1,1.4 C26.8,2.2 30.3,3.7 33.8,5.2 C40.1,7.9 46.7,10.9 52,15.7 C57.9,21 61.2,27.7 61.2,34.2 L61.2,34.5 Z M9.6,0.8 C7.9,0.8 5.9,0.9 4.1,1.8 C2.1,2.8 0.5,5.1 1.1,7.3 C1.7,9.6 3.9,11.6 6.8,12.7 C8.5,13.3 10.4,13.6 12.2,13.9 C13.2,14.1 14.2,14.2 15.1,14.4 C20.9,15.7 26.3,18.6 31.4,21.5 C32.7,22.3 34.1,23 35.4,23.7 C43.3,27.9 51.6,31.2 60.3,33.4 C60.2,27.3 57,21 51.4,16 C46.2,11.3 39.7,8.3 33.4,5.6 C29.9,4.1 26.5,2.7 22.9,1.9 C19,1 14.9,0.8 11,0.7 C10.6,0.8 10.1,0.8 9.6,0.8 Z"
          }
        },

        fill: { "0": { value: "#893C30" } }
      },

      "haiku:a32e6263086e": {
        "translation.x": { "0": { value: 61 } },
        "translation.y": { "0": { value: 264 } }
      },

      "haiku:d4de5b86e8e6": {
        d: {
          "0": {
            value: "M70.1,63.6 C53.5,59.6 35.7,59.4 23.3,46.1 C15.1,37.4 5.3,28.2 2.5,16.1 C1.9,13.5 0.7,9.3 2.1,6.8 C4,3.4 9.2,2.1 12.8,1.6 C24.4,0.1 37.3,5.3 46.6,12 C53,16.6 60.4,20.7 64.5,27.7 C67.7,33.2 70.8,39.5 71.7,45.9 C72.2,49.6 75.8,64.9 70.1,63.6 Z"
          }
        },

        fill: { "0": { value: "#84BF41" } }
      },

      "haiku:ac6bf18811b7": {
        d: {
          "0": {
            value: "M45.1,59.1 C50.9,60.6 56.8,61.6 62.8,62.6 C65.1,63 67.4,63.6 69.7,63.8 C70,63.8 70.4,63.3 70.1,63.2 C69.1,62.7 67.8,62.5 66.7,62.2 C54.4,59.1 41.3,58.1 30.5,51 C27.8,49.2 25.3,47 23.1,44.6 C20.7,42 18.2,39.5 15.8,36.8 C11.4,31.9 7.2,26.6 4.8,20.4 C3.6,17.4 2.6,13.9 2.3,10.7 C2.2,9.2 2.3,7.7 3.2,6.5 C4.2,5.2 5.7,4.3 7.1,3.7 C13.4,1.1 20.9,1.6 27.3,3.3 C33.8,5 39.9,8 45.5,11.8 C50.9,15.6 56.9,19.1 61.3,24.1 C63.4,26.5 65,29.4 66.5,32.3 C68.1,35.3 69.4,38.4 70.4,41.7 C71.3,44.9 71.8,48.3 72.3,51.5 C72.8,54.3 73.3,57.3 73,60.2 C72.9,61.1 72.8,62.1 72.2,62.8 C71.9,63.2 71.5,63.4 71.1,63.5 C71,63.5 70.2,63.5 70.2,63.5 C70.2,63.7 71.3,63.6 71.4,63.6 C72.1,63.5 72.5,63 72.8,62.4 C73.4,61.3 73.5,60 73.5,58.8 C73.6,55.7 73.1,52.5 72.6,49.4 C72.1,46.1 71.7,42.8 70.6,39.6 C69.5,36.2 68,33 66.3,29.9 C64.7,27 63.1,24.3 60.8,22 C58.5,19.6 55.8,17.6 53.1,15.7 C47.5,11.8 42,7.7 35.8,4.9 C29.6,2.1 22.9,0.3 16.1,0.5 C10.7,0.6 1.1,2.1 0.7,9.1 C0.5,12.3 1.5,15.7 2.4,18.7 C3.4,21.9 4.9,25 6.7,27.9 C10.3,33.7 15.1,38.7 19.8,43.6 C21.8,45.7 23.7,47.9 26,49.7 C31.7,54.3 38.1,57.2 45.1,59.1 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:635cdaa7b731": {
        "translation.x": { "0": { value: 33 } },
        "translation.y": { "0": { value: 264 } }
      },

      "haiku:362844d47738": {
        d: {
          "0": {
            value: "M43.8,0.7 C35.4,1.3 29.2,1.8 24.1,8.7 C20.6,13.5 17.6,19.1 15.1,24.5 C12.7,29.8 11,35.5 8.9,41 C7.1,45.7 4.4,49.6 2.2,53.9 C-1.6,61.2 16.3,63.1 20.6,62.9 C26.4,62.7 32.5,59.4 37.5,56.6 C43.4,53.3 47.5,48.9 51.3,43.4 C56.5,36 57,28.4 57.1,19.4 C57,11.6 52.7,0.1 43.8,0.7 Z"
          }
        },

        fill: { "0": { value: "#84BF41" } }
      },

      "haiku:e4f14d7b5921": {
        d: {
          "0": {
            value: "M24.7,9.3 C26.6,6.8 28.9,4.7 31.7,3.5 C34.6,2.3 37.7,1.9 40.8,1.5 C41.7,1.4 42.6,1.3 43.4,1.1 C43.8,1 43.9,0.4 43.4,0.3 C40.7,0.1 37.8,0.4 35.2,0.9 C31.9,1.5 28.8,2.7 26.3,5 C23.9,7.1 22.2,9.8 20.5,12.4 C16.9,18.2 13.9,24.4 11.5,30.9 C10.3,34.1 9.3,37.4 8,40.5 C6.7,43.7 5,46.8 3.3,49.8 C1.9,52.3 -0.6,55.5 1.4,58.3 C3.2,60.8 6.9,61.8 9.8,62.5 C13.2,63.3 16.7,63.8 20.2,63.7 C23.5,63.6 26.8,62.6 29.8,61.2 C35.7,58.6 41.5,55.3 46,50.6 C49.7,46.8 53,42.2 54.9,37.2 C56.8,32.2 57.1,26.8 57.2,21.5 C57.4,16.7 56.5,11.7 54.2,7.4 C53,5.2 51.5,3.4 49.5,1.9 C48.6,1.4 47.8,1 46.8,0.7 C46.5,0.6 43.5,0.2 43.5,0.5 C43.5,0.4 46.8,1 47.1,1.2 C48.4,1.7 49.5,2.4 50.5,3.4 C52.5,5.4 53.9,8 54.8,10.6 C56.9,16.8 56.5,23.8 55.5,30.2 C54.5,36.4 51.7,41.7 47.8,46.5 C46,48.8 43.9,50.8 41.7,52.7 C39.3,54.7 36.6,56.1 33.8,57.6 C30.9,59.1 27.8,60.6 24.6,61.4 C21.2,62.3 17.7,62.1 14.2,61.6 C10.9,61.1 7.5,60.5 4.6,58.8 C3.5,58.2 2.1,57.1 2.1,55.7 C2.1,54.2 3.3,52.8 3.9,51.5 C5.6,48.5 7.3,45.6 8.7,42.4 C10.1,39.2 11.2,35.9 12.3,32.6 C14.6,26.1 17.5,19.8 21.1,13.8 C22.5,12.5 23.6,10.9 24.7,9.3 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:b5bc4aaa2faf": { "translation.y": { "0": { value: 293 } } },
      "haiku:b90bafc3f9a8": {
        "translation.x": { "0": { value: 11 } },
        "translation.y": { "0": { value: 29 } }
      },

      "haiku:e2b3a242cc4c": {
        d: {
          "0": {
            value: "M1.5,2.3 C0.7,3.4 0.7,5.1 1.6,6.1 C3,7.6 5.4,7.4 7.4,7 C8,6.9 8.6,6.8 9,6.4 C10,5.7 10.1,4.1 9.5,3.1 C8.8,2 7.6,1.5 6.4,1.3 C5.2,1.2 3.9,1.4 2.7,1.6 C2.4,1.7 2.1,1.7 1.9,1.9 C1.8,2 1.6,2.2 1.5,2.3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:b57641475812": {
        d: {
          "0": {
            value: "M1.9,4.9 C1.6,4.2 2.1,2.8 1.5,2.3 C0.5,1.5 0.1,4 0.1,4.6 C0.5,8.2 4.7,8.3 7.4,7.8 C8.9,7.5 10.3,6.9 10.6,5.3 C10.9,3.8 10.2,2.4 8.9,1.6 C7.7,0.8 6.2,0.7 4.9,0.9 C4.2,1 3.6,1.1 2.9,1.3 C2.8,1.3 1,2 1.5,2.3 C1.5,2.3 3.2,1.9 3.3,1.9 C4.1,1.8 4.8,1.8 5.6,1.8 C7,1.9 9,2.5 9.2,4.2 C9.4,6.1 7.5,6.2 6.1,6.4 C4.7,6.6 2.5,6.6 1.9,4.9 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:ab591957a7cc": { "translation.x": { "0": { value: 3 } } },
      "haiku:d78af1e099be": {
        d: {
          "0": {
            value: "M1.1,6.1 C1.1,8.7 3.1,10.8 5.4,12 C10.3,14.6 17,13.8 20.7,9.6 C15.4,8.1 10.4,5.3 6.3,1.7 C5.6,1.1 4.9,0.5 4,0.6 C3.1,0.7 2.6,1.6 2.2,2.4 C1.6,3.6 1.1,4.8 1.1,6.1 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:b054f77ac84a": {
        d: {
          "0": {
            value: "M4.4,10.4 C3.3,9.6 2.3,8.5 1.8,7.2 C1.7,6.9 1.6,6.1 1.2,6.1 C0.8,6.1 0.6,6 0.5,6.5 C-5.68434189e-14,9.7 3.4,12.2 5.9,13.3 C9,14.6 12.6,14.7 15.8,13.6 C18.3,12.7 20.1,11.2 21.9,9.3 C17.6,7.9 13.5,6.3 9.7,3.8 C8.6,3.1 7.6,2.3 6.6,1.5 C5.7,0.7 4.5,-0.3 3.2,0.3 C2.1,0.8 1.6,2.2 1.2,3.3 C1.1,3.5 0.5,6 0.9,6 C1,6 1.2,4.9 1.3,4.8 C1.6,3.8 2.1,2.8 2.7,2 C4.2,-0.3 6.4,2.7 7.7,3.8 C9.5,5.3 11.5,6.5 13.6,7.6 C14.1,7.9 18.8,10.2 19,10 C18.5,10.6 17.5,11.1 16.8,11.4 C15.4,12 14,12.5 12.5,12.6 C9.7,12.9 6.7,12.2 4.4,10.4 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:4c247413bddb": {
        "translation.x": { "0": { value: 5 } },
        "translation.y": { "0": { value: 25 } }
      },

      "haiku:038c83348cff": {
        d: {
          "0": {
            value: "M0.9,5.1 C2,6.6 3.7,7.6 5.6,7.7 C7.4,7.8 9.3,7 10.5,5.5 C10.7,5.2 10.9,5 10.9,4.6 C10.9,4.3 10.8,4.1 10.7,3.9 C10,2.4 8.2,1.8 6.5,1.6 C5.4,1.5 4.3,1.6 3.3,2 C2.1,2.7 1.2,3.8 0.9,5.1 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:881c06f9a3ce": {
        d: {
          "0": {
            value: "M3.5,6.3 C2.7,5.9 2.1,5.2 1.3,4.9 C0.6,4.7 0.6,5.5 0.8,5.9 C1.9,7.9 4.6,8.7 6.7,8.4 C8.5,8.2 12,6.6 11.7,4.3 C11.4,1.7 7.9,0.9 5.8,0.9 C3.7,1 1.2,2.3 0.9,4.6 C0.8,5.5 1.4,4.4 1.5,4.2 C2.2,3.2 3.1,2.5 4.3,2.2 C5.5,1.9 6.8,2.1 7.9,2.5 C8.5,2.7 10.5,3.7 10.1,4.7 C8.9,7 5.5,7.3 3.5,6.3 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:454652155e4a": {
        "translation.x": { "0": { value: 2 } },
        "translation.y": { "0": { value: 18 } }
      },

      "haiku:2b12356cde56": {
        d: {
          "0": {
            value: "M1.4,4.3 C1.2,4.8 1,5.2 0.9,5.7 C0.7,7.2 1.4,8.8 2.7,9.8 C3.9,10.7 5.6,11 7.1,10.8 C9,10.5 10.8,9.5 12,7.9 C12.7,6.3 12.1,4.4 10.8,3.2 C9.5,2 7.8,1.5 6,1.5 C4.9,1.5 3.8,1.7 2.9,2.3 C2.3,2.8 1.8,3.5 1.4,4.3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:4d3f5b25b9da": {
        d: {
          "0": {
            value: "M2.1,7.7 C1.7,6.9 1.6,6 1.7,5.2 C1.7,4.8 1.8,4.1 1.1,4.2 C0.7,4 0.2,5.5 0.1,5.7 C-0.1,6.6 -5.55111512e-17,7.6 0.4,8.4 C2.1,12 6.8,12.4 10,10.6 C11.5,9.7 12.8,8.5 12.9,6.6 C12.9,4.7 11.7,2.9 10.1,1.9 C8.4,0.9 6.2,0.6 4.4,1.1 C3.6,1.3 2.8,1.7 2.2,2.4 C2.1,2.5 1,4 1.4,4.2 C1.4,4.2 3,2.6 3.2,2.5 C4.2,1.9 5.5,1.9 6.6,2 C8.8,2.3 11.2,3.6 11.5,6 C11.8,8.1 9.4,9.4 7.6,9.8 C5.5,10.3 3,9.7 2.1,7.7 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:9bf07529b437": { "translation.y": { "0": { value: 11 } } },
      "haiku:046e88dfb82f": {
        d: {
          "0": {
            value: "M1,3.9 C1.5,5.1 2.1,6.2 2.9,7.3 C3.3,7.9 3.7,8.4 4.3,8.9 C6,10.4 8.7,10.8 10.8,9.9 C12.9,9 14.3,6.7 14.3,4.4 C10.6,3.5 7,2.5 3.3,1.6 C2.5,1.4 1.6,1.3 1,1.9 C0.5,2.4 0.7,3.2 1,3.9 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:b4c385e962cb": {
        d: {
          "0": {
            value: "M3.8,7.1 C3.5,6.7 1.8,3.6 1.2,3.8 C0.7,4 0.6,4.1 0.8,4.7 C1,5.6 1.5,6.5 2,7.4 C3.2,9.3 4.9,10.7 7.1,11.1 C9.5,11.5 12,10.6 13.5,8.7 C14.3,7.6 15.4,5.5 15,4.1 C15,3.6 14.3,3.6 13.9,3.5 C12.8,3.2 11.6,3 10.4,2.7 C8.2,2.2 5.9,1.7 3.7,1.2 C2.8,1 1.5,0.7 0.8,1.6 C0.5,1.9 0.5,4.2 1,3.9 C1.4,3.7 0.4,1.9 1.8,1.8 C3,1.7 4.4,2.4 5.6,2.7 C7,3.1 8.3,3.5 9.7,3.9 C10.9,4.2 12.3,4.4 13.4,4.9 C13.6,5.1 13.2,6.1 13.1,6.3 C12.6,7.4 11.8,8.4 10.7,8.9 C8.3,10.2 5.4,9.2 3.8,7.1 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:b8afb9a5776e": {
        "translation.x": { "0": { value: 6 } },
        "translation.y": { "0": { value: 5 } }
      },

      "haiku:c98499511d2d": {
        d: {
          "0": {
            value: "M53.2,6.5 C46.7,5.1 43.7,5 37.7,6.2 C35.4,6.6 33.3,7.2 30.9,7 C24.8,6.6 18.7,3.3 12.8,1.9 C8.2,0.8 4.3,0.4 2.1,5.4 C-0.1,10.5 0.7,17.6 3.5,22.5 C5.7,26.3 9.3,30.1 13.7,30.8 C20.3,31.9 26.2,28.4 32.8,29.7 C39.2,31 48.1,31.2 53.9,27.4 C61.6,22.6 57.7,12 53.2,6.5 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:3f5edca92693": {
        d: {
          "0": {
            value: "M35.5,7.5 C38.6,6.9 41.7,6.2 44.9,6.1 C47.6,6.1 50.1,6.6 52.8,6.8 C53,6.8 53.8,6.5 53.3,6.2 C52.7,5.8 51.8,5.7 51.1,5.5 C48,4.7 44.8,4.4 41.6,4.8 C38.4,5.1 35.2,6.3 31.9,6.2 C28.4,6.2 25,5.1 21.7,3.9 C18.5,2.8 15.4,1.6 12.1,0.9 C9,0.3 5.5,-0.1 3.1,2.5 C0.8,4.9 0.1,8.7 0.1,12 C0.1,15.4 0.8,18.9 2.3,22 C3.7,24.8 5.7,27.3 8.1,29.2 C10.8,31.3 14,32.1 17.4,31.9 C20.8,31.7 24.2,30.8 27.6,30.4 C31,30 34.2,30.9 37.5,31.2 C43.7,31.7 50.4,31.1 55.5,27.1 C58.7,24.6 59,19.8 58.2,16.1 C57.8,14.1 56.9,12.2 56,10.5 C55.8,10.1 53.4,6.5 53.2,6.7 C53.3,6.6 56,11.6 56.2,12.1 C57.4,15 58.2,18.2 57.7,21.3 C57.1,27.8 48.9,29.8 43.7,30.1 C40.3,30.3 36.9,30 33.6,29.4 C30,28.8 26.7,29.1 23.1,29.7 C20,30.2 16.8,30.8 13.7,30.2 C10.6,29.6 8,27.5 6.1,25.1 C3.2,21.4 1.6,16.9 1.6,12.2 C1.6,8.2 2.8,2.4 7.7,2.1 C10,2 12.4,2.7 14.5,3.3 C16.9,4 19.3,4.9 21.7,5.8 C26.3,7.3 30.7,8.4 35.5,7.5 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:e5ce79ab1785": {
        "translation.x": { "0": { value: 3 } },
        "translation.y": { "0": { value: 17 } }
      },

      "haiku:018617404758": {
        d: { "0": { value: "M1.6,1 C1.6,0.9 1.6,0.8 1.6,0.7" } },
        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:e06f6f82909b": {
        d: {
          "0": { value: "M0.8,1 C0.8,1 2.5,1 2.5,1 C2.5,0.6 0.8,0.6 0.8,1 Z" }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:bfbec10a9e85": {
        d: {
          "0": {
            value: "M12.9,322.1 C10.5,319.3 9.5,315.3 10.4,311.7 C10.7,310.6 11.1,309.4 12,308.6 C13.8,306.8 16.7,307 19.3,307.3 C27.4,308.5 36,311.1 41.1,317.5 C42,318.6 42.7,319.9 42.3,321.2 C41.9,322.4 40.5,323 39.2,323.5 C34.8,325.1 30.3,326.6 25.7,326.8 C21,327 16,325.6 12.9,322.1 Z"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:8a6845457ab5": {
        d: {
          "0": {
            value: "M54.1,312.4 C50.7,311.5 47,311.5 43.6,312.2 C43.9,315.9 45.7,319.6 48.5,322.1 C51.3,324.6 55.1,325.9 58.9,325.8 C60.2,325.7 61.5,325.5 62.4,324.6 C63.2,323.8 63.5,322.5 63.4,321.4 C63.3,319.1 62,316.9 60.3,315.4 C58.6,313.9 56.4,312.9 54.1,312.4 Z"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:edc6df54443f": {
        "translation.x": { "0": { value: 140 } },
        "translation.y": { "0": { value: 264 } }
      },

      "haiku:83fec756ceaa": {
        d: {
          "0": {
            value: "M4.1,63.6 C20.7,59.6 38.5,59.4 50.9,46.1 C59.1,37.4 68.9,28.2 71.7,16.1 C72.3,13.5 73.5,9.3 72.1,6.8 C70.2,3.4 65,2.1 61.4,1.6 C49.8,0.1 36.9,5.3 27.6,12 C21.2,16.6 13.8,20.7 9.7,27.7 C6.5,33.2 3.4,39.5 2.5,45.9 C2,49.6 -1.6,64.9 4.1,63.6 Z"
          }
        },

        fill: { "0": { value: "#84BF41" } }
      },

      "haiku:a3a4d83cd936": {
        d: {
          "0": {
            value: "M28.5,57.5 C22.6,59 16.6,60.1 10.6,61.4 C10,61.5 3.8,62.8 3.9,63.3 C4,63.9 4.1,63.8 4.7,63.7 C5.7,63.6 6.8,63.4 7.8,63.2 C20.2,61 33.4,59.5 44.2,52.5 C47.1,50.6 49.6,48.4 51.9,45.9 C56.1,41.5 60.4,37.1 64.1,32.3 C68.3,26.8 71.2,21 72.7,14.3 C73.4,11.3 74,7.8 71.9,5.2 C69.9,2.8 66.6,1.7 63.6,1.1 C50.1,-1.7 36.6,4.6 25.9,12.3 C20.5,16.1 14.6,19.7 10.6,25.2 C8.6,27.9 7,31.1 5.6,34.2 C4.2,37.3 3,40.5 2.4,43.8 C1.6,48 0.9,52.3 0.7,56.6 C0.6,58.2 0.6,59.8 1,61.4 C1.2,62.2 1.5,63.1 2.3,63.5 C2.4,63.6 4.2,64 4.1,63.6 C4.1,63.6 3.1,63.6 2.9,63.5 C2.3,63.3 1.9,62.9 1.7,62.3 C1.2,61.2 1.1,60 1.1,58.8 C1.1,55.7 1.6,52.6 2.2,49.5 C2.8,46.2 3.2,43 4.3,39.8 C5.4,36.5 6.9,33.4 8.6,30.3 C10.2,27.5 11.8,25 14,22.7 C16.3,20.4 18.9,18.4 21.6,16.6 C27.2,12.7 32.7,8.7 39,6 C45.3,3.3 52.1,1.6 59,2 C62.3,2.2 65.8,2.8 68.6,4.5 C69.8,5.2 71,6.3 71.5,7.7 C72,9.3 71.7,11.1 71.4,12.7 C70.1,19.3 67.4,25.2 63.4,30.6 C59.3,36.1 54.5,41.2 49.6,46 C43.8,51.9 36.5,55.3 28.5,57.5 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:6792f00a10a0": {
        "translation.x": { "0": { value: 184 } },
        "translation.y": { "0": { value: 264 } }
      },

      "haiku:bf58ec70ee7e": {
        d: {
          "0": {
            value: "M14.4,0.7 C22.8,1.3 29,1.8 34.1,8.7 C37.6,13.5 40.6,19.1 43.1,24.5 C45.5,29.8 47.2,35.5 49.3,41 C51.1,45.7 53.8,49.6 56,53.9 C59.8,61.2 41.9,63.1 37.6,62.9 C31.8,62.7 25.7,59.4 20.7,56.6 C14.8,53.3 10.7,48.9 6.9,43.4 C1.7,36 1.2,28.4 1.1,19.4 C1.2,11.6 5.5,0.1 14.4,0.7 Z"
          }
        },

        fill: { "0": { value: "#84BF41" } }
      },

      "haiku:82c989fff47b": {
        d: {
          "0": {
            value: "M34.8,8.3 C32.9,5.8 30.7,3.7 27.8,2.4 C24.9,1.1 21.7,0.6 18.5,0.4 C17.3,0.3 16,0.2 14.8,0.3 C14.3,0.3 14,0.9 14.5,1 C16.8,1.6 19.2,1.6 21.6,2.1 C24.8,2.7 27.9,3.8 30.4,6 C32.8,8.1 34.5,10.8 36.2,13.4 C39.9,19.3 42.8,25.6 45.2,32.1 C46.4,35.4 47.5,38.7 48.8,41.9 C50.1,45.1 51.8,48 53.5,51 C54.2,52.3 54.9,53.5 55.5,54.8 C55.9,56.5 55.3,57.6 53.9,58.5 C51.2,60.4 47.6,61 44.4,61.6 C41,62.1 37.4,62.5 34,61.7 C30.7,60.9 27.7,59.6 24.7,58 C21.9,56.6 19.2,55.1 16.7,53.2 C14.4,51.4 12.3,49.4 10.4,47.1 C7.5,43.7 5,39.8 3.6,35.6 C2,30.7 1.7,25.4 1.6,20.3 C1.5,15.8 2.4,11.3 4.5,7.3 C5.5,5.4 7,3.4 8.9,2.2 C9.7,1.7 10.5,1.3 11.5,1 C11.7,0.9 14.3,0.6 14.3,0.6 C14.3,0.3 11,0.8 10.7,0.9 C9.4,1.4 8.2,2 7.1,2.9 C4.9,4.8 3.4,7.4 2.4,10.1 C0.1,16.1 0.3,22.9 1,29.2 C1.4,32.5 2.2,35.7 3.5,38.8 C4.8,41.9 6.8,44.7 8.9,47.4 C10.9,50 13.2,52.3 15.8,54.4 C18.4,56.4 21.3,58 24.2,59.5 C27.1,61 30.1,62.4 33.2,63.2 C36.5,64 39.9,63.9 43.3,63.4 C47.8,62.8 59.9,60.8 56.6,53.7 C55.2,50.6 53.2,47.7 51.7,44.7 C50.2,41.7 49,38.5 47.9,35.3 C45.6,28.8 43.1,22.5 39.7,16.4 C38.3,13.6 36.6,10.9 34.8,8.3 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:c3ce889c7103": {
        "translation.x": { "0": { value: 210 } },
        "translation.y": { "0": { value: 293 } }
      },

      "haiku:d9c6117a0d18": {
        "translation.x": { "0": { value: 43 } },
        "translation.y": { "0": { value: 29 } }
      },

      "haiku:414c86674c25": {
        d: {
          "0": {
            value: "M9.6,2.3 C10.4,3.4 10.4,5.1 9.5,6.1 C8.1,7.6 5.7,7.4 3.7,7 C3.1,6.9 2.5,6.8 2.1,6.4 C1.1,5.7 1,4.1 1.6,3.1 C2.3,2 3.5,1.5 4.7,1.3 C5.9,1.2 7.2,1.4 8.4,1.6 C8.7,1.7 9,1.7 9.2,1.9 C9.4,2 9.5,2.2 9.6,2.3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:b72aab0f9a99": {
        d: {
          "0": {
            value: "M10.8,5.4 C11.1,4.5 11,3.3 10.4,2.5 C10,1.9 9.2,2.1 9.3,2.9 C9.4,3.8 9.4,4.8 8.8,5.5 C7.9,6.4 6.6,6.5 5.4,6.4 C4.5,6.3 2.9,6.3 2.2,5.6 C1.4,4.6 2,3.3 2.9,2.6 C3.9,1.8 5.3,1.7 6.5,1.8 C7,1.8 7.6,1.9 8.1,1.9 C8.2,1.9 9.7,2.2 9.6,2.3 C10.1,1.9 7.8,1.2 7.6,1.1 C6.6,0.9 5.5,0.7 4.5,0.8 C2.5,1 0.5,2.3 0.4,4.5 C0.3,7.2 2.9,7.8 5.1,8 C7.3,8.3 10,7.8 10.8,5.4 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:c67e7201e41c": { "translation.x": { "0": { value: 40 } } },
      "haiku:98725f175f9c": {
        d: {
          "0": {
            value: "M21.1,6.1 C21.1,8.7 19.1,10.8 16.8,12 C11.9,14.6 5.2,13.8 1.5,9.6 C6.8,8.1 11.8,5.3 15.9,1.7 C16.6,1.1 17.3,0.5 18.2,0.6 C19.1,0.7 19.6,1.6 20,2.4 C20.6,3.6 21.1,4.8 21.1,6.1 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:425663196e22": {
        d: {
          "0": {
            value: "M18.7,11.8 C19.7,11.1 20.5,10.2 21,9.1 C21.3,8.5 22,6.8 21.4,6.1 C20.7,5.4 20.2,7.4 20.1,7.6 C19.6,8.8 18.7,9.7 17.6,10.5 C15.3,12.2 12.3,12.9 9.4,12.7 C7.9,12.6 6.5,12.1 5.1,11.5 C4.4,11.2 3.4,10.7 2.9,10.1 C3.1,10.4 7.8,8 8.3,7.7 C10.4,6.6 12.4,5.3 14.2,3.9 C15.5,2.8 17.7,-0.2 19.2,2.1 C19.8,3 20.2,3.9 20.6,4.9 C20.6,5 20.9,6.1 21,6.1 C21.4,6.1 20.8,3.9 20.8,3.8 C20.5,2.7 20,1.3 19,0.6 C17.8,-0.2 16.5,0.6 15.6,1.4 C14.5,2.3 13.4,3.1 12.3,3.9 C8.5,6.4 4.4,8 0.1,9.4 C2.2,11.6 4.3,13.3 7.4,14 C11.3,14.9 15.5,14.2 18.7,11.8 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:776529010992": {
        "translation.x": { "0": { value: 48 } },
        "translation.y": { "0": { value: 25 } }
      },

      "haiku:7863a9d3c7bb": {
        d: {
          "0": {
            value: "M11.3,5.1 C10.2,6.6 8.5,7.6 6.6,7.7 C4.8,7.8 2.9,7 1.7,5.5 C1.5,5.2 1.3,5 1.3,4.6 C1.3,4.3 1.4,4.1 1.5,3.9 C2.2,2.4 4,1.8 5.7,1.6 C6.8,1.5 7.9,1.6 8.9,2 C10,2.7 10.9,3.8 11.3,5.1 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:a5ed42a83599": {
        d: {
          "0": {
            value: "M9.4,7.9 C10.2,7.5 11,6.9 11.4,6 C11.6,5.6 11.5,4.8 10.9,5 C10.1,5.3 9.4,6 8.7,6.4 C7.4,7 6,7.1 4.6,6.6 C3.7,6.3 2.6,5.6 2.1,4.8 C1.7,3.8 3.6,2.9 4.3,2.6 C6.6,1.8 9.3,2.2 10.8,4.3 C10.9,4.5 11.5,5.6 11.4,4.7 C11.3,3.7 10.6,2.8 9.9,2.2 C7.9,0.5 4.5,0.6 2.4,1.9 C1.5,2.4 0.7,3.3 0.5,4.3 C0.4,5.5 1.5,6.5 2.3,7.1 C4.3,8.7 7.1,9 9.4,7.9 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:4394a4cf2288": {
        "translation.x": { "0": { value: 50 } },
        "translation.y": { "0": { value: 19 } }
      },

      "haiku:4b2a34213ea2": {
        d: {
          "0": {
            value: "M11.7,3.3 C11.9,3.8 12.1,4.2 12.2,4.7 C12.4,6.2 11.7,7.8 10.4,8.8 C9.2,9.7 7.5,10 6,9.8 C4.1,9.5 2.3,8.5 1.1,6.9 C0.4,5.3 1,3.4 2.3,2.2 C3.6,1 5.3,0.5 7.1,0.5 C8.2,0.5 9.3,0.7 10.2,1.3 C10.9,1.8 11.4,2.5 11.7,3.3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:71beefb652ac": {
        d: {
          "0": {
            value: "M12.6,7.4 C13.2,6.2 13.2,4.7 12.5,3.5 C12.2,3 12,3.1 11.6,3.3 C11.2,3.5 11.5,4.4 11.5,4.8 C11.6,8.3 7.8,9.7 4.9,8.7 C3.8,8.3 2,7.4 1.7,6.1 C1.4,4.5 2.3,2.9 3.6,2.1 C4.9,1.2 6.7,0.9 8.3,1.1 C9.1,1.2 9.9,1.5 10.5,2 C10.6,2.1 11.6,3.4 11.7,3.3 C12.2,3.1 10.4,1 10.2,0.9 C9.1,0.1 7.6,-1.38777878e-17 6.3,0.1 C3.4,0.3 0.4,2.2 0.2,5.4 C-8.32667268e-17,8.2 2.9,10.1 5.3,10.6 C8.1,11.1 11.3,10.1 12.6,7.4 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:659dd57cc691": {
        "translation.x": { "0": { value: 50 } },
        "translation.y": { "0": { value: 11 } }
      },

      "haiku:f2a2a8d0e218": {
        d: {
          "0": {
            value: "M14.1,3.9 C13.6,5.1 13,6.2 12.2,7.3 C11.8,7.9 11.4,8.4 10.8,8.9 C9.1,10.4 6.4,10.8 4.3,9.9 C2.2,9 0.8,6.7 0.8,4.4 C4.5,3.5 8.1,2.5 11.8,1.6 C12.6,1.4 13.5,1.3 14.1,1.9 C14.6,2.4 14.4,3.2 14.1,3.9 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:1cc31a72656d": {
        d: {
          "0": {
            value: "M12.7,8.1 C13.5,7.1 14.5,5.5 14.5,4.2 C14.5,4 14.1,3.7 13.8,3.8 C13.4,3.9 13,4.7 12.8,5 C11.8,6.5 10.9,8.2 9.2,9 C7.5,9.8 5.4,9.7 3.9,8.6 C3.2,8.1 2.6,7.4 2.2,6.7 C2.1,6.4 1.5,5.4 1.7,5 C1.8,4.7 2.4,4.7 2.7,4.6 C3.7,4.3 4.8,4 5.8,3.7 C7.8,3.2 9.7,2.6 11.7,2 C12.3,1.8 13.5,1.4 14,2 C14.2,2.3 14.1,3.8 14.2,3.8 C14.5,3.9 14.7,2.6 14.8,2.4 C14.8,1.7 14.4,1.1 13.7,1 C12.2,0.6 10.1,1.4 8.6,1.8 C7,2.2 5.3,2.5 3.7,2.9 C2.9,3.1 2.2,3.3 1.4,3.4 C1.1,3.5 0.4,3.5 0.3,3.7 C-5.55111512e-17,4.3 0.4,5.8 0.6,6.3 C1.1,7.9 2.3,9.4 3.8,10.3 C6.7,12.1 10.6,10.9 12.7,8.1 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:905994a79a81": { "translation.y": { "0": { value: 5 } } },
      "haiku:7af2996f38cd": {
        d: {
          "0": {
            value: "M5.9,6.5 C12.4,5.1 15.4,5 21.4,6.2 C23.7,6.6 25.8,7.2 28.2,7 C34.3,6.6 40.4,3.3 46.3,1.9 C50.9,0.8 54.8,0.4 57,5.4 C59.2,10.5 58.4,17.6 55.6,22.5 C53.4,26.3 49.8,30.1 45.4,30.8 C38.8,31.9 32.9,28.4 26.3,29.7 C19.9,31 11,31.2 5.2,27.4 C-2.4,22.6 1.4,12 5.9,6.5 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:fed35bb805bc": {
        d: {
          "0": {
            value: "M24,5.9 C20.8,5.3 17.6,4.6 14.3,4.7 C11.7,4.8 8.9,5.2 6.4,6.1 C6.3,6.1 6,6.2 5.9,6.3 C5.9,6.3 6,6.9 6,6.9 C6.4,7.2 7.8,6.8 8.2,6.7 C11.3,6.3 14.3,6.1 17.4,6.5 C20.5,6.9 23.6,7.9 26.8,8 C30.1,8.1 33.4,7.2 36.5,6.1 C39.8,5 43,3.7 46.4,2.8 C49.4,2.1 53.1,1.3 55.2,4.2 C57.1,6.8 57.5,10.4 57.3,13.5 C57.1,16.8 56.1,20.1 54.4,23 C52.8,25.6 50.5,28.2 47.6,29.5 C44.9,30.8 41.8,30.6 38.8,30.2 C35.3,29.7 31.8,28.8 28.2,29 C24.8,29.2 21.5,30.1 18.1,30.1 C12.7,30.2 4.7,29.3 2.1,23.7 C0.5,20.4 1.1,16.6 2.3,13.3 C2.8,12 3.4,10.7 4.1,9.5 C4.2,9.3 5.9,6.7 5.9,6.6 C5.5,6.2 2.3,11.9 2.1,12.4 C0.8,15.3 1.1524115e-13,18.6 0.6,21.7 C1.8,27.8 8.1,30.2 13.6,31 C17.1,31.5 20.6,31.3 24.1,30.9 C25.7,30.7 27.2,30.3 28.8,30.3 C30.5,30.3 32.2,30.5 33.8,30.7 C37.2,31.3 40.7,32.1 44.2,31.8 C47.5,31.4 50.2,30 52.6,27.7 C56.2,24.2 58.3,19.5 58.9,14.5 C59.4,10 58.7,3.1 54,1.1 C51.7,0.1 49.1,0.6 46.7,1.1 C44.2,1.7 41.8,2.5 39.4,3.4 C34.5,5 29.2,7.1 24,5.9 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:195aaa9d3625": {
        "translation.x": { "0": { value: 59 } },
        "translation.y": { "0": { value: 17 } }
      },

      "haiku:420e0c8877fc": {
        d: { "0": { value: "M1.5,1 C1.5,0.9 1.5,0.8 1.5,0.7" } },
        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:71d6c7af21fa": {
        d: {
          "0": { value: "M0.7,1 C0.7,1 2.4,1 2.4,1 C2.4,0.6 0.7,0.6 0.7,1 Z" }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:9ec19a36132b": {
        d: {
          "0": {
            value: "M248.1,326.1 C251.1,326.2 254.2,326.1 256.8,324.6 C259.3,323.2 261,320.6 262,317.8 C263,315.1 263.2,312.1 263.5,309.2 C263.6,307.9 263.7,306.5 263,305.4 C261.9,303.6 259.3,303.6 257.3,303.9 C249.4,305.1 242,309.3 236.8,315.3 C235.7,316.6 234.6,318.2 234.8,319.9 C235,321.6 236.4,323 237.9,323.8 C240.9,325.7 244.6,326 248.1,326.1 Z"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:ac841319adb1": {
        d: {
          "0": {
            value: "M231.3,316.8 C230.9,321 227.8,324.8 223.8,326.1 C221.5,326.9 218.6,326.7 217,324.8 C215.8,323.3 215.8,321.2 216.2,319.4 C217.3,315.3 220.8,311.9 224.9,311 C226.5,310.7 228.2,310.7 229.5,311.7 C231.1,312.8 231.5,314.9 231.3,316.8 Z"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:c7aaf441198b": {
        "translation.x": { "0": { value: 153 } },
        "translation.y": { "0": { value: 213 } }
      },

      "haiku:6f96a8c62e13": {
        d: {
          "0": {
            value: "M22.3,0.6 C40.9,2 46.5,23.2 48.7,37.8 C50.7,50.9 61.3,60.3 62.6,73.9 C63.3,80.6 63,87.6 63,94.4 C63,100.4 65.3,104.8 66.1,110.2 C61,112 55.1,115 49.7,115.6 C46.8,115.9 47.3,116.9 45.6,113.5 C44.6,111.4 44.5,108.6 43.7,106.3 C42.3,102.4 40,99 38.2,95.2 C35.8,90.4 35.1,85.3 33.3,80.2 C30.7,73.1 32.4,64.9 27.8,59 C21.9,51.4 14.7,45.4 7.9,38.4 C1.7,32 0.3,24.2 1.9,15.5 C3.7,5.5 12.6,-0.1 22.3,0.6 Z"
          }
        },

        fill: { "0": { value: "#E5E54F" } }
      },

      "haiku:8ebbdb63f2de": {
        d: {
          "0": {
            value: "M46.2,23.1 C44.4,17.2 41.6,11.3 37.2,6.9 C35.1,4.8 32.6,3 29.8,1.8 C28.6,1.3 27.3,0.9 26,0.6 C24.9,0.4 23.4,6.38378239e-16 22.3,0.2 C22.2,0.2 22.2,0.8 22.3,0.8 C22.7,1 23.3,1 23.7,1.1 C25,1.3 26.3,1.7 27.6,2.1 C30.4,3.1 33,4.7 35.1,6.8 C39.7,11.2 42.6,17.2 44.5,23.2 C45.5,26.4 46.3,29.7 47,33 C47.7,36.4 48,39.8 49.1,43.1 C51.2,49.6 55,55.3 58,61.5 C59.5,64.5 60.7,67.7 61.4,71 C62.1,74.5 62.2,78.2 62.3,81.7 C62.4,85.3 62.3,88.8 62.3,92.4 C62.3,95.9 62.7,99.2 63.5,102.6 C63.9,104.2 64.4,105.8 64.8,107.4 C65,108.1 65.1,108.8 65.2,109.5 C65.2,109.8 64.7,109.8 64.5,109.9 C61.5,111.1 58.5,112.4 55.5,113.4 C54,113.9 52.4,114.3 50.8,114.6 C50.1,114.7 49.4,114.8 48.7,114.9 C48,115 47.5,115.4 47.1,114.7 C45.4,111.7 45.3,108.4 44.1,105.3 C42.9,102.2 41.2,99.4 39.6,96.5 C37.9,93.4 36.8,90.1 35.9,86.7 C35,83.4 33.7,80.2 33,76.9 C32.3,73.6 32.2,70.2 31.5,66.8 C30.9,63.4 29.7,60.5 27.5,57.8 C25.4,55.2 23,52.7 20.6,50.3 C18.2,47.9 15.8,45.6 13.3,43.2 C10.9,40.9 8.3,38.6 6.2,35.9 C2,30.5 1,23.9 1.8,17.2 C2.6,11.2 5.6,5.9 11,2.9 C13.1,1.7 15.5,1 17.9,0.6 C18.1,0.6 22.2,0.3 22.2,0.3 C22.2,0.1 19.2,0.2 19,0.2 C17.5,0.3 16,0.5 14.5,1 C11.7,1.8 9,3.3 6.8,5.3 C2.2,9.6 0.7,15.9 0.7,22.1 C0.7,25.5 1.3,28.9 2.7,32.1 C4.1,35.2 6.3,37.8 8.7,40.3 C13.6,45.2 18.8,50 23.5,55.2 C25.7,57.7 28,60.2 29.2,63.3 C30.3,66.4 30.6,69.8 31,73.1 C31.4,76.6 32.4,79.8 33.4,83.2 C34.4,86.6 35.2,90 36.5,93.3 C37.7,96.4 39.5,99.3 41.1,102.3 C41.8,103.7 42.5,105.2 43,106.7 C43.6,108.4 43.8,110.2 44.2,111.9 C44.6,113.3 45.2,114.6 45.9,115.8 C46.8,117.3 48.2,116.6 49.6,116.4 C52.9,116 56.1,115 59.2,113.8 C61.5,112.9 63.7,112 66,111.1 C66.6,110.9 66.9,110.9 66.8,110.3 C66.6,109.1 66.4,107.9 66.1,106.8 C65.3,103.5 64.2,100.2 63.9,96.7 C63.6,93.2 63.8,89.6 63.9,86.1 C63.9,79.1 63.9,72 61.4,65.3 C59,58.8 55,53 52.2,46.6 C50.6,42.9 49.8,39.2 49.1,35.3 C48.4,31.3 47.5,27.1 46.2,23.1 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:1c27020a7263": {
        d: {
          "0": {
            value: "M50.6,94.2 C51.9,96.4 53.3,98.6 53.4,101.1 C53.5,103.6 51.8,106.4 49.3,106.5 C46.6,106.6 44.9,103.8 43.8,101.3 C40.5,94.2 37.2,87 35.6,79.4 C34.2,72.5 34.1,65.2 30.9,58.9 C28.5,54.1 24.4,50.3 22.6,45.3 C19.4,36.2 24.6,26.5 24.8,16.9 C27.7,16.6 30,19.4 31.3,21.9 C39.5,37.2 37.9,55.7 41.8,72.7 C43.8,80.1 46.7,87.4 50.6,94.2 Z"
          }
        },

        fill: { "0": { value: "#BDC132" } }
      },

      "haiku:a40c3ed9946f": {
        "translation.x": { "0": { value: 32 } },
        "translation.y": { "0": { value: 98 } }
      },

      "haiku:e514980876e4": {
        d: {
          "0": {
            value: "M3.5,11.6 C4.3,11.1 5.2,10.8 5.9,10.2 C6.6,8.9 7.4,7.6 8.4,6.3 C8.9,5.1 9.5,3.9 11.2,3.4 C12.9,2 14.8,1.1 16.9,1.1 C22.3,1.2 29,4.7 33.4,7.7 C35.7,9.3 39.6,12.8 38.8,16 C37.9,19.4 33.7,20.7 30.5,20.7 C28.8,20.7 27.2,20.2 25.4,20.3 C23.8,20.4 22.4,21.3 20.7,21.3 C19.1,21.3 16.9,21.2 15.5,20.3 C14.7,19.8 14,18.9 13.4,18.2 C12.3,17 11.7,16.3 10.8,15.6 C8.7,17 5.5,18.1 3.3,17.6 C-1,16.7 0.8,13.2 3.5,11.6 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:f8b521160ae8": {
        d: {
          "0": {
            value: "M10.7,2.7 C8.9,3.3 8.3,4.8 7.4,6.2 C6.6,7.3 5.9,8.5 5.3,9.7 C4.9,10.5 2.8,10.6 3.5,11.7 C3.8,12.1 5.9,10.9 6.2,10.7 C6.5,10.5 6.7,10 6.8,9.8 C7.3,9 7.8,8.3 8.4,7.6 C8.8,7.1 9.1,6.5 9.4,6 C10,5 10.8,4.7 11.7,4.1 C13.7,2.8 15.4,1.9 17.8,2.2 C20.7,2.5 23.4,3.5 26,4.7 C29.6,6.4 42,12.7 36.7,18 C35.3,19.5 33,20.1 31,20.2 C28.9,20.4 26.7,19.6 24.6,20 C23.7,20.2 22.8,20.5 21.8,20.7 C20.7,21 19.6,20.9 18.5,20.8 C16.2,20.6 15,19.7 13.5,18 C12.8,17.3 12.1,16.5 11.4,15.9 C10.9,15.5 10.7,15.1 10.2,15.5 C8.6,16.5 6.8,17.3 4.9,17.5 C3.4,17.7 0.7,17.3 0.8,15.3 C0.8,14.5 1.3,13.7 1.8,13.1 C1.9,13 3.2,11.8 3.2,11.7 C3.1,11.4 1.1,13.2 1,13.4 C2.25819363e-13,14.7 -0.2,16.4 1.3,17.4 C4,19.3 7.7,17.9 10.3,16.5 C11,16.3 12.3,18.2 12.7,18.7 C13.8,20 14.9,21.1 16.6,21.6 C18,22 19.7,22.2 21.2,22 C22.9,21.8 24.4,21 26.1,21.1 C27.6,21.2 29.1,21.6 30.6,21.5 C32.3,21.4 34,21.1 35.6,20.3 C38.5,18.9 40.2,15.9 38.8,12.8 C37.5,9.8 34.6,7.7 31.9,6 C29.1,4.2 26.2,2.7 23,1.6 C21.1,0.9 19,0.4 17,0.3 C14.8,0.2 12.6,1.2 10.7,2.7 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:b70ec625d461": {
        "translation.x": { "0": { value: 34 } },
        "translation.y": { "0": { value: 9 } }
      },

      "haiku:93eac0788ad5": {
        d: {
          "0": {
            value: "M2.6,1.3 C6.1,2.1 7.3,4 8.1,7.3 C8.6,9.1 8.8,12.2 6.3,12.7 C2,13.5 -1.4,0.3 2.6,1.3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:93bb70d8bdce": {
        d: {
          "0": {
            value: "M6.4,2.2 C5.5,1.4 4.3,0.8 3.1,0.8 C2.6,0.8 2.6,1 2.5,1.4 C2.4,1.8 3,1.9 3.2,2.1 C4.4,2.8 5.5,3.5 6.2,4.7 C6.9,6 7.4,7.7 7.5,9.2 C7.5,10.4 7,12.3 5.3,11.8 C3.9,11.3 2.9,9.5 2.3,8.2 C1.7,6.8 1.2,5.2 1.1,3.6 C1.1,3.1 1.1,2.5 1.3,2 C1.4,1.7 2.5,1.3 2.5,1.3 C2.6,1 1.5,1.1 1.4,1.2 C0.9,1.4 0.6,1.9 0.5,2.4 C0.1,3.6 0.2,4.8 0.4,6 C0.8,8.4 1.9,11.6 4.1,13 C6.6,14.6 8.9,12.4 9,9.8 C9.3,7.2 8.4,3.9 6.4,2.2 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:21bbcff0958a": {
        "translation.x": { "0": { value: 11 } },
        "translation.y": { "0": { value: 4 } }
      },

      "haiku:645482f3d301": {
        d: {
          "0": {
            value: "M10.5,9.3 C10,10.5 9.6,11.8 9,13 C8.1,14.8 7.2,16.2 5.7,17.5 C3.2,19.7 1.8,18 1.2,15 C0.4,11.5 1.7,7.2 2.9,3.9 C4,1.1 7.2,-1.4 9.5,2.3 C9.5,2.4 11.6,6.5 10.5,9.3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:74bfd9f79360": {
        d: {
          "0": {
            value: "M9.1,14.6 C9.6,13.7 9.9,12.8 10.2,11.9 C10.4,11.3 11,10.1 10.8,9.5 C10.6,8.9 10,9.4 9.8,9.6 C9.2,10.4 8.8,11.4 8.4,12.3 C7.5,14.2 6.4,16.1 4.6,17.3 C2.4,18.7 1.8,14.8 1.8,13.4 C1.6,11 2.2,8.5 2.9,6.2 C3.5,4.3 4.2,1.9 6.3,1.2 C8.4,0.5 9.6,3.4 10.1,4.9 C10.4,5.8 10.6,6.8 10.6,7.8 C10.6,7.9 10.4,9.3 10.5,9.4 C10.7,9.5 11,8 11.1,7.9 C11.2,7 11.1,6 10.9,5.1 C10.6,3.5 10,1.7 8.6,0.7 C7.1,-0.3 5.4,0.1 4.1,1.3 C2.7,2.5 2.1,4.2 1.6,5.9 C0.3,9.6 -0.6,13.9 1.1,17.6 C3.2,22 7.7,17.2 9.1,14.6 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:70bd2fedf730": {
        "translation.x": { "0": { value: 29 } },
        "translation.y": { "0": { value: 8 } }
      },

      "haiku:00847cac5f6d": {
        d: {
          "0": {
            value: "M3.9,0.9 C0.2,1.3 2,4.2 2.9,6.4 C3.8,8.6 4,14 6.8,14.5 C10,15.1 9.5,11.2 9.5,9.3 C9.5,6.2 8.4,4.4 7.6,1.8 C5.9,1 3.9,0.9 3.9,0.9 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:108e335b9894": {
        d: {
          "0": {
            value: "M2.7,3.5 C2.5,2.9 2.4,2.3 3,1.8 C3.3,1.6 4.4,1.2 3.9,0.6 C3.8,1.66533454e-16 2.1,0.7 1.8,0.8 C0.9,1.4 0.7,2.5 0.9,3.5 C1.1,4.5 1.6,5.4 2,6.2 C2.4,7.2 2.7,8.2 2.9,9.3 C3.3,11.2 3.9,13.8 5.7,14.8 C7.4,15.7 9.4,15 9.9,13.1 C10.5,11.1 10.2,8.4 9.8,6.5 C9.5,5.4 9.2,4.4 8.7,3.4 C8.5,2.9 8.3,1.7 7.8,1.3 C7.5,1 3.8,0.3 3.8,0.7 C3.8,0.9 5.6,1.3 5.7,1.3 C6.2,1.5 6.7,1.6 7.1,1.9 C7.4,2.2 7.5,3.1 7.6,3.5 C8.5,6.1 8.9,8.7 8.6,11.5 C8.5,12.4 8.3,13.8 7.1,13.6 C5.8,13.4 5.3,12.3 5,11.2 C4.6,9.9 4.4,8.6 4,7.4 C3.9,6.1 3.1,4.9 2.7,3.5 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:52292ddaa34b": {
        "translation.x": { "0": { value: 23 } },
        "translation.y": { "0": { value: 6 } }
      },

      "haiku:0dde71f7419c": {
        d: {
          "0": {
            value: "M7.8,0.8 C10.8,2.8 11.2,13.2 8.8,16.3 C7.7,17.7 5.5,17.9 4.2,16.7 C2.3,14.8 1.4,9 1.6,6.5 C1.9,3.6 3.3,0.7 6.6,1 L7.8,0.8 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:8a53b6d6873c": {
        d: {
          "0": {
            value: "M10.8,5.1 C10.5,3.6 9.8,1.2 8.2,0.6 C7.8,0.4 7.6,1.2 7.8,1.5 C8.3,2.2 8.6,3.2 8.8,4 C9.4,6.1 9.6,8.4 9.5,10.6 C9.4,12.4 9.2,15.6 7.4,16.6 C3.5,18.7 2.4,10.8 2.2,8.6 C2,6.7 2.2,4.4 3.4,2.8 C4,2 4.8,1.5 5.8,1.4 C6,1.4 7.8,1.2 7.8,0.9 C7.7,0.6 4.6,1 4.3,1.1 C2.8,1.7 2,3 1.5,4.5 C0.3,7.8 1,12.1 2.4,15.3 C3,16.7 3.9,18 5.5,18.4 C7.1,18.7 8.9,18 9.7,16.6 C11.7,13.3 11.5,8.6 10.8,5.1 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:07075830ed57": {
        "translation.x": { "0": { value: 53 } },
        "translation.y": { "0": { value: 213 } }
      },

      "haiku:66101c5a2bec": {
        d: {
          "0": {
            value: "M45.5,0.6 C26.9,2 21.3,23.2 19.1,37.8 C17.1,50.9 6.5,60.3 5.2,73.9 C4.5,80.6 4.8,87.6 4.8,94.4 C4.8,100.4 2.5,104.8 1.7,110.2 C6.8,112 12.7,115 18.1,115.6 C21,115.9 20.5,116.9 22.2,113.5 C23.2,111.4 23.3,108.6 24.1,106.3 C25.5,102.4 27.8,99 29.6,95.2 C32,90.4 32.7,85.3 34.5,80.2 C37.1,73.1 35.4,64.9 40,59 C45.9,51.4 53.1,45.4 59.9,38.4 C66.1,32 67.5,24.2 65.9,15.5 C64.1,5.5 55.2,-0.1 45.5,0.6 Z"
          }
        },

        fill: { "0": { value: "#E5E54F" } }
      },

      "haiku:fef92beb6f85": {
        d: {
          "0": {
            value: "M23.1,23.6 C24.9,17.8 27.7,11.9 32,7.5 C34.1,5.4 36.6,3.7 39.4,2.5 C40.5,2.1 41.7,1.7 42.8,1.4 C43.4,1.2 44.1,1.1 44.7,1 C45.3,0.9 45.4,0.9 45.3,0.3 C45.2,-0.5 39,1.2 38.4,1.4 C35.6,2.5 33,4.1 30.9,6.2 C26.3,10.6 23.4,16.6 21.5,22.6 C20.5,25.8 19.7,29 19,32.3 C18.4,35.6 18,39 17,42.2 C14.9,48.9 10.9,54.7 8,61 C6.6,64.1 5.4,67.3 4.7,70.6 C4,74 3.9,77.7 3.8,81.2 C3.7,84.8 3.8,88.4 3.8,92 C3.8,95.5 3.5,98.8 2.6,102.2 C1.9,104.9 1.2,107.5 0.7,110.3 C0.6,110.9 1.1,110.9 1.6,111 C2.4,111.3 3.1,111.6 3.9,111.9 C7.2,113.2 10.4,114.6 13.8,115.5 C15.3,115.9 16.8,116.1 18.3,116.3 C19.8,116.5 20.9,116.9 21.8,115.4 C23.5,112.5 23.6,109.2 24.7,106.1 C25.9,103 27.6,100.1 29.2,97.1 C30.8,94 32,90.8 32.9,87.4 C33.8,84.1 35.1,80.8 35.8,77.5 C36.6,74.1 36.7,70.7 37.3,67.3 C37.9,64 39,61.2 41,58.6 C45.4,53.1 50.5,48.4 55.5,43.5 C58,41.1 60.6,38.7 62.6,35.9 C64.6,33.1 65.9,29.9 66.5,26.6 C67.5,20.7 66.8,13.5 63.4,8.5 C61.4,5.6 58.6,3.3 55.3,1.9 C53.6,1.2 51.9,0.7 50.1,0.5 C49.8,0.5 45.4,0.2 45.4,0.5 C45.4,0.3 50.8,1 51.1,1 C54,1.6 56.7,2.8 59,4.6 C64,8.5 65.8,14.6 66,20.7 C66.1,24.1 65.7,27.5 64.4,30.7 C63.2,33.8 61.2,36.3 58.9,38.7 C54.1,43.6 49,48.1 44.3,53.1 C42.1,55.5 39.5,58 38,60.9 C36.5,63.9 36,67.2 35.6,70.4 C35.2,73.8 34.7,77.1 33.7,80.4 C32.5,83.7 31.8,87.1 30.7,90.4 C28.6,96.9 23.9,102.3 22.5,109 C22.2,110.6 21.9,112.1 21.1,113.6 C20.8,114.1 20.6,114.8 20.2,115.2 C20,115.4 18.5,114.9 18.2,114.9 C14.9,114.4 11.7,113.4 8.6,112.2 C7,111.5 5.3,110.9 3.7,110.2 C2.9,109.9 2.4,110 2.6,109.1 C3.3,105.7 4.4,102.5 5,99.1 C5.6,95.7 5.4,92.1 5.4,88.7 C5.4,85.1 5.4,81.5 5.5,78 C5.7,74.5 6.1,71 7.2,67.7 C8.2,64.5 9.7,61.4 11.3,58.4 C14.5,52.4 18.1,46.5 19.5,39.7 C20.7,34.3 21.5,28.9 23.1,23.6 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:6af6e7609130": {
        d: {
          "0": {
            value: "M91,234.9 C93,242.2 91.7,250 89.5,257.3 C87.3,264.6 84.2,271.5 82.3,278.8 C80.8,284.6 80,290.7 78.1,296.4 C76.4,301.5 73.9,306.3 71.6,311.2 C71.1,312.2 70.7,313.3 70.8,314.4 C70.9,315.5 71.7,316.6 72.8,316.6 C73.9,316.6 74.7,315.6 75.2,314.7 C80.5,306.3 84.4,297.1 86.6,287.5 C87.8,282.1 88.6,276.6 91,271.6 C92.9,267.7 95.7,264.3 96.6,260.1 C97.6,255.9 95.6,250.5 91.3,250"
          }
        },

        fill: { "0": { value: "#BDC132" } }
      },

      "haiku:9922a5627e6c": {
        "translation.x": { "0": { value: 45 } },
        "translation.y": { "0": { value: 311 } }
      },

      "haiku:5e0f590c4eb8": { "translation.x": { "0": { value: 4 } } },
      "haiku:e8f98a010b47": {
        d: {
          "0": {
            value: "M36.3,11.6 C35.5,11.1 34.6,10.8 33.9,10.2 C33.2,8.9 32.4,7.6 31.4,6.3 C30.9,5.1 30.3,3.9 28.6,3.4 C26.9,2 25,1.1 22.9,1.1 C17.5,1.2 10.8,4.7 6.4,7.7 C4.1,9.3 0.2,12.8 1,16 C1.9,19.4 6.1,20.7 9.3,20.7 C11,20.7 12.6,20.2 14.4,20.3 C16,20.4 17.4,21.3 19.1,21.3 C20.7,21.3 22.9,21.2 24.3,20.3 C25.1,19.8 25.8,18.9 26.4,18.2 C27.5,17 28.1,16.3 29,15.6 C31.1,17 34.3,18.1 36.5,17.6 C40.7,16.7 39,13.2 36.3,11.6 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:1b4ebe95ee86": {
        d: {
          "0": {
            value: "M28.4,4.3 C29.4,4.6 30,5.4 30.5,6.3 C30.9,7.1 31.5,7.8 32.1,8.6 C32.6,9.3 33,10.4 33.7,10.9 C34,11.1 36.6,12.6 36.5,11.4 C36.6,11.3 34.5,9.8 34.3,9.5 C33.7,8.3 33,7.2 32.2,6.1 C31.9,5.6 31.7,5 31.4,4.5 C30.8,3.5 29.8,3.2 28.9,2.6 C26.5,0.8 24.1,0.2 21.1,0.6 C18.2,1 15.3,2.1 12.7,3.3 C9.7,4.7 6.6,6.5 4.1,8.7 C1.9,10.6 -0.6,13.7 0.5,16.8 C2.1,21 7.5,21.9 11.5,21.3 C12.5,21.2 13.5,21 14.6,21.1 C15.8,21.2 16.8,21.7 18,21.9 C20.1,22.3 23,22 24.8,20.8 C26.5,19.7 27.5,17.8 29,16.5 C29.3,16.2 30.9,17.3 31.3,17.4 C32.4,17.8 33.6,18.1 34.7,18.2 C36.5,18.3 39.6,17.6 39.4,15.3 C39.3,14.3 38.7,13.4 38,12.8 C37.9,12.7 36.4,11.5 36.4,11.7 C36.4,11.7 38.2,13.6 38.4,13.8 C39.1,15 39.1,16.3 37.7,17 C35.1,18.3 31.8,16.9 29.6,15.5 C29.5,15.4 29.2,15.2 29.1,15.2 C28.7,15.5 28.2,15.9 27.9,16.2 C26.7,17.3 25.8,18.7 24.5,19.7 C22,21.5 18.6,20.7 16,20 C14.5,19.6 13,19.8 11.5,20 C9.9,20.2 8.2,20.2 6.6,19.7 C3.3,18.8 0.7,16.1 2.8,12.7 C4.5,9.9 7.5,8.1 10.2,6.5 C13.1,4.8 16.3,3.3 19.5,2.5 C20.8,2.2 22.1,2 23.4,2 C24.6,2.1 25.7,2.4 26.7,3 C27.2,3.4 27.7,4 28.4,4.3 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:593382e1c880": { "translation.y": { "0": { value: 9 } } },
      "haiku:523900d7351a": {
        d: {
          "0": {
            value: "M7.1,1.3 C3.6,2.1 2.4,4 1.6,7.3 C1.1,9.1 0.9,12.2 3.4,12.7 C7.8,13.5 11.2,0.3 7.1,1.3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:3da2f6c32f38": {
        d: {
          "0": {
            value: "M4.5,3.5 C4.8,3.3 7.3,1.9 7.2,1.6 C7.5,0.2 4.7,1.3 4.3,1.6 C2.8,2.4 1.9,4 1.4,5.6 C0.8,7.4 0.3,9.5 0.9,11.4 C1.5,13 3.3,14.1 4.9,13.4 C6.5,12.7 7.6,11 8.2,9.4 C8.9,7.7 9.4,5.8 9.4,3.9 C9.4,3.2 9.3,2.4 8.9,1.8 C8.7,1.5 8.4,1.2 8,1.1 C7.9,1.1 7,1 7.1,1.3 C7.1,1.4 7.7,1.5 7.8,1.5 C8.1,1.7 8.3,2 8.4,2.3 C8.6,3.1 8.5,4.1 8.3,4.9 C7.9,7 7,9.4 5.5,11 C4.8,11.7 4,12.1 3.1,11.7 C2.2,11.3 2.1,10.1 2.2,9.2 C2.3,7.4 3,4.8 4.5,3.5 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:e134c27bc27e": {
        "translation.x": { "0": { value: 21 } },
        "translation.y": { "0": { value: 4 } }
      },

      "haiku:10068a3f153f": {
        d: {
          "0": {
            value: "M1.3,9.3 C1.8,10.5 2.2,11.8 2.8,13 C3.7,14.8 4.6,16.2 6.1,17.5 C8.6,19.7 10,18 10.6,15 C11.4,11.5 10.1,7.2 8.9,3.9 C7.8,1.1 4.6,-1.4 2.3,2.3 C2.2,2.4 0.2,6.5 1.3,9.3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:fcacd51e1e2e": {
        d: {
          "0": {
            value: "M4.1,13.8 C3.7,13.1 2.3,8.9 1.2,9.3 C0.1,9.7 2.1,13.8 2.5,14.5 C3.5,16.3 5.2,18.6 7.3,19.2 C10.2,20 11.2,16.1 11.4,14 C11.7,11.3 11,8.5 10.2,6 C9.5,3.9 8.7,1.5 6.5,0.4 C4.3,-0.7 2.2,0.6 1.4,2.7 C0.9,3.8 0.6,5 0.5,6.3 C0.5,6.5 0.6,9.6 1.1,9.3 C1.1,9.3 1.1,6.9 1.1,6.7 C1.3,5.3 1.8,3.7 2.5,2.5 C3.3,1.3 4.5,0.6 5.9,1.3 C7.3,2.1 7.9,3.5 8.4,4.9 C9.5,8.1 10.4,11.7 9.6,15.1 C9.3,16.4 8.6,18.2 7.1,17.1 C5.9,16.5 4.9,15.2 4.1,13.8 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:64f7ec838f8e": {
        "translation.x": { "0": { value: 4 } },
        "translation.y": { "0": { value: 8 } }
      },

      "haiku:6973f7467739": {
        d: {
          "0": {
            value: "M6.8,0.9 C10.5,1.3 8.7,4.2 7.8,6.4 C6.9,8.6 6.7,14 3.9,14.5 C0.7,15.1 1.2,11.2 1.2,9.3 C1.2,6.2 2.3,4.4 3.1,1.8 C4.8,1 6.8,0.9 6.8,0.9 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:9ffc6d13cae4": {
        d: {
          "0": {
            value: "M9.7,4 C10.1,2.5 9.6,0.8 7.9,0.5 C7.4,0.4 6.8,0.3 6.8,0.9 C6.7,1.6 7.5,1.6 7.9,2 C8.9,2.9 7.2,5.4 6.8,6.3 C6.1,8.2 6,10.2 5.2,12.1 C4.7,13.1 2.9,14.8 2.1,13.1 C1.4,11.5 1.6,9 1.8,7.3 C2,5.6 2.7,3.9 3.3,2.2 C3.5,1.6 6.7,1.3 6.7,0.9 C6.7,0.5 3.8,1.1 3.6,1.2 C2.4,1.5 2.4,2.2 1.9,3.3 C0.7,6.2 -0.1,9.5 0.4,12.7 C0.9,16 4.8,16 6.3,13.4 C7.1,12 7.4,10.3 7.8,8.7 C8.4,7 9.2,5.6 9.7,4 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:513911c14bff": {
        "translation.x": { "0": { value: 9 } },
        "translation.y": { "0": { value: 6 } }
      },

      "haiku:72709f4cdb43": {
        d: {
          "0": {
            value: "M4,0.8 C1,2.8 0.6,13.2 3,16.3 C4.1,17.7 6.3,17.9 7.6,16.7 C9.5,14.8 10.4,9 10.2,6.5 C9.9,3.6 8.5,0.7 5.2,1 L4,0.8 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:3a80cead80cc": {
        d: {
          "0": {
            value: "M2.6,5.4 C2.8,4.5 3,3.6 3.3,2.7 C3.5,2.1 4.3,1.3 3.9,0.8 C3,-0.6 1.1,4.1 1,4.7 C0.4,7.1 0.4,9.6 0.7,12 C1,14.2 1.6,17.1 3.9,18 C9.3,20.2 10.6,12 10.7,8.5 C10.8,6.3 10.4,3.7 8.8,2 C8.2,1.3 7.4,0.9 6.4,0.7 C6.2,0.7 3.8,0.6 3.8,0.7 C3.8,1 6.6,1.4 6.8,1.5 C8,2.1 8.7,3.2 9.1,4.4 C10,7.3 9.3,10.9 8.3,13.7 C7.9,14.7 7.5,15.9 6.5,16.5 C5.2,17.2 3.8,16.4 3.2,15.2 C1.8,12.4 2,8.5 2.6,5.4 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:c531ee2813f9": {
        "translation.x": { "0": { value: 89 } },
        "translation.y": { "0": { value: 212 } }
      },

      "haiku:e643b7710913": {
        d: {
          "0": {
            value: "M87.7,87.2 C87.9,87.1 88.1,86.9 88.3,86.8 C89.5,80.4 90.3,73.9 90,67.1 C90,66.8 90,66.6 90,66.3 C89.1,59.3 88,52.3 89.9,45.5 C91.6,39.3 93.3,34.9 93.2,28.1 C93.1,18.1 90.4,8.9 83.7,1.7 C80.1,1.3 76.6,4.7 73.1,5.1 C65.8,5.9 58.1,5.2 50.7,5.2 C49.6,5.2 48.5,5.2 47.4,5.2 C46.3,5.2 45.2,5.2 44.1,5.2 C36.8,5.2 29,5.9 21.7,5.1 C18.2,4.7 14.6,1.3 11.1,1.7 C4.4,8.9 1.7,18 1.6,28.1 C1.5,34.9 3.2,39.4 4.9,45.5 C7.3,54.3 4.8,63.2 4.2,72 L2.4,73 C3,73.1 3.5,73.3 4.1,73.5 C4,74.6 4,75.7 4,76.8 C4.2,77.1 4.4,77.4 4.6,77.7 C5.8,84.7 12.2,91.3 17.4,94.8 C17.7,95 18,95.2 18.3,95.4 C19.8,96.7 21.3,97.8 22.9,98.9 C28.8,103.8 34,109.7 37.3,116.4 C42.9,118.6 52.4,118.8 59.4,117.3 C65.4,104.9 76.9,95.2 87.7,87.2 Z"
          }
        },

        fill: { "0": { value: "#D0DE53" } }
      },

      "haiku:e7a59b7c42d1": {
        d: {
          "0": {
            value: "M89.5,44.2 C87.8,50.5 88.1,56.8 89,63.3 C89.7,69 89.5,74.7 88.9,80.4 C88.8,81.6 88.6,82.7 88.5,83.9 C88.4,84.9 88.4,86.2 87.7,86.9 C87.6,87.1 88,87.4 88.2,87.3 C88.6,87.1 88.8,87 88.9,86.5 C89.2,85.2 89.5,83.9 89.7,82.6 C90.2,79.6 90.6,76.6 90.8,73.5 C91,70.8 91.2,68 90.8,65.3 C90,58.6 89,51.6 91,45 C91.9,41.9 92.9,38.7 93.5,35.5 C94.2,32.1 94.3,28.6 94.1,25.2 C93.7,18.5 92,11.9 88.4,6.2 C87.6,4.9 86.7,3.7 85.7,2.5 C85.3,2 84.7,1.1 84.2,0.8 C83.6,0.5 82.1,0.8 81.5,1 C80,1.4 78.6,2.1 77.2,2.8 C74.6,4.1 72.4,4.4 69.5,4.5 C65.9,4.7 62.3,4.6 58.6,4.5 C51.4,4.3 44.3,4.3 37.1,4.5 C33.6,4.6 30,4.7 26.5,4.6 C24.8,4.5 23.1,4.5 21.4,4.2 C19.8,3.9 18.3,3 16.8,2.3 C15.4,1.6 13.8,1 12.2,0.9 C11.8,0.9 11,0.8 10.8,1.1 C10.5,1.5 10.1,1.8 9.8,2.2 C7.6,4.7 5.8,7.6 4.5,10.7 C2.1,16.2 1.1,22.3 1.1,28.2 C1.1,34.2 2.8,39.9 4.4,45.6 C5.9,51.7 5.4,57.7 4.6,63.8 C4.4,65.2 4.2,66.6 4.1,68.1 C4,68.8 3.9,69.5 3.9,70.2 C3.9,70.5 4,71.5 3.7,71.7 C2.8,72.2 1.9,72.8 0.9,73.3 C1.4,73.4 2,73.6 2.5,73.7 C3,73.8 3.7,73.8 3.7,74.4 C3.7,75 3.7,75.6 3.7,76.2 C3.7,76.6 3.6,76.9 3.9,77.3 C4.1,77.5 4.3,77.8 4.4,78.1 C5.7,84 9.7,89 14.2,92.9 C18.3,96.4 22.8,99.2 26.7,102.9 C29.1,105.2 31.4,107.8 33.4,110.5 C34.4,111.9 35.3,113.3 36.1,114.7 C36.5,115.4 36.9,116.8 37.8,117.1 C43.3,119 49.4,119.2 55.2,118.6 C56.5,118.5 57.8,118.3 59.1,118 C59.6,117.9 59.9,117.9 60.2,117.5 C61.6,114.7 63.1,112.1 64.9,109.5 C68.3,104.8 72.3,100.6 76.6,96.7 C77.5,95.9 88,87.2 88,87.2 C87.7,86.8 75.8,96.7 74.8,97.6 C70,102 65.6,106.9 62.1,112.4 C61.2,113.8 60.4,115.3 59.7,116.8 C59.6,117.2 56.8,117.4 56.4,117.4 C52.9,117.8 49.4,117.9 45.9,117.6 C44.2,117.4 42.4,117.2 40.7,116.8 C39.8,116.6 38.5,116.5 38,115.7 C36.6,112.8 34.8,110.1 32.7,107.6 C29.9,104.2 26.7,100.7 23.1,98.1 C21.6,97 20.3,95.8 18.8,94.8 C16.9,93.4 15,92 13.3,90.4 C11.4,88.6 9.7,86.5 8.3,84.3 C7.6,83.1 6.9,81.9 6.4,80.6 C6.1,79.7 5.9,78.7 5.6,77.8 C5.5,77.4 5,76.9 5,76.5 C5,76 5,75.4 5,74.9 C5,74.5 5.1,73.9 5,73.5 C5,73.5 5,73.1 5,73.1 C4.3,72.9 3.6,72.7 2.8,72.5 C2.9,72.9 2.9,73.3 3,73.7 C3.5,73.4 4,73.1 4.5,72.9 C4.7,72.8 5.1,72.6 5.1,72.4 C5.1,71.9 5.2,71.4 5.2,70.9 C5.5,67.4 6.1,63.9 6.5,60.4 C6.9,56.9 7.1,53.3 6.7,49.8 C6.3,46.4 5.2,43.2 4.3,39.9 C2.4,33 2.1,25.9 3.6,18.9 C4.3,15.6 5.4,12.3 7,9.3 C7.8,7.8 8.7,6.4 9.7,5.1 C10.2,4.4 10.7,3.8 11.3,3.2 C11.6,2.8 11.7,2.6 12.2,2.7 C15.5,2.9 18.1,5.4 21.3,6 C24.8,6.7 28.6,6.5 32.1,6.5 C39.2,6.4 46.2,6.1 53.3,6.3 C56.9,6.4 60.4,6.5 64,6.6 C67.1,6.6 70.4,6.7 73.5,6.2 C76.3,5.8 78.6,4.1 81.3,3.2 C82,3 83.2,2.4 83.8,3.1 C84.7,4.1 85.5,5.1 86.3,6.2 C90,11.5 91.9,17.8 92.4,24.2 C92.7,27.5 92.7,30.9 92.2,34.2 C91.5,37.4 90.4,40.8 89.5,44.2 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:85b7f55db3c0": {
        "translation.x": { "0": { value: 104 } },
        "translation.y": { "0": { value: 218 } }
      },

      "haiku:3b77725452e3": {
        d: {
          "0": {
            value: "M34.9,25.7 C37.5,25.5 40.1,25.2 42.4,23.9 C44.9,22.5 46.7,20.2 48.4,17.9 C49.9,15.9 51.5,13.8 53,11.8 C55.5,8.6 58,4.5 56.6,0.7 C39,1 21.4,1.3 3.9,1.7 C0.3,5.8 1.1,12.5 4.6,16.8 C8.1,21 13.5,23.2 18.8,24.4 C24.1,25.6 29.5,26 34.9,25.7 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:f25ae631a786": {
        d: {
          "0": {
            value: "M48,17.2 C46.2,19.6 44.4,22.1 41.7,23.5 C40.4,24.2 39.1,24.6 37.7,24.8 C37.1,24.9 35,24.9 35,25.7 C35.1,27 41.2,25.3 42,25 C45,23.7 47.1,21.2 49,18.7 C50.9,16.2 52.9,13.7 54.7,11.1 C56.6,8.4 58.5,5.1 57.8,1.7 C57.8,1.3 57.6,6.52256027e-16 57,0.1 C56.4,0.1 55.7,0.1 55.1,0.1 C51.9,0.2 48.8,0.2 45.6,0.3 C31.9,0.6 18.2,0.9 4.5,1.2 C4.3,1.2 3.6,1.1 3.5,1.3 C3.3,1.5 3.1,1.8 2.9,2 C2.5,2.5 2.1,3.1 1.8,3.7 C0.4,6.6 0.5,10.1 1.6,13.1 C3.8,19.3 9.9,22.6 15.8,24.3 C19.3,25.3 22.9,25.8 26.5,26.1 C27.1,26.1 34.8,26.3 34.8,25.9 C34.8,25.8 28.7,25.7 28.1,25.6 C25,25.4 22,24.9 19,24.2 C12.9,22.8 6.1,20 3.3,14 C2,11.1 1.6,7.7 2.8,4.7 C3.1,4.1 3.4,3.5 3.8,2.9 C4.4,2.2 5.8,2.5 6.6,2.5 C13.6,2.4 20.5,2.3 27.5,2.2 C36.1,2.1 44.7,1.9 53.3,1.8 C53.4,1.8 55.9,1.6 56,1.8 C56.5,3.5 55.9,5.4 55.2,7 C53.5,10.6 50.5,13.9 48,17.2 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:a0bd9779fef5": {
        d: {
          "0": {
            value: "M152.8,219.1 C152.3,216.9 150.5,215 148.5,213.9 C146.5,212.8 144.2,212.2 142,211.8 C137.9,211 133.6,210.5 129.4,211.3 C125.2,212.1 121.2,214.2 118.8,217.6 C116.4,221.1 116,226 118.4,229.5 C120.5,232.6 124.4,234 128.1,234.5 C134.9,235.4 142,233.5 147.5,229.5 C150.9,227 153.8,223.1 152.8,219.1 Z"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:ba14d1c06932": {
        "translation.x": { "0": { value: 103 } },
        "translation.y": { "0": { value: 215 } }
      },

      "haiku:8137c52fc2e0": {
        d: {
          "0": {
            value: "M61.1,10.9 C61.4,7.7 60.3,4.6 59.3,1.6 C57.2,1.9 55,2.2 52.9,2.5 C56,10.4 52.4,20.3 45,24.4 C38.4,28 30.4,27.1 23,25.7 C20.1,25.2 17.1,24.6 14.4,23.2 C11.7,21.8 9.4,19.5 8.6,16.7 C7.5,12.7 9.5,8.6 11.4,4.9 C9.1,4.5 6.6,4.6 4.3,5.2 C0.6,9.7 0.8,16.6 3.9,21.5 C7,26.4 12.4,29.5 18.1,30.8 C23.8,32.1 29.7,31.7 35.4,31.1 C39.6,30.6 43.9,30 47.7,28 C51.4,26 54.4,22.9 56.9,19.6 C58.9,17.1 60.7,14.2 61.1,10.9 Z"
          }
        },

        fill: { "0": { value: "#84BF41" } }
      },

      "haiku:af98e941ecc6": {
        d: {
          "0": {
            value: "M54.7,9.1 C54.7,8.6 54.1,3 53.9,3.2 C55,3 56.1,2.9 57.2,2.7 C57.5,2.7 58.7,2.3 58.8,2.6 C59,3.2 59.2,3.7 59.4,4.3 C59.9,5.6 60.3,7 60.5,8.4 C60.6,9 60.4,10.8 61.1,10.9 C62.4,11 61.2,5.3 61,4.6 C60.8,3.8 60.6,3.1 60.3,2.3 C60.2,2 60,0.9 59.8,0.8 C59.8,0.6 56.6,1.1 56.3,1.2 C55.5,1.3 54.7,1.4 53.8,1.5 C53.4,1.5 52.2,1.5 51.9,1.7 C51.6,1.8 52.3,3.5 52.4,3.9 C53.2,6.5 53.2,9.5 52.7,12.1 C51.5,17.9 47.4,22.8 41.7,24.8 C35.2,27.1 27.9,25.9 21.4,24.6 C15.7,23.5 8.5,20.6 9,13.5 C9.2,10.8 10.5,8.2 11.7,5.8 C11.8,5.6 12.5,4.5 12.4,4.3 C12.4,4.1 10.7,4 10.5,4 C9.1,3.9 7.8,3.9 6.4,4 C5.7,4.1 4.1,4.1 3.7,4.7 C2,7 1,9.5 0.8,12.4 C0.5,18.6 3.8,24.1 8.8,27.5 C14.3,31.2 21,32.3 27.5,32.2 C30.9,32.1 34.3,31.8 37.7,31.3 C40.9,30.9 44.2,30.2 47.2,28.8 C52.5,26.2 57.1,21 59.8,15.8 C60,15.4 61.7,10.9 61.2,10.8 C61.5,10.9 59.3,15.8 59,16.3 C57.4,18.9 55.4,21.3 53.3,23.4 C51.1,25.6 48.5,27.4 45.5,28.5 C42.5,29.6 39.2,30.1 36.1,30.4 C29.3,31.1 22.3,31.5 15.7,29.3 C9.7,27.3 4.1,22.9 2.7,16.4 C2,13.3 2.3,9.9 3.9,7.2 C4.1,6.8 4.5,6.1 4.9,5.8 C5.2,5.5 6.2,5.5 6.6,5.5 C7.2,5.4 10.2,5 10.2,5.6 C8.7,8.4 7.4,11.5 7.6,14.8 C7.7,17.8 9.5,20.5 11.8,22.4 C14.3,24.4 17.4,25.3 20.5,26 C23.9,26.7 27.4,27.3 30.9,27.6 C37.5,28.1 44.5,27 49.4,22.1 C52.6,18.7 54.7,13.9 54.7,9.1 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:b3a4ba7ecfc0": {
        "translation.x": { "0": { value: 47 } },
        "translation.y": { "0": { value: 146 } }
      },

      "haiku:5eaa92fbfb1a": {
        d: {
          "0": {
            value: "M9.4,3 C8.1,2.2 6.7,1.4 5.2,1.3 C3.7,1.2 2,1.9 1.4,3.3 C0.6,5.2 1.9,7.2 2.6,9.1 C4.8,14.8 2.2,21.9 5.8,26.7 C7.6,29.2 10.9,30.7 11.6,33.7 C11.8,34.5 11.8,35.4 12.3,36.1 C12.6,36.5 13.1,36.7 13.6,36.9 C16.5,37.7 19.3,35.5 21.2,33.1 C22.9,30.8 24.3,28 23.9,25.2 C23.7,24 23.3,22.8 22.8,21.7 C21.1,17.6 19.3,13.4 16.6,9.8 C14.7,7.2 12.2,4.8 9.4,3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:14959c1372cb": {
        d: {
          "0": {
            value: "M2,5 C1.8,3.9 2.5,2.8 3.5,2.3 C5,1.6 6.6,2.1 8,2.7 C8.2,2.8 9.2,3.3 9.3,3.2 C9.5,3.1 9.7,2.7 9.5,2.5 C8.6,1.5 7.2,0.9 5.9,0.6 C3.1,2.79221091e-14 -0.2,2 0.4,5.2 C0.6,6.7 1.3,7.9 1.8,9.3 C2.4,10.9 2.6,12.6 2.7,14.3 C2.9,17.7 2.6,21.3 3.8,24.6 C5,27.8 7.7,29.3 9.7,31.8 C10.7,33 10.7,34.3 11.2,35.7 C11.7,37.2 13.3,37.8 14.8,37.8 C18,37.8 20.6,35.1 22.3,32.6 C24,30 25.1,26.9 24.2,23.8 C23.3,20.7 21.7,17.6 20.2,14.8 C18.8,12.1 17.1,9.5 15,7.3 C14.7,7 9.6,2.3 9.3,2.9 C9.3,2.8 14.2,7.5 14.5,7.9 C16.5,10.2 18.1,12.9 19.4,15.7 C20.1,17.1 20.7,18.6 21.3,20 C22,21.6 22.8,23.2 23.1,24.9 C23.7,28.1 21.8,31.4 19.7,33.6 C18.7,34.7 17.4,35.7 15.9,36.1 C14.7,36.4 12.9,36.4 12.5,34.9 C12.1,33.4 11.9,32.1 10.9,30.8 C9.8,29.4 8.4,28.4 7.3,27.2 C4.9,24.8 4.5,21.5 4.5,18.3 C4.4,14.9 4.5,11.4 3.2,8.2 C2.8,7.2 2.2,6.2 2,5 C2,5 2.2,6.2 2,5 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:ccf2c80e5740": {
        d: {
          "0": {
            value: "M67.1,168.2 C64.1,162.4 59.1,157.5 53.2,154.7 C53.3,159.3 53.5,163.9 54.7,168.3 C55.9,172.7 58.3,176.9 61.9,179.6 C63.2,180.6 64.8,181.3 66.3,180.8 C68.5,180 68.8,177.1 68.5,174.9 C68.2,171.2 68.8,171.5 67.1,168.2 Z"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:83d0a4211f9b": {
        "translation.x": { "0": { value: 191 } },
        "translation.y": { "0": { value: 146 } }
      },

      "haiku:44e10cb5592a": {
        d: {
          "0": {
            value: "M16.3,3 C17.6,2.2 19,1.4 20.5,1.3 C22,1.2 23.7,1.9 24.3,3.3 C25.1,5.2 23.8,7.2 23.1,9.1 C20.9,14.8 23.5,21.9 19.9,26.7 C18.1,29.2 14.8,30.7 14.1,33.7 C13.9,34.5 13.9,35.4 13.4,36.1 C13.1,36.5 12.6,36.7 12.1,36.9 C9.2,37.7 6.4,35.5 4.5,33.1 C2.8,30.8 1.4,28 1.8,25.2 C2,24 2.4,22.8 2.9,21.7 C4.6,17.6 6.4,13.4 9.1,9.8 C11,7.2 13.5,4.8 16.3,3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:1eec326f17b1": {
        d: {
          "0": {
            value: "M25.4,5.2 C26,2 22.7,0 19.9,0.6 C18.7,0.8 17.5,1.5 16.5,2.3 C16.1,2.7 16.2,2.7 16.4,3.1 C16.6,3.4 17.5,2.8 17.7,2.7 C19,2.2 20.4,1.7 21.8,2.2 C23,2.6 23.9,3.7 23.6,5 C23.4,6.6 22.5,8 22,9.4 C21.5,11.1 21.3,12.8 21.2,14.6 C21,17.9 21.4,21.6 20,24.7 C18.7,27.6 15.6,29.1 14,31.8 C13.6,32.5 13.3,33.2 13.2,34 C13.1,34.5 13.1,35.2 12.7,35.7 C11.8,36.8 9.6,36.3 8.5,35.8 C5.7,34.4 3.4,31.3 2.6,28.3 C1.8,25.5 2.9,23 4,20.4 C5,17.9 6.1,15.5 7.4,13.1 C8.6,10.8 10.2,8.7 11.9,6.9 C12.2,6.6 16.2,3 16.2,3 C15.9,2.5 10.8,7.1 10.5,7.4 C8.4,9.6 6.7,12.2 5.3,14.9 C3.8,17.7 2.2,20.8 1.3,23.9 C0.4,27.1 1.6,30.3 3.4,33 C5.1,35.5 7.8,38 11.1,37.8 C12.5,37.7 13.8,37.1 14.3,35.7 C14.5,35 14.5,34.3 14.8,33.6 C15,32.8 15.5,32.1 16.1,31.5 C18.3,29.1 20.9,27.4 21.9,24.2 C23,20.9 22.6,17.3 22.9,13.8 C23,12.2 23.3,10.7 23.8,9.2 C24.4,8 25.1,6.7 25.4,5.2 C25.4,5.2 25.1,6.9 25.4,5.2 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:102ff5274090": {
        d: {
          "0": {
            value: "M194.5,174.5 C193.6,170.7 194.7,166.7 196.8,163.4 C198.9,160.1 201.8,157.5 204.9,155.1 C207,153.4 209.6,151.8 212.2,152.6 C211.7,160.3 209.4,167.9 205.3,174.5 C203.7,177 201.2,179.7 198.3,179 C196.3,178.5 195,176.5 194.5,174.5 Z"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:36c0fb617a70": {
        "translation.x": { "0": { value: 56 } },
        "translation.y": { "0": { value: 69 } }
      },

      "haiku:b7ed3c285305": {
        d: {
          "0": {
            value: "M146.5,38.9 C142,30.6 134.5,23.9 126.8,18.4 C121.4,14.5 115.6,10.8 109.6,7.7 C105.1,5.4 91.4,1.6 77.1,1.6 C62.4,1.6 47.1,5.4 42.6,7.7 C36.6,10.8 30.8,14.5 25.4,18.4 C17.7,23.9 10.2,30.6 5.7,38.9 C-2.3,53.7 1.3,70.7 7.1,85.6 C11.2,96 10.8,104.7 9.9,115.4 C9,126.1 10.5,136.7 20.1,143.2 C32.2,151.3 44.7,152.9 58.9,153.6 C58.9,154 70.3,154.7 76,154.5 C81.5,154.7 93.1,154 93.1,153.6 C107.3,152.9 119.8,151.3 131.9,143.2 C141.6,136.7 143,126.1 142.1,115.4 C141.2,104.7 140.9,96 144.9,85.6 C150.9,70.7 154.4,53.7 146.5,38.9 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:c9871a1592a3": {
        d: {
          "0": {
            value: "M98.4,4.9 C101.3,5.6 104.1,6.3 106.8,7.4 C110,8.6 113.1,10.5 116,12.3 C121.7,15.7 127.2,19.5 132.4,23.7 C136.8,27.4 140.9,31.5 144.2,36.2 C144.8,37 145.3,37.9 145.9,38.7 C146.2,39.1 146.8,39 146.5,38.4 C145.4,36 143.9,33.8 142.3,31.8 C138.5,26.9 133.8,22.7 128.8,18.9 C123.2,14.7 117.4,10.9 111.2,7.6 C105.7,4.6 99.3,3.2 93.1,2.1 C86,0.9 78.8,0.4 71.6,0.8 C64.5,1.2 57.5,2.2 50.6,4 C47.2,4.9 43.9,5.8 40.9,7.5 C37.7,9.2 34.6,11 31.6,13 C20.7,20 9.2,28.6 3.7,40.9 C-2.2,54.1 0.2,68.8 4.8,82 C5.9,85.3 7.3,88.4 8.2,91.8 C9.1,95.3 9.5,98.8 9.6,102.4 C9.8,109.5 8.4,116.7 9,123.8 C9.4,128.9 10.8,134.1 13.9,138.3 C17,142.5 21.6,145.3 26.3,147.6 C36.5,152.5 47.7,153.7 58.9,154.3 C58.7,154.1 58.5,153.9 58.2,153.7 C58.3,154.5 59.4,154.5 59.9,154.5 C61.4,154.7 63,154.8 64.5,154.9 C68.2,155.1 71.8,155.3 75.5,155.1 C79.2,155 82.8,155.1 86.5,154.9 C88.3,154.8 90,154.7 91.8,154.5 C92.4,154.4 93.6,154.5 93.7,153.7 C93.5,153.9 93.3,154.1 93.1,154.3 C106.9,153.6 121.2,151.7 132.8,143.3 C138.1,139.5 141.2,133.8 142.3,127.5 C143.5,120.6 142.3,113.7 142,106.8 C141.8,100.7 142.4,94.5 144.3,88.7 C146.2,82.8 148.5,77.2 149.8,71.1 C151,65.3 151.6,59.2 150.9,53.3 C150.6,50.7 150,48.2 149.3,45.7 C149.1,45.2 146.6,38.8 146.3,39 C146.5,38.9 149,45.9 149.2,46.5 C150,49.3 150.4,52.2 150.6,55.1 C151,61.8 149.9,68.6 148.1,75 C146.2,81.6 143.1,87.8 141.9,94.6 C140.6,101.7 141.1,108.8 141.6,115.9 C142,121.7 141.8,127.8 139.4,133.3 C137,138.8 132.5,142.4 127.3,145.2 C121.8,148.2 115.8,150.1 109.7,151.2 C106.7,151.8 103.7,152.1 100.6,152.4 C99,152.5 97.5,152.6 95.9,152.7 C95,152.8 94.2,152.8 93.3,152.8 C92.7,152.8 92.9,152.9 92.9,153.5 C92.8,153.5 92.6,153.1 92.6,153 C86.9,153.8 81.1,153.6 75.3,153.8 C72.3,153.9 69.2,153.8 66.2,153.6 C63.9,153.5 61.3,153.5 59,153 C59,153.1 58.8,153.6 58.7,153.6 C58.7,153.1 58.9,152.9 58.3,152.9 C57.5,152.9 56.7,152.8 55.9,152.8 C54.1,152.7 52.4,152.6 50.6,152.4 C47.2,152.1 43.8,151.6 40.4,150.9 C33.8,149.5 27.4,147.2 21.7,143.5 C16.1,139.9 12.4,134.9 11,128.4 C9.5,121.3 10.8,114.3 11,107.2 C11.2,100 10.4,93.1 7.9,86.3 C5.5,79.8 3.2,73.3 2.2,66.4 C1.2,59.6 1.4,52.7 3.4,46.1 C5.3,39.8 9,34.2 13.6,29.5 C18.2,24.6 23.7,20.5 29.2,16.7 C34.8,12.9 40.8,8.8 47.4,6.8 C61.1,2.7 75.9,1.5 90,3.6 C93,3.7 95.7,4.3 98.4,4.9 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:bb55d4eeaffb": {
        d: {
          "0": {
            value: "M156.5,191.8 C155.7,188.5 154.7,185 152.6,182.4 C149.7,178.7 145.1,177.2 140.7,176.3 C137.6,175.7 134.5,175.3 131.4,175.6 C128.3,175.3 125.2,175.6 122.1,176.3 C117.7,177.2 113.1,178.7 110.2,182.4 C108.1,185 107.1,188.5 106.3,191.8 C105.7,194.3 105.1,196.9 105.5,199.4 C106.3,203.6 111.2,207.8 115.1,207.5 C118.8,207.2 120.7,207.3 123.6,204.8 C125.9,202.8 128.5,200.9 131.4,200.5 C134.2,200.9 136.9,202.8 139.2,204.8 C142,207.3 146.1,207.2 149.7,207.5 C153.7,207.8 156.6,203.6 157.3,199.4 C157.7,196.9 157.2,194.3 156.5,191.8 Z"
          }
        },

        fill: { "0": { value: "#D78280" } }
      },

      "haiku:3abfbd039d16": {
        d: {
          "0": {
            value: "M154.6,193.7 C153.8,190.8 152.9,187.8 150.9,185.5 C149,183.3 146.3,181.9 143.6,181.1 C140.5,180.2 137.3,179.6 134.1,179.5 C132.4,179.5 130.8,179.5 129.1,179.5 C127.3,179.5 125.5,179.7 123.7,180 C117.8,181 111.9,183 109.3,188.9 C108.1,191.7 107,195.2 106.9,198.3 C106.8,201.2 108.1,203.8 110.6,205.3 C115.2,208.2 119.8,205.1 123.4,202.1 C125.4,200.5 127.6,198.8 130.1,198.1 C132.6,197.5 135.3,199.3 137.2,200.7 C140.9,203.4 144.9,207.8 150,206.1 C152.1,205.4 153.9,203.8 154.8,201.8 C156,199.2 155.4,196.3 154.6,193.7 C153.9,190.8 155.2,195.9 154.6,193.7 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:255de83ef83e": {
        fill: { "0": { value: "#893C30" } },
        "translation.x": { "0": { value: 85 } },
        "translation.y": { "0": { value: 142 } }
      },

      "haiku:45c41541fb4f": {
        d: {
          "0": {
            value: "M22,17.2 C22,17.2 21.6,17 20.9,16.8 C18.1,15.9 10.3,14 5.2,19 C4.2,20 2.6,20.1 1.4,19.3 L1.4,19.3 C-0.5,18 -0.3,15.2 1.7,14.1 C6.6,11.3 15.4,8.5 22,17.2 Z"
          }
        }
      },

      "haiku:457074ee24b9": {
        d: {
          "0": {
            value: "M20.2,18.2 C21.6,17.9 23.1,17.5 24.5,17.9 C19.1,15.8 12.6,16.9 8.2,20.5 C7.4,21.2 6.5,22.3 7,23.3 C10.8,20.5 15.6,19.3 20.2,18.2 Z"
          }
        }
      },

      "haiku:ea5a3ad603a9": {
        d: {
          "0": {
            value: "M21.6,11.8 C18,7.1 12.5,3.9 6.6,3.1 C7.6,2.3 8.4,1.4 9,0.4 C15.3,2.5 19.3,5.6 21.6,11.8 Z"
          }
        }
      },

      "haiku:301a1ad5ccd8": {
        fill: { "0": { value: "#893C30" } },
        "translation.x": { "0": { value: 151 } },
        "translation.y": { "0": { value: 142 } }
      },

      "haiku:5870301e8dd2": {
        d: {
          "0": {
            value: "M2.7,17.2 C2.7,17.2 3.1,17 3.8,16.8 C6.6,15.9 14.4,14 19.5,19 C20.5,20 22.1,20.1 23.3,19.3 L23.3,19.3 C25.2,18 25,15.2 23,14.1 C18.1,11.3 9.4,8.5 2.7,17.2 Z"
          }
        }
      },

      "haiku:e5863111b08d": {
        d: {
          "0": {
            value: "M4.6,18.2 C3.2,17.9 1.7,17.5 0.3,17.9 C5.7,15.8 12.2,16.9 16.6,20.5 C17.4,21.2 18.3,22.3 17.8,23.3 C14,20.5 9.2,19.3 4.6,18.2 Z"
          }
        }
      },

      "haiku:bd867db762e4": {
        d: {
          "0": {
            value: "M3.2,11.8 C6.8,7.1 12.3,3.9 18.2,3.1 C17.2,2.3 16.4,1.4 15.8,0.4 C9.5,2.5 5.5,5.6 3.2,11.8 Z"
          }
        }
      },

      "haiku:d5917f54d705": {
        d: {
          "0": {
            value: "M148.9,193.6 C149.6,196 148.7,198.9 146.6,200.4 C144.5,201.9 141.5,202 139.4,200.5 C138.7,200 138.1,199.4 137.4,198.9 C135.1,197 131.7,196.3 128.9,197.4 C126.9,198.2 125.3,199.7 123.6,201 C121.9,202.3 120,203.6 117.8,203.5 C114.6,203.4 112.1,200.2 112.1,197 C112,193.8 113.9,190.9 116.4,188.8 C118.3,187.3 120.7,186.1 123.1,186.4 C125.5,186.7 127.8,188.6 127.9,191.1 C127.9,191.7 127.8,192.3 128,192.8 C128.3,193.5 129.1,194 129.8,194.1 C130.5,194.2 131.4,194 132.1,193.8 C132.7,193.6 133.3,193.4 133.6,192.9 C134.2,191.8 132.7,190.8 132.2,189.6 C131.6,188 133.1,186.3 134.8,185.7 C136.9,184.9 139.4,185.1 141.4,186 C143.5,186.9 145.3,188.4 146.8,190.1 C147.8,191.2 148.6,192.3 148.9,193.6 Z"
          }
        },

        fill: { "0": { value: "#893C30" } }
      },

      "haiku:b3d5e75e49ba": {
        fill: { "0": { value: "url(#radialGradient-1-5effb5)" } },
        cx: { "0": { value: "89.4" } },
        cy: { "0": { value: "180.7" } },
        r: { "0": { value: "12.2" } }
      },

      "haiku:d99a3e7d0377": {
        fill: { "0": { value: "url(#radialGradient-2-5effb5)" } },
        cx: { "0": { value: "170.6" } },
        cy: { "0": { value: "180.7" } },
        r: { "0": { value: "12.2" } }
      },

      "haiku:439ed041f54a": {
        d: {
          "0": {
            value: "M79.6,137 C82.4,133.8 85.7,131.2 89.4,129.2 C92.8,127.3 96.7,126 100.6,125.9 C102.1,125.8 103.6,125.9 105.1,125.5 C105.4,125.4 105.6,125.3 105.8,125.1 C106,124.9 106,124.5 106.1,124.2 C106.2,123.3 106.1,122.3 105.5,121.6 C104.7,120.6 103.3,120.4 102.1,120.4 C95.3,120.5 89.1,124.3 84.1,128.9 C82.5,130.4 81,132 80,133.9 C79.3,134.8 79,136 79.6,137 Z"
          }
        },

        fill: { "0": { value: "#B77153" } }
      },

      "haiku:1fbbd60057b3": {
        d: {
          "0": {
            value: "M180.2,137 C177.4,133.8 174.1,131.2 170.4,129.2 C167,127.3 163.1,126 159.2,125.9 C157.7,125.8 156.2,125.9 154.7,125.5 C154.4,125.4 154.2,125.3 154,125.1 C153.8,124.9 153.8,124.5 153.7,124.2 C153.6,123.3 153.7,122.3 154.3,121.6 C155.1,120.6 156.5,120.4 157.7,120.4 C164.5,120.5 170.7,124.3 175.7,128.9 C177.3,130.4 178.8,132 179.8,133.9 C180.4,134.8 180.8,136 180.2,137 Z"
          }
        },

        fill: { "0": { value: "#B77153" } }
      },

      "haiku:e3e42dec1ba7": {
        "translation.x": { "0": { value: 119 } },
        "translation.y": { "0": { value: 179 } }
      },

      "haiku:613eb1f45f64": {
        d: {
          "0": {
            value: "M21.5,1.7 C19.4,3.7 16.1,4 13.2,4.1 C11.4,4.2 9.6,4.2 7.8,4.3 C6.6,4.3 5.3,4.4 4.2,4.1 C3,3.8 1.9,3 1.4,1.9 C2.9,1.1 4.7,0.8 6.4,0.7 C11.4,0.2 16.4,0.4 21.4,1.1 C21.2,1.3 21.3,1.6 21.5,1.7 Z"
          }
        },

        fill: { "0": { value: "#FFFFFF" } }
      },

      "haiku:336a2b55866d": {
        d: {
          "0": {
            value: "M6.4,4.8 C5.4,4.8 4.7,4.7 4,4.5 C2.6,4.1 1.4,3.2 1,2.1 L0.9,1.8 L1.2,1.6 C2.8,0.7 4.7,0.5 6.3,0.3 C11.3,-0.2 16.4,-1.11022302e-16 21.4,0.7 L21.8,0.8 L21.7,1.2 C21.7,1.3 21.7,1.4 21.8,1.5 L22.1,1.8 L21.8,2.1 C19.6,4.2 16.5,4.5 13.2,4.6 L7.8,4.8 C7.3,4.7 6.9,4.8 6.4,4.8 Z M1.9,2.1 C2.4,2.9 3.2,3.4 4.3,3.7 C4.9,3.9 5.6,3.9 6.5,3.9 C6.9,3.9 7.4,3.9 7.8,3.9 L13.2,3.7 C16.2,3.6 19.1,3.3 21,1.6 C21,1.5 20.9,1.4 20.9,1.4 C16.1,0.7 11.2,0.6 6.4,1.1 C4.9,1.2 3.3,1.4 1.9,2.1 Z"
          }
        },

        fill: { "0": { value: "#857C89" } }
      },

      "haiku:39337fc1b696": {
        d: {
          "0": {
            value: "M122.4,213.8 C125.2,214.4 128.1,214.8 130.8,213.9 C133.5,213 135.7,210.2 135.1,207.5 C132.3,206.9 129.3,206.3 126.6,207.2 C123.8,208.1 121.5,211 122.4,213.8 Z"
          }
        },

        fill: { "0": { value: "#E8A3A3" } }
      },

      "haiku:8da911eb7bad": {
        d: {
          "0": {
            value: "M135.3,208.3 C136.3,209 137,210.1 137.4,211.3 C136.8,210.3 135.6,209.9 134.5,209.6 C132.9,209.1 131.4,208.7 129.8,208.7 C128.1,208.7 126.5,209.3 124.9,209.8 C124.5,209.9 124.1,210.1 123.7,210.3 C123.5,210.2 123.6,210 123.8,209.8 C124.8,208.7 126.1,207.7 127.5,207 C129.2,206.1 131.2,205.7 132.9,206.5 C133.3,206.7 133.7,207 134.1,207.3 C134.4,207.8 134.9,208 135.3,208.3 Z"
          }
        },

        fill: { "0": { value: "#B77153" } }
      },

      "haiku:c87c2b19025f": {
        d: {
          "0": {
            value: "M208.4,105.9 C212,108.5 214.5,112.7 215.1,117.1 C216.5,110.1 213.1,102.9 208.4,97.4 C196.3,83.2 177.2,77.5 159.2,72.5 C155,71.3 150.8,70.2 146.5,69.8 C143.5,69.6 140.4,69.7 137.5,69.1 C134.6,68.5 131.8,67.2 128.9,67.1 C124.6,67 120.7,69.5 116.6,70.7 C114.5,71.3 112.3,71.6 110.2,71.9 C86.1,76 64.5,93.1 55.2,115.8 C65,104.5 77.3,95.4 91,89.3 C81.7,95.7 72.3,102.2 65.1,110.9 C86.5,98.5 108.7,85.8 133.3,82.6 C122.9,89.3 112.6,96 102.2,102.7 C115.3,97.1 127.8,89.7 139,80.9 C140.5,79.7 142.7,78.4 144.3,79.5 C143.9,88.6 143.5,97.7 143.1,106.9 C148.9,99.6 152.4,90.4 152.9,81 C153.5,82.6 153.7,84.4 153.4,86.1 C154.2,85.2 154.9,84.2 155.3,83 C164.6,89.3 173.7,95.9 182.7,102.7 C179.7,96.3 176.3,90 172.7,84 C180.5,92.5 188.3,101 194.3,110.8 C200.3,120.6 204.5,131.8 204.2,143.3 C210.7,132 212.3,118.1 208.4,105.9 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:ce354ced2916": {
        d: {
          "0": {
            value: "M212.2,140 C208.7,147 205.2,154.1 201.6,161.1 C202.4,155.8 203.3,150.5 203,145.1 C202.6,137.2 199.9,129.6 197.3,122.1 C195.1,115.9 192.9,109.8 190.7,103.6 C195.6,103.1 200.5,102.7 205.4,102.2 C206.1,102.1 207,102.1 207.6,102.5 C208.3,102.9 208.5,103.8 208.7,104.6 C210.4,111.2 212.2,117.7 213.9,124.3 C214.6,126.8 215.2,129.4 215,132 C214.8,134.8 213.5,137.4 212.2,140 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:eff7b1b1362d": {
        d: {
          "0": {
            value: "M88.7,94.5 C75.7,105.3 69.1,121.8 63,137.5 C64.9,130.3 66.8,123.1 68.7,115.9 C61.7,127.9 59.4,142.7 62.5,156.3 C58.6,147.5 54.6,138.6 50.7,129.8 C50.3,128.9 49.9,128 49.8,127 C49.7,125.8 50.2,124.6 50.7,123.5 C54.5,114.6 58.5,105.4 65.8,99.1 C71.4,94.2 78.6,91.5 85.6,88.8 C82.6,93.7 80,98.8 77.8,104.1"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:ad5f83ba5dad": {
        d: {
          "0": {
            value: "M63.4,176.9 C64.3,177.4 66,178.2 67,177.7 C67.2,177.6 67.3,177.1 67.2,177 C67,176.6 66.1,176.4 65.7,176.2 C62.9,174.9 60.1,172.3 61.5,168.9 C62,167.6 63.6,166.9 63.7,165.4 C63.7,163.9 62.1,162.4 61.1,161.4 C59.9,160.1 58.6,159 57.2,158 C56.9,157.8 54.1,156 53.9,156.4 C53.8,156.6 57.7,159.6 58.1,160 C59,160.9 59.9,161.8 60.6,162.8 C61,163.4 62.5,164.8 62.1,165.6 C61.7,166.5 60.6,167.1 60.1,168 C59.6,169 59.4,170.2 59.5,171.4 C59.8,173.8 61.3,175.7 63.4,176.9 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:e7b0800c6a11": {
        d: {
          "0": {
            value: "M200.2,174.1 C199.5,174.8 198.5,175.3 197.9,176.1 C197.8,176.3 197.9,176.7 198,176.8 C198.1,177.2 199.2,176.7 199.4,176.7 C201.9,175.7 203.8,172.7 204.4,170.2 C204.7,168.9 204.6,167.4 204,166.2 C203.7,165.6 203.3,165 202.8,164.6 C202.2,164.1 202.5,164 202.9,163.3 C204.2,160.6 205.9,158.1 207.7,155.8 C208.1,155.2 208.9,154.5 209.1,153.8 C209.2,153.6 208.1,154.4 208,154.5 C205.9,156.4 204.1,158.7 202.6,161.1 C202.1,161.9 201.6,162.8 201.2,163.7 C201,164.1 200.4,164.9 200.9,165.1 C201.5,165.4 202,165.7 202.3,166.3 C204,168.9 202.1,172.2 200.2,174.1 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:f17ae55005f1": {
        d: {
          "0": {
            value: "M146.7,327.5 C149.7,312.3 167.3,304.3 173.3,290.1 C176,283.7 176.1,276.6 176.2,269.7 C176.3,260 176.4,250.4 176.6,240.7 C173.3,251.4 166.4,260.9 157.3,267.4 C159.9,276.7 156,287.1 148.6,293.3 C141.2,299.5 130.9,301.6 121.4,300.1 C111.9,298.6 103.2,293.6 96,287.1 C104.3,296.9 112.7,306.6 121,316.4 C124.3,320.3 127.7,324.2 132.1,326.7 C136.6,329.3 142.4,330.1 146.7,327.5 Z"
          }
        },

        fill: { "0": { value: "#BDC132" } }
      },

      "haiku:26a792b64727": {
        "translation.x": { "0": { value: 115 } },
        "translation.y": { "0": { value: 147 } }
      },

      "haiku:b2a5a349f754": {
        d: {
          "0": {
            value: "M6.9,13.9 C7.6,13.5 8.3,13.1 9.1,13 C10.6,12.8 12.1,13.8 13.6,13.8 C14.6,13.8 15.6,13.4 16.6,13.4 C18.7,13.3 20.6,14.7 21.7,16.5 C22.8,18.3 23.2,20.4 23.6,22.4 C23.7,23.1 23.8,23.8 23.4,24.3 C23.1,24.6 22.7,24.8 22.3,24.9 C19.9,25.3 17.6,23.6 15.2,23.9 C14.5,24 13.8,24.3 13.1,24.5 C10.7,25.3 8.2,25.6 5.7,25.4 C5.1,25.4 4.5,25.3 4,25 C2.9,24.4 2.6,22.9 2.7,21.7 C2.8,18.5 4.4,15.6 6.9,13.9 Z"
          }
        },

        fill: { "0": { value: "#E29C7D" } }
      },

      "haiku:80041bfb5ad4": {
        d: {
          "0": {
            value: "M9,18.9 C10.2,16.9 9.7,14.9 8.3,15.5 C8.2,15.6 8,15.6 7.9,15.7 C7,16.2 6.1,17.4 5.7,18.7 C5.3,20 5.7,21 6.5,21 C7.2,21 8.3,20.1 9,18.9 C9,18.9 9,18.9 9,18.9 Z"
          }
        },

        fill: { "0": { value: "#F6CDC2" } }
      },

      "haiku:919b042bc1e2": {
        d: {
          "0": {
            value: "M6.8,23.5 C6.4,23.5 6,23.4 5.8,23.1 C5.4,22.6 5.8,22 6.2,21.5 C6.7,20.8 7.3,20.1 8,19.7 C8.8,19.3 9.8,19.3 10.4,19.9 C11.1,20.7 10.7,22 9.9,22.7 C9,23.4 7.9,23.5 6.8,23.5 Z"
          }
        },

        fill: { "0": { value: "#893C30" } }
      },

      "haiku:1f44feb96c03": {
        d: {
          "0": {
            value: "M19.8,23.5 C20.2,23.5 20.6,23.4 20.8,23.1 C21.2,22.6 20.8,22 20.4,21.5 C19.9,20.8 19.3,20.1 18.6,19.7 C17.8,19.3 16.8,19.3 16.2,19.9 C15.5,20.7 15.9,22 16.7,22.7 C17.6,23.4 18.7,23.5 19.8,23.5 Z"
          }
        },

        fill: { "0": { value: "#893C30" } }
      },

      "haiku:52b6c7c24c79": {
        d: {
          "0": {
            value: "M7.9,4.9 C7.4,3.6 6.5,1.8 5.2,1 C5,0.9 4.5,1.1 4.5,1.3 C4.4,1.8 5.1,2.7 5.3,3.1 C6.3,5.1 7.1,7.1 7.5,9.3 C7.6,9.9 7.6,10.4 7.7,11 C7.7,11.6 7.9,11.4 7.3,11.5 C6.2,11.7 5.1,12.2 4.2,12.9 C1,15.5 -0.7,22 3,24.9 C4.6,26.2 6.8,26.5 8.8,26.2 C9.2,26.1 13.9,25 13.8,24.5 C13.8,24.4 8.8,25.4 8.3,25.4 C6.2,25.4 3.7,24.7 2.7,22.6 C1.8,20.5 2.5,17.9 3.6,16.1 C4.1,15.2 4.8,14.3 5.8,13.8 C7,13.1 8,13.1 9.3,13.2 C9.2,10.3 9,7.6 7.9,4.9 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:c1fe6131ce7d": {
        viewBox: { "0": { value: "0 0 287 305" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 287 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 305 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function($user) {
                return $user.mouse.x - 144;
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
                return $user.mouse.y - 288;
              },
              "$user"
            ),

            edited: true
          }
        },

        "style.zIndex": { "0": { value: 35 } },
        "scale.x": { "0": { value: 0.3, edited: true } },
        "scale.y": { "0": { value: 0.3, edited: true } },
        opacity: {
          "0": {
            value: Haiku.inject(
              function(currentBaby) {
                return currentBaby === "baby5" ? 1 : 0;
              },
              "currentBaby"
            ),

            edited: true
          }
        }
      },

      "haiku:d611379da4c5": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:7c1cbd57f22a": {
        "fill-rule": { "0": { value: "nonzero" } },
        "translation.y": { "0": { value: -1 } }
      },

      "haiku:e325b8d8cde9": {
        "translation.x": { "0": { value: 29 } },
        "translation.y": { "0": { value: 143 } }
      },

      "haiku:d88caffea234": {
        d: {
          "0": {
            value: "M51,11.5 C46.3,13.1 41.2,12.7 36.3,12.8 C25.7,13.1 15.3,15.8 5.9,20.6 C2.6,26 1.2,32.5 1.8,38.8 C14.4,44.9 28.4,47.5 42.4,48.4 C50.2,48.9 58.2,48.9 65.7,46.9 C73.3,45 80.5,41 85.3,34.7 C90.1,28.4 91.9,19.8 89.1,12.5 C86.2,5.2 78.2,-1.1524115e-13 70.5,1.4 C63.2,2.9 57.9,9.2 51,11.5 Z"
          }
        },

        fill: { "0": { value: "#954F9F" } }
      },

      "haiku:a9e035deb4ff": {
        d: {
          "0": {
            value: "M50,49.5 C50,49.5 50,49.5 50,49.5 C47.6,49.5 45.1,49.4 42.2,49.2 C26.1,48.2 12.8,45 1.3,39.5 L0.9,39.3 L0.9,38.9 C0.2,32.4 1.7,25.8 5.1,20.2 L5.2,20 L5.4,19.9 C14.9,15 25.5,12.3 36.2,12 C37.2,12 38.3,12 39.3,12 C43.1,12 47.1,12 50.7,10.8 C53.7,9.8 56.5,8 59.2,6.2 C62.6,4 66.1,1.6 70.2,0.9 C71.1,0.7 72,0.7 72.9,0.7 C79.9,0.7 87,5.7 89.7,12.5 C92.5,19.6 91,28.6 85.8,35.4 C81.3,41.3 74.2,45.7 65.8,47.8 C61.2,48.9 56,49.5 50,49.5 Z M2.5,38.3 C13.7,43.6 26.7,46.6 42.4,47.7 C45.2,47.9 47.7,48 50.1,48 C55.9,48 61,47.4 65.5,46.3 C73.6,44.2 80.4,40 84.7,34.4 C89.5,28.1 91,19.7 88.4,13 C85.9,6.7 79.5,2.2 73.1,2.2 C72.3,2.2 71.5,2.3 70.7,2.4 C66.9,3.1 63.7,5.2 60.2,7.5 C57.4,9.3 54.6,11.2 51.3,12.3 C47.4,13.6 43.3,13.6 39.4,13.6 C38.4,13.6 37.4,13.6 36.3,13.6 C26,13.9 15.6,16.5 6.4,21.2 C3.3,26.3 2,32.4 2.5,38.3 Z"
          }
        },

        fill: { "0": { value: "#622163" } }
      },

      "haiku:f6687c4c9809": {
        "translation.x": { "0": { value: 164 } },
        "translation.y": { "0": { value: 143 } }
      },

      "haiku:cb7c14fb7da3": {
        d: {
          "0": {
            value: "M41,11.5 C45.7,13.1 50.8,12.7 55.7,12.8 C66.3,13.1 76.7,15.8 86.1,20.6 C89.4,26 90.8,32.5 90.2,38.8 C77.6,44.9 63.6,47.5 49.6,48.4 C41.8,48.9 33.8,48.9 26.3,46.9 C18.7,45 11.5,41 6.7,34.7 C2,28.5 0.1,19.8 2.9,12.5 C5.8,5.2 13.8,-1.1524115e-13 21.5,1.4 C28.8,2.9 34.1,9.2 41,11.5 Z"
          }
        },

        fill: { "0": { value: "#954F9F" } }
      },

      "haiku:df6cccd6e657": {
        d: {
          "0": {
            value: "M42,49.5 C36,49.5 30.8,48.9 26.2,47.7 C17.8,45.5 10.6,41.1 6.2,35.3 C1,28.5 -0.5,19.5 2.3,12.4 C5,5.5 12,0.6 19.1,0.6 C20,0.6 20.9,0.7 21.8,0.8 C25.9,1.6 29.4,3.9 32.8,6.1 C35.5,7.9 38.3,9.7 41.3,10.7 C44.9,11.9 48.9,11.9 52.7,11.9 C53.7,11.9 54.8,11.9 55.8,11.9 C66.4,12.2 77.1,14.9 86.6,19.8 L86.8,19.9 L86.9,20.1 C90.3,25.7 91.7,32.3 91.1,38.8 L91.1,39.2 L90.7,39.4 C79.3,44.9 65.9,48.1 49.8,49.1 C46.9,49.4 44.3,49.5 42,49.5 Z M19,2.1 C12.6,2.1 6.2,6.7 3.7,12.9 C1.1,19.5 2.5,27.9 7.4,34.3 C11.6,39.9 18.5,44.1 26.6,46.2 C31.1,47.4 36.2,47.9 42,47.9 C44.3,47.9 46.8,47.8 49.7,47.6 C65.4,46.6 78.4,43.5 89.6,38.2 C90.1,32.3 88.7,26.2 85.7,21.1 C76.5,16.4 66.2,13.8 55.8,13.5 C54.8,13.5 53.8,13.5 52.7,13.5 C48.7,13.5 44.6,13.5 40.8,12.2 C37.6,11.1 34.7,9.2 31.9,7.4 C28.5,5.1 25.2,3 21.4,2.3 C20.6,2.2 19.8,2.1 19,2.1 Z"
          }
        },

        fill: { "0": { value: "#622163" } }
      },

      "haiku:3f40af4906df": {
        d: {
          "0": {
            value: "M39.9,183.6 C57.2,188.8 75.6,190.4 93.5,187.9 C96.3,187.5 99.3,186.9 101.4,184.9 C103.2,183.2 104,180.6 104,178.1 C104,175.6 103.5,173.2 102.9,170.7 C99.4,175.8 93.1,178 87.2,179.9 C85.2,180.5 83.2,181.2 81.2,181.8 C78.8,182.6 76.4,183.3 74,183.9 C60.7,187 46.1,183.5 35.6,174.7 C33.4,175.3 33,178.4 34.2,180.3 C35.5,182.1 37.8,182.9 39.9,183.6 Z"
          }
        },

        fill: { "0": { value: "#81308D" } }
      },

      "haiku:a9b91af6bb4b": {
        d: {
          "0": {
            value: "M189.6,178.6 C187.9,181.4 189.1,185.2 191.6,187.3 C194.1,189.4 197.4,190.1 200.6,190.5 C218.4,192.8 236.2,187.1 253,180.8 C251.2,179.1 250.5,176.4 251.2,174.1 C245.2,180.5 236.1,183.9 227.4,183 C217.2,182 207.9,175.6 197.6,175.3 C194.6,175.3 191.2,176.1 189.6,178.6 Z"
          }
        },

        fill: { "0": { value: "#81308D" } }
      },

      "haiku:db91e0609554": {
        "translation.x": { "0": { value: 73 } },
        "translation.y": { "0": { value: 128 } }
      },

      "haiku:9fdbfa4d3338": {
        d: {
          "0": {
            value: "M147.5,91.8 C144.6,87.4 142.7,81.9 139.8,77.6 C137.8,76.6 135.6,76.5 133.5,76.9 C132.7,75.6 131.9,74.2 131.1,72.9 C124.3,60.3 123.7,46 119.8,32.5 C115.8,19 106.4,5 90.9,2 C84.1,0.7 79.2,1.5 74.1,2.4 C69,1.4 64,0.6 57.3,2 C41.8,5.1 32.4,19.1 28.4,32.5 C24.4,46 23.9,60.3 17.1,72.9 C16.4,74.2 15.6,75.5 14.8,76.7 C13,76.5 11.2,76.7 9.6,77.5 C6.7,81.9 4.8,87.4 1.9,91.7 C2.8,91.9 3.8,92.2 4.7,92.5 C2.2,97.4 0.7,102.4 1.7,107.7 C3.5,116.9 12.4,123.7 21,129.3 C28.7,134.4 36.7,139.3 45.7,142.4 C45.9,143.9 46,145.3 46,146.8 C55.2,150 65.1,151.2 74.8,150.4 C84.5,151.2 94.4,149.9 103.6,146.8 C103.6,145.2 103.7,143.6 103.9,141.9 C112.4,138.8 120,134.1 127.4,129.2 C136,123.6 144.9,116.9 146.7,107.6 C147.7,102.4 146.3,97.5 143.9,92.7 C145,92.5 146.3,92.2 147.5,91.8 Z"
          }
        },

        fill: { "0": { value: "#954F9F" } }
      },

      "haiku:748d41375511": {
        d: {
          "0": {
            value: "M80.4,151.5 C80.4,151.5 80.4,151.5 80.4,151.5 C78.5,151.5 76.6,151.4 74.7,151.3 C72.8,151.4 70.9,151.5 69,151.5 C61,151.5 53.1,150.2 45.6,147.6 L45.1,147.4 L45.1,146.8 C45.1,145.6 45,144.3 44.9,143 C35.7,139.7 27.5,134.6 20.5,130 C11.4,124 2.7,117.2 0.9,107.9 C-1.14575016e-13,103.3 0.9,98.5 3.6,93 C2.9,92.8 2.4,92.6 1.8,92.5 L0.7,92.2 L1.3,91.3 C2.7,89.2 3.9,86.7 5.1,84.3 C6.3,81.9 7.5,79.3 9,77.1 L9.1,76.9 L9.3,76.8 C10.9,76.1 12.6,75.7 14.5,75.8 C15.3,74.6 15.9,73.4 16.5,72.4 C20.9,64.4 22.7,55.4 24.4,46.7 C25.4,41.9 26.4,37 27.8,32.2 C32.8,15.4 43.8,3.8 57.3,1.1 C59.7,0.6 62.1,0.4 64.4,0.4 C67.9,0.4 70.9,0.9 74.3,1.5 C77.6,0.9 80.6,0.4 84.2,0.4 C86.6,0.4 88.9,0.6 91.3,1.1 C104.8,3.8 115.8,15.4 120.8,32.2 C122.2,37 123.2,41.9 124.2,46.7 C125.9,55.4 127.7,64.4 132.1,72.4 C132.7,73.5 133.4,74.6 134.2,75.9 C136.5,75.6 138.6,75.9 140.5,76.8 L140.7,76.9 L140.8,77.1 C142.3,79.3 143.5,81.9 144.7,84.3 C145.9,86.7 147.1,89.2 148.5,91.3 L149.1,92.2 L148,92.5 C147.1,92.7 146.2,93 145.2,93.3 C147.8,98.7 148.6,103.3 147.7,107.9 C145.9,117.2 137.2,124 128.1,130 C121.5,134.4 113.7,139.3 104.9,142.6 C104.7,144 104.7,145.5 104.6,146.9 L104.6,147.5 L104.1,147.7 C96.3,150.2 88.4,151.5 80.4,151.5 Z M74.8,149.7 L74.8,149.7 C76.7,149.9 78.6,149.9 80.5,149.9 C88.1,149.9 95.6,148.7 102.8,146.3 C102.8,144.9 103,143.4 103.1,141.9 L103.2,141.4 L103.7,141.2 C112.5,137.9 120.3,133 127,128.6 C135.8,122.8 144.3,116.2 145.9,107.5 C146.7,103.1 145.9,98.5 143.1,93.1 L142.7,92.3 L143.6,92 C144.6,91.7 145.5,91.4 146.4,91.2 C145.2,89.2 144.1,87 143.1,84.9 C142,82.6 140.8,80.2 139.4,78.1 C137.7,77.4 135.9,77.2 133.7,77.6 L133.2,77.7 L132.9,77.3 C132,75.8 131.2,74.5 130.5,73.3 C126,65.1 124.2,55.9 122.4,47.1 C121.4,42.3 120.5,37.4 119.1,32.7 C114.3,16.5 103.8,5.3 90.9,2.7 C88.6,2.2 86.3,2 84.1,2 C80.7,2 77.7,2.5 74.4,3.1 L74.3,3.1 L74.2,3.1 C70.9,2.5 67.9,2 64.5,2 C62.3,2 60,2.2 57.7,2.7 C44.8,5.2 34.2,16.4 29.5,32.7 C28.1,37.4 27.1,42.3 26.2,47.1 C24.4,55.9 22.6,65 18.1,73.3 C17.5,74.5 16.7,75.8 15.8,77.2 L15.5,77.6 L15,77.6 C13.3,77.4 11.8,77.7 10.4,78.3 C9,80.4 7.9,82.8 6.7,85.1 C5.7,87.2 4.6,89.4 3.4,91.4 C3.9,91.5 4.5,91.7 5.1,91.9 L6,92.2 L5.6,93 C2.7,98.5 1.8,103.2 2.7,107.7 C4.4,116.4 12.8,123 21.6,128.8 C28.6,133.4 36.9,138.6 46.1,141.8 L46.6,142 L46.7,142.5 C46.8,143.8 46.9,145.2 47,146.4 C54.2,148.8 61.7,150 69.3,150 C70.9,150 72.8,149.9 74.8,149.7 L74.8,149.7 Z"
          }
        },

        fill: { "0": { value: "#622163" } }
      },

      "haiku:ff1727ff772b": {
        d: {
          "0": {
            value: "M174.3,138.2 C157.8,133.5 140.1,133 123.4,136.7 C117.8,137.9 112.1,139.7 108,143.6 C108.8,148.7 113.9,152.2 119,153.1 C124.1,154 129.3,153 134.4,152.7 C148,151.9 161.6,155.8 175.1,154.3 C178.8,153.9 183.1,152.5 184.2,149 C185,146.4 183.7,143.5 181.7,141.7 C179.6,139.8 176.9,138.9 174.3,138.2 Z"
          }
        },

        fill: { "0": { value: "#81308D" } }
      },

      "haiku:46ec102ab843": {
        d: {
          "0": {
            value: "M84.5,218.2 C91.2,218.5 97.7,220.9 103.9,223.6 C112.3,227.2 120.7,231.1 127.7,237 C134.7,242.8 140.4,250.8 141.8,259.8 C142.4,263.4 142.2,267.3 140.1,270.4 C137.1,274.8 131.1,276 125.8,275.6 C115.3,274.8 105.5,269.4 97.7,262.3 C89.9,255.2 84,246.3 78.3,237.3 C76.6,234.7 74.9,231.9 74.3,228.9 C73.7,225.8 74.3,222.3 76.7,220.3 C78.9,218.4 81.8,218.1 84.5,218.2 Z"
          }
        },

        fill: { "0": { value: "#81308D" } }
      },

      "haiku:be13225cddea": {
        d: {
          "0": {
            value: "M203.5,222.2 C196,225.7 188.5,229.3 181.8,234.1 C175.1,238.9 169.2,245.2 166,252.7 C163.8,257.8 163.1,264.4 166.8,268.5 C170.9,273 178.1,272.4 183.8,270.5 C201.3,264.7 215.3,249.5 219.5,231.6 C220.2,228.5 220.6,225 218.7,222.5 C217.1,220.3 214,219.4 211.3,219.6 C208.6,219.8 206,221.1 203.5,222.2 Z"
          }
        },

        fill: { "0": { value: "#81308D" } }
      },

      "haiku:4bece814c12b": {
        "translation.x": { "0": { value: 72 } },
        "translation.y": { "0": { value: 21 } }
      },

      "haiku:e87ff18dd4c0": { "translation.y": { "0": { value: 39 } } },
      "haiku:24a762de5c8c": {
        d: {
          "0": {
            value: "M1.7,11.6 C1,16.1 0.6,20.6 1.7,25 C2.7,29.4 5.4,33.6 9.4,35.6 C13.4,37.6 18.9,37 21.7,33.5 C24.9,29.6 24.1,23.9 23.1,19 C22.2,14.3 21.2,9.3 18,5.6 C14.9,1.9 8.8,0.3 5.1,3.4 C3,5.4 2.2,8.6 1.7,11.6 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:d0b6b4ad2ee7": {
        d: {
          "0": {
            value: "M14.4,37.6 C14.4,37.6 14.4,37.6 14.4,37.6 C12.5,37.6 10.7,37.2 9.1,36.3 C5.1,34.3 2.2,30.2 1,25.1 C-0.2,20.2 0.4,15.2 1,11.3 C1.5,8.1 2.3,4.8 4.8,2.7 C6.2,1.5 8,0.8 10.1,0.8 C13.3,0.8 16.7,2.4 18.9,4.9 C22.2,8.8 23.3,14 24.2,18.7 C25.2,23.9 26,29.8 22.6,33.9 C20.5,36.3 17.6,37.6 14.4,37.6 Z M10,2.6 C8.4,2.6 6.9,3.1 5.8,4.1 C3.7,5.9 3,8.8 2.6,11.7 C2,15.4 1.5,20.2 2.6,24.8 C3.7,29.3 6.4,33.1 9.8,34.8 C11.2,35.5 12.8,35.9 14.4,35.9 C14.4,35.9 14.4,35.9 14.4,35.9 C17.2,35.9 19.6,34.8 21.1,33 C24,29.4 23.3,24 22.4,19.2 C21.5,14.8 20.6,9.8 17.5,6.2 C15.6,4 12.7,2.6 10,2.6 Z"
          }
        },

        fill: { "0": { value: "#893C30" } }
      },

      "haiku:4fcb5247e570": {
        d: {
          "0": {
            value: "M4.6,52.3 C3.6,58.3 5.7,64.7 10.2,68.8 C11.9,70.4 14.2,71.7 16.5,71.3 C18.8,70.9 20.5,68.8 21.4,66.7 C22.8,63.4 22.8,59.5 21.5,56.2 C20.2,52.9 17.8,50 14.8,48 C12.8,46.7 10.2,45.8 8,46.8 C5.9,47.8 5,50.1 4.6,52.3 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:64cac8a91255": {
        "translation.x": { "0": { value: 128 } },
        "translation.y": { "0": { value: 40 } }
      },

      "haiku:f9c4f11994e6": {
        d: {
          "0": {
            value: "M23.9,10.6 C24.6,15.1 25,19.6 23.9,24 C22.9,28.4 20.2,32.6 16.2,34.6 C12.2,36.6 6.7,36 3.9,32.5 C0.7,28.6 1.5,22.9 2.5,18 C3.4,13.3 4.4,8.3 7.6,4.6 C10.7,0.9 16.8,-0.7 20.5,2.4 C22.7,4.4 23.5,7.6 23.9,10.6 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:a7c6e6818a6b": {
        d: {
          "0": {
            value: "M11.3,36.6 C8,36.6 5.1,35.3 3.3,33.1 C-0.1,29 0.7,23.1 1.7,17.9 C2.6,13.3 3.6,8 7,4.1 C9.2,1.5 12.6,0 15.8,0 C17.8,0 19.7,0.6 21.1,1.9 C23.6,4 24.4,7.3 24.9,10.5 C25.5,14.4 26.1,19.4 24.9,24.3 C23.7,29.4 20.7,33.5 16.8,35.5 C15,36.2 13.2,36.6 11.3,36.6 Z M15.7,1.6 C13,1.6 10.1,3 8.2,5.2 C5.1,8.8 4.2,13.8 3.3,18.2 C2.4,23 1.6,28.4 4.6,32 C6.1,33.8 8.6,34.9 11.3,34.9 C12.9,34.9 14.5,34.5 15.9,33.8 C19.4,32.1 22.1,28.3 23.1,23.8 C24.2,19.2 23.6,14.4 23.1,10.7 C22.6,7.8 21.9,4.8 19.9,3.1 C18.8,2.1 17.3,1.6 15.7,1.6 Z"
          }
        },

        fill: { "0": { value: "#893C30" } }
      },

      "haiku:b2d78b7e73a2": {
        d: {
          "0": {
            value: "M133.8,61.4 C135,59.1 135.6,56.6 136.4,54.2 C137.3,51.8 138.5,49.4 140.6,47.9 C142.7,46.4 145.8,46.2 147.7,47.9 C149.3,49.3 149.6,51.6 149.7,53.7 C149.9,57.8 149.5,62.1 147.6,65.7 C145.7,69.3 142,72.2 137.9,72.3 C136.6,72.3 135.2,72.1 134.2,71.1 C133.5,70.4 133.1,69.3 132.9,68.3 C132.2,64.6 132.1,64.8 133.8,61.4 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:b3b3b6796693": { "translation.x": { "0": { value: 9 } } },
      "haiku:d16628008769": {
        d: {
          "0": {
            value: "M133.7,82 C132.2,76.5 129.3,71.4 128,65.9 C126.8,60.7 127,55.4 126.6,50.1 C125.1,28.4 112,13.4 91.8,6 C89.9,5.3 73.2,0.8 68.2,1.6 C63.2,0.8 46.5,5.3 44.6,6 C24.4,13.4 11.3,28.4 9.8,50.1 C9.4,55.4 9.6,60.8 8.4,65.9 C7.1,71.4 4.1,76.5 2.7,82 C-0.2,92.8 3,104.8 10.3,113.3 C17.5,121.8 28.5,126.8 39.6,127.6 C44.1,127.9 48.7,127.6 53.2,127.2 C58.2,126.8 63.2,126.3 68.2,125.8 C73.2,126.3 78.2,126.8 83.2,127.2 C87.7,127.6 92.3,127.9 96.8,127.6 C107.9,126.8 118.9,121.8 126.1,113.3 C133.3,104.8 136.5,92.8 133.7,82 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:c86f1dd4ad1d": {
        d: {
          "0": {
            value: "M92.8,128.6 C89.5,128.6 86.2,128.3 83,128.1 C78.1,127.7 73.1,127.2 68.1,126.7 C63.1,127.2 58,127.7 53.2,128.1 C50.1,128.4 46.7,128.6 43.4,128.6 C42,128.6 40.7,128.6 39.4,128.5 C27.6,127.7 16.7,122.3 9.5,113.9 C1.8,104.9 -1.1,92.6 1.7,81.9 C2.4,79.2 3.5,76.6 4.5,74.1 C5.6,71.4 6.7,68.6 7.4,65.8 C8.3,62.2 8.4,58.3 8.6,54.6 C8.7,53.1 8.7,51.6 8.8,50.1 C10.2,29 22.8,13.1 44.2,5.2 C45.9,4.6 60.4,0.7 66.7,0.7 C67.2,0.7 67.7,0.7 68.1,0.8 C68.5,0.7 69,0.7 69.5,0.7 C75.8,0.7 90.4,4.6 92,5.2 C113.4,13.1 125.9,29 127.4,50.1 C127.5,51.6 127.6,53.1 127.6,54.6 C127.7,58.3 127.9,62.2 128.8,65.8 C129.5,68.6 130.6,71.4 131.7,74.1 C132.7,76.6 133.8,79.2 134.5,81.9 C137.4,92.7 134.4,105 126.7,113.9 C119.5,122.3 108.6,127.6 96.8,128.5 C95.5,128.5 94.2,128.6 92.8,128.6 Z M68.1,124.9 L68.1,124.9 C73.2,125.4 78.3,125.9 83.2,126.3 C86.3,126.6 89.6,126.8 92.8,126.8 C92.8,126.8 92.8,126.8 92.8,126.8 C94.2,126.8 95.4,126.8 96.7,126.7 C108.1,125.9 118.5,120.8 125.4,112.7 C132.7,104.1 135.6,92.5 132.8,82.2 C132.1,79.6 131.1,77.1 130.1,74.6 C129,71.9 127.8,69 127.1,66 C126.2,62.2 126,58.3 125.9,54.5 C125.8,53 125.8,51.5 125.7,50 C124.3,29.6 112.2,14.2 91.4,6.6 C89.8,6 75.5,2.2 69.5,2.2 C69,2.2 68.6,2.2 68.3,2.3 L68.2,2.3 L68.1,2.3 C67.8,2.2 67.3,2.2 66.9,2.2 C60.9,2.2 46.5,6.1 45,6.6 C24.3,14.2 12.1,29.6 10.7,50 C10.6,51.5 10.5,53 10.5,54.5 C10.4,58.3 10.2,62.2 9.3,66 C8.6,69 7.4,71.8 6.3,74.6 C5.3,77.1 4.2,79.6 3.6,82.2 C0.9,92.5 3.7,104.1 11,112.7 C17.9,120.8 28.4,125.9 39.7,126.7 C40.9,126.8 42.2,126.8 43.6,126.8 C46.8,126.8 50.1,126.6 53.2,126.3 C57.9,126 63,125.5 68.1,124.9 L68.1,124.9 Z"
          }
        },

        fill: { "0": { value: "#893C30" } }
      },

      "haiku:271c2445b5b5": {
        d: {
          "0": {
            value: "M15.6,51.2 C28.6,35.2 49.3,26.3 69.8,25.9 C90.3,25.5 110.7,33.2 127.3,45.4 C128.7,46.5 130.5,47.6 132.2,47.1 C134.1,46.5 134.8,44.2 134.9,42.3 C135.3,36.5 133,30.7 129.4,26.1 C125.8,21.5 121.1,18 116,15.1 C92.8,1.7 62.8,0.8 38.9,13 C31.7,16.7 24.9,21.6 20.3,28.2 C15.7,34.8 13.4,43.4 15.6,51.2 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:04facc3a7509": {
        d: {
          "0": {
            value: "M111,100.1 C111.2,93.7 108.2,86.4 105.4,82 C102.9,78.3 99.2,75.7 95.2,73.7 C90.1,71.1 84.5,69.1 78.8,68.8 C71.2,68.4 63.5,71 57.5,75.7 C51.5,80.5 47.3,87.3 45.5,94.7 C44.5,98.7 44.3,103.1 45.8,106.9 C47.3,110.8 50.7,114.1 54.8,114.5 C58.3,114.9 61.7,113.2 65.1,112 C74.5,108.4 85,107.5 94.9,109.6 C97.1,110.1 99.3,110.7 101.6,110.7 C103.9,110.8 106.3,110.2 107.9,108.6 C110,106.5 110.9,103.4 111,100.1 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:3b2c10763cfa": {
        d: {
          "0": {
            value: "M98.7,80 C90.4,74.4 79.8,71.7 70,74 C60.2,76.3 51.5,84 49.3,93.8 C48.1,98.8 49,104.9 53.3,107.8 C57.4,110.7 63,109.6 67.7,107.8 C72.3,106 76.9,103.4 81.9,103.5 C89.1,103.6 96.1,109.2 102.8,106.6 C107.9,104.6 110.2,98.1 108.9,92.7 C107.4,87.3 103.3,83.1 98.7,80 Z"
          }
        },

        fill: { "0": { value: "#934730" } }
      },

      "haiku:8a0561591a04": {
        d: {
          "0": {
            value: "M92.3,89.8 C87.2,86.7 77.9,89.3 76.9,96 C75.4,91.4 69.7,89.3 65.6,91.4 C59.1,94.9 54.1,99.3 51.5,106.2 C52,106.9 52.6,107.4 53.4,107.9 C57.5,110.8 63.1,109.7 67.8,107.9 C72.4,106.1 77,103.5 82,103.6 C89.2,103.7 96.2,109.3 102.9,106.7 C103.7,106.4 104.5,105.9 105.2,105.4 C102,99.1 98.6,93.3 92.3,89.8 Z"
          }
        },

        fill: { "0": { value: "#61090E" } }
      },

      "haiku:c9f5cf0726a7": {
        "translation.x": { "0": { value: 65 } },
        "translation.y": { "0": { value: 49 } }
      },

      "haiku:533a71c8bf58": {
        d: {
          "0": {
            value: "M19.4,4.3 C18.9,2 15.8,0.2 12.2,0.2 C8.5,0.2 5.5,2 5,4.3 C2.2,5.6 0.4,7.5 0.4,9.7 C0.4,13.5 5.7,16.6 12.2,16.6 C18.7,16.6 24,13.5 24,9.7 C24,7.6 22.2,5.6 19.4,4.3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:722f544dfe77": {
        fill: { "0": { value: "#934730" } },
        "translation.x": { "0": { value: 3 } },
        "translation.y": { "0": { value: 10 } }
      },

      "haiku:3ed416908350": {
        d: {
          "0": {
            value: "M5.3,2 C4.8,1 3.8,0.3 2.7,0.2 C2.1,0.1 1.6,0.2 1.1,0.6 C0.6,1 0.4,1.5 0.6,2.1 C0.7,2.4 0.9,2.6 1.1,2.8 C1.7,3.3 2.3,3.8 3,4.1 C3.7,4.4 4.7,4.5 5.2,4 C5.7,3.4 5.6,2.6 5.3,2 Z"
          }
        }
      },

      "haiku:936613a2b652": {
        d: {
          "0": {
            value: "M13.1,2 C13.6,1 14.6,0.3 15.7,0.2 C16.3,0.1 16.8,0.2 17.3,0.6 C17.7,0.9 18,1.5 17.8,2.1 C17.7,2.4 17.5,2.6 17.3,2.8 C16.7,3.3 16.1,3.8 15.4,4.1 C14.7,4.4 13.7,4.5 13.2,4 C12.7,3.4 12.8,2.6 13.1,2 Z"
          }
        }
      },

      "haiku:4a2e9567a421": {
        d: {
          "0": {
            value: "M76.5,53.8 C74.4,53 71.9,53.4 70.1,54.8 C69.8,55.1 69.4,55.4 69.4,55.8 C69.3,56.4 69.9,56.9 70.4,57.2 C72.2,58.2 74.4,58.4 76.4,57.7 C76.9,57.5 77.4,57.3 77.8,56.9 C78.2,56.5 78.4,56 78.3,55.4 C78.1,54.7 77.3,54.1 76.5,53.8 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:966b908c9e7a": {
        d: {
          "0": {
            value: "M64.9,78 C66,78.6 67.3,78.8 68.6,79 C72.1,79.5 75.7,79.7 79.2,79.6 C81.4,79.5 83.6,79.4 85.6,78.4 C87,77.7 88.2,76.6 88.7,75.2 C82.6,73.2 76.1,72.7 69.9,74.1 C67.6,74.6 65.3,75.5 63.2,76.6 C63.7,77.1 64.3,77.6 64.9,78 Z"
          }
        },

        fill: { "0": { value: "#FFFFFF" } }
      },

      "haiku:b9fd777ea92b": {
        "translation.x": { "0": { value: 94 } },
        "translation.y": { "0": { value: 34 } }
      },

      "haiku:281d576ab3d9": {
        d: {
          "0": {
            value: "M14.6,13.7 C15.7,13.4 16.9,13.2 18,13.5 C19.1,13.8 20.1,14.8 20,16 C13.6,16.5 7.3,18.8 2.1,22.5 C5.1,18.3 9.6,15.1 14.6,13.7 Z"
          }
        },

        fill: { "0": { value: "#934730" } }
      },

      "haiku:31733613d849": {
        d: {
          "0": {
            value: "M1.9,15.2 C2.7,12 3.6,8.7 5.4,5.9 C7.2,3.1 9.9,0.8 13.2,0.2 C16.5,-0.3 20.2,1.4 21.3,4.6 C18.7,2.6 14.9,2.9 12,4.5 C9.1,6.2 3.9,12.6 1.9,15.2 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:29d392173f8d": {
        d: {
          "0": {
            value: "M25.3,37.2 C18.2,34.6 11.1,31.9 4,29.3 C3,28.9 2,28.6 1.2,27.9 C0.4,27.2 -0.1,26.2 0.1,25.2 C0.4,23.5 2.5,22.8 4.3,22.6 C9.8,21.8 15.7,21.8 20.8,24.1 C25.9,26.4 30.1,31.3 30.3,36.8 C29.3,38.3 27,37.9 25.3,37.2 Z"
          }
        },

        fill: { "0": { value: "#F8ACAC" } }
      },

      "haiku:9d8aab570ebc": {
        "translation.x": { "0": { value: 30 } },
        "translation.y": { "0": { value: 34 } }
      },

      "haiku:cc996098c4de": {
        d: {
          "0": {
            value: "M16.2,13.7 C15.1,13.4 13.9,13.2 12.8,13.5 C11.7,13.8 10.7,14.8 10.8,16 C17.2,16.5 23.5,18.8 28.7,22.5 C25.7,18.3 21.2,15.1 16.2,13.7 Z"
          }
        },

        fill: { "0": { value: "#934730" } }
      },

      "haiku:5634ebca716e": {
        d: {
          "0": {
            value: "M29,15.2 C28.2,12 27.3,8.7 25.5,5.9 C23.7,3.1 21,0.8 17.7,0.2 C14.4,-0.3 10.7,1.4 9.6,4.6 C12.2,2.6 16,2.9 18.9,4.5 C21.8,6.2 26.9,12.6 29,15.2 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:29aec21cd63c": {
        d: {
          "0": {
            value: "M5.6,37.2 C12.7,34.6 19.8,31.9 26.9,29.3 C27.9,28.9 28.9,28.6 29.7,27.9 C30.5,27.2 31,26.2 30.8,25.2 C30.5,23.5 28.4,22.8 26.6,22.6 C21.1,21.8 15.2,21.8 10.1,24.1 C5,26.4 0.8,31.3 0.6,36.8 C1.6,38.3 3.9,37.9 5.6,37.2 Z"
          }
        },

        fill: { "0": { value: "#F8ACAC" } }
      },

      "haiku:8c51c7e36c4e": {
        d: { "0": { value: "M81.4,71 C81,71 80.6,71 80.3,71" } },
        fill: { "0": { value: "#934730" } }
      },

      "haiku:7f1279094a99": {
        fill: { "0": { value: "#934730" } },
        "translation.x": { "0": { value: 42 } }
      },

      "haiku:c3c14c7708fb": {
        d: {
          "0": {
            value: "M37.9,20.1 C29.3,17.2 19.7,17.6 11.4,21.3 C16.2,20.2 21.3,20.2 26.1,21.3 C16.1,20.6 6,26.9 2.3,36.2 C-1.4,45.5 1.7,57.1 9.5,63.3 C6.9,59.3 6.2,54.1 7.7,49.5 C7.6,56.4 13.4,62.8 20.2,63.5 C27,64.2 33.9,59 35.2,52.3 C32.7,53.5 29.8,54.1 27.3,52.9 C24.9,51.7 23.6,48.1 25.4,46.1 C27,44.4 29.9,44.7 32,45.9 C34.1,47.1 35.7,48.9 37.8,50 C42.7,52.5 49.2,49.9 51.9,45.2 C54.6,40.4 53.8,34.2 50.9,29.6 C48,25 43.1,21.9 37.9,20.1 Z"
          }
        }
      },

      "haiku:5f5128f75c03": {
        d: {
          "0": {
            value: "M55.5,31.5 C49.8,27.7 46.2,21.5 42.6,15.7 C39,9.9 34.9,3.9 28.7,0.9 C33.1,3.1 35.3,8.1 36.9,12.8 C38.4,17.5 39.6,22.6 43,26.1 C47.2,30.5 49.6,32.8 55.5,31.5 Z"
          }
        }
      },

      "haiku:d469b2ff9a18": {
        d: {
          "0": {
            value: "M38.5,18.5 C31.3,10.6 20,6.7 9.4,8.4 C19,12.2 28.8,15.4 38.5,18.5 Z"
          }
        }
      },

      "haiku:e98ee5794d46": {
        d: {
          "0": {
            value: "M50.8,26.8 C50.4,21.8 49.5,16.8 48.2,12 C46.2,11.8 44.7,14.2 44.9,16.3 C45.2,18.3 46.6,20 47.9,21.6 C49.3,23.1 50.7,24.8 50.8,26.8 Z"
          }
        }
      },

      "haiku:2bd59b715157": {
        d: {
          "0": {
            value: "M103.6,33.3 C102.7,31.7 101.7,30.1 100.4,28.8 C99,27.5 97.2,26.7 95.3,27 C93.2,27.3 91.6,29 90.4,30.7 C87.5,34.8 85.7,39.5 84,44.2 C83.2,46.3 82.5,48.7 83.4,50.8 C84.5,53.2 87.6,54.2 90.2,53.7 C92.8,53.2 95,51.5 97.1,49.9"
          }
        },

        fill: { "0": { value: "#88BA87" } }
      },

      "haiku:3e17448cac14": {
        fill: { "0": { value: "#934730" } },
        "translation.x": { "0": { value: 201 } },
        "translation.y": { "0": { value: 4 } }
      },

      "haiku:f1903f8de901": {
        d: {
          "0": {
            value: "M34.3,37.2 C31.8,35.1 28.1,35.3 25.1,36.4 C22,37.5 19.3,39.2 16.2,40.1 C13.1,41 9.3,40.8 7.2,38.4 C4.3,35.1 6,29.7 8.7,26.3 C14.8,18.6 25.8,15.1 35.2,18 C44.6,20.9 51.6,30.3 51.5,40.1 C51.4,49.9 43.9,59.3 34.2,61.2 C28.7,62.3 22.4,60.8 19.2,56.2 C16.6,52.5 16.7,47.2 19.3,43.5 C21.9,39.8 26.9,38 31.2,39.2 C33.7,39.9 36.1,41.6 37.1,44 C38.1,46.4 37.5,49.6 35.4,51.1 C36.6,49.2 36.9,46.5 35.7,44.5 C34.5,42.5 31.7,41.6 29.7,42.7 C27.1,44.2 27.3,48.5 29.8,50.2 C32.3,51.9 35.9,50.9 37.8,48.6 C39.6,46.3 39.8,42.9 38.9,40.1 C41.1,43.4 40.8,48.2 38.2,51.3 C42.1,47.4 42.8,40.7 39.7,36.2 C36.6,31.6 30.2,29.7 25.1,31.9 C28.8,31 33.1,33.4 34.3,37.2 Z"
          }
        }
      },

      "haiku:62d4235333d1": {
        d: {
          "0": {
            value: "M23.5,3.3 C24.7,9.1 24.2,15.3 21.5,20.6 C18.8,25.9 13.9,30.1 8.1,31.3 C6.5,31.6 4.8,31.7 3.3,31.2 C1.8,30.7 0.4,29.5 1.13686838e-13,27.9 C10.6,23 19.1,14 23.5,3.3 Z"
          }
        }
      },

      "haiku:6509c1e8fcb7": {
        d: {
          "0": {
            value: "M9.8,24.9 C15.5,19.8 21.3,14.7 28.2,11.4 C35.1,8.1 43.4,6.8 50.4,9.8 C37.3,10.2 24.5,17.1 17,27.8"
          }
        }
      },

      "haiku:4d7f2536e51b": {
        d: {
          "0": {
            value: "M38.5,18.5 C41.4,17.9 44.4,17.2 47.3,17.8 C50.2,18.3 53.1,20.3 53.7,23.3 C49.2,22.2 41.5,22 38.5,18.5 Z"
          }
        }
      },

      "haiku:20df50a1b6da": {
        d: {
          "0": {
            value: "M7.7,20 C8.1,12.6 11.7,5.4 17.4,0.7 C13.9,7 10.6,13.5 7.7,20 Z"
          }
        }
      },

      "haiku:c0e05773af3e": {
        d: {
          "0": {
            value: "M194.9,33.6 C196.2,30.9 197.7,28.2 200,26.3 C202.3,24.4 205.8,23.7 208.3,25.3 C210.3,26.7 211.1,29.2 211.7,31.5 C213,36.8 213.8,42.2 214,47.6 C210.8,49.3 207,50 203.4,49.5 C202.8,45.5 196.9,37.2 194.9,33.6 Z"
          }
        },

        fill: { "0": { value: "#88BA87" } }
      },

      "haiku:c503ba785cfc": {
        d: {
          "0": {
            value: "M205.1,35.6 C204.3,33.2 203.4,30.7 201.6,28.8 C199.8,27 196.9,26 194.6,27.3 C194.8,28.3 195,29.2 195.3,30.2 C194.7,29.1 194.1,28 193.5,26.9 C192,24.4 189.8,21.7 186.9,21.4 C184.3,21.1 181.7,24 182.4,26.2 C180.5,22.8 178.4,19.5 175.4,17.1 C172.1,14.5 167.3,13.3 163.6,15.4 C161.5,16.6 159.8,18.7 157.5,18.9 C154.1,19.3 151.7,15.7 148.6,14.4 C143.9,12.4 137.9,16.9 138.5,22 C136.5,18.3 131.1,17.5 127.2,19.3 C123.3,21.1 120.6,24.6 118,28 C117.6,24.9 113.8,23.2 110.8,23.9 C107.8,24.7 105.4,27.1 103.4,29.4 C92.4,42.1 86.6,35.3 81.2,50.9 C80.3,59.3 80.6,67.9 82.2,76.2 C84.1,76.3 86.1,75.8 87.8,74.7 C91,72.7 93,69.1 93.9,65.4 C94.8,61.7 94.7,57.9 94.6,54.1 C94.5,56.1 97,57.4 98.9,57 C100.8,56.5 102.3,54.9 103.5,53.4 C106.9,49.1 110,44.5 112.7,39.7 C112.3,41.9 111.8,44.1 112.2,46.3 C112.6,48.5 114,50.6 116.2,51.2 C119.4,52 122.3,49.2 123.9,46.4 C125.5,43.6 126.8,40.2 129.8,38.7 C129.3,42.8 129.4,47.9 133.2,49.7 C136.1,51.1 139.7,49.3 141.4,46.6 C143.1,43.9 143.5,40.6 143.7,37.4 C143.7,41.2 143.7,45.1 145.4,48.5 C147.1,51.9 151.2,54.3 154.7,53 C157.8,51.8 159.3,48.3 159.8,45 C160.3,41.7 160.2,38.2 161.7,35.2 C162.8,39.5 163.8,43.8 164.9,48.1 C165.3,49.7 165.8,51.4 167.1,52.3 C169.1,53.5 171.8,52.2 173,50.3 C174.2,48.3 174.3,45.9 174.4,43.6 C174.6,41.3 175,38.8 176.7,37.2 C176.3,40.7 175.9,44.4 177.1,47.8 C178.3,51.1 181.7,54 185.2,53.4 C187.9,53 189.7,49.8 189.2,47.4 C190.8,50.5 191.3,54.1 192,57.5 C192.8,61.7 194.2,66.1 197.7,68.6 C200.9,70.8 206.2,70.1 207.8,66.8 C207.6,67.9 208,69 208.8,69.7 C209.9,70.6 211.7,70.5 212.8,69.5 C211.1,57.8 208.6,46.5 205.1,35.6 Z"
          }
        },

        fill: { "0": { value: "#934730" } }
      },

      "haiku:ca8774582dc8": {
        d: {
          "0": {
            value: "M174.8,185 C172.7,181.8 168.7,180.5 165,179.9 C159.9,179.1 154.7,179.3 149.7,180.5 C149.3,180.6 148.8,180.7 148.4,180.9 C148,180.8 147.6,180.6 147.1,180.5 C142.1,179.3 136.9,179.1 131.8,179.9 C128,180.5 124,181.8 122,185 C120,188.1 120.3,192.2 121.5,195.7 C124.9,206.1 135.1,213.9 146,214.4 C146.8,214.4 147.6,214.4 148.3,214.3 C149.1,214.4 149.9,214.5 150.6,214.4 C161.5,213.9 171.7,206.1 175.1,195.7 C176.4,192.2 176.8,188.1 174.8,185 Z"
          }
        },

        fill: { "0": { value: "#D8AC2D" } }
      },

      "haiku:3fe1cbd7c18e": {
        "translation.x": { "0": { value: 38 } },
        "translation.y": { "0": { value: 216 } }
      },

      "haiku:b2c979997440": { "translation.x": { "0": { value: 14 } } },
      "haiku:e320d0fc7c5f": {
        d: {
          "0": {
            value: "M35.7,3 C27.3,-2.1 15.6,0.2 8.8,7.3 C2,14.4 0.1,25.3 2.8,34.8 C5.5,44.2 12.3,52.2 20.6,57.5 C28.9,62.8 38.5,65.7 48.1,67.3 C53.6,68.2 59.3,68.7 64.7,67.6 C70.2,66.4 75.4,63.4 78.2,58.5 C83.2,49.6 78.5,38.4 72.4,30.2 C60.6,14.4 52.4,13.2 35.7,3 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:55c7e43ba4ea": {
        d: {
          "0": {
            value: "M59.9,16.1 L59.7,15.9 C56.6,13.6 53.4,11.9 50.6,10.3 C47.7,8.8 45.1,7.4 43,6.3 C38.7,4 36,2.5 35.9,2.7 L35.6,3.2 C35.6,3.3 36.2,3.7 37.3,4.5 C38.4,5.3 40.1,6.3 42.3,7.6 C44.4,8.9 47,10.3 49.8,11.9 C52.6,13.5 55.7,15.3 58.7,17.5 L58.9,17.7 C64.4,21.7 68.9,26.8 72.7,32.2 C74.6,34.9 76.2,37.8 77.4,40.8 C78.6,43.8 79.4,46.9 79.4,50.1 L79.4,51.3 C79.4,51.7 79.3,52.1 79.3,52.5 C79.2,53.3 79,54 78.9,54.8 C78.8,55.2 78.7,55.5 78.5,55.9 C78.4,56.3 78.3,56.6 78.1,57 C77.8,57.7 77.5,58.4 77,59 C75.4,61.5 73,63.5 70.3,64.9 C67.6,66.3 64.7,67.1 61.7,67.4 C58.7,67.7 55.7,67.6 52.8,67.3 C41,65.9 29.9,62.8 21,57.1 C12.1,51.5 5.8,43.3 3.3,34.8 C2.1,30.5 1.9,26.2 2.4,22.3 C3,18.3 4.3,14.7 6.1,11.7 C7,10.2 8.1,8.9 9.2,7.7 C9.8,7.1 10.3,6.6 11,6.1 C11.6,5.6 12.2,5.2 12.9,4.7 C15.4,3 18.1,2 20.5,1.5 C22.9,0.9 25.2,0.8 27.1,0.9 C29,1 30.6,1.4 31.9,1.8 C33.2,2.2 34.1,2.6 34.7,2.9 C35.3,3.2 35.6,3.3 35.7,3.3 C35.7,3.3 35.4,3.1 34.8,2.7 C34.2,2.3 33.3,1.9 32,1.4 C30.7,0.9 29.1,0.5 27.1,0.3 C25.1,0.1 22.8,0.2 20.3,0.7 C17.8,1.2 15,2.2 12.4,3.9 C11.7,4.3 11.1,4.8 10.4,5.3 C9.7,5.8 9.1,6.4 8.5,7 C7.3,8.2 6.2,9.6 5.2,11.1 C3.2,14.2 1.8,17.9 1.2,22 C0.6,26.1 0.7,30.6 2,35.1 C4.4,44 11,52.5 20.1,58.4 C24.6,61.3 29.8,63.6 35.2,65.3 C40.7,67 46.4,68.2 52.5,68.9 C55.5,69.2 58.6,69.3 61.8,69 C64.9,68.7 68.1,67.8 71,66.3 C73.9,64.8 76.5,62.6 78.4,59.8 C79.3,58.4 80,56.8 80.5,55.2 C80.7,54.4 80.9,53.5 81,52.7 C81,52.3 81.1,51.9 81.1,51.4 L81.1,50.1 C81.1,46.7 80.2,43.3 79,40.2 C77.7,37 76.1,34.1 74.1,31.2 C72.1,28.4 70,25.7 67.6,23.2 C65.4,20.6 62.8,18.2 59.9,16.1 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:b8e7fed9b926": {
        d: {
          "0": {
            value: "M77.6,63.1 C80.9,62.4 84.2,61.2 86.5,58.8 C90.5,54.5 90,47.5 87.3,42.2 C84.7,36.9 80.4,32.7 77.1,27.8 C80.6,30.9 79.8,37.2 76.2,40.2 C72.6,43.2 67.1,43.2 62.9,41.2 C58.6,39.3 55.3,35.7 52.4,32 C53.6,42 53.8,52.1 53,62.1 C60.9,64.6 69.5,64.9 77.6,63.1 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:939fb0b96d5a": {
        "translation.x": { "0": { value: 8 } },
        "translation.y": { "0": { value: 7 } }
      },

      "haiku:bf491131a29d": {
        d: {
          "0": {
            value: "M21.7,1.7 C16.7,0.4 10.9,0.5 7,3.9 C4.2,6.4 2.9,10.1 2,13.8 C-0.7,25.9 0.8,39 6.3,50.2 C9.2,56.1 13.3,61.5 18.9,64.8 C24.5,68.1 31.9,68.9 37.6,65.6 C44.3,61.8 47.2,53.6 47.9,45.9 C48.8,36.6 47.3,27 42.8,18.8"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:e1324b425b99": {
        d: {
          "0": {
            value: "M48.9,36.5 L48.9,36.3 C48.5,31.1 47.1,26.6 45.8,23.4 C44.5,20.3 43.2,18.6 43.1,18.6 L42.6,18.9 C42.4,19 43.4,20.8 44.5,23.9 C45.6,27 46.7,31.4 47.2,36.4 L47.2,36.6 C47.4,38.9 47.4,41.2 47.3,43.4 C47.2,45.7 46.9,47.9 46.5,50.1 C45.6,54.4 43.9,58.6 41,61.7 C39.6,63.2 37.9,64.5 36,65.3 C34.1,66.1 32.1,66.6 30.1,66.6 C26,66.7 22,65.5 18.8,63.5 C15.5,61.4 12.8,58.6 10.6,55.5 C8.4,52.4 6.8,49.1 5.4,45.8 C2.7,39.2 1.6,32.5 1.5,26.5 C1.4,23.5 1.6,20.6 2,17.9 C2.4,15.2 2.9,12.6 3.6,10.4 C4.3,8.1 5.4,6.2 6.8,4.7 C8.2,3.2 9.9,2.3 11.4,1.8 C14.6,0.8 17.3,1 19.1,1.2 C20.9,1.4 21.8,1.6 21.8,1.6 C21.8,1.6 21.6,1.5 21.1,1.3 C20.7,1.2 20,1 19.1,0.8 C17.3,0.5 14.6,0.1 11.1,1.1 C9.4,1.6 7.6,2.5 6.1,4.1 C4.6,5.6 3.4,7.7 2.6,10.1 C1.8,12.5 1.2,15 0.8,17.8 C0.4,20.6 0.2,23.5 0.2,26.6 C0.3,32.8 1.4,39.6 4,46.4 C5.3,49.8 7,53.2 9.3,56.4 C11.5,59.6 14.4,62.6 17.9,64.9 C21.4,67.2 25.7,68.5 30.2,68.4 C32.4,68.3 34.7,67.9 36.8,66.9 C38.9,66 40.8,64.6 42.4,62.9 C44,61.2 45.2,59.2 46.2,57.1 C47.2,55 47.9,52.8 48.3,50.5 C48.8,48.2 49,45.9 49.2,43.5 C49.1,41.3 49.1,38.9 48.9,36.5 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:2c4f01c99313": { "translation.y": { "0": { value: 25 } } },
      "haiku:7538aab3293b": {
        d: {
          "0": {
            value: "M47.1,53.7 C50.8,42 49.9,29 44.6,18 C46,14.4 46,10.4 44.7,6.8 C43.6,4 41.1,1.1 38.1,1.6 C36.3,1.9 34.9,3.4 34.1,5 C33.3,6.7 33.2,8.5 33,10.3 C32.1,7.8 31.1,5.2 29.1,3.4 C27.2,1.6 24,0.8 21.8,2.3 C19.6,3.9 19.9,8 22.5,8.6 C21.1,6.9 19.3,5.5 17.1,5.2 C15,4.9 12.6,6 11.8,8 C11,10 12.5,12.7 14.6,12.8 C12.8,12.4 10.8,12.1 9,12.5 C7.2,13 5.5,14.4 5.2,16.2 C4.9,18.1 6.6,20.1 8.5,19.7 C6.7,19.4 4.7,19.7 3.3,20.9 C1.9,22.1 1.1,24.2 1.9,25.9 C2.6,27.6 5,28.4 6.5,27.3 C7.5,40.2 14.6,52.6 25.2,60 C29.8,63.2 36.1,65.5 41,62.7 C44.3,60.9 46,57.2 47.1,53.7 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:c3448b7b18ed": {
        d: {
          "0": {
            value: "M27,62.2 L27.2,62.3 C30.3,64.1 33.8,65.1 37.1,64.8 C38.7,64.7 40.3,64.1 41.5,63.4 C42.7,62.6 43.7,61.7 44.4,60.7 C45.9,58.8 46.5,56.9 46.9,55.7 C47.3,54.5 47.4,53.8 47.3,53.7 L46.7,53.5 C46.6,53.5 46.3,54.1 45.8,55.3 C45.3,56.4 44.5,58.1 43.1,59.8 C42.4,60.6 41.5,61.4 40.5,62 C39.4,62.6 38.2,63 36.8,63.1 C34,63.3 30.9,62.4 27.9,60.7 L27.7,60.6 C26.2,59.8 24.8,58.7 23.4,57.6 C22.1,56.5 20.8,55.4 19.6,54.1 C17.2,51.6 15.1,48.9 13.4,46 C11.7,43.1 10.3,40 9.2,36.8 C8.9,36 8.7,35.2 8.5,34.4 C8.3,33.6 8.1,32.8 7.9,32 C7.8,31.2 7.6,30.4 7.5,29.6 C7.4,28.3 7.2,27.1 7.1,25.9 L6,26.6 C5.8,26.7 5.7,26.8 5.5,26.9 C5.4,26.9 5.3,27 5.2,27 L5.1,27 C4.9,27 4.6,27 4.4,27 C3.9,26.9 3.4,26.7 3,26.3 C2.3,25.6 2.1,24.4 2.5,23.4 C2.9,22.3 3.7,21.5 4.8,21.1 C5.9,20.6 7.1,20.6 8.3,20.7 C8.3,20.1 8.3,19.6 8.3,19 C7.4,19.2 6.4,18.4 6.1,17.3 C5.8,16.3 6.3,15.2 7.2,14.4 C8.1,13.6 9.3,13.2 10.5,13.2 C11.8,13.1 13.1,13.4 14.4,13.7 C14.5,13.1 14.5,12.6 14.6,12.1 C13.5,12.1 12.4,10.8 12.4,9.5 C12.3,8.3 13.2,7.1 14.5,6.5 C15.8,5.9 17.2,6 18.5,6.5 C19.8,7.1 20.9,8 21.9,9.1 C22.2,8.7 22.4,8.3 22.7,7.8 C22,7.6 21.4,7 21.2,6.2 C21,5.4 21.1,4.5 21.4,3.8 C21.6,3.4 21.8,3.1 22.1,2.9 C22.4,2.7 22.8,2.5 23.2,2.4 C24,2.2 24.9,2.2 25.7,2.4 C26.6,2.6 27.4,3 28,3.6 C28.7,4.1 29.3,4.8 29.8,5.6 C30,6 30.3,6.4 30.5,6.8 C30.6,7 30.7,7.2 30.8,7.4 L31,7.9 L31.3,8.5 C32,10.1 32.6,11.9 33.2,13.4 C33.3,12.1 33.4,10.9 33.6,9.6 C33.7,9 33.7,8.4 33.8,7.8 L33.9,7.4 L34,7.1 L34.1,6.7 C34.4,5.5 34.9,4.5 35.7,3.7 C36.4,2.9 37.4,2.3 38.4,2.3 C39.4,2.2 40.4,2.6 41.3,3.3 C42.1,4 42.8,4.8 43.4,5.8 C43.9,6.7 44.3,7.8 44.5,8.8 C45,10.9 45.1,13 44.8,15 C44.7,15.5 44.6,16 44.5,16.5 C44.4,16.7 44.4,17 44.3,17.2 C44.3,17.3 44.2,17.4 44.2,17.5 L44,18 L43.9,18.1 C43.9,18.1 43.9,18.2 43.9,18.2 L44,18.5 L44.2,18.9 L44.5,19.6 C44.7,20 44.9,20.5 45.1,20.9 C45.5,21.8 45.8,22.7 46.1,23.5 C46.4,24.4 46.7,25.2 46.9,26.1 C47.9,29.5 48.4,32.7 48.7,35.7 C49.2,41.6 48.6,46.1 48,49.2 C47.4,52.3 46.9,53.8 47,53.9 C47,53.9 47.2,53.5 47.4,52.8 C47.7,52 48,50.9 48.4,49.4 C49.1,46.3 49.8,41.7 49.5,35.7 C49.3,32.7 48.8,29.4 47.9,25.9 C47.7,25 47.4,24.1 47.1,23.2 C46.8,22.3 46.5,21.4 46.1,20.5 C45.9,20 45.7,19.6 45.5,19.1 C45.3,18.7 45,18.1 45.1,18 L45.2,17.8 C45.2,17.7 45.3,17.6 45.3,17.4 C45.4,17.1 45.5,16.9 45.5,16.6 C45.6,16.1 45.8,15.6 45.8,15 C46.2,12.9 46.1,10.6 45.6,8.4 C45.1,6.2 44,3.8 42,2.2 C41.5,1.8 40.9,1.5 40.3,1.2 C39.7,1 39,0.9 38.3,0.9 C36.9,1 35.6,1.7 34.7,2.7 C33.8,3.7 33.1,5 32.8,6.3 L32.7,6.8 L32.7,7 L32.7,7.2 L32.6,7.6 C32.5,7.4 32.5,7.2 32.4,7 L32.3,6.8 C32.2,6.6 32.1,6.4 32,6.1 C31.8,5.7 31.5,5.2 31.2,4.8 C30.6,3.9 30,3.1 29.1,2.5 C28.3,1.8 27.3,1.3 26.2,1 C25.1,0.7 24,0.7 22.8,1 C22.2,1.2 21.7,1.4 21.2,1.8 C20.7,2.2 20.3,2.7 20,3.2 C19.5,4.3 19.3,5.5 19.6,6.7 C19.7,7.3 20,7.9 20.5,8.4 C20.9,8.9 21.6,9.3 22.2,9.4 L24.5,9.9 L23,8.1 C22,6.8 20.7,5.7 19,5 C18.2,4.7 17.3,4.4 16.4,4.4 C15.5,4.4 14.6,4.6 13.7,4.9 C12.9,5.3 12.1,5.8 11.5,6.6 C10.9,7.4 10.6,8.4 10.6,9.4 C10.7,10.4 11,11.4 11.7,12.1 C12.3,12.9 13.3,13.5 14.4,13.5 L14.6,11.9 C13.2,11.6 11.8,11.3 10.3,11.4 C8.8,11.4 7.2,11.9 5.9,13 C5.3,13.5 4.7,14.2 4.4,15 C4.1,15.8 4,16.8 4.3,17.6 C4.6,18.5 5.1,19.2 5.8,19.8 C6.5,20.4 7.5,20.7 8.5,20.5 L13.3,19.6 L8.4,18.8 C6.9,18.6 5.4,18.7 4,19.3 C3.3,19.6 2.6,20 2,20.6 C1.4,21.2 1,21.9 0.7,22.6 C0.4,23.4 0.3,24.2 0.5,25.1 C0.6,25.9 1,26.8 1.7,27.4 C2.3,28 3.1,28.4 4,28.6 C4.4,28.7 4.9,28.7 5.3,28.6 L5.5,28.6 C5.5,28.6 5.5,28.6 5.5,28.6 L5.5,28.6 L5.5,28.6 C5.5,28.6 5.5,28.6 5.5,28.6 L5.6,29.8 C5.7,30.6 5.9,31.5 6,32.3 C6.2,33.1 6.4,34 6.6,34.8 C6.8,35.6 7.1,36.5 7.3,37.3 C8.4,40.6 9.8,43.8 11.6,46.9 C13.4,49.9 15.6,52.8 18.1,55.4 C19.3,56.7 20.7,57.9 22.1,59 C23.9,60.2 25.3,61.3 27,62.2 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:84ebcc5a8993": {
        "translation.x": { "0": { value: 174 } },
        "translation.y": { "0": { value: 216 } }
      },

      "haiku:0462724b3de8": {
        d: {
          "0": {
            value: "M45.4,3 C53.8,-2.1 65.5,0.2 72.3,7.3 C79.1,14.4 81,25.3 78.3,34.8 C75.6,44.2 68.8,52.2 60.5,57.5 C52.2,62.8 42.6,65.7 33,67.3 C27.5,68.2 21.8,68.7 16.4,67.6 C10.9,66.4 5.7,63.4 2.9,58.5 C-2.1,49.6 2.6,38.4 8.7,30.2 C20.5,14.4 28.7,13.2 45.4,3 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:0a600a0a24c5": {
        d: {
          "0": {
            value: "M22.3,17.6 L22.5,17.4 C25.5,15.2 28.6,13.4 31.4,11.8 C34.2,10.2 36.8,8.8 38.9,7.5 C41,6.3 42.7,5.2 43.9,4.4 C45,3.6 45.7,3.2 45.6,3.1 L45.3,2.6 C45.2,2.4 42.6,3.9 38.2,6.2 C36,7.3 33.4,8.7 30.6,10.2 C27.7,11.8 24.6,13.5 21.5,15.8 L21.3,16 C18.5,18.1 15.9,20.4 13.5,23 C11.1,25.5 9,28.2 7,31 C5.1,33.8 3.4,36.8 2.1,40 C0.9,43.2 0,46.5 0,49.9 L0,51.2 C0,51.6 0.1,52 0.1,52.5 C0.2,53.4 0.4,54.2 0.6,55 C1.1,56.6 1.8,58.2 2.7,59.6 C4.5,62.5 7.2,64.6 10.1,66.1 C13,67.6 16.2,68.4 19.3,68.8 C22.4,69.1 25.5,69 28.6,68.7 C34.6,68 40.4,66.8 45.9,65.1 C51.4,63.4 56.5,61.1 61,58.2 C70.1,52.4 76.7,43.9 79.1,34.9 C80.3,30.4 80.5,25.9 79.9,21.8 C79.3,17.7 77.9,13.9 75.9,10.9 C74.9,9.3 73.8,8 72.6,6.8 C72,6.2 71.4,5.6 70.7,5.1 C70.1,4.6 69.4,4.1 68.7,3.7 C66.1,2 63.3,1 60.8,0.5 C58.3,-3.10819079e-15 56,-0.1 54,0.1 C52,0.3 50.4,0.7 49.1,1.2 C47.8,1.7 46.9,2.1 46.3,2.5 C45.7,2.9 45.4,3 45.4,3.1 C45.4,3.1 45.7,3 46.4,2.7 C47,2.4 47.9,2 49.2,1.6 C50.5,1.2 52.1,0.9 54,0.7 C55.9,0.6 58.2,0.7 60.6,1.3 C63,1.9 65.7,2.9 68.2,4.5 C68.8,4.9 69.5,5.4 70.1,5.9 C70.7,6.4 71.3,6.9 71.9,7.5 C73,8.7 74.1,10 75,11.5 C76.9,14.5 78.2,18.1 78.7,22.1 C79.2,26.1 79,30.4 77.8,34.6 C75.4,43.2 69,51.3 60.1,56.9 C51.2,62.5 40.1,65.7 28.3,67.1 C25.4,67.4 22.4,67.5 19.4,67.2 C16.4,66.9 13.5,66.1 10.8,64.7 C8.1,63.3 5.7,61.3 4.1,58.8 C3.7,58.2 3.4,57.5 3,56.8 C2.8,56.5 2.7,56.1 2.6,55.7 C2.5,55.3 2.3,55 2.2,54.6 C2,53.9 1.8,53.1 1.8,52.3 C1.8,51.9 1.7,51.5 1.7,51.1 L1.7,49.9 C1.7,46.8 2.5,43.6 3.7,40.6 C4.9,37.6 6.5,34.7 8.4,32 C12.3,26.8 16.8,21.6 22.3,17.6 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:5e3a0d4fbea2": {
        d: {
          "0": {
            value: "M17.7,64.5 C25.3,66.2 33.3,65.5 40.5,62.7 C43.1,61.7 45.9,60 46.6,57.3 C47.1,55.4 46.4,53.4 45.8,51.4 C44,45.3 43.6,38.9 44.5,32.6 C40,36.8 33.9,39.7 27.8,38.9 C21.7,38.1 16.1,32.4 16.9,26.3 C11.3,31.4 7.3,38.3 5.6,45.8 C4.7,49.9 4.5,54.4 6.7,58 C9.1,61.7 13.5,63.5 17.7,64.5 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:ac64819d8cfc": {
        "translation.x": { "0": { value: 38 } },
        "translation.y": { "0": { value: 7 } }
      },

      "haiku:c54bdf5f83cb": {
        d: {
          "0": {
            value: "M27.4,1.7 C32.4,0.4 38.2,0.5 42.1,3.9 C44.9,6.4 46.2,10.1 47.1,13.8 C49.8,25.9 48.3,39 42.8,50.2 C39.9,56.1 35.8,61.5 30.2,64.8 C24.6,68.1 17.2,68.9 11.5,65.6 C4.8,61.8 1.9,53.6 1.2,45.9 C0.3,36.6 1.8,27 6.3,18.8"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:81e466782180": {
        d: {
          "0": {
            value: "M2,36.7 L2,36.5 C2.4,31.5 3.6,27.1 4.7,24 C5.8,20.9 6.7,19.1 6.6,19 L6.1,18.7 C6,18.6 4.8,20.3 3.4,23.5 C2.1,26.6 0.7,31.2 0.3,36.4 L0.3,36.6 C0.1,39 0.1,41.3 0.2,43.7 C0.3,46 0.6,48.4 1.1,50.7 C1.6,53 2.3,55.2 3.2,57.3 C4.2,59.4 5.4,61.4 7,63.1 C8.6,64.8 10.5,66.2 12.6,67.1 C14.7,68 17,68.5 19.2,68.6 C23.7,68.7 28,67.4 31.5,65.1 C35.1,62.8 37.9,59.8 40.1,56.6 C42.4,53.4 44,50 45.4,46.6 C48.1,39.8 49.2,33 49.2,26.8 C49.2,23.7 49,20.7 48.6,18 C48.2,15.2 47.6,12.7 46.8,10.3 C46,8 44.8,5.9 43.3,4.3 C41.8,2.8 39.9,1.8 38.3,1.3 C34.9,0.4 32.1,0.7 30.3,1 C29.4,1.2 28.7,1.3 28.3,1.5 C27.9,1.6 27.6,1.7 27.6,1.8 C27.6,1.9 28.5,1.6 30.3,1.4 C32.1,1.2 34.8,1 38,2 C39.6,2.5 41.2,3.4 42.6,4.9 C44,6.4 45,8.3 45.8,10.6 C46.5,12.9 47,15.4 47.4,18.1 C47.8,20.8 47.9,23.7 47.9,26.7 C47.8,32.8 46.6,39.4 44,46 C42.7,49.3 41,52.6 38.8,55.7 C36.6,58.8 33.9,61.6 30.6,63.7 C27.3,65.8 23.3,67 19.3,66.8 C17.3,66.7 15.3,66.3 13.4,65.5 C11.5,64.7 9.9,63.4 8.4,61.9 C5.5,58.8 3.9,54.6 2.9,50.3 C2.4,48.1 2.2,45.9 2.1,43.6 C1.8,41.3 1.9,39 2,36.7 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:c9276c04db14": {
        "translation.x": { "0": { value: 44 } },
        "translation.y": { "0": { value: 25 } }
      },

      "haiku:38c4d5ba5f67": {
        d: {
          "0": {
            value: "M4,53.7 C0.3,42 1.2,29 6.5,18 C5.1,14.4 5.1,10.4 6.4,6.8 C7.5,4 10,1.1 13,1.6 C14.8,1.9 16.2,3.4 17,5 C17.8,6.7 17.9,8.5 18.1,10.3 C19,7.8 20,5.2 22,3.4 C23.9,1.6 27.1,0.8 29.3,2.3 C31.5,3.9 31.2,8 28.6,8.6 C30,6.9 31.8,5.5 34,5.2 C36.1,4.9 38.5,6 39.3,8 C40.1,10 38.6,12.7 36.5,12.8 C38.3,12.4 40.3,12.1 42.1,12.5 C43.9,13 45.6,14.4 45.9,16.2 C46.2,18.1 44.5,20.1 42.6,19.7 C44.4,19.4 46.4,19.7 47.8,20.9 C49.2,22.1 50,24.2 49.2,25.9 C48.5,27.6 46.1,28.4 44.6,27.3 C43.6,40.2 36.5,52.6 25.9,60 C21.3,63.2 15,65.5 10.1,62.7 C6.8,60.9 5.1,57.2 4,53.7 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:9b1b2ecc363e": {
        d: {
          "0": {
            value: "M23.3,60.6 L23.1,60.7 C20.2,62.3 17,63.3 14.2,63.1 C12.8,63 11.5,62.6 10.5,62 C9.4,61.4 8.6,60.6 7.9,59.8 C6.5,58.1 5.8,56.5 5.2,55.3 C4.7,54.2 4.4,53.5 4.3,53.5 L3.7,53.7 C3.6,53.7 3.7,54.4 4.1,55.7 C4.5,56.9 5.2,58.7 6.6,60.7 C7.3,61.7 8.3,62.6 9.5,63.4 C10.7,64.2 12.3,64.7 13.9,64.8 C17.2,65.1 20.7,64 23.8,62.3 L24,62.2 C25.6,61.3 27.1,60.2 28.5,59.1 C29.9,58 31.3,56.8 32.5,55.5 C35,52.9 37.2,50.1 39,47 C40.8,44 42.3,40.7 43.3,37.4 C43.6,36.6 43.8,35.7 44,34.9 C44.2,34.1 44.4,33.2 44.6,32.4 C44.7,31.6 44.9,30.7 45,29.9 L45.1,28.7 C45.1,28.7 45.1,28.7 45.1,28.7 L45.1,28.7 L45.1,28.7 C45.1,28.7 45.1,28.7 45.1,28.7 L45.3,28.7 C45.8,28.8 46.2,28.8 46.6,28.7 C47.5,28.5 48.3,28.1 48.9,27.5 C49.5,26.9 50,26 50.1,25.2 C50.2,24.4 50.1,23.5 49.9,22.7 C49.6,21.9 49.2,21.2 48.6,20.7 C48,20.1 47.4,19.7 46.6,19.4 C45.2,18.8 43.6,18.7 42.2,18.9 L37.3,19.7 L42.1,20.6 C43.1,20.8 44.1,20.5 44.8,19.9 C45.5,19.3 46,18.6 46.3,17.7 C46.6,16.8 46.5,15.8 46.2,15.1 C45.9,14.3 45.3,13.6 44.7,13.1 C43.5,12 41.8,11.5 40.3,11.5 C38.8,11.4 37.3,11.7 36,12 L36.2,13.6 C37.3,13.6 38.3,13 38.9,12.2 C39.5,11.4 39.9,10.5 40,9.5 C40.1,8.5 39.7,7.4 39.1,6.7 C38.5,5.9 37.7,5.3 36.9,5 C36.1,4.6 35.1,4.4 34.2,4.5 C33.3,4.5 32.4,4.7 31.6,5.1 C30,5.8 28.7,7 27.6,8.2 L26.1,10 L28.4,9.5 C29.1,9.3 29.7,9 30.1,8.5 C30.6,8 30.8,7.4 31,6.8 C31.3,5.6 31.2,4.4 30.6,3.3 C30.3,2.8 29.9,2.3 29.4,1.9 C28.9,1.6 28.4,1.3 27.8,1.1 C26.7,0.8 25.5,0.8 24.4,1.1 C23.3,1.4 22.4,1.9 21.5,2.6 C20.7,3.3 20,4.1 19.4,4.9 C19.1,5.3 18.9,5.8 18.6,6.2 C18.5,6.4 18.4,6.6 18.3,6.9 L18.2,7.1 C18.1,7.3 18,7.5 18,7.7 L17.9,7.3 L17.9,7.1 L17.9,6.9 L17.8,6.4 C17.5,5.1 16.8,3.8 15.9,2.8 C15,1.8 13.7,1 12.3,1 C11.6,1 10.9,1.1 10.3,1.3 C9.7,1.5 9.1,1.9 8.6,2.3 C6.6,3.9 5.5,6.3 5,8.5 C4.5,10.7 4.4,13 4.8,15.1 C4.9,15.6 5,16.2 5.1,16.7 C5.2,17 5.3,17.2 5.3,17.5 C5.3,17.6 5.4,17.7 5.4,17.9 L5.5,18.1 C5.6,18.2 5.2,18.8 5.1,19.2 C4.9,19.7 4.7,20.1 4.5,20.6 C4.1,21.5 3.8,22.4 3.5,23.3 C3.2,24.2 2.9,25.1 2.7,26 C1.8,29.5 1.3,32.8 1.1,35.8 C0.7,41.8 1.5,46.4 2.2,49.5 C2.6,51 2.9,52.2 3.2,52.9 C3.5,53.7 3.6,54.1 3.6,54 C3.7,54 3.2,52.4 2.6,49.3 C2,46.2 1.4,41.6 1.9,35.8 C2.1,32.9 2.7,29.7 3.7,26.2 C3.9,25.3 4.2,24.5 4.5,23.6 C4.8,22.7 5.1,21.9 5.5,21 C5.7,20.6 5.9,20.1 6.1,19.7 L6.4,19 L6.6,18.6 L6.7,18.3 C6.7,18.3 6.7,18.2 6.7,18.2 L6.6,18.1 L6.4,17.6 C6.4,17.5 6.3,17.4 6.3,17.3 C6.2,17.1 6.2,16.8 6.1,16.6 C6,16.1 5.9,15.6 5.8,15.1 C5.5,13.1 5.5,11 6.1,8.9 C6.4,7.9 6.7,6.8 7.2,5.9 C7.7,5 8.4,4.1 9.3,3.4 C10.1,2.7 11.1,2.3 12.2,2.4 C13.2,2.5 14.2,3 14.9,3.8 C15.7,4.6 16.2,5.7 16.5,6.8 L16.6,7.2 L16.7,7.5 L16.8,7.9 C16.9,8.5 17,9.1 17,9.7 C17.1,11 17.2,12.2 17.4,13.5 C18,12 18.6,10.2 19.3,8.6 L19.6,8 L19.8,7.5 C19.9,7.3 20,7.1 20.1,6.9 C20.3,6.5 20.5,6.1 20.8,5.7 C21.3,5 21.9,4.3 22.6,3.7 C23.3,3.2 24.1,2.7 24.9,2.5 C25.7,2.3 26.6,2.2 27.4,2.5 C27.8,2.6 28.2,2.8 28.5,3 C28.8,3.2 29,3.5 29.2,3.9 C29.6,4.6 29.7,5.5 29.4,6.3 C29.2,7.1 28.6,7.7 27.9,7.9 C28.2,8.3 28.4,8.7 28.7,9.2 C29.6,8.1 30.8,7.1 32.1,6.6 C33.4,6 34.8,6 36.1,6.6 C37.3,7.1 38.3,8.3 38.2,9.6 C38.1,10.9 37.1,12.2 36,12.2 C36.1,12.7 36.1,13.3 36.2,13.8 C37.5,13.5 38.8,13.3 40.1,13.3 C41.4,13.3 42.5,13.7 43.4,14.5 C44.3,15.3 44.8,16.4 44.5,17.4 C44.2,18.4 43.2,19.3 42.3,19.1 C42.3,19.7 42.3,20.2 42.3,20.8 C43.5,20.6 44.7,20.7 45.8,21.2 C46.9,21.6 47.7,22.5 48.1,23.5 C48.5,24.5 48.3,25.7 47.6,26.4 C47.2,26.8 46.7,27 46.2,27.1 C45.9,27.1 45.7,27.1 45.5,27.1 L45.4,27.1 C45.3,27.1 45.2,27 45.1,27 C44.9,26.9 44.8,26.8 44.6,26.7 L43.5,26 C43.4,27.2 43.2,28.5 43.1,29.7 C43,30.5 42.8,31.3 42.7,32.1 C42.5,32.9 42.3,33.7 42.1,34.5 C41.9,35.3 41.7,36.1 41.4,36.9 C40.4,40.1 39,43.2 37.2,46.1 C35.5,49 33.4,51.8 31,54.2 C29.8,55.4 28.5,56.6 27.2,57.7 C26.1,58.7 24.8,59.8 23.3,60.6 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:f7d7d55ba8c3": {
        d: {
          "0": {
            value: "M67,40.6 C64,40.2 60.8,40.5 58,41.8 C55.3,43.2 53,45.8 52.7,48.9 C52.4,52 54.4,55.2 57.4,55.9 C61.8,56.9 66.1,52.5 70.4,53.9 C73.9,55 75.7,59.8 79.4,60.2 C82.6,60.6 85.2,57.1 85,53.9 C84.8,50.7 82.6,48 80.1,46 C76.3,43.1 71.7,41.2 67,40.6 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:c4ce067e4f85": {
        d: {
          "0": {
            value: "M52.9,66 C50.5,68.9 50.6,73.1 51.3,76.8 C51.8,79.1 52.6,81.5 54.4,83 C56.3,84.4 58.8,84.5 61.2,84.2 C64.8,83.7 68.3,82.2 71,79.7 C73.6,77.2 75.3,73.6 75,69.9 C74.7,66.3 72.4,62.8 69,61.5 C65.9,60.4 62.4,61.1 59.2,62.2 C56.9,63 54.5,64.1 52.9,66 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:fac5c6782180": { "translation.y": { "0": { value: 140 } } },
      "haiku:b3a321c33a94": {
        d: {
          "0": {
            value: "M3.5,20.8 L11.7,23.8 C12.7,24.2 14,23.9 14.5,22.9 C15.4,21.3 13.3,19.8 11.7,19 C8.4,17.4 6,15.4 4.1,12.5 C2.9,10.6 4.9,8.2 7,9.2 C10.1,10.6 14.5,13.4 17.2,15.3 C18.2,16 19.4,16.7 20.6,16.3 C22.8,15.6 22.1,13.9 21,12.1 C19.7,10 17.3,7.6 17.1,5 C17,3.8 17.4,2.6 18.4,1.9 C20.4,0.5 22.7,2.2 23.7,4.1 C24.6,5.8 26.1,10.3 27.4,11.8 C28.7,13.3 30.1,16.3 31.1,14.7 C32.2,13 31.4,8.6 32.4,6.8 C33.2,5.4 35.4,5.2 36.7,6.2 C38,7.2 38.6,10.1 38.6,11.7 C38.6,13.3 38.2,14.9 38,16.5 C37.4,22 38.7,23.1 39.3,28.6 C39.9,34.1 38.4,40.6 33.4,42.9 C30,44.4 25.9,43.4 22.5,41.8 C19.1,40.2 15.9,38 12.3,37 C10.3,36.4 8.2,36.3 6.3,35.5 C5.9,35.4 5.6,35.2 5.2,35 C3.3,33.9 4,30.9 6.2,30.8 C7.3,30.7 9.2,31 11.1,31.2 C11.9,31.3 12.2,30.2 11.4,29.9 C8.4,28.8 5.3,27.5 3.9,26.5 C2.9,25.8 1.9,24.9 1.1,23.9 C-0.1,22.2 1.6,20 3.5,20.8 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:89ddda6c4932": {
        d: {
          "0": {
            value: "M6.5,31.6 L6.7,31.6 C7.2,31.6 7.8,31.6 8.4,31.7 C8.7,31.7 9,31.8 9.3,31.8 C9.9,31.9 10.4,31.9 11,32 C11.2,32 11.3,32 11.5,32 L11.8,31.9 C12,31.8 12.1,31.8 12.2,31.7 C12.4,31.5 12.8,31.1 12.8,30.6 C12.8,30.4 12.8,30.1 12.7,30 C12.6,29.8 12.6,29.7 12.5,29.6 L12.3,29.4 C12.2,29.3 12.2,29.3 12.1,29.2 C11.8,29.1 11.6,28.9 11.3,28.8 C10.5,28.5 9.6,28.2 8.8,27.8 C8.2,27.6 7.6,27.3 7.1,27.1 C6,26.6 5,26.2 4.2,25.6 C3.4,25 2.7,24.4 2.1,23.7 C2,23.5 1.8,23.4 1.7,23.2 L1.6,23 L1.5,22.8 C1.4,22.5 1.4,22.3 1.4,22 C1.5,21.5 1.8,21.1 2.2,21 C2.9,20.7 3.4,20.9 3.4,20.8 L3.6,20.2 C3.6,20.2 3.5,20.1 3.2,20 C2.9,19.9 2.4,19.8 1.8,20 C1.2,20.2 0.5,20.8 0.2,21.7 C0.1,22.1 -5.75234305e-14,22.7 0.2,23.2 C0.3,23.3 0.3,23.5 0.4,23.6 C0.5,23.7 0.5,23.8 0.6,24 C0.7,24.2 0.9,24.4 1,24.6 C1.6,25.3 2.4,26.1 3.3,26.8 C4.2,27.5 5.3,28.1 6.4,28.6 C7,28.9 7.5,29.1 8.1,29.4 C8.4,29.5 8.7,29.7 9,29.8 L9.2,29.9 C9.3,29.9 9.2,29.9 9.2,29.9 L9.2,29.9 C9.2,29.9 9.2,30 9.2,29.9 L9.2,29.9 C8.9,29.9 8.7,29.8 8.4,29.8 C7.8,29.7 7.2,29.7 6.6,29.7 L6.3,29.7 C5.4,29.7 4.2,30.2 3.6,31.1 C3,32 2.8,33.1 3.2,34.1 C3.4,34.6 3.7,35 4.2,35.4 C4.6,35.7 5,35.8 5.4,36 C6.1,36.4 6.9,36.6 7.7,36.8 C9.2,37.2 10.7,37.4 12,37.8 C13.3,38.2 14.7,38.7 15.9,39.4 C18.5,40.7 21,42.3 23.8,43.3 C25.2,43.8 26.7,44.2 28.2,44.4 C29.7,44.5 31.3,44.4 32.8,43.9 C34.3,43.4 35.6,42.5 36.7,41.3 C37.7,40.2 38.5,38.8 39,37.4 C40,34.6 40.3,31.7 40,28.8 C39.9,27.4 39.6,26 39.4,24.7 C39.1,23.3 38.8,22.1 38.6,20.8 C38.4,19.5 38.5,18.3 38.6,17 C38.7,15.7 39,14.5 39.1,13.1 C39.2,12.4 39.2,11.7 39.2,11 C39.2,10.3 39,9.6 38.9,8.9 C38.7,8.2 38.5,7.6 38.2,6.9 C38,6.6 37.9,6.3 37.6,5.9 C37.4,5.6 37,5.3 36.7,5.1 C36,4.7 35.2,4.5 34.4,4.5 C33.6,4.5 32.8,4.8 32.1,5.3 C31.8,5.6 31.5,5.9 31.3,6.3 C31.2,6.5 31.1,6.7 31.1,6.8 C31,7 31,7.2 31,7.3 C30.9,8 30.8,8.6 30.8,9.3 C30.7,10.6 30.8,11.8 30.6,12.9 C30.5,13.2 30.5,13.4 30.4,13.6 C30.4,13.7 30.3,13.8 30.3,13.9 C30.3,13.9 30.3,13.9 30.3,13.9 C30.3,13.9 30.2,13.9 30.2,13.9 C30.2,13.9 30.2,13.9 30.2,13.9 L30.1,13.8 C30,13.7 29.9,13.6 29.8,13.5 C29.5,13.1 29.1,12.6 28.8,12.1 C28.6,11.9 28.5,11.6 28.3,11.4 L27.8,10.7 C27.2,9.9 26.7,8.8 26.3,7.7 C25.8,6.6 25.4,5.6 24.9,4.5 C24.7,4 24.4,3.4 24.1,2.9 C23.8,2.4 23.3,1.9 22.9,1.5 C22.4,1.1 21.9,0.7 21.2,0.5 C20.6,0.3 19.8,0.2 19.2,0.4 C18.5,0.6 17.9,0.9 17.5,1.4 C17,1.9 16.7,2.5 16.6,3.1 C16.4,3.7 16.4,4.4 16.5,5 C16.6,5.6 16.8,6.2 17,6.7 C17.5,7.7 18.1,8.7 18.7,9.5 C19.3,10.4 19.9,11.2 20.5,12 C21,12.8 21.5,13.7 21.5,14.3 C21.5,14.6 21.4,14.8 21,15 C20.8,15.1 20.7,15.2 20.5,15.2 C20.3,15.3 20.2,15.3 20,15.3 C19.3,15.3 18.5,14.9 17.8,14.4 C16.2,13.3 14.7,12.3 13.2,11.4 C11.7,10.5 10.2,9.6 8.6,8.8 C8.2,8.6 7.8,8.4 7.5,8.3 C7.1,8.1 6.6,8 6.1,8 C5.1,8.1 4.2,8.7 3.8,9.6 C3.6,10 3.5,10.5 3.5,11 C3.5,11.5 3.7,11.9 3.9,12.3 C4.3,13 4.8,13.6 5.3,14.2 C6.3,15.4 7.4,16.3 8.5,17.1 C10.7,18.8 13.4,19.4 14.4,21.1 C14.9,21.9 14.4,22.9 13.6,23.2 C13.2,23.4 12.8,23.4 12.4,23.3 C12,23.2 11.6,23 11.2,22.9 C9.6,22.4 8.2,21.9 7.1,21.5 C6,21.1 5.2,20.9 4.6,20.7 C4,20.5 3.7,20.5 3.7,20.5 C3.7,20.5 4,20.7 4.5,20.9 C5.1,21.1 5.9,21.5 7,21.9 C8.1,22.3 9.4,22.8 11,23.4 C11.4,23.5 11.8,23.7 12.3,23.9 C12.8,24 13.4,24 13.9,23.8 C14.4,23.6 14.9,23.2 15.2,22.6 C15.3,22.3 15.4,22 15.4,21.7 C15.4,21.4 15.3,21.1 15.1,20.8 C14.4,19.7 13.4,19.1 12.3,18.5 C11.2,17.9 10.1,17.3 9.1,16.5 C8,15.7 7,14.8 6.1,13.7 C5.7,13.2 5.2,12.6 4.8,11.9 C4.6,11.6 4.6,11.3 4.5,11 C4.5,10.7 4.6,10.4 4.7,10.1 C5,9.5 5.6,9.2 6.2,9.1 C6.5,9.1 6.8,9.2 7.1,9.3 C7.5,9.5 7.8,9.7 8.2,9.8 C9.7,10.6 11.1,11.4 12.6,12.4 C14.1,13.3 15.6,14.3 17.1,15.4 C17.9,15.9 18.8,16.6 20.1,16.6 C20.4,16.6 20.7,16.5 21,16.4 C21.3,16.3 21.5,16.2 21.8,16 C22.3,15.7 22.9,15 22.9,14.3 C22.9,13.6 22.7,13 22.5,12.6 C22.3,12.1 22,11.7 21.7,11.2 C21.1,10.3 20.5,9.5 19.9,8.7 C19.3,7.9 18.8,7 18.4,6.1 C18,5.2 17.8,4.3 18,3.4 C18.2,2.5 18.8,1.9 19.6,1.7 C20.4,1.5 21.3,1.9 22,2.5 C22.4,2.8 22.7,3.2 23,3.6 C23.3,4 23.5,4.5 23.7,5 C24.1,6.1 24.6,7.1 25,8.2 C25.5,9.3 25.9,10.4 26.7,11.5 L27.3,12.2 C27.5,12.4 27.6,12.7 27.8,12.9 C28.1,13.4 28.5,13.9 28.9,14.4 C29,14.5 29.1,14.7 29.3,14.8 L29.5,15 C29.6,15.1 29.7,15.2 29.8,15.2 C30.3,15.5 30.9,15.5 31.3,15.2 C31.5,15.1 31.7,14.9 31.9,14.6 C32,14.4 32.1,14.2 32.2,14 C32.3,13.6 32.4,13.3 32.5,13 C32.7,11.7 32.7,10.4 32.8,9.2 C32.9,8 33,6.7 33.6,6.3 C34.2,5.8 35.4,5.7 36.2,6.2 C36.6,6.4 36.8,6.8 37.1,7.3 C37.3,7.8 37.5,8.4 37.7,9 C37.8,9.6 37.9,10.2 38,10.8 C38,11.4 38,12 37.9,12.6 C37.8,13.8 37.5,15.1 37.3,16.5 C37.2,17.9 37.1,19.3 37.3,20.7 C37.5,22.1 37.8,23.4 38.1,24.7 C38.4,26 38.6,27.3 38.7,28.6 C38.9,31.2 38.7,33.9 37.7,36.4 C37.2,37.6 36.6,38.8 35.7,39.7 C34.8,40.6 33.8,41.3 32.6,41.8 C30.2,42.6 27.4,42.2 24.8,41.2 C22.2,40.2 19.8,38.7 17.1,37.3 C15.8,36.6 14.4,36 12.9,35.6 C11.4,35.2 9.9,35 8.5,34.6 C7.8,34.4 7.1,34.2 6.5,33.9 C6.2,33.8 5.8,33.6 5.7,33.5 C5.5,33.4 5.4,33.2 5.3,33 C5.1,32.6 5.2,32.1 5.5,31.7 C5.6,31.5 5.8,31.4 6,31.3 C6,31.7 6.1,31.7 6.5,31.6 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:547cc9e87046": { "translation.x": { "0": { value: 247 } } },
      "haiku:96bda920e6f7": {
        d: {
          "0": {
            value: "M36.8,20.8 L28.6,23.8 C27.6,24.2 26.3,23.9 25.8,22.9 C24.9,21.3 27,19.8 28.6,19 C31.9,17.4 34.3,15.4 36.2,12.5 C37.4,10.6 35.4,8.2 33.3,9.2 C30.2,10.6 25.8,13.4 23.1,15.3 C22.1,16 20.9,16.7 19.7,16.3 C17.5,15.6 18.2,13.9 19.3,12.1 C20.6,10 23,7.6 23.2,5 C23.3,3.8 22.9,2.6 21.9,1.9 C19.9,0.5 17.6,2.2 16.6,4.1 C15.7,5.8 14.2,10.3 12.9,11.8 C11.6,13.3 10.2,16.3 9.2,14.7 C8.1,13 8.9,8.6 7.9,6.8 C7.1,5.4 4.9,5.2 3.6,6.2 C2.3,7.2 1.7,10.1 1.7,11.7 C1.7,13.3 2.1,14.9 2.3,16.5 C2.9,22 1.6,23.1 1,28.6 C0.4,34.1 1.9,40.6 6.9,42.9 C10.3,44.4 14.4,43.4 17.8,41.8 C21.2,40.2 24.4,38 28,37 C30,36.4 32.1,36.3 34,35.5 C34.4,35.4 34.7,35.2 35.1,35 C37,33.9 36.3,30.9 34.1,30.8 C33,30.7 31.1,31 29.2,31.2 C28.4,31.3 28.1,30.2 28.9,29.9 C31.9,28.8 35,27.5 36.4,26.5 C37.4,25.8 38.4,24.9 39.2,23.9 C40.4,22.2 38.7,20 36.8,20.8 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:d7661e95d0e9": {
        d: {
          "0": {
            value: "M33.8,29.8 L33.5,29.8 C32.9,29.8 32.3,29.9 31.7,29.9 C31.4,29.9 31.2,30 30.9,30 L30.9,30 C30.9,30 30.8,30 30.9,30 L30.9,30 C30.9,30 30.9,30 30.9,30 L31.1,29.9 C31.4,29.8 31.7,29.6 32,29.5 C32.6,29.2 33.2,29 33.7,28.7 C34.8,28.2 35.9,27.6 36.8,26.9 C37.7,26.2 38.4,25.5 39.1,24.7 C39.3,24.5 39.4,24.3 39.5,24.1 C39.6,24 39.6,23.9 39.7,23.7 C39.8,23.6 39.8,23.4 39.9,23.3 C40.1,22.8 40,22.2 39.9,21.8 C39.6,20.9 38.9,20.4 38.3,20.1 C37.7,19.9 37.2,20 36.9,20.1 C36.6,20.2 36.5,20.3 36.5,20.3 L36.7,20.9 C36.7,21 37.2,20.8 37.9,21.1 C38.2,21.3 38.6,21.6 38.7,22.1 C38.8,22.3 38.7,22.6 38.6,22.9 L38.5,23.1 L38.4,23.3 C38.3,23.4 38.1,23.6 38,23.8 C37.4,24.4 36.7,25.1 35.9,25.7 C35.1,26.3 34.1,26.7 33,27.2 C32.5,27.4 31.9,27.7 31.3,27.9 C30.5,28.2 29.7,28.5 28.8,28.9 C28.5,29 28.3,29.2 28,29.3 C27.8,29.4 27.8,29.4 27.8,29.5 L27.6,29.7 C27.5,29.8 27.4,29.9 27.4,30.1 C27.3,30.3 27.3,30.5 27.3,30.7 C27.3,31.2 27.7,31.6 27.9,31.8 C28,31.9 28.1,32 28.3,32 L28.6,32.1 C28.7,32.1 28.9,32.1 29.1,32.1 C29.6,32 30.2,32 30.8,31.9 C31.1,31.9 31.4,31.8 31.7,31.8 C32.3,31.7 32.8,31.7 33.4,31.7 L33.6,31.7 C33.9,31.7 34.1,31.7 34.3,31.8 C34.5,31.9 34.7,32 34.8,32.2 C35.1,32.6 35.1,33.1 35,33.5 C34.9,33.7 34.8,33.9 34.6,34 C34.5,34.1 34.1,34.3 33.8,34.4 C33.2,34.7 32.5,34.9 31.8,35.1 C30.4,35.5 28.9,35.7 27.4,36.1 C25.9,36.5 24.5,37.1 23.2,37.8 C20.5,39.1 18.1,40.7 15.5,41.7 C12.9,42.7 10.1,43.1 7.7,42.3 C6.5,41.9 5.4,41.2 4.6,40.2 C3.7,39.3 3.1,38.1 2.6,36.9 C1.7,34.5 1.4,31.7 1.6,29.1 C1.7,27.8 1.9,26.5 2.2,25.2 C2.5,23.9 2.8,22.6 3,21.2 C3.2,19.8 3.1,18.4 3,17 C2.9,15.6 2.6,14.3 2.4,13.1 C2.3,12.5 2.3,11.9 2.3,11.3 C2.3,10.7 2.4,10.1 2.6,9.5 C2.7,8.9 2.9,8.3 3.2,7.8 C3.5,7.3 3.7,6.9 4.1,6.7 C4.9,6.2 6.1,6.2 6.7,6.8 C7.3,7.2 7.4,8.5 7.5,9.7 C7.6,10.9 7.5,12.2 7.8,13.5 C7.9,13.8 8,14.2 8.1,14.5 C8.2,14.7 8.3,14.9 8.4,15.1 C8.6,15.3 8.8,15.5 9,15.7 C9.5,16 10.1,16 10.5,15.7 C10.6,15.6 10.7,15.5 10.8,15.5 L11,15.3 C11.1,15.2 11.2,15 11.4,14.9 C11.8,14.4 12.2,13.9 12.5,13.4 C12.7,13.2 12.8,12.9 13,12.7 L13.6,12 C14.3,10.9 14.8,9.8 15.3,8.7 C15.7,7.6 16.2,6.6 16.6,5.5 C16.8,5 17,4.5 17.3,4.1 C17.6,3.7 17.9,3.3 18.3,3 C19,2.4 19.9,2 20.7,2.2 C21.5,2.4 22.1,3.1 22.3,3.9 C22.5,4.7 22.3,5.7 21.9,6.6 C21.5,7.5 21,8.3 20.4,9.2 C19.8,10 19.2,10.8 18.6,11.7 C18.3,12.1 18,12.6 17.8,13.1 C17.6,13.6 17.4,14.2 17.4,14.8 C17.4,15.5 17.9,16.2 18.5,16.5 C18.8,16.7 19,16.8 19.3,16.9 C19.6,17 19.9,17.1 20.2,17.1 C21.5,17.1 22.4,16.5 23.2,15.9 C24.7,14.8 26.2,13.8 27.7,12.9 C29.2,12 30.7,11.1 32.1,10.3 C32.5,10.1 32.8,9.9 33.2,9.8 C33.5,9.7 33.8,9.6 34.1,9.6 C34.7,9.6 35.3,10 35.6,10.6 C35.7,10.9 35.8,11.2 35.8,11.5 C35.8,11.8 35.7,12.1 35.5,12.4 C35.1,13 34.7,13.6 34.2,14.2 C33.3,15.3 32.3,16.2 31.2,17 C30.1,17.8 29,18.4 28,19 C26.9,19.6 25.8,20.3 25.2,21.3 C25,21.6 24.9,21.9 24.9,22.2 C24.9,22.5 24.9,22.9 25.1,23.1 C25.4,23.7 25.8,24.1 26.4,24.3 C26.9,24.5 27.5,24.5 28,24.4 C28.5,24.3 28.9,24.1 29.3,23.9 C30.9,23.3 32.2,22.8 33.3,22.4 C34.4,22 35.2,21.6 35.8,21.4 C36.4,21.2 36.6,21 36.6,21 C36.6,21 36.3,21 35.7,21.2 C35.1,21.4 34.3,21.6 33.2,22 C32.1,22.4 30.7,22.8 29.1,23.4 C28.7,23.5 28.3,23.7 27.9,23.8 C27.5,23.9 27.1,23.8 26.7,23.7 C25.9,23.4 25.4,22.4 25.9,21.6 C27,19.9 29.7,19.3 31.8,17.6 C32.9,16.8 34,15.8 35,14.7 C35.5,14.1 35.9,13.5 36.4,12.8 C36.6,12.4 36.8,12 36.8,11.5 C36.8,11 36.7,10.5 36.5,10.1 C36.1,9.2 35.2,8.6 34.2,8.5 C33.7,8.5 33.2,8.6 32.8,8.8 C32.4,9 32,9.2 31.7,9.3 C30.2,10.1 28.7,10.9 27.1,11.9 C25.6,12.8 24,13.8 22.5,14.9 C21.8,15.4 21,15.9 20.3,15.8 C20.1,15.8 20,15.8 19.8,15.7 C19.6,15.6 19.4,15.5 19.3,15.5 C19,15.3 18.9,15.1 18.8,14.8 C18.8,14.2 19.3,13.3 19.8,12.5 C20.3,11.7 21,10.9 21.6,10 C22.2,9.1 22.8,8.2 23.3,7.2 C23.5,6.7 23.7,6.1 23.8,5.5 C23.9,4.9 23.9,4.2 23.7,3.6 C23.5,3 23.3,2.4 22.8,1.9 C22.3,1.4 21.7,1 21.1,0.9 C20.4,0.7 19.7,0.8 19.1,1 C18.5,1.2 17.9,1.6 17.4,2 C16.9,2.4 16.5,2.9 16.2,3.4 C15.8,3.9 15.6,4.5 15.4,5 C15,6.1 14.5,7.1 14,8.2 C13.5,9.2 13.1,10.3 12.5,11.2 L12,11.9 C11.8,12.2 11.6,12.4 11.5,12.6 C11.2,13.1 10.8,13.6 10.5,14 C10.4,14.1 10.3,14.2 10.2,14.3 L10.1,14.4 C10.1,14.4 10.1,14.4 10.1,14.4 C10.1,14.4 10,14.4 10,14.4 C10,14.4 10,14.4 10,14.4 C10,14.3 9.9,14.2 9.9,14.1 C9.8,13.9 9.7,13.6 9.7,13.4 C9.5,12.3 9.5,11.1 9.5,9.8 C9.5,9.2 9.4,8.5 9.3,7.8 C9.3,7.6 9.2,7.5 9.2,7.3 C9.2,7.1 9.1,6.9 9,6.8 C8.8,6.4 8.6,6.1 8.2,5.8 C7.5,5.2 6.7,5 5.9,5 C5.1,5 4.3,5.2 3.6,5.6 C3.3,5.8 2.9,6.1 2.7,6.4 C2.5,6.7 2.3,7 2.1,7.4 C1.8,8.1 1.6,8.7 1.4,9.4 C1.2,10.1 1.1,10.7 1.1,11.5 C1,12.2 1.1,12.9 1.2,13.6 C1.4,15 1.6,16.2 1.7,17.5 C1.8,18.8 1.8,20 1.7,21.3 C1.6,22.6 1.2,23.8 0.9,25.2 C0.6,26.6 0.4,27.9 0.3,29.3 C0.1,32.1 0.3,35.1 1.3,37.9 C1.8,39.3 2.6,40.6 3.6,41.8 C4.6,42.9 6,43.8 7.5,44.4 C9,44.9 10.6,45 12.1,44.9 C13.6,44.8 15.1,44.4 16.5,43.8 C19.3,42.7 21.8,41.1 24.4,39.9 C25.7,39.3 27,38.7 28.3,38.3 C29.6,37.9 31.1,37.7 32.6,37.3 C33.4,37.1 34.1,36.9 34.9,36.5 C35.3,36.3 35.6,36.2 36.1,35.9 C36.5,35.6 36.9,35.1 37.1,34.6 C37.5,33.6 37.3,32.5 36.7,31.6 C36,30.3 34.7,29.8 33.8,29.8 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:1ef5fbda2ed8": {
        d: {
          "0": {
            value: "M24.8,36.5 C25.8,38.1 27.4,39.5 29.3,39.6 C31.6,39.7 33.5,37.8 34.8,35.9 C35.5,34.8 36.2,33.7 36.4,32.4 C36.8,30.3 35.9,28.1 35,26.2 C34.4,25 33.8,23.7 32.7,22.9 C31.6,22.2 30.2,22.1 29,22.5 C27.8,22.9 26.7,23.7 25.9,24.7 C23.1,27.9 22.7,32.9 24.8,36.5 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:af2db4d5d1ce": {
        d: {
          "0": {
            value: "M250.4,32.3 C250.2,30.2 250.3,28.1 251.1,26.2 C251.9,24.3 253.5,22.7 255.5,22.1 C258.9,23.1 262,25.3 263.6,28.4 C265.2,31.5 265,35.6 262.7,38.3 C261,40.3 258.1,41.3 255.6,40.5 C252.4,39.5 250.8,35.7 250.4,32.3 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:faf7ce19c6fe": {
        d: {
          "0": {
            value: "M195.8,189.8 C193.7,184.4 193.1,178.6 191.9,173 C190.7,167.4 188.7,161.6 184.6,157.7 C189.7,165.9 191.1,176.3 188.4,185.5 C193.8,189 197.1,195.5 196.7,201.9 C196.3,208.3 192.1,214.3 186.3,217 C192.9,216.8 199.5,216.6 206.1,216.3 C206.9,206.7 199.3,198.7 195.8,189.8 Z"
          }
        },

        fill: { "0": { value: "#81308D" } }
      },

      "haiku:41b66c7ede4e": {
        viewBox: { "0": { value: "0 0 288 300" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 288 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 300 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function($user) {
                return $user.mouse.x - 144;
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
                return $user.mouse.y - 288;
              },
              "$user"
            ),

            edited: true
          }
        },

        "style.zIndex": { "0": { value: 36 } },
        "scale.x": { "0": { value: 0.3, edited: true } },
        "scale.y": { "0": { value: 0.3, edited: true } },
        opacity: {
          "0": {
            value: Haiku.inject(
              function(currentBaby) {
                return currentBaby === "baby6" ? 1 : 0;
              },
              "currentBaby"
            ),

            edited: true
          }
        }
      },

      "haiku:ffade39b98c5": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:9d92a2d2a5a9": { "fill-rule": { "0": { value: "nonzero" } } },
      "haiku:d45fb2211598": {
        "translation.x": { "0": { value: 31 } },
        "translation.y": { "0": { value: 137 } }
      },

      "haiku:808906dd8f0d": {
        d: {
          "0": {
            value: "M50.2,11.5 C45.5,13.1 40.4,12.7 35.5,12.8 C24.9,13.1 14.5,15.8 5.1,20.6 C1.8,26 0.4,32.5 1,38.8 C13.6,44.9 27.6,47.5 41.6,48.4 C49.4,48.9 57.4,48.9 64.9,46.9 C72.5,45 79.7,41 84.5,34.7 C89.2,28.5 91.1,19.8 88.3,12.5 C85.4,5.2 77.4,-1.1524115e-13 69.7,1.4 C62.4,2.9 57.1,9.2 50.2,11.5 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:0d9a10bd4240": {
        d: {
          "0": {
            value: "M74.7,0.6 L74.4,0.6 C72.5,0.3 70.5,0.4 68.7,0.8 C66.9,1.2 65.3,1.9 63.8,2.7 C60.9,4.2 58.6,6 56.6,7.3 C54.6,8.6 53,9.6 51.8,10.2 C50.6,10.8 50,11.1 50,11.2 L50.2,11.8 C50.2,11.9 51,11.7 52.3,11.2 C53.6,10.7 55.4,9.8 57.4,8.5 C59.5,7.3 61.8,5.6 64.6,4.2 C66,3.5 67.5,2.9 69.1,2.6 C70.7,2.2 72.4,2.2 74.1,2.4 L74.4,2.4 C80.3,3.4 85.4,7.7 87.4,13.2 C89.5,18.7 88.7,24.9 86.2,30.1 C83.7,35.3 79.4,39.4 74.5,42.1 C69.6,44.9 64.2,46.5 58.8,47.2 C53.4,48 48,47.9 42.8,47.7 C37.6,47.4 32.5,46.9 27.6,46.1 C22.7,45.3 18,44.3 13.6,42.9 C11.4,42.2 9.2,41.5 7.1,40.7 C6.1,40.3 5,39.9 4,39.5 C3.5,39.3 3,39.1 2.5,38.8 C2.1,38.6 1.7,38.5 1.4,38.3 L1.4,37.8 C1.4,37.5 1.4,37.2 1.3,36.9 C1.3,36.3 1.3,35.7 1.3,35.1 C1.3,33.9 1.4,32.7 1.6,31.6 C1.9,29.3 2.5,27.1 3.4,25 C3.8,24 4.3,23 4.8,22 L5.2,21.3 C5.4,21 5.3,21.1 5.5,21 C6,20.8 6.5,20.5 6.9,20.3 C8.8,19.4 10.7,18.6 12.6,17.9 C20.1,15.1 26.9,13.9 32.5,13.4 C35.3,13.2 37.8,13.2 40,13.1 C42.2,13 44.1,12.9 45.6,12.7 C47.1,12.5 48.2,12.2 49,12 C49.7,11.8 50.1,11.6 50.1,11.6 C50.1,11.5 48.6,12.1 45.6,12.4 C44.1,12.6 42.3,12.6 40.1,12.6 C37.9,12.6 35.4,12.5 32.5,12.7 C26.8,13 19.8,14.1 12.2,16.9 C10.3,17.6 8.4,18.4 6.4,19.3 C5.9,19.5 5.4,19.8 4.9,20 L4.7,20.1 C4.6,20.2 4.5,20.2 4.4,20.3 L4.1,20.8 L3.7,21.5 C3.2,22.5 2.7,23.5 2.2,24.6 C1.3,26.7 0.7,29.1 0.3,31.5 C0.1,32.7 0,33.9 0,35.2 C0,35.8 0,36.5 0,37.1 C0,37.4 0,37.7 0,38.1 L0.1,39.4 C0.7,39.7 1.3,40 1.9,40.3 C2.4,40.5 2.9,40.8 3.4,41 C4.4,41.4 5.5,41.9 6.5,42.3 C8.6,43.1 10.8,43.9 13.1,44.6 C17.6,46 22.4,47.1 27.3,47.9 C32.2,48.7 37.4,49.3 42.7,49.6 C48,49.9 53.5,49.9 59,49.2 C64.5,48.5 70.2,46.8 75.3,43.9 C80.4,41 85,36.7 87.7,31.1 C88.4,29.7 88.9,28.3 89.3,26.8 C89.7,25.3 90,23.8 90.1,22.2 C90.4,19.1 90,15.8 88.9,12.8 C88.3,11.3 87.6,9.9 86.6,8.5 C85.6,7.2 84.5,6 83.3,5 C81,2.7 78,1.1 74.7,0.6 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:7e6290306f14": {
        d: {
          "0": {
            value: "M40,177.6 C57.3,182.8 75.7,184.4 93.6,181.9 C96.4,181.5 99.4,180.9 101.5,178.9 C103.3,177.2 104.1,174.6 104.1,172.1 C104.2,169.6 103.6,167.2 103,164.7 C99.5,169.8 93.2,172 87.3,173.9 C85.3,174.5 83.3,175.2 81.3,175.8 C78.9,176.6 76.5,177.3 74.1,177.9 C60.8,181 46.2,177.5 35.7,168.7 C33.5,169.3 33.1,172.4 34.3,174.3 C35.6,176.1 37.9,176.9 40,177.6 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:c64b0fb6c3c0": { "translation.y": { "0": { value: 134 } } },
      "haiku:45e86dd9af16": {
        d: {
          "0": {
            value: "M3.5,20.8 L11.7,23.8 C12.7,24.2 14,23.9 14.5,22.9 C15.4,21.3 13.3,19.8 11.7,19 C8.4,17.4 6,15.4 4.1,12.5 C2.9,10.6 4.9,8.2 7,9.2 C10.1,10.6 14.5,13.4 17.2,15.3 C18.2,16 19.4,16.7 20.6,16.3 C22.8,15.6 22.1,13.9 21,12.1 C19.7,10 17.3,7.6 17.1,5 C17,3.8 17.4,2.6 18.4,1.9 C20.4,0.5 22.7,2.2 23.7,4.1 C24.6,5.8 26.1,10.3 27.4,11.8 C28.7,13.3 30.1,16.3 31.1,14.7 C32.2,13 31.4,8.6 32.4,6.8 C33.2,5.4 35.4,5.2 36.7,6.2 C38,7.2 38.6,10.1 38.6,11.7 C38.6,13.3 38.2,14.9 38,16.5 C37.4,22 38.7,23.1 39.3,28.6 C39.9,34.1 38.4,40.6 33.4,42.9 C30,44.4 25.9,43.4 22.5,41.8 C19.1,40.2 15.9,38 12.3,37 C10.3,36.4 8.2,36.3 6.3,35.5 C5.9,35.4 5.6,35.2 5.2,35 C3.3,33.9 4,30.9 6.2,30.8 C7.3,30.7 9.2,31 11.1,31.2 C11.9,31.3 12.2,30.2 11.4,29.9 C8.4,28.8 5.3,27.5 3.9,26.5 C2.9,25.8 1.9,24.9 1.1,23.9 C1.55431223e-15,22.2 1.6,20 3.5,20.8 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:e3d6e3034736": {
        d: {
          "0": {
            value: "M6.5,31.6 L6.7,31.6 C7.2,31.6 7.8,31.6 8.4,31.7 C8.7,31.7 9,31.8 9.3,31.8 C9.9,31.9 10.4,31.9 11,32 C11.2,32 11.3,32 11.5,32 L11.8,31.9 C12,31.8 12.1,31.8 12.2,31.7 C12.4,31.5 12.8,31.1 12.8,30.6 C12.8,30.4 12.8,30.1 12.7,30 C12.6,29.8 12.6,29.7 12.5,29.6 L12.3,29.4 C12.2,29.3 12.2,29.3 12.1,29.2 C11.8,29.1 11.6,28.9 11.3,28.8 C10.5,28.5 9.6,28.2 8.8,27.8 C8.2,27.6 7.6,27.3 7.1,27.1 C6,26.6 5,26.2 4.2,25.6 C3.4,25 2.7,24.4 2.1,23.7 C2,23.5 1.8,23.4 1.7,23.2 L1.6,23 L1.5,22.8 C1.4,22.5 1.4,22.3 1.4,22 C1.5,21.5 1.8,21.1 2.2,21 C2.9,20.7 3.4,20.9 3.4,20.8 L3.6,20.2 C3.6,20.2 3.5,20.1 3.2,20 C2.9,19.9 2.4,19.8 1.8,20 C1.2,20.2 0.5,20.8 0.2,21.7 C0.1,22.1 1.42802437e-14,22.7 0.2,23.2 C0.3,23.3 0.3,23.5 0.4,23.6 C0.5,23.7 0.5,23.8 0.6,24 C0.7,24.2 0.9,24.4 1,24.6 C1.6,25.3 2.4,26.1 3.3,26.8 C4.2,27.5 5.3,28.1 6.4,28.6 C7,28.9 7.5,29.1 8.1,29.4 C8.4,29.5 8.7,29.7 9,29.8 L9.2,29.9 C9.3,29.9 9.2,29.9 9.2,29.9 L9.2,29.9 C9.2,29.9 9.2,30 9.2,29.9 L9.2,29.9 C8.9,29.9 8.7,29.8 8.4,29.8 C7.8,29.7 7.2,29.7 6.6,29.7 L6.3,29.7 C5.4,29.7 4.2,30.2 3.6,31.1 C3,32 2.8,33.1 3.2,34.1 C3.4,34.6 3.7,35 4.2,35.4 C4.6,35.7 5,35.8 5.4,36 C6.1,36.4 6.9,36.6 7.7,36.8 C9.2,37.2 10.7,37.4 12,37.8 C13.3,38.2 14.7,38.7 15.9,39.4 C18.5,40.7 21,42.3 23.8,43.3 C25.2,43.8 26.7,44.2 28.2,44.4 C29.7,44.5 31.3,44.4 32.8,43.9 C34.3,43.4 35.6,42.5 36.7,41.3 C37.7,40.2 38.5,38.8 39,37.4 C40,34.6 40.3,31.7 40,28.8 C39.9,27.4 39.6,26 39.4,24.7 C39.1,23.3 38.8,22.1 38.6,20.8 C38.4,19.5 38.5,18.3 38.6,17 C38.7,15.7 39,14.5 39.1,13.1 C39.2,12.4 39.2,11.7 39.2,11 C39.2,10.3 39,9.6 38.9,8.9 C38.7,8.2 38.5,7.6 38.2,6.9 C38,6.6 37.9,6.3 37.6,5.9 C37.4,5.6 37,5.3 36.7,5.1 C36,4.7 35.2,4.5 34.4,4.5 C33.6,4.5 32.8,4.8 32.1,5.3 C31.8,5.6 31.5,5.9 31.3,6.3 C31.2,6.5 31.1,6.7 31.1,6.8 C31,7 31,7.2 31,7.3 C30.9,8 30.8,8.6 30.8,9.3 C30.7,10.6 30.8,11.8 30.6,12.9 C30.5,13.2 30.5,13.4 30.4,13.6 C30.4,13.7 30.3,13.8 30.3,13.9 C30.3,13.9 30.3,13.9 30.3,13.9 C30.3,13.9 30.2,13.9 30.2,13.9 C30.2,13.9 30.2,13.9 30.2,13.9 L30.1,13.8 C30,13.7 29.9,13.6 29.8,13.5 C29.5,13.1 29.1,12.6 28.8,12.1 C28.6,11.9 28.5,11.6 28.3,11.4 L27.8,10.7 C27.2,9.9 26.7,8.8 26.3,7.7 C25.8,6.6 25.4,5.6 24.9,4.5 C24.7,4 24.4,3.4 24.1,2.9 C23.8,2.4 23.3,1.9 22.9,1.5 C22.4,1.1 21.9,0.7 21.2,0.5 C20.6,0.3 19.8,0.2 19.2,0.4 C18.5,0.6 17.9,0.9 17.5,1.4 C17,1.9 16.7,2.5 16.6,3.1 C16.4,3.7 16.4,4.4 16.5,5 C16.6,5.6 16.8,6.2 17,6.7 C17.5,7.7 18.1,8.7 18.7,9.5 C19.3,10.4 19.9,11.2 20.5,12 C21,12.8 21.5,13.7 21.5,14.3 C21.5,14.6 21.4,14.8 21,15 C20.8,15.1 20.7,15.2 20.5,15.2 C20.3,15.3 20.2,15.3 20,15.3 C19.3,15.3 18.5,14.9 17.8,14.4 C16.2,13.3 14.7,12.3 13.2,11.4 C11.7,10.5 10.2,9.6 8.6,8.8 C8.2,8.6 7.8,8.4 7.5,8.3 C7.1,8.1 6.6,8 6.1,8 C5.1,8.1 4.2,8.7 3.8,9.6 C3.6,10 3.5,10.5 3.5,11 C3.5,11.5 3.7,11.9 3.9,12.3 C4.3,13 4.8,13.6 5.3,14.2 C6.3,15.4 7.4,16.3 8.5,17.1 C10.7,18.8 13.4,19.4 14.4,21.1 C14.9,21.9 14.4,22.9 13.6,23.2 C13.2,23.4 12.8,23.4 12.4,23.3 C12,23.2 11.6,23 11.2,22.9 C9.6,22.4 8.2,21.9 7.1,21.5 C6,21.1 5.2,20.9 4.6,20.7 C4,20.5 3.7,20.5 3.7,20.5 C3.7,20.5 4,20.7 4.5,20.9 C5.1,21.1 5.9,21.5 7,21.9 C8.1,22.3 9.4,22.8 11,23.4 C11.4,23.5 11.8,23.7 12.3,23.9 C12.8,24 13.4,24 13.9,23.8 C14.4,23.6 14.9,23.2 15.2,22.6 C15.3,22.3 15.4,22 15.4,21.7 C15.4,21.4 15.3,21.1 15.1,20.8 C14.4,19.7 13.4,19.1 12.3,18.5 C11.2,17.9 10.1,17.3 9.1,16.5 C8,15.7 7,14.8 6.1,13.7 C5.7,13.2 5.2,12.6 4.8,11.9 C4.6,11.6 4.6,11.3 4.5,11 C4.5,10.7 4.6,10.4 4.7,10.1 C5,9.5 5.6,9.2 6.2,9.1 C6.5,9.1 6.8,9.2 7.1,9.3 C7.5,9.5 7.8,9.7 8.2,9.8 C9.7,10.6 11.1,11.4 12.6,12.4 C14.1,13.3 15.6,14.3 17.1,15.4 C17.9,15.9 18.8,16.6 20.1,16.6 C20.4,16.6 20.7,16.5 21,16.4 C21.3,16.3 21.5,16.2 21.8,16 C22.3,15.7 22.9,15 22.9,14.3 C22.9,13.6 22.7,13 22.5,12.6 C22.3,12.1 22,11.7 21.7,11.2 C21.1,10.3 20.5,9.5 19.9,8.7 C19.3,7.9 18.8,7 18.4,6.1 C18,5.2 17.8,4.3 18,3.4 C18.2,2.5 18.8,1.9 19.6,1.7 C20.4,1.5 21.3,1.9 22,2.5 C22.4,2.8 22.7,3.2 23,3.6 C23.3,4 23.5,4.5 23.7,5 C24.1,6.1 24.6,7.1 25,8.2 C25.5,9.3 25.9,10.4 26.7,11.5 L27.3,12.2 C27.5,12.4 27.6,12.7 27.8,12.9 C28.1,13.4 28.5,13.9 28.9,14.4 C29,14.5 29.1,14.7 29.3,14.8 L29.5,15 C29.6,15.1 29.7,15.2 29.8,15.2 C30.3,15.5 30.9,15.5 31.3,15.2 C31.5,15.1 31.7,14.9 31.9,14.6 C32,14.4 32.1,14.2 32.2,14 C32.3,13.6 32.4,13.3 32.5,13 C32.7,11.7 32.7,10.4 32.8,9.2 C32.9,8 33,6.7 33.6,6.3 C34.2,5.8 35.4,5.7 36.2,6.2 C36.6,6.4 36.8,6.8 37.1,7.3 C37.3,7.8 37.5,8.4 37.7,9 C37.8,9.6 37.9,10.2 38,10.8 C38,11.4 38,12 37.9,12.6 C37.8,13.8 37.5,15.1 37.3,16.5 C37.2,17.9 37.1,19.3 37.3,20.7 C37.5,22.1 37.8,23.4 38.1,24.7 C38.4,26 38.6,27.3 38.7,28.6 C38.9,31.2 38.7,33.9 37.7,36.4 C37.2,37.6 36.6,38.8 35.7,39.7 C34.8,40.6 33.8,41.3 32.6,41.8 C30.2,42.6 27.4,42.2 24.8,41.2 C22.2,40.2 19.8,38.7 17.1,37.3 C15.8,36.6 14.4,36 12.9,35.6 C11.4,35.2 9.9,35 8.5,34.6 C7.8,34.4 7.1,34.2 6.5,33.9 C6.2,33.8 5.8,33.6 5.7,33.5 C5.5,33.4 5.4,33.2 5.3,33 C5.1,32.6 5.2,32.1 5.5,31.7 C5.6,31.5 5.8,31.4 6,31.3 C6,31.7 6.2,31.7 6.5,31.6 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:b8fdef52798e": {
        "translation.x": { "0": { value: 166 } },
        "translation.y": { "0": { value: 137 } }
      },

      "haiku:31512788a9aa": {
        d: {
          "0": {
            value: "M40.2,11.5 C44.9,13.1 50,12.7 54.9,12.8 C65.5,13.1 75.9,15.8 85.3,20.6 C88.6,26 90,32.5 89.4,38.8 C76.8,44.9 62.8,47.5 48.8,48.4 C41,48.9 33,48.9 25.5,46.9 C17.9,45 10.7,41 5.9,34.7 C1.1,28.4 -0.7,19.8 2.1,12.5 C5,5.2 13,-1.1524115e-13 20.7,1.4 C28,2.9 33.3,9.2 40.2,11.5 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:2851ff3e0825": {
        d: {
          "0": {
            value: "M16,2.4 L16.3,2.4 C18,2.2 19.7,2.2 21.3,2.6 C22.9,3 24.4,3.6 25.8,4.2 C28.6,5.6 30.9,7.3 33,8.5 C35.1,9.8 36.9,10.7 38.1,11.2 C39.4,11.7 40.1,11.8 40.2,11.8 L40.4,11.2 C40.4,11.1 39.8,10.8 38.6,10.2 C37.4,9.6 35.8,8.6 33.8,7.3 C31.8,6 29.5,4.2 26.6,2.7 C25.1,1.9 23.5,1.2 21.7,0.8 C19.9,0.4 18,0.3 16,0.6 L15.7,0.6 C12.4,1.1 9.4,2.7 6.9,4.7 C5.7,5.8 4.5,6.9 3.6,8.2 C2.7,9.5 1.9,11 1.3,12.5 C0.2,15.5 -0.2,18.7 0.1,21.9 C0.2,23.5 0.5,25 0.9,26.5 C1.3,28 1.9,29.5 2.5,30.8 C5.2,36.4 9.8,40.7 14.9,43.6 C20,46.5 25.7,48.1 31.2,48.9 C36.8,49.7 42.2,49.6 47.5,49.3 C52.8,49 57.9,48.4 62.9,47.6 C67.8,46.8 72.6,45.7 77.1,44.3 C79.3,43.6 81.5,42.9 83.7,42 C84.8,41.6 85.8,41.2 86.8,40.7 C87.3,40.5 87.8,40.3 88.3,40 C88.9,39.7 89.5,39.4 90.1,39.1 L90.2,37.8 C90.2,37.5 90.2,37.2 90.2,36.8 C90.2,36.2 90.2,35.5 90.2,34.9 C90.2,33.6 90,32.4 89.9,31.2 C89.5,28.8 88.9,26.5 88,24.3 C87.6,23.2 87.1,22.2 86.5,21.2 L86.1,20.5 L85.8,20 C85.7,19.9 85.6,19.9 85.5,19.8 L85.3,19.7 C84.8,19.5 84.3,19.2 83.8,19 C81.8,18.1 79.9,17.3 78,16.6 C70.4,13.8 63.4,12.7 57.7,12.4 C54.8,12.2 52.3,12.3 50.1,12.3 C47.9,12.3 46.1,12.2 44.6,12.1 C41.6,11.8 40.1,11.2 40.1,11.3 C40.1,11.3 40.5,11.5 41.2,11.7 C41.9,11.9 43.1,12.2 44.6,12.4 C46.1,12.6 48,12.7 50.2,12.8 C52.4,12.9 54.9,12.9 57.7,13.1 C63.3,13.5 70.2,14.7 77.6,17.6 C79.5,18.3 81.4,19.1 83.3,20 C83.8,20.2 84.3,20.5 84.7,20.7 C84.9,20.8 84.8,20.7 85,21 L85.4,21.7 C85.9,22.7 86.4,23.6 86.8,24.7 C87.6,26.8 88.2,29 88.6,31.3 C88.8,32.5 88.9,33.6 88.9,34.8 C88.9,35.4 88.9,36 88.9,36.6 C88.9,36.9 88.9,37.2 88.8,37.5 L88.8,38 C88.4,38.2 88.1,38.3 87.7,38.5 C87.2,38.7 86.7,39 86.2,39.2 C85.2,39.6 84.2,40.1 83.1,40.4 C81,41.2 78.9,41.9 76.6,42.6 C72.2,43.9 67.5,45 62.6,45.8 C57.7,46.6 52.6,47.1 47.4,47.4 C42.2,47.7 36.8,47.7 31.4,46.9 C26,46.2 20.6,44.6 15.7,41.8 C10.9,39 6.5,35 4,29.8 C1.5,24.7 0.8,18.4 2.8,12.9 C5,7.8 10.1,3.4 16,2.4 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:78a245c52fb6": {
        d: {
          "0": {
            value: "M189.7,172.6 C188,175.4 189.2,179.2 191.7,181.3 C194.2,183.4 197.5,184.1 200.7,184.5 C218.5,186.8 236.3,181.1 253.1,174.8 C251.3,173.1 250.6,170.4 251.3,168.1 C245.3,174.5 236.2,177.9 227.5,177 C217.3,176 208,169.6 197.7,169.3 C194.7,169.3 191.3,170.1 189.7,172.6 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:a6a32d22b109": {
        "translation.x": { "0": { value: 247 } },
        "translation.y": { "0": { value: 134 } }
      },

      "haiku:da8c6543cd1d": {
        d: {
          "0": {
            value: "M36.9,20.8 L28.7,23.8 C27.7,24.2 26.4,23.9 25.9,22.9 C25,21.3 27.1,19.8 28.7,19 C32,17.4 34.4,15.4 36.3,12.5 C37.5,10.6 35.5,8.2 33.4,9.2 C30.3,10.6 25.9,13.4 23.2,15.3 C22.2,16 21,16.7 19.8,16.3 C17.6,15.6 18.3,13.9 19.4,12.1 C20.7,10 23.1,7.6 23.3,5 C23.4,3.8 23,2.6 22,1.9 C20,0.5 17.7,2.2 16.7,4.1 C15.8,5.8 14.3,10.3 13,11.8 C11.7,13.3 10.3,16.3 9.3,14.7 C8.2,13 9,8.6 8,6.8 C7.2,5.4 5,5.2 3.7,6.2 C2.4,7.2 1.8,10.1 1.8,11.7 C1.8,13.3 2.2,14.9 2.4,16.5 C3,22 1.7,23.1 1.1,28.6 C0.5,34.1 2,40.6 7,42.9 C10.4,44.4 14.5,43.4 17.9,41.8 C21.3,40.2 24.5,38 28.1,37 C30.1,36.4 32.2,36.3 34.1,35.5 C34.5,35.4 34.8,35.2 35.2,35 C37.1,33.9 36.4,30.9 34.2,30.8 C33.1,30.7 31.2,31 29.3,31.2 C28.5,31.3 28.2,30.2 29,29.9 C32,28.8 35.1,27.5 36.5,26.5 C37.5,25.8 38.5,24.9 39.3,23.9 C40.4,22.2 38.8,20 36.9,20.8 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:f0b6a56668dc": {
        d: {
          "0": {
            value: "M33.9,29.8 L33.6,29.8 C33,29.8 32.4,29.9 31.8,29.9 C31.5,29.9 31.3,30 31,30 L31,30 C31,30 30.9,30 31,30 L31,30 C31,30 31,30 31,30 L31.2,29.9 C31.5,29.8 31.8,29.6 32.1,29.5 C32.7,29.2 33.3,29 33.8,28.7 C34.9,28.2 36,27.6 36.9,26.9 C37.8,26.2 38.5,25.5 39.2,24.7 C39.4,24.5 39.5,24.3 39.6,24.1 C39.7,24 39.7,23.9 39.8,23.7 C39.9,23.6 39.9,23.4 40,23.3 C40.2,22.8 40.1,22.2 40,21.8 C39.7,20.9 39,20.4 38.4,20.1 C37.8,19.9 37.3,20 37,20.1 C36.7,20.2 36.6,20.3 36.6,20.3 L36.8,20.9 C36.8,21 37.3,20.8 38,21.1 C38.3,21.3 38.7,21.6 38.8,22.1 C38.9,22.3 38.8,22.6 38.7,22.9 L38.6,23.1 L38.5,23.3 C38.4,23.4 38.2,23.6 38.1,23.8 C37.5,24.4 36.8,25.1 36,25.7 C35.2,26.3 34.2,26.7 33.1,27.2 C32.6,27.4 32,27.7 31.4,27.9 C30.6,28.2 29.8,28.5 28.9,28.9 C28.6,29 28.4,29.2 28.1,29.3 C27.9,29.4 27.9,29.4 27.9,29.5 L27.7,29.7 C27.6,29.8 27.5,29.9 27.5,30.1 C27.4,30.3 27.4,30.5 27.4,30.7 C27.4,31.2 27.8,31.6 28,31.8 C28.1,31.9 28.2,32 28.4,32 L28.7,32.1 C28.8,32.1 29,32.1 29.2,32.1 C29.7,32 30.3,32 30.9,31.9 C31.2,31.9 31.5,31.8 31.8,31.8 C32.4,31.7 32.9,31.7 33.5,31.7 L33.7,31.7 C34,31.7 34.2,31.7 34.4,31.8 C34.6,31.9 34.8,32 34.9,32.2 C35.2,32.6 35.2,33.1 35.1,33.5 C35,33.7 34.9,33.9 34.7,34 C34.6,34.1 34.2,34.3 33.9,34.4 C33.3,34.7 32.6,34.9 31.9,35.1 C30.5,35.5 29,35.7 27.5,36.1 C26,36.5 24.6,37.1 23.3,37.8 C20.6,39.1 18.2,40.7 15.6,41.7 C13,42.7 10.2,43.1 7.8,42.3 C6.6,41.9 5.5,41.2 4.7,40.2 C3.8,39.3 3.2,38.1 2.7,36.9 C1.8,34.5 1.5,31.7 1.7,29.1 C1.8,27.8 2,26.5 2.3,25.2 C2.6,23.9 2.9,22.6 3.1,21.2 C3.3,19.8 3.2,18.4 3.1,17 C3,15.6 2.7,14.3 2.5,13.1 C2.4,12.5 2.4,11.9 2.4,11.3 C2.4,10.7 2.5,10.1 2.7,9.5 C2.8,8.9 3,8.3 3.3,7.8 C3.6,7.3 3.8,6.9 4.2,6.7 C5,6.2 6.2,6.2 6.8,6.8 C7.4,7.2 7.5,8.5 7.6,9.7 C7.7,10.9 7.6,12.2 7.9,13.5 C8,13.8 8.1,14.2 8.2,14.5 C8.3,14.7 8.4,14.9 8.5,15.1 C8.7,15.3 8.9,15.5 9.1,15.7 C9.6,16 10.2,16 10.6,15.7 C10.7,15.6 10.8,15.5 10.9,15.5 L11.1,15.3 C11.2,15.2 11.3,15 11.5,14.9 C11.9,14.4 12.3,13.9 12.6,13.4 C12.8,13.2 12.9,12.9 13.1,12.7 L13.7,12 C14.4,10.9 14.9,9.8 15.4,8.7 C15.8,7.6 16.3,6.6 16.7,5.5 C16.9,5 17.1,4.5 17.4,4.1 C17.7,3.7 18,3.3 18.4,3 C19.1,2.4 20,2 20.8,2.2 C21.6,2.4 22.2,3.1 22.4,3.9 C22.6,4.7 22.4,5.7 22,6.6 C21.6,7.5 21.1,8.3 20.5,9.2 C19.9,10 19.3,10.8 18.7,11.7 C18.4,12.1 18.1,12.6 17.9,13.1 C17.7,13.6 17.5,14.2 17.5,14.8 C17.5,15.5 18,16.2 18.6,16.5 C18.9,16.7 19.1,16.8 19.4,16.9 C19.7,17 20,17.1 20.3,17.1 C21.6,17.1 22.5,16.5 23.3,15.9 C24.8,14.8 26.3,13.8 27.8,12.9 C29.3,12 30.8,11.1 32.2,10.3 C32.6,10.1 32.9,9.9 33.3,9.8 C33.6,9.7 33.9,9.6 34.2,9.6 C34.8,9.6 35.4,10 35.7,10.6 C35.8,10.9 35.9,11.2 35.9,11.5 C35.9,11.8 35.8,12.1 35.6,12.4 C35.2,13 34.8,13.6 34.3,14.2 C33.4,15.3 32.4,16.2 31.3,17 C30.2,17.8 29.1,18.4 28.1,19 C27,19.6 25.9,20.3 25.3,21.3 C25.1,21.6 25,21.9 25,22.2 C25,22.5 25,22.9 25.2,23.1 C25.5,23.7 25.9,24.1 26.5,24.3 C27,24.5 27.6,24.5 28.1,24.4 C28.6,24.3 29,24.1 29.4,23.9 C31,23.3 32.3,22.8 33.4,22.4 C34.5,22 35.3,21.6 35.9,21.4 C36.5,21.2 36.7,21 36.7,21 C36.7,21 36.4,21 35.8,21.2 C35.2,21.4 34.4,21.6 33.3,22 C32.2,22.4 30.8,22.8 29.2,23.4 C28.8,23.5 28.4,23.7 28,23.8 C27.6,23.9 27.2,23.8 26.8,23.7 C26,23.4 25.5,22.4 26,21.6 C27.1,19.9 29.8,19.3 31.9,17.6 C33,16.8 34.1,15.8 35.1,14.7 C35.6,14.1 36,13.5 36.5,12.8 C36.7,12.4 36.9,12 36.9,11.5 C36.9,11 36.8,10.5 36.6,10.1 C36.2,9.2 35.3,8.6 34.3,8.5 C33.8,8.5 33.3,8.6 32.9,8.8 C32.5,9 32.1,9.2 31.8,9.3 C30.3,10.1 28.8,10.9 27.2,11.9 C25.7,12.8 24.1,13.8 22.6,14.9 C21.9,15.4 21.1,15.9 20.4,15.8 C20.2,15.8 20.1,15.8 19.9,15.7 C19.7,15.6 19.5,15.5 19.4,15.5 C19.1,15.3 19,15.1 18.9,14.8 C18.9,14.2 19.4,13.3 19.9,12.5 C20.4,11.7 21.1,10.9 21.7,10 C22.3,9.1 22.9,8.2 23.4,7.2 C23.6,6.7 23.8,6.1 23.9,5.5 C24,4.9 24,4.2 23.8,3.6 C23.6,3 23.4,2.4 22.9,1.9 C22.4,1.4 21.8,1 21.2,0.9 C20.5,0.7 19.8,0.8 19.2,1 C18.6,1.2 18,1.6 17.5,2 C17,2.4 16.6,2.9 16.3,3.4 C15.9,3.9 15.7,4.5 15.5,5 C15.1,6.1 14.6,7.1 14.1,8.2 C13.6,9.2 13.2,10.3 12.6,11.2 L12.1,11.9 C11.9,12.2 11.7,12.4 11.6,12.6 C11.3,13.1 10.9,13.6 10.6,14 C10.5,14.1 10.4,14.2 10.3,14.3 L10.2,14.4 C10.2,14.4 10.2,14.4 10.2,14.4 C10.2,14.4 10.1,14.4 10.1,14.4 C10.1,14.4 10.1,14.4 10.1,14.4 C10.1,14.3 10,14.2 10,14.1 C9.9,13.9 9.8,13.6 9.8,13.4 C9.6,12.3 9.6,11.1 9.6,9.8 C9.6,9.2 9.5,8.5 9.4,7.8 C9.4,7.6 9.3,7.5 9.3,7.3 C9.3,7.1 9.2,6.9 9.1,6.8 C8.9,6.4 8.7,6.1 8.3,5.8 C7.6,5.2 6.8,5 6,5 C5.2,5 4.4,5.2 3.7,5.6 C3.4,5.8 3,6.1 2.8,6.4 C2.6,6.7 2.4,7 2.2,7.4 C1.9,8.1 1.7,8.7 1.5,9.4 C1.3,10.1 1.2,10.7 1.2,11.5 C1.1,12.2 1.2,12.9 1.3,13.6 C1.5,15 1.7,16.2 1.8,17.5 C1.9,18.8 1.9,20 1.8,21.3 C1.7,22.6 1.3,23.8 1,25.2 C0.7,26.6 0.5,27.9 0.4,29.3 C0.2,32.1 0.4,35.1 1.4,37.9 C1.9,39.3 2.7,40.6 3.7,41.8 C4.7,42.9 6.1,43.8 7.6,44.4 C9.1,44.9 10.7,45 12.2,44.9 C13.7,44.8 15.2,44.4 16.6,43.8 C19.4,42.7 21.9,41.1 24.5,39.9 C25.8,39.3 27.1,38.7 28.4,38.3 C29.7,37.9 31.2,37.7 32.7,37.3 C33.5,37.1 34.2,36.9 35,36.5 C35.4,36.3 35.7,36.2 36.2,35.9 C36.6,35.6 37,35.1 37.2,34.6 C37.6,33.6 37.4,32.5 36.8,31.6 C36,30.3 34.8,29.8 33.9,29.8 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:c66b743d753c": {
        "translation.x": { "0": { value: 74 } },
        "translation.y": { "0": { value: 123 } }
      },

      "haiku:b6ab7b588106": {
        d: {
          "0": {
            value: "M131.4,71.9 C124.6,59.3 124,45 120.1,31.5 C116.1,18 106.7,4 91.2,1 C84.4,-0.3 79.5,0.5 74.4,1.4 C69.3,0.4 64.3,-0.4 57.6,1 C42.1,4.1 32.7,18.1 28.7,31.5 C24.7,45 24.2,59.3 17.4,71.9 C11.2,83.4 -0.4,94.2 2,106.8 C3.8,116 12.7,122.8 21.3,128.4 C29.6,133.9 38.3,139.1 48.1,142.2 C56.5,144.8 66,145.7 74.5,143.5 C83,145.7 92.5,144.8 100.9,142.2 C110.7,139.1 119.3,133.9 127.7,128.4 C136.3,122.8 145.2,116.1 147,106.8 C149.2,94.3 137.6,83.4 131.4,71.9 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:0ad53d9450cd": {
        d: {
          "0": {
            value: "M139,121 L139.4,120.6 C142.2,118 144.7,115 146.2,111.6 C147,109.9 147.5,108.1 147.8,106.4 C147.9,105.5 148.1,104.6 148,103.7 C148,103.3 148,102.8 148,102.4 C148,102 147.9,101.5 147.9,101.1 C147.5,97.7 146.3,94.7 145,92 C143.7,89.4 142.2,87 140.8,85 C138,80.9 135.7,77.7 134.2,75.4 C133.8,74.8 133.5,74.3 133.2,73.9 C132.9,73.5 132.7,73.1 132.5,72.8 C132.1,72.2 131.9,71.9 131.8,71.9 L131.3,72.2 C131.3,72.2 131.4,72.6 131.7,73.2 C131.9,73.5 132.1,73.9 132.3,74.4 C132.6,74.9 132.9,75.4 133.2,76 C134.6,78.4 136.9,81.7 139.5,85.9 C140.8,88 142.2,90.3 143.5,92.8 C144.7,95.4 145.8,98.2 146.2,101.3 C146.2,101.7 146.3,102.1 146.3,102.5 C146.3,102.9 146.3,103.3 146.3,103.7 C146.3,104.5 146.2,105.3 146.1,106.1 C145.9,107.7 145.4,109.3 144.6,110.9 C143.2,114 140.9,116.8 138.2,119.4 L137.8,119.8 C133.4,123.8 128.4,127 123.4,130.2 C118.4,133.4 113.3,136.3 108,138.7 C102.7,141.1 97.1,142.8 91.5,143.6 C88.7,144 85.8,144.1 83,144 C81.6,143.9 80.2,143.8 78.8,143.6 C78.1,143.5 77.4,143.4 76.7,143.3 C76.4,143.2 76,143.2 75.7,143.1 L74.5,142.8 L73.3,143.1 C73,143.2 72.6,143.3 72.3,143.3 C71.6,143.4 70.9,143.6 70.3,143.6 C68.9,143.8 67.6,143.9 66.2,144 C63.5,144.1 60.7,144 58,143.6 C55.3,143.2 52.6,142.7 50,142 C47.4,141.3 44.8,140.3 42.3,139.3 C37.3,137.2 32.6,134.6 28,131.8 C25.7,130.4 23.5,129 21.3,127.5 C19.1,126 16.9,124.5 14.9,122.9 C10.8,119.7 7,116.1 4.7,111.7 C3.5,109.5 2.9,107.1 2.7,104.7 C2.6,102.3 3,99.8 3.7,97.5 C4.4,95.2 5.5,92.9 6.7,90.8 C7.9,88.6 9.2,86.6 10.6,84.5 C13.3,80.4 16.2,76.4 18.5,72.1 C19.7,69.9 20.6,67.7 21.5,65.4 C22.3,63.1 23,60.8 23.6,58.6 C24.8,54 25.7,49.4 26.6,45 C27.5,40.5 28.4,36.1 29.7,31.9 C31,27.7 32.6,23.7 34.7,20 C38.9,12.7 45,6.6 52.2,3.6 C55.8,2.1 59.6,1.4 63.4,1.2 C65.3,1.1 67.1,1.2 69,1.4 C69.9,1.5 70.8,1.6 71.7,1.8 L73.1,2 C73.6,2.1 74.1,2.2 74.6,2.3 C75.1,2.2 75.7,2.1 76.2,2 C76.7,1.9 77.2,1.8 77.7,1.7 C78.7,1.5 79.6,1.4 80.6,1.3 C82.5,1.1 84.4,1 86.3,1.1 C88.2,1.2 90,1.4 91.8,1.8 C92.7,2 93.6,2.2 94.4,2.5 C95.2,2.8 96.1,3.1 96.9,3.4 C100.2,4.7 103.1,6.6 105.7,8.8 C108.2,11 110.4,13.4 112.2,16 C115.9,21.1 118.2,26.5 119.8,31.7 C121.4,36.9 122.3,41.7 123.2,46.1 C124.1,50.5 124.9,54.3 125.8,57.6 C126.7,60.9 127.6,63.7 128.5,65.8 C128.7,66.3 128.9,66.9 129.1,67.3 C129.3,67.8 129.5,68.2 129.7,68.6 C130.1,69.4 130.4,70.1 130.7,70.6 C131,71.1 131.2,71.5 131.3,71.8 C131.4,72.1 131.5,72.2 131.5,72.2 C131.5,72.2 131.5,72.1 131.3,71.8 C131.2,71.5 131,71.1 130.7,70.6 C130.4,70.1 130.1,69.4 129.8,68.6 C129.6,68.2 129.4,67.8 129.2,67.3 C129,66.8 128.8,66.3 128.6,65.8 C127.8,63.6 126.9,60.9 126.1,57.6 C125.3,54.3 124.5,50.4 123.7,46.1 C122.8,41.7 121.9,36.9 120.4,31.6 C118.8,26.4 116.5,20.8 112.8,15.6 C110.9,13 108.8,10.5 106.1,8.2 C103.5,6 100.5,4 97.1,2.6 C96.2,2.3 95.4,2 94.5,1.7 C93.6,1.4 92.7,1.2 91.8,1 C90,0.6 88.1,0.3 86.1,0.2 C84.2,0.1 82.2,0.2 80.2,0.4 C79.2,0.5 78.2,0.6 77.2,0.8 C76.7,0.9 76.2,1 75.7,1.1 C75.2,1.2 74.8,1.3 74.3,1.3 C73.4,1.1 72.6,1 71.7,0.8 C70.8,0.6 69.8,0.5 68.9,0.4 C67,0.2 65.1,0.1 63.1,0.1 C59.2,0.3 55.2,1 51.4,2.6 C47.6,4.2 44.1,6.5 41,9.4 C37.9,12.3 35.3,15.7 33.1,19.5 C30.9,23.3 29.2,27.4 27.9,31.7 C26.6,36 25.7,40.4 24.8,44.9 C23.9,49.4 23,53.9 21.8,58.4 C21.2,60.7 20.5,62.9 19.7,65.1 C18.9,67.3 17.9,69.5 16.8,71.6 C14.6,75.8 11.7,79.8 8.9,83.9 C7.5,86 6.1,88.1 4.9,90.3 C3.7,92.5 2.5,94.8 1.7,97.3 C0.9,99.8 0.5,102.4 0.6,105.1 C0.8,107.8 1.5,110.4 2.7,112.8 C5.2,117.6 9.2,121.4 13.4,124.6 C15.5,126.2 17.7,127.8 19.9,129.2 C22.1,130.7 24.4,132.1 26.7,133.5 C31.3,136.3 36.1,139 41.2,141.1 C43.8,142.2 46.4,143.1 49.1,143.9 C51.8,144.7 54.6,145.2 57.4,145.6 C60.2,146 63.1,146.1 65.9,146 C67.3,145.9 68.8,145.8 70.2,145.6 C70.9,145.5 71.6,145.4 72.3,145.2 C72.7,145.1 73,145.1 73.4,145 L74.2,144.8 L75,145 C75.4,145.1 75.7,145.2 76.1,145.2 C76.8,145.3 77.5,145.5 78.3,145.6 C79.8,145.8 81.2,145.9 82.7,146 C85.6,146.1 88.6,146 91.5,145.6 C97.4,144.8 103.1,143 108.5,140.6 C113.9,138.2 119.1,135.2 124.2,132 C129.3,128.4 134.4,125.1 139,121 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:634dddd39868": {
        d: {
          "0": {
            value: "M196.2,191.3 C199.8,195.5 202.6,200.5 204.2,205.8 C193.7,212.7 181.2,215.9 168.8,217.6 C142.5,221.2 114.6,218.4 91.3,205.6 C90.6,205.2 89.8,204.7 89.5,203.9 C89.2,203 89.6,202.1 90,201.3 C92.1,197 94.7,193 97.9,189.5 C98.8,193.3 101.5,196.5 104.8,198.6 C108,200.8 111.8,202 115.5,203.1 C132.6,207.8 150.6,208 168.1,205.5 C173.5,204.7 178.9,203.7 183.9,201.5 C188.8,199.4 193.4,195.9 196.2,191.3 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:17a887a9c303": {
        d: {
          "0": {
            value: "M186.2,145.3 C186.8,142 183.8,139.1 180.8,137.4 C172.6,133 162.8,132.7 153.4,132.6 C141.3,132.5 128.9,132.6 117.3,136 C115.5,136.5 113.7,137.1 112.2,138.2 C110.7,139.3 109.5,141 109.4,142.8 C109.3,144.8 110.5,146.8 112.1,148 C113.7,149.2 115.8,149.8 117.8,150.2 C130.3,152.6 143.1,147.9 155.9,148.1 C162.6,148.2 169.2,149.7 175.8,150.1 C177.9,150.2 180,150.3 182,149.5 C184.1,148.9 185.8,147.3 186.2,145.3 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:55aea49bfac0": {
        "translation.x": { "0": { value: 74 } },
        "translation.y": { "0": { value: 197 } }
      },

      "haiku:fe8475966823": {
        d: {
          "0": {
            value: "M140.1,2.6 C134.9,0.1 128.8,3.3 123.6,5.9 C110.5,12.4 95.7,15.3 81.1,14.4 L68.7,14.4 C54.1,15.3 39.3,12.3 26.2,5.9 C21,3.3 15,0.1 9.7,2.6 C6.8,7 4.9,12.5 2,16.8 C26.5,22.9 45.4,46.6 46,71.9 C55.2,75.1 65.1,76.3 74.8,75.5 C84.5,76.3 94.4,75 103.6,71.9 C104.1,46.7 123.1,22.9 147.6,16.8 C144.9,12.5 143,7 140.1,2.6 Z"
          }
        },

        fill: { "0": { value: "#88BA87" } }
      },

      "haiku:875599f6a329": {
        d: {
          "0": {
            value: "M80.6,76.5 C80.6,76.5 80.6,76.5 80.6,76.5 C78.7,76.5 76.8,76.4 74.9,76.3 C73,76.4 71.1,76.5 69.2,76.5 C61.2,76.5 53.3,75.2 45.8,72.6 L45.3,72.4 L45.3,71.8 C44.8,46.9 26.1,23.5 1.9,17.5 L0.8,17.2 L1.4,16.3 C2.8,14.2 4,11.7 5.2,9.3 C6.4,6.9 7.6,4.3 9.1,2.1 L9.2,1.9 L9.4,1.8 C10.8,1.1 12.3,0.8 13.9,0.8 C18,0.8 22.2,2.9 26,4.8 L26.6,5.1 C38,10.7 50.8,13.7 63.6,13.7 C65.3,13.7 67,13.6 68.6,13.5 L81,13.5 C82.7,13.6 84.4,13.7 86.1,13.7 C99,13.7 111.8,10.7 123.1,5.1 L123.7,4.8 C127.4,2.9 131.7,0.8 135.8,0.8 C137.4,0.8 138.9,1.1 140.3,1.8 L140.5,1.9 L140.6,2.1 C142.1,4.3 143.3,6.9 144.5,9.3 C145.7,11.7 146.9,14.2 148.3,16.3 L148.9,17.2 L147.8,17.5 C123.6,23.5 104.9,46.9 104.4,71.8 L104.4,72.4 L103.9,72.6 C96.5,75.2 88.6,76.5 80.6,76.5 Z M75,74.7 L75,74.7 C76.9,74.9 78.8,74.9 80.7,74.9 C88.3,74.9 95.8,73.7 103,71.3 C103.8,46.3 122.3,22.9 146.5,16.3 C145.3,14.3 144.2,12.1 143.2,10 C142.1,7.7 140.9,5.3 139.5,3.2 C138.4,2.7 137.2,2.5 135.9,2.5 C132.2,2.5 128.1,4.5 124.5,6.3 L123.9,6.6 C112.3,12.3 99.2,15.4 86.1,15.4 C84.4,15.4 82.7,15.3 81,15.2 L68.7,15.2 C67.1,15.3 65.3,15.4 63.6,15.4 C50.5,15.4 37.4,12.4 25.8,6.6 L25.2,6.3 C21.6,4.5 17.6,2.5 13.8,2.5 C12.5,2.5 11.3,2.7 10.2,3.2 C8.8,5.3 7.7,7.7 6.5,10 C5.5,12.1 4.4,14.3 3.2,16.3 C27.4,22.9 45.9,46.2 46.7,71.3 C53.9,73.7 61.4,74.9 69,74.9 C71.2,75 73,74.9 75,74.7 L75,74.7 Z"
          }
        },

        fill: { "0": { value: "#29783B" } }
      },

      "haiku:2fd0514aa4ca": {
        d: {
          "0": {
            value: "M133.6,256.7 C133.7,259.3 133.4,261.9 132.3,264.3 C131.2,266.6 129.2,268.6 126.7,269.4 C122.2,270.9 117.4,268.3 113.4,265.6 C107.4,261.5 101.6,256.7 97.3,250.8 C93,244.8 90.3,237.5 91,230.2 C91.2,227.6 92.3,224.7 94.8,224 C96.2,223.6 97.7,224.2 99.1,224.7 C106.8,227.7 114.7,230.8 121.3,235.8 C127.9,241 133.2,248.4 133.6,256.7 Z"
          }
        },

        fill: { "0": { value: "#409143" } }
      },

      "haiku:7208022af41e": {
        d: {
          "0": {
            value: "M160.1,256.7 C160,259.3 160.3,261.9 161.4,264.3 C162.5,266.7 164.5,268.6 167,269.4 C171.5,270.9 176.3,268.3 180.3,265.6 C186.3,261.5 192.1,256.7 196.4,250.8 C200.7,244.8 203.4,237.5 202.7,230.2 C202.5,227.6 201.4,224.7 198.9,224 C197.5,223.6 196,224.2 194.6,224.7 C186.9,227.7 179,230.8 172.4,235.8 C165.7,241 160.5,248.4 160.1,256.7 Z"
          }
        },

        fill: { "0": { value: "#409143" } }
      },

      "haiku:600d3308432b": {
        "translation.x": { "0": { value: 32 } },
        "translation.y": { "0": { value: 210 } }
      },

      "haiku:834329c1b750": { "translation.x": { "0": { value: 14 } } },
      "haiku:6a947236f66a": {
        d: {
          "0": {
            value: "M35.5,3 C27.1,-2.1 15.4,0.2 8.6,7.3 C1.8,14.4 -0.1,25.3 2.6,34.8 C5.3,44.2 12.1,52.2 20.4,57.5 C28.7,62.8 38.3,65.7 47.9,67.3 C53.4,68.2 59.1,68.7 64.5,67.6 C70,66.4 75.2,63.4 78,58.5 C83,49.6 78.3,38.4 72.2,30.2 C60.4,14.4 52.2,13.2 35.5,3 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:a678b2d13239": {
        d: {
          "0": {
            value: "M59.7,16.1 L59.5,15.9 C56.4,13.6 53.2,11.9 50.4,10.3 C47.5,8.8 44.9,7.4 42.8,6.3 C38.5,4 35.8,2.5 35.7,2.7 L35.4,3.2 C35.4,3.3 36,3.7 37.1,4.5 C38.2,5.3 39.9,6.3 42.1,7.6 C44.2,8.9 46.8,10.3 49.6,11.9 C52.4,13.5 55.5,15.3 58.5,17.5 L58.7,17.7 C64.2,21.7 68.7,26.8 72.5,32.2 C74.4,34.9 76,37.8 77.2,40.8 C78.4,43.8 79.2,46.9 79.2,50.1 L79.2,51.3 C79.2,51.7 79.1,52.1 79.1,52.5 C79,53.3 78.8,54 78.7,54.8 C78.6,55.2 78.5,55.5 78.3,55.9 C78.2,56.3 78.1,56.6 77.9,57 C77.6,57.7 77.3,58.4 76.8,59 C75.2,61.5 72.8,63.5 70.1,64.9 C67.4,66.3 64.5,67.1 61.5,67.4 C58.5,67.7 55.5,67.6 52.6,67.3 C40.8,65.9 29.7,62.8 20.8,57.1 C11.9,51.5 5.6,43.3 3.1,34.8 C1.9,30.5 1.7,26.2 2.2,22.3 C2.8,18.3 4.1,14.7 5.9,11.7 C6.8,10.2 7.9,8.9 9,7.7 C9.6,7.1 10.1,6.6 10.8,6.1 C11.4,5.6 12,5.2 12.7,4.7 C15.2,3 17.9,2 20.3,1.5 C22.7,0.9 25,0.8 26.9,0.9 C28.8,1 30.4,1.4 31.7,1.8 C33,2.2 33.9,2.6 34.5,2.9 C35.1,3.2 35.4,3.3 35.5,3.3 C35.5,3.3 35.2,3.1 34.6,2.7 C34,2.3 33.1,1.9 31.8,1.4 C30.5,0.9 28.9,0.5 26.9,0.3 C24.9,0.1 22.6,0.2 20.1,0.7 C17.6,1.2 14.8,2.2 12.2,3.9 C11.5,4.3 10.9,4.8 10.2,5.3 C9.5,5.8 8.9,6.4 8.3,7 C7.1,8.2 6,9.6 5,11.1 C3,14.2 1.6,17.9 1,22 C0.4,26.1 0.5,30.6 1.8,35.1 C4.2,44 10.8,52.5 19.9,58.4 C24.4,61.3 29.6,63.6 35,65.3 C40.5,67 46.2,68.2 52.3,68.9 C55.3,69.2 58.4,69.3 61.6,69 C64.7,68.7 67.9,67.8 70.8,66.3 C73.7,64.8 76.3,62.6 78.2,59.8 C79.1,58.4 79.8,56.8 80.3,55.2 C80.5,54.4 80.7,53.5 80.8,52.7 C80.8,52.3 80.9,51.9 80.9,51.4 L80.9,50.1 C80.9,46.7 80,43.3 78.8,40.2 C77.5,37 75.9,34.1 73.9,31.2 C71.9,28.4 69.8,25.7 67.4,23.2 C65.2,20.6 62.6,18.2 59.7,16.1 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:4331da254257": {
        d: {
          "0": {
            value: "M77.4,63.1 C80.7,62.4 84,61.2 86.3,58.8 C90.3,54.5 89.8,47.5 87.1,42.2 C84.4,36.9 80.2,32.7 76.9,27.8 C80.4,30.9 79.6,37.2 76,40.2 C72.4,43.2 66.9,43.2 62.7,41.2 C58.5,39.2 55.1,35.7 52.2,32 C53.4,42 53.6,52.1 52.8,62.1 C60.8,64.6 69.3,64.9 77.4,63.1 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:f562caf4be81": {
        "translation.x": { "0": { value: 8 } },
        "translation.y": { "0": { value: 7 } }
      },

      "haiku:12729752e6d2": {
        d: {
          "0": {
            value: "M21.5,1.7 C16.5,0.4 10.7,0.5 6.8,3.9 C4,6.4 2.7,10.1 1.8,13.8 C-0.9,25.9 0.6,39 6.1,50.2 C9,56.1 13.1,61.5 18.7,64.8 C24.3,68.1 31.7,68.9 37.4,65.6 C44.1,61.8 47,53.6 47.7,45.9 C48.6,36.6 47.1,27 42.6,18.8"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:a88985407d0b": {
        d: {
          "0": {
            value: "M48.7,36.5 L48.7,36.3 C48.3,31.1 46.9,26.6 45.6,23.4 C44.3,20.3 43,18.6 42.9,18.6 L42.4,18.9 C42.2,19 43.2,20.8 44.3,23.9 C45.4,27 46.5,31.4 47,36.4 L47,36.6 C47.2,38.9 47.2,41.2 47.1,43.4 C47,45.7 46.7,47.9 46.3,50.1 C45.4,54.4 43.7,58.6 40.8,61.7 C39.4,63.2 37.7,64.5 35.8,65.3 C33.9,66.1 31.9,66.6 29.9,66.6 C25.8,66.7 21.8,65.5 18.6,63.5 C15.3,61.4 12.6,58.6 10.4,55.5 C8.2,52.4 6.6,49.1 5.2,45.8 C2.5,39.2 1.4,32.5 1.3,26.5 C1.2,23.5 1.4,20.6 1.8,17.9 C2.2,15.2 2.7,12.6 3.4,10.4 C4.1,8.1 5.2,6.2 6.6,4.7 C8,3.2 9.7,2.3 11.2,1.8 C14.4,0.8 17.1,1 18.9,1.2 C20.7,1.4 21.6,1.6 21.6,1.6 C21.6,1.6 21.4,1.5 20.9,1.3 C20.5,1.2 19.8,1 18.9,0.8 C17.1,0.5 14.4,0.1 10.9,1.1 C9.2,1.6 7.4,2.5 5.9,4.1 C4.4,5.6 3.2,7.7 2.4,10.1 C1.6,12.5 1,15 0.6,17.8 C0.2,20.6 -5.68434189e-14,23.5 -5.68434189e-14,26.6 C0.1,32.8 1.2,39.6 3.8,46.4 C5.1,49.8 6.8,53.2 9.1,56.4 C11.3,59.6 14.2,62.6 17.7,64.9 C21.2,67.2 25.5,68.5 30,68.4 C32.2,68.3 34.5,67.9 36.6,66.9 C38.7,66 40.6,64.6 42.2,62.9 C43.8,61.2 45,59.2 46,57.1 C47,55 47.7,52.8 48.1,50.5 C48.6,48.2 48.8,45.9 49,43.5 C48.9,41.3 48.9,38.9 48.7,36.5 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:4b6f95d5646e": { "translation.y": { "0": { value: 25 } } },
      "haiku:5e39df74875e": {
        d: {
          "0": {
            value: "M46.9,53.7 C50.6,42 49.7,29 44.4,18 C45.8,14.4 45.8,10.4 44.5,6.8 C43.4,4 40.9,1.1 37.9,1.6 C36.1,1.9 34.7,3.4 33.9,5 C33.1,6.7 33,8.5 32.8,10.3 C31.9,7.8 30.9,5.2 28.9,3.4 C27,1.6 23.8,0.8 21.6,2.3 C19.4,3.9 19.7,8 22.3,8.6 C20.9,6.9 19.1,5.5 16.9,5.2 C14.8,4.9 12.4,6 11.6,8 C10.8,10 12.3,12.7 14.4,12.8 C12.6,12.4 10.6,12.1 8.8,12.5 C7,13 5.3,14.4 5,16.2 C4.7,18.1 6.4,20.1 8.3,19.7 C6.5,19.4 4.5,19.7 3.1,20.9 C1.7,22.1 0.9,24.2 1.7,25.9 C2.4,27.6 4.8,28.4 6.3,27.3 C7.3,40.2 14.4,52.6 25,60 C29.6,63.2 35.9,65.5 40.8,62.7 C44.1,60.9 45.8,57.2 46.9,53.7 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:f2f5353fbbeb": {
        d: {
          "0": {
            value: "M26.8,62.2 L27,62.3 C30.1,64.1 33.6,65.1 36.9,64.8 C38.5,64.7 40.1,64.1 41.3,63.4 C42.5,62.6 43.5,61.7 44.2,60.7 C45.7,58.8 46.3,56.9 46.7,55.7 C47.1,54.5 47.2,53.8 47.1,53.7 L46.5,53.5 C46.4,53.5 46.1,54.1 45.6,55.3 C45.1,56.4 44.3,58.1 42.9,59.8 C42.2,60.6 41.3,61.4 40.3,62 C39.2,62.6 38,63 36.6,63.1 C33.8,63.3 30.7,62.4 27.7,60.7 L27.5,60.6 C26,59.8 24.6,58.7 23.2,57.6 C21.9,56.5 20.6,55.4 19.4,54.1 C17,51.6 14.9,48.9 13.2,46 C11.5,43.1 10.1,40 9,36.8 C8.7,36 8.5,35.2 8.3,34.4 C8.1,33.6 7.9,32.8 7.7,32 C7.6,31.2 7.4,30.4 7.3,29.6 C7.2,28.3 7,27.1 6.9,25.9 L5.8,26.6 C5.6,26.7 5.5,26.8 5.3,26.9 C5.2,26.9 5.1,27 5,27 L4.9,27 C4.7,27 4.4,27 4.2,27 C3.7,26.9 3.2,26.7 2.8,26.3 C2.1,25.6 1.9,24.4 2.3,23.4 C2.7,22.3 3.5,21.5 4.6,21.1 C5.7,20.6 6.9,20.6 8.1,20.7 C8.1,20.1 8.1,19.6 8.1,19 C7.2,19.2 6.2,18.4 5.9,17.3 C5.6,16.3 6.1,15.2 7,14.4 C7.9,13.6 9.1,13.2 10.3,13.2 C11.6,13.1 12.9,13.4 14.2,13.7 C14.3,13.1 14.3,12.6 14.4,12.1 C13.3,12.1 12.2,10.8 12.2,9.5 C12.1,8.3 13,7.1 14.3,6.5 C15.6,5.9 17,6 18.3,6.5 C19.6,7.1 20.7,8 21.7,9.1 C22,8.7 22.2,8.3 22.5,7.8 C21.8,7.6 21.2,7 21,6.2 C20.8,5.4 20.9,4.5 21.2,3.8 C21.4,3.4 21.6,3.1 21.9,2.9 C22.2,2.7 22.6,2.5 23,2.4 C23.8,2.2 24.7,2.2 25.5,2.4 C26.4,2.6 27.2,3 27.8,3.6 C28.5,4.1 29.1,4.8 29.6,5.6 C29.8,6 30.1,6.4 30.3,6.8 C30.4,7 30.5,7.2 30.6,7.4 L30.8,7.9 L31.1,8.5 C31.8,10.1 32.4,11.9 33,13.4 C33.1,12.1 33.2,10.9 33.4,9.6 C33.5,9 33.5,8.4 33.6,7.8 L33.7,7.4 L33.8,7.1 L33.9,6.7 C34.2,5.5 34.7,4.5 35.5,3.7 C36.2,2.9 37.2,2.3 38.2,2.3 C39.2,2.2 40.2,2.6 41.1,3.3 C41.9,4 42.6,4.8 43.2,5.8 C43.7,6.7 44.1,7.8 44.3,8.8 C44.8,10.9 44.9,13 44.6,15 C44.5,15.5 44.4,16 44.3,16.5 C44.2,16.7 44.2,17 44.1,17.2 C44.1,17.3 44,17.4 44,17.5 L43.8,18 L43.7,18.1 C43.7,18.1 43.7,18.2 43.7,18.2 L43.8,18.5 L44,18.9 L44.3,19.6 C44.5,20 44.7,20.5 44.9,20.9 C45.3,21.8 45.6,22.7 45.9,23.5 C46.2,24.4 46.5,25.2 46.7,26.1 C47.7,29.5 48.2,32.7 48.5,35.7 C49,41.6 48.4,46.1 47.8,49.2 C47.2,52.3 46.7,53.8 46.8,53.9 C46.8,53.9 47,53.5 47.2,52.8 C47.5,52 47.8,50.9 48.2,49.4 C48.9,46.3 49.6,41.7 49.3,35.7 C49.1,32.7 48.6,29.4 47.7,25.9 C47.5,25 47.2,24.1 46.9,23.2 C46.6,22.3 46.3,21.4 45.9,20.5 C45.7,20 45.5,19.6 45.3,19.1 C45.1,18.7 44.8,18.1 44.9,18 L45,17.8 C45,17.7 45.1,17.6 45.1,17.4 C45.2,17.1 45.3,16.9 45.3,16.6 C45.4,16.1 45.6,15.6 45.6,15 C46,12.9 45.9,10.6 45.4,8.4 C44.9,6.2 43.8,3.8 41.8,2.2 C41.3,1.8 40.7,1.5 40.1,1.2 C39.5,1 38.8,0.9 38.1,0.9 C36.7,1 35.4,1.7 34.5,2.7 C33.6,3.7 32.9,5 32.6,6.3 L32.5,6.8 L32.5,7 L32.5,7.2 L32.4,7.6 C32.3,7.4 32.3,7.2 32.2,7 L32.1,6.8 C32,6.6 31.9,6.4 31.8,6.1 C31.6,5.7 31.3,5.2 31,4.8 C30.4,3.9 29.8,3.1 28.9,2.5 C28.1,1.8 27.1,1.3 26,1 C24.9,0.7 23.8,0.7 22.6,1 C22,1.2 21.5,1.4 21,1.8 C20.5,2.2 20.1,2.7 19.8,3.2 C19.3,4.3 19.1,5.5 19.4,6.7 C19.5,7.3 19.8,7.9 20.3,8.4 C20.7,8.9 21.4,9.3 22,9.4 L24.3,9.9 L22.8,8.1 C21.8,6.8 20.5,5.7 18.8,5 C18,4.7 17.1,4.4 16.2,4.4 C15.3,4.4 14.4,4.6 13.5,4.9 C12.7,5.3 11.9,5.8 11.3,6.6 C10.7,7.4 10.4,8.4 10.4,9.4 C10.5,10.4 10.8,11.4 11.5,12.1 C12.1,12.9 13.1,13.5 14.2,13.5 L14.4,11.9 C13,11.6 11.6,11.3 10.1,11.4 C8.6,11.4 7,11.9 5.7,13 C5.1,13.5 4.5,14.2 4.2,15 C3.9,15.8 3.8,16.8 4.1,17.6 C4.4,18.5 4.9,19.2 5.6,19.8 C6.3,20.4 7.3,20.7 8.3,20.5 L13.1,19.6 L8.2,18.8 C6.7,18.6 5.2,18.7 3.8,19.3 C3.1,19.6 2.4,20 1.8,20.6 C1.2,21.2 0.8,21.9 0.5,22.6 C0.2,23.4 0.1,24.2 0.3,25.1 C0.4,25.9 0.8,26.8 1.5,27.4 C2.1,28 2.9,28.4 3.8,28.6 C4.2,28.7 4.7,28.7 5.1,28.6 L5.3,28.6 C5.3,28.6 5.3,28.6 5.3,28.6 L5.3,28.6 L5.3,28.6 C5.3,28.6 5.3,28.6 5.3,28.6 L5.4,29.8 C5.5,30.6 5.7,31.5 5.8,32.3 C6,33.1 6.2,34 6.4,34.8 C6.6,35.6 6.9,36.5 7.1,37.3 C8.2,40.6 9.6,43.8 11.4,46.9 C13.2,49.9 15.4,52.8 17.9,55.4 C19.1,56.7 20.5,57.9 21.9,59 C23.7,60.2 25.1,61.3 26.8,62.2 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:9320292075fc": {
        "translation.x": { "0": { value: 73 } },
        "translation.y": { "0": { value: 54 } }
      },

      "haiku:9dda064f4a6b": {
        d: {
          "0": {
            value: "M1.9,11.6 C1.2,16.1 0.8,20.6 1.9,25 C2.9,29.4 5.6,33.6 9.6,35.6 C13.6,37.6 19.1,37 21.9,33.5 C25.1,29.6 24.3,23.9 23.3,19 C22.4,14.3 21.4,9.3 18.2,5.6 C15,1.9 9,0.3 5.3,3.4 C3.2,5.4 2.4,8.6 1.9,11.6 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:4954442eae63": {
        d: {
          "0": {
            value: "M7,1.5 L6.9,1.5 C5.3,2.1 4,3.4 3.3,4.6 C2.5,5.9 2.2,7.1 1.9,8.1 C1.5,10.2 1.5,11.4 1.6,11.4 L2.2,11.5 C2.4,11.5 2.7,10.3 3.3,8.5 C3.6,7.6 4,6.5 4.7,5.5 C5.4,4.5 6.3,3.6 7.6,3.1 L7.7,3.1 C8.8,2.6 10.1,2.5 11.4,2.7 C12.7,2.9 13.9,3.3 15,4 C16.1,4.6 17.1,5.5 17.9,6.4 C18.7,7.4 19.4,8.5 19.9,9.6 C21,11.9 21.6,14.4 22.1,16.9 C22.6,19.4 23.1,21.9 23.3,24.2 C23.5,26.6 23.3,28.9 22.5,30.9 C22.1,31.9 21.5,32.8 20.8,33.5 C20.1,34.2 19.2,34.8 18.3,35.2 C16.4,36 14.4,36.1 12.5,35.7 C10.6,35.4 9,34.5 7.6,33.3 C4.9,31 3.4,27.9 2.6,25.2 C1.8,22.4 1.7,19.9 1.7,17.8 C1.8,13.7 2.2,11.4 2,11.4 C1.9,11.4 1.8,11.9 1.6,13 C1.4,14.1 1.1,15.7 1,17.8 C0.9,19.9 0.9,22.5 1.6,25.5 C2.3,28.4 3.8,31.7 6.8,34.3 C9.6,36.9 14.5,38.3 18.9,36.6 C20,36.2 21,35.5 21.9,34.7 C22.8,33.8 23.5,32.8 24,31.6 C25,29.3 25.2,26.7 25,24.2 C24.8,21.7 24.3,19.2 23.8,16.6 C23.3,14.1 22.6,11.4 21.5,8.9 C20.9,7.6 20.2,6.4 19.3,5.3 C18.4,4.2 17.2,3.2 15.9,2.4 C14.6,1.7 13.2,1.1 11.7,0.9 C10.2,0.8 8.5,0.9 7,1.5 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:417afe484442": {
        d: {
          "0": {
            value: "M94.1,70 C92.1,67.6 89.4,65.7 86.3,64.4 C85.3,64 84.3,63.7 83.2,63.9 C81.9,64.2 81,65.2 80.3,66.3 C76.5,72.3 77.4,80.4 82.3,85.7 C84.3,87.8 87.1,89.5 90.2,89.2 C93.9,88.9 96.6,85.6 97.3,82.3 C98.4,77.2 97.6,74.1 94.1,70 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:9ac2bb6656de": {
        "translation.x": { "0": { value: 78 } },
        "translation.y": { "0": { value: 62 } }
      },

      "haiku:ab6b75219c59": {
        d: {
          "0": {
            value: "M0.3,1 C2.9,0.9 5.8,0.9 7.9,2.5 C9.6,3.8 10.4,5.8 11.2,7.8 C11.6,8.7 12,9.8 11.7,10.7 C11.3,12.4 9.3,13.1 8.1,14.3 C6.1,16.2 6,19.8 7.9,21.8 C9.8,23.8 13.4,23.9 15.4,22"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:5d53805d402e": {
        d: {
          "0": {
            value: "M11,24.2 L11,24.2 C12.5,24.4 13.9,24 14.7,23.4 C15.5,22.9 15.8,22.3 15.7,22.2 L15.3,21.8 C15.2,21.7 14.7,21.9 14.1,22.1 C13.4,22.3 12.4,22.5 11.3,22.4 L11.3,22.4 C10.3,22.3 9.4,21.8 8.7,21.2 C8.1,20.5 7.7,19.6 7.6,18.7 C7.5,17.8 7.7,16.8 8,16 C8.2,15.6 8.5,15.2 8.8,14.9 C9.1,14.6 9.5,14.3 9.9,14 C10.7,13.4 11.7,12.8 12.3,11.7 C12.6,11.2 12.7,10.5 12.7,9.9 C12.7,9.3 12.5,8.8 12.4,8.3 C12.1,7.4 11.7,6.6 11.3,5.8 C10.9,5 10.5,4.3 10,3.6 C9.5,2.9 8.9,2.3 8.3,1.9 C7.7,1.5 7,1.2 6.4,1 C5.1,0.6 4,0.6 3.1,0.6 C1.3,0.6 0.4,0.8 0.4,1 C0.4,1.1 1.4,1.2 3.1,1.4 C3.9,1.5 5,1.6 6.1,2.1 C7.2,2.5 8.2,3.3 9,4.5 C9.8,5.7 10.4,7.3 11,8.9 C11.3,9.7 11.3,10.4 11,11 C10.7,11.6 9.9,12.1 9.1,12.7 C8.7,13 8.2,13.3 7.8,13.7 C7.4,14.1 7,14.6 6.7,15.2 C6.1,16.3 5.9,17.6 6,18.9 C6.1,20.2 6.7,21.5 7.6,22.5 C8.3,23.5 9.6,24.1 11,24.2 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:3bfdc53b26ef": {
        "translation.x": { "0": { value: 202 } },
        "translation.y": { "0": { value: 55 } }
      },

      "haiku:efc6a296cf00": {
        d: {
          "0": {
            value: "M23.1,10.6 C23.8,15.1 24.2,19.6 23.1,24 C22.1,28.4 19.4,32.6 15.4,34.6 C11.4,36.6 5.9,36 3.1,32.5 C-0.1,28.6 0.7,22.9 1.7,18 C2.6,13.3 3.6,8.3 6.8,4.6 C9.9,0.9 16,-0.7 19.7,2.4 C21.9,4.4 22.7,7.6 23.1,10.6 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:7804fd6e77a9": {
        d: {
          "0": {
            value: "M17.4,2.2 L17.4,2.2 C18.7,2.7 19.7,3.6 20.4,4.6 C21.1,5.6 21.5,6.7 21.8,7.6 C22.4,9.4 22.7,10.7 22.9,10.6 L23.5,10.5 C23.6,10.5 23.7,9.2 23.2,7.2 C23,6.2 22.6,4.9 21.8,3.7 C21,2.5 19.8,1.2 18.2,0.6 L18.1,0.6 C16.6,1.55431223e-15 15,-0.1 13.5,0.1 C12,0.3 10.6,0.9 9.3,1.6 C8,2.3 6.9,3.3 5.9,4.5 C5,5.6 4.3,6.9 3.7,8.1 C2.5,10.6 1.9,13.3 1.4,15.8 C0.9,18.3 0.4,20.8 0.2,23.4 C-8.04911693e-16,25.9 0.2,28.5 1.2,30.8 C1.7,32 2.4,33 3.3,33.9 C4.2,34.8 5.3,35.4 6.3,35.8 C10.7,37.5 15.5,36.2 18.4,33.5 C21.4,30.9 22.8,27.6 23.6,24.7 C24.3,21.8 24.3,19.1 24.2,17 C24.1,14.9 23.8,13.3 23.6,12.2 C23.4,11.1 23.2,10.6 23.2,10.6 C23,10.6 23.4,12.9 23.5,17 C23.5,19.1 23.4,21.6 22.6,24.4 C21.8,27.1 20.3,30.2 17.6,32.5 C16.2,33.6 14.6,34.5 12.7,34.9 C10.8,35.3 8.8,35.1 6.9,34.4 C6,34 5.1,33.5 4.4,32.7 C3.7,32 3.1,31.1 2.7,30.1 C1.8,28.1 1.7,25.8 1.9,23.4 C2.1,21 2.6,18.6 3.1,16.1 C3.6,13.6 4.3,11.1 5.3,8.8 C5.8,7.6 6.5,6.5 7.3,5.6 C8.1,4.6 9.1,3.8 10.2,3.2 C11.3,2.6 12.5,2.1 13.8,1.9 C14.9,1.6 16.2,1.7 17.4,2.2 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:a6cb33bdb281": {
        d: {
          "0": {
            value: "M217.9,60.5 C214,61.7 211.1,65.1 209.8,69 C208.4,72.8 208.5,77 209,81 C209.3,83.4 210.2,86.2 212.5,86.8 C214,87.2 215.6,86.4 216.9,85.5 C220.2,83.1 222.5,79.5 223.2,75.5 C223.9,71.5 223.1,67.3 220.9,63.9 C219.5,61.7 220.4,59.7 217.9,60.5 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:f085254a56e8": {
        "translation.x": { "0": { value: 210 } },
        "translation.y": { "0": { value: 63 } }
      },

      "haiku:5cb39aa0dd20": {
        d: {
          "0": {
            value: "M7.1,0.2 C4,2.3 2,6 2.1,9.8 C2.1,10.8 2.3,11.8 2.9,12.5 C3.7,13.4 5,13.8 5.9,14.6 C7.4,16.1 7.1,18.7 5.8,20.3 C4.5,21.9 2.5,22.8 0.5,23.7"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:385b5f831368": {
        d: {
          "0": {
            value: "M3.3,21.3 L3.3,21.3 C1.7,22.3 0.2,23.1 0.4,23.4 L0.6,24 C0.7,24.2 1.1,24.1 1.8,24 C2.5,23.8 3.3,23.5 4.3,22.9 L4.3,22.9 C5.1,22.4 5.9,21.7 6.6,20.9 C7.2,20 7.6,19.1 7.8,18.1 C7.9,17.1 7.8,16 7.3,15.1 C7,14.6 6.7,14.2 6.3,13.9 C5.9,13.6 5.5,13.4 5.2,13.2 C4.5,12.8 3.9,12.5 3.6,12.1 C3.3,11.7 3.1,11.1 3,10.4 C2.9,9.1 3,7.8 3.3,6.7 C3.9,4.5 5,2.9 5.9,1.9 C6.8,0.9 7.4,0.4 7.3,0.3 C7.2,0.2 6.5,0.5 5.4,1.4 C4.3,2.3 2.9,3.9 2.1,6.3 C1.7,7.5 1.4,8.9 1.5,10.5 C1.5,11.3 1.7,12.2 2.3,13 C2.9,13.8 3.7,14.3 4.4,14.6 C5.1,15 5.6,15.3 5.9,15.9 C6.2,16.4 6.3,17.1 6.2,17.8 C6.1,18.5 5.8,19.2 5.4,19.8 C4.6,20.3 4,20.8 3.3,21.3 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:82310f028987": {
        "translation.x": { "0": { value: 82 } },
        "translation.y": { "0": { value: 15 } }
      },

      "haiku:d78b7e575ac6": {
        d: {
          "0": {
            value: "M133.9,82 C132.4,76.5 129.5,71.4 128.2,65.9 C127,60.7 127.2,55.4 126.8,50.1 C125.3,28.4 112.2,13.4 92,6 C90.1,5.3 73.4,0.8 68.4,1.6 C63.4,0.8 46.7,5.3 44.8,6 C24.6,13.4 11.5,28.4 10,50.1 C9.6,55.4 9.8,60.8 8.6,65.9 C7.3,71.4 4.3,76.5 2.9,82 C-8.8817842e-16,92.8 3.2,104.8 10.5,113.3 C17.7,121.8 28.7,126.8 39.8,127.6 C44.3,127.9 48.9,127.6 53.4,127.2 C58.4,126.8 63.4,126.3 68.4,125.8 C73.4,126.3 78.4,126.8 83.4,127.2 C87.9,127.6 92.5,127.9 97,127.6 C108.1,126.8 119.1,121.8 126.3,113.3 C133.5,104.8 136.7,92.8 133.9,82 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:41d728dc6369": {
        d: {
          "0": {
            value: "M112.4,124.6 L112.9,124.4 C119.4,121.4 124.9,116.9 128.5,111.9 C132.2,106.9 134.1,101.5 135,96.9 C135.8,92.3 135.6,88.4 135.2,85.9 C135.1,85.3 135,84.7 134.9,84.2 C134.8,83.7 134.7,83.3 134.6,83 C134.4,82.3 134.3,82 134.2,82 L133.6,82.2 C133.6,82.2 133.6,82.6 133.7,83.2 C133.7,83.5 133.8,83.9 133.9,84.4 C134,84.9 134,85.4 134.1,86.1 C134.4,88.6 134.4,92.3 133.5,96.7 C132.6,101.1 130.6,106.2 127.1,111 C123.6,115.8 118.4,120 112.1,122.9 L111.6,123.1 C108.3,124.6 104.7,125.6 101.1,126.3 C97.5,126.9 93.9,127 90.2,126.9 C86.5,126.8 82.9,126.4 79.2,126.1 C75.5,125.8 71.9,125.4 68.2,125.1 C63.1,125.6 58,126.1 52.9,126.5 C47.9,126.9 42.9,127.3 38,126.7 C28.3,125.7 19,121.4 12.4,114.6 C5.8,107.9 2.1,98.5 2.4,89.5 C2.5,87.2 2.7,85 3.3,82.8 C3.8,80.6 4.6,78.5 5.5,76.4 C6.3,74.3 7.3,72.2 8,70 C8.8,67.8 9.4,65.6 9.7,63.3 C10.4,58.8 10.2,54.3 10.6,50 C10.9,45.7 11.7,41.5 13,37.5 C14.3,33.5 16.1,29.7 18.4,26.4 C20.7,23 23.4,20 26.4,17.4 C27.2,16.8 27.9,16.1 28.7,15.5 C29.5,14.9 30.3,14.3 31.1,13.7 C32.8,12.6 34.4,11.6 36.1,10.7 C39.5,8.9 43.1,7.2 46.6,6.2 C50.2,5.2 53.9,4.3 57.5,3.6 C59.3,3.2 61.1,2.9 62.8,2.7 C63.7,2.6 64.6,2.5 65.4,2.4 C65.8,2.4 66.3,2.4 66.7,2.4 C66.9,2.4 67.1,2.4 67.3,2.4 L68,2.5 L68.9,2.4 C69.2,2.4 69.4,2.4 69.7,2.4 C70.2,2.4 70.8,2.4 71.3,2.5 C72.4,2.6 73.5,2.7 74.5,2.9 C76.7,3.2 78.8,3.7 80.9,4.1 C83,4.6 85,5 87,5.6 C88,5.9 89,6.1 90,6.4 C90.5,6.5 91,6.7 91.4,6.8 C91.9,7 92.3,7.2 92.8,7.4 C93.7,7.8 94.7,8.1 95.6,8.5 C96.5,8.9 97.4,9.3 98.3,9.7 C99.2,10.1 100,10.6 100.9,11.1 C101.8,11.5 102.6,12.1 103.4,12.6 C105,13.6 106.5,14.7 108,15.8 C109.4,17 110.8,18.1 112.1,19.4 C113.4,20.6 114.5,21.9 115.7,23.2 C116.2,23.9 116.7,24.6 117.2,25.2 C117.4,25.5 117.7,25.9 117.9,26.2 C118.1,26.6 118.3,26.9 118.6,27.2 C120.5,29.9 121.8,32.8 122.9,35.6 C125.1,41.3 125.9,46.9 126.2,51.9 C126.4,56.9 126.5,61.5 127.4,65.3 C128.3,69.1 129.7,72.2 130.7,74.6 C131.7,77.1 132.5,78.9 133,80.2 C133.5,81.5 133.6,82.2 133.7,82.2 C133.7,82.2 133.7,82 133.6,81.7 C133.5,81.4 133.4,80.9 133.2,80.2 C132.8,78.9 132.1,77 131.1,74.5 C130.1,72 128.8,69 128,65.2 C127.2,61.4 127.2,56.9 127,51.9 C126.7,46.8 126,41.2 123.8,35.3 C122.6,32.4 121.3,29.4 119.5,26.6 C119.3,26.2 119.1,25.9 118.8,25.5 C118.6,25.1 118.3,24.8 118,24.5 C117.5,23.8 117,23.1 116.4,22.4 C115.2,21.1 114.1,19.7 112.8,18.5 C111.5,17.2 110.1,16 108.7,14.8 C107.2,13.7 105.7,12.5 104,11.5 C103.2,11 102.4,10.4 101.5,10 C100.6,9.5 99.8,9 98.9,8.6 C98,8.2 97.1,7.7 96.2,7.3 C95.3,6.9 94.3,6.5 93.4,6.1 C92.9,5.9 92.4,5.7 92,5.5 C91.5,5.3 91,5.2 90.5,5 C89.5,4.7 88.5,4.4 87.5,4.2 C85.5,3.7 83.4,3.2 81.3,2.7 C79.2,2.2 77.1,1.8 74.9,1.4 C73.8,1.2 72.7,1.1 71.6,1 C71,0.9 70.5,0.9 69.9,0.9 C69.6,0.9 69.3,0.9 69,0.9 L68.2,1 L67.6,0.9 C67.4,0.9 67.1,0.9 66.9,0.9 C66.4,0.9 66,0.9 65.5,0.9 C64.6,1 63.7,1.1 62.8,1.2 C61,1.5 59.2,1.8 57.4,2.1 C53.8,2.8 50.1,3.7 46.4,4.7 C42.6,5.8 39.1,7.4 35.6,9.3 C33.8,10.2 32.2,11.3 30.4,12.4 C29.6,13 28.8,13.6 27.9,14.2 C27.1,14.8 26.3,15.5 25.5,16.1 C22.4,18.8 19.6,21.9 17.2,25.4 C14.8,28.9 12.9,32.8 11.5,36.9 C10.1,41 9.3,45.4 8.9,49.8 C8.6,54.2 8.7,58.6 8,63 C7.4,67.3 5.6,71.4 3.9,75.7 C3,77.8 2.2,80 1.6,82.3 C1,84.6 0.7,87 0.6,89.4 C0.3,99 4.2,108.7 11.1,115.8 C18,122.9 27.6,127.3 37.7,128.4 C42.8,129 47.9,128.6 52.9,128.2 C57.9,127.7 62.9,127.3 68,126.8 C71.6,127.1 75.2,127.5 78.8,127.8 C82.5,128.1 86.1,128.5 89.9,128.6 C93.6,128.8 97.4,128.6 101.2,128 C105.2,127.3 108.9,126.2 112.4,124.6 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:166998acba37": {
        fill: { "0": { value: "#E5A991" } },
        "translation.x": { "0": { value: 116 } },
        "translation.y": { "0": { value: 19 } }
      },

      "haiku:9a3df5206508": {
        d: {
          "0": {
            value: "M59.9,4.7 C45.7,-0.2 30.2,-0.2 15.3,2 C12,2.5 8.6,3.1 5.7,4.9 C2.8,6.7 0.5,9.7 0.6,13.1 C22.2,7.6 45,7 66.9,11.4 C66.8,7.9 63.1,5.8 59.9,4.7 Z"
          }
        }
      },

      "haiku:314219e1223c": {
        d: {
          "0": {
            value: "M0.2,13.6 L0.2,13.1 C0.1,9.2 2.9,6.1 5.5,4.6 C8.5,2.8 12,2.2 15.3,1.7 C21.7,0.7 27.8,0.3 33.6,0.3 C43.3,0.3 52.2,1.7 60.1,4.4 C62.8,5.3 67.3,7.5 67.4,11.5 L67.4,12 L66.9,11.9 C57.3,10 47.5,9 37.6,9 C25.1,9 12.7,10.5 0.8,13.6 L0.2,13.6 Z M33.5,1 C27.8,1 21.7,1.5 15.4,2.4 C12.2,2.9 8.8,3.5 5.9,5.2 C3,6.9 1.1,9.8 1,12.5 C12.9,9.5 25.2,8 37.5,8 C47.2,8 57,8.9 66.4,10.8 C66,7.6 62.1,5.8 59.7,5 C51.9,2.4 43.1,1 33.5,1 Z"
          }
        }
      },

      "haiku:019dc74444db": {
        d: {
          "0": {
            value: "M184.2,115.1 C184.4,108.7 181.4,101.4 178.6,97 C176.1,93.3 172.4,90.7 168.4,88.7 C163.3,86.1 157.7,84.1 152,83.8 C144.4,83.4 136.7,86 130.7,90.7 C124.7,95.5 120.5,102.3 118.7,109.7 C117.7,113.7 117.5,118.1 119,121.9 C120.5,125.8 123.9,129.1 128,129.5 C131.5,129.9 134.9,128.2 138.3,127 C147.7,123.4 158.2,122.5 168.1,124.6 C170.3,125.1 172.5,125.7 174.8,125.7 C177.1,125.8 179.5,125.2 181.1,123.6 C183.2,121.5 184.1,118.4 184.2,115.1 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:323220bd25ab": {
        d: {
          "0": {
            value: "M171.9,95 C163.6,89.4 153,86.7 143.2,89 C133.4,91.3 124.7,99 122.5,108.8 C121.3,113.8 122.2,119.9 126.5,122.8 C130.6,125.7 136.2,124.6 140.9,122.8 C145.5,121 150.1,118.4 155.1,118.5 C162.3,118.6 169.3,124.2 176,121.6 C181.1,119.6 183.4,113.1 182.1,107.7 C180.6,102.3 176.5,98.1 171.9,95 Z"
          }
        },

        fill: { "0": { value: "#934730" } }
      },

      "haiku:e08dcc021a1b": {
        d: {
          "0": {
            value: "M165.5,104.8 C160.4,101.7 151.1,104.3 150.1,111 C148.6,106.4 142.9,104.3 138.8,106.4 C132.3,109.9 127.3,114.3 124.7,121.2 C125.2,121.9 125.8,122.4 126.6,122.9 C130.7,125.8 136.3,124.7 141,122.9 C145.6,121.1 150.2,118.5 155.2,118.6 C162.4,118.7 169.4,124.3 176.1,121.7 C176.9,121.4 177.7,120.9 178.4,120.4 C175.2,114.1 171.8,108.3 165.5,104.8 Z"
          }
        },

        fill: { "0": { value: "#61090E" } }
      },

      "haiku:cbf4e0007687": {
        "translation.x": { "0": { value: 138 } },
        "translation.y": { "0": { value: 64 } }
      },

      "haiku:75044aca1d2f": {
        d: {
          "0": {
            value: "M19.6,4.3 C19.1,2 16,0.2 12.4,0.2 C8.7,0.2 5.7,2 5.2,4.3 C2.4,5.6 0.6,7.5 0.6,9.7 C0.6,13.5 5.9,16.6 12.4,16.6 C18.9,16.6 24.2,13.5 24.2,9.7 C24.2,7.6 22.4,5.6 19.6,4.3 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:aff62d49946b": {
        fill: { "0": { value: "#934730" } },
        "translation.x": { "0": { value: 3 } },
        "translation.y": { "0": { value: 10 } }
      },

      "haiku:82bcf478883f": {
        d: {
          "0": {
            value: "M5.5,2 C5,1 4,0.3 2.9,0.2 C2.3,0.1 1.8,0.2 1.3,0.6 C0.9,0.9 0.6,1.5 0.8,2.1 C0.9,2.4 1.1,2.6 1.3,2.8 C1.9,3.3 2.5,3.8 3.2,4.1 C3.9,4.4 4.9,4.5 5.4,4 C5.9,3.4 5.8,2.6 5.5,2 Z"
          }
        }
      },

      "haiku:0c764367c941": {
        d: {
          "0": {
            value: "M13.3,2 C13.8,1 14.8,0.3 15.9,0.2 C16.5,0.1 17,0.2 17.5,0.6 C17.9,0.9 18.2,1.5 18,2.1 C17.9,2.4 17.7,2.6 17.5,2.8 C16.9,3.3 16.3,3.8 15.6,4.1 C14.9,4.4 13.9,4.5 13.4,4 C12.9,3.4 13,2.6 13.3,2 Z"
          }
        }
      },

      "haiku:1ba1cb6c3447": {
        d: {
          "0": {
            value: "M149.7,68.8 C147.6,68 145.1,68.4 143.3,69.8 C143,70.1 142.6,70.4 142.6,70.8 C142.5,71.4 143.1,71.9 143.6,72.2 C145.4,73.2 147.6,73.4 149.6,72.7 C150.1,72.5 150.6,72.3 151,71.9 C151.4,71.5 151.6,71 151.5,70.4 C151.4,69.7 150.5,69.1 149.7,68.8 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:bf57858565d7": {
        d: {
          "0": {
            value: "M138.1,93 C139.2,93.6 140.5,93.8 141.8,94 C145.3,94.5 148.9,94.7 152.4,94.6 C154.6,94.5 156.8,94.4 158.8,93.4 C160.2,92.7 161.4,91.6 161.9,90.2 C155.8,88.2 149.3,87.7 143.1,89.1 C140.8,89.6 138.5,90.5 136.4,91.6 C136.9,92.1 137.5,92.6 138.1,93 Z"
          }
        },

        fill: { "0": { value: "#FFFFFF" } }
      },

      "haiku:14d674bb9791": {
        d: {
          "0": {
            value: "M137,20.4 C134.8,21.9 133.6,24.6 133.9,27.2 C140.9,26.8 147.8,24.4 153.7,20.5 C152.1,22 151.3,24.4 151.8,26.6 C159.6,24.8 167.4,23 175.2,21.2 C170.7,16.1 166.3,11 161.8,5.9 C160.1,3.9 158.2,1.9 155.8,0.8 C153.4,-0.2 150.2,-7.77156117e-16 148.6,2.1 C147,4.2 148.3,8 151,8 C145.6,4.8 139.4,3 133.1,3 C133.6,5.2 134.7,7.3 136.2,9 C133.7,7.9 131,6.9 128.3,7 C125.6,7.1 122.7,8.9 122.3,11.7 C121.9,14.4 125.1,17.2 127.4,15.8 C124.3,17.1 121.6,19.4 119.8,22.1 C119.2,23 118.7,24 119.1,25 C119.8,26.7 122.3,26.3 124,25.6 C128.3,23.9 132.6,22.2 137,20.4 Z"
          }
        },

        fill: { "0": { value: "#934730" } }
      },

      "haiku:cf46e48e45d8": {
        "translation.x": { "0": { value: 167 } },
        "translation.y": { "0": { value: 49 } }
      },

      "haiku:068e6898dddb": {
        d: {
          "0": {
            value: "M14.8,13.7 C15.9,13.4 17.1,13.2 18.2,13.5 C19.3,13.8 20.3,14.8 20.2,16 C13.8,16.5 7.5,18.8 2.3,22.5 C5.4,18.3 9.8,15.1 14.8,13.7 Z"
          }
        },

        fill: { "0": { value: "#934730" } }
      },

      "haiku:4af6e170da17": {
        d: {
          "0": {
            value: "M2.1,15.2 C2.9,12 3.8,8.7 5.6,5.9 C7.4,3.1 10.1,0.8 13.4,0.2 C16.7,-0.3 20.4,1.4 21.5,4.6 C18.9,2.6 15.1,2.9 12.2,4.5 C9.3,6.2 4.1,12.6 2.1,15.2 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:1205db2a4ef5": {
        d: {
          "0": {
            value: "M25.5,37.2 C18.4,34.6 11.3,31.9 4.2,29.3 C3.2,28.9 2.2,28.6 1.4,27.9 C0.6,27.2 0.1,26.2 0.3,25.2 C0.6,23.5 2.7,22.8 4.5,22.6 C10,21.8 15.9,21.8 21,24.1 C26.1,26.4 30.3,31.3 30.5,36.8 C29.5,38.3 27.2,37.9 25.5,37.2 Z"
          }
        },

        fill: { "0": { value: "#F8ACAC" } }
      },

      "haiku:ca49043f5b8c": {
        "translation.x": { "0": { value: 103 } },
        "translation.y": { "0": { value: 49 } }
      },

      "haiku:20e4f6c25205": {
        d: {
          "0": {
            value: "M16.4,13.7 C15.3,13.4 14.1,13.2 13,13.5 C11.9,13.8 10.9,14.8 11,16 C17.4,16.5 23.7,18.8 28.9,22.5 C25.9,18.3 21.4,15.1 16.4,13.7 Z"
          }
        },

        fill: { "0": { value: "#934730" } }
      },

      "haiku:c68a0d9096c7": {
        d: {
          "0": {
            value: "M29.2,15.2 C28.4,12 27.5,8.7 25.7,5.9 C23.9,3.1 21.2,0.8 17.9,0.2 C14.6,-0.3 10.9,1.4 9.8,4.6 C12.4,2.6 16.2,2.9 19.1,4.5 C22,6.2 27.2,12.6 29.2,15.2 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:e5b2a10a41cb": {
        d: {
          "0": {
            value: "M5.8,37.2 C12.9,34.6 20,31.9 27.1,29.3 C28.1,28.9 29.1,28.6 29.9,27.9 C30.7,27.2 31.2,26.2 31,25.2 C30.7,23.5 28.6,22.8 26.8,22.6 C21.3,21.8 15.4,21.8 10.3,24.1 C5.2,26.4 1,31.3 0.8,36.8 C1.8,38.3 4.1,37.9 5.8,37.2 Z"
          }
        },

        fill: { "0": { value: "#F8ACAC" } }
      },

      "haiku:2448fe05f8aa": {
        d: {
          "0": {
            value: "M90.4,216.4 C100.4,221.6 111.5,224.5 122.6,226.2 C147.1,230.1 172.9,228.7 196,219.6 C200.8,217.7 205.6,215.4 209.9,212.6 C211.7,211.4 213.6,210.1 214.5,208.1 C215.4,206.1 214.9,203.4 213,202.4 C211.3,201.5 209.2,202.4 207.4,203.2 C189.9,211 171,216.1 151.9,216.8 C132.7,217.5 113.3,213.9 96.2,205.2 C94.3,204.2 92.4,203.2 90.2,202.8 C88.1,202.4 85.7,202.9 84.3,204.6 C82.6,206.6 83,209.6 84.4,211.8 C85.8,213.9 88.1,215.2 90.4,216.4 Z"
          }
        },

        fill: { "0": { value: "#BADEB3" } }
      },

      "haiku:c8610bae0f60": {
        d: {
          "0": {
            value: "M154.6,269.6 C156.6,269.5 158,267.5 158.4,265.6 C158.8,263.7 158.4,261.7 158.3,259.7 C157.7,252.3 160.4,244.6 165.6,239.3 C166.5,238.4 167.5,237.5 168.1,236.4 C168.7,235.3 169,233.8 168.3,232.7 C167.6,231.6 166.2,231.1 164.9,231.1 C163.6,231.1 162.4,231.6 161.1,232 C153.4,234.5 145,234.5 137.3,232.1 C135,231.4 132.8,230.4 130.4,230.3 C128,230.2 125.4,231 124.2,233.1 C132.6,239.9 137.7,250.7 137.5,261.6 C137.5,263.4 137.3,265.2 137.8,266.8 C138.3,268.5 139.7,270 141.5,270.1 C143.8,270.2 145.6,267.8 147.9,267.7 C150.2,267.5 152.2,269.8 154.6,269.6 Z"
          }
        },

        fill: { "0": { value: "#BADEB3" } }
      },

      "haiku:3033d52de17a": {
        d: {
          "0": {
            value: "M67.3,252.3 C66.2,251.7 64.9,251.7 63.6,251.5 C61.5,251.2 59.3,250.7 57.4,251.5 C54.6,252.7 53.6,256.5 55.1,259.1 C56.5,261.7 59.7,263.1 62.7,262.9 C65.3,262.7 67.9,261.4 69.1,259.1 C70.3,256.8 69.6,253.5 67.3,252.3 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:6439475a345b": {
        d: {
          "0": {
            value: "M52.9,258.2 C52.5,257.5 52,256.8 51.2,256.5 C49.9,256 48.5,257 47.4,257.9 C45.8,259.3 44.1,260.8 43.1,262.7 C42,264.6 41.6,267 42.5,268.9 C43.7,271.3 46.8,272.4 49.3,271.6 C51.8,270.8 53.7,268.4 54.3,265.8 C54.9,263.2 54.2,260.5 52.9,258.2 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:57f2f3919442": {
        d: {
          "0": {
            value: "M74.1,268.7 C73.2,267.3 72.1,265.9 70.5,265.3 C67.6,264.1 64.3,265.9 61.9,268 C58.3,271.2 55.5,275.5 55,280.2 C54.5,285 56.8,290.2 61.2,292.2 C64.8,293.9 69.3,293.1 72.5,290.6 C75.6,288.1 77.3,284.1 77.5,280.1 C77.6,276 76.3,272.1 74.1,268.7 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:05eec2907b64": {
        "translation.x": { "0": { value: 167 } },
        "translation.y": { "0": { value: 210 } }
      },

      "haiku:642d5392dcb4": {
        d: {
          "0": {
            value: "M46.2,3 C54.6,-2.1 66.3,0.2 73.1,7.3 C79.9,14.4 81.8,25.3 79.1,34.8 C76.4,44.2 69.6,52.2 61.3,57.5 C53,62.8 43.4,65.7 33.8,67.3 C28.3,68.2 22.6,68.7 17.2,67.6 C11.7,66.4 6.5,63.4 3.7,58.5 C-1.3,49.6 3.4,38.4 9.5,30.2 C21.3,14.4 29.5,13.2 46.2,3 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:4e07394d8edd": {
        d: {
          "0": {
            value: "M23.1,17.6 L23.3,17.4 C26.3,15.2 29.4,13.4 32.2,11.8 C35,10.2 37.6,8.8 39.7,7.5 C41.8,6.3 43.5,5.2 44.7,4.4 C45.8,3.6 46.5,3.2 46.4,3.1 L46.1,2.6 C46,2.4 43.4,3.9 39,6.2 C36.8,7.3 34.2,8.7 31.4,10.2 C28.5,11.8 25.4,13.5 22.3,15.8 L22.1,16 C19.3,18.1 16.7,20.4 14.3,23 C11.9,25.5 9.8,28.2 7.8,31 C5.9,33.8 4.2,36.8 2.9,40 C1.7,43.2 0.8,46.5 0.8,49.9 L0.8,51.2 C0.8,51.6 0.9,52 0.9,52.5 C1,53.4 1.2,54.2 1.4,55 C1.9,56.6 2.6,58.2 3.5,59.6 C5.3,62.5 8,64.6 10.9,66.1 C13.8,67.6 17,68.4 20.1,68.8 C23.2,69.1 26.3,69 29.4,68.7 C35.4,68 41.2,66.8 46.7,65.1 C52.2,63.4 57.3,61.1 61.8,58.2 C70.9,52.4 77.5,43.9 79.9,34.9 C81.1,30.4 81.3,25.9 80.7,21.8 C80.1,17.7 78.7,13.9 76.7,10.9 C75.7,9.3 74.6,8 73.4,6.8 C72.8,6.2 72.2,5.6 71.5,5.1 C70.9,4.6 70.2,4.1 69.5,3.7 C66.9,2 64.1,1 61.6,0.5 C59.1,-3.10819079e-15 56.8,-0.1 54.8,0.1 C52.8,0.3 51.2,0.7 49.9,1.2 C48.6,1.7 47.7,2.1 47.1,2.5 C46.5,2.9 46.2,3 46.2,3.1 C46.2,3.1 46.5,3 47.2,2.7 C47.8,2.4 48.7,2 50,1.6 C51.3,1.2 52.9,0.9 54.8,0.7 C56.7,0.6 59,0.7 61.4,1.3 C63.8,1.9 66.5,2.9 69,4.5 C69.6,4.9 70.3,5.4 70.9,5.9 C71.5,6.4 72.1,6.9 72.7,7.5 C73.8,8.7 74.9,10 75.8,11.5 C77.7,14.5 79,18.1 79.5,22.1 C80,26.1 79.8,30.4 78.6,34.6 C76.2,43.2 69.8,51.3 60.9,56.9 C52,62.5 40.9,65.7 29.1,67.1 C26.2,67.4 23.2,67.5 20.2,67.2 C17.2,66.9 14.3,66.1 11.6,64.7 C8.9,63.3 6.5,61.3 4.9,58.8 C4.5,58.2 4.2,57.5 3.8,56.8 C3.6,56.5 3.5,56.1 3.4,55.7 C3.3,55.3 3.1,55 3,54.6 C2.8,53.9 2.6,53.1 2.6,52.3 C2.6,51.9 2.5,51.5 2.5,51.1 L2.5,49.9 C2.5,46.8 3.3,43.6 4.5,40.6 C5.7,37.6 7.3,34.7 9.2,32 C13.1,26.8 17.6,21.6 23.1,17.6 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:9d30ca5d1079": {
        d: {
          "0": {
            value: "M18.5,64.5 C26.1,66.2 34.1,65.5 41.3,62.7 C43.9,61.7 46.7,60 47.4,57.3 C47.9,55.4 47.2,53.4 46.6,51.4 C44.8,45.3 44.4,38.9 45.3,32.6 C40.8,36.8 34.7,39.7 28.6,38.9 C22.5,38.1 16.9,32.4 17.7,26.3 C12.1,31.4 8.1,38.3 6.4,45.8 C5.5,49.9 5.3,54.4 7.5,58 C9.9,61.7 14.3,63.5 18.5,64.5 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:e5ff1ca96ce0": {
        "translation.x": { "0": { value: 38 } },
        "translation.y": { "0": { value: 7 } }
      },

      "haiku:746913487aec": {
        d: {
          "0": {
            value: "M28.2,1.7 C33.2,0.4 39,0.5 42.9,3.9 C45.7,6.4 47,10.1 47.9,13.8 C50.6,25.9 49.1,39 43.6,50.2 C40.7,56.1 36.6,61.5 31,64.8 C25.4,68.1 18,68.9 12.3,65.6 C5.6,61.8 2.7,53.6 2,45.9 C1.1,36.6 2.6,27 7.1,18.8"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:8f5020a092b5": {
        d: {
          "0": {
            value: "M2.8,36.7 L2.8,36.5 C3.2,31.5 4.4,27.1 5.5,24 C6.6,20.9 7.5,19.1 7.4,19 L6.9,18.7 C6.8,18.6 5.6,20.3 4.2,23.5 C2.9,26.6 1.5,31.2 1.1,36.4 L1.1,36.6 C0.9,39 0.9,41.3 1,43.7 C1.1,46 1.4,48.4 1.9,50.7 C2.4,53 3.1,55.2 4,57.3 C5,59.4 6.2,61.4 7.8,63.1 C9.4,64.8 11.3,66.2 13.4,67.1 C15.5,68 17.8,68.5 20,68.6 C24.5,68.7 28.8,67.4 32.3,65.1 C35.9,62.8 38.7,59.8 40.9,56.6 C43.2,53.4 44.8,50 46.2,46.6 C48.9,39.8 50,33 50,26.8 C50,23.7 49.8,20.7 49.4,18 C49,15.2 48.4,12.7 47.6,10.3 C46.8,8 45.6,5.9 44.1,4.3 C42.6,2.8 40.7,1.8 39.1,1.3 C35.7,0.4 32.9,0.7 31.1,1 C30.2,1.2 29.5,1.3 29.1,1.5 C28.7,1.6 28.4,1.7 28.4,1.8 C28.4,1.9 29.3,1.6 31.1,1.4 C32.9,1.2 35.6,1 38.8,2 C40.4,2.5 42,3.4 43.4,4.9 C44.8,6.4 45.8,8.3 46.6,10.6 C47.3,12.9 47.8,15.4 48.2,18.1 C48.6,20.8 48.7,23.7 48.7,26.7 C48.6,32.8 47.4,39.4 44.8,46 C43.5,49.3 41.8,52.6 39.6,55.7 C37.4,58.8 34.7,61.6 31.4,63.7 C28.1,65.8 24.1,67 20.1,66.8 C18.1,66.7 16.1,66.3 14.2,65.5 C12.3,64.7 10.7,63.4 9.2,61.9 C6.3,58.8 4.7,54.6 3.7,50.3 C3.2,48.1 3,45.9 2.9,43.6 C2.6,41.3 2.7,39 2.8,36.7 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:01cd8636b10e": {
        "translation.x": { "0": { value: 45 } },
        "translation.y": { "0": { value: 25 } }
      },

      "haiku:57c79d57b412": {
        d: {
          "0": {
            value: "M3.8,53.7 C0.1,42 1,29 6.3,18 C4.9,14.4 4.9,10.4 6.2,6.8 C7.3,4 9.8,1.1 12.8,1.6 C14.6,1.9 16,3.4 16.8,5 C17.6,6.7 17.7,8.5 17.9,10.3 C18.8,7.8 19.8,5.2 21.8,3.4 C23.7,1.6 26.9,0.8 29.1,2.3 C31.3,3.9 31,8 28.4,8.6 C29.8,6.9 31.6,5.5 33.8,5.2 C35.9,4.9 38.3,6 39.1,8 C39.9,10 38.4,12.7 36.3,12.8 C38.1,12.4 40.1,12.1 41.9,12.5 C43.7,13 45.4,14.4 45.7,16.2 C46,18.1 44.3,20.1 42.4,19.7 C44.2,19.4 46.2,19.7 47.6,20.9 C49,22.1 49.8,24.2 49,25.9 C48.3,27.6 45.9,28.4 44.4,27.3 C43.4,40.2 36.3,52.6 25.7,60 C21.1,63.2 14.8,65.5 9.9,62.7 C6.7,60.9 4.9,57.2 3.8,53.7 Z"
          }
        },

        fill: { "0": { value: "#EFC4B1" } }
      },

      "haiku:a1e319d27ab6": {
        d: {
          "0": {
            value: "M23.1,60.6 L22.9,60.7 C20,62.3 16.8,63.3 14,63.1 C12.6,63 11.3,62.6 10.3,62 C9.2,61.4 8.4,60.6 7.7,59.8 C6.3,58.1 5.6,56.5 5,55.3 C4.5,54.2 4.2,53.5 4.1,53.5 L3.5,53.7 C3.4,53.7 3.5,54.4 3.9,55.7 C4.3,56.9 5,58.7 6.4,60.7 C7.1,61.7 8.1,62.6 9.3,63.4 C10.5,64.2 12.1,64.7 13.7,64.8 C17,65.1 20.5,64 23.6,62.3 L23.8,62.2 C25.4,61.3 26.9,60.2 28.3,59.1 C29.7,58 31.1,56.8 32.3,55.5 C34.8,52.9 37,50.1 38.8,47 C40.6,44 42.1,40.7 43.1,37.4 C43.4,36.6 43.6,35.7 43.8,34.9 C44,34.1 44.2,33.2 44.4,32.4 C44.5,31.6 44.7,30.7 44.8,29.9 L44.9,28.7 C44.9,28.7 44.9,28.7 44.9,28.7 L44.9,28.7 L44.9,28.7 C44.9,28.7 44.9,28.7 44.9,28.7 L45.1,28.7 C45.6,28.8 46,28.8 46.4,28.7 C47.3,28.5 48.1,28.1 48.7,27.5 C49.3,26.9 49.8,26 49.9,25.2 C50,24.4 49.9,23.5 49.7,22.7 C49.4,21.9 49,21.2 48.4,20.7 C47.8,20.1 47.2,19.7 46.4,19.4 C45,18.8 43.4,18.7 42,18.9 L37.1,19.7 L41.9,20.6 C42.9,20.8 43.9,20.5 44.6,19.9 C45.3,19.3 45.8,18.6 46.1,17.7 C46.4,16.8 46.3,15.8 46,15.1 C45.7,14.3 45.1,13.6 44.5,13.1 C43.3,12 41.6,11.5 40.1,11.5 C38.6,11.4 37.1,11.7 35.8,12 L36,13.6 C37.1,13.6 38.1,13 38.7,12.2 C39.3,11.4 39.7,10.5 39.8,9.5 C39.9,8.5 39.5,7.4 38.9,6.7 C38.3,5.9 37.5,5.3 36.7,5 C35.9,4.6 34.9,4.4 34,4.5 C33.1,4.5 32.2,4.7 31.4,5.1 C29.8,5.8 28.5,7 27.4,8.2 L25.9,10 L28.2,9.5 C28.9,9.3 29.5,9 29.9,8.5 C30.4,8 30.6,7.4 30.8,6.8 C31.1,5.6 31,4.4 30.4,3.3 C30.1,2.8 29.7,2.3 29.2,1.9 C28.7,1.6 28.2,1.3 27.6,1.1 C26.5,0.8 25.3,0.8 24.2,1.1 C23.1,1.4 22.2,1.9 21.3,2.6 C20.5,3.3 19.8,4.1 19.2,4.9 C18.9,5.3 18.7,5.8 18.4,6.2 C18.3,6.4 18.2,6.6 18.1,6.9 L18,7.1 C17.9,7.3 17.8,7.5 17.8,7.7 L17.7,7.3 L17.7,7.1 L17.7,6.9 L17.6,6.4 C17.3,5.1 16.6,3.8 15.7,2.8 C14.8,1.8 13.5,1 12.1,1 C11.4,1 10.7,1.1 10.1,1.3 C9.5,1.5 8.9,1.9 8.4,2.3 C6.4,3.9 5.3,6.3 4.8,8.5 C4.3,10.7 4.2,13 4.6,15.1 C4.7,15.6 4.8,16.2 4.9,16.7 C5,17 5.1,17.2 5.1,17.5 C5.1,17.6 5.2,17.7 5.2,17.9 L5.3,18.1 C5.4,18.2 5,18.8 4.9,19.2 C4.7,19.7 4.5,20.1 4.3,20.6 C3.9,21.5 3.6,22.4 3.3,23.3 C3,24.2 2.7,25.1 2.5,26 C1.6,29.5 1.1,32.8 0.9,35.8 C0.5,41.8 1.3,46.4 2,49.5 C2.4,51 2.7,52.2 3,52.9 C3.3,53.7 3.4,54.1 3.4,54 C3.5,54 3,52.4 2.4,49.3 C1.8,46.2 1.2,41.6 1.7,35.8 C1.9,32.9 2.5,29.7 3.5,26.2 C3.7,25.3 4,24.5 4.3,23.6 C4.6,22.7 4.9,21.9 5.3,21 C5.5,20.6 5.7,20.1 5.9,19.7 L6.2,19 L6.4,18.6 L6.5,18.3 C6.5,18.3 6.5,18.2 6.5,18.2 L6.4,18.1 L6.2,17.6 C6.2,17.5 6.1,17.4 6.1,17.3 C6,17.1 6,16.8 5.9,16.6 C5.8,16.1 5.7,15.6 5.6,15.1 C5.3,13.1 5.3,11 5.9,8.9 C6.2,7.9 6.5,6.8 7,5.9 C7.5,5 8.2,4.1 9.1,3.4 C9.9,2.7 10.9,2.3 12,2.4 C13,2.5 14,3 14.7,3.8 C15.5,4.6 16,5.7 16.3,6.8 L16.4,7.2 L16.5,7.5 L16.6,7.9 C16.7,8.5 16.8,9.1 16.8,9.7 C16.9,11 17,12.2 17.2,13.5 C17.8,12 18.4,10.2 19.1,8.6 L19.4,8 L19.6,7.5 C19.7,7.3 19.8,7.1 19.9,6.9 C20.1,6.5 20.3,6.1 20.6,5.7 C21.1,5 21.7,4.3 22.4,3.7 C23.1,3.2 23.9,2.7 24.7,2.5 C25.5,2.3 26.4,2.2 27.2,2.5 C27.6,2.6 28,2.8 28.3,3 C28.6,3.2 28.8,3.5 29,3.9 C29.4,4.6 29.5,5.5 29.2,6.3 C29,7.1 28.4,7.7 27.7,7.9 C28,8.3 28.2,8.7 28.5,9.2 C29.4,8.1 30.6,7.1 31.9,6.6 C33.2,6 34.6,6 35.9,6.6 C37.1,7.1 38.1,8.3 38,9.6 C37.9,10.9 36.9,12.2 35.8,12.2 C35.9,12.7 35.9,13.3 36,13.8 C37.3,13.5 38.6,13.3 39.9,13.3 C41.2,13.3 42.3,13.7 43.2,14.5 C44.1,15.3 44.6,16.4 44.3,17.4 C44,18.4 43,19.3 42.1,19.1 C42.1,19.7 42.1,20.2 42.1,20.8 C43.3,20.6 44.5,20.7 45.6,21.2 C46.7,21.6 47.5,22.5 47.9,23.5 C48.3,24.5 48.1,25.7 47.4,26.4 C47,26.8 46.5,27 46,27.1 C45.7,27.1 45.5,27.1 45.3,27.1 L45.2,27.1 C45.1,27.1 45,27 44.9,27 C44.7,26.9 44.6,26.8 44.4,26.7 L43.3,26 C43.2,27.2 43,28.5 42.9,29.7 C42.8,30.5 42.6,31.3 42.5,32.1 C42.3,32.9 42.1,33.7 41.9,34.5 C41.7,35.3 41.5,36.1 41.2,36.9 C40.2,40.1 38.8,43.2 37,46.1 C35.3,49 33.2,51.8 30.8,54.2 C29.6,55.4 28.3,56.6 27,57.7 C26,58.7 24.6,59.8 23.1,60.6 Z"
          }
        },

        fill: { "0": { value: "#BE7B60" } }
      },

      "haiku:12e988e15e36": {
        d: {
          "0": {
            value: "M67.8,40.6 C64.8,40.2 61.6,40.5 58.8,41.8 C56.1,43.2 53.8,45.8 53.5,48.9 C53.2,52 55.2,55.2 58.2,55.9 C62.6,56.9 66.9,52.5 71.2,53.9 C74.7,55 76.5,59.8 80.2,60.2 C83.4,60.6 86,57.1 85.8,53.9 C85.6,50.7 83.4,48 80.9,46 C77.1,43.1 72.5,41.2 67.8,40.6 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:5f7894bfed33": {
        d: {
          "0": {
            value: "M53.7,66 C51.3,68.9 51.4,73.1 52.1,76.8 C52.6,79.1 53.4,81.5 55.2,83 C57.1,84.4 59.6,84.5 62,84.2 C65.6,83.7 69.1,82.2 71.8,79.7 C74.4,77.2 76.1,73.6 75.8,69.9 C75.5,66.2 73.2,62.8 69.8,61.5 C66.7,60.4 63.2,61.1 60,62.2 C57.7,63 55.3,64.1 53.7,66 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:f8d271457334": {
        d: {
          "0": {
            value: "M24.9,170.5 C25.9,172.1 27.5,173.5 29.4,173.6 C31.7,173.7 33.6,171.8 34.9,169.9 C35.6,168.8 36.3,167.7 36.5,166.4 C36.9,164.3 36,162.1 35.1,160.2 C34.5,159 33.9,157.7 32.8,156.9 C31.7,156.2 30.3,156.1 29.1,156.5 C27.9,156.9 26.8,157.7 26,158.7 C23.1,161.9 22.7,166.9 24.9,170.5 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:29b1c499ccdd": {
        d: {
          "0": {
            value: "M250.5,166.3 C250.3,164.2 250.4,162.1 251.2,160.2 C252,158.3 253.6,156.7 255.6,156.1 C259,157.1 262.1,159.3 263.7,162.4 C265.3,165.5 265.1,169.6 262.8,172.3 C261.1,174.3 258.2,175.3 255.7,174.5 C252.5,173.5 250.8,169.7 250.5,166.3 Z"
          }
        },

        fill: { "0": { value: "#E5A991" } }
      },

      "haiku:8e5c393c9a38": {
        viewBox: { "0": { value: "0 0 212 312" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 212 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 312 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function($user) {
                return $user.mouse.x - 144;
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
                return $user.mouse.y - 288;
              },
              "$user"
            ),

            edited: true
          }
        },

        "style.zIndex": { "0": { value: 37 } },
        "scale.x": { "0": { value: 0.3, edited: true } },
        "scale.y": { "0": { value: 0.3, edited: true } },
        opacity: {
          "0": {
            value: Haiku.inject(
              function(currentBaby) {
                return currentBaby === "baby7" ? 1 : 0;
              },
              "currentBaby"
            ),

            edited: true
          }
        }
      },

      "haiku:9e9b108e7a21": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:4e70ce7ee6ec": { "fill-rule": { "0": { value: "nonzero" } } },
      "haiku:0fba82dd855b": {
        "translation.x": { "0": { value: 3 } },
        "translation.y": { "0": { value: 190 } }
      },

      "haiku:621c39712448": {
        d: {
          "0": {
            value: "M40.6,2.9 C38.1,1.9 35.4,1.7 32.7,1.6 C27.3,1.5 21.7,1.9 16.8,4.1 C6,9 0.8,22.1 1.9,33.9 C3,45.7 9.1,56.4 15.9,66.2 C23.3,77 32,87.5 43.7,93.4 C50.4,96.8 59.1,98.2 64.8,93.4 C68.5,90.2 69.9,85.1 70.6,80.3 C74.7,54.3 65.7,26.5 47.2,7.8 C45.2,5.9 43.1,4 40.6,2.9 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:16be6df34f76": {
        d: {
          "0": {
            value: "M11.6,8.7 C16.1,4.1 23.1,2.7 29.3,2.4 C32.2,2.3 35.1,2.2 38,2.6 C38.2,2.6 40.5,3.2 40.6,3.1 C41.5,2.5 39.5,1.9 39.3,1.9 C36.6,1 33.7,0.9 30.8,0.9 C27.5,0.9 24.3,1.1 21.1,1.8 C15,3.2 9.8,7 6.4,12.2 C2.7,17.9 0.9,24.7 1,31.5 C1.2,38.3 3.2,45 6.1,51.2 C9,57.3 12.7,63.1 16.6,68.6 C20.4,74 24.6,79.2 29.4,83.9 C34.2,88.5 39.7,92.7 46,95.2 C52.1,97.6 59.7,98.4 65.1,94 C70.2,89.7 71,82.5 71.8,76.3 C72.6,69.5 72.4,62.2 71.3,55.4 C69.6,44.7 66.1,34.5 60.8,25.1 C58.1,20.2 54.8,15.8 51.2,11.6 C49.5,9.6 47.6,7.7 45.7,5.9 C45.4,5.7 40.9,2.3 40.7,2.8 C40.8,2.5 45.2,6 45.5,6.2 C47.9,8.4 50,11 52.1,13.5 C56.5,18.9 60,24.8 63,31 C68.9,43.1 71.5,57.1 71,70.5 C70.9,74.1 70.5,77.6 69.9,81.1 C69.3,84.3 68.5,87.5 66.6,90.2 C62.8,95.9 55.7,96.4 49.6,94.7 C43.2,92.9 37.5,88.9 32.6,84.5 C27.7,80.1 23.4,74.9 19.5,69.5 C13,60.6 6.7,50.9 4,40 C1.1,29.2 3.1,16.9 11.6,8.7 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:f2100594f6c5": {
        "translation.x": { "0": { value: 57 } },
        "translation.y": { "0": { value: 135 } }
      },

      "haiku:21dc3dfb70b4": {
        d: {
          "0": {
            value: "M54.8,7.4 C48.6,10.2 43.1,14.3 38,18.9 C22.1,33.1 10,51.6 3.4,71.9 C1.3,78.3 -0.2,85.2 1.8,91.6 C4.7,100.4 13.5,105.6 21.8,109.6 C31.4,114.2 41.4,118.4 52,120.2 C62.5,122 73.7,121.5 83.4,117 C93.8,112.2 101.9,103.2 107.2,93 C112.5,82.8 115.3,71.5 117.1,60.2 C119.3,46.5 120.3,32.2 115.8,19.1 C114.7,16 113.3,12.9 111.1,10.6 C109,8.4 106.3,6.9 103.6,5.7 C83.5,-3.2 59.4,1 40.3,11.9"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:3f06643cb088": {
        d: {
          "0": {
            value: "M20.8,39.4 C27.7,29.9 35.8,21 45.2,13.9 C47.4,12.2 49.7,10.7 52.1,9.4 C53,8.9 53.9,8.5 54.8,7.9 C55,7.8 54.8,7.6 54.7,7.4 C54.6,7.2 53.7,7.6 53.5,7.7 C48.5,9.8 43.9,13.1 39.8,16.5 C30.4,24.3 22.4,33.6 15.8,43.9 C12.2,49.6 9,55.5 6.4,61.7 C3.8,67.9 1.2,74.5 0.3,81.2 C-0.6,88 0.9,94.4 5.5,99.5 C9.8,104.4 15.7,107.6 21.5,110.4 C34.3,116.5 47.9,121.9 62.3,122 C69.2,122.1 76.1,121 82.5,118.3 C88.5,115.8 93.8,111.9 98.2,107.2 C107.3,97.6 112.4,85.1 115.5,72.4 C117.1,65.6 118.3,58.6 119.1,51.6 C119.8,44.7 120,37.7 119.2,30.7 C118.4,24.4 116.9,17.2 113.1,12 C109.2,6.6 102.1,4.2 95.9,2.6 C86.2,-2.99760217e-15 76,0.1 66.2,2.1 C61.5,3 56.9,4.4 52.4,6.1 C51.4,6.5 40.1,11.6 40.3,12 C40.3,12 47.3,8.6 47.9,8.4 C50.8,7.1 53.8,5.9 56.9,5 C63.3,3.1 69.8,1.8 76.4,1.5 C83.2,1.2 90.2,1.9 96.7,3.9 C102.8,5.8 109.4,8.2 112.8,13.9 C116.2,19.6 117.5,26.8 118.1,33.3 C118.7,40.2 118.3,47.2 117.4,54.1 C115.7,67.5 112.8,81.2 106.4,93.2 C100.3,104.5 90.8,114.3 78.4,118.3 C64.8,122.7 50.1,120.2 37,115.4 C30.5,113 24.1,110.2 18,106.9 C12.5,103.9 6.9,100.1 3.9,94.4 C0.6,88.2 1.6,81 3.5,74.6 C5.4,68.1 8,61.8 11,55.8 C13.9,49.9 17.1,44.5 20.8,39.4 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:e98210f2ba82": {
        d: {
          "0": {
            value: "M179.6,201.7 C179,184.5 175.5,167.4 169.1,151.4 C166.1,143.9 162,136 154.7,132.5 C148.6,129.6 141.5,130.2 134.8,130.8 C124.5,131.8 114,132.9 104.8,137.5 C95.3,142.3 87.8,150.5 82.1,159.5 C76.4,168.5 72.1,178.3 67.4,187.9 C66.7,189.2 66.1,190.6 65.9,192.1 C65.7,193.6 66.2,195.2 67.4,196.1 C69.2,197.3 71.6,196.5 73.6,195.5 C82.2,191.5 90.8,187.2 100.1,184.8 C109.3,182.4 119.3,181.9 128.2,185.4 C135,188.1 140.8,192.9 147.1,196.8 C155,201.7 163.9,205.1 173.1,206.7 C175.2,207.1 177.8,207.2 179,205.4 C179.6,204.3 179.6,202.9 179.6,201.7 Z"
          }
        },

        fill: { "0": { value: "#E2A286" } }
      },

      "haiku:7055952d273e": { "translation.x": { "0": { value: 48 } } },
      "haiku:fe11348c3969": {
        d: {
          "0": {
            value: "M102.3,4.2 C87,-0.5 69.9,0.7 55.2,7 C39.6,13.7 29.4,25.4 23.9,41.2 C22.5,45.4 20.8,49.4 20.2,53.8 C19.5,58.5 19.9,63.4 18.8,68.1 C16.3,78.5 7,85.8 3.1,95.7 C-1.4,107.2 2.1,120.7 9.6,130.5 C17.1,140.3 27.9,147 39,152.3 C43.3,154.4 47.7,156.3 52.3,157.4 C57,158.6 61.9,158.9 66.8,158.9 C100.9,158.8 141.7,144.9 155.2,110.3 C163.3,89.4 160.4,65.7 151.2,45.6 C141.2,24 124.8,11.1 102.3,4.2 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:4502d9ef3497": {
        d: {
          "0": {
            value: "M45.3,13.4 C55.9,6.3 68.3,2.5 81.1,2.1 C86.8,1.9 92.5,2.5 98.2,3.6 C99.4,3.8 100.6,4.2 101.8,4.4 C102.2,4.5 102.3,4.6 102.4,4.2 C102.5,3.7 102.1,3.8 101.7,3.6 C99.3,2.8 96.9,2.2 94.4,1.7 C81.8,-0.7 68.6,0.8 56.7,5.5 C45,10.1 35.1,18.1 28.7,29 C25.2,34.9 22.7,41.5 20.7,48.1 C19.7,51.4 19.2,54.7 19,58.2 C18.8,61.4 18.8,64.7 18,67.9 C16.5,74.4 12,79.8 8.3,85.1 C4.9,89.9 1.9,95 0.9,100.8 C-1.5,113.9 4.6,127.1 13.7,136.2 C18.4,140.9 23.8,144.7 29.5,148 C35.4,151.4 41.7,154.6 48.1,156.8 C55,159.2 62.1,159.7 69.3,159.5 C76.3,159.4 83.3,158.6 90.2,157.3 C103.5,154.8 116.6,150.2 128,143 C139.3,135.8 148.9,125.8 154.4,113.4 C160.1,100.6 161.5,86.2 159.6,72.4 C157.8,59.3 153.2,46.2 146,35.1 C138.9,24.2 128.9,15.4 117.2,9.7 C114.6,8.4 111.9,7.3 109.2,6.3 C108.8,6.1 102.4,3.9 102.3,4.1 C102.3,4.1 108.6,6.5 109.1,6.6 C111.9,7.7 114.7,9 117.3,10.3 C123,13.3 128.5,17 133.2,21.3 C142.9,30.1 149.7,41.6 154,54 C158.5,67 160.4,81.1 158.4,94.8 C156.4,108.4 150.4,121 140.8,130.8 C131.5,140.4 119.3,147.1 106.7,151.4 C93.7,155.8 79.8,158 66.1,157.9 C59,157.9 52.2,156.8 45.6,154.2 C39.2,151.7 33,148.4 27.2,144.8 C16.4,138 6.7,128.6 3.2,116 C1.5,109.9 1.2,103.1 3.3,97.1 C5.5,90.9 9.7,85.9 13.3,80.5 C16.6,75.6 19.4,70.5 20.1,64.6 C20.5,61.1 20.4,57.6 20.9,54.1 C21.4,50.6 22.5,47.3 23.7,44.1 C25.9,37.8 28.4,31.8 32.2,26.3 C35.8,21.3 40.2,16.9 45.3,13.4 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:971260c4a7a0": {
        d: {
          "0": {
            value: "M51.1,21.6 C62.6,17.5 74.8,15.3 87.1,15.3 C86.7,22.8 86.2,30.3 85.8,37.9 C89.7,32.7 99.6,23.9 105.7,21.4 C106.9,31.9 111.8,40.3 113,50.8 C119.9,45.8 119.2,35.4 124.5,28.7 C131.8,48.5 138.4,62.9 132.6,101.8 C129.5,122.7 118.5,143.3 100,153.3 C113.9,149.5 127.3,143.2 137.6,133.1 C145.9,125 151.8,114.6 155.2,103.5 C163.7,75.5 154.7,43 133.1,23.3 C111.5,3.6 78.2,-2.1 51.1,9.1 C55.5,8.8 59.9,8.4 64.4,8.1 C58.8,11.4 54.3,16.1 51.1,21.6 Z"
          }
        },

        fill: { "0": { value: "#E2A286" } }
      },

      "haiku:e1ae40f9009f": {
        d: {
          "0": {
            value: "M35.2,83.6 C30.7,84.8 27,88.1 24.5,92.1 C22,96 20.7,100.6 19.5,105.1 C18.2,109.9 17.1,114.9 18.2,119.7 C19.5,125 23.4,129.4 27.8,132.7 C38.5,140.7 53,143.3 65.9,139.6 C67.9,139 70,138.2 71.3,136.6 C72.9,134.6 73.1,131.8 73.2,129.3 C73.4,120.8 73,112.4 72,104 C71.1,96.5 69.4,88.6 64.1,83.3 C59.4,78.7 52.3,76.8 45.8,77.8 C39.3,78.8 33.3,82.3 28.6,87.1"
          }
        },

        fill: { "0": { value: "#E2A286" } }
      },

      "haiku:1cbe559eeab8": {
        d: {
          "0": {
            value: "M21.9,111.7 C23.7,97.6 33,86.6 45.3,83.9 C50.1,82.8 55.8,83.2 60.2,87.1 C62.4,89 64,91.7 65.3,94.4 C70.7,105.7 70.6,118.1 70.2,129.8 C70.2,130.4 70.2,131 69.8,131.4 C69.5,131.8 69,131.9 68.5,132 C54,134.5 37.2,129 24,117.3 C23.2,116.6 22.4,115.8 22,114.9 C21.7,113.8 21.7,112.7 21.9,111.7 Z"
          }
        },

        fill: { "0": { value: "#B3362A" } }
      },

      "haiku:fd43cc0f6e88": {
        "translation.x": { "0": { value: 122 } },
        "translation.y": { "0": { value: 92 } }
      },

      "haiku:4eecf6cccfc9": {
        d: {
          "0": {
            value: "M6.1,14.1 C10.7,6.9 19,2.2 27.6,1.9 C29.6,1.8 31.7,2 33.6,2.8 C38.7,4.9 41.3,11 40.7,16.4 C40.1,21.9 37,26.7 33.4,30.9 C30,34.9 25.9,38.6 21,40.5 C16.1,42.4 10.2,42.4 5.8,39.4 C1.5,36.4 -0.6,30.1 2,25.5"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:612acca2432e": {
        d: {
          "0": {
            value: "M15.6,4.3 C13,5.7 10.6,7.6 8.6,9.8 C7.7,10.8 6.9,11.9 6.2,13.1 C6.1,13.4 5.9,13.6 5.8,13.9 C5.8,14 6.2,14.3 6.3,14.3 C6.9,14.1 7.7,12.8 8.1,12.4 C9.2,11.2 10.4,10 11.7,9 C14.1,7 16.8,5.4 19.7,4.4 C25.2,2.4 33,1.4 37.1,6.5 C41.3,11.8 40.2,18.9 37.1,24.4 C34.7,28.6 31.4,32.5 27.8,35.6 C24.2,38.7 19.8,41.1 15,41.4 C10.5,41.7 5.9,40.1 3.2,36.4 C2,34.7 1.3,32.8 1.1,30.8 C1,29.9 1.1,29 1.2,28 C1.2,27.8 1.9,25.7 1.9,25.6 C1.6,25.4 0.8,28.1 0.7,28.3 C0.4,29.8 0.4,31.3 0.8,32.7 C1.5,35.8 3.4,38.5 6.1,40.2 C11.5,43.6 18.4,42.8 23.8,39.9 C29.4,36.9 34.1,31.8 37.5,26.5 C41,21 42.9,14.2 39.9,8 C38.2,4.4 35.1,1.9 31.1,1.2 C26,0.4 20.2,1.8 15.6,4.3 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:d5420c8f1ddc": {
        fill: { "0": { value: "#5D3A3E" } },
        "translation.x": { "0": { value: 25 } },
        "translation.y": { "0": { value: 38 } }
      },

      "haiku:4db4c27b56c9": {
        d: {
          "0": {
            value: "M17.6,4.5 C16.6,4.5 15.6,4.8 14.6,4.8 C9.2,5 5.4,6.7 0.1,9.3 C2.3,6.5 5.4,4.4 8.6,2.8 C11.5,1.3 14.8,0.2 17.9,1.1 C18.8,1.4 19.6,3 19,3.8 C18.7,4.2 18.1,4.5 17.6,4.5 Z"
          }
        }
      },

      "haiku:148086721ec0": {
        d: {
          "0": {
            value: "M59.5,8.7 C59.3,10.7 61.3,12.2 63,13.2 C69,17.1 74.1,22.4 77.6,28.7 C77.8,26.9 77,25.1 76.3,23.4 C74,18.4 71.7,13.3 68.1,9.1 C66.9,7.7 65.5,6.4 63.6,6.1 C61.9,5.8 59.7,6.9 59.5,8.7 Z"
          }
        }
      },

      "haiku:634958e3716b": {
        d: {
          "0": {
            value: "M57.9,99.1 C51.1,102 46.1,108.8 45.3,116.1 C45.2,117.6 45.2,119.1 45.6,120.5 C46.5,123.1 48.8,125 51.4,126 C54,127 56.8,127.2 59.5,127.4 C62.7,127.6 66.4,127.6 68.3,125.1 C69.1,124 69.4,122.6 69.7,121.2 C70.5,116.8 70.9,112 68.8,108.1 C68.4,107.4 68,106.7 67.3,106.4 C66.6,106 65.7,106 65.2,106.6 C64.2,107.7 65.4,109.5 64.8,110.8 C64.2,112.1 62.1,112 61.3,110.8 C60.5,109.7 60.7,108 61.5,106.8 C62.1,105.8 62.9,105 63.2,103.9 C63.4,102.6 62.7,101.3 61.6,100.5 C60.5,99.6 59.2,99.3 57.9,99.1 Z"
          }
        },

        fill: { "0": { value: "#5D3A3E" } }
      },

      "haiku:5ed546d425a6": {
        d: {
          "0": {
            value: "M28.2,131.9 C33.5,136 39.1,140.2 45.8,140.8 C41.7,142.7 36.7,141.7 32.7,139.6 C31.3,138.8 29.9,137.9 28.9,136.6 C28,135.2 27.6,133.4 28.2,131.9 Z"
          }
        },

        fill: { "0": { value: "#5D3A3E" } }
      },

      "haiku:9bbbc5ef3f73": {
        fill: { "0": { value: "#5D3A3E" } },
        "translation.x": { "0": { value: 69 } },
        "translation.y": { "0": { value: 65 } }
      },

      "haiku:e0948d42edaf": {
        d: {
          "0": {
            value: "M19.4,1.3 C17.8,2.28983499e-16 15.4,-0.3 13.5,0.5 C11.6,1.3 10.2,3.3 10.1,5.4 C12.1,2.5 15.8,0.9 19.4,1.3 Z"
          }
        }
      },

      "haiku:7a6a76f3abfd": { "translation.y": { "0": { value: 6 } } },
      "haiku:1be0ab7eb440": {
        d: {
          "0": {
            value: "M14,3.4 C11.5,3.4 9,3.7 6.6,4.4 C9,1.2 13.3,-0.4 17.2,0.2 C21.2,0.8 24.7,3.3 26.8,6.7 C26.9,6.9 27.1,7.1 27,7.4 C26.9,7.7 26.7,7.9 26.4,8 C25.5,8.6 24.9,9.5 24.6,10.5 C23.5,8.4 21.5,6.9 19.6,5.5 C18.9,4.9 18.1,4.4 17.2,4 C16.3,3.4 15.1,3.4 14,3.4 Z"
          }
        }
      },

      "haiku:f7479209c407": {
        d: {
          "0": {
            value: "M0.9,4 C3.2,3.9 5,4.3 7.1,5.1 C9,5.9 10.6,7 12.3,8.1 C16.6,10.9 20.9,13.9 23.9,18 C23.9,16.7 23.2,15.6 22.5,14.5 C21.1,12.1 19.6,9.8 17.6,7.8 C15.7,5.8 13.2,4.2 10.5,3.7 C7.3,3.1 4.1,2.8 0.9,4 Z"
          }
        }
      },

      "haiku:ca3234584a30": {
        fill: { "0": { value: "#5D3A3E" } },
        "translation.x": { "0": { value: 22 } },
        "translation.y": { "0": { value: 53 } }
      },

      "haiku:838671aae221": {
        d: {
          "0": {
            value: "M16.4,0.5 C18.5,0.2 20.7,1.2 21.9,2.9 C23.1,4.6 23.3,7 22.3,8.9 C21.9,5.2 19.6,2 16.4,0.5 Z"
          }
        }
      },

      "haiku:714a66c8c8e4": { "translation.y": { "0": { value: 4 } } },
      "haiku:666351be4bc1": {
        d: {
          "0": {
            value: "M16.9,6.1 C19.1,7.4 21,9 22.8,10.8 C22.4,6.8 19.5,3.3 15.9,1.7 C12.2,0.1 7.9,0.5 4.3,2.3 C4.1,2.4 3.9,2.5 3.8,2.8 C3.7,3.1 3.8,3.4 4,3.6 C4.4,4.5 4.5,5.7 4.2,6.7 C6.2,5.5 8.7,5.2 11,4.9 C11.9,4.8 12.9,4.7 13.8,4.9 C14.8,5 15.9,5.6 16.9,6.1 Z"
          }
        }
      },

      "haiku:4e4a153fab77": {
        d: {
          "0": {
            value: "M24.6,12 C24.8,11.8 25,11.5 25.2,11.3 C23.5,9.9 21.7,8.8 19.6,8.3 C16.9,7.6 14.1,7.5 11.4,8.2 C8.7,8.9 6.2,10.1 3.8,11.4 C2.7,12 1.5,12.6 0.8,13.7 C5.5,11.7 10.7,11.4 15.8,11.2 C17.8,11.1 19.8,11 21.8,11.3 C22.7,11.4 23.7,11.6 24.6,12 Z"
          }
        }
      },

      "haiku:a0059c7e2aab": {
        d: {
          "0": {
            value: "M194.2,117.9 C192.7,116.6 191.2,115.3 189.6,114 C188.9,112.3 191,110.4 190.4,108.6 C190,107.4 188.6,106.4 189.2,105.3 C189.4,105 189.7,104.8 189.9,104.6 C194.2,101.9 199.7,100.9 204.7,102.1 C201.4,100.5 197.9,98.9 194.3,99.6 C191.6,100.2 189.4,102 187.4,103.9 C183.7,107.5 180.5,112 179.7,117.1 C179.7,117.3 179.6,117.6 179.7,117.8 C180,118.4 180.9,118.2 181.6,117.8 C183.6,116.7 185.9,115.9 188.1,116.4 C190.3,116.9 192.3,119 191.8,121.3 C191.3,123.8 188.3,125.1 187.7,127.5 C189.5,128.1 191.6,127 192.7,125.5 C193.9,124 194.3,122.1 194.8,120.2 C194.9,119.7 195.1,119.1 194.8,118.6 C194.7,118.3 194.4,118.1 194.2,117.9 Z"
          }
        },

        fill: { "0": { value: "#5D3A3E" } }
      },

      "haiku:71f0b22621fd": {
        d: {
          "0": {
            value: "M198.4,106.2 C196.3,105.2 194,104.2 191.8,104.7 C189.9,105.1 188.3,106.5 187.6,108.3 C186.9,110.1 187,112.2 187.9,113.9 C188.7,111.5 190.6,109.5 192.9,108.4 C195.2,107.3 198,107.2 200.4,108.2 C200.2,107.2 199.3,106.6 198.4,106.2 Z"
          }
        },

        fill: { "0": { value: "#5D3A3E" } }
      },

      "haiku:fac52dbfbe86": {
        "translation.x": { "0": { value: 29 } },
        "translation.y": { "0": { value: 203 } }
      },

      "haiku:0a386def5373": {
        d: {
          "0": {
            value: "M140.8,21.7 C142.3,39.2 134.8,56.3 125.9,71.5 C119.2,82.8 111.3,94 100,100.7 C82.1,111.2 59,108.5 40.2,99.7 C30.1,95 20.6,88.6 13.4,80 C6.2,71.4 1.5,60.6 1.3,49.5 C1.1,39.3 4.6,29.5 8.8,20.2 C9.7,18.2 10.6,16.2 12.2,14.8 C13.8,13.3 16,12.4 18.1,11.7 C48,1.1 80.6,-1.6 111.9,3.9 C120.9,5.5 130.1,7.9 136.9,13.9 C138,14.9 139,15.9 139.7,17.2 C140.5,18.5 140.7,20.1 140.8,21.7 Z"
          }
        },

        fill: { "0": { value: "#EEF8FC" } }
      },

      "haiku:a6f86171bda7": {
        d: {
          "0": {
            value: "M129.1,67.6 C135.4,56.3 140.6,43.9 141.5,30.9 C141.7,28.3 141.7,25.7 141.4,23.1 C141.4,22.7 141.4,22.1 141.2,21.7 C141.2,21.6 140.6,21.7 140.6,21.7 C140.3,22.4 140.6,23.8 140.6,24.5 C140.7,30.4 139.8,36.4 138.2,42.1 C134.7,55.1 128,67.3 120.6,78.5 C116.9,84.1 112.8,89.4 107.8,93.9 C103.6,97.7 99,100.6 93.9,102.8 C82.7,107.7 69.5,107.5 57.8,104.8 C45.2,102 33,96.2 23,88.1 C13.4,80.3 5.8,69.8 3.1,57.6 C1.6,50.7 2,43.8 3.6,36.9 C4.4,33.6 5.5,30.3 6.7,27.1 C7.9,23.9 9.1,20.7 10.8,17.7 C12.4,14.9 14.8,13.5 17.8,12.4 C21.1,11.2 24.5,10.1 27.8,9.1 C34.6,7.1 41.4,5.5 48.4,4.3 C61.4,2 74.7,1.2 87.9,1.6 C98.7,2 109.8,3.1 120.3,5.8 C125.2,7.1 130,8.9 134.2,11.8 C136,13 138,14.5 139.2,16.4 C139.7,17.2 140.1,18.2 140.3,19.2 C140.4,19.4 140.7,21.6 140.7,21.6 C140.9,21.6 140.4,18.9 140.4,18.6 C140,17.1 139.3,15.8 138.3,14.7 C136.3,12.5 133.7,10.7 131.1,9.3 C125.3,6.1 118.8,4.5 112.4,3.3 C99.5,1 86.4,5.41788836e-14 73.3,0.5 C59.4,0.9 45.6,2.9 32.2,6.4 C28.7,7.3 25.3,8.3 21.9,9.4 C18.8,10.4 15.4,11.2 12.7,13.2 C10.1,15.1 8.8,18.1 7.6,20.9 C6.2,24 5,27.1 3.9,30.3 C1.7,36.9 0.2,43.8 0.6,50.8 C1,57.2 2.7,63.4 5.5,69.1 C11.1,80.4 20.5,89.2 31.2,95.6 C51.6,107.8 80,113.9 101.4,100.5 C113.9,93 122.1,80.1 129.1,67.6 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:367fb632e80a": {
        d: {
          "0": {
            value: "M34,252.5 C32.4,257.5 34,263 36.3,267.8 C42.7,281.6 54.1,293 67.9,299.5 C81.7,306 97.7,307.5 112.5,303.7 C124.1,300.7 135.3,294 141.2,283.6 C145.8,275.5 146.9,265.8 147,256.4 C147.1,252.7 146.9,248.7 144.3,246 C142.3,243.9 139.4,243.2 136.6,242.6 C109.8,236.8 81.9,235.1 54.8,239.7 C50.6,240.4 46.3,241.3 42.5,243.3 C38.6,245.2 35.3,248.4 34,252.5 Z"
          }
        },

        fill: { "0": { value: "#ACBFC1" } }
      },

      "haiku:670a36f96803": {
        d: {
          "0": {
            value: "M83.3,12.8 C99.5,7.2 116.8,4.9 133.9,6 C123,8 112.8,13.3 104.7,20.9 C118.2,15.7 132.3,10.5 146.7,12.2 C141.1,16.2 137.4,22.8 136.8,29.7 C142.3,24 149.3,19.7 156.8,17.3 C159.7,27.7 161.7,38.4 162.8,49.1 C166.6,39.3 168,28.7 166.9,18.3 C173.3,23.7 178.8,30 183.4,37 C182.5,33.1 181.7,29.2 180.8,25.4 C184.7,29.1 188.6,32.7 192.5,36.4 C196.9,40.5 201.6,45.3 201.8,51.3 C197.5,35.1 191,19.5 182.7,5 C175.8,4.2 169,8.3 162.2,7.1 C158.9,6.5 155.9,4.6 152.8,3.3 C144.8,-0.1 135.8,-0.1 127.1,0.4 C111.8,1 95.5,3.2 83.3,12.8 Z"
          }
        },

        fill: { "0": { value: "#BB866D" } }
      },

      "haiku:e44efd3537ea": {
        "translation.x": { "0": { value: 117 } },
        "translation.y": { "0": { value: 131 } }
      },

      "haiku:d9a658e4f21e": {
        d: {
          "0": {
            value: "M14.4,9.6 C11.1,8.6 5.8,10.1 4.4,13.3 C3.8,14.7 4.7,16.3 6.2,16.5 C8,16.8 9.9,16.6 11.6,15.9 C8.3,16.1 5.1,17.7 2.9,20.1 C1.2,21.9 3.1,24.8 5.4,24.1 C7.3,23.5 9.1,22.9 10.9,22 C8.5,22.9 6,23.9 4.1,25.6 C2.2,27.4 1,30.1 1.8,32.6 C2.6,35.1 6,36.6 8,35 C7.6,32.4 11.8,31.7 13.9,33.2 C16.1,34.7 18,37.2 20.7,36.9 C24.1,51.6 32.3,65.2 43.6,75.2 C50.6,81.4 61.3,86.2 69,80.8 C74.6,76.9 75.9,69.1 75.1,62.4 C72.8,43.8 56.2,28.1 37.5,26.9 C39.1,18.1 35.1,8.5 27.6,3.6 C24.4,1.5 20.6,0.2 16.8,0.8 C13.6,1.3 10.6,3.2 9.2,6 C8.7,7 9.4,8.3 10.5,8.5 C11.9,8.8 13.2,8.7 14.4,9.6 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:3437b621c4cc": {
        d: {
          "0": {
            value: "M3.4,22.8 C2.2,21.3 4.5,19.7 5.5,19 C7.3,17.7 9.4,16.9 11.6,16.8 C11.5,16.3 11.4,15.8 11.3,15.3 C9.9,15.9 5.2,17.1 5,14.5 C4.7,12 8.6,10.5 10.4,10.1 C11.5,9.9 12.5,9.8 13.6,9.9 C13.6,9.9 14.4,10 14.4,10 C14.4,10 14.6,9.5 14.5,9.4 C13,8.3 9.9,8.9 8.4,9.4 C6.5,10 4.6,11.2 3.8,13.1 C3.3,14.2 3.5,15.5 4.3,16.4 C5.2,17.5 6.7,17.6 8,17.5 C10.9,17.5 13.7,16 16.4,15 C12.4,15.2 8.5,15.1 5.1,17.4 C2.9,18.8 0.1,21.5 2.4,24.1 C4.2,26.1 7.1,24.7 9.2,23.9 C10,23.6 10.7,23.3 11.5,22.9 C11.5,22.8 11.2,22.3 11.2,22.1 C11.1,22 11,21.4 10.9,21.3 C10.1,21.6 9.3,21.9 8.4,22.3 C5.6,23.5 3,25.2 1.7,28 C0.4,30.8 0.8,34.3 3.7,35.9 C4.8,36.6 6.2,36.8 7.5,36.5 C7.7,36.4 8,36.3 8.2,36.2 C8.8,35.9 9,35.8 9.1,35.2 C8.9,32.8 12.6,33.2 14,34.2 C16,35.6 17.8,37.8 20.4,37.9 C20.5,37.9 21,40.3 21,40.4 C21.5,42.2 22.1,44 22.7,45.8 C23.8,48.9 25.2,52 26.7,54.9 C29.7,60.7 33.5,66 37.9,70.8 C42.4,75.7 47.7,80.3 54.1,82.7 C60.3,85 67.5,84.8 72.1,79.4 C76.4,74.3 76.7,67 75.7,60.7 C74.6,54.2 71.6,47.9 67.5,42.8 C63.2,37.4 57.9,33.4 51.7,30.3 C49.5,29.2 46.9,28.2 44.5,27.7 C43.4,27.5 42.2,27.2 41.1,27 C40.3,26.9 39.6,26.8 38.8,26.8 C38.2,26.7 38.4,26.9 38.4,26.5 C38.2,25.9 38.6,24.8 38.6,24.2 C38.7,23 38.6,21.8 38.5,20.6 C38.2,18 37.4,15.3 36.3,13 C34.2,8.6 30.7,4.7 26.3,2.5 C22,0.3 16.8,-0.3 12.7,2.5 C11.3,3.4 8.5,5.9 9.5,7.9 C10.1,8.9 11.1,8.9 12.2,9 C12.4,9 14.9,9.6 14.8,9.8 C15.1,9.4 11.8,8.7 11.6,8.7 C9.9,8.5 9.3,7.3 10.2,5.8 C11.7,3.4 14.4,1.8 17.2,1.4 C23.2,0.5 29.1,4.3 32.7,8.8 C36.6,13.6 38.5,20.1 37.5,26.3 C37.4,26.8 37.4,27.2 37.3,27.7 C37.3,27.8 40,28.1 40.3,28.1 C42.3,28.3 44.3,28.8 46.2,29.4 C58.6,33.2 69.3,43.6 73.2,56 C75.2,62.2 75.9,69.4 73.1,75.5 C71.8,78.3 69.6,80.5 66.8,81.7 C63.7,83.1 60.1,82.9 56.8,82 C50.2,80.1 44.7,75.6 40.1,70.7 C35.6,66 31.7,60.6 28.6,54.8 C25.7,49.4 23.5,43.6 22,37.6 C21.9,37.2 21.8,36.9 21.7,36.5 C21.6,36.2 21.2,36.3 20.9,36.3 C19.7,36.3 18.7,35.8 17.7,35.1 C15.3,33.3 13.2,31.1 9.8,32.1 C8.8,32.4 7.9,33 7.5,34 C7.3,34.6 7.5,34.8 7,34.9 C5,35.4 3,33.8 2.7,31.9 C1.8,26.8 7.8,24.3 11.5,22.9 C11.3,22.4 11.1,21.9 10.9,21.3 C9.6,21.9 8.2,22.4 6.8,22.9 C5.5,23.3 4.2,23.9 3.4,22.8 C3.4,22.8 3.7,23.2 3.4,22.8 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:74d62972183e": {
        "translation.x": { "0": { value: 49 } },
        "translation.y": { "0": { value: 152 } }
      },

      "haiku:b47b28acbf34": {
        d: {
          "0": {
            value: "M42.1,5.2 C40.9,2.3 37.2,1.5 34.1,1.6 C23.9,1.9 14.3,7.7 7.8,15.6 C5.1,18.9 2.8,22.6 1.8,26.7 C0.8,30.8 1.3,35.4 3.6,38.9 C6,42.4 10.5,44.6 14.6,43.6 C17.3,43 19.6,41.1 21.8,39.2 C31.1,31.2 40.5,21.6 42.3,9.4 C42.5,8 42.6,6.5 42.1,5.2 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:e09936348958": {
        d: {
          "0": {
            value: "M28.2,3.2 C31.1,2.4 34.4,2 37.4,2.6 C38.6,2.8 39.8,3.3 40.8,4.1 C41.2,4.4 41.4,4.9 41.8,5.2 C41.9,5.3 42.4,5.1 42.4,4.8 C41.9,2.1 38.3,1 36.1,0.8 C33,0.4 29.7,0.9 26.8,1.8 C20.5,3.5 14.8,7.2 10.1,11.8 C5.5,16.3 1.4,22.2 0.7,28.8 C1.13020704e-13,34.9 2.7,41.5 8.8,43.7 C15.6,46.2 20.8,41.1 25.4,36.8 C30.3,32.3 35,27.3 38.3,21.5 C39.8,18.9 41.1,16 41.8,13.1 C42.2,11.7 42.5,10.2 42.6,8.7 C42.6,8.5 42.5,5 42.1,5.2 C42.2,5.2 42.3,7.6 42.3,7.7 C42.2,9.2 41.8,10.7 41.4,12.2 C40.5,15.2 39.3,18 37.7,20.7 C34.2,26.5 29.5,31.4 24.5,35.9 C20.1,39.8 15,45 8.6,42.1 C2.8,39.4 1.2,32.5 2.6,26.7 C4.1,20.7 8.3,15.5 12.9,11.4 C17.3,7.6 22.5,4.6 28.2,3.2 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:b7153eafdd90": {
        d: {
          "0": {
            value: "M75.2,163.1 C72.7,170 65.5,173.8 60.9,179.5 C59.5,181.2 58.2,183.2 58,185.5 C57.7,187.7 58.7,190.2 60.7,191.2 C62.8,192.3 65.3,191.6 67.4,190.7 C71.8,188.8 75.7,186 79,182.6 C81.4,180 83.5,176.9 84.2,173.4 C84.9,169.9 83.9,165.9 81.2,163.6 C78.5,161.3 73.9,161.2 71.5,163.9"
          }
        },

        fill: { "0": { value: "#E2A286" } }
      },

      "haiku:6290da2e5d8c": {
        "translation.x": { "0": { value: 70 } },
        "translation.y": { "0": { value: 147 } }
      },

      "haiku:6fd7434cfeb6": {
        d: {
          "0": {
            value: "M30.3,26 C28.7,25.6 27.3,25.1 26.3,24.8 C27.1,27.6 29.7,29.3 28.1,31.6 C27.3,32.8 26.1,33.9 24.7,34.1 C23.3,34.4 21.6,33.6 21.2,32.2 C22,35.5 19.1,36.9 15.7,37.1 C12.9,37.2 10.3,35.4 9.2,32.9 C7.5,29.1 5.5,27.5 5.5,23.7 C4.1,24.4 2.6,22.8 2,21.3 C-0.6,14.5 2.7,6 9.2,2.8 C13.5,0.7 18.7,0.7 23.1,2.4 C27.6,4 31.5,7.1 34.7,10.6 C35.5,11.4 36.2,12.4 36.5,13.5 C36.8,14.6 36.5,15.9 35.5,16.5 C34,17.1 32.3,17 31,16.1 C32.7,17 34,19 34.8,21.2 C35.7,23.9 33.1,26.6 30.3,26 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:0b405eb519f2": {
        d: {
          "0": {
            value: "M25.4,34.9 C27.3,34.4 29.5,32.2 29.4,30.1 C29.4,28.9 28.7,27.9 28.1,27 C27.9,26.7 27.5,26.3 27.4,25.9 C28.2,25.9 28.9,26.2 29.7,26.3 C29.9,26.3 30.6,26 30.2,25.7 C29.6,25.3 28.7,25.1 28,24.8 C27.1,24.5 26.1,24.2 25.2,23.9 C25.5,25.5 26.2,26.9 27,28.2 C27.5,29 28,30 27.5,30.9 C27,31.8 26.2,32.6 25.2,33.1 C24.2,33.6 22.9,33.5 22.1,32.6 C21.7,32.1 21.7,32.1 21,32.3 C20.4,32.5 20.2,32.4 20.2,33 C20.3,33.5 20.2,34 20,34.5 C19.1,36.2 16.2,36.5 14.6,36.3 C12.4,36 10.7,34.6 9.7,32.6 C8.9,30.9 7.9,29.4 7,27.7 C6.1,26 6,24.4 6,22.5 C5.3,22.8 4.6,23.2 3.9,22.8 C3.1,22.3 2.6,21.3 2.3,20.4 C1.4,17.7 1.4,14.7 2.3,11.9 C4,6.2 8.9,2.3 14.8,1.8 C20.7,1.3 26.3,3.9 30.7,7.7 C31.7,8.6 32.7,9.5 33.7,10.5 C34.6,11.4 35.6,12.5 35.8,13.8 C36,15 35.4,15.9 34.3,16.2 C33.6,16.4 32.9,16.4 32.2,16.2 C31.9,16.1 31.5,16 31.2,15.8 C30.7,15.5 30.7,15.9 30.5,16.3 C32.5,17.4 34.7,20.4 34.4,22.7 C34.2,23.8 33.5,24.8 32.5,25.4 C32.3,25.5 30,26 30,25.9 C29.9,26.3 32.3,25.9 32.5,25.8 C33.7,25.3 34.7,24.2 34.9,22.9 C35.4,20.3 33.1,16.9 30.9,15.6 C30.8,15.7 30.4,16.2 30.5,16.3 C31,16.7 31.7,16.9 32.3,17.1 C33.7,17.4 35.6,17.3 36.4,15.9 C38.1,13.1 35.1,10.2 33.3,8.4 C28.7,3.8 22.6,0.3 16,0.4 C9.3,0.5 3.4,4.5 1.2,10.8 C0.1,13.9 -0.1,17.3 0.8,20.4 C1.1,21.5 1.5,22.5 2.3,23.4 C2.8,23.9 3.8,24.8 4.6,24.6 C4.7,25.3 4.8,26.1 5,26.8 C5.4,28.1 6.2,29.3 6.8,30.4 C7.9,32.3 8.6,34.4 10.2,35.9 C12.3,37.8 15.1,38.2 17.8,37.6 C19.5,37.2 21.4,36.2 21.8,34.4 C23,35.1 24.3,35.2 25.4,34.9 C25.5,34.8 24.8,35.1 25.4,34.9 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:2ae7d0b81485": { "translation.y": { "0": { value: 186 } } },
      "haiku:18d31c6c5562": {
        d: {
          "0": {
            value: "M43.6,3.8 C50.9,7.1 56.8,12.9 61.9,19.1 C73.3,32.8 82.2,49.5 82.4,67.3 C82.4,68.4 82.4,69.6 81.8,70.6 C81.2,71.7 80.1,72.3 78.9,72.8 C74,74.9 68.5,74.9 63.2,74.4 C52.4,73.2 41.9,69.9 31.5,66.5 C27,65.1 22.6,63.6 18.5,61.2 C10.4,56.4 4.7,48.1 2.3,39 C0.5,32.2 0.6,24.8 3.3,18.3 C6.3,11 12.7,5.2 20.2,2.6 C27.9,-2.22044605e-15 36.3,0.6 43.6,3.8 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:e6760b492d6a": {
        d: {
          "0": {
            value: "M65.9,22.9 C62,17.8 57.7,12.8 52.6,8.8 C50.4,7.1 48,5.5 45.4,4.3 C45,4.1 43.7,3.3 43.5,3.9 C43.3,4.4 43.7,4.4 44.1,4.7 C54.6,10.8 62.7,20.5 69.2,30.6 C72.9,36.3 76,42.4 78.2,48.9 C79.3,52.2 80.2,55.5 80.7,58.9 C81,60.6 81.2,62.3 81.3,64 C81.4,65.7 81.7,67.7 81.3,69.4 C80.6,72.4 75.7,73.3 73.2,73.7 C69.7,74.2 66.2,74 62.7,73.6 C55.6,72.8 48.8,71.1 42,69.1 C35.6,67.2 28.9,65.4 22.8,62.7 C17,60.2 12.2,56.1 8.6,51 C1.3,40.5 -1,25.3 6.3,14.3 C10.5,8 17.1,3.5 24.5,2.1 C28.1,1.4 31.8,1.3 35.4,1.9 C36.2,2 43.6,3.9 43.6,4.1 C43.8,3.7 37.8,1.9 37.1,1.8 C34.2,1.1 31.3,0.9 28.4,1 C21.9,1.3 15.7,3.7 10.7,8 C6,12 2.7,17.5 1.4,23.5 C2.22044605e-15,30 0.8,36.9 3.1,43.2 C5.2,49.1 8.8,54.5 13.5,58.6 C18.7,63.2 25.1,65.5 31.6,67.6 C38.2,69.8 44.9,71.9 51.7,73.5 C58.4,75.1 65.7,76.4 72.6,75.7 C75.2,75.4 77.8,74.8 80.1,73.6 C82.5,72.4 83.4,70.4 83.3,67.7 C83.2,62.3 82.4,57 80.9,51.9 C77.9,41.1 72.5,31.5 65.9,22.9 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:871e566e2c56": {
        d: {
          "0": {
            value: "M5.1,217.8 C3.9,226.1 7.5,234.7 13.4,240.7 C19.3,246.7 27.4,250.1 35.7,251.7 C44,253.3 52.5,253.1 60.9,252.5 C61.3,246.8 61.7,241 62.1,235.3 C52.2,238.7 41.1,238.3 31.2,234.9 C21.3,231.5 12.4,225.3 5.1,217.8 Z"
          }
        },

        fill: { "0": { value: "#E2A286" } }
      },

      "haiku:e4fe667b5773": {
        "translation.x": { "0": { value: 51 } },
        "translation.y": { "0": { value: 202 } }
      },

      "haiku:e413e6b46d68": {
        d: {
          "0": {
            value: "M38.1,0.7 C42.5,0.7 44.6,2.6 46.9,6.4 C49.2,10.2 48.9,13.9 50.2,15.9 C59.1,29.3 44.5,52.3 31.2,61.2 C28.2,63.2 24.9,64.9 21.4,65.1 C17.2,65.4 13.2,63.6 9.3,61.9 C7,60.9 4.6,59.7 3.1,57.6 C2.1,56.1 1.7,54.2 1.4,52.4 C0.2,42.9 2.8,33.1 7.8,24.9 C12.8,16.7 19.9,10 27.9,4.7 C31,2.7 34.4,0.7 38.1,0.7 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:8a8c3ea2c951": {
        d: {
          "0": {
            value: "M51.2,15.9 C49.7,13.3 49.7,10.2 48.4,7.5 C47.1,4.9 45,1.9 42.2,0.9 C41,0.4 39.6,0.2 38.4,0.4 C38,0.5 38.1,0.6 38.1,1 C38.1,1.3 39.1,1.3 39.3,1.3 C42.4,1.8 44.3,3.8 45.9,6.4 C46.7,7.6 47.3,8.9 47.7,10.3 C48.2,11.9 48.3,13.6 48.9,15.1 C49.2,16 49.7,16.6 50.2,17.4 C51,18.9 51.5,20.5 51.9,22.1 C53.2,28.8 50.6,35.8 47.5,41.6 C44.4,47.3 40.3,52.6 35.4,56.9 C30.4,61.4 24.1,65.5 17.2,63.9 C13.9,63.2 10.7,61.7 7.7,60.2 C4.7,58.7 2.9,56.6 2.3,53.2 C1.2,46.4 2.2,39.3 4.6,32.9 C7.6,24.8 12.9,17.9 19.2,12.1 C22.3,9.2 25.6,6.6 29.1,4.3 C30.8,3.2 32.6,2.1 34.5,1.5 C34.7,1.4 38.2,0.6 38.2,0.7 C38.2,0.4 35.2,0.9 35,1 C33.5,1.4 32.1,2 30.7,2.7 C28.1,4.1 25.6,5.9 23.2,7.7 C18.3,11.4 13.7,15.8 10,20.7 C6.1,25.9 3.2,31.8 1.7,38 C0.9,41.3 0.5,44.7 0.5,48 C0.5,51.1 0.7,54.9 2.4,57.6 C4.1,60.3 7.1,61.6 9.9,62.8 C13,64.2 16.2,65.5 19.6,65.7 C26.3,66.1 32.4,61.8 37.1,57.5 C41.9,53.1 46,47.9 49.1,42.1 C52.2,36.3 54.6,29.5 53.8,22.9 C53.4,20.6 52.6,18 51.2,15.9 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:18df128efcf3": {
        "translation.x": { "0": { value: 78 } },
        "translation.y": { "0": { value: 203 } }
      },

      "haiku:ef84e6681bc2": {
        d: {
          "0": {
            value: "M88.9,31.2 C90,26.9 88.1,22.3 85.6,18.6 C77.9,7.2 63.8,0.5 50.2,1.7 C46.6,2 43.1,2.9 40,4.6 C37.2,6.2 34.8,8.6 32.6,11 C16.9,28.4 7.4,50.8 2.6,73.7 C1.6,78.5 0.8,83.5 1.6,88.3 C2.4,93.2 5.1,97.9 9.5,100.1 C13.5,102.1 18.4,101.8 22.5,100.1 C26.7,98.5 30.2,95.7 33.7,92.8 C40.1,87.5 46.4,81.9 51.1,75 C49.7,77.3 50.7,80.6 52.8,82.2 C55,83.8 58,84 60.6,83.3 C63.2,82.5 65.5,80.9 67.5,79.1 C75.4,72.2 81,63.1 85.4,53.6 C89.6,44.6 93,34.6 91.4,24.7"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:a212b8981ff0": {
        d: {
          "0": {
            value: "M66.5,4.8 C71.5,6.6 76.1,9.5 79.9,13.1 C84,17 88.3,22.3 88.7,28.1 C88.8,29.1 88.6,30.1 88.6,31.1 C88.6,31.2 89.1,31.4 89.2,31.3 C89.3,31.3 89.6,29.9 89.6,29.8 C90,27 89.3,24.1 88.1,21.6 C85.5,15.9 80.9,11.2 75.8,7.7 C67.5,2 56.7,-0.6 46.7,1.4 C43.4,2 40.3,3.3 37.6,5.2 C34.9,7.2 32.7,9.7 30.5,12.2 C25.9,17.5 21.8,23.3 18.3,29.4 C11.2,41.7 6.1,55 2.9,68.8 C1.4,75.5 -0.5,82.7 1.1,89.6 C2.4,95.5 6.4,100.8 12.5,102.1 C21,103.8 28.5,98.2 34.7,93.1 C40.2,88.5 46,83.7 50,77.7 C49.6,78.4 50,79.5 50.3,80.1 C50.9,81.6 52,82.8 53.5,83.5 C56.4,85 59.9,84.6 62.7,83.2 C65.7,81.8 68.2,79.4 70.5,77.1 C73,74.6 75.2,71.9 77.2,69 C81.1,63.4 84.3,57.3 87,51 C89.5,45.1 91.5,38.9 91.9,32.5 C91.9,31.9 91.8,24.7 91.4,24.8 C91.5,24.8 91.6,31.6 91.6,32.1 C91.4,35.2 90.8,38.2 89.9,41.2 C88.1,47.5 85.2,53.6 82.1,59.4 C78.8,65.4 74.9,71.1 70.1,76 C66.2,79.9 59.6,85.8 53.7,82.2 C52.2,81.3 51,79.5 51.1,77.7 C51.1,77.3 51.3,76.9 51.3,76.4 C51.3,76 51.6,76.3 51.2,75.8 C51,75.6 50.9,75.3 51.1,75.1 C51,75.1 50.8,75.2 50.7,75.2 C50.2,75.3 50.2,75.4 49.8,75.9 C49,77 48.2,78 47.4,79 C45.2,81.7 42.7,84.2 40.2,86.5 C37.6,88.9 34.9,91.1 32.2,93.3 C29.6,95.4 26.9,97.3 24,98.8 C18.6,101.4 11.6,101.9 7,97.4 C2.3,92.8 1.7,85.8 2.4,79.6 C3.3,72.6 5.2,65.6 7.3,58.8 C9.4,52.1 11.9,45.5 15,39.1 C18,32.7 21.6,26.6 25.8,20.9 C27.8,18.1 29.9,15.5 32.1,12.9 C34.1,10.5 36.3,8.2 38.9,6.3 C46.5,0.9 58.1,1.5 66.5,4.8 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:703f9214d665": {
        d: {
          "0": {
            value: "M129.1,222.8 C132.3,244.8 122.7,268.2 104.9,281.6 C100.6,284.9 95.5,288 93.8,293.1 C93.4,294.3 93.2,295.6 93.7,296.8 C94.3,298.4 96.1,299.4 97.8,299.6 C99.5,299.8 101.3,299.2 102.9,298.5 C109,295.8 113.8,291 117.9,285.8 C122,280.6 125.5,274.9 129.8,269.9 C129.7,272.6 129.6,275.4 130.4,277.9 C131.2,280.5 132.9,282.9 135.5,283.8 C138.7,284.9 142.2,283.4 144.9,281.4 C151.4,276.7 155.9,269.3 157.1,261.3 C158.3,253.3 156.1,244.9 151.3,238.5 C145.6,231.4 137.2,227 129.1,222.8 Z"
          }
        },

        fill: { "0": { value: "#E2A286" } }
      },

      "haiku:84864efc7f6d": {
        "translation.x": { "0": { value: 51 } },
        "translation.y": { "0": { value: 246 } }
      },

      "haiku:faf1b490d5f2": {
        d: {
          "0": {
            value: "M50.2,46.9 C51.6,36.2 50.1,24.7 44.2,15.7 C38.3,6.6 27.4,0.4 16.7,1.9 C12.9,2.4 9.3,3.8 5.7,5.3 C4.2,5.9 2.5,6.6 1.7,8.1 C1.2,9 1.1,10.1 1,11.1 C0.8,14.3 0.8,17.6 1.9,20.6 C4.4,27.8 12.1,32.2 14.4,39.5 C15,41.4 15.2,43.5 15.6,45.5 C16.9,52.3 21,58.8 27.3,61.8 C33.6,64.8 42,63.6 46.2,58.1 C48.7,54.8 49.7,50.8 50.2,46.9 Z"
          }
        },

        fill: { "0": { value: "#E9B092" } }
      },

      "haiku:7acf82b14364": {
        d: {
          "0": {
            value: "M48,26 C49.7,31.9 50.1,38 49.9,44.1 C49.9,44.9 49.8,45.8 49.8,46.6 C49.8,46.9 50.4,47.1 50.5,46.8 C51.2,44.8 51.2,42.3 51.3,40.2 C51.7,27.9 47.5,15.1 37.6,7.3 C32.6,3.4 26.3,0.8 20,0.8 C14.5,0.9 9,2.7 4.1,5 C2.9,5.6 1.7,6.4 1,7.6 C0.2,9.1 0.3,10.9 0.2,12.5 C0.1,15.8 0.4,19.2 1.8,22.3 C4.6,28.4 10.8,32.2 13.4,38.5 C14.3,41 14.6,43.6 15.2,46.2 C15.8,48.9 16.8,51.5 18.3,53.9 C21,58.4 25.2,62.1 30.4,63.4 C35.4,64.6 41.2,63.5 45.1,60 C47,58.2 48.3,56 49.1,53.5 C49.3,53 50.7,47.1 50.3,47 C50.4,47 48.7,53.2 48.5,53.7 C47.4,56.5 45.7,58.9 43.2,60.6 C37.9,64.1 30.6,63.6 25.4,60 C20.1,56.4 17.2,50.3 16.2,44.1 C15.6,40.7 14.9,37.6 13,34.7 C11.1,31.9 8.7,29.4 6.6,26.8 C4.5,24.2 2.8,21.4 2.2,18.1 C1.9,16.5 1.9,14.8 1.9,13.2 C1.9,11.7 1.8,9.9 2.6,8.5 C3.3,7.3 4.7,6.7 6,6.2 C7.6,5.5 9.3,4.9 11,4.3 C13.5,3.4 16.3,2.6 19,2.6 C31.6,2.5 42.1,10.8 46.8,22.2 C47.1,23.3 47.6,24.6 48,26 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:3eda062fe36f": {
        "translation.x": { "0": { value: 92 } },
        "translation.y": { "0": { value: 65 } }
      },

      "haiku:62f201490758": {
        d: {
          "0": {
            value: "M20.7,14.7 C22.4,14.3 24.5,13.2 24.9,11.4 C25,11.1 24.7,10.4 24.3,10.7 C23.6,11.1 23.1,11.9 22.4,12.3 C18.5,14.4 12.8,14.1 8.7,13 C6.7,12.5 4.4,11.6 3.2,9.8 C2,8.1 1.7,5.3 3.5,3.9 C5.3,2.4 7.9,2.7 10,2.6 C11.1,2.5 12.2,2.4 13.2,2 C13.4,1.9 15.3,0.9 15.3,0.8 C15.3,0.8 11.8,1.8 11.5,1.8 C9.9,1.9 8.2,1.7 6.6,1.8 C2.8,2 0.1,5 1.2,8.9 C2.2,12.5 5.8,14.2 9.2,15 C12.9,15.6 17,15.6 20.7,14.7 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:a1f79de7c002": {
        d: {
          "0": {
            value: "M7.5,10.4 C6.5,10.7 5.4,10.8 4.5,10.4 C3.6,10 3,8.7 3.6,7.9 C4.2,7.1 5.4,7.2 6.2,7.9 C6.9,8.5 7.3,9.5 7.5,10.4 Z"
          }
        },

        fill: { "0": { value: "#C97557" } }
      },

      "haiku:e9015c69fe90": {
        d: {
          "0": {
            value: "M15.3,9.8 C15.8,9.2 16.5,8.6 17.2,8.7 C17.9,8.8 18.5,9.5 18.7,10.2 C18.9,10.9 18.9,11.7 19.2,12.4 C17.6,13 15.8,13.2 14.1,13 C14.2,11.8 14.6,10.7 15.3,9.8 Z"
          }
        },

        fill: { "0": { value: "#C97557" } }
      },

      "haiku:d0fac27b30ed": {
        d: {
          "0": {
            value: "M14.8,4.2 C12.6,2.5 9.4,2.1 6.9,3.4 C6.1,3.8 5.3,4.5 5.4,5.4 C5.5,6.1 6.2,6.6 6.8,7 C8.8,8.1 11.2,8.4 13.4,8 C14,7.9 14.6,7.7 15,7.4 C15.5,7 15.8,6.5 15.8,5.9 C15.8,5.2 15.3,4.6 14.8,4.2 Z"
          }
        },

        fill: { "0": { value: "#E9C5B6" } }
      },

      "haiku:8e3fef7bbc9e": {
        d: {
          "0": {
            value: "M85.8,253.3 C86.1,252.8 86.2,252 85.6,251.8 C85,251.2 84.2,252.7 84,253.1 C83.2,254.7 83,256.8 83.6,258.6 C83.8,259.3 84.2,260.2 84.9,260.6 C85.4,260.9 85.1,259.9 85,259.7 C84.5,257.4 84.6,255.2 85.8,253.3 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:21f74cd22df0": {
        d: {
          "0": {
            value: "M78.8,250.7 C79.3,250.7 81.1,250.7 80.7,249.7 C80.3,248.7 78,249.1 77.3,249.2 C75.8,249.6 74.5,250.6 73.9,252 C73.2,253.6 73.8,255.2 74.4,256.7 C74.9,257.9 75.6,259.5 76.8,260.2 C77.4,260.5 77,259.8 76.8,259.6 C76.5,259 76.2,258.4 76,257.7 C75.5,256.4 74.8,254.6 75.1,253.2 C75.6,251.6 77.3,250.8 78.8,250.7 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:29016a5746bf": {
        d: {
          "0": {
            value: "M69.2,249.5 C69.6,249.4 70.4,249.3 70.7,248.9 C70.8,248.7 70.8,248.1 70.5,248 C69.5,247.4 67.7,248.1 66.9,248.7 C64.2,250.6 64.9,254.8 66,257.4 C66.3,258.1 66.8,259.3 67.5,259.7 C67.7,259.8 67.1,257.7 67.1,257.6 C66.4,254.8 65.6,250.3 69.2,249.5 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:8a4fa9507e4d": {
        d: {
          "0": {
            value: "M59,252.6 C59.1,252.2 59,251.2 58.5,251 C57.4,250.8 57.3,252.7 57.3,253.4 C57.5,255.8 58.7,258.1 60.4,259.7 C60.7,260 61.7,261 62.2,260.8 C62.5,260.7 61.4,259.4 61.4,259.3 C60.3,257.6 58.7,254.8 59,252.6 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:605ca50c6297": {
        d: {
          "0": {
            value: "M74,215.6 C73.6,215.8 70.8,217.5 72.2,218.1 C72.5,218.4 74,217.4 74.3,217.3 C75.3,216.8 76.3,216.4 77.4,216.6 C82.7,217.1 80.9,225.1 78.8,227.8 C78.7,228 77.3,229.1 77.3,229.2 C77.4,229.6 79.2,228.4 79.3,228.3 C80.9,226.9 81.7,224.6 82.1,222.5 C82.6,220.2 82.2,217.5 80.3,215.9 C78.6,214.5 76,214.6 74,215.6 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:362eff6d5cda": {
        d: {
          "0": {
            value: "M82.4,209.4 C81.9,209.5 79.5,210.3 80.6,211.2 C80.8,211.6 82.4,211.1 82.7,211.1 C83.5,211 84.3,211.1 84.8,211.8 C86.2,213.5 85.2,215.8 84.2,217.3 C83.6,218.2 83,219 82.4,219.8 C82.2,220.2 81.9,220.6 81.6,221 C81.5,221.1 80.7,221.5 80.7,221.7 C80.6,222.2 82,221.6 82.1,221.5 C82.8,221 83.4,220.2 84,219.6 C85.1,218.4 86.1,217.2 86.7,215.8 C87.8,212.6 86,208.7 82.4,209.4 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:0703bb009aa4": {
        d: {
          "0": {
            value: "M84.8,203.2 C84.1,203.5 83.2,203.7 82.6,204.3 C82.4,204.5 82.4,205.2 82.7,205.3 C83.5,205.5 84.6,205.1 85.3,204.9 C86.5,204.5 87.8,204.1 89,204.6 C91,205.3 91.5,207.8 90.9,209.6 C90.2,211.6 88.6,213 86.8,214 C86.7,214.1 85.2,215 85.3,215 C85.9,215.2 86.9,214.7 87.5,214.4 C89.5,213.6 91.3,212 92.1,210 C92.9,208 92.6,205.6 91,204 C89.4,202.2 87,202.5 84.8,203.2 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:01b2b5be103d": {
        d: {
          "0": {
            value: "M98.4,209.6 C98.6,209 98.4,208.4 97.7,208.4 C97,208.4 96.8,208.9 96.6,209.5 C96,211.1 94.6,212.3 93,212.9 C91,213.6 93.7,213.8 94.5,213.6 C96.3,213 97.9,211.4 98.4,209.6 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:acb195280fe6": {
        d: {
          "0": {
            value: "M101.1,216.2 C101.7,214.9 100.1,214.7 99.5,215.6 C98.8,217.4 96.6,217.4 95.1,217.7 C94.8,217.8 94.3,217.9 94.8,218.2 C95.5,218.6 96.4,218.7 97.1,218.7 C98.8,218.6 100.4,217.8 101.1,216.2 Z"
          }
        },

        fill: { "0": { value: "#A44C48" } }
      },

      "haiku:12a1a69413fd": {
        d: {
          "0": {
            value: "M188.4,206.8 C185.1,208.1 181.4,206.2 178.4,204.2 C163.8,194.5 151.3,181.6 142.1,166.7 C141.4,166.9 140.8,167 140.1,167.2 C141.2,173.2 143.9,178.8 146.8,184.2 C149.6,189.5 152.6,194.9 156.5,199.5 C160.4,204.1 165.4,207.9 171.2,209.6 C177,211.2 183.7,210.5 188.4,206.8 Z"
          }
        },

        fill: { "0": { value: "#E2A286" } }
      },

      "haiku:711d66112928": {
        viewBox: { "0": { value: "0 0 38 271" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 38 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 271 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 393.5, edited: true } },
        "translation.y": { "0": { value: 51, edited: true } },
        "style.zIndex": { "0": { value: 23 } },
        "rotation.x": {
          "0": {
            value: Haiku.inject(
              function(axisTilt) {
                return axisTilt;
              },
              "axisTilt"
            ),

            edited: true
          }
        }
      },

      "haiku:bf46e815c276": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:23e89a342c7a": {
        "translation.x": { "0": { value: -307 } },
        "translation.y": { "0": { value: -127 } }
      },

      "haiku:6cc7378eefe7": {
        "translation.x": { "0": { value: 307 } },
        "translation.y": { "0": { value: 127 } }
      },

      "haiku:dd367c3128ef": {
        d: { "0": { value: "M18.5,38.5 L18.5,256.520641" } },
        stroke: { "0": { value: "#979797" } },
        "stroke-width": { "0": { value: "27" } },
        "stroke-linecap": { "0": { value: "square" } }
      },

      "haiku:5f0b6ac77315": {
        fill: {
          "0": {
            value: Haiku.inject(
              function(currentBaby, fatness) {
                return /baby\d/.test(currentBaby) || fatness >= 1.225
                  ? "red"
                  : "blue";
              },
              "currentBaby",
              "fatness"
            )
          }
        },

        cx: { "0": { value: "19" } },
        cy: { "0": { value: "19" } },
        r: { "0": { value: "19" } }
      },

      "haiku:72c5d649995a": { "translation.x": { "0": { value: 4 } } },
      "haiku:b624d627ebfa": { fill: { "0": { value: "white" } } },
      "haiku:5a9769f8f2bd": {
        "xlink:href": { "0": { value: "#path-1-0f8f07" } }
      },

      "haiku:80f263a3001a": {
        fill: { "0": { value: "#F8E71C" } },
        "xlink:href": { "0": { value: "#path-1-0f8f07" } }
      },

      "haiku:2c3ba482e88b": {
        fill: { "0": { value: "#E9D915" } },
        mask: { "0": { value: "url(#mask-2-0f8f07)" } },
        x: { "0": { value: "41" } },
        y: { "0": { value: "-2" } },
        "sizeAbsolute.x": { "0": { value: 42 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 61 } },
        "sizeMode.y": { "0": { value: 1 } }
      },

      "haiku:fe85e7fb1a32": {
        fill: { "0": { value: "#F8E71C" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "52" } },
        "sizeAbsolute.x": { "0": { value: 91 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 10 } },
        "sizeMode.y": { "0": { value: 1 } }
      }
    }
  },

  template: {
    elementName: "div",
    attributes: { "haiku-title": "Alien", "haiku-id": "437db6fd4baf" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          source: "designs/alien_sr.sketch.contents/slices/right leg.svg",
          "haiku-id": "00392079a04f",
          "haiku-title": "right leg"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "859364ab0e3f" },
            children: ["right leg"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "73a14f421390" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "cfe98125350b" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "2dd8cbf3ab8a" },
            children: [
              {
                elementName: "g",
                attributes: { id: "iPhone-8", "haiku-id": "77020991450a" },
                children: [
                  {
                    elementName: "rect",
                    attributes: { id: "right-leg", "haiku-id": "bf3dfc8d32ab" },
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
          source: "designs/alien_sr.sketch.contents/slices/left leg.svg",
          "haiku-id": "69eff41fbb42",
          "haiku-title": "left leg"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "6eb5ce2c3321" },
            children: ["left leg"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "3cd67949fe73" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "91772ee96023" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "72883c4a4d5f" },
            children: [
              {
                elementName: "g",
                attributes: { id: "iPhone-8", "haiku-id": "712ba0586f44" },
                children: [
                  {
                    elementName: "rect",
                    attributes: { id: "left-leg", "haiku-id": "a02f0862939a" },
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
          source: "designs/alien_sr.sketch.contents/slices/right shoe.svg",
          "haiku-id": "e72f607d8bd8",
          "haiku-title": "right shoe"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "a02dbcef75d3" },
            children: ["right shoe"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "e59b80d43cc1" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "250cfe3f6f2c" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "f16cd3f51f4d" },
            children: [
              {
                elementName: "g",
                attributes: { id: "iPhone-8", "haiku-id": "bd1b31eb0328" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      id: "right-shoe",
                      "haiku-id": "b43e66031e71"
                    },

                    children: [
                      {
                        elementName: "path",
                        attributes: {
                          id: "Rectangle-2",
                          "haiku-id": "e5a4e8fea4d8"
                        },

                        children: []
                      },

                      {
                        elementName: "circle",
                        attributes: {
                          id: "Oval-3",
                          "haiku-id": "6ca9774ddfc7"
                        },

                        children: []
                      },

                      {
                        elementName: "circle",
                        attributes: {
                          id: "Oval-3-Copy",
                          "haiku-id": "e415173a458c"
                        },

                        children: []
                      },

                      {
                        elementName: "rect",
                        attributes: {
                          id: "Rectangle-3",
                          "haiku-id": "0f114001c9d9"
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
          source: "designs/alien_sr.sketch.contents/slices/left shoe.svg",
          "haiku-id": "616599855810",
          "haiku-title": "left shoe"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "f20e2e6c8ce6" },
            children: ["left shoe"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "b690ae016f62" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "96d96dce9a37" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "0a0228e2f0ab" },
            children: [
              {
                elementName: "g",
                attributes: { id: "iPhone-8", "haiku-id": "88c35270c608" },
                children: [
                  {
                    elementName: "g",
                    attributes: { id: "left-shoe", "haiku-id": "d596ae069f7b" },
                    children: [
                      {
                        elementName: "path",
                        attributes: {
                          id: "Rectangle-2",
                          "haiku-id": "cd536ac08b6a"
                        },

                        children: []
                      },

                      {
                        elementName: "circle",
                        attributes: {
                          id: "Oval-3",
                          "haiku-id": "8beca84bf846"
                        },

                        children: []
                      },

                      {
                        elementName: "circle",
                        attributes: {
                          id: "Oval-3-Copy",
                          "haiku-id": "31e25393a803"
                        },

                        children: []
                      },

                      {
                        elementName: "rect",
                        attributes: {
                          id: "Rectangle-3",
                          "haiku-id": "0befb3d72c18"
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
          source: "designs/alien_sr.sketch.contents/slices/right arm.svg",
          "haiku-id": "bf14028a23ad",
          "haiku-title": "right arm"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "1d57e814f9cb" },
            children: ["right arm"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "7562bc4dddf8" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "6884501989cd" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "749bc326c251" },
            children: [
              {
                elementName: "g",
                attributes: { id: "iPhone-8", "haiku-id": "7db059c74422" },
                children: [
                  {
                    elementName: "g",
                    attributes: { id: "right-arm", "haiku-id": "a37e7d015684" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { "haiku-id": "8d042c10919a" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: {
                          id: "right-hand",
                          "haiku-id": "16d31978cba4"
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
          source: "designs/alien_sr.sketch.contents/slices/left arm.svg",
          "haiku-id": "129153ab8819",
          "haiku-title": "left arm"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "7851aeff8f8c" },
            children: ["left arm"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "42119ccb9e31" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "ca4f2d179d06" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "5d2b806c1323" },
            children: [
              {
                elementName: "g",
                attributes: { id: "iPhone-8", "haiku-id": "1356a1d19cc9" },
                children: [
                  {
                    elementName: "g",
                    attributes: { id: "left-arm", "haiku-id": "183a5d09fa7a" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { "haiku-id": "6fa33e11eeb9" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: {
                          id: "left-hand",
                          "haiku-id": "2de712efcbe1"
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
          source: "designs/alien_sr.sketch.contents/slices/body.svg",
          "haiku-id": "337c0e95e0df",
          "haiku-title": "body"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "97cc6814f385" },
            children: ["body"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "a58cfbede3e0" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "e8d3c762995b" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "4aee7d859989" },
            children: [
              {
                elementName: "g",
                attributes: { id: "iPhone-8", "haiku-id": "680384bd9195" },
                children: [
                  {
                    elementName: "rect",
                    attributes: { id: "body", "haiku-id": "c5d5a35a2c7c" },
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
          source: "designs/alien_sr.sketch.contents/slices/smile.svg",
          "haiku-id": "bef028f38a37",
          "haiku-title": "smile"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "b0f8299e1d86" },
            children: ["smile"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "02ffa3eac2a6" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "cf1b39fb4d71" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "5a0994d97003" },
            children: [
              {
                elementName: "g",
                attributes: { id: "iPhone-8", "haiku-id": "0530bf34176d" },
                children: [
                  {
                    elementName: "path",
                    attributes: { id: "smile", "haiku-id": "22cf48bded3f" },
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
          source: "designs/alien_sr.sketch.contents/slices/eyewhite.svg",
          "haiku-id": "3bc434d35c3a",
          "haiku-title": "eyewhite"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "5704e9c02976" },
            children: ["eyewhite"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "81132c61b374" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "09e0a1f1090b" },
            children: [
              {
                elementName: "rect",
                attributes: { id: "path-1-69bb6e", "haiku-id": "c6eecbdfcf76" },
                children: []
              }
            ]
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "a58c48c69695" },
            children: [
              {
                elementName: "g",
                attributes: { id: "iPhone-8", "haiku-id": "ea91d4ec9bc5" },
                children: [
                  {
                    elementName: "g",
                    attributes: { id: "eye", "haiku-id": "4415bcee4202" },
                    children: [
                      {
                        elementName: "g",
                        attributes: {
                          id: "eyewhite",
                          "haiku-id": "a67c451292e7"
                        },

                        children: [
                          {
                            elementName: "use",
                            attributes: { "haiku-id": "a5763e546d76" },
                            children: []
                          },

                          {
                            elementName: "rect",
                            attributes: { "haiku-id": "e5a7b4e6baf4" },
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
          source: "designs/alien_sr.sketch.contents/slices/eyeball.svg",
          "haiku-id": "79b13c1a485c",
          "haiku-title": "eyeball"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "7e567669cbd8" },
            children: ["eyeball"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "aa89266ece0e" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "325816101535" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "cf3b708ad006" },
            children: [
              {
                elementName: "g",
                attributes: { id: "iPhone-8", "haiku-id": "40703169c495" },
                children: [
                  {
                    elementName: "g",
                    attributes: { id: "eye", "haiku-id": "9cbcba72d890" },
                    children: [
                      {
                        elementName: "g",
                        attributes: {
                          id: "eyeball",
                          "haiku-id": "251210949acf"
                        },

                        children: [
                          {
                            elementName: "circle",
                            attributes: {
                              id: "pupil",
                              "haiku-id": "344cf943301f"
                            },

                            children: []
                          },

                          {
                            elementName: "circle",
                            attributes: {
                              id: "white-eye",
                              "haiku-id": "c4c6e7c0c7b9"
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
          source: "designs/alien_sr.sketch.contents/slices/hat.svg",
          "haiku-id": "8d565d98a185",
          "haiku-title": "hat"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "cb16a4965312" },
            children: ["hat"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "b6413df1be8e" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "2540afd51699" },
            children: [
              {
                elementName: "path",
                attributes: { id: "path-1-0f8f07", "haiku-id": "f311b466e70b" },
                children: []
              }
            ]
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "0caff2ed386b" },
            children: [
              {
                elementName: "g",
                attributes: { id: "iPhone-8", "haiku-id": "0ccca86307c0" },
                children: [
                  {
                    elementName: "g",
                    attributes: { id: "hat", "haiku-id": "3c4bed8d2b82" },
                    children: [
                      {
                        elementName: "g",
                        attributes: {
                          id: "Rectangle-5",
                          "haiku-id": "72c5d649995a"
                        },

                        children: [
                          {
                            elementName: "mask",
                            attributes: {
                              id: "mask-2-0f8f07",
                              "haiku-id": "b624d627ebfa"
                            },

                            children: [
                              {
                                elementName: "use",
                                attributes: { "haiku-id": "5a9769f8f2bd" },
                                children: []
                              }
                            ]
                          },

                          {
                            elementName: "use",
                            attributes: {
                              id: "Mask",
                              "haiku-id": "80f263a3001a"
                            },

                            children: []
                          },

                          {
                            elementName: "rect",
                            attributes: { "haiku-id": "2c3ba482e88b" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "rect",
                        attributes: {
                          id: "Rectangle-4",
                          "haiku-id": "fe85e7fb1a32"
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
          source: "designs/alien_sr.sketch.contents/slices/baby0.svg",
          "haiku-id": "c5e73b0bfb56",
          "haiku-title": "baby0"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "784c82487b8e" },
            children: ["baby0"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "5acc42c62504" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "96128180bea8" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "d8ec64c16182" },
            children: [
              {
                elementName: "g",
                attributes: { id: "baby0", "haiku-id": "c370392e3391" },
                children: [
                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "b7b1e984479c" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "c6a5cdc7d240" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "f89a83770045" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "3eabc9cfd4fb" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "8fa9c99e1000" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "df841dd2db7b" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "a3c848611701" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "45f19db3cb60" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "8754d3cc4329" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "10db6af2d8e3" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "5530e1fe5dc4" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "f2f87fbeca55" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "f1677b3c9e86" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "255effefc899" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "5b1d73150db2" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "f2ce40483fb2" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "d2b1324b6c1a" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "3a93a5e75e0e" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "58181d29ac45" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "0893f05521d7" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "5d839e4051a0" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "f8bda8951acc" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "2fadd71da569" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "1a7523415d9a" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "50e376545016" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "cecf9965bea5" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "5e79f801afcc" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "d0a487c38d47" },
                            children: []
                          }
                        ]
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "2a3e7860fc14" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "de2cc352fe64" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "74e3a5b9ff05" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "fcaf2df3153e" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "a14266536378" },
                            children: []
                          }
                        ]
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "6494cead8f7a" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "88259307d25a" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "a78fe40c34d5" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "a705e2c5adf9" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "d0e451336526" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "8092f07eaf5f" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "fb41c15bf632" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "71b38d4113f6" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "378f544c4b04" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "3868b9c30d60" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "107b4fe9460e" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "3a779f2bbe15" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "1dbef39cb970" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "52dce86bd07c" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "f896ea096c19" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "e688ce6da50a" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "ae15ff3800f7" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "4ffa5dfb583c" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "45a2b7957470" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "7eff9eabf786" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "cbff980576d6" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "60210fc90af0" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "213efbf25a70" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "3a8cc29a0dd9" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "28b7b0fdc909" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "ac2a3b3b92fb" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "1809c39de49d" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "7e61a2273f73" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "b7ade9cf6675" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "f2d1a7d52569" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "2731b55a84a4" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "ce53b744c46c" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "76847a99ddb4" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "81d645230e4e" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "568cfd9b822b" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "780472a2b511" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "05b475ec122d" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "98385ffb5cae" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "c66eb05f6490" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "fe71aa1ea0f2" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "89acf1e9a31e" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "8164c477b864" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "acf80bfe565c" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "3b86d546bb4a" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "372f5201d98a" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "eaceda6a32c4" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "05456f9f47c9" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "3728d51f8123" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "50e81f7ae3c0" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "41ad371547df" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "f4e166c715b1" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "d7e199a1e559" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "28f54fdb48a8" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "3f92f664b7d1" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "5b05ecfc5cfa" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "1690056751a1" },
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
          source: "designs/alien_sr.sketch.contents/slices/baby2.svg",
          "haiku-id": "513a978c54a9",
          "haiku-title": "baby2"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "9f02d406664a" },
            children: ["baby2"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "0ea3a49f80f8" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "7e0e3eb5b9e4" },
            children: [
              {
                elementName: "linearGradient",
                attributes: {
                  id: "linearGradient-1-7217aa",
                  "haiku-id": "1c10355dd9ec"
                },

                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "13e091a9aea1" },
                    children: []
                  },

                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "00aabf016cb1" },
                    children: []
                  }
                ]
              },

              {
                elementName: "linearGradient",
                attributes: {
                  id: "linearGradient-2-7217aa",
                  "haiku-id": "776a760b9697"
                },

                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "6210a619fdc8" },
                    children: []
                  },

                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "0d7adb177666" },
                    children: []
                  }
                ]
              }
            ]
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "fc68f7b2cf33" },
            children: [
              {
                elementName: "g",
                attributes: { id: "baby2", "haiku-id": "6d1b64cc9dc4" },
                children: [
                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "4e49736e1e39" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "a0d49104c865" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "77ca2bc8b674" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "c68870808903" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "2c8fab26867c" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "21df713d4930" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "232112441234" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "d30035687e7a" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "f99138ede6f0" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "932459b0b69c" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "2b5f58aa2714" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "63151743593f" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "c443ccf319e0" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "1be95ed8989e" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "21db024ba738" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "2308405ad1ea" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "1cdb77955ec1" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "e07455fc3a44" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "a3720d3da253" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "f5ef79c9e64f" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "0360c7ea7d37" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "14f9ad3ef72b" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "169c9be932e6" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "fbffeb34923f" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "5e258bbe524d" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "17ad28e4d05d" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "6cf4a931d9ae" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "d6fca15e49a7" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "c262ecf85c7e" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "f61107d4849b" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "373110078596" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "63faa7b35c40" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "6c023db29848" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "66deeb51881e" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "ad17e22850bc" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "22377c734ced" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "a7a8d4ced661" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "f8dd3f8cfdc5" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "fbd4ca9a4a8b" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "803f48b4f42f" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "f7ff469daa78" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "394d78def2b1" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "e1ef7a8289dd" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "c7e459cfdea2" },
                    children: [
                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "0819b89e6439" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "915466cd6fed" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "291b6ddb01bf" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "f13833f509d1" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "b265ad79e0b5" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "f99fd6c9cb21" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "cc0bb17186e0" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "d921386cd008" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "2dc25e5c0705" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "929f7462f436" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "40fbade7c7f2" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "3cd4bc26fc68" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "1dbfeccc3130" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "3229849527a8" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "f835913d071f" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "350f77e0f784" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "fdf9665044ec" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "2d45ee817df2" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "6f331689b5b6" },
                            children: []
                          }
                        ]
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "7c39d1779e37" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "c088d4120e5d" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "6848912ad722" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "7d0209427588" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "324d0e05299e" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "c4dcaaa81258" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "280934a6a3f9" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "27a3845d76de" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "ddf7b55c828d" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "b0fc7cc2050f" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "3717585a8706" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "aa140d4f6337" },
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
          source: "designs/alien_sr.sketch.contents/slices/baby1.svg",
          "haiku-id": "65dbbd103a53",
          "haiku-title": "baby1"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "a8812698cfd1" },
            children: ["baby1"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "889636d09a4e" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "1df9970720ea" },
            children: [
              {
                elementName: "linearGradient",
                attributes: {
                  id: "linearGradient-1-756e26",
                  "haiku-id": "af5f2250bfe6"
                },

                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "27b73990f4b0" },
                    children: []
                  },

                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "cfcdf53a4da1" },
                    children: []
                  }
                ]
              },

              {
                elementName: "linearGradient",
                attributes: {
                  id: "linearGradient-2-756e26",
                  "haiku-id": "20b39ac5b82a"
                },

                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "3415e8d033b1" },
                    children: []
                  },

                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "839f29180f10" },
                    children: []
                  }
                ]
              }
            ]
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "50c68c4fad77" },
            children: [
              {
                elementName: "g",
                attributes: { id: "baby1", "haiku-id": "8b029d10d709" },
                children: [
                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "92a19d7bf16c" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "ea41118eb28a" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "c701876810f8" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "9d8922b212ec" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "0769dc6e52d0" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "4937bbcb03e4" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "6f7b1b50a626" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "054063dbdc44" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "043e3095828f" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "df8fe74c0a4e" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "5e78ea7cf30e" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "76bb05caac4a" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "b199d6df9ce3" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "0963b69bfb38" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "22c5ed9b296b" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "9840c668d5d2" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "60c45f03dcdb" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "4554360ab6ba" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "501ae14eeef8" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "af279fe408ee" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "15740722150e" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "e0c2ec579f2b" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "5dfbc9299720" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "a35be1d47e9d" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "e94bf7362f07" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "0957730c33d5" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "a8242c748674" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "91d2880c4694" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "5ddd83adbe7f" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "80b02c8bb366" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "5c95618f5d3f" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "4e0e1b75d899" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "754269583607" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "0e411ac22ead" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "03543a4ceb3f" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "9be9858d0094" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "6d3fd706ad4a" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "9884ec12c2d0" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "4024f68d4396" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "187fc735a213" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "9caa507498a8" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "b7f4be0d6279" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "8b98726454f1" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "85c9c56cad5e" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "87c07883413c" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "bc354b9e4a38" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "e551edc36a05" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "efa408038007" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "0632a16fd4c5" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "83aec60d5cad" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "199fdbe10ae5" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "6dcad20e5d51" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "f68660bf88ba" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "ba092b7ad5c7" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "82a6bc5449ea" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "3eed044cbd9e" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "63affce7ef69" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "d65c75b11afe" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "b3c1f6881274" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "b4418376e47c" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "3e06aac4ed71" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "6d90708bf332" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "4130e4b8a29c" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "7904fb95714b" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "3fe699c2e695" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "ec38f68164b4" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "fa853a71c991" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "c24395434caf" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "838abcc89137" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "8051d4bb8ee8" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "3ba32602b3e6" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "4fbf61e7ffbe" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "ebfaa5b4f695" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "11969e518490" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "ec7493e6a92b" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "74988edc4277" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "b9a18256f843" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "1a2c86894b5a" },
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
          source: "designs/alien_sr.sketch.contents/slices/baby3.svg",
          "haiku-id": "f3e8b1914e2d",
          "haiku-title": "baby3"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "20983e87c7fe" },
            children: ["baby3"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "6efcfdcaf804" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "7716d9ca0ef6" },
            children: [
              {
                elementName: "radialGradient",
                attributes: {
                  id: "radialGradient-1-65c1b4",
                  "haiku-id": "0866a31f4dba"
                },

                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "c8ef03a82867" },
                    children: []
                  },

                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "41b557a4699c" },
                    children: []
                  }
                ]
              },

              {
                elementName: "radialGradient",
                attributes: {
                  id: "radialGradient-2-65c1b4",
                  "haiku-id": "9e67c7a041b8"
                },

                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "4be3058f9878" },
                    children: []
                  },

                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "ef71c8440c67" },
                    children: []
                  }
                ]
              }
            ]
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "d804b00ec88f" },
            children: [
              {
                elementName: "g",
                attributes: { id: "baby3", "haiku-id": "7feb72e47a56" },
                children: [
                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "f4620f69c215" },
                    children: [
                      {
                        elementName: "g",
                        attributes: { "haiku-id": "32772e6b2f9a" },
                        children: [
                          {
                            elementName: "g",
                            attributes: {
                              id: "Shape",
                              "haiku-id": "37f3a4945a42"
                            },

                            children: [
                              {
                                elementName: "g",
                                attributes: { "haiku-id": "fb4011da42dc" },
                                children: [
                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "239ea4d7c4cc" },
                                    children: []
                                  },

                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "b1572b669eb2" },
                                    children: []
                                  }
                                ]
                              },

                              {
                                elementName: "path",
                                attributes: { "haiku-id": "7230478f76fa" },
                                children: []
                              },

                              {
                                elementName: "g",
                                attributes: { "haiku-id": "3d58451ee58a" },
                                children: [
                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "36a4fa6956e1" },
                                    children: []
                                  },

                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "5f5c990acdd1" },
                                    children: []
                                  }
                                ]
                              },

                              {
                                elementName: "g",
                                attributes: { "haiku-id": "747c07b1f2e4" },
                                children: [
                                  {
                                    elementName: "g",
                                    attributes: { "haiku-id": "65a42313583d" },
                                    children: [
                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "4673a7d12254"
                                        },

                                        children: []
                                      },

                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "bff2558354e0"
                                        },

                                        children: []
                                      }
                                    ]
                                  },

                                  {
                                    elementName: "g",
                                    attributes: { "haiku-id": "b2e9af565e7b" },
                                    children: [
                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "15b1dc247f52"
                                        },

                                        children: []
                                      },

                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "4f2cbdcf2e67"
                                        },

                                        children: []
                                      }
                                    ]
                                  },

                                  {
                                    elementName: "g",
                                    attributes: { "haiku-id": "52a11f6ae600" },
                                    children: [
                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "163d170fdb7f"
                                        },

                                        children: []
                                      },

                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "569b4433dd9d"
                                        },

                                        children: []
                                      }
                                    ]
                                  },

                                  {
                                    elementName: "g",
                                    attributes: { "haiku-id": "84a22b796753" },
                                    children: [
                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "02f3277b47f7"
                                        },

                                        children: []
                                      },

                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "deaa0ea4c4e6"
                                        },

                                        children: []
                                      }
                                    ]
                                  },

                                  {
                                    elementName: "g",
                                    attributes: { "haiku-id": "ae8f36552d66" },
                                    children: [
                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "8c2aae8e8ed9"
                                        },

                                        children: []
                                      },

                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "01da0be5ca1d"
                                        },

                                        children: []
                                      }
                                    ]
                                  },

                                  {
                                    elementName: "g",
                                    attributes: { "haiku-id": "9b70741fac1f" },
                                    children: [
                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "438f9028a4d3"
                                        },

                                        children: []
                                      },

                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "bdc1168a9311"
                                        },

                                        children: []
                                      }
                                    ]
                                  },

                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "4175c74c4fea" },
                                    children: []
                                  },

                                  {
                                    elementName: "g",
                                    attributes: { "haiku-id": "812fad7bb4a7" },
                                    children: [
                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "b1c6d9fed6ce"
                                        },

                                        children: []
                                      },

                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "223d960d92be"
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
                            elementName: "g",
                            attributes: {
                              id: "Shape",
                              "haiku-id": "1421f162373b"
                            },

                            children: [
                              {
                                elementName: "g",
                                attributes: { "haiku-id": "26c55b75fbe1" },
                                children: [
                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "12b9008afbd4" },
                                    children: []
                                  },

                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "466df666fb0f" },
                                    children: []
                                  }
                                ]
                              },

                              {
                                elementName: "path",
                                attributes: { "haiku-id": "f3022a1c55db" },
                                children: []
                              },

                              {
                                elementName: "g",
                                attributes: { "haiku-id": "48ed248e6881" },
                                children: [
                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "282c04c010c6" },
                                    children: []
                                  },

                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "477c670d9408" },
                                    children: []
                                  }
                                ]
                              },

                              {
                                elementName: "g",
                                attributes: { "haiku-id": "e7094326b365" },
                                children: [
                                  {
                                    elementName: "g",
                                    attributes: { "haiku-id": "ca53ccb12a8d" },
                                    children: [
                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "cd3079348364"
                                        },

                                        children: []
                                      },

                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "b6dbc8d62bc0"
                                        },

                                        children: []
                                      }
                                    ]
                                  },

                                  {
                                    elementName: "g",
                                    attributes: { "haiku-id": "52aaef61da35" },
                                    children: [
                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "719e56f6f119"
                                        },

                                        children: []
                                      },

                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "4de1eb7fead2"
                                        },

                                        children: []
                                      }
                                    ]
                                  },

                                  {
                                    elementName: "g",
                                    attributes: { "haiku-id": "8c1081765707" },
                                    children: [
                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "5971c4b16051"
                                        },

                                        children: []
                                      },

                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "e3f2e1678c08"
                                        },

                                        children: []
                                      }
                                    ]
                                  },

                                  {
                                    elementName: "g",
                                    attributes: { "haiku-id": "215265fe1c0c" },
                                    children: [
                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "026daf8d7805"
                                        },

                                        children: []
                                      },

                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "91066a13f419"
                                        },

                                        children: []
                                      }
                                    ]
                                  },

                                  {
                                    elementName: "g",
                                    attributes: { "haiku-id": "418530c13505" },
                                    children: [
                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "b2acb5d1df44"
                                        },

                                        children: []
                                      },

                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "d5e6c3c6bdef"
                                        },

                                        children: []
                                      }
                                    ]
                                  },

                                  {
                                    elementName: "g",
                                    attributes: { "haiku-id": "395dc8425aa4" },
                                    children: [
                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "89a3a6dcd342"
                                        },

                                        children: []
                                      },

                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "af9c28c84b83"
                                        },

                                        children: []
                                      }
                                    ]
                                  },

                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "63ff6f605995" },
                                    children: []
                                  },

                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "59db1c72c5cd" },
                                    children: []
                                  },

                                  {
                                    elementName: "g",
                                    attributes: { "haiku-id": "0ad37f2a4df1" },
                                    children: [
                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "af713f2b9b7a"
                                        },

                                        children: []
                                      },

                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "44d72b8de5a1"
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
                            elementName: "g",
                            attributes: {
                              id: "Shape",
                              "haiku-id": "8c945432d0ea"
                            },

                            children: [
                              {
                                elementName: "g",
                                attributes: { "haiku-id": "22b14fdb0f54" },
                                children: [
                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "2a478ec3c204" },
                                    children: []
                                  },

                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "6205a67a3299" },
                                    children: []
                                  }
                                ]
                              },

                              {
                                elementName: "path",
                                attributes: { "haiku-id": "ecb7a4913e82" },
                                children: []
                              },

                              {
                                elementName: "g",
                                attributes: { "haiku-id": "17963ee0cbfc" },
                                children: [
                                  {
                                    elementName: "g",
                                    attributes: { "haiku-id": "6cf85858fe42" },
                                    children: [
                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "c973ea94412a"
                                        },

                                        children: []
                                      },

                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "3630f5e92c22"
                                        },

                                        children: []
                                      }
                                    ]
                                  },

                                  {
                                    elementName: "g",
                                    attributes: { "haiku-id": "ab4422e959b6" },
                                    children: [
                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "649c20420d23"
                                        },

                                        children: []
                                      },

                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "2e554d46cb0f"
                                        },

                                        children: []
                                      }
                                    ]
                                  },

                                  {
                                    elementName: "g",
                                    attributes: { "haiku-id": "8098fde11871" },
                                    children: [
                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "0975d6140f8e"
                                        },

                                        children: []
                                      },

                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "3a381996ad83"
                                        },

                                        children: []
                                      }
                                    ]
                                  },

                                  {
                                    elementName: "g",
                                    attributes: { "haiku-id": "291dc6f22a62" },
                                    children: [
                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "67c42d451cfb"
                                        },

                                        children: []
                                      },

                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "f3098b196d3b"
                                        },

                                        children: []
                                      }
                                    ]
                                  },

                                  {
                                    elementName: "g",
                                    attributes: { "haiku-id": "ef7c381f1870" },
                                    children: [
                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "543956f51737"
                                        },

                                        children: []
                                      },

                                      {
                                        elementName: "path",
                                        attributes: {
                                          "haiku-id": "5557a1ca8cd4"
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
                            elementName: "g",
                            attributes: {
                              id: "Shape",
                              "haiku-id": "0f9aa4c677b3"
                            },

                            children: [
                              {
                                elementName: "path",
                                attributes: { "haiku-id": "82a9d21324db" },
                                children: []
                              },

                              {
                                elementName: "path",
                                attributes: { "haiku-id": "86fef673926a" },
                                children: []
                              }
                            ]
                          },

                          {
                            elementName: "path",
                            attributes: {
                              id: "Shape",
                              "haiku-id": "ef8121933443"
                            },

                            children: []
                          },

                          {
                            elementName: "g",
                            attributes: {
                              id: "Shape",
                              "haiku-id": "cebfb3c122fb"
                            },

                            children: [
                              {
                                elementName: "path",
                                attributes: { "haiku-id": "1f96e98ac42a" },
                                children: []
                              },

                              {
                                elementName: "path",
                                attributes: { "haiku-id": "03ff30d5385f" },
                                children: []
                              }
                            ]
                          },

                          {
                            elementName: "ellipse",
                            attributes: {
                              id: "Oval",
                              "haiku-id": "df372070c571"
                            },

                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: {
                              id: "Shape",
                              "haiku-id": "9e3146b4dc20"
                            },

                            children: []
                          },

                          {
                            elementName: "g",
                            attributes: {
                              id: "Shape",
                              "haiku-id": "deb08fb728c1"
                            },

                            children: [
                              {
                                elementName: "g",
                                attributes: { "haiku-id": "63bbee432fc1" },
                                children: [
                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "0dc3b0eef11d" },
                                    children: []
                                  },

                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "7578cf8ca527" },
                                    children: []
                                  }
                                ]
                              },

                              {
                                elementName: "g",
                                attributes: { "haiku-id": "27b2cd6537ae" },
                                children: [
                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "6cf9cde8e086" },
                                    children: []
                                  },

                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "497948027c02" },
                                    children: []
                                  }
                                ]
                              },

                              {
                                elementName: "g",
                                attributes: { "haiku-id": "bdea95fda14e" },
                                children: [
                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "73c2c330f003" },
                                    children: []
                                  },

                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "2976d4bda244" },
                                    children: []
                                  }
                                ]
                              },

                              {
                                elementName: "g",
                                attributes: { "haiku-id": "ef8af28bc7dd" },
                                children: [
                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "d6b9eeaef9f7" },
                                    children: []
                                  },

                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "70ab7e0fec33" },
                                    children: []
                                  }
                                ]
                              },

                              {
                                elementName: "g",
                                attributes: { "haiku-id": "f3f1cd5fc9f2" },
                                children: [
                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "4551b584a9ea" },
                                    children: []
                                  },

                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "dd61067d7a0f" },
                                    children: []
                                  }
                                ]
                              }
                            ]
                          },

                          {
                            elementName: "g",
                            attributes: {
                              id: "Shape",
                              "haiku-id": "129c445a3cf5"
                            },

                            children: [
                              {
                                elementName: "path",
                                attributes: { "haiku-id": "6445c00ba97c" },
                                children: []
                              },

                              {
                                elementName: "path",
                                attributes: { "haiku-id": "56574d82eac5" },
                                children: []
                              }
                            ]
                          },

                          {
                            elementName: "g",
                            attributes: {
                              id: "Shape",
                              "haiku-id": "1c39287516d5"
                            },

                            children: [
                              {
                                elementName: "path",
                                attributes: { "haiku-id": "fc84b08e15e0" },
                                children: []
                              },

                              {
                                elementName: "path",
                                attributes: { "haiku-id": "76f47ebd4889" },
                                children: []
                              }
                            ]
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "f83067e8d1e0" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "239cadc96cb5" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "97a4b48150fc" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "250843d25545" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "7e332b05ab69" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "ad7bd76b6dca" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "a7e980a6f0db" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "584d2f43cf57" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "e39cab39b3f5" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "ebfea7a0e9ad" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "070c6491a496" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "0bdae02edf8e" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "9a42636fddce" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "7babdec67c2f" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "6227c342c6df" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "16b7e23d249c" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "e8d2989bea9c" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "e3fd453d4391" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "db0af267f35d" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "4c86a3e4ea8e" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "b968c32f1aeb" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "b2a05c253af4" },
                        children: []
                      },

                      {
                        elementName: "circle",
                        attributes: { id: "Oval", "haiku-id": "dd84cfe15002" },
                        children: []
                      },

                      {
                        elementName: "circle",
                        attributes: { id: "Oval", "haiku-id": "641ba30a96c3" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "755a3881c7fb" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "a866ab2a803b" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "0c72b32c0033" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "08103d74441f" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "acd5b2045206" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "37fe2ae5bed9" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "471fb21f6a07" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "7bbb6893d311" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "016c080c575e" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "5ca4f5dca41d" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "e146687566f1" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "92a55e2bd459" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "325066522105" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "46eefcb8fa66" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "81414bcb2b05" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "00d9976dc581" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "6d608150488a" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "affa976122b0" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "fd0d629fab06" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "23dd53978120" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "8b9fa71b9bc5" },
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
          source: "designs/alien_sr.sketch.contents/slices/baby4.svg",
          "haiku-id": "1571f5c60cd5",
          "haiku-title": "baby4"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "e3b039560860" },
            children: ["baby4"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "6bfda20da76e" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "5b93193be347" },
            children: [
              {
                elementName: "radialGradient",
                attributes: {
                  id: "radialGradient-1-5effb5",
                  "haiku-id": "49b016751668"
                },

                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "775575a5dfbb" },
                    children: []
                  },

                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "ad1259e1ac55" },
                    children: []
                  }
                ]
              },

              {
                elementName: "radialGradient",
                attributes: {
                  id: "radialGradient-2-5effb5",
                  "haiku-id": "c4fd6d3e659b"
                },

                children: [
                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "6eb667806455" },
                    children: []
                  },

                  {
                    elementName: "stop",
                    attributes: { "haiku-id": "4e56a9e4b1a5" },
                    children: []
                  }
                ]
              }
            ]
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "3c3cc2d6c8cc" },
            children: [
              {
                elementName: "g",
                attributes: { id: "baby4", "haiku-id": "d924e289fb9e" },
                children: [
                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "bc4ca3487bac" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "e8d08299bba1" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "487467f95a4f" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "61b64daafc6e" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "a32e6263086e" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "d4de5b86e8e6" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "ac6bf18811b7" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "635cdaa7b731" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "362844d47738" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "e4f14d7b5921" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "b5bc4aaa2faf" },
                    children: [
                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "b90bafc3f9a8" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "e2b3a242cc4c" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "b57641475812" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "ab591957a7cc" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "d78af1e099be" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "b054f77ac84a" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "4c247413bddb" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "038c83348cff" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "881c06f9a3ce" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "454652155e4a" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "2b12356cde56" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "4d3f5b25b9da" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "9bf07529b437" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "046e88dfb82f" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "b4c385e962cb" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "b8afb9a5776e" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "c98499511d2d" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "3f5edca92693" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "e5ce79ab1785" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "018617404758" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "e06f6f82909b" },
                            children: []
                          }
                        ]
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "bfbec10a9e85" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "8a6845457ab5" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "edc6df54443f" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "83fec756ceaa" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "a3a4d83cd936" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "6792f00a10a0" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "bf58ec70ee7e" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "82c989fff47b" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "c3ce889c7103" },
                    children: [
                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "d9c6117a0d18" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "414c86674c25" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "b72aab0f9a99" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "c67e7201e41c" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "98725f175f9c" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "425663196e22" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "776529010992" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "7863a9d3c7bb" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "a5ed42a83599" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "4394a4cf2288" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "4b2a34213ea2" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "71beefb652ac" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "659dd57cc691" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "f2a2a8d0e218" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "1cc31a72656d" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "905994a79a81" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "7af2996f38cd" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "fed35bb805bc" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "195aaa9d3625" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "420e0c8877fc" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "71d6c7af21fa" },
                            children: []
                          }
                        ]
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "9ec19a36132b" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "ac841319adb1" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "c7aaf441198b" },
                    children: [
                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "9ffd07987e33" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "6f96a8c62e13" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "8ebbdb63f2de" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "1c27020a7263" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "a40c3ed9946f" },
                        children: [
                          {
                            elementName: "g",
                            attributes: { "haiku-id": "eaee90535fb8" },
                            children: [
                              {
                                elementName: "path",
                                attributes: { "haiku-id": "e514980876e4" },
                                children: []
                              },

                              {
                                elementName: "path",
                                attributes: { "haiku-id": "f8b521160ae8" },
                                children: []
                              }
                            ]
                          },

                          {
                            elementName: "g",
                            attributes: { "haiku-id": "b70ec625d461" },
                            children: [
                              {
                                elementName: "path",
                                attributes: { "haiku-id": "93eac0788ad5" },
                                children: []
                              },

                              {
                                elementName: "path",
                                attributes: { "haiku-id": "93bb70d8bdce" },
                                children: []
                              }
                            ]
                          },

                          {
                            elementName: "g",
                            attributes: { "haiku-id": "21bbcff0958a" },
                            children: [
                              {
                                elementName: "path",
                                attributes: { "haiku-id": "645482f3d301" },
                                children: []
                              },

                              {
                                elementName: "path",
                                attributes: { "haiku-id": "74bfd9f79360" },
                                children: []
                              }
                            ]
                          },

                          {
                            elementName: "g",
                            attributes: { "haiku-id": "70bd2fedf730" },
                            children: [
                              {
                                elementName: "path",
                                attributes: { "haiku-id": "00847cac5f6d" },
                                children: []
                              },

                              {
                                elementName: "path",
                                attributes: { "haiku-id": "108e335b9894" },
                                children: []
                              }
                            ]
                          },

                          {
                            elementName: "g",
                            attributes: { "haiku-id": "52292ddaa34b" },
                            children: [
                              {
                                elementName: "path",
                                attributes: { "haiku-id": "0dde71f7419c" },
                                children: []
                              },

                              {
                                elementName: "path",
                                attributes: { "haiku-id": "8a53b6d6873c" },
                                children: []
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "07075830ed57" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "66101c5a2bec" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "fef92beb6f85" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "6af6e7609130" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "9922a5627e6c" },
                    children: [
                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "5e0f590c4eb8" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "e8f98a010b47" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "1b4ebe95ee86" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "593382e1c880" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "523900d7351a" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "3da2f6c32f38" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "e134c27bc27e" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "10068a3f153f" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "fcacd51e1e2e" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "64f7ec838f8e" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "6973f7467739" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "9ffc6d13cae4" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "513911c14bff" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "72709f4cdb43" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "3a80cead80cc" },
                            children: []
                          }
                        ]
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "c531ee2813f9" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "e643b7710913" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "e7a59b7c42d1" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "85b7f55db3c0" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "3b77725452e3" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "f25ae631a786" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "a0bd9779fef5" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "ba14d1c06932" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "8137c52fc2e0" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "af98e941ecc6" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "b3a4ba7ecfc0" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "5eaa92fbfb1a" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "14959c1372cb" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "ccf2c80e5740" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "83d0a4211f9b" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "44e10cb5592a" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "1eec326f17b1" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "102ff5274090" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "36c0fb617a70" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "b7ed3c285305" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "c9871a1592a3" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "bb55d4eeaffb" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "3abfbd039d16" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "255de83ef83e" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "45c41541fb4f" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "457074ee24b9" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "ea5a3ad603a9" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "301a1ad5ccd8" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "5870301e8dd2" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "e5863111b08d" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "bd867db762e4" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "d5917f54d705" },
                    children: []
                  },

                  {
                    elementName: "circle",
                    attributes: { id: "Oval", "haiku-id": "b3d5e75e49ba" },
                    children: []
                  },

                  {
                    elementName: "circle",
                    attributes: { id: "Oval", "haiku-id": "d99a3e7d0377" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "439ed041f54a" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "1fbbd60057b3" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "e3e42dec1ba7" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "613eb1f45f64" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "336a2b55866d" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "39337fc1b696" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "8da911eb7bad" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "c87c2b19025f" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "ce354ced2916" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "eff7b1b1362d" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "ad5f83ba5dad" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "e7b0800c6a11" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "f17ae55005f1" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "26a792b64727" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "b2a5a349f754" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "80041bfb5ad4" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "919b042bc1e2" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "1f44feb96c03" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "52b6c7c24c79" },
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
          source: "designs/alien_sr.sketch.contents/slices/baby5.svg",
          "haiku-id": "c1fe6131ce7d",
          "haiku-title": "baby5"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "f016337f9bb0" },
            children: ["baby5"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "d68f32e917d5" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "9676bd6cff65" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "d611379da4c5" },
            children: [
              {
                elementName: "g",
                attributes: { id: "baby5", "haiku-id": "7c1cbd57f22a" },
                children: [
                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "e325b8d8cde9" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "d88caffea234" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "a9e035deb4ff" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "f6687c4c9809" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "cb7c14fb7da3" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "df6cccd6e657" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "3f40af4906df" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "a9b91af6bb4b" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "db91e0609554" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "9fdbfa4d3338" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "748d41375511" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "ff1727ff772b" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "46ec102ab843" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "be13225cddea" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "4bece814c12b" },
                    children: [
                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "e87ff18dd4c0" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "24a762de5c8c" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "d0b6b4ad2ee7" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "4fcb5247e570" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "64cac8a91255" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "f9c4f11994e6" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "a7c6e6818a6b" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "b2d78b7e73a2" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "b3b3b6796693" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "d16628008769" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "c86f1dd4ad1d" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "271c2445b5b5" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "04facc3a7509" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "3b2c10763cfa" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "8a0561591a04" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "c9f5cf0726a7" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "533a71c8bf58" },
                            children: []
                          },

                          {
                            elementName: "g",
                            attributes: { "haiku-id": "722f544dfe77" },
                            children: [
                              {
                                elementName: "path",
                                attributes: { "haiku-id": "3ed416908350" },
                                children: []
                              },

                              {
                                elementName: "path",
                                attributes: { "haiku-id": "936613a2b652" },
                                children: []
                              }
                            ]
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "4a2e9567a421" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "966b908c9e7a" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "b9fd777ea92b" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "281d576ab3d9" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "31733613d849" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "29d392173f8d" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "9d8aab570ebc" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "cc996098c4de" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "5634ebca716e" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "29aec21cd63c" },
                            children: []
                          }
                        ]
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "8c51c7e36c4e" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "7f1279094a99" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "c3c14c7708fb" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "5f5128f75c03" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "d469b2ff9a18" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "e98ee5794d46" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "2bd59b715157" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "3e17448cac14" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "f1903f8de901" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "62d4235333d1" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "6509c1e8fcb7" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "4d7f2536e51b" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "20df50a1b6da" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "c0e05773af3e" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "c503ba785cfc" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "ca8774582dc8" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "3fe1cbd7c18e" },
                    children: [
                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "b2c979997440" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "e320d0fc7c5f" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "55c7e43ba4ea" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "b8e7fed9b926" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "939fb0b96d5a" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "bf491131a29d" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "e1324b425b99" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "2c4f01c99313" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "7538aab3293b" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "c3448b7b18ed" },
                            children: []
                          }
                        ]
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "84ebcc5a8993" },
                    children: [
                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "d0db5503f45e" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "0462724b3de8" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "0a600a0a24c5" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "5e3a0d4fbea2" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "ac64819d8cfc" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "c54bdf5f83cb" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "81e466782180" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "c9276c04db14" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "38c4d5ba5f67" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "9b1b2ecc363e" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "f7d7d55ba8c3" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "c4ce067e4f85" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "fac5c6782180" },
                    children: [
                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "de2ae8a6ac4f" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "b3a321c33a94" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "89ddda6c4932" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "547cc9e87046" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "96bda920e6f7" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "d7661e95d0e9" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "1ef5fbda2ed8" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "af2db4d5d1ce" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "faf7ce19c6fe" },
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
          source: "designs/alien_sr.sketch.contents/slices/baby6.svg",
          "haiku-id": "41b66c7ede4e",
          "haiku-title": "baby6"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "eb9530b03426" },
            children: ["baby6"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "9b8ae659a26f" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "9d48b7a02bf7" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "ffade39b98c5" },
            children: [
              {
                elementName: "g",
                attributes: { id: "baby6", "haiku-id": "9d92a2d2a5a9" },
                children: [
                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "d45fb2211598" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "808906dd8f0d" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "0d9a10bd4240" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "7e6290306f14" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "c64b0fb6c3c0" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "45e86dd9af16" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "e3d6e3034736" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "b8fdef52798e" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "31512788a9aa" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "2851ff3e0825" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "78a245c52fb6" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "a6a32d22b109" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "da8c6543cd1d" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "f0b6a56668dc" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "c66b743d753c" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "b6ab7b588106" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "0ad53d9450cd" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "634dddd39868" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "17a887a9c303" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "55aea49bfac0" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "fe8475966823" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "875599f6a329" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "2fd0514aa4ca" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "7208022af41e" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "600d3308432b" },
                    children: [
                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "834329c1b750" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "6a947236f66a" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "a678b2d13239" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "4331da254257" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "f562caf4be81" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "12729752e6d2" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "a88985407d0b" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "4b6f95d5646e" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "5e39df74875e" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "f2f5353fbbeb" },
                            children: []
                          }
                        ]
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "9320292075fc" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "9dda064f4a6b" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "4954442eae63" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "417afe484442" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "9ac2bb6656de" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "ab6b75219c59" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "5d53805d402e" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "3bfdc53b26ef" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "efc6a296cf00" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "7804fd6e77a9" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "a6cb33bdb281" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "f085254a56e8" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "5cb39aa0dd20" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "385b5f831368" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "82310f028987" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "d78b7e575ac6" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "41d728dc6369" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "166998acba37" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "9a3df5206508" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "314219e1223c" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "019dc74444db" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "323220bd25ab" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "e08dcc021a1b" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "cbf4e0007687" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "75044aca1d2f" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "aff62d49946b" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "82bcf478883f" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "0c764367c941" },
                            children: []
                          }
                        ]
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "1ba1cb6c3447" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "bf57858565d7" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "14d674bb9791" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "cf46e48e45d8" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "068e6898dddb" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "4af6e170da17" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "1205db2a4ef5" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "ca49043f5b8c" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "20e4f6c25205" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "c68a0d9096c7" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "e5b2a10a41cb" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "2448fe05f8aa" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "c8610bae0f60" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "3033d52de17a" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "6439475a345b" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "57f2f3919442" },
                    children: []
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "05eec2907b64" },
                    children: [
                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "770acb917558" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "642d5392dcb4" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "4e07394d8edd" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "9d30ca5d1079" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "e5ff1ca96ce0" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "746913487aec" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "8f5020a092b5" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "01cd8636b10e" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "57c79d57b412" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "a1e319d27ab6" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "12e988e15e36" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "5f7894bfed33" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "f8d271457334" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "29b1c499ccdd" },
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
          source: "designs/alien_sr.sketch.contents/slices/baby7.svg",
          "haiku-id": "8e5c393c9a38",
          "haiku-title": "baby7"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "38c81353a53d" },
            children: ["baby7"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "be1c93224389" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "c0785a2d0dd2" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "9e9b108e7a21" },
            children: [
              {
                elementName: "g",
                attributes: { id: "baby7", "haiku-id": "4e70ce7ee6ec" },
                children: [
                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "6018acd98dab" },
                    children: [
                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "0fba82dd855b" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "621c39712448" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "16be6df34f76" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "f2100594f6c5" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "21dc3dfb70b4" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "3f06643cb088" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "e98210f2ba82" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "7055952d273e" },
                        children: [
                          {
                            elementName: "g",
                            attributes: { "haiku-id": "b23689268104" },
                            children: [
                              {
                                elementName: "path",
                                attributes: { "haiku-id": "fe11348c3969" },
                                children: []
                              },

                              {
                                elementName: "path",
                                attributes: { "haiku-id": "4502d9ef3497" },
                                children: []
                              }
                            ]
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "971260c4a7a0" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "e1ae40f9009f" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "1cbe559eeab8" },
                            children: []
                          },

                          {
                            elementName: "g",
                            attributes: { "haiku-id": "fd43cc0f6e88" },
                            children: [
                              {
                                elementName: "path",
                                attributes: { "haiku-id": "4eecf6cccfc9" },
                                children: []
                              },

                              {
                                elementName: "path",
                                attributes: { "haiku-id": "612acca2432e" },
                                children: []
                              }
                            ]
                          },

                          {
                            elementName: "g",
                            attributes: { "haiku-id": "d5420c8f1ddc" },
                            children: [
                              {
                                elementName: "path",
                                attributes: { "haiku-id": "4db4c27b56c9" },
                                children: []
                              },

                              {
                                elementName: "path",
                                attributes: { "haiku-id": "148086721ec0" },
                                children: []
                              }
                            ]
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "634958e3716b" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "5ed546d425a6" },
                            children: []
                          },

                          {
                            elementName: "g",
                            attributes: { "haiku-id": "9bbbc5ef3f73" },
                            children: [
                              {
                                elementName: "path",
                                attributes: { "haiku-id": "e0948d42edaf" },
                                children: []
                              },

                              {
                                elementName: "g",
                                attributes: { "haiku-id": "7a6a76f3abfd" },
                                children: [
                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "1be0ab7eb440" },
                                    children: []
                                  },

                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "f7479209c407" },
                                    children: []
                                  }
                                ]
                              }
                            ]
                          },

                          {
                            elementName: "g",
                            attributes: { "haiku-id": "ca3234584a30" },
                            children: [
                              {
                                elementName: "path",
                                attributes: { "haiku-id": "838671aae221" },
                                children: []
                              },

                              {
                                elementName: "g",
                                attributes: { "haiku-id": "714a66c8c8e4" },
                                children: [
                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "666351be4bc1" },
                                    children: []
                                  },

                                  {
                                    elementName: "path",
                                    attributes: { "haiku-id": "4e4a153fab77" },
                                    children: []
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "a0059c7e2aab" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "71f0b22621fd" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "fac52dbfbe86" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "0a386def5373" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "a6f86171bda7" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "367fb632e80a" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "670a36f96803" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "e44efd3537ea" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "d9a658e4f21e" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "3437b621c4cc" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "74d62972183e" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "b47b28acbf34" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "e09936348958" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "b7153eafdd90" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "6290da2e5d8c" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "6fd7434cfeb6" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "0b405eb519f2" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "2ae7d0b81485" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "18d31c6c5562" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "e6760b492d6a" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "871e566e2c56" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "e4fe667b5773" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "e413e6b46d68" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "8a8c3ea2c951" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "18df128efcf3" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "ef84e6681bc2" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "a212b8981ff0" },
                            children: []
                          }
                        ]
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "703f9214d665" },
                        children: []
                      },

                      {
                        elementName: "g",
                        attributes: { id: "Shape", "haiku-id": "84864efc7f6d" },
                        children: [
                          {
                            elementName: "path",
                            attributes: { "haiku-id": "faf1b490d5f2" },
                            children: []
                          },

                          {
                            elementName: "path",
                            attributes: { "haiku-id": "7acf82b14364" },
                            children: []
                          }
                        ]
                      }
                    ]
                  },

                  {
                    elementName: "g",
                    attributes: { id: "Group", "haiku-id": "3eda062fe36f" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "62f201490758" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "a1f79de7c002" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "e9015c69fe90" },
                        children: []
                      },

                      {
                        elementName: "path",
                        attributes: { id: "Shape", "haiku-id": "d0fac27b30ed" },
                        children: []
                      }
                    ]
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "8e3fef7bbc9e" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "21f74cd22df0" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "29016a5746bf" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "8a4fa9507e4d" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "605ca50c6297" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "362eff6d5cda" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "0703bb009aa4" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "01b2b5be103d" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "acb195280fe6" },
                    children: []
                  },

                  {
                    elementName: "path",
                    attributes: { id: "Shape", "haiku-id": "12a1a69413fd" },
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
          source: "designs/alien_sr.sketch.contents/slices/lever.svg",
          "haiku-id": "711d66112928",
          "haiku-title": "lever"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "32c39fa1154d" },
            children: ["lever"]
          },

          {
            elementName: "desc",
            attributes: { "haiku-id": "843e27712ed3" },
            children: ["Created with sketchtool."]
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "898eeed95fb0" },
            children: []
          },

          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "bf46e815c276" },
            children: [
              {
                elementName: "g",
                attributes: { id: "iPhone-8", "haiku-id": "23e89a342c7a" },
                children: [
                  {
                    elementName: "g",
                    attributes: { id: "lever", "haiku-id": "6cc7378eefe7" },
                    children: [
                      {
                        elementName: "path",
                        attributes: { id: "Line", "haiku-id": "dd367c3128ef" },
                        children: []
                      },

                      {
                        elementName: "circle",
                        attributes: {
                          id: "Oval-2",
                          "haiku-id": "5f0b6ac77315"
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
};
