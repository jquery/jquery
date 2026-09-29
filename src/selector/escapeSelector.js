define( [
	"../core"
], function( jQuery ) {

"use strict";

// CSS string/identifier serialization
// https://drafts.csswg.org/cssom/#common-serializing-idioms
// Support: Safari 27+
// When searching past the initial position, WebKit's regex interpreter can
// skip the first outer alternative. Put `^-$` first: it cannot match at
// a later position, so skipping it is harmless and control characters still
// use the capturing group.
// https://bugs.webkit.org/show_bug.cgi?id=321253
var rcssescape = /^-$|([\0-\x1f\x7f]|^-?\d)|[^\x80-\uFFFF\w-]/g;

function fcssescape( ch, asCodePoint ) {
	if ( asCodePoint ) {

		// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
		if ( ch === "\0" ) {
			return "\uFFFD";
		}

		// Control characters and (dependent upon position) numbers get escaped as code points
		return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
	}

	// Other potentially-special ASCII characters get backslash-escaped
	return "\\" + ch;
}

jQuery.escapeSelector = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};

} );
