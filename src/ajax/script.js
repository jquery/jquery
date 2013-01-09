// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var callback;
		return {
			send: function( _, complete ) {
				callback = function( type ) {
					return function() {
						callback = script.onload = script.onerror = null;
						jQuery( script ).remove();
						if ( type ) {
							complete( type === "success" ? 200 : 404, type );
						}
					};
				};
				var script = jQuery.extend( document.createElement("script"), {
						async: true,
						charset: s.scriptCharset,
						src: s.url,
						onload: callback("success"),
						onerror: callback("error")
					});
				callback = callback();
				document.head.appendChild( script );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});
