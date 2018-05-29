import tape = require('tape');

import {ExporterFormat, ExporterRequest} from 'haiku-sdk-creator/lib/exporter';
import {stubProperties} from 'haiku-testing/lib/mock';

import {handleExporterSaveRequest} from '@/exporters';
import * as bodymovinExporter from '@/exporters/bodymovin/bodymovinExporter';

tape('handleExporterSaveRequest', (test: tape.Test) => {
  test.test('supports exporting to Bodymovin', (test: tape.Test) => {
    const [constructorStub, unstub] = stubProperties(bodymovinExporter, 'BodymovinExporter');

    constructorStub.returns({binaryOutput: () => 'hello'});

    const request: ExporterRequest = {
      format: ExporterFormat.Bodymovin,
      filename: undefined,
    };

    // TODO: fix bytecode type
    const bytecode: any = {foo: 'bar'};
    handleExporterSaveRequest(request, bytecode)
      .then((binaryOutput: string) => {
        test.equal(binaryOutput, 'hello');
        test.true(constructorStub.calledWith(bytecode));
        unstub();
        test.end();
      });
  });

  test.test('Bodymovin failsafe resolves to empty JSON object', (test: tape.Test) => {
    const [binaryOutputStub, unstub] = stubProperties(
      bodymovinExporter.BodymovinExporter.prototype,
      'binaryOutput',
    );

    const request: ExporterRequest = {
      format: ExporterFormat.Bodymovin,
      filename: undefined,
    };

    binaryOutputStub.throws();

    // TODO: fix bytecode type
    handleExporterSaveRequest(request, {} as any)
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

    // TODO: fix bytecode type
    handleExporterSaveRequest(request, {} as any)
      .then((binaryOutput) => {
        test.equal(binaryOutput, '', 'uses generic failsafe output of empty string');
        test.end();
      });
  });

  test.end();
});
