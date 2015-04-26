module.exports = function( grunt ) {

	"use strict";

	var spawnTest = require( "./lib/spawn_test.js" );

	grunt.registerTask( "promises_aplus_tests", function() {
		spawnTest( this.async(),
			"./node_modules/.bin/promises-aplus-tests",
			"test/promises_aplus_adapter.js"
		);
	} );
};
