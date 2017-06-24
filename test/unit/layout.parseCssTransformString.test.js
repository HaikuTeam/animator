var test = require('tape')
var parseCssTransformString = require('./../../src/helpers/parseCssTransformString')

test('layout.parseCssTransformString', function(t) {
  var data = [
    [null, {}],
    ['none', {}],
    ['', {}],
    ['none  ', {}],
    ['none;  ', {}],
    ['translate(88.000000,87.000000)',{"translation.x":88,"translation.y":87}],
    ['translate(88.000000,87.000000) translate(-88.000000,-87.000000)',{}],
    ['translate(88.000000,87.000000) rotate(-90.00) translate(-88.000000,-87.000000)',{"translation.x":1,"translation.y":175,"rotation.z":4.71}],
    ['translate(55.500000, 68.500000) rotate(-9.000000) translate(-55.500000, -68.500000) translate(10.000000, 7.000000)',{"translation.x":0.94,"translation.y":14.87,"rotation.z":6.13}],
    ['translate(88.000000,87.000000) scale(1.5,1.5)',{"translation.x":88,"translation.y":87,"scale.x":1.5,"scale.y":1.5}],
    ['rotate(45) translate(0.25,1.56)',{"translation.x":-0.93,"translation.y":1.28,"rotation.z":0.79}],
    ['rotate(217) rotate(-32) rotate(56)',{"rotation.z":4.21}],
    ['matrix3d(1,0,0,.1,-0.2,-.22,30000,1,0,0,0,1,0.2,0,0,1) translate3d(10px,20,20) matrix(0,6,4,3,2.2,0) scale3d(0,0,0) rotate3d(0,0.5,0,0) rotateZ(1.2);',{"translation.x":0.2,"translation.y":-0.1,"translation.z":14211.27,"rotation.y":1.57,"rotation.z":1.57,"scale.x":0,"scale.y":0,"scale.z":0}],
  ]

  t.plan(data.length)

  data.forEach(function(tuple,idx) {
    var a = JSON.stringify(parseCssTransformString(tuple[0]))
    var b = JSON.stringify(tuple[1])
    // console.log(JSON.stringify(tuple[0]))
    // console.log(b)
    t.equal(a, b, 'output is expected (' + idx + ')')
  })
})
