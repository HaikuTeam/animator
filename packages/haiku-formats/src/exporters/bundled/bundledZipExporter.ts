import {
  getEmbedName,
  getHaikuCoreVersion,
  getOrganizationNameOrFallback,
} from '@haiku/sdk-client/lib/ProjectDefinitions';
import * as dedent from 'dedent';
import * as fse from 'fs-extra';
// @ts-ignore
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import jszip from 'jszip';
import {ExporterInterface} from '..';
import BaseExporter from '../BaseExporter';
import {createCoreMinContent} from '../bundled/createCoreMin';
import {EmbedBundlerExporter} from './embedBundlerExporter';

export class BundledZipExporter extends BaseExporter implements ExporterInterface {

  createZipArchive (
    indexHtmlContent: string,
    embedJsContent: string,
    coreMinContent: string,
    coreVersion: string): Promise<Buffer> {
    const zip = new JSZip();
    zip.file('index.html', indexHtmlContent);
    zip.file('index.embed.js', embedJsContent);
    zip.file(`HaikuCore.${coreVersion}.min.js`, coreMinContent);
    return zip.generateAsync({
      type:'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9,
      }});
  }

  async  writeToFile (filename: string, framerate: number): Promise<void> {
    logger.info(`[BundledZipExporter] Generating bundled zip...`);

    const coreVersion = getHaikuCoreVersion();
    const projOrganizationName = this.bytecode.metadata.organization;
    const projName = this.bytecode.metadata.project;
    const organizationName = getOrganizationNameOrFallback(projOrganizationName);
    const embedName = getEmbedName(organizationName, projName);

    logger.info(`[BundledZipExporter] Generating Haiku core...`);
    // Generate HaikuCore.min.js content
    const coreMinContent = await createCoreMinContent();

    logger.info(`[BundledZipExporter] Generating embed...`);
    // Generate index.embed.js content
    const embedExporter = new EmbedBundlerExporter(this.bytecode, this.componentFolder);
    const embedJsContent = await embedExporter.generateEmbedBundle();

    logger.info(`[BundledZipExporter] Generating index.html...`);
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

    return this.createZipArchive(indexHtmlContent, embedJsContent, coreMinContent, coreVersion).then((content) => {
      logger.info(`[BundledZipExporter] writing file ${filename}`);
      return fse.writeFile(filename, content);
    }).catch((error) => {
      logger.error(`[formats] caught exception during bundled export EmbedBundlerExporter: ${error.toString()}`);
      return fse.writeFile(filename, '{}');
    });
  }

}
