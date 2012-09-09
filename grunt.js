/**
 * Resources
 *
 * https://gist.github.com/2489540
 *
 */

/*jshint node: true */
/*global config:true, task:true, process:true*/
module.exports = function( grunt ) {

	// readOptionalJSON
	// by Ben Alman
	// https://gist.github.com/2876125
	function readOptionalJSON( filepath ) {
		var data = {};
		try {
			data = grunt.file.readJSON( filepath );
			grunt.verbose.write( "Reading " + filepath + "..." ).ok();
		} catch(e) {}
		return data;
	}

	var task = grunt.task;
	var file = grunt.file;
	var utils = grunt.utils;
	var log = grunt.log;
	var verbose = grunt.verbose;
	var fail = grunt.fail;
	var option = grunt.option;
	var config = grunt.config;
	var template = grunt.template;
	var distpaths = [
		"dist/jquery.js",
		"dist/jquery.min.js"
	];

	grunt.initConfig({
		pkg: "<json:package.json>",
		dst: readOptionalJSON("dist/.destination.json"),
		meta: {
			banner: "/*! jQuery v<%= pkg.version %> jquery.com | jquery.org/license */"
		},
		compare_size: {
			files: distpaths
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

				{ flag: "deprecated", src: "src/deprecated.js" },
				{ flag: "css", src: "src/css.js" },
				"src/serialize.js",
				{ flag: "ajax", src: "src/ajax.js" },
				{ flag: "ajax/jsonp", src: "src/ajax/jsonp.js", needs: [ "ajax", "ajax/script" ]  },
				{ flag: "ajax/script", src: "src/ajax/script.js", needs: ["ajax"]  },
				{ flag: "ajax/xhr", src: "src/ajax/xhr.js", needs: ["ajax"]  },
				{ flag: "effects", src: "src/effects.js", needs: ["css"] },
				{ flag: "offset", src: "src/offset.js", needs: ["css"] },
				{ flag: "dimensions", src: "src/dimensions.js", needs: ["css"] },

				"src/exports.js",
				"src/outro.js"
			]
		},
		min: {
			"dist/jquery.min.js": [ "<banner>", "dist/jquery.js" ]
		},

		lint: {
			dist: "dist/jquery.js",
			grunt: "grunt.js",
			tests: "test/unit/**/*.js"
		},

		jshint: (function() {
			function jshintrc( path ) {
				return readOptionalJSON( (path || "") + ".jshintrc" ) || {};
			}

			return {
				options: jshintrc(),
				dist: jshintrc( "src/" ),
				tests: jshintrc( "test/" )
			};
		})(),

		qunit: {
			files: "test/index.html"
		},
		watch: {
			files: [
				"<config:lint.grunt>", "<config:lint.tests>",
				"src/**/*.js"
			],
			tasks: "dev"
		},
		uglify: {}
	});

	// Default grunt.
	grunt.registerTask( "default", "submodules selector build:*:* lint min dist:* compare_size" );

	// Short list as a high frequency watch task
	grunt.registerTask( "dev", "selector build:*:* lint" );

	// Load grunt tasks from NPM packages
	grunt.loadNpmTasks( "grunt-compare-size" );
	grunt.loadNpmTasks( "grunt-git-authors" );

	grunt.registerTask( "testswarm", function( commit, configFile ) {
		var testswarm = require( "testswarm" ),
			testUrls = [],
			config = grunt.file.readJSON( configFile ).jquery,
			tests = "ajax attributes callbacks core css data deferred dimensions effects event manipulation offset queue serialize support traversing Sizzle".split(" ");

		tests.forEach(function( test ) {
			testUrls.push( config.testUrl + commit + "/test/index.html?module=" + test );
		});

		testswarm({
			url: config.swarmUrl,
			pollInterval: 10000,
			timeout: 1000 * 60 * 30,
			done: this.async()
		}, {
			authUsername: config.authUsername,
			authToken: config.authToken,
			jobName: 'jQuery commit #<a href="https://github.com/jquery/jquery/commit/' + commit + '">' + commit.substr( 0, 10 ) + '</a>',
			runMax: config.runMax,
			"runNames[]": tests,
			"runUrls[]": testUrls,
			"browserSets[]": ["popular"]
		});
	});

	// Build src/selector.js
	grunt.registerMultiTask( "selector", "Build src/selector.js", function() {

		var name = this.file.dest,
				files = this.file.src,
				sizzle = {
					api: file.read( files[0] ),
					src: file.read( files[1] )
				},
				compiled, parts;

		/**

			sizzle-jquery.js -> sizzle between "EXPOSE" blocks,
			replace define & window.Sizzle assignment


			// EXPOSE
			if ( typeof define === "function" && define.amd ) {
				define(function() { return Sizzle; });
			} else {
				window.Sizzle = Sizzle;
			}
			// EXPOSE

			Becomes...

			Sizzle.attr = jQuery.attr;
			jQuery.find = Sizzle;
			jQuery.expr = Sizzle.selectors;
			jQuery.expr[":"] = jQuery.expr.pseudos;
			jQuery.unique = Sizzle.uniqueSort;
			jQuery.text = Sizzle.getText;
			jQuery.isXMLDoc = Sizzle.isXML;
			jQuery.contains = Sizzle.contains;

		 */

		// Break into 3 pieces
		parts = sizzle.src.split("// EXPOSE");
		// Replace the if/else block with api
		parts[1] = sizzle.api;
		// Rejoin the pieces
		compiled = parts.join("");


		verbose.write("Injected sizzle-jquery.js into sizzle.js");

		// Write concatenated source to file
		file.write( name, compiled );

		// Fail task if errors were logged.
		if ( this.errorCount ) {
			return false;
		}

		// Otherwise, print a success message.
		log.writeln( "File '" + name + "' created." );
	});


	// Special "alias" task to make custom build creation less grawlix-y
	grunt.registerTask( "custom", function() {
		var done = this.async(),
				args = [].slice.call(arguments),
				modules = args.length ? args[0].replace(/,/g, ":") : "";


		// Translation example
		//
		//   grunt custom:+ajax,-dimensions,-effects,-offset
		//
		// Becomes:
		//
		//   grunt build:*:*:+ajax:-dimensions:-effects:-offset

		grunt.log.writeln( "Creating custom build...\n" );

		grunt.utils.spawn({
			cmd: "grunt",
			args: [ "build:*:*:" + modules, "min" ]
		}, function( err, result ) {
			if ( err ) {
				grunt.verbose.error();
				done( err );
				return;
			}

			grunt.log.writeln( result.replace("Done, without errors.", "") );

			done();
		});
	});

	// Special concat/build task to handle various jQuery build requirements
	//
	grunt.registerMultiTask(
		"build",
		"Concatenate source (include/exclude modules with +/- flags), embed date/version",
		function() {
			// Concat specified files.
			var i,
				compiled = "",
				modules = this.flags,
				explicit = Object.keys(modules).length > 1,
				optIn = !modules["*"],
				name = this.file.dest,
				excluded = {},
				version = config( "pkg.version" ),
				excluder = function( flag, needsFlag ) {
					// explicit > implicit, so set this first and let it be overridden by explicit
					if ( optIn && !modules[ flag ] && !modules[ "+" + flag ] ) {
						excluded[ flag ] = false;
					}

					if ( excluded[ needsFlag ] || modules[ "-" + flag ] ) {
						// explicit exclusion from flag or dependency
						excluded[ flag ] = true;
					} else if ( modules[ "+" + flag ] && ( excluded[ needsFlag ] === false ) ) {
						// explicit inclusion from flag or dependency overriding a weak inclusion
						delete excluded[ needsFlag ];
					}
				};

			// append commit id to version
			if ( process.env.COMMIT ) {
				version += " " + process.env.COMMIT;
			}

			// figure out which files to exclude based on these rules in this order:
			//  explicit > implicit (explicit also means a dependency/dependent that was explicit)
			//  exclude > include
			// examples:
			//  *:                 none (implicit exclude)
			//  *:*                all (implicit include)
			//  *:*:-effects       all except effects (explicit > implicit)
			//  *:*:-css           all except css and its deps (explicit)
			//  *:*:-css:+effects  all except css and its deps (explicit exclude from dep. trumps explicit include)
			//  *:+effects         none except effects and its deps (explicit include from dep. trumps implicit exclude)
			this.file.src.forEach(function( filepath ) {
				var flag = filepath.flag;

				if ( flag ) {

					excluder(flag);

					// check for dependencies
					if ( filepath.needs ) {
						filepath.needs.forEach(function( needsFlag ) {
							excluder( flag, needsFlag );
						});
					}
				}
			});

			// append excluded modules to version
			if ( Object.keys( excluded ).length ) {
				version += " -" + Object.keys( excluded ).join( ",-" );
				// set pkg.version to version with excludes, so minified file picks it up
				grunt.config.set( "pkg.version", version );
			}


			// conditionally concatenate source
			this.file.src.forEach(function( filepath ) {
				var flag = filepath.flag,
						specified = false,
						omit = false,
						message = "";

				if ( flag ) {
					if ( excluded[ flag ] !== undefined ) {
						message = ( "Excluding " + flag ).red;
						specified = true;
						omit = true;
					} else {
						message = ( "Including " + flag ).green;

						// If this module was actually specified by the
						// builder, then st the flag to include it in the
						// output list
						if ( modules[ "+" + flag ] ) {
							specified = true;
						}
					}

					// Only display the inclusion/exclusion list when handling
					// an explicit list.
					//
					// Additionally, only display modules that have been specified
					// by the user
					if ( explicit && specified ) {
						grunt.log.writetableln([ 27, 30 ], [
							message,
							( "(" + filepath.src + ")").grey
						]);
					}

					filepath = filepath.src;
				}

				if ( !omit ) {
					compiled += file.read( filepath );
				}
			});

			// Embed Date
			// Embed Version
			compiled = compiled.replace( "@DATE", new Date() )
				.replace( /@VERSION/g, version );

			// Write concatenated source to file
			file.write( name, compiled );

			// Fail task if errors were logged.
			if ( this.errorCount ) {
				return false;
			}

			// Otherwise, print a success message.
			log.writeln( "File '" + name + "' created." );
		});

	grunt.registerTask( "submodules", function() {
		var done = this.async();

		grunt.verbose.write( "Updating submodules..." );

		// TODO: migrate remaining `make` to grunt tasks
		//
		grunt.utils.spawn({
			cmd: "make"
		}, function( err, result ) {
			if ( err ) {
				grunt.verbose.error();
				done( err );
				return;
			}

			grunt.log.writeln( result );

			done();
		});
	});

	// Allow custom dist file locations
	grunt.registerTask( "dist", function() {
		var flags, paths, stored;

		// Check for stored destination paths
		// ( set in dist/.destination.json )
		stored = Object.keys( config("dst") );

		// Allow command line input as well
		flags = Object.keys( this.flags );

		// Combine all output target paths
		paths = [].concat( stored, flags ).filter(function( path ) {
			return path !== "*";
		});


		// Proceed only if there are actual
		// paths to write to
		if ( paths.length ) {

			// 'distpaths' is declared at the top of the
			// module.exports function scope. It is an array
			// of default files that jQuery creates
			distpaths.forEach(function( filename ) {
				paths.forEach(function( path ) {
					var created;

					if ( !/\/$/.test( path ) ) {
						path += "/";
					}

					created = path + filename.replace( "dist/", "" );

					if ( !/^\//.test( path ) ) {
						log.error( "File '" + created + "' was NOT created." );
						return;
					}

					file.write( created, file.read(filename) );

					log.writeln( "File '" + created + "' created." );
				});
			});
		}
	});
};
