define( [
	"./arr",
	"./concat"
], function( arr, concat ) {

"use strict";

// Support: IE, chrome < 69, firefox < 62, opera < 56, safari < 12
// IE and other browsers earlier versions doesn't have `flat` method
return arr.flat ? function() {

	// Flat with depth = 1 to give the same result of concat.apply.
	return arr.flat.call( this, 1 );
} : function() {
	return concat.apply( [], this );
};

} );
