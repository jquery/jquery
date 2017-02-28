define( [
	"../var/document"
], function( document ) {
	"use strict";

	function DOMEval( code, doc, nonce ) {
		doc = doc || document;
		var script = doc.createElement( "script" );

		if ( nonce ) {
			script.setAttribute( "nonce", nonce );
		}

		script.text = code;
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}

	return DOMEval;
} );
