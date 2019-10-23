import arr from "./arr.js";

// Support: IE 11+, Edge 18+
// Provide fallback for browsers without Array#flat.
export default arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};
