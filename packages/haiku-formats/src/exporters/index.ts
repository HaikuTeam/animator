import {HaikuBytecode} from 'haiku-common/lib/types';
import {ExporterFormat, ExporterRequest} from 'haiku-sdk-creator/lib/exporter';

import {BodymovinExporter} from './bodymovin/bodymovinExporter';

export interface Exporter {
  rawOutput(): any;
  binaryOutput(): string;
}

const getExporter = (format: ExporterFormat, bytecode: HaikuBytecode): Exporter => {
  switch (format) {
    case ExporterFormat.Bodymovin:
      return new BodymovinExporter(bytecode);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
};

export const handleExporterSaveRequest = (request: ExporterRequest, bytecode: HaikuBytecode): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    try {
      const exporter: Exporter = getExporter(request.format, bytecode);
      resolve(exporter.binaryOutput());
    } catch (e) {
      reject(e);
    }
  });
};
