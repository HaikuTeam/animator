/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  watch: true,
  entry: path.join(__dirname, '..', 'src', 'adapters', 'dom'),
  output: {
    path: path.resolve(__dirname, 'webpack'),
    filename: 'HaikuDOMAdapter.js',
    library: 'HaikuDOMAdapter',
    libraryTarget: 'window',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /src\/.+\.ts$/,
        loader: 'ts-loader',
        options: {
          configFile: path.join(__dirname, '..', 'tsconfig.json'),
        }
      }
    ]
  }
};
