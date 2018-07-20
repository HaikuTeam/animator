import {MaybeAsync} from '../envoy';

export enum ExporterFormat {
  Unknown = 'Unknown',
  Bodymovin = 'Bodymovin',
  HaikuStatic = 'HaikuStatic',
  AnimatedGif = 'AnimatedGif',
  Video = 'Video',
  Still = 'Still',
}

export interface ExporterRequest {
  format: ExporterFormat;
  filename: string|Buffer;
  framerate: number;
}

export interface Exporter {
  save (request: ExporterRequest): MaybeAsync<void>;
  saved (request: ExporterRequest): MaybeAsync<void>;
}

export * from './ExporterHandler';
