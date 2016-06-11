module.exports = function( grunt ) {

	"use strict";

	var spawnTest = require( "./lib/spawn_test.js" );

	grunt.registerTask( "promises_aplus_tests",
		[ "promises_aplus_tests:deferred", "promises_aplus_tests:when" ] );

	grunt.registerTask( "promises_aplus_tests:deferred", function() {
		spawnTest( this.async(),
			"./node_modules/.bin/promises-aplus-tests",
			"test/promises_aplus_adapters/deferred.js"
		);
	} );

	grunt.registerTask( "promises_aplus_tests:when", function() {
		spawnTest( this.async(),
			"./node_modules/.bin/promises-aplus-tests",
			"test/promises_aplus_adapters/when.js"
		);
	} );
};
