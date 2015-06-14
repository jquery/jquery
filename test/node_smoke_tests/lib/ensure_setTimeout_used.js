"use strict";

var assert = require( "assert" );

// Ensure the proper setTimeout (global.setTimeout or window.setTimeout)
// is used by jQuery.
module.exports = function ensureSetTimeoutUsed( expectedKind ) {
	require( "jsdom" ).env( "", function( errors, window ) {
		assert.ifError( errors );

		var jQuery,
			windowSetTimeoutCount = 0,
			origWindowSetTimeout = window.setTimeout,
			ensureJQuery = require( "./ensure_jquery" );

		if ( expectedKind === "global" ) {
			delete window.setTimeout;
		} else {
			assert.strictEqual( expectedKind, "window",
				"expectedKind has to be 'global' or 'window'" );

			window.setTimeout = function patchedSetTimeout() {
				windowSetTimeoutCount++;
				return origWindowSetTimeout.apply( this, arguments );
			};
		}

		jQuery = require( "../../../dist/jquery.js" )( window );
		ensureJQuery( jQuery );

		if ( expectedKind === "global" ) {
			assert.strictEqual( windowSetTimeoutCount, 0,
				"Expected global setTimeout to be called" );
			window.setTimeout = origWindowSetTimeout;
		} else {
			assert( windowSetTimeoutCount > 0,
				"Expected window.setTimeout to be called" );
		}
	} );
};
