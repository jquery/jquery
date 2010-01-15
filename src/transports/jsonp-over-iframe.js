/*
 * JSONP transport over iframe
 * inspired by jquery-jsonp (http://code.google.com/p/jquery-jsonp/)
 */

// Bind transport to json dataType
jQuery.xhr.bindTransport("+json", function(s) {
	
	if ( s.jsonp && s.jsonpOverIFrame && s.async && ( s.type === "GET" || ! s.data ) ) {
		
		// Handle the case when the callback was already defined
		s.success = [function(response) {
			
			var callback = window [ s.jsonpCallback ];
			
			if ( jQuery.isFunction( callback ) ) {
				callback.call( window , response );
			}
			
		},s.success];
		
		// Transport itself
		var done;
		
		return {
			
			send: function(_, complete) {

				// Create an iframe & add it to the document
				var frame = jQuery("<iframe />").appendTo(jQuery("head")),
					tmp = frame[0],
					window = tmp.contentWindow || tmp.contentDocument,
					document = window.document,
					jsonpCallback = s.jsonpCallback,
					errorCallback = jsonpCallback === "E" ? "X" : "E";
				
				if( ! document ) {
					document = window;
					window = document.getParentNode();
				}
				
				function deleteVariable(name) {
					window[name] = undefined;
					try { delete window[name]; } catch(e) {}
				}
				
				done = function(status, statusText, response) {
					done = undefined;
					setTimeout(function() {
						document.open();
						deleteVariable(jsonpCallback);
						deleteVariable(errorCallback);
						document.write("");
						document.close();
						frame.remove();
						complete(status, statusText, response);
					},1);
				};
				
				document.open();
				
				window[jsonpCallback] = function(response) {
					if ( done ) {
						done (200, "success", response);
					}
				};
				
				window[errorCallback] = function(state) {
					if ( done && ( ! state || state === "complete" ) ) {
						done (404, "error");
					}
				};
				
				document.write([
					'<html><head><script src="',
					s.url,'" ',
					(s.scriptCharset?('charset="'+s.scriptCharset+'" '):''),'onload="',
					errorCallback,'()" onreadystatechange="',
					errorCallback,'(this.readyState)"></script></head><body onload="',
					errorCallback,'()"></body></html>'
				].join(""));
				
				document.close();
			},
			
			abort: function(statusText) {
				if (done) {
					done(0, statusText);
				}
			}
			
		};
		
	}
	
});
