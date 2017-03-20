"use strict";

var assert = require( "assert" );

module.exports = function ensureIterability() {
	require( "jsdom" ).env( "", function( errors, window ) {
		assert.ifError( errors );

		var i,
			ensureJQuery = require( "./ensure_jquery" ),
			jQuery = require( "../../../dist/jquery.js" )( window ),
			elem = jQuery( "<div></div><span></span><a></a>" ),
			result = "";

		ensureJQuery( jQuery );

		for ( i of elem ) {
			result += i.nodeName;
		}

		assert.strictEqual( result, "DIVSPANA", "for-of works on jQuery objects" );
	} );
};
