// const tape = require('tape')
// const fse = require('fs-extra')
// const path = require('path')
// const async = require('async')
// const TestHelpers = require('../TestHelpers')

// tape('delete first polygon', (t) => {
//   t.plan(2)

//   TestHelpers.e2e(({ plumbing, folder, relpath }, done) => {
//     fse.outputFileSync(path.join(folder, 'Polygon.svg'), POLYGON_SVG)

//     async.series([
//       (cb) => {
//         return plumbing.method(
//           'instantiateComponent',
//           [relpath, 'Polygon.svg', {x: 100, y: 100}],
//           cb
//         )
//       },
//       (cb) => {
//         return plumbing.method(
//           'instantiateComponent',
//           [relpath, 'Polygon.svg', {x: 250, y: 250}],
//           cb
//         )
//       },
//       (cb) => {
//         return plumbing.method(
//           'deleteComponent',
//           [relpath, '5f4cf86093c0'],
//           cb
//         )
//       },
//       (cb) => {
//         return plumbing.exec((fin) => {
//           const el = window.document.querySelector('[haiku-id="e4a9e4d8baa7"]')
//           return fin(null, el.innerHTML)
//         }, { views: ['glass'] }, (err, output) => {
//           if (err) throw err
//           t.equal(TestHelpers.stripUnstableIdsFromHtml(output.glass), '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" source="Polygon.svg" haiku-title="Polygon"  viewBox="0 0 92 78" style="position: absolute; margin: 0px; padding: 0px; border: 0px; z-index: 2; display: block; visibility: visible; opacity: 1; width: 92px; height: 78px; transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 204, 211, 0, 1);"><defs ><linearGradient   x1="50%" y1="0%" x2="50%" y2="100%"><stop  stop-color="rgb(238, 238, 238)" offset="0%"></stop><stop  stop-color="rgb(216, 216, 216)" offset="100%"></stop></linearGradient></defs><g   stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" width="92px" height="78px" style="display: block; visibility: visible; opacity: 1; width: 92px; height: 78px; transform: matrix(1, 0, 0, 1, 0, 0);"><polygon   stroke="rgb(151, 151, 151)" fill="" points="46 2 87.8464867 28.6028457 71.8625511 71.6471543 20.1374489 71.6471543 4.15351328 28.6028457" width="92px" height="78px" style="display: block; visibility: visible; opacity: 1; width: 92px; height: 78px; transform: matrix(1, 0, 0, 1, 0, 0);"></polygon></g></svg>')
//           cb()
//         })
//       }
//     ], (err) => {
//       if (err) throw err
//       done(() => {
//         t.ok(true, 'finished sequence')
//       })
//     })
//   })
// })

// const POLYGON_SVG = `
// <?xml version="1.0" encoding="UTF-8"?>
// <svg width="92px" height="78px" viewBox="0 0 92 78" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
//     <!-- Generator: sketchtool 48.2 (47327) - http://www.bohemiancoding.com/sketch -->
//     <title>Polygon</title>
//     <desc>Created with sketchtool.</desc>
//     <defs>
//         <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
//             <stop stop-color="#EEEEEE" offset="0%"></stop>
//             <stop stop-color="#D8D8D8" offset="100%"></stop>
//         </linearGradient>
//     </defs>
//     <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
//         <polygon id="Polygon" stroke="#979797" fill="url(#linearGradient-1)" points="46 2 87.8464867 28.6028457 71.8625511 71.6471543 20.1374489 71.6471543 4.15351328 28.6028457"></polygon>
//     </g>
// </svg>
// `
