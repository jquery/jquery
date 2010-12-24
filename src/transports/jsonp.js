(function( jQuery ) {

var jsc = jQuery.now(),
	jsre = /\=\?(&|$)/,
	rquery_jsonp = /\?/;

// Default jsonp callback name
jQuery.ajaxSettings.jsonpCallback = function() {
	return "jsonp" + jsc++;
};

// Normalize jsonp queries
// 1) put callback parameter in url or data
// 2) sneakily ensure transportDataType is json
// 3) ensure options jsonp is always provided so that jsonp requests are always
//    json request with the jsonp option set
jQuery.xhr.prefilter("json jsonp", function(s) {
	
	var transportDataType = s.dataTypes[ 0 ];
	
	s.dataTypes[ 0 ] = "json";
	
	if ( s.jsonp ||
		transportDataType === "jsonp" ||
		transportDataType === "json" && ( jsre.test(s.url) || typeof(s.data) === "string" && jsre.test(s.data) ) ) {

		var jsonp = s.jsonp = s.jsonp || "callback",
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			url = s.url.replace(jsre, "=" + jsonpCallback + "$1"),
			data = s.url == url && typeof(s.data) === "string" ? s.data.replace(jsre, "=" + jsonpCallback + "$1") : s.data;
			
		if ( url == s.url && data == s.data ) {
			url = url += (rquery_jsonp.test( url ) ? "&" : "?") + jsonp + "=" + jsonpCallback;
		}
		
		s.url = url;
		s.data = data;
	}
	
// Bind transport to json dataType
}).transport("json", function(s) {

	if ( s.jsonp ) {
		
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
				
		// Use data converter to retrieve json after script execution
		s.dataConverters["script json"] = function() {
			if ( ! responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};
		
		// Delegate to script transport
		return "script";
	}
});

})( jQuery );
