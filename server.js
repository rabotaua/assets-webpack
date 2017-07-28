const path = require('path')
const fs = require('fs')
const express = require('express')
const webpack = require('webpack')
const sass = require('node-sass-middleware')
const postcss = require('postcss-middleware')
const autoprefixer = require('autoprefixer')
const webpackMiddleware = require('webpack-dev-middleware')
const config = require('./webpack.config.dev.js')
// const webpackHotMiddleware = require('webpack-hot-middleware')

const destPath = path.join(__dirname, '/dist')
const options = { lazy: true, noInfo: false, quiet: false }

const app = express()
let compiler = webpack(config)
let middleware = webpackMiddleware(compiler, options)


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

app.use('/', (req, res, next) => {
	const entry = req.path.substring(1).replace('.js', '')
	const target = `./src${req.path}`
	const exists = Object.keys(config.entry).indexOf(entry) !== -1
	if(!exists && fs.existsSync(target)) {
		config.entry[entry] = target
		compiler = webpack(config)
		middleware = webpackMiddleware(compiler, options)
	}
	middleware(req, res, next)
})

const port = process.env.PORT || 3000

app.listen(port, '0.0.0.0', (err) => {
	if (err) console.log(err)
	console.info(`\n==> 🌎 Listening on port ${port}. Open up https://assets.${process.env.COMPUTERNAME.toLowerCase()}.rabota.ua:${port} in your browser.\n`)
})
