module.exports = function( grunt ) {

	"use strict";

	var spawnTest = require( "./lib/spawn_test.js" );

	grunt.registerTask( "promises_aplus_tests",
		[ "promises_aplus_tests_deferred", "promises_aplus_tests_when" ] );

	grunt.registerTask( "promises_aplus_tests_deferred", function() {
		spawnTest( this.async(),
			"./node_modules/.bin/promises-aplus-tests",
			"test/promises_aplus_adapter_deferred.js"
		);
	} );

	grunt.registerTask( "promises_aplus_tests_when", function() {
		spawnTest( this.async(),
			"./node_modules/.bin/promises-aplus-tests",
			"test/promises_aplus_adapter_when.js"
		);
	} );
};
