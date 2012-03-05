/*global config:true, task:true*/
config.init({
  pkg: "<json:package.json>",
  meta: {
    banner: "/*! jQuery v@<%= pkg.version %> jquery.com | jquery.org/license */"
  },
  compare_size: {
    files: [
      "dist/jquery.js",
      "dist/jquery.min.js"
    ]
  },
  selector: {
    "src/selector.js": [
      "src/sizzle-jquery.js",
      "src/sizzle/sizzle.js"
    ]
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
        "DOMParser",
        "__dirname"
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
task.registerTask("default", "selector build lint min compare_size");


// Compare size to master
task.registerBasicTask("compare_size", "Compare size of this branch to master", function(data) {
  var files = file.expand(data),
      done = this.async(),
      sizecache = __dirname + "/build/.sizecache.json",
      sources = {
        min: file.read(files[1]),
        max: file.read(files[0])
      },
      oldsizes = {},
      sizes = {};

  try {
    oldsizes = JSON.parse(file.read(sizecache));
  } catch(e) {
    oldsizes = {};
  }

  // Obtain the current branch and continue...
  task.helper("git_current_branch", function(err, branch) {
    var key, diff;

    // Derived and adapted from Corey Frang's original `sizer`
    log.writeln( "jQuery Size - compared to master" );

    sizes["jquery.js"] = sources.max.length;
    sizes["jquery.min.js"] = sources.min.length;
    sizes["jquery.min.js.gz"] = task.helper("gzip", sources.min).length;

    for ( key in sizes ) {
      diff = oldsizes[ key ] && ( sizes[ key ] - oldsizes[ key ] );
      if ( diff > 0 ) {
        diff = "+" + diff;
      }
      console.log( "%s %s %s",
        task.helper("lpad",  sizes[ key ], 8 ),
        task.helper("lpad",  diff ? "(" + diff + ")" : "(-)", 8 ),
        key
      );
    }

    if ( branch === "master" ) {
      // If master, write to file - this makes it easier to compare
      // the size of your current code state to the master branch,
      // without returning to the master to reset the cache
      file.write( sizecache, JSON.stringify(sizes) );

      // TODO: Multi key:val entries in the sizecache, using branch name as key?
    }
    done();
  });

  // Fail task if errors were logged.
  if (task.hadErrors()) { return false; }

  // Otherwise, print a success message.
  // log.writeln("File '" + name + "' created.");
});

task.registerHelper("git_current_branch", function(done) {
  task.helper("child_process", {
    cmd: "git",
    args: ["branch", "--no-color"]
  }, function(err, result) {
    var branch;

    result.split("\n").forEach(function(branch) {
      var matches = /^\* (.*)/.exec( branch );
      if ( matches != null && matches.length && matches[ 1 ] ) {
        done( null, matches[ 1 ] );
      }
    });
  });
});

task.registerHelper("lpad", function(str, len, chr) {
  return ( Array( len + 1 ).join( chr || " " ) + str ).substr( -len );
});

// Build src/selector.js
task.registerBasicTask("selector", "Build src/selector.js", function(data, name) {
  var files = file.expand(data),
      sizzle = {
        api: file.read(files[ 0 ]),
        src: file.read(files[ 1 ])
      },
      compiled;

  // sizzle-jquery.js -> sizzle after "EXPOSE", replace window.Sizzle
  compiled = sizzle.src.replace("window.Sizzle = Sizzle;", sizzle.api);
  verbose.write("Injected sizzle-jquery.js into sizzle.js");

  // Write concatenated source to file
  file.write(name, compiled);


  // Fail task if errors were logged.
  if (task.hadErrors()) { return false; }

  // Otherwise, print a success message.
  log.writeln("File '" + name + "' created.");
});


// Special concat/build task to handle various jQuery build requirements
task.registerBasicTask("build", "Concatenate source, embed date/version", function(data, name) {
  // Concat specified files.
  var compiled = "";

  file.expand(data).forEach(function(filepath) {
    compiled += file.read(filepath).replace(/.function..jQuery...\{/g, "").replace(/\}...jQuery..;/g, "");
  });

  // Embed Date
  // Embed Version
  compiled = compiled.replace("@DATE", new Date())
                .replace("@VERSION", config("pkg.version"));

  // Write concatenated source to file
  file.write(name, compiled);

  // Fail task if errors were logged.
  if (task.hadErrors()) { return false; }

  // Otherwise, print a success message.
  log.writeln("File '" + name + "' created.");
});


