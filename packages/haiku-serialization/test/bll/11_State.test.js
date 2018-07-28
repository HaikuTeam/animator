const tape = require('tape')
const State = require('./../../src/bll/State')

tape('State.autoCastToType', (t) => {
  const tests = [
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
    [{value:"{a: 1,b:2,c:[1,2]}"},{"value":{"a":1,"b":2,"c":[1,2]},"type":"object"}],
  ]
  t.plan(tests.length)
  tests.forEach((spec) => {
    t.equal(JSON.stringify(State.autoCastToType(spec[0])), JSON.stringify(spec[1]))
  })
})

tape('State.recast', (t) => {
  const tests = [
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
    [{value:1,type:'string'},{"type":"number","value":1}],
    [{value:"foo",type:'number'},{"type":"string","value":"foo"}],
    [{value:"[]",type:'string'},{"type":"array","value":[]}],
    [{value:{foo:1},type:'string'},{"type":"object","value":{foo: 1}}],
    [{value:"{a: 1,b:2,c:[1,2]}"},{"value":{"a":1,"b":2,"c":[1,2]},"type":"object"}],
  ]
  t.plan(tests.length)
  tests.forEach((spec) => {
    t.equal(JSON.stringify(State.recast(spec[0])), JSON.stringify(spec[1]))
  })
})
