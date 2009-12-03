var rscript = /<script(.|\s)*?\/script>/g,
	rselectTextarea = /select|textarea/i,
	rinput = /text|hidden|password|search/i,
	rjsonp = /^[^(]*\((.*)\)$/,
	rquery = /\?/,
	rts = /(\?|&)_=.*?(&|$)/,
	rurl = /^(\w+:)?\/\/([^\/?#]+)/,
	r20 = /%20/g,
	noOp = function() {};

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
				params = jQuery.param( params );
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
		dataType: "auto",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		username: null,
		password: null,
		cache: null,
		forceTransport: null,
		*/
		// Create the request object; Microsoft failed to properly
		// implement the XMLHttpRequest in IE7, so we use the ActiveXObject when it is available
		// This function can be overriden by calling jQuery.ajaxSetup
		xhr: function(){
			return window.ActiveXObject ?
				new ActiveXObject("Microsoft.XMLHTTP") :
				new XMLHttpRequest();
		},
		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			script: "text/javascript, application/javascript",
			json: "application/json, text/javascript",
			text: "text/plain",
			_default: "*/*"
		},
		// Checkers that throw an exception if data is not as expected
		dataCheckers: {
	
			// Check if data is a string
			"text": function(data) {
				if (typeof data != "string") throw "typeerror";
			},
	
			// Check if xml has been properly parsed
			"xml": function(data) {
				var documentElement = data ? data.documentElement : data;
				if (!documentElement || !documentElement.nodeName) throw "typeerror";
				if (documentElement.nodeName=="parsererror") throw "parsererror";
			}
		},
		// List of data converters used internally
		// Key format is "source_type => destination_type" (spaces required)
		// the catchall symbol "*" can be used for source_type
		dataConverters: {
		
			// Convert anything to text
			"* => text": function(data) {
				return "" + data;
			},
			
			// Remove function trailing from a jsonp expression
			"jsonp => text": function(data) {
				return data.replace(rjsonp,"$1");
			},
			
			// Text to html (no transformation)
			"text => html": function(data) {
				return data;
			},
			
			// Text to jsonp (no transformation)
			"text => jsonp": function(data) {
				return data;
			},
			
			// Evaluate text as a json expression
			"text => json": function(data) {
				return window.JSON && JSON.parse ?
					JSON.parse(data) :
					(new Function("return " + data))();
			},
			
			// Execute text as a script
			"text => script": function(data) {
				jQuery.globalEval(data);
				return undefined;	
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
	ajax: function(_s) {
		
		// Extend the settings, but re-extend 's' so that it can be
		// checked again later (in the test suite, specifically)
		var s = jQuery.extend(true, _s, jQuery.extend(true, {}, jQuery.ajaxSettings, _s));
		
		// Uppercase the type
		s.type = s.type.toUpperCase();
		
		// Datatype
		if ( ! s.dataTypes ) {
			s.dataTypes = [s.dataType];
		}
		
		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data != "string" ) {
			s.data = jQuery.param(s.data);
		}
		
		// Determine if a cross-domain request is in order
		var parts = rurl.exec( s.url );
		s.crossDomain = !!( parts && ( parts[1] && parts[1] != location.protocol || parts[2] != location.host ) );
		
		// Variables
		var timeoutTimer,
			request = jQuery.ajax.createRequest(s),
			xhr = request.xhr;
			
		// Set dataType to proper value (in case transport filters changed it)
		// And get transportDataType
		s.dataType = s.dataTypes[s.dataTypes.length-1];
		s.transportDataType = s.dataTypes[0];
		
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
		if ( s.data ) {
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
	
		// Set header so the called script knows that it's an XMLHttpRequest
		request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	
		// Set the Accepts header for the server, depending on the dataType
		request.setRequestHeader("Accept", s.transportDataType && s.accepts[ s.transportDataType ] ?
			s.accepts[ s.transportDataType ] + ", */*" :
			s.accepts._default );
	
		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && (s.beforeSend.call(s.context || window, xhr, s) === false
			|| request.hasOwnProperty("status") ) ) {
				
			// If it was not manually aborted internally, do so now
			if ( ! request.hasOwnProperty("status") ) {
				xhr.abort();
			}
			// Handle the global AJAX counter
			if ( s.global && ! --jQuery.active ) {
				jQuery.event.trigger( "ajaxStop" );
			}
			return false;
		}
		
		// Install complete callback
		request.complete = function() {
			
			var status = request.status,
				statusText = request.statusText,
				response = request.response;
			
			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout(timeoutTimer);
				timeoutTimer = undefined;
			}
			
			// If not timeout, force a jQuery-compliant status text
			if ( statusText!="timeout" ) {
				request.statusText = ( status >= 200 && status < 300 ) ? 
					"success" :
					( status==304 ? "notmodified" : "error" );
			}
			
			// If not abort, mark as completed
			if ( statusText!="abort" ) {
				request.fireComplete = 1;
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
							var conversionFunction = s.dataConverters[srcDataType+" => "+destDataType];
							if ( ! jQuery.isFunction( conversionFunction ) ) {
								conversionFunction = s.dataConverters["* => "+destDataType];
								if ( ! jQuery.isFunction( conversionFunction ) ) {
									throw "jQuery[ajax]: no data converter between "+srcDataType+" and "+destDataType;
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
						},
						responseType;
					
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
							if (destDataType=="auto") {

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
						responseType = "response" + ( responseTypes[srcDataType] || responseTypes["text"] );
							
						if ( responseType !== true ) {
							xhr[responseType] = data;
							responseTypes[responseType] = true;
						}
						
					});
	
					// We have a real success
					request.success = s.ifModified && request.statusText == "notmodified" ?
						null :
						data;
						
					request.fireSuccess = 1;
					
				} catch(e) {
					
					request.statusText = "error";
					request.error = "" + e;
					request.fireError = 1;
					
				}
				
			} else { // if not success, mark it as an error
				
					request.error = request.statusText;
					request.fireError = 1;
					
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
			
			// Dereference callbacks, request & options
			s = request.complete = request.die = undefined;
			
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
		request.send(s);
		
		// return the fake xhr
		return xhr;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a ) {
		var s = [],
			param_traditional = jQuery.param.traditional;
		
		function add( key, value ){
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction(value) ? value() : value;
			s[ s.length ] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
		}
		
		// If an array was passed in, assume that it is an array
		// of form elements
		if ( jQuery.isArray(a) || a.jquery ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});
			
		} else {
			// Encode parameters from object, recursively. If
			// jQuery.param.traditional is set, encode the "old" way
			// (the way 1.3.2 or older did it)
			jQuery.each( a, function buildParams( prefix, obj ) {
				
				if ( jQuery.isArray(obj) ) {
					jQuery.each( obj, function(i,v){
						// Due to rails' limited request param syntax, numeric array
						// indices are not supported. To avoid serialization ambiguity
						// issues, serialized arrays can only contain scalar values. php
						// does not have this issue, but we should go with the lowest
						// common denominator
						add( prefix + ( param_traditional ? "" : "[]" ), v );
					});
					
				} else if ( typeof obj == "object" ) {
					if ( param_traditional ) {
						add( prefix, obj );
						
					} else {
						jQuery.each( obj, function(k,v){
							buildParams( prefix ? prefix + "[" + k + "]" : k, v );
						});
					}
				} else {
					add( prefix, obj );
				}
			});
		}
		// Return the resulting serialization
		return s.join("&").replace(r20, "+");
	}

});

jQuery.extend(jQuery.ajax, {

	// Callback list
	createCallbacksList: function(fire) {
		
		var functors = [],
			done,
			list = {
			
				empty: function(doFire) {
					
					// Inhibit methods
					jQuery.each(list, function(key) {
						list[key] = noOp;
					});
					
					// Fire callbacks if needed
					if ( doFire ) {
						list.bind = function(func) {
							// Inhibit firing when a callback returns false
							if ( fire(func)===false ) {
								list.bind = noOp;
							}
						};
						jQuery.each(functors, function() {
							list.bind(this);
						});
					}
					functors = undefined;
				},
				
				bind: function(func) {
					if ( jQuery.isFunction(func) ) {
						functors.push(func);
					}
				},
				
				unbind: function(func) {
					if ( ! func ) {
						functors = [];
					}
					else {
						if (jQuery.isFunction(func)) {
							var num = 0;
							jQuery.each(functors, function() {
								if ( this===func ) {
									return false;
								}
								num++;
							});
							if ( num < functors.length ) {
								functors.splice(num,1);
							}
						}
					}
				}
				
			};
		
		return list;
	},
	
	// Create & initiate a request
	// (creates the transport object & the jQuery xhr abstraction)
	createRequest: function(s) {
		
		var 
			// Scoped resulting data
			status,
			statusText,
			success,
			error,
			// Callback stuff
			callbackContext = s.context || window,
			globalEventContext = s.context ? jQuery(s.context) : jQuery.event,
			callbacksLists = {
				complete: jQuery.ajax.createCallbacksList(function(func) {
					return func.call(callbackContext,jQueryXHR,statusText);
				}),
				success: jQuery.ajax.createCallbacksList(function(func) {
					return func.call(callbackContext,success,statusText);
				}),
				error: jQuery.ajax.createCallbacksList(function(func) {
					return func.call(callbackContext,jQueryXHR,statusText,error);
				})
			},
			// Fake xhr
			jQueryXHR = {},
			// Transport
			transport = jQuery.transport.newInstance(s, function(_status, _statusText, _response) {
					// Copy values & call complete
					request.status = _status;
					request.statusText = _statusText;
					request.response = _response;
					
					if ( jQuery.isFunction(request.complete) ) {
						request.complete();
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
					
					// Complete if not abort or timeout
					var fire = request.fireComplete;
					callbacksLists.complete.empty(fire);
					if ( fire && s.global ) {
						globalEventContext.trigger( "ajaxComplete", [jQueryXHR, s] );
					}
					// Success
					fire = request.fireSuccess;
					callbacksLists.success.empty(fire);
					if ( fire && s.global ) {
						globalEventContext.trigger( "ajaxSuccess", [jQueryXHR, s] );
					}
					// Error
					fire = request.fireError;
					callbacksLists.error.empty(fire);
					if ( fire && s.global ) {
						globalEventContext.trigger( "ajaxError", [jQueryXHR, s, error] );	
					}
					// Call die function (event & garbage collecting)
					if ( jQuery.isFunction(request.die) ) { 
						request.die();
					}
					// Dereference request & options
					s = request = undefined;
			}),
			// Request object
			request = {
				xhr: jQueryXHR,
				send: transport.send
			};
		
		// Install fake xhr methods
		jQuery.each(["bind","unbind"], function(_,name) {
			jQueryXHR[name] = function(type,func) {
				jQuery.each(type.split(/\s+/g), function() {
					var list = callbacksLists[this];
					if ( list ) {
						list[name](func);
					}
				});
				return this;
			};
		});

		jQuery.each(callbacksLists,function(name, list) {
			jQueryXHR[name] = function(func) {
				list.bind(func);
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
		
		// Reference to transport not needed anymore
		transport = undefined;
	
		// Return the request object
		return request;
	}
});