import {readJsonSync} from 'fs-extra';
import {join, resolve} from 'path';

/**
 * Retrieve the experiment config from disk.
 */
export const getExperimentConfig = () => {
  const experimentsFolder = resolve(__dirname, '..', '..', 'config');
  return readJsonSync(join(experimentsFolder, 'experiments.json'));
};
