const Svgo = require('svgo');
const customPlugins = require('./plugins');

let singleton;

const plugins = [
  'removeMetadata',
  'removeTitle',
  'removeDesc',
  'removeUselessDefs',
  'removeEmptyAttrs',
  'removeUselessStrokeAndFill',
  'removeNonInheritableGroupAttrs',
  'moveElemsAttrsToGroup',
  'removeEmptyContainers',
  'removeEmptyText',
  'removeViewBox',
  'convertStyleToAttrs',
  customPlugins,
];

module.exports = () => {
  if (!singleton) {
    singleton = new Svgo({
      full: true,
      floatPrecision: 3,
      plugins,
    });
  }

  return singleton;
};
