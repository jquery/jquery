// Regexps
var headersRegExp = /\s*([^:]+):\s*([^\n]+)\n/g,
	jsre = /=\?(&|$)/;

// Install new configuration data
jQuery.extend(jQuery.ajaxSettings,{
	
	// Transport selector
	transportSelector: function(s) {
		
		var transportDataType = s.dataTypes[0],
			transport = "xhr";
		
		if (transportDataType=="image") {
			
			transport = "image";
			
		} else if (transportDataType=="script") {
			
			transport = "script";
			
		} else if ( transportDataType=="jsonp"
			|| transportDataType=="json" && ( jsre.test(s.url) || jsre.test(s.data) ) ) {
				
			transport = "jsonp";
			
		}
			
		return transport;		
	},
	
	// Transport definitions
	transportDefinitions: {}
	
});

jQuery.transport = {

	// Create an ajax transport
	create: function(implementation, listener) {
		
		// Headers (they are sent all at once)
		var requestHeaders = {},
			// Response headers string
			responseHeadersString,
			// Response headers hasmap
			responseHeaders,
			// Transport is loading
			loading,
			// Done
			done = function(requestStatus, requestStatusText, requestResponse, requestResponseHeaders) {
				// Cleanup
				implementation = undefined;
				// Get response headers
				responseHeadersString = requestResponseHeaders;
				// Not loading anymore
				loading = 0;
				// Callback & dereference
				listener(requestStatus, requestStatusText, requestResponse);
				listener = undefined;
			};
			
		// return the transport object
		return {
			
			// Caches the header
			setRequestHeader: function(name,value) {
				requestHeaders[name] = value;
			},
			
			// Raw string
			getAllResponseHeaders: function() {
				return responseHeadersString;
			},
			
			// Builds headers hashtable if needed
			getResponseHeader: function(key) {
				if ( responseHeadersString !== undefined ) {
					if ( responseHeaders === undefined ) {
						responseHeaders = {};
						if ( typeof responseHeadersString == "string" ) {
							responseHeadersString.replace(headersRegExp, function(_, key, value) {
								responseHeaders[key.toLowerCase()] = value;
							});
						}
					}
					return responseHeaders[key.toLowerCase()];
				}
			},
			
			// Initiate the request
			send: function(config) {
				
				if ( ! loading ) {
					
					loading = 1;
					
					try {
						
						implementation.send(config, requestHeaders, done);
												
					} catch (e) {
						
						done(0, "error", "" + e);
					}
				}
			},
			
			// Cancel the request
			abort: function(statusText) {
				if ( loading ) {
					implementation.abort( statusText || "abort" );
				}
			}
		};
	},

	// Install a transport
	install: function(id, definition) {
		jQuery.extend( jQuery.ajaxSettings.transportDefinitions[id] = {}, definition );
	},
	
	// Factory entry point (including option filtering)
	newInstance: function(s, onComplete) {
		
		var definition, filter, factory, transport,
		
		// Get the transport type (use the selector if no type is provided)
		filteredTransport = s.forceTransport || s.transportSelector(s);
		
		// Do while we don't have a stable transport type
		do {
			// Set transport to new one
			transport = filteredTransport;
			// Get its definition, halt if it doesn't exist
			if ( ! ( definition = s.transportDefinitions[transport] ) ) {
				throw "jQuery[transport.newInstance]: No definition for transport " + transport;
			}
			// Get the filter, call if needs be
			if ( jQuery.isFunction( filter = jQuery.isFunction(definition) ? definition : definition.optionsFilter ) ) {
				filteredTransport = filter(s);
				if (!filteredTransport) {
					filteredTransport = transport;
				}
			}
			
		} while (filteredTransport!=transport);
		
		// Get the factory, halt if it doesn't exist
		if ( ! jQuery.isFunction( factory = definition.factory ) ) {
			throw "jQuery[transport.newInstance]: No factory for transport " + transport;
		}
		
		// Create & return a new transport
		return jQuery.transport.create(factory(), onComplete);
	}
};