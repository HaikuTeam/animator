const path = require('path')
const toTitleCase = require('./helpers/toTitleCase')
const BaseModel = require('./BaseModel')
const Sketch = require('./Sketch')
const Illustrator = require('./Illustrator')
const {Figma, PHONY_FIGMA_FILE} = require('./Figma')
const {Experiment, experimentIsEnabled} = require('haiku-common/lib/experiments')

const PAGES_REGEX = /\/pages\//
const SLICES_REGEX = /\/slices\//
const ARTBOARDS_REGEX = /\/artboards\//
const GROUPS_REGEX = /\/groups\//
const FRAMES_REGEX = /\/frames\//

const MAIN_COMPONENT_NAME = 'main'

/**
 * @class Asset
 * @description
 *.  Encapsulates any object that needs to be displayed in the Library UI.
 *.  Also abstracts some of the logic for asset nesting/grouping for display.
 *.  Includes static methods for common asset-related tasks.
 */
class Asset extends BaseModel {
  getAbspath () {
    return path.join(this.project.getFolder(), this.getRelpath())
  }

  getRelpath () {
    return this.relpath
  }

  getSceneName () {
    if (!this.isComponent()) {
      return
    }

    const parts = path.normalize(this.relpath).split(path.sep)
    return parts[1]
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
      this.isVector() ||
      this.isImage()
    )
  }

  isComponent () {
    return this.kind === Asset.KINDS.COMPONENT
  }

  isVector () {
    return this.kind === Asset.KINDS.VECTOR
  }

  isImage () {
    return this.kind === Asset.KINDS.IMAGE
  }

  isSketchFile () {
    return this.kind === Asset.KINDS.SKETCH
  }

  isFigmaFile () {
    return this.kind === Asset.KINDS.FIGMA
  }

  isIllustratorFile () {
    return this.kind === Asset.KINDS.ILLUSTRATOR
  }

  isRemoteAsset () {
    return this.proximity === Asset.PROXIMITIES.REMOTE
  }

  isLocalAsset () {
    return this.proximity === Asset.PROXIMITIES.LOCAL
  }

  isLocalComponent () {
    return this.isComponent() && this.isLocalAsset()
  }

  getLocalizedRelpath () {
    // In case of builtin/installed components, we don't want to prefix with the dot :/
    // See also Template#normalizePathOfPossiblyExternalModule
    // e.g. @haiku/core/components/controls/HTML
    // TODO: e.g. some-other-haiku-proj/moocow
    if (this.getRelpath()[0] === '@') {
      return this.getRelpath()
    }

    // ActiveComponent#instantiateComponent depends on us correctly indicating a local component
    return Template.normalizePath(`./${this.getRelpath()}`)
  }

  isOrphanSvg () {
    return this.isVector() && this.parent.isDesignsHostFolder()
  }

  isComponentOtherThanMain () {
    return (this.isComponent() && this.relpath !== 'code/main/code.js')
  }

  isDesignsHostFolder () {
    return this.relpath === 'designs'
  }

  isComponentsHostFolder () {
    return this.relpath === 'code'
  }

  addSketchChild (svgAsset) {
    if (svgAsset.isSlice()) {
      this.slicesFolderAsset.insertChild(svgAsset)
      this.unshiftFolderAsset(this.slicesFolderAsset)
    } else if (svgAsset.isArtboard()) {
      this.artboardsFolderAsset.insertChild(svgAsset)
      this.unshiftFolderAsset(this.artboardsFolderAsset)
    } else {
      this.insertChild(svgAsset)
    }
  }

  addFigmaChild (svgAsset) {
    if (svgAsset.isSlice()) {
      this.slicesFolderAsset.insertChild(svgAsset)
      this.unshiftFolderAsset(this.slicesFolderAsset)
    } else if (svgAsset.isGroup()) {
      this.groupsFolderAsset.insertChild(svgAsset)
      this.unshiftFolderAsset(this.groupsFolderAsset)
    } else if (svgAsset.isFrame()) {
      this.framesFolderAsset.insertChild(svgAsset)
      this.unshiftFolderAsset(this.framesFolderAsset)
    }
  }

  addIllustratorChild (svgAsset) {
    this.artboardsFolderAsset.insertChild(svgAsset)
    this.unshiftFolderAsset(this.artboardsFolderAsset)
  }

  addSketchAsset (relpath, dict) {
    const {project} = this
    const result = Asset.findById(path.join(project.getFolder(), relpath))

    if (result) {
      this.insertChild(result)
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
      dtModified: (dict[relpath] && dict[relpath].dtModified) || Date.now()
    })

    slicesFolderAsset.parent = artboardsFolderAsset.parent = sketchAsset

    this.insertChild(sketchAsset)
    return sketchAsset
  }

  addFigmaAsset (relpath) {
    const {project} = this

    const result = Asset.findById(path.join(project.getFolder(), relpath))
    if (result) {
      this.insertChild(result)
      return result
    }

    const framesFolderAsset = Asset.upsert({
      uid: path.join(project.getFolder(), 'designs', relpath, 'frames'),
      type: Asset.TYPES.CONTAINER,
      kind: Asset.KINDS.FOLDER,
      proximity: Asset.PROXIMITIES.LOCAL,
      project,
      relpath: path.join('designs', relpath, 'frames'),
      displayName: 'Frames',
      children: [],
      dtModified: Date.now()
    })

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
      displayName: Figma.findDisplayNameFromPath(relpath),
      children: [],
      slicesFolderAsset, // Hacky, but avoids extra 'upsert' logic
      groupsFolderAsset,
      framesFolderAsset,
      dtModified: Date.now()
    })

    slicesFolderAsset.parent = groupsFolderAsset.parent = figmaAsset

    this.insertChild(figmaAsset)

    // Must return for the asset to be listed
    return figmaAsset
  }

  addIllustratorAsset (relpath, dict) {
    const {project} = this
    const result = Asset.findById(path.join(project.getFolder(), relpath))

    if (result) {
      this.insertChild(result)
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

    const illustratorAsset = Asset.upsert({
      uid: path.join(project.getFolder(), relpath),
      type: Asset.TYPES.CONTAINER,
      kind: Asset.KINDS.ILLUSTRATOR,
      project,
      proximity: Asset.PROXIMITIES.LOCAL,
      relpath,
      displayName: path.basename(relpath),
      children: [],
      artboardsFolderAsset,
      dtModified: (dict[relpath] && dict[relpath].dtModified) || Date.now()
    })

    artboardsFolderAsset.parent = illustratorAsset

    this.insertChild(illustratorAsset)
    return illustratorAsset
  }

  getChildAssets () {
    return this.children
  }

  isPrimaryAsset () {
    const { primaryAssetPath } = this.project.getNameVariations()
    return path.normalize(this.relpath) === primaryAssetPath
  }

  isDefaultIllustratorAssetPath () {
    const { defaultIllustratorAssetPath } = this.project.getNameVariations()
    return path.normalize(this.relpath) === defaultIllustratorAssetPath
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

  isFrame () {
    return !!this.relpath.match(FRAMES_REGEX)
  }

  isPhony () {
    return this.relpath.includes(PHONY_FIGMA_FILE)
  }

  isPhonyOrOnlyHasPhonyChildrens () {
    const children = this.getChildAssets()
    return this.isPhony() || (children.length === 1 && children[0].isPhony())
  }

  unshiftFolderAsset (folderAsset) {
    const foundAmongChildren = this.children.indexOf(folderAsset) !== -1
    if (folderAsset && !foundAmongChildren) {
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
    uid: true,
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
  ILLUSTRATOR: 'ai',
  IMAGE: 'image',
  FONT: 'font',
  VECTOR: 'vector',
  COMPONENT: 'component',
  OTHER: 'other',
  HACKY_MESSAGE: 'hacky_message'
}

Asset.PROXIMITIES = {
  LOCAL: 'local',
  REMOTE: 'remote'
}

Asset.ingestAssets = (project, dict) => {
  Asset.purge()

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

  rootAssets.unshift(componentFolderAsset)

  for (const relpath in dict) {
    const extname = path.extname(relpath).toLowerCase()

    if (extname === '.sketch') {
      designFolderAsset.addSketchAsset(relpath, dict)
    } else if (extname === '.ai') {
      designFolderAsset.addIllustratorAsset(relpath, dict)
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
          if (figmaAsset) {
            figmaAsset.addFigmaChild(svgAsset)
          }
          break
        case 'ai':
          const illustratorAsset = designFolderAsset.addIllustratorAsset(generatorRelpath, dict)
          illustratorAsset.addIllustratorChild(svgAsset)
          break
        default:
          designFolderAsset.insertChild(svgAsset)
      }
    } else if (path.basename(relpath) === 'code.js') { // Looks like a component
      const pathParts = relpath.split(path.sep)
      const namePart = pathParts[1]

      // Since the Main component can't be instantiated, we don't show it in the library
      if (namePart !== MAIN_COMPONENT_NAME) {
        componentFolderAsset.insertChild(
          Asset.upsert({
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
        )
      }

      componentFolderAsset.children = sortedChildrenOfComponentFolderAsset(componentFolderAsset)
    } else if (
      IMAGE_ASSET_EXTNAMES[extname] &&
      experimentIsEnabled(Experiment.AllowBitmapImages)
    ) {
      const imageAsset = Asset.upsert({
        uid: path.join(project.getFolder(), relpath),
        type: Asset.TYPES.FILE,
        kind: Asset.KINDS.IMAGE,
        proximity: Asset.PROXIMITIES.LOCAL,
        project,
        relpath,
        displayName: path.basename(relpath, extname),
        children: [],
        dtModified: dict[relpath].dtModified
      })

      designFolderAsset.insertChild(imageAsset)
    }
  }

  return rootAssets
}

const sortedChildrenOfComponentFolderAsset = (asset) => {
  let main
  const controls = []
  const components = []

  asset.children.forEach((child) => {
    if (child.isControl) {
      controls.push(child)
    } else {
      if (child.displayName === 'Main') {
        main = child
      } else {
        components.push(child)
      }
    }
  })

  // In case we don't find main on the first run, which can happen sometimes
  const out = []
  if (main) {
    out.push(main)
  }

  return out.concat(sortAssetsAlpha(components)).concat(sortAssetsAlpha(controls))
}

const sortAssetsAlpha = (assets) => {
  return assets.sort((a, b) => {
    if (a.displayName < b.displayName) return -1
    if (a.displayName > b.displayName) return 1
    return 0
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
  const file = fileFromDropEvent.getAsFile()
  if (!file) {
    return false
  }
  const abspath = file.name
  return (
    fileFromDropEvent.type === 'image/svg+xml' ||
    Asset.isSketchFile(fileFromDropEvent) ||
    Asset.isDesignAsset(abspath)
  )
}

Asset.preventDefaultDrag = (dropEvent) => {
  if (Asset.isInternalDrop(dropEvent)) return null
  return dropEvent.preventDefault()
}

const IMAGE_ASSET_EXTNAMES = {
  '.png': true,
  '.jpg': true,
  '.jpeg': true,
  '.gif': true
}

Asset.isImage = (filepath) => {
  const extname = path.extname(filepath).toLowerCase()
  return IMAGE_ASSET_EXTNAMES[extname]
}

Asset.isDesignAsset = (abspath) => {
  const extname = path.extname(abspath).toLowerCase()

  return (
    Sketch.isSketchFile(abspath) ||
    Illustrator.isIllustratorFile(abspath) ||
    extname === '.svg' ||
    Asset.isImage(abspath)
  )
}

module.exports = Asset

const Template = require('./Template')
