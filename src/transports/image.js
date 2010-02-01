// Where the response will be put in the xhr
jQuery.ajaxSettings.xhrResponseFields.image = "Object";

// Image preloading transport
jQuery.xhr.bindTransport("image", function(s) {

	// Only for get & async requests
	if ( ( s.type === "GET" || ! s.data ) && s.async ) {
		
		var image;
			
		return {
			
			send: function(_, callback) {
				
				image = new Image();
				
				var done = function(status, statusText) {
					if (image) {
						
						statusText = status == 200 ? "success" : ( statusText || "error" );
						
						// IE wants null, not undefined
						image.onreadystatchange = image.onerror = image.onload = null;
						
						var tmp = image;
						
						image = undefined;
						
						callback(status, statusText, tmp);
					}
				};
				
				image.onreadystatechange = image.onload = function() {
					done(200);
				};
				
				image.onerror = function(statusText) {
					done(statusText ? 0 : 404, statusText);
				};
				
				image.src = s.url;
			},
			
			abort: function(statusText) {
				if ( image ) {
					image.onerror(statusText);
				}
			}
		};
	}
});
