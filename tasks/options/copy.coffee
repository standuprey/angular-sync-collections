appName = require('../../package.json').name

module.exports =
	demo:
		files: [
			dest: "demo/app/client/scripts/#{appName}.js"
			src: "#{appName}.js"
		]
