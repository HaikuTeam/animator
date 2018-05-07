const test = require('tape')
const path = require('path')
const {Experiment,experimentIsEnabled} = require('haiku-common/lib/experiments')
const Asset = require('./../../src/bll/Asset')

const PROJECT_MODEL_STUB = {
  getFolder: () => {
    return '/tmp/foo'
  }
}

const mockAssets = () =>{
  return Asset.ingestAssets(PROJECT_MODEL_STUB, {
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
    'designs/ID-TEST.figma.contents/slices/Slicey.svg': {
      relpath: 'designs/ID-TEST.figma.contents/slices/Slicey.svg',
      abspath: path.join(__dirname, '..', 'projects', 'test-project', 'designs/ID-TEST.figma.contents/slices/Slicey.svg'),
      dtModified: Date.now()
    },
    'designs/ID-TEST.figma.contents/groups/Slicey.svg': {
      relpath: 'designs/ID-TEST.figma.contents/groups/Slicey.svg',
      abspath: path.join(__dirname, '..', 'projects', 'test-project', 'designs/ID-TEST.figma.contents/groups/Slicey.svg'),
      dtModified: Date.now()
    },
  })
}

test('Asset.assetsToDirectoryStructure', (t) => {
  t.plan(8)

  const assets = mockAssets()

  t.ok(assets[0],'asset exists')

  const idx = (experimentIsEnabled(Experiment.MultiComponentControlsLibrary))
    ? 1
    : 0

  t.equal(assets[idx].kind, 'folder', 'base asset is folder')
  t.equal(assets[idx].type, 'container', 'base asset is container')
  t.equal(assets[idx].children.length, 2, 'base asset has ok children')
  t.equal(assets[idx].children[0].kind, 'component', 'first child asset is component')
  t.equal(assets[idx].children[1].kind, 'component', 'second child asset is component')
  t.equal(assets[idx].children[0].type, 'file', 'child asset is file')
  t.equal(assets[idx].dump(), 'code\n  code/main/code.js\n  code/foo_svg/code.js','tree looks ok')
})

test('Asset.assetsToDirectoryStructure detects sketch assets without exported SVG files', (t) => {
  t.plan(2)

  const assets = Asset.ingestAssets(PROJECT_MODEL_STUB, {
    'designs/TEST.sketch': {
      relpath: 'designs/TEST.sketch',
      abspath: path.join(__dirname, '..', 'projects', 'test-project', 'designs/TEST.sketch'),
      dtModified: Date.now()
    },
  })

  t.equal(assets[1].children.length, 1, 'base asset has a child')
  t.equal(assets[1].children[0].kind, 'sketch', 'child asset is sketch')
})

test('Asset.getAssetInfo', (t) => {
  t.plan(4)

  const assets = mockAssets()
  const sketchAsset = assets[1].children[0].children[0].children[0]
  const figmaAsset = assets[1].children[1].children[0].children[0]
  const sketchAssetInfo = sketchAsset.getAssetInfo()
  const figmaAssetInfo = figmaAsset.getAssetInfo()

  t.equal(sketchAssetInfo.generator, 'sketch')
  t.equal(sketchAssetInfo.generatorRelpath, 'designs/TEST.sketch')
  t.equal(figmaAssetInfo.generator, 'figma')
  t.equal(figmaAssetInfo.generatorRelpath, 'designs/ID-TEST.figma')
})

test('Asset.isSketchFile', (t) => {
  t.plan(2)

  const assets = mockAssets()
  const sketchAsset = assets[1].children[0]
  const figmaAsset = assets[1].children[1]

  t.ok(sketchAsset.isSketchFile())
  t.notOk(sketchAsset.isFigmaFile())
})

test('Asset.isFigmaFile', (t) => {
  t.plan(2)

  const assets = mockAssets()
  const sketchAsset = assets[1].children[0]
  const figmaAsset = assets[1].children[1]

  t.ok(figmaAsset.isFigmaFile())
  t.notOk(figmaAsset.isSketchFile())
})
