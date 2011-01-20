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
	rurl = /^(\w+:)?\/\/([^\/?#:]+)(?::(\d+))?/,
	rCRLF = /\r?\n/g,

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
			// Complete callback (responseText is used internally)
			complete: function( jXHR, status, responseText ) {
				// Store the response as specified by the jXHR object
				responseText = jXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [responseText, status, jXHR] );
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
						return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
					}) :
					{ name: elem.name, value: val.replace(rCRLF, "\r\n") };
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
		jQuery.extend( true, jQuery.ajaxSettings, settings );
		if ( settings.context ) {
			jQuery.ajaxSettings.context = settings.context;
		}
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
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		crossDomain: null,
		*/

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
		},

		// Utility function that handles dataType when response is received
		// (for those transports that can give text or xml responses)
		determineDataType: function( ct , text , xml ) {

			var s = this,
				contents = s.contents,
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

	},

	ajaxPrefilter: function( a , b ) {
		ajaxPrefilterOrTransport( "prefilters" , a , b );
	},

	ajaxTransport: function( a , b ) {
		return ajaxPrefilterOrTransport( "transports" , a , b );
	},

	// Main method
	ajax: function( url , options ) {

		// Handle varargs
		if ( arguments.length === 1 ) {
			options = url;
			url = options ? options.url : undefined;
		}

		// Force options to be an object
		options = options || {};

		// Get the url if provided separately
		options.url = url || options.url;

		var // Create the final options object
			s = jQuery.extend( true , {} , jQuery.ajaxSettings , options ),
			// jQuery lists
			jQuery_lastModified = jQuery.lastModified,
			jQuery_etag = jQuery.etag,
			// Callbacks contexts
			// We force the original context if it exists
			// or take it from jQuery.ajaxSettings otherwise
			// (plain objects used as context get extended)
			callbackContext =
				( s.context = ( "context" in options ? options : jQuery.ajaxSettings ).context ) || s,
			globalEventContext = callbackContext === s ? jQuery.event : jQuery( callbackContext ),
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery._Deferred(),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			loc = document.location,
			protocol = loc.protocol || "http:",
			parts,
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
				getResponseHeader: function( key ) {

					var match;

					if ( state === 2 ) {

						if ( !responseHeaders ) {

							responseHeaders = {};

							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];

					}

					return match || null;
				},

				// Cancel the request
				abort: function( statusText ) {
					if ( transport ) {
						transport.abort( statusText || "abort" );
					}
					done( 0 , statusText );
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

			// Dereference transport for early garbage collection
			// (no matter how long the jXHR transport will be used
			transport = undefined;

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
				error,

				// To keep track of statusCode based callbacks
				oldStatusCode;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

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

				// If not modified
				if ( status === 304 ) {

					// Set the statusText accordingly
					statusText = "notmodified";
					// Mark as a success
					isSuccess = 1;

				// If we have data
				} else {

					// Set the statusText accordingly
					statusText = "success";

					// Chain data conversions and determine the final value
					// (if an exception is thrown in the process, it'll be notified as an error)
					try {

						var i,
							// Current dataType
							current,
							// Previous dataType
							prev,
							// Conversion expression
							conversion,
							// Conversion function
							conv,
							// Conversion functions (when text is used in-between)
							conv1,
							conv2,
							// Local references to dataTypes & converters
							dataTypes = s.dataTypes,
							converters = s.converters,
							// DataType to responseXXX field mapping
							responses = {
								"xml": "XML",
								"text": "Text"
							};

						// For each dataType in the chain
						for( i = 0 ; i < dataTypes.length ; i++ ) {

							current = dataTypes[ i ];

							// If a responseXXX field for this dataType exists
							// and if it hasn't been set yet
							if ( responses[ current ] ) {
								// Set it
								jXHR[ "response" + responses[ current ] ] = response;
								// Mark it as set
								responses[ current ] = 0;
							}

							// If this is not the first element
							if ( i ) {

								// Get the dataType to convert from
								prev = dataTypes[ i - 1 ];

								// If no catch-all and dataTypes are actually different
								if ( prev !== "*" && current !== "*" && prev !== current ) {

									// Get the converter
									conversion = prev + " " + current;
									conv = converters[ conversion ] || converters[ "* " + current ];

									conv1 = conv2 = 0;

									// If there is no direct converter and none of the dataTypes is text
									if ( ! conv && prev !== "text" && current !== "text" ) {
										// Try with text in-between
										conv1 = converters[ prev + " text" ] || converters[ "* text" ];
										conv2 = converters[ "text " + current ];
										// Revert back to a single converter
										// if one of the converter is an equivalence
										if ( conv1 === true ) {
											conv = conv2;
										} else if ( conv2 === true ) {
											conv = conv1;
										}
									}
									// If we found no converter, dispatch an error
									if ( ! ( conv || conv1 && conv2 ) ) {
										throw conversion;
									}
									// If found converter is not an equivalence
									if ( conv !== true ) {
										// Convert with 1 or 2 converters accordingly
										response = conv ? conv( response ) : conv2( conv1( response ) );
									}
								}
							// If it is the first element of the chain
							// and we have a dataFilter
							} else if ( s.dataFilter ) {
								// Apply the dataFilter
								response = s.dataFilter( response , current );
								// Get dataTypes again in case the filter changed them
								dataTypes = s.dataTypes;
							}
						}
						// End of loop

						// We have a real success
						success = response;
						isSuccess = 1;

					// If an exception was thrown
					} catch(e) {

						// We have a parsererror
						statusText = "parsererror";
						error = "" + e;

					}
				}

			// if not success, mark it as an error
			} else {

					error = statusText = statusText || "error";

					// Set responseText if needed
					if ( response ) {
						jXHR.responseText = response;
					}
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

			// Status-dependent callbacks
			oldStatusCode = statusCode;
			statusCode = undefined;
			jXHR.statusCode( oldStatusCode );

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
		jXHR.success = jXHR.done;
		jXHR.error = jXHR.fail;
		jXHR.complete = completeDeferred.done;

		// Status-dependent callbacks
		jXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( statusCode ) {
					for( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[ tmp ] , map[ tmp ] ];
					}
				} else {
					tmp = map[ jXHR.status ];
					jXHR.done( tmp ).fail( tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		s.url = ( "" + s.url ).replace( rhash , "" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( /\s+/ );

		// Determine if a cross-domain request is in order
		if ( ! s.crossDomain ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!(
					parts &&
					( parts[ 1 ] && parts[ 1 ] != protocol ||
						parts[ 2 ] != loc.hostname ||
						( parts[ 3 ] || ( ( parts[ 1 ] || protocol ) === "http:" ? 80 : 443 ) ) !=
							( loc.port || ( protocol === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data , s.traditional );
		}

		// Apply prefilters
		jQuery.ajaxPrefilter( s , options );

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = ! rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( s.global && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

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
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
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

				// Return false
				jXHR = false;

		} else {

			// Install callbacks on deferreds
			for ( i in { success:1, error:1, complete:1 } ) {
				jXHR[ i ]( s[ i ] );
			}

			// Get transport
			transport = jQuery.ajaxTransport( s , options );

			// If no transport, we auto-abort
			if ( ! transport ) {

				done( 0 , "notransport" );

			} else {

				// Set state as sending
				state = jXHR.readyState = 1;

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

// Base function for both ajaxPrefilter and ajaxTransport
function ajaxPrefilterOrTransport( arg0 , arg1 , arg2 ) {

	var type = jQuery.type( arg1 ),
		structure = jQuery.ajaxSettings[ arg0 ],
		i,
		length;

	// We have an options map so we have to inspect the structure
	if ( type === "object" ) {

		var options = arg1,
			originalOptions = arg2,
			// When dealing with prefilters, we execute only
			// (no selection so we never stop when a function
			// returns a non-falsy, non-string value)
			executeOnly = ( arg0 === "prefilters" ),
			inspect = function( dataType, tested ) {

				if ( ! tested[ dataType ] ) {

					tested[ dataType ] = true;

					var list = structure[ dataType ],
						selected;

					for( i = 0, length = list ? list.length : 0 ; ( executeOnly || ! selected ) && i < length ; i++ ) {
						selected = list[ i ]( options , originalOptions );
						// If we got redirected to a different dataType,
						// we add it and switch to the corresponding list
						if ( typeof( selected ) === "string" && selected !== dataType ) {
							options.dataTypes.unshift( selected );
							selected = inspect( selected , tested );
							// We always break in order not to continue
							// to iterate in previous list
							break;
						}
					}
					// If we're only executing or nothing was selected
					// we try the catchall dataType
					if ( executeOnly || ! selected ) {
						selected = inspect( "*" , tested );
					}
					// This will be ignored by ajaxPrefilter
					// so it's safe to return no matter what
					return selected;
				}

			};

		// Start inspection with current transport dataType
		return inspect( options.dataTypes[ 0 ] , {} );

	} else {

		// We're requested to add to the structure
		// Signature is ( dataTypeExpression , function )
		// with dataTypeExpression being optional and
		// defaulting to catchAll (*)
		type = type === "function";

		if ( type ) {
			arg2 = arg1;
			arg1 = undefined;
		}
		arg1 = arg1 || "*";

		// We control that the second argument is really a function
		if ( type || jQuery.isFunction( arg2 ) ) {

			var dataTypes = arg1.split( /\s+/ ),
				functor = arg2,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for( i = 0 , length = dataTypes.length ; i < length ; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 );
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( functor );
			}
		}
	}
}

})( jQuery );
