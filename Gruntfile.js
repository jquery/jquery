module.exports = function( grunt ) {
	"use strict";

	function readOptionalJSON( filepath ) {
		var data = {};
		try {
			data = grunt.file.readJSON( filepath );
		} catch ( e ) {}
		return data;
	}

	var gzip = require( "gzip-js" ),
		srcHintOptions = readOptionalJSON( "src/.jshintrc" );

	// The concatenated file won't pass onevar
	// But our modules can
	delete srcHintOptions.onevar;

	grunt.initConfig({
		pkg: grunt.file.readJSON( "package.json" ),
		dst: readOptionalJSON( "dist/.destination.json" ),
		"compare_size": {
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
				removeWith: {
					ajax: [ "manipulation/_evalUrl", "event/ajax" ],
					callbacks: [ "deferred" ],
					css: [ "effects", "dimensions", "offset" ]
				}
			}
		},
		npmcopy: {
			all: {
				options: {
					destPrefix: "external"
				},
				files: {
					"sizzle/dist": "sizzle/dist",
					"sizzle/LICENSE.txt": "sizzle/LICENSE.txt",

					"npo/npo.js": "native-promise-only/npo.js",

					"qunit/qunit.js": "qunitjs/qunit/qunit.js",
					"qunit/qunit.css": "qunitjs/qunit/qunit.css",
					"qunit/LICENSE.txt": "qunitjs/LICENSE.txt",

					"requirejs/require.js": "requirejs/require.js",

					"sinon/fake_timers.js": "sinon/lib/sinon/util/fake_timers.js",
					"sinon/timers_ie.js": "sinon/lib/sinon/util/timers_ie.js",
					"sinon/LICENSE.txt": "sinon/LICENSE"
				}
			}
		},
		jsonlint: {
			pkg: {
				src: [ "package.json" ]
			}
		},
		jshint: {
			all: {
				src: [
					"src/**/*.js", "Gruntfile.js", "test/**/*.js", "build/**/*.js"
				],
				options: {
					jshintrc: true
				}
			},
			dist: {
				src: "dist/jquery.js",
				options: srcHintOptions
			}
		},
		jscs: {
			src: "src/**/*.js",
			gruntfile: "Gruntfile.js",

			// Check parts of tests that pass
			test: [ "test/data/testrunner.js", "test/unit/animation.js", "test/unit/tween.js" ],
			release: [ "build/*.js", "!build/release-notes.js" ],
			tasks: "build/tasks/*.js"
		},
		testswarm: {
			tests: [
				"ajax",
				"animation",
				"attributes",
				"callbacks",
				"core",
				"css",
				"data",
				"deferred",
				"dimensions",
				"effects",
				"event",
				"manipulation",
				"offset",
				"queue",
				"selector",
				"serialize",
				"support",
				"traversing",
				"tween"
			]
		},
		watch: {
			files: [ "<%= jshint.all.src %>" ],
			tasks: [ "dev" ]
		},
		uglify: {
			all: {
				files: {
					"dist/jquery.min.js": [ "dist/jquery.js" ]
				},
				options: {
					preserveComments: false,
					sourceMap: true,
					sourceMapName: "dist/jquery.min.map",
					report: "min",
					beautify: {
						"ascii_only": true
					},
					banner: "/*! jQuery Compat v<%= pkg.version %> | " +
						"(c) jQuery Foundation | jquery.org/license */",
					compress: {
						"hoist_funs": false,
						loops: false,
						unused: false
					}
				}
			}
		}
	});

	// Load grunt tasks from NPM packages
	require( "load-grunt-tasks" )( grunt );

	// Integrate jQuery specific tasks
	grunt.loadTasks( "build/tasks" );

	grunt.registerTask( "lint", [ "jsonlint", "jshint", "jscs" ] );

	// Only defined for master at this time, but kept for cross-branch consistency
	grunt.registerTask( "test_fast", [] );

	// gh-2133 TODO: cherry-pick 76df9e4e389d80bff410a9e5f08b848de1d21a2f for promises-aplus-tests
	grunt.registerTask( "test", [ "test_fast"/*, "promises-aplus-tests"*/ ] );

	// Short list as a high frequency watch task
	grunt.registerTask( "dev", [ "build:*:*", "lint", "uglify", "remove_map_comment", "dist:*" ] );

	grunt.registerTask( "default", [ "dev", "test_fast", "compare_size" ] );
};
