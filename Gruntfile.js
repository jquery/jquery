"use strict";

module.exports = function( grunt ) {
	function readOptionalJSON( filepath ) {
		const stripJSONComments = require( "strip-json-comments" );
		let data = {};
		try {
			data = JSON.parse( stripJSONComments(
				fs.readFileSync( filepath, { encoding: "utf8" } )
			) );
		} catch ( e ) {}
		return data;
	}

	const fs = require( "fs" );
	const { spawn } = require( "child_process" );
	const gzip = require( "gzip-js" );
	const nodeV16OrNewer = !/^v1[0-5]\./.test( process.version );
	const nodeV17OrNewer = !/^v1[0-6]\./.test( process.version );
	const customBrowsers = process.env.BROWSERS && process.env.BROWSERS.split( "," );

	// Support: Node.js <16
	// Skip running tasks that dropped support for old Node.js in these Node versions.
	function runIfNewNode( task ) {
		return nodeV16OrNewer ? task : "print_old_node_message:" + task;
	}

	if ( nodeV16OrNewer ) {
		const playwright = require( "playwright-webkit" );
		process.env.WEBKIT_HEADLESS_BIN = playwright.webkit.executablePath();
	}

	if ( !grunt.option( "filename" ) ) {
		grunt.option( "filename", "jquery.js" );
	}

	const builtJsFiles = [
		"dist/jquery.js",
		"dist/jquery.min.js",
		"dist/jquery.slim.js",
		"dist/jquery.slim.min.js"
	];

	const builtJsMinFiles = builtJsFiles
		.filter( filepath => filepath.endsWith( ".min.js" ) );

	grunt.initConfig( {
		pkg: grunt.file.readJSON( "package.json" ),
		dst: readOptionalJSON( "dist/.destination.json" ),
		compare_size: {
			files: builtJsMinFiles,
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
				retainLines: true,
				plugins: [ "@babel/transform-for-of" ]
			},
			tests: {
				files: {
					"test/data/core/jquery-iterability-transpiled.js":
						"test/data/core/jquery-iterability-transpiled-es6.js"
				}
			}
		},
		build: {
			all: {
				dest: "dist/jquery.js",
				minimum: [
					"core"
				],

				// Exclude specified modules if the module matching the key is removed
				removeWith: {
					ajax: [ "manipulation/_evalUrl", "deprecated/ajax-event-alias" ],
					callbacks: [ "deferred" ],
					css: [ "effects", "dimensions", "offset" ],
					"css/showHide": [ "effects" ],
					deferred: {
						remove: [ "ajax", "effects", "queue", "core/ready" ],
						include: [ "core/ready-no-deferred" ]
					},
					event: [ "deprecated/ajax-event-alias", "deprecated/event" ],
					selector: [ "css/hiddenVisibleSelectors", "effects/animatedSelector" ]
				}
			}
		},
		npmcopy: {
			all: {
				options: {
					destPrefix: "external"
				},
				files: {
					"bootstrap/bootstrap.css": "bootstrap/dist/css/bootstrap.css",
					"bootstrap/bootstrap.min.css": "bootstrap/dist/css/bootstrap.min.css",
					"bootstrap/bootstrap.min.css.map": "bootstrap/dist/css/bootstrap.min.css.map",

					"core-js/core-js.js": "core-js/client/core.min.js",
					"core-js/LICENSE.txt": "core-js/LICENSE",

					"npo/npo.js": "native-promise-only/lib/npo.src.js",

					"qunit/qunit.js": "qunit/qunit/qunit.js",
					"qunit/qunit.css": "qunit/qunit/qunit.css",
					"qunit/LICENSE.txt": "qunit/LICENSE.txt",

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
				src: builtJsFiles
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
		karma: {
			options: {
				customContextFile: "test/karma.context.html",
				customDebugFile: "test/karma.debug.html",
				customLaunchers: {
					ChromeHeadlessNoSandbox: {
						base: "ChromeHeadless",
						flags: [ "--no-sandbox" ]
					}
				},
				frameworks: [ "qunit" ],
				middleware: [ "mockserver" ],
				plugins: [
					"karma-*",
					{
						"middleware:mockserver": [
							"factory",
							require( "./test/middleware-mockserver.js" )
						]
					}
				],
				client: {
					qunit: {

						// We're running `QUnit.start()` ourselves via `loadTests()`
						// in test/jquery.js
						autostart: false
					}
				},
				files: [
					"test/data/jquery-1.9.1.js",
					"external/sinon/sinon.js",
					"external/npo/npo.js",
					"external/requirejs/require.js",
					"test/data/testinit.js",

					"test/jquery.js",

					{
						pattern: "dist/jquery.*",
						included: false,
						served: true,
						nocache: true
					},
					{
						pattern: "src/**",
						included: false,
						served: true,
						nocache: true
					},
					{
						pattern: "external/**",
						included: false,
						served: true,
						nocache: true
					},
					{ pattern: "node_modules/**", included: false, served: true },
					{
						pattern: "test/**/*.@(js|css|jpg|html|xml|svg)",
						included: false,
						served: true,
						nocache: true
					}
				],
				reporters: [ "dots" ],
				autoWatch: false,

				// 2 minutes; has to be longer than QUnit.config.testTimeout
				browserNoActivityTimeout: 120e3,

				concurrency: 3,
				captureTimeout: 20 * 1000,
				singleRun: true
			},
			main: {
				browsers: customBrowsers ||
					[ "ChromeHeadless", "FirefoxHeadless", "WebkitHeadless" ]
			},
			amd: {
				browsers: customBrowsers || [ "ChromeHeadless" ],
				options: {
					client: {
						qunit: {

							// We're running `QUnit.start()` ourselves via `loadTests()`
							// in test/jquery.js
							autostart: false,

							amd: true
						}
					}
				}
			},

			jsdom: {
				options: {
					files: [
						"test/data/jquery-1.9.1.js",
						"test/data/testinit-jsdom.js",

						// We don't support various loading methods like AMD,
						// choosing a version etc. for jsdom.
						"dist/jquery.js",

						// A partial replacement for testinit.js#loadTests()
						"test/data/testrunner.js",

						// jsdom only runs basic tests
						"test/unit/basic.js",

						{ pattern: "external/**", included: false, served: true },
						{
							pattern: "test/**/*.@(js|css|jpg|html|xml|svg)",
							included: false,
							served: true
						}
					]
				},
				browsers: [ "jsdom" ]
			},

			// To debug tests with Karma:
			// 1. Run 'grunt karma:chrome-debug' or 'grunt karma:firefox-debug'
			//    (any karma subtask that has singleRun=false)
			// 2. Press "Debug" in the opened browser window to start
			//    the tests. Unlike the other karma tasks, the debug task will
			//    keep the browser window open.
			"chrome-debug": {
				browsers: [ "Chrome" ],
				singleRun: false
			},
			"firefox-debug": {
				browsers: [ "Firefox" ],
				singleRun: false
			},
			"ie-debug": {
				browsers: [ "IE" ],
				singleRun: false
			}
		},
		watch: {
			files: [ "<%= eslint.dev.src %>" ],
			tasks: [ "dev" ]
		},
		uglify: {
			all: {
				files: {
					"dist/<%= grunt.option('filename').replace(/\\.js$/, '.min.js') %>":
						"dist/<%= grunt.option('filename') %>"
				},
				options: {
					preserveComments: false,
					sourceMap: true,
					sourceMapName:
						"dist/<%= grunt.option('filename').replace('.js', '.min.map') %>",
					report: "min",
					output: {
						"ascii_only": true,

						// Support: Android 4.0 only
						// UglifyJS 3 breaks Android 4.0 if this option is not enabled.
						// This is in lieu of setting ie8 for all of mangle, compress, and output
						"ie8": true
					},
					banner: "/*! jQuery v<%= pkg.version %> | " +
						"(c) OpenJS Foundation and other contributors | jquery.org/license */",
					compress: {
						"hoist_funs": false,
						loops: false,

						// Support: IE <11
						// typeofs transformation is unsafe for IE9-10
						// See https://github.com/mishoo/UglifyJS2/issues/2198
						typeofs: false
					}
				}
			}
		}
	} );

	// Load grunt tasks from NPM packages
	require( "load-grunt-tasks" )( grunt, {
		pattern: nodeV16OrNewer ? [ "grunt-*" ] : [ "grunt-*", "!grunt-eslint" ]
	} );

	// Integrate jQuery specific tasks
	grunt.loadTasks( "build/tasks" );

	grunt.registerTask( "print_old_node_message", ( ...args ) => {
		var task = args.join( ":" );
		grunt.log.writeln( "Old Node.js detected, running the task \"" + task + "\" skipped..." );
	} );

	grunt.registerTask( "build-all-variants",
		"Build both the full & slim builds",
		function() {
			const done = this.async();

			spawn( "npm run build-all-variants", {
				stdio: "inherit",
				shell: true
			} )
				.on( "close", code => {
					done( code === 0 );
				} );
		} );

	grunt.registerTask( "print_jsdom_message", () => {
		grunt.log.writeln( "Node.js 17 or newer detected, skipping jsdom tests..." );
	} );

	grunt.registerTask( "lint", [
		"jsonlint",

		// Running the full eslint task without breaking it down to targets
		// would run the dist target first which would point to errors in the built
		// file, making it harder to fix them. We want to check the built file only
		// if we already know the source files pass the linter.
		runIfNewNode( "eslint:dev" ),
		runIfNewNode( "eslint:dist" )
	] );

	grunt.registerTask( "lint:newer", [
		"newer:jsonlint",

		// Don't replace it with just the task; see the above comment.
		runIfNewNode( "newer:eslint:dev" ),
		runIfNewNode( "newer:eslint:dist" )
	] );

	grunt.registerTask( "test:fast", [ "node_smoke_tests" ] );
	grunt.registerTask( "test:slow", [
		runIfNewNode( "promises_aplus_tests" ),

		// Support: Node.js 17+
		// jsdom fails to connect to the Karma server in Node 17+.
		// Until we figure out a fix, skip jsdom tests there.
		nodeV17OrNewer ? "print_jsdom_message" : runIfNewNode( "karma:jsdom" )
	] );

	grunt.registerTask( "test:prepare", [
		"qunit_fixture",
		"babel:tests"
	] );

	grunt.registerTask( "test", [
		"test:prepare",
		"test:fast",
		"test:slow"
	] );

	grunt.registerTask( "dev", [
		"build:*:*",
		runIfNewNode( "newer:eslint:dev" ),
		"newer:uglify",
		"remove_map_comment",
		"dist:*",
		"qunit_fixture",
		"compare_size"
	] );

	grunt.registerTask( "default", [
		runIfNewNode( "eslint:dev" ),
		"build-all-variants",
		"test:prepare",
		runIfNewNode( "eslint:dist" ),
		"test:fast",
		"compare_size"
	] );
};
