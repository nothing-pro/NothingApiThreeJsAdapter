/* global __dirname, require, module*/
const path = require('path');
const env = require('yargs').argv.env;

let libraryName = 'NOTHING';

let outputFile, mode, outputPath;

if (env === 'build') {
  mode = 'production';
  outputFile = '[name].min.js';
  outputPath = '/lib';
} else if (env === 'dev') {
  mode = 'development';
  outputFile = '[name].js';
  outputPath = '/lib';
} else {
  mode = 'production';
  outputFile = '[name].min.js';
  outputPath = '/dist';
}

const config = {
  mode: mode,
  entry: {
    'nothing.api': __dirname + '/src/api.js'
  },
  devtool: 'source-map',
  output: {
    path: __dirname + outputPath,
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js']
  }
};

module.exports = config;
