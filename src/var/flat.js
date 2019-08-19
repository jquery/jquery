define( [
	"./arr",
	"./concat"
], function( arr, concat ) {

"use strict";

return arr.flat ? function() {

	// Flat with depth = 1 to give the same result of concat.apply.
	return arr.flat.call( this, 1 );
} : function() {
	return concat.apply( [], this );
};

} );
