const path = require('path')
const toTitleCase = require('./helpers/toTitleCase')
const BaseModel = require('./BaseModel')
const { Experiment, experimentIsEnabled } = require('haiku-common/lib/experiments')

const PAGES_REGEX = /\/pages\//
const SLICES_REGEX = /\/slices\//
const ARTBOARDS_REGEX = /\/artboards\//

/**
 * @class Asset
 * @description
 *.  Encapsulates any object that needs to be displayed in the Library UI.
 *.  Also abstracts some of the logic for asset nesting/grouping for display.
 *.  Includes static methods for common asset-related tasks.
 */
class Asset extends BaseModel {
  isFolder () {
    return this.type === 'folder'
  }

  getAbspath () {
    return path.join(this.project.getFolder(), this.getRelpath())
  }

  getRelpath () {
    return this.relpath
  }

  addChild (asset) {
    let found = false
    this.children.forEach((child) => {
      if (child === asset) {
        found = true
      }
    })
    if (!found) {
      this.children.push(asset)
    }
    asset.parent = this
  }

  getSketchOriginRelpath () {
    const parts = this.relpath.split(path.sep)
    // It's definitely not a sketch piece if its length doesn't match the pattern
    if (parts.length !== 4) {
      return null
    }
    // Looking for a path like designs/Foo.sketch.contents/Slices
    const longSource = path.join(parts[0], parts[1], parts[2])
    const shortSource = path.join(parts[0], parts[1])
    // We only want slices for now; may support Artboards and Pages later
    if (longSource.match(/\.sketch\.contents\//)) {
      return shortSource.replace(/\.contents$/, '')
    }
    return null
  }

  isDraggable () {
    return (
      (this.isComponent() && this.isComponentOtherThanMain()) ||
      this.isVector()
    )
  }

  isComponent () {
    return this.kind === Asset.KINDS.COMPONENT
  }

  isVector () {
    return this.kind === Asset.KINDS.VECTOR
  }

  isSketchFile () {
    return this.kind === Asset.KINDS.SKETCH
  }

  isOrphanSvg () {
    return (this.isVector() && this.parent.kind !== Asset.KINDS.SKETCH)
  }

  isComponentOtherThanMain () {
    return (this.isComponent() && this.relpath !== 'code/main/code.js')
  }

  isDesignsHostFolder () {
    return this.relpath === 'designs'
  }

  getChildAssets () {
    // Super hacky - this logic probably belongs in the view instead of here.
    // We conditionally display a helpful message in the assets list if we detect that
    // the user has never imported a file before. Otherwise just return our own children
    if (this.isDesignsHostFolder()) {
      if (this.children.length === 0) {
        return [Asset.upsert({
          uid: 'hacky-message[0]',
          type: Asset.TYPES.HACKY_MESSAGE,
          kind: Asset.KINDS.HACKY_MESSAGE,
          project: this.project,
          relpath: 'hacky-message[0]',
          displayName: 'hacky-message[0]',
          children: [],
          dtModified: Date.now(),
          messageType: 'import_to_start',
          message: 'Import a Sketch or SVG file to start'
        })]
      } if (this.children.length === 1) {
        if (this.children[0].isPrimaryAsset() && this.children[0].children.length < 1) {
          return [
            this.children[0],
            Asset.upsert({
              uid: 'hacky-message[1]',
              type: Asset.TYPES.HACKY_MESSAGE,
              kind: Asset.KINDS.HACKY_MESSAGE,
              project: this.project,
              relpath: 'hacky-message[1]',
              displayName: 'hacky-message[1]',
              children: [],
              dtModified: Date.now(),
              messageType: 'edit_primary_asset',
              message: PRIMARY_ASSET_MESSAGE
            })
          ]
        }
      }
    }

    return this.children
  }

  isPrimaryAsset () {
    const { primaryAssetPath } = this.project.getNameVariations()
    return path.normalize(this.relpath) === primaryAssetPath
  }

  isSlice () {
    return !!this.relpath.match(SLICES_REGEX)
  }

  isArtboard () {
    return !!this.relpath.match(ARTBOARDS_REGEX)
  }

  unshiftFolderAsset (folderAsset) {
    const foundAmongChildren = this.children.indexOf(folderAsset) !== -1
    if (!foundAmongChildren) {
      this.children.unshift(folderAsset)
    }
  }

  dump () {
    let str = `${this.relpath}`
    this.children.forEach((child) => {
      const sublevel = child.dump()
      str += `\n  ${sublevel.split('\n').join('\n  ')}`
    })
    return str
  }
}

Asset.DEFAULT_OPTIONS = {
  required: {
    type: true,
    kind: true,
    project: true,
    relpath: true,
    displayName: true,
    children: true,
    dtModified: true
  }
}

BaseModel.extend(Asset)

Asset.TYPES = {
  CONTAINER: 'container',
  FILE: 'file',
  HACKY_MESSAGE: 'hacky_message'
}

Asset.KINDS = {
  FOLDER: 'folder',
  SKETCH: 'sketch',
  BITMAP: 'bitmap',
  VECTOR: 'vector',
  COMPONENT: 'component',
  OTHER: 'other',
  HACKY_MESSAGE: 'hacky_message'
}

const PRIMARY_ASSET_MESSAGE = `
⇧ Double click to open this file in Sketch.
Every slice and artboard will be synced here when you save.
`

Asset.ingestAssets = (project, dict) => {
  const componentFolderAsset = Asset.upsert({
    uid: path.join(project.getFolder(), 'code'),
    type: Asset.TYPES.CONTAINER,
    kind: Asset.KINDS.FOLDER,
    project,
    relpath: 'code',
    displayName: 'Components',
    children: [],
    dtModified: Date.now()
  })

  const designFolderAsset = Asset.upsert({
    uid: path.join(project.getFolder(), 'designs'),
    type: Asset.TYPES.CONTAINER,
    kind: Asset.KINDS.FOLDER,
    project,
    relpath: 'designs',
    displayName: 'Designs',
    children: [
      // The artboardsFolderAsset and slicesFolderAsset will live at the top, if needed
    ],
    dtModified: Date.now()
  })

  const rootAssets = [designFolderAsset]

  if (experimentIsEnabled(Experiment.MultiComponentFeatures)) {
    rootAssets.unshift(componentFolderAsset)
  }

  // First extract the sketch assets, which act as containers for slices
  for (const relpath in dict) {
    const extname = path.extname(relpath)

    if (extname !== '.sketch') continue

    const artboardsFolderAsset = Asset.upsert({
      uid: path.join(project.getFolder(), 'designs', relpath, 'artboards'),
      type: Asset.TYPES.CONTAINER,
      kind: Asset.KINDS.FOLDER,
      project,
      relpath: path.join('designs', relpath, 'artboards'),
      displayName: 'Artboards',
      children: [],
      dtModified: Date.now()
    })

    const slicesFolderAsset = Asset.upsert({
      uid: path.join(project.getFolder(), 'designs', relpath, 'slices'),
      type: Asset.TYPES.CONTAINER,
      kind: Asset.KINDS.FOLDER,
      project,
      relpath: path.join('designs', relpath, 'slices'),
      displayName: 'Slices',
      children: [],
      dtModified: Date.now()
    })

    const sketchAsset = Asset.upsert({
      uid: path.join(project.getFolder(), relpath),
      type: Asset.TYPES.CONTAINER,
      kind: Asset.KINDS.SKETCH,
      project,
      relpath,
      displayName: path.basename(relpath),
      children: [],
      slicesFolderAsset, // Hacky, but avoids extra 'upsert' logic
      artboardsFolderAsset,
      dtModified: dict[relpath].dtModified
    })

    designFolderAsset.addChild(sketchAsset)
  }

  for (const relpath in dict) {
    const extname = path.extname(relpath)
    if (extname === '.sketch') {
      continue
    } else if (extname === '.svg') {
      // Skip any Pages that may have been previously exported by Sketchtool
      // Our workflow only deals with Artboards/Slices, so that's all we display to reduce conceptual overhead
      if (
        relpath.match(PAGES_REGEX)
      ) {
        continue
      }

      const svgAsset = Asset.upsert({
        uid: path.join(project.getFolder(), relpath),
        type: Asset.TYPES.FILE,
        kind: Asset.KINDS.VECTOR,
        project,
        relpath,
        displayName: path.basename(relpath, extname),
        children: [],
        dtModified: dict[relpath].dtModified
      })

      const sketchOriginRelpath = svgAsset.getSketchOriginRelpath()

      if (sketchOriginRelpath) {
        const sketchAsset = Asset.findById(path.join(project.getFolder(), sketchOriginRelpath))
        if (sketchAsset) {
          if (svgAsset.isSlice()) {
            sketchAsset.slicesFolderAsset.addChild(svgAsset)
            sketchAsset.unshiftFolderAsset(sketchAsset.slicesFolderAsset)
          } else if (svgAsset.isArtboard()) {
            sketchAsset.artboardsFolderAsset.addChild(svgAsset)
            sketchAsset.unshiftFolderAsset(sketchAsset.artboardsFolderAsset)
          } else {
            sketchAsset.addChild(svgAsset)
          }
        }
      } else {
        designFolderAsset.addChild(svgAsset)
      }
    } else if (path.basename(relpath) === 'code.js') { // Looks like a component
      const pathParts = relpath.split(path.sep)
      const namePart = pathParts[1]
      const jsAsset = Asset.upsert({
        uid: path.join(project.getFolder(), relpath),
        type: Asset.TYPES.FILE,
        kind: Asset.KINDS.COMPONENT,
        project,
        relpath,
        displayName: toTitleCase(namePart),
        children: [],
        dtModified: dict[relpath].dtModified
      })
      componentFolderAsset.addChild(jsAsset)
    }
  }

  return rootAssets
}

/*
 * Checks if the event provided is dealing with files
 * dropped from the user file system. We can safely rely
 * on the 'Files' data transfer type to identify this.
 */
Asset.isInternalDrop = (dropEvent) => {
  return dropEvent && dropEvent.dataTransfer && dropEvent.dataTransfer.types.indexOf('Files') === -1
}

/*
 * Hacky way to check if a file is a Sketch file. We have to
 * rely on this because Sketch files doesn't have a `file.type`
 */
Asset.isSketchFile = (fileFromDropEvent) => {
  const extname = path.extname(fileFromDropEvent.getAsFile().name).toLowerCase()
  return extname === '.sketch'
}

Asset.isValidFile = (fileFromDropEvent) => {
  return fileFromDropEvent.type === 'image/svg+xml' || Asset.isSketchFile(fileFromDropEvent)
}

Asset.preventDefaultDrag = (dropEvent) => {
  if (Asset.isInternalDrop(dropEvent)) return null
  return dropEvent.preventDefault()
}

module.exports = Asset
