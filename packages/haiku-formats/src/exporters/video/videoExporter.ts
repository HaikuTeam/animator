import path = require('path');
import {ExporterInterface} from '..';
import BaseExporter from '../BaseExporter';
import {newFfmpegCommand} from '../ffmpeg';

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
          `fps=${framerate}, scale=${componentSize.x}:${componentSize.y}`,
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
