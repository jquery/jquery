var // Types xhr can handle natively
	xhrHandledTypes = {
		"auto": 1,
		"text": 1,
		"xml": 1
	},
	
	// Performance is seriously hit by setInterval with concurrent requests
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
			
			// FOR TEST ONLY
			// var test = 0;
			
			// Initiate the timer
			xhrTimer = setInterval( function() {
				
				// FOR TEST ONLY
				// test = (test + 1) % 100;
				// if (!test) alert("STILL RUNNING");
				
				// Call all the callbacks
				jQuery.each(xhrCallbacks, function(_,functor) {
					functor();
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
		
		// Put text type if needed
		if ( ! xhrHandledTypes[ s.dataTypes[0] ] ) {
			s.dataTypes.unshift("text");
		}
		
	},
	
	factory: function() {
		
		var abortStatusText;
		
		return {
			
			send: function(s, headers, complete) {
				
				var xhr = s.xhr();
				
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
				var timer,
					callback = function() {
						
						// Not aborted and not complete => ignore
						if ( ! abortStatusText && xhr.readyState != 4 ) {
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
							
							// Guess response if needed & update datatype if "auto"
							var dataType = s.transportDataType,
								ct = xhr.getResponseHeader("content-type"),
								xml = dataType === "xml" || dataType=="auto" && ct && ct.indexOf("xml") >= 0,
								response = xml ? xhr.responseXML : xhr.responseText;
								
							if (dataType=="auto") {
								s.dataTypes[0] = s.transportDataType = xml ? "xml" : "text";
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
				abortStatusText = statusText;
			}
			
		};
		
	}
});