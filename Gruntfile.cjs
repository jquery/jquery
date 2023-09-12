"use strict";

module.exports = function( grunt ) {
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

	grunt.initConfig( {
		pkg: grunt.file.readJSON( "package.json" ),
		testswarm: {
			tests: [

				// A special module with basic tests, meant for not fully
				// supported environments like jsdom. We run it everywhere,
				// though, to make sure tests are not broken.
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
							require( "./test/middleware-mockserver.cjs" )
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
						pattern: "external/**",
						included: false,
						served: true,
						nocache: true
					},
					{
						pattern: "dist/jquery.*",
						included: false,
						served: true,
						nocache: true
					},
					{
						pattern: "src/**",
						type: "module",
						included: false,
						served: true,
						nocache: true
					},
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
			esmodules: {
				browsers: customBrowsers || [ "ChromeHeadless" ],
				options: {
					client: {
						qunit: {

							// We're running `QUnit.start()` ourselves via `loadTests()`
							// in test/jquery.js
							autostart: false,

							esmodules: true
						}
					}
				}
			},

			jsdom: {
				options: {
					files: [
						"test/data/jquery-1.9.1.js",
						"test/data/testinit-jsdom.js",

						// We don't support various loading methods like esmodules,
						// choosing a version etc. for jsdom.
						"dist/jquery.js",

						// A partial replacement for testinit.js#loadTests()
						"test/data/testrunner.js",

						// jsdom only runs basic tests
						"test/unit/basic.js",

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
		}
	} );

	// Load grunt tasks from NPM packages
	require( "load-grunt-tasks" )( grunt, {
		pattern: [ "grunt-*" ]
	} );

	// Integrate jQuery specific tasks
	grunt.loadTasks( "build/grunt-tasks" );

	grunt.registerTask( "print_old_node_message", ( ...args ) => {
		var task = args.join( ":" );
		grunt.log.writeln( "Old Node.js detected, running the task \"" + task + "\" skipped..." );
	} );

	grunt.registerTask( "print_jsdom_message", () => {
		grunt.log.writeln( "Node.js 17 or newer detected, skipping jsdom tests..." );
	} );

	grunt.registerTask( "test:jsdom", [

		// Support: Node.js 17+
		// jsdom fails to connect to the Karma server in Node 17+.
		// Until we figure out a fix, skip jsdom tests there.
		nodeV17OrNewer ? "print_jsdom_message" : runIfNewNode( "karma:jsdom" )
	] );

	grunt.registerTask( "test", [
		"test:jsdom"
	] );

	grunt.registerTask( "default", [
		"test"
	] );
};
