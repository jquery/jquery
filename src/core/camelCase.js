define( [], function() {

"use strict";

// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
var fcamelCase = function( all, letter ) {
	return letter.toUpperCase();
};

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 13
// Microsoft forgot to hump their vendor prefix (#9572)
var camelCase = function( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
};

return camelCase;

} );
