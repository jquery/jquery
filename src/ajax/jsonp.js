(function( jQuery ) {

var jsc = jQuery.now(),
	jsre = /(\=)(?:\?|%3F)(&|$)|()(?:\?\?|%3F%3F)()/i,
	rquery_jsonp = /\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return "jsonp" + jsc++;
	}

// Detect, normalize options and install callbacks for jsonp requests
}).ajaxPrefilter("json jsonp", function(s, originalSettings) {

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		originalSettings.jsonp ||
		originalSettings.jsonpCallback ||
		jsre.test(s.url) ||
		typeof(s.data) === "string" && jsre.test(s.data) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url.replace(jsre, "$1" + jsonpCallback + "$2"),
			data = s.url === url && typeof(s.data) === "string" ? s.data.replace(jsre, "$1" + jsonpCallback + "$2") : s.data;

		if ( url === s.url && data === s.data ) {
			url += (rquery_jsonp.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
		}

		s.url = url;
		s.data = data;

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

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( ! responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});

})( jQuery );
