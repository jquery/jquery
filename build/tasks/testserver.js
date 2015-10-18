module.exports = function( grunt ) {

	"use strict";

	grunt.registerTask( "testserver", function() {
		this.async();
		var express = require( "express" );
		var app = express();
		var options = this.options();
		var staticRoutes = options.static;
		for ( var route in staticRoutes ) {
			app.use( route, express.static( staticRoutes[ route ] ) );
		}
		var server = app.listen( options.port, function() {
			var address = server.address();
			console.log(
				"Test server listening at http://%s:%s",
				address.address,
				address.port
			);
		} );
	} );
};
