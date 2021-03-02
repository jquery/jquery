"use strict";

var grunt = require( "grunt" );

module.exports = function( config ) {
	var isTravis = process.env.TRAVIS,
		dateString = grunt.config( "dateString" ),
		isBrowserStack = !!( process.env.BROWSER_STACK_USERNAME &&
			process.env.BROWSER_STACK_ACCESS_KEY ),
		hostName = isBrowserStack ? "bs-local.com" : "localhost";

	config.set( {
		browserStack: {
			project: "jquery",
			build: "local run" + ( dateString ? ", " + dateString : "" ),
			timeout: 600, // 10 min
			// BrowserStack has a limit of 120 requests per minute. The default
			// "request per second" strategy doesn't scale to so many browsers.
			pollingTimeout: 10000
		},
	
		// Can't specify path as "../../test" which would be intuitive
		// because if we do, karma will make paths outside "test" folder absolute
		// that will break iframe tests
		basePath: "../../",

		// Add BrowserStack launchers
		customLaunchers: require( "./lanucher" ),

		customContextFile: "test/karma.context.html",
				customDebugFile: "test/karma.debug.html",
				frameworks: [ "qunit" ],
				middleware: [ "mockserver" ],
				plugins: [
					"karma-*",
					{
						"middleware:mockserver": [
							"factory",
							require( "../middleware-mockserver.js" )
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
					"node_modules/sinon/pkg/sinon.js",
					"node_modules/native-promise-only/lib/npo.src.js",
					"node_modules/requirejs/require.js",
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
						type: "module",
						included: false,
						served: true,
						nocache: true
					},
					{
						pattern: "amd/**",
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

		autoWatch: false,

		concurrency: 5,

		singleRun: true,
		// Make travis output less verbose
		// reporters: isTravis ? "dots" : "progress",
		reporters: "dots",
		colors: !isTravis,

		hostname: hostName,
		port: 9876,

		// Possible values:
		// config.LOG_DISABLE
		// config.LOG_ERROR
		// config.LOG_WARN
		// config.LOG_INFO
		// config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 3e5,
		browserNoActivityTimeout: 3e5,
		browserDisconnectTimeout: 3e5,
		browserDisconnectTolerance: 3
	} );
};
