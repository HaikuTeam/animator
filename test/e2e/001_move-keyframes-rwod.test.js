const tape = require('tape')
const fse = require('fs-extra')
const path = require('path')
const async = require('async')
const TestHelpers = require('../TestHelpers')

const PROP_NAMES = {
  'translation.x': 1,
  'translation.y': 1,
  'rotation.x': 1,
  'rotation.y': 1,
  'rotation.z': 1,
  'scale.x': 1,
  'scale.y': 1,
  'opacity': 1,
  'style.backgroundColor': 'gray'
}

tape('move keyframes red wall of death fix', (t) => {
  t.plan(1)

  TestHelpers.e2e(({ plumbing, folder, relpath }, done) => {
    fse.outputFileSync(path.join(folder, 'Path.svg'), PATH_SVG_1)

    async.series([
      (cb) => {
        // File size contributes to the problem, so first make a big component file
        const posdatas = ([0,1,2,3,4,5,6,7,8,9]).map((n) => { return {x: n * 50, y: n * 50}})
        return async.eachSeries(posdatas, (posdata, next) => {
          return plumbing.method(
            'instantiateComponent',
            [relpath, 'Path.svg', posdata],
            next
          )
        }, cb)
      },
      (cb) => {
        // Add some keyframes that we can move in order to raise the issue
        return plumbing.method(
          'applyPropertyGroupValue',
          [relpath, 'd7e12f40e778', 'Default', 0, PROP_NAMES],
          TestHelpers.wait(1, cb)
        )
      },
      (cb) => {
        // 9 in parallel seems to be enough to raise the problem in any test run
        const frames = ([1,2,3,4,5,6]).map((n) => Math.round((n * 3) * 16.666))
        return async.each(Object.keys(PROP_NAMES), (propertyName, nextPropertyName) => {
          return async.eachSeries(frames, (frame, nextFrame) => {
            const moves = {}; moves[frame] = {value: PROP_NAMES[propertyName]};
            return plumbing.method('moveKeyframes', [relpath, 'd7e12f40e778', 'Default', propertyName, moves], nextFrame)
          }, nextPropertyName)
        }, cb)
      },
      (cb) => {

      }
    ], (err) => {
      if (err) throw err
      t.ok(true, 'finished sequence without crashing due to "red wall of death"')
      done()
    })
  })
})

const PATH_SVG_1 = `
  <?xml version="1.0" encoding="UTF-8"?>
  <svg width="99px" height="69px" viewBox="0 0 99 69" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <!-- Generator: sketchtool 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
      <title>PathPen</title>
      <desc>Created with sketchtool.</desc>
      <defs>
        <foobar id="abc123"></foobar>
      </defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g foobar="url(#abc123)" id="Artboard" transform="translate(-283.000000, -254.000000)" stroke="#979797">
              <path d="M294.851562,260.753906 C282.404105,283.559532 310.725273,290.63691 326.835937,295.734375 C331.617305,297.247215 342.059558,301.595875 338.316406,309.21875 C337.259516,311.371092 335.344104,313.379399 333.070312,314.140625 C316.687518,319.6253 318.607648,314.107756 316.175781,298.535156 C314.073483,285.072967 341.353724,262.381072 307.847656,273.160156 C302.953426,274.734657 299.363413,279.037222 295.621094,282.5625 C294.703984,283.426421 289.762583,289.749326 292.835937,292.191406 C310.800174,306.465746 310.629063,293.466831 327.605469,293.117188 C340.400227,292.853669 361.733615,282.532042 364.140625,298.585938 C364.591437,301.592694 366.227007,305.49551 364.140625,307.707031 C356.643614,315.653704 320.800977,318.428842 316.511719,304 C313.310899,293.23261 309.646651,279.191944 316.511719,270.300781 L317.605469,266.996094 C318.70025,265.578208 319.962133,263.856288 321.726562,263.546875 C348.187608,258.906626 333.406544,260.284286 342.546875,271.855469 C345.091836,275.077257 351.639186,275.674796 351.988281,279.765625 L354.464844,283.632812 C357.416932,318.226499 296.30014,340.100228 293.25,300.105469 C292.638094,292.081893 291.431499,283.803546 293.25,275.964844 C294.715721,269.646813 297.246721,262.379048 302.785156,259.003906 C320.414927,248.260262 322.400502,263.451084 330.808594,271.378906 C333.565871,273.978688 339.302903,273.7221 340.503906,277.316406 C343.115394,285.131945 334.783267,296.681412 341.050781,302.03125 C348.504241,308.39339 366.513246,311.846671 370.4375,302.867188 L372.515625,301.476562 C387.936662,266.190128 352.052706,234.955091 328.25,269.800781 C322.336272,278.458113 340.249653,294.392337 330.753906,301.621094 C326.91332,304.544788 294.058884,308.199097 286.269531,307.359375 C284.995803,307.222062 284.102217,305.584758 283.921875,304.316406 C282.389249,293.537418 285.731973,295.96395 292.257812,288.046875 C311.385715,264.841117 307.46635,267.289874 346.21875,270.695312 C348.526208,270.898085 351.084913,271.703414 352.59375,273.460938 C354.971579,276.230679 354.398541,281.016656 357.144531,283.421875 C361.463282,287.20468 369.172641,295.592094 372.613281,290.996094 C396.717804,258.797319 361.228307,257.906354 349.429687,268.339844 C338.784302,277.753531 347.977468,308.238322 342.097656,310.683594 C334.379679,313.893313 325.61253,313.607482 317.28125,314.285156 C310.815625,314.811077 304.233838,315.258597 297.820312,314.285156 C296.449037,314.077025 295.446155,312.335074 295.328125,310.953125 C294.594926,302.368493 293.381654,293.498605 295.328125,285.105469 C302.241349,255.29581 326.590452,265.047417 334.488281,291.011719 C336.03704,296.103302 335.56021,306.996168 340.308594,312.417969 C354.750775,328.908343 356.425475,297.576804 356.195312,291.328125" id="Path-4"></path>
          </g>
      </g>
  </svg>
`
