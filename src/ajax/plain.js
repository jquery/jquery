define([
	"../core",
	"../var/document",
	"../ajax"
], function( jQuery ) {

// Install plain dataType
jQuery.ajaxSetup({
	accepts: {
		plain: "text/plain"
	},
	responseFields: {
		plain: "response"
	}
	/* converters: {
		"plain plain": function (arrayBuffer) {
			if (arrayBuffer) {
				return new Uint8Array(arrayBuffer);
			}
		}
	} /**/
});

jQuery.ajaxPrefilter("plain", function (s /*, originalSettings, jqXHR */) {

	s.xhrFields = {
		responseType: "arraybuffer"
	};
});

/* Bind plain hack transport
jQuery.ajaxTransport("plain", function (s) {
	return {
		send: function (_, complete) {
			complete(
				s.response,
				s.statusText,
				s
			);
		}
	};
}); /**/

});
