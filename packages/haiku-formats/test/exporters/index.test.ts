import fsExtra = require('fs-extra');
import tape = require('tape');

import {ExporterFormat, ExporterRequest} from 'haiku-sdk-creator/lib/exporter';
import {getStub, stubProperties} from 'haiku-testing/lib/mock';

import {handleExporterSaveRequest} from '@formats/exporters';
import * as bodymovinExporter from '@formats/exporters/bodymovin/bodymovinExporter';

tape('handleExporterSaveRequest', (suite: tape.Test) => {
  suite.test('supports exporting to Bodymovin', (test: tape.Test) => {
    const [constructorStub, unstub] = stubProperties(bodymovinExporter, 'BodymovinExporter');

    let output: string;
    constructorStub.returns({writeToFile: () => output = 'hello'});

    const request: ExporterRequest = {
      format: ExporterFormat.Bodymovin,
      filename: '',
      framerate: 60,
    };

    const bytecode: any = {};
    test.true(output === undefined, 'output is initially undefined');
    handleExporterSaveRequest(request, bytecode, 'unused')
      .then(() => {
        test.equal(output, 'hello');
        test.true(constructorStub.calledWith(bytecode));
        unstub();
        test.end();
      })
      .catch((err) => {
        test.error(err);
        test.end();
      });
  });

  suite.test('Bodymovin failsafe resolves to empty JSON object', (test: tape.Test) => {
    const [binaryOutputStub, unstub] = stubProperties(
      bodymovinExporter.BodymovinExporter.prototype,
      'binaryOutput',
    );

    const request: ExporterRequest = {
      format: ExporterFormat.Bodymovin,
      filename: '/blah',
      framerate: 60,
    };

    binaryOutputStub.throws();
    fsExtra.writeFile = getStub();

    // TODO: fix bytecode type
    handleExporterSaveRequest(request, {} as any, 'unused')
      .then(() => {
        // @ts-ignore
        test.true(fsExtra.writeFile.calledWith('/blah', JSON.stringify({})), 'uses failsafe output from exporter');
        unstub();
        test.end();
      });
  });

  suite.end();
});
