// Regexps
var headersRegExp = /([^:]+):((\n\w|\n\t|[^\n])*)\n/g,
	jsre = /=\?(&|$)/;

	// Transport selector
	transportSelector = function(s) {
		
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
	transportDefinitions = {};

jQuery.transport = {

	// Create an ajax transport
	create: function(implementation, listener) {
		
		// Headers (they are sent all at once)
		var requestHeaders = {},
			// Response headers string
			responseHeadersString,
			// Response headers hasmap
			responseHeaders,
			// State
			// 0: init
			// 1: loading
			// 2: done
			state = 0,
			// Done
			done = function(status, statusText, response, headers) {
				// Cleanup
				implementation = done = undefined;
				// Cache response headers
				responseHeadersString = headers || "";
				// Done
				state = 2;
				// Callback & dereference
				listener(status, statusText, response);
				listener = undefined;
			};
			
		// return the transport object
		return {
			
			// Caches the header
			setRequestHeader: function(name,value) {
				if ( ! state ) {
					requestHeaders[jQuery.trim(name).toLowerCase()] = jQuery.trim(value);
				}
				return this;
			},
			
			// Ditto with an s
			setRequestHeaders: function(map) {
				if (! state ) {
					for ( var name in map ) {
						requestHeaders[jQuery.trim(name).toLowerCase()] = jQuery.trim(map[name]);
					}
				}
				return this;
			},
			
			// Utility method to get headers set
			getRequestHeader: function(name) {
				return requestHeaders[jQuery.trim(name).toLowerCase()];
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
								responseHeaders[jQuery.trim(key).toLowerCase()] = jQuery.trim(value);
							});
						}
					}
					return responseHeaders[jQuery.trim(key).toLowerCase()];
				}
			},
			
			// Initiate the request
			send: function(config) {
				
				if ( ! state ) {
					
					state = 1;
					
					try {
						
						implementation.send(config, requestHeaders, done);
												
					} catch (e) {
						
						done(0, "error", "" + e);
					}
				}
			},
			
			// Cancel the request
			abort: function(statusText) {
				if ( state === 1 ) {
					implementation.abort( statusText || "abort" );
				}
				return this;
			}
		};
	},

	// Install a transport
	install: function(id, definition) {
		jQuery.extend( transportDefinitions[id] = {}, definition );
	},
	
	// Factory entry point (including option filtering)
	newInstance: function(s, complete) {
		
		var definition,
			transport,
			// Get the transport type (use the selector if no type is provided)
			filteredTransport = transportSelector(s);
		
		// Do while we don't have a stable transport type
		do {
			// Set transport to new one
			transport = filteredTransport;
			// Get its definition, halt if it doesn't exist
			if ( ! ( definition = transportDefinitions[transport] ) ) {
				throw "jQuery[transport.newInstance]: No definition for " + transport;
			}
			// Get the filter, call if needs be
			if ( jQuery.isFunction( definition.optionsFilter ) ) {
				filteredTransport = definition.optionsFilter(s) || transport;
			}
			
		} while (filteredTransport!=transport);
		
		// Get the factory, halt if it doesn't exist
		if ( ! jQuery.isFunction( definition.factory ) ) {
			throw "jQuery[transport.newInstance]: No factory for " + transport;
		}
		
		// Create & return a new transport
		return jQuery.transport.create(definition.factory(), complete);
	}
};