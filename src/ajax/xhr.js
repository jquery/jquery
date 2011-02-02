(function( jQuery ) {

var // Next active xhr id
	xhrId = jQuery.now(),

	// active xhrs
	xhrs = {},

	// #5280: see below
	xhrUnloadAbortInstalled,

	// XHR used to determine supports properties
	testXHR;

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		if ( window.location.protocol !== "file:" ) {
			try {
				return new window.XMLHttpRequest();
			} catch( xhrError ) {}
		}

		try {
			return new window.ActiveXObject("Microsoft.XMLHTTP");
		} catch( activeError ) {}
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	function() {
		return new window.XMLHttpRequest();
	};

// Test if we can create an xhr object
try {
	testXHR = jQuery.ajaxSettings.xhr();
} catch( xhrCreationException ) {}

//Does this browser support XHR requests?
jQuery.support.ajax = !!testXHR;

// Does this browser support crossDomain XHR requests
jQuery.support.cors = testXHR && ( "withCredentials" in testXHR );

// No need for the temporary xhr anymore
testXHR = undefined;

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// #5280: we need to abort on unload or IE will keep connections alive
					if ( !xhrUnloadAbortInstalled ) {

						xhrUnloadAbortInstalled = 1;

						jQuery(window).bind( "unload", function() {

							// Abort all pending requests
							jQuery.each( xhrs, function( _, xhr ) {
								if ( xhr.onreadystatechange ) {
									xhr.onreadystatechange( 1 );
								}
							} );

						} );
					}

					// Get a new xhr
					var xhr = s.xhr(),
						handle;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Requested-With header
					// Not set for crossDomain requests with no content
					// (see why at http://trac.dojotoolkit.org/ticket/9486)
					// Won't change header if already provided
					if ( !( s.crossDomain && !s.hasContent ) && !headers["x-requested-with"] ) {
						headers[ "x-requested-with" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						jQuery.each( headers, function( key, value ) {
							xhr.setRequestHeader( key, value );
						} );
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									delete xhrs[ handle ];
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									// Get info
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors
									status =
										// Most browsers return 0 when it should be 200 for local files
										// Opera returns 0 when it should be 304
										// Webkit returns 0 for failing cross-domain no matter the real status
										!status ?
											// All: for local files, 0 is a success
											( location.protocol === "file:" ? 200 : (
												// Webkit, Firefox: filter out faulty cross-domain requests
												!s.crossDomain || statusText ?
												(
													// Opera: filter out real aborts #6060
													responseHeaders ?
													304 :
													0
												) :
												// We assume 302 but could be anything cross-domain related
												302
											) ) :
											(
												// IE sometimes returns 1223 when it should be 204 (see #1450)
												status == 1223 ?
													204 :
													status
											);
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						// Add to list of active xhrs
						handle = xhrId++;
						xhrs[ handle ] = xhr;
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}

})( jQuery );
