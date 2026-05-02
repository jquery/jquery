import { document } from "../var/document.js";

export function getScriptNonce( doc ) {
	var script = ( doc || document ).currentScript;

	if ( !script ) {
		return;
	}

	return script.nonce || script.getAttribute( "nonce" ) || undefined;
}
