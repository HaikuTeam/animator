const tape = require('tape')
const path = require('path')
const fse = require('haiku-fs-extra')

const Project = require('./../../src/bll/Project')

const HaikuContext = require('@haiku/core/lib/HaikuContext').default
const HaikuHTMLRenderer = require('@haiku/core/lib/renderers/html').default

const {assertXmlIsEquivalent} = require('haiku-testing/lib/assertions')

Error.stackTraceLimit = Infinity;
if (process.stdout._handle) process.stdout._handle.setBlocking(true);
tape('ActiveComponent.2.ativo', (t) => {
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
      fse.outputFileSync(path.join(folder, 'designs/Ativo.svg'), ATIVO_SVG_1)
      const ac0 = project.getCurrentActiveComponent()
      return ac0.instantiateComponent('designs/Ativo.svg', {}, {from: 'test'}, (err, mana) => {
        if (err) throw err

        const factory = HaikuContext.createComponentFactory(
          HaikuHTMLRenderer,
          ac0.getReifiedBytecode(),
          { // config
            size: {x: 100, y: 100},
            user: {}
          },
          {}, // platform
        )

        const component = factory()
        const xml1 = component.performFullFlushRenderWithRenderer(component.context.renderer, {})
        const xml2 = '<div><div style="position:relative;margin:0;padding:0;border:0;webkitTapHighlightColor:rgba(0,0,0,0);overflowX:hidden;overflowY:hidden;display:block;visibility:visible;opacity:1;width:550px;height:400px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);" haiku-title="Main" sizeAbsolute.x="550" sizeMode.x="1" sizeAbsolute.y="400" sizeMode.y="1" haiku-id="03757d2ca102"><svg style="position:absolute;margin:0;padding:0;border:0;zIndex:1;display:block;visibility:visible;opacity:1;width:52.01px;height:64.41px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,248.995,167.79500000000002,0,1);" xmlns="http://www.w3.org/2000/svg" haiku-source="designs/Ativo.svg" haiku-title="Ativo" haiku-id="cdf8e3b838b6" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"><path style="display:block;visibility:visible;opacity:1;width:52.01px;height:64.41px;transform:matrix(1,0,0,1,0,0);" haiku-id="54598d6634a2" d="M6,46.61c7.69,3.33,13.55,5,21.36,5,7.34,0,10.21-2.75,10.21-6,0-3.56-3.56-5.16-13.2-7.23-13.43-3-23.19-7.35-23.19-19.4C1.15,7.8,10.45,0,24.91,0A62.54,62.54,0,0,1,49.25,5.05L44,16.76c-6.08-2.3-13.2-4-19.4-4s-9.19,2.18-9.19,5.51,3.79,5.06,13.78,7.12c14.47,3,22.85,8,22.85,19.4,0,11.83-9.07,19.64-25,19.64-10.79,0-17.8-1.5-27-6Z" fill="#57a332" width="52.01px" height="64.41px"></path></svg></div></div>'
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

const ATIVO_SVG_1 = `
<svg xmlns="http://www.w3.org/2000/svg" width="52.01" height="64.41" viewBox="0 0 52.01 64.41">
  <title>Ativo 1</title>
  <path d="M6,46.61c7.69,3.33,13.55,5,21.36,5,7.34,0,10.21-2.75,10.21-6,0-3.56-3.56-5.16-13.2-7.23-13.43-3-23.19-7.35-23.19-19.4C1.15,7.8,10.45,0,24.91,0A62.54,62.54,0,0,1,49.25,5.05L44,16.76c-6.08-2.3-13.2-4-19.4-4s-9.19,2.18-9.19,5.51,3.79,5.06,13.78,7.12c14.47,3,22.85,8,22.85,19.4,0,11.83-9.07,19.64-25,19.64-10.79,0-17.8-1.5-27-6Z" style="fill: #57a332"/>
</svg>
`
