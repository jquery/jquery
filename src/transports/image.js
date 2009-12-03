jQuery.transport.install("image", {
	
	optionsFilter : function(s) {
			
		if ( s.cache === null ) {
			s.cache = true;
		}
	
		s.type = "GET";
		s.async = true;
		
	},
	
	factory: function() {
		
		var image,
			abortStatusText;
		
		return {
			
			send: function(s, _, callback) {
	
				image = new Image();
				
				var done = function(status) {
					if (image) {
						var statusText = status ? "success" : ( abortStatusText || "error" ),
							tmp = image;
						// IE complains about onerror & onload
						try {
							image.onerror = image.onload = undefined;
						} catch(e) {}
						image.onreadystatchange = undefined;
						image = undefined;
						callback(status,statusText,tmp);
					}
				};
				
				image.onreadystatechange = image.onload = function() {
					done(202);
				};
				
				image.onerror = function() {
					done(0);
				};
				
				image.src = s.url;
			},
			
			abort: function(statusText) {
				if ( image ) {
					abortStatusText = statusText || "abort";
					image.onerror();
				}
			}
		}
	}
});