import jQuery from "../core";

jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};
