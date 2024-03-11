import assert from "node:assert/strict";

// Ensure the jQuery property on global/window/module "this"/etc. was not
// created in a CommonJS environment.
// `global` is always checked in addition to passed parameters.
export const ensureGlobalNotCreated = ( ...args ) => {
	[ ...args, global ].forEach( function( object ) {
		assert.strictEqual( object.jQuery, undefined,
			"A jQuery global was created in a module environment." );
	} );
};
