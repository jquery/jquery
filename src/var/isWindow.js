define( function() {
	"use strict";

	return function isWindow( obj ) {
		return obj !== null && typeof obj !== "undefined" && obj === obj.window;
	};

} );
