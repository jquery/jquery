define([
	"../core"
], function( jQuery ) {

var rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g;

jQuery.parseJSON = function( data ) {
	// Attempt to parse using the native JSON parser first
	if ( window.JSON && window.JSON.parse ) {
		return window.JSON.parse( data );
	}

	if ( data === null ) {
		return data;
	}

	if ( typeof data === "string" ) {

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		if ( data ) {
			// Make sure the incoming data is actual JSON
			// Logic borrowed from http://json.org/json2.js
			if ( rvalidchars.test( data.replace( rvalidescape, "@" )
				.replace( rvalidtokens, "]" )
				.replace( rvalidbraces, "")) ) {

				return ( new Function( "return " + data ) )();
			}
		}
	}

	jQuery.error( "Invalid JSON: " + data );
};

return jQuery.parseJSON;

});
