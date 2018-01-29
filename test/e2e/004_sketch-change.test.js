// const tape = require('tape')
// const fse = require('fs-extra')
// const path = require('path')
// const async = require('async')
// const TestHelpers = require('../TestHelpers')

// tape('sketch changes', (t) => {
//   t.plan(3)

//   TestHelpers.e2e(({ plumbing, folder, relpath }, done) => {
//     const slices = [
//       'designs/Basic.sketch.contents/slices/Polygon.svg',
//       'designs/Basic.sketch.contents/slices/Oval.svg',
//       'designs/Basic.sketch.contents/slices/Rectangle.svg'
//     ]

//     async.series([
//       (cb) => {
//         return plumbing.linkAsset(
//           path.join(__dirname, '..', '..', 'packages/haiku-testing/assets/befores/Basic.sketch'),
//           folder,
//           TestHelpers.wait(2.5, cb)
//         )
//       },
//       (cb) => {
//         return async.eachOfSeries(slices, (slice, idx, next) => {
//           return plumbing.method(
//             'instantiateComponent',
//             [relpath, slice, {x: idx * 100, y: idx * 100 }],
//             next
//           )          
//         }, cb)
//       },
//       (cb) => {
//         return plumbing.exec((fin) => {
//           const el = window.document.querySelector('#haiku-mount-container')
//           return fin(null, el.innerHTML)
//         }, { views: ['glass'] }, (err, output) => {
//           if (err) throw err
//           t.equal(TestHelpers.stripUnstableIdsFromHtml(output.glass), '<div  class="haiku-component-mount" style="position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; overflow: visible; opacity: 1;"><div  haiku-title="UsersMatthewCodeHaikuTeamMonoPackagesHaikuPlumbingTestFixturesProjectsBlankProject" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); position: relative; overflow: visible; display: block; visibility: visible; opacity: 1; width: 550px; height: 400px; transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" source="designs/Basic.sketch.contents/slices/Polygon.svg" haiku-title="Polygon"  viewBox="0 0 83 79" style="position: absolute; margin: 0px; padding: 0px; border: 0px; z-index: 1; display: block; visibility: visible; opacity: 1; width: 83px; height: 79px; transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);"><g   stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" width="83px" height="79px" style="display: block; visibility: visible; opacity: 1; width: 83px; height: 79px; transform: matrix(1, 0, 0, 1, -314, -41);"><polygon   stroke="rgb(151, 151, 151)" fill="rgb(216, 216, 216)" points="355.5 42 395.919902 71.3667777 380.480873 118.883222 330.519127 118.883222 315.080098 71.3667777" width="83px" height="79px" style="display: block; visibility: visible; opacity: 1; width: 83px; height: 79px; transform: matrix(1, 0, 0, 1, 0, 0);"></polygon></g></svg><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" source="designs/Basic.sketch.contents/slices/Oval.svg" haiku-title="Oval"  viewBox="0 0 88 87" style="position: absolute; margin: 0px; padding: 0px; border: 0px; z-index: 2; display: block; visibility: visible; opacity: 1; width: 88px; height: 87px; transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 56, 57, 0, 1);"><g   stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" width="88px" height="87px" style="display: block; visibility: visible; opacity: 1; width: 88px; height: 87px; transform: matrix(1, 0, 0, 1, -167, -38);"><ellipse   stroke="rgb(175, 175, 175)" fill="rgb(216, 216, 216)" cx="211" cy="81.5" rx="43" ry="42.5" width="88px" height="87px" style="display: block; visibility: visible; opacity: 1; width: 88px; height: 87px; transform: matrix(1, 0, 0, 1, 0, 0);"></ellipse></g></svg><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" source="designs/Basic.sketch.contents/slices/Rectangle.svg" haiku-title="Rectangle"  viewBox="0 0 85 85" style="position: absolute; margin: 0px; padding: 0px; border: 0px; z-index: 3; display: block; visibility: visible; opacity: 1; width: 85px; height: 85px; transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 158, 158, 0, 1);"><defs ><rect   x="32" y="38" width="85px" height="85px" style="display: block; visibility: visible; opacity: 1; width: 85px; height: 85px; transform: matrix(1, 0, 0, 1, 0, 0);"></rect></defs><g   stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" width="85px" height="85px" style="display: block; visibility: visible; opacity: 1; width: 85px; height: 85px; transform: matrix(1, 0, 0, 1, -32, -38);"><g   width="85px" height="85px" style="display: block; visibility: visible; opacity: 1; width: 85px; height: 85px; transform: matrix(1, 0, 0, 1, 0, 0);"><use xmlns:xlink="http://www.w3.org/1999/xlink"   fill="#D2D2D2" fill-rule="evenodd" width="85px" height="85px" style="display: block; visibility: visible; opacity: 1; width: 85px; height: 85px; transform: matrix(1, 0, 0, 1, 0, 0);"></use><rect  stroke="rgb(151, 151, 151)" stroke-width="1" x="32.5" y="38.5" width="84px" height="84px" style="display: block; visibility: visible; opacity: 1; width: 84px; height: 84px; transform: matrix(1, 0, 0, 1, 0, 0);"></rect></g></g></svg></div></div>')
//           cb()
//         })
//       },
//       (cb) => {
//         return plumbing.linkAsset(
//           path.join(__dirname, '..', '..', 'packages/haiku-testing/assets/afters/Basic.sketch'),
//           folder,
//           TestHelpers.wait(2.5, cb)
//         )
//       },
//       (cb) => {
//         return plumbing.exec((fin) => {
//           const el = window.document.querySelector('#haiku-mount-container')
//           return fin(null, el.innerHTML)
//         }, { views: ['glass'] }, (err, output) => {
//           if (err) throw err
//           t.equal(TestHelpers.stripUnstableIdsFromHtml(output.glass), '<div  class="haiku-component-mount" style="position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; overflow: visible; opacity: 1;"><div  haiku-title="UsersMatthewCodeHaikuTeamMonoPackagesHaikuPlumbingTestFixturesProjectsBlankProject" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); position: relative; overflow: visible; display: block; visibility: visible; opacity: 1; width: 550px; height: 400px; transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" source="designs/Basic.sketch.contents/slices/Polygon.svg" haiku-title="Polygon"  viewBox="0 0 83 79" style="position: absolute; margin: 0px; padding: 0px; border: 0px; z-index: 1; display: block; visibility: visible; opacity: 1; width: 83px; height: 79px; transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);"><defs ><polygon   points="355.5 42 395.919902 71.3667777 380.480873 118.883222 330.519127 118.883222 315.080098 71.3667777" width="83px" height="79px" style="display: block; visibility: visible; opacity: 1; width: 83px; height: 79px; transform: matrix(1, 0, 0, 1, 0, 0);"></polygon><filter   x="-8.8%" y="-6.5%" filterUnits="objectBoundingBox" width="97.61px" height="92.9px" style="display: block; visibility: visible; opacity: 1; width: 97.61px; height: 92.9px; transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);"><feMorphology  radius="0.5" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"></feMorphology><feOffset  dx="0" dy="2" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset><feGaussianBlur  stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feComposite  in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"></feComposite><feColorMatrix type="matrix"  values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" in="shadowBlurOuter1"></feColorMatrix></filter></defs><g   stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" width="83px" height="79px" style="display: block; visibility: visible; opacity: 1; width: 83px; height: 79px; transform: matrix(1, 0, 0, 1, -314, -41);"><g   width="83px" height="79px" style="display: block; visibility: visible; opacity: 1; width: 83px; height: 79px; transform: matrix(1, 0, 0, 1, 0, 0);"><use xmlns:xlink="http://www.w3.org/1999/xlink"   fill="black" fill-opacity="1" filter="" width="83px" height="79px" style="display: block; visibility: visible; opacity: 1; width: 83px; height: 79px; transform: matrix(1, 0, 0, 1, 0, 0);"></use><use xmlns:xlink="http://www.w3.org/1999/xlink"   stroke="#979797" stroke-width="1" fill="#D8D8D8" fill-rule="evenodd" width="83px" height="79px" style="display: block; visibility: visible; opacity: 1; width: 83px; height: 79px; transform: matrix(1, 0, 0, 1, 0, 0);"></use></g></g></svg><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" source="designs/Basic.sketch.contents/slices/Oval.svg" haiku-title="Oval"  viewBox="0 0 88 87" style="position: absolute; margin: 0px; padding: 0px; border: 0px; z-index: 2; display: block; visibility: visible; opacity: 1; width: 88px; height: 87px; transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 56, 57, 0, 1);"><g   stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" width="88px" height="87px" style="display: block; visibility: visible; opacity: 1; width: 88px; height: 87px; transform: matrix(1, 0, 0, 1, -167, -38);"><ellipse   stroke="rgb(0, 0, 0)" fill="rgb(216, 216, 216)" cx="211" cy="81.5" rx="43" ry="42.5" width="88px" height="87px" style="display: block; visibility: visible; opacity: 1; width: 88px; height: 87px; transform: matrix(1, 0, 0, 1, 0, 0);"></ellipse></g></svg><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" source="designs/Basic.sketch.contents/slices/Rectangle.svg" haiku-title="Rectangle"  viewBox="0 0 85 85" style="position: absolute; margin: 0px; padding: 0px; border: 0px; z-index: 3; display: block; visibility: visible; opacity: 1; width: 85px; height: 85px; transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 158, 158, 0, 1);"><defs ><rect   x="32" y="38" width="85px" height="85px" style="display: block; visibility: visible; opacity: 1; width: 85px; height: 85px; transform: matrix(1, 0, 0, 1, 0, 0);"></rect></defs><g   stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" width="85px" height="85px" style="display: block; visibility: visible; opacity: 1; width: 85px; height: 85px; transform: matrix(1, 0, 0, 1, -32, -38);"><g   width="85px" height="85px" style="display: block; visibility: visible; opacity: 1; width: 85px; height: 85px; transform: matrix(1, 0, 0, 1, 0, 0);"><use xmlns:xlink="http://www.w3.org/1999/xlink"   fill="#E50000" fill-rule="evenodd" width="85px" height="85px" style="display: block; visibility: visible; opacity: 1; width: 85px; height: 85px; transform: matrix(1, 0, 0, 1, 0, 0);"></use><rect  stroke="rgb(151, 151, 151)" stroke-width="1" x="32.5" y="38.5" width="84px" height="84px" style="display: block; visibility: visible; opacity: 1; width: 84px; height: 84px; transform: matrix(1, 0, 0, 1, 0, 0);"></rect></g></g></svg></div></div>')
//           cb()
//         })
//       },
//     ], (err) => {
//       if (err) throw err
//       done(() => {
//         t.ok(true, 'finished sequence')
//       })
//     })
//   })
// })
