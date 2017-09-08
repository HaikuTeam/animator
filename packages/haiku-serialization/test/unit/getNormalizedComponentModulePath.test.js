var test = require('tape')
var getNormalizedComponentModulePath = require('./../../src/model/helpers/getNormalizedComponentModulePath')

test('getNormalizedComponentModulePath', function (t) {
  t.plan(10)

  t.equal(getNormalizedComponentModulePath('@haiku/player/components/Line'), '@haiku/player/components/Line/code/main/code')
  t.equal(getNormalizedComponentModulePath('@haiku/player/components/Line/code'), '@haiku/player/components/Line/code/main/code')
  t.equal(getNormalizedComponentModulePath('@haiku/player/components/Line/code/main'), '@haiku/player/components/Line/code/main/code')
  t.equal(getNormalizedComponentModulePath('@haiku/player/components/Line/code/main/code'), '@haiku/player/components/Line/code/main/code')

  t.equal(getNormalizedComponentModulePath('@haiku/MyTeam/MyComponents'), '@haiku/MyTeam/MyComponents/code/main/code')
  t.equal(getNormalizedComponentModulePath('@haiku/MyTeam/MyComponents/code'), '@haiku/MyTeam/MyComponents/code/main/code')
  t.equal(getNormalizedComponentModulePath('@haiku/MyTeam/MyComponents/code/main'), '@haiku/MyTeam/MyComponents/code/main/code')
  t.equal(getNormalizedComponentModulePath('@haiku/MyTeam/MyComponents/code/main/code'), '@haiku/MyTeam/MyComponents/code/main/code')

  // Bad ones
  t.equal(getNormalizedComponentModulePath('@haiku/player/components/Line/code/main/code/afsd'), null)
  t.equal(getNormalizedComponentModulePath('@haiku/player'), null)
})
