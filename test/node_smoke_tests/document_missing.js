/* jshint node: true */

"use strict";

var ensureGlobalNotCreated = require( "./lib/ensure_global_not_created" ),
	jQueryFactory = require( "../../dist/jquery.js" );

try {
	jQueryFactory( {} );
	console.error( "The jQuery factory should reject window without a document" );
	process.exit( 1 );
} catch ( e ) {
	if ( e.message ===  "jQuery requires a window with a document" ) {
		ensureGlobalNotCreated( module.exports );
		process.exit( 0 );
	}
	console.error( "An unexpected error thrown; message: ", e.message );
	process.exit( 1 );
}
