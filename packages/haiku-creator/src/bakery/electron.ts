import {ErrorCallback, queue} from 'async';
import {BrowserWindow, ipcMain} from 'electron';
import {mkdirpSync, writeFile} from 'fs-extra';
// @ts-ignore
import LoggerInstance from 'haiku-serialization/src/utils/LoggerInstance';
import * as path from 'path';

let browserWindow: BrowserWindow;
let outputDirectory: string;

interface BakeryRecipe {
  abspath: string;
  framerate: number;
  width: number;
  height: number;
  sha1: string;
  still: boolean;
}

interface QueuedRecipe {
  recipe: BakeryRecipe;
  cb: () => void;
}

/**
 * Maintain a local snapshop cache abspath -> `${sha1}:${framerate}` so we know when generation of a new PNG sequence
 * is unnecessary.
 */
const snapshotCache = new Map<string, string>();

const bakeryQueue = queue<QueuedRecipe, Error>(
  (
    {
      recipe: {abspath, framerate, width, height, still, sha1},
      cb,
    },
    next: ErrorCallback<Error>,
  ) => {
    const cacheValue = `${sha1}:${framerate}`;
    let calledFinish = false;
    const finish = () => {
      if (calledFinish) {
        return;
      }

      calledFinish = true;
      snapshotCache.set(abspath, cacheValue);
      ipcMain.removeAllListeners('bakery');
      cb();
      next();
    };

    let alreadyBaked = false;
    if (snapshotCache.has(abspath)) {
      alreadyBaked = still
        // If only capturing a still, any match containing the sha1 will do (i.e. framerate does not matter)
        ? (new RegExp(sha1)).test(snapshotCache.get(abspath))
        : snapshotCache.get(abspath) === cacheValue;
    }

    if (alreadyBaked) {
      return finish();
    }

    if (browserWindow && !browserWindow.isDestroyed()) {
      browserWindow.setSize(Math.round(width), Math.round(height));
    } else {
      browserWindow = new BrowserWindow({
        width: Math.round(width),
        height: Math.round(height),
        frame: false,
        show: false,
        backgroundColor: 'white',
      });
    }

    let frame = 0;
    outputDirectory = path.join(path.dirname(abspath), `png-${framerate}`);
    mkdirpSync(outputDirectory);
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
                  return finish();
                }

                frame++;
                if (payload.last || browserWindow.isDestroyed()) {
                  return finish();
                }
                sender.send('bakery', {type: 'tick'});
              },
            );
          });
          break;
        case 'closeShop':
          finish();
          break;
      }
    };

    ipcMain.on('bakery', bakeryHandler);

    browserWindow.loadURL(`file://${path.join(__dirname, '..', '..', 'oven.html')}#${abspath}`);
    browserWindow.webContents.on('did-finish-load', () => {
      browserWindow.webContents.send('bakery', {framerate, type: 'init'});
    });
  },
);

/**
 * Point of entry for request a PNG sequence from a bytecode file from the PNG bakery.
 */
export default (recipe: BakeryRecipe, cb: () => void) => {
  bakeryQueue.push({recipe, cb});
};
