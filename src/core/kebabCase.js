define( function() {
	"use strict";

	var rbigLetter = /[A-Z]/g;

	// Changes camelCase to kebab-case.
	function kebabCase( value ) {
		return value.replace( rbigLetter, "-$&" ).toLowerCase();
	}

	return kebabCase;
} );
