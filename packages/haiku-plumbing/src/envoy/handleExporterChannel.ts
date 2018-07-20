import {EXPORTER_CHANNEL, ExporterFormat, ExporterHandler, ExporterRequest} from 'haiku-sdk-creator/lib/exporter';
// @ts-ignore
import * as ActiveComponent from 'haiku-serialization/src/bll/ActiveComponent';
import MasterGitProject from '../MasterGitProject';

import saveExport from '../publish-hooks/saveExport';

export default (
  exporterChannel: ExporterHandler,
  activeComponent: ActiveComponent,
  masterGitProject: MasterGitProject,
) => {
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
      case ExporterFormat.Still:
        if (typeof global.process.send === 'function') {
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
                  saveExport(request, activeComponent, (err) => {
                    if (err) {
                      throw err;
                    }

                    exporterChannel.saved(request);
                  });
                }
              };

              global.process.on('message', oneTimeHandler);
            },
          );
        }
    }
  });
};
