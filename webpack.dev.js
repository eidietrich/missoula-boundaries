const merge = require('webpack-merge');
const common = require('./webpack.common.js');

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
  }
})