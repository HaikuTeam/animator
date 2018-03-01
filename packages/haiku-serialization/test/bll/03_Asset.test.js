const test = require('tape')
const path = require('path')
const Asset = require('./../../src/bll/Asset')

const PROJECT_MODEL_STUB = {
  getFolder: () => {
    return '/tmp/foo'
  }
}

test('Asset.assetsToDirectoryStructure', (t) => {
  t.plan(10)
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
  t.equal(assets[1].kind, 'folder', 'base asset is folder')
  t.equal(assets[1].type, 'container', 'base asset is container')
  t.equal(assets[1].children.length, 1, 'base asset has one child')
  t.equal(assets[1].children[0].kind, 'sketch', 'child asset is sketch')
  t.equal(assets[1].children[0].type, 'container', 'child asset is container')
  t.equal(assets[1].children[0].children[0].relpath, 'designs/designs/TEST.sketch/slices', 'grandchild is slices folder')
  t.equal(assets[1].children[0].children[0].kind, 'folder', 'grandchild is folder')
  t.equal(assets[1].children[0].children[0].type, 'container', 'grandchild is container')
  t.equal(assets[1].dump(), "designs\n  designs/TEST.sketch\n    designs/designs/TEST.sketch/slices\n      designs/TEST.sketch.contents/slices/Dicey.svg\n      designs/TEST.sketch.contents/slices/Slicey.svg\n    designs/designs/TEST.sketch/artboards\n      designs/TEST.sketch.contents/artboards/Another Artboard.svg\n      designs/TEST.sketch.contents/artboards/Artboard.svg",'tree looks ok')
})
