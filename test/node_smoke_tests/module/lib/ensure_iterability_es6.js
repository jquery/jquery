import assert from "node:assert/strict";
const { JSDOM } = await import( "jsdom" );

const { ensureJQuery } = await import( "./ensure_jquery.js" );

export const ensureIterability = async( jQueryModuleSpecifier ) => {
	const { window } = new JSDOM( "" );

	const { jQueryFactory } = await import( jQueryModuleSpecifier );
	const jQuery = jQueryFactory( window );
	const elem = jQuery( "<div></div><span></span><a></a>" );

	ensureJQuery( jQuery );

	let result = "";
	for ( const node of elem ) {
		result += node.nodeName;
	}

	assert.strictEqual( result, "DIVSPANA", "for-of works on jQuery objects" );
};
