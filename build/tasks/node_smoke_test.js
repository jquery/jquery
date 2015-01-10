module.exports = function( grunt ) {

	"use strict";

	grunt.registerTask( "node_smoke_test", function() {
	    var done = this.async();
		require( "jsdom" ).env( "", function( errors, window ) {
			if ( errors ) {
				console.error( errors );
				done( false );
			}
			require( "../.." )( window );
			done();
		});
	});
};
