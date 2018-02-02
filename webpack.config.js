const path = require('path');
// for loading index.html file from app/
const HtmlWebpackPlugin = require('html-webpack-plugin');
// for separating css out to styles.css file in build/
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const paths = {
  app: path.resolve(__dirname, 'app'),
  build: path.resolve(__dirname, 'build')
}


const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.join(paths.app, 'index.html'),
  filename: 'index.html',
  inject: 'body'
})


module.exports = {
  entry: path.join(paths.app, 'index.js'),
  output: {
    path: paths.build,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
        // loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader'
      },
      {
        test: /\.(svg|gif|png|jpg)$/,
        exclude: /node_modules/,
        loader: 'file-loader'
      }

    ]
  },
  plugins: [
    HtmlWebpackPluginConfig,
    new ExtractTextPlugin("styles.css")
  ]
}