define( [
	"../var/document"
], function( document ) {
	"use strict";

	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, doc, node ) {
		doc = doc || document;

		var i,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {
				if ( node[ i ] ) {
					script[ i ] = node[ i ];
				} else if ( node.getAttribute( i ) ) {

					// Support: Firefox 64+, Edge 18+
					// Some browsers don't support the "nonce" property on scripts.
					// On the other hand, just using `setAttribute` & `getAttribute`
					// is not enough as `nonce` is no longer exposed as an attribute
					// in the latest standard.
					// See https://github.com/whatwg/html/issues/2369
					script.setAttribute( i, node.getAttribute( i ) );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}

	return DOMEval;
} );
