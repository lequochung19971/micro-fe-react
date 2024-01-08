/* eslint-disable no-undef */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const webpack = require('webpack');
// const path = require('path');
// const DotenvWebpack = require('dotenv-webpack');
const dotenv = require('dotenv');

const envPath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({
  path: envPath,
});

const paths = require('./paths');
const deps = require('../package.json').dependencies;
const rootDeps = require('../../../package.json').dependencies;

module.exports = {
  // Where webpack looks to start building the bundle
  entry: [paths.src + '/index.js'],

  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
    // Must public a specific path for host-app load files of this remote
    publicPath: process.env.DOMAIN,
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset', // <-- Assets module - asset
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb
          },
        },
        generator: {
          //If emitting file, the file path is
          filename: 'assets/fonts/[hash][ext][query]',
        },
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),

    // Copies files from target to destination folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.src + '/assets',
          to: 'assets',
          globOptions: {
            ignore: ['*.DS_Store'],
          },
        },
      ],
    }),

    // Generates an HTML file from a template
    // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
    new HtmlWebpackPlugin({
      title: 'National Missing and Unidentified Persons Kenya',
      // favicon: paths.src + '/assets/icons/favicon.png',
      template: paths.public + '/index.html', // template file
      filename: 'index.html', // output file
    }),

    new ModuleFederationPlugin({
      name: 'host',
      filename: 'remoteEntry.js',
      exposes: {},
      remotes: {},
      shared: {
        ...rootDeps,
        ...deps,
      },
    }),
  ],
};
