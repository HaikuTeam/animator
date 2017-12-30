const test = require('tape')
const path = require('path')
const Asset = require('./../../src/bll/Asset')

const PROJECT_MODEL_STUB = {
  getFolder: () => {
    return '/tmp/foo'
  }
}

test('Asset.assetsToDirectoryStructure', (t) => {
  t.plan(9)
  const assets = Asset.ingestAssets(PROJECT_MODEL_STUB, {
    'code/main/code.js': {
      relpath: 'code/main/code.js',
      abspath: path.join(__dirname, '..', 'projects', 'test-project', 'code/main/code.js'),
      dtModified: Date.now()
    },
    'code/foo_svg/code.js': {
      relpath: 'code/foo_svg/code.js',
      abspath: path.join(__dirname, '..', 'projects', 'test-project', 'code/foo_svg/code.js'),
      dtModified: Date.now()
    },
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
  t.ok(assets[0],'asset exists')
  t.equal(assets[0].kind, 'folder', 'base asset is folder')
  t.equal(assets[0].type, 'container', 'base asset is container')
  t.equal(assets[0].children.length, 1, 'base asset has one child')
  t.equal(assets[0].children[0].kind, 'sketch', 'child asset is sketch')
  t.equal(assets[0].children[0].type, 'container', 'child asset is container')
  t.equal(assets[0].children[0].children[0].relpath, 'designs/TEST.sketch.contents/slices/Dicey.svg', 'grandchild is svg')
  t.equal(assets[0].children[0].children[0].kind, 'vector', 'grandchild is vector')
  t.equal(assets[0].children[0].children[0].type, 'file', 'grandchild is file')
})
