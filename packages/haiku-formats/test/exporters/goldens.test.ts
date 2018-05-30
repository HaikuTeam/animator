import {each} from 'async';
import {join, basename} from 'path';
import tape = require('tape');

// @ts-ignore
import haikuFsExtra = require('haiku-fs-extra');

import {BodymovinExporter} from '@formats/exporters/bodymovin/bodymovinExporter';
import {HaikuStaticExporter} from '@formats/exporters/haikuStatic/haikuStaticExporter';

const {readdir, readFile} = haikuFsExtra;
const goldensRoot = join(global.process.cwd(), 'test/goldens');

tape('haiku-formats goldens', (test: tape.Test) => {
  test.test('bodymovin', (test: tape.Test) => {
    readdir(join(goldensRoot, 'bytecode'), (_: any, bytecodeFiles: string[]) => {
      each(
        bytecodeFiles,
        (filename: string, next) => {
          const name = basename(filename, '.js');
          const bytecodeFilename = join(goldensRoot, 'bytecode', filename);
          const exporter = new BodymovinExporter(require(bytecodeFilename));
          // Clear require cache.
          delete require.cache[require.resolve(bytecodeFilename)];
          readFile(
            join(goldensRoot, 'bodymovin', `${name}.json`),
            (_: any, contents: Buffer) => {
              test.equal(
                // This aditional conversion is necessary to avoid any errors 
                // from git.autocrlf on Windows
                JSON.stringify(JSON.parse(contents.toString()),null,2),
                JSON.stringify(exporter.rawOutput(), null, 2),
                `bodymovin goldens match: ${name}`,
              );
              next();
            },
          );
        },
        test.end,
      );
    });
  });

  test.test('haikuStatic', (test: tape.Test) => {
    readdir(join(goldensRoot, 'bytecode'), (_: any, bytecodeFiles: string[]) => {
      each(
        bytecodeFiles,
        (filename: string, next) => {
          const name = basename(filename, '.js');
          const bytecodeFilename = join(goldensRoot, 'bytecode', filename);
          const exporter = new HaikuStaticExporter(require(bytecodeFilename));
          readFile(
            join(goldensRoot, 'haikuStatic', `${name}.json`),
            (_: any, contents: Buffer) => {
              test.equal(
                // This aditional conversion is necessary to avoid any errors 
                // from git.autocrlf on Windows
                JSON.stringify(JSON.parse(contents.toString()),null,2),
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

  test.end();
});
