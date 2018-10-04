import {
  getEmbedName,
  getHaikuCoreVersion,
  getOrganizationNameOrFallback,
} from '@haiku/sdk-client/lib/ProjectDefinitions';
// @ts-ignore
import * as archiver from 'archiver';
import * as dedent from 'dedent';
import * as fs from 'fs';
// @ts-ignore
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import {ExporterInterface} from '..';
import BaseExporter from '../BaseExporter';
import {createCoreMinContent} from '../bundled/createCoreMin';
import {EmbedBundlerExporter} from './embedBundlerExporter';

export class BundledZipExporter extends BaseExporter implements ExporterInterface {

  createZipArchive (filename: string,
    indexHtmlContent: string,
    embedJsContent: string,
    coreMinContent: string,
    coreVersion: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      console.log('Prepare to create zip');
      const output = fs.createWriteStream(filename);
      const archive = archiver('zip', {
        zlib: {level: 9}, // Sets the compression level.
      });

      output.on('close', () => {
        logger.info(`[BundledZipExporter] Bundled zip created, with ${archive.pointer() / 1024.0} bytes`);
        resolve();
      });

      // good practice to catch this error explicitly
      archive.on('error', (err: any) => {
        logger.error(`[BundledZipExporter] Error when writing bundled zip: ${err}`);
        reject(err);
      });

      // append a file from string
      archive.append(indexHtmlContent, {name: 'index.html'});
      archive.append(embedJsContent, {name: 'index.embed.js'});
      archive.append(coreMinContent, {name: `HaikuCore.${coreVersion}.min.js`});

      // pipe archive data to the file
      archive.pipe(output);

      // finalize the archive (ie we are done appending files but streams have to finish yet)
      // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
      archive.finalize();
    });
  }

  async  writeToFile (filename: string, framerate: number): Promise<void> {
    logger.info(`[BundledZipExporter] Generating bundled zip...`);

    const coreVersion = getHaikuCoreVersion();
    const projOrganizationName = this.bytecode.metadata.organization;
    const projName = this.bytecode.metadata.project;
    const organizationName = getOrganizationNameOrFallback(projOrganizationName);
    const embedName = getEmbedName(organizationName, projName);

    // Generate HaikuCore.min.js content
    const coreMinContent = await createCoreMinContent();

    // Generate index.embed.js content
    const embedExporter = new EmbedBundlerExporter(this.bytecode, this.componentFolder);
    const embedJsContent = await embedExporter.generateEmbedBundle();

    // Generate index.html content
    const indexHtmlContent = dedent`
    <!doctype html>
    <html lang=en>
      <head>
        <meta charset=utf-8>
        <title>${projName} by ${organizationName} - Haiku for Teams</title>
      </head>
      <body>
        <div id="mount-${organizationName}-${projName}"></div>
        <script src="./HaikuCore.${coreVersion}.min.js"></script>
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

    return this.createZipArchive(filename, indexHtmlContent, embedJsContent, coreMinContent, coreVersion);
  }
}
