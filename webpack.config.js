const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/assets/',
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
};
