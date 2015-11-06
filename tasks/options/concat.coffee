appName = require('../../package.json').name

module.exports =
  options:
    separator: ";"

  dist:
    src: [
      ".tmp/scripts/**/*.js"
    ]
    dest: "#{appName}.js"