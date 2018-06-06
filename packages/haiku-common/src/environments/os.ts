/**
 * Environment operating system.
 * @enum {string}
 */
const enum OperatingSystem {
  Mac,
  Windows,
  Linux,
  Web,
}

/**
 * Gets the environment operating system. Note that as these are derived from process environment variables, it is
 * possible to override them
 */
const getOperatingSystem: () => OperatingSystem = () => {
  const operatingSystem: string = process.env.HAIKU_RELEASE_PLATFORM;
  switch (operatingSystem) {
    case 'windows':
      return OperatingSystem.Windows;
    case 'linux':
      return OperatingSystem.Linux;
    case 'web':
      return OperatingSystem.Web;
    default:
      // This should really be an error. For now, we force mac as default for tests etc.
      return OperatingSystem.Mac;
  }
};

/* These OS detection functions should be prefered, as they are concise */
export const isMac = () => getOperatingSystem() === OperatingSystem.Mac;
export const isWindows = () => getOperatingSystem() === OperatingSystem.Windows;
export const isLinux = () => getOperatingSystem() === OperatingSystem.Linux;
export const isWeb = () => getOperatingSystem() === OperatingSystem.Web;
