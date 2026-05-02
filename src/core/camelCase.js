// Matches dashed string for camelizing
let rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase
export function camelCase( string ) {
	return string.replace( rdashAlpha, fcamelCase );
}
