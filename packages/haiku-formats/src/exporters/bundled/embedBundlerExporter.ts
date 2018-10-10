import * as fse from 'fs-extra';
// @ts-ignore
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import * as path from 'path';
import {ExporterInterface} from '..';
import BaseExporter from '../BaseExporter';
import {createBundle} from '../bundled/createBundle';

import {
  getCopyrightNotice,
  getCurrentHumanTimestamp,
  getEmbedName,
  getOrganizationNameOrFallback,
} from '@haiku/sdk-client/lib/ProjectDefinitions';

export class EmbedBundlerExporter extends BaseExporter implements ExporterInterface {

  generateEmbedBundle (): Promise<string> {
    const projPath = this.getProjectFolder();
    const projName = this.getProjectName();
    const projOrganizationName = this.getProjectOrganizationName();

    const organizationName = getOrganizationNameOrFallback(projOrganizationName);
    const embedName = getEmbedName(organizationName, projName);

    const autoGeneratedNotice = `This file was autogenerated by Haiku at ${getCurrentHumanTimestamp()}.`;
    const copyrightNotice = getCopyrightNotice(organizationName);

    logger.info('[EmbedBundlerExporter] bundling code/main/dom-embed.js');

    return new Promise<string>((resolve, reject) => {
      createBundle(
        path.join(projPath, 'code/main'),
        path.join(projPath, 'code/main/dom-embed.js'),
        embedName,
        (bundleErr: any, bundledContents: any) => {
          if (bundleErr) {
            return reject(bundleErr);
          }
          logger.info('[EmbedBundlerExporter] bundling succeeded for', embedName);
          const finalContent = `/** ${autoGeneratedNotice}\n${copyrightNotice}\n*/\n${bundledContents}`;
          return resolve(finalContent);
        },
      );
    });
  }

  writeToFile (filename: string, framerate: number): Promise<void> {

    return this.generateEmbedBundle().then((content) => {
      return fse.writeFile(filename, content);
    }).catch((error) => {
      logger.error(`[EmbedBundlerExporter] caught exception during export: ${error.toString()}`);
      return fse.writeFile(filename, '{}');
    });

  }
}
