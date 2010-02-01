jQuery.xhr.bindTransport(function(s) {

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( ! s.crossDomain || jQuery.support.crossDomainRequest === "xhr" ) {
		
		var callback;
		
		return {
			
			send: function(headers, complete) {
				
				var xhr = s.xhr(),
					handle;
				
				// Open the socket
				// Passing null username, generates a login popup on Opera (#2865)
				if ( s.username ) {
					xhr.open(s.type, s.url, s.async, s.username, s.password);
				} else {
					xhr.open(s.type, s.url, s.async);
				}
				
				// Requested-With header
				// Not set for crossDomain non-GET request
				// (see why at http://trac.dojotoolkit.org/ticket/9486)
				// Won't change header if already provided in beforeSend
				if ( ! ( s.crossDomain && s.type === "GET" ) && ! hasOwnProperty.call(headers,"x-requested-with") ) {
					headers["x-requested-with"] = "XMLHttpRequest";
				}
				
				// Need an extra try/catch for cross domain requests in Firefox 3
				try {
					
					jQuery.each(headers, function(key,value) {
						xhr.setRequestHeader(key,value);
					});
					
				} catch(_) {}
				
				// Do send the request
				try {
					xhr.send( s.type === "POST" || s.type === "PUT" || s.type === "DELETE" ? s.data : null );
				} catch(e) {
					complete(0, "error", "" + e);
					return;
				}
					
				// Listener
				callback = function ( abortStatusText ) {
					
					// Was already called
					// or is neither aborted nor complete
					if ( ! callback || ! abortStatusText && xhr.readyState != 4 ) {
						// ignore
						return;
					}
					
					// Do not listen anymore
					if (handle) {
						xhrUnbind(handle);
						handle = undefined;
					}
					
					callback = undefined;
					
					// Get info
					var status, statusText, response, responseHeaders;
						
					if ( abortStatusText ) {
						
						if ( xhr.readyState != 4 ) {
							xhr.abort();
						}
						
						// Stop here if unloadAbort
						if ( abortStatusText === xhrUnloadAbortMarker ) {
							return;
						}
						
						status = 0;
						statusText = abortStatusText;
						
					} else {
						
						try { // Firefox throws an exception for failing cross-domain requests
							
							status = xhr.status;
							statusText = xhr.statusText;
							responseHeaders = xhr.getAllResponseHeaders();
							
							// Guess response if needed & update datatype accordingly
							response = jQuery.xhr.determineDataType(
								s,
								xhr.getResponseHeader("content-type"),
								xhr.responseText,
								xhr.responseXML );
							
							// Filter status for non standard behaviours
							status =
								status == 0 ?				// Opera returns 0 when status is 304
									(
										! s.crossDomain || statusText ?  // differentiate between 304 and failing cross-domain
											304 :
											404 )
									:
									(
										status == 1223 ?	// IE sometimes returns 1223 when it should be 204 (see #1450)
											204 :
											status
									);
						} catch( e ) {
							
							status = 0;
							statusText = "" + e;
							response = responseHeaders = undefined;
							
						}
					}
					
					// Call complete
					complete(status,statusText,response,responseHeaders);
				};
				
				if ( !s.async ) {
					
					// in sync mode, we call the callback ourselves
					callback();
					
				} else {
					
					// Listener is externalized to handle abort on unload (see below)
					handle = xhrBind(xhr, callback);
				}
			},
			
			abort: function(statusText) {
				if ( callback ) {
					callback(statusText);
				}
			}
		};
	}
});

var // Next fake timer id
	xhrPollingId = now(),
	
	// Callbacks hashtable
	xhrs = {},
	
	// Listen to an xhr
	xhrBind = function( xhr, functor ) {
		
		// Get the id
		var id = xhrPollingId++;
		
		// Store the function
		xhrs[id] = xhr;
		
		// Poll
		xhr.onreadystatechange = function() {
			functor();
		};
		
		// Give id back to caller
		return id;
	},
	
	// Stop listening
	xhrUnbind = function( id ) {
		xhrs[id].onreadystatechange = noop;
		delete xhrs[id];
	};
	

// #5280: we need to abort on unload or IE will keep connections alive
var xhrUnloadAbortMarker = [];

jQuery(window).bind("beforeunload", function() {
	
	// Abort all pending requests
	jQuery.each(xhrs, function(_, xhr) {
		xhr.onreadystatechange(xhrUnloadAbortMarker);
	});
	
	// Resest polling structure to be safe
	xhrs = {};
	
});
