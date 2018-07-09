// TODO: rewrite this unit test to run off compiler settings used in unit tests.
// import * as fs from 'fs';
// import * as glob from 'glob';
// import * as tape from 'tape';
// import {compileStringToTypescript} from '../TestHelpers';
// tape(
//   'Test Haiku bytecode typing on compile time',
//   (t) => {
//     // Load bytecode type definition from disk
//     const haikuBytecodeTypeString = fs.readFileSync(
//       'src/api/index.ts',
//       {encoding: 'utf8'},
//     );
//
//     // Get all bytecode file names from demo projects
//     const bytecodeFiles = glob.sync(
//       `demo/projects/*/code/main/code.js`,
//       {},
//     );
//
//     const nonConformantBytecodeFiles = [
//       // Noncorforming eventHandler
//       'demo/projects/clickable-square/code/main/code.js',
//     ];
//
//     // Number of tests are the number of demos
//     t.plan(bytecodeFiles.length);
//
//     bytecodeFiles.forEach((file) => {
//
//       // Load bytecode from file and transform it in a instance of HaikuBytecode by replacing string
//       const haikuBytecodeString = fs.readFileSync(
//         file,
//         {encoding: 'utf8'},
//       )
//         .replace(
//           /module.exports =/g,
//           'const bytecode: HaikuBytecode =',
//         );
//
//       const stringToCompile = haikuBytecodeTypeString + haikuBytecodeString;
//
//       // Compile bytecode type definition + bytecode into a single compilation unit to
//       // check typing error on compile time
//       const errors = compileStringToTypescript(
//         stringToCompile,
//         '',
//         {strict: false},
//       );
//
//       // Assumes non-conformant bytecodes should fail
//       if (nonConformantBytecodeFiles.indexOf(file) > -1) {
//         t.isNotEqual(
//           errors.length,
//           0,
//           `Testing non-conformant bytecode ${file}`,
//         );
//       } else {
//         t.equal(
//           errors.length,
//           0,
//           `Testing bytecode ${file}`,
//         );
//       }
//     });
//
//   },
// );
