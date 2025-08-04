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
// Expose a factory as `jQueryFactory`. Aimed at environments without
// a real `window` where an emulated window needs to be constructed. Example:
//
//     import { jQueryFactory } from "jquery/factory";
//     const jQuery = jQueryFactory( window );
//
// See ticket trac-14549 for more info.
function jQueryFactoryWrapper( window, noGlobal ) {

if ( !window.document ) {
	throw new Error( "jQuery requires a window with a document" );
}

// @CODE
// build.js inserts compiled jQuery here

return jQuery;

}

export function jQueryFactory( window ) {
	return jQueryFactoryWrapper( window, true );
}
