const test = require('tape')
const marshalParams = require('./../../lib/reflection/marshalParams').default
const {toText} = require('./../../lib/reflection/JavaScriptIdentifier')

test('marshalParams', (t) => {
  t.plan(2)
  const params = ['foo', 'with', 'foo.bar', '0fo漢o//+123d-.\\f93a~`\'']
  const marshalled = marshalParams(params)
  t.equal(marshalled, "foo, _$with$_, foo_$46$_bar, _$48$_fo_$28450$_o_$47$__$47$__$43$_123d_$45$__$46$__$92$_f93a_$126$__$96$__$39$_")
  const texts = marshalled.split(', ').map(toText)
  t.deepEqual(texts, params)
})
