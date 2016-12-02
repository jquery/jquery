/* eslint-disable no-unused-vars*/
/*!
 * jQuery JavaScript Library v@VERSION
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: @DATE
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a global `document`
		// (such as Node.js), expose a factory as module.exports.
		
		module.exports = ( global.window && global.window.document ) ?
			factory( global.window, true ) :
			function( global ) {
				if ( !global.document ) {
					throw new Error( "jQuery requires a document" );
				}
				return factory( global );
			};
	} else {
		factory( global.window || global );
	}

// Pass this if window is not defined yet
} )( typeof global == "undefined" ? this : global, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

// @CODE
// build.js inserts compiled jQuery here

return jQuery;
} );
