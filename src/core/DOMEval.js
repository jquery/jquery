import { document } from "../var/document.js";
import { getScriptNonce } from "./getScriptNonce.js";

var preservedScriptAttributes = {
	type: true,
	src: true,
	nonce: true,
	noModule: true
};

export function DOMEval( code, node, doc ) {
	doc = doc || document;

	var i,
		nonce,
		script = doc.createElement( "script" );

	script.text = code;
	for ( i in preservedScriptAttributes ) {
		if ( node && node[ i ] ) {
			script[ i ] = node[ i ];
		}
	}

	if ( !script.nonce ) {
		nonce = getScriptNonce( doc );
		if ( nonce ) {
			script.nonce = nonce;
		}
	}

	if ( doc.head.appendChild( script ).parentNode ) {
		script.parentNode.removeChild( script );
	}
}
