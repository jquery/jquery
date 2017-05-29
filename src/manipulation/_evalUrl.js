define( [
	"../fey"
], function( jQuery ) {

"use strict";

jQuery._evalUrl = function( url ) {
	return jQuery.fey( {
		url: url,

		// Make this explicit, since user can override this through feySetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};

return jQuery._evalUrl;

} );
