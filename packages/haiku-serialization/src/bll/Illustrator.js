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
`

class Illustrator {
  static isIllustratorFile (abspath) {
    return abspath.match(IS_ILLUSTRATOR_FILE_RE)
  }

  static isIllustratorFolder (abspath) {
    return !!abspath && abspath.match(IS_ILLUSTRATOR_FOLDER_RE)
  }

  static importSVG (abspath) {
    if (!Illustrator.isIllustratorFile(abspath)) return void 0

    logger.info('[illustrator] got', abspath)

    const assetBaseFolder = abspath + '.contents/'
    const artboardFolder = assetBaseFolder + 'artboards/'

    fse.emptyDirSync(assetBaseFolder)
    fse.mkdirpSync(artboardFolder)

    logger.info('[illustrator] running commands')

    const tmpdir = os.tmpdir()
    const fileName = uuid.v4() + '.jsx'
    const filePath = path.join(tmpdir, fileName)
    const exportScript = EXPORTER_SCRIPT.replace('DESTINATION_PATH', artboardFolder)

    fse.writeFileSync(filePath, exportScript)

    execSync(Illustrator.generateExporterCommand(filePath))

    return true
  }

  static generateExporterCommand (file) {
    if (isMac()) {
      return `open -g -b com.adobe.Illustrator ${file}`
    } else if (isWindows()) {
      // TODO: figure out the correct command in Windows
      return
    }
  }
}

module.exports = Illustrator
