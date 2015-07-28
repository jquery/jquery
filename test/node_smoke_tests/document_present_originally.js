"use strict";

var assert = require( "assert" );

require( "jsdom" ).env( "", function( errors, window ) {
	assert.ifError( errors );

	// Pretend the window is a global.
	global.window = window;

	var ensureJQuery = require( "./lib/ensure_jquery" ),
		ensureGlobalNotCreated = require( "./lib/ensure_global_not_created" ),
		jQuery = require( "../../dist/jquery.js" );

	ensureJQuery( jQuery );
	ensureGlobalNotCreated( module.exports, window );
} );
