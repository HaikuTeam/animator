const tape = require('tape')
const path = require('path')
const fse = require('haiku-fs-extra')

const Project = require('./../../src/bll/Project')

const HaikuContext = require('@haiku/core/lib/HaikuContext').default
const HaikuHTMLRenderer = require('@haiku/core/lib/renderers/html').default

const {assertXmlIsEquivalent} = require('haiku-testing/lib/assertions')

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

        assertXmlIsEquivalent(
          t,
          component.performFullFlushRenderWithRenderer(component.context.renderer, {}),
          '<div><div style="position:relative;margin:0;padding:0;border:0;webkitTapHighlightColor:rgba(0,0,0,0);transformStyle:flat;perspective:none;overflowX:hidden;overflowY:hidden;display:block;visibility:visible;opacity:1;width:550px;height:400px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);" sizeAbsolute.x="550" sizeMode.x="1" sizeAbsolute.y="400" sizeMode.y="1" haiku-title="Main" haiku-id="03757d2ca102"><svg style="position:absolute;margin:0;padding:0;border:0;zIndex:2;display:block;visibility:visible;opacity:1;width:395px;height:287px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,77.5,56.5,0,1);" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" haiku-source="designs/RasterTile.svg" haiku-title="RasterTile" haiku-id="3b0d38e48e0b"><defs haiku-id="f62ebfc9a905"><pattern style="display:block;visibility:visible;opacity:1;width:69px;height:38px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);" id="pattern-1-038ab3" haiku-id="9b2802ecf433" x="-69" y="-38" patternUnits="userSpaceOnUse" width="69px" height="38px"><use style="display:block;visibility:visible;opacity:1;width:69px;height:38px;transform:matrix(1,0,0,1,0,0);" xlink:href="#image-2-038ab3" haiku-id="4ae1828a8f42" width="69px" height="38px"></use></pattern><image style="display:block;visibility:visible;opacity:1;width:69px;height:38px;transform:matrix(1,0,0,1,0,0);" id="image-2-038ab3" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoA" haiku-id="09ae8e66107b" width="69px" height="38px"></image></defs><g style="display:block;visibility:visible;opacity:1;width:395px;height:287px;transform:matrix(1,0,0,1,0,0);" id="Page-1" haiku-id="6f17e870a9ed" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" width="395px" height="287px"><rect style="display:block;visibility:visible;opacity:1;width:395px;height:287px;transform:matrix(1,0,0,1,0,0);" id="Rectangle" haiku-id="4ec8dd290e7f" fill="url(#pattern-1-038ab3)" x="0" y="0" width="395px" height="287px"></rect></g></svg><svg style="position:absolute;margin:0;padding:0;border:0;zIndex:1;display:block;visibility:visible;opacity:1;width:52.01px;height:64.41px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,248.995,167.79500000000002,0,1);" xmlns="http://www.w3.org/2000/svg" haiku-source="designs/Ativo.svg" haiku-title="Ativo" haiku-id="cdf8e3b838b6" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"><path style="display:block;visibility:visible;opacity:1;width:52.01px;height:64.41px;transform:matrix(1,0,0,1,0,0);" haiku-id="54598d6634a2" d="M6,46.61C13.690000000000001,49.94,19.55,51.61,27.36,51.61C34.7,51.61,37.57,48.86,37.57,45.61C37.57,42.05,34.01,40.45,24.37,38.379999999999995C10.940000000000001,35.379999999999995,1.1799999999999997,31.029999999999994,1.1799999999999997,18.979999999999997C1.15,7.8,10.45,0,24.91,0A62.54,62.54,0,0,1,49.25,5.05L44,16.76C37.92,14.46,30.8,12.760000000000002,24.6,12.760000000000002C18.400000000000002,12.760000000000002,15.410000000000002,14.940000000000001,15.410000000000002,18.270000000000003C15.410000000000002,21.600000000000005,19.200000000000003,23.330000000000002,29.19,25.390000000000004C43.660000000000004,28.390000000000004,52.040000000000006,33.39,52.040000000000006,44.790000000000006C52.040000000000006,56.620000000000005,42.970000000000006,64.43,27.040000000000006,64.43C16.250000000000007,64.43,9.240000000000006,62.93000000000001,0.04000000000000625,58.43000000000001Z" fill="rgb(87, 163, 50)" width="52.01px" height="64.41px"></path></svg></div></div>',
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

        assertXmlIsEquivalent(
          t,
          component.performFullFlushRenderWithRenderer(component.context.renderer, {}),
          '<div><div style="position:relative;margin:0;padding:0;border:0;webkitTapHighlightColor:rgba(0,0,0,0);transformStyle:flat;perspective:none;overflowX:hidden;overflowY:hidden;display:block;visibility:visible;opacity:1;width:550px;height:400px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);" sizeAbsolute.x="550" sizeMode.x="1" sizeAbsolute.y="400" sizeMode.y="1" haiku-title="Main" haiku-id="03757d2ca102"><svg style="position:absolute;margin:0;padding:0;border:0;zIndex:3;display:block;visibility:visible;opacity:1;width:277px;height:198px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,136.5,101,0,1);" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" haiku-source="designs/FigmaThing.svg" haiku-title="FigmaThing" haiku-id="9b0d62751860"><g style="display:block;visibility:visible;opacity:1;width:277px;height:198px;transform:matrix(1,0,0,1,0,0);" haiku-id="b993864a755d" data-name="Canvas" fill="none" width="277px" height="198px"><g style="display:block;visibility:visible;opacity:1;width:277px;height:198px;transform:matrix(1,0,0,1,0,0);" haiku-id="763d8404ab68" data-name="Rectangle" width="277px" height="198px"><rect style="display:block;visibility:visible;opacity:1;width:194px;height:260px;transform:matrix(1,0,0,1,249,185);" haiku-id="43ce70347fff" rx="32" fill="rgb(0, 255, 109)" width="194px" height="260px"></rect></g><g style="display:block;visibility:visible;opacity:1;width:277px;height:198px;transform:matrix(1,0,0,1,0,0);" haiku-id="3c0c6c483490" data-name="forest" width="277px" height="198px"><rect style="display:block;visibility:visible;opacity:1;width:200px;height:134px;transform:matrix(1,0,0,1,27,25);" haiku-id="704163f83dc2" fill="url(#pattern0-50b7e7)" width="200px" height="134px"></rect></g></g><defs haiku-id="2ece3660adbc"><pattern style="display:block;visibility:visible;opacity:1;width:1px;height:1px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);" id="pattern0-50b7e7" haiku-id="848faa346550" patternContentUnits="objectBoundingBox" width="1px" height="1px"><use style="display:block;visibility:visible;opacity:1;width:1px;height:1px;transform:matrix(0.002,0,0,0.004,0,0);" xlink:href="#image0-50b7e7" haiku-id="b32d26f44e91" width="1px" height="1px"></use></pattern><image style="display:block;visibility:visible;opacity:1;width:400px;height:268px;transform:matrix(1,0,0,1,0,0);" id="image0-50b7e7" xlink:href="data:image/png;base64,iVBORw0KG" haiku-id="f80f9cded255" data-name="forest.png" width="400px" height="268px"></image></defs></svg><svg style="position:absolute;margin:0;padding:0;border:0;zIndex:2;display:block;visibility:visible;opacity:1;width:395px;height:287px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,77.5,56.5,0,1);" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" haiku-source="designs/RasterTile.svg" haiku-title="RasterTile" haiku-id="3b0d38e48e0b"><defs haiku-id="f62ebfc9a905"><pattern style="display:block;visibility:visible;opacity:1;width:69px;height:38px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);" id="pattern-1-038ab3" haiku-id="9b2802ecf433" x="-69" y="-38" patternUnits="userSpaceOnUse" width="69px" height="38px"><use style="display:block;visibility:visible;opacity:1;width:69px;height:38px;transform:matrix(1,0,0,1,0,0);" xlink:href="#image-2-038ab3" haiku-id="4ae1828a8f42" width="69px" height="38px"></use></pattern><image style="display:block;visibility:visible;opacity:1;width:69px;height:38px;transform:matrix(1,0,0,1,0,0);" id="image-2-038ab3" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoA" haiku-id="09ae8e66107b" width="69px" height="38px"></image></defs><g style="display:block;visibility:visible;opacity:1;width:395px;height:287px;transform:matrix(1,0,0,1,0,0);" id="Page-1" haiku-id="6f17e870a9ed" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" width="395px" height="287px"><rect style="display:block;visibility:visible;opacity:1;width:395px;height:287px;transform:matrix(1,0,0,1,0,0);" id="Rectangle" haiku-id="4ec8dd290e7f" fill="url(#pattern-1-038ab3)" x="0" y="0" width="395px" height="287px"></rect></g></svg><svg style="position:absolute;margin:0;padding:0;border:0;zIndex:1;display:block;visibility:visible;opacity:1;width:52.01px;height:64.41px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,248.995,167.79500000000002,0,1);" xmlns="http://www.w3.org/2000/svg" haiku-source="designs/Ativo.svg" haiku-title="Ativo" haiku-id="cdf8e3b838b6" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"><path style="display:block;visibility:visible;opacity:1;width:52.01px;height:64.41px;transform:matrix(1,0,0,1,0,0);" haiku-id="54598d6634a2" d="M6,46.61C13.690000000000001,49.94,19.55,51.61,27.36,51.61C34.7,51.61,37.57,48.86,37.57,45.61C37.57,42.05,34.01,40.45,24.37,38.379999999999995C10.940000000000001,35.379999999999995,1.1799999999999997,31.029999999999994,1.1799999999999997,18.979999999999997C1.15,7.8,10.45,0,24.91,0A62.54,62.54,0,0,1,49.25,5.05L44,16.76C37.92,14.46,30.8,12.760000000000002,24.6,12.760000000000002C18.400000000000002,12.760000000000002,15.410000000000002,14.940000000000001,15.410000000000002,18.270000000000003C15.410000000000002,21.600000000000005,19.200000000000003,23.330000000000002,29.19,25.390000000000004C43.660000000000004,28.390000000000004,52.040000000000006,33.39,52.040000000000006,44.790000000000006C52.040000000000006,56.620000000000005,42.970000000000006,64.43,27.040000000000006,64.43C16.250000000000007,64.43,9.240000000000006,62.93000000000001,0.04000000000000625,58.43000000000001Z" fill="rgb(87, 163, 50)" width="52.01px" height="64.41px"></path></svg></div></div>',
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
