import { document } from "./document.js";

// Support: XML documents
// In XML documents, `document.createElement` creates elements in the XML
// namespace where `.style` is `undefined`. Using `createElementNS` with
// the XHTML namespace ensures elements have full HTML behavior.
export function createElement( tag ) {
	return document.createElementNS( "http://www.w3.org/1999/xhtml", tag );
}
