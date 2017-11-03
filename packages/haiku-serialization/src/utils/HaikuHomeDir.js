var path = require('path')
var os = require('os')
var fse = require('fs-extra')

var out = {}

var HOMEDIR_PATH = path.join(os.homedir(), '.haiku')

out.HOMEDIR_PATH = HOMEDIR_PATH
out.HOMEDIR_AUTH_PATH = path.join(HOMEDIR_PATH, 'auth')
out.HOMEDIR_PROJECTS_PATH = path.join(HOMEDIR_PATH, 'projects')
out.HOMEDIR_LOGS_PATH = path.join(HOMEDIR_PATH, 'logs')
out.HOMEDIR_CRASH_REPORTS_PATH = path.join(HOMEDIR_PATH, 'crash-reports')
out.HOMEDIR_MANIFEST_PATH = path.join(HOMEDIR_PATH, 'manifest.json')
out.HOMEDIR_TOUR_PATH = path.join(HOMEDIR_PATH, 'tour.json')
out.HOMEDIR_SKETCH_DIALOG_PATH = path.join(HOMEDIR_PATH, 'sketch-dialog')

// Checks if the user has taken the tour based on the
// existence of the HOMEDIR_TOUR_PATH.
//
// @returns Boolean
out.didTakeTour = function () {
  return fse.existsSync(out.HOMEDIR_TOUR_PATH)
}

// Creates a file to store tour options
out.createTourFile = function () {
  return fse.ensureFileSync(out.HOMEDIR_TOUR_PATH)
}

// Checks if the user has taken the tour based on the
// existence of the HOMEDIR_SKETCH_DIALOG_PATH.
//
// @returns Boolean
out.didAskedForSketch = function () {
  return fse.existsSync(out.HOMEDIR_SKETCH_DIALOG_PATH)
}

// Creates a file to store tour options
out.createSketchDialogFile = function () {
  return fse.ensureFileSync(out.HOMEDIR_SKETCH_DIALOG_PATH)
}

module.exports = out
