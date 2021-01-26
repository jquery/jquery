import jQuery from "../core.js";
import document from "../var/document.js";

import "../ajax.js";

function canUseScriptTag( s ) {

	// A script tag can only be used for async, cross domain or forced-by-attrs requests.
	// Sync requests remain handled differently to preserve strict script ordering.
	return s.crossDomain || s.scriptAttrs ||

		// When dealing with JSONP (`s.dataTypes` include "json" then)
		// don't use a script tag so that error responses still may have
		// `responseJSON` set. Continue using a script tag for JSONP requests that:
		//   * are cross-domain as AJAX requests won't work without a CORS setup
		//   * have `scriptAttrs` set as that's a script-only functionality
		// Note that this means JSONP requests violate strict CSP script-src settings.
		// A proper solution is to migrate from using JSONP to a CORS setup.
		( s.async && jQuery.inArray( "json", s.dataTypes ) < 0 );
}

// Install script dataType. Don't specify `content.script` so that an explicit
// `dataType: "script"` is required (see gh-2432, gh-4822)
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}

	// These types of requests are handled via a script tag
	// so force their methods to GET.
	if ( canUseScriptTag( s ) ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {
	if ( canUseScriptTag( s ) ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );
