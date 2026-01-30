import { jQuery } from "../core.js";

var composed = { composed: true };

export function isAttached( elem ) {
	return jQuery.contains( elem.ownerDocument, elem ) ||
		elem.getRootNode( composed ) === elem.ownerDocument;
}
