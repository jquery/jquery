module.exports = function( grunt ) {

	"use strict";

	var spawn = require( "child_process" ).spawn;

	grunt.registerTask( "promises-aplus-tests", function() {
		var done = this.async();
		spawn(
			"node",
			[
				"./node_modules/.bin/promises-aplus-tests",
				"test/promises-aplus-adapter.js"
			],
			{ stdio: "inherit" }
		).on( "close", function( code ) {
			done( code === 0 );
		} );
	} );
};
