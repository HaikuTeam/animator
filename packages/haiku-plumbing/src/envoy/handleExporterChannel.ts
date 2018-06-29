import {EXPORTER_CHANNEL, ExporterFormat, ExporterHandler, ExporterRequest} from 'haiku-sdk-creator/lib/exporter';
// @ts-ignore
import * as ActiveComponent from 'haiku-serialization/src/bll/ActiveComponent';

import saveExport from '../publish-hooks/saveExport';

export default (exporterChannel: ExporterHandler, activeComponent: ActiveComponent) => {
  exporterChannel.on(`${EXPORTER_CHANNEL}:save`, (request: ExporterRequest) => {
    switch (request.format) {
      case ExporterFormat.Bodymovin:
      case ExporterFormat.HaikuStatic:
        saveExport(request, activeComponent, (err) => {
          if (err) {
            throw err;
          }

          exporterChannel.saved(request);
        });
        break;
      case ExporterFormat.AnimatedGif:
      case ExporterFormat.Video:
        if (typeof global.process.send === 'function') {
          global.process.send({
            message: 'bakePngSequence',
            abspath: activeComponent.fetchActiveBytecodeFile().getAbspath(),
            framerate: request.framerate,
          });

          const oneTimeHandler = (message: {type?: string}) => {
            if (typeof message === 'object' && message.type === 'bakePngSequenceComplete') {
              global.process.removeListener('message', oneTimeHandler);
              saveExport(request, activeComponent, (err) => {
                if (err) {
                  throw err;
                }

                exporterChannel.saved(request);
              });
            }
          };

          global.process.on('message', oneTimeHandler);
        }
    }
  });
};
