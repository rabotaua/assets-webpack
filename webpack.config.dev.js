const webpack = require('webpack')
const config = require('./webpack.config.common.js')

module.exports = Object.assign(config, {
    devtool: 'eval-source-map',
    plugins: [
        ...config.plugins,
        new webpack.HotModuleReplacementPlugin(),
    ]
})
