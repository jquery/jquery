// CSS escapes
// https://www.w3.org/TR/CSS21/syndata.html#escaped-characters
import { whitespace } from "../var/whitespace.js";

var runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace +
	"?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		if ( nonHex ) {

			// Strip the backslash prefix from a non-hex escape sequence
			return nonHex;
		}

		var codePoint = parseInt( escape.slice( 1 ), 16 );

		// Zero, a surrogate half, and values above the maximum code point decode to
		// the replacement character, matching the native CSS parser.
		// https://drafts.csswg.org/css-syntax/#consume-escaped-code-point
		if ( codePoint === 0 || codePoint > 0x10FFFF ||
			codePoint >= 0xD800 && codePoint <= 0xDFFF ) {
			return "\uFFFD";
		}

		// Replace a hexadecimal escape sequence with the encoded Unicode code point
		// Support: IE <=11+
		// For values outside the Basic Multilingual Plane (BMP), manually construct a
		// surrogate pair
		return codePoint > 0xFFFF ?
			String.fromCharCode(
				( codePoint - 0x10000 ) >> 10 | 0xD800,
				( codePoint - 0x10000 ) & 0x3FF | 0xDC00
			) :
			String.fromCharCode( codePoint );
	};

export function unescapeSelector( sel ) {
	return sel.replace( runescape, funescape );
}
