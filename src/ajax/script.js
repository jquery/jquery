(function( jQuery ) {

// Install script dataType
jQuery.ajaxSetup({

	accepts: {
		script: "text/javascript, application/javascript"
	},

	contents: {
		script: /javascript/
	},

	converters: {
		"text script": jQuery.globalEval
	}

// Handle cache's special case and global
}).ajaxPrefilter("script", function(s) {

	if ( s.cache === undefined ) {
		s.cache = false;
	}

	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}

// Bind script tag hack transport
}).ajaxTransport("script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.getElementsByTagName("head")[0] || document.documentElement;

		return {

			send: function(_, callback) {

				script = document.createElement("script");

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _ , isAbort ) {

					if ( ! script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = 0;

						// Callback if not abort
						if ( ! isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload(0,1);
				}
			}
		};
	}
});

})( jQuery );
