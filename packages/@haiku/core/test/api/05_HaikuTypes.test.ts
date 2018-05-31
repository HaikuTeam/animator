import * as tape from 'tape';
const PACKAGE = require('./../../package.json');
import compileStringToTypeScript from 'haiku-testing/src/helpers/compileStringToTypeScript';
const {Config} = require('./../../lib/Config').default;
const glob = require('glob');
const fs = require('fs');
const path = require('path');

// This test has a a limitation.. HaikuBytecode cannot import type definitions from
// other files, due to CompilerHost instance is functionality limited. It can fixed 
// by completing CompilerHost instance at TestHelpers' `compileStringToTypeScript`

tape('haiku bytecode typing on compile time', (t) => {
  // Load bytecode type definition from disk
  const haykuBytecodeTypeString = fs.readFileSync('src/api/HaikuBytecode.ts', {encoding:'utf8'});

  // Get all bytecode file names from demo projects
  const bytecodeFiles = glob.sync(`demo/projects/*/code/main/code.js`, {});

  const nonConformantBytecodeFiles = [
    // Non corformant eventHandler
    'demo/projects/clickable-square/code/main/code.js',
  ];

  // Number of tests are the number of demos
  t.plan(bytecodeFiles.length);

  bytecodeFiles.forEach((file) => {
    // Load bytecode from file and transform it in a instance of HaikuBytecode by replacing string
    const haikuBytecodeString = fs.readFileSync(file,{encoding:'utf8'})
          .replace(/module.exports =/g, 'const bytecode: HaikuBytecode =');

    const stringToCompile = haykuBytecodeTypeString + haikuBytecodeString;

    // Compile bytecode type definition + bytecode into a single compilation unit to 
    // check typing error on compile time 
    const errors = compileStringToTypeScript(stringToCompile, '', {strict:false});
    
    // Assumes non-conformant bytecodes should fail
    if (nonConformantBytecodeFiles.indexOf(file) > -1) {
      t.isNotEqual(errors.length, 0, `non-conformant bytecode ${file}`);
    } else {
      t.equal(errors.length, 0, `conformant bytecode ${file}`);
    }
  });
});
