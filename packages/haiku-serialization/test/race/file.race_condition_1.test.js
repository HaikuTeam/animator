var test = require('tape')
var TestHelpers = require('./../TestHelpers')

// This is testing a race condition in which fast edits in tandem with constant file reloading
// leads to a situation in which a 'substruct missing' error gets raised. Basically, it runs a bunch
// of actions over and over, simulating the real situation, and eventually hits the race condition.
// On my MBP 2012 with 8GB RAM and 2.6 GHz processor, the error comes up usually in < 15 secs.

// Feel free to tweak the following to try to get this test to fail on your machine
var RUNNING_TIME = 60 * 2 * 1000 // How long to run this test before assuming it is a pass
var FILE_BIGNESS = 11 // Sort of factorial for string length - use this to make the bytecode file bigger/smaller
var INGEST_INTERVAL_RAND = [100, 1000] // Random interval on which to re-ingest the bytecode file
var EDIT_INTERVAL_RAND = [0, 500] // Random interval on which to make edits to the bytecode
var SHOW_DIFFS = true // This can have an effect on overall resource use, so worth testing as a variation

test('file.race_condition_1', function (t) {
  t.plan(1)

  return TestHelpers.createBasicProject({ name: 'race_condition_1', biggie: FILE_BIGNESS, diff: SHOW_DIFFS }, (component, bytecode, FileModel, folder, config, teardown) => {
    function doEdit () {
      bytecode.applyPropertyGroupValue(['abcdefghijk'], 'Default', 0, { 'sizeAbsolute.x': Math.random() }, () => {})
    }

    function doIngest () {
      // This imitates what the MasterProcess does when a file change is detected, minus some unnecessary bits
      FileModel.ingestOne(folder, bytecode.get('relpath'), () => {
        bytecode.set('substructInitialized', bytecode.reinitializeSubstruct(config, 'test'))
      })
    }

    var working = true

    function timerIngest (time) {
      if (working) { // for preventing handle leaks upon exit
        setTimeout(() => {
          doIngest()
          timerIngest(TestHelpers.randomIntFromInterval(INGEST_INTERVAL_RAND[0], INGEST_INTERVAL_RAND[1]))
        }, time)
      }
    }

    function timerEdit (time) {
      if (working) { // for preventing handle leaks upon exit
        setTimeout(() => {
          doEdit()
          timerEdit(TestHelpers.randomIntFromInterval(EDIT_INTERVAL_RAND[0], EDIT_INTERVAL_RAND[1]))
        }, time)
      }
    }

    timerEdit(0)
    timerIngest(500)

    // If this can run for an 2 minutes without resulting in 'Substruct missing', we'll consider that a passing grade
    setTimeout(() => {
      working = false
      teardown()
      t.ok(true)
    }, RUNNING_TIME)
  })
})
