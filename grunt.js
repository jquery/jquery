/*global config:true, task:true*/
config.init({
  pkg: "<json:package.json>",
  meta: {
    banner: "/*! jQuery v@<%= pkg.version %> jquery.com | jquery.org/license */"
  },
  build: {
    "dist/jquery.js": [
      "src/intro.js",
      "src/core.js",
      "src/callbacks.js",
      "src/deferred.js",
      "src/support.js",
      "src/data.js",
      "src/queue.js",
      "src/attributes.js",
      "src/event.js",
      "src/selector.js",
      "src/traversing.js",
      "src/manipulation.js",
      "src/css.js",
      "src/ajax.js",
      "src/ajax/jsonp.js",
      "src/ajax/script.js",
      "src/ajax/xhr.js",
      "src/effects.js",
      "src/offset.js",
      "src/dimensions.js",
      "src/exports.js",
      "src/outro.js"
    ]
  },
  min: {
    "dist/jquery.min.js": [ "<banner>", "dist/jquery.js" ]
  },
  lint: {
    files: [ "grunt.js", "dist/jquery.js" ]
  },
  watch: {
    files: "<config:lint.files>",
    tasks: "concat lint"
  },
  jshint: {
    options: {
      evil: true,
      browser: true,
      wsh: true,
      eqnull: true,
      expr: true,
      curly: true,
      trailing: true,
      undef: true,
      smarttabs: true,
      predef: [
        "define",
        "DOMParser"
      ],
      maxerr: 100
    },
    globals: {
      jQuery: true,
      global: true,
      exports: true,
      require: true,
      file: true,
      log: true,
      console: true
    }
  },
  uglify: {}
});

// Default task.
task.registerTask("default", "build lint min");

// Special concat/build task to handle various jQuery build requirements
task.registerBasicTask("build", "Concatenate source, embed date/version", function(data, name) {
  // Concat specified files.
  var files = file.expand(data),
      compiled = "";

  file.expand(data).forEach(function(filepath) {
    compiled += file.read(filepath).replace(/.function..jQuery...\{/g, "").replace(/\}...jQuery..;/g, "");
  });

  // Embed Date
  // Embed Version
  compiled = compiled.replace("@DATE", new Date())
                .replace("@VERSION", pkg.version);

  // Write concatenated source to file
  file.write(name, compiled);

  // Fail task if errors were logged.
  if (task.hadErrors()) { return false; }

  // Otherwise, print a success message.
  log.writeln("File '" + name + "' created.");
});


