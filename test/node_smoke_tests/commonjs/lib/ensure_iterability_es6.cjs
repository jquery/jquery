"use strict";

const assert = require( "node:assert/strict" );
const { JSDOM } = require( "jsdom" );

const { ensureJQuery } = require( "./ensure_jquery.cjs" );

const ensureIterability = ( jQueryModuleSpecifier ) => {
	const { window } = new JSDOM( "" );

	const { jQueryFactory } = require( jQueryModuleSpecifier );
	const jQuery = jQueryFactory( window );
	const elem = jQuery( "<div></div><span></span><a></a>" );

	ensureJQuery( jQuery );

	let result = "";
	for ( const node of elem ) {
		result += node.nodeName;
	}

	assert.strictEqual( result, "DIVSPANA", "for-of works on jQuery objects" );
};

module.exports = { ensureIterability };
