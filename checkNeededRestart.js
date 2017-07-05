const getFiles = require('./getFilesHelper')
const chokidar = require('chokidar')
const shallowequal = require('shallowequal')

module.exports = (compiler, timeInterval = 1000) => {
	if(!compiler) return

	const checkFiles = () => {
		const oldFilesList = compiler.options.entry
		const newFilesList = getFiles()

		if (!shallowequal(oldFilesList, newFilesList)) {
			process.exit(1)
		}
	}


	const watcher = chokidar.watch('./webpack.config.js', {trailing: false, persistent: true})
	watcher.on('change', () => {
		process.exit(1)
	})


	setInterval(checkFiles, timeInterval)
}