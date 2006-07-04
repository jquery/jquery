// AJAX Plugin
// Docs Here:
// http://jquery.com/docs/ajax/

/**
 * Load HTML from a remote file and inject it into the DOM
 */
jQuery.prototype.load = function( url, params, callback ) {
	// I overwrote the event plugin's .load
	// this won't happen again, I hope -John
	if ( url && url.constructor == Function )
		return this.bind("load", url);

	// Default to a GET request
	var type = "GET";

	// If the second parameter was provided
	if ( params ) {
		// If it's a function
		if ( params.constructor == Function ) {
			// We assume that it's the callback
			callback = params;
			params = null;
			
		// Otherwise, build a param string
		} else {
			params = jQuery.param( params );
			type = "POST";
		}
	}
	
	var self = this;
	
	// Request the remote document
	jQuery.ajax( type, url, params,function(res){
			
		// Inject the HTML into all the matched elements
		self.html(res.responseText).each(function(){
			// If a callback function was provided
			if ( callback && callback.constructor == Function )
				// Execute it within the context of the element
				callback.apply( self, [res.responseText] );
		});
		
		// Execute all the scripts inside of the newly-injected HTML
		$("script", self).each(function(){
			eval( this.text || this.textContent || this.innerHTML || "");
		});

	});
	
	return this;
};

/**
 * Load a remote page using a GET request
 */
jQuery.get = function( url, callback, type ) {
	// Build and start the HTTP Request
	jQuery.ajax( "GET", url, null, function(r) {
		if ( callback ) callback( jQuery.httpData(r,type) );
	});
};

/**
 * Load a remote page using a POST request.
 */
jQuery.post = function( url, data, callback, type ) {
	// Build and start the HTTP Request
	jQuery.ajax( "POST", url, jQuery.param(data), function(r) {
		if ( callback ) callback( jQuery.httpData(r,type) );
	});
};

// If IE is used, create a wrapper for the XMLHttpRequest object
if ( jQuery.browser == "msie" )
	XMLHttpRequest = function(){
		return new ActiveXObject(
			(navigator.userAgent.toLowerCase().indexOf("msie 5") >= 0) ?
			"Microsoft.XMLHTTP" : "Msxml2.XMLHTTP"
		);
	};

// Attach a bunch of functions for handling common AJAX events
(function(){
	var e = "ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess".split(',');
	
	for ( var i = 0; i < e.length; i++ ){ (function(){
		var o = e[i];
		jQuery.fn[o] = function(f){return this.bind(o, f);};
	})();}
})();

/**
 * A common wrapper for making XMLHttpRequests
 */
jQuery.ajax = function( type, url, data, ret ) {
	// If only a single argument was passed in,
	// assume that it is a object of key/value pairs
	if ( !url ) {
		ret = type.complete;
		var success = type.success;
		var error = type.error;
		data = type.data;
		url = type.url;
		type = type.type;
	}
	
	// Watch for a new set of requests
	if ( ! jQuery.ajax.active++ )
		jQuery.event.trigger( "ajaxStart" );

	// Create the request object
	var xml = new XMLHttpRequest();

	// Open the socket
	xml.open(type || "GET", url, true);
	
	// Set the correct header, if data is being sent
	if ( data )
		xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	// Set header so calling script knows that it's an XMLHttpRequest
	xml.setRequestHeader("X-Requested-With", "XMLHttpRequest");

	// Make sure the browser sends the right content length
	if ( xml.overrideMimeType )
		xml.setRequestHeader("Connection", "close");

	// Wait for a response to come back
	xml.onreadystatechange = function(){
		// The transfer is complete and the data is available
		if ( xml.readyState == 4 ) {
			// Make sure that the request was successful
			if ( jQuery.httpSuccess( xml ) ) {
			
				// If a local callback was specified, fire it
				if ( success ) success( xml );
				
				// Fire the global callback
				jQuery.event.trigger( "ajaxSuccess" );
			
			// Otherwise, the request was not successful
			} else {
				// If a local callback was specified, fire it
				if ( error ) error( xml );
				
				// Fire the global callback
				jQuery.event.trigger( "ajaxError" );
			}
			
			// The request was completed
			jQuery.event.trigger( "ajaxComplete" );
			
			// Handle the global AJAX counter
			if ( ! --jQuery.ajax.active )
				jQuery.event.trigger( "ajaxStop" );

			// Process result
			if ( ret ) ret(xml);
		}
	};

	// Send the data
	xml.send(data);
};

// Counter for holding the number of active queries
jQuery.ajax.active = 0;

// Determines if an XMLHttpRequest was successful or not
jQuery.httpSuccess = function(r) {
  try {
    return r.status ?
      ( r.status >= 200 && r.status < 300 ) || r.status == 304 :
      location.protocol == "file:";
  } catch(e){}
  return false;
};

// Get the data out of an XMLHttpRequest.
// Return parsed XML if content-type header is "xml" and type is "xml" or omitted,
// otherwise return plain text.
jQuery.httpData = function(r,type) {
  var ct = r.getResponseHeader("content-type");
	var xml = ( !type || type == "xml" ) && ct && ct.indexOf("xml") >= 0;
	return xml ? r.responseXML : r.responseText;
};

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function(a) {
	var s = [];
	
	// If an array was passed in, assume that it is an array
	// of form elements
	if ( a.constructor == Array )
		// Serialize the form elements
		for ( var i = 0; i < a.length; i++ )
			s.push( a[i].name + "=" + encodeURIComponent( a[i].value ) );
		
	// Otherwise, assume that it's an object of key/value pairs
	else
		// Serialize the key/values
		for ( var j in a )
			s.push( j + "=" + encodeURIComponent( a[j] ) );
	
	// Return the resulting serialization
	return s.join("&");
};
