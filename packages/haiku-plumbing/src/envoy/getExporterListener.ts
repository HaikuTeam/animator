import {queue} from 'async';
import {ExporterFormat, ExporterHandler, ExporterRequest} from 'haiku-sdk-creator/lib/exporter';
// @ts-ignore
import * as ActiveComponent from 'haiku-serialization/src/bll/ActiveComponent';
import MasterGitProject from '../MasterGitProject';

import saveExport from '../publish-hooks/saveExport';

export default (
  exporterChannel: ExporterHandler,
  activeComponent: ActiveComponent,
  masterGitProject: MasterGitProject,
) => {
  const saveQueue = queue<ExporterRequest, Error>(
    (request, next) => {
      const finish = () => {
        exporterChannel.saved(request);
        next();
      };
      switch (request.format) {
        case ExporterFormat.Bodymovin:
        case ExporterFormat.HaikuStatic:
          exporterChannel.trackProgress(request, 0.5);
          saveExport(request, activeComponent, (err) => {
            if (err) {
              throw err;
            }

            return finish();
          });
          break;
        case ExporterFormat.AnimatedGif:
        case ExporterFormat.Video:
        case ExporterFormat.Still:
          if (typeof global.process.send === 'function') {
            exporterChannel.trackProgress(request, 0.25);
            masterGitProject.fetchFolderState(
              'png-capture',
              {},
              () => {
                global.process.send({
                  message: 'bakePngSequence',
                  abspath: activeComponent.fetchActiveBytecodeFile().getAbspath(),
                  framerate: request.framerate,
                  still: (request.format === ExporterFormat.Still),
                  sha1: masterGitProject.folderState.headCommitId.toString(),
                  ...activeComponent.getContextSize(),
                });

                const oneTimeHandler = (message: {type?: string}) => {
                  if (typeof message === 'object' && message.type === 'bakePngSequenceComplete') {
                    // @ts-ignore: some obscure typing issues prevent tests from running here.
                    global.process.removeListener('message', oneTimeHandler);
                    if (request.format === ExporterFormat.Still) {
                      exporterChannel.trackProgress(request, 1);
                      return finish();
                    }
                    exporterChannel.trackProgress(request, 0.5);
                    saveExport(request, activeComponent, (err) => {
                      if (err) {
                        exporterChannel.abort(request);
                        return next();
                      }

                      return finish();
                    });
                  }
                };

                global.process.on('message', oneTimeHandler);
              },
            );
          }
      }
    },
  );

  return (request: ExporterRequest) => {
    // Only allow save requests to proceed through here if the outlet is the CDN or offline is permitted.
    if (request.outlet === 'cdn' || exporterChannel.checkOfflinePrivileges()) {
      saveQueue.push(request);
    } else {
      // TODO: report penetration attempt to intercom.
    }
  };
};
