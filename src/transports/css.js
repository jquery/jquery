// Install text to css "converter"
jQuery.ajaxSettings.dataConverters["text => css"] = function ( text ) {
	
	var head = document.getElementsByTagName("head")[0] || document.documentElement,
		style = document.createElement("style");
		
	style.type='text/css';
	
	if ( style.styleSheet ) {
		// IE Style
		style.styleSheet.cssText = text;
	} else {
		// DOM compliant style
		style.appendChild( document.createTextNode(text) );
	}
	
	head.appendChild( style );
	
};

// Bind link tag hack transport
jQuery.ajax.bindTransport("css", function(s) {
	
	// Handle cache special case
	if ( s.cache === null ) {
		s.cache = true;
	}
	
	// This transport only deals with cross domain get requests
	if ( s.crossDomain && s.async && ( s.type == "GET" || ! s.data ) ) {
			
		s.global = false;
		
		var done;
		
		return {
			
			send: function(_, callback) {
				var head = document.getElementsByTagName("head")[0] || document.documentElement;
	
				link = document.createElement("link");
				link.rel = "Stylesheet";
				link.type = "text/css";
				link.href = s.url;
				
				if ( s.scriptCharset ) {
					link.charset = s.scriptCharset;
				}
				
				// Poll the link
				link.title = cssPoll({
					
					callback: done = function(statusText) {

						done = undefined;
						
						cssUnpoll( link.title );
						
						// Callback
						callback(statusText ? 0 : 200, statusText || "success");
						
					},
					
					link: link
					
				});
				
				head.appendChild( link );
			},
			
			abort: function(statusText) {
				if ( done ) {
					done( statusText );
				}
			}
		};
	}
});

// Detected link onload is a nightmare to say the least
// We will poll stylesheets regularly to check they have been loaded
var
	// Next css id
	cssPollingId = now(),
	
	// Number of css being polled
	cssPollingNb = 0,
	
	// Polled css
	cssObjects = {},
	
	// Main poller function
	cssGlobalPoller = function ( isUnloadAbort ) {
		if ( ! isUnloadAbort ) {
			
			var object,
				callback,
				stylesheet,
				stylesheets = document.styleSheets,
				title,
				i,
				length,
				readyState;
				
			if ( stylesheets ) { // Safeguard for IE

				for ( i = 0, length = stylesheets.length; i < length; i++ ) {
					
					if ( ( stylesheet = stylesheets[i] ) // Safeguard for IE
						&& ( title = stylesheet.title )
						&& ( object = cssObjects[title] ) ) {
							
						callback = object.callback;

						// IE:
						// links have a readyState property
						readyState = object.link.readyState;
						if ( readyState !== undefined) {
							if ( readyState=="loaded" || readyState=="complete" ) {
								callback();
							}
						} else {
							try {
								stylesheet.cssRules;
								// Webkit:
								// Webkit browsers don't create the stylesheet object
								// before the link has been loaded.
								// When requesting rules for crossDomain links
								// they simply return nothing (no exception thrown)
								callback();
							} catch(e) {
								// Gecko:
								// The engine throws NS_ERROR_DOM_* exceptions
								if ( /NS_ERROR_DOM/.test(e) ) {
									// Once the link has been loaded,
									// a more specific NS_ERROR_DOM_SECURITY_ERR is thrown
									if ( /NS_ERROR_DOM_SECURITY_ERR/.test(e) ) {
										callback();
									}
								} else {
									try {
										// Opera:
										// If the link hasn't been loaded yet, deleteRule is ignored
										// Once loaded, it throws an exception
										stylesheet.deleteRule(0);
									} catch(_) { 
										callback();
									}
								}
							}
						}
					}
				}
			}
		}	
	},
	
	// Poll / Unpoll
	// We use the xhrPoller behind the curtain
	cssXhrPollerId,
	
	cssPoll = function ( callback ) {
		
		var title = "-jqueryremotecss-" + cssPollingId++;
		
		cssObjects[title] = callback;
		
		if ( ! cssPollingNb++ ) {
			
			cssXhrPollerId = xhrPoll( cssGlobalPoller );
			
		}
		
		return title;
		
	},
	cssUnpoll = function ( title ) {
		
		delete cssObjects[title];
		
		if ( ! --cssPollingNb ) {
			
			xhrUnpoll( cssXhrPollerId );
			
		}
		
	};
	
