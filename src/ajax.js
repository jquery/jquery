(function( jQuery ) {
	
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rhash = /#.*$/,
	rheaders = /^(.*?):\s*(.*?)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	rnoContent = /^(?:GET|HEAD)$/,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rts = /([?&])_=[^&]*/,
	rurl = /^(\w+:)?\/\/([^\/?#]+)/,

	// Slice function
	sliceFunc = Array.prototype.slice,
	
	// Keep a copy of the old load method
	_load = jQuery.fn.load;

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf(" ");
		if ( off >= 0 ) {
			var selector = url.slice(off, url.length);
			url = url.slice(0, off);
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = null;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}
		
		var self = this;
		
		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			complete: function( res, status ) {
				// If successful, inject the HTML into all the matched elements
				if ( status === "success" || status === "notmodified" ) {
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(res.responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						res.responseText );
				}

				if ( callback ) {
					self.each( callback, [res.responseText, status, res] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param(this.serializeArray());
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray(this.elements) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				(this.checked || rselectTextarea.test(this.nodeName) ||
					rinput.test(this.type));
		})
		.map(function(i, elem){
			var val = jQuery(this).val();

			return val == null ?
				null :
				jQuery.isArray(val) ?
					jQuery.map( val, function(val, i){
						return {name: elem.name, value: val};
					}) :
					{name: elem.name, value: val};
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(i,o){
	jQuery.fn[o] = function(f){
		return this.bind(o, f);
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = null;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get(url, null, callback, "script");
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get(url, data, callback, "json");
	},

	ajaxSetup: function( settings ) {
		jQuery.extend( jQuery.ajaxSettings, settings );
	},

	ajaxSettings: {
		url: location.href,
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		dataTypes: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		*/
		xhr: function() {
			return new window.XMLHttpRequest();
		},

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": "*/*"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		// Prefilters
		// 1) They are useful to introduce custom dataTypes (see transport/jsonp for an example)
		// 2) These are called:
		//    * BEFORE asking for a transport
		//    * AFTER param serialization (s.data is a string if s.processData is true)
		// 3) key is the dataType
		// 4) the catchall symbol "*" can be used
		// 5) execution will start with transport dataType and THEN continue down to "*" if needed
		prefilters: {},

		// Transports bindings
		// 1) key is the dataType
		// 2) the catchall symbol "*" can be used
		// 3) selection will start with transport dataType and THEN go to "*" if needed
		transports: {},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		}
	},

	// Main method
	// (s is used internally)
	ajax: function( url , options , s ) {
		
		// Handle varargs
		if ( arguments.length === 1 ) {
			options = url;
			url = options ? options.url : undefined;
		}
		
		// Force options to be an object
		options = options || {};
		
		// Get the url if provided separately
		options.url = url || options.url;
		
		// Create the final options object
		s = jQuery.extend( true , {} , jQuery.ajaxSettings , options );
		
		// We force the original context
		// (plain objects used as context get extended)
		s.context = options.context;
		
		var // jQuery lists
			jQuery_lastModified = jQuery.lastModified,
			jQuery_etag = jQuery.etag,
			// Callbacks contexts
			callbackContext = s.context || s,
			globalEventContext = s.context ? jQuery( s.context ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery._Deferred(),
			// Headers (they are sent all at once)
			requestHeaders = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// The jXHR state
			state = 0,
			// Loop variable
			i,
			// Fake xhr
			jXHR = {
				
				readyState: 0,
				
				// Caches the header
				setRequestHeader: function(name,value) {
					if ( state === 0 ) {
						requestHeaders[ name.toLowerCase() ] = value;
					}
					return this;
				},
				
				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},
				
				// Builds headers hashtable if needed
				// (match is used internally)
				getResponseHeader: function( key , match ) {
					
					if ( state !== 2 ) {
						return null;
					}
					
					if ( responseHeaders === undefined ) {
						
						responseHeaders = {};
						
						if ( typeof responseHeadersString === "string" ) {
							
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
					}
					return responseHeaders[ key.toLowerCase() ];
				},
				
				// Cancel the request
				abort: function( statusText ) {
					if ( transport && state !== 2 ) {
						transport.abort( statusText || "abort" );
						done( 0 , statusText );
					}
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status , statusText , response , headers) {
			
			// Called once
			if ( state === 2 ) {
				return;
			}
			
			// State is "done" now
			state = 2;
			
			// Set readyState
			jXHR.readyState = status ? 4 : 0;

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
				if ( s.ifModified ) {
					
					var lastModified = jXHR.getResponseHeader("Last-Modified"),
						etag = jXHR.getResponseHeader("Etag");
						
					if (lastModified) {
						jQuery_lastModified[ s.url ] = lastModified;
					}
					if (etag) {
						jQuery_etag[ s.url ] = etag;
					}
				}
				
				if ( s.ifModified && statusText === "notmodified" ) {
					
					success = null;
					isSuccess = 1;
					
				} else {
					// Chain data conversions and determine the final value
					// (if an exception is thrown in the process, it'll be notified as an error)
					try {
						
						var i,
							current,
							prev,
							checker,
							conv1,
							conv2,
							oneConv,
							convertion,
							dataTypes = s.dataTypes,
							converters = s.converters,
							responses = {
								"xml": "XML",
								"text": "Text"
							};
						
						for( i = 0 ; i < dataTypes.length ; i++ ) {
							
							current = dataTypes[ i ];
							
							if ( responses[ current ] ) {
								jXHR[ "response" + responses[ current ] ] = response;
								responses[ current ] = 0;
							}
							
							if ( i ) {
								
								prev = dataTypes[ i - 1 ];
								
								if ( prev !== "*" && current !== "*" && prev !== current ) {
								
									oneConv = conv1 = 
										converters[ ( conversion = prev + " " + current ) ] ||
										converters[ "* " + current ];
									
									if ( oneConv !== true ) {
										
										if ( ! oneConv && prev !== "text" && current !== "text" ) {
											conv1 = converters[ prev + " text" ] || converters[ "* text" ];
											conv2 = converters[ "text " + current ];
										}
										
										if ( oneConv || conv1 && conv2 ) {
											response = oneConv ? conv1( response ) : conv2( conv1( response ) );
										} else {
											throw "no " + conversion;
										}
									}
								}
							} else if ( s.dataFilter ) {
								
								response = s.dataFilter( response );
								dataTypes = s.dataTypes;
							}
						}
		
						// We have a real success
						success = response;
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
			jXHR.status = status;
			jXHR.statusText = statusText;
			
			// Success/Error
			if ( isSuccess ) {
				deferred.fire( callbackContext , [ success , statusText , jXHR ] );
			} else {
				deferred.fireReject( callbackContext , [ jXHR , statusText , error ] );
			}
			
			if ( s.global ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ) ,
						[ jXHR , s , isSuccess ? success : error ] );
			}
			
			// Complete
			completeDeferred.fire( callbackContext, [ jXHR , statusText ] );
			
			if ( s.global ) {
				globalEventContext.trigger( "ajaxComplete" , [ jXHR , s] );
				// Handle the global AJAX counter
				if ( ! --jQuery.active ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}
		
		// Attach deferreds
		deferred.promise( jXHR );
		jXHR.success = jXHR.then;
		jXHR.error = jXHR.fail;
		jXHR.complete = completeDeferred.then;

		// Remove hash character (#7531: and string promotion)
		s.url = ( "" + s.url ).replace( rhash , "" );
		
		// Uppercase the type
		s.type = s.type.toUpperCase();
		
		// Determine if request has content
		s.hasContent = ! rnoContent.test( s.type );
		
		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( /\s+/ );
		
		// Determine if a cross-domain request is in order
		var parts = rurl.exec( s.url.toLowerCase() ),
			loc = location;
		s.crossDomain = !!( parts && ( parts[ 1 ] && parts[ 1 ] != loc.protocol || parts[ 2 ] != loc.host ) );

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data != "string" ) {
			s.data = jQuery.param( s.data , s.traditional );
		}

		// Watch for a new set of requests
		if ( s.global && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}
		
		// Get transport
		transport = jQuery.ajax.prefilter( s ).transport( s );
		
		// If no transport, we auto-abort
		if ( ! transport ) {
			
			done( 0 , "transport not found" );
			jXHR = false;
			
		} else {
			
			// More options handling for requests with no content
			if ( ! s.hasContent ) {
				
				// If data is available, append data to url
				if ( s.data ) {
					s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				}
								
				// Add anti-cache in url if needed
				if ( s.cache === false ) {
					
					var ts = jQuery.now(),
						// try replacing _= if it is there
						ret = s.url.replace( rts , "$1_=" + ts );
						
					// if nothing was replaced, add timestamp to the end
					s.url = ret + ( (ret == s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "");
				}
			}
			
			// Set the correct header, if data is being sent
			if ( ( s.data && s.hasContent ) || options.contentType ) {
				requestHeaders[ "content-type" ] = s.contentType;
			}
		
			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery_lastModified[ s.url ] ) { 
					requestHeaders[ "if-modified-since" ] = jQuery_lastModified[ s.url ];
				}
				if ( jQuery_etag[ s.url ] ) {
					requestHeaders[ "if-none-match" ] = jQuery_etag[ s.url ];
				}
			}
		
			// Set the Accepts header for the server, depending on the dataType
			requestHeaders.accept = s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] + ( s.dataTypes[ 0 ] !== "*" ? ", */*; q=0.01" : "" ) :
				s.accepts[ "*" ];
				
			// Check for headers option
			for ( i in s.headers ) {
				requestHeaders[ i.toLowerCase() ] = s.headers[ i ];
			}
			
			// Allow custom headers/mimetypes and early abort
			if ( s.beforeSend && ( s.beforeSend.call( callbackContext , jXHR , s ) === false || state === 2 ) ) {
					
					// Abort if not done already
					done( 0 , "abort" );
					jXHR = false;
					
			} else {
				
				// Set state as sending
				state = 1;
				jXHR.readyState = 1;
				
				// Install callbacks on deferreds
				for ( i in { success:1, error:1, complete:1 } ) {
					jXHR[ i ]( s[ i ] );
				}
				
				// Send global event
				if ( s.global ) {
					globalEventContext.trigger( "ajaxSend" , [ jXHR , s ] );
				}
				
				// Timeout
				if ( s.async && s.timeout > 0 ) {
					timeoutTimer = setTimeout(function(){
						jXHR.abort( "timeout" );
					}, s.timeout);
				}
				
				// Try to send
				try {
					transport.send(requestHeaders, done);
				} catch (e) {
					// Propagate exception as error if not done
					if ( status === 1 ) {

						done(0, "error", "" + e);
						jXHR = false;
						
					// Simply rethrow otherwise
					} else {
						jQuery.error(e);
					}
				}
			}
		}
		
		return jXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction(value) ? value() : value;
				s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
			};
		
		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}
		
		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray(a) || a.jquery ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});
			
		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[prefix], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join("&").replace(r20, "+");
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray(obj) && obj.length ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});
			
	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// If we see an array here, it is empty and should be treated as an empty
		// object
		if ( jQuery.isArray( obj ) || jQuery.isEmptyObject( obj ) ) {
			add( prefix, "" );

		// Serialize object item.
		} else {
			jQuery.each( obj, function( k, v ) {
				buildParams( prefix + "[" + k + "]", v, traditional, add );
			});
		}
					
	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

//Execute or select from functions in a given structure of options
function ajax_selectOrExecute( structure , s ) {

	var dataTypes = s.dataTypes,
		transportDataType,
		list,
		selected,
		i,
		length,
		checked = {},
		flag,
		noSelect = structure !== "transports";
		
	function initSearch( dataType ) {

		flag = transportDataType !== dataType && ! checked[ dataType ];
		
		if ( flag ) {
			
			checked[ dataType ] = 1;
			transportDataType = dataType;
			list = s[ structure ][ dataType ];
			i = -1;
			length = list ? list.length : 0 ;
		}

		return flag;
	}
	
	initSearch( dataTypes[ 0 ] );

	for ( i = 0 ; ( noSelect || ! selected ) && i <= length ; i++ ) {
		
		if ( i === length ) {
			
			initSearch( "*" );
			
		} else {

			selected = list[ i ]( s , determineDataType );

			// If we got redirected to another dataType
			// Search there (if not in progress or already tried)
			if ( typeof( selected ) === "string" &&
				initSearch( selected ) ) {

				dataTypes.unshift( selected );
				selected = 0;
			}
		}
	}

	return noSelect ? jQuery.ajax : selected;
}

// Add an element to one of the structures in ajaxSettings
function ajax_addElement( structure , args ) {
		
	var i,
		start = 0,
		length = args.length,
		dataTypes = [ "*" ],
		dLength = 1,
		dataType,
		functors = [],
		first,
		append,
		list;
		
	if ( length ) {
		
		first = jQuery.type( args[ 0 ] );
		
		if ( first === "object" ) {
			return ajax_selectOrExecute( structure , args[ 0 ] );
		}
		
		structure = jQuery.ajaxSettings[ structure ];
		
		if ( first !== "function" ) {
			
			dataTypes = args[ 0 ].toLowerCase().split(/\s+/);
			dLength = dataTypes.length;
			start = 1;
			
		}
		
		if ( dLength && start < length ) {
			
			functors = sliceFunc.call( args , start );
					
			for( i = 0 ; i < dLength ; i++ ) {
				
				dataType = dataTypes[ i ];
				
				first = /^\+/.test( dataType );
				
				if (first) {
					dataType = dataType.substr(1);
				}
				
				if ( dataType !== "" ) {
				
					append = Array.prototype[ first ? "unshift" : "push" ];
					list = structure[ dataType ] = structure[ dataType ] || [];
					append.apply( list , functors );
				}
			}
		}
	}
	
	return jQuery.ajax;
}

// Install prefilter & transport methods
jQuery.each( [ "prefilter" , "transport" ] , function( _ , name ) {
	_ = name + "s";
	jQuery.ajax[ name ] = function() {
		return ajax_addElement( _ , arguments );
	};
} );
	
// Utility function that handles dataType when response is received
// (for those transports that can give text or xml responses)
function determineDataType( s , ct , text , xml ) {
	
	var contents = s.contents,
		type,
		regexp,
		dataTypes = s.dataTypes,
		transportDataType = dataTypes[0],
		response;
	
	// Auto (xml, json, script or text determined given headers)
	if ( transportDataType === "*" ) {

		for ( type in contents ) {
			if ( ( regexp = contents[ type ] ) && regexp.test( ct ) ) {
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
		
		// If it's not really text, defer to converters
		if ( transportDataType !== "text" ) {
			dataTypes.unshift( "text" );
		}
		
	}
	
	return response;
}	

/*
 * Create the request object; Microsoft failed to properly
 * implement the XMLHttpRequest in IE7 (can't request local files),
 * so we use the ActiveXObject when it is available
 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
 * we need a fallback.
 */
if ( window.ActiveXObject ) {
	jQuery.ajaxSettings.xhr = function() {
	if ( window.location.protocol !== "file:" ) {
		try {
			return new window.XMLHttpRequest();
		} catch( xhrError ) {}
	}
	
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( activeError ) {}
	};
}

var testXHR = jQuery.ajaxSettings.xhr();

// Does this browser support XHR requests?
jQuery.support.ajax = !!testXHR;

// Does this browser support crossDomain XHR requests
jQuery.support.cors = testXHR && "withCredentials" in testXHR;

})( jQuery );
