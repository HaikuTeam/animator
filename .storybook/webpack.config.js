const path = require('path')
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: ['awesome-typescript-loader', 'webpack-conditional-loader']
  });
  config.module.rules.push({
    test: /\.css$/,
    include: path.resolve(__dirname, '../../haiku-creator/public/assets/')
  });
  config.module.rules.push({
    test: /\.(png|woff|woff2|eot|ttf|svg)$/,
    loader: 'url-loader?limit=100000'
  })
  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
