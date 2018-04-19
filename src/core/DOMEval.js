define( [
	"../var/document"
], function( document ) {
	"use strict";

	var preservedScriptAttributes = {
		type: true,
		src: true,
		noModule: true
	};

  var nonce;

  if ( window.__csp_nonce__ ) {
    nonce = window.__csp_nonce__;
    delete window.__csp_nonce__;
  }

	function DOMEval( code, doc, node ) {
		doc = doc || document;

		var i,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {
				if ( node[ i ] ) {
					script[ i ] = node[ i ];
				}
			}
		}

    if ( nonce ) {
      script.setAttribute( "nonce", nonce );
    }

		doc.head.appendChild( script ).parentNode.removeChild( script );
	}

	return DOMEval;
} );
