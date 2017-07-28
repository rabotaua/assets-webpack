const webpack = require('webpack')
const path = require('path')
const glob = require('glob')



module.exports = {
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
