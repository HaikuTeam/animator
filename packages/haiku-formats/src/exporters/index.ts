import {HaikuBytecode} from '@haiku/core/lib/api/HaikuBytecode';
import {ExporterFormat, ExporterRequest} from 'haiku-sdk-creator/lib/exporter';

import {BodymovinExporter} from './bodymovin/bodymovinExporter';
import {HaikuStaticExporter} from './haikuStatic/haikuStaticExporter';

// TODO: Use import after `haiku-serialization` port to typescript. 
// `haiku-serialization` is imported using `require` to avoid:
// "TS7016: Could not find a declaration file for module..."
// tslint:disable-next-line:variable-name
const LoggerInstance = require('haiku-serialization/src/utils/LoggerInstance');

export interface ExporterInterface {
  rawOutput(): any;
  binaryOutput(): string;
  failsafeBinaryOutput(): string;
}

const getExporter = (format: ExporterFormat, bytecode: HaikuBytecode): ExporterInterface => {
  switch (format) {
    case ExporterFormat.Bodymovin:
      return new BodymovinExporter(bytecode);
    case ExporterFormat.HaikuStatic:
      return new HaikuStaticExporter(bytecode);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
};

export const handleExporterSaveRequest = (request: ExporterRequest, bytecode: HaikuBytecode): Promise<string> => {
  return new Promise<string>((resolve) => {
    let binaryOutput = '';
    try {
      const exporter: ExporterInterface = getExporter(request.format, bytecode);
      binaryOutput = exporter.binaryOutput();
    } catch (e) {
      LoggerInstance.error(`[formats] caught exception during export: ${e.toString()}`);
      const exporter: ExporterInterface = getExporter(request.format, bytecode);
      binaryOutput = exporter.failsafeBinaryOutput();
    } finally {
      resolve(binaryOutput);
    }
  });
};
