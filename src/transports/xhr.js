// XHR can be used for all data types
jQuery.ajax.bindTransport(function(s) {

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( ! s.crossDomain || jQuery.support.crossDomainRequest === "xhr" ) {
		
		var callback;
		
		return {
			
			send: function(headers, complete) {
				
				var xhr = s.xhr(),
					timer;
				
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
				if ( ! ( s.crossDomain && s.type == "GET" ) && ! headers.hasOwnProperty("x-requested-with") ) {
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
					xhr.send( s.type === "POST" || s.type === "PUT" ? s.data : null );
				} catch(e) {
					complete(0, "error", "" + e);
					xhr = complete = undefined;
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
						
						
						status = xhr.status;
						statusText = xhr.statusText;
						responseHeaders = xhr.getAllResponseHeaders();
						
						// Guess response if needed & update datatype accordingly
						var transportDataType = s.dataTypes[0],
							xml = xhr.responseXML,
							text = xhr.responseText;
							
						if ( transportDataType == "auto" ) { // Auto (xml or text determined given headers)
							
							var ct = xhr.getResponseHeader("content-type"),
								isXML = ct && ct.indexOf("xml") >= 0;
								
							response = isXML ? xml : text;
							s.dataTypes[0] = isXML ? "xml" : "text";
							
							if ( s.dataTypes.length == 1 ) {
								
								s.dataType = s.dataTypes[0];
								
							}
							
						} else if ( transportDataType != "xml" || ! xml ) { // Text asked OR xml not parsed
							
							response = text;
							
							if ( transportDataType != "text" ) {
								s.dataTypes.unshift( "text" );
							}
							
						} else {
							
							response = xml;
							
						}
						
						// Filter status for non standard behaviours
						status =
							status == 0 ?				// Opera returns 0 when status is 304
								304 :
								(
									status == 1223 ?	// IE sometimes returns 1223 when it should be 204 (see #1450)
										204 :
										status
								);
					}
					
					// Clear timer
					if ( timer ) {
						xhrUnpoll(timer);
					}
											
					// Cleanup
					s = xhr = callback = undefined;
					
					// Call complete & dereference
					complete(status,statusText,response,responseHeaders);
					complete = undefined;
				};
				
				if ( !s.async ) {
					
					// in sync mode, we call the callback ourselves
					callback();
					
				} else {
					
					// in async mode, don't attach the handler to the request,
					// just poll it instead: it prevents insane memory leaks in IE
					timer = xhrPoll(callback);
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

var // Performance is seriously hit by setInterval with concurrent requests
	// Yet we have to poll because of some nasty memory leak in IE
	// So we group polling and use a unique timer
	
	// Next fake timer id
	xhrPollingId = now(),
	
	// Number of callbacks being polled
	xhrPollingNb = 0,
	
	// Actual timer
	xhrTimer,
	
	// Callbacks hashtable
	xhrCallbacks = {},
	
	// Add a callback to the poll pool
	xhrPoll = function(functor) {
		
		// Get the id
		var id = xhrPollingId++;
		
		// Store the function
		xhrCallbacks[id] = functor;
		
		// If there was no polling done yet
		if ( ! xhrPollingNb++ ) {
			
			/*
			// TESTING
			var test = 0;
			*/
			
			// Initiate the timer
			xhrTimer = setInterval( function() {
				
				/*
				// TESTING
				test = (test + 1) % 100;
				if (!test) alert("STILL RUNNING");
				*/
				
				// Call all the callbacks
				jQuery.each(xhrCallbacks, function(_,functor) {
					if (functor) {
						functor();
					}
				});
				
			},13)
		}
		
		// Give id back to caller
		return id;
	},
	
	// Remove a callback from the poll pool
	xhrUnpoll = function(id) {
		
		// Remove it the definitive way
		delete xhrCallbacks[id];
		
		// If it was the last one, clear the timer
		if ( ! --xhrPollingNb ) {
			clearInterval(xhrTimer)
		}
	};
	
	
// #5280: we need to abort on unload or IE will keep connections alive
// we use non standard beforeunload so that it only applies to IE
var xhrUnloadAbortMarker = [];

jQuery(window).bind("beforeunload", function() {
	
	// If requests still running
	if ( xhrPollingNb ) {
		
		// Abort them all
		jQuery.each(xhrCallbacks, function(_,functor) {
			if (functor) {
				functor(xhrUnloadAbortMarker);
			}
		});
		
		// Resest polling structure to be safe
		clearInterval( xhrTimer );
		xhrPollingNb = 0;
		xhrCallbacks = {};
	}
});
