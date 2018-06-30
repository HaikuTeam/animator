import {BodymovinExporter} from '@/exporters/bodymovin/bodymovinExporter';
import {HaikuStaticExporter} from '@/exporters/haikuStatic/haikuStaticExporter';
import {each} from 'async';
// @ts-ignore
import {readdir, writeFile} from 'fs-extra';
import {basename, join} from 'path';

const goldensRoot = join(global.process.cwd(), 'test/goldens');

readdir(join(goldensRoot, 'bytecode'), (_: any, bytecodeFiles: string[]) => {
  each(bytecodeFiles, (filename: string, next) => {
    const bytecodeFilename = join(goldensRoot, 'bytecode', filename);
    const name = basename(bytecodeFilename, '.js');
    const bodymovinExporter = new BodymovinExporter(require(bytecodeFilename));
    // Clear require cache.
    delete require.cache[require.resolve(bytecodeFilename)];
    writeFile(
      join(goldensRoot, 'bodymovin', `${name}.json`),
      JSON.stringify(bodymovinExporter.rawOutput(), null, 2),
      () => {
        const haikuStaticExporter = new HaikuStaticExporter(require(bytecodeFilename));
        writeFile(
          join(goldensRoot, 'haikuStatic', `${name}.json`),
          JSON.stringify(haikuStaticExporter.rawOutput(), null, 2),
          next,
        );
      },
    );
  });
});
