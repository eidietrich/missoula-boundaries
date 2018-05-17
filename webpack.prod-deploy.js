const merge = require('webpack-merge');
const common = require('./webpack.prod.js');

const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack')

// Repeated
const paths = {
  app: path.resolve(__dirname, 'app'),
  buildAppLocal: path.resolve(__dirname, 'build-app'),
  buildAppDeploy: path.resolve(__dirname, 'build-app-deploy')
}

module.exports = merge(common, {
  // production only webpack stuff here
  output: {
    path: paths.buildAppDeploy,
    filename: 'bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(['build-app-deploy']),
    new Dotenv({
      path: './.env.deploy'
    })
  ]

})