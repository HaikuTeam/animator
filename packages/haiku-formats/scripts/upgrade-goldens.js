const {each} = require('async');
const {join} = require('path');
const TestHelpers = require('@haiku/core/test/TestHelpers');
const {readdir, writeFile} = require('haiku-fs-extra');
const AST = require('haiku-serialization/src/bll/AST');

const goldensRoot = join(global.process.cwd(), 'test/goldens');
const ast = AST.upsert({uid: 'upgrader', file: true});

readdir(join(goldensRoot, 'bytecode'), (_, bytecodeFiles) => {
  each(bytecodeFiles, (filename, next) => {
    const bytecodeFilename = join(goldensRoot, 'bytecode', filename);
    TestHelpers.createComponent(require(bytecodeFilename), {}, (component, teardown) => {
      const contents = ast.updateWithBytecodeAndReturnCode(component._bytecode);
      writeFile(
        bytecodeFilename,
        contents,
        (err) => {
          teardown();
          next(err);
        }
      );
    });
  });
});
