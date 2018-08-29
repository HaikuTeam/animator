import {ensureFileSync, existsSync, mkdirpSync, readFileSync, writeFileSync} from 'fs-extra';
// @ts-ignore
import {LOCKS} from 'haiku-serialization/src/bll/Lock';
import * as path from 'path';
import Watcher from '../Watcher';

const IMAGE_DATA_INDICATOR = 'data:image/';
const BASE64_DELIMITER = ';base64,';
const ASCII_ENCODING = 'ascii';
const BASE64_ENCODING = 'base64';

export const dumpBase64Images = (
  abspath: string,
  relpath: string,
  folder: string,
  watcher: Watcher,
  force = false,
) => {
  // Nothing to do if we're not looking at an SVG file.
  if (path.extname(relpath) !== '.svg') {
    return;
  }

  // If not forcing and a marker file indicates this SVG has already been processed, we can leave this be.
  const processedPath = `${abspath}.processed`;
  if (!force && existsSync(processedPath)) {
    return;
  }

  // Note how buffers are used as much as possible here and throughout. This reduces the overhead from working with
  // large strings in JS to an acceptable level.
  const buffer = readFileSync(abspath);
  let cursor = 0;
  let imageStart = 0;
  let xml = '';
  let imageCounter = 0;
  let changed = false;

  // With the output paths below, we will essentially hoist the first image in ./designs/foo.svg to
  // ./assets/designs/foo_image_1.png.
  const outputDirectory = path.join(
    'assets',
    path.dirname(relpath),
  );

  const outputPrefix = path.join(
    outputDirectory,
    `${path.basename(relpath, path.extname(relpath))}_image_`,
  );

  do {
    // Look for data:image/, as in xlink:href="data:image/…".
    imageStart = buffer.indexOf(IMAGE_DATA_INDICATOR, cursor);
    if (imageStart === -1) {
      break;
    }

    // Stop if we can't find the corresponding ;base64, delimiter after this mark.
    const encodingMarkStart = buffer.indexOf(BASE64_DELIMITER, imageStart + 1);
    // Ensure we support both single and double quotes by pulling out the first character *before* the data URL.
    const quotation = buffer.toString(ASCII_ENCODING, imageStart - 1, imageStart);
    if (encodingMarkStart === -1 || (quotation !== '\'' && quotation !== '"')) {
      break;
    }

    changed = true;

    // Pull out the extension; e.g. from data:image/png;base64,… extract "png".
    const extension = buffer.toString(ASCII_ENCODING, imageStart + IMAGE_DATA_INDICATOR.length, encodingMarkStart);
    const outputFilename = `${outputPrefix}${++imageCounter}.${extension}`;
    mkdirpSync(path.join(folder, outputDirectory));

    // Add the content up until data:image/ as is.
    xml += buffer.toString(ASCII_ENCODING, cursor, imageStart);
    cursor = buffer.indexOf(quotation, imageStart + 1) + 1;
    writeFileSync(
      path.join(folder, outputFilename),
      Buffer.from(
        // Sadly, we need to stringify the buffer in memory to convert from ASCII to base64
        // (buffer.transcode does not support base64). The performance penalty of this seems minimal.
        buffer.toString(ASCII_ENCODING, encodingMarkStart + BASE64_DELIMITER.length, cursor - 1),
        BASE64_ENCODING,
      ),
    );
    xml += 'web+haikuroot://' + path.posix.normalize(outputFilename);
    xml += quotation;
  } while (cursor !== -1);
  if (changed) {
    // We should never encounter the negation of this condition, but just in case….
    if (cursor !== -1) {
      xml += buffer.toString(ASCII_ENCODING, cursor);
    }
    if (watcher) {
      watcher.blacklistKey(LOCKS.FileReadWrite(abspath));
    }
    writeFileSync(abspath, xml);
    if (watcher) {
      watcher.unblacklistKey(LOCKS.FileReadWrite(abspath));
    }
  }

  // Write out a .processed file next to the asset so we can skip this the next time we bootstrap.
  ensureFileSync(processedPath);
};
