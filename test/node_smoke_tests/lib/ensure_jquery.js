/* jshint node: true */

"use strict";

// Check if the object we got is the jQuery object by invoking a basic API.
module.exports = function ensureJQuery( jQuery ) {
	if ( !/^jQuery/.test( jQuery.expando ) ) {
		console.error( "jQuery.expando was not detected, the jQuery bootstrap process has failed" );
		process.exit( 1 );
	}
};
