// Regexps
var headersRegExp = /\s*([^:]+):\s*([^\n]+)\n/g,
	jsre = /=\?(&|$)/;

// Install new configuration data
jQuery.extend(jQuery.ajaxSettings,{
	
	// Transport selector
	transportSelector: function(s) {
		
		var transportDataType = s.dataTypes[0],
			transport = "xhr";
		
		if (transportDataType=="script") {
			
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
		var headers = {},
		// Response headers string
		responseHeadersString,
		// Response headers hasmap
		responseHeaders,
		// Status
		// 0: created
		// 1: loading
		// 2: complete
		// 3: aborted
		status = 0,
		// Done
		done = function(requestStatus, requestStatusText, requestResponse) {
			// Get response headers
			responseHeadersString = implementation.getHeaders ?
				implementation.getHeaders() :
				"";
			if ( responseHeadersString === undefined ) {
				responseHeadersString = "";
			}
			// Dereference implementation
			implementation = undefined;
			// Set internal status
			status = 2;
			// Callback
			listener(requestStatus, requestStatusText, requestResponse);
		},
		// The transport object
		transport =  {
			
			setRequestHeader: function(name,value) {
				headers[name] = value;
			},
			
			getAllResponseHeaders: function() {
				return responseHeadersString;
			},
			
			// Builds headers hashtable if needed
			getResponseHeader: function(key) {
				if ( responseHeadersString !== undefined ) {
					if ( responseHeaders === undefined ) {
						responseHeaders = {};
						if (typeof(responseHeadersString)=="string") {
							responseHeadersString.replace(headersRegExp, function(_, key, value) {
								responseHeaders[key.toLowerCase()] = value;
							});
						}
					}
					return responseHeaders[key.toLowerCase()];
				}
			},
			
			send: function(config) {
				
				if (status==0) {
					
					status = 1;
					
					try {
						
						implementation.send(config, headers, done);
												
					} catch (e) {
						
						done(0, "error", "" + e);
					}
				}
			},
			
			abort: function(statusText) {
				if (implementation) {
					implementation.abort(statusText);
					status = 3;
				}
			}
		};
		
		return transport;
	},

	// Install a transport
	install: function(id,optionsFilter,factory) {
		jQuery.ajaxSettings.transportDefinitions[id] = !factory ? optionsFilter : {
			factory: factory,
			optionsFilter: optionsFilter
		};
	},
	
	// Factory entry point (including option filtering)
	newInstance: function(s, onComplete) {
		
		var definition, filter, factory, transport,
		
		// Get the transport type (use the selector if no type is provided)
		filteredTransport = s.transportSelector(s);
		
		// Do while we don't have a stable transport type
		do {
			// Set transport to new one
			transport = filteredTransport;
			// Get its definition, halt if it doesn't exist
			if ( ! ( definition = s.transportDefinitions[transport] ) ) {
				throw "jQuery[transport.newInstance]: No definition for transport " + transport;
			}
			// Get the filter, call if needs be
			if (jQuery.isFunction(filter = jQuery.isFunction(definition) ? definition : definition.optionsFilter)) {
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