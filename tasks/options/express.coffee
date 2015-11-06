module.exports =
	express:
		dev:
			options:
				script: 'server/app.js'
		prod:
			options:
				script: 'dist/server/app.js'
