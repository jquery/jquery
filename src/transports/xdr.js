(function( jQuery ) {

if ( jQuery.support.crossDomainRequest === "xdr" ) {

	jQuery.xhr.bindTransport( function (s) {
		
		// Only for cross domain
		if ( s.crossDomain && ( ! s.data || typeof s.data === "string" ) ) {
		
			// Timeout is handled by the implementation
			if ( s.timeout ) {
				s.xdrTimeout = s.timeout;
				delete s.timeout;
			}
			
			var xdr,
				abortStatusText;
				
			return {
				
				send: function(_, complete) {
					
					var done = function(status,statusText,response,responseHeaders) {
						// Cleanup (IE wants null for event handlers, not undefined)
						xdr.onerror = xdr.onload = xdr.ontimeout = noop;
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
							jQuery.xhr.determineDataType( s , xdr.contentType , xdr.responseText ),
							"Content-type: " + xdr.contentType
						);
					};
					
					if ( s.xdrTimeout ) {
						xdr.ontimeout = function() {
							done(0, "timeout");
						};
						xdr.timeout = s.xdrTimeout;
					}
						
					try {
						
						xdr.send( s.type === "POST" || s.type === "PUT" || s.type === "DELETE" ? ( s.data || "" ) : "" );
						
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
			};	
		}
	});
	
}

})(jQuery);
