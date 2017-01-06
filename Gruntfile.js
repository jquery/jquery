module.exports = function( grunt ) {
	"use strict";

	function readOptionalJSON( filepath ) {
		var stripJSONComments = require( "strip-json-comments" ),
			data = {};
		try {
			data = JSON.parse( stripJSONComments(
				fs.readFileSync( filepath, { encoding: "utf8" } )
			) );
		} catch ( e ) {}
		return data;
	}

	var fs = require( "fs" ),
		gzip = require( "gzip-js" );

	if ( !grunt.option( "filename" ) ) {
		grunt.option( "filename", "jquery.js" );
	}

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
					"css/showHide": [ "effects" ],
					deferred: {
						remove: [ "ajax", "effects", "queue", "core/ready" ],
						include: [ "core/ready-no-deferred" ]
					},
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

					"sinon/sinon.js": "sinon/pkg/sinon.js",
					"sinon/LICENSE.txt": "sinon/LICENSE"
				}
			}
		},
		jsonlint: {
			pkg: {
				src: [ "package.json" ]
			}
		},
		eslint: {
			options: {

				// See https://github.com/sindresorhus/grunt-eslint/issues/119
				quiet: true
			},

			// We have to explicitly declare "src" property otherwise "newer"
			// task wouldn't work properly :/
			dist: {
				src: "dist/jquery.js"
			},
			dev: {
				src: [ "src/**/*.js", "Gruntfile.js", "test/**/*.js", "build/**/*.js" ]
			}
		},
		testswarm: {
			tests: [

				// A special module with basic tests, meant for
				// not fully supported environments like Android 2.3,
				// jsdom or PhantomJS. We run it everywhere, though,
				// to make sure tests are not broken.
				"basic",

				"ajax",
				"animation",
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
				"traversing",
				"tween"
			]
		},
		watch: {
			files: [ "<%= eslint.dev.src %>" ],
			tasks: [ "dev" ]
		},
		uglify: {
			all: {
				files: {
					"dist/<%= grunt.option('filename').replace('.js', '.min.js') %>":
						"dist/<%= grunt.option('filename') %>"
				},
				options: {
					preserveComments: false,
					sourceMap: true,
					ASCIIOnly: true,
					sourceMapName:
						"dist/<%= grunt.option('filename').replace('.js', '.min.map') %>",
					report: "min",
					beautify: {
						"ascii_only": true
					},
					banner: "/*! jQuery v<%= pkg.version %> | " +
						"(c) JS Foundation and other contributors | jquery.org/license */",
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

	grunt.registerTask( "lint", [
		"jsonlint",

		// Running the full eslint task without breaking it down to targets
		// would run the dist target first which would point to errors in the built
		// file, making it harder to fix them. We want to check the built file only
		// if we already know the source files pass the linter.
		"eslint:dev",
		"eslint:dist"
	] );

	grunt.registerTask( "lint:newer", [
		"newer:jsonlint",

		// Don't replace it with just the task; see the above comment.
		"newer:eslint:dev",
		"newer:eslint:dist"
	] );

	grunt.registerTask( "test:fast", "node_smoke_tests" );
	grunt.registerTask( "test:slow", "promises_aplus_tests" );

	grunt.registerTask( "test", [
		"test:fast",
		"test:slow"
	] );

	grunt.registerTask( "dev", [
		"build:*:*",
		"newer:eslint:dev",
		"newer:uglify",
		"remove_map_comment",
		"dist:*",
		"compare_size"
	] );

	grunt.registerTask( "default", [
		"eslint:dev",
		"build:*:*",
		"uglify",
		"remove_map_comment",
		"dist:*",
		"eslint:dist",
		"test:fast",
		"compare_size"
	] );
};
