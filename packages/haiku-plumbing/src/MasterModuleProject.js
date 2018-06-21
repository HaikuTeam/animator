import {EventEmitter} from 'events';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';

const QUEUE_INTERVAL = 64;
const LAST_WRITE_MARGIN_OF_ERROR_MILLISECONDS = 500;

export default class MasterModuleProject extends EventEmitter {
  constructor (folder) {
    super();

    this.folder = folder; // String

    if (!this.folder) {
      throw new Error('[master-module] MasterModuleProject cannot launch without a folder defined');
    }

    // Reloads that we've requested that have not finished yet
    this._pendingReloads = [];

    // A queue of incoming module modifications that we've detected
    this._modificationsQueue = [];

    // Since a lot of changes can happen at the same time, we want to avoid accidentally
    // triggering a whole bunch of reloads, hence this queue, which has an opportunity to combine them or just
    // handle sequential reloads a bit more gracefully.
    this._modificationsInterval = setInterval(() => {
      const moduleMods = this._modificationsQueue.splice(0);
      if (moduleMods.length < 1) {
        return void (0);
      }
      this.maybeSendComponentReloadRequest(moduleMods[moduleMods.length - 1]);
    }, QUEUE_INTERVAL);
  }

  restart () {
    // Remove anything pending we have in the queues to avoid any mistaken
    // reloads that may still be pending in case the window was refreshed.
    this._modificationsQueue.splice(0);
    this._pendingReloads.splice(0);
  }

  maybeSendComponentReloadRequest (file) {
    const lastWrite = (parseInt(file.dtLastWriteStart, 10) || 0) + LAST_WRITE_MARGIN_OF_ERROR_MILLISECONDS;

    // If the last time we read from the file system came after the last time we wrote to it,
    // that's a decent indication that the last known change occurred directly on the file system.
    const lastRead = file.dtLastReadStart;

    if (lastRead < lastWrite) {
      return void (0);
    }

    logger.info('[master module] module replacement triggering', file.relpath, lastRead, lastWrite);

    // This is currently only used to detect whether we are in the midst of reloading so
    // that the master undo/redo queue can be smarter about whether to activate or not.
    // TODO: This smartness has not been implemented yet, please implement!
    this._pendingReloads.push(file);

    this.emit('component:reload', file);
  }

  handleReloadComplete (message) {
    // We remove a pending reload only if the glass told us it completed a reload,
    // since that is the place it counts (and we only want to do this once per reload).
    if (message.from === 'glass') {
      this._pendingReloads.shift();
      logger.info('[master module] module replacment finished');
    }
  }

  handleModuleChange (file) {
    this._modificationsQueue.push(file);
  }
}
