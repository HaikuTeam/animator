import {BrowserWindow, ipcMain} from 'electron';
import {mkdirpSync, writeFile} from 'fs-extra';
// @ts-ignore
import {requireFromFile} from 'haiku-serialization/src/bll/ModuleWrapper';
// @ts-ignore
import LoggerInstance from 'haiku-serialization/src/utils/LoggerInstance';
import * as path from 'path';

/**
 * Point of entry for request a PNG sequence from a bytecode file from the PNG bakery.
 * @param {string} abspath
 * @param {(outputDirectory: string) => void} cb
 */
export default (abspath: string, framerate: number, cb: () => void) => {
  const bytecode = requireFromFile(abspath);
  const haikuId = bytecode.template.attributes['haiku-id'];
  const width = bytecode.timelines.Default['haiku:' + haikuId]['sizeAbsolute.x'][0].value;
  const height = bytecode.timelines.Default['haiku:' + haikuId]['sizeAbsolute.y'][0].value;

  const browserWindow = new BrowserWindow({
    width,
    height,
    frame: false,
    show: false,
    backgroundColor: 'white',
  });

  let frame = 0;
  const outputDirectory = path.join(path.dirname(abspath), `png-${framerate}`);
  mkdirpSync(outputDirectory);
  const exit = () => {
    ipcMain.removeAllListeners('bakery');
    if (!browserWindow.isDestroyed()) {
      browserWindow.close();
    }
    cb();
  };

  const bakeryHandler = ({sender}: any, payload: any) => {
    switch (payload.type) {
      case 'snap':
        browserWindow.capturePage((image) => {
          writeFile(
            path.join(outputDirectory, `frame-${frame.toString().padStart(7, '0')}.png`),
            image.toPNG(),
            (err) => {
              if (err) {
                LoggerInstance.warn(err);
                return exit();
              }

              frame++;
              if (payload.last || browserWindow.isDestroyed()) {
                return exit();
              }
              sender.send('bakery', {type: 'tick'});
            },
          );
        });
        break;
      case 'closeShop':
        exit();
        break;
    }
  };

  ipcMain.on('bakery', bakeryHandler);

  browserWindow.loadURL(`file://${path.join(__dirname, '..', '..', 'oven.html')}#${abspath}`);
  browserWindow.webContents.on('did-finish-load', () => {
    browserWindow.webContents.send('bakery', {framerate, type: 'init'});
  });
};
