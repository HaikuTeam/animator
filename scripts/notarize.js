const {notarize} = require('electron-notarize');

if (!process.env.APPLE_NOTARIZATION_APPLE_ID) {
  throw new Error('env var missing');
}

if (!process.env.APPLE_NOTARIZATION_PASSWORD) {
  throw new Error('env var missing');
}

exports.default = function notarizing(context) {
  const {electronPlatformName, appOutDir} = context;

  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return notarize({
    appBundleId: 'com.Haiku.HaikuForDesignersAndEngineers',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_NOTARIZATION_APPLE_ID,
    appleIdPassword: process.env.APPLE_NOTARIZATION_PASSWORD
  });
};
