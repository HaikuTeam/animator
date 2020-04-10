const {notarize} = require('electron-notarize');

if (!process.env.APPLE_NOTARIZATION_API_KEY) {
  throw new Error('env var missing');
}
if (!process.env.APPLE_NOTARIZATION_API_ISSUER) {
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
    appleApiKey: process.env.APPLE_NOTARIZATION_API_KEY,
    appleApiIssuer: process.env.APPLE_NOTARIZATION_API_ISSUER,
  });
};
