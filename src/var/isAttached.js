define( [
	"../core",
	"../selector" // Get jQuery.contains
], function( jQuery ) {
	"use strict";

	return function isAttached( obj ) {
		return jQuery.contains( obj.ownerDocument, obj );
	};

} );
