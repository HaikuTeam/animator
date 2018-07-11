let Haiku = require('@haiku/core');
module.exports = {
  metadata: {
    title: 'Main',
    uuid: 'HAIKU_SHARE_UUID',
    type: 'haiku',
    relpath: 'code/main/code.js',
    core: '3.5.1',
  },
  options: {},
  states: {},
  timelines: {
    Default: {
      'haiku:03757d2ca102': {
        'style.WebkitTapHighlightColor': {0: {value: 'rgba(0,0,0,0)'}},
        'style.transformStyle': {0: {value: 'flat'}},
        'style.perspective': {0: {value: 'none'}},
        'style.position': {0: {value: 'relative'}},
        'style.overflowX': {0: {value: 'hidden'}},
        'style.overflowY': {0: {value: 'hidden'}},
        'sizeAbsolute.x': {0: {value: 550}},
        'sizeAbsolute.y': {0: {value: 400}},
        'sizeMode.x': {0: {value: 1}},
        'sizeMode.y': {0: {value: 1}},
        'sizeMode.z': {0: {value: 1}},
      },
      'haiku:b82634dcdeb1': {
        'style.position': {0: {value: 'absolute'}},
        'style.margin': {0: {value: '0'}},
        'style.padding': {0: {value: '0'}},
        'style.border': {0: {value: '0'}},
        'sizeMode.x': {0: {value: 1}},
        'sizeMode.y': {0: {value: 1}},
        'sizeAbsolute.x': {0: {value: true}},
        'sizeAbsolute.y': {0: {value: true}},
        'translation.x': {0: {value: 279.5}},
        'translation.y': {0: {value: 192}},
        'sizeMode.z': {0: {value: 1}},
        'origin.x': {0: {value: 0.5}},
        'origin.y': {0: {value: 0.5}},
        'style.zIndex': {0: {value: 1}},
        playback: {
          0: {value: 'loop', edited: true},
          1000: {value: 'loop', edited: true},
        },
      },
    },
  },
  template: {
    elementName: 'div',
    attributes: {'haiku-id': '03757d2ca102', 'haiku-title': 'Main'},
    children: [
      {
        elementName: {
          metadata: {
            core: '3.5.1',
          },
          options: {},
          states: {},
          eventHandlers: {},
          timelines: {
            Default: {
              'haiku:1c2aee223193': {
                'style.WebkitTapHighlightColor': {0: {value: 'rgba(0,0,0,0)'}},
                'style.transformStyle': {0: {value: 'flat'}},
                'style.perspective': {0: {value: 'none'}},
                'style.position': {0: {value: 'relative'}},
                'style.overflowX': {0: {value: 'visible'}},
                'style.overflowY': {0: {value: 'visible'}},
                'sizeAbsolute.x': {0: {value: 38}},
                'sizeAbsolute.y': {0: {value: 45}},
                'sizeMode.x': {0: {value: 1}},
                'sizeMode.y': {0: {value: 1}},
                'sizeMode.z': {0: {value: 1}},
              },
              'haiku:2ddb7a30bc67': {
                'style.position': {0: {value: 'absolute'}},
                'style.margin': {0: {value: '0'}},
                'style.padding': {0: {value: '0'}},
                'style.border': {0: {value: '0'}},
                'sizeAbsolute.x': {0: {value: 38}},
                'sizeMode.x': {0: {value: 1}},
                'sizeAbsolute.y': {0: {value: 45}},
                'sizeMode.y': {0: {value: 1}},
                'translation.x': {0: {value: 19}},
                'translation.y': {0: {value: 22.5}},
                'style.zIndex': {0: {value: 1}},
                'rotation.z': {
                  0: {value: 0, edited: true, curve: 'easeInQuad'},
                  1000: {value: 12.568},
                },
              },
              'haiku:bbd20e6ff849': {
                stroke: {0: {value: 'none'}},
                "stroke-width": {0: {value: '1'}},
                fill: {0: {value: 'none'}},
                "fill-rule": {0: {value: 'evenodd'}},
              },
              'haiku:219ee859713c': {
                fill: {0: {value: '#000000'}},
                'translation.x': {0: {value: -227}},
                'translation.y': {0: {value: -1}},
              },
              'haiku:facff35d920f': {'translation.x': {0: {value: 116}}},
              'haiku:7615f4053edb': {
                d: {
                  0: {
                    value: 'M135.920814,24.9449914 L135.920814,30.4062214 C135.920814,31.0868314 135.406514,31.6385814 134.772014,31.6385814 C134.588214,31.6385814 134.414514,31.5922814 134.260514,31.5099614 C134.236314,31.5010814 134.212314,31.4912914 134.188514,31.4805714 L118.760314,24.5493314 C118.437814,24.5441514 118.128514,24.3926214 117.913914,24.1307214 C117.633214,23.9060514 117.451414,23.5469614 117.451414,23.1423214 L117.451414,9.01229141 C117.416314,8.96447141 117.384014,8.91365141 117.354914,8.85999141 L116.622614,8.54242141 L113.298014,7.10069141 L113.298014,40.8292914 L117.451414,42.6304314 L117.451414,31.2948514 C117.451414,31.2772214 117.451714,31.2596714 117.452414,31.2422214 C117.444414,31.0646814 117.472314,30.8824914 117.540614,30.7076214 C117.785714,30.0798414 118.458814,29.7840614 119.044014,30.0469714 L134.550714,37.0139514 L134.850514,37.1587114 C135.448414,37.2020014 135.920814,37.7359314 135.920814,38.3882314 L135.920814,40.8292914 L140.034314,42.6130914 L140.074214,42.6304314 L140.074214,22.9752114 L135.920814,24.9449914 Z M133.623214,25.5242214 L125.244714,21.7601014 L121.864114,23.2716014 L133.623214,28.5544714 L133.623214,25.5242214 Z M119.749014,33.0358614 L119.749014,42.8179714 L123.902414,41.0168314 L123.902414,34.9018214 L119.749014,33.0358614 Z M118.623214,45.9881214 C118.615614,45.9882914 118.607914,45.9883714 118.600214,45.9883714 C118.292714,45.9883714 118.013514,45.8587914 117.807314,45.6477614 L116.622614,45.1340114 L111.957614,43.1110214 C111.414314,43.0131914 111.000314,42.5063114 111.000314,41.8957214 L111.000314,41.8309214 C110.999914,41.8106714 110.999914,41.7903714 111.000314,41.7700414 L111.000314,5.23932141 C110.999914,5.22069141 110.999914,5.20201141 111.000214,5.18330141 C110.999914,5.16459141 110.999914,5.14591141 111.000314,5.12727141 L111.000314,5.11404141 C111.000314,4.73859141 111.156814,4.40236141 111.403714,4.17632141 C111.509314,4.07299141 111.633514,3.98768141 111.773814,3.92685141 L118.131014,1.17003141 C118.452014,0.977151413 118.849514,0.939171413 119.215114,1.10369141 L125.180314,3.78841141 C125.196114,3.78772141 125.212014,3.78737141 125.228014,3.78737141 C125.862514,3.78737141 126.376814,4.33912141 126.376814,5.01973141 L126.376814,5.17973141 C126.377214,5.19979141 126.377214,5.21990141 126.376814,5.24004141 L126.376814,13.2517514 L133.623214,10.1208214 L133.623214,5.23932141 C133.622814,5.22069141 133.622814,5.20201141 133.623114,5.18330141 C133.622814,5.16459141 133.622814,5.14591141 133.623214,5.12727141 L133.623214,5.01973141 C133.623214,4.35967141 134.106914,3.82082141 134.714914,3.78887141 L140.753914,1.17003141 C141.074914,0.977151413 141.472414,0.939171413 141.837914,1.10369141 L148.052414,3.90059141 C148.590814,4.00280141 148.999714,4.50720141 148.999714,5.11404141 L148.999714,5.17973141 C149.000114,5.19979141 149.000114,5.21990141 148.999714,5.24004141 L148.999714,41.8957214 C148.999714,42.3503014 148.770214,42.7473914 148.428814,42.9610014 C148.320914,43.0690414 148.193114,43.1580614 148.048114,43.2209314 L141.863514,45.9029114 C141.461314,46.0773114 141.023814,46.0087214 140.692414,45.7615014 L139.106914,45.0739314 L134.396714,43.0313414 C134.025914,42.8705514 133.767414,42.5388714 133.668014,42.1551714 C133.641514,42.0564414 133.626214,41.9526314 133.623614,41.8454114 C133.622814,41.8203614 133.622714,41.7952214 133.623214,41.7700414 L133.623214,39.2690114 L133.607814,39.2615714 L133.623214,39.2248514 L133.623214,39.2689614 L126.200114,35.9340514 L126.200114,41.8856114 C126.200114,41.9223014 126.198614,41.9586114 126.195614,41.9944814 C126.194014,42.5177914 125.902014,43.0126914 125.421814,43.2209314 L119.240614,45.9014314 C119.037814,45.9894014 118.825914,46.0155414 118.623214,45.9881214 Z M142.371914,42.8194514 L146.702014,40.9416714 L146.702014,7.16965141 L142.371914,9.04743141 L142.371914,13.1668314 C142.371914,13.5557714 142.203914,13.9026214 141.941614,14.1284814 C141.824714,14.2866714 141.669814,14.4162014 141.483814,14.4993614 L128.225714,20.4272214 L134.151314,23.0893414 L140.648414,20.0080814 C141.228714,19.7328714 141.907114,20.0144114 142.163614,20.6369014 C142.169814,20.6517814 142.175614,20.6667314 142.181114,20.6817314 C142.301714,20.8766914 142.371914,21.1105614 142.371914,21.3620214 L142.371914,42.8194514 Z M140.074214,9.01229141 C140.039214,8.96447141 140.006914,8.91365141 139.977814,8.85999141 L139.245414,8.54242141 L135.920814,7.10069141 L135.920814,9.96181141 L140.074214,11.7629514 L140.074214,9.01229141 Z M119.749014,21.5470414 L124.079214,19.6109714 L124.079214,7.16965141 L119.749014,9.04743141 L119.749014,21.5470414 Z M126.376814,15.9088814 L126.376814,18.5836614 L137.614314,13.5592114 L134.750214,12.3171514 C134.740214,12.3128314 134.730314,12.3083914 134.720514,12.3038214 L126.376814,15.9088814 Z M138.101414,5.18330141 L140.172814,6.08158141 L141.390914,6.60982141 L144.592014,5.22166141 L141.363614,3.76865141 L138.101414,5.18330141 Z M115.478514,5.18330141 L117.549914,6.08158141 L118.768114,6.60982141 L121.969214,5.22166141 L118.740714,3.76865141 L115.478514,5.18330141 Z',
                  },
                },
              },
            },
          },
          template: {
            elementName: 'div',
            attributes: {'haiku-id': '1c2aee223193', 'haiku-title': 'Subicon'},
            children: [
              {
                elementName: 'svg',
                attributes: {
                  version: '1.1',
                  xmlns: 'http://www.w3.org/2000/svg',
                  'xmlns:xlink': 'http://www.w3.org/1999/xlink',
                  'haiku-id': '2ddb7a30bc67',
                  'haiku-title': 'haiku icon',
                  'haiku-source': 'designs/GeeWillikers.sketch.contents/slices/haiku icon.svg',
                },
                children: [
                  {
                    elementName: 'g',
                    attributes: {
                      'haiku-id': 'bbd20e6ff849',
                      'haiku-title': 'Page-1',
                      id: '6464874561f8',
                    },
                    children: [
                      {
                        elementName: 'g',
                        attributes: {
                          'haiku-id': '219ee859713c',
                          'haiku-title': 'Tutorial',
                          id: '013c6c1a4526',
                        },
                        children: [
                          {
                            elementName: 'g',
                            attributes: {
                              'haiku-id': 'facff35d920f',
                              'haiku-title': 'equation',
                              id: '780d91231bbf',
                            },
                            children: [
                              {
                                elementName: 'path',
                                attributes: {
                                  'haiku-id': '7615f4053edb',
                                  'haiku-title': 'haiku-icon',
                                  id: '2a5b178ac832',
                                },
                                children: [],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        attributes: {
          'haiku-id': 'b82634dcdeb1',
          'haiku-var': '_code_subicon_code',
          'haiku-title': 'Subicon',
          'haiku-source': './code/subicon/code.js',
        },
        children: [],
      },
    ],
  },
};
