jQuery.transport.install("image", {
	
	optionsFilter : function(s) {
			
		if ( s.cache === null ) {
			s.cache = true;
		}
	
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
						
						statusText = status ? "success" : ( statusText || "error" );
						
						// IE complains about onerror & onload
						// TODO: Check for leaks :(
						try {
							image.onerror = image.onload = undefined;
						} catch(e) {}
						
						image.onreadystatchange = undefined;
						
						callback(status, statusText, image);
						image = callback = undefined;
					}
				};
				
				image.onreadystatechange = image.onload = function() {
					done(202);
				};
				
				image.onerror = function(statusText) {
					done(0, statusText);
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