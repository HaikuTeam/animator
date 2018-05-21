const { execSync } = require('child_process')
const fse = require('haiku-fs-extra')
const {isMac, isWindows} = require('haiku-common/lib/environments/os')
const logger = require('./../utils/LoggerInstance')
const os = require('os')
const uuid = require('uuid')
const path = require('path')

const IS_ILLUSTRATOR_FILE_RE = /\.ai$/
const IS_ILLUSTRATOR_FOLDER_RE = /\.ai\.contents/
const EXPORTER_SCRIPT = `
/* Crop every icon in your Illustrator file witha named artboard. This script will export them all */
var docRef = app.activeDocument;
// docRef.save();

// Get the source path
var originalPath = app.activeDocument.fullName.toString();

// Allocate a copy of the current document that we will throw away. We do this
// since doing an exportFile() renames the active document and it needs to be resaved to a
// different place
var tempFile = new File('/tmp/tosvg.ai')
docRef.saveAs(tempFile);

if (app.documents.length > 0) {
  var exportOptions = new ExportOptionsSVG()
  var type = ExportType.SVG
  var fileSpec = new File('DESTINATION_PATH')
  exportOptions.embedRasterImages = true
  exportOptions.embedAllFonts = false
  exportOptions.cssProperties = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES
  exportOptions.fontSubsetting = SVGFontSubsetting.None
  exportOptions.documentEncoding = SVGDocumentEncoding.UTF8
  saveMultipleArtboards = true
  app.activeDocument.exportFile(fileSpec, type, exportOptions)
}

// // Close the copy of the document we have created
docRef.close()

// // Reopen the original document
var originalFile = new File(originalPath);
app.open(originalFile);
`

class Illustrator {
  static isIllustratorFile (abspath) {
    return abspath.match(IS_ILLUSTRATOR_FILE_RE)
  }

  static isIllustratorFolder (abspath) {
    return !!abspath && abspath.match(IS_ILLUSTRATOR_FOLDER_RE)
  }

  static importSVG (abspath) {
    console.log(abspath, Illustrator.isIllustratorFile(abspath))
    if (!Illustrator.isIllustratorFile(abspath)) return void 0

    logger.info('[illustrator] got', abspath)

    const assetBaseFolder = abspath + '.contents/'
    const artboardFolder = assetBaseFolder + 'artboards/'

    fse.emptyDirSync(assetBaseFolder)
    fse.mkdirpSync(artboardFolder)

    logger.info('[illustrator] running commands')

    const tmpdir = os.tmpdir()
    console.log('!@!$!@$$! tmpdir', tmpdir)
    const fileName = uuid.v4() + '.jsx'
    console.log('!@!$!@$$! fileName', fileName)
    const filePath = path.join(tmpdir, fileName)
    console.log('!@!$!@$$! filePath', filePath)
    const exportScript = EXPORTER_SCRIPT.replace('DESTINATION_PATH', artboardFolder)
    console.log('!@!$!@$$! exportScript', exportScript)

    fse.writeFileSync(filePath, exportScript)

    execSync(Illustrator.generateExporterCommand(filePath))

    return true
  }

  static generateExporterCommand (file) {
    if (isMac()) {
      return `open -g -b com.adobe.Illustrator ${file}`
    } else if (isWindows()) {
      return `open -g -b com.adobe.Illustrator ${file}`
    }
  }
}

module.exports = Illustrator
