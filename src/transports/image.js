jQuery.transport.install("image", {
	
	optionsFilter : function(s) {
			
		s.type = "GET";
		s.async = true;
		
	},
	
	factory: function() {
		
		var image;
		
		return {
			
			send: function(s, _, callback) {
	
				image = new Image();
				
				var done = function(status, statusText) {
					if (image) {
						
						statusText = status == 200 ? "success" : ( statusText || "error" );
						
						// IE wants null, not undefined
						image.onreadystatchange = image.onerror = image.onload = null;
						
						var tmp = image;
						
						image = s = done = undefined;
						
						callback(status, statusText, tmp);
						callback = undefined;
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
		}
	}
});
