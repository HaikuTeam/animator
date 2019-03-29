/* eslint-disable prefer-promise-reject-errors */
const {URL, URLSearchParams} = require('url');
const request = require('request');
const fse = require('haiku-fs-extra');
const path = require('path');
const {inkstone} = require('@haiku/sdk-inkstone');
const logger = require('../utils/LoggerInstance');
const randomAlphabetical = require('../utils/randomAlphabetical');
const mixpanel = require('haiku-serialization/src/utils/Mixpanel');
const {sanitize} = require('../utils/fileManipulation');

const API_BASE = 'https://api.figma.com/v1/';
const FIGMA_URL = 'https://www.figma.com/';
const FIGMA_CLIENT_ID = 'tmhDo4V12I3fEiQ9OG8EHh';
const IS_FIGMA_FILE_RE = /\.figma$/;
const IS_FIGMA_FOLDER_RE = /\.figma\.contents/;
const FIGMA_DEFAULT_FILENAME = 'Untitled';

const VALID_TYPES = {
  SLICE: 'SLICE',
  GROUP: 'GROUP',
  FRAME: 'FRAME',
  COMPONENT: 'COMPONENT',
};
const FOLDERS = {
  [VALID_TYPES.SLICE]: 'slices/',
  [VALID_TYPES.GROUP]: 'groups/',
  [VALID_TYPES.COMPONENT]: 'groups/',
  [VALID_TYPES.FRAME]: 'frames/',
};

export const MAX_ITEMS_TO_IMPORT = 100;

const PRIORITY_TO_IMPORT = [
  VALID_TYPES.SLICE,
  VALID_TYPES.GROUP,
  VALID_TYPES.FRAME,
  VALID_TYPES.COMPONENT,
];

const uniqueNameResolver = {};

const PHONY_FIGMA_FILE = 'phony-haiku-helper-file.svg';

/**
 * @class Figma
 * @description
 *  Collection of static class methods and constants related to Figma assets.
 */
class Figma {
  constructor ({token, requestLib = request}) {
    this._token = token;
    this._requestLib = requestLib;
  }

  set token (token) {
    this._token = token;
  }

  get token () {
    return this._token;
  }

  /**
   * Imports SVGs from a Figma url in the given path
   * @param {Object} params
   * @param {string} params.url
   * @param {string} params.projectFolder
   * @returns {Promise}
   */
  importSVG ({url, projectFolder}) {
    const {id} = Figma.parseProjectURL(url);
    let assetBaseFolder;

    logger.info('[figma] about to import document with id ' + id);
    mixpanel.haikuTrack('creator:figma:fileImport:start');

    return new Promise((resolve, reject) => {
      this.fetchDocument(id)
        .then((rawDocument) => {
          const document = JSON.parse(rawDocument);
          const abspath = path.join(projectFolder, 'designs', `${id}-${document.name}.figma`);
          assetBaseFolder = `${abspath}.contents`;
          this.createFolders(assetBaseFolder);
          return document;
        })
        .then((document) => this.findInstantiableElements(document, id))
        .then((elements) => this.sortElementsByPriorityToImport(elements))
        .then((elements) => this.getSVGLinks(elements, id))
        .then((elements) => this.getSVGContents(elements))
        .then((elements) => this.writeSVGInDisk(elements, assetBaseFolder))
        .then((elements) => {
          mixpanel.haikuTrack('creator:figma:fileImport:success');
          resolve(elements.length);
        })
        .catch(reject);
    });
  }

  /**
   * Fetch document info from the Figma API
   * @param {string} id
   * @returns {Promise}
   */
  fetchDocument (id) {
    const uri = API_BASE + 'files/' + id;
    return this.request({uri});
  }

  /**
   * Create necessary folders
   * @param {string} assetBaseFolder
   */
  createFolders (assetBaseFolder) {
    return new Promise((resolve, reject) => {
      try {
        fse.emptyDirSync(assetBaseFolder);

        const sliceFolder = path.join(assetBaseFolder, FOLDERS[VALID_TYPES.SLICE]);
        fse.mkdirpSync(sliceFolder);

        const groupFolder = path.join(assetBaseFolder, FOLDERS[VALID_TYPES.GROUP]);
        fse.mkdirpSync(groupFolder);

        const frameFolder = path.join(assetBaseFolder, FOLDERS[VALID_TYPES.FRAME]);
        fse.mkdirpSync(frameFolder);

        fse.ensureFileSync(path.join(sliceFolder, PHONY_FIGMA_FILE));

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Write an array of elements containing SVG info into disk
   * @param {Array} elements
   * @param {String} assetBaseFolder
   * @returns {Promise}
   */
  writeSVGInDisk (elements, assetBaseFolder) {
    logger.info('[figma] writing SVGs in disk');

    return Promise.all(
      elements.map((element) => {
        if (element) {
          // Mimic the behaior of our Sketch importer: move to the slices folder
          // everything that is marked for export
          const folder = FOLDERS[element.type] || FOLDERS.SLICE;
          const svgPath = path.join(assetBaseFolder, folder, `${sanitize(element.name)}.svg`);
          return fse.writeFile(svgPath, element.svg || '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>');
        }
      }),
    );
  }

  /**
   * Maps an array of elements with URLs pointing to SVG resources to elements
   * with actual SVG markup as a string property
   * @param {Array} elements
   */
  getSVGContents (elements) {
    logger.info('[figma] downloading SVGs from cloud');

    const requests = elements.map((element) => {
      return new Promise((resolve, reject) => {
        this.request({uri: element.svgURL, auth: false}).then((svg) => {
          resolve(Object.assign(element, {svg}));
        })
        .catch((error) => {
          logger.error(`[figma] failed to import slice or group: ${JSON.stringify(element)}`, error);
          resolve();
        });
      });
    });

    return Promise.all(requests);
  }

  /**
   * Maps an array of elements into an array of elements with links to their
   * SVG representation in the cloud via the Figma API
   * @param {Array} elements
   * @param {string} id
   * @returns {Promise}
   */
  getSVGLinks (elements, id) {
    return new Promise((resolve, reject) => {
      let ids = elements.map((element) => element.id);

      if (ids.length === 0) {
        return reject({
          status: 424,
          err: 'It looks like the Figma document you imported doesn\'t have any groups or slices. Try adding some and re-syncing.',
        });
      }

      // TODO: instead of limiting the max number of items to import, import them in batches
      // for now it doesn't make sense to import a lot of items anyway due to performance
      // reasons. [Look in Asana][1] for the related ticket
      // [1]: https://app.asana.com/0/506410768732347/781835844490777
      if (ids.length > MAX_ITEMS_TO_IMPORT) {
        ids = ids.slice(0, MAX_ITEMS_TO_IMPORT);
      }

      const params = new URLSearchParams([['format', 'svg'], ['ids', ids], ['svg_include_id', true]]);
      const uri = API_BASE + 'images/' + id + '?' + params.toString();

      this.request({uri})
        .then((SVGLinks) => {
          // TODO: links comes with an error param, we should check that
          const {images} = JSON.parse(SVGLinks);
          const elementsWithLinks = elements.map((element) => {
            return Object.assign(element, {svgURL: images[element.id]});
          });

          resolve(elementsWithLinks);
        })
        .catch(reject);
    });
  }

  sortElementsByPriorityToImport (arr) {
    return arr.sort((a, b) => PRIORITY_TO_IMPORT.indexOf(a.type) - PRIORITY_TO_IMPORT.indexOf(b.type));
  }

  findItems (arr, fileId) {
    const result = [];

    for (const item of arr) {
      if (VALID_TYPES[item.type] || (item.exportSettings && item.exportSettings.length > 0)) {
        result.push({
          id: item.id,
          name: Figma.getUniqueName(fileId, item.name),
          type: item.type,
        });
      }

      if (item.children) {
        result.push(...this.findItems(item.children, fileId));
      }
    }

    return result;
  }

  findInstantiableElements (file, fileId) {
    uniqueNameResolver[fileId] = {};
    return this.findItems(file.document.children, fileId);
  }

  request ({uri, auth = true}) {
    const headers = auth ? {Authorization: 'Bearer ' + this.token} : {};

    return new Promise((resolve, reject) => {
      this._requestLib({uri, headers}, (error, response, body) => {
        if (error || response.statusCode !== 200) {
          try {
            reject(JSON.parse(body));
          } catch (e) {
            reject({status: 500, err: 'There was an error connecting with Figma.'});
          }
        } else {
          resolve(body);
        }
      });
    });
  }

  /**
   * Parse a Figma URL and return the name and the id of the file it references
   * @param {string} rawURL must be a string in the format 'protocol://host/id/name
   * @returns {Object} an object containing the id and the name in the URL
   */
  static parseProjectURL (rawURL) {
    logger.info('[figma] parsing project URL: ' + rawURL);

    try {
      const url = new URL(rawURL);
      // eslint-disable-next-line
      const [_, __, id, name] = url.pathname.split('/');

      if (!id) {
        return null;
      }

      return {id, name: name || FIGMA_DEFAULT_FILENAME};
    } catch (e) {
      return null;
    }
  }

  /**
   * Build a link to a Figma file based on the ID and the name
   * @param {string} fileID
   * @param {string} fileName
   * @returns {string}
   */
  static buildFigmaLink (fileID, fileName = '') {
    return `${FIGMA_URL}file/${fileID}/${fileName}`;
  }

  /**
   * Build a OAuth link
   * @returns {string}
   */
  static buildAuthenticationLink () {
    const state = randomAlphabetical(15);
    const redirectURI = `haiku://oauth/figma&scope=file_read&state=${state}&response_type=code`;
    const url = `${FIGMA_URL}oauth?client_id=${FIGMA_CLIENT_ID}&redirect_uri=${redirectURI}`;
    return {url, state};
  }

  /**
   * Request inkstone for a Figma access token
   * @param {Object} params
   * @param {string} params.code
   * @param {string} params.state
   * @param {string} params.stateCheck
   */
  static getAccessToken ({code, state, stateCheck}) {
    return new Promise((resolve, reject) => {
      if (state !== stateCheck) {
        reject({status: 403, err: 'Invalid state code'});
      }

      inkstone.integrations.getFigmaAccessToken(code, (error, response) => {
        error ? reject(error) : resolve(response);
      });
    });
  }

  /**
   * Checks if a path points to a Figma file
   * @param {string} path
   * @returns {boolean}
   */
  static isFigmaFile (path) {
    return !!path && path.match(IS_FIGMA_FILE_RE);
  }

  /**
   * Checks if a path points to a Figma folder
   * @param {string} path
   * @returns {boolean}
   */
  static isFigmaFolder (path) {
    return !!path && path.match(IS_FIGMA_FOLDER_RE);
  }

  /**
   * Tries to find an ID from a Figma path
   * @param {string} relpath
   * @returns {string|boolean}
   */
  static findIDFromPath (relpath) {
    const basename = path.basename(relpath);
    const match = basename.match(/(\w+)-/);
    return match && match[1];
  }

  /**
   * Tries to find the asset name from a Figma path
   * @param {string} relpath
   * @returns {string}
   */
  static findDisplayNameFromPath (relpath) {
    const basename = path.basename(relpath);
    const match = basename.match(/(\w+)-([\w-]+)\./);
    return match ? match[2] : FIGMA_DEFAULT_FILENAME;
  }

  static buildFigmaLinkFromPath (relpath) {
    const id = Figma.findIDFromPath(relpath);
    return Figma.buildFigmaLink(id);
  }

  /**
   * Using uniqueNameResolver hashmap, retrieve a unique name for this Figma sync. This allows duplicate names on slices
   * while still allowing us to fetch and write out SVG contents async.
   * @param {string} fileId
   * @param {string} name
   * @returns {string}
   */
  static getUniqueName (fileId, name) {
    if (!uniqueNameResolver[fileId]) {
      // This should never happen.
      uniqueNameResolver[fileId] = {};
    }

    if (!uniqueNameResolver[fileId].hasOwnProperty(name)) {
      uniqueNameResolver[fileId][name] = 0;
      return name;
    }

    return `${name} Copy ${++uniqueNameResolver[fileId][name]}`;
  }
}

module.exports = {Figma, PHONY_FIGMA_FILE, FIGMA_DEFAULT_FILENAME};
