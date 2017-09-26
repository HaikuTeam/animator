'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assetsToDirectoryStructure = assetsToDirectoryStructure;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Sketch = require('./Sketch');

var Sketch = _interopRequireWildcard(_Sketch);

var _reverseEach = require('./reverseEach');

var _reverseEach2 = _interopRequireDefault(_reverseEach);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function assetsToDirectoryStructure(dict) {
  var assets = [];
  for (var relpath in dict) {
    assets.push(dict[relpath]);
  }

  var dir = [];
  var sketches = [];

  // First go through and accumulate a list of Sketch-exported assets
  (0, _reverseEach2.default)(assets, function (asset, index) {
    var relpath = asset.relpath;
    var extname = _path2.default.extname(relpath);
    if (extname === '.sketch') {
      assets.splice(index, 1);
      sketches.push(asset);
    }
  });

  // Then infer which of any remainers are slices/artboards belonging to it
  sketches.forEach(function (sketch) {
    var sketchRelpath = sketch.relpath;
    var exportFolder = Sketch.exportFolderPath(sketchRelpath);
    dir.push({
      type: 'sketch',
      relpath: sketch.relpath,
      fileName: _path2.default.basename(sketchRelpath),
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
    });
  });

  // Remaining assets are those not belonging to a Sketch export
  assets.forEach(function (asset) {
    dir.push({
      type: 'file',
      relpath: asset.relpath,
      fileName: _path2.default.basename(asset.relpath),
      preview: asset.abspath,
      updateTime: asset.dtModified
    });
  });

  return dir;
}

function pullArtboardsFor(exportFolder, assets) {
  var artboards = [];
  assetsEach(assets, function (asset, index, relpath, dirname, basename) {
    if (dirname.indexOf(exportFolder) !== -1) {
      if (Sketch.looksLikeArtboard(relpath)) {
        assets.splice(index, 1);
        artboards.push({
          relpath: relpath,
          fileName: basename,
          preview: asset.abspath,
          updateTime: asset.dtModified
        });
      }
    }
  });
  return artboards;
}

function pullSlicesFor(exportFolder, assets) {
  var slices = [];
  assetsEach(assets, function (asset, index, relpath, dirname, basename) {
    if (dirname.indexOf(exportFolder) !== -1) {
      if (Sketch.looksLikeSlice(relpath)) {
        assets.splice(index, 1);
        slices.push({
          relpath: relpath,
          fileName: basename,
          preview: asset.abspath,
          updateTime: asset.dtModified
        });
      }
    }
  });
  return slices;
}

function pullPagesFor(exportFolder, assets) {
  var pages = [];
  assetsEach(assets, function (asset, index, relpath, dirname, basename) {
    if (dirname.indexOf(exportFolder) !== -1) {
      if (Sketch.looksLikePage(relpath)) {
        assets.splice(index, 1);
        pages.push({
          relpath: relpath,
          fileName: basename,
          preview: asset.abspath,
          updateTime: asset.dtModified
        });
      }
    }
  });
  return pages;
}

// Just a bit of reusable logic for iterating over asseets
function assetsEach(assets, iterator) {
  (0, _reverseEach2.default)(assets, function (asset, index) {
    var assetRelpath = asset.relpath;
    var assetDirname = _path2.default.dirname(assetRelpath);
    var assetBasename = _path2.default.basename(assetRelpath);
    iterator(asset, index, assetRelpath, assetDirname, assetBasename, assets);
  });
}
//# sourceMappingURL=Asset.js.map