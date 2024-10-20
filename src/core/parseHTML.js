import { jQuery } from "../core.js";
import { rsingleTag } from "./var/rsingleTag.js";
import { buildFragment } from "../manipulation/buildFragment.js";
import { isObviousHtml } from "./isObviousHtml.js";

// Argument "data" should be string of html or a TrustedHTML wrapper of obvious HTML
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" && !isObviousHtml( data + "" ) ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using DOMParser
		context = ( new window.DOMParser() )
			.parseFromString( "", "text/html" );
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};
