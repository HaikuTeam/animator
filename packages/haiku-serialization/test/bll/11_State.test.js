const tape = require('tape')
const State = require('./../../src/bll/State')

tape('State.recast', (t) => {
  const tests = [
    [{value:1},{ value: 1, mock: undefined, type: 'number' }],
    [{value:'1'},{ value: 1, mock: undefined, type: 'number' }],
    [{value:'1.0012'},{ value: 1.0012, mock: undefined, type: 'number' }],
    [{value:'{}'},{ value: {}, mock: undefined, type: 'object' }],
    [{value:{}},{ value: {}, mock: undefined, type: 'object' }],
    [{value:{foo:1}},{ value: { foo: 1 }, mock: undefined, type: 'object' }],
    [{value:'{"foo":1}'},{ value: { foo: 1 }, mock: undefined, type: 'object' }],
    [{value:'[]'},{ value: [], mock: undefined, type: 'array' }],
    [{value:'[1,2,"3"]'},{ value: [ 1, 2, '3' ], mock: undefined, type: 'array' }],
    [{value:[1,2,"3"]},{ value: [ 1, 2, '3' ], mock: undefined, type: 'array' }],
    [{value:null},{ value: null, mock: undefined, type: 'any' }],
    [{value:'null'},{ value: null, mock: undefined, type: 'any' }],
    [{value:undefined},{ value: undefined, mock: undefined, type: 'any' }],
    [{value:'undefined'},{ value: undefined, mock: undefined, type: 'any' }],
    [{value:'true'},{ value: true, mock: undefined, type: 'boolean' }],
    [{value:'false'},{ value: false, mock: undefined, type: 'boolean' }],
    [{value:''},{ value: '', mock: undefined, type: 'string' }],
    [{value:'     '},{ value: '     ', mock: undefined, type: 'string' }],
    [{value:'     \n\n  '},{ value: '     \n\n  ', mock: undefined, type: 'string' }],
    [{value:'\'1'},{ value: '\'1', mock: undefined, type: 'string' }],
    [{value:1,type:'string'},{ type: 'string', value: 1, mock: undefined }],
    [{value:"foo",type:'number'},{ type: 'number', value: 'foo', mock: undefined }],
    [{value:"[]",type:'string'},{ type: 'string', value: [], mock: undefined }],
    [{value:{foo:1},type:'string'},{ type: 'string', value: { foo: 1 }, mock: undefined }],
    [{value:"{a: 1,b:2,c:[1,2]}"},{ value: { a: 1, b: 2, c: [ 1, 2 ] }, mock: undefined, type: 'object' }],
    [{value:"10px"},{ value: 10, mock: undefined, type: 'number' }],
    [{value:"30 rad"},{ value: 30, mock: undefined, type: 'number' }],
    [{value:"'1px'"},{ value: '1px', mock: undefined, type: 'string' }],
    [{value:"\"1px\""},{ value: '1px', mock: undefined, type: 'string' }],
    [{value:"99 bottles of beer on the wall"},{ value: '99 bottles of beer on the wall', mock: undefined, type: 'string' }],
    [{value:"   16 men and a bottle of rum"},{ value: '   16 men and a bottle of rum', mock: undefined, type: 'string' }],
  ]
  tests.forEach((spec) => {
    t.deepEqual(State.recast(spec[0]), spec[1])
  })
  t.end()
})
