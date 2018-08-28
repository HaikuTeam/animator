import convertManaLayout from '@common/layout/convertManaLayout';
import {xmlToMana} from '@common/layout/xmlUtils';
import * as tape from 'tape';

tape(
  'layout.convertManaLayout',
  (t) => {
    const data = [
      // Width and height, proportional and absolute
      [
        {
          elementName: 'div',
          attributes: {
            width: '10px',
            height: '9px',
          },
          children: [],
        },
        {
          elementName: 'div',
          attributes: {
            'sizeAbsolute.x': 10,
            'sizeMode.x': 1,
            'sizeAbsolute.y': 9,
            'sizeMode.y': 1,
          },
          children: [],
        },
      ],
      [
        {
          elementName: 'div',
          attributes: {
            width: '10px',
            height: '9px',
          },
          children: [
            {
              elementName: 'div',
              attributes: {
                width: '50%',
                height: '40%',
              },
            },
          ],
        },
        {
          elementName: 'div',
          attributes: {
            'sizeAbsolute.x': 10,
            'sizeMode.x': 1,
            'sizeAbsolute.y': 9,
            'sizeMode.y': 1,
          },
          children: [
            {
              elementName: 'div',
              attributes: {
                'sizeProportional.x': 0.5,
                'sizeMode.x': 0,
                'sizeProportional.y': 0.4,
                'sizeMode.y': 0,
              },
            },
          ],
        },
      ],

      // One transform component
      [
        {
          elementName: 'div',
          attributes: {
            width: '10px',
            height: '9px',
            transform: 'translate(91.000, 103.000)',
          },
          children: [],
        },
        {
          elementName: 'div',
          attributes: {
            'sizeAbsolute.x': 10,
            'sizeMode.x': 1,
            'sizeAbsolute.y': 9,
            'sizeMode.y': 1,
            'translation.x': 91,
            'translation.y': 103,
          },
          children: [],
        },
      ],

      // Multiple of the same transform component
      [
        {
          elementName: 'div',
          attributes: {
            width: '10px',
            height: '9px',
            transform: 'translate(91.000, 103.000) translate(-91,-103)',
          },
          children: [],
        },
        {
          elementName: 'div',
          attributes: {
            'sizeAbsolute.x': 10,
            'sizeMode.x': 1,
            'sizeAbsolute.y': 9,
            'sizeMode.y': 1,
          },
          children: [],
        },
      ],

      // Multiple transform components, including rotation in a certain order
      [
        {
          elementName: 'div',
          attributes: {
            width: '10px',
            height: '9px',
            transform: 'translate(91.000, 103.000) rotate(45) translate(-91,-103)',
          },
          children: [],
        },
        {
          elementName: 'div',
          attributes: {
            'sizeAbsolute.x': 10,
            'sizeMode.x': 1,
            'sizeAbsolute.y': 9,
            'sizeMode.y': 1,
            'translation.x': 99.485,
            'translation.y': -34.179,
            'rotation.z': 0.785,
          },
          children: [],
        },
      ],

      // SVG width/height attributes converted to absolute size
      [
        {
          elementName: 'svg',
          attributes: {
            width: '46px',
            height: '50px',
            viewBox: '0 0 46 50',
            version: '1.1',
            xmlns: 'http://www.w3.org/2000/svg',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink',
            source: 'designs/micro.sketch.contents/slices/Rectangle.svg',
            'haiku-title': 'Rectangle',
            'haiku-id': 'b7f18dbaf7ac',
            style: {
              position: 'absolute',
              margin: '0',
              padding: '0',
              border: '0',
            },
          },
          children: [
            {
              elementName: 'title',
              attributes: {'haiku-id': '99684d56ea7e'},
              children: ['Rectangle'],
            }, {
              elementName: 'desc',
              attributes: {'haiku-id': '0e6c5b97af5f'},
              children: ['Created with sketchtool.'],
            }, {
              elementName: 'defs',
              attributes: {'haiku-id': '2a5ec220ae44'},
              children: [
                {
                  elementName: 'rect',
                  attributes: {
                    id: 'path-1',
                    x: '0',
                    y: '0',
                    width: '46',
                    height: '50',
                    'haiku-id': '20d913d3fcf8',
                  },
                  children: [],
                },
              ],
            }, {
              elementName: 'g',
              attributes: {
                id: 'Page-1',
                stroke: 'none',
                'stroke-width': '1',
                fill: 'none',
                'fill-rule': 'evenodd',
                'haiku-id': 'fb169d324879',
              },
              children: [
                {
                  elementName: 'g',
                  attributes: {
                    id: 'Rectangle',
                    'haiku-id': '61a523e67bad',
                  },
                  children: [
                    {
                      elementName: 'use',
                      attributes: {
                        fill: '#D8D8D8',
                        'fill-rule': 'evenodd',
                        'xlink:href': '#path-1',
                        'haiku-id': '0a31b66236b0',
                      },
                      children: [],
                    }, {
                      elementName: 'rect',
                      attributes: {
                        stroke: '#979797',
                        'stroke-width': '1',
                        x: '0.5',
                        y: '0.5',
                        width: '45',
                        height: '49',
                        'haiku-id': '23b3ddd85804',
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          elementName: 'svg',
          attributes: {
            viewBox: '0 0 46 50',
            version: '1.1',
            xmlns: 'http://www.w3.org/2000/svg',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink',
            source: 'designs/micro.sketch.contents/slices/Rectangle.svg',
            'haiku-title': 'Rectangle',
            'haiku-id': 'b7f18dbaf7ac',
            style: {
              position: 'absolute',
              margin: '0',
              padding: '0',
              border: '0',
            },
            'sizeAbsolute.x': 46,
            'sizeMode.x': 1,
            'sizeAbsolute.y': 50,
            'sizeMode.y': 1,
          },
          children: [
            {
              elementName: 'title',
              attributes: {
                'haiku-id': '99684d56ea7e',
              },
              children: [
                'Rectangle',
              ],
            },
            {
              elementName: 'desc',
              attributes: {
                'haiku-id': '0e6c5b97af5f',
              },
              children: [
                'Created with sketchtool.',
              ],
            },
            {
              elementName: 'defs',
              attributes: {
                'haiku-id': '2a5ec220ae44',
              },
              children: [
                {
                  elementName: 'rect',
                  attributes: {
                    id: 'path-1',
                    x: '0',
                    y: '0',
                    width: '46',
                    height: '50',
                    'haiku-id': '20d913d3fcf8',
                  },
                  children: [],
                },
              ],
            },
            {
              elementName: 'g',
              attributes: {
                id: 'Page-1',
                stroke: 'none',
                'stroke-width': '1',
                fill: 'none',
                'fill-rule': 'evenodd',
                'haiku-id': 'fb169d324879',
              },
              children: [
                {
                  elementName: 'g',
                  attributes: {
                    id: 'Rectangle',
                    'haiku-id': '61a523e67bad',
                  },
                  children: [
                    {
                      elementName: 'use',
                      attributes: {
                        fill: '#D8D8D8',
                        'fill-rule': 'evenodd',
                        'xlink:href': '#path-1',
                        'haiku-id': '0a31b66236b0',
                      },
                      children: [],
                    },
                    {
                      elementName: 'rect',
                      attributes: {
                        stroke: '#979797',
                        'stroke-width': '1',
                        x: '0.5',
                        y: '0.5',
                        width: '45',
                        height: '49',
                        'haiku-id': '23b3ddd85804',
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

      // GRAY SQUARE WITH GRAY BORDER
      [
        // tslint:disable:max-line-length
        xmlToMana(`
        <svg width="46px" height="50px" viewBox="0 0 46 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <!-- Generator: sketchtool 44.1 (41455) - http://www.bohemiancoding.com/sketch -->
            <title>Rectangle</title>
            <desc>Created with sketchtool.</desc>
            <defs>
                <rect id="path-1" x="0" y="0" width="46" height="50"></rect>
            </defs>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Rectangle">
                    <use fill="#D8D8D8" fill-rule="evenodd" xlink:href="#path-1"></use>
                    <rect stroke="#979797" stroke-width="1" x="0.5" y="0.5" width="45" height="49"></rect>
                </g>
            </g>
        </svg>
      `),
        // tslint:enable:max-line-length
        {
          elementName: 'svg',
          attributes: {
            viewBox: '0 0 46 50',
            version: 1.1,
            xmlns: 'http://www.w3.org/2000/svg',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink',
            'sizeAbsolute.x': 46,
            'sizeMode.x': 1,
            'sizeAbsolute.y': 50,
            'sizeMode.y': 1,
          },
          children: [
            {
              elementName: 'title',
              attributes: {},
              children: [
                'Rectangle',
              ],
            },
            {
              elementName: 'desc',
              attributes: {},
              children: [
                'Created with sketchtool.',
              ],
            },
            {
              elementName: 'defs',
              attributes: {},
              children: [
                {
                  elementName: 'rect',
                  attributes: {
                    id: 'path-1',
                    x: 0,
                    y: 0,
                    width: 46,
                    height: 50,
                  },
                  children: [],
                },
              ],
            },
            {
              elementName: 'g',
              attributes: {
                id: 'Page-1',
                stroke: 'none',
                'stroke-width': 1,
                fill: 'none',
                'fill-rule': 'evenodd',
              },
              children: [
                {
                  elementName: 'g',
                  attributes: {
                    id: 'Rectangle',
                  },
                  children: [
                    {
                      elementName: 'use',
                      attributes: {
                        fill: '#D8D8D8',
                        'fill-rule': 'evenodd',
                        'xlink:href': '#path-1',
                      },
                      children: [],
                    },
                    {
                      elementName: 'rect',
                      attributes: {
                        stroke: '#979797',
                        'stroke-width': 1,
                        x: 0.5,
                        y: 0.5,
                        width: 45,
                        height: 49,
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

      // RED BALLOON TILTED COUNTERCLOCKWISE: I want b-1 to have translation of 1,14.5
      [
        // tslint:disable:max-line-length
        xmlToMana(`
        <?xml version="1.0" encoding="UTF-8"?>
        <svg width="91px" height="299px" viewBox="0 0 91 299" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <!-- Generator: sketchtool 44.1 (41455) - http://www.bohemiancoding.com/sketch -->
            <title>b-red</title>
            <desc>Created with sketchtool.</desc>
            <defs></defs>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Artboard-9-Copy-3" transform="translate(-308.000000, -171.000000)">
                    <g id="b-red" transform="translate(300.000000, 164.000000)">
                        <g id="b-1" transform="translate(55.500000, 68.500000) rotate(-9.000000) translate(-55.500000, -68.500000) translate(10.000000, 7.000000)">
                            <path d="M46.3498182,114.172431 C46.3498182,114.172431 39.2149514,118.282362 39.2149514,122.005495 C41.2002738,122.392293 51.3199814,122.392293 53.3919611,122.392293 C53.3919607,117.555942 46.3498182,114.172431 46.3498182,114.172431 Z" id="Path-27-Copy" fill="#CF7082"></path>
                            <path d="M46.3561544,0.446309359 C64.7542657,0.446309361 90.5865937,9.05447383 90.5865949,47.919807 C90.586596,86.7851401 57.4665988,112.943072 46.3561561,112.943065 C35.2457134,112.943059 0.722507514,85.3112793 0.722506913,47.9198087 C0.722506312,10.5283382 27.9580431,0.446309358 46.3561544,0.446309359 Z" id="Path-25-Copy" fill="#CF7082"></path>
                            <path d="M67.3659935,15.3266745 C67.3659935,15.3266745 88.8845794,27.339563 80.3313155,66.2427146 C77.8725537,77.4259994 77.1597188,69.1750798 77.1597188,69.1750798 L67.3659935,15.3266745 Z" id="Path-26-Copy" fill="#BC6072"></path>
                            <path d="M43.6821931,113.924298 C43.6969355,113.086222 44.3867795,112.418569 45.242687,112.433394 L47.5275468,112.472968 C48.3746414,112.48764 49.0494989,113.173086 49.0346536,114.017005 L49.0346536,114.017005 C49.0199112,114.85508 48.3300672,115.522734 47.4741597,115.507909 L45.1892999,115.468335 C44.3422053,115.453663 43.6673478,114.768217 43.6821931,113.924298 L43.6821931,113.924298 L43.6821931,113.924298 Z" id="Rectangle-5-Copy-2" fill="#E3E3E3"></path>
                        </g>
                        <path d="M65,123 L96,304" id="L-1" stroke="#E3E3E3" stroke-width="2" stroke-linecap="square"></path>
                    </g>
                </g>
            </g>
        </svg>
      `),
        {
          elementName: 'svg',
          attributes: {
            viewBox: '0 0 91 299',
            version: 1.1,
            xmlns: 'http://www.w3.org/2000/svg',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink',
            'sizeAbsolute.x': 91,
            'sizeMode.x': 1,
            'sizeAbsolute.y': 299,
            'sizeMode.y': 1,
          },
          children: [
            {
              elementName: 'title',
              attributes: {},
              children: [
                'b-red',
              ],
            },
            {
              elementName: 'desc',
              attributes: {},
              children: [
                'Created with sketchtool.',
              ],
            },
            {
              elementName: 'defs',
              attributes: {},
              children: [],
            },
            {
              elementName: 'g',
              attributes: {
                id: 'Page-1',
                stroke: 'none',
                'stroke-width': 1,
                fill: 'none',
                'fill-rule': 'evenodd',
              },
              children: [
                {
                  elementName: 'g',
                  attributes: {
                    id: 'Artboard-9-Copy-3',
                    'translation.x': -308,
                    'translation.y': -171,
                  },
                  children: [
                    {
                      elementName: 'g',
                      attributes: {
                        id: 'b-red',
                        'translation.x': 300,
                        'translation.y': 164,
                      },
                      children: [
                        {
                          elementName: 'g',
                          attributes: {
                            id: 'b-1',
                            'translation.x': 0.939,
                            'translation.y': 14.875,
                            'rotation.z': 6.126,
                          },
                          children: [
                            {
                              elementName: 'path',
                              attributes: {
                                d: 'M46.3498182,114.172431 C46.3498182,114.172431 39.2149514,118.282362 39.2149514,122.005495 C41.2002738,122.392293 51.3199814,122.392293 53.3919611,122.392293 C53.3919607,117.555942 46.3498182,114.172431 46.3498182,114.172431 Z',
                                id: 'Path-27-Copy',
                                fill: '#CF7082',
                              },
                              children: [],
                            },
                            {
                              elementName: 'path',
                              attributes: {
                                d: 'M46.3561544,0.446309359 C64.7542657,0.446309361 90.5865937,9.05447383 90.5865949,47.919807 C90.586596,86.7851401 57.4665988,112.943072 46.3561561,112.943065 C35.2457134,112.943059 0.722507514,85.3112793 0.722506913,47.9198087 C0.722506312,10.5283382 27.9580431,0.446309358 46.3561544,0.446309359 Z',
                                id: 'Path-25-Copy',
                                fill: '#CF7082',
                              },
                              children: [],
                            },
                            {
                              elementName: 'path',
                              attributes: {
                                d: 'M67.3659935,15.3266745 C67.3659935,15.3266745 88.8845794,27.339563 80.3313155,66.2427146 C77.8725537,77.4259994 77.1597188,69.1750798 77.1597188,69.1750798 L67.3659935,15.3266745 Z',
                                id: 'Path-26-Copy',
                                fill: '#BC6072',
                              },
                              children: [],
                            },
                            {
                              elementName: 'path',
                              attributes: {
                                d: 'M43.6821931,113.924298 C43.6969355,113.086222 44.3867795,112.418569 45.242687,112.433394 L47.5275468,112.472968 C48.3746414,112.48764 49.0494989,113.173086 49.0346536,114.017005 L49.0346536,114.017005 C49.0199112,114.85508 48.3300672,115.522734 47.4741597,115.507909 L45.1892999,115.468335 C44.3422053,115.453663 43.6673478,114.768217 43.6821931,113.924298 L43.6821931,113.924298 L43.6821931,113.924298 Z',
                                id: 'Rectangle-5-Copy-2',
                                fill: '#E3E3E3',
                              },
                              children: [],
                            },
                          ],
                        },
                        {
                          elementName: 'path',
                          attributes: {
                            d: 'M65,123 L96,304',
                            id: 'L-1',
                            stroke: '#E3E3E3',
                            'stroke-width': 2,
                            'stroke-linecap': 'square',
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
        // tslint:enable:max-line-length
      ],

      // DOCTYPE declaration should not crash
      [
        // tslint:disable:max-line-length
        xmlToMana(`
          <?xml version="1.0" encoding="UTF-8" standalone="no"?>
          <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
          <svg width="100%" height="100%" viewBox="0 0 400 400" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
              <ellipse cx="192.864" cy="190.365" rx="71.408" ry="58.444" style="fill:rgb(235,235,235);"/>
          </svg>
      `),
        // tslint:enable:max-line-length
        {elementName: 'svg',
          attributes: {
            viewBox: '0 0 400 400',
            version: 1.1,
            xmlns: 'http://www.w3.org/2000/svg',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink',
            'xml:space': 'preserve',
            'xmlns:serif': 'http://www.serif.com/',
            style: {
              'fill-rule': 'evenodd',
              'clip-rule': 'evenodd',
              'stroke-linejoin': 'round',
              'stroke-miterlimit': '1.41421px',
            },
            'sizeProportional.x': 1,
            'sizeMode.x': 0,
            'sizeProportional.y': 1,
            'sizeMode.y': 0,
            'sizeAbsolute.x': 400,
            'sizeAbsolute.y': 400,
          },
          children: [
            {
              elementName: 'ellipse',
              attributes: {
                cx: 192.864,
                cy: 190.365,
                rx: 71.408,
                ry: 58.444,
                style: {fill: 'rgb(235,235,235)'},
              },
              children: [],
            },
          ],
        },
      ],

      // Generic elements should see their x and y attributes stripped off.
      [
        {
          elementName: 'svg',
          attributes: {
            x: '10',
            y: '20',
            transform: 'translate(10)',
          },
          children: [],
        },
        {
          elementName: 'svg',
          attributes: {
            'translation.x': 10,
            'sizeMode.x': 1,
            'sizeMode.y': 1,
            'sizeAbsolute.x': 100,
            'sizeAbsolute.y': 100,
          },
          children: [],
        },
      ],

      // Image elements should preserve their x and y attributes.
      [
        {
          elementName: 'image',
          attributes: {
            x: '10',
            y: '20',
            transform: 'translate(10)',
          },
          children: [],
        },
        {
          elementName: 'image',
          attributes: {
            x: '10',
            y: '20',
            'translation.x': 10,
          },
          children: [],
        },
      ],

      [
        xmlToMana(`
        <svg width="119" height="112" viewBox="0 0 119 112">
            <g data-name="Canvas" fill="none">
                <g data-name="Shape">
                    <g transform="translate(9 3)">
                        <use xlink:href="#path0" fill="#A3875E"/>
                    </g>
                </g>
                <g data-name="Group">
                    <g data-name="Shape">
                        <g transform="translate(37.1712 68.4771)">
                            <use xlink:href="#path1" fill="#DBB67E"/>
                        </g>
                    </g>
                    <g data-name="Shape">
                        <g transform="translate(47.1714 38.114)">
                            <use xlink:href="#path2" fill="#DBB67E"/>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
      `),
        {
          elementName: 'svg',
          attributes: {
            viewBox: '0 0 119 112',
            'sizeAbsolute.x': 119,
            'sizeMode.x': 1,
            'sizeAbsolute.y': 112,
            'sizeMode.y': 1,
          },
          children: [
            {
              elementName: 'g',
              attributes: {
                'data-name': 'Canvas',
                fill: 'none',
              },
              children: [
                {
                  elementName: 'g',
                  attributes: {'data-name': 'Shape'},
                  children: [
                    {
                      elementName: 'g',
                      attributes: {
                        'translation.x': 9,
                        'translation.y': 3,
                      },
                      children: [
                        {
                          elementName: 'use',
                          attributes: {
                            'xlink:href': '#path0',
                            fill: '#A3875E',
                          },
                          children: [],
                        },
                      ],
                    },
                  ],
                }, {
                  elementName: 'g',
                  attributes: {'data-name': 'Group'},
                  children: [
                    {
                      elementName: 'g',
                      attributes: {'data-name': 'Shape'},
                      children: [
                        {
                          elementName: 'g',
                          attributes: {
                            'translation.x': 37.171,
                            'translation.y': 68.477,
                          },
                          children: [
                            {
                              elementName: 'use',
                              attributes: {
                                'xlink:href': '#path1',
                                fill: '#DBB67E',
                              },
                              children: [],
                            },
                          ],
                        },
                      ],
                    }, {
                      elementName: 'g',
                      attributes: {'data-name': 'Shape'},
                      children: [
                        {
                          elementName: 'g',
                          attributes: {
                            'translation.x': 47.171,
                            'translation.y': 38.114,
                          },
                          children: [
                            {
                              elementName: 'use',
                              attributes: {
                                'xlink:href': '#path2',
                                fill: '#DBB67E',
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
      ],

      [
        xmlToMana(`
          <rect
            x="87.826"
            y="164.369"
            transform="matrix(0.9551 -0.2964 0.2964 0.9551 -52.7748 44.7846)"
            fill="#3FA9F5"
            width="67.002"
            height="64.183"
          />
        `),
        {
          elementName: 'rect',
          attributes: {
            x: 87.826,
            y: 164.369,
            fill: '#3FA9F5',
            width: 67.002,
            height: 64.183,
            'translation.x': -52.775,
            'translation.y': 44.785,
            'rotation.z': 5.982,
          },
          children: [],
        },
      ],
    ];

    t.plan(data.length);

    data.forEach(([input, output], index) => {
      const result = convertManaLayout(input);
      t.deepEqual(
        result,
        output,
        `mana layout was correctly converted (${index})`,
      );
    });
  },
);
