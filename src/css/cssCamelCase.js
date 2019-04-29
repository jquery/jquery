define( [
	"../core/camelCase"
], function( camelCase ) {

"use strict";

// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/;

// Convert dashed to camelCase, handle vendor prefixes.
// Used by the css & effects modules.
// Support: IE <=9 - 11+, Edge 12 - 18+
// Microsoft forgot to hump their vendor prefix (#9572)
function cssCamelCase( string ) {
	return camelCase( string.replace( rmsPrefix, "ms-" ) );
}

return cssCamelCase;

} );
