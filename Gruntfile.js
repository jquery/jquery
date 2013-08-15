module.exports = function( grunt ) {

	"use strict";

	// Integrate build task
	require( "./build/build" )( grunt );

	var distpaths = [
			"dist/jquery.js",
			"dist/jquery.min.map",
			"dist/jquery.min.js"
		],
		gzip = require("gzip-js"),
		readOptionalJSON = function( filepath ) {
			var data = {};
			try {
				data = grunt.file.readJSON( filepath );
			} catch(e) {}
			return data;
		},
		fs = require( "fs" ),
		srcHintOptions = readOptionalJSON( "src/.jshintrc" );

	// The concatenated file won't pass onevar
	// But our modules can
	delete srcHintOptions.onevar;

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		dst: readOptionalJSON("dist/.destination.json"),
		compare_size: {
			files: [ "dist/jquery.js", "dist/jquery.min.js" ],
			options: {
				compress: {
					gz: function( contents ) {
						return gzip.zip( contents, {} ).length;
					}
				},
				cache: "dist/.sizecache.json"
			}
		},
		build: {
			all: {
				dest: "dist/jquery.js",
				minimum: [
					"core",
					"selector"
				],
				// Exclude specified modules if the module matching the key is removed
				removeWith: {
					callbacks: [ "deferred" ],
					css: [ "effects", "dimensions", "offset" ],
					sizzle: [ "css/hidden-visible-selectors", "effects/animated-selector" ]
				}
			}
		},
		jsonlint: {
			pkg: {
				src: [ "package.json" ]
			},
			bower: {
				src: [ "bower.json" ]
			}
		},
		jshint: {
			dist: {
				src: [ "dist/jquery.js" ],
				options: srcHintOptions
			},
			grunt: {
				src: [ "Gruntfile.js", "build/build.js" ],
				options: {
					jshintrc: ".jshintrc"
				}
			},
			tests: {
				src: [ "test/**/*.js" ],
				options: {
					jshintrc: "test/.jshintrc"
				}
			}
		},
		testswarm: {
			tests: "ajax attributes callbacks core css data deferred dimensions effects event manipulation offset queue selector serialize support traversing Sizzle".split(" ")
		},
		watch: {
			files: [ "<%= jshint.grunt.src %>", "<%= jshint.tests.src %>", "src/**/*.js" ],
			tasks: "dev"
		},
		"pre-uglify": {
			all: {
				files: {
					"dist/jquery.pre-min.js": [ "dist/jquery.js" ]
				},
				options: {
					banner: "\n\n\n\n\n\n\n\n\n\n" + // banner line size must be preserved
						"/*! jQuery v<%= pkg.version %> | " +
						"(c) 2005, 2013 jQuery Foundation, Inc. | " +
						"jquery.org/license\n" +
						"//@ sourceMappingURL=jquery.min.map\n" +
						"*/\n"
				}
			}
		},
		uglify: {
			all: {
				files: {
					"dist/jquery.min.js": [ "dist/jquery.pre-min.js" ]
				},
				options: {
					// Keep our hard-coded banner
					preserveComments: "some",
					sourceMap: "dist/jquery.min.map",
					sourceMappingURL: "jquery.min.map",
					report: "min",
					beautify: {
						ascii_only: true
					},
					compress: {
						hoist_funs: false,
						join_vars: false,
						loops: false,
						unused: false
					}
				}
			}
		},
		"post-uglify": {
			all: {
				files: {
					"dist/jquery.min.map.tmp": [ "dist/jquery.min.map" ],
					"dist/jquery.min.js.tmp": [ "dist/jquery.min.js" ]
				},
				options: {
					tempFiles: [ "dist/jquery.min.map.tmp", "dist/jquery.min.js.tmp", "dist/jquery.pre-min.js" ]
				}
			}
		}
	});

	grunt.registerTask( "testswarm", function( commit, configFile ) {
		var jobName,
			testswarm = require( "testswarm" ),
			runs = {},
			done = this.async(),
			pull = /PR-(\d+)/.exec( commit ),
			config = grunt.file.readJSON( configFile ).jquery,
			tests = grunt.config([ this.name, "tests" ]);

		if ( pull ) {
			jobName = "jQuery pull <a href='https://github.com/jquery/jquery/pull/" +
				pull[ 1 ] + "'>#" + pull[ 1 ] + "</a>";
		} else {
			jobName = "jQuery commit #<a href='https://github.com/jquery/jquery/commit/" +
				commit + "'>" + commit.substr( 0, 10 ) + "</a>";
		}

		tests.forEach(function( test ) {
			runs[test] = config.testUrl + commit + "/test/index.html?module=" + test;
		});

		// TODO: create separate job for git/git2 so we can do different browsersets
		testswarm.createClient( {
			url: config.swarmUrl,
			pollInterval: 10000,
			timeout: 1000 * 60 * 30
		} )
		.addReporter( testswarm.reporters.cli )
		.auth( {
			id: config.authUsername,
			token: config.authToken
		})
		.addjob(
			{
				name: jobName,
				runs: runs,
				runMax: config.runMax,
				browserSets: "popular-no-old-ie"
			}, function( err, passed ) {
				if ( err ) {
					grunt.log.error( err );
				}
				done( passed );
			}
		);
	});

	// Process files for distribution
	grunt.registerTask( "dist", function() {
		var stored, flags, paths, nonascii;

		// Check for stored destination paths
		// ( set in dist/.destination.json )
		stored = Object.keys( grunt.config( "dst" ) );

		// Allow command line input as well
		flags = Object.keys( this.flags );

		// Combine all output target paths
		paths = [].concat( stored, flags ).filter(function( path ) {
			return path !== "*";
		});

		// Ensure the dist files are pure ASCII
		nonascii = false;

		distpaths.forEach(function( filename ) {
			var i, c,
				text = fs.readFileSync( filename, "utf8" );

			// Ensure files use only \n for line endings, not \r\n
			if ( /\x0d\x0a/.test( text ) ) {
				grunt.log.writeln( filename + ": Incorrect line endings (\\r\\n)" );
				nonascii = true;
			}

			// Ensure only ASCII chars so script tags don't need a charset attribute
			if ( text.length !== Buffer.byteLength( text, "utf8" ) ) {
				grunt.log.writeln( filename + ": Non-ASCII characters detected:" );
				for ( i = 0; i < text.length; i++ ) {
					c = text.charCodeAt( i );
					if ( c > 127 ) {
						grunt.log.writeln( "- position " + i + ": " + c );
						grunt.log.writeln( "-- " + text.substring( i - 20, i + 20 ) );
						break;
					}
				}
				nonascii = true;
			}

			// Modify map/min so that it points to files in the same folder;
			// see https://github.com/mishoo/UglifyJS2/issues/47
			if ( /\.map$/.test( filename ) ) {
				text = text.replace( /"dist\//g, "\"" );
				fs.writeFileSync( filename, text, "utf-8" );

			// Use our hard-coded sourceMap directive instead of the autogenerated one (#13274; #13776)
			} else if ( /\.min\.js$/.test( filename ) ) {
				i = 0;
				text = text.replace( /(?:\/\*|)\n?\/\/@\s*sourceMappingURL=.*(\n\*\/|)/g,
					function( match ) {
						if ( i++ ) {
							return "";
						}
						return match;
					});
				fs.writeFileSync( filename, text, "utf-8" );
			}

			// Optionally copy dist files to other locations
			paths.forEach(function( path ) {
				var created;

				if ( !/\/$/.test( path ) ) {
					path += "/";
				}

				created = path + filename.replace( "dist/", "" );
				grunt.file.write( created, text );
				grunt.log.writeln( "File '" + created + "' created." );
			});
		});

		return !nonascii;
	});

	// Work around grunt-contrib-uglify sourceMap issues (jQuery #13776)
	grunt.registerMultiTask( "pre-uglify", function() {
		var banner = this.options().banner;

		this.files.forEach(function( mapping ) {
			// Join src
			var input = mapping.src.map(function( file ) {
				var contents = grunt.file.read( file );

				// Strip banners
				return contents
					// Remove the main jQuery banner, it'll be replaced by the new banner anyway.
					.replace( /^\/\*![\W\w]*?\*\/\n?/g, "" )
					// Strip other banners preserving line count.
					.replace( /^\/\*!(?:.|\n)*?\*\/\n?/gm, function ( match ) {
						return match.replace( /[^\n]/gm, "" );
					});
			}).join("\n");

			// Write temp file (with optional banner)
			grunt.file.write( mapping.dest, ( banner || "" ) + input );
		});
	});

	// Change the map file to point back to jquery.js instead of jquery.pre-min.js.
	// The problem is caused by the pre-uglify task.
	// Also, remove temporary files.
	grunt.registerMultiTask( "post-uglify", function() {
		this.files.forEach(function( mapping ) {
			var mapFileName = mapping.src[ 0 ];

			// Rename the file to a temporary name.
			fs.renameSync( mapFileName, mapping.dest);
			grunt.file.write( mapFileName, grunt.file.read( mapping.dest )
				// The uglify task erroneously prepends dist/ to file names.
				.replace( /"dist\//g, "\"" )
				// Refer to the source jquery.js, not the temporary jquery.pre-min.js.
				.replace( /\.pre-min\./g, "." )
				// There's already a pragma at the beginning of the file, remove the one at the end.
				.replace( /\/\/@ sourceMappingURL=jquery\.min\.map$/g, "" ));
		});

		// Remove temporary files.
		this.options().tempFiles.forEach(function( fileName ) {
			fs.unlink( fileName );
		});
	});

	// Load grunt tasks from NPM packages
	grunt.loadNpmTasks("grunt-compare-size");
	grunt.loadNpmTasks("grunt-git-authors");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-jsonlint");

	// Short list as a high frequency watch task
	grunt.registerTask( "dev", [ "build:*:*", "jshint" ] );

	// Default grunt
	grunt.registerTask( "default", [ "jsonlint", "dev", "pre-uglify", "uglify", "post-uglify", "dist:*", "compare_size" ] );
};
