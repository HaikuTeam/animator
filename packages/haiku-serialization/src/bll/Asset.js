const path = require('path')
const toTitleCase = require('./helpers/toTitleCase')
const BaseModel = require('./BaseModel')
const Figma = require('./Figma')
const { Experiment, experimentIsEnabled } = require('haiku-common/lib/experiments')

const PAGES_REGEX = /\/pages\//
const SLICES_REGEX = /\/slices\//
const ARTBOARDS_REGEX = /\/artboards\//
const GROUPS_REGEX = /\/groups\//

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

  getAssetInfo () {
    const parts = this.relpath.split(path.sep)
    // It's definitely not a generated piece if its length doesn't match the pattern
    if (parts.length !== 4) {
      return {generator: null, relpath: null}
    }

    // Looking for a path like designs/Foo.sketch.contents/Slices
    const longSource = path.join(parts[0], parts[1], parts[2])
    const shortSource = path.join(parts[0], parts[1])
    const match = longSource.match(/\.(\w+)\.contents\//)

    if (match) {
      return {
        generator: match[1],
        generatorRelpath: shortSource.replace(/\.contents$/, '')
      }
    }

    return {generator: null, relpath: null}
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

  isFigmaFile () {
    return this.kind === Asset.KINDS.FIGMA
  }

  isRemoteAsset () {
    return this.proximity === Asset.PROXIMITIES.REMOTE
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

  addSketchChild (svgAsset) {
    if (svgAsset.isSlice()) {
      this.slicesFolderAsset.addChild(svgAsset)
      this.unshiftFolderAsset(this.slicesFolderAsset)
    } else if (svgAsset.isArtboard()) {
      this.artboardsFolderAsset.addChild(svgAsset)
      this.unshiftFolderAsset(this.artboardsFolderAsset)
    } else {
      this.addChild(svgAsset)
    }
  }

  addFigmaChild (svgAsset) {
    if (svgAsset.isSlice()) {
      this.slicesFolderAsset.addChild(svgAsset)
      this.unshiftFolderAsset(this.slicesFolderAsset)
    } else if (svgAsset.isGroup()) {
      this.groupsFolderAsset.addChild(svgAsset)
      this.unshiftFolderAsset(this.groupsFolderAsset)
    }
  }

  addSketchAsset (relpath, dict) {
    const {project} = this
    const result = Asset.findById(path.join(project.getFolder(), relpath))

    if (result) {
      this.addChild(result)
      return result
    }

    const artboardsFolderAsset = Asset.upsert({
      uid: path.join(project.getFolder(), 'designs', relpath, 'artboards'),
      type: Asset.TYPES.CONTAINER,
      kind: Asset.KINDS.FOLDER,
      proximity: Asset.PROXIMITIES.LOCAL,
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
      proximity: Asset.PROXIMITIES.LOCAL,
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
      proximity: Asset.PROXIMITIES.LOCAL,
      project,
      relpath,
      displayName: path.basename(relpath),
      children: [],
      slicesFolderAsset, // Hacky, but avoids extra 'upsert' logic
      artboardsFolderAsset,
      dtModified: dict[relpath].dtModified
    })

    this.addChild(sketchAsset)
    return sketchAsset
  }

  addFigmaAsset (relpath) {
    const {project} = this
    const result = Asset.findById(path.join(project.getFolder(), relpath))

    if (result) {
      this.addChild(result)
      return result
    }

    const groupsFolderAsset = Asset.upsert({
      uid: path.join(project.getFolder(), 'designs', relpath, 'groups'),
      type: Asset.TYPES.CONTAINER,
      kind: Asset.KINDS.FOLDER,
      proximity: Asset.PROXIMITIES.LOCAL,
      project,
      relpath: path.join('designs', relpath, 'groups'),
      displayName: 'Groups',
      children: [],
      dtModified: Date.now()
    })

    const slicesFolderAsset = Asset.upsert({
      uid: path.join(project.getFolder(), 'designs', relpath, 'slices'),
      type: Asset.TYPES.CONTAINER,
      kind: Asset.KINDS.FOLDER,
      proximity: Asset.PROXIMITIES.LOCAL,
      project,
      relpath: path.join('designs', relpath, 'slices'),
      displayName: 'Slices',
      children: [],
      dtModified: Date.now()
    })

    const figmaAsset = Asset.upsert({
      uid: path.join(project.getFolder(), relpath),
      type: Asset.TYPES.CONTAINER,
      kind: Asset.KINDS.FIGMA,
      proximity: Asset.PROXIMITIES.LOCAL,
      figmaID: Figma.findIDFromPath(relpath),
      project,
      relpath,
      displayName: path.basename(relpath).match(/-(\w+)\./)[1],
      children: [],
      slicesFolderAsset, // Hacky, but avoids extra 'upsert' logic
      groupsFolderAsset,
      dtModified: Date.now()
    })

    this.addChild(figmaAsset)
    return figmaAsset
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
          const result = [
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

          if (experimentIsEnabled(Experiment.FigmaIntegration)) {
            result.push(
              Asset.upsert({
                uid: '',
                type: Asset.TYPES.CONTAINER,
                kind: Asset.KINDS.FIGMA,
                proximity: Asset.PROXIMITIES.LOCAL,
                figmaID: '',
                relpath: 'hacky-figma-file[1]',
                displayName: this.project.getName() + '.figma',
                children: [],
                project: this.project,
                dtModified: Date.now()
              })
            )
            result.push(
              Asset.upsert({
                uid: 'hacky-message[3]',
                type: Asset.TYPES.HACKY_MESSAGE,
                kind: Asset.KINDS.HACKY_MESSAGE,
                project: this.project,
                relpath: 'hacky-message[3]',
                displayName: 'hacky-message[3]',
                children: [],
                dtModified: Date.now(),
                messageType: 'edit_primary_asset',
                message: FIGMA_ASSET_MESSAGE
              })
            )
          }

          return result
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

  isGroup () {
    return !!this.relpath.match(GROUPS_REGEX)
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
  FIGMA: 'figma',
  BITMAP: 'bitmap',
  VECTOR: 'vector',
  COMPONENT: 'component',
  OTHER: 'other',
  HACKY_MESSAGE: 'hacky_message'
}

Asset.PROXIMITIES = {
  LOCAL: 'local',
  REMOTE: 'remote'
}

const PRIMARY_ASSET_MESSAGE = `
⇧ Double click to open this file in Sketch.
Every slice and artboard will be synced here when you save.
`

const FIGMA_ASSET_MESSAGE = `
⇧ Double click to import a file from Figma.
Every slice and group will be imported here.
`

Asset.ingestAssets = (project, dict) => {
  Asset.all().forEach((asset) => {
    asset.destroy()
  })
  const componentFolderAsset = Asset.upsert({
    uid: path.join(project.getFolder(), 'code'),
    type: Asset.TYPES.CONTAINER,
    kind: Asset.KINDS.FOLDER,
    proximity: Asset.PROXIMITIES.LOCAL,
    project,
    relpath: 'code',
    displayName: 'Components',
    children: [],
    dtModified: Date.now()
  })

  const controlsFolderAsset = Asset.upsert({
    uid: '@haiku/core/components/controls',
    type: Asset.TYPES.CONTAINER,
    kind: Asset.KINDS.FOLDER,
    proximity: Asset.PROXIMITIES.REMOTE,
    project,
    relpath: 'controls',
    displayName: 'Controls',
    children: [
      controlComponentAsset(project, 'Image', 'controls/Image'),
      controlComponentAsset(project, 'Text', 'controls/Text'),
      controlComponentAsset(project, 'HTML', 'controls/HTML')
    ],
    dtModified: Date.now()
  })

  const designFolderAsset = Asset.upsert({
    uid: path.join(project.getFolder(), 'designs'),
    type: Asset.TYPES.CONTAINER,
    kind: Asset.KINDS.FOLDER,
    proximity: Asset.PROXIMITIES.LOCAL,
    project,
    relpath: 'designs',
    displayName: 'Designs',
    children: [
      // The artboardsFolderAsset and slicesFolderAsset will live at the top, if needed
    ],
    dtModified: Date.now()
  })

  const rootAssets = [designFolderAsset]

  if (experimentIsEnabled(Experiment.MultiComponentControlsLibrary)) {
    rootAssets.unshift(controlsFolderAsset)
  }

  if (experimentIsEnabled(Experiment.MultiComponentFeatures)) {
    rootAssets.unshift(componentFolderAsset)
  }

  for (const relpath in dict) {
    const extname = path.extname(relpath)

    if (extname === '.sketch') {
      designFolderAsset.addSketchAsset(relpath, dict)
    } else if (extname === '.svg') {
      // Skip any Pages that may have been previously exported by Sketchtool
      // Our workflow only deals with Artboards/Slices, so that's all we display to reduce conceptual overhead
      if (relpath.match(PAGES_REGEX)) {
        continue
      }

      const svgAsset = Asset.upsert({
        uid: path.join(project.getFolder(), relpath),
        type: Asset.TYPES.FILE,
        kind: Asset.KINDS.VECTOR,
        proximity: Asset.PROXIMITIES.LOCAL,
        project,
        relpath,
        displayName: path.basename(relpath, extname),
        children: [],
        dtModified: dict[relpath].dtModified
      })

      const {generator, generatorRelpath} = svgAsset.getAssetInfo()

      switch (generator) {
        case 'sketch':
          const sketchAsset = designFolderAsset.addSketchAsset(generatorRelpath, dict)
          sketchAsset.addSketchChild(svgAsset)
          break
        case 'figma':
          const figmaAsset = designFolderAsset.addFigmaAsset(generatorRelpath)
          figmaAsset.addFigmaChild(svgAsset)
          break
        default:
          designFolderAsset.addChild(svgAsset)
      }
    } else if (path.basename(relpath) === 'code.js') { // Looks like a component
      const pathParts = relpath.split(path.sep)
      const namePart = pathParts[1]
      const jsAsset = Asset.upsert({
        uid: path.join(project.getFolder(), relpath),
        type: Asset.TYPES.FILE,
        kind: Asset.KINDS.COMPONENT,
        proximity: Asset.PROXIMITIES.LOCAL,
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

function controlComponentAsset (project, displayName, partial) {
  const relpath = path.join('@haiku/core/components', partial, 'code/main/code.js')
  return Asset.upsert({
    uid: relpath,
    type: Asset.TYPES.FILE,
    kind: Asset.KINDS.COMPONENT,
    icon: `Control${displayName}`,
    proximity: Asset.PROXIMITIES.REMOTE,
    project,
    relpath,
    displayName,
    children: [],
    dtModified: 1
  })
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
