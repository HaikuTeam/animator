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
            'translation.x': 99.485283,
            'translation.y': -34.178715,
            'rotation.z': 0.785398,
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
                            'translation.x': 37.1712,
                            'translation.y': 68.477097,
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
                            'translation.x': 47.171398,
                            'translation.y': 38.113998,
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
            'translation.x': -52.774799,
            'translation.y': 44.784599,
            'rotation.z': 5.982275,
            'scale.x': 1.000034,
            'scale.y': 1.000034,
          },
          children: [],
        },
      ],
    ];

    t.plan(data.length);

    data.forEach(([input, output], index) => {
      const result = convertManaLayout(input);
      console.log(JSON.stringify(result));
      t.deepEqual(
        result,
        output,
        `mana layout was correctly converted (${index})`,
      );
    });
  },
);
