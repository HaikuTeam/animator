const { execSync } = require('child_process')
const fse = require('haiku-fs-extra')
const {isMac, isWindows} = require('haiku-common/lib/environments/os')
const logger = require('./../utils/LoggerInstance')
const os = require('os')
const uuid = require('uuid')
const path = require('path')

const IS_ILLUSTRATOR_FILE_RE = /\.ai$/
const IS_ILLUSTRATOR_FOLDER_RE = /\.ai\.contents/

/**
 * This template script runs inside Illustrator and perform the export of the
 * artboards as SVG files.
 *
 * Full documentation of Illustrator scripting can be found [in the official reference][1].
 *
 * note: this script needs to be dinamically defined because the DESTINATION_PATH
 * string changes from import to import.
 *
 * [1]: https://wwwimages2.adobe.com/content/dam/acom/en/devnet/illustrator/pdf/Illustrator_JavaScript_Scripting_Reference_2017.pdf
 */
const EXPORTER_SCRIPT = `
  if (app.documents.length > 0) {
    var exportOptions = new ExportOptionsSVG()
    var type = ExportType.SVG
    var dest = 'DESTINATION_PATH'
    var sourcePath = 'SOURCE_PATH'
    var fileSpec = new File(dest)

    // Try open/focus on the file to export
    app.open(new File(sourcePath))

    var srcFile = app.activeDocument.fullName;

    // Export options can be further customized, check out the documentation.
    exportOptions.embedRasterImages = true
    exportOptions.embedAllFonts = false
    exportOptions.cssProperties = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES
    exportOptions.fontSubsetting = SVGFontSubsetting.None
    exportOptions.documentEncoding = SVGDocumentEncoding.UTF8
    exportOptions.saveMultipleArtboards = true

    // Export all artboards in the current document
    app.activeDocument.exportFile(fileSpec, type, exportOptions)

    // Unfortunately exporting artboards sets the exported file as the current
    // active document, so we need to close it, and open the original ai file
    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    app.open(srcFile);
  }
`

class Illustrator {
  /**
   * Checks if the file provided looks like an Illustrator file.
   * @param {string} abspath
   * @returns {Boolean}
   */
  static isIllustratorFile (abspath) {
    return abspath.match(IS_ILLUSTRATOR_FILE_RE)
  }

  /**
   * Checks if the folder provided looks like a folder that should contain
   * Illustrator assets.
   * @param {string} abspath
   * @returns {Boolean}
   */
  static isIllustratorFolder (abspath) {
    return !!abspath && abspath.match(IS_ILLUSTRATOR_FOLDER_RE)
  }

  /**
   * Import artboards as SVG files from an Illustrator document
   * @param {string} abspath
   * @returns {Boolean}
   */
  static importSVG (abspath) {
    if (!Illustrator.isIllustratorFile(abspath)) return false

    logger.info('[illustrator] got', abspath)

    const assetBaseFolder = abspath + '.contents/'
    const artboardFolder = assetBaseFolder + 'artboards/'

    fse.emptyDirSync(assetBaseFolder)
    fse.mkdirpSync(artboardFolder)

    logger.info('[illustrator] running commands')

    // We need to create a temporary Illustrator script file with the contents of
    // EXPORTER_SCRIPT to perform the export, this is an attempt to obscure the
    // file name to reduce the chances of an attacker modifying the contents of this
    // file before being executed.
    const tmpdir = os.tmpdir()
    const fileName = uuid.v4() + '.jsx'
    const exportScriptPath = path.join(tmpdir, fileName)
    const exportScript =
      EXPORTER_SCRIPT
        .replace('DESTINATION_PATH', artboardFolder)
        .replace('SOURCE_PATH', abspath)

    fse.writeFileSync(exportScriptPath, exportScript)

    execSync(Illustrator.openIllustratorFile(abspath))
    execSync(Illustrator.openIllustratorFile(exportScriptPath))

    return true
  }

  static openIllustratorFile (file) {
    if (isMac()) {
      return `open -g -b com.adobe.Illustrator ${file}`
    } else if (isWindows()) {
      // TODO: figure out the correct command in Windows
    }
  }
}

module.exports = Illustrator
