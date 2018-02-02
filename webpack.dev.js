const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  // dev only webpack stuff here
})