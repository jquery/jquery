/* jshint node: true */

"use strict";

require( "jsdom" ).env( "", function( errors, window ) {
	if ( errors ) {
		console.error( errors );
		process.exit( 1 );
	}

	// Pretend the window is a global.
	global.window = window;

	var ensureJQuery = require( "./lib/ensure_jquery" ),
		ensureGlobalNotCreated = require( "./lib/ensure_global_not_created" ),
		jQuery = require( "../../dist/jquery.js" );

	ensureJQuery( jQuery );
	ensureGlobalNotCreated( module.exports, window );
} );
