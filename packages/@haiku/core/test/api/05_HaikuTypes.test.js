var test = require('tape')
var PACKAGE = require('./../../package.json')
var TestHelpers = require('./../TestHelpers')
var Config = require('./../../lib/Config').default
var tsc = require("typescript")
var glob = require('glob')
var fs = require('fs');

test('passingOptions', function (t) {
  t.plan(1)


  let files = glob.sync(`demo/projects/*/code/main/code.js`, {})

  files.forEach( (file) => {
    var haikuBytecodeString = fs.readFileSync(file,{encoding:'utf8'})
          .replace(/module.exports =/g, "const bytecode: HaikuBytecode =").replace(/"/g, "'")

    var haykuBytecodeTypeDefinitionString = fs.readFileSync('api/HaikuBytecode.ts',{encoding:'utf8'})

    var stringToCompile = haykuBytecodeTypeDefinitionString + haikuBytecodeString

    //console.log("stringToCompile",stringToCompile)

    TestHelpers.compileStringToTypescript(stringToCompile, "", {strict:false})

  })
})
