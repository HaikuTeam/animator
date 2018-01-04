const path = require('path')
const fse = require('haiku-fs-extra')
const { execSync } = require('child_process')
const { PNG } = require('pngjs')
const logger = require('./../utils/LoggerInstance')
const BaseModel = require('./BaseModel')

const LOOKS_LIKE_SLICE = /\.sketch\.contents\/slices\//
const LOOKS_LIKE_ARTBOARD = /\.sketch\.contents\/artboards\//
const LOOKS_LIKE_PAGE = /\.sketch\.contents\/pages\//
const IS_SKETCH_FILE_RE = /\.sketch$/
const PARSER_CLI_PATH = '/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool'
const BASE64_BITMAP_RE = /"data:image\/(png|jpe?g|gif);base64,(.*?)"/gi

/**
 * @class Sketch
 * @description
 *.  Collection of static class methods and constants related to Sketch assets.
 */
class Sketch extends BaseModel {}

Sketch.DEFAULT_OPTIONS = {
  required: {}
}

BaseModel.extend(Sketch)

Sketch.looksLikeSlice = (relpath) => {
  return relpath.match(LOOKS_LIKE_SLICE)
}

Sketch.looksLikeArtboard = (relpath) => {
  return relpath.match(LOOKS_LIKE_ARTBOARD)
}

Sketch.looksLikePage = (relpath) => {
  return relpath.match(LOOKS_LIKE_PAGE)
}

Sketch.isSketchFile = (abspath) => {
  return abspath.match(IS_SKETCH_FILE_RE)
}

Sketch.exportFolderPath = (sketchRelpath) => {
  const cleanBasename = path.basename(sketchRelpath, path.extname(sketchRelpath))
  const expectedExportFolderName = `${cleanBasename}.sketch.contents`
  const expectedExportFolderPath = path.join(path.dirname(sketchRelpath), expectedExportFolderName)
  return expectedExportFolderPath
}

Sketch.sketchtoolPipeline = (abspath) => {
  // Don't bother if the file passed is not a .sketch file
  if (!Sketch.isSketchFile(abspath)) return void (0)

  // Don't bother if we detect that the user doesn't even have sketchtool installed
  if (!fse.existsSync(PARSER_CLI_PATH)) return void (0)

  logger.info('[sketchtool] got', abspath)

  // Note: We used to generate Artboards and Pages too (and adding those hooks back here
  // would obviously be easy, but we had no docs for how to use them, and all of our collateral
  // is focused on slices, so for a fairly significant optimization, I've set this up
  // to only export slices. Feel free to change back if this is a problem.
  const assetBaseFolder = abspath + '.contents/'

  // Clear out all old contents that may exist in the folder, so the user doesn't see
  // a bunch of stale assets and wonder why they didn't go away after updating Sketch
  fse.emptyDirSync(assetBaseFolder)

  const sliceFolder = assetBaseFolder + 'slices/'
  fse.mkdirpSync(sliceFolder)

  // Full Command:
  // $ /Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool export --format=svg --output=~/TEST.sketch.export/artboards/ artboards ~/TEST.sketch
  logger.info('[sketchtool] running commands')
  const outputSlicesCmd = `${PARSER_CLI_PATH} export --format=svg --output=${_escapeShell(sliceFolder)} slices ${_escapeShell(abspath)}`
  execSync(outputSlicesCmd)

  logger.info('[sketchtool] fix gamma correction')

  // Now loop through all of the outputs and fix the gamma value which leads to opacitation inconsistencies between browsers
  const outputEntries = fse.walkSync(assetBaseFolder)
  outputEntries.forEach((outputEntry) => {
    // We only care about SVG vilew for now, since those are our primary component data format
    if (path.extname(outputEntry) !== '.svg') return void (0)
    let outputContents = fse.readFileSync(outputEntry).toString()
    let numImageMatches = 0
    let updatedContents = outputContents.replace(BASE64_BITMAP_RE, (matchString, imageFormat, base64data) => {
      return matchString.replace(base64data, _processBase64ImageData(base64data, imageFormat, outputEntry, numImageMatches++))
    })
    fse.writeFileSync(outputEntry, updatedContents)
  })

  return true
}

function _escapeShell (cmd) {
  return cmd.replace(/(["\s'$`\\])/g, '\\$1')
}

function _processBase64ImageData (base64data, imageFormat, fileAbspath, bitmapIndex) {
  // TODO: Support other image formats (if necessary?) I dunno if formats other than png have gamma correction...
  if (imageFormat === 'png') {
    let imageBufferData = Buffer.from(base64data, 'base64')
    let pngInstance = PNG.sync.read(imageBufferData)

    // I've tried 0, 1, and 2.2, and only the magic number 1/2.2 seems to give me consistent
    // results that render correctly in Chrome, Firefox, and Safari...
    // I don't have any great ideas on how to derive the correct gamma setting based on the
    // sketch outputs, so I'll just normalize everything to this.
    // This is partly a #HACK in that when pngjs runs 'adjustGamma' it uses the internally
    // set .gamma property, so my setting it here might be poor coding practice...
    pngInstance.gamma = 1 / 2.2

    PNG.adjustGamma(pngInstance)
    let updatedBufferData = PNG.sync.write(pngInstance)
    let updated64data = updatedBufferData.toString('base64')
    return updated64data

    // FUTURE: In case we want to write out the bitmap, we could use a path like this:
    // let imageAbspath = `${fileAbspath}.${bitmapIndex}.${imageFormat}`
  } else {
    // If not a png, just return the base64 data directly since there's nothing to do for now
    return base64data
  }
}

module.exports = Sketch
