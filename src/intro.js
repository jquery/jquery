/*!
 * jQuery JavaScript Library v@VERSION
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: @DATE
 */

(function ( window, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// Expose a jQuery-making factory as module.exports in loaders that implement the Node
		// module pattern (including browserify).
		// This accentuates the need for a real window in the environment
		// e.g. var jQuery = require("jquery")(window);
		module.exports = function( w ) {
			w = w || window;
			if ( !w.document ) {
				throw new Error("jQuery requires a window with a document");
			}
			return factory( w );
		};
	} else {
		// Execute the factory to produce jQuery
		var jQuery = factory( window );

		// Register as a named AMD module, since jQuery can be concatenated with other
		// files that may use define, but not via a proper concatenation script that
		// understands anonymous AMD modules. A named AMD is safest and most robust
		// way to register. Lowercase jquery is used because AMD module names are
		// derived from file names, and jQuery is normally delivered in a lowercase
		// file name. Do this after creating the global so that if an AMD module wants
		// to call noConflict to hide this version of jQuery, it will work.
		if ( typeof define === "function" && define.amd ) {
			define( "jquery", [], function() {
				return jQuery;
			});
		}
	}

// Pass this, window may not be defined yet
}(this, function ( window ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
