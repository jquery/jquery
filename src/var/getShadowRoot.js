define( [], function() {
	"use strict";

	// This function should be used only with a check
	// for the browser supporting Shadow DOM
	return function getShadowRoot( elem ) {
		var doc;

		// check for support of getRootNode function
		while ( typeof elem.getRootNode !== "function" ) {
			doc = elem.ownerDocument;
			elem = doc && doc.host || doc;
		}
		return elem.getRootNode( { composed: true } );
	};

} );
