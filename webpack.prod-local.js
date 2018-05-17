const merge = require('webpack-merge');
const common = require('./webpack.prod.js');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack')

module.exports = merge(common, {
  // production only webpack stuff here
  plugins: [
    new CleanWebpackPlugin(['build-app']),
    new Dotenv({
      path: './.env.dev'
    })
  ]
})