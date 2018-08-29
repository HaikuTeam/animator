module.exports = function forceNodeEnvProduction () {
  // For consistency, always set _our_ build process NODE_ENV to 'production'.
  // Note that this is different than the NODE_ENV set within the app runtime.
  process.env.NODE_ENV = 'production';
  console.log('heads up: forced NODE_ENV to "production"');
};
