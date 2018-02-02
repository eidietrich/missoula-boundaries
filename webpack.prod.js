const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  // production only webpack stuff here
})