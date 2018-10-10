
export enum ExporterFormat {
  Unknown = 'Unknown',
  Bodymovin = 'Lottie',
  HaikuStatic = 'HaikuStatic',
  AnimatedGif = 'GIF',
  Video = 'Video',
  Still = 'Still',
  StandaloneBundle = 'StandaloneBundle',
  EmbedBundle = 'EmbedBundle',
  ZippedStandalone = 'ZippedStandalone',
}

export interface ExporterRequest {
  format: ExporterFormat;
  filename: string|Buffer;
  framerate: number;
  outlet?: string;
  progress?: number;
}

export * from './ExporterHandler';
