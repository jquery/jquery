module.exports = function( grunt ) {

	"use strict";

	var gzip = require( "gzip-js" ),
		readOptionalJSON = function( filepath ) {
			var data = {};
			try {
				data = grunt.file.readJSON( filepath );
			} catch(e) {}
			return data;
		},
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
				cache: "build/.sizecache.json"
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
					ajax: [ "manipulation/_evalUrl" ],
					callbacks: [ "deferred" ],
					css: [ "effects", "dimensions", "offset" ],
					sizzle: [ "css/hiddenVisibleSelectors", "effects/animatedSelector" ]
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
			src: {
				src: [ "src/**/*.js" ],
				options: {
					jshintrc: "src/.jshintrc"
				}
			},
			dist: {
				src: [ "dist/jquery.js" ],
				options: srcHintOptions
			},
			grunt: {
				src: [ "Gruntfile.js", "build/tasks/*", "build/{bower-install,release-notes,release}.js" ],
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
					banner: "\n\n\n\n\n\n\n\n\n\n\n\n" + // banner line size must be preserved
						"/*! jQuery v<%= pkg.version %> | " +
						"(c) 2005, 2013 jQuery Foundation, Inc. | " +
						"jquery.org/license */\n"
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
						loops: false,
						unused: false
					}
				}
			}
		},
		"post-uglify": {
			all: {
				src: [ "dist/jquery.min.map" ],
				options: {
					tempFiles: [ "dist/jquery.pre-min.js" ]
				}
			}
		}
	});

	// Load grunt tasks from NPM packages
	grunt.loadNpmTasks( "grunt-compare-size" );
	grunt.loadNpmTasks( "grunt-git-authors" );
	grunt.loadNpmTasks( "grunt-contrib-watch" );
	grunt.loadNpmTasks( "grunt-contrib-jshint" );
	grunt.loadNpmTasks( "grunt-contrib-uglify" );
	grunt.loadNpmTasks( "grunt-jsonlint" );

	// Integrate jQuery specific tasks
	grunt.loadTasks( "build/tasks" );

	// Short list as a high frequency watch task
	grunt.registerTask( "dev", [ "build:*:*", "jshint" ] );

	// Default grunt
	grunt.registerTask( "default", [ "jsonlint", "dev", "pre-uglify", "uglify", "post-uglify", "dist:*", "compare_size" ] );
};
