define(function() {
	// All support tests are defined in their respective modules.
	return {
		createHTMLDocument: jQuery.isFunction( document.implementation.createHTMLDocument )
	};
});
