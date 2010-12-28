(function( jQuery ) {

// Install text to script executor
jQuery.extend( true, jQuery.ajaxSettings , {

	accepts: {
		script: "text/javascript, application/javascript"
	},
	
	contents: {
		script: /javascript/
	},
		
	converters: {
		"text script": jQuery.globalEval
	}
} );

// Bind script tag hack transport
jQuery.ajax.transport("script", function(s) {
	
	// Handle cache special case
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	
	// This transport only deals with cross domain get requests
	if ( s.crossDomain && s.async && ( s.type === "GET" || ! s.data ) ) {
		
		s.global = false;
		
		var script,
			head = document.getElementsByTagName("head")[0] || document.documentElement;
		
		return {
			
			send: function(_, callback) {

				script = document.createElement("script");

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}
				
				script.src = s.url;
				
				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function(statusText) {
					
					if ( (!script.readyState ||
							script.readyState === "loaded" || script.readyState === "complete") ) {
								
						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;
						
						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}
						
						script = undefined;
						
						// Callback & dereference
						callback(statusText ? 0 : 200, statusText || "success");
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},
			
			abort: function(statusText) {
				if ( script ) {
					script.onload(statusText);
				}
			}
		};
	}
});

})( jQuery );
