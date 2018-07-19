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
        const xml1 = component.performFullFlushRenderWithRenderer(component.context.renderer, {})
        const xml2 = '<div><div style="position:relative;margin:0;padding:0;border:0;webkitTapHighlightColor:rgba(0,0,0,0);overflowX:hidden;overflowY:hidden;display:block;visibility:visible;opacity:1;width:550px;height:400px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);" haiku-title="Main" sizeAbsolute.x="550" sizeMode.x="1" sizeAbsolute.y="400" sizeMode.y="1" haiku-id="03757d2ca102"><svg style="position:absolute;margin:0;padding:0;border:0;zIndex:2;display:block;visibility:visible;opacity:1;width:395px;height:287px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,77.5,56.5,0,1);" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" haiku-source="designs/RasterTile.svg" haiku-title="RasterTile" haiku-id="3b0d38e48e0b"><defs haiku-id="f62ebfc9a905"><pattern style="display:block;visibility:visible;opacity:1;width:69px;height:38px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);" id="pattern-1-038ab3" haiku-id="9b2802ecf433" x="-69" y="-38" patternUnits="userSpaceOnUse" width="69px" height="38px"><use style="display:block;visibility:visible;opacity:1;width:69px;height:38px;transform:matrix(1,0,0,1,0,0);" xlink:href="#image-2-038ab3" haiku-id="4ae1828a8f42" width="69px" height="38px"></use></pattern><image style="display:block;visibility:visible;opacity:1;width:69px;height:38px;transform:matrix(1,0,0,1,0,0);" id="image-2-038ab3" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoA" haiku-id="09ae8e66107b" width="69px" height="38px"></image></defs><g style="display:block;visibility:visible;opacity:1;width:395px;height:287px;transform:matrix(1,0,0,1,0,0);" id="Page-1" haiku-id="6f17e870a9ed" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" width="395px" height="287px"><rect style="display:block;visibility:visible;opacity:1;width:395px;height:287px;transform:matrix(1,0,0,1,0,0);" id="Rectangle" haiku-id="4ec8dd290e7f" fill="url(#pattern-1-038ab3)" x="0" y="0" width="395px" height="287px"></rect></g></svg><svg style="position:absolute;margin:0;padding:0;border:0;zIndex:1;display:block;visibility:visible;opacity:1;width:52.01px;height:64.41px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,248.995,167.79500000000002,0,1);" xmlns="http://www.w3.org/2000/svg" haiku-source="designs/Ativo.svg" haiku-title="Ativo" haiku-id="cdf8e3b838b6" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"><path style="display:block;visibility:visible;opacity:1;width:52.01px;height:64.41px;transform:matrix(1,0,0,1,0,0);" haiku-id="54598d6634a2" d="M6,46.61c7.69,3.33,13.55,5,21.36,5,7.34,0,10.21-2.75,10.21-6,0-3.56-3.56-5.16-13.2-7.23-13.43-3-23.19-7.35-23.19-19.4C1.15,7.8,10.45,0,24.91,0A62.54,62.54,0,0,1,49.25,5.05L44,16.76c-6.08-2.3-13.2-4-19.4-4s-9.19,2.18-9.19,5.51,3.79,5.06,13.78,7.12c14.47,3,22.85,8,22.85,19.4,0,11.83-9.07,19.64-25,19.64-10.79,0-17.8-1.5-27-6Z" fill="#57a332" width="52.01px" height="64.41px"></path></svg></div></div>'
        assertXmlIsEquivalent(
          t,
          xml1,
          xml2,
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
        const xml1 = component.performFullFlushRenderWithRenderer(component.context.renderer, {})
        const xml2 = '<div><div style="position:relative;margin:0;padding:0;border:0;webkitTapHighlightColor:rgba(0,0,0,0);overflowX:hidden;overflowY:hidden;display:block;visibility:visible;opacity:1;width:550px;height:400px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);" haiku-title="Main" sizeAbsolute.x="550" sizeMode.x="1" sizeAbsolute.y="400" sizeMode.y="1" haiku-id="03757d2ca102"><svg style="position:absolute;margin:0;padding:0;border:0;zIndex:3;display:block;visibility:visible;opacity:1;width:277px;height:198px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,136.5,101,0,1);" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" haiku-source="designs/FigmaThing.svg" haiku-title="FigmaThing" haiku-id="9b0d62751860"><g style="display:block;visibility:visible;opacity:1;width:277px;height:198px;transform:matrix(1,0,0,1,0,0);" haiku-id="b993864a755d" data-name="Canvas" fill="none" width="277px" height="198px"><g style="display:block;visibility:visible;opacity:1;width:277px;height:198px;transform:matrix(1,0,0,1,0,0);" haiku-id="763d8404ab68" data-name="Rectangle" width="277px" height="198px"><rect style="display:block;visibility:visible;opacity:1;width:194px;height:260px;transform:matrix(1,0,0,1,249,185);" haiku-id="43ce70347fff" rx="32" fill="#00FF6D" width="194px" height="260px"></rect></g><g style="display:block;visibility:visible;opacity:1;width:277px;height:198px;transform:matrix(1,0,0,1,0,0);" haiku-id="3c0c6c483490" data-name="forest" width="277px" height="198px"><rect style="display:block;visibility:visible;opacity:1;width:200px;height:134px;transform:matrix(1,0,0,1,27,25);" haiku-id="704163f83dc2" fill="url(#pattern0-50b7e7)" width="200px" height="134px"></rect></g></g><defs haiku-id="2ece3660adbc"><pattern style="display:block;visibility:visible;opacity:1;width:1px;height:1px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);" id="pattern0-50b7e7" haiku-id="848faa346550" patternContentUnits="objectBoundingBox" width="1px" height="1px"><use style="display:block;visibility:visible;opacity:1;width:1px;height:1px;transform:matrix(0.002,0,0,0.004,0,0);" xlink:href="#image0-50b7e7" haiku-id="b32d26f44e91" width="1px" height="1px"></use></pattern><image style="display:block;visibility:visible;opacity:1;width:400px;height:268px;transform:matrix(1,0,0,1,0,0);" id="image0-50b7e7" xlink:href="data:image/png;base64,iVBORw0KG" haiku-id="f80f9cded255" data-name="forest.png" width="400px" height="268px"></image></defs></svg><svg style="position:absolute;margin:0;padding:0;border:0;zIndex:2;display:block;visibility:visible;opacity:1;width:395px;height:287px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,77.5,56.5,0,1);" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" haiku-source="designs/RasterTile.svg" haiku-title="RasterTile" haiku-id="3b0d38e48e0b"><defs haiku-id="f62ebfc9a905"><pattern style="display:block;visibility:visible;opacity:1;width:69px;height:38px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);" id="pattern-1-038ab3" haiku-id="9b2802ecf433" x="-69" y="-38" patternUnits="userSpaceOnUse" width="69px" height="38px"><use style="display:block;visibility:visible;opacity:1;width:69px;height:38px;transform:matrix(1,0,0,1,0,0);" xlink:href="#image-2-038ab3" haiku-id="4ae1828a8f42" width="69px" height="38px"></use></pattern><image style="display:block;visibility:visible;opacity:1;width:69px;height:38px;transform:matrix(1,0,0,1,0,0);" id="image-2-038ab3" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoA" haiku-id="09ae8e66107b" width="69px" height="38px"></image></defs><g style="display:block;visibility:visible;opacity:1;width:395px;height:287px;transform:matrix(1,0,0,1,0,0);" id="Page-1" haiku-id="6f17e870a9ed" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" width="395px" height="287px"><rect style="display:block;visibility:visible;opacity:1;width:395px;height:287px;transform:matrix(1,0,0,1,0,0);" id="Rectangle" haiku-id="4ec8dd290e7f" fill="url(#pattern-1-038ab3)" x="0" y="0" width="395px" height="287px"></rect></g></svg><svg style="position:absolute;margin:0;padding:0;border:0;zIndex:1;display:block;visibility:visible;opacity:1;width:52.01px;height:64.41px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,248.995,167.79500000000002,0,1);" xmlns="http://www.w3.org/2000/svg" haiku-source="designs/Ativo.svg" haiku-title="Ativo" haiku-id="cdf8e3b838b6" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"><path style="display:block;visibility:visible;opacity:1;width:52.01px;height:64.41px;transform:matrix(1,0,0,1,0,0);" haiku-id="54598d6634a2" d="M6,46.61c7.69,3.33,13.55,5,21.36,5,7.34,0,10.21-2.75,10.21-6,0-3.56-3.56-5.16-13.2-7.23-13.43-3-23.19-7.35-23.19-19.4C1.15,7.8,10.45,0,24.91,0A62.54,62.54,0,0,1,49.25,5.05L44,16.76c-6.08-2.3-13.2-4-19.4-4s-9.19,2.18-9.19,5.51,3.79,5.06,13.78,7.12c14.47,3,22.85,8,22.85,19.4,0,11.83-9.07,19.64-25,19.64-10.79,0-17.8-1.5-27-6Z" fill="#57a332" width="52.01px" height="64.41px"></path></svg></div></div>'
        assertXmlIsEquivalent(
          t,
          xml1,
          xml2,
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
