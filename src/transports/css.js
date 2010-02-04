// Install css dataType
jQuery.extend( true, jQuery.ajaxSettings , {
	
	accepts: {
		css: "text/css"
	},
	
	autoDataType: {
		css: /css/
	},
		
	dataConverters: {
		
		"text => css": function ( text ) {
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
			
		}
	}
	
} );

// Bind link tag hack transport
jQuery.xhr.bindTransport("css", function(s) {
	
	// Handle cache special case
	if ( s.cache === null ) {
		s.cache = true;
	}
	
	// This transport only deals with cross domain get requests
	if ( s.crossDomain && s.async && ( s.type === "GET" || ! s.data ) ) {
			
		s.global = false;
		
		var done;
		
		return {
			
			send: function(_, callback) {
				var head = document.getElementsByTagName("head")[0] || document.documentElement;
	
				link = document.createElement("link");
				link.rel = "stylesheet";
				link.type = "text/css";
				link.href = s.url;
				
				if ( s.scriptCharset ) {
					link.charset = s.scriptCharset;
				}
				
				// Poll the link
				cssPoll( link , done = function(statusText) {

					done = undefined;
					
					cssUnpoll( link );
					
					// To abort properly we need to 
					// remove the stylesheet
					if ( statusText ) {
						head.removeChild( link );
					}
					
					callback(statusText ? 0 : 200, statusText || "success");
					
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

var	// Next css id
	cssPollingId = now(),
	
	// Number of css being polled
	cssPollingNb = 0,
	
	// Polled css callbacks
	cssCallbacks = {},
	
	// Main poller function
	cssGlobalPoller = function () {
		
		var callback,
			stylesheet,
			stylesheets = document.styleSheets,
			title,
			i,
			length,
			readyState;
			
		for ( i = 0, length = stylesheets.length; i < length; i++ ) {
			
			stylesheet = stylesheets[i];
			
			if ( ( title = stylesheet.title )
				&& ( callback = cssCallbacks[title] ) ) {
					
				try {
					// Assign to an object so that minifiers
					// do not remove the statement
					cssCallbacks._ = stylesheet.cssRules;
					
					// Webkit:
					// Webkit browsers don't create the stylesheet object
					// before the link has been loaded.
					// When requesting rules for crossDomain links
					// they simply return nothing (no exception thrown)
					
					callback();
					
				} catch(e) {
					// Gecko:
					// The engine throws NS_ERROR_DOM_* exceptions
					// Then a more explicit NS_ERROR_DOM_SECURITY when stylesheet is loaded
					if ( /SECURITY/.test(e) ) {
						callback();
					}
				}
			}
		}
	},
	
	// Poll / Unpoll
	cssTimer,
	cssPoll = function ( link , callback ) {
		
		// If onload is available, use it
		if ( link.onload === null
			// Safeguard for Webkit:
			//  IE & Opera both provide "all", Webkit browsers don't
			//  Dodgy, but ask webkit developpers why they have onload defined
			//  if & when they don't actually use it
			// TODO: find a better feature detection technique
			&& link.all !== undefined ) {
			
			link.onload = function() {
				callback();
			}
			
		// In any other browser, we poll
		} else {
			
			var title = link.title = "--jqcss-" + cssPollingId++;
			
			cssCallbacks[title] = callback;
			
			if ( ! cssPollingNb++ ) {
				cssTimer = setInterval( cssGlobalPoller , 13 );
			}
			
		}
		
	},
	cssUnpoll = function ( link ) {
		
		link.onload = null;

		var title = link.title;
		
		if ( title ) {
			
			delete link.title;
		
			delete cssCallbacks[title];
			
			if ( ! --cssPollingNb ) {
				clearInterval( cssTimer );
			}
			
		}
		
	};

