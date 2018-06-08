const tape = require('tape')
const path = require('path')
const fse = require('haiku-fs-extra')

const Project = require('./../../src/bll/Project')
const File = require('./../../src/bll/File')
const Element = require('./../../src/bll/Element')

const HaikuContext = require('@haiku/core/lib/HaikuContext').default
const HaikuHTMLRenderer = require('@haiku/core/lib/renderers/html').default

tape('ActiveComponent.3.svg-pattern', (t) => {
  t.plan(1)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'render-ativo-html')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', {from: 'test'}, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/RasterTile.svg'), RASTER_TILE_SVG)
      const ac0 = project.getCurrentActiveComponent()
      return ac0.instantiateComponent('designs/RasterTile.svg', {}, {from: 'test'}, (err, mana) => {
        if (err) throw err

        const bc = ac0.getReifiedBytecode()

        const factory = HaikuContext.createComponentFactory(
          HaikuHTMLRenderer,
          bc,
          { // config
            size: {x: 100, y: 100},
            user: {}
          },
          {}, // platform
        )

        const component = factory()

        t.equal(
          component.performFullFlushRenderWithRenderer(component.context.renderer, {}),
          '<div><div style="position:relative;margin:0;padding:0;border:0;webkitTapHighlightColor:rgba(0,0,0,0);transformStyle:flat;perspective:none;overflowX:hidden;overflowY:hidden;display:block;visibility:visible;opacity:1;width:550px;height:400px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);" sizeAbsolute.x="550" sizeMode.x="1" sizeAbsolute.y="400" sizeMode.y="1" haiku-title="Main" haiku-id="03757d2ca102"><svg style="position:absolute;margin:0;padding:0;border:0;zIndex:1;display:block;visibility:visible;opacity:1;width:395px;height:287px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,77.5,56.5,0,1);" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" haiku-source="designs/RasterTile.svg" haiku-title="RasterTile" haiku-id="b4bb6d8a2715"><defs haiku-id="e63b53e807b6"><pattern style="display:block;visibility:visible;opacity:1;width:69px;height:38px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);" id="pattern-1-ba41b8" haiku-id="617d1805040b" x="-69" y="-38" patternUnits="userSpaceOnUse" width="69px" height="38px"><use style="display:block;visibility:visible;opacity:1;width:69px;height:38px;transform:matrix(1,0,0,1,0,0);" xlink:href="#image-2-ba41b8" haiku-id="b2aba968f435" width="69px" height="38px"></use></pattern><image style="display:block;visibility:visible;opacity:1;width:69px;height:38px;transform:matrix(1,0,0,1,0,0);" id="image-2-ba41b8" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoA" haiku-id="3e0c0fcd2e7d" width="69px" height="38px"></image></defs><g style="display:block;visibility:visible;opacity:1;width:395px;height:287px;transform:matrix(1,0,0,1,0,0);" id="Page-1" haiku-id="6263d816162a" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" width="395px" height="287px"><rect style="display:block;visibility:visible;opacity:1;width:395px;height:287px;transform:matrix(1,0,0,1,0,0);" id="Rectangle" haiku-id="487f59e3bed2" fill="url(#pattern-1-ba41b8)" x="0" y="0" width="395px" height="287px"></rect></g></svg></div></div>',
          'html output ok'
        )
      })
    })
  })
})

tape('ActiveComponent.3.svg-figma-pattern', (t) => {
  t.plan(1)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'render-ativo-html')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', {from: 'test'}, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/FigmaThing.svg'), FIGMA_SVG)
      const ac0 = project.getCurrentActiveComponent()
      return ac0.instantiateComponent('designs/FigmaThing.svg', {}, {from: 'test'}, (err, mana) => {
        if (err) throw err

        const bc = ac0.getReifiedBytecode()

        const factory = HaikuContext.createComponentFactory(
          HaikuHTMLRenderer,
          bc,
          { // config
            size: {x: 100, y: 100},
            user: {}
          },
          {}, // platform
        )

        const component = factory()

        t.equal(
          component.performFullFlushRenderWithRenderer(component.context.renderer, {}),
          '<div><div style="position:relative;margin:0;padding:0;border:0;webkitTapHighlightColor:rgba(0,0,0,0);transformStyle:flat;perspective:none;overflowX:hidden;overflowY:hidden;display:block;visibility:visible;opacity:1;width:550px;height:400px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);" sizeAbsolute.x="550" sizeMode.x="1" sizeAbsolute.y="400" sizeMode.y="1" haiku-title="Main" haiku-id="03757d2ca102"><svg style="position:absolute;margin:0;padding:0;border:0;zIndex:2;display:block;visibility:visible;opacity:1;width:277px;height:198px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,136.5,101,0,1);" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" haiku-source="designs/FigmaThing.svg" haiku-title="FigmaThing" haiku-id="f49eef15768e"><g style="display:block;visibility:visible;opacity:1;width:277px;height:198px;transform:matrix(1,0,0,1,0,0);" haiku-id="182f90874dce" data-name="Canvas" fill="none" width="277px" height="198px"><g style="display:block;visibility:visible;opacity:1;width:277px;height:198px;transform:matrix(1,0,0,1,0,0);" haiku-id="a4dfe2d9de8c" data-name="Rectangle" width="277px" height="198px"><rect style="display:block;visibility:visible;opacity:1;width:194px;height:260px;transform:matrix(1,0,0,1,249,185);" haiku-id="796560c0e0e9" rx="32" fill="rgb(0, 255, 109)" width="194px" height="260px"></rect></g><g style="display:block;visibility:visible;opacity:1;width:277px;height:198px;transform:matrix(1,0,0,1,0,0);" haiku-id="9011e285df7d" data-name="forest" width="277px" height="198px"><rect style="display:block;visibility:visible;opacity:1;width:200px;height:134px;transform:matrix(1,0,0,1,27,25);" haiku-id="5bcb60d96eba" fill="url(#pattern0-0762b7)" width="200px" height="134px"></rect></g></g><defs haiku-id="6e1711ceb830"><pattern style="display:block;visibility:visible;opacity:1;width:1px;height:1px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);" id="pattern0-0762b7" haiku-id="ede7f9e4112b" patternContentUnits="objectBoundingBox" width="1px" height="1px"><use style="display:block;visibility:visible;opacity:1;width:1px;height:1px;transform:matrix(0.002,0,0,0.004,0,0);" xlink:href="#image0-0762b7" haiku-id="c4c0771d6b75" width="1px" height="1px"></use></pattern><image style="display:block;visibility:visible;opacity:1;width:400px;height:268px;transform:matrix(1,0,0,1,0,0);" id="image0-0762b7" xlink:href="data:image/png;base64,iVBORw0KG" haiku-id="bccf68acdb25" data-name="forest.png" width="400px" height="268px"></image></defs></svg><svg style="position:absolute;margin:0;padding:0;border:0;zIndex:1;display:block;visibility:visible;opacity:1;width:395px;height:287px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,77.5,56.5,0,1);" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" haiku-source="designs/RasterTile.svg" haiku-title="RasterTile" haiku-id="b4bb6d8a2715"><defs haiku-id="e63b53e807b6"><pattern style="display:block;visibility:visible;opacity:1;width:69px;height:38px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);" id="pattern-1-ba41b8" haiku-id="617d1805040b" x="-69" y="-38" patternUnits="userSpaceOnUse" width="69px" height="38px"><use style="display:block;visibility:visible;opacity:1;width:69px;height:38px;transform:matrix(1,0,0,1,0,0);" xlink:href="#image-2-ba41b8" haiku-id="b2aba968f435" width="69px" height="38px"></use></pattern><image style="display:block;visibility:visible;opacity:1;width:69px;height:38px;transform:matrix(1,0,0,1,0,0);" id="image-2-ba41b8" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoA" haiku-id="3e0c0fcd2e7d" width="69px" height="38px"></image></defs><g style="display:block;visibility:visible;opacity:1;width:395px;height:287px;transform:matrix(1,0,0,1,0,0);" id="Page-1" haiku-id="6263d816162a" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" width="395px" height="287px"><rect style="display:block;visibility:visible;opacity:1;width:395px;height:287px;transform:matrix(1,0,0,1,0,0);" id="Rectangle" haiku-id="487f59e3bed2" fill="url(#pattern-1-ba41b8)" x="0" y="0" width="395px" height="287px"></rect></g></svg></div></div>',
          'html output ok'
        )
      })
    })
  })
})

const RASTER_TILE_SVG = `
<svg width="395px" height="287px" viewBox="0 0 395 287" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 49.3 (51167) - http://www.bohemiancoding.com/sketch -->
    <desc>Created with Sketch.</desc>
    <defs>
        <pattern id="pattern-1" width="69" height="38" x="-69" y="-38" patternUnits="userSpaceOnUse">
            <use xlink:href="#image-2"></use>
        </pattern>
        <image id="image-2" width="69" height="38" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoA"></image>
    </defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <rect id="Rectangle" fill="url(#pattern-1)" x="0" y="0" width="395" height="287"></rect>
    </g>
</svg>
`

const FIGMA_SVG = `
<svg width="277" height="198" viewBox="0 0 277 198" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g data-name="Canvas" fill="none">
    <g data-name="Rectangle">
      <rect width="194" height="260" rx="32" transform="translate(249 185)" fill="#00FF6D"/>
    </g>
    <g data-name="forest">
      <rect width="200" height="134" transform="translate(27 25)" fill="url(#pattern0)"/>
    </g>
  </g>
  <defs>
    <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
      <use xlink:href="#image0" transform="scale(0.0025 0.00373134)"/>
    </pattern>
    <image id="image0" data-name="forest.png" width="400" height="268" xlink:href="data:image/png;base64,iVBORw0KG"/>
  </defs>
</svg>
`
