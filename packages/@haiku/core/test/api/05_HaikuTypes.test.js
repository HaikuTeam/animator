var test = require('tape')
var PACKAGE = require('./../../package.json')
var TestHelpers = require('./../TestHelpers')
var Config = require('./../../lib/Config').default
var glob = require('glob')
var fs = require('fs');


test('Test Haiku bytecode typing on compile time', function (t) {
  /* Load bytecode type definition from disk */ 
  const haykuBytecodeTypeString = fs.readFileSync('src/api/HaikuBytecode.ts',{encoding:'utf8'})

  /* Get all bytecode file names from demo projects */
  const bytecodeFiles = glob.sync(`demo/projects/*/code/main/code.js`, {})

  const nonConformantBytecodeFiles = [
    /* Non corformant eventHandler */
    'demo/projects/clickable-square/code/main/code.js',
    /* Non corformant eventHandler */
    'demo/projects/events/code/main/code.js',
  ]

  /* Number of tests are the number of demos */
  t.plan(bytecodeFiles.length)

  bytecodeFiles.forEach( (file) => {

    /* Load bytecode from file and transform it in a instance of HaikuBytecode by replacing string*/
    const haikuBytecodeString = fs.readFileSync(file,{encoding:'utf8'})
          .replace(/module.exports =/g, "const bytecode: HaikuBytecode =")

    const stringToCompile = haykuBytecodeTypeString + haikuBytecodeString
    
    /* Compile bytecode type definition + bytecode into a single compilation unit to 
    check typing error on compile time */
    errors = TestHelpers.compileStringToTypescript(stringToCompile, "", {strict:false})
    
    /* Assumes non-conformant bytecodes should fail */
    if (nonConformantBytecodeFiles.includes(file)){
      t.isNotEqual(errors.length, 0  , `Testing non-conformant bytecode ${file}`)
    }
    else{
      t.equal(errors.length, 0  , `Testing bytecode ${file}`)
    }
  })

})
