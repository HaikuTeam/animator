import {handleExporterSaveRequest} from 'haiku-formats/lib/exporters';
import {ExporterFormat, ExporterRequest} from 'haiku-sdk-creator/lib/exporter';
// @ts-ignore
import * as ActiveComponent from 'haiku-serialization/src/bll/ActiveComponent';
// @ts-ignore
import * as Bytecode from 'haiku-serialization/src/bll/Bytecode';

export default (request: ExporterRequest, activeComponent: ActiveComponent, cb: (err: Error|void) => void) => {
  const bytecode = activeComponent.fetchActiveBytecodeFile().getReifiedDecycledBytecode({
    suppressSubcomponents: false,
  });

  // These formats are mutative (update bytecode in place), so we snapshot bytecode instead of using it directly.
  const doSnapshot = request.format === ExporterFormat.Bodymovin || request.format === ExporterFormat.HaikuStatic;
  handleExporterSaveRequest(
    request,
    doSnapshot ? Bytecode.snapshot(bytecode) : bytecode,
    activeComponent.fetchActiveBytecodeFile().getFolder(),
  )
    .then(cb)
    .catch(cb);
};
