import path = require('path');
import {ExporterInterface} from '..';
import BaseExporter from '../BaseExporter';
import {newFfmpegCommand} from '../ffmpeg';

/**
 * Returns an x264-compatible dimensions by rounding down to the nearest positive multiple of 2.
 */
const x264Dimension = (size: number) => Math.max(Math.floor(size) - (Math.floor(size) % 2), 2);

export class VideoExporter extends BaseExporter implements ExporterInterface {
  /**
   * Interface method to write binary output out to a file.
   * @returns {Promise<void>}
   */
  writeToFile (filename: string, framerate: number) {
    const assetPathPattern = path.join(this.componentFolder, `png-${framerate}`, 'frame-%07d.png');
    const componentSize = this.getComponentSize();
    return new Promise<void>((resolve, reject) => {
      // First make the palette.
      newFfmpegCommand()
        .addInput(assetPathPattern)
        .withInputOptions(['-framerate', `${framerate}`])
        .withVideoCodec('libx264')
        .withOutputOptions([
          '-vf',
          `fps=${framerate}`,
          '-vf',
          `scale=${x264Dimension(componentSize.x)}:${x264Dimension(componentSize.y)}`,
          '-pix_fmt',
          'yuv420p',
        ])
        .on('error', (stdout, stderr) => {
          reject(stderr);
        })
        .on('end', () => {
          resolve();
        })
        .save(filename);
    });
  }
}
