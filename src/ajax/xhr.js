(function( jQuery ) {

var // Next fake timer id
	xhrPollingId = jQuery.now(),

	// Callbacks hashtable
	xhrs = {},

	// XHR pool
	xhrPool = [],

	// #5280: see end of file
	xhrUnloadAbortMarker = [];


jQuery.ajax.transport( function( s , determineDataType ) {

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( ! s.crossDomain || jQuery.support.cors ) {

		var callback;

		return {

			send: function(headers, complete) {

				var xhr = xhrPool.pop() || s.xhr(),
					handle;

				// Open the socket
				// Passing null username, generates a login popup on Opera (#2865)
				if ( s.username ) {
					xhr.open(s.type, s.url, s.async, s.username, s.password);
				} else {
					xhr.open(s.type, s.url, s.async);
				}

				// Requested-With header
				// Not set for crossDomain requests with no content
				// (see why at http://trac.dojotoolkit.org/ticket/9486)
				// Won't change header if already provided in beforeSend
				if ( ! ( s.crossDomain && ! s.hasContent ) && ! headers["x-requested-with"] ) {
					headers["x-requested-with"] = "XMLHttpRequest";
				}

				// Need an extra try/catch for cross domain requests in Firefox 3
				try {

					jQuery.each(headers, function(key,value) {
						xhr.setRequestHeader(key,value);
					});

				} catch(_) {}

				// Do send the request
				try {
					xhr.send( ( s.hasContent && s.data ) || null );
				} catch(e) {
					// Store back in pool
					xhrPool.push( xhr );
					complete(0, "error", "" + e);
					return;
				}

				// Listener
				callback = function ( abortStatusText ) {

					// Was never called and is aborted or complete
					if ( callback && ( abortStatusText || xhr.readyState === 4 ) ) {

						// Do not listen anymore
						// and Store back in pool
						if (handle) {
							xhr.onreadystatechange = jQuery.noop;
							delete xhrs[ handle ];
							handle = undefined;
							xhrPool.push( xhr );
						}

						callback = 0;

						// Get info
						var status, statusText, response, responseHeaders;

						if ( abortStatusText ) {

							if ( xhr.readyState !== 4 ) {
								xhr.abort();
							}

							// Stop here if unloadAbort
							if ( abortStatusText === xhrUnloadAbortMarker ) {
								return;
							}

							status = 0;
							statusText = abortStatusText;

						} else {

							status = xhr.status;

							try { // Firefox throws an exception when accessing statusText for faulty cross-domain requests

								statusText = xhr.statusText;

							} catch( e ) {

								statusText = ""; // We normalize with Webkit giving an empty statusText

							}

							responseHeaders = xhr.getAllResponseHeaders();

							// Filter status for non standard behaviours
							// (so many they seem to be the actual "standard")
							status =
								// Opera returns 0 when it should be 304
								// Webkit returns 0 for failing cross-domain no matter the real status
								status === 0 ?
									(
										! s.crossDomain || statusText ? // Webkit, Firefox: filter out faulty cross-domain requests
										(
											responseHeaders ? // Opera: filter out real aborts #6060
											304
											:
											0
										)
										:
										302 // We assume 302 but could be anything cross-domain related
									)
									:
									(
										status == 1223 ?	// IE sometimes returns 1223 when it should be 204 (see #1450)
											204
											:
											status
									);

							// Guess response & update dataType accordingly
							response =
								determineDataType(
									s,
									xhr.getResponseHeader("content-type"),
									xhr.responseText,
									xhr.responseXML );
						}

						// Call complete
						complete(status,statusText,response,responseHeaders);
					}
				};

				// if we're in sync mode
				// or it's in cache and has been retrieved directly (IE6 & IE7)
				// we need to manually fire the callback
				if ( ! s.async || xhr.readyState === 4 ) {

					callback();

				} else {

					// Listener is externalized to handle abort on unload
					handle = xhrPollingId++;
					xhrs[ handle ] = xhr;
					xhr.onreadystatechange = function() {
						callback();
					};
				}
			},

			abort: function(statusText) {
				if ( callback ) {
					callback(statusText);
				}
			}
		};
	}
});

// #5280: we need to abort on unload or IE will keep connections alive
jQuery(window).bind( "unload" , function() {

	// Abort all pending requests
	jQuery.each(xhrs, function(_, xhr) {
		if ( xhr.onreadystatechange ) {
			xhr.onreadystatechange( xhrUnloadAbortMarker );
		}
	});

	// Resest polling structure to be safe
	xhrs = {};

});

})( jQuery );
