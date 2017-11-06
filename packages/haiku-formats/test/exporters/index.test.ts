import * as tape from 'tape';

import {HaikuBytecode} from 'haiku-common/lib/types';
import {ExporterFormat, ExporterRequest} from 'haiku-sdk-creator/lib/exporter';
import {importStubs, stubProperties} from 'haiku-testing/lib/mock';

import {handleExporterSaveRequest} from '../../lib/exporters';
import {BodymovinExporter} from '../../lib/exporters/bodymovin/bodymovinExporter';

tape('handleExporterSaveRequest', (test: tape.Test) => {
  test.test('supports exporting to Bodymovin', (test: tape.Test) => {
    const [{handleExporterSaveRequest}, exporterStub, unstub] = importStubs(
      'lib/exporters', {'./bodymovin/bodymovinExporter': 'BodymovinExporter'});

    const request: ExporterRequest = {
      format: ExporterFormat.Bodymovin,
      filename: undefined,
    };

    exporterStub.returns({binaryOutput: () => 'hello'});

    const bytecode: HaikuBytecode = {foo: 'bar'};
    handleExporterSaveRequest(request, bytecode)
      .then((binaryOutput) => {
        test.equal(binaryOutput, 'hello');
        test.true(exporterStub.calledWith(bytecode));
        unstub();
        test.end();
      });
  });

  test.test('Bodymovin failsafe resolves to empty JSON object', (test: tape.Test) => {
    const [binaryOutputStub, unstub] = stubProperties(
      BodymovinExporter.prototype,
      'binaryOutput',
    );

    const request: ExporterRequest = {
      format: ExporterFormat.Bodymovin,
      filename: undefined,
    };

    binaryOutputStub.throws();

    handleExporterSaveRequest(request, {})
      .then((binaryOutput) => {
        test.equal(binaryOutput, JSON.stringify({}), 'uses failsafe output from exporter');
        unstub();
        test.end();
      });
  });

  test.test('generic failsafe resolves to empty string', (test: tape.Test) => {
    const request: ExporterRequest = {
      format: ExporterFormat.Unknown,
      filename: undefined,
    };

    handleExporterSaveRequest(request, {})
      .then((binaryOutput) => {
        test.equal(binaryOutput, '', 'uses generic failsafe output of empty string');
        test.end();
      });
  });

  test.end();
});
