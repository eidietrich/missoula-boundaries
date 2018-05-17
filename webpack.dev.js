const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack')

module.exports = merge(common, {
  // dev only webpack stuff here
  devServer: {
     host: 'localhost',
     port: 8000,
     proxy: {
      '^/api/*': {
        target: 'http://localhost:3000/api/',
        secure: false
      }
    },
    headers: { "Access-Control-Allow-Origin": "*" }
  },
  plugins: [
    new CleanWebpackPlugin(['build-app']),
    new Dotenv({
      path: './.env.dev'
    })
  ]
})