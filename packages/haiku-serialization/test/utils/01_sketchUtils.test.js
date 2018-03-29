const test = require('tape')
const sketchUtils = require('../../src/utils/sketchUtils')

test('sketchUtils.parseDumpInfo', async (t) => {
  t.plan(8)

  const validDump = `
    path:          /Applications/__MACOSX/Sketch.app
    path:          /Applications/Sketch.app
  `

  t.notOk(sketchUtils.parseDumpInfo(new Error()), 'returns null if an error ocurred')
  t.notOk(sketchUtils.parseDumpInfo(null, '', 'stderror'), 'returns null if stderr value is not empty')
  t.notOk(sketchUtils.parseDumpInfo(null, '\n   \n', ''), 'returns null if the dump call returns a string without valid info')
  t.notOk(sketchUtils.parseDumpInfo(null, '', ''), 'returns null if stderr value is not empty')
  t.notOk(sketchUtils.parseDumpInfo(null, 'path:          /Applications/__MACOSX/Sketch.app', ''), 'returns null if the dump is a path in an auxiliary system location')
  t.notOk(sketchUtils.parseDumpInfo(null, 'path:          /Users/roperzh/.Trash/Sketch.app', ''), 'returns null if Sketch is in the trash')
  t.notOk(sketchUtils.parseDumpInfo(null, 'wrong formatted output', ''), 'returns null if the dump output is not in the expected format')
  t.equal('/Applications/Sketch.app', sketchUtils.parseDumpInfo(null, validDump, ''), 'returns a valid path if the dump call is fine')

  t.end()
})

