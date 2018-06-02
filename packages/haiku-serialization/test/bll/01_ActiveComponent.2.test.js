const tape = require('tape')
const path = require('path')
const fse = require('haiku-fs-extra')

const Project = require('./../../src/bll/Project')
const File = require('./../../src/bll/File')
const Element = require('./../../src/bll/Element')

const HaikuContext = require('@haiku/core/lib/HaikuContext').default
const HaikuHTMLRenderer = require('@haiku/core/lib/renderers/html').default
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

        t.equal(
          component.performFullFlushRenderWithRenderer(component.context.renderer, {}),
          '<div><div style="position:relative;margin:0;padding:0;border:0;webkitTapHighlightColor:rgba(0,0,0,0);transformStyle:flat;perspective:none;overflowX:hidden;overflowY:hidden;display:block;visibility:visible;opacity:1;width:550px;height:400px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);" sizeAbsolute.x="550" sizeMode.x="1" sizeAbsolute.y="400" sizeMode.y="1" haiku-title="Main" haiku-id="03757d2ca102"><svg style="position:absolute;margin:0;padding:0;border:0;zIndex:1;display:block;visibility:visible;opacity:1;width:52.01px;height:64.41px;transformOrigin:0% 0% 0px;transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,248.995,167.79500000000002,0,1);" xmlns="http://www.w3.org/2000/svg" haiku-source="designs/Ativo.svg" haiku-title="Ativo" haiku-id="cdf8e3b838b6" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"><path style="fill:rgb(87, 163, 50);display:block;visibility:visible;opacity:1;width:52.01px;height:64.41px;transform:matrix(1,0,0,1,0,0);" haiku-id="54598d6634a2" d="M6,46.61C13.690000000000001,49.94,19.55,51.61,27.36,51.61C34.7,51.61,37.57,48.86,37.57,45.61C37.57,42.05,34.01,40.45,24.37,38.379999999999995C10.940000000000001,35.379999999999995,1.1799999999999997,31.029999999999994,1.1799999999999997,18.979999999999997C1.15,7.8,10.45,0,24.91,0A62.54,62.54,0,0,1,49.25,5.05L44,16.76C37.92,14.46,30.8,12.760000000000002,24.6,12.760000000000002C18.400000000000002,12.760000000000002,15.410000000000002,14.940000000000001,15.410000000000002,18.270000000000003C15.410000000000002,21.600000000000005,19.200000000000003,23.330000000000002,29.19,25.390000000000004C43.660000000000004,28.390000000000004,52.040000000000006,33.39,52.040000000000006,44.790000000000006C52.040000000000006,56.620000000000005,42.970000000000006,64.43,27.040000000000006,64.43C16.250000000000007,64.43,9.240000000000006,62.93000000000001,0.04000000000000625,58.43000000000001Z" width="52.01px" height="64.41px"></path></svg></div></div>',
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
