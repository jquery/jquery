module.exports = function( grunt ) {

	"use strict";

	// Run this task to run jsdom-related tests on Node.js < 1.0.0.
	grunt.registerTask( "old_jsdom", function() {
		if ( !/^v0/.test( process.version ) ) {
			console.warn( "The old_jsdom task doesn\'t need to be run in io.js or new Node.js" );
			return;
		}

		// Use npm on the command-line
		// There is no local npm
		grunt.util.spawn( {
			cmd: "npm",
			args: [ "install", "jsdom@3" ],
			opts: { stdio: "inherit" }
		}, this.async() );
	} );
};
