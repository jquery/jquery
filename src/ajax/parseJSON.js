define([
	"../core"
], function( jQuery ) {

// Support: Android 2.3
// Workaround failure to string-cast null input
jQuery.parseJSON = function( data ) {
	if (!data) {
		return null;
	}
	return JSON.parse( data + "" );
};

return jQuery.parseJSON;

});
