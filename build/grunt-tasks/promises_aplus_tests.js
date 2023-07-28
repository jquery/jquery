"use strict";

module.exports = grunt => {
	const timeout = 2000;
	const spawnTest = require( "./lib/spawn_test.js" );

	grunt.registerTask( "promises_aplus_tests",
		[ "promises_aplus_tests:deferred", "promises_aplus_tests:when" ] );

	grunt.registerTask( "promises_aplus_tests:deferred", function() {
		spawnTest( this.async(),
			"\"" + __dirname + "/../../node_modules/.bin/promises-aplus-tests\"" +
				" test/promises_aplus_adapters/deferred.cjs" +
				" --reporter dot" +
				" --timeout " + timeout
		);
	} );

	grunt.registerTask( "promises_aplus_tests:when", function() {
		spawnTest( this.async(),
			"\"" + __dirname + "/../../node_modules/.bin/promises-aplus-tests\"" +
				" test/promises_aplus_adapters/when.cjs" +
				" --reporter dot" +
				" --timeout " + timeout
		);
	} );
};
