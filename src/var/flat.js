define( [
	"./arr",
	"./concat"
], function( arr, concat ) {

"use strict";

// Support: IE 11+, Edge 18+
// Provide fallback for browsers without Array#flat.
return arr.flat ? function( array ) {

	// Flat with depth = 1 to give the same result of concat.apply.
	return arr.flat.call( array );
} : function( array ) {
	return concat.apply( [], array );
};

} );
