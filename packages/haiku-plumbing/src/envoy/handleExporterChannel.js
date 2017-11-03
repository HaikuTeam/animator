import { EXPORTER_CHANNEL } from 'haiku-sdk-creator/lib/exporter'

import saveExport from '../publish-hooks/saveExport'

export default (exporterChannel, activeComponent) => {
  exporterChannel.on(`${EXPORTER_CHANNEL}:save`, (request) => {
    saveExport(request, activeComponent, (err) => {
      if (err) {
        throw err
      }

      exporterChannel.saved(request)
    })
  })
}
