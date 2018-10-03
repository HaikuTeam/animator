// @ts-ignore
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as fse from 'fs-extra';
// @ts-ignore
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import {ExporterInterface} from '..';
import BaseExporter from '../BaseExporter';
import {StandaloneBundlerExporter} from './standaloneBundlerExporter';

export class BundledZipExporter extends BaseExporter implements ExporterInterface {

  createZipArchive (): Promise<void> {
    return new Promise<void>((resolve, reject) => {

    });
  }

  writeToFile (filename: string, framerate: number): Promise<void> {

    const standaloneExporter = new StandaloneBundlerExporter(this.bytecode, this.componentFolder);
    standaloneExporter.generateStandAloneBundle().then((content: string) => {
      const output = fs.createWriteStream(filename);
      const archive = archiver('zip', {
        zlib: {level: 9}, // Sets the compression level.
      });

      output.on('close', () => {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
      });

      // good practice to catch this error explicitly
      archive.on('error', (err: any) => {
        throw err;
      });

      // append a file from string
      archive.append(content, {name: 'index.standalone.js'});

      // pipe archive data to the file
      archive.pipe(output);

      // finalize the archive (ie we are done appending files but streams have to finish yet)
      // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
      archive.finalize();

    })
    .catch((error) => {
      logger.error(`[formats] caught exception during bundled zip export: ${error.toString()}`);
    });

    return fse.writeFile(filename, '{}');
  }
}
