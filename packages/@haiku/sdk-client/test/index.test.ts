import {inkstone} from '@haiku/sdk-inkstone';
import {client, FILE_PATHS} from '@sdk-client/index';
import * as fs from 'fs';
import {stubProperties} from 'haiku-testing/lib/mock';
import * as tape from 'tape';

tape('index', (suite: tape.Test) => {
  suite.test('dotenv.getenv', (test: tape.Test) => {
    const [mockExistsSync, mockReadFileSync, unstubFs] = stubProperties(fs, 'existsSync', 'readFileSync');
    const [mockSetConfig, unstubInkstone] = stubProperties(inkstone, 'setConfig');

    mockExistsSync.returns(false);
    test.deepEqual(client.config.getenv(), {}, 'default is empty object');

    mockExistsSync.reset();
    mockExistsSync.returns(true);
    mockReadFileSync.returns('FOO=bar');
    test.deepEqual(client.config.getenv(), {FOO: 'bar'}, '.env is parsed');
    test.true(mockSetConfig.notCalled, 'inkstone.setConfig was not called');
    test.deepEqual(global.process.env.FOO, 'bar', '.env is applied to global.process.env');

    mockExistsSync.reset();
    mockReadFileSync.reset();
    mockSetConfig.reset();
    mockExistsSync.returns(true);
    mockReadFileSync.returns('HAIKU_API=https://foo.bar/');
    test.deepEqual(client.config.getenv(), {HAIKU_API: 'https://foo.bar/'}, '.env is parsed');
    test.true(mockSetConfig.calledWithMatch({baseUrl: 'https://foo.bar/'}), 'inkstone.setConfig was called');
    test.deepEqual(global.process.env.HAIKU_API, 'https://foo.bar/', '.env is applied to global.process.env');

    delete global.process.env.FOO;
    delete global.process.env.HAIKU_API;
    unstubFs();
    unstubInkstone();
    test.end();
  });

  suite.test('dotenv.setenv', (test: tape.Test) => {
    const [mockExistsSync, mockReadFileSync, mockWriteFileSync, unstubFs] = stubProperties(
      fs,
      'existsSync',
      'readFileSync',
      'writeFileSync',
    );
    const [mockSetConfig, unstubInkstone] = stubProperties(inkstone, 'setConfig');

    mockExistsSync.returns(true);
    mockReadFileSync.returns('FOO=bar');
    test.deepEqual(
      client.config.setenv({HAIKU_API: 'https://foo.bar/'}),
      {FOO: 'bar', HAIKU_API: 'https://foo.bar/'},
      'config was merged correctly',
    );
    test.true(
      mockWriteFileSync.calledWith(FILE_PATHS.DOTENV, 'FOO="bar"\nHAIKU_API="https://foo.bar/"\n'),
      'config was written out in wire format',
    );
    test.true(mockSetConfig.calledWithMatch({baseUrl: 'https://foo.bar/'}), 'inkstone.setConfig was called');

    delete global.process.env.FOO;
    delete global.process.env.HAIKU_API;
    unstubFs();
    unstubInkstone();
    test.end();
  });

  suite.end();
});
