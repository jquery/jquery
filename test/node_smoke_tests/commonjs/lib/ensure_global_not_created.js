"use strict";

const assert = require( "assert" );

// Ensure the jQuery property on global/window/module.exports/etc. was not
// created in a CommonJS environment.
// `global` is always checked in addition to passed parameters.
const ensureGlobalNotCreated = ( ...args ) => {
	[ ...args, global ].forEach( function( object ) {
		assert.strictEqual( object.jQuery, undefined,
			"A jQuery global was created in a CommonJS environment." );
	} );
};

module.exports = ensureGlobalNotCreated;
