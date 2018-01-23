const tape = require('tape')
const fse = require('fs-extra')
const path = require('path')
const async = require('async')
const TestHelpers = require('../TestHelpers')

tape('undo shadow element crash fix', (t) => {
  t.plan(1)

  TestHelpers.e2e(({ plumbing, folder, relpath }, done) => {
    fse.outputFileSync(path.join(folder, 'Circle.svg'), CIRCLE_WITH_SHADOW)

    async.series([
      (cb) => {
        return plumbing.method(
          'instantiateComponent',
          [relpath, 'Circle.svg', { x: 100, y: 100 }],
          TestHelpers.wait(1, cb)
        )
      },
      (cb) => {
        return plumbing.method(
          'applyPropertyGroupValue',
          [relpath, '8fc0f74f9211', 'Default', 0,
            {'translation.x': 144, 'translation.y': 155}],
          TestHelpers.wait(5, cb)
        )
      },
      (cb) => {
        return plumbing.gitUndo(folder, { type: 'global' }, TestHelpers.wait(5, cb))
      },
      (cb) => {
        return plumbing.method(
          'instantiateComponent',
          [relpath, 'Circle.svg', { x: 200, y: 200 }],
          TestHelpers.wait(1, cb)
        )
      },
      (cb) => {
        return plumbing.method(
          'applyPropertyGroupValue',
          [relpath, '28f831648747', 'Default', 0,
            {'translation.x': 266, 'translation.y': 277}],
          TestHelpers.wait(1, cb)
        )
      }
    ], (err) => {
      if (err) throw err
      t.ok(true, 'finished sequence without "cannot locate element" crash')
      done()
    })
  })
})

const CIRCLE_WITH_SHADOW = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="123px" height="123px" viewBox="0 0 123 123" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: sketchtool 47.1 (45422) - http://www.bohemiancoding.com/sketch -->
    <title>blue-circle</title>
    <desc>Created with sketchtool.</desc>
    <defs>
        <circle id="path-1" cx="246.5" cy="679.5" r="57.5"></circle>
        <filter x="-6.1%" y="-4.3%" width="112.2%" height="112.2%" filterUnits="objectBoundingBox" id="filter-2">
            <feOffset dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
            <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
        </filter>
    </defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Tutorial" transform="translate(-185.000000, -620.000000)">
            <g id="blue-circle">
                <use fill="black" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use>
                <use fill="#5DE2F9" fill-rule="evenodd" xlink:href="#path-1"></use>
            </g>
            <g id="screencaps" transform="translate(0.000000, 287.000000)"></g>
            <g id="copywriting" transform="translate(22.000000, 83.000000)"></g>
        </g>
    </g>
</svg>
`
