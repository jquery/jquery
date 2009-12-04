var // Performance is seriously hit by setInterval with concurrent requests
	// Yet we have to poll because of some nasty memory leak in IE
	// So we group polling and use a unique timer
	
	// Next fake timer id
	xhrPollingId = 1,
	
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
		
		// If there were no polling done yet
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


jQuery.transport.install("xhr", {
	
	optionsFilter: function(s) {
		
		// Handle crossDomain mess
		if ( s.crossDomain ) {
			var crossDomain = jQuery.support.crossDomainRequest;
			if (!crossDomain) {
				throw "jQuery[transports/xhr]: cross domain requests not supported";
			}
			if (crossDomain!==true) {
				return crossDomain;
			}
		}
		
	},
	
	factory: function() {
		
		var callback;
		
		return {
			
			send: function(s, headers, complete) {
				
				var xhr = s.xhr(),
					timer;
				
				// Open the socket
				// Passing null username, generates a login popup on Opera (#2865)
				if ( s.username ) {
					xhr.open(s.type, s.url, s.async, s.username, s.password);
				} else {
					xhr.open(s.type, s.url, s.async);
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
					
					// Clear timer
					if ( timer ) {
						xhrUnpoll(timer);
					}
											
					// Get info
					var status, statusText, response, responseHeaders;
						
					if ( abortStatusText ) {
						
						if ( xhr.readyState != 4 ) {
							xhr.abort();
						}
						status = 0;
						statusText = abortStatusText;
						
					} else {
						
						
						status = xhr.status;
						statusText = xhr.statusText;
						responseHeaders = xhr.getAllResponseHeaders();
						
						// Guess response if needed & update datatype accordingly
						var dataType = s.transportDataType,
							xml = xhr.responseXML,
							text = xhr.responseText;
							
						if ( dataType == "auto" ) { // Auto (xml or text determined given headers)
							
							var ct = xhr.getResponseHeader("content-type"),
								isXML = ct && ct.indexOf("xml") >= 0;
								
							response = isXML ? xml : text;
							s.dataTypes[0] = s.transportDataType = isXML ? "xml" : "text";
							
						} else if ( dataType != "xml" || ! xml ) { // Text asked OR xml not parsed
							
							response = text;
							
							if ( dataType != "text" ) {
								s.dataTypes.unshift( s.transportDataType = "text" );
							}
							
						} else {
							
							response = xml;
							
						}
						
						// Filter status for non standard behaviours
						switch (status) {
							
							// Opera returns 0 when status is 304
							case 0:
								status = 304;
								break;
							
							// IE error sometimes returns 1223 when it should be 204, see #1450
							case 1223:
								status = 204;
							
						}
						
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