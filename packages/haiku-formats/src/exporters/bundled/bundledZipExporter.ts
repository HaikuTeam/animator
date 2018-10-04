import {getEmbedName, getOrganizationNameOrFallback} from '@haiku/sdk-client/lib/ProjectDefinitions';
// @ts-ignore
import * as archiver from 'archiver';
import * as dedent from 'dedent';
import * as fs from 'fs';
import * as fse from 'fs-extra';
// @ts-ignore
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import {ExporterInterface} from '..';
import BaseExporter from '../BaseExporter';
import {EmbedBundlerExporter} from './embedBundlerExporter';

export class BundledZipExporter extends BaseExporter implements ExporterInterface {

  createZipArchive (filename: string, indexHtmlContent: string, embedJsContent: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      console.log('Prepare to create zip');
      const output = fs.createWriteStream(filename);
      const archive = archiver('zip', {
        zlib: {level: 9}, // Sets the compression level.
      });

      output.on('close', () => {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
        resolve();
      });

      // good practice to catch this error explicitly
      archive.on('error', (err: any) => {
        reject(err);
      });

      // append a file from string
      archive.append(indexHtmlContent, {name: 'index.html'});

      // append a file from string
      archive.append(embedJsContent, {name: 'index.embed.js'});

      // pipe archive data to the file
      archive.pipe(output);

      // finalize the archive (ie we are done appending files but streams have to finish yet)
      // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
      archive.finalize();

    });
  }

  writeToFile (filename: string, framerate: number): Promise<void> {

    const projOrganizationName = this.bytecode.metadata.organization;
    const projName = this.bytecode.metadata.project;
    const organizationName = getOrganizationNameOrFallback(projOrganizationName);
    const embedName = getEmbedName(organizationName, projName);

    const indexHtmlContent = dedent`
    <!doctype html>
    <html lang=en>
      <head>
        <meta charset=utf-8>
        <title>${projName} by ${organizationName} - Haiku for Teams</title>
      </head>
      <body>
        <div id="mount-${organizationName}-${projName}"></div>
        <script src="./HaikuCore.4.1.0.min.js"></script>
        <script src="./index.embed.js"></script>
        <script>
          ${embedName}(
            document.getElementById('mount-${organizationName}-${projName}'),
            {loop: true}
          );
        </script>
      </body>
    </html>
    `;

    const embedExporter = new EmbedBundlerExporter(this.bytecode, this.componentFolder);
    return embedExporter.generateEmbedBundle().then((embedJsContent: string) => {
      return this.createZipArchive(filename, indexHtmlContent, embedJsContent);
    })
    .catch((error) => {
      logger.error(`[formats] caught exception during bundled zip export: ${error.toString()}`);
    });

    return fse.writeFile(filename, '{}');
  }
}
