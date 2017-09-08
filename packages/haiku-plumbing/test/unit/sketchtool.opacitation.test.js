var test = require('tape')
var path = require('path')
var fse = require('haiku-fs-extra')
var Sketch = require('./../../lib/Sketch')

var ASSET_PATH = path.join(__dirname, '..', 'fixtures', 'files', 'designs', 'sketchtool-opacity.sketch')
var DEST_PATH = path.join(__dirname, '..', 'fixtures', 'files', 'designs', 'sketchtool-opacity.sketch.contents')

test('sketchtool.opacitation', function(t) {
  t.plan(1)
  fse.removeSync(DEST_PATH)
  Sketch.sketchtoolPipeline(ASSET_PATH)
  var fixedSvgExample = fse.readFileSync(path.join(DEST_PATH, 'slices', 'Badge.svg')).toString()
  // console.log(fixedSvgExample)
  // Not sure the best way to test this, but I'll keep this example here in case
  // someone thinks of a good idea
  fse.removeSync(DEST_PATH)
  t.ok(fixedSvgExample)
})
