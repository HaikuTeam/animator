var Haiku = require("@haiku/player");
var designs_ted_sketch_contents_artboards_ted_svg = require("../designs_ted_sketch_contents_artboards_ted_svg/code.js");
module.exports = {
  metadata: {
    relpath: "code/main/code.js",
    uuid: "HAIKU_SHARE_UUID",
    version: "0.0.10",
    organization: "Haiku",
    project: "Primitives",
    branch: "master",
    name: "Primitives"
  },

  options: {},
  states: { meow: { value: 1 } },
  eventHandlers: {
    "haiku:e5e416e36283": {
      click: {
        handler: function(event) {
          console.log(event);
          this.state.meow = 2;
        }
      }
    }
  },

  timelines: {
    Default: {
      "haiku:f203a65f49c0": {
        shown: {
          "0": { value: true, curve: "linear" },
          "80": { value: true },
          "160": { value: false, curve: "linear" },
          "240": { value: false, curve: "linear" },
          "320": { value: true },
          "400": { value: true, curve: "linear" },
          "450": { value: true }
        },

        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "hidden" } },
        "style.overflowY": { "0": { value: "hidden" } },
        opacity: {
          "0": {
            value: Haiku.inject(
              function(meow) {
                return meow;
              },
              "meow"
            )
          },

          "200": { value: 1 },
          "300": { value: 0.5, curve: "linear" },
          "1500": { value: 1 },
          "1750": { value: 0 },
          "5000": { value: 1 }
        },

        "sizeAbsolute.x": {
          "0": { value: 550, edited: true },
          "150": { value: 100 },
          "200": { value: 600 }
        },

        "sizeAbsolute.y": {
          "0": { value: 246, edited: true },
          "67": { value: 100, edited: true },
          "100": { value: 100 },
          "300": { value: 500, curve: "linear" },
          "350": { value: 515 },
          "417": { value: 505, edited: true }
        },

        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 50, curve: "linear" },
          "1000": { value: 55, curve: "linear" },
          "2000": { value: 56, curve: "linear" },
          "3000": { value: 100 }
        },

        "translation.y": { "0": { value: 55 }, "3000": { value: 300 } },
        "style.outline": { "0": { value: "1px solid gray" } },
        "scale.x": {
          "0": { value: 1 },
          "10": { value: 1 },
          "20": { value: 1 },
          "166": { value: 1 },
          "200": { value: 0 },
          "300": { value: 0 },
          "400": { value: 0 },
          "500": { value: 0 },
          "600": { value: 0 },
          "700": { value: 0 },
          "800": { value: 0 }
        },

        backgroundColor: {
          "0": { value: "#eee" },
          "17": { value: "#fff", curve: "linear" },
          "84": { value: "#fff", curve: "linear" },
          "160": { value: "#eee", curve: "linear" },
          "233": { value: "#eee", edited: true },
          "500": { value: "#fff" },
          "1250": { value: "#cdcdcd" }
        },

        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.margin": { "0": { value: "0 auto" } }
      },

      "haiku:e5e416e36283": {
        "translation.x": { "0": { value: -30.5, edited: true } },
        "translation.y": { "0": { value: 70.5, edited: true } },
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 172 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "style.border": { "0": { value: "0" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.position": { "0": { value: "absolute" } },
        viewBox: { "0": { value: "0 0 172 172" } },
        "scale.y": {
          "0": {
            value: 1.4844644736875778,
            edited: true,
            curve: "easeInOutBounce"
          },

          "100": { value: 2 },
          "200": { value: 3, curve: "linear" },
          "300": { value: 4.23423242 }
        },

        "rotation.z": {
          "0": { value: 0.5324304373222316, edited: true },
          "50": { value: 1.2, curve: "linear" },
          "266": { value: 2.1222, curve: "linear" },
          "450": { value: 2.99 }
        },

        "style.zIndex": { "0": { value: 1 } }
      },

      "haiku:56b197082bd8": {
        fill: { "0": { value: "none" } },
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:8ead96e5f2d1": { fill: { "0": { value: "#22E1FF" } } },
      "haiku:32fa8857ae54": {
        points: {
          "0": {
            value: "86 137.5 33.6871125 165.002512 43.677985 106.751256 1.35597005 65.4974875 59.8435563 56.9987438 86 4 112.156444 56.9987438 170.64403 65.4974875 128.322015 106.751256 138.312887 165.002512"
          }
        }
      },

      "haiku:ff46fa758156": {
        "translation.x": { "0": { value: 124.5, edited: true } },
        "translation.y": { "0": { value: -27.5, edited: true } },
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 172 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "style.border": { "0": { value: "0" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.position": { "0": { value: "absolute" } },
        viewBox: { "0": { value: "0 0 172 172" } },
        "rotation.z": { "0": { value: -0.20396835189761076, edited: true } },
        "style.zIndex": { "0": { value: 2 } }
      },

      "haiku:cfe0effd2375": {
        fill: { "0": { value: "none" } },
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:020aed882537": { fill: { "0": { value: "#D485B6" } } },
      "haiku:98f3b0fd36ad": {
        points: { "0": { value: "86 0 172 172 0 172" } }
      },

      "haiku:d96344f002ed": {
        "translation.x": { "0": { value: 167.5, edited: true } },
        "translation.y": { "0": { value: 264.5, edited: true } },
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 172 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "style.border": { "0": { value: "0" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.position": { "0": { value: "absolute" } },
        viewBox: { "0": { value: "0 0 172 172" } },
        "rotation.z": { "0": { value: -0.28953336697793053, edited: true } },
        "style.zIndex": { "0": { value: 3 } }
      },

      "haiku:dbd305a592fe": {
        fill: { "0": { value: "none" } },
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:aa39ef0b00d9": {
        fill: { "0": { value: "#F6A623" } },
        cx: { "0": { value: "86" } },
        cy: { "0": { value: "86.5" } },
        rx: { "0": { value: "86" } },
        ry: { "0": { value: "86.5" } }
      },

      "haiku:cfef9d559b15": {
        "translation.x": { "0": { value: 410.5, edited: true } },
        "translation.y": { "0": { value: 127.5, edited: true } },
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 172 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "style.border": { "0": { value: "0" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.position": { "0": { value: "absolute" } },
        viewBox: { "0": { value: "0 0 172 172" } },
        "scale.x": { "0": { value: 2.7694331936637946, edited: true } },
        "scale.y": { "0": { value: 1.0848358458966114, edited: true } },
        "style.zIndex": { "0": { value: 4 } }
      },

      "haiku:9a67b92383eb": {
        fill: { "0": { value: "none" } },
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:aba43f1ee250": { fill: { "0": { value: "#F8E81C" } } },
      "haiku:42907ffaa556": {
        "mount.x": { "0": { value: 0.5 } },
        "mount.y": { "0": { value: 0.5 } },
        "align.x": { "0": { value: 0.5 } },
        "align.y": { "0": { value: 0.5 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "translation.x": { "0": { value: 0 } },
        "translation.y": { "0": { value: 0 } },
        "rotation.z": { "0": { value: -5.497787143782138 } },
        "sizeAbsolute.x": { "0": { value: 116.689863 } },
        "sizeAbsolute.y": { "0": { value: 116.689863 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },

      "haiku:f4a5c879f6d5": {
        "translation.x": { "0": { value: 173.5, edited: true } },
        "translation.y": { "0": { value: 136.5, edited: true } },
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 172 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "style.border": { "0": { value: "0" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.position": { "0": { value: "absolute" } },
        viewBox: { "0": { value: "0 0 172 172" } },
        "scale.x": { "0": { value: 1.0909090909090917, edited: true } },
        "scale.y": { "0": { value: 1.1279069767441863, edited: true } },
        "style.zIndex": { "0": { value: 5 } }
      },

      "haiku:338ec32c9bc0": {
        fill: { "0": { value: "none" } },
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:0482734fff4e": { fill: { "0": { value: "#2FAC19" } } },
      "haiku:eb5dd3fc2c0b": {
        "mount.x": { "0": { value: 0.5 } },
        "mount.y": { "0": { value: 0.5 } },
        "align.x": { "0": { value: 0.5 } },
        "align.y": { "0": { value: 0.5 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "translation.x": { "0": { value: 0 } },
        "translation.y": { "0": { value: 0 } },
        "rotation.z": { "0": { value: -4.71238898038469 } },
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 176 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },

      "haiku:92a15d09b679": {
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 172 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 172 172" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": { "0": { value: 46.5, edited: true } },
        "translation.y": { "0": { value: 222.5, edited: true } },
        "scale.x": { "0": { value: 0.26136363636363746, edited: true } },
        "scale.y": { "0": { value: 0.27906976744186074, edited: true } },
        "style.zIndex": { "0": { value: 6 } }
      },

      "haiku:e65032d2b41b": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:84e4f11d56a5": { fill: { "0": { value: "#2FAC19" } } },
      "haiku:643cc296de5f": {
        "translation.x": { "0": { value: 0 } },
        "translation.y": { "0": { value: 0 } },
        "rotation.z": { "0": { value: -4.71238898038469 } },
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 176 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "align.x": { "0": { value: 0.5 } },
        "align.y": { "0": { value: 0.5 } },
        "mount.x": { "0": { value: 0.5 } },
        "mount.y": { "0": { value: 0.5 } }
      },

      "haiku:751d264dd836": {
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 172 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 172 172" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": { "0": { value: 26.5, edited: true } },
        "translation.y": { "0": { value: 181.5, edited: true } },
        "scale.x": { "0": { value: 0.17045454545454652, edited: true } },
        "scale.y": { "0": { value: 0.18604651162790653, edited: true } },
        "style.zIndex": { "0": { value: 7 } }
      },

      "haiku:79d5774770ee": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:65ad56f95a8f": { fill: { "0": { value: "#2FAC19" } } },
      "haiku:ccd04fdcf96b": {
        "translation.x": { "0": { value: 0 } },
        "translation.y": { "0": { value: 0 } },
        "rotation.z": { "0": { value: -4.71238898038469 } },
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 176 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "align.x": { "0": { value: 0.5 } },
        "align.y": { "0": { value: 0.5 } },
        "mount.x": { "0": { value: 0.5 } },
        "mount.y": { "0": { value: 0.5 } }
      },

      "haiku:2f2e55f6a44e": {
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 172 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 172 172" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": { "0": { value: -60.5, edited: true } },
        "translation.y": { "0": { value: -63.5, edited: true } },
        "scale.x": { "0": { value: 0.3023255813953486, edited: true } },
        "scale.y": { "0": { value: 0.2790697674418601, edited: true } },
        "style.zIndex": { "0": { value: 8 } }
      },

      "haiku:21bce2629aa2": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:925cb02df2bc": { fill: { "0": { value: "#D485B6" } } },
      "haiku:c8a644434aef": {
        points: { "0": { value: "86 0 172 172 0 172" } }
      },

      "haiku:c5038c844d27": {
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 172 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 172 172" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "style.zIndex": { "0": { value: 9 } },
        "translation.x": {
          "0": { value: 4, edited: true, curve: "linear" },
          "117": { value: 107, edited: true }
        },

        "translation.y": {
          "0": { value: -2, edited: true, curve: "linear" },
          "117": { value: -7, edited: true }
        }
      },

      "haiku:cf22e80ef7a3": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:adbdbe80b271": { fill: { "0": { value: "#FF9950" } } },
      "haiku:b44bc67970d1": {
        "translation.x": { "0": { value: 0 } },
        "translation.y": { "0": { value: 0 } },
        "rotation.z": { "0": { value: -4.71238898038469 } },
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 176 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "align.x": { "0": { value: 0.5 } },
        "align.y": { "0": { value: 0.5 } },
        "mount.x": { "0": { value: 0.5 } },
        "mount.y": { "0": { value: 0.5 } }
      },

      "haiku:038c25f0d384": {
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 172 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 172 172" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "style.zIndex": { "0": { value: 10 } },
        "translation.x": { "0": { value: 203, edited: true } },
        "translation.y": { "0": { value: 3, edited: true } }
      },

      "haiku:ad7a4131a647": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:1081439d5c94": {
        fill: { "0": { value: "#F6A623" } },
        cx: { "0": { value: "86" } },
        cy: { "0": { value: "86.5" } },
        rx: { "0": { value: "86" } },
        ry: { "0": { value: "86.5" } }
      },

      "haiku:29fc6d122725": {
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 172 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 172 172" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "style.zIndex": { "0": { value: 11 } }
      },

      "haiku:f950234394a1": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:d0f6627574b9": { fill: { "0": { value: "#22E1FF" } } },
      "haiku:407aa7a4ab8d": {
        points: {
          "0": {
            value: "86 137.5 33.6871125 165.002512 43.677985 106.751256 1.35597005 65.4974875 59.8435563 56.9987438 86 4 112.156444 56.9987438 170.64403 65.4974875 128.322015 106.751256 138.312887 165.002512"
          }
        }
      },

      "haiku:bb00b74e1b58": {
        "sizeAbsolute.x": {
          "0": {
            value: Haiku.inject(function() {
              return Math.sin(this.getDefaultTimeline().getFrame() / 100);
            })
          }
        },

        "sizeAbsolute.y": { "0": { value: 172 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 172 172" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "style.zIndex": { "0": { value: 12 } }
      },

      "haiku:7af6b73552e8": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },

      "haiku:3f30a9f08864": { fill: { "0": { value: "#FF9950" } } },
      "haiku:f40e689d9960": {
        "translation.x": { "0": { value: 0 } },
        "translation.y": { "0": { value: 0 } },
        "rotation.z": { "0": { value: -4.71238898038469 } },
        "sizeAbsolute.x": { "0": { value: 172 } },
        "sizeAbsolute.y": { "0": { value: 176 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "align.x": { "0": { value: 0.5 } },
        "align.y": { "0": { value: 0.5 } },
        "mount.x": { "0": { value: 0.5 } },
        "mount.y": { "0": { value: 0.5 } }
      },

      "haiku:239786b58b2b": { content: { "0": { value: "Star" } } },
      "haiku:087bb2967f58": {
        content: { "0": { value: "Created with sketchtool." } }
      },

      "haiku:bb3d06f70c1a": { content: { "0": { value: "Triangle" } } },
      "haiku:73deface3a4f": {
        content: { "0": { value: "Created with sketchtool." } }
      },

      "haiku:22cb677c6d42": { content: { "0": { value: "Circle" } } },
      "haiku:aece603aaffc": {
        content: { "0": { value: "Created with sketchtool." } }
      },

      "haiku:1cf9bac2951f": { content: { "0": { value: "Diamond" } } },
      "haiku:065f2db6e053": {
        content: { "0": { value: "Created with sketchtool." } }
      },

      "haiku:60ad5f3e3bc9": { content: { "0": { value: "Rectangle" } } },
      "haiku:cb55fd06d7db": {
        content: { "0": { value: "Created with sketchtool." } }
      },

      "haiku:8db57e9017df": { content: { "0": { value: "Rectangle" } } },
      "haiku:4b8b30181a34": {
        content: { "0": { value: "Created with sketchtool." } }
      },

      "haiku:8988dfc50fca": { content: { "0": { value: "Rectangle" } } },
      "haiku:0e6a60cc1112": {
        content: { "0": { value: "Created with sketchtool." } }
      },

      "haiku:e47cbeef61d8": { content: { "0": { value: "Triangle" } } },
      "haiku:0f73d3321dfe": {
        content: { "0": { value: "Created with sketchtool." } }
      },

      "haiku:d3ec7b0df2c1": { content: { "0": { value: "Rectangle" } } },
      "haiku:7f21eb899961": {
        content: { "0": { value: "Created with sketchtool." } }
      },

      "haiku:6b083ae85a4f": { content: { "0": { value: "Circle" } } },
      "haiku:883677a8c05d": {
        content: { "0": { value: "Created with sketchtool." } }
      },

      "haiku:9a57f552184d": { content: { "0": { value: "Star" } } },
      "haiku:e5d2ceea00f4": {
        content: { "0": { value: "Created with sketchtool." } }
      },

      "haiku:cf5916f3fa78": { content: { "0": { value: "Rectangle" } } },
      "haiku:5befb29c8c7f": {
        content: { "0": { value: "Created with sketchtool." } }
      },

      "haiku:7dddaf39cadf": {},
      "haiku:8300259b3274": {},
      "haiku:aa263d0f8d6f": {},
      "haiku:9861b2ec5e0f": {},
      "haiku:fcddb5efa49a": {},
      "haiku:8f968580c491": {},
      "haiku:2e548b17065e": {},
      "haiku:39e4e3c9d024": {},
      "haiku:c1be02c32cc3": {},
      "haiku:aa9de0e42bc1": {},
      "haiku:107813b67c97": {},
      "haiku:d5d1e484fbd3": {},
      "haiku:6c79e82853d3": {},
      "haiku:a814a9d1ec17": {},
      "haiku:a29349e9a353": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 92 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 47 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 223, edited: true } },
        "translation.y": { "0": { value: 135.5, edited: true } },
        "style.zIndex": { "0": { value: 13 } }
      },

      "haiku:1559e94d9e72": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 92 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 47 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 104, edited: true } },
        "translation.y": { "0": { value: 126.5, edited: true } },
        "style.zIndex": { "0": { value: 14 } }
      }
    }
  },

  template: {
    elementName: "div",
    attributes: {
      "haiku-title": "Primitives",
      "haiku-id": "f203a65f49c0",
      style: {
        position: "relative",
        overflowX: "hidden",
        overflowY: "hidden",
        outline: "1px solid gray",
        backgroundColor: "#eee",
        webkitTapHighlightColor: "rgba(0,0,0,0)",
        margin: "0 auto"
      }
    },

    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          source: "designs/Primitives.sketch.contents/artboards/Star.svg",
          "haiku-title": "A Star Is Boooorrrrnnnn",
          "haiku-id": "e5e416e36283",
          style: {
            border: "0",
            margin: "0",
            padding: "0",
            position: "absolute",
            zIndex: 1
          },

          viewBox: "0 0 172 172"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "239786b58b2b", style: {} },
            children: ["Star"]
          },

          {
            elementName: "desc",
            attributes: {
              "haiku-id": "087bb2967f58",
              content: "Created with sketchtool.",
              style: {}
            },

            children: []
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "7dddaf39cadf", style: {} },
            children: []
          },

          {
            elementName: "g",
            attributes: {
              id: "Page-1",
              "haiku-id": "56b197082bd8",
              style: {},
              fill: "none",
              stroke: "none",
              "stroke-width": "1",
              "fill-rule": "evenodd"
            },

            children: [
              {
                elementName: "g",
                attributes: {
                  id: "Star",
                  "haiku-id": "8ead96e5f2d1",
                  style: {},
                  fill: "rgb(34, 225, 255)"
                },

                children: [
                  {
                    elementName: "polygon",
                    attributes: {
                      "haiku-id": "32fa8857ae54",
                      style: {},
                      points: "86 137.5 33.6871125 165.002512 43.677985 106.751256 1.35597005 65.4974875 59.8435563 56.9987438 86 4 112.156444 56.9987438 170.64403 65.4974875 128.322015 106.751256 138.312887 165.002512"
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
          source: "designs/Primitives.sketch.contents/artboards/Triangle.svg",
          "haiku-title": "Triangle",
          "haiku-id": "ff46fa758156",
          style: {
            border: "0",
            margin: "0",
            padding: "0",
            position: "absolute",
            zIndex: 2
          },

          viewBox: "0 0 172 172"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "bb3d06f70c1a", style: {} },
            children: ["Triangle"]
          },

          {
            elementName: "desc",
            attributes: {
              "haiku-id": "73deface3a4f",
              content: "Created with sketchtool.",
              style: {}
            },

            children: []
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "8300259b3274", style: {} },
            children: []
          },

          {
            elementName: "g",
            attributes: {
              id: "Page-1",
              "haiku-id": "cfe0effd2375",
              style: {},
              fill: "none",
              stroke: "none",
              "stroke-width": "1",
              "fill-rule": "evenodd"
            },

            children: [
              {
                elementName: "g",
                attributes: {
                  id: "Triangle",
                  "haiku-id": "020aed882537",
                  style: {},
                  fill: "rgb(212, 133, 182)"
                },

                children: [
                  {
                    elementName: "polygon",
                    attributes: {
                      "haiku-id": "98f3b0fd36ad",
                      style: {},
                      points: "86 0 172 172 0 172"
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
          source: "designs/Primitives.sketch.contents/artboards/Circle.svg",
          "haiku-title": "Circle",
          "haiku-id": "d96344f002ed",
          style: {
            border: "0",
            margin: "0",
            padding: "0",
            position: "absolute",
            zIndex: 3
          },

          viewBox: "0 0 172 172"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "22cb677c6d42", style: {} },
            children: ["Circle"]
          },

          {
            elementName: "desc",
            attributes: {
              "haiku-id": "aece603aaffc",
              content: "Created with sketchtool.",
              style: {}
            },

            children: []
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "aa263d0f8d6f", style: {} },
            children: []
          },

          {
            elementName: "g",
            attributes: {
              id: "Page-1",
              "haiku-id": "dbd305a592fe",
              style: {},
              fill: "none",
              stroke: "none",
              "stroke-width": "1",
              "fill-rule": "evenodd"
            },

            children: [
              {
                elementName: "ellipse",
                attributes: {
                  id: "Oval",
                  "haiku-id": "aa39ef0b00d9",
                  style: {},
                  fill: "rgb(246, 166, 35)",
                  cx: "86",
                  cy: "86.5",
                  rx: "86",
                  ry: "86.5"
                },

                children: []
              },

              {
                elementName: "g",
                attributes: {
                  id: "Circle",
                  "haiku-id": "9861b2ec5e0f",
                  style: {}
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
          source: "designs/Primitives.sketch.contents/artboards/Diamond.svg",
          "haiku-title": "Diamond",
          "haiku-id": "cfef9d559b15",
          style: {
            border: "0",
            margin: "0",
            padding: "0",
            position: "absolute",
            zIndex: 4
          },

          viewBox: "0 0 172 172"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "1cf9bac2951f", style: {} },
            children: ["Diamond"]
          },

          {
            elementName: "desc",
            attributes: {
              "haiku-id": "065f2db6e053",
              content: "Created with sketchtool.",
              style: {}
            },

            children: []
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "fcddb5efa49a", style: {} },
            children: []
          },

          {
            elementName: "g",
            attributes: {
              id: "Page-1",
              "haiku-id": "9a67b92383eb",
              style: {},
              fill: "none",
              stroke: "none",
              "stroke-width": "1",
              "fill-rule": "evenodd"
            },

            children: [
              {
                elementName: "g",
                attributes: {
                  id: "Diamond",
                  "haiku-id": "aba43f1ee250",
                  style: {},
                  fill: "rgb(248, 232, 28)"
                },

                children: [
                  {
                    elementName: "rect",
                    attributes: {
                      id: "Rectangle",
                      "haiku-id": "42907ffaa556",
                      style: {}
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
          source: "designs/Primitives.sketch.contents/artboards/Rectangle.svg",
          "haiku-title": "Rectangle",
          "haiku-id": "f4a5c879f6d5",
          style: {
            border: "0",
            margin: "0",
            padding: "0",
            position: "absolute",
            zIndex: 5
          },

          viewBox: "0 0 172 172"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "60ad5f3e3bc9", style: {} },
            children: ["Rectangle"]
          },

          {
            elementName: "desc",
            attributes: {
              "haiku-id": "cb55fd06d7db",
              content: "Created with sketchtool.",
              style: {}
            },

            children: []
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "8f968580c491", style: {} },
            children: []
          },

          {
            elementName: "g",
            attributes: {
              id: "Page-1",
              "haiku-id": "338ec32c9bc0",
              style: {},
              fill: "none",
              stroke: "none",
              "stroke-width": "1",
              "fill-rule": "evenodd"
            },

            children: [
              {
                elementName: "g",
                attributes: {
                  id: "Rectangle",
                  "haiku-id": "0482734fff4e",
                  style: {},
                  fill: "rgb(47, 172, 25)"
                },

                children: [
                  {
                    elementName: "rect",
                    attributes: { "haiku-id": "eb5dd3fc2c0b", style: {} },
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
          source: "designs/Primitives.sketch.contents/artboards/Rectangle.svg",
          "haiku-title": "Rectangle",
          "haiku-id": "92a15d09b679",
          style: {
            position: "absolute",
            margin: "0",
            padding: "0",
            border: "0",
            zIndex: 6
          },

          viewBox: "0 0 172 172"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "8db57e9017df", style: {} },
            children: ["Rectangle"]
          },

          {
            elementName: "desc",
            attributes: {
              "haiku-id": "4b8b30181a34",
              content: "Created with sketchtool.",
              style: {}
            },

            children: []
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "2e548b17065e", style: {} },
            children: []
          },

          {
            elementName: "g",
            attributes: {
              id: "Page-1",
              "haiku-id": "e65032d2b41b",
              style: {},
              stroke: "none",
              "stroke-width": "1",
              fill: "none",
              "fill-rule": "evenodd"
            },

            children: [
              {
                elementName: "g",
                attributes: {
                  id: "Rectangle",
                  "haiku-id": "84e4f11d56a5",
                  style: {},
                  fill: "rgb(47, 172, 25)"
                },

                children: [
                  {
                    elementName: "rect",
                    attributes: { "haiku-id": "643cc296de5f", style: {} },
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
          source: "designs/Primitives.sketch.contents/artboards/Rectangle.svg",
          "haiku-title": "Rectangle",
          "haiku-id": "751d264dd836",
          style: {
            position: "absolute",
            margin: "0",
            padding: "0",
            border: "0",
            zIndex: 7
          },

          viewBox: "0 0 172 172"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "8988dfc50fca", style: {} },
            children: ["Rectangle"]
          },

          {
            elementName: "desc",
            attributes: {
              "haiku-id": "0e6a60cc1112",
              content: "Created with sketchtool.",
              style: {}
            },

            children: []
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "39e4e3c9d024", style: {} },
            children: []
          },

          {
            elementName: "g",
            attributes: {
              id: "Page-1",
              "haiku-id": "79d5774770ee",
              style: {},
              stroke: "none",
              "stroke-width": "1",
              fill: "none",
              "fill-rule": "evenodd"
            },

            children: [
              {
                elementName: "g",
                attributes: {
                  id: "Rectangle",
                  "haiku-id": "65ad56f95a8f",
                  style: {},
                  fill: "rgb(47, 172, 25)"
                },

                children: [
                  {
                    elementName: "rect",
                    attributes: { "haiku-id": "ccd04fdcf96b", style: {} },
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
          source: "designs/Primitives.sketch.contents/artboards/Triangle.svg",
          "haiku-title": "Triangle",
          "haiku-id": "2f2e55f6a44e",
          style: {
            position: "absolute",
            margin: "0",
            padding: "0",
            border: "0",
            zIndex: 8
          },

          viewBox: "0 0 172 172"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "e47cbeef61d8", style: {} },
            children: ["Triangle"]
          },

          {
            elementName: "desc",
            attributes: {
              "haiku-id": "0f73d3321dfe",
              content: "Created with sketchtool.",
              style: {}
            },

            children: []
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "c1be02c32cc3", style: {} },
            children: []
          },

          {
            elementName: "g",
            attributes: {
              id: "Page-1",
              "haiku-id": "21bce2629aa2",
              style: {},
              stroke: "none",
              "stroke-width": "1",
              fill: "none",
              "fill-rule": "evenodd"
            },

            children: [
              {
                elementName: "g",
                attributes: {
                  id: "Triangle",
                  "haiku-id": "925cb02df2bc",
                  style: {},
                  fill: "rgb(212, 133, 182)"
                },

                children: [
                  {
                    elementName: "polygon",
                    attributes: {
                      "haiku-id": "c8a644434aef",
                      style: {},
                      points: "86 0 172 172 0 172"
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
          source: "designs/Primitives.sketch.contents/artboards/Rectangle.svg",
          "haiku-title": "Rectangle",
          "haiku-id": "c5038c844d27",
          style: {
            position: "absolute",
            margin: "0",
            padding: "0",
            border: "0",
            zIndex: 9
          },

          viewBox: "0 0 172 172"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "d3ec7b0df2c1", style: {} },
            children: ["Rectangle"]
          },

          {
            elementName: "desc",
            attributes: {
              "haiku-id": "7f21eb899961",
              content: "Created with sketchtool.",
              style: {}
            },

            children: []
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "aa9de0e42bc1", style: {} },
            children: []
          },

          {
            elementName: "g",
            attributes: {
              id: "Page-1",
              "haiku-id": "cf22e80ef7a3",
              style: {},
              stroke: "none",
              "stroke-width": "1",
              fill: "none",
              "fill-rule": "evenodd"
            },

            children: [
              {
                elementName: "g",
                attributes: {
                  id: "Rectangle",
                  "haiku-id": "adbdbe80b271",
                  style: {},
                  fill: "rgb(255, 153, 80)"
                },

                children: [
                  {
                    elementName: "rect",
                    attributes: { "haiku-id": "b44bc67970d1", style: {} },
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
          source: "designs/Primitives.sketch.contents/artboards/Circle.svg",
          "haiku-title": "Circle",
          "haiku-id": "038c25f0d384",
          style: {
            position: "absolute",
            margin: "0",
            padding: "0",
            border: "0",
            zIndex: 10
          },

          viewBox: "0 0 172 172"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "6b083ae85a4f", style: {} },
            children: ["Circle"]
          },

          {
            elementName: "desc",
            attributes: {
              "haiku-id": "883677a8c05d",
              content: "Created with sketchtool.",
              style: {}
            },

            children: []
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "107813b67c97", style: {} },
            children: []
          },

          {
            elementName: "g",
            attributes: {
              id: "Page-1",
              "haiku-id": "ad7a4131a647",
              style: {},
              stroke: "none",
              "stroke-width": "1",
              fill: "none",
              "fill-rule": "evenodd"
            },

            children: [
              {
                elementName: "ellipse",
                attributes: {
                  id: "Oval",
                  "haiku-id": "1081439d5c94",
                  style: {},
                  fill: "rgb(246, 166, 35)",
                  cx: "86",
                  cy: "86.5",
                  rx: "86",
                  ry: "86.5"
                },

                children: []
              },

              {
                elementName: "g",
                attributes: {
                  id: "Circle",
                  "haiku-id": "d5d1e484fbd3",
                  style: {}
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
          source: "designs/Primitives.sketch.contents/artboards/Star.svg",
          "haiku-title": "A Star Is Boooorrrrnnnn",
          "haiku-id": "29fc6d122725",
          style: {
            position: "absolute",
            margin: "0",
            padding: "0",
            border: "0",
            zIndex: 11
          },

          viewBox: "0 0 172 172"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "9a57f552184d", style: {} },
            children: ["Star"]
          },

          {
            elementName: "desc",
            attributes: {
              "haiku-id": "e5d2ceea00f4",
              content: "Created with sketchtool.",
              style: {}
            },

            children: []
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "6c79e82853d3", style: {} },
            children: []
          },

          {
            elementName: "g",
            attributes: {
              id: "Page-1",
              "haiku-id": "f950234394a1",
              style: {},
              stroke: "none",
              "stroke-width": "1",
              fill: "none",
              "fill-rule": "evenodd"
            },

            children: [
              {
                elementName: "g",
                attributes: {
                  id: "Star",
                  "haiku-id": "d0f6627574b9",
                  style: {},
                  fill: "rgb(34, 225, 255)"
                },

                children: [
                  {
                    elementName: "polygon",
                    attributes: {
                      "haiku-id": "407aa7a4ab8d",
                      style: {},
                      points: "86 137.5 33.6871125 165.002512 43.677985 106.751256 1.35597005 65.4974875 59.8435563 56.9987438 86 4 112.156444 56.9987438 170.64403 65.4974875 128.322015 106.751256 138.312887 165.002512"
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
          source: "designs/Primitives.sketch.contents/artboards/Rectangle.svg",
          "haiku-title": "Rectangle",
          "haiku-id": "bb00b74e1b58",
          style: {
            position: "absolute",
            margin: "0",
            padding: "0",
            border: "0",
            zIndex: 12
          },

          viewBox: "0 0 172 172"
        },

        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "cf5916f3fa78", style: {} },
            children: ["Rectangle"]
          },

          {
            elementName: "desc",
            attributes: {
              "haiku-id": "5befb29c8c7f",
              content: "Created with sketchtool.",
              style: {}
            },

            children: []
          },

          {
            elementName: "defs",
            attributes: { "haiku-id": "a814a9d1ec17", style: {} },
            children: []
          },

          {
            elementName: "g",
            attributes: {
              id: "Page-1",
              "haiku-id": "7af6b73552e8",
              style: {},
              stroke: "none",
              "stroke-width": "1",
              fill: "none",
              "fill-rule": "evenodd"
            },

            children: [
              {
                elementName: "g",
                attributes: {
                  id: "Rectangle",
                  "haiku-id": "3f30a9f08864",
                  style: {},
                  fill: "rgb(255, 153, 80)"
                },

                children: [
                  {
                    elementName: "rect",
                    attributes: { "haiku-id": "f40e689d9960", style: {} },
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },

      {
        elementName: designs_ted_sketch_contents_artboards_ted_svg,
        attributes: {
          source: "../designs_ted_sketch_contents_artboards_ted_svg/code.js",
          "haiku-title": "designs_ted_sketch_contents_artboards_ted_svg",
          "haiku-id": "a29349e9a353",
          style: {
            position: "absolute",
            margin: "0",
            padding: "0",
            border: "0",
            zIndex: 13
          }
        },

        children: []
      },

      {
        elementName: designs_ted_sketch_contents_artboards_ted_svg,
        attributes: {
          source: "../designs_ted_sketch_contents_artboards_ted_svg/code.js",
          "haiku-title": "designs_ted_sketch_contents_artboards_ted_svg",
          "haiku-id": "1559e94d9e72",
          style: {
            position: "absolute",
            margin: "0",
            padding: "0",
            border: "0",
            zIndex: 14
          }
        },

        children: []
      }
    ]
  }
};
