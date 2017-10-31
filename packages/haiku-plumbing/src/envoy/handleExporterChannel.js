import fs from 'fs'

import { EXPORTER_CHANNEL } from 'haiku-sdk-creator/lib/exporter'
import { handleExporterSaveRequest } from 'haiku-formats/lib/exporters'

export default (exporterChannel, activeComponent) => {
  exporterChannel.on(`${EXPORTER_CHANNEL}:save`, (request) => {
    const bytecodeSnapshot = activeComponent.fetchActiveBytecodeFile().getReifiedBytecode()
    // Re-mount the active component so mutations to the bytecode snapshot don't trickle into the project.
    activeComponent.mountApplication()
    const contents = handleExporterSaveRequest(request, bytecodeSnapshot)
    fs.writeFile(request.filename, contents, (err) => {
      if (err) {
        throw err
      }

      exporterChannel.saved(request)
    })
  })
}
