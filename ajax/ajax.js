// AJAX Plugin
// Docs Here:
// http://jquery.com/docs/ajax/

/**
 * Load HTML from a remote file and inject it into the DOM
 */
$.fn.load = function( url, params, callback ) {
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
			params = $.param( params );
			type = "POST";
		}
	}
	
	var self = this;
	
	// Request the remote document
	$.ajax( type, url, params,function(res){
			
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
$.get = function( url, callback, type ) {
	// Build and start the HTTP Request
	$.ajax( "GET", url, null, function(r) {
		if ( callback ) callback( $.httpData(r,type) );
	});
};

/**
 * Load a remote page using a POST request.
 */
$.post = function( url, data, callback, type ) {
	// Build and start the HTTP Request
	$.ajax( "POST", url, $.param(data), function(r) {
		if ( callback ) callback( $.httpData(r,type) );
	});
};

// If IE is used, create a wrapper for the XMLHttpRequest object
if ( $.browser == "msie" )
	XMLHttpRequest = function(){
		return new ActiveXObject(
			(navigator.userAgent.toLowerCase().indexOf("msie 5") >= 0) ?
			"Microsoft.XMLHTTP" : "Msxml2.XMLHTTP"
		);
	};

// Attach a bunch of functions for handling common AJAX events
(function(){
	var e = "ajaxStart.ajaxComplete.ajaxError.ajaxSuccess".split(',');
	
	for ( var i = 0; i < e.length; i++ ){ (function(){
		var o = e[i];
		$.fn[o] = function(f){return this.bind(o, f);};
	})();}
})();

/**
 * A common wrapper for making XMLHttpRequests
 */
$.ajax = function( type, url, data, ret ) {
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
		// Socket is openend
		if ( xml.readyState == 1 ) {
			// Increase counter
			$.ajax.active++;

			// Show 'loader'
			$.event.trigger( "ajaxStart" );
		}

		// Socket is closed and data is available
		if ( xml.readyState == 4 ) {
			// Hide loader if needed
			if ( ! --$.ajax.active ) {
				$.event.trigger( "ajaxComplete" );
				$.ajax.active = 0
			}

			// Make sure that the request was successful
			if ( $.httpSuccess( xml ) ) {
			
				// If a local callback was specified, fire it
				if ( success ) success( xml );
				
				// Fire the global callback
				$.event.trigger( "ajaxSuccess" );
			
			// Otherwise, the request was not successful
			} else {
				// If a local callback was specified, fire it
				if ( error ) error( xml );
				
				// Fire the global callback
				$.event.trigger( "ajaxError" );
			}

			// Process result
			if ( ret ) ret(xml);
		}
	};

	// Send the data
	xml.send(data);
};

// Counter for holding the number of active queries
$.ajax.active = 0;

// Determines if an XMLHttpRequest was successful or not
$.httpSuccess = function(r) {
	return ( r.status && ( r.status >= 200 && r.status < 300 ) || 
		r.status == 304 ) || !r.status && location.protocol == "file:";
};

// Get the data out of an XMLHttpRequest
$.httpData = function(r,type) {
	// Check the headers, or watch for a force override
	return r.getResponseHeader("content-type").indexOf("xml") > 0 || 
		type == "xml" ? r.responseXML : r.responseText;
};

// Serialize an array of form elements or a set of
// key/values into a query string
$.param = function(a) {
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
