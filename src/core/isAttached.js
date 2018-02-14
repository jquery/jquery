define( [
	"../core",
	"../var/getShadowRoot",
	"../var/document",
	"../selector" // Get jQuery.contains
], function( jQuery, getShadowRoot, document ) {
	"use strict";

	// Replace the use of contains function to check attachment (gh-3504)

	var isAttached;

	// Check if browser supports Shadow DOM
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
