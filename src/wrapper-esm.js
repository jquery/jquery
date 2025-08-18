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
// For ECMAScript module environments where a proper `window`
// is present, execute the factory and get jQuery.
function jQueryFactory( window, noGlobal ) {

if ( typeof window === "undefined" || !window.document ) {
	throw new Error( "jQuery requires a window with a document" );
}

// @CODE
// build.js inserts compiled jQuery here

return jQuery;

}

var jQuery = jQueryFactory( window, true );

export { jQuery, jQuery as $ };

export default jQuery;
