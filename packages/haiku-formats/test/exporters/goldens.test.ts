import {VERSION} from '@core/HaikuComponent';
import {each} from 'async';
import {basename, join} from 'path';
import tape = require('tape');

// @ts-ignore
import haikuFsExtra = require('haiku-fs-extra');

import {BodymovinExporter} from '@formats/exporters/bodymovin/bodymovinExporter';
import {HaikuStaticExporter} from '@formats/exporters/haikuStatic/haikuStaticExporter';

const {readdir, readFile} = haikuFsExtra;
const goldensRoot = join(global.process.cwd(), 'test/goldens');

tape('haiku-formats goldens', (suite: tape.Test) => {
  suite.test('bodymovin', (test: tape.Test) => {
    readdir(join(goldensRoot, 'bytecode'), (_: any, bytecodeFiles: string[]) => {
      each(
        bytecodeFiles,
        (filename: string, next) => {
          const name = basename(filename, '.js');
          const bytecodeFilename = join(goldensRoot, 'bytecode', filename);
          const exporter = new BodymovinExporter(require(bytecodeFilename), '/tmp');
          // Clear require cache.
          delete require.cache[require.resolve(bytecodeFilename)];
          readFile(
            join(goldensRoot, 'bodymovin', `${name}.json`),
            (__: any, contents: Buffer) => {
              test.deepEqual(
                JSON.parse(contents.toString()),
                JSON.parse(JSON.stringify(exporter.rawOutput())),
                `bodymovin goldens match: ${name}`,
              );
              next();
            },
          );
        },
        () => {
          // @ts-ignore
          global.haiku[VERSION].HaikuGlobalAnimationHarness.cancel();
          test.end();
        },
      );
    });
  });

  suite.test('haikuStatic', (test: tape.Test) => {
    readdir(join(goldensRoot, 'bytecode'), (_: any, bytecodeFiles: string[]) => {
      each(
        bytecodeFiles,
        (filename: string, next) => {
          const name = basename(filename, '.js');
          const bytecodeFilename = join(goldensRoot, 'bytecode', filename);
          const exporter = new HaikuStaticExporter(require(bytecodeFilename), '/tmp');
          readFile(
            join(goldensRoot, 'haikuStatic', `${name}.json`),
            (__: any, contents: Buffer) => {
              test.equal(
                // This aditional conversion is necessary to avoid any errors
                // from git.autocrlf on Windows
                JSON.stringify(JSON.parse(contents.toString()), null, 2),
                JSON.stringify(exporter.rawOutput(), null, 2),
                `haikuStatic goldens match: ${name}`,
              );
              next();
            },
          );
        },
        test.end,
      );
    });
  });

  suite.end();
});
