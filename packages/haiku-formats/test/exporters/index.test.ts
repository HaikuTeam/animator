import * as tape from 'tape';

import {HaikuBytecode} from 'haiku-common/lib/types';
import {ExporterFormat, ExporterRequest} from 'haiku-sdk-creator/lib/exporter';
import {importStubs} from 'haiku-testing/lib/mock';

tape('handleExporterSaveRequest', (test: tape.Test) => {
  test.test('supports exporting to Bodymovin', (test: tape.Test) => {
    const [{handleExporterSaveRequest}, exporterStub] = importStubs(
      'lib/exporters', {'./bodymovin/bodymovinExporter': 'BodymovinExporter'});

    const request: ExporterRequest = {
      format: ExporterFormat.Bodymovin,
      filename: undefined,
    };

    exporterStub.returns({binaryOutput: () => 'hello'});

    const bytecode: HaikuBytecode = {foo: 'bar'};
    test.equal(handleExporterSaveRequest(request, bytecode), 'hello');
    test.true(exporterStub.calledWith(bytecode));
    test.end();
  });

  test.test('throws on unkown formats', (test: tape.Test) => {
    const [{handleExporterSaveRequest}] = importStubs('lib/exporters');
    const request: ExporterRequest = {
      format: ExporterFormat.Unknown,
      filename: undefined,
    };
    test.throws(handleExporterSaveRequest.bind(undefined, request, {}));
    test.end();
  });

  test.end();
});
