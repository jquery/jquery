define( [
	"../core",
	"../var/documentElement",
	"../selector/contains" // jQuery.contains
], function( jQuery, documentElement ) {
	"use strict";

	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}

	return isAttached;
} );
