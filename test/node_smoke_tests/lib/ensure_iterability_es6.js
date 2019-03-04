"use strict";

const assert = require( "assert" );

const ensureIterability = () => {
	const { JSDOM } = require( "jsdom" );

	const { window } = new JSDOM( "" );

	let i;
	const ensureJQuery = require( "./ensure_jquery" );
	const jQuery = require( "../../../dist/jquery.js" )( window );
	const elem = jQuery( "<div></div><span></span><a></a>" );
	let result = "";

	ensureJQuery( jQuery );

	for ( i of elem ) {
		result += i.nodeName;
	}

	assert.strictEqual( result, "DIVSPANA", "for-of works on jQuery objects" );
};

module.exports = ensureIterability;
