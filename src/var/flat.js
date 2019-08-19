define( [
	"./arr"
], function( arr ) {

"use strict";

// Support: IE 11+, Edge 18+
// Provide fallback for browsers without Array#flat.
return arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};

} );
