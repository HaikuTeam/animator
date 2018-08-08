import {handleExporterSaveRequest} from 'haiku-formats/lib/exporters';
import {ExporterFormat, ExporterRequest} from 'haiku-sdk-creator/lib/exporter';
// @ts-ignore
import * as ActiveComponent from 'haiku-serialization/src/bll/ActiveComponent';

export default (request: ExporterRequest, activeComponent: ActiveComponent, cb: (err: Error|void) => void) => {
  const bytecodeSnapshot = activeComponent.fetchActiveBytecodeFile().getReifiedDecycledBytecode({
    suppressSubcomponents: false,
  });

  switch (request.format) {
    case ExporterFormat.Bodymovin:
    case ExporterFormat.HaikuStatic:
      // These formats are mutative (update bytecode in place).
      // We re-mount the active component so mutations to the bytecode snapshot don't trickle into the project.
      activeComponent.reloadBytecodeFromDisk((err: any) => {
        if (err) {
          cb(err);
          return;
        }

        handleExporterSaveRequest(request, bytecodeSnapshot, activeComponent.fetchActiveBytecodeFile().getFolder())
          .then(cb)
          .catch(cb);
      });
      break;
    default:
      handleExporterSaveRequest(request, bytecodeSnapshot, activeComponent.fetchActiveBytecodeFile().getFolder())
        .then(cb)
        .catch(cb);
      break;
  }
};
