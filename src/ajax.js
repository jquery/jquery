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
			"text => json": JSON && JSON.parse
				?
					function(data) {
						return JSON.parse(data);
					}
				:
					function(data) {
						return (new Function("return " + data))();
					}
			,
			
			// Execute text as a script
			"text => script": function(data) {
				jQuery.globalEval(data);
				return undefined;	
			},
		
			// Parse text as xml
			"text => xml": window.DOMParser 
				?
					// Standard
					function(data) {
						var parser = new DOMParser();
						return parser.parseFromString(data,"text/xml");
					}
				:
					// IE
					function(data) {
						var xml = new ActiveXObject("Microsoft.XMLDOM");
						xml.async="false";
						xml.loadXML(data);
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
	ajax: function(s) {
		
		// Extend the settings, but re-extend 's' so that it can be
		// checked again later (in the test suite, specifically)
		s = jQuery.extend(true, s, jQuery.extend(true, {}, jQuery.ajaxSettings, s));
		
		// Uppercase the type
		s.type = s.type.toUpperCase();
		
		// Datatype
		if (!s.dataTypes) s.dataTypes = [s.dataType];
		
		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data != "string" ) s.data = jQuery.param(s.data);
		
		// Determine if a cross-domain request is in order
		var parts = rurl.exec( s.url );
		s.crossDomain = !!(parts && (parts[1] && parts[1] != location.protocol || parts[2] != location.host));
		
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
		if (s.global && !jQuery.active++) jQuery.event.trigger( "ajaxStart" );
		
		// Set the correct header, if data is being sent
		if (s.data) request.setRequestHeader("Content-Type", s.contentType);
	
		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if (jQuery.lastModified[s.url]) request.setRequestHeader("If-Modified-Since", jQuery.lastModified[s.url]);
			if (jQuery.etag[s.url]) request.setRequestHeader("If-None-Match", jQuery.etag[s.url]);
		}
	
		// Set header so the called script knows that it's an XMLHttpRequest
		request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	
		// Set the Accepts header for the server, depending on the dataType
		request.setRequestHeader("Accept", s.transportDataType && s.accepts[ s.transportDataType ] ?
			s.accepts[ s.transportDataType ] + ", */*" :
			s.accepts._default );
	
		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && (s.beforeSend.call(s.context || window, xhr, s) === false || request.hasOwnProperty("status"))) {
			// If it was not manually aborted internally, do so now
			if (!request.hasOwnProperty("status")) xhr.abort();
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
			if (timeoutTimer) {
				clearTimeout(timeoutTimer);
				timeoutTime = null;
			}
			
			// If not timeout, force a jQuery-compliant status text
			if (statusText!="timeout") {
				request.statusText = (status >= 200 && status < 300)?"success":( status==304 ?"notmodified":"error");
			}
			
			// If not abort, mark as completed
			if (statusText!="abort") request.fireComplete = 1;
			
			// Mark as complete if not abort or timeout
			
			// If successful, handle type chaining
			if (request.statusText=="success" || request.statusText=="notmodified") {
	
				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					var lastModified = request.getResponseHeader("Last-Modified"),
						etag = request.getResponseHeader("Etag");
					if (lastModified) jQuery.lastModified[s.url] = lastModified;
					if (etag) jQuery.etag[s.url] = etag;
				}
				
				// Chain data conversion and determine the success value
				// (if an exception is thrown, it'll be set as the error message)
				try {
					
					var data = response, srcDataType, destDataType,
						checkData = function(data) {
							if (data===undefined) return;
							var testFunction = s.dataCheckers[srcDataType];
							if (jQuery.isFunction(testFunction)) testFunction(data);
							return data;
						},
						convertData = function(data) {
							var conversionFunction = s.dataConverters[srcDataType+" => "+destDataType],
								hasConversion = jQuery.isFunction(conversionFunction);
							if (!hasConversion) {
								conversionFunction = s.dataConverters["* => "+destDataType];
								hasConversion = jQuery.isFunction(conversionFunction);
							}
							if (!hasConversion)
								throw "jQuery[ajax]: no data converter between "+srcDataType+" and "+destDataType;
							return conversionFunction(data);
						},
						responseTypes = {
							"xml": "XML",
							"json": "JSON",
							"text": "Text"
						},
						responseType,
						responseField;
					
					jQuery.each(s.dataTypes, function() {
	
						destDataType = this;
						
						if (!srcDataType) { // First time
							
							// Copy type
							srcDataType = destDataType;
							// Check
							checkData(data);
							// Apply dataFilter
							if (jQuery.isFunction(s.dataFilter)) {
								data = s.dataFilter(data,s.dataType);
								// Recheck data
								checkData(data);
							}
							
						} else { // Subsequent times
							
							// handle auto
							if (destDataType=="auto") {

								destDataType = srcDataType;
								
							} else if (srcDataType!=destDataType) {
								
								// Convert
								data = convertData(data);
								// Copy type & check
								srcDataType = destDataType
								checkData(data);
								
							}
							
						}

						// Copy response into the xhr if it hasn't been already
						responseField = responseTypes[responseType = srcDataType] || responseTypes[responseType = "text"];
						if (responseField!==true) {
							xhr["response"+responseField] = data;
							responseTypes[responseType] = true;
						}
						
					});
	
					request.success = s.ifModified && request.statusText=="notmodified" ? null : data;
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
			
			// Dereference callbacks (avoids cycling references)
			request.complete = request.die = undefined;
			
		};
	
		// Send global event
		if ( s.global ) (s.context ? jQuery(s.context) : jQuery.event).trigger("ajaxSend", [xhr, s]);
		
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
					list.empty = list.add = list.remove = noOp;
					if (doFire) {
						list.add = function(func) {
							if (fire(func)===false) list.add = noOp;
						};
						jQuery.each(functors, function() {
							list.add(this);
						});
					}
					functors = undefined;
				},
				
				add: function(func) {
					if (!jQuery.isFunction(func)) return;
					functors.push(func);
				},
				
				remove: function(func) {
					if (!func) functors = [];
					else {
						if (!jQuery.isFunction(func)) return;
						var num = 0;
						jQuery.each(functors, function() {
							if (this===func) return false;
							num++;
						});
						if (num<functors.length) functors.splice(num,1);
					}
				}
				
			};
		
		return list;
	},
	
	// Create & initiate a request
	// (creates the transport object & the jQuery xhr abstraction)
	createRequest: function(s) {
	
		var 
			// Callback stuff
			callbackContext = s.context || window,
			globalEventContext = s.context ? jQuery(s.context) : jQuery.event,
			callbacksList = {
				complete: jQuery.ajax.createCallbacksList(function(func) {
					return func.call(callbackContext,jQueryXHR,request.statusText);
				}),
				success: jQuery.ajax.createCallbacksList(function(func) {
					return func.call(callbackContext,request.success,request.statusText);
				}),
				error: jQuery.ajax.createCallbacksList(function(func) {
					return func.call(callbackContext,jQueryXHR,request.statusText,request.error);
				})
			},
			// Fake xhr
			jQueryXHR = {
				bind: function(type,func) {
					jQuery.each(type.split(/\s+/g), function() {
						var list = callbacksList[this];
						list && list.add(func);
					});
					return this;
				},
				unbind: function(type,func) {
					jQuery.each(type.split(/\s+/g), function() {
						var list = callbacksList[this];
						list && list.remove(func);
					});
					return this;
				}
			},
			// Transport
			transport = jQuery.transport.newInstance(s, function(status, statusText, response) {
					// Copy values & call complete
					request.status = status;
					request.statusText = statusText;
					request.response = response;
					if (request.complete) request.complete();
					/* var tmp = "XHR:\n\n";
					jQuery.each(jQueryXHR, function(key,value) {
						if (!jQuery.isFunction(value)) tmp += key + " => " + value + "\n";
					});
					tmp += "\n\nREQUEST:\n\n";
					jQuery.each(request, function(key,value) {
						if (!jQuery.isFunction(value)) tmp += key + " => " + value + "\n";
					});
					alert(tmp); */
					// Complete if not abort or timeout
					var fire = request.fireComplete;
					callbacksList.complete.empty(fire);
					if (fire && s.global) globalEventContext.trigger( "ajaxComplete", [jQueryXHR, s] );
					// Success
					fire = request.fireSuccess;
					callbacksList.success.empty(fire);
					if (fire && s.global) globalEventContext.trigger( "ajaxSuccess", [jQueryXHR, s] );
					// Error
					fire = request.fireError;
					callbacksList.error.empty(fire);
					if (fire && s.global) globalEventContext.trigger( "ajaxError", [jQueryXHR, s, request.error] );	
					// Call die function (event & garbage collecting)
					if (request.die) request.die();
			}),
			// Request object
			request = {
				xhr: jQueryXHR,
				send: transport.send
			};
		
		// Install fake xhr methods
		jQuery.each(callbacksList,function(name, list) {
			jQueryXHR[name] = function(func) {
				list.add(func);
				return this;
			}
			list.add(s[name]);
		});
		
		jQuery.each(["abort","getAllResponseHeaders","getResponseHeader","setRequestHeader"], function() {
			// We can copy methods references because transport is never referenced as "this" in their definition
			request[this] = jQueryXHR[this] = transport[this];
		});
		
		// Reference to transport & config not needed anymore
		transport = undefined;
			
		// Return the request object
		return request;
	}
});