import { arr } from "./arr.js";

// Support: IE 11+
// IE doesn't have Array#flat; provide a fallback.
export var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};
