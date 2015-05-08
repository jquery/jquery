define([
	"../core",
	"../event"
], function( jQuery ) {

// Attach a bunch of functions for handling common AJAX events
[ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ].forEach( function( type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
});

});
