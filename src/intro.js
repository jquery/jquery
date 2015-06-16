/*!
 * jQuery JavaScript Library v@VERSION
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: @DATE
 */

(function( global, factory ) {
	function invokeFactoryWith( w, noGlobal ) {
		return factory(
			w,
			// For the sake of using jQuery with Node we need to use global
			// setTimeout etc. if they're not present on the provided window
			// instance. However, some environments provide their own
			// window.setTimeout etc. implementations (e.g. to prevent
			// passing strings to eval) and don't make the global ones
			// available. Thus, we need to check both.
			// See gh-2177 for more details.
			w.setTimeout || setTimeout,
			w.clearTimeout || clearTimeout,
			w.setInterval || setInterval,
			w.clearInterval || clearInterval,
			noGlobal
		);
	}

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			invokeFactoryWith( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return invokeFactoryWith( w );
			};
	} else {
		invokeFactoryWith( global );
	}

// Pass this if window is not defined yet
}( typeof window !== "undefined" ? window : this,
	function( window, setTimeout, clearTimeout, setInterval, clearInterval, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//"use strict";
