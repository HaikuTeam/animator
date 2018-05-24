const {each} = require('async');
const {join, basename} = require('path');
const {readdir, writeFile} = require('haiku-fs-extra');
const {BodymovinExporter} = require('../lib/exporters/bodymovin/bodymovinExporter.js');
const {HaikuStaticExporter} = require('../lib/exporters/haikuStatic/haikuStaticExporter.js');

const goldensRoot = join(global.process.cwd(), 'test/goldens');

readdir(join(goldensRoot, 'bytecode'), (_, bytecodeFiles) => {
  each(bytecodeFiles, (filename, next) => {
    const bytecodeFilename = join(goldensRoot, 'bytecode', filename);
    const name = basename(bytecodeFilename, '.js');
    if (name !== 'ContentAnimation') {
      return next()
    }
    const bodymovinExporter = new BodymovinExporter(require(bytecodeFilename));
    // Clear require cache.
    delete require.cache[require.resolve(bytecodeFilename)];
    writeFile(
      join(goldensRoot, 'bodymovin', `${name}.json`),
      JSON.stringify(bodymovinExporter.rawOutput(), null, 2),
      () => {
        const haikuStaticExporter = new HaikuStaticExporter(require(bytecodeFilename));
        writeFile(
          join(goldensRoot, 'haikuStatic', `${name}.json`),
          JSON.stringify(haikuStaticExporter.rawOutput(), null, 2),
          next,
        );
      }
    );
  });
});
