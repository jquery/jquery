define( [
	"../var/document"
], function( document ) {
	"use strict";

	var preservedScriptAttributes = {
		type: true,
		src: true,
		noModule: true
	};

  var cspNonce;

  if ( window.__cspNonce__ ) {
    cspNonce = window.__cspNonce__;
    delete window.__cspNonce__;
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

    if ( cspNonce ) {
      script.setAttribute( "nonce", cspNonce );
    }

		doc.head.appendChild( script ).parentNode.removeChild( script );
	}

	return DOMEval;
} );
