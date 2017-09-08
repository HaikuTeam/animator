'use strict'

var test = require('tape')
var States = require('./../src/States')

test('States', function(t) {
  var tests = [
    [{value:1},{value:1,type:'number'}],
    [{value:'1'},{value:1,type:'number'}],
    [{value:'1.0012'},{value:1.0012,type:'number'}],
    [{value:'{}'},{"value":{},"type":"object"}],
    [{value:{}},{"value":{},"type":"object"}],
    [{value:{foo:1}},{"value":{"foo":1},"type":"object"}],
    [{value:'{"foo":1}'},{"value":{"foo":1},"type":"object"}],
    [{value:'[]'},{"value":[],"type":"array"}],
    [{value:'[1,2,"3"]'},{"value":[1,2,"3"],"type":"array"}],
    [{value:[1,2,"3"]},{"value":[1,2,"3"],"type":"array"}],
    [{value:null},{"value":null,"type":"any"}],
    [{value:'null'},{"value":null,"type":"any"}],
    [{value:undefined},{"type":"any","value":null}],
    [{value:'undefined'},{"value":null,"type":"any"}],
    [{value:'true'},{"value":true,"type":"boolean"}],
    [{value:'false'},{"value":false,"type":"boolean"}],
    [{value:''},{"value":"","type":"string"}],
    [{value:'     '},{"value":"     ","type":"string"}],
    [{value:'     \n\n  '},{"value":"     \n\n  ","type":"string"}],
    [{value:'\'1'},{"value":"'1","type":"string"}],
    [{value:1,type:'string'},{"type":"string","value":"1"}], // Forced
    [{value:"foo",type:'number'},{"type":"number","value":0}], // Forced
    [{value:"[]",type:'string'},{"type":"string","value":"[]"}], // Forced
    [{value:{foo:1},type:'string'},{"type":"string","value":"{\"foo\":1}"}], // Forced
  ]
  t.plan(tests.length)
  tests.forEach((spec) => {
    t.equal(JSON.stringify(States.autoCastToType(spec[0])), JSON.stringify(spec[1]))
  })
})
