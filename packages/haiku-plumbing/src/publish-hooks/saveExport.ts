import {handleExporterSaveRequest} from 'haiku-formats/lib/exporters';
import {ExporterRequest} from 'haiku-sdk-creator/lib/exporter';
// @ts-ignore
import * as ActiveComponent from 'haiku-serialization/src/bll/ActiveComponent';

export default (request: ExporterRequest, activeComponent: ActiveComponent, cb: (err: Error|void) => void) => {
  const bytecodeSnapshot = activeComponent.fetchActiveBytecodeFile().getReifiedDecycledBytecode({
    suppressSubcomponents: false,
  });
  // Re-mount the active component so mutations to the bytecode snapshot don't trickle into the project.
  activeComponent.reloadBytecodeFromDisk((err: any) => {
    if (err) {
      cb(err);
      return;
    }

    handleExporterSaveRequest(request, bytecodeSnapshot, activeComponent.fetchActiveBytecodeFile().getFolder())
      .then(cb)
      .catch(cb);
  });
};
