import {HaikuBytecode} from '@haiku/core/lib/api';
import {ExporterFormat, ExporterRequest} from 'haiku-sdk-creator/lib/exporter';

import {BodymovinExporter} from './bodymovin/bodymovinExporter';
import {BundledExporter, BundleFormat} from './bundled/bundledExporter';
import {BundledZipExporter} from './bundled/bundledZipExporter';
import {GifExporter} from './gif/gifExporter';
import {HaikuStaticExporter} from './haikuStatic/haikuStaticExporter';
import {VideoExporter} from './video/videoExporter';

export interface ExporterInterface {
  writeToFile (filename: string|Buffer, framerate?: number): Promise<void>;
}

const getExporter = (request: ExporterRequest, bytecode: HaikuBytecode, componentFolder: string): ExporterInterface => {
  switch (request.format) {
    case ExporterFormat.Bodymovin:
      return new BodymovinExporter(bytecode, componentFolder);
    case ExporterFormat.HaikuStatic:
      return new HaikuStaticExporter(bytecode, componentFolder);
    case ExporterFormat.AnimatedGif:
      return new GifExporter(bytecode, componentFolder);
    case ExporterFormat.Video:
      return new VideoExporter(bytecode, componentFolder);
    case ExporterFormat.StandaloneBundle:
      return new BundledExporter(bytecode, componentFolder, BundleFormat.StandaloneFormat);
    case ExporterFormat.EmbedBundle:
      return new BundledExporter(bytecode, componentFolder, BundleFormat.EmbedFormat);
    case ExporterFormat.ZippedStandalone:
      return new BundledZipExporter(bytecode, componentFolder);
    default:
      throw new Error(`Unsupported format: ${request.format}`);
  }
};

export const handleExporterSaveRequest = async (
  request: ExporterRequest, bytecode: HaikuBytecode, componentFolder: string,
): Promise<void> => {
  const exporter = getExporter(request, bytecode, componentFolder);
  return exporter.writeToFile(request.filename, request.framerate);
};
