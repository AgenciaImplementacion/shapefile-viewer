const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack');
const path = require('path');

const config = {
  entry: {
    app: './src/js/main.js'
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
    //publicPath: '/build/'
  },
  devServer: {
    contentBase: path.join(__dirname, "build"),
    host: '0.0.0.0',
    compress: true,
    port: 9000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/views/index.html'
    }),
    new webpack.optimize.UglifyJsPlugin()
  ],
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: 'babel-loader',
      exclude: path.resolve(__dirname, 'node_modules/')
    }]
  }
};

module.exports = config;
