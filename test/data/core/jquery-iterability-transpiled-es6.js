/* global startIframeTest */

jQuery( () => {
	// "use strict" — not needed in ES modules (kept for compatibility)

	let elem = jQuery( "<div></div><span></span><a></a>" );
	let result = "";
	const i;
	for ( i of elem ) {
		result += i.nodeName;
	}

	startIframeTest( result );
} );
