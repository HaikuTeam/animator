import path from 'path'
import * as Sketch from './Sketch'
import reverseEach from './reverseEach'

export function assetsToDirectoryStructure (dict) {
  const assets = []
  for (const relpath in dict) {
    assets.push(dict[relpath])
  }

  const dir = []
  const sketches = []

  // First go through and accumulate a list of Sketch-exported assets
  reverseEach(assets, (asset, index) => {
    const relpath = asset.relpath
    const extname = path.extname(relpath)
    if (extname === '.sketch') {
      assets.splice(index, 1)
      sketches.push(asset)
    }
  })

  // Then infer which of any remainers are slices/artboards belonging to it
  sketches.forEach((sketch) => {
    const sketchRelpath = sketch.relpath
    const exportFolder = Sketch.exportFolderPath(sketchRelpath)
    dir.push({
      type: 'sketch',
      relpath: sketch.relpath,
      fileName: path.basename(sketchRelpath),
      artboards: {
        type: 'folder',
        collection: pullArtboardsFor(exportFolder, assets)
      },
      slices: {
        type: 'folder',
        collection: pullSlicesFor(exportFolder, assets)
      },
      pages: {
        type: 'folder',
        collection: pullPagesFor(exportFolder, assets)
      }
    })
  })

  // Remaining assets are those not belonging to a Sketch export
  assets.forEach((asset) => {
    dir.push({
      type: 'file',
      relpath: asset.relpath,
      fileName: path.basename(asset.relpath),
      preview: asset.abspath,
      updateTime: asset.dtModified
    })
  })

  return dir
}

function pullArtboardsFor (exportFolder, assets) {
  const artboards = []
  assetsEach(assets, (asset, index, relpath, dirname, basename) => {
    if (dirname.indexOf(exportFolder) !== -1) {
      if (Sketch.looksLikeArtboard(relpath)) {
        assets.splice(index, 1)
        artboards.push({
          relpath,
          fileName: basename,
          preview: asset.abspath,
          updateTime: asset.dtModified
        })
      }
    }
  })
  return artboards
}

function pullSlicesFor (exportFolder, assets) {
  const slices = []
  assetsEach(assets, (asset, index, relpath, dirname, basename) => {
    if (dirname.indexOf(exportFolder) !== -1) {
      if (Sketch.looksLikeSlice(relpath)) {
        assets.splice(index, 1)
        slices.push({
          relpath,
          fileName: basename,
          preview: asset.abspath,
          updateTime: asset.dtModified
        })
      }
    }
  })
  return slices
}

function pullPagesFor (exportFolder, assets) {
  const pages = []
  assetsEach(assets, (asset, index, relpath, dirname, basename) => {
    if (dirname.indexOf(exportFolder) !== -1) {
      if (Sketch.looksLikePage(relpath)) {
        assets.splice(index, 1)
        pages.push({
          relpath,
          fileName: basename,
          preview: asset.abspath,
          updateTime: asset.dtModified
        })
      }
    }
  })
  return pages
}

// Just a bit of reusable logic for iterating over asseets
function assetsEach (assets, iterator) {
  reverseEach(assets, (asset, index) => {
    const assetRelpath = asset.relpath
    const assetDirname = path.dirname(assetRelpath)
    const assetBasename = path.basename(assetRelpath)
    iterator(asset, index, assetRelpath, assetDirname, assetBasename, assets)
  })
}
