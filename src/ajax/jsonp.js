(function( jQuery ) {

var jsc = jQuery.now(),
	jsre = /\=(?:\?|%3F)(&|$)/i,
	rquery_jsonp = /\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return "jsonp" + jsc++;
	}
});

// Normalize jsonp queries
// 1) put callback parameter in url or data
// 2) sneakily ensure transportDataType is always jsonp for jsonp requests
jQuery.ajax.prefilter("json jsonp", function(s, originalSettings) {

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		originalSettings.jsonp ||
		originalSettings.jsonpCallback ||
		jsre.test(s.url) ||
		typeof(s.data) === "string" && jsre.test(s.data) ) {

		var jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			url = s.url.replace(jsre, "=" + jsonpCallback + "$1"),
			data = s.url === url && typeof(s.data) === "string" ? s.data.replace(jsre, "=" + jsonpCallback + "$1") : s.data;

		if ( url === s.url && data === s.data ) {
			url += (rquery_jsonp.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
		}

		s.url = url;
		s.data = data;
		s.dataTypes[ 0 ] = "jsonp";
	}

// Bind transport to jsonp dataType
}).transport("jsonp", function(s) {

	// Put callback in place
	var responseContainer,
		jsonpCallback = s.jsonpCallback,
		previous = window[ jsonpCallback ];

	window [ jsonpCallback ] = function( response ) {
		responseContainer = [response];
	};

	s.complete = [function() {

		// Set callback back to previous value
		window[ jsonpCallback ] = previous;

		// Call if it was a function and we have a response
		if ( previous) {
			if ( responseContainer && jQuery.isFunction ( previous ) ) {
				window[ jsonpCallback ] ( responseContainer[0] );
			}
		} else {
			// else, more memory leak avoidance
			try{ delete window[ jsonpCallback ]; } catch(e){}
		}

	}, s.complete ];

	// Sneakily ensure this will be handled as json
	s.dataTypes[ 0 ] = "json";

	// Use data converter to retrieve json after script execution
	s.converters["script json"] = function() {
		if ( ! responseContainer ) {
			jQuery.error( jsonpCallback + " was not called" );
		}
		return responseContainer[ 0 ];
	};

	// Delegate to script transport
	return "script";
});

})( jQuery );
