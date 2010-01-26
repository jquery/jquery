// Creates a jQuery xhr object
jQuery.xhr = function( _native ) {
	
	if ( _native ) {
		return jQuery.ajaxSettings.xhr();
	}
	
	function reset(force) {
		
		// We only need to reset if we went through the init phase
		// (with the exception of object creation)
		if ( ! force && ! internal ) {
			return;
		}
		
		// Reset callbacks lists
		callbacksLists = {
			success: createCBList(function(func) {
				return func.call(callbackContext,success,statusText,xhr);
			}),
			error: createCBList(function(func) {
				return func.call(callbackContext,xhr,statusText,error);
			}),
			complete: createCBList(function(func) {
				return func.call(callbackContext,xhr,statusText);
			})
		};
		
		// Reset private variables
		requestHeaders = {};
		responseHeadersString = responseHeaders = internal = done
			= status = statusText = success = error = timeoutTimer = s = undefined;
		
		// Reset state
		xhr.readyState = 0;
		sendFlag = 0;
		
		// Remove responseX fields
		for ( var name in xhr ) {
			if ( /^response/.test(name) ) {
				delete xhr[name];
			}
		}
	}
	
	function init() {
		
		var i,
			length,
			originalContentType = s.contentType,
			parts = rurl.exec( s.url ),
			prefilters = s.prefilters,
			transportDataType;

		// Uppercase the type
		s.type = s.type.toUpperCase();
		
		// Datatype
		if ( ! s.dataType ) {
			s.dataType = "*";
		}
		if ( ! jQuery.isArray( s.dataTypes ) || ! s.dataTypes.length ) {
			s.dataTypes = [s.dataType];
		}
		for ( i = 0, length = s.dataTypes.length ; i < length ; i++ ) {
			s.dataTypes[i] = s.dataTypes[i].toLowerCase();
		}
		s.dataType = s.dataTypes[s.dataTypes.length-1];
		
		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data != "string" ) {
			s.data = jQuery.param( s.data , s.traditional );
		}
		
		// Determine if a cross-domain request is in order
		s.crossDomain = !!( parts && ( parts[1] && parts[1] != location.protocol || parts[2] != location.host ) );
		
		// Apply option prefilters
		for (i in prefilters) {
			prefilters[i](s);
		}
		
		// Get internal
		internal = jQuery.xhr.selectTransport(s);
		
		// Stop here is no transport was found
		if ( ! internal ) {
			jQuery.error("jQuery.xhr: no transport found for " + s.dataTypes[0]);
		}
		
		// Set dataType to proper value (in case transport filters changed it)
		// And get transportDataType
		s.dataType = s.dataTypes[s.dataTypes.length-1];
		transportDataType = s.dataTypes[0];
		
		// More options handling for GET requests
		if (s.type === "GET") {
			
			// If data is available, append data to url for get requests
			if ( s.data ) {
				s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
			}
							
			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				
				var ts = now(),
					// try replacing _= if it is there
					ret = s.url.replace(rts, "$1_=" + ts + "$2");
					
				// if nothing was replaced, add timestamp to the end
				s.url = ret + ((ret == s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
			}
		}
		
		// Watch for a new set of requests
		if ( s.global && ! jQuery.active++ ) {
			jQuery.event.trigger( "ajaxStart" );
		}
		
		// Set the correct header, if data is being sent
		if ( s.data || originalContentType ) {
			requestHeaders["content-type"] = s.contentType;
		}
	
		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[s.url] ) { 
				requestHeaders["if-modified-since"] = jQuery.lastModified[s.url];
			}
			if ( jQuery.etag[s.url] ) {
				requestHeaders["if-none-match"] = jQuery.etag[s.url];
			}
		}
	
		// Set the Accepts header for the server, depending on the dataType
		requestHeaders["accept"] = transportDataType && s.accepts[ transportDataType ] ?
			s.accepts[ transportDataType ] + ( transportDataType !== "*" ? ( ", " + s.accepts[ "*" ] ) : "" ) :
			s.accepts[ "*" ];
			
		// Check for headers option
		if ( s.headers ) {
			xhr.setRequestHeaders( s.headers );
		}
		
		callbackContext = s.context || s;
		globalEventContext = s.context ? jQuery(s.context) : jQuery.event;
		
		for ( i in callbacksLists ) {
			callbacksLists[i].bind(s[i]);
		}
		
		done = whenDone;
	}
	
	function whenDone(_status, _statusText, response, _headers) {
		
		// Called once
		done = undefined;
		
		// Reset sendFlag
		sendFlag = 0;
		
		// Cache response headers
		responseHeadersString = _headers || "";

		// Clear timeout if it exists
		if ( timeoutTimer ) {
			clearTimeout(timeoutTimer);
		}
		
		// Really completed?
		if ( _status && s.async ) {
			setState( 2 );
			setState( 3 );
		}
		
		// Store values
		status = _status;
		statusText = _statusText;
		
		// Knowing if it's a success
		var isSuccess = 0;

		// If not timeout, force a jQuery-compliant status text
		if ( statusText != "timeout" ) {
			statusText = ( status >= 200 && status < 300 ) ? 
				"success" :
				( status==304 ? "notmodified" : "error" );
		}
		
		// If successful, handle type chaining
		if ( statusText === "success" || statusText === "notmodified" ) {
			
			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				var lastModified = xhr.getResponseHeader("Last-Modified"),
					etag = xhr.getResponseHeader("Etag");
					
				if (lastModified) {
					jQuery.lastModified[s.url] = lastModified;
				}
				if (etag) {
					jQuery.etag[s.url] = etag;
				}
			}
			
			if ( s.ifModified && statusText === "notmodified" ) {
				
				success = null;
				isSuccess = 1;
				
			} else {
				// Chain data conversions and determine the final value
				// (if an exception is thrown in the process, it'll be notified as an error)
				try {
					
					function checkData(data) {
						if ( data !== undefined ) {
							var testFunction = s.dataCheckers[srcDataType];
							if ( jQuery.isFunction( testFunction ) ) {
								testFunction(data);
							}
						}
					}
					
					function convertData (data) {
						var conversionFunction = s.dataConverters[srcDataType+" => "+destDataType]
								|| s.dataConverters["* => "+destDataType],
							noFunction = ! jQuery.isFunction( conversionFunction );
						if ( noFunction ) {
							if ( srcDataType != "text" && destDataType != "text" ) {
								// We try to put text inbetween
								var first = s.dataConverters[srcDataType+" => text"]
										|| s.dataConverters["* => text"],
									second = s.dataConverters["text => "+destDataType]
										|| s.dataConverters["* => "+destDataType],
									areFunctions = jQuery.isFunction( first ) && jQuery.isFunction( second );
								if ( areFunctions ) {
									conversionFunction = function (data) {
										return second( first ( data ) );
									}
								}
								noFunction = ! areFunctions;
							}
							if ( noFunction ) {
								jQuery.error("jQuery.xhr: no data converter between "
									+ srcDataType + " and " + destDataType);
							}
							
						}
						return conversionFunction(data);
					}
					
					var i,
						length,
						data = response,
						srcDataType,
						destDataType,
						responseTypes = s.xhrResponseFields;
						
					for ( i = 0, length = s.dataTypes.length ; i < length ; i++ ) {
	
						destDataType = s.dataTypes[i];
						
						if ( !srcDataType ) { // First time
							
							// Copy type
							srcDataType = destDataType;
							// Check
							checkData(data);
							// Apply dataFilter
							if ( jQuery.isFunction( s.dataFilter ) ) {
								data = s.dataFilter(data, s.dataType);
								// Recheck data
								checkData(data);
							}
							
						} else { // Subsequent times
							
							// handle auto
							// JULIAN: for reasons unknown to me === doesn't work here
							if (destDataType == "*") {
	
								destDataType = srcDataType;
								
							} else if ( srcDataType != destDataType ) {
								
								// Convert
								data = convertData(data);
								// Copy type & check
								srcDataType = destDataType
								checkData(data);
								
							}
							
						}
	
						// Copy response into the xhr if it hasn't been already
						var responseDataType,
							responseType = responseTypes[srcDataType];
						
						if ( responseType ) {
							
							responseDataType = srcDataType;
							
						} else {
							
							responseType = responseTypes[ responseDataType = "text" ];
							
						}
							
						if ( responseType !== 1 ) {
							xhr[ "response" + responseType ] = data;
							responseTypes[ responseType ] = 1;
						}
						
					}
	
					// We have a real success
					success = data;
					isSuccess = 1;
					
				} catch(e) {
					
					statusText = "parsererror";
					error = "" + e;
					
				}
			}
			
		} else { // if not success, mark it as an error
			
				error = _statusText || statusText;
				
		}
			
		// Set data for the fake xhr object
		xhr.status = status;
		xhr.statusText = statusText;
				
		// Success
		callbacksLists.success.empty(isSuccess);
		if ( isSuccess && s.global ) {
			globalEventContext.trigger( "ajaxSuccess", [xhr, s] );
		}
		// Error
		callbacksLists.error.empty(!isSuccess);
		if ( !isSuccess && s.global ) {
			globalEventContext.trigger( "ajaxError", [xhr, s, error] );	
		}
		// Complete
		callbacksLists.complete.empty(true);
		if ( s.global ) {
			globalEventContext.trigger( "ajaxComplete", [xhr, s] );
		}
		// Handle the global AJAX counter
		if ( s.global && ! --jQuery.active ) {
			jQuery.event.trigger( "ajaxStop" );
		}
		
		// We're done
		setState( 4 );			
	}
	
	// Ready state control
	function checkState( expected , test ) {
		if ( expected !== true && ( expected === false || test === false || xhr.readyState !== expected ) ) {
			jQuery.error("INVALID_STATE_ERR");
		}
	}
	
	// Ready state change
	function setState( value ) {
		xhr.readyState = value;
		if ( jQuery.isFunction( xhr.onreadystatechange ) ) {
			xhr.onreadystatechange();
		}
	}
	
	// Reset methods (see beforeSend in xhr.send)
	function resetMethods() {
		for (name in xhrMethodSave) {
			xhr[name] = xhrMethodSave[name];
		}
	}
	
	var // Options object
		s,
		// Scoped resulting data
		status,
		statusText,
		success,
		error,
		// Callback stuff
		callbackContext,
		globalEventContext,
		callbacksLists,
		// Headers (they are sent all at once)
		requestHeaders,
		// Response headers
		responseHeadersString,
		responseHeaders,
		// Done callback
		done,
		// transport
		internal,
		// timeout handle
		timeoutTimer,
		// The send flag
		sendFlag,
		// Fake xhr
		xhr = {
			// state
			readyState: 0,
			
			// Callback
			onreadystatechange: null,
			
			// Open
			open: function(type, url, async, username, password) {
				
				xhr.abort();
				reset();
				
				s = {
					type: type,
					url: url,
					async: async,
					username: username,
					password: password
				};
				
				setState(1);
				
				return this;
			},
			
			// Send
			send: function(data, moreOptions) {
				
				checkState(1 , !sendFlag);
				
				s.data = data;
				
				s = jQuery.extend( true,
					{},
					jQuery.ajaxSettings,
					s,
					moreOptions || ( moreOptions === false ? { global: false } : {} ) );
					
				if ( moreOptions ) {
					// We force the original context
					// (plain objects used as context get extended)
					s.context = moreOptions.context;
				}
				
				init();
				
				// Allow custom headers/mimetypes and early abort
				if ( s.beforeSend ) {
					
					var _s = s,
						aborted = 0,
						beforeSend = s.beforeSend;
					
					// Now this IS tricky:
					// We proxy the open, send and abort methods to know
					// if this current send has to continue.
					jQuery.each(["open","send","abort"], function(_,name) {
						xhr[name] = function() {
							aborted = 1;
							resetMethods();
							xhr[name].apply(xhr, arguments);
						};
					});
					
					// Also, we remove the beforeSend from the options
					// because it could be triggered twice by a new call to send
					s.beforeSend = null;
					
					if ( beforeSend.call(callbackContext, xhr, s) === false || aborted ) {
						
						// Put beforeSend back in
						_s.beforeSend = beforeSend;
						
						// Abort if not done
						if ( ! aborted ) {
							resetMethods();
							xhr.abort();
						}
	
						// Handle the global AJAX counter
						if ( _s.global && ! --jQuery.active ) {
							jQuery.event.trigger( "ajaxStop" );
						}
						
						return false;
					}
					
					// Put beforeSend back in
					s.beforeSend = beforeSend;
						
					resetMethods();
				}
				
				sendFlag = 1;
				
				// Send global event
				if ( s.global ) {
					globalEventContext.trigger("ajaxSend", [xhr, s]);
				}
				
				// Timeout
				if ( s.async && s.timeout > 0 ) {
					timeoutTimer = setTimeout(function(){
						xhr.abort("timeout");
					}, s.timeout);
				}
				
				if ( s.async ) {
					setState(1);
				}
				
				try {
					
					internal.send(requestHeaders, done);
					return xhr;
											
				} catch (e) {
					
					if ( done ) {
						
						done(0, "error", "" + e);
						
					} else {
						
						jQuery.error(e);
						
					}
				}
				
				return false;
			},
			
			// Caches the header
			setRequestHeader: function(name,value) {
				checkState(1, !sendFlag);
				requestHeaders[jQuery.trim(name).toLowerCase()] = jQuery.trim(value);
				return xhr;
			},
			
			// Ditto with an s
			setRequestHeaders: function(map) {
				checkState(1, !sendFlag);
				for ( var name in map ) {
					requestHeaders[jQuery.trim(name).toLowerCase()] = jQuery.trim(map[name]);
				}
				return xhr;
			},
			
			// Utility method to get headers set
			getRequestHeader: function(name) {
				checkState(1, !sendFlag);
				return requestHeaders[jQuery.trim(name).toLowerCase()];
			},
			
			// Raw string
			getAllResponseHeaders: function() {
				return xhr.readyState <= 1 ? "" : responseHeadersString;
			},
			
			// Builds headers hashtable if needed
			getResponseHeader: function(key) {
				if ( xhr.readyState <= 1 ) {
					return null;
				}
				if ( responseHeaders === undefined ) {
					responseHeaders = {};
					if ( typeof responseHeadersString === "string" ) {
						responseHeadersString.replace(rheaders, function(_, key, value) {
							responseHeaders[jQuery.trim(key).toLowerCase()] = jQuery.trim(value);
						});
					}
				}
				return responseHeaders[jQuery.trim(key).toLowerCase()];
			},
			
			// Cancel the request
			abort: function(statusText) {
				if (internal) {
					internal.abort( statusText || "abort" );
				}
				xhr.readyState = 0;
			}
		},
		// Store methods
		// (see beforeSend in xhr.send)
		xhrMethodSave = {
			open: xhr.open,
			send: xhr.send,
			abort: xhr.abort	
		};
		
	// Init data (so that we can bind callbacks early
	reset(1);

	// Install callbacks related methods
	jQuery.each(["bind","unbind"], function(_, name) {
		xhr[name] = function(type) {
			var functors = Array.prototype.slice.call(arguments,1), list;
			jQuery.each(type.split(/\s+/g), function() {
				if ( list = callbacksLists[this] ) {
					list[name].apply(list, functors );
				}
			});
			return this;
		};
	});

	jQuery.each(callbacksLists, function(name) {
		var list;
		xhr[name] = function() {
			if ( list = callbacksLists[name] ) {
				list.bind.apply(list, arguments );
			}
			return this;
		};
	});
	
	// Return the xhr emulation
	return xhr;
}

// Create a callback list
function createCBList(fire) {
	
	var functors = [],
		list = {
		
			empty: function(doFire) {
				
				// Inhibit methods
				for (var i in list) {
					list[i] = noop;
				}
				
				// Fire callbacks if needed
				if ( doFire ) {
					list.bind = function() {
						jQuery.each( arguments, function(_, func) {
							if ( jQuery.isArray(func) ) {
								list.bind.apply(list,func);
							} else if ( fire(func)===false ) {
								list.bind = noop;
							}
							return list.bind !== noop;
						});
					};
					list.bind(functors);
				}
			},
			
			bind: function() {
				
				jQuery.each( arguments, function(_, func) {
					
					if ( jQuery.isArray(func) ) {
						
						list.bind.apply(list,func);
						
					} else if ( jQuery.isFunction(func) ) {
						
						// Avoid double binding
						for (var i = 0, length = functors.length; i < length; i++) {
							if ( functors[i] === func ) {
								return;
							}
						}
						
						// Add 
						functors.push(func);
					}
				});
			},
			
			unbind: function(func) {
				
				if ( ! arguments.length ) {
					
					functors = [];
				
				} else {
					
					jQuery.each( arguments, function (_, func) {
						if ( jQuery.isArray(func) ) {
							list.unbind.apply(list,func);
						} else if ( jQuery.isFunction(func) ) {
							for (var i = 0, length = functors.length; i < length; i++) {
								if ( functors[num] === func ) {
									functors.splice(num,1);
									break;
								}
							}
						}
					});
				
				}
			}
			
		};
	
	return list;
}

jQuery.extend(jQuery.xhr, {
	
	// Add new prefilter
	prefilter: function (functor) {
		if ( jQuery.isFunction(functor) ) {
			var prefilters = jQuery.ajaxSettings.prefilters;
			for ( var i=0, length = prefilters.length; i < length; i++ ) {
				if ( prefilters[i] === functor ) return this;
			}
			prefilters.push(functor);
		}
		return this;
	},
	
	// Bind a transport to one or more dataTypes
	bindTransport: function () {
		
		var self = this,
			i,
			start,
			length = arguments.length,
			dataTypes,
			functors,
			functor,
			first,
			append,
			list,
			transports = jQuery.ajaxSettings.transports;
			
		if ( ! length ) return self;
			
		if ( jQuery.isFunction( arguments[0] ) ) {
			dataTypes = ["*"];
			start = 0;
		} else {
			dataTypes = arguments[0].toLowerCase().split(/\s+/);
			start = 1;
		}
		
		if ( ! dataTypes.length || start == length ) return self;
	
		functors = [];
		
		for ( i = start; i < length; i++ ) {
			functor = arguments[i];
			if ( jQuery.isFunction(functor) ) {
				functors.push( functor );
			}
		}
				
		if ( ! functors.length ) return self;
					
		jQuery.each ( dataTypes, function( _, dataType) {
			
			first = /^\+/.test( dataType );
			
			if (first) {
				dataType = dataType.substr(1);
			}
			
			if ( dataType === "" ) return;
			
			append = first ? Array.prototype.unshift : push;
			
			list = transports[dataType];

			jQuery.each ( functors, function( _, functor) {
					
				if ( ! list ) {
					
					list = transports[dataType] = [functor];
					
				} else {
					
					for ( i in list ) {
						if ( list[i] === functor ) {
							return;
						}
					}
					
					append.call(list, functor);
				}
			});
						
		});
		
		return self;
	},
	
	// Select a transport given options
	selectTransport: function(s) {
		
		var transportDataType = s.dataTypes[0],
			dataTypes = transportDataType === "*" ? [ transportDataType ] : [ transportDataType , "*" ],
			transportsList,
			internal,
			i,
			length;
			
		jQuery.each( dataTypes, function(_, dataType) {
			transportsList = s.transports[dataType];
			if ( transportsList && ( length = transportsList.length ) ) {
				for ( i = 0; i < length; i++) {
					internal = transportsList[i](s);
					if (internal) {
						return false;
					} else {
						// If we got redirected to another dataType
						// Search there
						if ( s.dataTypes[0] != dataTypes[0] ) {
							internal = jQuery.xhr.selectTransport(s);
							return false;
						}
					}
				}
			}
		});
		
		return internal;
	},
	
	// Utility function that handles dataType when response is received
	// (for those transports that can give text or xml responses)
	autoFetchDataType: function( s , ct , text , xml ) {
		
		var autoFetching = s.autoFetching,
			type,
			regexp,
			dataTypes = s.dataTypes,
			transportDataType = dataTypes[0],
			response;
		
		if ( transportDataType === "*" ) { // Auto (xml, json, script or text determined given headers)
	
			for ( type in autoFetching ) {
				if ( ( regexp = autoFetching[ type ] ) && regexp.test( ct ) ) {
					transportDataType = dataTypes[0] = type;
					if ( dataTypes.length === 1 ) {
						s.dataType = transportDataType;
					}
					break;
				}
			}
			
		} 
		
		if ( transportDataType === "xml" && xml ) { // xml and parsed as such
			
			response = xml;
			
		} else { // Text response was provided
			
			response = text;
			
			// If it's not really text, defer to dataConverters
			if ( transportDataType != "text" ) {
				dataTypes.unshift( "text" );
			}
			
		}
		
		return response;
	}	
});

