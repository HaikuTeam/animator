var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    uuid: "e2d433c9-b134-4ff9-bd0e-903544b3d3f6",
    type: "haiku",
    name: "babyphone",
    relpath: "code/main/code.js",
    core: "3.2.8",
    player: "3.0.21",
    version: "0.0.5",
    organization: "thomaspetrach",
    project: "babyphone",
    branch: "master"
  },
  options: {},
  states: {},
  eventHandlers: {
    "haiku:e4a9e4d8baa7": {
      "timeline:Default:360": {
        handler: function(event) {
          /** action logic goes here */
          this.getDefaultTimeline().pause();
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
        "sizeAbsolute.x": { "0": { value: 375, edited: true } },
        "sizeAbsolute.y": { "0": { value: 667, edited: true } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:904e03109c04": {
        viewBox: { "0": { value: "0 0 375 127" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 375 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 127 } },
        "sizeMode.y": { "0": { value: 1 } },
        "style.zIndex": { "0": { value: 11 } },
        "translation.y": { "0": { value: 538, edited: true } },
        "translation.x": { "0": { value: 0, edited: true } },
        "mount.x": { "0": { value: -0.5 } },
        "mount.y": { "0": { value: -0.5 } }
      },
      "haiku:d73bd1daafad": {
        viewBox: { "0": { value: "0 0 137 103" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 137 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 103 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 166, edited: true },
          "1233": { value: 166, edited: true, curve: "linear" },
          "5183": { value: 360, edited: true }
        },
        "translation.y": {
          "0": { value: 440, edited: true },
          "4000": { value: 440, edited: true }
        },
        "style.zIndex": { "0": { value: 10 } },
        opacity: { "0": { value: 1, edited: true } },
        "mount.x": { "0": { value: -0.5 } },
        "mount.y": { "0": { value: -0.5 } }
      },
      "haiku:585e59e0d857": {
        stroke: { "0": { value: "none" } },
        "strokeWidth": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fillRule": { "0": { value: "evenodd" } },
        "translation.y": { "0": { value: -540 } }
      },
      "haiku:547431671b82": {
        d: {
          "0": {
            value: "M0,540 C87.3333333,564 155.833333,570 205.5,558 C255.166667,546 311.666667,548.5 375,565.5 L375,668 L0,668 L0,540 Z"
          }
        },
        fill: { "0": { value: "#80C584" } }
      },
      "haiku:27892845bdb9": {
        viewBox: { "0": { value: "0 0 85 85" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 85 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 85 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 211, edited: true },
          "50": { value: 211, edited: true, curve: "linear" },
          "6000": { value: 270, edited: true }
        },
        "translation.y": {
          "0": { value: 400.6666564941406, edited: true },
          "50": { value: 400.6666564941406, edited: true, curve: "linear" },
          "6000": { value: 405, edited: true }
        },
        "style.zIndex": { "0": { value: 3 } },
        "rotation.z": {
          "0": { value: 0 },
          "1067": { value: -3.7233672589565003e-8, edited: true }
        },
        "mount.x": { "0": { value: -0.5 } },
        "mount.y": { "0": { value: -0.5 } }
      },
      "haiku:bf40e73e7fa2": {
        viewBox: { "0": { value: "0 0 278 241" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 278 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 241 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 146.83331298828125, edited: true } },
        "translation.y": { "0": { value: 388.5, edited: true } },
        "style.zIndex": { "0": { value: 4 } },
        "mount.x": { "0": { value: -0.5 } },
        "mount.y": { "0": { value: -0.5 } }
      },
      "haiku:40843fa0886a": {
        viewBox: { "0": { value: "0 0 375 137" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 375 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 137 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: -0.5, edited: true } },
        "translation.y": { "0": { value: 528.5, edited: true } },
        "style.zIndex": { "0": { value: 2 } },
        "mount.x": { "0": { value: -0.5 } },
        "mount.y": { "0": { value: -0.5 } }
      },
      "haiku:5385aad95363": {
        viewBox: { "0": { value: "0 0 104 86" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 104 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 86 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 249.5, edited: true },
          "200": { value: 249.5, edited: true, curve: "linear" },
          "6000": { value: 374.5, edited: true }
        },
        "translation.y": {
          "0": { value: 49.66667175292969, edited: true },
          "200": { value: 49.66667175292969, edited: true },
          "6000": { value: 49.66667175292969, edited: true }
        },
        "style.zIndex": { "0": { value: 12 } },
        "mount.x": { "0": { value: -0.5 } },
        "mount.y": { "0": { value: -0.5 } }
      },
      "haiku:a267f6fd18e6": {
        viewBox: { "0": { value: "0 0 100 83" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 100 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 83 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: -60, edited: true, curve: "linear" },
          "6000": { value: 359.5, edited: true }
        },
        "translation.y": {
          "0": { value: 375.1666717529297, edited: true },
          "6000": { value: 375.1666717529297, edited: true }
        },
        "style.zIndex": { "0": { value: 1 } },
        "mount.x": { "0": { value: -0.5 } },
        "mount.y": { "0": { value: -0.5 } }
      },
      "haiku:08f49f40b350": {
        d: {
          "0": {
            value: "M72.0192666,54.3903934 C71.2644958,54.7799976 70.40794,55 69.5,55 L44.5,55 C44.2660624,55 44.0355361,54.9853946 43.8092832,54.957046 C43.5431527,54.9854522 43.2731753,55 43,55 C38.581722,55 35,51.1944204 35,46.5 C35,41.8055796 38.581722,38 43,38 C43.701869,38 44.3826274,38.0960344 45.0312704,38.2764107 C45.0105579,38.0203419 45,37.7614039 45,37.5 C45,32.2532949 49.2532949,28 54.5,28 C56.8011665,28 58.9112372,28.8181789 60.5551779,30.1795027 C62.3663313,28.8083258 64.5928726,28 67,28 C72.7866586,28 77.5296983,32.6713669 77.9670909,38.6037988 C80.916342,39.8559889 83,42.919454 83,46.5 C83,51.1944204 79.418278,55 75,55 C73.9464492,55 72.9404647,54.7836157 72.0192666,54.3903934 Z"
          }
        }
      },
      "haiku:789684579467": {
        x: { "0": { value: "-95.8%" } },
        y: { "0": { value: "-163.0%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 2.917 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 4.407 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:aa6d57e32d9f": {
        dx: { "0": { value: "0" } },
        dy: { "0": { value: "2" } },
        in: { "0": { value: "SourceAlpha" } },
        result: { "0": { value: "shadowOffsetOuter1" } }
      },
      "haiku:ce7ad246833a": {
        stdDeviation: { "0": { value: "15" } },
        in: { "0": { value: "shadowOffsetOuter1" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:64201f4994cc": {
        values: {
          "0": {
            value: "0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.146314538 0"
          }
        },
        in: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:48d276a27b44": {
        stroke: { "0": { value: "none" } },
        "strokeWidth": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fillRule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -76 } },
        "translation.y": { "0": { value: -379 } }
      },
      "haiku:6b75d1e7db87": {
        "translation.x": { "0": { value: 69 } },
        "translation.y": { "0": { value: 378 } }
      },
      "haiku:be4f70663396": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 119 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 90 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:3baf3e7406b7": {
        fill: { "0": { value: "black" } },
        "fillOpacity": { "0": { value: "1" } },
        filter: { "0": { value: "url(#filter-2-efce77-uwftbdh51xs)" } }
      },
      "haiku:5ae54c475808": {
        fill: { "0": { value: "#FFFFFF" } },
        "fillRule": { "0": { value: "evenodd" } }
      },
      "haiku:a17d56c742ec": {
        stroke: { "0": { value: "none" } },
        "strokeWidth": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fillRule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -97 } },
        "translation.y": { "0": { value: -416 } }
      },
      "haiku:bd91401f8a66": {
        "translation.x": { "0": { value: 97 } },
        "translation.y": { "0": { value: 416 } }
      },
      "haiku:2be70a6e8074": {
        d: {
          "0": {
            value: "M121.969246,83.1509258 L210.338158,219.963036 L0,219.963036 L88.368912,83.1509258 C94.3620132,73.8724498 106.742073,71.2091274 116.020548,77.2022286 C118.402777,78.7409446 120.43053,80.7686968 121.969246,83.1509258 Z"
          }
        },
        fill: { "0": { value: "#EEEEEE" } }
      },
      "haiku:f81f537e0f93": {
        d: {
          "0": {
            value: "M252.800167,9.15092579 L402,240.141029 L70,240.141029 L219.199833,9.15092579 C225.192934,-0.127550161 237.572994,-2.79087262 246.85147,3.20222858 C249.233699,4.74094458 251.261451,6.7686968 252.800167,9.15092579 Z"
          }
        },
        fill: { "0": { value: "#DFDFDF" } }
      },
      "haiku:75c6ae1e00c4": {
        stroke: { "0": { value: "none" } },
        "strokeWidth": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fillRule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -248 } },
        "translation.y": { "0": { value: -422 } }
      },
      "haiku:12c8a978ba7e": {
        fill: { "0": { value: "#FDC02F" } },
        cx: { "0": { value: "290.5" } },
        cy: { "0": { value: "464.5" } },
        r: { "0": { value: "42.5" } }
      },
      "haiku:ccdf839ae822": {
        d: {
          "0": {
            value: "M101.864839,77.850947 C100.934763,78.5712806 99.7674476,79 98.5,79 L46.5,79 C45.6259215,79 44.7994661,78.7961015 44.0656029,78.4332738 C36.5478902,76.4700069 31,69.632893 31,61.5 C31,51.8350169 38.8350169,44 48.5,44 C49.7904158,44 51.0482105,44.1396681 52.2590916,44.4047119 C53.461773,38.4685396 58.7090448,34 65,34 C69.9279013,34 74.2153904,36.7419304 76.4200572,40.7833812 C78.6728944,39.0352871 81.469863,38 84.5,38 C91.658495,38 97.5156565,43.7780293 97.9714538,51.082204 C104.735118,51.8425228 110,57.78365 110,65 C110,70.7549948 106.651554,75.6989523 101.864839,77.850947 Z"
          }
        }
      },
      "haiku:6c901f41e499": {
        x: { "0": { value: "-58.2%" } },
        y: { "0": { value: "-97.8%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 2.165 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 3.0439999999999996 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:79a5dc9d7692": {
        dx: { "0": { value: "0" } },
        dy: { "0": { value: "2" } },
        in: { "0": { value: "SourceAlpha" } },
        result: { "0": { value: "shadowOffsetOuter1" } }
      },
      "haiku:f55466898036": {
        stdDeviation: { "0": { value: "15" } },
        in: { "0": { value: "shadowOffsetOuter1" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:56d8ad6b2914": {
        values: {
          "0": {
            value: "0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.146314538 0"
          }
        },
        in: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:6be91a1b8c18": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 141 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 113 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:90591070d02b": {
        stroke: { "0": { value: "none" } },
        "strokeWidth": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fillRule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -219 } },
        "translation.y": { "0": { value: -436 } }
      },
      "haiku:683c45755d06": {
        "translation.x": { "0": { value: 217 } },
        "translation.y": { "0": { value: 428 } }
      },
      "haiku:3773a0ca6bcd": {
        fill: { "0": { value: "black" } },
        "fillOpacity": { "0": { value: "1" } },
        filter: { "0": { value: "url(#filter-2-021e2a-uwftbdh51xs)" } }
      },
      "haiku:4e8ab94299f2": {
        fill: { "0": { value: "#FFFFFF" } },
        "fillRule": { "0": { value: "evenodd" } }
      },
      "haiku:c38e930ff35a": { opacity: { "0": { value: "0" } } },
      "haiku:ec8fab44f787": {
        fill: { "0": { value: "#D8D8D8" } },
        "fillRule": { "0": { value: "evenodd" } }
      },
      "haiku:a5a477b57b84": {
        stroke: { "0": { value: "#979797" } },
        "strokeWidth": { "0": { value: "1" } },
        x: { "0": { value: "0.5" } },
        y: { "0": { value: "0.5" } },
        "sizeAbsolute.x": { "0": { value: 140 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 112 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:dbfa557f0709": {
        stroke: { "0": { value: "none" } },
        "strokeWidth": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fillRule": { "0": { value: "evenodd" } },
        "translation.y": { "0": { value: -530 } }
      },
      "haiku:8af748650572": {
        d: {
          "0": {
            value: "M-1.15463195e-14,538.715347 C2,536.382013 12.1666667,533.715347 30.5,530.715347 C95.5,525.04868 210.333333,553.04868 375,614.715347 L375,666.715347 L-1.15463195e-14,666.715347 L-1.15463195e-14,538.715347 Z"
          }
        },
        fill: { "0": { value: "#B1E7B4" } }
      },
      "haiku:1b97a80c4fe5": {
        d: {
          "0": {
            value: "M66.8429991,64.1216919 C66.6829148,64.1357036 66.5208643,64.1428571 66.3571429,64.1428571 L42.2619048,64.1428571 C42.0335363,64.1428571 41.8084186,64.1289389 41.5873537,64.1019043 C41.2920294,64.1290063 40.9928703,64.1428571 40.6904762,64.1428571 C35.338574,64.1428571 31,59.8042832 31,54.452381 C31,49.1004787 35.338574,44.7619048 40.6904762,44.7619048 C41.3625186,44.7619048 42.0185829,44.8303155 42.652085,44.9605529 C43.2948065,41.5666022 46.2762436,39 49.8571429,39 C52.6517623,39 55.0812725,40.5632186 56.3189606,42.862943 C57.6272835,41.7579618 59.2983516,41.0952381 61.1190476,41.0952381 C65.1810819,41.0952381 68.4983418,44.3939533 68.7041589,48.5431058 C72.2798356,49.180772 75,52.404625 75,56.2857143 C75,60.6250945 71.5994961,64.1428571 67.4047619,64.1428571 C67.2158168,64.1428571 67.0284832,64.1357199 66.8429991,64.1216919 Z"
          }
        }
      },
      "haiku:ee58e5b88196": {
        x: { "0": { value: "-104.5%" } },
        y: { "0": { value: "-175.0%" } },
        filterUnits: { "0": { value: "objectBoundingBox" } },
        "sizeProportional.x": { "0": { value: 3.091 } },
        "sizeMode.x": { "0": { value: 0 } },
        "sizeProportional.y": { "0": { value: 4.659 } },
        "sizeMode.y": { "0": { value: 0 } }
      },
      "haiku:be91f086b4a1": {
        dx: { "0": { value: "0" } },
        dy: { "0": { value: "2" } },
        in: { "0": { value: "SourceAlpha" } },
        result: { "0": { value: "shadowOffsetOuter1" } }
      },
      "haiku:c969513a5a07": {
        stdDeviation: { "0": { value: "15" } },
        in: { "0": { value: "shadowOffsetOuter1" } },
        result: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:5d5233320d97": {
        values: {
          "0": {
            value: "0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.146314538 0"
          }
        },
        in: { "0": { value: "shadowBlurOuter1" } }
      },
      "haiku:25938da2add1": {
        stroke: { "0": { value: "none" } },
        "strokeWidth": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fillRule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -267 } },
        "translation.y": { "0": { value: -30 } }
      },
      "haiku:496e749c7da6": {
        "translation.x": { "0": { value: 264 } },
        "translation.y": { "0": { value: 17 } }
      },
      "haiku:339dc7585758": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 106 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 103 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:073055e27e3e": {
        fill: { "0": { value: "black" } },
        "fillOpacity": { "0": { value: "1" } },
        filter: { "0": { value: "url(#filter-2-139f12-uwftbdh51xs)" } }
      },
      "haiku:0d4bae79141f": {
        fill: { "0": { value: "#FFFFFF" } },
        "fillRule": { "0": { value: "evenodd" } }
      },
      "haiku:fc4ea2a8f760": {
        viewBox: { "0": { value: "0 0 80 166" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 80 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 166 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 30.5, edited: true },
          "1033": { value: 30.5, edited: true },
          "1467": { value: 30.5, edited: true }
        },
        "translation.y": {
          "0": { value: 574, edited: true },
          "1033": { value: 574, edited: true, curve: "easeOutBack" },
          "1467": { value: 469.5, edited: true }
        },
        "style.zIndex": { "0": { value: 10 } },
        "rotation.x": {
          "0": { value: 0, edited: true },
          "1033": { value: 0, edited: true, curve: "easeOutBack" },
          "1467": { value: 0, edited: true }
        },
        "mount.x": { "0": { value: -0.5 } },
        "mount.y": { "0": { value: -0.5 } }
      },
      "haiku:4c0c93b91c0f": {
        stroke: { "0": { value: "none" } },
        "strokeWidth": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fillRule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -30 } },
        "translation.y": { "0": { value: -471 } }
      },
      "haiku:5e4bc7031408": {
        "translation.x": { "0": { value: 18 } },
        "translation.y": { "0": { value: 471 } }
      },
      "haiku:cc7cb4a1fb07": {
        fill: { "0": { value: "#101010" } },
        cx: { "0": { value: "75.8289474" } },
        cy: { "0": { value: "10.7530364" } },
        rx: { "0": { value: "10.7368421" } },
        ry: { "0": { value: "10.7530364" } }
      },
      "haiku:91fa5f6fccb0": {
        fill: { "0": { value: "#101010" } },
        cx: { "0": { value: "28.8552632" } },
        cy: { "0": { value: "10.7530364" } },
        rx: { "0": { value: "10.7368421" } },
        ry: { "0": { value: "10.7530364" } }
      },
      "haiku:026a8424aa8e": {
        "translation.x": { "0": { value: 12.75 } },
        "translation.y": { "0": { value: 1.34 } }
      },
      "haiku:1e045ce0eb13": {
        d: {
          "0": {
            value: "M4.53969969,109.306637 C1.64138146,101.855856 0,93.3600685 0,84.3425113 C0,72.4061264 2.87592352,61.3839523 7.73613872,52.4895212 L7.17790756,33.0126099 C6.6701093,15.2953227 20.6211565,0.52097182 38.3384437,0.0131735551 C38.6448484,0.0043916357 38.9513632,5.6378513e-17 39.2578938,0 C57.0001876,-3.25911173e-15 71.3831586,14.382971 71.3831586,32.1252648 C71.3831586,32.4213987 71.3790639,32.7175184 71.3708757,33.0135391 L70.82949,52.5857699 C75.6579265,61.4634114 78.5131579,72.4491448 78.5131579,84.3425113 C78.5131579,93.3600685 76.8717764,101.855856 73.9734582,109.306637 C74.3332318,112.001882 74.5209634,114.776553 74.5209634,117.609718 C74.5209634,143.591697 58.7325607,164.654252 39.2565789,164.654252 C19.7805972,164.654252 3.99219447,143.591697 3.99219447,117.609718 C3.99219447,114.776553 4.1799261,112.001882 4.53969969,109.306637 Z"
          }
        },
        fill: { "0": { value: "#E8DCD8" } }
      },
      "haiku:34b295a13ca7": {
        d: {
          "0": {
            value: "M4.53969969,109.306637 C1.64138146,101.855856 0,93.3600685 0,84.3425113 C0,72.4061264 2.87592352,61.3839523 7.73613872,52.4895212 L7.17790756,33.0126099 C6.6701093,15.2953227 20.6211565,0.52097182 38.3384437,0.0131735551 C38.6448484,0.0043916357 38.9513632,5.6378513e-17 39.2578938,0 C57.0001876,-3.25911173e-15 71.3831586,14.382971 71.3831586,32.1252648 C71.3831586,32.4213987 71.3790639,32.7175184 71.3708757,33.0135391 L70.82949,52.5857699 C75.6579265,61.4634114 78.5131579,72.4491448 78.5131579,84.3425113 C78.5131579,93.3600685 76.8717764,101.855856 73.9734582,109.306637 C74.3332318,112.001882 74.5209634,114.776553 74.5209634,117.609718 C74.5209634,143.591697 58.7325607,164.654252 39.2565789,164.654252 C19.7805972,164.654252 3.99219447,143.591697 3.99219447,117.609718 C3.99219447,114.776553 4.1799261,112.001882 4.53969969,109.306637 Z"
          }
        },
        fill: { "0": { value: "#F9F9F9" } }
      },
      "haiku:5649d0307c08": {
        d: {
          "0": {
            value: "M70.9216091,52.7558412 C75.694221,61.6035408 78.5131579,72.5249783 78.5131579,84.3425113 C78.5131579,93.3600685 76.8717764,101.855856 73.9734582,109.306637 C74.3332318,112.001882 74.5209634,114.776553 74.5209634,117.609718 C74.5209634,143.591697 58.7325607,164.654252 39.2565789,164.654252 C19.7805972,164.654252 3.99219447,143.591697 3.99219447,117.609718 C3.99219447,115.023004 4.14868589,112.48505 4.44972766,110.011787 C22.6566012,82.7931776 54.8926127,73.9243263 70.9216091,52.7558412 Z"
          }
        },
        fill: { "0": { value: "#FAFAFA" } }
      },
      "haiku:20c119b083b2": {
        d: {
          "0": {
            value: "M64.6517896,150.250758 C58.2373117,159.130374 49.2304986,164.654252 39.2565789,164.654252 C19.7805972,164.654252 3.99219447,143.591697 3.99219447,117.609718 C3.99219447,115.06095 4.14412819,112.559523 4.43657241,110.120675 C19.6336681,128.027151 46.9805379,134.687399 64.6517896,150.250758 Z"
          }
        },
        fill: { "0": { value: "#EFEFEF" } }
      },
      "haiku:4f0f46c2df7a": {
        fill: { "0": { value: "#060606" } },
        cx: { "0": { value: "38.9210526" } },
        cy: { "0": { value: "24.194332" } },
        rx: { "0": { value: "11.4078947" } },
        ry: { "0": { value: "11.4251012" } }
      },
      "haiku:e64c405c9193": {
        fill: { "0": { value: "#060606" } },
        cx: { "0": { value: "65.0921053" } },
        cy: { "0": { value: "24.194332" } },
        rx: { "0": { value: "11.4078947" } },
        ry: { "0": { value: "11.4251012" } }
      },
      "haiku:3ed1deed8b52": {
        "translation.x": { "0": { value: 26.84 } },
        "translation.y": { "0": { value: 8.74 } }
      },
      "haiku:811fe3744cdf": {
        fill: { "0": { value: "#FAC19C" } },
        cx: { "0": { value: "24.4934211" } },
        cy: { "0": { value: "24.5303644" } },
        rx: { "0": { value: "24.4934211" } },
        ry: { "0": { value: "24.5303644" } }
      },
      "haiku:dcb97b7dad80": {
        fill: { "0": { value: "#7F2D31" } },
        "translation.x": { "0": { value: 18.45 } },
        "translation.y": { "0": { value: 30.24 } }
      },
      "haiku:8ded7850c2cf": {
        d: {
          "0": {
            value: "M5.36842105,6.72064777 C8.33331813,6.72064777 10.7368421,4.4639454 10.7368421,1.68016194 C10.7368421,-1.10362151 8.33331813,1.34412955 5.36842105,1.34412955 C2.40352397,1.34412955 0,-1.10362151 0,1.68016194 C0,4.4639454 2.40352397,6.72064777 5.36842105,6.72064777 Z"
          }
        }
      },
      "haiku:c152bd07ddef": {
        d: {
          "0": {
            value: "M9.69671872,4.95461766 C13.8019624,1.84467607 18.9159423,0 24.4601205,0 C32.3803483,0 39.4226263,3.76461953 43.9002722,9.6046322 C43.3196115,9.92231456 42.6558211,10.2073886 41.9089008,10.4598545 C38.5533662,11.5940555 36.0926407,9.80173777 34.5267246,5.08290116 C28.9341668,8.66753669 23.9803312,9.99777253 19.6652179,9.07360868 C16.6849626,8.43533016 13.3621281,7.06233438 9.69671429,4.95462135 Z"
          }
        },
        fill: { "0": { value: "#F7A200" } }
      },
      "haiku:001b5056ddd1": {
        fill: { "0": { value: "#101010" } },
        cx: { "0": { value: "11.4078947" } },
        cy: { "0": { value: "18.8178138" } },
        rx: { "0": { value: "2.68421053" } },
        ry: { "0": { value: "2.68825911" } }
      },
      "haiku:23817813e2e2": {
        fill: { "0": { value: "#101010" } },
        cx: { "0": { value: "36.9078947" } },
        cy: { "0": { value: "18.8178138" } },
        rx: { "0": { value: "2.68421053" } },
        ry: { "0": { value: "2.68825911" } }
      },
      "haiku:e9ae92230960": {
        d: {
          "0": {
            value: "M39.5921053,5.37651822 L46.1813992,5.37651822 C46.1813992,7.26963157 45.1799384,8.76991451 43.1770169,9.87736704 C42.1596895,8.238056 40.9546943,6.72773327 39.5921053,5.37651822 Z"
          }
        },
        fill: { "0": { value: "#F7A200" } }
      },
      "haiku:dc9e146b5195": {
        viewBox: { "0": { value: "0 0 80 36" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 80 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 36 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": { value: 31, edited: true },
          "1467": { value: 31, edited: true }
        },
        "translation.y": {
          "0": { value: 533, edited: true },
          "1467": { value: 533, edited: true }
        },
        "style.zIndex": { "0": { value: 14 } },
        opacity: {
          "0": { value: 0, edited: true },
          "1133": { value: 0, edited: true, curve: "easeInCirc" },
          "1183": { value: 1, edited: true }
        },
        "mount.x": { "0": { value: -0.5 } },
        "mount.y": { "0": { value: -0.5 } }
      },
      "haiku:c64cf8b8f60a": {
        stroke: { "0": { value: "none" } },
        "strokeWidth": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fillRule": { "0": { value: "evenodd" } },
        "translation.x": { "0": { value: -30 } },
        "translation.y": { "0": { value: -532 } }
      },
      "haiku:b320ac849967": {
        fill: { "0": { value: "#000000" } },
        "translation.x": { "0": { value: 30 } },
        "translation.y": { "0": { value: 532 } }
      },
      "haiku:57b2cfd09828": {
        d: {
          "0": {
            value: "M4.7668662,1.30673695 C4.7668662,-2.57533724 1.69831543,18.5933691 25.8631527,16.2884848 C43.1237508,15.9043374 38.5209246,34.3434117 30.4659789,35.4958539 C22.4110331,36.2641486 -10.5758876,38.9531803 4.7668662,1.30673695 Z"
          }
        }
      },
      "haiku:3ca44964ccd4": {
        d: {
          "0": {
            value: "M46.3721294,1.30673695 C46.3721294,-2.57533724 43.3035786,18.5933691 67.4684159,16.2884848 C84.7290139,15.9043374 80.1261878,34.3434117 72.071242,35.4958539 C64.0162963,36.2641486 31.0293755,38.9531803 46.3721294,1.30673695 Z"
          }
        },
        "translation.x": { "0": { value: 121.62 } },
        "rotation.y": { "0": { value: 3.14 } },
        "rotation.z": { "0": { value: 3.14 } },
        "scale.x": { "0": { value: -1 } },
        "scale.y": { "0": { value: -1 } },
        "scale.z": { "0": { value: -1 } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "e4a9e4d8baa7", "haiku-title": "babyphone" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          source: "designs/babyphone.sketch.contents/slices/Rectangle 2.svg",
          "haiku-id": "904e03109c04",
          "haiku-title": "Rectangle 2"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "585e59e0d857", id: "starten" },
            children: [
              {
                elementName: "path",
                attributes: { "haiku-id": "547431671b82", id: "Rectangle-2" },
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
          source: "designs/babyphone.sketch.contents/slices/cloud.svg",
          "haiku-id": "d73bd1daafad",
          "haiku-title": "cloud"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "a27beb399486" },
            children: [
              {
                elementName: "path",
                attributes: { "haiku-id": "ccdf839ae822", id: "path-1-021e2a" },
                children: []
              },
              {
                elementName: "filter",
                attributes: {
                  "haiku-id": "6c901f41e499",
                  id: "filter-2-021e2a-uwftbdh51xs"
                },
                children: [
                  {
                    elementName: "feOffset",
                    attributes: { "haiku-id": "79a5dc9d7692" },
                    children: []
                  },
                  {
                    elementName: "feGaussianBlur",
                    attributes: { "haiku-id": "f55466898036" },
                    children: []
                  },
                  {
                    elementName: "feColorMatrix",
                    attributes: { "haiku-id": "56d8ad6b2914", type: "matrix" },
                    children: []
                  }
                ]
              },
              {
                elementName: "rect",
                attributes: { "haiku-id": "6be91a1b8c18", id: "path-3-021e2a" },
                children: []
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "90591070d02b", id: "starten" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "683c45755d06", id: "cloud" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "ff161a0fbccf",
                      id: "Combined-Shape-Copy-4"
                    },
                    children: [
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-1-021e2a",
                          "haiku-id": "3773a0ca6bcd"
                        },
                        children: []
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-1-021e2a",
                          "haiku-id": "4e8ab94299f2"
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    elementName: "g",
                    attributes: { "haiku-id": "c38e930ff35a", id: "Rectangle" },
                    children: [
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-3-021e2a",
                          "haiku-id": "ec8fab44f787"
                        },
                        children: []
                      },
                      {
                        elementName: "rect",
                        attributes: { "haiku-id": "a5a477b57b84" },
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
          source: "designs/babyphone.sketch.contents/slices/sun.svg",
          "haiku-id": "27892845bdb9",
          "haiku-title": "sun"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "75c6ae1e00c4", id: "starten" },
            children: [
              {
                elementName: "circle",
                attributes: { "haiku-id": "12c8a978ba7e", id: "sun" },
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
          source: "designs/babyphone.sketch.contents/slices/hills.svg",
          "haiku-id": "bf40e73e7fa2",
          "haiku-title": "hills"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "a17d56c742ec", id: "starten" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "bd91401f8a66", id: "hills" },
                children: [
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "2be70a6e8074",
                      id: "Triangle-Copy"
                    },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: { "haiku-id": "f81f537e0f93", id: "Triangle" },
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
          source: "designs/babyphone.sketch.contents/slices/hill-2.svg",
          "haiku-id": "40843fa0886a",
          "haiku-title": "hill-2"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "dbfa557f0709", id: "starten" },
            children: [
              {
                elementName: "path",
                attributes: { "haiku-id": "8af748650572", id: "hill-2" },
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
          source: "designs/babyphone.sketch.contents/slices/cloud2.svg",
          "haiku-id": "5385aad95363",
          "haiku-title": "cloud2"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "884a22ed9eae" },
            children: [
              {
                elementName: "path",
                attributes: { "haiku-id": "08f49f40b350", id: "path-1-efce77" },
                children: []
              },
              {
                elementName: "filter",
                attributes: {
                  "haiku-id": "789684579467",
                  id: "filter-2-efce77-uwftbdh51xs"
                },
                children: [
                  {
                    elementName: "feOffset",
                    attributes: { "haiku-id": "aa6d57e32d9f" },
                    children: []
                  },
                  {
                    elementName: "feGaussianBlur",
                    attributes: { "haiku-id": "ce7ad246833a" },
                    children: []
                  },
                  {
                    elementName: "feColorMatrix",
                    attributes: { "haiku-id": "64201f4994cc", type: "matrix" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "48d276a27b44", id: "starten" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "6b75d1e7db87", id: "cloud2" },
                children: [
                  {
                    elementName: "rect",
                    attributes: {
                      "haiku-id": "be4f70663396",
                      id: "Rectangle-2"
                    },
                    children: []
                  },
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "c5409f33b653",
                      id: "Combined-Shape-Copy-3"
                    },
                    children: [
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-1-efce77",
                          "haiku-id": "3baf3e7406b7"
                        },
                        children: []
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-1-efce77",
                          "haiku-id": "5ae54c475808"
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
          source: "designs/babyphone.sketch.contents/slices/cloud3.svg",
          "haiku-id": "a267f6fd18e6",
          "haiku-title": "cloud3"
        },
        children: [
          {
            elementName: "defs",
            attributes: { "haiku-id": "e79363929356" },
            children: [
              {
                elementName: "path",
                attributes: { "haiku-id": "1b97a80c4fe5", id: "path-1-139f12" },
                children: []
              },
              {
                elementName: "filter",
                attributes: {
                  "haiku-id": "ee58e5b88196",
                  id: "filter-2-139f12-uwftbdh51xs"
                },
                children: [
                  {
                    elementName: "feOffset",
                    attributes: { "haiku-id": "be91f086b4a1" },
                    children: []
                  },
                  {
                    elementName: "feGaussianBlur",
                    attributes: { "haiku-id": "c969513a5a07" },
                    children: []
                  },
                  {
                    elementName: "feColorMatrix",
                    attributes: { "haiku-id": "5d5233320d97", type: "matrix" },
                    children: []
                  }
                ]
              }
            ]
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "25938da2add1", id: "starten" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "496e749c7da6", id: "cloud3" },
                children: [
                  {
                    elementName: "rect",
                    attributes: {
                      "haiku-id": "339dc7585758",
                      id: "Rectangle-3"
                    },
                    children: []
                  },
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "2e7b243ad989",
                      id: "Combined-Shape-Copy"
                    },
                    children: [
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-1-139f12",
                          "haiku-id": "073055e27e3e"
                        },
                        children: []
                      },
                      {
                        elementName: "use",
                        attributes: {
                          "xlink:href": "#path-1-139f12",
                          "haiku-id": "0d4bae79141f"
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
          source: "designs/babyphone.sketch.contents/slices/panda.svg",
          "haiku-id": "fc4ea2a8f760",
          "haiku-title": "panda"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "4c0c93b91c0f", id: "starten" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "5e4bc7031408", id: "panda" },
                children: [
                  {
                    elementName: "g",
                    attributes: {
                      "haiku-id": "b7660964ace6",
                      id: "Group-Copy-3"
                    },
                    children: [
                      {
                        elementName: "ellipse",
                        attributes: {
                          "haiku-id": "cc7cb4a1fb07",
                          id: "Oval-8-Copy"
                        },
                        children: []
                      },
                      {
                        elementName: "ellipse",
                        attributes: {
                          "haiku-id": "91fa5f6fccb0",
                          id: "Oval-8-Copy"
                        },
                        children: []
                      },
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "026a8424aa8e",
                          id: "Group-4"
                        },
                        children: [
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "1e045ce0eb13",
                              id: "Combined-Shape"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "34b295a13ca7",
                              id: "Combined-Shape"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "5649d0307c08",
                              id: "Combined-Shape"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "20c119b083b2",
                              id: "Combined-Shape"
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        elementName: "ellipse",
                        attributes: {
                          "haiku-id": "4f0f46c2df7a",
                          id: "Oval-8-Copy-3"
                        },
                        children: []
                      },
                      {
                        elementName: "ellipse",
                        attributes: {
                          "haiku-id": "e64c405c9193",
                          id: "Oval-8-Copy-3"
                        },
                        children: []
                      },
                      {
                        elementName: "g",
                        attributes: {
                          "haiku-id": "3ed1deed8b52",
                          id: "Group-Copy"
                        },
                        children: [
                          {
                            elementName: "ellipse",
                            attributes: {
                              "haiku-id": "811fe3744cdf",
                              id: "Oval-6-Copy-3"
                            },
                            children: []
                          },
                          {
                            elementName: "g",
                            attributes: {
                              "haiku-id": "dcb97b7dad80",
                              id: "Group-Copy-2"
                            },
                            children: [
                              {
                                elementName: "path",
                                attributes: {
                                  "haiku-id": "8ded7850c2cf",
                                  id: "Oval-8"
                                },
                                children: []
                              }
                            ]
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "c152bd07ddef",
                              id: "Combined-Shape-Copy-2"
                            },
                            children: []
                          },
                          {
                            elementName: "ellipse",
                            attributes: {
                              "haiku-id": "001b5056ddd1",
                              id: "Oval-8-Copy-4"
                            },
                            children: []
                          },
                          {
                            elementName: "ellipse",
                            attributes: {
                              "haiku-id": "23817813e2e2",
                              id: "Oval-8-Copy-5"
                            },
                            children: []
                          },
                          {
                            elementName: "path",
                            attributes: {
                              "haiku-id": "e9ae92230960",
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
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          source: "designs/babyphone.sketch.contents/slices/panda--arms.svg",
          "haiku-id": "dc9e146b5195",
          "haiku-title": "panda--arms"
        },
        children: [
          {
            elementName: "g",
            attributes: { "haiku-id": "c64cf8b8f60a", id: "starten" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "b320ac849967", id: "panda--arms" },
                children: [
                  {
                    elementName: "path",
                    attributes: { "haiku-id": "57b2cfd09828", id: "Path-7" },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: { "haiku-id": "3ca44964ccd4", id: "Path-7" },
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
