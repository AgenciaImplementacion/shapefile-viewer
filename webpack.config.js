const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/js/main.js',
  output: {
    filename: 'js/main.js',
    path: path.resolve(__dirname, 'build')
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
};
