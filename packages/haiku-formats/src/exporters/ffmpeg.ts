import {path as ffmpegPath} from 'ffmpeg-static';
import fluentFfmpeg = require('fluent-ffmpeg');

// @ts-ignore
fluentFfmpeg.setFfmpegPath(ffmpegPath);

export const newFfmpegCommand = (): fluentFfmpeg.FfmpegCommand => {
  // @ts-ignore
  return fluentFfmpeg();
};
