/* jshint node: true */

"use strict";

// Ensure the jQuery property on global/window/module.exports/etc. was not
// created in a CommonJS environment.
// `global` is always checked in addition to passed parameters.
module.exports = function ensureGlobalNotCreated() {
	var args = [].slice.call( arguments ).concat( global );

	args.forEach( function( object ) {
		if ( object.jQuery ) {
			console.error( "A jQuery global was created in a CommonJS environment." );
			process.exit( 1 );
		}
	} );
};
