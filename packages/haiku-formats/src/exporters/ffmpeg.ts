import fluentFfmpeg = require('fluent-ffmpeg');
import {join} from 'path';

try {
  // @ts-ignore
  // tslint:disable-next-line:no-var-requires
  fluentFfmpeg.setFfmpegPath(require('ffmpeg-static').path);
} catch (error) {
  // @ts-ignore
  fluentFfmpeg.setFfmpegPath(join(require.resolve('haiku-formats').split('app.asar')[0], 'ffmpeg'));
}

export const newFfmpegCommand = (): fluentFfmpeg.FfmpegCommand => fluentFfmpeg();
