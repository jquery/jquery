// XDR
jQuery.ajax.bindTransport( function (s) {
	
	// Only for cross domain when it is supported through XDomainRequest
	if ( s.crossDomain && jQuery.support.crossDomainRequest == "xdr" ) {
	
		// Timeout is handled by the implementation
		if ( s.timeout ) {
			s.xDomainRequestTimeout = s.timeout;
			s.timeout = null;
		}
		
		var xdr,
			abortStatusText;
			
		return {
			
			send: function(_, complete) {
				
				var done = function(status,statusText,response,responseHeaders) {
					// Cleanup (IE wants null for event handlers, not undefined)
					xdr.onerror = xdr.onload = xdr.ontimeout = null;
					xdr = undefined;
					// Complete & dereference
					complete(status,statusText,response,responseHeaders);
				};
				
				xdr = new XDomainRequest();
				xdr.open(s.type,s.url);
				
				xdr.onerror = function() {
					done(abortStatusText ? 0 : 404, abortStatusText || "error");
				};
				
				xdr.onload = function() {
					done(
						200,
						"success",
						handleDataTypes( s , xdr.contentType , xdr.responseText ),
						"Content-type: " + xdr.contentType
					);
				};
				
				if ( s.xDomainRequestTimeout ) {
					xdr.ontimeout = function() {
						done(0, "timeout");
					};
					xdr.timeout = s.xDomainRequestTimeout;
				}
					
				try {
					
					xdr.send( s.type === "POST" || s.type === "PUT" ? s.data : null );
					
				} catch(e) {
					
					done(0, "error", "" + e);
					
				}
				
			},
			
			abort: function(statusText) {
				if ( xdr ) {
					abortStatusText = statusText;
					xdr.abort();
				}
			}	
		}	
	}
});
