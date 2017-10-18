import fs from 'fs'

import { EXPORTER_CHANNEL } from 'haiku-sdk-creator/lib/exporter'
import { handleExporterSaveRequest } from 'haiku-formats/lib/exporters'

export default (exporterChannel, activeComponent) => {
  exporterChannel.on(`${EXPORTER_CHANNEL}:save`, (request) => {
    const contents = handleExporterSaveRequest(
      request, activeComponent.fetchActiveBytecodeFile().getReifiedBytecode())
    fs.writeFile(request.filename, contents, (err) => {
      if (err) {
        throw err
      }

      exporterChannel.saved(request)
    })
  })
}
