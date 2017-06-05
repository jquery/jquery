define( [
	"../core",
	"../event"
], function( jQuery ) {

"use strict";

// Attach a bunch of functions for handling common fey events
jQuery.each( [
	"feyStart",
	"feyStop",
	"feyComplete",
	"feyError",
	"feySuccess",
	"feySend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );

} );
