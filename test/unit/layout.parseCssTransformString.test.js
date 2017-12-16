var test = require('tape')
var parseCssTransformString = require('./../../lib/helpers/parseCssTransformString').default

test('layout.parseCssTransformString', function (t) {
  var data = [
    [null, {}],
    ['none', {}],
    ['', {}],
    ['none  ', {}],
    ['none;  ', {}],
    [
      'translate(88.000000,87.000000)',
      { 'translation.x': 88, 'translation.y': 87 }
    ],
    ['translate(88.000000,87.000000) translate(-88.000000,-87.000000)', {}],
    [
      'translate(88.000000,87.000000) rotate(-90.00) translate(-88.000000,-87.000000)',
      { 'translation.x': 1, 'translation.y': 175, 'rotation.z': 4.71 }
    ],
    [
      'translate(55.500000, 68.500000) rotate(-9.000000) translate(-55.500000, -68.500000) translate(10.000000, 7.000000)',
      { 'translation.x': 0.94, 'translation.y': 14.87, 'rotation.z': 6.13 }
    ],
    [
      'translate(88.000000,87.000000) scale(1.5,1.5)',
      {
        'translation.x': 88,
        'translation.y': 87,
        'scale.x': 1.5,
        'scale.y': 1.5
      }
    ],
    [
      'rotate(45) translate(0.25,1.56)',
      { 'translation.x': -0.93, 'translation.y': 1.28, 'rotation.z': 0.79 }
    ],
    ['rotate(217) rotate(-32) rotate(56)', { 'rotation.z': 4.21 }],
    [
      'matrix3d(1,0,0,.1,-0.2,-.22,30000,1,0,0,0,1,0.2,0,0,1) translate3d(10px,20,20) matrix(0,6,4,3,2.2,0) scale3d(0,0,0) rotate3d(0,0.5,0,0) rotateZ(1.2);',
      {
        "scale.x": 0
      }
    ],
    [
      'translate(33.000000, 92.000000) rotate(10.000000) translate(-33.000000, -92.000000) translate(-2.000000, 1.000000)',
      {
        "translation.x": 14.33,
        "translation.y": -3.7,
        "rotation.z": 0.17
      }
    ],
    [
      'translate(43.270256, 92.695192) scale(-1, 1) rotate(10.000000) translate(-43.270256, -92.695192) translate(8.270256, 1.695192)',
      {
        "translation.x": 61.94,
        "translation.y": -3,
        "rotation.y": 3.14,
        "rotation.z": 2.97,
        "scale.x": -1,
        "scale.y": -1,
        "scale.z": -1
      }
    ],
    [
      'translate(3.14)',
      {
        "translation.x": 3.14,
      }
    ],
    [
      'scale(2.72)',
      {
        "scale.x": 2.72,
        "scale.y": 2.72,
      }
    ]
  ]

  t.plan(data.length)

  data.forEach(function ([transformString, expected], idx) {
    t.deepEqual(parseCssTransformString(transformString), expected, 'output is expected (' + idx + ')')
  })
})
