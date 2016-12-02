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
			factory( global.window, true, global ) :
			function( global, window ) {

                                // If no window reference passed...

                                if ( !window ) {
                                        
                                        // If window is not available on the global object (or fake window object or whatever)...
                                        
                                        if ( !global.window ) {
	                                       throw new Error( "jQuery requires a window" );
	                                }
                                        
                                        // Get the window reference from the global object (*may* be the same object)
                                        
                                        window = global.window;
                                }
                        
				if ( !window.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}

				return factory( window, false, global );
			};
	} else {

                // For environments lacking module.exports (e.g. browsers)
                // Pass a reference to the global `window` object

                if ( !global.window ) {
	                throw new Error( "jQuery requires a window" );
	        }

                if ( !global.window.document ) {
	                throw new Error( "jQuery requires a window with a document" );
	        }

		factory( global.window, false, global );
	}
// Pass this if window is not defined yet
} )( typeof global == "undefined" ? this : global, function( window, noGlobal, globalObject ) {

        // Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
        // throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
        // arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
        // enough that all such attempts are guarded in a try block.
        "use strict";

        // @CODE
        // build.js inserts compiled jQuery here

        return jQuery;
} );
