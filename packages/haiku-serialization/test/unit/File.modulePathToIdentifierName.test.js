var test = require('tape')
var File = require('./../../src/bll/File')

test('File.modulePathToIdentifierName', function (t) {
  t.plan(4)

  t.equal(File.modulePathToIdentifierName('@haiku/player/components/Line'), 'HaikuLine')
  t.equal(File.modulePathToIdentifierName('@haiku/player/components/Line/code/main/code'), 'HaikuLine')
  t.equal(File.modulePathToIdentifierName('@haiku/MyTeam/MyComponent/code/main/code'), 'MyTeam_MyComponent')
  t.equal(File.modulePathToIdentifierName('@haiku/MyTeam/MyComponent'), 'MyTeam_MyComponent')
})
