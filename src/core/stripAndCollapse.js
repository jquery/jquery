define( function() {
	"use strict";

	// Strip and collapse whitespace according to HTML spec
	// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
	var rhtmlSpace = /[\x20\t\r\n\f]+/g,
		stripAndCollapse = function( value ) {
			return ( " " + value + " " ).replace( rhtmlSpace, " " ).slice( 1, -1 );
		};

	return stripAndCollapse;
} );
