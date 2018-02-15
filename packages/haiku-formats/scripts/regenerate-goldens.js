const {each} = require('async');
const {join, basename} = require('path');
const {readdir, writeFile} = require('haiku-fs-extra');
const {BodymovinExporter} = require('../lib/exporters/bodymovin/bodymovinExporter.js');

const goldensRoot = join(global.process.cwd(), 'test/goldens');

readdir(join(goldensRoot, 'bytecode'), (_, bytecodeFiles) => {
  each(bytecodeFiles, (filename, next) => {
    const name = basename(filename, '.js');
    const exporter = new BodymovinExporter(require(join(goldensRoot, 'bytecode', filename)));
    writeFile(
      join(goldensRoot, 'bodymovin', `${name}.json`),
      JSON.stringify(exporter.rawOutput(), null, 2),
      next
    );
  });
});
