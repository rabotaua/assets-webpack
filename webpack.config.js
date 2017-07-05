const webpack = require('webpack')
const path = require('path')
const glob = require('glob')
const getFiles = require('./getFilesHelper')


module.exports = {
	// entry: [`webpack-hot-middleware/client`, './src/test.js'],
	entry: getFiles(),
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: '[name].js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			}
		]
	},
	plugins: [
		// new webpack.HotModuleReplacementPlugin(),
	]
}