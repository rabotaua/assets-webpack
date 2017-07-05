const path = require('path')
const express = require('express')
const webpack = require('webpack')
const sass = require('node-sass-middleware')
const postcss = require('postcss-middleware')
const autoprefixer = require('autoprefixer')
const webpackMiddleware = require('webpack-dev-middleware')
// const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('./webpack.config.js')
const destPath = path.join(__dirname, '/dist')

const app = express()

const compiler = webpack(config);
const middleware = webpackMiddleware(compiler, {
	publicPath: config.output.publicPath,
	contentBase: 'src',
	stats: {
		colors: true,
		hash: false,
		timings: true,
		chunks: false,
		lazy: true,
		chunkModules: false,
		modules: false
	}
})

app.use(middleware)
// app.use(webpackHotMiddleware(compiler))

app.use('/', sass({
	src: path.join(__dirname, '/src'),
	response: false,
	dest: destPath,
	includePaths: ['src'],
	sourceMap: true
}))

app.use('/', postcss({
	plugins: [autoprefixer()],
	src: req => path.join(destPath, req.url),
	inlineSourcemaps: true
}))

const port = process.env.PORT || 3000
app.listen(port, '0.0.0.0', (err) => {
	if (err) console.log(err)
	console.info(`\n==> 🌎 Listening on port ${port}. Open up https://assets.${process.env.COMPUTERNAME.toLowerCase()}.rabota.ua:${port} in your browser.\n`)
})