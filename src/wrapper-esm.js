/*!
 * jQuery JavaScript Library v@VERSION
 * https://jquery.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: @DATE
 */
// For ECMAScript module environments where a proper `window`
// is present, execute the factory and get jQuery.
// For environments that do not have a `window` with a `document`
// (such as Node.js), expose a factory as module.exports.
// This accentuates the need for the creation of a real `window`.
// e.g. var jQuery = require("jquery")(window);
// See ticket trac-14549 for more info.
var jQueryOrJQueryFactory = typeof window !== "undefined" && window.document ?
	jQueryFactory( window, true ) :
	function( w ) {
		if ( !w.document ) {
			throw new Error( "jQuery requires a window with a document" );
		}
		return jQueryFactory( w );
	};

function jQueryFactory( window, noGlobal ) {

// @CODE
// build.js inserts compiled jQuery here

return jQuery;

}

export default jQueryOrJQueryFactory;
