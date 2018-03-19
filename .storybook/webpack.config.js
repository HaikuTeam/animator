const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');
module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: ['awesome-typescript-loader', 'webpack-conditional-loader']
  });
  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
