// CSS escapes
// https://www.w3.org/TR/CSS21/syndata.html#escaped-characters
// https://www.w3.org/TR/css-syntax-3/#escape-diagram

import { whitespace } from "../var/whitespace.js";

var runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace +
	"?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		if ( nonHex ) {

			// Strip the backslash prefix from a non-hex escape sequence
			return nonHex;
		}

		// Replace a hexadecimal escape sequence with the encoded Unicode code point
		return String.fromCodePoint( "0x" + escape.slice( 1 ) );
	};

export function unescapeSelector( sel ) {
	return sel.replace( runescape, funescape );
}
