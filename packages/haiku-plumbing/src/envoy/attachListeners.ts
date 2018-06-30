import EnvoyClient from 'haiku-sdk-creator/lib/envoy/EnvoyClient';
import {EXPORTER_CHANNEL, ExporterHandler} from 'haiku-sdk-creator/lib/exporter';

// @ts-ignore
import * as ActiveComponent from 'haiku-serialization/src/bll/ActiveComponent';
import handleExporterChannel from './handleExporterChannel';

export default (envoyClient: EnvoyClient<ExporterHandler>, activeComponent: ActiveComponent) => {
  envoyClient.get(EXPORTER_CHANNEL).then((exporterChannel) => {
    handleExporterChannel(exporterChannel, activeComponent);
  });
};
