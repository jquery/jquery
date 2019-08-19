define( [
	"./arr",
	"./concat"
], function( arr, concat ) {

"use strict";

// Support: IE, chrome < 69, firefox < 62, opera < 56, safari < 12
// Provide fallback for browsers without Array#flat.
return arr.flat ? function( array ) {

	// Flat with depth = 1 to give the same result of concat.apply.
	return arr.flat.call( array, 1 );
} : function( array ) {
	return concat.apply( [], array );
};

} );
