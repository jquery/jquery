import { document } from "../var/document.js";

var preservedScriptAttributes = {
	type: true,
	src: true,
	nonce: true,
	noModule: true
};

export function DOMEval( code, node, doc ) {
	doc = doc || document;

	var i,
		val,
		script = doc.createElement( "script" );

	script.text = code;
	for ( i in preservedScriptAttributes ) {
		if ( node ) {
			if ( i === "nonce" ) {
				val = node.getAttribute ? node.getAttribute( i ) : node[ i ];
				if ( val ) {
					script.setAttribute( i, val );
				}
			} else if ( node[ i ] ) {
				script[ i ] = node[ i ];
			}
		}
	}

	if ( doc.head.appendChild( script ).parentNode ) {
		script.parentNode.removeChild( script );
	}
}
