define([
	"../var/support"
], function( jQuery, support ) {
	// window.document is used here as it's before the sandboxed document
	support.createHTMLDocument = !!window.document.implementation.createHTMLDocument;
});
