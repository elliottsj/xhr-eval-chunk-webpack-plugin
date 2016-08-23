const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');
const XhrEvalChunkPlugin = require('..').default;

module.exports = {
  entry: path.resolve(__dirname, 'entry.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/test/build/',
  },
  plugins: [
    new CleanPlugin(path.resolve(__dirname, 'build')),
    new XhrEvalChunkPlugin(),
  ],
};
