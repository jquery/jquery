import jQuery from "../core.js";

import "../ajax.js";

jQuery.ajaxPrefilter( function( s ) {

	// Binary data needs to be passed to XHR as-is without stringification.
	if ( typeof s.data !== "string" && !jQuery.isPlainObject( s.data ) ) {
		s.processData = false;
	}

	// `Content-Type` for requests with `FormData` bodies needs to be set
	// by the browser as it needs to append the `boundary` it generated.
	if ( s.data instanceof window.FormData ) {
		s.contentType = false;
	}
} );
