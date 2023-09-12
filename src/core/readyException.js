import { jQuery } from "../core.js";

jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};
