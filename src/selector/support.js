define( [
	"../core",
	"../var/document",
	"../var/documentElement",
	"../var/support",
	"./var/matches"
], function( jQuery, document, documentElement, support, matches ) {

"use strict";

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}


// Support: IE <10
// Check if getElementById returns elements by name
// The broken getElementById methods don't pick up programmatically-set names,
// so use a roundabout getElementsByName test
support.getById = assert( function( el ) {
	documentElement.appendChild( el ).id = jQuery.expando;
	return !document.getElementsByName ||
		!document.getElementsByName( jQuery.expando ).length;
} );

// Support: IE 9 only
// Check to see if it's possible to do matchesSelector
// on a disconnected node.
support.disconnectedMatch = assert( function( el ) {
	return matches.call( el, "*" );
} );

return support;

} );
