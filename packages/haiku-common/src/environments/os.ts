
/**
 * Environment operating system.
 * @enum {string}
 */
export const enum OperatingSystem {
  Mac,
  Windows,
  Linux,
  Web,
}

/**
 * Gets the environment operating system.
 * Note that as its derived from process environment vars
 * it is possible to override them
 */
export const getEnvironmentOS = () => {
  const operatingSystem: string = process.env['HAIKU_RELEASE_PLATFORM'];
  switch (operatingSystem) {
    case 'mac': {
      return OperatingSystem.Mac;
    }
    case 'windows': {
      return OperatingSystem.Windows;
    }
    case 'linux': {
      return OperatingSystem.Linux;
    }
    case 'web': {
      return OperatingSystem.Web;
    }
    default: {
      throw new Error('Something bad happened');
    }
  }
};

/* These OS detection functions should be prefered, as they are concise */
export const isMac = () => getEnvironmentOS() === OperatingSystem.Mac;
export const isWindows = () => getEnvironmentOS() === OperatingSystem.Windows;
export const isLinux = () => getEnvironmentOS() === OperatingSystem.Linux;
export const isPosix = () => (getEnvironmentOS() === OperatingSystem.Mac ||
  getEnvironmentOS() === OperatingSystem.Linux);
export const isWeb = () => getEnvironmentOS() === OperatingSystem.Web;
