import { EXPORTER_CHANNEL } from 'haiku-sdk-creator/lib/exporter'

import handleExporterChannel from './handleExporterChannel'

export default (envoyClient, activeComponent) => {
  envoyClient.get(EXPORTER_CHANNEL).then((exporterChannel) => {
    handleExporterChannel(exporterChannel, activeComponent)
  })
}
