const {
  override,
  addBabelPreset,
  addBabelPlugin,
  addDecoratorsLegacy
} = require('customize-cra');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const __DEV__ = process.env.NODE_ENV === 'development'; // eslint-disable-line no-underscore-dangle
const __PROD__ = process.env.NODE_ENV === 'production'; // eslint-disable-line no-underscore-dangle

const addCustomize = () => (config) => {
  const entry = {
    main: [path.join(__dirname, "./src/index.js")]
  }
  config.entry = entry
  config.output.filename = 'static/js/[name].js';

  config.optimization = {
    minimize: __PROD__,
    minimizer: config.optimization.minimizer,
    splitChunks: false
  };
  return config;
};

const addDllPlugin = () => (config) => {
  config.plugins.push(
    new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require('./vendor/vendor-manifest.json')
    }),
  )
  return config;
}

const addHtmlWebpackPlugin = () => (config) => {

  const minify = __PROD__ && {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
  }

  config.plugins.push(
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['vendor', 'main'],
      filename: 'main.html',
      template: path.join(__dirname, 'index.html'),
      title: "测试",
      minify
    }),
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, './vendor/*.dll.js'),
    })
  )
  return config
}

module.exports = {
  webpack: override(
    addCustomize(),
    addDllPlugin(),
    addDecoratorsLegacy(),
    addBabelPlugin(["@babel/plugin-proposal-class-properties", { "loose": true }]),
    addHtmlWebpackPlugin(),
    addBabelPreset(["@babel/env", {
      "targets": {
        "browsers": [
          "> 1%",
          "last 2 versions",
          "not ie <= 8"
        ]
      }
    }]),
  )
};
