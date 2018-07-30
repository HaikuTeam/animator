const tape = require('tape')
const Expression = require('./../../src/bll/Expression')

tape('Expression.parseValue', (t) => {
  const tests = [
    [1,undefined,1],
    [[{a:1}],undefined,[{a:1}]],
    ['',undefined,''],
    ['  ',undefined,'  '],
    ['😍',undefined,'😍'],
    ['0',undefined,0],
    ['.00000001',undefined,1e-8],
    ['1e-8',undefined,1e-8],
    ['0.232',undefined,0.232],
    ['-55.5',undefined,-55.5],
    ['-55.5*90',undefined,-4995],
    ['null',undefined,null],
    ['NaN',undefined,1],
    ['-Infinity',undefined,1],
    ['1/0',undefined,1],
    [1/0,undefined,1],
    ['Hello I am some text content',undefined,'Hello I am some text content'],
    ['Hello I am some\nnewlined text content',undefined,'Hello I am some\nnewlined text content'],
    ['"Hello I am some \'quoted\' text content"',undefined,'Hello I am some \'quoted\' text content'],
    ['10px',undefined,10],
    ['10 px',undefined,10],
    ['10px','translation.x',10],
    ['10 pixels','width',10],
    [NaN,'width',1],
    ['1.000000','width',1.00000],
    ['10','rotation.x',10],
    ['10rad','rotation.x',10],
    ['10deg','rotation.x',0.17453292519943295],
    ['10 degrees','rotation.x',0.17453292519943295],
    ['10 degs','rotation.x',0.17453292519943295],
    ['10°','rotation.x',0.17453292519943295],
    ['10°foo','rotation.x',10], // Unknown unit, return the initial number
    ['[1,2,3]',undefined,[1,2,3]],
    ['[1,2,"a"]',undefined,[1,2,'a']],
    ['[{b:123,c:[5]},2,"a"]',undefined,[{b:123,c:[5]},2,"a"]],
    ['\n\n[{b:123,c:\n[5]},2,"a"]\n;',undefined,[{b:123,c:[5]},2,"a"]],
    ['M10 10 H 90 V\n90 H 10 L 10 10',undefined,'M10 10 H 90 V\n90 H 10 L 10 10'],
    ['true',undefined,true],
    ['false',undefined,false],
    ['\nfalse',undefined,false],
    [';;;;',undefined,';;;;'], // Tokenizer cannot parse this
    ['[[[[[[]',undefined,'[[[[[[]'], // Tokenizer cannot parse this
    ['$helpers',undefined,'$helpers'],
    ['$user.mouse.x',undefined,'$user.mouse.x'],
    ['=abc',undefined,'=abc'],
    ['*',undefined,'*'],
    ['/haha/',undefined,'/haha/'],
    ['(hi)',undefined,'(hi)'],
    ['""asdf"";"\n\n""',undefined,'""asdf"";"\n\n""'],
    ['Number',undefined,'Number'],
    ['window',undefined,'window'],
    ['this',undefined,'this'],
    ['function(){}',undefined,'function(){}'],
    ['Math.PI',undefined,3.141592653589793],
    ['return 123;',undefined,'return 123;'],
    ['\n\n\n',undefined,'\n\n\n'],
    ['simplified Chinese: 汉字; traditional Chinese: 漢字; pinyin: hànzì;',undefined,'simplified Chinese: 汉字; traditional Chinese: 漢字; pinyin: hànzì;'],
    ['123.3 x','translation.x',123.3],
    ['  123.3 x omg wow','translation.y',123.3],
    ['  123.3 x omg wow','shown',true],
  ]
  t.plan(tests.length)
  tests.forEach((spec) => {
    t.deepEqual(Expression.parseValue(spec[0], spec[1]), spec[2])
  })
})
