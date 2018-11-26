define( [
	"../ajax"
], function( jQuery ) {

"use strict";

jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "text",
		cache: true,
		async: false,
		global: false,
		"throws": true,

		// Only evaluate the response if it is successful (gh-4126)
		success: function( text ) {
			jQuery.globalEval( text );
		}
	} );
};

return jQuery._evalUrl;

} );
