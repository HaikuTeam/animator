/**
 * Runtime environment.
 * @enum {string}
 */
export enum Environment {
  Test = 'test',
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

/**
 * Canonical method to retrieve the current environment.
 *
 * If no environment is provided as an environment variable, assume production.
 */
export const getEnvironment = () => global.process.env.NODE_ENV || Environment.Production;
