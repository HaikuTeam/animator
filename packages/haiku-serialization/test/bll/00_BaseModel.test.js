const tape = require('tape')
const BaseModel = require('./../../src/bll/BaseModel')

tape('BaseModel', (t) => {
  t.plan(28)
  t.ok(BaseModel, 'base model exists')
  class Foo extends BaseModel {}
  BaseModel.extend(Foo)
  t.ok(Foo, 'model class ok')
  t.ok(Foo.on, 'model class has on')
  t.ok(Foo.emit, 'model class has emit')
  const foo = new Foo()
  t.ok(foo, 'model instance exists')
  t.ok(foo.emit, 'model instance has emit')
  t.ok(foo.on, 'model instance has on')
  class Baz extends BaseModel {
    constructor (props, opts) {
      super(props, opts)
    }
  }
  BaseModel.extend(Baz)
  const baz1 = new Baz({ qux: 1 })
  const baz2 = new Baz({ qux: 2 })
  const baz3 = new Baz({ qux: 3 })
  t.equal(Baz.all().length, 3, '3 bazzes')
  t.equal(Baz.find({ qux: 3 }), baz3, 'bazzes can be found')
  t.equal(Baz.findById(baz1.uid), baz1, 'bazzes can be found by id')
  Baz.on('yay', (inst, a, b) => {
    t.equal(inst, baz2, 'instance passed to class listener is instance')
    t.equal(a, 123, 'class payload a ok')
    t.equal(b, 456, 'class payload b ok')
  })
  baz2.on('yay', (a, b) => {
    t.equal(a, 123, 'inst payload a ok')
    t.equal(b, 456, 'inst payload b ok')
  })
  baz2.emit('yay', 123, 456)
  class Bar extends BaseModel {}
  BaseModel.extend(Bar, { primaryKey: 'relpath' })
  const bar1 = new Bar({ relpath: 'abc' })
  t.equal(bar1.getPrimaryKey(), 'abc')
  const bar1b = Bar.upsert({ relpath: 'abc', foo: 101 })
  t.equal(bar1b, bar1)
  t.equal(Bar.count(), 1)
  t.equal(bar1.foo, 101)
  bar1.destroy()
  t.equal(Bar.count(), 0)
  class Qux extends BaseModel {}
  Qux.DEFAULT_OPTIONS = { foo: 1, required: { blah: true } }
  BaseModel.extend(Qux)
  try {
    const qux1 = new Qux({ meow: 2 })
  } catch (exception) {
    t.equal(exception.message, 'Property \'blah\' is required')
  }
  const qux2 = new Qux({ blah: false })
  t.equal(qux2.options.foo, 1)
  class Bop extends BaseModel {}
  BaseModel.extend(Bop)
  const bop1 = new Bop()
  t.equal(bop1.didUpdateSinceLastCheck(), true, 'first time did update')
  t.equal(bop1.didUpdateSinceLastCheck(), false, 'second times did not')
  t.equal(bop1.didUpdateSinceLastCheck(), false, 'second times did not')
  const roygbiv1 = bop1.cacheFetch('roy.g.biv', () => 123)
  t.equal(roygbiv1, 123, 'cache can fetch')
  bop1.cacheClear()
  const roygbiv2 = bop1.cacheFetch('roy.g.biv', () => 456)
  t.equal(roygbiv2, 456)
  bop1.cacheSet('roy.g.biv', 789)
  t.equal(bop1.cacheGet('roy.g.biv'), 789)
})
