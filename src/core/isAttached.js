define( [
	"../core",
	"../var/getShadowRoot",
	"../var/document",
	"../selector" // jQuery.contains
], function( jQuery, getShadowRoot, document ) {
	"use strict";

	// Replace the use of contains function to check attachment (gh-3504)

	var isAttached;

	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	if ( document.head.createShadowRoot ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				getShadowRoot( elem ) === elem.ownerDocument;
		};
	} else {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		};
	}
	return isAttached;
} );
