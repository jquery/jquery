var jsc = now();

jQuery.transport.install("jsonp", function(s) {
	
	var jsonp = "jsonp" + jsc++,
		url = s.url.replace(jsre, "=" + jsonp + "$1"),
		data = typeof(s.data)=="string" ? s.data.replace(jsre, "=" + jsonp + "$1") : s.data;
		
	if ( url == s.url && data == s.data ) {
		url = s.url += (rquery.test( s.url ) ? "&" : "?") + (s.jsonp || "callback") + "=" + jsonp;
	}
	
	// Modify config
	s.url = url;
	s.data = data;
	
	// Force cache
	if ( s.cache === null ) {
		s.cache = true;
	}
	
	// Remove current transport dataType
	s.dataTypes.shift();

	// Select
	if ( s.crossDomain && s.type == "GET" ) { // Script tag hack
		
		s.dataTypes.unshift("json");
		s.async = true;
		s.global = false;
		
	} else { // xhr
		
		s.dataTypes.unshift("jsonp","text","json");
		return "xhr";
	}
	
}, function() {
	
	var jsonp;
	
	return {
		
		send: function(s,_,complete) {
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");
				
			jsonp = s.jsonpCallback;
			script.src = s.url;
			
			if ( s.scriptCharset ) {
				script.charset = s.scriptCharset;
			}
			
			window[ jsonp ] = function(response, statusText){
				window[ jsonp ] = undefined;
				try{ delete window[ jsonp ]; } catch(e){}
				if (  head && script.parentNode  ) {
					head.removeChild( script );
				}
				complete(statusText!==undefined ? 0 : 200, statusText || "success", response);
				// Remove cyclic references
				complete = undefined;
			};
			// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
			// This arises when a base node is used (#2709 and #4378).
			head.insertBefore( script, head.firstChild );
		},
		
		abort: function(statusText) {
			if ( window[jsonp] ) {
				window[jsonp](undefined,statusText || "abort");
			}
		}
	};
});