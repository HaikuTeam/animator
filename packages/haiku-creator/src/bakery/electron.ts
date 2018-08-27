import {ErrorCallback, queue} from 'async';
import {BrowserWindow, ipcMain} from 'electron';
import {existsSync, mkdirpSync, removeSync, writeFile} from 'fs-extra';
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
    const cacheKey = `${abspath}:${still}`;
    let calledFinish = false;
    const finish = () => {
      if (calledFinish) {
        return;
      }

      calledFinish = true;
      snapshotCache.set(cacheKey, cacheValue);
      ipcMain.removeAllListeners('bakery');
      cb();
      next();
    };

    let alreadyBaked = false;
    if (snapshotCache.has(cacheKey)) {
      alreadyBaked = still
        // If only capturing a still, any match containing the sha1 will do (i.e. framerate does not matter)
        ? (new RegExp(sha1)).test(snapshotCache.get(cacheKey))
        : snapshotCache.get(cacheKey) === cacheValue;
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
        backgroundColor: 'transparent',
      });
    }

    let frame = 0;
    // Stills should go two levels above the abspath of the component bytecode;
    // PNG sequences should be saved in parallel.
    outputDirectory = still
      ? path.resolve(path.dirname(abspath), '..', '..')
      : path.join(path.dirname(abspath), `png-${framerate}`);
    if (!still && existsSync(outputDirectory)) {
      removeSync(outputDirectory);
    }
    mkdirpSync(outputDirectory);

    const snap = (sender: any, payload: any, attemptNumber: number) => {
      if (browserWindow.isDestroyed()) {
        return finish();
      }

      browserWindow.capturePage((image) => {
        const data = image.toPNG();
        if (data.byteLength === 0) {
          // Try again…within reason.
          if (attemptNumber > 10) {
            finish();
            return;
          }
          setTimeout(() => snap(sender, payload, attemptNumber + 1), 100);
          return;
        }

        writeFile(
          still
            ? path.join(outputDirectory, 'still.png')
            : path.join(outputDirectory, `frame-${frame.toString().padStart(7, '0')}.png`),
          data,
          (err) => {
            if (err) {
              LoggerInstance.warn(err);
              return finish();
            }

            frame++;
            if (payload.last || browserWindow.isDestroyed() || still) {
              return finish();
            }
            sender.send('bakery', {type: 'tick'});
          },
        );
      });
    };

    const bakeryHandler = ({sender}: any, payload: any) => {
      switch (payload.type) {
        case 'snap':
          snap(sender, payload, 0);
          break;
        case 'closeShop':
          finish();
          break;
      }
    };

    ipcMain.on('bakery', bakeryHandler);

    browserWindow.webContents.once('did-finish-load', () => {
      browserWindow.webContents.send('bakery', {framerate, still, type: 'init'});
    });
    browserWindow.loadURL(`file://${path.join(__dirname, '..', '..', 'oven.html')}#${abspath}`);
  },
);

/**
 * Point of entry for request a PNG sequence from a bytecode file from the PNG bakery.
 */
export default (recipe: BakeryRecipe, cb: () => void) => {
  bakeryQueue.push({recipe, cb});
};
