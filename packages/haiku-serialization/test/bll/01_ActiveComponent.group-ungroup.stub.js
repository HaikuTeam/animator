const tape = require('tape')
const path = require('path')
const async = require('async')
const fse = require('haiku-fs-extra')

const Project = require('./../../src/bll/Project')
const File = require('./../../src/bll/File')
const Element = require('./../../src/bll/Element')

const waitUntilFileProbablyWroteToDisk = (fn) => {
  return setTimeout(fn, 2000) // Disk writes happen on a 500ms interval
}

tape('ActiveComponent.prototype.groupElements[1]', (t) => {
  t.plan(2)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'group-elements-01')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: false }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Path.svg'), PATH_SVG_3)
      const ac0 = project.getCurrentActiveComponent()
      return async.series([
        (cb) => { return ac0.instantiateComponent('designs/Path.svg', {x: 0, y: 1}, {from: 'test'}, cb) },
        (cb) => { return ac0.instantiateComponent('designs/Path.svg', {x: 52, y: 53}, {from: 'test'}, cb) },
        (cb) => { return ac0.instantiateComponent('designs/Path.svg', {x: 104, y: 105}, {from: 'test'}, cb) },
        (cb) => { return ac0.instantiateComponent('designs/Path.svg', {x: 156, y: 157}, {from: 'test'}, cb) },
        (cb) => { return ac0.instantiateComponent('designs/Path.svg', {x: 208, y: 209}, {from: 'test'}, cb) },
        (cb) => { return waitUntilFileProbablyWroteToDisk(cb) },
        (cb) => {
          t.deepEqual(ac0.getReifiedBytecode().timelines.Default, {"haiku:e4a9e4d8baa7":{"style.WebkitTapHighlightColor":{"0":{"value":"rgba(0,0,0,0)"}},"style.transformStyle":{"0":{"value":"preserve-3d"}},"style.perspective":{"0":{"value":"500px"}},"style.position":{"0":{"value":"relative"}},"style.overflowX":{"0":{"value":"hidden"}},"style.overflowY":{"0":{"value":"hidden"}},"sizeAbsolute.x":{"0":{"value":550}},"sizeAbsolute.y":{"0":{"value":400}},"sizeMode.x":{"0":{"value":1}},"sizeMode.y":{"0":{"value":1}},"sizeMode.z":{"0":{"value":1}}},"haiku:cabf7e56c2a8":{"style.position":{"0":{"value":"absolute"}},"style.margin":{"0":{"value":"0"}},"style.padding":{"0":{"value":"0"}},"style.border":{"0":{"value":"0"}},"sizeAbsolute.x":{"0":{"value":68}},"sizeMode.x":{"0":{"value":1}},"sizeAbsolute.y":{"0":{"value":89}},"sizeMode.y":{"0":{"value":1}},"translation.x":{"0":{"value":-34,"edited":true}},"translation.y":{"0":{"value":-43.5,"edited":true}}},"haiku:d043fc6f6ceb":{"stroke":{"0":{"value":"none"}},"stroke-width":{"0":{"value":"1"}},"fill":{"0":{"value":"none"}},"fill-rule":{"0":{"value":"evenodd"}}},"haiku:cc5c001ef1ff":{"d":{"0":{"value":"M17.5653834,3.24972415 Z"}},"stroke":{"0":{"value":"#979797"}},"fill":{"0":{"value":"#FF0000"}}},"haiku:abd13143c718":{"style.position":{"0":{"value":"absolute"}},"style.margin":{"0":{"value":"0"}},"style.padding":{"0":{"value":"0"}},"style.border":{"0":{"value":"0"}},"sizeAbsolute.x":{"0":{"value":68}},"sizeMode.x":{"0":{"value":1}},"sizeAbsolute.y":{"0":{"value":89}},"sizeMode.y":{"0":{"value":1}},"translation.x":{"0":{"value":18,"edited":true}},"translation.y":{"0":{"value":8.5,"edited":true}}},"haiku:a4cb93aff937":{"stroke":{"0":{"value":"none"}},"stroke-width":{"0":{"value":"1"}},"fill":{"0":{"value":"none"}},"fill-rule":{"0":{"value":"evenodd"}}},"haiku:4f40cf8e6244":{"d":{"0":{"value":"M17.5653834,3.24972415 Z"}},"stroke":{"0":{"value":"#979797"}},"fill":{"0":{"value":"#FF0000"}}},"haiku:8783651bad4c":{"style.position":{"0":{"value":"absolute"}},"style.margin":{"0":{"value":"0"}},"style.padding":{"0":{"value":"0"}},"style.border":{"0":{"value":"0"}},"sizeAbsolute.x":{"0":{"value":68}},"sizeMode.x":{"0":{"value":1}},"sizeAbsolute.y":{"0":{"value":89}},"sizeMode.y":{"0":{"value":1}},"translation.x":{"0":{"value":70,"edited":true}},"translation.y":{"0":{"value":60.5,"edited":true}}},"haiku:c027eee056b2":{"stroke":{"0":{"value":"none"}},"stroke-width":{"0":{"value":"1"}},"fill":{"0":{"value":"none"}},"fill-rule":{"0":{"value":"evenodd"}}},"haiku:808be814ea30":{"d":{"0":{"value":"M17.5653834,3.24972415 Z"}},"stroke":{"0":{"value":"#979797"}},"fill":{"0":{"value":"#FF0000"}}},"haiku:3c0bbfcd4fa5":{"style.position":{"0":{"value":"absolute"}},"style.margin":{"0":{"value":"0"}},"style.padding":{"0":{"value":"0"}},"style.border":{"0":{"value":"0"}},"sizeAbsolute.x":{"0":{"value":68}},"sizeMode.x":{"0":{"value":1}},"sizeAbsolute.y":{"0":{"value":89}},"sizeMode.y":{"0":{"value":1}},"translation.x":{"0":{"value":122,"edited":true}},"translation.y":{"0":{"value":112.5,"edited":true}}},"haiku:6a138c2a4278":{"stroke":{"0":{"value":"none"}},"stroke-width":{"0":{"value":"1"}},"fill":{"0":{"value":"none"}},"fill-rule":{"0":{"value":"evenodd"}}},"haiku:91d48a49d96b":{"d":{"0":{"value":"M17.5653834,3.24972415 Z"}},"stroke":{"0":{"value":"#979797"}},"fill":{"0":{"value":"#FF0000"}}},"haiku:f9c0e32236de":{"style.position":{"0":{"value":"absolute"}},"style.margin":{"0":{"value":"0"}},"style.padding":{"0":{"value":"0"}},"style.border":{"0":{"value":"0"}},"sizeAbsolute.x":{"0":{"value":68}},"sizeMode.x":{"0":{"value":1}},"sizeAbsolute.y":{"0":{"value":89}},"sizeMode.y":{"0":{"value":1}},"translation.x":{"0":{"value":174,"edited":true}},"translation.y":{"0":{"value":164.5,"edited":true}}},"haiku:728316f5e39f":{"stroke":{"0":{"value":"none"}},"stroke-width":{"0":{"value":"1"}},"fill":{"0":{"value":"none"}},"fill-rule":{"0":{"value":"evenodd"}}},"haiku:5ec99d0a7677":{"d":{"0":{"value":"M17.5653834,3.24972415 Z"}},"stroke":{"0":{"value":"#979797"}},"fill":{"0":{"value":"#FF0000"}}}})
          const ids = ac0.getReifiedBytecode().template.children.map((c) => c.attributes['haiku-id'])
          return ac0.groupElements(ids.slice(1,3),{from: 'test'},cb)
        },
        (cb) => { return waitUntilFileProbablyWroteToDisk(cb) },
      ], (err) => {
        if (err) throw err
        fse.removeSync(folder)
        t.ok(true)
      })
    })
  })
})

const PATH_SVG_3 = `
  <?xml version="1.0" encoding="UTF-8"?>
  <svg width="68px" height="89px" viewBox="0 0 68 89" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <!-- Generator: sketchtool 47.1 (45422) - http://www.bohemiancoding.com/sketch -->
      <title>Path 4</title>
      <desc>Created with sketchtool.</desc>
      <defs></defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <path d="M17.5653834,3.24972415 Z" id="Path-4" stroke="#979797" fill="#FF0000"></path>
      </g>
  </svg>
`

const RECT_SVG_1 = `
  <?xml version="1.0" encoding="UTF-8"?>
  <svg width="79px" height="79px" viewBox="0 0 79 79" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <!-- Generator: sketchtool 47.1 (45422) - http://www.bohemiancoding.com/sketch -->
      <title>Rectangle</title>
      <desc>Created with sketchtool.</desc>
      <defs>
          <rect id="path-1" x="0" y="0" width="79" height="79"></rect>
      </defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Rectangle">
              <use fill="#420000" fill-rule="evenodd" xlink:href="#path-1"></use>
              <rect stroke="#9200FF" stroke-width="16" x="8" y="8" width="63" height="63"></rect>
          </g>
      </g>
  </svg>
`

const CIRCLE_SVG_2 = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="41px" height="41px" viewBox="0 0 41 41" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: sketchtool 47.1 (45422) - http://www.bohemiancoding.com/sketch -->
    <title>Circle</title>
    <desc>Created with sketchtool.</desc>
    <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
            <stop stop-color="#D13434" offset="0%"></stop>
            <stop stop-color="#D8D8D8" offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-2">
            <stop stop-color="#4F78EC" offset="0%"></stop>
            <stop stop-color="#979797" offset="100%"></stop>
        </linearGradient>
        <circle id="path-3" cx="20.5" cy="20.5" r="19.5"></circle>
        <filter x="-5.1%" y="-5.1%" width="117.9%" height="110.3%" filterUnits="objectBoundingBox" id="filter-4">
            <feMorphology radius="0.5" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"></feMorphology>
            <feOffset dx="3" dy="0" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
            <feComposite in="shadowOffsetOuter1" in2="SourceAlpha" operator="out" result="shadowOffsetOuter1"></feComposite>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowOffsetOuter1"></feColorMatrix>
        </filter>
        <filter x="-3.8%" y="-3.8%" width="115.4%" height="107.7%" filterUnits="objectBoundingBox" id="filter-5">
            <feOffset dx="-2" dy="0" in="SourceAlpha" result="shadowOffsetInner1"></feOffset>
            <feComposite in="shadowOffsetInner1" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowInnerInner1"></feComposite>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowInnerInner1"></feColorMatrix>
        </filter>
    </defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Circle">
            <use fill="black" fill-opacity="1" filter="url(#filter-4)" xlink:href="#path-3"></use>
            <use fill="url(#linearGradient-1)" fill-rule="evenodd" xlink:href="#path-3"></use>
            <use fill="black" fill-opacity="1" filter="url(#filter-5)" xlink:href="#path-3"></use>
            <use stroke="url(#linearGradient-2)" stroke-width="1" xlink:href="#path-3"></use>
        </g>
    </g>
</svg>
`

const PERCY_NOSE_1 = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="42px" height="28px" viewBox="0 0 42 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: sketchtool 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
    <title>nose</title>
    <desc>Created with sketchtool.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Screen-3" transform="translate(-35.000000, -253.000000)">
            <g id="percy" transform="translate(35.000000, 181.000000)">
                <g id="nose" transform="translate(0.000000, 72.378378)">
                    <rect id="Rectangle-2" fill="#FFFFFF" x="0" y="0" width="41.3401361" height="26.7027027" rx="13.3513514"></rect>
                    <path d="M41.3401361,13.3513514 L41.3401361,13.3513514 L41.3401361,13.3513514 C41.3401361,20.7250991 35.3625324,26.7027027 27.9887847,26.7027027 L24.1967592,26.7027027 C26.8633644,22.1984406 28.1966671,17.7479901 28.1966671,13.3513514 C28.1966671,8.95471259 26.8633644,4.50426213 24.1967592,-8.41863632e-15 L27.9887847,-2.82210434e-14 L27.9887847,-2.66453526e-14 C35.3625324,-6.72951098e-14 41.3401361,5.97760361 41.3401361,13.3513514 Z" id="Rectangle-2-Copy" fill="#FEDFE6"></path>
                    <rect id="Rectangle-2-Copy-2" stroke="#FF5E87" stroke-width="3.5" x="1.75" y="1.75" width="37.8401361" height="23.2027027" rx="11.6013514"></rect>
                    <ellipse id="Oval-4" fill="#FF5E87" cx="10.8605442" cy="13.7027027" rx="3.15306122" ry="3.16216216"></ellipse>
                    <ellipse id="Oval-4-Copy" fill="#FF5E87" cx="24.8741497" cy="13.7027027" rx="3.15306122" ry="3.16216216"></ellipse>
                </g>
            </g>
        </g>
    </g>
</svg>
`
