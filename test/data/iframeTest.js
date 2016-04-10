// Just used in iframed html tests which jshint doesn't see
// jshint unused: false
function startIframeTest() {
	var args = Array.prototype.slice.call( arguments );

	args.unshift( window.jQuery, window, document );
	window.parent.iframeCallback.apply( null, args );
}
// jshint unused: true
