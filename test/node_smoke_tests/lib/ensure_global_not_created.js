"use strict";

var assert = require( "assert" );

// Ensure the jQuery property on global/window/module.exports/etc. was not
// created in a CommonJS environment.
// `global` is always checked in addition to passed parameters.
module.exports = function ensureGlobalNotCreated() {
	var args = [].slice.call( arguments ).concat( global );

	args.forEach( function( object ) {
		assert.strictEqual( object.jQuery, undefined,
			"A jQuery global was created in a CommonJS environment." );
	} );
};
