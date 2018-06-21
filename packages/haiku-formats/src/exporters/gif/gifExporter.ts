import path = require('path');
import {ExporterInterface} from '..';
import BaseExporter from '../BaseExporter';
import {newFfmpegCommand} from '../ffmpeg';

export class GifExporter extends BaseExporter implements ExporterInterface {
  /**
   * Interface method to write binary output out to a file.
   * @returns {Promise<void>}
   */
  writeToFile (filename: string, framerate: number) {
    const workingDirectory = path.join(this.componentFolder, `png-${framerate}`);
    const palettePath = path.join(workingDirectory, 'palette.png');
    const assetPathPattern = path.join(workingDirectory, 'frame-%07d.png');
    return new Promise<void>((resolve, reject) => {
      // First make the palette.
      newFfmpegCommand()
        .addInput(assetPathPattern)
        .withOutputOptions(['-vf', 'palettegen'])
        .on('error', (stdout, stderr) => {
          reject(stderr);
        })
        .on('end', () => {
          newFfmpegCommand()
            .addInput(assetPathPattern)
            .withInputOption(['-framerate', `${framerate}`])
            .addInput(palettePath)
            .withOutputOptions(['-lavfi', `fps=${framerate} [x]; [x][1:v] paletteuse`])
            .on('error', (stdout, stderr) => {
              reject(stderr);
            })
            .on('end', () => {
              resolve();
            })
            .save(filename);
        })
        .save(palettePath);
    });
  }
}
