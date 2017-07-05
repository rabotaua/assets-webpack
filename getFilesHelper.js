const glob = require('glob')

module.exports = () => {
	const entryDir = './src/'
	let filesListObject = {}

	const formatFilePath = (path) => path.replace(entryDir, '').replace('.js', '')

	const files = glob.sync(`${entryDir}**/*.js`)

	files.map(f => {
		filesListObject = Object.assign(filesListObject, {
			[formatFilePath(f)]: f
		})
	})

	return filesListObject
}