var test = require('tape')
var path = require('path')
var File = require('haiku-serialization/src/model/File')()
var Asset = require('./../../lib/Asset')

test('Asset.assetsToDirectoryStructure', function(t) {
  t.plan(5)

  return File.ingestFromFolder(path.join(__dirname, '..', 'fixtures', 'projects', 'test-project'), {}, (err, files) => {
    t.ok(!err, 'no error ingesting')
    var dir = Asset.assetsToDirectoryStructure(files)
    t.ok(dir[0].type === 'sketch')
    t.ok(dir[0].artboards.type === 'folder')
    t.ok(dir[0].slices.type === 'folder')
    t.ok(dir[0].pages.type === 'folder')
  })
})
