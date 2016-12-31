
window.startIframeTest = function() {
	var args = Array.prototype.slice.call( arguments );

	// Note: jQuery may be undefined if page did not load it
	args.unshift( window.jQuery, window, document );
	window.parent.iframeCallback.apply( null, args );
};
