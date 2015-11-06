module.exports =
  html: "app/client/index.handlebars"
  options:
    dest: "dist"
    flow:
      html:
        steps:
          js: ["concat"]
          css: ["cssmin"]

        post: {}