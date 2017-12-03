define( [
	"../var/document"
], function( document ) {
	"use strict";

	function DOMEval( code, doc, type, src ) {
		doc = doc || document;

		var script = doc.createElement( "script" );
		if ( code ) {
			script.text = code;
		}
		if ( type === "module" ) {
			script.type = type;
		}
		if ( src ) {
			script.src = src;
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}

	return DOMEval;
} );
