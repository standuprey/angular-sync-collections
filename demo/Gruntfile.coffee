"use strict"
module.exports = (grunt) ->
	
	# Load grunt tasks automatically
	require("load-grunt-tasks") grunt
	
	# Define the configuration for all the tasks
	grunt.initConfig
		clean: require "./tasks/options/clean"
		coffee: require "./tasks/options/coffee"
		copy: require "./tasks/options/copy"
		watch: require "./tasks/options/watch"
		useminPrepare: require "./tasks/options/useminPrepare"
		usemin: require "./tasks/options/usemin"
		nodemon: require "./tasks/options/nodemon"
		wiredep: require "./tasks/options/wiredep"

	grunt.registerTask "serve", [
		"clean"
		"coffee"
		"wiredep"
		"nodemon:dev"
		"watch"
	]

	grunt.registerTask "build", [
		"clean"
		"useminPrepare"
		"coffee"
		"concat"
		"wiredep"
		"copy"
		"usemin"
	]

	grunt.registerTask "default", ["build"]
	return