import fluentFfmpeg = require('fluent-ffmpeg');
import {join} from 'path';

/**
 * Note to future explorers:
 *
 * We have to do some acrobatics here to resolve the linked ffmpeg executable from ffmpeg-static.
 *
 * In dev mode, we can rely on the the ffmpeg-static package to produce its own path reliably.
 *
 * In prod, we don't even bother package ffmpeg-static, and instead hoist its binary to sit parallel to the app.asar
 * directory where our actual code lives. For numerous reasons, electron-builder's asarUnpack option turned out not
 * to be suitable for this purpose.
 */
try {
  // @ts-ignore
  // tslint:disable-next-line:no-var-requires
  fluentFfmpeg.setFfmpegPath(require('ffmpeg-static').path);
} catch (error) {
  // @ts-ignore
  fluentFfmpeg.setFfmpegPath(join(require.resolve('haiku-formats').split('app.asar')[0], 'ffmpeg'));
}

export const newFfmpegCommand = (): fluentFfmpeg.FfmpegCommand => fluentFfmpeg();
