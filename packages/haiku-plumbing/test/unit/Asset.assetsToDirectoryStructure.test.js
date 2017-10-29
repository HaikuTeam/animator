var test = require('tape')
var path = require('path')
var Asset = require('./../../lib/Asset')

test('Asset.assetsToDirectoryStructure', function(t) {
  t.plan(4)
  var dir = Asset.assetsToDirectoryStructure({
    'designs/TEST.sketch': {
      relpath: 'designs/TEST.sketch',
      abspath: path.join(__dirname, '..', 'projects', 'test-project', 'designs/TEST.sketch'),
      dtModified: Date.now()
    },
    'designs/TEST.sketch.contents/artboards/Another Artboard.svg': {
      relpath: 'designs/TEST.sketch.contents/artboards/Another Artboard.svg',
      abspath: path.join(__dirname, '..', 'projects', 'test-project', 'designs/TEST.sketch.contents/artboards/Another Artboard.svg'),
      dtModified: Date.now()
    },
    'designs/TEST.sketch.contents/artboards/Artboard.svg': {
      relpath: 'designs/TEST.sketch.contents/artboards/Artboard.svg',
      abspath: path.join(__dirname, '..', 'projects', 'test-project', 'designs/TEST.sketch.contents/artboards/Artboard.svg'),
      dtModified: Date.now()
    },
    'designs/TEST.sketch.contents/pages/Page 1.svg': {
      relpath: 'designs/TEST.sketch.contents/pages/Page 1.svg',
      abspath: path.join(__dirname, '..', 'projects', 'test-project', 'designs/TEST.sketch.contents/pages/Page 1.svg'),
      dtModified: Date.now()
    },
    'designs/TEST.sketch.contents/slices/Dicey.svg': {
      relpath: 'designs/TEST.sketch.contents/slices/Dicey.svg',
      abspath: path.join(__dirname, '..', 'projects', 'test-project', 'designs/TEST.sketch.contents/slices/Dicey.svg'),
      dtModified: Date.now()
    },
    'designs/TEST.sketch.contents/slices/Slicey.svg': {
      relpath: 'designs/TEST.sketch.contents/slices/Slicey.svg',
      abspath: path.join(__dirname, '..', 'projects', 'test-project', 'designs/TEST.sketch.contents/slices/Slicey.svg'),
      dtModified: Date.now()
    },
  })
  t.ok(dir[0].type === 'sketch')
  t.ok(dir[0].artboards.type === 'folder')
  t.ok(dir[0].slices.type === 'folder')
  t.ok(dir[0].pages.type === 'folder')
})
