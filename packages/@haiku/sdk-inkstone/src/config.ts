export interface InkstoneConfig {
  baseUrl?: string;
  baseShareUrl?: string;
  authToken?: string;
}

export const inkstoneConfig: InkstoneConfig = {
  baseUrl: 'https://inkstone.haiku.ai/',
  baseShareUrl: 'https://share.haiku.ai/',
};
