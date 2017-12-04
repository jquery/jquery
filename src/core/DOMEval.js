define( [
	"../var/document"
], function( document ) {
	"use strict";

	function DOMEval( code, doc, node ) {
		doc = doc || document;

		var i,
			script = doc.createElement( "script" );
		script.text = code;
		for ( i in { type: true, src: true } ) {
			script[ i ] = node[ i ];
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}

	return DOMEval;
} );
