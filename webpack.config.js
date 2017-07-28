const webpack = require('webpack')
const path = require('path')
const glob = require('glob')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProd = process.env.NODE_ENV === 'production'

let config = {
    devtool: 'source-map',
    entry: glob.sync('./src/**/*.js').reduce((entries, entry) => Object.assign(entries, { [entry.replace('./src/', '').replace('.js', '')]: entry }), {}),
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                exclude: /node_modules/,
                loader: 'eslint-loader',
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            minChunks: 5,
        })
    ]
}

const productionPlugins = [
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
        sourceMap: true,
        comments: false,
        beautify: false,
        compress: {
            warnings: false
        }
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru|en|uk/)
]

if(isProd) {
    config.plugins.push(...productionPlugins)
}

module.exports = config
