import assert from "node:assert";

export const ensureIterability = async() => {
	const { JSDOM } = await import( "jsdom" );

	const { window } = new JSDOM( "" );

	let i;
	const { ensureJQuery } = await import( "./ensure_jquery.js" );
	const { default: jQueryFactory } = await import( "../../../../dist/jquery.mjs" );
	const jQuery = jQueryFactory( window );
	const elem = jQuery( "<div></div><span></span><a></a>" );
	let result = "";

	ensureJQuery( jQuery );

	for ( i of elem ) {
		result += i.nodeName;
	}

	assert.strictEqual( result, "DIVSPANA", "for-of works on jQuery objects" );
};
