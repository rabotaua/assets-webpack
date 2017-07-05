const chokidar = require('chokidar')
const path = require('path')
const cp = require('child_process');

let initialScanIsComplete = false
const timeInterval = 5000
let lastRun = 0
let webpackProcess = null

const watcher = chokidar.watch('src', { ignored: /[\/\\]\./, persistent: true })

const dirChanged = () => {
	const timeDiff = Date.now() - lastRun >= timeInterval

	if(initialScanIsComplete && timeDiff) {
		lastRun = Date.now()
		if(webpackProcess) {
			webpackProcess.kill(2)
		}

		webpackProcess = cp.fork(path.join(__dirname, 'server.js'))
		webpackProcess.on('message', (l) => {
			console.log(l)
		})
	}
}

watcher
	.on('ready', () => {
		console.log('Scan is completed')
		initialScanIsComplete  = true
		dirChanged()
	})
	.on('add', dirChanged)
	.on('unlink', dirChanged)
	.on('addDir', dirChanged)
	.on('unlinkDir', dirChanged)
	.on('error', dirChanged)