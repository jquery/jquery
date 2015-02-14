define([
	"../ajax"
], function( jQuery ) {

jQuery._evalUrl = function( url ) {
	return jQuery.ajax({
		url: url,
		type: "GET",
		dataType: "script",
		cache: true,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		async: false,
		global: false,
		"throws": true
	});
};

return jQuery._evalUrl;

});
