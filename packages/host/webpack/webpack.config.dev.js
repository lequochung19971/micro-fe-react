/* eslint-disable no-undef */
const { merge } = require('webpack-merge');
const common = require('./webpack.config.common');
const webpack = require('webpack');
const paths = require('./paths');

module.exports = merge(common, {
  // Set the mode to development or production
  mode: 'development',

  // Control how source maps are generated
  devtool: 'inline-source-map',

  // Where webpack outputs the assets and bundles
  output: {
    filename: '[name].bundle.js',
  },

  // Spin up a server for quick development
  devServer: {
    historyApiFallback: true,
    static: paths.build,
    // open: true,
    compress: true,
    hot: true,
    port: 3000,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },

  plugins: [
    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin(),
  ],
});
