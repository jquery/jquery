(function( jQuery ) {

var rquery_xhr = /\?/,
	rhash = /#.*$/,
	rheaders = /^(.*?):\s*(.*?)\r?$/mg, // IE leaves an \r character at EOL
	rnoContent = /^(?:GET|HEAD)$/,
	rts = /([?&])_=[^&]*/,
	rurl = /^(\w+:)?\/\/([^\/?#]+)/,
	
	sliceFunc = Array.prototype.slice,
	
	isFunction = jQuery.isFunction;
	
// Creates a jQuery xhr object
jQuery.xhr = function( _native ) {
	
	if ( _native ) {
		return jQuery.ajaxSettings.xhr();
	}
	
	function reset( force ) {
		
		// We only need to reset if we went through the init phase
		// (with the exception of object creation)
		if ( force || internal ) {
			
			// Reset callbacks lists
			deferred = jQuery.deferred();
			completeDeferred = jQuery._deferred();
			
			xhr.success = xhr.then = deferred.then;
			xhr.error = xhr.fail = deferred.fail;
			xhr.complete = completeDeferred.then;
			
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
		
		var // Options extraction
		
			// Remove hash character (#7531: first for string promotion)
			url = s.url = ( "" + s.url ).replace( rhash , "" ),
			
			// Uppercase the type
			type = s.type = s.type.toUpperCase(),
			
			// Determine if request has content
			hasContent = s.hasContent = ! rnoContent.test( type ),
			
			// Extract dataTypes list
			dataType = s.dataType,
			dataTypes = s.dataTypes = dataType ? jQuery.trim(dataType).toLowerCase().split(/\s+/) : ["*"],
			
			// Determine if a cross-domain request is in order
			parts = rurl.exec( url.toLowerCase() ),
			loc = location,
			crossDomain = s.crossDomain = !!( parts && ( parts[1] && parts[1] != loc.protocol || parts[2] != loc.host ) ),
			
			// Get other options locally
			data = s.data,
			originalContentType = s.contentType,
			prefilters = s.prefilters,
			accepts = s.accepts,
			headers = s.headers,
			
			// Other Variables
			transportDataType,
			i;
			
		// Convert data if not already a string
		if ( data && s.processData && typeof data != "string" ) {
			data = s.data = jQuery.param( data , s.traditional );
		}
		
		// Apply option prefilters
		for ( i = 0; i < prefilters.length; i++ ) {
			prefilters[i](s);
		}
		
		// Get internal
		internal = selectTransport( s );
		
		// Re-actualize url & data
		url = s.url;
		data = s.data;
		
		// If internal was found
		if ( internal ) {
			
			// Get transportDataType
			transportDataType = dataTypes[0];
			
			// More options handling for requests with no content
			if ( ! hasContent ) {
				
				// If data is available, append data to url
				if ( data ) {
					url += (rquery_xhr.test(url) ? "&" : "?") + data;
				}
								
				// Add anti-cache in url if needed
				if ( s.cache === false ) {
					
					var ts = jQuery.now(),
						// try replacing _= if it is there
						ret = url.replace(rts, "$1_=" + ts );
						
					// if nothing was replaced, add timestamp to the end
					url = ret + ((ret == url) ? (rquery_xhr.test(url) ? "&" : "?") + "_=" + ts : "");
				}
				
				s.url = url;
			}
			
			// Set the correct header, if data is being sent
			if ( ( data && hasContent ) || originalContentType ) {
				requestHeaders["content-type"] = s.contentType;
			}
		
			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery_lastModified[url] ) { 
					requestHeaders["if-modified-since"] = jQuery_lastModified[url];
				}
				if ( jQuery_etag[url] ) {
					requestHeaders["if-none-match"] = jQuery_etag[url];
				}
			}
		
			// Set the Accepts header for the server, depending on the dataType
			requestHeaders.accept = transportDataType && accepts[ transportDataType ] ?
				accepts[ transportDataType ] + ( transportDataType !== "*" ? ", */*; q=0.01" : "" ) :
				accepts[ "*" ];
				
			// Check for headers option
			for ( i in headers ) {
				requestHeaders[ i.toLowerCase() ] = headers[ i ];
			}			
		}
			
		callbackContext = s.context || s;
		globalEventContext = s.context ? jQuery(s.context) : jQuery.event;
		
		for ( i in { success:1, error:1, complete:1 } ) {
			xhr[ i ]( s[ i ] );
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
		
		var // Reference url
			url = s.url,
			// and ifModified status
			ifModified = s.ifModified,
			
			// Is it a success?
			isSuccess = 0,
			// Stored success
			success,
			// Stored error
			error = statusText;

		// If not timeout, force a jQuery-compliant status text
		if ( statusText != "timeout" ) {
			statusText = ( status >= 200 && status < 300 ) ? 
				"success" :
				( status === 304 ? "notmodified" : "error" );
		}
		
		// If successful, handle type chaining
		if ( statusText === "success" || statusText === "notmodified" ) {
			
			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( ifModified ) {
				var lastModified = xhr.getResponseHeader("Last-Modified"),
					etag = xhr.getResponseHeader("Etag");
					
				if (lastModified) {
					jQuery_lastModified[url] = lastModified;
				}
				if (etag) {
					jQuery_etag[url] = etag;
				}
			}
			
			if ( ifModified && statusText === "notmodified" ) {
				
				success = null;
				isSuccess = 1;
				
			} else {
				// Chain data conversions and determine the final value
				// (if an exception is thrown in the process, it'll be notified as an error)
				try {
					
					function checkData(data) {
						if ( data !== undefined ) {
							var testFunction = s.dataCheckers[srcDataType];
							if ( isFunction( testFunction ) ) {
								testFunction(data);
							}
						}
					}
					
					function convertData (data) {
						var conversionFunction = dataConverters[srcDataType+" => "+destDataType] ||
								dataConverters["* => "+destDataType],
							noFunction = ! isFunction( conversionFunction );
						if ( noFunction ) {
							if ( srcDataType != "text" && destDataType != "text" ) {
								// We try to put text inbetween
								var first = dataConverters[srcDataType+" => text"] ||
										dataConverters["* => text"],
									second = dataConverters["text => "+destDataType] ||
										dataConverters["* => "+destDataType],
									areFunctions = isFunction( first ) && isFunction( second );
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
					
					var dataTypes = s.dataTypes,
						i,
						length,
						data = response,
						dataConverters = s.dataConverters,
						srcDataType,
						destDataType,
						responseTypes = s.xhrResponseFields;
						
					for ( i = 0, length = dataTypes.length ; i < length ; i++ ) {
	
						destDataType = dataTypes[i];
						
						if ( !srcDataType ) { // First time
							
							// Copy type
							srcDataType = destDataType;
							// Check
							checkData(data);
							// Apply dataFilter
							if ( isFunction( s.dataFilter ) ) {
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
			_deferred = deferred,
			_completeDeferred = completeDeferred,
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
		
		// Success/Error
		if ( isSuccess ) {
			_deferred.fire( _callbackContext , [ success , statusText , xhr ] );
		} else {
			_deferred.fireReject( _callbackContext , [ xhr , statusText , error ] );
		}
		
		if ( _s.global ) {
			_globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ) , [ xhr , _s , isSuccess ? success : error ] );
		}
		
		// Complete
		_completeDeferred.fire( _callbackContext, [ xhr , statusText ] );
		
		if ( _s.global ) {
			_globalEventContext.trigger( "ajaxComplete", [xhr, _s] );
			// Handle the global AJAX counter
			if ( ! --jQuery.active ) {
				jQuery.event.trigger( "ajaxStop" );
			}
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
		if ( isFunction( xhr.onreadystatechange ) ) {
			xhr.onreadystatechange();
		}
	}
	
	var // jQuery lists
		jQuery_lastModified = jQuery.lastModified,
		jQuery_etag = jQuery.etag,
		// Options object
		s,
		// Callback stuff
		callbackContext,
		globalEventContext,
		deferred,
		completeDeferred,
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
				
				return xhr;
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
				requestHeaders[ name.toLowerCase() ] = value;
				return xhr;
			},
			
			// Raw string
			getAllResponseHeaders: function() {
				return xhr.readyState <= 1 ? "" : responseHeadersString;
			},
			
			// Builds headers hashtable if needed
			getResponseHeader: function( key ) {
				
				if ( xhr.readyState <= 1 ) {
					
					return null;
					
				}
				
				if ( responseHeaders === undefined ) {
					
					responseHeaders = {};
					
					if ( typeof responseHeadersString === "string" ) {
						
						var match;
						
						while( ( match = rheaders.exec( responseHeadersString ) ) ) {
							responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
						}
					}
				}
				return responseHeaders[ key.toLowerCase() ];
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

	// Return the xhr emulation
	return xhr;
};

jQuery.extend(jQuery.xhr, {
	
	// Add new prefilter
	prefilter: function (functor) {
		if ( isFunction(functor) ) {
			jQuery.ajaxSettings.prefilters.push( functor );
		}
		return this;
	},
	
	// Bind a transport to one or more dataTypes
	bindTransport: function () {
		
		var args = arguments,
			i,
			start = 0,
			length = args.length,
			dataTypes = [ "*" ],
			functors = [],
			functor,
			first,
			append,
			list,
			transports = jQuery.ajaxSettings.transports;
			
		if ( length ) {
				
			if ( ! isFunction( args[ 0 ] ) ) {
				
				dataTypes = args[ 0 ].toLowerCase().split(/\s+/);
				start = 1;
				
			}
			
			if ( dataTypes.length && start < length ) {
				
				for ( i = start; i < length; i++ ) {
					functor = args[i];
					if ( isFunction(functor) ) {
						functors.push( functor );
					}
				}
						
				if ( functors.length ) {
							
					jQuery.each ( dataTypes, function( _ , dataType ) {
						
						first = /^\+/.test( dataType );
						
						if (first) {
							dataType = dataType.substr(1);
						}
						
						if ( dataType !== "" ) {
						
							append = Array.prototype[ first ? "unshift" : "push" ];
							
							list = transports[ dataType ];
					
							jQuery.each ( functors, function( _ , functor ) {
									
								if ( ! list ) {
									
									list = transports[ dataType ] = [ functor ];
									
								} else {
									
									append.call( list , functor );
								}
							} );
						}
									
					} );
				}
			}
		}
		
		return this;
	}

	
});

// Select a transport given options
function selectTransport( s ) {

	var dataTypes = s.dataTypes,
		transportDataType,
		transportsList,
		transport,
		i,
		length,
		checked = {},
		flag;
		
	function initSearch( dataType ) {

		flag = transportDataType !== dataType && ! checked[ dataType ];
		
		if ( flag ) {
			
			checked[ dataType ] = 1;
			transportDataType = dataType;
			transportsList = s.transports[ dataType ];
			i = -1;
			length = transportsList ? transportsList.length : 0 ;
		}

		return flag;
	}
	
	initSearch( dataTypes[ 0 ] );

	for ( i = 0 ; ! transport && i <= length ; i++ ) {
		
		if ( i === length ) {
			
			initSearch( "*" );
			
		} else {

			transport = transportsList[ i ]( s , determineDataType );

			// If we got redirected to another dataType
			// Search there (if not in progress or already tried)
			if ( typeof( transport ) === "string" &&
				initSearch( transport ) ) {

				dataTypes.unshift( transport );
				transport = 0;
			}
		}
	}

	return transport;
}
	
// Utility function that handles dataType when response is received
// (for those transports that can give text or xml responses)
function determineDataType( s , ct , text , xml ) {
	
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
		if ( transportDataType !== "text" ) {
			dataTypes.unshift( "text" );
		}
		
	}
	
	return response;
}	

})( jQuery );
