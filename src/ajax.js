var rscript = /<script(.|\s)*?\/script>/gi,
	rselectTextarea = /select|textarea/i,
	rheaders = /([^:]+):((?:\n |\n\t|[^\n])*)(?:\n|$)/g,
	rinput = /color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week/i,
	rquery = /\?/,
	rts = /(\?|&)_=.*?(&|$)/,
	rurl = /^(\w+:)?\/\/([^\/?#]+)/,
	r20 = /%20/g,
	noop = jQuery.noop;

jQuery.fn.extend({
	// Keep a copy of the old load
	_load: jQuery.fn.load,

	load: function( url, params, callback ) {
		if ( typeof url !== "string" ) {
			return this._load( url );

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

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			context:this,
			complete: function(res, status){
				// If successful, inject the HTML into all the matched elements
				if ( status === "success" || status === "notmodified" ) {
					// See if a selector was specified
					this.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div />")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(res.responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						res.responseText );
				}

				if ( callback ) {
					this.each( callback, [res.responseText, status, res] );
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

jQuery.extend({

	get: function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = null;
		}

		return jQuery.ajax({
			type: "GET",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	getScript: function( url, callback ) {
		return jQuery.get(url, null, callback, "script");
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get(url, data, callback, "json");
	},

	post: function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = {};
		}

		return jQuery.ajax({
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
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
		// Create the request object; Microsoft failed to properly
		// implement the XMLHttpRequest in IE7, so we use the ActiveXObject when it is available
		// This function can be overriden by calling jQuery.ajaxSetup
		xhr: window.XMLHttpRequest && (window.location.protocol !== "file:" || !window.ActiveXObject) ?
			function() {
				return new window.XMLHttpRequest();
			} :
			function() {
				try {
					return new window.ActiveXObject("Microsoft.XMLHTTP");
				} catch(e) {}
			},
			
		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			json: "application/json, text/javascript",
			css: "text/css",
			script: "text/javascript, application/javascript",
			text: "text/plain",
			_default: "*/*"
		},
		
		autoFetching: {
			xml: /xml/,
			html: /html/,
			json: /json/,
			css: /css/,
			script: /javascript/
		},
		
		// Prefilters
		// 1) They are useful to introduce custom dataTypes (see transport/jsonp for an example)
		// 2) These are called:
		//    * BEFORE asking for a transport
		//    * AFTER param serialization (s.data is a string if s.processData is true)
		// 3) They MUST be order agnostic
		prefilters: [],
		
		// Transports bindings
		// 1) key is the dataType
		// 2) the catchall symbol "*" can be used
		// 3) selection will start with transport dataType and THEN go to "*" if needed
		transports: {
		},
		
		// Checkers
		// 1) key is dataType
		// 2) they are called to control successful response
		// 3) error throws is used as error data
		dataCheckers: {
	
			// Check if data is a string
			"text": function(data) {
				if ( typeof data != "string" ) throw "typeerror";
			},
	
			// Check if xml has been properly parsed
			"xml": function(data) {
				var documentElement = data ? data.documentElement : data;
				if ( ! documentElement || ! documentElement.nodeName ) throw "typeerror";
				if ( documentElement.nodeName == "parsererror" ) throw "parsererror";
			}
		},
		
		// List of data converters
		// 1) key format is "source_type => destination_type" (spaces required)
		// 2) the catchall symbol "*" can be used for source_type
		dataConverters: {
		
			// Convert anything to text
			"* => text": function(data) {
				return "" + data;
			},
			
			// Text to html (no transformation)
			"text => html": function(data) {
				return data;
			},
			
			// Evaluate text as a json expression
			"text => json": function(data) {
				
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if (/^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
					.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
					.replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
						
					try {
						
						if ( window.JSON && window.JSON.parse ) {
							return window.JSON.parse( data );
						}
						
						return (new Function("return " + data))();
						
					} catch(_) {}
				}
				
				// If we reach this point, it wasn't json
				throw "parsererror";
			},
			
			// Parse text as xml
			"text => xml": function(data) {
				var xml, parser;
				if ( window.DOMParser ) { // Standard
					parser = new DOMParser();
					xml = parser.parseFromString(data,"text/xml");
				} else { // IE
					xml = new ActiveXObject("Microsoft.XMLDOM");
					xml.async="false";
					xml.loadXML(data);
				}
				return xml;
			}
		}
	},

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	// Counter for holding the number of active queries
	active: 0,
	
	// Main method
	ajax: function( origSettings ) {
		
		var s = jQuery.extend(true, {}, jQuery.ajaxSettings, origSettings),
			parts = rurl.exec( s.url ),
			prefilters = s.prefilters,
			i,
			timeoutTimer,
			request,
			xhr,
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
		jQuery.each( s.dataTypes, function (i, value) {
			s.dataTypes[i] = value.toLowerCase();
		})
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
		
		// Variables
		request = createRequest(s);
		xhr = request.xhr;
			
		// Set dataType to proper value (in case transport filters changed it)
		// And get transportDataType
		s.dataType = s.dataTypes[s.dataTypes.length-1];
		transportDataType = s.dataTypes[0];
		
		// More options handling for GET requests
		if (s.type == "GET") {
			
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
		if ( s.data || origSettings && origSettings.contentType ) {
			request.setRequestHeader("Content-Type", s.contentType);
		}
	
		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[s.url] ) { 
				request.setRequestHeader("If-Modified-Since", jQuery.lastModified[s.url]);
			}
			if ( jQuery.etag[s.url] ) {
				request.setRequestHeader("If-None-Match", jQuery.etag[s.url]);
			}
		}
	
		// Set the Accepts header for the server, depending on the dataType
		request.setRequestHeader("Accept", transportDataType && s.accepts[ transportDataType ] ?
			s.accepts[ transportDataType ] + ", */*" :
			s.accepts._default );
	
		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && (s.beforeSend.call(s.context || s, xhr, s) === false
			|| hasOwnProperty.call(request,"status") ) ) {
				
			// If it was not manually aborted internally, do so now
			if ( ! hasOwnProperty.call(request,"status") ) {
				request.abort();
			}
			// Handle the global AJAX counter
			if ( s.global && ! --jQuery.active ) {
				jQuery.event.trigger( "ajaxStop" );
			}
			return false;
		}
		
		// Install done callback
		request.done = function() {
			
			var status = request.status,
				statusText = request.statusText,
				response = request.response;
			
			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout(timeoutTimer);
			}
			
			// If not timeout, force a jQuery-compliant status text
			if ( statusText!="timeout" ) {
				request.statusText = ( status >= 200 && status < 300 ) ? 
					"success" :
					( status==304 ? "notmodified" : "error" );
			}
			
			// If successful, handle type chaining
			if ( request.statusText=="success" || request.statusText=="notmodified" ) {
	
				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					var lastModified = request.getResponseHeader("Last-Modified"),
						etag = request.getResponseHeader("Etag");
						
					if (lastModified) {
						jQuery.lastModified[s.url] = lastModified;
					}
					if (etag) {
						jQuery.etag[s.url] = etag;
					}
				}
				
				// Chain data conversions and determine the final value
				// (if an exception is thrown in the process, it'll be notified as an error)
				try {
					
					var checkData = function(data) {
							if ( data !== undefined ) {
								var testFunction = s.dataCheckers[srcDataType];
								if ( jQuery.isFunction( testFunction ) ) {
									testFunction(data);
								}
							}
						},
						convertData = function(data) {
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
									throw "jQuery[ajax]: no data converter between "
										+ srcDataType + " and " + destDataType;
								}
								
							}
							return conversionFunction(data);
						},
						data = response,
						srcDataType,
						destDataType,
						responseTypes = {
							image:	"Object",
							json:	"JSON",
							text:	"Text",
							xml:	"XML"
						};
						
					jQuery.each(s.dataTypes, function() {
	
						destDataType = this;
						
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
							if (destDataType=="*") {

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
						
					});
	
					// We have a real success
					request.success = s.ifModified && request.statusText == "notmodified" ?
						null :
						data;
					
				} catch(e) {
					
					request.statusText = "error";
					request.error = "" + e;
					
				}
				
			} else { // if not success, mark it as an error
				
					request.error = request.statusText;
					
			}
				
			// Set data for the fake xhr object
			xhr.status = status;
			xhr.statusText = statusText || request.statusText;
		};
		
		// Install die callback
		request.die = function() {
			
			// Handle the global AJAX counter
			if ( s.global && ! --jQuery.active ) {
				jQuery.event.trigger( "ajaxStop" );
			}
			
		};
	
		// Send global event
		if ( s.global ) {
			(s.context ? jQuery(s.context) : jQuery.event).trigger("ajaxSend", [xhr, s]);
		}
		
		// Timeout
		if ( s.async && s.timeout > 0 ) {
			timeoutTimer = setTimeout(function(){
				request.abort("timeout");
			}, s.timeout);
		}
		
		// Do send request
		request.send();
		
		// return the fake xhr
		return xhr;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		
		var s = [];
		
		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}
		
		function add( key, value ){
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction(value) ? value() : value;
			s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
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
			jQuery.each( a, function buildParams( prefix, obj ) {
				
				if ( jQuery.isArray(obj) ) {
					// Serialize array item.
					jQuery.each( obj, function(i,v){
						if ( traditional ) {
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
							buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v );
						}
					});
					
				} else if ( !traditional && typeof obj === "object" ) {
					// Serialize object item.
					jQuery.each( obj, function(k,v){
						buildParams( prefix + "[" + k + "]", v );
					});
					
				} else {
					// Serialize scalar item.
					add( prefix, obj );
				}
			});
		}
		
		// Return the resulting serialization
		return s.join("&").replace(r20, "+");
	}

});
	
jQuery.extend(jQuery.ajax, {
	
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
			
			first = dataType.substr(0,1) == "+";
			
			if (first) {
				dataType = dataType.substr(1);
			}
			
			if ( dataType == "" ) return;
			
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
	
	// Unbind one or several transports
	unbindTransport: function() {
		// JULIAN 12/8/09: TODO
		return this;
	}
});

// Select a transport given options
function selectTransport(s) {
	var transportDataType = s.dataTypes[0],
		dataTypes = transportDataType == "*" ? [ transportDataType ] : [ transportDataType , "*" ],
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
						internal = selectTransport(s);
						return false;
					}
				}
			}
		}
	});
	
	if ( ! internal ) {
		throw "No transport found for " + dataTypes[0];
	}
	
	return internal;
}

// Implement a complete ajax transport from an internal definition
function implementTransport( internal, listener ) {
	
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
			// Cache response headers
			responseHeadersString = headers || "";
			// Done
			state = 2;
			// Callback & dereference
			listener(status, statusText, response);
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
						responseHeadersString.replace(rheaders, function(_, key, value) {
							responseHeaders[jQuery.trim(key).toLowerCase()] = jQuery.trim(value);
						});
					}
				}
				return responseHeaders[jQuery.trim(key).toLowerCase()];
			}
		},
		
		// Initiate the request
		send: function() {
			
			if ( ! state ) {
				
				state = 1;
				
				try {
					
					internal.send(requestHeaders, done);
											
				} catch (e) {
					
					if ( done ) {
						
						done(0, "error", "" + e);
						
					} else {
						
						// Probably sync request: exception was thrown in callbacks => rethrow
						throw e;
						
					}
				}
			}
		},
		
		// Cancel the request
		abort: function(statusText) {
			if ( state === 1 ) {
				internal.abort( statusText || "abort" );
			}
			return this;
		}
	};
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

// Create & initiate a request
// (creates the transport object & the jQuery xhr abstraction)
function createRequest(s) {
	
	var // Scoped resulting data
		status,
		statusText,
		success,
		error,
		// Callback stuff
		callbackContext = s.context || s,
		globalEventContext = s.context ? jQuery(s.context) : jQuery.event,
		callbacksLists = {
			success: createCBList(function(func) {
				return func.call(callbackContext,success,statusText);
			}),
			error: createCBList(function(func) {
				return func.call(callbackContext,jQueryXHR,error,statusText);
			}),
			complete: createCBList(function(func) {
				return func.call(callbackContext,jQueryXHR,statusText);
			})
		},
		// Fake xhr
		jQueryXHR = {},
		// Transport
		transport = implementTransport( selectTransport(s) , function(_status, _statusText, _response) {

				// Copy values & call complete
				request.status = _status;
				request.statusText = _statusText;
				request.response = _response;
				
				if ( jQuery.isFunction(request.done) ) {
					request.done();
				}
				
				// Get values in local variables
				status = request.status;
				statusText = request.statusText;
				success = request.success;
				error = request.error;
				
				/*
				// Inspector
				var tmp = "XHR:\n\n";
				jQuery.each(jQueryXHR, function(key,value) {
					if (!jQuery.isFunction(value)) tmp += key + " => " + value + "\n";
				});
				tmp += "\n\nREQUEST:\n\n";
				jQuery.each(request, function(key,value) {
					if (!jQuery.isFunction(value)) tmp += key + " => " + value + "\n";
				});
				alert(tmp);
				*/
				
				// Success
				var fire = hasOwnProperty.call(request,"success");
				callbacksLists.success.empty(fire);
				if ( fire && s.global ) {
					globalEventContext.trigger( "ajaxSuccess", [jQueryXHR, s] );
				}
				// Error
				fire = hasOwnProperty.call(request,"error");
				callbacksLists.error.empty(fire);
				if ( fire && s.global ) {
					globalEventContext.trigger( "ajaxError", [jQueryXHR, s, error] );	
				}
				// Complete
				callbacksLists.complete.empty(true);
				if ( s.global ) {
					globalEventContext.trigger( "ajaxComplete", [jQueryXHR, s] );
				}
				// Call die function (event & garbage collecting)
				if ( jQuery.isFunction(request.die) ) { 
					request.die();
				}
		}),
		// Request object
		request = {
			xhr: jQueryXHR,
			send: transport.send
		};
	
	// Install fake xhr methods
	jQuery.each(["bind","unbind"], function(_,name) {
		jQueryXHR[name] = function(type) {
			var functors = Array.prototype.slice.call(arguments,1), list;
			jQuery.each(type.split(/\s+/g), function() {
				if ( list = callbacksLists[this] ) {
					list[name].apply(list, functors );
				}
			});
			return this;
		};
	});

	jQuery.each(callbacksLists, function(name, list) {
		jQueryXHR[name] = function() {
			list.bind.apply(list, arguments);
			return this;
		};
		list.bind(s[name]);
	});
	
	jQuery.each(transport, function(name, functor) {
		
		// Redirect everything but send
		if ( name != "send" ) {
			// We can copy methods by references
			// (transport is "this" agnostic)
			request[name] = jQueryXHR[name] = functor;
		}
	});
	
	// Return the request object
	return request;
}

// Utility function that handles dataTypes
// for those transports that can give text or xml responses
function handleDataTypes( s , ct , text , xml ) {
	
	var autoFetching = s.autoFetching,
		type,
		dataTypes = s.dataTypes,
		transportDataType = dataTypes[0],
		response;
	
	if ( transportDataType == "*" ) { // Auto (xml, json, script or text determined given headers)

		for ( type in autoFetching ) {
			if ( autoFetching[ type ].test( ct ) ) {
				transportDataType = dataTypes[0] = type;
				if ( dataTypes.length === 1 ) {
					s.dataType = transportDataType;
				}
				break;
			}
		}
		
	} 
	
	if ( transportDataType == "xml" && xml ) { // xml and parsed as such
		
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


