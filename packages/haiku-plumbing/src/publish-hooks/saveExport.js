import fse from 'haiku-fs-extra'
import { handleExporterSaveRequest } from 'haiku-formats/lib/exporters'

export default (request, activeComponent, cb) => {
  const bytecodeSnapshot = activeComponent.fetchActiveBytecodeFile().getReifiedBytecode()
  // Re-mount the active component so mutations to the bytecode snapshot don't trickle into the project.
  activeComponent.reloadBytecodeFromDisk((err) => {
    if (err) {
      cb(err)
      return
    }

    handleExporterSaveRequest(request, bytecodeSnapshot)
      .then((contents) => {
        fse.writeFile(request.filename, contents, (error) => cb(error))
      })
      .catch((error) => cb(error))
  })
}
