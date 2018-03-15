const {each} = require('async');
const {join, basename} = require('path');
const {readdir, writeFile} = require('haiku-fs-extra');
const {BodymovinExporter} = require('../lib/exporters/bodymovin/bodymovinExporter.js');
const {HaikuStaticExporter} = require('../lib/exporters/haikuStatic/haikuStaticExporter.js');

const goldensRoot = join(global.process.cwd(), 'test/goldens');

readdir(join(goldensRoot, 'bytecode'), (_, bytecodeFiles) => {
  each(bytecodeFiles, (filename, next) => {
    const name = basename(filename, '.js');
    const bodymovinExporter = new BodymovinExporter(require(join(goldensRoot, 'bytecode', filename)));
    // Clear require cache.
    delete require[join(goldensRoot, 'bytecode', filename)];
    writeFile(
      join(goldensRoot, 'bodymovin', `${name}.json`),
      JSON.stringify(bodymovinExporter.rawOutput(), null, 2),
      () => {
        const haikuStaticExporter = new HaikuStaticExporter(require(join(goldensRoot, 'bytecode', filename)));
        writeFile(
          join(goldensRoot, 'haikuStatic', `${name}.json`),
          JSON.stringify(haikuStaticExporter.rawOutput(), null, 2),
          next,
        );
      }
    );
  });
});
