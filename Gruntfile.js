module.exports = function( grunt ) {
	"use strict";

	function readOptionalJSON( filepath ) {
		var data = {};
		try {
			data = JSON.parse( stripJSONComments(
				fs.readFileSync( filepath, { encoding: "utf8" } )
			) );
		} catch ( e ) {}
		return data;
	}

	var fs = require( "fs" ),
		stripJSONComments = require( "strip-json-comments" ),
		gzip = require( "gzip-js" ),
		srcHintOptions = readOptionalJSON( "src/.jshintrc" ),
		newNode = !/^v0/.test( process.version ),

		// Allow to skip jsdom-related tests in Node.js < 1.0.0
		runJsdomTests = newNode || ( function() {
			try {
				require( "jsdom" );
				return true;
			} catch ( e ) {
				return false;
			}
		} )();

	// The concatenated file won't pass onevar
	// But our modules can
	delete srcHintOptions.onevar;

	grunt.initConfig( {
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
		babel: {
			options: {
				sourceMap: "inline",
				retainLines: true
			},
			nodeSmokeTests: {
				files: {
					"test/node_smoke_tests/lib/ensure_iterability.js":
						"test/node_smoke_tests/lib/ensure_iterability_es6.js"
				}
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
					ajax: [ "manipulation/_evalUrl", "event/ajax" ],
					callbacks: [ "deferred" ],
					css: [ "effects", "dimensions", "offset" ],
					sizzle: [ "css/hiddenVisibleSelectors", "effects/animatedSelector" ]
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

					"qunit-assert-step/qunit-assert-step.js":
					"qunit-assert-step/qunit-assert-step.js",
					"qunit-assert-step/MIT-LICENSE.txt":
					"qunit-assert-step/MIT-LICENSE.txt",

					"requirejs/require.js": "requirejs/require.js",

					"sinon/fake_timers.js": "sinon/lib/sinon/util/fake_timers.js",
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
			src: "src",
			gruntfile: "Gruntfile.js",

			// Check parts of tests that pass
			test: [
				"test/data/testrunner.js",
				"test/unit/basic.js",
				"test/unit/wrap.js"
			],
			build: "build"
		},
		testswarm: {
			tests: [

				// A special module with basic tests, meant for
				// not fully supported environments like Android 2.3,
				// jsdom or PhantomJS. We run it everywhere, though,
				// to make sure tests are not broken.
				"basic",

				"ajax",
				"attributes",
				"callbacks",
				"core",
				"css",
				"data",
				"deferred",
				"deprecated",
				"dimensions",
				"effects",
				"event",
				"manipulation",
				"offset",
				"queue",
				"selector",
				"serialize",
				"support",
				"traversing"
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
					banner: "/*! jQuery v<%= pkg.version %> | " +
						"(c) jQuery Foundation | jquery.org/license */",
					compress: {
						"hoist_funs": false,
						loops: false,
						unused: false
					}
				}
			}
		}
	} );

	// Load grunt tasks from NPM packages
	require( "load-grunt-tasks" )( grunt );

	// Integrate jQuery specific tasks
	grunt.loadTasks( "build/tasks" );

	grunt.registerTask( "lint", [ "jsonlint", "jshint", "jscs" ] );

	// Don't run Node-related tests in Node.js < 1.0.0 as they require an old
	// jsdom version that needs compiling, making it harder for people to compile
	// jQuery on Windows. (see gh-2519)
	grunt.registerTask( "test_fast", runJsdomTests ? [ "node_smoke_tests" ] : [] );

	grunt.registerTask( "test", [ "test_fast" ] );

	// Short list as a high frequency watch task
	grunt.registerTask( "dev", [ "build:*:*", "lint", "uglify", "remove_map_comment", "dist:*" ] );

	grunt.registerTask( "default", [ "dev", "test_fast", "compare_size" ] );
};
