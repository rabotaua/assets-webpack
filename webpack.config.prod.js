const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const config = require('./webpack.config.common.js')

module.exports = Object.assign(config, {
    // devtool: 'source-map',
    plugins: [
        ...config.plugins,
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            generateStatsFile: true,
            openAnalyzer: false,
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: false,
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru|en|uk/)
    ]
})
