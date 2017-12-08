module.exports = {
  metadata: {
    uuid: 'HAIKU_SHARE_UUID',
    type: 'haiku',
    name: 'Move',
    relpath: 'bytecode.js',
    version: '0.0.1',
    organization: 'Template',
    project: 'Move',
    branch: 'master',
    player: '2.0.132'
  },

  options: {},
  properties: [],
  eventHandlers: [],
  timelines: {
    Default: {
      'haiku:91083482b04d': {
        'style.WebkitTapHighlightColor': { '0': { value: 'rgba(0,0,0,0)' } },
        'style.position': { '0': { value: 'relative' } },
        'style.overflowX': { '0': { value: 'hidden' } },
        'style.overflowY': { '0': { value: 'hidden' } },
        'sizeAbsolute.x': { '0': { value: 550 } },
        'sizeAbsolute.y': { '0': { value: 400 } },
        'sizeMode.x': { '0': { value: 1 } },
        'sizeMode.y': { '0': { value: 1 } },
        'sizeMode.z': { '0': { value: 1 } },
        backgroundColor: { '0': { value: 'rgb(29, 55, 67)', edited: true } },
        opacity: { '0': { value: 1 }, '17': { value: 1, edited: true } }
      },
      'haiku:5bfd10a365ed': {
        viewBox: { '0': { value: '0 0 56 56' } },
        'style.position': { '0': { value: 'absolute' } },
        'style.margin': { '0': { value: '0' } },
        'style.padding': { '0': { value: '0' } },
        'style.border': { '0': { value: '0' } },
        'sizeAbsolute.x': { '0': { value: 56 } },
        'sizeMode.x': { '0': { value: 1 } },
        'sizeAbsolute.y': { '0': { value: 56 } },
        'sizeMode.y': { '0': { value: 1 } },
        'translation.x': {
          '0': { value: 554, edited: true, curve: 'linear' },
          '750': { value: 221, edited: true, curve: 'easeInOutCubic' },
          '883': { value: 228, edited: true },
          '1833': { value: 228, edited: true, curve: 'easeInBack' },
          '2250': { value: 622, edited: true }
        },
        'translation.y': {
          '0': { value: 14.5, edited: true, curve: 'easeOutBounce' },
          '750': { value: 170, edited: true }
        },
        'style.zIndex': { '0': { value: 1 } },
        'scale.x': {
          '0': { value: 1 },
          '250': { value: 1, edited: true, curve: 'easeOutCubic' },
          '267': { value: 1.4, edited: true, curve: 'easeInCubic' },
          '300': { value: 1, edited: true },
          '517': { value: 1, edited: true, curve: 'easeOutCubic' },
          '550': { value: 1.2, edited: true, curve: 'easeInCubic' },
          '583': { value: 1, edited: true }
        },
        'scale.y': {
          '0': { value: 1 },
          '250': { value: 1, edited: true, curve: 'easeOutCubic' },
          '267': { value: 0.6, edited: true, curve: 'easeInCubic' },
          '300': { value: 1, edited: true },
          '517': { value: 1, edited: true, curve: 'easeOutCubic' },
          '550': { value: 0.8, edited: true, curve: 'easeInCubic' },
          '583': { value: 1, edited: true }
        },
        'rotation.z': {
          '0': { value: 0, curve: 'linear' },
          '267': { value: -3.14, edited: true, curve: 'linear' },
          '550': {
            value: function () {
              return -3.14 * 2
            },
            edited: true,
            curve: 'easeOutCubic'
          },
          '750': { value: -9.7, edited: true, curve: 'easeInOutCubic' },
          '883': { value: -9.42, edited: true },
          '1833': { value: 0, edited: true, curve: 'easeInOutSine' },
          '1983': { value: -0.1, edited: true, curve: 'easeInSine' },
          '2083': { value: 0, edited: true }
        }
      },
      'haiku:5b213ab9bbdf': {
        stroke: { '0': { value: 'none' } },
        'stroke-width': { '0': { value: '1' } },
        fill: { '0': { value: 'none' } },
        'fill-rule': { '0': { value: 'evenodd' } }
      },
      'haiku:f381da39280d': {
        fill: { '0': { value: '#FFFFFF' } },
        'translation.x': { '0': { value: -216 } },
        'translation.y': { '0': { value: -156 } }
      },
      'haiku:23962fd3e6f7': {
        d: {
          '0': {
            value: 'M264.143,163.399 C268.981024,168.291691 271.4,175.138623 271.4,183.94 C271.4,192.741377 268.981024,199.588309 264.143,204.481 C259.304976,209.373691 252.567377,211.82 243.93,211.82 C238.244638,211.82 233.338354,210.726678 229.211,208.54 C225.083646,206.353322 221.913011,203.169021 219.699,198.987 C217.484989,194.804979 216.378,189.789363 216.378,183.94 C216.378,178.090637 217.484989,173.075021 219.699,168.893 C221.913011,164.710979 225.083646,161.526678 229.211,159.34 C233.338354,157.153322 238.244638,156.06 243.93,156.06 C252.567377,156.06 259.304976,158.506309 264.143,163.399 Z M237.821,173.649 C236.536327,175.808344 235.894,179.238643 235.894,183.94 C235.894,188.641357 236.536327,192.071656 237.821,194.231 C239.105673,196.390344 241.141986,197.47 243.93,197.47 C246.718014,197.47 248.74066,196.390344 249.998,194.231 C251.25534,192.071656 251.884,188.641357 251.884,183.94 C251.884,179.238643 251.25534,175.808344 249.998,173.649 C248.74066,171.489656 246.718014,170.41 243.93,170.41 C241.141986,170.41 239.105673,171.489656 237.821,173.649 Z'
          }
        }
      },
      'haiku:676aa843ca1c': {
        viewBox: { '0': { value: '0 0 70 55' } },
        'style.position': { '0': { value: 'absolute' } },
        'style.margin': { '0': { value: '0' } },
        'style.padding': { '0': { value: '0' } },
        'style.border': { '0': { value: '0' } },
        'sizeAbsolute.x': { '0': { value: 70 } },
        'sizeMode.x': { '0': { value: 1 } },
        'sizeAbsolute.y': { '0': { value: 55 } },
        'sizeMode.y': { '0': { value: 1 } },
        'translation.x': {
          '0': { value: 110, edited: true },
          '750': { value: 147, edited: true },
          '1883': { value: 147, edited: true, curve: 'easeInBack' },
          '2300': { value: 615, edited: true }
        },
        'translation.y': {
          '0': { value: 162, edited: true },
          '750': { value: 170, edited: true }
        },
        'style.zIndex': { '0': { value: 3 } },
        opacity: {
          '0': { value: 0, edited: true },
          '750': { value: 1, edited: true }
        },
        'scale.x': {
          '0': { value: 1 },
          '750': { value: 0.1, edited: true, curve: 'easeOutBack' },
          '1000': { value: 1, edited: true }
        },
        'scale.y': {
          '0': { value: 1 },
          '750': { value: 0.1, edited: true, curve: 'easeOutBack' },
          '1000': { value: 1, edited: true }
        },
        'rotation.z': {
          '0': { value: 0 },
          '1883': { value: 0, edited: true, curve: 'easeInOutSine' },
          '2033': { value: -0.1, edited: true, curve: 'easeInSine' },
          '2133': { value: 0, edited: true }
        }
      },
      'haiku:c2569068439f': {
        stroke: { '0': { value: 'none' } },
        'stroke-width': { '0': { value: '1' } },
        fill: { '0': { value: 'none' } },
        'fill-rule': { '0': { value: 'evenodd' } }
      },
      'haiku:7567dd09dbf7': {
        fill: { '0': { value: '#FFFFFF' } },
        'translation.x': { '0': { value: -140 } },
        'translation.y': { '0': { value: -156 } }
      },
      'haiku:cbb866760178': {
        points: {
          '0': {
            value: '209.636 211 192.99 211 192.99 192.222 193.236 174.018 192.99 174.018 182.494 211 167.242 211 156.91 174.018 156.582 174.018 156.828 192.222 156.828 211 140.1 211 140.1 156.88 166.832 156.88 173.064 180.906 175.442 190.992 175.606 190.992 177.984 180.906 184.216 156.88 209.636 156.88'
          }
        }
      },
      'haiku:0802a4738af0': {
        viewBox: { '0': { value: '0 0 60 55' } },
        'style.position': { '0': { value: 'absolute' } },
        'style.margin': { '0': { value: '0' } },
        'style.padding': { '0': { value: '0' } },
        'style.border': { '0': { value: '0' } },
        'sizeAbsolute.x': { '0': { value: 60 } },
        'sizeMode.x': { '0': { value: 1 } },
        'sizeAbsolute.y': { '0': { value: 55 } },
        'sizeMode.y': { '0': { value: 1 } },
        'translation.x': {
          '0': { value: 324, edited: true },
          '750': { value: 288, edited: true },
          '1783': { value: 288, edited: true, curve: 'easeInBack' },
          '2200': { value: 616, edited: true }
        },
        'translation.y': {
          '0': { value: 175, edited: true },
          '750': { value: 168, edited: true }
        },
        'style.zIndex': { '0': { value: 5 } },
        'scale.x': {
          '0': { value: 1 },
          '883': { value: 0.1, edited: true, curve: 'easeOutBack' },
          '1133': { value: 1, edited: true }
        },
        'scale.y': {
          '0': { value: 1 },
          '883': { value: 0.1, edited: true, curve: 'easeOutBack' },
          '1133': { value: 1, edited: true }
        },
        opacity: {
          '0': { value: 0, edited: true },
          '883': { value: 1, edited: true }
        },
        'rotation.z': {
          '0': { value: 0 },
          '1783': { value: 0, edited: true, curve: 'easeInOutSine' },
          '1933': { value: -0.1, edited: true, curve: 'easeInSine' },
          '2033': { value: 0, edited: true }
        }
      },
      'haiku:129389353e52': {
        stroke: { '0': { value: 'none' } },
        'stroke-width': { '0': { value: '1' } },
        fill: { '0': { value: 'none' } },
        'fill-rule': { '0': { value: 'evenodd' } }
      },
      'haiku:f22dc401e7ab': {
        fill: { '0': { value: '#FFFFFF' } },
        'translation.x': { '0': { value: -273 } },
        'translation.y': { '0': { value: -156 } }
      },
      'haiku:420e630b3df4': {
        points: {
          '0': {
            value: '314.344 211 291.63 211 273.344 156.88 293.27 156.88 300.732 186.482 303.356 197.06 305.816 186.646 313.442 156.88 332.63 156.88'
          }
        }
      },
      'haiku:c8d0231b6708': {
        viewBox: { '0': { value: '0 0 47 55' } },
        'style.position': { '0': { value: 'absolute' } },
        'style.margin': { '0': { value: '0' } },
        'style.padding': { '0': { value: '0' } },
        'style.border': { '0': { value: '0' } },
        'sizeAbsolute.x': { '0': { value: 47 } },
        'sizeMode.x': { '0': { value: 1 } },
        'sizeAbsolute.y': { '0': { value: 55 } },
        'sizeMode.y': { '0': { value: 1 } },
        'translation.x': {
          '0': { value: 409.5, edited: true },
          '750': { value: 355.5, edited: true },
          '1733': { value: 355.5, edited: true, curve: 'easeInBack' },
          '2150': { value: 626.5, edited: true }
        },
        'translation.y': {
          '0': { value: 165, edited: true },
          '750': { value: 168, edited: true }
        },
        'style.zIndex': { '0': { value: 6 } },
        'scale.x': {
          '0': { value: 1 },
          '1017': { value: 0.1, edited: true, curve: 'easeOutBack' },
          '1267': { value: 1, edited: true }
        },
        'scale.y': {
          '0': { value: 1 },
          '1017': { value: 0.1, edited: true, curve: 'easeOutBack' },
          '1267': { value: 1, edited: true }
        },
        opacity: {
          '0': { value: 0, edited: true },
          '1017': { value: 1, edited: true }
        },
        'rotation.z': {
          '0': { value: 0 },
          '1733': { value: 0, edited: true, curve: 'easeInOutSine' },
          '1883': { value: -0.1, edited: true, curve: 'easeInSine' },
          '1983': { value: 0, edited: true }
        }
      },
      'haiku:4e5ea6d40bf2': {
        stroke: { '0': { value: 'none' } },
        'stroke-width': { '0': { value: '1' } },
        fill: { '0': { value: 'none' } },
        'fill-rule': { '0': { value: 'evenodd' } }
      },
      'haiku:092dedd1b841': {
        fill: { '0': { value: '#FFFFFF' } },
        'translation.x': { '0': { value: -336 } },
        'translation.y': { '0': { value: -156 } }
      },
      'haiku:d3925e0ff576': {
        points: {
          '0': {
            value: '382.02 196.978 382.02 211 336.1 211 336.1 156.88 381.036 156.88 381.036 170.902 355.206 170.902 355.206 177.626 376.034 177.626 376.034 190.582 355.206 190.582 355.206 196.978'
          }
        }
      },
      'haiku:45100a5481ae': {
        viewBox: { '0': { value: '0 0 8 8' } },
        'style.position': { '0': { value: 'absolute' } },
        'style.margin': { '0': { value: '0' } },
        'style.padding': { '0': { value: '0' } },
        'style.border': { '0': { value: '0' } },
        'sizeAbsolute.x': { '0': { value: 8 } },
        'sizeMode.x': { '0': { value: 1 } },
        'sizeAbsolute.y': { '0': { value: 8 } },
        'sizeMode.y': { '0': { value: 1 } },
        'translation.x': {
          '0': { value: 455, edited: true },
          '267': { value: 460, edited: true, curve: 'linear' },
          '483': { value: 445, edited: true },
          '500': { value: 435, edited: true },
          '883': { value: 183, edited: true, curve: 'linear' },
          '1217': { value: 208, edited: true }
        },
        'translation.y': {
          '0': { value: 204, edited: true },
          '267': { value: 203, edited: true, curve: 'easeInOutCirc' },
          '500': { value: 168, edited: true },
          '883': { value: 177, edited: true, curve: 'easeOutCirc' },
          '1217': { value: 142, edited: true }
        },
        'style.zIndex': { '0': { value: 8 } },
        opacity: {
          '0': { value: 0, edited: true },
          '267': { value: 1, edited: true },
          '450': { value: 1, edited: true, curve: 'linear' },
          '583': { value: 0, edited: true },
          '883': { value: 1, edited: true },
          '1100': { value: 1, edited: true, curve: 'linear' },
          '1217': { value: 0, edited: true }
        }
      },
      'haiku:49141efedd32': {
        stroke: { '0': { value: 'none' } },
        'stroke-width': { '0': { value: '1' } },
        fill: { '0': { value: 'none' } },
        'fill-rule': { '0': { value: 'evenodd' } }
      },
      'haiku:0a1b4b252759': {
        fill: { '0': { value: '#FF5883' } },
        'translation.x': { '0': { value: -136 } },
        'translation.y': { '0': { value: -258 } }
      },
      'haiku:8f5a624e29cb': {
        cx: { '0': { value: '140' } },
        cy: { '0': { value: '262' } },
        r: { '0': { value: '4' } }
      },
      'haiku:5fe5a8c6c68c': {
        viewBox: { '0': { value: '0 0 14 14' } },
        'style.position': { '0': { value: 'absolute' } },
        'style.margin': { '0': { value: '0' } },
        'style.padding': { '0': { value: '0' } },
        'style.border': { '0': { value: '0' } },
        'sizeAbsolute.x': { '0': { value: 14 } },
        'sizeMode.x': { '0': { value: 1 } },
        'sizeAbsolute.y': { '0': { value: 14 } },
        'sizeMode.y': { '0': { value: 1 } },
        'translation.x': {
          '0': { value: 482, edited: true },
          '267': { value: 466, edited: true, curve: 'linear' },
          '500': { value: 459, edited: true },
          '550': { value: 332, edited: true, curve: 'linear' },
          '800': { value: 359, edited: true },
          '1183': { value: 374, edited: true, curve: 'linear' },
          '1467': { value: 414, edited: true },
          '2217': { value: 173, edited: true, curve: 'linear' },
          '2833': { value: 403, edited: true }
        },
        'translation.y': {
          '0': { value: 202, edited: true },
          '267': { value: 198, edited: true, curve: 'easeInOutCirc' },
          '500': { value: 157, edited: true },
          '550': { value: 205, edited: true, curve: 'easeInOutCirc' },
          '800': { value: 181, edited: true },
          '1183': { value: 169, edited: true, curve: 'easeOutCirc' },
          '1467': { value: 144, edited: true },
          '2217': { value: 209, edited: true, curve: 'easeInCirc' },
          '2833': { value: 145, edited: true }
        },
        'style.zIndex': { '0': { value: 9 } },
        opacity: {
          '0': { value: 0, edited: true },
          '267': { value: 1, edited: true },
          '450': { value: 1, edited: true, curve: 'easeOutCubic' },
          '533': { value: 0, edited: true },
          '550': { value: 1, edited: true },
          '750': { value: 1, edited: true, curve: 'easeOutCubic' },
          '883': { value: 0, edited: true },
          '1183': { value: 1, edited: true },
          '1383': { value: 1, edited: true, curve: 'linear' },
          '1467': { value: 0, edited: true },
          '2217': { value: 1, edited: true },
          '2667': { value: 1, edited: true, curve: 'linear' },
          '2833': { value: 0, edited: true }
        }
      },
      'haiku:aebe42ca1928': {
        stroke: { '0': { value: 'none' } },
        'stroke-width': { '0': { value: '1' } },
        fill: { '0': { value: 'none' } },
        'fill-rule': { '0': { value: 'evenodd' } }
      },
      'haiku:6c868f89d96c': {
        'stroke-width': { '0': { value: '2.5' } },
        stroke: { '0': { value: '#00DEE2' } },
        'translation.x': { '0': { value: -182 } },
        'translation.y': { '0': { value: -279 } }
      },
      'haiku:0eb8534c4653': {
        cx: { '0': { value: '189' } },
        cy: { '0': { value: '286' } },
        r: { '0': { value: '5.75' } }
      },
      'haiku:1dfa2abb91b4': {
        viewBox: { '0': { value: '0 0 14 14' } },
        'style.position': { '0': { value: 'absolute' } },
        'style.margin': { '0': { value: '0' } },
        'style.padding': { '0': { value: '0' } },
        'style.border': { '0': { value: '0' } },
        'sizeAbsolute.x': { '0': { value: 14 } },
        'sizeMode.x': { '0': { value: 1 } },
        'sizeAbsolute.y': { '0': { value: 14 } },
        'sizeMode.y': { '0': { value: 1 } },
        'translation.x': {
          '0': { value: 497.58, edited: true },
          '267': { value: 466.58, edited: true, curve: 'linear' },
          '500': { value: 478.58, edited: true },
          '883': { value: 163.57999999999998, edited: true, curve: 'linear' },
          '1217': { value: 107.57999999999998, edited: true },
          '2217': { value: 237.57999999999998, edited: true, curve: 'linear' },
          '2583': { value: 407.3887431693989, edited: true }
        },
        'translation.y': {
          '0': { value: 200.86, edited: true },
          '267': { value: 199.86, edited: true, curve: 'easeInOutCirc' },
          '500': { value: 172.86, edited: true },
          '883': { value: 172.86, edited: true, curve: 'easeOutCirc' },
          '1217': { value: 137.86, edited: true },
          '2217': { value: 207.86, edited: true, curve: 'easeInCirc' },
          '2583': { value: 137.86, edited: true }
        },
        'style.zIndex': { '0': { value: 10 } },
        opacity: {
          '0': { value: 0, edited: true },
          '267': { value: 1, edited: true },
          '450': { value: 1, edited: true, curve: 'easeOutCubic' },
          '567': { value: 0, edited: true },
          '883': { value: 1, edited: true },
          '1100': { value: 1, edited: true, curve: 'easeOutCubic' },
          '1217': { value: 0, edited: true },
          '2217': { value: 1, edited: true },
          '2417': { value: 1, edited: true, curve: 'linear' },
          '2583': { value: 0, edited: true }
        }
      },
      'haiku:c991cf5a0eb2': {
        stroke: { '0': { value: 'none' } },
        'stroke-width': { '0': { value: '1' } },
        fill: { '0': { value: 'none' } },
        'fill-rule': { '0': { value: 'evenodd' } }
      },
      'haiku:3a151b485792': {
        'stroke-width': { '0': { value: '2.5' } },
        stroke: { '0': { value: '#FFD300' } },
        'translation.x': { '0': { value: -153 } },
        'translation.y': { '0': { value: -279 } }
      },
      'haiku:8bfa3e9b1b5a': {
        cx: { '0': { value: '160' } },
        cy: { '0': { value: '286' } },
        r: { '0': { value: '5.75' } }
      },
      'haiku:47bc0ed0fa1a': {
        viewBox: { '0': { value: '0 0 8 8' } },
        'style.position': { '0': { value: 'absolute' } },
        'style.margin': { '0': { value: '0' } },
        'style.padding': { '0': { value: '0' } },
        'style.border': { '0': { value: '0' } },
        'sizeAbsolute.x': { '0': { value: 8 } },
        'sizeMode.x': { '0': { value: 1 } },
        'sizeAbsolute.y': { '0': { value: 8 } },
        'sizeMode.y': { '0': { value: 1 } },
        'translation.x': {
          '0': { value: 359.14, edited: true },
          '550': { value: 341.14, edited: true, curve: 'linear' },
          '800': { value: 326.14, edited: true },
          '1033': { value: 326.14, edited: true, curve: 'linear' },
          '1350': { value: 309.14, edited: true }
        },
        'translation.y': {
          '0': { value: 206.42000000000002, edited: true },
          '550': {
            value: 207.42000000000002,
            edited: true,
            curve: 'easeInOutCirc'
          },
          '800': { value: 172.42000000000002, edited: true },
          '1033': {
            value: 172.42000000000002,
            edited: true,
            curve: 'easeOutCirc'
          },
          '1350': { value: 116.42000000000002, edited: true }
        },
        'style.zIndex': { '0': { value: 12 } },
        opacity: {
          '0': { value: 0, edited: true },
          '550': { value: 1, edited: true },
          '750': { value: 1, edited: true, curve: 'easeOutCubic' },
          '883': { value: 0, edited: true },
          '1033': { value: 1, edited: true },
          '1250': { value: 1, edited: true, curve: 'linear' },
          '1350': { value: 0, edited: true }
        }
      },
      'haiku:ba5c6ffbaeb0': {
        stroke: { '0': { value: 'none' } },
        'stroke-width': { '0': { value: '1' } },
        fill: { '0': { value: 'none' } },
        'fill-rule': { '0': { value: 'evenodd' } }
      },
      'haiku:f4e03fd44100': {
        fill: { '0': { value: '#FFD300' } },
        'translation.x': { '0': { value: -156 } },
        'translation.y': { '0': { value: -258 } }
      },
      'haiku:fdba317520fc': {
        cx: { '0': { value: '160' } },
        cy: { '0': { value: '262' } },
        r: { '0': { value: '4' } }
      },
      'haiku:e4bd0da8cd6d': {
        viewBox: { '0': { value: '0 0 8 8' } },
        'style.position': { '0': { value: 'absolute' } },
        'style.margin': { '0': { value: '0' } },
        'style.padding': { '0': { value: '0' } },
        'style.border': { '0': { value: '0' } },
        'sizeAbsolute.x': { '0': { value: 8 } },
        'sizeMode.x': { '0': { value: 1 } },
        'sizeAbsolute.y': { '0': { value: 8 } },
        'sizeMode.y': { '0': { value: 1 } },
        'translation.x': {
          '0': { value: 336.1, edited: true },
          '1033': { value: 306.42, edited: true, curve: 'linear' },
          '1350': { value: 336.42, edited: true },
          '2217': { value: 261.42, edited: true, curve: 'linear' },
          '2650': { value: 332.42, edited: true }
        },
        'translation.y': {
          '0': { value: 177.3, edited: true },
          '1033': { value: 177.3, edited: true, curve: 'easeOutCirc' },
          '1350': { value: 147.3, edited: true },
          '2217': { value: 213.3, edited: true, curve: 'easeInCirc' },
          '2650': { value: 163.3, edited: true }
        },
        'style.zIndex': { '0': { value: 13 } },
        'scale.x': { '0': { value: 1 }, '1033': { value: 1.08, edited: true } },
        opacity: {
          '0': { value: 0, edited: true },
          '1033': { value: 1, edited: true },
          '1233': { value: 1, edited: true, curve: 'linear' },
          '1350': { value: 0, edited: true },
          '2217': { value: 1, edited: true },
          '2500': { value: 1, edited: true, curve: 'linear' },
          '2650': { value: 0, edited: true }
        }
      },
      'haiku:c23b4d7fad03': {
        stroke: { '0': { value: 'none' } },
        'stroke-width': { '0': { value: '1' } },
        fill: { '0': { value: 'none' } },
        'fill-rule': { '0': { value: 'evenodd' } }
      },
      'haiku:570a14aa6c2f': {
        fill: { '0': { value: '#00DEE2' } },
        'translation.x': { '0': { value: -175 } },
        'translation.y': { '0': { value: -258 } }
      },
      'haiku:fb24d7a0428a': {
        cx: { '0': { value: '179' } },
        cy: { '0': { value: '262' } },
        r: { '0': { value: '4' } }
      },
      'haiku:3c4f0a039417': {
        viewBox: { '0': { value: '0 0 14 14' } },
        'style.position': { '0': { value: 'absolute' } },
        'style.margin': { '0': { value: '0' } },
        'style.padding': { '0': { value: '0' } },
        'style.border': { '0': { value: '0' } },
        'sizeAbsolute.x': { '0': { value: 14 } },
        'sizeMode.x': { '0': { value: 1 } },
        'sizeAbsolute.y': { '0': { value: 14 } },
        'sizeMode.y': { '0': { value: 1 } },
        'translation.x': {
          '0': { value: 328.62, edited: true },
          '1033': { value: 328.62, edited: true, curve: 'linear' },
          '1350': { value: 296.62, edited: true }
        },
        'translation.y': {
          '0': { value: 175.58, edited: true },
          '1033': { value: 175.58, edited: true, curve: 'easeOutCirc' },
          '1350': { value: 140.58, edited: true }
        },
        'style.zIndex': { '0': { value: 14 } },
        opacity: {
          '0': { value: 0, edited: true },
          '1033': { value: 1, edited: true },
          '1233': { value: 1, edited: true, curve: 'linear' },
          '1350': { value: 0, edited: true }
        }
      },
      'haiku:c56cf1b3b34d': {
        stroke: { '0': { value: 'none' } },
        'stroke-width': { '0': { value: '1' } },
        fill: { '0': { value: 'none' } },
        'fill-rule': { '0': { value: 'evenodd' } }
      },
      'haiku:15d2afcedf22': {
        'stroke-width': { '0': { value: '2.5' } },
        stroke: { '0': { value: '#FF5883' } },
        'translation.x': { '0': { value: -129 } },
        'translation.y': { '0': { value: -279 } }
      },
      'haiku:4bce6e0c211d': {
        cx: { '0': { value: '136' } },
        cy: { '0': { value: '286' } },
        r: { '0': { value: '5.75' } }
      },
      'haiku:3b978060f2d6': {
        viewBox: { '0': { value: '0 0 8 8' } },
        'style.position': { '0': { value: 'absolute' } },
        'style.margin': { '0': { value: '0' } },
        'style.padding': { '0': { value: '0' } },
        'style.border': { '0': { value: '0' } },
        'sizeAbsolute.x': { '0': { value: 8 } },
        'sizeMode.x': { '0': { value: 1 } },
        'sizeAbsolute.y': { '0': { value: 8 } },
        'sizeMode.y': { '0': { value: 1 } },
        'translation.x': {
          '0': { value: 405.86, edited: true },
          '1183': { value: 385.86, edited: true, curve: 'linear' },
          '1467': { value: 372.86, edited: true },
          '2217': { value: 202.86, edited: true, curve: 'linear' },
          '2783': { value: 407.86, edited: true }
        },
        'translation.y': {
          '0': { value: 172.18, edited: true },
          '1183': { value: 172.18, edited: true, curve: 'easeOutCirc' },
          '1467': { value: 147.18, edited: true },
          '2217': { value: 213.18, edited: true, curve: 'easeInCirc' },
          '2783': { value: 134.98444741236045, edited: true },
          '3317': { value: 163.18, edited: true }
        },
        'style.zIndex': { '0': { value: 15 } },
        opacity: {
          '0': { value: 0, edited: true },
          '1183': { value: 1, edited: true },
          '1383': { value: 1, edited: true, curve: 'linear' },
          '1467': { value: 0, edited: true },
          '2217': { value: 1, edited: true },
          '2617': { value: 1, edited: true, curve: 'linear' },
          '2783': { value: 0, edited: true }
        }
      },
      'haiku:bb2ea33ce59b': {
        stroke: { '0': { value: 'none' } },
        'stroke-width': { '0': { value: '1' } },
        fill: { '0': { value: 'none' } },
        'fill-rule': { '0': { value: 'evenodd' } }
      },
      'haiku:2783962bf034': {
        fill: { '0': { value: '#FF5883' } },
        'translation.x': { '0': { value: -136 } },
        'translation.y': { '0': { value: -258 } }
      },
      'haiku:e0651d9b2b05': {
        cx: { '0': { value: '140' } },
        cy: { '0': { value: '262' } },
        r: { '0': { value: '4' } }
      }
    }
  },

  template: {
    elementName: 'div',
    attributes: { 'haiku-title': 'Move', 'haiku-id': '91083482b04d' },
    children: [
      {
        elementName: 'svg',
        attributes: {
          version: '1.1',
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          source: 'designs/Move.sketch.contents/slices/O.svg',
          'haiku-id': '5bfd10a365ed',
          'haiku-title': 'O'
        },
        children: [
          {
            elementName: 'title',
            attributes: { 'haiku-id': 'e0493b3c81f7' },
            children: ['O']
          },
          {
            elementName: 'desc',
            attributes: { 'haiku-id': 'e459ffb0969b' },
            children: ['Created with sketchtool.']
          },
          {
            elementName: 'defs',
            attributes: { 'haiku-id': '326c97c8594a' },
            children: []
          },
          {
            elementName: 'g',
            attributes: { id: 'Page-1', 'haiku-id': '5b213ab9bbdf' },
            children: [
              {
                elementName: 'g',
                attributes: { id: 'Artboard', 'haiku-id': 'f381da39280d' },
                children: [
                  {
                    elementName: 'path',
                    attributes: { id: 'O', 'haiku-id': '23962fd3e6f7' },
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        elementName: 'svg',
        attributes: {
          version: '1.1',
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          source: 'designs/Move.sketch.contents/slices/M.svg',
          'haiku-id': '676aa843ca1c',
          'haiku-title': 'M'
        },
        children: [
          {
            elementName: 'title',
            attributes: { 'haiku-id': 'a69b11998f09' },
            children: ['M']
          },
          {
            elementName: 'desc',
            attributes: { 'haiku-id': 'bc3aa319e526' },
            children: ['Created with sketchtool.']
          },
          {
            elementName: 'defs',
            attributes: { 'haiku-id': '92300bd7d503' },
            children: []
          },
          {
            elementName: 'g',
            attributes: { id: 'Page-1', 'haiku-id': 'c2569068439f' },
            children: [
              {
                elementName: 'g',
                attributes: { id: 'Artboard', 'haiku-id': '7567dd09dbf7' },
                children: [
                  {
                    elementName: 'polygon',
                    attributes: { id: 'M', 'haiku-id': 'cbb866760178' },
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        elementName: 'svg',
        attributes: {
          version: '1.1',
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          source: 'designs/Move.sketch.contents/slices/V.svg',
          'haiku-id': '0802a4738af0',
          'haiku-title': 'V'
        },
        children: [
          {
            elementName: 'title',
            attributes: { 'haiku-id': '5a806bdd4bca' },
            children: ['V']
          },
          {
            elementName: 'desc',
            attributes: { 'haiku-id': '140c3b81f64b' },
            children: ['Created with sketchtool.']
          },
          {
            elementName: 'defs',
            attributes: { 'haiku-id': '4fa3f05cd850' },
            children: []
          },
          {
            elementName: 'g',
            attributes: { id: 'Page-1', 'haiku-id': '129389353e52' },
            children: [
              {
                elementName: 'g',
                attributes: { id: 'Artboard', 'haiku-id': 'f22dc401e7ab' },
                children: [
                  {
                    elementName: 'polygon',
                    attributes: { id: 'V', 'haiku-id': '420e630b3df4' },
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        elementName: 'svg',
        attributes: {
          version: '1.1',
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          source: 'designs/Move.sketch.contents/slices/E.svg',
          'haiku-id': 'c8d0231b6708',
          'haiku-title': 'E'
        },
        children: [
          {
            elementName: 'title',
            attributes: { 'haiku-id': '25c4eae2c83c' },
            children: ['E']
          },
          {
            elementName: 'desc',
            attributes: { 'haiku-id': '5902b561616e' },
            children: ['Created with sketchtool.']
          },
          {
            elementName: 'defs',
            attributes: { 'haiku-id': '2bbeecfd6b50' },
            children: []
          },
          {
            elementName: 'g',
            attributes: { id: 'Page-1', 'haiku-id': '4e5ea6d40bf2' },
            children: [
              {
                elementName: 'g',
                attributes: { id: 'Artboard', 'haiku-id': '092dedd1b841' },
                children: [
                  {
                    elementName: 'polygon',
                    attributes: { id: 'E', 'haiku-id': 'd3925e0ff576' },
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        elementName: 'svg',
        attributes: {
          version: '1.1',
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          source: 'designs/Move.sketch.contents/slices/circle red.svg',
          'haiku-title': 'circle red',
          'haiku-id': '45100a5481ae'
        },
        children: [
          {
            elementName: 'title',
            attributes: { 'haiku-id': '8d077312acdc' },
            children: ['circle red']
          },
          {
            elementName: 'desc',
            attributes: { 'haiku-id': '12700170fe69' },
            children: ['Created with sketchtool.']
          },
          {
            elementName: 'defs',
            attributes: { 'haiku-id': 'a8d84b1506a9' },
            children: []
          },
          {
            elementName: 'g',
            attributes: { id: 'Page-1', 'haiku-id': '49141efedd32' },
            children: [
              {
                elementName: 'g',
                attributes: { id: 'Artboard', 'haiku-id': '0a1b4b252759' },
                children: [
                  {
                    elementName: 'circle',
                    attributes: {
                      id: 'circle-red',
                      'haiku-id': '8f5a624e29cb'
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
        elementName: 'svg',
        attributes: {
          version: '1.1',
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          source: 'designs/Move.sketch.contents/slices/ring teal.svg',
          'haiku-title': 'ring teal',
          'haiku-id': '5fe5a8c6c68c'
        },
        children: [
          {
            elementName: 'title',
            attributes: { 'haiku-id': '22c67952cec3' },
            children: ['ring teal']
          },
          {
            elementName: 'desc',
            attributes: { 'haiku-id': '5747b15d6691' },
            children: ['Created with sketchtool.']
          },
          {
            elementName: 'defs',
            attributes: { 'haiku-id': '0725fb50ccad' },
            children: []
          },
          {
            elementName: 'g',
            attributes: { id: 'Page-1', 'haiku-id': 'aebe42ca1928' },
            children: [
              {
                elementName: 'g',
                attributes: { id: 'Artboard', 'haiku-id': '6c868f89d96c' },
                children: [
                  {
                    elementName: 'circle',
                    attributes: { id: 'ring-teal', 'haiku-id': '0eb8534c4653' },
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        elementName: 'svg',
        attributes: {
          version: '1.1',
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          source: 'designs/Move.sketch.contents/slices/ring yellow.svg',
          'haiku-title': 'ring yellow',
          'haiku-id': '1dfa2abb91b4'
        },
        children: [
          {
            elementName: 'title',
            attributes: { 'haiku-id': '95845db38809' },
            children: ['ring yellow']
          },
          {
            elementName: 'desc',
            attributes: { 'haiku-id': '4ee44eea0439' },
            children: ['Created with sketchtool.']
          },
          {
            elementName: 'defs',
            attributes: { 'haiku-id': '3e658a0d7210' },
            children: []
          },
          {
            elementName: 'g',
            attributes: { id: 'Page-1', 'haiku-id': 'c991cf5a0eb2' },
            children: [
              {
                elementName: 'g',
                attributes: { id: 'Artboard', 'haiku-id': '3a151b485792' },
                children: [
                  {
                    elementName: 'circle',
                    attributes: {
                      id: 'ring-yellow',
                      'haiku-id': '8bfa3e9b1b5a'
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
        elementName: 'svg',
        attributes: {
          version: '1.1',
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          source: 'designs/Move.sketch.contents/slices/circle yellow.svg',
          'haiku-title': 'circle yellow',
          'haiku-id': '47bc0ed0fa1a'
        },
        children: [
          {
            elementName: 'title',
            attributes: { 'haiku-id': '85e03095ce89' },
            children: ['circle yellow']
          },
          {
            elementName: 'desc',
            attributes: { 'haiku-id': 'e53fb2b46b2d' },
            children: ['Created with sketchtool.']
          },
          {
            elementName: 'defs',
            attributes: { 'haiku-id': 'ebfa151556c6' },
            children: []
          },
          {
            elementName: 'g',
            attributes: { id: 'Page-1', 'haiku-id': 'ba5c6ffbaeb0' },
            children: [
              {
                elementName: 'g',
                attributes: { id: 'Artboard', 'haiku-id': 'f4e03fd44100' },
                children: [
                  {
                    elementName: 'circle',
                    attributes: {
                      id: 'circle-yellow',
                      'haiku-id': 'fdba317520fc'
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
        elementName: 'svg',
        attributes: {
          version: '1.1',
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          source: 'designs/Move.sketch.contents/slices/circle teal.svg',
          'haiku-title': 'circle teal',
          'haiku-id': 'e4bd0da8cd6d'
        },
        children: [
          {
            elementName: 'title',
            attributes: { 'haiku-id': 'fd5776bd3bd3' },
            children: ['circle teal']
          },
          {
            elementName: 'desc',
            attributes: { 'haiku-id': 'a9a31fd01e02' },
            children: ['Created with sketchtool.']
          },
          {
            elementName: 'defs',
            attributes: { 'haiku-id': '8863b86c18c1' },
            children: []
          },
          {
            elementName: 'g',
            attributes: { id: 'Page-1', 'haiku-id': 'c23b4d7fad03' },
            children: [
              {
                elementName: 'g',
                attributes: { id: 'Artboard', 'haiku-id': '570a14aa6c2f' },
                children: [
                  {
                    elementName: 'circle',
                    attributes: {
                      id: 'circle-teal',
                      'haiku-id': 'fb24d7a0428a'
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
        elementName: 'svg',
        attributes: {
          version: '1.1',
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          source: 'designs/Move.sketch.contents/slices/ring red.svg',
          'haiku-title': 'ring red',
          'haiku-id': '3c4f0a039417'
        },
        children: [
          {
            elementName: 'title',
            attributes: { 'haiku-id': '0691fc2c65cb' },
            children: ['ring red']
          },
          {
            elementName: 'desc',
            attributes: { 'haiku-id': '13c7a3f26b52' },
            children: ['Created with sketchtool.']
          },
          {
            elementName: 'defs',
            attributes: { 'haiku-id': '799e79e1f0eb' },
            children: []
          },
          {
            elementName: 'g',
            attributes: { id: 'Page-1', 'haiku-id': 'c56cf1b3b34d' },
            children: [
              {
                elementName: 'g',
                attributes: { id: 'Artboard', 'haiku-id': '15d2afcedf22' },
                children: [
                  {
                    elementName: 'circle',
                    attributes: { id: 'ring-red', 'haiku-id': '4bce6e0c211d' },
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        elementName: 'svg',
        attributes: {
          version: '1.1',
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          source: 'designs/Move.sketch.contents/slices/circle red.svg',
          'haiku-title': 'circle red',
          'haiku-id': '3b978060f2d6'
        },
        children: [
          {
            elementName: 'title',
            attributes: { 'haiku-id': 'e8a02e95413e' },
            children: ['circle red']
          },
          {
            elementName: 'desc',
            attributes: { 'haiku-id': 'b7afecc9e845' },
            children: ['Created with sketchtool.']
          },
          {
            elementName: 'defs',
            attributes: { 'haiku-id': 'dd61e075b435' },
            children: []
          },
          {
            elementName: 'g',
            attributes: { id: 'Page-1', 'haiku-id': 'bb2ea33ce59b' },
            children: [
              {
                elementName: 'g',
                attributes: { id: 'Artboard', 'haiku-id': '2783962bf034' },
                children: [
                  {
                    elementName: 'circle',
                    attributes: {
                      id: 'circle-red',
                      'haiku-id': 'e0651d9b2b05'
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
}
