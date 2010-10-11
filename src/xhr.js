(function( jQuery ) {

var rquery = /\?/,
	rhash = /#.*$/,
	rnoContent = /^(?:GET|HEAD|DELETE)$/,
	rts = /([?&])_=[^&]*/,
	rurl = /^(\w+:)?\/\/([^\/?#]+)/,
	
	slice = Array.prototype.slice;
	
// Creates a jQuery xhr object
jQuery.xhr = function( _native ) {
	
	if ( _native ) {
		return jQuery.ajaxSettings.xhr();
	}
	
	function reset(force) {
		
		// We only need to reset if we went through the init phase
		// (with the exception of object creation)
		if ( force || internal ) {
		
			// Reset callbacks lists
			callbacksLists = {
				success: createCBList(),
				error: createCBList(),
				complete: createCBList()
			};
			
			// Reset private variables
			requestHeaders = {};
			responseHeadersString = responseHeaders = internal = done = timeoutTimer = s = undefined;
			
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
	}
	
	function init() {
		
		var i,
			length,
			originalContentType = s.contentType,
			parts = rurl.exec( s.url ),
			prefilters = s.prefilters,
			transportDataType;

		// Remove hash character
		s.url = s.url.replace( rhash, "" );
			
		// Uppercase the type
		s.type = s.type.toUpperCase();
		
		// No content?
		s.hasContent = ! rnoContent.test( s.type );
		
		// Datatype
		if ( ! s.dataType ) {
			s.dataTypes = ["*"];
		} else {
			s.dataTypes = jQuery.trim(s.dataType).toLowerCase().split(/\s+/);
		}
		
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
		
		// If internal was found
		if ( internal ) {
		
			// Get transportDataType
			transportDataType = s.dataTypes[0];
			
			// More options handling for GET requests
			if (s.type === "GET") {
				
				// If data is available, append data to url for get requests
				if ( s.data ) {
					s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
				}
								
				// Add anti-cache in url if needed
				if ( s.cache === false ) {
					
					var ts = jQuery.now(),
						// try replacing _= if it is there
						ret = s.url.replace(rts, "$1_=" + ts );
						
					// if nothing was replaced, add timestamp to the end
					s.url = ret + ((ret == s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
				}
			}
			
			// Set the correct header, if data is being sent
			if ( ( s.data && s.hasContent ) || originalContentType ) {
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
			requestHeaders.accept = transportDataType && s.accepts[ transportDataType ] ?
				s.accepts[ transportDataType ] + ( transportDataType !== "*" ? ", */*; q=0.01" : "" ) :
				s.accepts[ "*" ];
				
			// Check for headers option
			if ( s.headers ) {
				xhr.setRequestHeaders( s.headers );
			}
			
		}
			
		callbackContext = s.context || s;
		globalEventContext = s.context ? jQuery(s.context) : jQuery.event;
		
		for ( i in callbacksLists ) {
			callbacksLists[i].bind(s[i]);
		}
		
		// Watch for a new set of requests
		if ( s.global && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}
		
		done = whenDone;
	}
	
	function whenDone(status, statusText, response, headers) {
		
		// Called once
		done = undefined;
		
		// Reset sendFlag
		sendFlag = 0;
		
		// Cache response headers
		responseHeadersString = headers || "";

		// Clear timeout if it exists
		if ( timeoutTimer ) {
			clearTimeout(timeoutTimer);
		}
		
		var // is it a success?
			isSuccess = 0,
			// Stored success
			success,
			// Stored error
			error = statusText;

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
						var conversionFunction = dataConverters[srcDataType+" => "+destDataType] ||
								dataConverters["* => "+destDataType],
							noFunction = ! jQuery.isFunction( conversionFunction );
						if ( noFunction ) {
							if ( srcDataType != "text" && destDataType != "text" ) {
								// We try to put text inbetween
								var first = dataConverters[srcDataType+" => text"] ||
										dataConverters["* => text"],
									second = dataConverters["text => "+destDataType] ||
										dataConverters["* => "+destDataType],
									areFunctions = jQuery.isFunction( first ) && jQuery.isFunction( second );
								if ( areFunctions ) {
									conversionFunction = function (data) {
										return second( first ( data ) );
									};
								}
								noFunction = ! areFunctions;
							}
							if ( noFunction ) {
								jQuery.error( "no data converter between " + srcDataType + " and " + destDataType );
							}
							
						}
						return conversionFunction(data);
					}
					
					var i,
						length,
						data = response,
						dataConverters = s.dataConverters,
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
								srcDataType = destDataType;
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
			
				error = error || statusText;
				
		}
			
		// Set data for the fake xhr object
		xhr.status = status;
		xhr.statusText = statusText;
		
		// Keep local copies of vars in case callbacks re-use the xhr
		var _s = s,
			_callbacksLists = callbacksLists,
			_callbackContext = callbackContext,
			_globalEventContext = globalEventContext;
			
		// Set state if the xhr hasn't been re-used
		function _setState( value ) {
			if ( xhr.readyState && s === _s ) {
				setState( value );
			}
		}
				
		// Really completed?
		if ( status && s.async ) {
			setState( 2 );
			_setState( 3 );
		}
		
		// We're done
		_setState( 4 );
		
		// Success
		_callbacksLists.success.fire(isSuccess ? _callbackContext : false , success, statusText, xhr);
		if ( isSuccess && _s.global ) {
			_globalEventContext.trigger( "ajaxSuccess", [xhr, _s] );
		}
		// Error
		_callbacksLists.error.fire(isSuccess ? false : _callbackContext , xhr, statusText ,error);
		if ( !isSuccess && _s.global ) {
			_globalEventContext.trigger( "ajaxError", [xhr, _s, error] );	
		}
		// Complete
		_callbacksLists.complete.fire(_callbackContext, xhr, statusText);
		if ( _s.global ) {
			_globalEventContext.trigger( "ajaxComplete", [xhr, _s] );
		}
		// Handle the global AJAX counter
		if ( _s.global && ! --jQuery.active ) {
			jQuery.event.trigger( "ajaxStop" );
		}
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
	
	var // Options object
		s,
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
				
				// If not internal, abort
				if ( ! internal ) {
					done( 0 , "transport not found" );
					return false;
				}
				
				// Allow custom headers/mimetypes and early abort
				if ( s.beforeSend ) {
					
					var _s = s;
					
					if ( s.beforeSend.call(callbackContext, xhr, s) === false || ! xhr.readyState || _s !== s ) {
						
						// Abort if not done
						if ( xhr.readyState && _s === s ) {
							xhr.abort();
						}
	
						// Handle the global AJAX counter
						if ( _s.global && ! --jQuery.active ) {
							jQuery.event.trigger( "ajaxStop" );
						}
						
						return false;
					}
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
		};
		
	// Init data (so that we can bind callbacks early
	reset(1);

	// Install callbacks related methods
	jQuery.each(["bind","unbind"], function(_, name) {
		xhr[name] = function(type) {
			var functors = slice.call(arguments,1), list;
			jQuery.each(type.split(/\s+/g), function() {
				list = callbacksLists[this];
				if ( list ) {
					list[name].apply(list, functors );
				}
			});
			return this;
		};
	});

	jQuery.each(callbacksLists, function(name) {
		var list;
		xhr[name] = function() {
			list = callbacksLists[name];
			if ( list ) {
				list.bind.apply(list, arguments );
			}
			return this;
		};
	});
	
	// Return the xhr emulation
	return xhr;
};

// Create a callback list
function createCBList() {
	
	var functors = [],
		autoFire = false,
		list = {
		
			fire: function( context ) {
				
				function clean() {
					// Empty callbacks list
					functors = [];
					// Inhibit methods
					for (var i in list) {
						list[i] = jQuery.noop;
					}
				}
				
				if ( context === false ) {
					
					clean();
					
				} else {
				
					// Precompute arguments
					var args = slice.call( arguments , 1 );
	
					// Redefine fire
					list.fire = function() {
						
						var flag = true;
						
						// Execute callbacks
						while ( flag && functors.length ) {
							flag = functors.shift().apply( context , args ) !== false;
						}
						
						// Clean if asked to stop
						if ( ! flag ) {
							clean();
						}
					};
						
					// Do fire
					list.fire();
					
					// Set autoFire
					autoFire = true;
				}
					
			},
			
			bind: function() {
				
				var doFire = autoFire;
				
				autoFire = false;
				
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
				
				if ( doFire ) {
					list.fire();
					autoFire = true;
				}
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
				if ( prefilters[i] === functor ) {
					return this;
				}
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
			
		if ( ! length ) {
			return self;
		}
			
		if ( jQuery.isFunction( arguments[0] ) ) {
			dataTypes = ["*"];
			start = 0;
		} else {
			dataTypes = arguments[0].toLowerCase().split(/\s+/);
			start = 1;
		}
		
		if ( ! dataTypes.length || start == length ) {
			return self;
		}
	
		functors = [];
		
		for ( i = start; i < length; i++ ) {
			functor = arguments[i];
			if ( jQuery.isFunction(functor) ) {
				functors.push( functor );
			}
		}
				
		if ( ! functors.length ) {
			return self;
		}
					
		jQuery.each ( dataTypes, function( _, dataType) {
			
			first = /^\+/.test( dataType );
			
			if (first) {
				dataType = dataType.substr(1);
			}
			
			if ( dataType === "" ) {
				return;
			}
			
			append = Array.prototype[ first ? "unshift" : "push" ];
			
			list = transports[dataType];

			jQuery.each ( functors, function( _, functor) {
					
				if ( ! list ) {
					
					list = transports[dataType] = [functor];
					
				} else {
					
					for ( var i in list ) {
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
	determineDataType: function( s , ct , text , xml ) {
		
		var autoDataType = s.autoDataType,
			type,
			regexp,
			dataTypes = s.dataTypes,
			transportDataType = dataTypes[0],
			response;
		
		// Auto (xml, json, script or text determined given headers)
		if ( transportDataType === "*" ) {
	
			for ( type in autoDataType ) {
				if ( ( regexp = autoDataType[ type ] ) && regexp.test( ct ) ) {
					transportDataType = dataTypes[0] = type;
					break;
				}
			}
			
		} 
		
		// xml and parsed as such
		if ( transportDataType === "xml" &&
			xml &&
			xml.documentElement /* #4958 */ ) {
			
			response = xml;
		
		// Text response was provided
		} else {
			
			response = text;
			
			// If it's not really text, defer to dataConverters
			if ( transportDataType != "text" ) {
				dataTypes.unshift( "text" );
			}
			
		}
		
		return response;
	}	
});


})(jQuery);
