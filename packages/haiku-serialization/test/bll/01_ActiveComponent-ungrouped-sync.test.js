const tape = require('tape')
const path = require('path')
const fse = require('fs-extra')
const {VERSION} = require('@haiku/core/lib/HaikuComponent')

const Project = require('./../../src/bll/Project')
const File = require('./../../src/bll/File')

const waitUntilFileProbablyWroteToDisk = (fn) => {
  return setTimeout(fn, 2000) // Disk writes happen on a 500ms interval
}



tape('ActiveComponent.prototype.mergeDesign[1](ungrouped-sync)', (t) => {
  t.plan(1)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'tgroup-tmp')
  fse.removeSync(folder)

  // Copy project from oracle folder
  const origFolder = path.join(__dirname, '..', 'fixtures', 'projects', 'tgroup')
  fse.copySync(origFolder, folder, {recursive: true})
  
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doShallowWorkOnly: false, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      const ac0 = project.getCurrentActiveComponent()
      fse.outputFileSync(path.join(folder, 'designs/ciK4deII3q0dSMfJDUxoHaW2-t1.figma.contents/groups/Group Outer.svg'), GROUPED_SVG)
      return project.mergeDesigns({ 'designs/ciK4deII3q0dSMfJDUxoHaW2-t1.figma.contents/groups/Group Outer.svg': true }, { from: 'test' }, (err) => {
        if (err) throw err
        return waitUntilFileProbablyWroteToDisk(() => {
          return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents2) => {
            if (err) throw err
            //fse.removeSync(folder)
            fse.outputFileSync(path.join(folder, ac0.fetchActiveBytecodeFile().relpath+'.after-merge'), ac0.fetchActiveBytecodeFile().getCode());
            console.log(ac0.getSerializedBytecode())
            t.ok(true)
          })
        })
      })
    })
  })
})


const GROUPED_SVG = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="472" height="367" viewBox="0 0 472 367" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Group Outer">
<g id="Group Inner">
<rect id="Rectangle R" width="78" height="59" transform="translate(394 103)" fill="#FF0000"/>
<rect id="Rectangle G" width="276" height="187" fill="#00FF00"/>
</g>
<rect id="Rectangle B" width="246" height="97" transform="translate(138 270)" fill="#0000FF"/>
</g>
</svg>
`
