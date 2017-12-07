define( [
	"../var/document"
], function( document ) {
	"use strict";

	function DOMEval( code, doc, node ) {
		doc = doc || document;

		var i,
			script = doc.createElement( "script" );
		script.text = code;
		if ( node ) {
			for ( i in { type: true, src: true } ) {
				if ( node[ i ] ) {
					script[ i ] = node[ i ];
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}

	return DOMEval;
} );
