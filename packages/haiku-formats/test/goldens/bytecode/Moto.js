var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    relpath: "code/main/code.js",
    type: "haiku",
    name: "Moto",
    uuid: "HAIKU_SHARE_UUID",
    version: "0.0.15",
    organization: "SashaDotCom",
    project: "Moto",
    branch: "master",
    player: "2.3.69",
    core: "3.5.1"
  },
  options: {},
  states: { who: { type: "number", value: 1 } },
  eventHandlers: {},
  timelines: {
    Default: {
      "haiku:cc9a7f1a63bb": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.margin": { "0": { value: "0 auto" } },
        "sizeAbsolute.x": {
          "0": { value: 664, edited: true },
          "17": { value: 664, edited: true }
        },
        "sizeAbsolute.y": {
          "0": { value: 381, edited: true },
          "17": { value: 381, edited: true }
        },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "hidden" } },
        "style.overflowY": { "0": { value: "hidden" } },
        opacity: { "0": { value: 1 }, "7050": { value: 1, edited: true } },
        "style.backgroundColor": {
          "0": { value: "" },
          "7050": { value: "", edited: true }
        }
      },
      "haiku:ec10e8993f6e": {
        "sizeAbsolute.x": { "0": { value: 664 } },
        "sizeAbsolute.y": { "0": { value: 381 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 664 381" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": {
          "0": { value: 0, edited: true },
          "17": { value: 0, edited: true }
        },
        "translation.y": {
          "0": { value: 0, edited: true },
          "17": { value: 0, edited: true }
        },
        "style.zIndex": { "0": { value: 1 } },
        opacity: { "0": { value: 1, edited: true } },
        "offset.x": { "0": { value: 332 } },
        "offset.y": { "0": { value: 190.5 } }
      },
      "haiku:daf9041c2c88": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:852203c86be4": {
        fill: { "0": { value: "#DFC9F8" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 664 } },
        "sizeAbsolute.y": { "0": { value: 381 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:35713d151eb1": {
        "sizeAbsolute.x": { "0": { value: 145 } },
        "sizeAbsolute.y": { "0": { value: 148 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 145 148" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": { "0": { value: 486, edited: true } },
        "translation.y": { "0": { value: 18, edited: true } },
        "style.zIndex": { "0": { value: 2 } },
        "rotation.z": {
          "0": { value: 0, curve: "linear" },
          "6983": { value: -1, edited: true }
        },
        "offset.x": { "0": { value: 72.5 } },
        "offset.y": { "0": { value: 74 } }
      },
      "haiku:1c85cfe5ff2e": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:cc578fa29f11": {
        "translation.x": { "0": { value: 3 } },
        "translation.y": { "0": { value: 0 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "mount.z": { "0": { value: 0 } },
        "offset.x": { "0": { value: 72.5 } },
        "offset.y": { "0": { value: 74 } }
      },
      "haiku:4fbe0b5c2654": {
        fill: { "0": { value: "#55F6E4" } },
        cx: { "0": { value: "69" } },
        cy: { "0": { value: "74" } },
        r: { "0": { value: "36" } }
      },
      "haiku:a265c8f1d444": {
        d: {
          "0": {
            value: "M107.440871,41.1179674 C106.055511,42.466023 103.83964,42.435782 102.491584,41.0504221 C101.143528,39.6650622 101.173769,37.4491911 102.559129,36.1011355 L117.059129,21.991584 C118.444489,20.6435284 120.66036,20.6737695 122.008416,22.0591294 C123.356472,23.4444893 123.326231,25.6603603 121.940871,27.008416 L107.440871,41.1179674 Z M73,23.5 C73,25.4329966 71.4329966,27 69.5,27 C67.5670034,27 66,25.4329966 66,23.5 L66,3.5 C66,1.56700338 67.5670034,0 69.5,0 C71.4329966,0 73,1.56700338 73,3.5 L73,23.5 Z M119,78.1095515 C117.067003,78.1095515 115.5,76.5425481 115.5,74.6095515 C115.5,72.6765548 117.067003,71.1095515 119,71.1095515 L138.5,71.1095515 C140.432997,71.1095515 142,72.6765548 142,74.6095515 C142,76.5425481 140.432997,78.1095515 138.5,78.1095515 L119,78.1095515 Z M102.111886,112.058693 C100.698759,110.739775 100.622388,108.525013 101.941307,107.111886 C103.260225,105.698759 105.474987,105.622388 106.888114,106.941307 L121.888114,120.941307 C123.301241,122.260225 123.377612,124.474987 122.058693,125.888114 C120.739775,127.301241 118.525013,127.377612 117.111886,126.058693 L102.111886,112.058693 Z"
          }
        },
        fill: { "0": { value: "#FFFFFF" } },
        fillRule: { "0": { value: "nonzero" } }
      },
      "haiku:97cfc8a61c7c": {
        d: { "0": { value: "M34.5,38.5 L19.5,24.5" } },
        stroke: { "0": { value: "#FFFFFF" } },
        strokeWidth: { "0": { value: "7" } },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:ee8304c92e35": {
        d: { "0": { value: "M20.5,73.5 L0.5,73.5" } },
        stroke: { "0": { value: "#FFFFFF" } },
        strokeWidth: { "0": { value: "7" } },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:73f76838e799": {
        d: { "0": { value: "M34.5,109.5 L19.5,123.5" } },
        stroke: { "0": { value: "#FFFFFF" } },
        strokeWidth: { "0": { value: "7" } },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:99055fbf8beb": {
        d: { "0": { value: "M69.5,124.5 L69.5,144.5" } },
        stroke: { "0": { value: "#FFFFFF" } },
        strokeWidth: { "0": { value: "7" } },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:5af951a2c3ce": {
        "sizeAbsolute.x": { "0": { value: 1331 } },
        "sizeAbsolute.y": { "0": { value: 203 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 1331 203" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": {
          "0": { value: 0, edited: true },
          "17": { value: 1, edited: true, curve: "linear" },
          "7000": { value: -668, edited: true }
        },
        "translation.y": { "0": { value: 82.5, edited: true } },
        "style.zIndex": { "0": { value: 3 } },
        "offset.x": { "0": { value: 665.5 } },
        "offset.y": { "0": { value: 101.5 } }
      },
      "haiku:768e2bd21912": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:85c5ae036e16": {
        d: {
          "0": {
            value: "M665.147128,99.6241602 L665.147128,98.8483562 L692.472212,123.635077 L766.147919,63.0509165 L836.51989,98.8483562 L906.973405,77.096934 L973.672591,13.8591421 L1011.86085,48.0651044 L1074.20931,0.911285246 L1142.60684,61.9563257 L1181.62324,25.424358 L1222.6992,63.0509165 L1263.4295,43.5571187 L1330.67482,98.8483562 L1330.67482,201.84791 L665.527691,201.84791 L665.527691,202.936624 L0,202.936624 L0,99.937071 L27.3250842,124.723791 L101.000791,64.1396313 L171.372762,99.937071 L241.826277,78.1856487 L308.525463,14.9478569 L346.713719,49.1538192 L409.062187,2 L477.459709,63.0450405 L516.47611,26.5130728 L557.55207,64.1396313 L598.282369,44.6458334 L665.147128,99.6241602 Z"
          }
        },
        fill: { "0": { value: "#CBA4FB" } }
      },
      "haiku:e0643e9fb9fb": {
        "sizeAbsolute.x": { "0": { value: 1875 } },
        "sizeAbsolute.y": { "0": { value: 116 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 1875 116" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": {
          "0": { value: 2, edited: true, curve: "linear" },
          "6983": { value: -1213, edited: true }
        },
        "translation.y": { "0": { value: 170, edited: true } },
        "style.zIndex": { "0": { value: 4 } },
        "offset.x": { "0": { value: 937.5 } },
        "offset.y": { "0": { value: 58 } }
      },
      "haiku:791c2b8fd46e": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:9bc6ec751da2": {
        d: {
          "0": {
            value: "M937.674818,115.468312 L1874.67482,115.468312 L1874.67482,63.9685355 L1861.85821,68.0943948 L1855.5012,46.0698156 L1847.337,72.7689936 L1836.17598,76.3618957 L1831.2916,74.936523 L1825.82931,61.4481725 L1820.6522,71.8317082 L1790.58016,63.056012 L1785.43196,43.3595779 L1779.27132,59.7558411 L1765.48452,55.7325419 L1760.03201,40.1535799 L1754.77626,52.6076336 L1749.31517,51.0139639 L1744.47223,27.9848807 L1737.87533,47.675561 L1732.37285,46.0698156 L1679.86901,55.548046 L1672.13718,36.3229167 L1665.6637,58.1124514 L1658.77977,59.355169 L1652.74011,45.5225202 L1647.18576,61.4481725 L1633.22442,63.9685355 L1601.84361,60.5303199 L1595.90117,38.5769096 L1590.24696,59.2597423 L1583.20867,58.4885965 L1577.11971,41.7271798 L1571.93213,57.2530912 L1566.25858,56.6314726 L1560.99462,32.0752723 L1555.18089,56.6314726 L1533.96111,53.0928244 L1495.50468,40.1535799 L1490.0843,15 L1484.22296,36.3576747 L1474.01381,32.0752723 L1469.43193,19.504891 L1466.19435,30.2916747 L1439.98733,21.4739284 L1433.52541,23.5280103 L1427.75162,7.45935415 L1422.13464,27.1488463 L1415.94365,29.1168057 L1411.04909,15 L1405.63444,32.3938427 L1386.18316,38.5769096 L1361.31626,31.9027502 L1357.23531,15 L1351.65911,29.310814 L1346.71888,27.9848807 L1341.81885,7.45935415 L1335.88139,25.0761475 L1322.45492,21.4725457 L1319.10912,-0.0775794995 L1313.21766,18.9933078 L1298.3392,15 L1268.74251,24.3742607 L1263.34518,9.91596286 L1257.82602,27.8318795 L1237.0349,34.41712 L1231.79841,9.91596286 L1225.73373,37.9965806 L1201.97261,45.5225202 L1198.55305,44.386254 L1195.48478,30.2916747 L1191.80862,42.1451846 L1175.8395,36.8388983 L1173.2057,23.5280103 L1169.72827,34.8082336 L1152.97686,29.2420028 L1148.37361,7.45935415 L1142.3406,28.771751 L1115.88188,37.3729605 L1109.72948,18.9933078 L1103.9239,41.2602648 L1089.12894,46.0698156 L1073.17218,43.3595779 L1067.11837,25.0761475 L1058.98813,40.9504327 L1031.74323,36.3229167 L1022.47137,39.0284 L1017.7771,15 L1011.07921,42.3525801 L996.071754,46.731682 L990.460446,32.0752723 L986.596175,49.4966106 L971.343805,53.9471786 L965.312094,40.1535799 L959.884635,57.2909092 L937,63.9685355 L937,64.2633492 L924.858214,68.1719743 L918.501202,46.1473951 L910.337001,72.8465731 L899.175979,76.4394752 L894.291595,75.0141025 L888.829306,61.525752 L883.652198,71.9092877 L853.580156,63.1335915 L848.431959,43.4371574 L842.271324,59.8334206 L828.484517,55.8101214 L823.032013,40.2311594 L817.776264,52.6852131 L812.315171,51.0915434 L807.472229,28.0624602 L800.875327,47.7531405 L795.372853,46.1473951 L742.869005,55.6256255 L735.137175,36.4004962 L728.663701,58.1900309 L721.779773,59.4327485 L715.740107,45.6000997 L710.185759,61.525752 L696.224423,64.046115 L664.843607,60.6078994 L658.901165,38.6544891 L653.246963,59.3373218 L646.208666,58.566176 L640.119711,41.8047593 L634.93213,57.3306707 L629.258576,56.7090521 L623.99462,32.1528518 L618.180885,56.7090521 L596.961105,53.1704039 L558.504683,40.2311594 L553.084299,15.0775795 L547.222964,36.4352542 L537.013812,32.1528518 L532.431928,19.5824705 L529.194349,30.3692542 L502.987334,21.5515079 L496.525409,23.6055898 L490.751623,7.53693365 L485.134642,27.2264258 L478.943649,29.1943852 L474.049089,15.0775795 L468.634437,32.4714222 L449.183162,38.6544891 L424.316265,31.9803297 L420.235309,15.0775795 L414.659106,29.3883935 L409.718882,28.0624602 L404.818854,7.53693365 L398.881386,25.153727 L385.454917,21.5501252 L382.109124,0 L376.217656,19.0708873 L361.339201,15.0775795 L331.742512,24.4518402 L326.345183,9.99354236 L320.826018,27.909459 L300.034905,34.4946995 L294.798406,9.99354236 L288.733728,38.0741601 L264.972612,45.6000997 L261.553051,44.4638335 L258.484779,30.3692542 L254.808616,42.2227641 L238.839497,36.9164778 L236.205703,23.6055898 L232.72827,34.8858131 L215.976856,29.3195823 L211.373612,7.53693365 L205.340604,28.8493305 L178.881881,37.45054 L172.729475,19.0708873 L166.9239,41.3378443 L152.128938,46.1473951 L136.17218,43.4371574 L130.118365,25.153727 L121.98813,41.0280122 L94.743232,36.4004962 L85.4713745,39.1059795 L80.7771009,15.0775795 L74.0792054,42.4301596 L59.0717544,46.8092615 L53.4604463,32.1528518 L49.5961746,49.5741901 L34.3438051,54.0247581 L28.3120945,40.2311594 L22.8846351,57.3684887 L0,64.046115 L0,115.545892 L937.674818,115.545892 L937.674818,115.468312 Z"
          }
        },
        fill: { "0": { value: "#BA8EEF" } }
      },
      "haiku:50be8b8d8d68": {
        "sizeAbsolute.x": { "0": { value: 71 } },
        "sizeAbsolute.y": { "0": { value: 61 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 71 61" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": {
          "0": { value: -98, edited: true, curve: "easeOutBack" },
          "983": { value: 157, edited: true },
          "1433": { value: 157, edited: true, curve: "easeInOutBack" },
          "2533": { value: 296, edited: true },
          "2900": { value: 296, edited: true, curve: "easeInOutBack" },
          "4550": { value: 535, edited: true },
          "4567": { value: 535, edited: true, curve: "easeOutCubic" },
          "5833": { value: 462, edited: true, curve: "easeInOutCubic" },
          "7000": { value: 684, edited: true }
        },
        "translation.y": {
          "0": { value: 306.5, edited: true },
          "33": { value: 304.5, edited: true },
          "1533": { value: 304.5, edited: true, curve: "easeInOutCirc" },
          "2183": { value: 298.5, edited: true }
        },
        "style.zIndex": { "0": { value: 5 } },
        "rotation.z": {
          "0": { value: 0 },
          "1100": {
            value: -0.012986282920172343,
            edited: true,
            curve: "easeInOutCubic"
          },
          "1283": {
            value: -0.16216698249270012,
            edited: true,
            curve: "easeOutBounce"
          },
          "1517": { value: 0.009676937583457335, edited: true },
          "2683": {
            value: -0.021119970034216617,
            edited: true,
            curve: "easeInOutCubic"
          },
          "2867": {
            value: -0.35544847744314145,
            edited: true,
            curve: "easeOutBounce"
          },
          "3067": { value: -0.012164296566126165, edited: true }
        },
        "offset.x": { "0": { value: 35.5 } },
        "offset.y": { "0": { value: 30.5 } }
      },
      "haiku:c4c209968eb1": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:b80fbb265e17": {
        "translation.x": { "0": { value: 2 } },
        "translation.y": { "0": { value: 0 } },
        "origin.x": { "0": { value: 0.5 } },
        "origin.y": { "0": { value: 0.5 } },
        "mount.z": { "0": { value: 0 } },
        "offset.x": { "0": { value: 35.5 } },
        "offset.y": { "0": { value: 30.5 } }
      },
      "haiku:9fc3f3d15a2a": {
        stroke: { "0": { value: "#59429B" } },
        strokeWidth: { "0": { value: "4" } },
        fill: { "0": { value: "#FFFFFF" } },
        cx: { "0": { value: "9" } },
        cy: { "0": { value: "50" } },
        r: { "0": { value: "9" } }
      },
      "haiku:9837d3e87f6c": {
        stroke: { "0": { value: "#59429B" } },
        strokeWidth: { "0": { value: "4" } },
        fill: { "0": { value: "#FFFFFF" } },
        cx: { "0": { value: "58" } },
        cy: { "0": { value: "50" } },
        r: { "0": { value: "9" } }
      },
      "haiku:89693021ef05": {
        d: {
          "0": {
            value: "M19.6286214,36.3727324 L3.41352075,36.5014089 C3.41352075,36.5014089 3.061071,27.8457241 7.63362116,27.8457241 C12.2061713,27.8457241 16.0189249,27.9641048 16.0189249,27.9641048 L24.850433,48.4675004 L35.9602073,48.4675004 L54.8806322,35.5570706 L51.8689241,22.6396002 L58.5601129,50.7933788"
          }
        },
        stroke: { "0": { value: "#59429B" } },
        strokeWidth: { "0": { value: "3" } },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:dc1ddefa5f17": {
        d: {
          "0": {
            value: "M60.7349356,36.3758027 C60.7349356,36.3758027 64.3082232,31.0366595 59.6103627,26.4500314 C56.4387969,24.5015553 56.556144,36.3758027 56.556144,36.3758027 L60.7349356,36.3758027 Z"
          }
        },
        stroke: { "0": { value: "#59429B" } },
        strokeWidth: { "0": { value: "3" } },
        fill: { "0": { value: "#FFFFFF" } },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:30c414713ccc": {
        d: {
          "0": {
            value: "M34.9332199,35.965405 C34.9332199,35.965405 33.0627641,28.4067059 42.143556,28.2319356 C51.2243479,28.0571653 52.8679394,28.2319356 52.8679394,28.2319356"
          }
        },
        stroke: { "0": { value: "#59429B" } },
        strokeWidth: { "0": { value: "3" } },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:8bafc8a19e9e": {
        d: { "0": { value: "M19.0854036,36.4110749 L54.6066758,36.1347184" } },
        stroke: { "0": { value: "#59429B" } },
        strokeWidth: { "0": { value: "3" } },
        strokeLinecap: { "0": { value: "round" } }
      },
      "haiku:356cbc45061b": {
        d: {
          "0": {
            value: "M26.1267,14.5377037 C20.7970325,28.0774853 19.7547581,27.6047024 20.2890058,31.9585167 C20.8232535,36.312331 27.8520112,33.7894637 32.4465542,38.1084244 C37.0410971,42.4273852 43.1837858,46.4358362 43.1837858,46.4358362 L48.4273776,41.8578583 C48.4273776,41.8578583 47.3066362,38.4013516 45.245211,40.129605 C43.1837858,41.8578583 34.4204257,29.8768611 32.8703608,29.3655859 C31.320296,28.8543107 34.4361399,20.4712709 34.4361399,18.8640727 C34.4361399,17.2568744 41.8502586,23.1151984 46.8529435,24.0822022 C51.8556285,25.049206 53.5814747,23.5915694 53.5814747,23.5915694 C53.5814747,23.5915694 54.8440014,21.4445314 52.3511072,21.1975815 C49.858213,20.9506316 48.3163343,23.9547426 37.4987511,15.2373261 C35.1749975,12.7463732 36.2759295,10.035068 36.2759295,10.035068 C36.2759295,10.035068 37.372242,7.37134488 37.6232428,6.7550374 C37.8742436,6.13872992 29.7409761,7.00437862 29.7409761,7.00437862 C29.7409761,7.00437862 27.6240501,10.2683232 26.1267,14.5377037 Z"
          }
        },
        fill: { "0": { value: "#BA8EEF" } }
      },
      "haiku:0dd1373d913a": {
        d: {
          "0": {
            value: "M39,5.5 C39,2.46243388 36.5375661,0 33.5,0 C30.4624339,0 28,2.46243388 28,5.5 C28,5.83897896 26.8049302,5.85281632 24.4877236,6.83997698 C22.5745494,7.65501447 20.9814487,8.9810681 25.1754107,8.27147963 C26.3937487,8.06534553 27.3916154,7.82311623 29.445493,7.42540577 C32.8112146,6.77367139 39,7.83741036 39,5.5 Z"
          }
        },
        fill: { "0": { value: "#E97897" } }
      },
      "haiku:6a966ddb2cb4": {
        "sizeAbsolute.x": { "0": { value: 79 } },
        "sizeAbsolute.y": { "0": { value: 14 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 79 14" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": {
          "0": { value: 62, edited: true, curve: "easeInOutCubic" },
          "1683": { value: 76, edited: true, curve: "easeOutCubic" },
          "4083": { value: 97, edited: true, curve: "easeInOutCubic" },
          "7000": { value: 62, edited: true }
        },
        "translation.y": {
          "0": { value: 75, edited: true, curve: "easeInOutCirc" },
          "1683": { value: 54.5, edited: true, curve: "easeInOutCirc" },
          "7000": { value: 75, edited: true }
        },
        "style.zIndex": { "0": { value: 6 } },
        "offset.x": { "0": { value: 39.5 } },
        "offset.y": { "0": { value: 7 } }
      },
      "haiku:c4d620a11658": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:15af37aae4b3": {
        fill: { "0": { value: "#FFFFFF" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 79 } },
        "sizeAbsolute.y": { "0": { value: 14 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        rx: { "0": { value: "7" } }
      },
      "haiku:0c56a63783da": {
        "sizeAbsolute.x": { "0": { value: 79 } },
        "sizeAbsolute.y": { "0": { value: 14 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 79 14" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": {
          "0": { value: 185, edited: true, curve: "easeInOutCubic" },
          "2433": { value: 210.993354645002, edited: true },
          "2533": { value: 212, edited: true, curve: "easeInOutCubic" },
          "4800": { value: 218, edited: true, curve: "easeInOutCubic" },
          "6983": { value: 189, edited: true },
          "7050": { value: 185, edited: true }
        },
        "translation.y": {
          "0": { value: 85, edited: true, curve: "easeInOutCubic" },
          "2533": { value: 62.5, edited: true, curve: "easeInOutCubic" },
          "4750": { value: 85.5, edited: true, curve: "easeInOutCubic" },
          "7050": { value: 85, edited: true }
        },
        "style.zIndex": { "0": { value: 7 } },
        "scale.x": { "0": { value: 1.1772151898734171, edited: true } },
        "scale.y": { "0": { value: 1.1428571428571428, edited: true } },
        "offset.x": { "0": { value: 39.5 } },
        "offset.y": { "0": { value: 7 } }
      },
      "haiku:011f1eec29ff": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } }
      },
      "haiku:20b916f458e7": {
        fill: { "0": { value: "#FFFFFF" } },
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 79 } },
        "sizeAbsolute.y": { "0": { value: 14 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        rx: { "0": { value: "7" } }
      },
      "haiku:e33a15bfe59f": {
        "sizeAbsolute.x": { "0": { value: 14 } },
        "sizeAbsolute.y": { "0": { value: 14 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 14 14" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": {
          "0": { value: 152.5, edited: true },
          "1300": { value: 149, edited: true, curve: "easeInOutCubic" },
          "1550": { value: 80, edited: true }
        },
        "translation.y": {
          "0": { value: 344, edited: true },
          "1300": { value: 344, edited: true, curve: "easeOutCirc" },
          "1550": { value: 320, edited: true }
        },
        "style.zIndex": { "0": { value: 8 } },
        opacity: {
          "0": { value: 0, edited: true },
          "1300": { value: 1, edited: true },
          "1417": { value: 1, edited: true, curve: "linear" },
          "1550": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1 },
          "1300": { value: 0.1, edited: true, curve: "linear" },
          "1550": { value: 1.7, edited: true }
        },
        "scale.y": {
          "0": { value: 1 },
          "1300": { value: 0.1, edited: true, curve: "linear" },
          "1550": { value: 1.7, edited: true }
        },
        "offset.x": { "0": { value: 7 } },
        "offset.y": { "0": { value: 7 } }
      },
      "haiku:eb8a4845c4ba": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } },
        fillOpacity: { "0": { value: "0.669999957" } }
      },
      "haiku:b4f4ac642e60": {
        fill: { "0": { value: "#FFFFFF" } },
        cx: { "0": { value: "7" } },
        cy: { "0": { value: "7" } },
        r: { "0": { value: "7" } }
      },
      "haiku:ba90c216517a": {
        "sizeAbsolute.x": { "0": { value: 14 } },
        "sizeAbsolute.y": { "0": { value: 14 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 14 14" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": { "0": { value: 331.9375, edited: true } },
        "translation.y": { "0": { value: 678.5703125, edited: true } },
        "style.zIndex": { "0": { value: 9 } },
        "offset.x": { "0": { value: 7 } },
        "offset.y": { "0": { value: 7 } }
      },
      "haiku:38aa78c8a5b1": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } },
        fillOpacity: { "0": { value: "0.669999957" } }
      },
      "haiku:278b306c2b69": {
        fill: { "0": { value: "#FFFFFF" } },
        cx: { "0": { value: "7" } },
        cy: { "0": { value: "7" } },
        r: { "0": { value: "7" } }
      },
      "haiku:f0cbd1e72e50": {
        "sizeAbsolute.x": { "0": { value: 14 } },
        "sizeAbsolute.y": { "0": { value: 14 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        viewBox: { "0": { value: "0 0 14 14" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "translation.x": {
          "0": { value: 100, edited: true },
          "1383": { value: 147.5, edited: true, curve: "easeInOutCubic" },
          "1500": { value: 110, edited: true }
        },
        "translation.y": {
          "0": { value: 310, edited: true },
          "1383": { value: 340, edited: true, curve: "easeInOutCubic" },
          "1550": { value: 323, edited: true }
        },
        "style.zIndex": { "0": { value: 10 } },
        opacity: {
          "0": { value: 0, edited: true },
          "1383": { value: 1, edited: true },
          "1417": { value: 1, edited: true, curve: "linear" },
          "1550": { value: 0, edited: true }
        },
        "scale.x": {
          "0": { value: 1 },
          "1383": { value: 0.1, edited: true, curve: "linear" },
          "1550": { value: 2.7, edited: true }
        },
        "scale.y": {
          "0": { value: 1 },
          "1383": { value: 0.1, edited: true, curve: "linear" },
          "1550": { value: 2.7, edited: true }
        },
        "offset.x": { "0": { value: 7 } },
        "offset.y": { "0": { value: 7 } }
      },
      "haiku:2eb8ffff1840": {
        stroke: { "0": { value: "none" } },
        strokeWidth: { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        fillRule: { "0": { value: "evenodd" } },
        fillOpacity: { "0": { value: "0.669999957" } }
      },
      "haiku:c9d27570d5a6": {
        fill: { "0": { value: "#FFFFFF" } },
        cx: { "0": { value: "7" } },
        cy: { "0": { value: "7" } },
        r: { "0": { value: "7" } }
      },
      "haiku:7c2d8c40b8ae": { content: { "0": { value: "bg" } } },
      "haiku:517395892f58": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:e6ab3d96bea9": { content: { "0": { value: "sun" } } },
      "haiku:e22de510efbf": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:d9e4d53f262e": { content: { "0": { value: "mountain-range" } } },
      "haiku:e0f7f2f50b2a": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:7ef163049af5": { content: { "0": { value: "tree-range" } } },
      "haiku:9c68d2ef772b": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:60810a72f807": { content: { "0": { value: "moto" } } },
      "haiku:3f79879c812c": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:34c8fd93d17b": { content: { "0": { value: "goodCLoud" } } },
      "haiku:5376117a1e9d": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:7873166e3baa": { content: { "0": { value: "goodCLoud" } } },
      "haiku:56d3486a89dd": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:b4b855a7cd20": { content: { "0": { value: "smoke" } } },
      "haiku:cde5b1b4a453": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:db51c57e9399": { content: { "0": { value: "smoke" } } },
      "haiku:5a0fc80d07e3": {
        content: { "0": { value: "Created with sketchtool." } }
      },
      "haiku:31fd6451abfa": { content: { "0": { value: "smoke" } } },
      "haiku:73034d6b5a5a": {
        content: { "0": { value: "Created with sketchtool." } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "cc9a7f1a63bb", "haiku-title": "Moto" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "ec10e8993f6e",
          "haiku-title": "bg",
          "haiku-source": "designs/moto-mountains.sketch.contents/slices/bg.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "7c2d8c40b8ae" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "517395892f58"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "6681cc6c00b7" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "daf9041c2c88", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "852203c86be4", id: "bg" },
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
          "haiku-id": "35713d151eb1",
          "haiku-title": "sun",
          "haiku-source": "designs/moto-mountains.sketch.contents/slices/sun.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "e6ab3d96bea9" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "e22de510efbf"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "06f3faf4f4e9" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "1c85cfe5ff2e", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "cc578fa29f11", id: "sun" },
                children: [
                  {
                    elementName: "circle",
                    attributes: { "haiku-id": "4fbe0b5c2654", id: "Oval" },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "a265c8f1d444",
                      id: "Combined-Shape"
                    },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: { "haiku-id": "97cfc8a61c7c", id: "Line" },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: { "haiku-id": "ee8304c92e35", id: "Line-Copy" },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "73f76838e799",
                      id: "Line-Copy-2"
                    },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: {
                      "haiku-id": "99055fbf8beb",
                      id: "Line-Copy-3"
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
          "haiku-id": "5af951a2c3ce",
          "haiku-title": "mountain-range",
          "haiku-source": "designs/moto-mountains.sketch.contents/slices/mountain-range.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "d9e4d53f262e" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "e0f7f2f50b2a"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "7d8bcfb4ae5b" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "768e2bd21912", id: "Page-1" },
            children: [
              {
                elementName: "path",
                attributes: {
                  "haiku-id": "85c5ae036e16",
                  id: "mountain-range"
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
          "haiku-id": "e0643e9fb9fb",
          "haiku-title": "tree-range",
          "haiku-source": "designs/moto-mountains.sketch.contents/slices/tree-range.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "7ef163049af5" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "9c68d2ef772b"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "93b70af0ba7c" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "791c2b8fd46e", id: "Page-1" },
            children: [
              {
                elementName: "path",
                attributes: { "haiku-id": "9bc6ec751da2", id: "tree-range" },
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
          "haiku-id": "50be8b8d8d68",
          "haiku-title": "moto",
          "haiku-source": "designs/moto-mountains.sketch.contents/slices/moto.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "60810a72f807" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "3f79879c812c"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "c83b46312d99" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "c4c209968eb1", id: "Page-1" },
            children: [
              {
                elementName: "g",
                attributes: { "haiku-id": "b80fbb265e17", id: "moto" },
                children: [
                  {
                    elementName: "circle",
                    attributes: { "haiku-id": "9fc3f3d15a2a", id: "Oval-3" },
                    children: []
                  },
                  {
                    elementName: "circle",
                    attributes: {
                      "haiku-id": "9837d3e87f6c",
                      id: "Oval-3-Copy"
                    },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: { "haiku-id": "89693021ef05", id: "Path-2" },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: { "haiku-id": "dc1ddefa5f17", id: "Path-4" },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: { "haiku-id": "30c414713ccc", id: "Path-5" },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: { "haiku-id": "8bafc8a19e9e", id: "Path-6" },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: { "haiku-id": "356cbc45061b", id: "Path-7" },
                    children: []
                  },
                  {
                    elementName: "path",
                    attributes: { "haiku-id": "0dd1373d913a", id: "Oval-4" },
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
          "haiku-id": "6a966ddb2cb4",
          "haiku-title": "goodCLoud",
          "haiku-source": "designs/moto-mountains.sketch.contents/slices/goodCLoud.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "34c8fd93d17b" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "5376117a1e9d"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "c5a666a0afff" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "c4d620a11658", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "15af37aae4b3", id: "goodCLoud" },
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
          "haiku-id": "0c56a63783da",
          "haiku-title": "goodCLoud",
          "haiku-source": "designs/moto-mountains.sketch.contents/slices/goodCLoud.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "7873166e3baa" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "56d3486a89dd"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "c6486f2bb6ed" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "011f1eec29ff", id: "Page-1" },
            children: [
              {
                elementName: "rect",
                attributes: { "haiku-id": "20b916f458e7", id: "goodCLoud" },
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
          "haiku-id": "e33a15bfe59f",
          "haiku-title": "smoke",
          "haiku-source": "designs/moto-mountains.sketch.contents/slices/smoke.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "b4b855a7cd20" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "cde5b1b4a453"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "33bffbe0e1c8" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "eb8a4845c4ba", id: "Page-1" },
            children: [
              {
                elementName: "circle",
                attributes: { "haiku-id": "b4f4ac642e60", id: "smoke" },
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
          "haiku-id": "ba90c216517a",
          "haiku-title": "smoke",
          "haiku-source": "designs/moto-mountains.sketch.contents/slices/smoke.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "db51c57e9399" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "5a0fc80d07e3"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "8258c6317cf8" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "38aa78c8a5b1", id: "Page-1" },
            children: [
              {
                elementName: "circle",
                attributes: { "haiku-id": "278b306c2b69", id: "smoke" },
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
          "haiku-id": "f0cbd1e72e50",
          "haiku-title": "smoke",
          "haiku-source": "designs/moto-mountains.sketch.contents/slices/smoke.svg"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "31fd6451abfa" },
            children: []
          },
          {
            elementName: "desc",
            attributes: {
              content: "Created with sketchtool.",
              "haiku-id": "73034d6b5a5a"
            },
            children: []
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "70065cd947b8" },
            children: []
          },
          {
            elementName: "g",
            attributes: { "haiku-id": "2eb8ffff1840", id: "Page-1" },
            children: [
              {
                elementName: "circle",
                attributes: { "haiku-id": "c9d27570d5a6", id: "smoke" },
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
};
