import {MaybeAsync} from '../envoy';

export enum ExporterFormat {
  Unknown = 'Unknown',
  Bodymovin = 'Bodymovin',
  HaikuStatic = 'HaikuStatic',
}

export interface ExporterRequest {
  format: ExporterFormat;
  filename: string;
}

export interface Exporter {
  save (request: ExporterRequest): MaybeAsync<void>;
  saved (request: ExporterRequest): MaybeAsync<void>;
}

export * from './ExporterHandler';
