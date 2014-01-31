define([
	"../core",
	"./var/rsingleTag",
	"../manipulation" // buildFragment
], function( jQuery, rsingleTag ) {

// data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [],
		// document.implementation stops scripts or inline event handlers from being executed immediately
		/* jshint laxbreak: true */
		defaultContext = jQuery.isFunction( document.implementation.createHTMLDocument )
			? document.implementation.createHTMLDocument()
			: document;
		/* jshint laxbreak: false */

	context = context || defaultContext;

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[1] ) ];
	}

	parsed = jQuery.buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};

return jQuery.parseHTML;

});
