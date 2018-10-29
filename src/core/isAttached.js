define( [
	"../core",
	"../var/documentElement",
	"../selector" // jQuery.contains
], function( jQuery, documentElement ) {
	"use strict";

	// Replace the use of contains function to check attachment (gh-3504)

	var isAttached;

	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	if ( documentElement.attachShadow ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( { composed: true } ) === elem.ownerDocument;
		};
	} else {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		};
	}
	return isAttached;
} );
