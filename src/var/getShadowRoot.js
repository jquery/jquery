define( [], function() {
	"use strict";

	// This function should be used only with a check
	// for the browser supporting Shadow DOM
	return function getShadowRoot( elem ) {

		// check for support of getRootNode function
		while ( typeof elem.getRootNode !== "function" ) {
			var doc = elem.ownerDocument;
			elem = doc && doc.host ? doc.host : doc;
		}
		return elem.getRootNode( { composed: true } );
	};

} );
