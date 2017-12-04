define( [
	"../var/document"
], function( document ) {
	"use strict";

	function DOMEval( code, doc, node ) {
		doc = doc || document;

		var script = doc.createElement( "script" );
		if ( code ) {
			script.text = code;
		}
		jQuery.each( [
			"type",
			"nomodule",
			"src"
		], function() {
			if ( node[ this ] ) {
				script[ this ] = node[ this ];
			}
		} );
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}

	return DOMEval;
} );
