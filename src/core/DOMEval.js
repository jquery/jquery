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
		script = doc.createElement( "script" );

	script.text = code;
	for ( i in preservedScriptAttributes ) {
		var val = node ? node[ i ] || node.getAttribute && node.getAttribute( i ) : null;
		if ( val ) {
			script[ i ] = val;
		}
	}

	if ( doc.head.appendChild( script ).parentNode ) {
		script.parentNode.removeChild( script );
	}
}
