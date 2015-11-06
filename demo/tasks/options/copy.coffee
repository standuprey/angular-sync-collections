module.exports =
	dist:
		files: [
			{
				expand: true
				dot: true
				cwd: "app"
				dest: "dist"
				src: [
					"client/*.{ico,png,txt}"
					"client/*.html"
					"client/views/{,*/}*.html"
					"client/styles/*.css"
					"client/images/*.*"
					"server/**/*.coffee"
				]
			}
		]
