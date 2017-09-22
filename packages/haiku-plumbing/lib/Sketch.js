'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.looksLikeSlice = looksLikeSlice;
exports.looksLikeArtboard = looksLikeArtboard;
exports.looksLikePage = looksLikePage;
exports.exportFolderPath = exportFolderPath;
exports.sketchtoolPipeline = sketchtoolPipeline;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _haikuFsExtra = require('haiku-fs-extra');

var _haikuFsExtra2 = _interopRequireDefault(_haikuFsExtra);

var _child_process = require('child_process');

var _pngjs = require('pngjs');

var _LoggerInstance = require('haiku-serialization/src/utils/LoggerInstance');

var _LoggerInstance2 = _interopRequireDefault(_LoggerInstance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LOOKS_LIKE_SLICE = /\.sketch\.contents\/slices\//;
var LOOKS_LIKE_ARTBOARD = /\.sketch\.contents\/artboards\//;
var LOOKS_LIKE_PAGE = /\.sketch\.contents\/pages\//;
var IS_SKETCH_FILE_RE = /\.sketch$/;
var PARSER_CLI_PATH = '/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool';

var BASE64_BITMAP_RE = /"data:image\/(png|jpe?g|gif);base64,(.*?)"/gi;

function looksLikeSlice(relpath) {
  return relpath.match(LOOKS_LIKE_SLICE);
}

function looksLikeArtboard(relpath) {
  return relpath.match(LOOKS_LIKE_ARTBOARD);
}

function looksLikePage(relpath) {
  return relpath.match(LOOKS_LIKE_PAGE);
}

function exportFolderPath(sketchRelpath) {
  var cleanBasename = _path2.default.basename(sketchRelpath, _path2.default.extname(sketchRelpath));
  var expectedExportFolderName = cleanBasename + '.sketch.contents';
  var expectedExportFolderPath = _path2.default.join(_path2.default.dirname(sketchRelpath), expectedExportFolderName);
  return expectedExportFolderPath;
}

function sketchtoolPipeline(abspath) {
  // Don't bother if the file passed is not a .sketch file
  if (!abspath.match(IS_SKETCH_FILE_RE)) return void 0;

  // Don't bother if we detect that the user doesn't even have sketchtool installed
  if (!_haikuFsExtra2.default.existsSync(PARSER_CLI_PATH)) return void 0;

  _LoggerInstance2.default.info('[sketchtool] got', abspath);

  var assetBaseFolder = abspath + '.contents/';
  var artboardFolder = assetBaseFolder + 'artboards/';
  var sliceFolder = assetBaseFolder + 'slices/';
  var pagesFolder = assetBaseFolder + 'pages/';

  _haikuFsExtra2.default.mkdirpSync(artboardFolder);
  _haikuFsExtra2.default.mkdirpSync(sliceFolder);
  _haikuFsExtra2.default.mkdirpSync(pagesFolder);

  _LoggerInstance2.default.info('[sketchtool] running commands');

  // Full Command:
  // $ /Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool export --format=svg --output=~/TEST.sketch.export/artboards/ artboards ~/TEST.sketch
  var outputArtboardsCmd = PARSER_CLI_PATH + ' export --format=svg --output=' + _escapeShell(artboardFolder) + ' artboards ' + _escapeShell(abspath);
  var outputSlicesCmd = PARSER_CLI_PATH + ' export --format=svg --output=' + _escapeShell(sliceFolder) + ' slices ' + _escapeShell(abspath);
  var outputPagesCmd = PARSER_CLI_PATH + ' export --format=svg --output=' + _escapeShell(pagesFolder) + ' pages ' + _escapeShell(abspath);

  (0, _child_process.execSync)(outputArtboardsCmd);
  (0, _child_process.execSync)(outputSlicesCmd);
  (0, _child_process.execSync)(outputPagesCmd);

  _LoggerInstance2.default.info('[sketchtool] fix gamma correction');

  // Now loop through all of the outputs and fix the gamma value which leads to opacitation inconsistencies between browsers
  var outputEntries = _haikuFsExtra2.default.walkSync(assetBaseFolder);
  outputEntries.forEach(function (outputEntry) {
    // We only care about SVG vilew for now, since those are our primary component data format
    if (_path2.default.extname(outputEntry) !== '.svg') return void 0;
    var outputContents = _haikuFsExtra2.default.readFileSync(outputEntry).toString();
    var numImageMatches = 0;
    var updatedContents = outputContents.replace(BASE64_BITMAP_RE, function (matchString, imageFormat, base64data) {
      return matchString.replace(base64data, _processBase64ImageData(base64data, imageFormat, outputEntry, numImageMatches++));
    });
    _haikuFsExtra2.default.writeFileSync(outputEntry, updatedContents);
  });

  return true;
}

function _escapeShell(cmd) {
  return cmd.replace(/(["\s'$`\\])/g, '\\$1');
}

function _processBase64ImageData(base64data, imageFormat, fileAbspath, bitmapIndex) {
  // TODO: Support other image formats (if necessary?) I dunno if formats other than png have gamma correction...
  if (imageFormat === 'png') {
    var imageBufferData = Buffer.from(base64data, 'base64');
    var pngInstance = _pngjs.PNG.sync.read(imageBufferData);

    // I've tried 0, 1, and 2.2, and only the magic number 1/2.2 seems to give me consistent
    // results that render correctly in Chrome, Firefox, and Safari...
    // I don't have any great ideas on how to derive the correct gamma setting based on the
    // sketch outputs, so I'll just normalize everything to this.
    // This is partly a #HACK in that when pngjs runs 'adjustGamma' it uses the internally
    // set .gamma property, so my setting it here might be poor coding practice...
    pngInstance.gamma = 1 / 2.2;

    _pngjs.PNG.adjustGamma(pngInstance);
    var updatedBufferData = _pngjs.PNG.sync.write(pngInstance);
    var updated64data = updatedBufferData.toString('base64');
    return updated64data;

    // FUTURE: In case we want to write out the bitmap, we could use a path like this:
    // let imageAbspath = `${fileAbspath}.${bitmapIndex}.${imageFormat}`
  } else {
    // If not a png, just return the base64 data directly since there's nothing to do for now
    return base64data;
  }
}
//# sourceMappingURL=Sketch.js.map