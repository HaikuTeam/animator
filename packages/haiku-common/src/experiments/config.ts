import {join} from 'path';

/**
 * Retrieve the experiment config from disk.
 */
export const getExperimentConfig = () => require(join('..', '..', 'config', 'experiments.json'));
