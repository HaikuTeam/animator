const tape = require('tape')
const path = require('path')
const fse = require('fs-extra')

const Project = require('./../../src/bll/Project')
const logger = require('./../../src/utils/LoggerInstance')


tape('ActiveComponent.prototype.mergeDesign[1](ungrouped-sync)', (t) => {
  t.plan(1)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'tgroup-tmp')
  fse.removeSync(folder)

  // Copy project from oracle folder
  const origFolder = path.join(__dirname, '..', 'fixtures', 'projects', 'tgroup')
  fse.copySync(origFolder, folder, {recursive: true})

  const svgFileToBeUpdated = 'designs/ciK4deII3q0dSMfJDUxoHaW2-t1.figma.contents/groups/Group Outer.svg'
  
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doShallowWorkOnly: false, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      const ac0 = project.getCurrentActiveComponent()

      // Update SVG (simulate Figma/Scketch sync)
      const updatedSvgContents = fse.readFileSync(path.join(folder, svgFileToBeUpdated+ '.after-sync.1'),'utf8')
      fse.outputFileSync(path.join(folder, svgFileToBeUpdated), updatedSvgContents)
      
      return project.mergeDesigns({ [svgFileToBeUpdated]: true }, { from: 'test' }, (err) => {
        if (err) throw err
        const fileAfterSync = path.join(folder, ac0.fetchActiveBytecodeFile().relpath+'.after-sync.1')
        const contentsAfterSync = ac0.fetchActiveBytecodeFile().getCode()
        fse.outputFileSync(fileAfterSync, contentsAfterSync);

        const fileAfterSyncOracle = path.join(folder, ac0.fetchActiveBytecodeFile().relpath+'.after-sync.1.oracle')
        const contentsAfterSyncOracle = fse.readFileSync(fileAfterSyncOracle, 'utf8')

        if (contentsAfterSyncOracle === contentsAfterSync ){
          t.ok(true)
          
        }
        else{
          logger.diff(contentsAfterSyncOracle, contentsAfterSync)
          t.fail('Updated code.js after merge is different from oracle')
        }

        fse.removeSync(folder)
      })
    })
  })
})