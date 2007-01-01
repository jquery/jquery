jQuery.fn.extend({

	/**
	 * Load HTML from a remote file and inject it into the DOM, only if it's
	 * been modified by the server.
	 *
	 * @example $("#feeds").loadIfModified("feeds.html");
	 * @before <div id="feeds"></div>
	 * @result <div id="feeds"><b>45</b> feeds found.</div>
	 *
	 * @name loadIfModified
	 * @type jQuery
	 * @param String url The URL of the HTML file to load.
	 * @param Hash params (optional) A set of key/value pairs that will be sent to the server.
	 * @param Function callback (optional) A function to be executed whenever the data is loaded (parameters: responseText, status and response itself).
	 * @cat AJAX
	 */
	loadIfModified: function( url, params, callback ) {
		this.load( url, params, callback, 1 );
	},

	/**
	 * Load HTML from a remote file and inject it into the DOM.
	 *
	 * Note: Avoid to use this to load scripts, instead use $.getScript.
	 * IE strips script tags when there aren't any other characters in front of it.
	 *
	 * @example $("#feeds").load("feeds.html");
	 * @before <div id="feeds"></div>
	 * @result <div id="feeds"><b>45</b> feeds found.</div>
	 *
 	 * @example $("#feeds").load("feeds.html",
 	 *   {limit: 25},
 	 *   function() { alert("The last 25 entries in the feed have been loaded"); }
 	 * );
	 * @desc Same as above, but with an additional parameter
	 * and a callback that is executed when the data was loaded.
	 *
	 * @name load
	 * @type jQuery
	 * @param String url The URL of the HTML file to load.
	 * @param Object params (optional) A set of key/value pairs that will be sent as data to the server.
	 * @param Function callback (optional) A function to be executed whenever the data is loaded (parameters: responseText, status and response itself).
	 * @cat AJAX
	 */
	load: function( url, params, callback, ifModified ) {
		if ( url.constructor == Function )
			return this.bind("load", url);

		callback = callback || function(){};

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
		jQuery.ajax({
			url: url,
			type: type,
			data: params,
			ifModified: ifModified,
			complete: function(res, status){
				if ( status == "success" || !ifModified && status == "notmodified" ) {
					// Inject the HTML into all the matched elements
					self.html(res.responseText)
					  // Execute all the scripts inside of the newly-injected HTML
					  .evalScripts()
					  // Execute callback
					  .each( callback, [res.responseText, status, res] );
				} else
					callback.apply( self, [res.responseText, status, res] );
			}
		});
		return this;
	},

	/**
	 * Serializes a set of input elements into a string of data.
	 * This will serialize all given elements.
	 *
	 * A serialization similar to the form submit of a browser is
	 * provided by the form plugin. It also takes multiple-selects 
	 * into account, while this method recognizes only a single option.
	 *
	 * @example $("input[@type=text]").serialize();
	 * @before <input type='text' name='name' value='John'/>
	 * <input type='text' name='location' value='Boston'/>
	 * @after name=John&location=Boston
	 * @desc Serialize a selection of input elements to a string
	 *
	 * @name serialize
	 * @type String
	 * @cat AJAX
	 */
	serialize: function() {
		return jQuery.param( this );
	},

	/**
	 * Evaluate all script tags inside this jQuery. If they have a src attribute,
	 * the script is loaded, otherwise it's content is evaluated.
	 *
	 * @name evalScripts
	 * @type jQuery
	 * @private
	 * @cat AJAX
	 */
	evalScripts: function() {
		return this.find('script').each(function(){
			if ( this.src )
				jQuery.getScript( this.src );
			else {
				jQuery.globalEval( this.text || this.textContent || this.innerHTML || "" );
			}
		}).end();
	}

});

// If IE is used, create a wrapper for the XMLHttpRequest object
if ( jQuery.browser.msie && typeof XMLHttpRequest == "undefined" )
	XMLHttpRequest = function(){
		return new ActiveXObject("Microsoft.XMLHTTP");
	};

// Attach a bunch of functions for handling common AJAX events

/**
 * Attach a function to be executed whenever an AJAX request begins
 * and there is none already active.
 *
 * @example $("#loading").ajaxStart(function(){
 *   $(this).show();
 * });
 * @desc Show a loading message whenever an AJAX request starts
 * (and none is already active).
 *
 * @name ajaxStart
 * @type jQuery
 * @param Function callback The function to execute.
 * @cat AJAX
 */

/**
 * Attach a function to be executed whenever all AJAX requests have ended.
 *
 * @example $("#loading").ajaxStop(function(){
 *   $(this).hide();
 * });
 * @desc Hide a loading message after all the AJAX requests have stopped.
 *
 * @name ajaxStop
 * @type jQuery
 * @param Function callback The function to execute.
 * @cat AJAX
 */

/**
 * Attach a function to be executed whenever an AJAX request completes.
 *
 * The XMLHttpRequest and settings used for that request are passed
 * as arguments to the callback.
 *
 * @example $("#msg").ajaxComplete(function(request, settings){
 *   $(this).append("<li>Request Complete.</li>");
 * });
 * @desc Show a message when an AJAX request completes.
 *
 * @name ajaxComplete
 * @type jQuery
 * @param Function callback The function to execute.
 * @cat AJAX
 */

/**
 * Attach a function to be executed whenever an AJAX request completes
 * successfully.
 *
 * The XMLHttpRequest and settings used for that request are passed
 * as arguments to the callback.
 *
 * @example $("#msg").ajaxSuccess(function(request, settings){
 *   $(this).append("<li>Successful Request!</li>");
 * });
 * @desc Show a message when an AJAX request completes successfully.
 *
 * @name ajaxSuccess
 * @type jQuery
 * @param Function callback The function to execute.
 * @cat AJAX
 */

/**
 * Attach a function to be executed whenever an AJAX request fails.
 *
 * The XMLHttpRequest and settings used for that request are passed
 * as arguments to the callback. A third argument, an exception object,
 * is passed if an exception occured while processing the request.
 *
 * @example $("#msg").ajaxError(function(request, settings){
 *   $(this).append("<li>Error requesting page " + settings.url + "</li>");
 * });
 * @desc Show a message when an AJAX request fails.
 *
 * @name ajaxError
 * @type jQuery
 * @param Function callback The function to execute.
 * @cat AJAX
 */
 
/**
 * Attach a function to be executed before an AJAX request is send.
 *
 * The XMLHttpRequest and settings used for that request are passed
 * as arguments to the callback.
 *
 * @example $("#msg").ajaxSend(function(request, settings){
 *   $(this).append("<li>Starting request at " + settings.url + "</li>");
 * });
 * @desc Show a message before an AJAX request is send.
 *
 * @name ajaxSend
 * @type jQuery
 * @param Function callback The function to execute.
 * @cat AJAX
 */

new function(){
	var e = "ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(",");

	for ( var i = 0; i < e.length; i++ ) new function(){
		var o = e[i];
		jQuery.fn[o] = function(f){
			return this.bind(o, f);
		};
	};
};

jQuery.extend({

	/**
	 * Load a remote page using an HTTP GET request.
	 *
	 * @example $.get("test.cgi");
	 *
	 * @example $.get("test.cgi", { name: "John", time: "2pm" } );
	 *
	 * @example $.get("test.cgi", function(data){
	 *   alert("Data Loaded: " + data);
	 * });
	 *
	 * @example $.get("test.cgi",
	 *   { name: "John", time: "2pm" },
	 *   function(data){
	 *     alert("Data Loaded: " + data);
	 *   }
	 * );
	 *
	 * @name $.get
	 * @type XMLHttpRequest
	 * @param String url The URL of the page to load.
	 * @param Hash params (optional) A set of key/value pairs that will be sent to the server.
	 * @param Function callback (optional) A function to be executed whenever the data is loaded.
	 * @cat AJAX
	 */
	get: function( url, data, callback, type, ifModified ) {
		// shift arguments if data argument was ommited
		if ( data && data.constructor == Function ) {
			callback = data;
			data = null;
		}
		return jQuery.ajax({
			url: url,
			data: data,
			success: callback,
			dataType: type,
			ifModified: ifModified
		});
	},

	/**
	 * Load a remote page using an HTTP GET request, only if it hasn't
	 * been modified since it was last retrieved.
	 *
	 * @example $.getIfModified("test.html");
	 *
	 * @example $.getIfModified("test.html", { name: "John", time: "2pm" } );
	 *
	 * @example $.getIfModified("test.cgi", function(data){
	 *   alert("Data Loaded: " + data);
	 * });
	 *
	 * @example $.getifModified("test.cgi",
	 *   { name: "John", time: "2pm" },
	 *   function(data){
	 *     alert("Data Loaded: " + data);
	 *   }
	 * );
	 *
	 * @name $.getIfModified
	 * @type XMLHttpRequest
	 * @param String url The URL of the page to load.
	 * @param Hash params (optional) A set of key/value pairs that will be sent to the server.
	 * @param Function callback (optional) A function to be executed whenever the data is loaded.
	 * @cat AJAX
	 */
	getIfModified: function( url, data, callback, type ) {
		return jQuery.get(url, data, callback, type, 1);
	},

	/**
	 * Loads, and executes, a remote JavaScript file using an HTTP GET request.
	 *
	 * Warning: Safari <= 2.0.x is unable to evalulate scripts in a global
	 * context synchronously. If you load functions via getScript, make sure
	 * to call them after a delay.
	 *
	 * @example $.getScript("test.js");
	 *
	 * @example $.getScript("test.js", function(){
	 *   alert("Script loaded and executed.");
	 * });
	 *
	 * @name $.getScript
	 * @type XMLHttpRequest
	 * @param String url The URL of the page to load.
	 * @param Function callback (optional) A function to be executed whenever the data is loaded.
	 * @cat AJAX
	 */
	getScript: function( url, callback ) {
		return jQuery.get(url, null, callback, "script");
	},

	/**
	 * Load JSON data using an HTTP GET request.
	 *
	 * @example $.getJSON("test.js", function(json){
	 *   alert("JSON Data: " + json.users[3].name);
	 * });
	 *
	 * @example $.getJSON("test.js",
	 *   { name: "John", time: "2pm" },
	 *   function(json){
	 *     alert("JSON Data: " + json.users[3].name);
	 *   }
	 * );
	 *
	 * @name $.getJSON
	 * @type XMLHttpRequest
	 * @param String url The URL of the page to load.
	 * @param Hash params (optional) A set of key/value pairs that will be sent to the server.
	 * @param Function callback A function to be executed whenever the data is loaded.
	 * @cat AJAX
	 */
	getJSON: function( url, data, callback ) {
		return jQuery.get(url, data, callback, "json");
	},

	/**
	 * Load a remote page using an HTTP POST request.
	 *
	 * @example $.post("test.cgi");
	 *
	 * @example $.post("test.cgi", { name: "John", time: "2pm" } );
	 *
	 * @example $.post("test.cgi", function(data){
	 *   alert("Data Loaded: " + data);
	 * });
	 *
	 * @example $.post("test.cgi",
	 *   { name: "John", time: "2pm" },
	 *   function(data){
	 *     alert("Data Loaded: " + data);
	 *   }
	 * );
	 *
	 * @name $.post
	 * @type XMLHttpRequest
	 * @param String url The URL of the page to load.
	 * @param Hash params (optional) A set of key/value pairs that will be sent to the server.
	 * @param Function callback (optional) A function to be executed whenever the data is loaded.
	 * @cat AJAX
	 */
	post: function( url, data, callback, type ) {
		return jQuery.ajax({
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	// timeout (ms)
	//timeout: 0,

	/**
	 * Set the timeout of all AJAX requests to a specific amount of time.
	 * This will make all future AJAX requests timeout after a specified amount
	 * of time.
	 *
	 * Set to null or 0 to disable timeouts (default).
	 *
	 * You can manually abort requests with the XMLHttpRequest's (returned by
	 * all ajax functions) abort() method.
	 *
	 * Deprecated. Use $.ajaxSetup instead.
	 *
	 * @example $.ajaxTimeout( 5000 );
	 * @desc Make all AJAX requests timeout after 5 seconds.
	 *
	 * @name $.ajaxTimeout
	 * @type undefined
	 * @param Number time How long before an AJAX request times out.
	 * @cat AJAX
	 */
	ajaxTimeout: function(timeout) {
		jQuery.ajaxSettings.timeout = timeout;
	},
	
	/**
	 * Setup global settings for AJAX requests.
	 *
	 * See $.ajax for a description of all available options.
	 *
	 * @example $.ajaxSetup( {
	 *   url: "/xmlhttp/",
	 *   global: false,
	 *   type: "POST"
	 * } );
	 * @desc Sets the defaults for AJAX requests to the url "/xmlhttp/",
	 * disables global handlers and uses POST instead of GET
	 *
	 * @name $.ajaxSetup
	 * @type undefined
	 * @param Object settings Key/value pairs for ajax options
	 * @cat AJAX
	 */
	ajaxSetup: function(settings) {
		jQuery.extend(jQuery.ajaxSettings, settings);
	},

	ajaxSettings: {
		global: true,
		type: "GET",
		timeout: 0,
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true
	},
	
	// Last-Modified header cache for next request
	lastModified: {},

	/**
	 * Load a remote page using an HTTP request.
	 *
	 * This is jQuery's low-level AJAX implementation. See $.get, $.post etc. for
	 * higher-level abstractions.
	 *
	 * $.ajax() returns the XMLHttpRequest that it creates. In most cases you won't
	 * need that object to manipulate directly, but it is available if you need to
	 * abort the request manually.
	 *
	 * Note: Make sure the server sends the right mimetype (eg. xml as
	 * "text/xml"). Sending the wrong mimetype will get you into serious
	 * trouble that jQuery can't solve.
	 *
	 * Supported datatypes are (see dataType option):
	 *
	 * "xml": Returns a XML document that can be processed via jQuery.
	 *
	 * "html": Returns HTML as plain text, included script tags are evaluated.
	 *
	 * "script": Evaluates the response as Javascript and returns it as plain text.
	 *
	 * "json": Evaluates the response as JSON and returns a Javascript Object
	 *
	 * $.ajax() takes one argument, an object of key/value pairs, that are
	 * used to initalize and handle the request. These are all the key/values that can
	 * be used:
	 *
	 * (String) url - The URL to request.
	 *
	 * (String) type - The type of request to make ("POST" or "GET"), default is "GET".
	 *
	 * (String) dataType - The type of data that you're expecting back from
	 * the server. No default: If the server sends xml, the responseXML, otherwise
	 * the responseText is passed to the success callback.
	 *
	 * (Boolean) ifModified - Allow the request to be successful only if the
	 * response has changed since the last request. This is done by checking the
	 * Last-Modified header. Default value is false, ignoring the header.
	 *
	 * (Number) timeout - Local timeout to override global timeout, eg. to give a
	 * single request a longer timeout while all others timeout after 1 second.
	 * See $.ajaxTimeout() for global timeouts.
	 *
	 * (Boolean) global - Whether to trigger global AJAX event handlers for
	 * this request, default is true. Set to false to prevent that global handlers
	 * like ajaxStart or ajaxStop are triggered.
	 *
	 * (Function) error - A function to be called if the request fails. The
	 * function gets passed tree arguments: The XMLHttpRequest object, a
	 * string describing the type of error that occurred and an optional
	 * exception object, if one occured.
	 *
	 * (Function) success - A function to be called if the request succeeds. The
	 * function gets passed one argument: The data returned from the server,
	 * formatted according to the 'dataType' parameter.
	 *
	 * (Function) complete - A function to be called when the request finishes. The
	 * function gets passed two arguments: The XMLHttpRequest object and a
	 * string describing the type of success of the request.
	 *
 	 * (Object|String) data - Data to be sent to the server. Converted to a query
	 * string, if not already a string. Is appended to the url for GET-requests.
	 * See processData option to prevent this automatic processing.
	 *
	 * (String) contentType - When sending data to the server, use this content-type.
	 * Default is "application/x-www-form-urlencoded", which is fine for most cases.
	 *
	 * (Boolean) processData - By default, data passed in to the data option as an object
	 * other as string will be processed and transformed into a query string, fitting to
	 * the default content-type "application/x-www-form-urlencoded". If you want to send
	 * DOMDocuments, set this option to false.
	 *
	 * (Boolean) async - By default, all requests are send asynchronous (set to true).
	 * If you need synchronous requests, set this option to false.
	 *
	 * (Function) beforeSend - A pre-callback to set custom headers etc., the
	 * XMLHttpRequest is passed as the only argument.
	 *
	 * @example $.ajax({
	 *   type: "GET",
	 *   url: "test.js",
	 *   dataType: "script"
	 * })
	 * @desc Load and execute a JavaScript file.
	 *
	 * @example $.ajax({
	 *   type: "POST",
	 *   url: "some.php",
	 *   data: "name=John&location=Boston",
	 *   success: function(msg){
	 *     alert( "Data Saved: " + msg );
	 *   }
	 * });
	 * @desc Save some data to the server and notify the user once its complete.
	 *
	 * @example var html = $.ajax({
	 *  url: "some.php",
	 *  async: false
	 * }).responseText;
	 * @desc Loads data synchronously. Blocks the browser while the requests is active.
	 * It is better to block user interaction with others means when synchronization is
	 * necessary, instead to block the complete browser.
	 *
	 * @example var xmlDocument = [create xml document];
	 * $.ajax({
	 *   url: "page.php",
	 *   processData: false,
	 *   data: xmlDocument,
	 *   success: handleResponse
	 * });
	 * @desc Sends an xml document as data to the server. By setting the processData
	 * option to false, the automatic conversion of data to strings is prevented.
	 * 
	 * @name $.ajax
	 * @type XMLHttpRequest
	 * @param Hash prop A set of properties to initialize the request with.
	 * @cat AJAX
	 */
	ajax: function( s ) {
		// TODO introduce global settings, allowing the client to modify them for all requests, not only timeout
		s = jQuery.extend({}, jQuery.ajaxSettings, s);

		// if data available
		if ( s.data ) {
			// convert data if not already a string
			if (s.processData && typeof s.data != 'string')
    			s.data = jQuery.param(s.data);
			// append data to url for get requests
			if( s.type.toLowerCase() == "get" )
				// "?" + data or "&" + data (in case there are already params)
				s.url += ((s.url.indexOf("?") > -1) ? "&" : "?") + s.data;
		}

		// Watch for a new set of requests
		if ( s.global && ! jQuery.active++ )
			jQuery.event.trigger( "ajaxStart" );

		var requestDone = false;

		// Create the request object
		var xml = new XMLHttpRequest();

		// Open the socket
		xml.open(s.type, s.url, s.async);

		// Set the correct header, if data is being sent
		if ( s.data )
			xml.setRequestHeader("Content-Type", s.contentType);

		// Set the If-Modified-Since header, if ifModified mode.
		if ( s.ifModified )
			xml.setRequestHeader("If-Modified-Since",
				jQuery.lastModified[s.url] || "Thu, 01 Jan 1970 00:00:00 GMT" );

		// Set header so the called script knows that it's an XMLHttpRequest
		xml.setRequestHeader("X-Requested-With", "XMLHttpRequest");

		// Make sure the browser sends the right content length
		if ( xml.overrideMimeType )
			xml.setRequestHeader("Connection", "close");
			
		// Allow custom headers/mimetypes
		if( s.beforeSend )
			s.beforeSend(xml);
		if (s.global)
		    jQuery.event.trigger("ajaxSend", [xml, s]);

		// Wait for a response to come back
		var onreadystatechange = function(isTimeout){
			// The transfer is complete and the data is available, or the request timed out
			if ( xml && (xml.readyState == 4 || isTimeout == "timeout") ) {
				requestDone = true;
				var status;
				try {
					status = jQuery.httpSuccess( xml ) && isTimeout != "timeout" ?
						s.ifModified && jQuery.httpNotModified( xml, s.url ) ? "notmodified" : "success" : "error";
					// Make sure that the request was successful or notmodified
					if ( status != "error" ) {
						// Cache Last-Modified header, if ifModified mode.
						var modRes;
						try {
							modRes = xml.getResponseHeader("Last-Modified");
						} catch(e) {} // swallow exception thrown by FF if header is not available
	
						if ( s.ifModified && modRes )
							jQuery.lastModified[s.url] = modRes;
	
						// process the data (runs the xml through httpData regardless of callback)
						var data = jQuery.httpData( xml, s.dataType );
	
						// If a local callback was specified, fire it and pass it the data
						if ( s.success )
							s.success( data, status );
	
						// Fire the global callback
						if( s.global )
							jQuery.event.trigger( "ajaxSuccess", [xml, s] );
					} else {
						jQuery.handleError(s, xml, status);
					}
				} catch(e) {
					status = "error";
					jQuery.handleError(s, xml, status, e);
				}

				// The request was completed
				if( s.global )
					jQuery.event.trigger( "ajaxComplete", [xml, s] );

				// Handle the global AJAX counter
				if ( s.global && ! --jQuery.active )
					jQuery.event.trigger( "ajaxStop" );

				// Process result
				if ( s.complete ) s.complete(xml, status);

				// Stop memory leaks
				xml.onreadystatechange = function(){};
				xml = null;
			}
		};
		xml.onreadystatechange = onreadystatechange;

		// Timeout checker
		if(s.timeout > 0)
			setTimeout(function(){
				// Check to see if the request is still happening
				if(xml) {
					// Cancel the request
					xml.abort();

					if( !requestDone )
						onreadystatechange( "timeout" );
				}
			}, s.timeout);
			
		// save non-leaking reference 
		var xml2 = xml;

		// Send the data
		try {
			xml2.send(s.data);
		} catch(e) {
			jQuery.handleError(s, xml, null, e);
		}
		
		// firefox 1.5 doesn't fire statechange for sync requests
		if(!s.async)
			onreadystatechange();
		
		// return XMLHttpRequest to allow aborting the request etc.
		return xml2;
	},

	handleError: function(s, xml, status, e) {
		// If a local callback was specified, fire it
		if ( s.error ) s.error( xml, status, e );

		// Fire the global callback
		if( s.global )
			jQuery.event.trigger( "ajaxError", [xml, s, e] );
	},

	// Counter for holding the number of active queries
	active: 0,

	// Determines if an XMLHttpRequest was successful or not
	httpSuccess: function(r) {
		try {
			return !r.status && location.protocol == "file:" ||
				( r.status >= 200 && r.status < 300 ) || r.status == 304 ||
				jQuery.browser.safari && r.status == undefined;
		} catch(e){}
		return false;
	},

	// Determines if an XMLHttpRequest returns NotModified
	httpNotModified: function(xml, url) {
		try {
			var xmlRes = xml.getResponseHeader("Last-Modified");

			// Firefox always returns 200. check Last-Modified date
			return xml.status == 304 || xmlRes == jQuery.lastModified[url] ||
				jQuery.browser.safari && xml.status == undefined;
		} catch(e){}
		return false;
	},

	/* Get the data out of an XMLHttpRequest.
	 * Return parsed XML if content-type header is "xml" and type is "xml" or omitted,
	 * otherwise return plain text.
	 * (String) data - The type of data that you're expecting back,
	 * (e.g. "xml", "html", "script")
	 */
	httpData: function(r,type) {
		var ct = r.getResponseHeader("content-type");
		var data = !type && ct && ct.indexOf("xml") >= 0;
		data = type == "xml" || data ? r.responseXML : r.responseText;

		// If the type is "script", eval it in global context
		if ( type == "script" ) {
			jQuery.globalEval( data );
		}

		// Get the JavaScript object, if JSON is used.
		if ( type == "json" ) eval( "data = " + data );

		// evaluate scripts within html
		if ( type == "html" ) jQuery("<div>").html(data).evalScripts();

		return data;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function(a) {
		var s = [];

		// If an array was passed in, assume that it is an array
		// of form elements
		if ( a.constructor == Array || a.jquery ) {
			// Serialize the form elements
			for ( var i = 0; i < a.length; i++ )
				s.push( a[i].name + "=" + encodeURIComponent( a[i].value ) );

		// Otherwise, assume that it's an object of key/value pairs
		} else {
			// Serialize the key/values
			for ( var j in a ) {
				// If the value is an array then the key names need to be repeated
				if( a[j].constructor == Array ) {
					for (var k = 0; k < a[j].length; k++) {
						s.push( j + "=" + encodeURIComponent( a[j][k] ) );
					}
				} else {
					s.push( j + "=" + encodeURIComponent( a[j] ) );
				}
			}
		}

		// Return the resulting serialization
		return s.join("&");
	},
	
	// evalulates a script in global context
	// not reliable for safari
	globalEval: function(data) {
		if (window.execScript)
			window.execScript( data );
		else if(jQuery.browser.safari)
			// safari doesn't provide a synchronous global eval
			window.setTimeout( data, 0 );
		else
			eval.call( window, data );
	}

});
