/*!
 * jQuery JavaScript Library v@VERSION
 * https://jquery.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.com/license/
 *
 * Date: @DATE
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		module.exports = factory( global, true );
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

"use strict";

if ( !window.document ) {
	throw new Error( "jQuery requires a window with a document" );
}

// @CODE
// build.js inserts compiled jQuery here

return jQuery;

} );
